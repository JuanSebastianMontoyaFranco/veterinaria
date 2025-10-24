const logger = require('../config/logger');
const { Owner, Pet, User } = require('../models');

exports.createOwner = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      logger.warn('Attempt to create owner without authenticated user context', { body: req.body });
      return res.status(401).json({ message: 'Not authorized' });
    }

    const newOwner = await Owner.create({ name, phone, address, UserId: userId });

    const hydratedOwner = await Owner.findByPk(newOwner.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    logger.info('Owner profile created', { ownerId: newOwner.id, userId });
    res.status(201).json(hydratedOwner);
  } catch (error) {
    logger.error('Failed to create owner', { error: error.message });
    next(error);
  }
};

exports.getAllOwners = async (req, res, next) => {
  try {
    const owners = await Owner.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Pet,
          as: 'pets'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    logger.info('Fetched owners', { count: owners.length });
    res.json(owners);
  } catch (error) {
    logger.error('Failed to fetch owners', { error: error.message });
    next(error);
  }
};

exports.getOwnerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Pet,
          as: 'pets'
        }
      ]
    });

    if (!owner) {
      logger.warn('Owner not found', { id });
      return res.status(404).json({ message: 'Owner not found' });
    }

    res.json(owner);
  } catch (error) {
    logger.error('Failed to fetch owner detail', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.updateOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    const owner = await Owner.findByPk(id);

    if (!owner) {
      logger.warn('Owner not found for update', { id });
      return res.status(404).json({ message: 'Owner not found' });
    }

    owner.name = name ?? owner.name;
    owner.phone = phone ?? owner.phone;
    owner.address = address ?? owner.address;

    await owner.save();

    const updatedOwner = await Owner.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Pet,
          as: 'pets'
        }
      ]
    });

    logger.info('Owner updated', { id });
    res.status(200).json(updatedOwner);
  } catch (error) {
    logger.error('Failed to update owner', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.deleteOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Owner.destroy({
      where: { id }
    });

    if (!deleted) {
      logger.warn('Owner not found for delete', { id });
      return res.status(404).json({ message: 'Owner not found' });
    }

    logger.info('Owner deleted', { id });
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete owner', { id: req.params.id, error: error.message });
    next(error);
  }
};
