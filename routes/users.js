const express = require('express');
const { validateUserToken } = require('../util/authValidator');
const router = express.Router();
const userController = require('../controllers/controller.users');
const inputValidator = require('../util/inputValidator');


/** READ */
router.get('/me', validateUserToken, userController.getMe);

/** UPDATE */
router.put('/update/:_id', 
inputValidator.validate.updateProfile,
 inputValidator.validateResult, userController.updateProfile);

module.exports = router;
