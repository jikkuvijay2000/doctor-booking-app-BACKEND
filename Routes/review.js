const express = require('express');
const {
  getAllReview,
  createReview,
} = require('../Controllers/reviewController');
const { authenticate, restrict } = require('../Auth/verifyToken');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReview)
  .post(authenticate, restrict(['patient']), createReview);

module.exports = { reviewRoute: router };
