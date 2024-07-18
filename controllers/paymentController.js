const catchAsyncErrors = require("../middlewares/catch-async-errors");
const HttpsErrors = require("../models/https-errors");

const stripe = require("stripe")("sk_test_51OPMKWSAnW5c4IEfpVDM0IffgWbDp3NxkAeLnatj7ek1toal0CILAZVPEfiQ2mQhgzVefjxU2UFhJCvxPmEzZWse00soGjs61Q");

exports.processPayment = catchAsyncErrors(async (req, res, next) => {

  let myPayment;

  try{

     myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      description:"For testing purpose",
      metadata: {
        company: "Ecommerce",
      },
    });

  }catch(err){
      
    return next(new HttpsErrors(`${err}`,500))

  }


  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.API_PUBLISHABLE_KEY });
});
