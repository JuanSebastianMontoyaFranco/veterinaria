const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes for pets
router.post('/', authMiddleware.protect, petController.createPet);
router.get('/', authMiddleware.protect, petController.getAllPets);
router.get('/:id', authMiddleware.protect, petController.getPetById);
router.put('/:id', authMiddleware.protect, petController.updatePet);
router.delete('/:id', authMiddleware.protect, petController.deletePet);

module.exports = router;
