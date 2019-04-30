const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
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
	email:{
		type: String,
    required:true
	},
	password:{
		type:String,
		required:true
	},
	phoneno:{
		type: String,
		required:true
	},
	image_url:{
		type: String,
	},
	is_active: {
      type: Number,
      // required:true,
      default: 1
    },
  is_email_verify: {
      type: Number,
      default: 1
  },
});

module.exports = Customer = mongoose.model("customers", CustomerSchema)
