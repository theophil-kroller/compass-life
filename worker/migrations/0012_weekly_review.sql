-- One resumable Weekly Review per owner; task/project edits remain in existing GTD tables.
CREATE TABLE IF NOT EXISTS weekly_review_progress (
  owner_sub TEXT PRIMARY KEY NOT NULL,
  progress_json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
