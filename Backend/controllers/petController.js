const logger = require('../config/logger');
const { Pet, Owner, Appointment } = require('../models');

exports.createPet = async (req, res, next) => {
  try {
    const {
      name,
      photo,
      adoptionStatus = 'adoption',
      breed,
      color,
      ageRange,
      feedingType,
      diseases,
      OwnerId = null
    } = req.body;

    if (OwnerId) {
      const owner = await Owner.findByPk(OwnerId);
      if (!owner) {
        logger.warn('Attempted to assign pet to non-existent owner', { OwnerId });
        return res.status(400).json({ message: 'Owner not found' });
      }
    }

    const pet = await Pet.create({
      name,
      photo,
      adoptionStatus,
      breed,
      color,
      ageRange,
      feedingType,
      diseases,
      OwnerId
    });

    const hydratedPet = await Pet.findByPk(pet.id, {
      include: [
        {
          model: Owner,
          as: 'owner'
        }
      ]
    });

    logger.info('Pet created', { petId: pet.id, ownerId: OwnerId });
    res.status(201).json(hydratedPet);
  } catch (error) {
    logger.error('Failed to create pet', { error: error.message });
    next(error);
  }
};

exports.getAllPets = async (req, res, next) => {
  try {
    const pets = await Pet.findAll({
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    logger.info('Fetched pets', { count: pets.length });
    res.status(200).json(pets);
  } catch (error) {
    logger.error('Failed to fetch pets', { error: error.message });
    next(error);
  }
};

exports.getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByPk(id, {
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'phone']
        },
        {
          model: Appointment,
          as: 'appointments'
        }
      ]
    });

    if (!pet) {
      logger.warn('Pet not found', { id });
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json(pet);
  } catch (error) {
    logger.error('Failed to fetch pet', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.updatePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const pet = await Pet.findByPk(id);

    if (!pet) {
      logger.warn('Pet not found for update', { id });
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'OwnerId')) {
      if (updates.OwnerId) {
        const owner = await Owner.findByPk(updates.OwnerId);
        if (!owner) {
          logger.warn('Attempted to reassign pet to non-existent owner', { id, ownerId: updates.OwnerId });
          return res.status(400).json({ message: 'Owner not found' });
        }
      }
      pet.OwnerId = updates.OwnerId;
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'OwnerId') {
        return;
      }
      if (value !== undefined) {
        pet[key] = value;
      }
    });

    await pet.save();

    const updatedPet = await Pet.findByPk(id, {
      include: [
        {
          model: Owner,
          as: 'owner',
          attributes: ['id', 'name', 'phone']
        },
        {
          model: Appointment,
          as: 'appointments'
        }
      ]
    });

    logger.info('Pet updated', { id });
    res.status(200).json(updatedPet);
  } catch (error) {
    logger.error('Failed to update pet', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Pet.destroy({
      where: { id }
    });

    if (!deleted) {
      logger.warn('Pet not found for delete', { id });
      return res.status(404).json({ message: 'Pet not found' });
    }

    logger.info('Pet deleted', { id });
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete pet', { id: req.params.id, error: error.message });
    next(error);
  }
};
