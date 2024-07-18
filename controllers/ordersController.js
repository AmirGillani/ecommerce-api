const productsModel = require("../models/products-model");

const HttpsError = require("../models/https-errors");

const catchAsyncError = require("../middlewares/catch-async-errors");

const orderModel = require("../models/order-model");

module.exports.createOrder = catchAsyncError(async function (req, res, next) {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    paidAt,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderModel.create({shippingInfo,
    orderItems,
    paymentInfo,
    paidAt,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user: req.user._id
});

res.status(201).json({success:true, order})
});

module.exports.getSingleOrder = catchAsyncError(async function(req,res,next){
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId).populate("user","email name");

    if(!order)
    {
        return next(new HttpsError("Order not found !!",404))
    }

    res.status(200).json({succes:true, order});
});

module.exports.myOrders = catchAsyncError(async function(req,res,next){

    const order = await orderModel.find({user:req.user._id});

    res.status(200).json({succes:true, order});
});

// ADMIN ROUTE

module.exports.getAllOrders = catchAsyncError(async function(req,res,next){

    const orders = await orderModel.find({});

    let totalAmount = 0;

    orders.map(order => totalAmount = totalAmount + order.totalPrice);

    res.status(200).json({succes:true, orders, totalAmount});
});

module.exports.updateStatus = catchAsyncError(async function(req,res,next){

    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new HttpsError("Order not found with this Id", 404));
      };
    
    if(order.orderStatus == "Delivered")
    {
        return next(new HttpsError("You have already delived this product !!",500))
    };

    //IF ORDER IS SHIPPED THEN MINUS PRODUCT FROM STOCK AND UPDATE STATUS TO SHIPPED

    if (req.body.status === "Shipped") 
    {

    order.orderItems.map(async item => await updateStock(item.id, item.quantity));
    
    }

    order.orderStatus = req.body.status;

    //IF ORDER IS DELIVERED THEN ADD DELIVERY DATE

    if(req.body.status == "Delivered")
    {
         order.deliveredAt = Date.now();
    }

   await order.save();

    res.status(200).json({succes:true,order});
});

async function updateStock(id,quantity)
{
  const product = await productsModel.findById(id);

  product.stock = product.stock - quantity;

  await product.save();

};

module.exports.deleteOrder = catchAsyncError(async function(req,res,next){

    const order = await orderModel.findById(req.params.id);

    if(!order)
    {
        return next(new HttpsError("Order not found !!",404))
    };
  
    await orderModel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({succes:true});
});