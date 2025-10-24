const { Op } = require('sequelize');
const logger = require('../config/logger');
const { User, Role } = require('../models');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    logger.info('Fetched user list', { count: users.length });
    res.json(users);
  } catch (error) {
    logger.error('Failed to fetch users', { error: error.message });
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, roles = ['user'] } = req.body;

    logger.info('Creating user', { email, roles });

    const newUser = await User.create({ name, email, password });

    const roleNames = Array.isArray(roles) ? roles : [roles];
    const normalizedRoleNames = [...new Set(roleNames.map((role) => role.toLowerCase()))];

    const foundRoles = await Role.findAll({
      where: {
        name: {
          [Op.in]: normalizedRoleNames
        }
      }
    });

    if (!foundRoles.length) {
      const defaultRole = await Role.findOne({ where: { name: 'user' } });
      if (!defaultRole) {
        logger.error('Default role "user" not found when creating user', { email });
        return res.status(500).json({ message: 'No se encontro el rol por defecto del sistema' });
      }
      await newUser.setRoles([defaultRole]);
    } else {
      await newUser.setRoles(foundRoles);
    }

    const hydratedUser = await User.findByPk(newUser.id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    logger.info('User created', { userId: newUser.id, email: newUser.email });
    res.status(201).json(hydratedUser);
  } catch (error) {
    logger.error('Failed to create user', { email: req.body.email, error: error.message });
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      logger.warn('User not found', { id });
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Failed to fetch user by id', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, roles } = req.body;

    const user = await User.scope('withPassword').findByPk(id);

    if (!user) {
      logger.warn('User not found for update', { id });
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    if (roles) {
      const roleNames = Array.isArray(roles) ? roles : [roles];
      const normalizedRoleNames = [...new Set(roleNames.map((role) => role.toLowerCase()))];
      const foundRoles = await Role.findAll({
        where: {
          name: {
            [Op.in]: normalizedRoleNames
          }
        }
      });
      if (!foundRoles.length) {
        logger.warn('Attempted to update user with roles that do not exist', { id, roles });
        return res.status(400).json({ message: 'Specified roles not found' });
      }
      await user.setRoles(foundRoles);
    }

    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    logger.info('User updated', { id });
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error('Failed to update user', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({
      where: { id }
    });

    if (!deleted) {
      logger.warn('User not found for delete', { id });
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('User deleted', { id });
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete user', { id: req.params.id, error: error.message });
    next(error);
  }
};
