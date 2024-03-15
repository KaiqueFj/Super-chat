const express = require('express');
const viewController = require('../Controllers/viewController');

const router = express.Router();

router.get('/', viewController.getSignUpPageUser);
router.get('/overview', viewController.getChatPage);

module.exports = router;
