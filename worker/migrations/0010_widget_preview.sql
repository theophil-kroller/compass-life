-- Compass 0.5.2: separate read-only widget capability, not a full cloud session.
CREATE TABLE IF NOT EXISTS widget_pair_codes (
  code_hash TEXT PRIMARY KEY,
  owner_sub TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_widget_pair_owner ON widget_pair_codes(owner_sub);
CREATE TABLE IF NOT EXISTS widget_devices (
  token_hash TEXT PRIMARY KEY,
  owner_sub TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TEXT NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_widget_owner ON widget_devices(owner_sub);
