const express = require('express');
const { authenticate } = require('./../Auth/verifyToken');
const getCheckOutSession = require('../Controllers/bookingController');

const router = express.Router();

router.post('/checkout-session/:doctorId', authenticate, getCheckOutSession);

module.exports = { bookingRoute: router };
