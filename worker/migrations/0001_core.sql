-- Compass Phase A. SQLite / Cloudflare D1. Never write private data into GitHub Pages.
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY NOT NULL,
  owner_sub TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'inbox' CHECK (kind IN ('inbox')),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 1000),
  note TEXT NOT NULL DEFAULT '' CHECK (length(note) <= 10000),
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0,1)),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  updated_at TEXT NOT NULL,
  last_mutation_id TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_items_owner ON items(owner_sub, updated_at);
CREATE TABLE IF NOT EXISTS change_log (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_sub TEXT NOT NULL,
  item_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  changed_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_changes_owner_seq ON change_log(owner_sub, seq);
CREATE TABLE IF NOT EXISTS mutation_receipts (
  owner_sub TEXT NOT NULL,
  mutation_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  applied_version INTEGER NOT NULL,
  PRIMARY KEY(owner_sub, mutation_id)
);
CREATE TRIGGER IF NOT EXISTS item_created AFTER INSERT ON items BEGIN
  INSERT INTO change_log(owner_sub,item_id,version,changed_at)
    VALUES(NEW.owner_sub,NEW.id,NEW.version,NEW.updated_at);
  INSERT INTO mutation_receipts(owner_sub,mutation_id,item_id,applied_version)
    VALUES(NEW.owner_sub,NEW.last_mutation_id,NEW.id,NEW.version);
END;
CREATE TRIGGER IF NOT EXISTS item_updated AFTER UPDATE ON items BEGIN
  INSERT INTO change_log(owner_sub,item_id,version,changed_at)
    VALUES(NEW.owner_sub,NEW.id,NEW.version,NEW.updated_at);
  INSERT INTO mutation_receipts(owner_sub,mutation_id,item_id,applied_version)
    VALUES(NEW.owner_sub,NEW.last_mutation_id,NEW.id,NEW.version);
END;
