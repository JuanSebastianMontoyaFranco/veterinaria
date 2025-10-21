const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware.protect, appointmentController.createAppointment);
router.get('/list', authMiddleware.protect, appointmentController.getAllAppointments);

module.exports = router;
