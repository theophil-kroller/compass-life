// Read-only schema readiness check. Distinguishes incomplete prior migrations
// from 0.4.3's additive migration so the UI never silently writes to an
// incompatible Worker/D1 database.
const REQUIRED = {
  items: ['id', 'tags_json'],
  planning_tasks: ['id', 'workflow', 'flagged', 'project_id', 'tags_json', 'defer_until', 'context_tags_json', 'estimate_minutes', 'parent_task_id', 'sort_order'],
  watch_deleted_sessions: ['owner_sub','session_id','deleted_at'],
  health_pair_codes: ['code_hash','owner_sub','expires_at'],
  health_devices: ['token_hash','owner_sub','revoked'],
  health_daily: ['owner_sub','day','steps','sleep_minutes','exercise_minutes'],
  discovery_events: ['owner_sub','event_key','event_json','status','removed','version'],
  widget_pair_codes: ['code_hash','owner_sub','expires_at'],
  widget_devices: ['token_hash','owner_sub','revoked'],
  weekly_review_progress: ['owner_sub','progress_json','version'],
  planning_projects: ['id', 'review_interval_days', 'reviewed_at', 'kind', 'project_type', 'parent_id', 'sort_order'],
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
      else if(missing.some(x => x.includes('defer_until') || x.includes('context_tags_json') || x.includes('review_interval_days'))) requiredMigration = '0006';
      else if(missing.some(x=>x.startsWith('watch_deleted_sessions.')))requiredMigration = '0008';
      else if(missing.some(x=>x.startsWith('health_')))requiredMigration = '0009';
      else if(missing.some(x=>x.startsWith('widget_')))requiredMigration = '0010';
      else if(missing.some(x=>x.startsWith('discovery_events.')))requiredMigration = '0011';
      else if(missing.some(x=>x.startsWith('weekly_review_progress.')))requiredMigration = '0012';
      else requiredMigration = '0007';
    }
    return {ready: missing.length===0, requiredMigration, missing};
  } catch {
    return {ready:false, requiredMigration:'0001–0012', missing:[]};
  }
}
