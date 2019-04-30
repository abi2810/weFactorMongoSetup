const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
	// id:{
	// 	type: DataTypes.INTEGER(11),
	// 	allowNull: false,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	name:{
		type: String,
		allowNull: false,
		primaryKey: false,
	},
	email:{
		type: String,
		allowNull: false,
		primaryKey: false,
	},
	password:{
		type: String,
		allowNull: false,
		primaryKey: false,
	},

});

module.exports = Admin = mongoose.model("admins", AdminSchema);
