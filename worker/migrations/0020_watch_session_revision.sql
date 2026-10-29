-- Compass .40.25.10 / Chrono .5.12.7
-- Historical sessions are immutable finalized records (revision 0).
-- New watch sessions may upload partial snapshots; a newer revision can replace
-- an unfinalized snapshot. Final records cannot be overwritten or resurrected.
ALTER TABLE watch_sessions ADD COLUMN revision INTEGER NOT NULL DEFAULT 0;
ALTER TABLE watch_sessions ADD COLUMN finalized INTEGER NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_watch_sessions_history
  ON watch_sessions(owner_sub,started_at DESC,session_id DESC);
