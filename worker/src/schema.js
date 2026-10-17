// Read-only schema readiness check. Distinguishes incomplete prior migrations
// from 0.4.3's additive migration so the UI never silently writes to an
// incompatible Worker/D1 database.
const REQUIRED = {
  items: ['id', 'tags_json'],
  planning_tasks: ['id', 'workflow', 'flagged', 'project_id', 'tags_json', 'defer_until', 'context_tags_json', 'estimate_minutes'],
  planning_projects: ['id', 'review_interval_days', 'reviewed_at'],
};
export async function schemaStatus(db) {
  try {
    const missing = [];
    for (const [table, fields] of Object.entries(REQUIRED)) {
      const {results=[]} = await db.prepare(`PRAGMA table_info(${table})`).all();
      const existing = new Set(results.map(r => r.name));
      for (const field of fields) if (!existing.has(field)) missing.push(`${table}.${field}`);
    }
    let requiredMigration = null;
    if (missing.length) {
      if (missing.some(x => ['items.id', 'planning_tasks.id'].includes(x))) requiredMigration = '0001–0004';
      else if (missing.some(x => ['items.tags_json', 'planning_tasks.workflow', 'planning_tasks.flagged', 'planning_tasks.project_id', 'planning_tasks.tags_json', 'planning_projects.id'].includes(x))) requiredMigration = '0005';
      else requiredMigration = '0006';
    }
    return {ready: missing.length===0, requiredMigration, missing};
  } catch {
    return {ready:false, requiredMigration:'0001–0006', missing:[]};
  }
}
