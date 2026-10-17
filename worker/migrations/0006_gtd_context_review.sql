-- Compass 0.4.3 – add-only migration. Apply AFTER 0005.
-- Do not rerun manually after successful execution.
ALTER TABLE planning_tasks ADD COLUMN defer_until TEXT;
ALTER TABLE planning_tasks ADD COLUMN context_tags_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE planning_tasks ADD COLUMN estimate_minutes INTEGER;
ALTER TABLE planning_projects ADD COLUMN review_interval_days INTEGER NOT NULL DEFAULT 7;
ALTER TABLE planning_projects ADD COLUMN reviewed_at TEXT;
