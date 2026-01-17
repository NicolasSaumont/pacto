require('dotenv').config()
const { sequelize } = require('../config/db')
const { addNameNormalizedMigration } = require('./utils/nameNormalized')

const migrations = [
  {
    id: '2026-01-14_products_name_normalized_unique',
    up: async () => {
      await addNameNormalizedMigration({
        sequelize,
        table: 'products',
        triggerPrefix: 'products',
      })
    },
  },
  {
    id: '2026-01-14_customers_name_normalized_unique',
    up: async () => {
      await addNameNormalizedMigration({
        sequelize,
        table: 'customers',
        triggerPrefix: 'customers',
      })
    },
  },
]
