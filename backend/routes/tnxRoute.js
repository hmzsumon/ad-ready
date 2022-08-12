const express = require('express');
const {
  newOrder,
  getSingleOrderDetails,
  myOrders,
  getAllTransactions,
  updateTransaction,

  deleteTransaction,
} = require('../controllers/tnxController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

// get logged in user transactions
router.route('/user/transactions').get(isAuthenticatedUser, getAllTransactions);

router
  .route('/transaction/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateTransaction)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteTransaction);

module.exports = router;
