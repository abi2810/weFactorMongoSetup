//  For password encryption
const bcrypt = require('bcrypt');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var secret = 'supersecret';

const Company = require('./../models/companies');
const CompanyDocument = require('./../models/company_documents');
const CompanyCategory = require('./../models/company_category');
const CompanyService = require('./../models/company_services');
const CompanyServiceType = require('./../models/company_service_type');
const RegistartionPackage = require('./../models/registartion_package');
const Category = require('./../models/categories');
const Service = require('./../models/services');
const Customer = require('./../models/customers');
const Admin = require('./../models/admin');

//Register a Company
const registerCompany = async function(req,res){
  let newCompany;
  let newDocument;
  let getDocument;
  let filename;
  let arr;
  if (req.query) {
    let checkCompany = await Company.find({gst_no:req.query.gst_no,is_active:1})
    // console.log(checkCompany)
    let hashedPassword = bcrypt.hashSync(req.query.password,8)
    if (checkCompany.length == 0) {
      newCompany = await Company.create({
        name:req.query.name,
        gst_no:req.query.gst_no,
        email:req.query.email,
        password:hashedPassword,
        phoneno:req.query.phoneno,
        services_known:req.query.services_known,
        address:req.query.address,
        area:req.query.area,
        city:req.query.city,
        pincode:req.query.pincode
      })
      if (req.files) {
        filename = req.files
        let loopDoc = await filename.map(async(fi)=>{
          newDocument = await CompanyDocument.create({company_id:newCompany.id,image_url:fi.path})
        })
        await Promise.all(loopDoc)
        getDocument = await CompanyDocument.find({image_url:{$in:filename.map(x => x.path)}})
      }
      res.send({details:newCompany,images:getDocument})
    }
    else{
      res.send({message:"Already Registered."})
    }
  }
  else{
      res.send({message:"Pls provide all the requirements."})
  }
}
// Before this happens payment will be there.
const payCategory = async function(req,res){
  let categoryId;
  let checkCatComp;
  if (req.query.regPackId) {
    let checkRegPack = await RegistartionPackage.findOne({_id:req.query.regPackId})
    if (!checkRegPack) {res.send({error:"No packages available"})}
    if(req.query.categoryId){
        categoryId = req.query.categoryId.split(',')
        checkCatComp = await CompanyCategory.find({category_id:categoryId,is_requested:1,is_paid:0})
        console.log(checkCatComp)
        if (checkCatComp.length == 0) {res.send({message:"You havent register yet."})}
        let payCat = await CompanyCategory.updateMany({category_id:categoryId},{$set:{is_paid:1}})
        let getUpdatedList = await CompanyCategory.find({category_id:categoryId})
        console.log(getUpdatedList)
        res.send({details:getUpdatedList})
    }
  }
}

// Choose Package and Category
const addCatCompany = async function(req,res){
  let categoryId;
  let newCatComp;
  let getCatComp;
  if (req.query.regPackId) {
    let checkRegPack = await RegistartionPackage.findOne({_id:req.query.regPackId})
    if (!checkRegPack) {res.send({error:"No packages available"})}
    if(req.query.categoryId){
      categoryId = req.query.categoryId
      if (categoryId.length > 0) {
        categoryId = req.query.categoryId.split(',')
        let checkCatComp = await CompanyCategory.find({category_id:categoryId,company_id:req.query.companyId})
        console.log(checkCatComp)
        if (checkCatComp.length !== 0) {
          res.send({message:"This category is already available for your company."})
        }
        let idLoop = await categoryId.map(async(id) => {
           newCatComp = await CompanyCategory.create({category_id:id,company_id:req.query.companyId})
           console.log(newCatComp)
        })
        await Promise.all(idLoop)
      }
      else{
        categoryId = req.query.categoryId
        newCatComp = await CompanyCategory.create({category_id:categoryId,company_id:req.query.companyId})
      }
    }
    getCatComp = await CompanyCategory.find({company_id:req.query.companyId})
    res.send({details:getCatComp})
  }
  else{
      res.send({error:"Please choose a package to continue."})
  }
}

