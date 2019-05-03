const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfessionOrderSchema = new Schema({
	// id:{
	// 	type: DataTypes.INTEGER(11),
	// 	allowNull: false,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	order_id:{
		type: String,
		required:true
	},
	profession_id:{
		type: String,
		required:true
	},
	customer_review:{
		type: String,
		required:false
	},
	status:{
		type: String,
		required:false
	},
	ratings:{
		type: String,
		required:false
	},
	ratings_desc:{
		type: String,
		required:false
	},
	is_active: {
      type: Number,
      default:1
    },
});

module.exports = ProfessionOrder = mongoose.model("profession_order", ProfessionOrderSchema);
