const { Appointment } = require('../models');

exports.createAppointment = async (req, res) => {
    try {
        const { date, reason, notes, PetId } = req.body;
        const newAppointment = await Appointment.create({ date, reason, notes, PetId });
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
