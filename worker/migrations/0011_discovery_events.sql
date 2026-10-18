-- 0.5.3: per-user event catalog, review preferences, deletion tombstones and optimistic versions.
CREATE TABLE IF NOT EXISTS discovery_events (
 owner_sub TEXT NOT NULL,
 event_key TEXT NOT NULL,
 event_json TEXT,
 status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','saved','hidden')),
 removed INTEGER NOT NULL DEFAULT 0 CHECK(removed IN (0,1)),
 version INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL,
 PRIMARY KEY(owner_sub,event_key)
);
CREATE INDEX IF NOT EXISTS idx_discovery_events_owner ON discovery_events(owner_sub,updated_at);
