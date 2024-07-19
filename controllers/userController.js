const userModel = require("../models/users-model");
const HttpError = require("../models/https-errors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const createToken = require("../utils/create-token");
const HttpsErrors = require("../models/https-errors");
const catchAsyncError = require("../middlewares/catch-async-errors");
const sendEmail = require("../utils/send-email");

module.exports.signup = async function (req, res, next) {

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await userModel.create({
      name,
      email,
      password: hash,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
  } catch (err) {
    return next(new HttpError(`Error occoured !! ${err}`, 1100));
  }

  createToken(user, 201, res);
};

module.exports.login = catchAsyncError(async function (req, res, next) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new HttpError(`No user found !!`, 404));
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return next(new HttpError(`Invalid Cridentials !!`, 401));
  }

  createToken(user, 200, res);
});

module.exports.logout = function (req, res, next) {
  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()), httponly: true })
    .json({ success: true, message: "successfull logout!!" });
};

module.exports.forgetPassword = catchAsyncError(async function (
  req,
  res,
  next
) {
  let user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new HttpsErrors("User not found !!", 404));
  }

  // CREATE RANDOM STRING

  const resetToken = crypto.randomBytes(20).toString("hex");

  // HASH THAT TOKEN AND SAVE IN MODEL WHILE RUNNING MODEL

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // DECLARE EXPIRATION TIME

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetPasswordURL = `https://ecommerce-frontend-pi-one.vercel.app/password/resetpassword/${resetToken}`;

  const resetPasswordMessage = `Your reset password token is ${resetPasswordURL} \n\n If you have not requested for that then ignore this email.`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Ecommerce website",
      message: resetPasswordMessage,
    });
    res
      .status(200)
      .json({ success: true, message: `email is sent to ${user.email}` });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save();
    return next(new HttpsErrors(`Error while sending email !! ${err}`, 500));
  }
});

module.exports.resetPassword = catchAsyncError(async function (req, res, next) {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new HttpsErrors(`Your token is expired`, 500));
  }

  if (req.body.password !== req.body.confirmpassword) {
  }

  const hash = await bcrypt.hash(req.body.password, 10);
  user.password = hash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save();

  createToken(user, 200, res);
});

module.exports.userDetails = catchAsyncError(async function (req, res, next) {
  let user;
  try {
    user = await userModel.findById(req.user._id, { password: 0 });
  } catch (err) {
    return next(new HttpError(`Internal Server Error !!`, 500));
  }

  if (!user) {
    return next(new HttpError(`Login First`, 404));
  }

  res.status(200).json({ success: true, user });
});

module.exports.updatePassword = catchAsyncError(async function (
  req,
  res,
  next
) {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  let user;
  try {
    user = await userModel.findById(req.user._id);
  } catch (err) {
    return next(new HttpsErrors("Error while updating !!", 500));
  }

  if (!user) {
    return next(new HttpsErrors("Login First !!", 401));
  }

  const isValid = await bcrypt.compare(oldpassword, user.password);

  if (!isValid) {
    return next(new HttpError(`Invalid Cridentials !!`, 401));
  }

  if (newpassword !== confirmpassword) {
    return next(
      new HttpsErrors(
        "Confirm password and new password should be same !!",
        500
      )
    );
  }

  const hash = await bcrypt.hash(newpassword, 10);

  user.password = hash;

  user.save();
  createToken(user, 200, res);
});

module.exports.updateProfile = catchAsyncError(async function (req, res, next) {
  const { name, email } = req.body;

  const user = await userModel.findById(req.user._id);

  console.log(user);
  
  if (!user) {
    return next("Login First", 401);
  }

  if(req.body.avatar !== "")
  {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    user.avatar= {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  }


  user.name = name;
  user.email = email;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "successfully updated", user });
});

// ADMIN ROUTES

module.exports.allUsers = catchAsyncError(async function (eq, res, next) {
  let users;
  try {
    users = await userModel.find();
  } catch (err) {
    return next(new HttpsErrors("Failed to view users !!", 500));
  }

  res.status(200).json({ success: true, users });
});

module.exports.singleUser = catchAsyncError(async function (req, res, next) {
  let singleUser;

  try {
    singleUser = await userModel.findOne({ _id: req.params.singleuser });
  } catch (err) {
    return next(new HttpsErrors("Failed to view user !!", 500));
  }

  res.status(200).json({ success: true, user: singleUser });
});

module.exports.updateRole = catchAsyncError(async function (req, res, next) {

  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next("Login First", 401);
  }

  user.name= req.body.name;
  user.email= req.body.email;
  user.role = req.body.role;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "successfully updated", user });
});

module.exports.deleteUser = catchAsyncError(async function (req, res, next) {
  const user = await userModel.findById(req.params.singleuser);

  if (!user) {
    return next("Login First", 401);
  }

  // DELETE USER PHOTO FROM CLAUDINARY
  
  if(user.avatar.public_id)
  {
    const id= user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(id);
  }
 

  await userModel.findOneAndDelete({ _id: user._id });

  res.status(200).json({ success: true, message: "successfully deleted" });
});
