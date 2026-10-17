-- Compass Watch bridge. Deploy this idempotent schema BEFORE worker 0.3.0.
CREATE TABLE IF NOT EXISTS watch_pair_codes (
  code_hash TEXT PRIMARY KEY NOT NULL,
  owner_sub TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_watch_pairs_owner ON watch_pair_codes(owner_sub);
CREATE TABLE IF NOT EXISTS watch_pair_attempts (
  ip_hash TEXT PRIMARY KEY NOT NULL,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS watch_devices (
  token_hash TEXT PRIMARY KEY NOT NULL,
  owner_sub TEXT NOT NULL,
  device_label TEXT NOT NULL,
  created_at TEXT NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_watch_devices_owner ON watch_devices(owner_sub);
CREATE TABLE IF NOT EXISTS watch_sessions (
  owner_sub TEXT NOT NULL,
  session_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  activity TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  duration_sec INTEGER NOT NULL,
  focus_sec INTEGER NOT NULL,
  break_sec INTEGER NOT NULL,
  pomodoros INTEGER NOT NULL,
  hr_samples_json TEXT NOT NULL,
  bb_samples_json TEXT NOT NULL,
  body_battery_start INTEGER,
  body_battery_end INTEGER,
  received_at TEXT NOT NULL,
  PRIMARY KEY(owner_sub, session_id)
);
CREATE INDEX IF NOT EXISTS idx_watch_sessions_start ON watch_sessions(owner_sub, started_at DESC);
