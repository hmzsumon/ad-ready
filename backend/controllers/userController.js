const User = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const createTransaction = require('../utils/tnx');
const adminId = process.env.ADMIN_ID;

// test sendEmail

exports.testSendEmail = asyncErrorHandler(async (req, res, next) => {
  sendEmail({
    email: 'zsumonn@gmail.com',
    subject: 'Test Email',
    message: '<h1>Test Email 2</h1>',
  });

  res.status(200).json({
    success: true,
    message: 'test send email',
  });
});

// ===============================================================
// @route   POST api/v1/register
// @desc    Register a user
// @access  Public
// ===============================================================
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    username,
    email,
    phone,
    password,
    tramsAndConditions,
    referId,
  } = req.body;

  // create 6 digit verifiedCode
  const verifiedCode = Math.floor(Math.random() * 1000000);

  // find sponsor
  const sponsor = await User.findById(referId);
  if (!sponsor) {
    return next(new ErrorHandler('Sponsor not found', 404));
  }

  const user = await User.create({
    name,
    email,
    username,
    phone,
    tramsAndConditions,
    password,
    verifiedCode,
    sponsor: { userId: sponsor._id, username: sponsor.username },
    parents: [sponsor._id],
  });

  // update sponsor's child
  sponsor.children.push(user._id);
  await sponsor.save();

  // find sponsor's parents and update them
  const parents = await User.find({ _id: { $in: sponsor.parents } });
  for (let i = 0; i < parents.length; i++) {
    parents[i].children.push(user._id);
    await parents[i].save();
  }

  //update user's parents
  for (let i = 0; i < parents.length; i++) {
    user.parents.push(parents[i]._id);
    await user.save();
  }

  //update admin
  const admin = await Admin.findById(adminId);
  admin.totalUsers += 1;
  admin.inactiveUsers += 1;
  await admin.save();

  // sendEmail({
  //   email: user.email,
  //   subject: 'Verify your account',
  //   message: `<h4>Your verifiedCode is: ${verifiedCode} </h4>`,
  // });
  sendToken(user, 201, res);
});

// ===============================================================
// @route   POST api/v1/verify
// @desc    Verify a user
// @access  Public
// ===============================================================
exports.verifyUser = asyncErrorHandler(async (req, res, next) => {
  const { verifiedCode } = req.body;

  const user = await User.findOne({ verifiedCode });
  if (!user) {
    return next(new ErrorHandler('Invalid verifiedCode', 400));
  }
  if (user.verifiedCode !== verifiedCode) {
    return next(new ErrorHandler('Invalid verifiedCode', 400));
  }
  user.isVerified = true;
  user.verifiedCode = '';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User verified successfully',
  });
});

// ===============================================================
// @route   POST api/users/login
// @desc    Login a user
// @access  Public
// ===============================================================

exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new ErrorHandler('Please Enter User Name And Password', 400));
  }

  //find user by username or phone
  const user = await User.findOne({ username }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid User Name or Password', 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid User Name  or Password', 401));
  }

  sendToken(user, 201, res);
});

// Logout User
exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Forgot Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User Not Found', 404));
  }

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const resetPasswordUrl = `https://${req.get(
    'host'
  )}/password/reset/${resetToken}`;

  // const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;

  try {
    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: {
        reset_url: resetPasswordUrl,
      },
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // create hash token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid reset password token', 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old Password is Invalid', 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 201, res);
});

// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
  });
});

// ADMIN DASHBOARD

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete Role --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
  });
});

//==========================================================
//===================== get all users income balance =========================
exports.getAllUsersIncomeBalance = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  //get total income balance of all users
  const totalIncomeBalance = users.reduce((acc, user) => {
    return acc + user.incomeBalance;
  }, 0);

  res.status(200).json({
    success: true,
    totalIncomeBalance: totalIncomeBalance.toFixed(0),
  });
});

//==========================================================
//===================== get today new users =========================
exports.getTodayNewUsers = asyncErrorHandler(async (req, res, next) => {
  const today = new Date();
  const todayDate =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  const users = await User.find({
    createdAt: { $gte: todayDate },
  });

  // get today active users
  const todayActiveUsers = await User.find({
    activeDate: { $gte: todayDate },
  });

  res.status(200).json({
    success: true,
    date: todayDate,
    length: users.length,
    todayActiveUsers: todayActiveUsers.length,
    users,
  });
});

// get all users
exports.getAllUsers2 = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  // find active users
  const activeUsers = users.filter((user) => user.status === 'active');

  res.status(200).json({
    success: true,
    activeUsers,
    users,
    length: users.length,
  });
});

//===========================================================================
//===================== inactive user to active user =========================
exports.inactiveUserToActiveUser = asyncErrorHandler(async (req, res, next) => {
  const taskLimit = req.body.taskLimit ? req.body.taskLimit : 5;
  const numTaskLimit = Number(taskLimit);

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.user._id}`, 404)
    );
  }

  // find admin by adminId
  const admin = await Admin.findById(adminId);
  console.log(adminId);
  if (!admin) {
    return next(new ErrorHandler('Admin not found', 404));
  }
  const cashBack = user.mainBalance * admin.cashBackPercentage;

  user.status = 'active';
  user.isActive = true;
  user.activeDate = new Date();
  user.cashBack += cashBack;
  createTransaction(user._id, 'cashIn', cashBack, `CashBack`);
  user.activeBalance += user.mainBalance + cashBack;
  createTransaction(
    user._id,
    'cashIn',
    user.mainBalance + user.cashBack,
    `Active to ActiveBalance`
  );

  // task value
  const dailyProfit = user.mainBalance * admin.dailyProfit;
  const taskValue = dailyProfit / numTaskLimit;

  user.profit += cashBack;
  user.dailyProfit = dailyProfit;
  user.toDayProfit += cashBack;
  user.taskLimit = numTaskLimit;
  user.dailyTaskLimit = numTaskLimit;
  user.taskValue = taskValue;
  user.withdrawBalance += user.mainBalance;
  await user.save();

  // find sponsor by sponsorId

  const referBonus = user.mainBalance * admin.referPercentage;

  const sponsor = await User.findById(user.sponsor.userId);
  if (!sponsor) {
    return next(
      new ErrorHandler(
        `Sponsor doesn't exist with id: ${user.sponsor.userId}`,
        404
      )
    );
  }

  sponsor.referBonus += referBonus;
  sponsor.profit += referBonus;
  sponsor.toDayProfit += referBonus;
  sponsor.activeBalance += referBonus;
  createTransaction(
    sponsor._id,
    'cashIn',
    referBonus,
    `Refer Bonus of ${user.name}`
  );
  await sponsor.save();

  //update admin balance
  admin.inactiveUsers -= 1;
  admin.activeUsers += 1;
  admin.activeBalance += user.activeBalance + referBonus + cashBack;
  admin.profit += referBonus + cashBack;
  admin.cashBack += cashBack;
  admin.referBonus += referBonus;
  await admin.save();
  console.log(user.username, sponsor.username);
  res.status(200).json({
    success: true,
    message: 'User is active successfully',
  });
});
