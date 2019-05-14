var jwt = require('jsonwebtoken');
var secret = 'supersecret';

const Order = require('./../models/orders');
const Cart = require('./../models/cart');
const Profession = require('./../models/professions');
const ProfessionOrder = require('./../models/profession_order');
const CompanyOrder = require('./../models/company_order');
const Company = require('./../models/companies');
const Customer = require('./../models/customers');
const Admin = require('./../models/admin');
const Service = require('./../models/services');
const ServiceType = require('./../models/service_type');

// Make an Order - Add to Cart
// Allow customer to add to cart,when they click continue to select addresses ask them to logIn.
const addtocart = async function(req,res){
  if (req.headers.token) {
    let customerId = jwt.verify(req.headers.token,secret)
    let getCustomer = await Customer.findOne({_id: customerId.id,is_active:1,is_email_verify:1})
    if (getCustomer) {
      let newItem = await Cart.create({
        service_id: req.query.serviceId,
        service_type_id: req.query.serviceTypeId,
        customer_id: customerId.id,
        address_id: req.query.addressId,
        schedule_date: req.query.scheduleDate,
        schedule_time: req.query.scheduleTime
      })
      if (newItem && req.query.companyId && req.query.pincode) {
        let checkComp = await Company.findOne({_id:req.query.companyId,pincode:req.query.pincode})
        console.log(checkComp)
        if (checkComp) {
          let sheduleCompany = await CompanyOrder.create({cart_id:newItem.id,company_id:req.query.companyId})
        }
        else{
          res.send({message:"No Company found.Try again later."})
        }
      }else{
        res.send({message:"Pincode is missing"})
      }
      res.send({deatils:newItem})
    }
    else{
        res.send({message:"No customer found."})
    }
  }
  else{
    res.send('Please provide token to continue.')
  }
}

// Cart List
const myCart = async function(req,res){
  if (req.headers.token) {
		let getCustomer = jwt.verify(req.headers.token,secret)
		let customer_id = getCustomer.id
    console.log(customer_id)
		let cartDet = await Cart.find({customer_id:customer_id,is_added:1})
		let loopCart = await cartDet.map(async(li) => {
			let getServname = await Service.findOne({_id:li.service_id},{name:1})
			let getServType = await ServiceType.findOne({_id:li.service_type_id},{name:1,price:1})
      console.log(getServname.name)
      console.log(getServType)
			li['service_name'] = getServname.name
			li['service_type'] = getServType.name
			li['price'] = getServType.price
			console.log(cartDet)
		})
		let loopResponse = await Promise.all(loopCart)
		res.send({details:cartDet})
	}
}

// Place Order
const placeOrder = async function(req,res){
  console.log('inside placeorder')
  let updateCart;
  if (req.headers.token) {
    let getCustomer = jwt.verify(req.headers.token,secret)
		let customer_id = getCustomer.id
    console.log(customer_id)
    if (req.query.cartId) {
      let checkCart = await Cart.findOne({_id:req.query.cartId,is_added:1,is_active:0})
      console.log(checkCart)
      let newOrder = await Order.create({cart_id:req.query.cartId,payment_type:"Cash"})
      if (newOrder) {
        activeCart = await Cart.updateMany({_id:checkCart.id},{$set:{is_active:1}})
        activeCompOrder = await CompanyOrder.updateMany({cart_id:checkCart.id},{$set:{order_id:newOrder.id,is_active:1}})
        console.log('activeCompOrder')
        console.log(activeCompOrder)
      }
      else{
          res.send({message:"Something went wrong."})
      }
      let fetchCart = await Cart.find({_id:checkCart.id,is_active:1})
      res.send({orderId:newOrder._id,details:fetchCart})
    }
    else{
      res.send({message:"Please provide cartId"})
    }
  }
}

// Company Order List
const companyOrderList = async function(req,res){
  if (req.headers.token) {
    let getCompanyId = jwt.verify(req.headers.token,secret)
    let checkCompany = await Company.findOne({_id:getCompanyId.id},{name:1,gst_no:1,email:1,phoneno:1,address:1,area:1,city:1,pincode:1,is_active:1,is_verify:1})
    if (checkCompany) {
      let getOrders = await CompanyOrder.find({company_id:getCompanyId.id,is_active:1})
      let cartId = getOrders.map(x => x.cart_id)
      let fetchCart = await Cart.find({_id:cartId})
      let loopOrder = await fetchCart.map(async(li) => {
				let getServname = await Service.findOne({_id:li.service_id},{name:1})
				let getServType = await ServiceType.findOne({_id:li.service_type_id},{name:1,price:1})
				li._doc['service_name'] = getServname.name
				li._doc['service_type'] = getServType.name
				li._doc['price'] = getServType.price
				delete li['service_id']
				delete li['service_type_id']
				delete li['createdAt']
				delete li['updatedAt']
			})
			let loopResponse = await Promise.all(loopOrder)
      console.log('fetchCart')
			console.log(fetchCart)
      res.send({companyDetails:checkCompany,orderDetails:fetchCart})
    }
    else{
      res.send({message:"You are not allowed to see this list."})
    }
  }
  else{
      res.send({message:"Please provide token."})
  }
}

// Orders List to Super Admin View
const orderList = async function(req,res){
  if (req.headers.token) {
		let adminId = jwt.verify(req.headers.token,secret)
		let checkAdmin = await Admin.findOne({_id:adminId.id})
		if (checkAdmin) {
			let getOrders = await Order.find({is_active:1})
      let cartId = getOrders.map(x => x.cart_id)
      let fetchCart = await Cart.find({_id:cartId})
			let loopOrder = await fetchCart.map(async(li) => {
				let getServname = await Service.findOne({_id:li.service_id},{name:1})
				let getServType = await ServiceType.findOne({_id:li.service_type_id},{name:1,price:1})
				li._doc['service_name'] = getServname.name
				li._doc['service_type'] = getServType.name
				li._doc['price'] = getServType.price
				delete li['service_id']
				delete li['service_type_id']
				delete li['createdAt']
				delete li['updatedAt']
			})
			let loopResponse = await Promise.all(loopOrder)
			console.log(fetchCart)
			res.send({details:fetchCart})
		}else{
			res.send({message:"You are not allowed to see this list."})
		}
	}else{
		res.send({message:"Please provide token"})
	}
}

module.exports = {
  addtocart,
  myCart,
  placeOrder,
  companyOrderList,
  orderList
}
