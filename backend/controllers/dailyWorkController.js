const ErrorHandler = require('../utils/errorhandler');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const DailyWork = require('../models/dailyWorkModel');
const User = require('../models/userModel');
const createTransaction = require('../utils/tnx');

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

// update user's tasksLimit by package tasksLimit
module.exports.givWorkToUsers = asyncErrorHandler(async (req, res, next) => {
  // incomebalance > 3000
  const users = await User.find({
    userHasPackage: true,
    role: 'user',
    incomeBalance: { $gt: 2999 },
  });
  console.log('users', users.length);
  if (!users) {
    return next(new ErrorHandler('User not found', 404));
  }

  // update users tasksLimit by package tasksLimit
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    //update user's tasksValue
    user.usrTaskValue = Math.round(
      (user.incomeBalance * 0.036) / user.packageTaskLimit
    );
    // console.log('usrTaskValue', user.userName, user.usrTaskValue);
    user.tasksLimit = user.packageTaskLimit;
    user.isCompleted = false;
    await user.save();
  }

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

  if (user.dailyTaskLimit === 1) {
    // update user taskValue

    user.isCompleted = true;
    user.totalWorkDays += 1;
    // console.log(
    //   'days',

    //   user.totalWorkingDays
    // );
  }

  if (user.dailyTaskLimit > 0) {
    user.dailyTaskLimit = user.dailyTaskLimit - 1;
    // update user's dailyIncomeBalance
    user.profit += user.taskValue;
    user.taskProfit += user.taskValue;

    createTransaction(
      user._id,
      'cashIn',
      user.taskValue,
      `Daily Work ${new Date().toLocaleDateString()}`,
      'daily_work'
    );
  }
  await user.save();

  // check user isCompleted is true
  // if (user.isCompleted) {
  //   // find sponsor of user
  //   const sponsor = await User.findById(user.sponsorBy);
  //   // update sponsor's dailyIncomeBalance
  //   sponsor.dailyIncomeBalance +=
  //     user.usrTaskValue * 0.05 * user.packageTaskLimit;
  //   sponsor.incomeBalance += user.usrTaskValue * 0.05 * user.packageTaskLimit;
  //   sponsor.firstGenBonus += user.usrTaskValue * 0.05 * user.packageTaskLimit;
  //   createTransaction(
  //     sponsor._id,
  //     'cashIn',
  //     user.usrTaskValue * 0.05 * user.packageTaskLimit,
  //     `Daily Work by 1st Gen 5% ${user.userName} `,
  //     '1st_gen'
  //   );
  //   await sponsor.save();

  //   // find parent of user
  //   const parent = await User.findById(user.parent);
  //   console.log('parent', parent.userName);
  //   // update parent's dailyIncomeBalance
  //   parent.dailyIncomeBalance +=
  //     user.usrTaskValue * 0.025 * user.packageTaskLimit;
  //   parent.incomeBalance += user.usrTaskValue * 0.025 * user.packageTaskLimit;
  //   parent.secondGenBonus += user.usrTaskValue * 0.025 * user.packageTaskLimit;

  //   createTransaction(
  //     parent._id,
  //     'cashIn',
  //     user.usrTaskValue * 0.025 * user.packageTaskLimit,
  //     `Daily Work by 2nd Gen 2.5% ${user.userName} `,
  //     '2nd_gen'
  //   );
  //   await parent.save();

  //   console.log('sponsor', sponsor.userName, 'parent', parent.userName);
  // }

  res.status(200).json({
    success: true,
    message: 'Task Completed Successfully',
  });
});
