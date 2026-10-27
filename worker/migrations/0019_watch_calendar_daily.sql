-- Short-lived, minimal calendar metadata for the paired CompassWatch.
-- Originates from the owner's already saved Compass Calendar archive.
CREATE TABLE IF NOT EXISTS watch_calendar_daily (
  owner_sub TEXT NOT NULL,
  day TEXT NOT NULL,
  events_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(owner_sub, day)
);
