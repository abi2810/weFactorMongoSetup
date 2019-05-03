const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfessionCategorySchema = new Schema({
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
	profession_id:{
		type: String,
		required:true
	},
	is_active: {
      type: Number,
      default:1
  }
});

module.exports = ProfessionCategory = mongoose.model("profession_category", ProfessionCategorySchema);
