const jwt = require('jsonwebtoken');
const userModel = require('../Models/UserSchema');
const doctorModel = require('../Models/DoctorSchema');

const authenticate = async (req, res, next) => {
  // token from header
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: 'No token, authorization needed' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.role = decoded.role;

    console.log(`Authenticated user ID: ${req.userId}, role: ${req.role}`);
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is invalid' });
    console.log(err);
  }
};

const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;
  let user;

  const patient = await userModel.findById(userId);
  const doctor = await doctorModel.findById(userId);

  if (patient) {
    user = patient;
  } else if (doctor) {
    user = doctor;
  } else {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!roles.includes(user.role)) {
    return res
      .status(403)
      .json({ success: false, message: 'You are not authorized' }); // Use 403 for forbidden
  }

  console.log(`User role: ${user.role} is authorized`); // Add logging
  next();
};

module.exports = { authenticate, restrict };
