const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Product = sequelize.define('Product', {
  // --- Clé primaire auto-incrémentée ---
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  
}, {
  tableName: 'products', // nom de la table dans PostgreSQL
  timestamps: true,      // ajoute createdAt / updatedAt automatiquement
  paranoid: true,        // active deletedAt
  deletedAt: 'deletedAt' // nom de la colonne pour soft delete
})

module.exports = Product
