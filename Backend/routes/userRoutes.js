const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/list', authMiddleware.protect, userController.getAllUsers);

module.exports = router;
