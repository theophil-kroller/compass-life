-- Planned tasks and true deadlines, separate from undated Inbox captures.
-- Version checks prevent a stale device from overwriting newer task edits.
CREATE TABLE IF NOT EXISTS planning_tasks (
  owner_sub TEXT NOT NULL,
  id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  planned_date TEXT,
  due_date TEXT,
  category TEXT NOT NULL DEFAULT 'Allgemein',
  completed INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (owner_sub,id)
);
CREATE INDEX IF NOT EXISTS idx_planning_owner_due ON planning_tasks(owner_sub,due_date);
CREATE INDEX IF NOT EXISTS idx_planning_owner_plan ON planning_tasks(owner_sub,planned_date);
