const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({
	customer_id:{
		type: String,
	},
	house_flat_no:{
		type: String,
		required:true
	},
	landmark:{
		type: String
	},
	place:{
		type: String,
		required:true
	},
	city:{
		type: String,
		required:true
	},
	pincode:{
		type: String,
		required:true
	},
  type:{
		type: String
	},
  lat:{
		type: String
	},
	lang:{
		type: String
	},
	is_active:{
		type: Number,
		default:1
	}
});

module.exports = Address = mongoose.model("address", AddressSchema);
