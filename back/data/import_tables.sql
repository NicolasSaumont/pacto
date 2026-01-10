
BEGIN;

DROP TABLE IF EXISTS 
"save",
"tag",
"zone",
"character",
"family_item",
"item",
"skill",
"progress_flag",
"character_has_item",
"character_has_skill",
"character_has_progress_flag",
"zone_require_item",
"zone_require_skill",
"zone_require_progress_flag";

-- -----------------------------------------------------
-- Table "save"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "save" (
  "id" serial PRIMARY KEY,
  "slot" integer NOT NULL CHECK (slot BETWEEN 0 AND 2) UNIQUE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

-- -----------------------------------------------------
-- Table "zone"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "zone" (
  "id" serial PRIMARY KEY,
  "code" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "background_image" varchar(255),
  "music_theme" varchar(255),
  "is_time_running" boolean NOT NULL DEFAULT FALSE,
  "age_access" text CHECK (age_access IN ('young', 'adult')) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

-- -----------------------------------------------------
-- Table "character"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "character" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "max_health" integer NOT NULL DEFAULT 12,
  "current_health" integer NOT NULL DEFAULT 12,
  "max_mana" integer,
  "current_mana" integer,
  "is_young" boolean NOT NULL DEFAULT TRUE,
  "position_x" integer NOT NULL DEFAULT 0,
  "position_y" integer NOT NULL DEFAULT 0,
  "save_id" integer NOT NULL REFERENCES "save"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

-- -----------------------------------------------------
-- Table "family_item"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "family_item" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "age_access" text CHECK (age_access IN ('young', 'adult', 'both')) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

-- -----------------------------------------------------
-- Table "item"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "item" (
  "id" serial PRIMARY KEY,
  "code" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "family_item_id" integer NOT NULL REFERENCES "family_item"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

-- -----------------------------------------------------
-- Table "skill"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "skill" (
  "id" serial PRIMARY KEY,
  "code" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

-- -----------------------------------------------------
-- Table "progress_flag"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "progress_flag" (
  "id" serial PRIMARY KEY,
  "code" varchar(255) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz
);

-- -----------------------------------------------------
-- Table "character_has_item"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "character_has_item" (
  "id" serial PRIMARY KEY,
  "character_id" integer NOT NULL REFERENCES "character"("id") ON DELETE CASCADE,
  "item_id" integer NOT NULL REFERENCES "item"("id") ON DELETE CASCADE,
  "quantity" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz,
  UNIQUE ("character_id", "item_id")
);

-- -----------------------------------------------------
-- Table "character_has_skill"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "character_has_skill" (
  "id" serial PRIMARY KEY,
  "character_id" integer NOT NULL REFERENCES "character"("id") ON DELETE CASCADE,
  "skill_id" integer NOT NULL REFERENCES "skill"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz,
  UNIQUE ("character_id", "skill_id")
);

-- -----------------------------------------------------
-- Table "character_has_progress_flag"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "character_has_progress_flag" (
  "id" serial PRIMARY KEY,
  "character_id" integer NOT NULL REFERENCES "character"("id") ON DELETE CASCADE,
  "progress_flag_id" integer NOT NULL REFERENCES "progress_flag"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz,
  UNIQUE ("character_id", "progress_flag_id")
);

-- -----------------------------------------------------
-- Table "zone_require_item"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "zone_require_item" (
  "id" serial PRIMARY KEY,
  "zone_id" integer NOT NULL REFERENCES "zone"("id") ON DELETE CASCADE,
  "item_id" integer NOT NULL REFERENCES "item"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz,
  UNIQUE ("zone_id", "item_id")
);

-- -----------------------------------------------------
-- Table "zone_require_skill"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "zone_require_skill" (
  "id" serial PRIMARY KEY,
  "zone_id" integer NOT NULL REFERENCES "zone"("id") ON DELETE CASCADE,
  "skill_id" integer NOT NULL REFERENCES "skill"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz,
  UNIQUE ("zone_id", "skill_id")
);

-- -----------------------------------------------------
-- Table "zone_require_progress_flag"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "zone_require_progress_flag" (
  "id" serial PRIMARY KEY,
  "zone_id" integer NOT NULL REFERENCES "zone"("id") ON DELETE CASCADE,
  "progress_flag_id" integer NOT NULL REFERENCES "progress_flag"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz,
  UNIQUE ("zone_id", "progress_flag_id")
);

COMMIT;