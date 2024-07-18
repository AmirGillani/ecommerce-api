const app = require("./app");

const path = require("path");

const mongoose = require("mongoose");

const cloudinary= require("cloudinary");

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

cloudinary.config({ 
  cloud_name: 'dj5ph1k2r', 
  api_key: '874228825552952', 
  api_secret: '-bVExvUKFfSF-nHfWp9F8iuQyqM' 
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


