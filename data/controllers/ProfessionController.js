var jwt = require('jsonwebtoken');
var secret = 'supersecret';
// Send OTP
var SendOtp = require('sendotp');
let authKey = require('../../config/key').authKey

const Company = require('./../models/companies');
const Profession = require('./../models/professions');
const ProfessionCategory = require('./../models/profession_category');
const Category = require('./../models/categories');
const Service = require('./../models/services');
const Customer = require('./../models/customers');
const Admin = require('./../models/admin');


// Add Professions under a company
const addProfession = async function(req,res){
  if (req.headers.token) {
    await jwt.verify(req.headers.token,secret,function(err,decoded){
      companyId = decoded.id
    })
    let checkCompany = Company.findOne({_id:companyId})
    if (!checkCompany){res.status(401).send({message:"You are not allowed to do this job!"})}
    if (req.query.phoneno) {
      let checkProf = await Profession.findOne({phoneno:req.query.phoneno,is_verify:1})
      if (checkProf) {res.send({message:"Profession is already available."})}
      let newProf = await Profession.create({company_id:companyId,name:req.query.name,phoneno:req.query.phoneno,area:req.query.area,pincode:req.query.pincode,city:req.query.city})
      res.send({details:newProf})
    }
    else{
        res.send({error:"Please provide the phone no"})
    }
  }
  else{
    res.send({error:"Please provide token"})
  }
}

// List Profession
const viewProfession = async function(req,res){
  if (req.headers.token) {
    await jwt.verify(req.headers.token,secret,function(err,decoded){
      companyId = decoded.id
    })
    let checkCompany = Company.findOne({_id:companyId})
    if (!checkCompany){res.status(401).send({message:"You are not allowed to do this job!"})}
    let getProf = await Profession.find({company_id:companyId,is_verify:1})
    res.send({details:getProf})
  }
  else{
    res.send({error:"Please provide token"})
  }
}

// Send OTP API
const sendOTPLoginProfession = async function(req,res){
  if (req.body.phoneno) {
    let checkProfession = await Profession.findOne({phoneno:req.body.phoneno})
    if (!checkProfession) {
      res.send({message:"Number does'nt exists"})
    }
    else{
      const sendOtp = new SendOtp(authKey);
      let verifyOtp = await sendOtp.send(req.body.phoneno, 611332, async function(err, data){
        if (err) {
          res.send(err)
        }
        res.send({message:"OTP has send to your number."})
      });
    }
  }
  else{
      res.send({message:"Please enter your number"})
  }
}

// profession Login
const professionLogin = async function(req,res){
  console.log("Login request received")
  let checkProfession
  // Login Via OTP
  if (req.body.phoneno && req.body.otp) {
      checkProfession = await Profession.findOne({phoneno: req.body.phoneno})
      if (checkProfession) {
        const sendOtp = new SendOtp(authKey);
        let verifyOtp = await sendOtp.verify(req.body.phoneno, req.body.otp, async function(err, data){
          if (err) {
            console.log(err)
          }
          else if (data.type === "success") {
            res.send({message:"Login success"})
          }
        });
      }
      else {
          res.send({message:"Number does'nt exists"})
      }
  }
  else{
  		res.status(400).send({message:"Please provide the required parameters to login."})
  }
}



//  Professions Signup
const professionSignup = async function(req,res){
  let arr = []
  let fetchCat;
  if (req.body.name && req.body.phoneno && req.body.category_id && req.body.area && req.body.pincode) {
    let categoryId = req.body.category_id
    let checkProf = await Profession.find({phoneno:req.body.phoneno,is_active:1})
    // console.log(checkProf)
    if (checkProf.length === 0) {
      let newprofessional = await Profession.create({name: req.body.name,phoneno: req.body.phoneno,area:req.body.area,pincode:req.body.pincode,city:"Chennai"})
      let profession_id = newprofessional.id
      let catLoop = await categoryId.map(async(id) =>{
        let newProfCat = await ProfessionCategory.create({profession_id:profession_id,category_id:id})
      })
      let responseLoop = await Promise.all(catLoop)
      let fetchProf = await Profession.findOne({_id:profession_id})
      res.send({message:"Successfully registered.",details:fetchProf})
    }
    else if(checkProf.is_verify === 1){
      res.send({message:"You are already registered,Please login with your credentials provided by company."})
    }
    else{
      res.send({message:"Your verification progress is going on.Once it is done will inform you."})
    }
  }
  else{
    res.status(401).send({message: "Please provide all the required arguments to continue!"});
  }
}

