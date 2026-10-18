-- Compass 0.4.6: additive project/task hierarchy. Run exactly once after 0006.
-- Defaults preserve all pre-existing records as root-level parallel projects and tasks.
ALTER TABLE planning_projects ADD COLUMN kind TEXT NOT NULL DEFAULT 'project';
ALTER TABLE planning_projects ADD COLUMN project_type TEXT NOT NULL DEFAULT 'parallel';
ALTER TABLE planning_projects ADD COLUMN parent_id TEXT;
ALTER TABLE planning_projects ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_projects_owner_parent ON planning_projects(owner_sub,parent_id,sort_order);
ALTER TABLE planning_tasks ADD COLUMN parent_task_id TEXT;
ALTER TABLE planning_tasks ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_tasks_owner_parent ON planning_tasks(owner_sub,project_id,parent_task_id,sort_order);
