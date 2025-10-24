const logger = require('../config/logger');
const { Appointment, Pet, Owner } = require('../models');

exports.createAppointment = async (req, res, next) => {
  try {
    const { date, reason, notes, PetId } = req.body;

    if (PetId) {
      const pet = await Pet.findByPk(PetId);
      if (!pet) {
        logger.warn('Attempted to schedule appointment for non-existent pet', { PetId });
        return res.status(400).json({ message: 'Pet not found' });
      }
    }

    const appointment = await Appointment.create({ date, reason, notes, PetId });

    const hydratedAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [
            {
              model: Owner,
              as: 'owner',
              attributes: ['id', 'name', 'phone']
            }
          ]
        }
      ]
    });

    logger.info('Appointment scheduled', { appointmentId: appointment.id, petId: PetId });
    res.status(201).json(hydratedAppointment);
  } catch (error) {
    logger.error('Failed to create appointment', { error: error.message });
    next(error);
  }
};

exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [
            {
              model: Owner,
              as: 'owner',
              attributes: ['id', 'name', 'phone']
            }
          ]
        }
      ],
      order: [['date', 'DESC']]
    });

    logger.info('Fetched appointments', { count: appointments.length });
    res.json(appointments);
  } catch (error) {
    logger.error('Failed to fetch appointments', { error: error.message });
    next(error);
  }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [
            {
              model: Owner,
              as: 'owner',
              attributes: ['id', 'name', 'phone']
            }
          ]
        }
      ]
    });

    if (!appointment) {
      logger.warn('Appointment not found', { id });
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    logger.error('Failed to fetch appointment detail', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      logger.warn('Appointment not found for update', { id });
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'PetId')) {
      if (updates.PetId) {
        const pet = await Pet.findByPk(updates.PetId);
        if (!pet) {
          logger.warn('Attempted to reassign appointment to non-existent pet', { id, petId: updates.PetId });
          return res.status(400).json({ message: 'Pet not found' });
        }
      }
      appointment.PetId = updates.PetId;
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'PetId') {
        return;
      }
      if (value !== undefined) {
        appointment[key] = value;
      }
    });

    await appointment.save();

    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [
            {
              model: Owner,
              as: 'owner',
              attributes: ['id', 'name', 'phone']
            }
          ]
        }
      ]
    });

    logger.info('Appointment updated', { id });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    logger.error('Failed to update appointment', { id: req.params.id, error: error.message });
    next(error);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.destroy({
      where: { id }
    });

    if (!deleted) {
      logger.warn('Appointment not found for delete', { id });
      return res.status(404).json({ message: 'Appointment not found' });
    }

    logger.info('Appointment deleted', { id });
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete appointment', { id: req.params.id, error: error.message });
    next(error);
  }
};
