const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RegistartionPackageSchema = new Schema({
	name:{
		type: String,
		required:true
	},
	price:{
		type: String,
		required:true
	},
	desc:{
		type: String
	},
	is_active:{
		type: Number,
		default: 1
	}
});

module.exports = RegistartionPackage = mongoose.model("registartion_package", RegistartionPackageSchema);
