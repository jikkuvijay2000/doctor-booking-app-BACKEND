const express = require('express');
const {
  getSingleDoctor,
  getAllDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorProfile,
} = require('../Controllers/doctorController');
const { authenticate, restrict } = require('../Auth/verifyToken');
const { reviewRoute } = require('./review');

const router = express.Router();

// nested route
router.use('/:doctorId/reviews', reviewRoute);
router.get('/:id', getSingleDoctor);
router.get('/', getAllDoctor);
router.put('/:id', authenticate, restrict(['doctor']), updateDoctor);
router.delete('/:id', authenticate, restrict(['doctor']), deleteDoctor);
router.get('/profile/me', authenticate, restrict(['doctor']), getDoctorProfile);

module.exports = { doctorRoute: router };
