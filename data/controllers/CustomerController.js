//  For password encryption
const bcrypt = require('bcrypt');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var secret = 'supersecret';
// Image upload
var multer = require('multer');
// Send OTP
var SendOtp = require('sendotp');
let authKey = require('../../config/key').authKey

const Customer = require('./../models/customers');
const Address = require('./../models/address');

// Image upload destination
// var upload = multer({ dest: '../../public/images/' });
// function imgUpload(upload.single('image_url'),req,res,next){
//   next;
// }
// var upimg = upload.single('image_url')
// console.log('upimg')
// console.log(upimg)

// Verify Customer phoneno by sending OTP
const getCustomerDetails = async function(req,res){
  console.log('inside otp')
  if (req.body.name && req.body.email && req.body.password && req.body.phoneno) {
    let checkCustomer = await Customer.findOne({email:req.body.email,phoneno:req.body.phoneno,is_active:1})
    if (!checkCustomer) {
      const sendOtp = new SendOtp(authKey);
      let messageOtp = await sendOtp.send(req.body.phoneno,'611332',function async(err, data){
        if (err) {
          console.log('inside error')
          res.send(err)
        }
        console.log(data)
        res.send({message:"OTP has send to your number."})
      });
    }
    else{
        res.send({message:"This account is already exists."})
    }
  }
  else{
    res.send('Please provide required arguments.')
  }
  // res.send('Done')
}

const verifyCustomerPhoneno = async function(req,res){
  console.log('inside verify OTP')
  let checkCustomer = await Customer.findOne({phoneno:req.body.phoneno,is_phoneno_verify:0})
  if (checkCustomer) {
    const sendOtp = new SendOtp(authKey);
    let verifyOtp = await sendOtp.verify(req.body.phoneno, req.body.otp, async function(err, data){
      if (err) {
        console.log(err)
      }
      else if (data.type === "success") {
        let newCustomer = await customerSignup(req,res)
        console.log('newCustomer')
        console.log(newCustomer)
        if (newCustomer) {
          res.send({auth:true,token:newCustomer})
        }else{
          res.send({message:"Something went wrong"})
        }
      }
    });
  }
  else{
    res.send({message:"Customer ALready exists."})
  }
}

//  Customer Signup
const customerSignup = async function(req,res){
  console.log('inside signup function')
  if (req.body.name && req.body.email && req.body.password && req.body.phoneno) {
    let hashedPassword = bcrypt.hashSync(req.body.password,8)
    let checkCustomer = await Customer.findOne({email:req.body.email,phoneno:req.body.phoneno})
    if (!checkCustomer) {
      let customer = await Customer.create({name: req.body.name, email: req.body.email, password: hashedPassword,phoneno: req.body.phoneno})
      if(customer){
        let token = await jwt.sign({id:customer.id}, secret, {expiresIn: 86400})
        // return token;
        // res.status(200).send({auth: true, token: token});
        return token;
      }else{
        // res.status(500).send({auth: false, message: "There was a problem registering the user"});
        return {message:"Something went wrong."}
      }
    }else{
      // res.send({message:"Already Available"})
      return {message:"Already Available"}
    }
  }
  else{
    res.status(404).send({message:"Please provide all the feilds to continue!"})
  }
}

// Send OTP API
const sendOTPLogin = async function(req,res){
  if (req.body.phoneno) {
    let checkCustomer = await Customer.findOne({phoneno:req.body.phoneno})
    if (!checkCustomer) {
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
  const sendOtp = new SendOtp(authKey);

}

// Customer LogIn
const customerLogin = async function(req,res){
  console.log("Login request received")
  let checkcustomer
  // Login Via email and password
  if (req.body.email && req.body.password)
  {
  		checkcustomer = await Customer.findOne({email: req.body.email})
  		if (!checkcustomer) { res.status(404).send({auth: false, message: "No user found"})}
  		var passwordIsValid = bcrypt.compareSync(req.body.password, checkcustomer.password)
  		if (!passwordIsValid) { res.status(401).send({auth: false, message:"Check your password",token: null})}
  		var token = jwt.sign({id: checkcustomer.id}, secret, { expiresIn: 86400 })
  		res.status(200).send({auth: true, message:"Login success", token: token})
  }
  // Login Via OTP
  else if (req.body.phoneno && req.body.otp) {
      checkcustomer = await Customer.findOne({phoneno: req.body.phoneno})
      if (checkcustomer) {
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

// View Profile
const profile = async function(req,res){
  let customerId;
  let getProfile;
  if (req.headers.token) {
    await jwt.verify(req.headers.token,secret,function(err,decoded){
      console.log(decoded)
      customerId = decoded.id
    })
    getProfile = await Customer.findOne({_id:customerId})
    res.status(200).send({details:getProfile})
  }
  else if (req.query.phoneno) {
    getProfile = await Customer.findOne({phoneno:req.query.phoneno},{name:1,email:1,phoneno:1,_id:1})
    console.log(getProfile)
    res.status(200).send({details:getProfile})
  }
  else{
    res.status(401).send({message:"Please provide token to see profile details"})
  }
}

// Update Profile
// const uploadProfile = function(upload.single('image_url'))
const editProfile = async function(req,res,next){
  let filename;
  let updateInfo;
  if (req.query.customerId) {
    if (req.file && !req.query.name) {
      filename = req.file.path
      updateInfo = await Customer.update({_id: req.query.customerId},{$set:{image_url:filename}})
    }
    else if (req.query.name && req.file) {
      filename = req.file.path
      updateInfo = await Customer.update({_id:req.query.customerId},{$set:{name:req.query.name,image_url:filename}})
      // updateInfo = await Customer.update({name:req.query.name,image_url:filename},{_id:req.query.customerId})
    }
    else{
      updateInfo = await Customer.update({_id: req.query.customerId},{$set:{name:req.query.name}})
    }
    let fetchDet = await Customer.findOne({_id:req.query.customerId})
    res.status(200).send({details:fetchDet})
  }
  else{
      res.status(400).send({message:"Please provide the customerId to update the info"})
  }
}

//Add Address
const newAddress = async function(req,res){
  let customerId;
  if (req.headers.token) {
    await jwt.verify(req.headers.token,secret,function(err,decoded){
      customerId = decoded.id
    })
    let newAd = await Address.create({
      customer_id: customerId,
      house_flat_no: req.query.house_flat_no,
      landmark: req.query.landmark,
      place: req.query.place,
      city: req.query.city,
      pincode: req.query.pincode,
      type: req.query.type,
      lat:req.query.lat,
      lang:req.query.lang
    });
    let getAddress = await Address.find({customer_id: customerId})
    res.status(200).send({details:getAddress})
  }
  else{
    res.send({message:"Please provide token"})
  }
}

// Address List
const viewAddress = async function(req,res){
  let customerId;
  if (req.headers.token) {
    await jwt.verify(req.headers.token,secret,function(err,decoded){
      customerId = decoded.id
    })
    let fetchAd = await Address.find({customer_id:customerId})
    res.status(200).send({details:fetchAd})
  }
  else{
    res.send({message:"Please provide token"})
  }
}

// Sample Pay API

module.exports = {
  customerSignup,
  customerLogin,
  profile,
  getCustomerDetails,
  verifyCustomerPhoneno,
  sendOTPLogin,
  editProfile,
  newAddress,
  viewAddress
}
