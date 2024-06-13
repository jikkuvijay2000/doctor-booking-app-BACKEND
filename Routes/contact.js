const express = require('express');
const { getMessage } = require('../Controllers/userController');

const router = express.Router();

router.post('/message', getMessage);

module.exports = { userContact: router };
