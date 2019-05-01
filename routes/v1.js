const express = require('express');
const router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/' });
var uploadProfileCustomer = multer({ dest: './public/images/profileCustomers/' });

// Import the controllers
const AdminController = require('../data/controllers/AdminController');
const CustomerController = require('../data/controllers/CustomerController');

// Set routes
// Admin
router.post('/adminSignup',AdminController.adminSignup)
router.post('/adminLogin',AdminController.adminLogin)
// Customer
router.post('/customerSignup',CustomerController.customerSignup)
router.post('/customerLogin',CustomerController.customerLogin)
router.post('/getCustomerDetails',CustomerController.getCustomerDetails);
router.post('/verifyOtp',CustomerController.verifyCustomerPhoneno);
router.post('/sendOTPLogin',CustomerController.sendOTPLogin);
router.put('/editProfile', uploadProfileCustomer.single('image_url'),CustomerController.editProfile)
router.get('/customerProfile',CustomerController.profile)

module.exports = router;
