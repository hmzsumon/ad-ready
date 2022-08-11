const express = require('express');
const { createAdmin } = require('../controllers/admin/adminController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// create admin
router.route('/admin/create').post(createAdmin);

module.exports = router;
