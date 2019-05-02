const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
	// id:{
	// 	type: DataTypes.INTEGER(11),
	// 	allowNull: false,
	// 	primaryKey: true,
	// 	autoIncrement: true
	// },
	service_id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: false,
		autoIncrement: false
	},
	service_type_id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: false,
		autoIncrement: false
	},
	customer_id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: false,
		autoIncrement: false
	},
	status:{
		type: DataTypes.STRING(1000),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	payment_type:{
		type: DataTypes.STRING(100),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	schedule_date:{
		type: DataTypes.STRING(100),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	schedule_time:{
		type: DataTypes.STRING(100),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	is_added: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
  },
	is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
  }
});

module.exports = Order = mongoose.model("orders", OrderSchema);
