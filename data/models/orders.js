const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
	cart_id:{
		type: String,
		required:true
	},
	address_id:{
		type: String,
		required:true
	},
	payment_type:{
		type:String
	},
	status:{
		type: String
	},
	schedule_date:{
		type: String,
		required:true
	},
	schedule_time:{
		type: String,
		required:true
	},
	is_paid: {
			type: Number,
			default:0
	},
	is_active: {
      type: Number,
      default:1
  }
});

module.exports = Order = mongoose.model("orders", OrderSchema);
