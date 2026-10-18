-- 0.4.10: prevent a Garmin retry from recreating an intentionally purged session.
CREATE TABLE IF NOT EXISTS watch_deleted_sessions (
 owner_sub TEXT NOT NULL,
 session_id TEXT NOT NULL,
 deleted_at TEXT NOT NULL,
 PRIMARY KEY (owner_sub, session_id)
);
