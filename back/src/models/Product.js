const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

function normalizeName(str) {
  if (!str) return null
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/\s+/g, ' ')            // espaces multiples -> 1 espace
}

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
  },

  name_normalized: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
}, {
  tableName: 'products', // nom de la table dans PostgreSQL
  timestamps: true,      // ajoute createdAt / updatedAt automatiquement
  paranoid: true,        // active deletedAt
  deletedAt: 'deletedAt', // nom de la colonne pour soft delete

  hooks: {
    // couvre create + update
    beforeValidate: (product) => {
      // si name est présent, on (re)calcule name_normalized
      if (product.name) {
        product.name_normalized = normalizeName(product.name)
      }
    },
  },
})

module.exports = Product
