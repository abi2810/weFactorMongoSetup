const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanyCategorySchema = new Schema({
	category_id:{
		type: String,
		required:true
	},
	company_id:{
		type: String,
		required:true
	},
	is_requested: {
      type: Number,
      default:1,
			required:true
  },
	is_paid: {
      type: Number,
      default:0,
			required:true
  },
	is_verify: {
      type: Number,
      default:0,
			required:true
  },
});

module.exports = CompanyCategory = mongoose.model("company_category", CompanyCategorySchema);
