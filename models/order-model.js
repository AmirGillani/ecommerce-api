const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: [true, "Address is required"] },
    city: { type: String, required: [true, "city is required"] },
    state: { type: String, required: [true, "state is required"] },
    country: { type: String, required: [true, "country is required"] },
    pinCode: { type: Number, required: [true, "PIN is required"] },
    phone: { type: Number, required: [true, "phone is required"] },
  },
  orderItems: [
    {
      name: { type: String, required: [true, "Address is required"] },
      price: { type: Number, required: [true, "price is required"] },
      quantity: { type: Number, required: [true, "quantity is required"] },
      image: { type: String, required: [true, "Address is required"] },
      id: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: [true, "Address is required"],
      },
    },
  ],
  paymentInfo: {
    id: { type: String, required: [true, "id is required"] },
    status: { type: String, required: [true, "status is required"] },
  },
  itemPrice: { type: Number, default: 0, required: true },
  taxPrice: { type: Number, default: 0, required: true },
  shippingPrice: { type: Number, default: 0, required: true },
  totalPrice: { type: Number, default: 0, required: true },
  paidAt: { type: Date, required: [true, "date is required"] },
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  orderStatus: { type: String, default: "Processing" },
  delivedAt: Date,
  createdAt: { type: Date, default: Date.now() },
});

module.exports = new mongoose.model("order", orderModel);
