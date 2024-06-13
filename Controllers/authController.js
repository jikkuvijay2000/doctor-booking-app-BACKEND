const userModel = require('../Models/UserSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const doctorModel = require('../Models/DoctorSchema');

const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user;
    if (role === 'patient') {
      user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).json({ err: 'User already registered!' });
      }
    } else if (role === 'doctor') {
      user = await doctorModel.findOne({ email });
      if (user) {
        return res.status(400).json({ err: 'Doctor already registered!' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === 'patient') {
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
        photo,
        gender,
        role,
      });
      await user.save();
    }

    if (role === 'doctor') {
      const user = new doctorModel({
        name,
        email,
        password: hashedPassword,
        photo,
        gender,
        role,
      });
      await user.save();
    }

    res.status(200).json({ message: 'User successfully created!' });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;
    const patient = await userModel.findOne({ email });
    const doctor = await doctorModel.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(404).json({ err: 'Incorrect credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    const { role, appointments, ...rest } = user._doc;
    res.status(200).json({
      status: true,
      message: 'Successfully logged in',
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

module.exports = { register, login };
