const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please enter product title"] },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [8, "Price can not exceed 8 characters"],
  },

  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  category: { type: String, required: true },
  stock: {
    type: Number,
    reqired: true,
    maxLength: [4, "Stock can not exceed 4 letters"],
    default: 0,
  },
  ratings: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  reviews: [
    {
      user:{type: mongoose.Types.ObjectId, ref:"user", required:true},
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  creator: {type: mongoose.Types.ObjectId, ref:"user", required:true},
  createdAt: { type: Date, default: Date.now },
});

const productModel = mongoose.model("Product",productsSchema);

module.exports = productModel;
