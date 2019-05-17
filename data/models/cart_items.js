const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartItemSchema = new Schema({
	service_id:{
		type: String,
		required:true
	},
	service_type_id:{
		type: String,
		required:true
	},
	cart_id:{
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
	is_added: {
      type: Number,
      default:1
  },
	is_active: {
      type: Number,
      default:0
  }
});

module.exports = CartItem = mongoose.model("cart_items", CartItemSchema);
