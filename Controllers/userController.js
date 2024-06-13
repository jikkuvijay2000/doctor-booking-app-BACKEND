const userModel = require('../Models/UserSchema');
const bookingModel = require('../Models/BookingSchema');
const doctorModel = require('../Models/DoctorSchema');
const { contactModel } = require('../Models/contactSchema');

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: 'successfully updated',
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'successfully deleted' });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);

    res.status(200).json({ success: true, message: 'User Found', data: user });
  } catch (err) {
    res.status(404).json(err);
    console.log(err);
  }
};

const getAllUser = async (req, res) => {
  try {
    const user = await userModel.find({}).select('-password');
    res
      .status(200)
      .json({ success: true, message: 'All Users found', data: user });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const { password, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      message: 'Profile info is fetching!',
      data: { ...rest },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong!' });
    console.log(err);
  }
};

const getMyAppointments = async (req, res) => {
  try {
    // retrieving appointments from a booking
    const bookings = await bookingModel.find({ user: req.userId });

    // Extracting the doctor ID
    const doctorIds = bookings.map((el) => el.doctor.id);

    // retrieve doctors usign the above extracted ID
    const doctors = await doctorModel
      .find({ _id: { $in: doctorIds } })
      .select('-password');
    res.status(200).json({
      success: true,
      message: 'Appointments are fetching',
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong!' });
    console.log(err);
  }
};

const getMessage = async (req, res) => {
  const { email, subject, message } = req.body;
  try {
    const response = new contactModel({
      email,
      subject,
      message,
    });
    const mess = await response.save();
    res.status(200).json(mess);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
    console.log(err);
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUser,
  getUserProfile,
  getMyAppointments,
  getMessage,
};
