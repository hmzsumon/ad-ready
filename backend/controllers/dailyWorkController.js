const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const DailyWork = require('../models/dailyWorkModel');
const User = require('../models/userModel');
const Admin = require('../models/Admin');
const createTransaction = require('../utils/tnx');
const adminId = process.env.ADMIN_ID;

// daliy work list
const dailyWorks = [
  {
    url: 'https://i.ibb.co/pjc6SmB/Oppo-Reno5-image.png',
    title: 'Oppo Reno5 Full Specifications',
    description: '90Hz refresh rate, 600 nits max. brightness',
    price: '30,990',
    earning: 0,
    isVisited: false,
    isCompleted: false,
    isSelected: false,
  },
  {
    url: 'https://i.ibb.co/CQP3pP4/Oppo-F21-Pro-5-G.png',
    title: 'Oppo F21 Pro Full Specifications',
    description: 'Gorilla Glass 5 front, Fiberglass-Leather back',
    price: '28,990',
    earning: 0,
    isVisited: false,
    isCompleted: false,
    isSelected: false,
  },
  {
    url: 'https://i.ibb.co/1fK6x6r/Oppo-F19-Pro-image.png',
    title: 'Oppo F19 Pro Full Specifications',
    description: '60Hz refresh rate, 800 nits max. brightness',
    price: '24,990',
    earning: 0,
    isVisited: false,
    isCompleted: false,
    isSelected: false,
  },
  {
    url: 'https://i.ibb.co/Zcyr616/Oppo-A76.png',
    title: 'Oppo A76 Full Specifications',
    description: 'DAF, LED flash, depth, 1/3.06″, 1.12µm, f/2.2 & more',
    price: '22,990',
    earning: 0,
    isVisited: false,
    isCompleted: false,
    isSelected: false,
  },
  {
    url: 'https://i.ibb.co/9Y4wY97/Oppo-A95-4-G-image.png',
    title: 'Oppo A95 Full Specifications',
    description: 'PDAF, LED flash, f/1.7, 1/2.0″, 0.8µm, depth, macro & more',
    price: '24,990',
    earning: 0,
    isVisited: false,
    isCompleted: false,
    isSelected: false,
  },
];

// const User = require('../models/userModel');

// create some daily works
module.exports.createDailyWorks = asyncErrorHandler(async (req, res, next) => {
  const { url } = req.body;
  const dailyWorksCreated = await DailyWork.create({
    url,
  });
  res.status(201).json({
    success: true,
    data: dailyWorksCreated,
    message: 'Daily Works created successfully',
  });
});

// update a pay method by id
exports.updateLink = asyncErrorHandler(async (req, res, next) => {
  const dailyTask = await DailyWork.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!payMethod) {
    return next(new ErrorHandler('Pay Method not found', 404));
  }
  res.status(200).json({
    success: true,
    data: dailyTask,
  });
});

// do daily work for a user
module.exports.removeDailyWork = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  const dailyWorkId = req.params.id;
  const dailyWork = await user.dailyTask.find(
    (dailyWork) => dailyWork._id.toString() === dailyWorkId
  );
  if (!dailyWork) {
    return next(new ErrorHandler('Daily Work not found', 404));
  }

  //remove dailyWork from user's dailyTask array
  user.dailyTask.pull(dailyWork);

  user.dailyIncomeBalance += 5;
  user.incomeBalance += 5;
  createTransaction(user._id, 'cashIn', 5, 'Daily Work');
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Daily Work Submit successfully',
  });
});

// get daily works by user tasksLimit with shuffle
module.exports.getDailyWorks = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  // chack user userHasPackage is true
  if (user.userHasPackage === false) {
    return next(new ErrorHandler('User has no package', 400));
  }

  // check users dailyTask length
  // if (user.dailyTaskLimit === 0) {
  //   return next(new ErrorHandler('User has no daily works', 400));
  // }
  // find dailyworks with shuffle with limit
  const dailyWorks = await DailyWork.find().limit(user.dailyTaskLimit);
  const dailyWorksShuffle = dailyWorks.sort(() => Math.random() - 0.5);

  res.status(200).json({
    success: true,
    works: dailyWorksShuffle,
  });
});

