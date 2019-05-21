const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanyServiceSchema = new Schema({
	compnay_category_id:{
		type: String,
		required:true
	},
	service_id:{
		type: String,
		required:true
	},
	// name:{
	// 	type: String,
	// 	required:true
	// 	// autoIncrement: true
	// },
	// desc:{
	// 	type: String
	// },
	// image_url:{
	// 	type: String,
	// 	required:true
	// },
});

module.exports = CompanyService = mongoose.model("company_services", CompanyServiceSchema);
