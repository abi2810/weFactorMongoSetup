const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanyOrderSchema = new Schema({
	cart_id:{
		type: String,
		required:true
	},
	order_id:{
		type: String,
		// required:true
	},
	company_id:{
		type: String,
		required:true
	},
	profession_id:{
		type: String,
		// required:true
	},
	customer_review:{
		type: String,
		required:false
	},
	status:{
		type: String,
		required:false
	},
	ratings:{
		type: String,
		required:false
	},
	ratings_desc:{
		type: String,
		required:false
	},
	is_active: {
      type: Number,
      default:0
    },
});

module.exports = CompanyOrder = mongoose.model("company_order", CompanyOrderSchema);
