const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { registerSchema, loginSchema, refreshSchema } = require('../../validators/auth.validator');

router.post('/register', validate(registerSchema, 'body'), userController.registerUser);
router.post('/login', validate(loginSchema, 'body'), userController.loginUser);
router.post('/refresh', validate(refreshSchema, 'body'), userController.refreshToken);
router.post('/logout', authMiddleware, userController.logout);

module.exports = router;
