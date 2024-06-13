const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { authRoute } = require('./Routes/auth');
const { userRouter } = require('./Routes/user');
const { doctorRoute } = require('./Routes/doctor');
const { reviewRoute } = require('./Routes/review');
const { bookingRoute } = require('./Routes/booking');
const { userContact } = require('./Routes/contact');

const app = express();
app.use(express.json());
app.use(cors());
const allowedOrigins = [
  'https://doctor-booking-app-jv.netlify.app',
  // Add more origins if necessary
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowed origins list
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you need to send cookies or authorization headers
};

// Use the CORS middleware
app.use(cors(corsOptions));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/user/contact', userContact);

const PORT = 3000 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MONGO DB Connected'))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log('server started at PORT : ' + PORT);
});
