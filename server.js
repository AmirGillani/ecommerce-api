
const path = require("path");

const mongoose = require("mongoose");

const cloudinary= require("cloudinary");

const express = require("express");

const cors = require("cors");

const bodyParser = require("body-parser");

const fileUpload= require("express-fileupload");

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
  origin: 'https://ecommerce-frontend-pi-one.vercel.app',
  credentials: true, // Allows cookies to be sent cross-origin
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

//FOR PRODUCTION NODE_ENV VARIABLE WILL HAVE PRODUCTION VALUE BUT AT DEPLOYMENT WE 
//WILL GIVE IT VALUE OF DELOYED OR SOMETHING ELSE

if (process.env.NODE_ENV !== "PRODUCTION") {
require("dotenv").config({
  path: path.resolve(__dirname, "./configuration/.env"),
});
}

//UNCAUGHT ERROR HANDLER

process.on("uncaughtException", (err)=>{
  console.log(`uncaught err ${err.message}`);
  process.exit(1);
});

cloudinary.v2.config({ 
  cloud_name: 'dhh9j0ion', 
  api_key: '488515883499643', 
  api_secret: 'yLs10KBBnvph_RhhRkE7tY8oymk' 
});

// IF WE WANT TO WRITE CONNECTION IN MODULE THEN USE THIS

// const connection = require("./configuration/connection");

// connection();

mongoose
    .connect(process.env.CONNECTION_STRING)
    .then((data) => {
      console.log(`server is running ${data.connection.host}`);
      app.listen(process.env.PORT, () => {
        console.log(`server is running on port number ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });

    //UNCAUGHT ERROR HANDLER

process.on("unhandledRejection", (err)=>{
  console.log(`unhandled promise rejection ${err.message}`);
  process.exit(1);
});