// update logged in user's tasksLimit
module.exports.updateTasksLimit = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // check user tasksLimit is not 0
  if (user.tasksLimit === 0) {
    return next(new ErrorHandler('User has no daily works', 400));
  }

  user.tasksLimit = user.tasksLimit - 1;
  // update user's dailyIncomeBalance
  user.dailyIncomeBalance += user.usrTaskValue;
  user.incomeBalance += user.usrTaskValue;
  createTransaction(
    user._id,
    'cashIn',
    10,
    `Daily Work ${new Date().toLocaleDateString()}`
  );
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Task Completed Successfully',
  });
});

//=====================================================
// Give Task
//=====================================================
module.exports.givWorkToUsers = asyncErrorHandler(async (req, res, next) => {
  // incomebalance > 3000
  const users = await User.find({
    role: 'user',
    incomeBalance: { $gt: 2999 },
  });

  if (!users) {
    return next(new ErrorHandler('User not found', 404));
  }

  // update users tasksLimit by package tasksLimit
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // console.log('usrTaskValue', user.userName, user.usrTaskValue);
    user.dailyTaskLimit = user.taskLimit;
    user.isCompleted = false;
    user.toDayProfit = 0;
    await user.save();
  }

  // find admin by adminId
  // find admin
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return next(new ErrorHandler('Admin not found', 404));
  }

  admin.toDayProfit = 0; // reset toDayProfit
  admin.givTask = true;
  admin.totalWorkDays += 1;
  admin.todyWorkCompleted = 0; // reset todyWorkCompleted
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Task Completed Successfully',
    users: users.length,
  });
});

// get all users userHasPackage true
module.exports.getAllUsersForTask = asyncErrorHandler(
  async (req, res, next) => {
    // find users userHasPackage true and role is user
    const users = await User.find({
      userHasPackage: true,
      role: 'user',
      incomeBalance: { $gt: 2999 },
    });

    // get users isCompleted true
    const usersCompleted = await User.find({
      isCompleted: true,
      incomeBalance: { $gt: 2999 },
    });

    res.status(200).json({
      success: true,
      activeUsers: users.length,
      doneWorkUsers: usersCompleted.length,
    });
  }
);

// update user's tasksLimit O
module.exports.updateTasksLimitO = asyncErrorHandler(async (req, res, next) => {
  // find all active users and update tasksLimit to 0
  const users = await User.find({ userHasPackage: true });
  if (!users) {
    return next(new ErrorHandler('User not found', 404));
  }
  // update users tasksLimit to 0
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    user.tasksLimit = 0;
    user.isCompleted = true;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Task Completed Successfully',
    users: users.length,
  });
});

// give bonus task to all users incomeBalance > 2999
module.exports.giveBonusTask = asyncErrorHandler(async (req, res, next) => {
  // find all users incomeBalance > 2999
  const users = await User.find({
    incomeBalance: { $gt: 2999 },
  });

  // update users tasksLimit to 0
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    user.tasksLimit = user.tasksLimit + 5;
    user.isCompleted = false;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Task Completed Successfully',
    users: users.length,
  });
});

// ==========================================================
//                      Update total daily works
// ==========================================================
// update user's  totalWorkingDays from updateDate
module.exports.updateTotalWorkingDays = asyncErrorHandler(
  async (req, res, next) => {
    // get total active dates from activeDate to today
    const today = new Date();
    // const activeDate = new Date(user.activeDate);
    // const totalWorkingDays = Math.round(
    //   (today - activeDate) / (1000 * 60 * 60 * 24)
    // );
    // user.totalWorkingDays = totalWorkingDays;
    // console.log('totalWorkingDays', totalWorkingDays);

    // find all active users and role is user
    const users = await User.find({ role: 'user', status: 'active' });

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // get total active dates from activeDate to today
      const activeDate = new Date(user.packageStartDate);
      const totalWorkingDays = Math.round(
        (today - activeDate) / (1000 * 60 * 60 * 24)
      );
      user.activeDate = user.packageStartDate;
      user.totalWorkingDays = totalWorkingDays;
      console.log('totalWorkingDays', user.userName, totalWorkingDays);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Task Completed Successfully',
      users: users.length,
    });
  }
);

