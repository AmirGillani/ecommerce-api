const path = require("path");

const mongoose = require("mongoose");

const express = require("express");

const cors = require("cors");

const bodyParser = require("body-parser");

const productRoutes = require("./routes/productsRoutes");

const userRoutes = require("./routes/usersRoutes");

const orderRoutes = require("./routes/orderRoutes");

const paymentRoutes = require("./routes/paymentRoute");

const HttpsErrors = require("./models/https-errors");

const cookieParser = require("cookie-parser");

const app = express();

// INCLUDE THESE OPTIONS IF WE WANT TO SEND COOKIES TO FRONTEND

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://ecommerce-frontend-pi-one.vercel.app" // Production frontend URL
      : "http://localhost:3000", // Local development frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Allow credentials (cookies) to be sent
};

// ITS FOR LOCAL HOST BECAUSE WHILE ACCESING SERVER
// BEFORE ACTUAL REQUEST SERVER REQUEST AS OPTION WE NEED TO ALLOW CORS FOR THESE REQUESTS TOO

app.options("*", cors(corsOptions)); // ✅ Add this line

// CALL API TO HANDLE RESPONCE GOING OUT TO REACT

app.use(cors(corsOptions));

// FOR JASON REQUESTS

app.use(express.json());

// FOR CREATING COOKIES

app.use(cookieParser());

// FOR FORM DATA

app.use(bodyParser.urlencoded({ extended: true }));

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

app.use((error, req, res, next) => {
  console.error("Multer or other error:", error);

  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Error deleting file:", err);
    });
  }

  if (res.headersSent) {
    return next(error);
  }

  // Safely fallback to 500 if status code is invalid
  const statusCode = typeof error.code === "number" ? error.code : 500;

  res.status(statusCode).json({
    message: error.message || "An unknown error occurred!",
  });
});


//FOR PRODUCTION NODE_ENV VARIABLE WILL HAVE PRODUCTION VALUE BUT AT DEPLOYMENT WE
//WILL GIVE IT VALUE OF DELOYED OR SOMETHING ELSE

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(__dirname, "./.env"),
  });
}

//UNCAUGHT ERROR HANDLER

process.on("uncaughtException", (err) => {
  console.log(`uncaught err ${err.message}`);
  process.exit(1);
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

process.on("unhandledRejection", (err) => {
  console.log(`unhandled promise rejection ${err.message}`);
  process.exit(1);
});
