const express = require("express");

const path = require("path");

const cors = require("cors");

const bodyParser = require("body-parser");

const fileUpload = require("express-fileupload");

const productRoutes = require("./routes/productsRoutes");

const userRoutes= require("./routes/usersRoutes");

const orderRoutes = require("./routes/orderRoutes");

const paymentRoutes = require("./routes/paymentRoute")

const HttpsErrors = require("./models/https-errors");

const cookieParser = require("cookie-parser");


const app = express();

// INCLUDE THESE OPTIONS IF WE WANT TO SEND COOKIES TO FRONTEND

const corsOptions = {

  // SET ORIGION
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

// CALL API TO HANDLE RESPONCE GOING OUT TO REACT

app.use(cors(corsOptions));

// FOR JASON REQUESTS

app.use(express.json());

// FOR CREATING COOKIES

app.use(cookieParser());

// FOR FORM DATA

app.use(bodyParser.urlencoded({extended:true}));

// FOR GETTING FILES

app.use(fileUpload());

// ROUTES

app.use("/api/products/", productRoutes);

app.use("/api/users/", userRoutes);

app.use("/api/orders/", orderRoutes);

app.use("/api/payment/", paymentRoutes);

// CONNECT BACKEND SERVER TO FRONT END SERVER BY THESE TWO LINES OF CODE

// WRITE NPM RUN BUILD IN FRONT END TERMINAL FIRST BEFORE WRITING THESE TWO LINES

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// THIS WILL BE CALLED WHEN NO RESPONCE IS ACHIVED FROM ROUTE

app.use(() => {
  const error = new HttpsErrors("route not found !!", 404);
  throw error;
});

// CALL ERROR HANDLING MIDDLE WARE

app.use(function (error, req, res, next) {

  if(error.code == "1100")
  {
    res.status(401).json({message:"User already exists"});
  }
  
  // IF ANY ERROR OCCOURS THEN UNLINK THAT FILE FROM SERVER
  
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

module.exports = app;
