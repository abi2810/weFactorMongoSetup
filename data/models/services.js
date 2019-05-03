const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServiceSchema = new Schema({
	// id:{
	// 	type: DataTypes.INTEGER(11),
	// 	allowNull: false,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	category_id:{
		type: String,
		required:true
	},
	name:{
		type: String,
		required:true
		// autoIncrement: true
	},
	desc:{
		type: String
	},
	image_url:{
		type: String,
		required:true
	},
});

module.exports = Service = mongoose.model("services", ServiceSchema);
