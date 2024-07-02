const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const { loginSchema, registerSchema, validateRequest } = require('../middleware/validationMiddleware')

router.post('/register', validateRequest(registerSchema), authController.registerUser);
router.post('/login', validateRequest(loginSchema), authController.loginUser);

module.exports = router;