// Available Professionals list to select from cart
const availableProfessions = async function(req,res){
  if(req.headers.token){
    let getId = jwt.verify(req.headers.token,secret)
    let checkCustomer = await Customer.findOne({_id:getId.id})
    if (req.query.pincode && req.query.serviceId) {
      let getCat = await Service.findOne({_id:req.query.serviceId})
      let checkProfCat = await ProfessionCategory.find({category_id:getCat.category_id})
      let professionId = await checkProfCat.map(x => x.profession_id)
      let getProf = await Profession.find(
        {_id:professionId,pincode:req.query.pincode,is_active:1,is_verify:1},
        {name:1,phoneno:1,area:1,city:1,pincode:1,is_active:1,is_verify:1}
      )
      console.log(getProf)
      if (getProf.length !== 0) {
        res.send({details:getProf})
      }
      else{
        res.send({message:"No professionals available here.Try again later."})
      }
    }
    else{
        res.send({message:"Please provide pincode to get know about professionals."})
    }
  }
  else{
      res.send({message:'Please provide token'})
  }
}

// Admin to reassign the professionals to an order.
const assignProfession = async function(req,res){
  if (req.headers.token) {
    let companyId = jwt.verify(req.headers.token,secret)
    let checkCompany = await Company.findOne({_id:companyId.id})
    if (checkCompany && req.query.orderId) {
      let checkOrder = await Order.findOne({_id:req.query.orderId,is_active:1})
      if (checkOrder && req.query.professionId && req.query.pincode){
        let checkProf = await Profession.findOne({_id:req.query.professionId,pincode:req.query.pincode,company_id:companyId.id})
        console.log(checkProf)
        if (checkProf) {
          let sheduleProf = await ProfessionOrder.create({order_id:req.query.orderId,profession_id:req.query.professionId})
          if (sheduleProf) {
              let updateOrder = await Order.update({_id: req.query.orderId},{$set:{status:"Expert Assigned",is_active:1}})
              let updateProf = await ProfessionOrder.update({_id:sheduleProf.id},{$set:{status:"Scheduled"}})
          }else{
            res.send({message:"Problem in scheduling"})
          }
        }
        else{
          res.send({message:"No Profession found.Try again later."})
        }
        // res.send({details:checkOrder})
        res.send({message:"Profession is assigned to the order" + req.query.orderId})
      }
      else{
          res.send({message:"You are order is already placed."})
      }
    }
    else{
        res.send({message:"You are not allowed to do this action."})
    }
  }else{
    res.send({message:"Please provide token to continue."})
  }
}

// const assignProfession = async function(req,res){
//   if (req.headers.token) {
//     let adminId = jwt.verify(req.headers.token,secret)
//     let checkAdmin = await Admin.findOne({_id:adminId.id})
//     if (checkAdmin && req.query.orderId) {
//       let checkOrder = await Order.findOne({_id:req.query.orderId,is_added:1,is_active:0})
//       if (checkOrder && req.query.professionId && req.query.pincode){
//         let checkProf = await Profession.findOne({_id:req.query.professionId,pincode:req.query.pincode})
//         console.log(checkProf)
//         if (checkProf) {
//           let sheduleProf = await ProfessionOrder.create({order_id:req.query.orderId,profession_id:req.query.professionId})
//           if (sheduleProf) {
//               let updateOrder = await Order.update({_id: req.query.orderId},{$set:{status:"Professional is scheduled for your request",is_active:1}})
//               let updateProf = await ProfessionOrder.update({_id:sheduleProf.id},{$set:{status:"Scheduled"}})
//           }else{
//             res.send({message:"Problem in scheduling"})
//           }
//         }
//         else{
//           res.send({message:"No Profession found.Try again later."})
//         }
//         // res.send({details:checkOrder})
//         res.send({message:"Profession is assigned to the order" + req.query.orderId})
//       }
//       else{
//           res.send({message:"You are order is already placed."})
//       }
//     }
//     else{
//         res.send({message:"You are not allowed to do this action."})
//     }
//   }else{
//     res.send({message:"Please provide token to continue."})
//   }
// }

