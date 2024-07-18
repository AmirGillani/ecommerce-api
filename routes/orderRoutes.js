const express = require("express");

const orderController = require("../controllers/ordersController");

const auth = require("../middlewares/auth");

const route = express.Router();

route.route("/create").post(auth.isAuthenticated, orderController.createOrder);

route.route("/me").get(auth.isAuthenticated, orderController.myOrders);

route.route("/:id").get(auth.isAuthenticated, orderController.getSingleOrder);

route.route("/admin/orders").get(
    auth.isAuthenticated,
    auth.checkRoles("admin"),
    orderController.getAllOrders
  )
route
  .route("/admin/:id")
  .patch(
    auth.isAuthenticated,
    auth.checkRoles("admin"),
    orderController.updateStatus
  )
  .delete(
    auth.isAuthenticated,
    auth.checkRoles("admin"),
    orderController.deleteOrder
  );

module.exports = route;
