require('dotenv').config()
const { sequelize } = require('../config/db')

const migrations = [
  {
    id: '2026-01-14_products_name_normalized_unique',
    up: async () => {
      const { addNameNormalizedMigration } = require('./utils/nameNormalized')
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
      const { addNameNormalizedMigration } = require('./utils/nameNormalized')
      await addNameNormalizedMigration({
        sequelize,
        table: 'customers',
        triggerPrefix: 'customers',
      })
    },
  },
]

async function ensureMigrationsTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `)
}

async function hasMigration(id) {
  const [rows] = await sequelize.query(
    `SELECT 1 FROM schema_migrations WHERE id = :id LIMIT 1`,
    { replacements: { id } }
  )
  return rows.length > 0
}

async function markMigration(id) {
  await sequelize.query(
    `INSERT INTO schema_migrations (id) VALUES (:id)`,
    { replacements: { id } }
  )
}

;(async () => {
  try {
    console.log('🐦 Migration...')
    await ensureMigrationsTable()

    for (const m of migrations) {
      if (await hasMigration(m.id)) {
        console.log(`↩️  Skip ${m.id}`)
        continue
      }

      console.log(`➡️  Apply ${m.id}`)
      await m.up()
      await markMigration(m.id)
      console.log(`✅ Applied ${m.id}`)
    }

    console.log('🎉 Migrations terminées')
    process.exit(0)
  } catch (err) {
    console.error('❌ Migration error:', err)
    process.exit(1)
  }
})()
