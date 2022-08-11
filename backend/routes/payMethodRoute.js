const express = require('express');
const router = express.Router();

const {
  createPayMethod,
  getAllPayMethods,
  getPayMethodById,
  updatePayMethod,
  deletePayMethod,
} = require('../controllers/payMethodController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// create a new pay method
router
  .route('/new/pay-method')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createPayMethod);

// get all pay methods
router.route('/all/pay-method').get(getAllPayMethods);

// get a pay method by id
router.route('/pay-method/:id').get(getPayMethodById);

// update a pay method by id
router
  .route('/pay-method/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updatePayMethod);

// delete a pay method by id
router
  .route('/pay-method/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deletePayMethod);

module.exports = router;
