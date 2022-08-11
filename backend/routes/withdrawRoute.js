const express = require('express');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const {
  withdrawRequest,
  getAgentWithdraws,
  getUserWithdraws,
  getWithdraw,
  approveWithdraw,
  getAllWithdraws,
  getAllApprovedWithdraws,
  getAllPendingWithdraws,
  updateTotalWithdraw,
  getAllTodayWithdraws,
  cancelWithdraw,
  updateUserLastWithdrawDate,
} = require('../controllers/withdrawController');
const router = express.Router();

// create withdraw request
router.route('/withdraw').post(isAuthenticatedUser, withdrawRequest);

// get withdraws by agentId
router.route('/agent/withdraws').get(isAuthenticatedUser, getAgentWithdraws);

// get users withdraws
router.route('/user/withdraws').get(isAuthenticatedUser, getUserWithdraws);

router.route('/withdraws/:status').get(isAuthenticatedUser, getAllWithdraws);

// get a single withdraw
router.route('/withdraw/:id').get(isAuthenticatedUser, getWithdraw);

// approve withdraw request by agent
router.route('/withdraw/approve').put(isAuthenticatedUser, approveWithdraw);

// get all approved withdraws
router
  .route('/total/withdraw')
  .get(getAllApprovedWithdraws, isAuthenticatedUser);

// update user total withdraw && withdraw count
router
  .route('/update/total/withdraw')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateTotalWithdraw);

// get today withdraws
router
  .route('/today/withdraws')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllTodayWithdraws);

// cancel withdraw request
router
  .route('/withdraw/cancel')
  .put(isAuthenticatedUser, authorizeRoles('admin'), cancelWithdraw);

// update user last withdraw date by admin
router
  .route('/update/last/withdraw/date')
  .put(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    updateUserLastWithdrawDate
  );

module.exports = router;
