const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Order = sequelize.define('Order', {
  // --- Clé primaire auto-incrémentée ---
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  
}, {
  tableName: 'orders',    // nom de la table dans PostgreSQL
  timestamps: true,       // ajoute createdAt / updatedAt automatiquement
  paranoid: true,         // active deletedAt
  deletedAt: 'deletedAt', // nom de la colonne pour soft delete
})

module.exports = Order
