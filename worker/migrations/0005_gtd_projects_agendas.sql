-- 0.4.2: additive GTD fields; existing tasks and Inbox notes remain intact.
ALTER TABLE planning_tasks ADD COLUMN workflow TEXT NOT NULL DEFAULT 'next';
ALTER TABLE planning_tasks ADD COLUMN flagged INTEGER NOT NULL DEFAULT 0;
ALTER TABLE planning_tasks ADD COLUMN project_id TEXT;
ALTER TABLE planning_tasks ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]';
CREATE INDEX IF NOT EXISTS idx_planning_owner_project ON planning_tasks(owner_sub, project_id);
CREATE INDEX IF NOT EXISTS idx_planning_owner_workflow ON planning_tasks(owner_sub, workflow, flagged);
CREATE TABLE IF NOT EXISTS planning_projects (
  owner_sub TEXT NOT NULL,
  id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  outcome TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Allgemein',
  status TEXT NOT NULL DEFAULT 'active',
  due_date TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(owner_sub,id)
);
CREATE INDEX IF NOT EXISTS idx_projects_owner_status ON planning_projects(owner_sub,status);
-- Inbox tags use the existing item sync and version-conflict safeguards.
ALTER TABLE items ADD COLUMN tags_json TEXT NOT NULL DEFAULT '[]';
