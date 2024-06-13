const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  role: {
    type: String,
    enum: ['patient', 'admin'],
    default: 'patient',
  },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodType: { type: String },
  appointments: [{ type: mongoose.Types.ObjectId, ref: 'Appointment' }],
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
