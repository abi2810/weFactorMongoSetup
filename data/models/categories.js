const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
	// id:{
	// 	type: DataTypes.INTEGER(11),
	// 	allowNull: false,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	name:{
		type: String,
		required:true
	},
	desc:{
		type: String,
		required:false
	},
	image_url:{
		type: String,
		required:true
	},
});

module.exports = Category = mongoose.model("categories", CategorySchema);
