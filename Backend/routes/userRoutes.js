const express = require('express');
const { body, param } = require('express-validator');

const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/create',
  protect,
  authorize('manage-users'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('roles')
      .optional()
      .custom((value) => typeof value === 'string' || Array.isArray(value))
      .withMessage('Roles must be a string or an array')
  ],
  validateRequest,
  userController.createUser
);

router.get(
  '/list',
  protect,
  authorize('manage-users'),
  userController.getAllUsers
);

router.get(
  '/list/:id',
  protect,
  authorize('manage-users'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  userController.getUserById
);

router.put(
  '/update/:id',
  protect,
  authorize('manage-users'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer'),
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().withMessage('A valid email is required'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('roles')
      .optional()
      .custom((value) => typeof value === 'string' || Array.isArray(value))
      .withMessage('Roles must be a string or an array')
  ],
  validateRequest,
  userController.updateUser
);

router.delete(
  '/delete/:id',
  protect,
  authorize('manage-users'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  userController.deleteUser
);

module.exports = router;
