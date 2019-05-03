const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({
	// id:{
	// 	type: DataTypes.INTEGER(11),
	// 	allowNull: false,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	customer_id:{
		type: String,
	},
	house_flat_no:{
		type: String,
		required:true
	},
	landmark:{
		type: String
	},
  type:{
		type: String
	},
  lat:{
		type: String
	},lang:{
		type: String
	},

});

module.exports = Address = mongoose.model("address", AddressSchema);
