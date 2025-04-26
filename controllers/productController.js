const productsModel = require("../models/products-model");

const HttpsError = require("../models/https-errors");

const ApiFeatures = require("../utils/api-features");

const cloudinary = require("cloudinary");

const asyncErrorHandler = require("../middlewares/catch-async-errors");

module.exports.allProducts = asyncErrorHandler(async function (req, res, next) {
  let productPerPage = 5;

  //TOTAL PRODUCTS

  let productCount = await productsModel.countDocuments();

  //GET FILTERED PRODUCTS

  const apiFeatures = new ApiFeatures(productsModel.find(), req.query)
    .search()
    .filter()
    .pagination(productPerPage);

  let products = await apiFeatures.query;

  res
    .status(200)
    .json({ success: true, products, productCount, productPerPage });
});

module.exports.allAdminProducts = asyncErrorHandler(async function (
  req,
  res,
  next
) {
  const products = await productsModel.find();

  res.status(200).json({ success: true, products });
});

module.exports.addProducts = asyncErrorHandler(async function (req, res, next) {
  let product;

  let imagesLinks = [];

  if (req.files && req.files.length > 0) {
    imagesLinks = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }

  req.body.images = imagesLinks;

  req.body.creator = req.user._id;

  product = await productsModel.create(req.body);

  res.status(201).json({ success: true, product: product });
});

module.exports.updateProduct = asyncErrorHandler(async (req, res, next) => {

  const product = await productsModel.findById(req.params.id);

  if (!product) {
    return next(new HttpsError("Product not found !!", 404));
  }

  let imagesLinks = product.images;

  if (req.files && req.files.length > 0) {
    imagesLinks = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }

  req.body.images = imagesLinks;

  const updatedProduct = await productsModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, product: updatedProduct });
});

module.exports.deleteProduct = asyncErrorHandler(async function (
  req,
  res,
  next
) {
  let product;

  try {
    product = await productsModel.findOne({ _id: req.params.id });
  } catch (err) {
    return next(new HttpsError("Error while Deleting", 500));
  }

  if (!product) {
    return next(new HttpsError("Product not found !!", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  try {
    await productsModel.findByIdAndDelete(req.params.id);
  } catch (err) {
    return next(new HttpsError("Error while Updating", 500));
  }

  res.status(200).json({ success: true, message: "Successfully deleted !!" });
});

module.exports.getOneProduct = asyncErrorHandler(async function (
  req,
  res,
  next
) {
  let product;

  try {
    product = await productsModel.findOne({ _id: req.params.id });
  } catch (err) {
    return next(new HttpsError("Error while Finding Product", 500));
  }

  if (!product) {
    return next(new HttpsError("Product not found !!", 404));
  }

  res.status(200).json({ success: true, product });
});

module.exports.createReview = asyncErrorHandler(async function (
  req,
  res,
  next
) {
  const { rating, comment, productID } = req.body;

  const newReview = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const foundProduct = await productsModel.findById(productID);

  if (!foundProduct) {
    return next(new HttpsError("Product not found !!!!", 404));
  }

  const isReviewed = foundProduct.reviews.find(
    (rev) => rev.user.toString() == req.user._id.toString()
  );

  if (isReviewed) {
    //PATCH PREVIOUS REVIEW

    foundProduct.reviews.map((rev) => {
      if (rev.user.toString() == req.user._id.toString()) {
        rev.rating = Number(rating);
        rev.comment = comment;
      }
    });
  } else {
    // ADD REVIEW
    foundProduct.reviews.push(newReview);
  }

  if (foundProduct.reviews.length !== 0) {
    foundProduct.numOfReviews = foundProduct.reviews.length;

    let sum = 0;

    const total = foundProduct.reviews.length;

    foundProduct.reviews.map((review) => (sum = sum + review.rating));

    let avg = sum / total;

    foundProduct.ratings = avg;

    await foundProduct.save();
  }

  res.status(200).json({ sucess: true, foundProduct });
});

module.exports.getAllReviews = asyncErrorHandler(async function (
  req,
  res,
  next
) {
  const productId = req.query.productid;

  const foundProduct = await productsModel.findById(productId);

  if (!foundProduct) {
    return next(new HttpsError("Product not found !!!!", 404));
  }

  res.status(200).json({ succes: true, reviews: foundProduct.reviews });
});

module.exports.deleteReview = asyncErrorHandler(async function (
  req,
  res,
  next
) {
  const { productid, reviewid } = req.query;

  const foundProduct = await productsModel.findById(productid);

  if (!foundProduct) {
    return next(new HttpsError("Product not found !!!!", 404));
  }

  const filteredArray = foundProduct.reviews.filter(
    (rev) => rev._id.toString() !== reviewid.toString()
  );

  foundProduct.reviews = filteredArray;

  res.status(200).json({ success: true, reviews: filteredArray });
});
