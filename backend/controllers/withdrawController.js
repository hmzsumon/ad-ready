const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Deposit = require('../models/depositModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const Withdraw = require('../models/WithdrawModel');
const createTransaction = require('../utils/tnx');

const companyId = process.env.COMPANY_ID;

// withdraw request from user
module.exports.withdrawRequest = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // // check user active date
  // const today = new Date();
  // const userActiveDate = new Date(user.activeDate);
  // const diff = today.getTime() - userActiveDate.getTime();
  // const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  // if (days < 15) {
  //   return next(
  //     new ErrorHandler('User must be active for at least 15 days', 400)
  //   );
  // }

  const { amount, method, accountNumber } = req.body;

  const withdrawCharge = Number(amount) * 0.1;

  const netAmount = Number(amount) - withdrawCharge;
  const totalAmount = netAmount + withdrawCharge;

  // check if user has sufficient balance
  if (user.incomeBalance < amount) {
    return next(new ErrorHandler('Insufficient balance', 400));
  }

  // create withdraw request
  const withdraw = await Withdraw.create({
    userId,
    userName: user.userName,
    userFullName: user.fullName,
    accountNumber,
    amount,
    withdrawCharge,
    netAmount,
    totalAmount,
    method,
    status: 'pending',
  });
  // update user balance
  user.incomeBalance -= amount;
  user.save();

  res.status(201).json({
    success: true,
    message: 'Withdraw request created',
    data: withdraw,
  });
});

// get withdraws by agentId
module.exports.getAgentWithdraws = asyncErrorHandler(async (req, res, next) => {
  const agentId = req.user._id;
  const withdraws = await Withdraw.find();
  if (!withdraws) {
    return next(new ErrorHandler('No withdraws found', 404));
  }
  // filter pending withdraws
  const pendingWithdraws = withdraws.filter(
    (withdraw) => withdraw.status === 'pending'
  );
  res.status(200).json({
    success: true,
    message: 'Withdraws fetched',
    withdraws,
    pendingWithdraws,
  });
});

// get all withdraws admin
module.exports.getAllWithdraws = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.params;
  const withdraws = await Withdraw.find({ status });
  if (!withdraws) {
    return next(new ErrorHandler('No withdraws found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Withdraws fetched',
    withdraws,
  });
});

// get loged in user withdraws
module.exports.getUserWithdraws = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const withdraws = await Withdraw.find({ userId });
  if (!withdraws) {
    return next(new ErrorHandler('No withdraws found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Withdraws fetched',
    withdraws,
  });
});

// get a single withdraw
module.exports.getWithdraw = asyncErrorHandler(async (req, res, next) => {
  const withdrawId = req.params.id;
  const withdraw = await Withdraw.findById(withdrawId);

  if (!withdraw) {
    return next(new ErrorHandler('Withdraw not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Withdraw fetched',
    withdraw,
  });
});

// approve withdraw request by agent
module.exports.approveWithdraw = asyncErrorHandler(async (req, res, next) => {
  // const withdrawId = req.params.id;
  const { withdrawId, approvedAccountNumber, approveTnxId } = req.body;

  //check user role admin and agent
  const adminId = req.user._id;
  const admin = await User.findById(adminId);
  if (!admin) {
    return next(new ErrorHandler('User not found', 404));
  }

  // if (agent.role !== 'agent') {
  //   return next(new ErrorHandler('Unauthorized', 401));
  // }

  const withdraw = await Withdraw.findById(withdrawId);
  if (!withdraw) {
    return next(new ErrorHandler('Withdraw not found', 404));
  }

  withdraw.status = 'approved';
  withdraw.approvedAt = Date.now();
  withdraw.approvedBy = admin._id;
  withdraw.approvedByName = admin.userName;
  withdraw.approvedAccountNumber = approvedAccountNumber;
  withdraw.approveTnxId = approveTnxId;
  await withdraw.save();

  // find user
  // const user = await User.findById(withdraw.userId);
  // if (!user) {
  //   return next(new ErrorHandler('User not found', 404));
  // }

  // user.withdrawCount += 1;
  // await user.save();

  // // find sponsor
  // const sponsor = await User.findById(user.sponsorBy);
  // if (!sponsor) {
  //   return next(new ErrorHandler('Sponsor not found', 404));
  // }

  // update sponsor balance
  // sponsor.incomeBalance += withdraw.netAmount * 0.05;
  // sponsor.royaltyBonus += withdraw.netAmount * 0.05;
  // createTransaction(
  //   sponsor._id,
  //   'cashIn',
  //   withdraw.netAmount * 0.05,
  //   `Royalty Bonus`
  // );
  // await sponsor.save();
  // console.log('sponsor', sponsor.userName);

  res.status(200).json({
    success: true,
    message: 'Withdraw approved',
    withdraw,
  });
});

//==========================================================
//===================== get all approved withdraws =========================
exports.getAllApprovedWithdraws = asyncErrorHandler(async (req, res, next) => {
  const withdraws = await Withdraw.find({ status: 'approved' });

  //get total approved withdraws
  const totalApprovedWithdraws = withdraws.reduce((acc, withdraw) => {
    return acc + withdraw.amount;
  }, 0);

  res.status(200).json({
    success: true,
    withdraws: withdraws.length,
    totalApprovedWithdraws: totalApprovedWithdraws.toFixed(0),
  });
});

//==========================================================
//===================== Update withdraw & withdraw Count =========================
exports.updateTotalWithdraw = asyncErrorHandler(async (req, res, next) => {
  // find all users
  const users = await User.find({ role: 'user' });
  if (!users) {
    return next(new ErrorHandler('No users found', 404));
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // console.log('user', user.userName);
    // find all withdraws
    const withdraws = await Withdraw.find({
      userId: user._id,
      status: 'approved',
    });
    if (!withdraws) {
      return next(new ErrorHandler('No withdraws found', 404));
    }

    // get total withdraws
    const totalWithdraws = withdraws.reduce((acc, withdraw) => {
      return acc + withdraw.amount;
    }, 0);

    // withdraw count
    const withdrawCount = withdraws.length;

    console.log('totalWithdraws', user.userName, totalWithdraws, withdrawCount);
    // update user total withdraws
    user.totalWithdraw = totalWithdraws;
    user.withdrawCount = withdrawCount;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Withdraw updated',
    users: users.length,
  });
});

