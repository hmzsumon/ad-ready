const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Deposit = require('../models/depositModel');
const User = require('../models/userModel');
const Admin = require('../models/Admin');
const adminId = process.env.ADMIN_ID;

const createTransaction = require('../utils/tnx');

// create deposit request
exports.createDeposit = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;

  const { amount, accountNumber, transactionId, method } = req.body;

  // amount to number
  const numAmount = Number(amount);

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler(404, 'User not found'));
  }
  const newDeposit = await Deposit.create({
    userId,
    userName: user.username,
    userFullName: user.name,
    amount: numAmount,
    accountNumber,
    transactionId,
    method,
    status: 'PENDING',
    numberOfDeposit: user.deposit.numberOfDeposit + 1,
  });

  // find admin and update number of deposit
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return next(new ErrorHandler('Admin not found', 404));
  }
  admin.totalPendingDeposit.amount += numAmount;
  admin.totalPendingDeposit.count += 1;
  await admin.save();

  //update user number of deposit
  user.deposit.numberOfDeposit += 1;
  user.deposit.total += numAmount;
  user.deposit.lastDeposit = numAmount;
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Deposit request created',
    newDeposit,
  });
});

// get all deposits requests
exports.getAllDepositsAdmin = asyncErrorHandler(async (req, res, next) => {
  const deposits = await Deposit.find();

  res.status(200).json({
    success: true,
    message: 'Deposit requests fetched',
    deposits,
  });
});

// get a single deposit request by id
exports.getDepositById = asyncErrorHandler(async (req, res, next) => {
  const deposit = await Deposit.findById(req.params.id);
  if (!deposit) {
    return next(new ErrorHandler('Deposit request not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Deposit request fetched',
    deposit,
  });
});

// pending deposits requests to be approved
exports.approvedDeposit = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const deposit = await Deposit.findById(id);
  if (!deposit) {
    return next(new ErrorHandler('Deposit request not found', 404));
  }
  deposit.status = 'SUCCESS';
  await deposit.save();

  const user = await User.findById(deposit.userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  user.mainBalance += deposit.amount;
  await user.save();
  createTransaction(
    user._id,
    'cashIn',
    deposit.amount,
    'Deposit request approved'
  );

  // find admin and update number of deposit
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return next(new ErrorHandler('Admin not found', 404));
  }
  admin.totalPendingDeposit.amount -= deposit.amount;
  admin.totalPendingDeposit.count -= 1;
  admin.totalApprovedDeposit.amount += deposit.amount;
  admin.totalApprovedDeposit.count += 1;
  await admin.save();

  res.status(200).json({
    isApproved: true,
    message: 'Deposit request approved',
    deposit,
  });
});

//======================================================================
//===================== get all today deposits  =========================

exports.getAllTodayDeposits = asyncErrorHandler(async (req, res, next) => {
  const today = new Date();
  const todayDate =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const deposits = await Deposit.find({
    createdAt: { $gte: todayDate },
  });

  //get approved deposits
  const approvedDeposits = deposits.filter((deposit) => {
    return deposit.status === 'SUCCESS';
  });

  //get total approved deposits
  const totalApprovedDeposits = approvedDeposits.reduce((acc, deposit) => {
    return acc + deposit.amount;
  }, 0);

  // find pending deposits
  const pendingDeposits = deposits.filter((deposit) => {
    return deposit.status === 'PENDING';
  });

  // get total pending deposits
  const totalPendingDeposits = pendingDeposits.reduce((acc, deposit) => {
    return acc + deposit.amount;
  }, 0);

  res.status(200).json({
    success: true,
    deposits: deposits.length,
    approvedDeposits: approvedDeposits.length,
    pendingDeposits: pendingDeposits.length,
    totalApprovedDeposits: totalApprovedDeposits,
    totalPendingDeposits: totalPendingDeposits,
    date: todayDate,
  });
});

// ========================================================================
// ====================== update total  deposits amount =========================
exports.updateTotalDepositAmount = asyncErrorHandler(async (req, res, next) => {
  // find all users
  const users = await User.find({ role: 'user' });
  if (!users) {
    return next(new ErrorHandler('No users found', 404));
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // console.log('user', user.userName);
    // find all withdraws
    const deposits = await Deposit.find({
      userId: user._id,
      status: 'SUCCESS',
    });

    if (!deposits) {
      return next(new ErrorHandler('No withdraws found', 404));
    }

    // get total withdraws
    const totalDeposits = deposits.reduce((acc, deposit) => {
      return acc + deposit.amount;
    }, 0);

    // withdraw count
    // const depositsCount = withdraws.length;

    console.log('totalWithdraws', user.userName, totalDeposits);
    // update user total withdraws
    user.totalDeposit = totalDeposits;

    await user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Withdraw updated',
    users: users.length,
  });
});
