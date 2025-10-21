const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware.protect, ownerController.createOwner);
router.get('/list', authMiddleware.protect, ownerController.getAllOwners);

module.exports = router;
