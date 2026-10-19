-- Compass 0.5.35: optional, server-validated project folder symbol.
-- Existing folders default to the normal folder icon.
ALTER TABLE planning_projects ADD COLUMN folder_icon TEXT;