// ==========================================================
//                      gat all tasks
//============================================================
module.exports.getAllTasksAdmin = asyncErrorHandler(async (req, res, next) => {
  const tasks = await DailyWork.find();
  res.status(200).json({
    success: true,
    tasks,
  });
});

//==========================================================================
//================================= Delete Task ============================
//==========================================================================
module.exports.deleteTask = asyncErrorHandler(async (req, res, next) => {
  const task = await DailyWork.findById(req.params.id);
  if (!task) {
    return next(new ErrorHandler('Task not found', 404));
  }
  await task.remove();
  res.status(200).json({
    success: true,
    message: 'Task Deleted Successfully',
  });
});

// ==========================================================
//                      get a single task by id
//============================================================
module.exports.getSingleTask = asyncErrorHandler(async (req, res, next) => {
  const work = await DailyWork.findById(req.params.id);
  if (!work) {
    return next(new ErrorHandler('Task not found', 404));
  }
  res.status(200).json({
    success: true,
    work,
  });
});

//====================================================================================
//=================== Submit daily works =============================================
//====================================================================================

module.exports.submitWork = asyncErrorHandler(async (req, res, next) => {
  // find admin
  const admin = await Admin.findById(adminId);

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // check user tasksLimit is not 0
  // if (user.tasksLimit === 0) {
  //   return next(new ErrorHandler('User has no daily works', 400));
  // }

  // const numValue = Number(Math.floor(user.incomeBalance));
  // const newValue = Number(
  //   Math.ceil((numValue * 0.036) / user.packageTaskLimit)
  // );
  // console.log('newValue', newValue);

  // check user submit last task then update isCompleted true

  if (user.dailyTaskLimit > 0) {
    user.dailyTaskLimit = user.dailyTaskLimit - 1;
    // update user's dailyIncomeBalance
    user.currentProfit += user.taskValue;
    user.toDayProfit += user.taskValue;
    user.taskProfit += user.taskValue;

    createTransaction(
      user._id,
      'cashIn',
      user.taskValue,
      `Daily Work ${new Date().toLocaleDateString()}`,
      'daily_work'
    );
  }
  console.log('B done', user.activeBalance);
  //check user isCompleted is true
  if (user.dailyTaskLimit === 0) {
    user.profit += user.taskValue * user.taskLimit;
    user.isCompleted = true;
    user.totalWorkDays += 1;
    user.activeBalance += user.taskValue * user.taskLimit;
    user.withdrawBalance += user.taskValue * user.taskLimit;

    // task value
    const dailyProfit = user.activeBalance * admin.dailyProfit;
    const taskValue = dailyProfit / user.taskLimit;
    user.taskValue = taskValue;
    user.dailyProfit = dailyProfit;

    // find sponsor of user
    const sponsor = await User.findById(user.sponsor.userId);
    // sponsor  income 2%
    const sponsorIncome = user.taskValue * 0.02 * user.taskLimit;

    // update sponsor's dailyIncomeBalance
    sponsor.profit += sponsorIncome;
    sponsor.currentProfit += sponsorIncome;
    sponsor.toDayProfit += sponsorIncome;
    sponsor.activeBalance += sponsorIncome;
    sponsor.withdrawBalance += sponsorIncome;
    createTransaction(
      sponsor._id,
      'cashIn',
      sponsorIncome,
      `Daily Work by 1st Gen 2% ${user.username} `,
      '1st_gen'
    );
    await sponsor.save();

    admin.profit += sponsorIncome + user.taskValue * user.taskLimit;
    admin.currentProfit += sponsorIncome + user.taskValue * user.taskLimit;
    admin.activeBalance += sponsorIncome + user.taskValue * user.taskLimit;
    admin.todyWorkCompleted += 1;
    await admin.save();
  }
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Task Completed Successfully',
  });
});
