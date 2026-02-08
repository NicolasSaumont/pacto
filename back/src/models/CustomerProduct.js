const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const CustomerProduct = sequelize.define('CustomerProduct', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },

  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },

}, {
  tableName: 'customer_products',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['customerId', 'product_id'] },
  ],
})

module.exports = CustomerProduct
