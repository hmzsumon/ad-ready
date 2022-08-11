const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const {
  createDailyWorks,

  removeDailyWork,

  getDailyWorks,
  updateTasksLimit,
  givWorkToUsers,
  getAllUsersForTask,
  updateTasksLimitO,
  giveBonusTask,
  updateTotalWorkingDays,
  updateLink,
  getAllTasksAdmin,
  deleteTask,
  getSingleTask,

  submitWork,
} = require('../controllers/dailyWorkController');

// create daily works
router.route('/dailyWork/new').post(isAuthenticatedUser, createDailyWorks);

// remove a daily work from logged in user's dailyTask array
router.route('/dailyWorks/:id').delete(isAuthenticatedUser, removeDailyWork);

// get daily works
router.route('/dailyWorks').get(isAuthenticatedUser, getDailyWorks);

// update tasks limit
router.put('/dailyWorks/tasksLimit', isAuthenticatedUser, updateTasksLimit);

// update tasks limit by package
router.put(
  '/dailyWorks/give-to-users',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  givWorkToUsers
);

// get all users package true
router.get(
  '/users/package-true',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getAllUsersForTask
);

// update tasks limit to 0
router.put(
  '/dailyWorks/tasksLimit-0',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  updateTasksLimitO
);

// give bonus task
router.put(
  '/dailyWorks/give-bonus',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  giveBonusTask
);

// update total working days
router.put(
  '/dailyWorks/total-working-days',
  isAuthenticatedUser,
  updateTotalWorkingDays
);

// get all tasks admin
router.get(
  '/dailyWorks/all-tasks',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getAllTasksAdmin
);

// update link
router.route('/dailyWork/:id').put(isAuthenticatedUser, updateLink);

// delete task
router.route('/dailyWork/:id').delete(isAuthenticatedUser, deleteTask);

// get single task
router.route('/dailyWork/:id').get(isAuthenticatedUser, getSingleTask);

// submit work
router.route('/submit/work').put(isAuthenticatedUser, submitWork);
module.exports = router;
