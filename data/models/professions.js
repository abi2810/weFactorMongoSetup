const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfessionSchema = new Schema({
	company_id:{
		type: String,
		required:true
	},
	name:{
		type: String,
		required:true
	},
	email:{
		type: String
	},
	phoneno:{
		type: String,
		required:true
	},
	password:{
		type: String
	},
	services_known:{
		type: String
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
      default:1,
			required:true
  }
});

module.exports = Profession = mongoose.model("professions", ProfessionSchema);
