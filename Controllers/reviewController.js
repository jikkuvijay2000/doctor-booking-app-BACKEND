const doctorModel = require('../Models/DoctorSchema');
const reviewModel = require('../Models/ReviewSchema');

const getAllReview = async (req, res) => {
  try {
    const reviews = await reviewModel.find({}).populate('user', 'name photo');

    res
      .status(200)
      .json({ success: true, message: 'Successful', data: reviews });
  } catch (err) {
    res.status(404).json({ success: false, message: 'Not Found!' });
    console.log(res);
  }
};

const createReview = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.userId;

  const newReview = new reviewModel(req.body);
  try {
    const savedReview = await newReview.save();
    await doctorModel.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });
    res
      .status(200)
      .json({ success: true, message: 'Review Submitted', data: savedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.log(res);
  }
};

module.exports = { getAllReview, createReview };
