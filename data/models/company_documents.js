const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanyDocumentSchema = new Schema({
	company_id:{
		type: String,
		required:true
	},
	image_url:{
		type: String,
		required:true
	},
	is_active: {
      type: Number,
      default:1,
			required:true
  },
});

module.exports = CompanyDocument = mongoose.model("company_documents", CompanyDocumentSchema);
