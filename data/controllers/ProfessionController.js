var jwt = require('jsonwebtoken');
var secret = 'supersecret';

const Profession = require('./../models/professions');
const ProfessionCategory = require('./../models/profession_category');
const Category = require('./../models/categories');
const Service = require('./../models/services');
const Customer = require('./../models/customers');
const Admin = require('./../models/admin');



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
    let adminId = jwt.verify(req.headers.token,secret)
    let checkAdmin = await Admin.findOne({_id:adminId.id})
    if (checkAdmin && req.query.orderId) {
      let checkOrder = await Order.findOne({_id:req.query.orderId,is_added:1,is_active:0})
      if (checkOrder && req.query.professionId && req.query.pincode){
        let checkProf = await Profession.findOne({_id:req.query.professionId,pincode:req.query.pincode})
        console.log(checkProf)
        if (checkProf) {
          let sheduleProf = await ProfessionOrder.create({order_id:req.query.orderId,profession_id:req.query.professionId})
          if (sheduleProf) {
              let updateOrder = await Order.update({_id: req.query.orderId},{$set:{status:"Professional is scheduled for your request",is_active:1}})
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

module.exports = {
  professionSignup,
  availableProfessions,
  assignProfession,
  jobAcceptRejectComplete
}