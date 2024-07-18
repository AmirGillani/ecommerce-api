const productsController = require("../controllers/productController");

const auth = require("../middlewares/auth");

const express = require("express");

const route = express.Router();

route.route("/").get(productsController.allProducts);

route
  .route("/admin/")
  .get(
    auth.isAuthenticated,
    auth.checkRoles("admin"),
    productsController.allAdminProducts
  );

route
  .route("/review")
  .patch(auth.isAuthenticated, productsController.createReview);

route
  .route("/reviews")
  .get(productsController.getAllReviews)
  .delete(auth.isAuthenticated, productsController.deleteReview);

route
  .route("/addproduct")
  .post(
    auth.isAuthenticated,
    auth.checkRoles("admin"),
    productsController.addProducts
  );

route
  .route("/:id")
  .get(productsController.getOneProduct)
  .patch(
    auth.isAuthenticated,
    auth.checkRoles("admin"),
    productsController.updateProduct
  )
  .delete(
    auth.isAuthenticated,
    auth.checkRoles("admin"),
    productsController.deleteProduct
  );

module.exports = route;
