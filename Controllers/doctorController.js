const bookingModel = require('../Models/BookingSchema');
const doctorModel = require('../Models/DoctorSchema');

const updateDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await doctorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: 'successfully updated',
      data: updated,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'successfully deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await doctorModel
      .findById(id)
      .populate('reviews')
      .select('-password');

    res
      .status(200)
      .json({ success: true, message: 'User Found', data: doctor });
  } catch (err) {
    res.status(404).json(err);
    console.log(err);
  }
};

const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await doctorModel
        .find({
          isApproved: 'approved',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { specialization: { $regex: query, $options: 'i' } },
          ],
        })
        .select('-password');
    } else {
      doctors = await doctorModel
        .find({ isApproved: 'approved' })
        .select('-password');
    }
    res
      .status(200)
      .json({ success: true, message: 'All Users found', data: doctors });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'Doctor not found' });
    }

    const { password, ...rest } = doctor._doc;
    const appointments = await bookingModel.find({ doctor: doctorId });
    res.status(200).json({
      success: true,
      message: 'Profile info is fetching!',
      data: { ...rest, appointments },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong!' });
  }
};

module.exports = {
  updateDoctor,
  deleteDoctor,
  getSingleDoctor,
  getAllDoctor,
  getDoctorProfile,
};
