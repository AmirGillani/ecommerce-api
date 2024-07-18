const express = require("express");

const userControler = require("../controllers/userController");

const auth = require("../middlewares/auth");

const route= express.Router();

route.post("/signup",userControler.signup);

route.post("/login",userControler.login);

route.get("/logout",userControler.logout);

route.post("/forgetpassword", userControler.forgetPassword);

route.patch("/password/reset/:resettoken", userControler.resetPassword);

route.get("/me",auth.isAuthenticated, userControler.userDetails);

route.patch("/password/updatepassword",auth.isAuthenticated, userControler.updatePassword);

route.patch("/me/updateprofile",auth.isAuthenticated, userControler.updateProfile);

// ADMIN ROUTES

route.get("/admin/allusers",auth.isAuthenticated, userControler.allUsers);

route.get("/admin/:singleuser",auth.isAuthenticated, userControler.singleUser);

route.patch("/admin/:id",auth.isAuthenticated, userControler.updateRole);

route.delete("/admin/:singleuser",auth.isAuthenticated, userControler.deleteUser)

module.exports = route;