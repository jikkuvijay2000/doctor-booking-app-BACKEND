const express = require('express');
const {
  getSingleUser,
  getAllUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getMyAppointments,
} = require('../Controllers/userController');

const { authenticate, restrict } = require('../Auth/verifyToken');

const router = express.Router();

router.get('/:id', authenticate, restrict(['patient']), getSingleUser);
router.get('/', authenticate, restrict(['admin']), getAllUser);
router.put('/:id', authenticate, restrict(['patient']), updateUser);
router.delete('/:id', authenticate, restrict(['patient']), deleteUser);
router.get('/profile/me', authenticate, restrict(['patient']), getUserProfile);
router.get(
  '/appointments/my-appointments',
  authenticate,
  restrict(['patient']),
  getMyAppointments
);

module.exports = { userRouter: router };
