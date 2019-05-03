var jwt = require('jsonwebtoken');
var secret = 'supersecret';

const Order = require('./../models/orders');
const Profession = require('./../models/professions');
const ProfessionOrder = require('./../models/profession_order');
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
      let newOrder = await Order.create({
        service_id: req.query.serviceId,
        service_type_id: req.query.serviceTypeId,
        customer_id: customerId.id,
        address_id: req.query.addressId,
        schedule_date: req.query.scheduleDate,
        schedule_time: req.query.scheduleTime
      })
      if (newOrder && req.query.professionId && req.query.pincode) {
        // let checkProf = await Profession.findOne({where:{id:req.query.professionId,pincode:req.query.pincode,is_active:1,is_verify:1}})
        let checkProf = await Profession.findOne({_id:req.query.professionId,pincode:req.query.pincode})
        console.log(checkProf)
        if (checkProf) {
          let sheduleProf = await ProfessionOrder.create({order_id:newOrder.id,profession_id:req.query.professionId})
          if (sheduleProf) {
            let updateOrder = await Order.update({_id: newOrder.id},{$set:{status:"Professional is scheduled for your request",is_active:1}})
            let updateProf = await ProfessionOrder.update({_id: sheduleProf.id},{$set:{status:"Scheduled"}})
          }else{
            res.send({message:"Problem in scheduling"})
          }
        }
        else{
          res.send({message:"No Profession found.Try again later."})
        }
      }else{
        res.send({message:"Pincode is missing"})
      }
      res.send({deatils:newOrder})
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
		let cartDet = await Order.find({customer_id:customer_id,status:"Professional is scheduled for your request"})

		let loopCart = await cartDet.map(async(li) => {
			let getServname = await Service.findOne({_id:li.service_id},{name:1})
			let getServType = await ServiceType.findOne({_id:li.service_type_id},{name:1,price:1})
      console.log(getServname.name)
      console.log(getServType)
			li['service_name'] = getServname.name
			li['service_type'] = getServType.name
			li['price'] = getServType.price
			// cartDet.push(hashDet)
			console.log(cartDet)
		})
		let loopResponse = await Promise.all(loopCart)
		res.send({details:cartDet})
	}
}

// Orders List to Admin View
const orderList = async function(req,res){
  if (req.headers.token) {
		let adminId = jwt.verify(req.headers.token,secret)
		let checkAdmin = await Admin.findOne({_id:adminId.id})
		if (checkAdmin) {
			let getOrders = await Order.find({is_active:1})
			let loopOrder = await getOrders.map(async(li) => {
				let getServname = await Service.findOne({_id:li.service_id},{name:1})
				let getServType = await ServiceType.findOne({_id:li.service_type_id},{name:1,price:1})
				li['service_name'] = getServname.name
				li['service_type'] = getServType.name
				li['price'] = getServType.price
				delete li['service_id']
				delete li['service_type_id']
				delete li['createdAt']
				delete li['updatedAt']
			})
			let loopResponse = await Promise.all(loopOrder)
			console.log(getOrders)
			res.send({details:getOrders})
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
  orderList
}
