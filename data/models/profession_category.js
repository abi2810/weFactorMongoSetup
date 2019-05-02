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
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: false,
		autoIncrement: false
	},
	profession_id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: false,
		autoIncrement: false
	},
	is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
  }
});

module.exports = ProfessionCategory = mongoose.model("profession_category", ProfessionCategorySchema);
