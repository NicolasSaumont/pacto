async function addNameNormalizedMigration({
  sequelize,
  table,
  triggerPrefix,
}) {
  // extension
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`)

  // colonne
  await sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='${table}'
          AND column_name='name_normalized'
      ) THEN
        ALTER TABLE ${table} ADD COLUMN name_normalized text;
      END IF;
    END$$;
  `)

  // backfill
  await sequelize.query(`
    UPDATE ${table}
    SET name_normalized = lower(unaccent(name))
    WHERE name IS NOT NULL
      AND (name_normalized IS NULL OR name_normalized = '');
  `)

  // fonction trigger
  await sequelize.query(`
    CREATE OR REPLACE FUNCTION ${triggerPrefix}_set_name_normalized()
    RETURNS trigger AS $$
    BEGIN
      NEW.name_normalized := lower(unaccent(NEW.name));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  // trigger
  await sequelize.query(`
    DROP TRIGGER IF EXISTS trg_${triggerPrefix}_name_normalized ON ${table};
    CREATE TRIGGER trg_${triggerPrefix}_name_normalized
    BEFORE INSERT OR UPDATE OF name ON ${table}
    FOR EACH ROW
    EXECUTE FUNCTION ${triggerPrefix}_set_name_normalized();
  `)

  // index unique partiel
  await sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS ${table}_name_unique_normalized
    ON ${table} (name_normalized)
    WHERE "deletedAt" IS NULL;
  `)

  // NOT NULL
  await sequelize.query(`
    ALTER TABLE ${table}
    ALTER COLUMN name_normalized SET NOT NULL;
  `)
}

module.exports = { addNameNormalizedMigration }
