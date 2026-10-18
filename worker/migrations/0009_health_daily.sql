-- Compass 0.5.1: additive health summaries, pairing and revocation.
-- No raw heart-rate series, GPS trails or identifiers from Health Connect.
CREATE TABLE IF NOT EXISTS health_pair_codes (
  code_hash TEXT PRIMARY KEY, owner_sub TEXT NOT NULL, expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_health_pair_owner ON health_pair_codes(owner_sub);
CREATE TABLE IF NOT EXISTS health_devices (
  token_hash TEXT PRIMARY KEY, owner_sub TEXT NOT NULL, label TEXT NOT NULL,
  created_at TEXT NOT NULL, revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_health_device_owner ON health_devices(owner_sub);
CREATE TABLE IF NOT EXISTS health_daily (
  owner_sub TEXT NOT NULL, day TEXT NOT NULL,
  steps INTEGER, sleep_minutes INTEGER, exercise_minutes INTEGER,
  source TEXT NOT NULL DEFAULT 'health-connect', updated_at TEXT NOT NULL,
  PRIMARY KEY(owner_sub,day)
);
CREATE INDEX IF NOT EXISTS idx_health_daily_day ON health_daily(owner_sub,day DESC);
