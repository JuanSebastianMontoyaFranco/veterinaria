const express = require('express');
const { body, param } = require('express-validator');

const petController = require('../controllers/petController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const petBodyValidators = [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('photo').optional().isURL().withMessage('Photo must be a valid URL'),
  body('adoptionStatus')
    .optional()
    .isIn(['owned', 'adoption'])
    .withMessage('Adoption status must be "owned" or "adoption"'),
  body('OwnerId')
    .optional({ checkFalsy: true })
    .isInt({ gt: 0 })
    .withMessage('OwnerId must be a positive integer')
];

router.post(
  '/create',
  protect,
  authorize('manage-pets'),
  petBodyValidators,
  validateRequest,
  petController.createPet
);

router.get(
  '/list',
  protect,
  authorize('view-pets'),
  petController.getAllPets
);

router.get(
  '/list/:id',
  protect,
  authorize('view-pets'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  petController.getPetById
);

router.put(
  '/update/:id',
  protect,
  authorize('manage-pets'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer'),
    ...petBodyValidators
  ],
  validateRequest,
  petController.updatePet
);

router.delete(
  '/delete/:id',
  protect,
  authorize('manage-pets'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Id must be a positive integer')
  ],
  validateRequest,
  petController.deletePet
);

module.exports = router;
