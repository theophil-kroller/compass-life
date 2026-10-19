-- Optional count-based progress for tasks, e.g. 12 of 36 examination papers graded.
-- Existing tasks are unaffected (no counter configured by default).
ALTER TABLE planning_tasks ADD COLUMN progress_current INTEGER NOT NULL DEFAULT 0;
ALTER TABLE planning_tasks ADD COLUMN progress_target INTEGER;
