require('dotenv').config()
const { sequelize } = require('../config/db')
const { addNameNormalizedMigration } = require('./utils/addNameNormalizedMigration')

const migrations = [
  {
    id: '2026-01-18_products_fix_spaces_normalization',
    up: async () => {
      await addNameNormalizedMigration({
        sequelize,
        table: 'products',
        triggerPrefix: 'products',
      })
    },
  },
  {
    id: '2026-01-18_customers_fix_spaces_normalization',
    up: async () => {
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
      const already = await hasMigration(m.id)
      if (already) {
        console.log(`↩️  Skip ${m.id} (already applied)`)
        continue
      }

      console.log(`➡️  Apply ${m.id}`)
      await sequelize.transaction(async (t) => {
        await m.up(t)
      }).catch(async () => {
        // Certaines commandes comme CREATE EXTENSION n’aiment pas les transactions
        await m.up()
      })

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
