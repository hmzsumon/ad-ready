const express = require('express');
const router = express.Router();
const {
  createDeposit,
  getUserDeposits,
  getAllDeposits,
  confirmDeposit,
  deleteAllPendingDeposits,
  getAllDepositsAdmin,
  getDepositById,
  approvedDeposit,
  getAllTodayDeposits,
  updateTotalDepositAmount,
} = require('../controllers/depositController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// create deposit request
router.route('/deposit/new').post(isAuthenticatedUser, createDeposit);

// get all deposits for admin
router.get(
  '/deposits/admin',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getAllDepositsAdmin
);

// get a single deposit request by id
router.get(
  '/deposit/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getDepositById
);

// approve a deposit request
router.put(
  '/deposit/:id',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  approvedDeposit
);

// get all today deposits
router.get(
  '/today/deposits',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  getAllTodayDeposits
);

// update total deposits amount
router.put(
  '/update/total/deposits/amount',
  isAuthenticatedUser,
  authorizeRoles('admin'),
  updateTotalDepositAmount
);

module.exports = router;
