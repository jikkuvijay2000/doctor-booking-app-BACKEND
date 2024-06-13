const mongoose = require('mongoose');
const doctorModel = require('./DoctorSchema');

const reviewSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Utility function to truncate rating to one decimal place
const truncateRating = (rating) => {
  return Math.floor(rating * 10) / 10;
};

reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  const stats = await this.aggregate([
    { $match: { doctor: doctorId } },
    {
      $group: {
        _id: '$doctor',
        numOfRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    // Truncate the average rating
    const truncatedAvgRating = truncateRating(stats[0].avgRating);

    await doctorModel.findByIdAndUpdate(doctorId, {
      totalRating: stats[0].numOfRating,
      averageRating: truncatedAvgRating,
    });
  } else {
    await doctorModel.findByIdAndUpdate(doctorId, {
      totalRating: 0,
      averageRating: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.doctor);
});

const reviewModel = mongoose.model('Review', reviewSchema);
module.exports = reviewModel;
