const express = require('express');
const { body, param } = require('express-validator');

const ownerController = require('../controllers/ownerController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
  '/create',
  protect,
  authorize('manage-pets'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').trim().isLength({ min: 7 }).withMessage('Phone is required'),
    body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters')
  ],
  validateRequest,
  ownerController.createOwner
);

router.get(
  '/list',
  protect,
  authorize('view-pets'),
  ownerController.getAllOwners
);

router.get(
  '/list/:id',
  protect,
  authorize('view-pets'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  ownerController.getOwnerById
);

router.put(
  '/update/:id',
  protect,
  authorize('manage-pets'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer'),
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').optional().trim().isLength({ min: 7 }).withMessage('Phone must be at least 7 characters'),
    body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters')
  ],
  validateRequest,
  ownerController.updateOwner
);

router.delete(
  '/delete/:id',
  protect,
  authorize('manage-pets'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  ownerController.deleteOwner
);

module.exports = router;
