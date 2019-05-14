const express = require('express');
const router = express.Router();
// Image Upload
var multer = require('multer');
var upload = multer({ dest: './public/images/' });
var uploadProfileCustomer = multer({ dest: './public/images/profileCustomers/'});
var uploadProfileProfession = multer({ dest: './public/images/profileProfession/'});
var uploadCategory = multer({ dest: './public/images/category/'});
var uploadService = multer({ dest: './public/images/service/'});
var uploadDocument = multer({ dest: './public/images/companyDocuments/'});

// Import the controllers
const AdminController = require('../data/controllers/AdminController');
const CustomerController = require('../data/controllers/CustomerController');
const ProfessionController = require('../data/controllers/ProfessionController');
const CategoryController = require('../data/controllers/CategoryController');
const ServiceController = require('../data/controllers/ServiceController');
const OrderController = require('../data/controllers/OrderController');
const RegistartionPackageController = require('../data/controllers/RegistartionPackageController');
const CompanyController = require('../data/controllers/CompanyController');

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
router.post('/addProfession',ProfessionController.addProfession)
router.get('/viewProfession',ProfessionController.viewProfession)
router.post('/sendOTPLoginProfession',ProfessionController.sendOTPLoginProfession)
router.post('/professionLogin',ProfessionController.professionLogin)
router.post('/professionSignup',uploadProfileProfession.single('image_url'),ProfessionController.professionSignup)
router.get('/availableProfessions',ProfessionController.availableProfessions)
router.put('/assignProfession',ProfessionController.assignProfession)
router.put('/jobAcceptRejectComplete',ProfessionController.jobAcceptRejectComplete)
router.put('/rateReview',ProfessionController.rateReview)
// Orders
router.post('/addtocart',OrderController.addtocart)
router.get('/myCart',OrderController.myCart)
router.post('/placeOrder',OrderController.placeOrder)
router.get('/companyOrderList',OrderController.companyOrderList)
router.get('/adminOrderList',OrderController.orderList)
// Registartion Package
router.post('/addRegPackage',RegistartionPackageController.addRegPackage)
router.get('/getRegPackage',RegistartionPackageController.getRegPackage)
// Company
router.post('/registerCompany',uploadDocument.array('image_url'),CompanyController.registerCompany)
router.post('/addCatCompany',CompanyController.addCatCompany)
router.post('/payCategory',CompanyController.payCategory)
router.put('/verifyCompanyCategory',CompanyController.verifyCompanyCategory)
router.post('/companyLogin',CompanyController.companyLogin)
router.get('/availableCompanies',CompanyController.availableCompanies)

module.exports = router;