// Verify company and its category from admin
const verifyCompanyCategory = async function(req,res){
  let categoryId = req.query.categoryId.split(',');
  let checkCatComp;
  let verifyCat;
  if (req.headers.token) {
    await jwt.verify(req.headers.token,secret,function(err,decoded){
      adminId = decoded.id
    })
    let checkAdmin = Admin.findOne({_id:adminId})
    if (!checkAdmin){res.status(401).send({message:"You are not allowed to do this job!"})}
    else{
      if (req.query.companyId) {
        let checkCompany = await Company.findOne({_id:req.query.companyId})
        // console.log(checkCompany.is_verify == 0)
        // return
        if (checkCompany.is_verify == 0) {
          console.log('in if verify')
          let verifyCompany = await Company.updateOne({_id:req.query.companyId},{$set:{is_verify:1}})
          checkCatComp = await CompanyCategory.find({company_id:req.query.companyId,category_id:categoryId,is_paid:1})
          if (checkCatComp.length !== 0) {
            verifyCat = await CompanyCategory.updateMany({category_id:categoryId,company_id:req.query.companyId},{$set:{is_verify:1}})
          }
        }
        else{
          console.log('in else verify')
          checkCatComp = await CompanyCategory.find({company_id:req.query.companyId,category_id:categoryId,is_paid:1})
          if (checkCatComp.length !== 0) {
            verifyCat = await CompanyCategory.updateMany({category_id:categoryId,company_id:req.query.companyId},{$set:{is_verify:1}})
          }
        }
      }
      res.send({message:"Admin has verified your company, you can now login by your email while given for registration."})
    }
  }
}

// Company Login
const companyLogin = async function(req,res){
  if (req.body.email && req.body.password && req.body.gst_no)
  {
    // const checkadmin = await Admin.findOne({where: {email: req.body.email}})
    const checkCompany = await Company.findOne({email:req.body.email,gst_no:req.body.gst_no})
  	if (!checkCompany) { res.status(401).send({auth: false, message: "No user found"})}
  	var passwordIsValid = await bcrypt.compareSync(req.body.password, checkCompany.password)
  	if (!passwordIsValid) { res.status(401).send({auth: false, message:"Check your password",token: null})}
  	var token = await jwt.sign({id: checkCompany.id}, secret, { expiresIn: 86400 })
    console.log(token)
  	res.status(200).send({auth: true, message:"Login success", token: token, name: checkCompany.name})
  }
  else{
  	res.status(400).send({message:"Please provide the required parameters to login."})
  }
}

// Available Company list to select from cart by pincode validation
const availableCompanies = async function(req,res){
  if (req.headers.token) {
    let getId = jwt.verify(req.headers.token,secret)
    let checkCustomer = await Customer.findOne({_id:getId.id})
    if (req.query.pincode && req.query.serviceId) {
      let getCat = await Service.findOne({_id:req.query.serviceId})
      let checkCompCat = await CompanyCategory.find({category_id:getCat.category_id})
      let companyId = await checkCompCat.map(x => x.company_id)
      let getCompany = await Company.find(
        {_id:companyId,pincode:req.query.pincode,is_active:1,is_verify:1},
        {name:1,phoneno:1,area:1,city:1,pincode:1,is_active:1,is_verify:1}
      )
      console.log(getCompany)
      if (getCompany.length !== 0) {
        res.send({details:getCompany})
      }
      else{
        res.send({message:"No company is available here.Try again later."})
      }
    }
    else{
        res.send({message:"Please provide pincode to get know about companies."})
    }
  }
  else{
      res.send({message:'Please provide token'})
  }
}

// Company

module.exports = {
  registerCompany,
  addCatCompany,
  payCategory,
  verifyCompanyCategory,
  companyLogin,
  availableCompanies
}
