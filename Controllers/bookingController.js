const doctorModel = require('../Models/DoctorSchema');
const userModel = require('../Models/UserSchema');
const bookingModel = require('../Models/BookingSchema');
const Stripe = require('stripe');

const getCheckOutSession = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.doctorId);
    const user = await userModel.findById(req.userId);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // new booking

    const booking = new bookingModel({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });

    await booking.save();

    res
      .status(200)
      .json({ success: true, message: 'successfully paid', session });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error creating checkout session' });
    console.log(err);
  }
};

module.exports = getCheckOutSession;
