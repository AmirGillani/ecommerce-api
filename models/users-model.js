const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    maxLength: [20, "name can not exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already exits"],
    validate: [validator.isEmail, "enter valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLegth: [3, "password can not be less than 3 characters"]
  },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// DECLARE A METHOD IN SCHEMA

userSchema.methods.getResetPassword = ()=>{

  // CREATE A RANDOM STRING USING CRYPTO (NODEJS BUILT IN MODULE)

  const resetToken = crypto.randomBytes(20).toString("hex");

  // HASH THAT TOKEN AND SAVE IN MODEL WHILE RUNNING MODEL

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // DECLARE EXPIRATION TIME
  
  this.resetPasswordExpire = Date.now() + 15 *60 *1000;

  return resetToken;
};

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;
