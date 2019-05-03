const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServiceTypeSchema = new Schema({
	// id:{
	// 	type: DataTypes.INTEGER(11),
	// 	allowNull: false,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	service_id:{
		type: String,
		required:true
	},
	name:{
		type: String,
		required:true
	},
	price:{
		type: String,
		required:true
	}
});

module.exports = ServiceType = mongoose.model("service_type", ServiceTypeSchema);
