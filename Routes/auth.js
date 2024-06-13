const express = require('express');
const { register, login } = require('../Controllers/authController.js');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = { authRoute: router };
