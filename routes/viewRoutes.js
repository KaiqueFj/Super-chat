const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.get('/', viewController.getSignUpPageUser);
router.get('/login', viewController.getLogInPageUser);
router.get(
  '/overview',
  authController.protect,
  authController.isLoggedIn,
  viewController.getChatPage
);

module.exports = router;
