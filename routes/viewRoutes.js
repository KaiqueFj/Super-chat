const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const router = express.Router();

router.get('/', viewController.getSignUpPageUser);
router.get('/login', viewController.getLogInPageUser);

router.get(
  '/overview',
  authController.protect,
  authController.isLoggedIn,
  userController.getMe,
  viewController.getChatPage
);

module.exports = router;
