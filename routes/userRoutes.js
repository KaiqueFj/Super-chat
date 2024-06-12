const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.loginUser);
router.get('/overview', authController.logout);

// protect all routes after this middleware
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

module.exports = router;
