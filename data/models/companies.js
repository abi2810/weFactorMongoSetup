const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanySchema = new Schema({
	name:{
		type: String,
		required:true
	},
	gst_no:{
		type: String,
		required:true
	},
	registration_package_id:{
		type: String,
	},
	email:{
		type: String,
		required:true
	},
	phoneno:{
		type: String,
		required:true
	},
	password:{
		type: String,
		required:true
	},
	services_known:{
		type: String
	},
	address:{
		type: String,
		required:true
	},
	area:{
		type: String,
		required:true
	},
	city:{
		type: String,
		required:true
	},
	pincode:{
		type: Number,
		required:true
	},
	is_active: {
      type: Number,
      default:1,
			required:true
  },
  is_verify: {
      type: Number,
      default:0,
			required:true
  }
});

module.exports = Company = mongoose.model("companies", CompanySchema);
