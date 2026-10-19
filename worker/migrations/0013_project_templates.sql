-- Compass 0.5.27 · a reusable project template is not an active commitment.
-- Run once before deploying the 0.5.27 Worker. Existing projects default to false.
ALTER TABLE planning_projects ADD COLUMN is_template INTEGER NOT NULL DEFAULT 0 CHECK(is_template IN (0,1));
CREATE INDEX IF NOT EXISTS idx_projects_owner_templates ON planning_projects(owner_sub,is_template);
