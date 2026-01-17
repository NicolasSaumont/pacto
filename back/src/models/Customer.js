const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const { normalizeName } = require('../utils/normalize')

const Customer = sequelize.define('Customer', {
  // --- Clé primaire auto-incrémentée ---
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  name_normalized: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
}, {
  tableName: 'customers', // nom de la table dans PostgreSQL
  timestamps: true,       // ajoute createdAt / updatedAt automatiquement
  paranoid: true,         // active deletedAt
  deletedAt: 'deletedAt', // nom de la colonne pour soft delete

  hooks: {
    // couvre create + update
    beforeValidate: (customer) => {
      // si name est présent, on (re)calcule name_normalized
      if (customer.name) {
        customer.name_normalized = normalizeName(customer.name)
      }
    },
  },
})

module.exports = Customer
