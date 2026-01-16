require('dotenv').config()
const { sequelize } = require('./config/db')

const migrations = [
  {
    id: '2026-01-14_products_name_normalized_unique',
    up: async () => {
      // 1) extension
      await sequelize.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`)

      // 2) colonne normalisée (idempotent via DO $$)
      await sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name='products' AND column_name='name_normalized'
          ) THEN
            ALTER TABLE products ADD COLUMN name_normalized text;
          END IF;
        END$$;
      `)

      // 3) backfill existant
      await sequelize.query(`
        UPDATE products
        SET name_normalized = lower(unaccent(name))
        WHERE name IS NOT NULL
          AND (name_normalized IS NULL OR name_normalized = '');
      `)

      // 4) fonction + trigger
      await sequelize.query(`
        CREATE OR REPLACE FUNCTION products_set_name_normalized()
        RETURNS trigger AS $$
        BEGIN
          NEW.name_normalized := lower(unaccent(NEW.name));
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `)

      await sequelize.query(`
        DROP TRIGGER IF EXISTS trg_products_name_normalized ON products;
        CREATE TRIGGER trg_products_name_normalized
        BEFORE INSERT OR UPDATE OF name ON products
        FOR EACH ROW
        EXECUTE FUNCTION products_set_name_normalized();
      `)

      // 5) index unique partiel (idempotent)
      await sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS products_name_unique_normalized
        ON products (name_normalized)
        WHERE "deletedAt" IS NULL;
      `)

      // 6) optionnel : NOT NULL si tu veux être strict
      await sequelize.query(`
        ALTER TABLE products
        ALTER COLUMN name_normalized SET NOT NULL;
      `)
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
  await sequelize.query(`INSERT INTO schema_migrations (id) VALUES (:id)`, {
    replacements: { id },
  })
}

;(async () => {
  try {
    console.log('🔧 Running migrations...')
    await ensureMigrationsTable()

    for (const m of migrations) {
      const already = await hasMigration(m.id)
      if (already) {
        console.log(`↩️  Skip ${m.id} (already applied)`)
        continue
      }

      console.log(`➡️  Apply ${m.id}`)
      await sequelize.transaction(async (t) => {
        // exécuter dans une transaction, sauf CREATE EXTENSION (ok ici)
        await m.up(t)
      }).catch(async () => {
        // fallback: certaines commandes (extension) aiment être hors transaction
        await m.up()
      })

      await markMigration(m.id)
      console.log(`✅ Applied ${m.id}`)
    }

    console.log('🎉 Migrations done.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Migration error:', err)
    process.exit(1)
  }
})()
