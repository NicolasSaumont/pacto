save(
  id SERIAL PRIMARY KEY,
  slot INTEGER NOT NULL CHECK (slot BETWEEN 1 AND 3),
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  UNIQUE(user_id, slot)
)

zone (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  background_image VARCHAR(255),
  music_theme VARCHAR(255),
  is_time_running BOOLEAN NOT NULL DEFAULT FALSE,
  age_access text CHECK (age_variant IN ('young', 'adult')) NOT NULL,
)

character(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  max_health INTEGER NOT NULL DEFAULT 12,
  current_health INTEGER NOT NULL DEFAULT 12,
  max_mana INTEGER NOT NULL DEFAULT 0,
  current_mana INTEGER NOT NULL DEFAULT 0,
  is_young BOOLEAN NOT NULL DEFAULT TRUE,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  save_id INTEGER NOT NULL REFERENCES save(id) ON DELETE CASCADE
)

family_item(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age_access text CHECK (age_variant IN ('young', 'adult', 'both')) NOT NULL,
)

item(
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  family_item_id INTEGER NOT NULL REFERENCES family_item(id) ON DELETE CASCADE
)

skill(
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
)

progress_flag(
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
)

/** Tables de liaison */

character_has_item(
  character_id INTEGER REFERENCES character(id),
  item_id INTEGER REFERENCES item(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (character_id, item_id)
)

character_has_skill(
  character_id INTEGER REFERENCES character(id),
  skill_id INTEGER REFERENCES skill(id),
  PRIMARY KEY (character_id, skill_id)
)

character_has_progress_flag(
  character_id INTEGER REFERENCES character(id),
  progress_flag_id INTEGER REFERENCES progress_flag(id),
  PRIMARY KEY (character_id, progress_flag_id)
)

zone_require_item(
  zone_id INTEGER REFERENCES zone(id),
  item_id INTEGER REFERENCES item(id),
  PRIMARY KEY (zone_id, item_id)
)

zone_require_skill(
  zone_id INTEGER REFERENCES zone(id),
  skill_id INTEGER REFERENCES skill(id),
  PRIMARY KEY (zone_id, skill_id)
)

zone_require_progress_flag(
  zone_id INTEGER REFERENCES zone(id),
  progress_flag_id INTEGER REFERENCES progress_flag(id),
  PRIMARY KEY (zone_id, progress_flag_id)
)
