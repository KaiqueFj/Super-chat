const express = require('express');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.loginUser);

router.get('/overview', authController.logout);

module.exports = router;
