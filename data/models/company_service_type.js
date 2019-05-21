const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanyServiceTypeSchema = new Schema({
	company_service_id:{
		type: String,
		required:true
	},
	service_type_id:{
		type: String,
		required:true
	},
	// name:{
	// 	type: String,
	// 	required:true
	// },
	price:{
		type: String,
		required:true
	}
});

module.exports = CompanyServiceType = mongoose.model("company_service_type", CompanyServiceTypeSchema);
