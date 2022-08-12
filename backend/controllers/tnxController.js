const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const Transaction = require('../models/transactionModel');

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;

  const orderExist = await Order.findOne({ paymentInfo });

  if (orderExist) {
    return next(new ErrorHandler('Order Already Placed', 400));
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  await sendEmail({
    email: req.user.email,
    templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
    data: {
      name: req.user.name,
      shippingInfo,
      orderItems,
      totalPrice,
      oid: order._id,
    },
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// ======================================================================
//  Get All Transactions by User id
// ======================================================================
exports.getAllTransactions = asyncErrorHandler(async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.user._id });
  if (!transactions) {
    return next(new ErrorHandler('Transaction Not Found', 404));
  }
  res.status(200).json({
    success: true,
    transactions,
  });
});

// Update Order Status ---ADMIN
exports.updateTransaction = asyncErrorHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(new ErrorHandler('transaction Not Found', 404));
  }

  res.status(200).json({
    success: true,
    transaction,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteTransaction = asyncErrorHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return next(new ErrorHandler('transaction Not Found', 404));
  }

  await Transaction.remove();

  res.status(200).json({
    success: true,
  });
});
