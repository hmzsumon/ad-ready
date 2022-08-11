const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getAllUsers2,
  getSingleUser,
  updateUserRole,
  deleteUser,
  testSendEmail,
  verifyUser,
  getAllUsersIncomeBalance,
  getTodayNewUsers,
  inactiveUserToActiveUser,
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticatedUser, getUserDetails);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router
  .route('/admin/users')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);

// test send email
router.route('/test/send-email').post(testSendEmail);

// verify user
router.route('/user/verify').post(verifyUser);

router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, getSingleUser)
  .put(isAuthenticatedUser, updateUserRole)
  .delete(isAuthenticatedUser, deleteUser);

// get all users income balance
router.route('/usersIncomeBalance').get(getAllUsersIncomeBalance);

// get today new users
router
  .route('/todayNewUsers')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getTodayNewUsers);

// get all users
router
  .route('/users')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers2);

// inactive user to active user
router
  .route('/user/inactive-to-active')
  .put(isAuthenticatedUser, inactiveUserToActiveUser);

module.exports = router;
