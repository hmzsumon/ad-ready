const ErrorHandler = require('../utils/errorhandler');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const PayMethod = require('../models/payMethodModel');

// create a new pay method
exports.createPayMethod = asyncErrorHandler(async (req, res, next) => {
  const { name, accountNumber, bankName, type } = req.body;
  const payMethod = await PayMethod.create({
    name,
    accountNumber,
    bankName,
    type,
  });
  res.status(201).json({
    success: true,
    payMethod,
  });
});

// get all pay methods
exports.getAllPayMethods = asyncErrorHandler(async (req, res, next) => {
  const payMethods = await PayMethod.find();
  res.status(200).json({
    success: true,
    payMethods,
  });
});

// get a pay method by id
exports.getPayMethodById = asyncErrorHandler(async (req, res, next) => {
  const payMethod = await PayMethod.findById(req.params.id);
  if (!payMethod) {
    return next(new ErrorHandler(404, 'Pay Method not found'));
  }
  res.status(200).json({
    success: true,
    data: payMethod,
  });
});

// update a pay method by id
exports.updatePayMethod = asyncErrorHandler(async (req, res, next) => {
  const payMethod = await PayMethod.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!payMethod) {
    return next(new ErrorHandler(404, 'Pay Method not found'));
  }
  res.status(200).json({
    success: true,
    data: payMethod,
  });
});

// delete a pay method by id
exports.deletePayMethod = asyncErrorHandler(async (req, res, next) => {
  const payMethod = await PayMethod.findByIdAndDelete(req.params.id);
  if (!payMethod) {
    return next(new ErrorHandler(404, 'Pay Method not found'));
  }
  res.status(200).json({
    success: true,
    data: payMethod,
  });
});