// Professions job List
const myJob = async function(req,res){
  if (req.query.phoneno) {
    let checkProf = await Profession.findOne({phoneno: req.query.phoneno})
    if (checkProf) {
      let getJobList = await ProfessionOrder.find({profession_id: checkProf.id})
      res.send({details:getJobList})
    }else{
      res.send({message:"Pofessional is not available in this number."})
    }
  }else{
    res.send({message:"Please provide phone number to proceed."})
  }
}

// Accept REject Complete
const jobAcceptRejectComplete = async function(req,res){
  let updateOrderStatus
  let updateProfstatus
  if (req.query.phoneno && req.query.orderId){
    let checkPro = await Profession.findOne({phoneno:req.query.phoneno})
    if (!checkPro) {
      res.send({message:"No professional is available in this number."})
    }
    let checkProfOrder = await ProfessionOrder.findOne({profession_id:checkPro.id,order_id:req.query.orderId,is_active:1})
    if (checkProfOrder) {
      // Start or Reject
      if (req.query.jobAction === "Start") {
          if (checkProfOrder.status === "Scheduled") {
            updateOrderStatus = await Order.update({_id:req.query.orderId},{$set:{status:"Our Professional is at your place,hope you like the job we do :)"}})
            updateProfstatus = await ProfessionOrder.update({order_id:req.query.orderId},{$set:{status:"InProgress"}})
          }
      }
      else if(req.query.jobAction === "Cancel"){
        if (checkProfOrder.status === "Scheduled") {
          updateOrderStatus = await Order.update({_id:req.query.orderId},{$set:{status:"Our Professional is refused to come to your place.Dont worry our technical people will assign another professional shortly."}})
          updateProfstatus = await ProfessionOrder.update({order_id:req.query.orderId},{$set:{status:"Cancelled"}})
        }
      }
      // Finish Job
      else if(req.query.jobAction === "Finish"){
        console.log('in Finish')
        if (checkProfOrder.status === "InProgress") {
          updateOrderStatus = await Order.update({_id:req.query.orderId},{$set:{status:"Thank you for using out service.Hope you our professionals did their job good."}})
          updateProfstatus = await ProfessionOrder.update({order_id:req.query.orderId},{$set:{status:"Completed"}})
        }
        else{
          res.send({message:"Without starting the job you cant finish it."})
        }
      }
      let fetchProOrder = await ProfessionOrder.findOne({order_id:req.query.orderId})
      console.log(fetchProOrder)
      res.send(fetchProOrder)
    }else{
      res.send({message:"No Orders assigned for this profession."})
    }
  }
  else{
      res.send({message:"Please provide required arguments"})
  }
}

// Ratings and review for professions from customer
const rateReview = async function(req,res){
  let cartId;
  if (req.headers.token) {
    let getCustomer = jwt.verify(req.headers.token,secret)
    let checkCustomer = await Customer.findOne({_id:getCustomer.id})
    if (!checkCustomer) {res.send({error:"Customer not found"})}
    let getCart = await Cart.find({customer_id:getCustomer.id,is_active:1})
    let getOrder = await Order.find({cart_id:getCart.map(x => x.id),is_paid:1})
    console.log(getOrder.map(x => x.id))
    let getCompOrder = await CompanyOrder.find({order_id:getOrder.map(x => x.id),is_active:1})
    let checkProfession = await Profession.find({company_id:getCompOrder.map(x => x.company_id)})
    if (checkProfession) {
      let list = await ProfessionOrder.find({profession_id: checkProfession.map(x => x.id),status:"Completed"})
      let addRateReview = await ProfessionOrder.updateMany({profession_id: checkProfession.map(x => x.id)},{$set:{ratings:req.query.rate,rating_des:req.query.rateing_desc,customer_review:req.query.review}})
      console.log(addRateReview)
      let fetchReview = await ProfessionOrder.find({profession_id:checkProfession.map(x => x.id)})
      res.send({details:fetchReview})
    }
  }
  else{
    res.send({message:"Please provide token."})
  }
}

module.exports = {
  addProfession,
  viewProfession,
  sendOTPLoginProfession,
  professionLogin,
  professionSignup,
  availableProfessions,
  assignProfession,
  jobAcceptRejectComplete,
  rateReview
}
