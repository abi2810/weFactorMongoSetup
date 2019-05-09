var jwt = require('jsonwebtoken');
var secret = 'supersecret';

const Company = require('./../models/companies');
const CompanyDocument = require('./../models/company_documents');
const CompanyCategory = require('./../models/company_category');
const RegistartionPackage = require('./../models/registartion_package');
const Category = require('./../models/categories');
const Service = require('./../models/services');
// const Customer = require('./../models/customers');
// const Admin = require('./../models/admin');

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
    if (checkCompany.length == 0) {
      newCompany = await Company.create({
        name:req.query.name,
        gst_no:req.query.gst_no,
        email:req.query.email,
        password:req.query.password,
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
// const payCategory = async function(req,res){
//   if (req.query.regPackId) {
//     let checkRegPack = await RegistartionPackage.findOne({_id:req.query.regPackId})
//     let categoryId = req.query.categoryId.split(',')
//
//   }
// }
// Choose Package and Category
const addCatCompany = async function(req,res){
  let categoryId;
  let newCatComp;
  if (req.query.regPackId) {
    let checkRegPack = await RegistartionPackage.findOne({_id:req.query.regPackId})
    if (!checkRegPack) {res.send({error:"No packages available"})}
    if(req.query.categoryId){
      categoryId = req.query.categoryId
      if (categoryId.length > 0) {
        categoryId = req.query.categoryId.split(',')
        console.log('categoryId')
        console.log(categoryId)
        let id = categoryId.map(async(id) => {
          
        })
          newCatComp = await CompanyCategory.create({company_id:req.query.companyId,category_id:categoryId})
      }
      newCatComp = await CompanyCategory.create({company_id:req.query.companyId,category_id:categoryId})
    }
    // console.log(categoryId)
    res.send({details:newCatComp})
  }
  else{
      res.send({error:"Please choose a package to continue."})
  }
}

module.exports = {
  registerCompany,
  addCatCompany
}
