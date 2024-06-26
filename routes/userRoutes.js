const express = require('express');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.loginUser);
router.get('/overview', authController.logout);

// protect all routes after this middleware
router.use(authController.protect);

router.patch(
  '/updateUser',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
  userController.getMe
);

router.patch(
  '/updateChat',
  authController.protect,
  userController.uploadUserWallpaper,
  userController.resizeUserWallpaper,
  userController.updateMe,
  userController.getMe
);

router.patch('/updatePassword', authController.updatePassword);

router.post('/addContact', userController.createContact);

module.exports = router;
