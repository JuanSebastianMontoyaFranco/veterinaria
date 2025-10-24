const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const logger = require('../config/logger');
const { User, Role } = require('../models');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, roles } = req.body;
    logger.info('User registration requested', { email, roles });

    const newUser = await User.create({ name, email, password });

    const roleNames = Array.isArray(roles)
      ? roles
      : roles
        ? [roles]
        : ['user'];

    const uniqueRoleNames = [...new Set(roleNames.map((roleName) => roleName.toLowerCase()))];

    const foundRoles = await Role.findAll({
      where: {
        name: {
          [Op.in]: uniqueRoleNames
        }
      }
    });

    if (!foundRoles.length) {
      const fallbackRole = await Role.findOne({ where: { name: 'user' } });
      if (!fallbackRole) {
        logger.error('Default role "user" not found during registration', { email });
        return res.status(500).json({ message: 'No se encontro el rol por defecto del sistema' });
      }
      await newUser.setRoles([fallbackRole]);
    } else {
      await newUser.setRoles(foundRoles);
    }

    logger.info('User registered successfully', { userId: newUser.id, email: newUser.email });
    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    logger.error('User registration failed', { email: req.body.email, error: error.message });
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt received', { email });

    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user || !(await user.validPassword(password))) {
      logger.warn('Login failed due to invalid credentials', { email });
      return res.status(401).json({ message: 'Las credenciales son incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    logger.info('User login successful', { userId: user.id, email: user.email });
    res.json({ token });
  } catch (error) {
    logger.error('Login process failed', { email: req.body.email, error: error.message });
    next(error);
  }
};
