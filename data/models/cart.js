const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
	service_id:{
		type: String,
		required:true
	},
	service_type_id:{
		type: String,
		required:true
	},
	customer_id:{
		type: String,
		required:true
	},
	address_id:{
		type: String,
		required:true
	},
	status:{
		type: String,
		required:false
	},
	payment_type:{
		type: String,
	},
	schedule_date:{
		type: String,
		required:true
	},
	schedule_time:{
		type: String,
		required:true
	},
	is_added: {
      type: Number,
      default:1
  },
	is_active: {
      type: Number,
      default:0
  }
});

module.exports = Cart = mongoose.model("cart", CartSchema);
