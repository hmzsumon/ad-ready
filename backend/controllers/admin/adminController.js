const Admin = require('../../models/Admin');
const User = require('../../models/userModel');
const asyncErrorHandler = require('../../middlewares/asyncErrorHandler');
const sendToken = require('../../utils/sendToken');
const ErrorHandler = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');

// ===============================================================
// @route   POST api/create-admin
// @desc    Create a admin
// @access  Admin
// ===============================================================
exports.createAdmin = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    withdrawCharge,
    dailyProfit,
    cashBackPercentage,
    referPercentage,
    minimumWithdraw,
    minimumDeposit,
  } = req.body;

  const admin = await Admin.create({
    name,
    withdrawCharge,
    dailyProfit,
    cashBackPercentage,
    referPercentage,
    minimumWithdraw,
    minimumDeposit,
  });

  res.status(201).json({
    success: true,
    admin,
  });
});

// ===============================================================
// @route   POST api/update-admin
// @desc    Update a admin
// @access  Admin
// ===============================================================
exports.updateAdmin = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    withdrawCharge,
    dailyProfit,
    cashBackPercentage,
    referPercentage,
    minimumWithdraw,
    minimumDeposit,
  } = req.body;

  const admin = await Admin.findByIdAndUpdate(req.params.id, {
    name,
    withdrawCharge,
    dailyProfit,
    cashBackPercentage,
    referPercentage,
    minimumWithdraw,
    minimumDeposit,
  });

  res.status(200).json({
    success: true,
    admin,
  });
});