//==========================================================
//===================== get all today withdraws  =========================
exports.getAllTodayWithdraws = asyncErrorHandler(async (req, res, next) => {
  const today = new Date();
  const todayDate =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const withdraws = await Withdraw.find({
    createdAt: { $gte: todayDate },
  });

  //get approved withdraws
  const approvedWithdraws = withdraws.filter((withdraw) => {
    return withdraw.status === 'approved';
  });

  //get total approved withdraws
  const totalApprovedWithdraws = approvedWithdraws.reduce((acc, withdraw) => {
    return acc + withdraw.netAmount;
  }, 0);

  // find pending withdraws
  const pendingWithdraws = withdraws.filter((withdraw) => {
    return withdraw.status === 'pending';
  });

  // total amount of pending withdraws
  const totalPendingWithdraws = pendingWithdraws.reduce((acc, withdraw) => {
    return acc + withdraw.netAmount;
  }, 0);
  console.log('totalPendingWithdraws', totalPendingWithdraws);
  res.status(200).json({
    date: todayDate,
    success: true,
    withdraws: withdraws.length,
    approvedWithdraws: approvedWithdraws.length,
    pendingWithdraws: pendingWithdraws.length,
    totalPendingWithdraws: totalPendingWithdraws.toFixed(0),
    totalApprovedWithdraws: totalApprovedWithdraws.toFixed(0),
  });
});

//==========================================================
//===================== Cancel Withdraw   ===================

// cancel withdraw request by id
module.exports.cancelWithdraw = asyncErrorHandler(async (req, res, next) => {
  const { withdrawId, description } = req.body;

  //check user role admin and agent
  const adminId = req.user._id;
  const admin = await User.findById(adminId);
  if (!admin) {
    return next(new ErrorHandler('User not found', 404));
  }

  // if (agent.role !== 'agent') {
  //   return next(new ErrorHandler('Unauthorized', 401));
  // }

  const withdraw = await Withdraw.findById(withdrawId);
  if (!withdraw) {
    return next(new ErrorHandler('Withdraw not found', 404));
  }

  withdraw.status = 'cancelled';
  withdraw.cancelledAt = Date.now();
  withdraw.cancelledBy = admin._id;
  withdraw.cancelledByName = admin.userName;
  withdraw.cancelDescription = description;
  await withdraw.save();

  // find user
  const user = await User.findById(withdraw.userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // update user balance
  user.incomeBalance += withdraw.amount;
  createTransaction(
    user._id,
    'cashIn',
    withdraw.amount,
    `Withdraw Cancelled for ${description}`
  );
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Withdraw cancelled',
    withdraw,
  });
});

//========================================================================================
//===================== update user last withdrawDate and amount  =========================
exports.updateUserLastWithdrawDate = asyncErrorHandler(
  async (req, res, next) => {
    // find all users
    const users = await User.find({
      role: 'user',
      status: 'active',
      withdrawCount: { $gt: 0 },
    });
    if (!users) {
      return next(new ErrorHandler('No users found', 404));
    }

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // console.log('user', user.userName);
      // find all withdraws
      const withdraws = await Withdraw.find({
        userId: user._id,
        status: 'approved',
      });
      if (!withdraws) {
        continue;
      }

      // get last withdraw
      const lastWithdraw = withdraws.slice(-1)[0];

      console.log(
        'lastWithdraw',
        user.userName,
        lastWithdraw.approvedAt,
        lastWithdraw.amount,
        lastWithdraw.status
      );

      // update user last withdraw date and amount
      user.lastWithdrawDate = lastWithdraw.approvedAt;
      user.lastWithdrawAmount = lastWithdraw.amount;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Withdraw updated',
      users: users.length,
    });
  }
);
