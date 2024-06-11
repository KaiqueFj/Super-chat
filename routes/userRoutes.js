const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.loginUser);

router.get('/overview', authController.logout);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
