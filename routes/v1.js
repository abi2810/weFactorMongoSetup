const express = require('express');
const router = express.Router();
// Image Uplload
var multer = require('multer');
var upload = multer({ dest: './public/images/' });
var uploadProfileCustomer = multer({ dest: './public/images/profileCustomers/'});
var uploadProfileProfession = multer({ dest: './public/images/profileProfession/'});
var uploadCategory = multer({ dest: './public/images/category/'});
var uploadService = multer({ dest: './public/images/service/'});

// Import the controllers
const AdminController = require('../data/controllers/AdminController');
const CustomerController = require('../data/controllers/CustomerController');
const ProfessionController = require('../data/controllers/ProfessionController');
const CategoryController = require('../data/controllers/CategoryController');
const ServiceController = require('../data/controllers/ServiceController');
const OrderController = require('../data/controllers/OrderController');

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
router.post('/addAddress',CustomerController.newAddress)
router.get('/viewAddress',CustomerController.viewAddress)
// Category
router.post('/addCategory',uploadCategory.single('image_url'),CategoryController.newCategory)
router.put('/editCategory',uploadCategory.single('image_url'),CategoryController.editCategory)
router.get('/allCategory',CategoryController.allCategory)
router.get('/oneCategoryService',CategoryController.oneCategoryService)
// Service
router.post('/addService',uploadService.single('image_url'),ServiceController.newService)
router.post('/addServiceType',ServiceController.newServiceType)
router.get('/oneService',ServiceController.oneService)
// Profession
router.post('/professionSignup',uploadProfileProfession.single('image_url'),ProfessionController.professionSignup)
router.get('/availableProfessions',ProfessionController.availableProfessions)
router.put('/assignProfession',ProfessionController.assignProfession)
router.put('/jobAcceptRejectComplete',ProfessionController.jobAcceptRejectComplete)
// Orders
router.post('/addtocart',OrderController.addtocart)
router.get('/myCart',OrderController.myCart)
router.get('/adminOrderList',OrderController.orderList)

module.exports = router;
