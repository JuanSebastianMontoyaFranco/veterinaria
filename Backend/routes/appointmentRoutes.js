const express = require('express');
const { body, param } = require('express-validator');

const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const appointmentValidators = [
  body('date').isISO8601().withMessage('A valid date is required'),
  body('reason').trim().isLength({ min: 3 }).withMessage('Reason must be at least 3 characters'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes must be under 1000 characters'),
  body('PetId')
    .optional({ checkFalsy: true })
    .isInt({ gt: 0 })
    .withMessage('PetId must be a positive integer')
];

router.post(
  '/create',
  protect,
  authorize('manage-appointments'),
  appointmentValidators,
  validateRequest,
  appointmentController.createAppointment
);

router.get(
  '/list',
  protect,
  authorize('view-appointments'),
  appointmentController.getAllAppointments
);

router.get(
  '/list/:id',
  protect,
  authorize('view-appointments'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  appointmentController.getAppointmentById
);

router.put(
  '/update/:id',
  protect,
  authorize('manage-appointments'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer'),
    ...appointmentValidators
  ],
  validateRequest,
  appointmentController.updateAppointment
);

router.delete(
  '/delete/:id',
  protect,
  authorize('manage-appointments'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  appointmentController.deleteAppointment
);

module.exports = router;
