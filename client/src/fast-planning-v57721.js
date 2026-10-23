/** 0.5.77.21 — narrow rollback checkpoint for fast GTD create/edit forms.
 * Do not copy financial, health, calendar or personal journal data when the
 * mutation only replaces a task/project entry and pending marker.
 * Callers must not use this for in-place modification of existing records.
 */
export function planningCheckpoint(state){
  return {
    tasks:{...(state.tasks||{})},projects:{...(state.projects||{})},
    taskPending:{...(state.taskPending||{})},projectPending:{...(state.projectPending||{})},
    recentTags:Array.isArray(state.recentTags)?[...state.recentTags]:state.recentTags
  };
}
export function restorePlanningCheckpoint(state,checkpoint){
  state.tasks=checkpoint.tasks;
  state.projects=checkpoint.projects;
  state.taskPending=checkpoint.taskPending;
  state.projectPending=checkpoint.projectPending;
  if(checkpoint.recentTags===undefined)delete state.recentTags;
  else state.recentTags=checkpoint.recentTags;
  return state;
}
/** Permit a paint between an optimistic DOM update and full-vault encryption.
 * If requestAnimationFrame is absent (e.g. tests), resolve on the next task.
 */
export function afterPlanningPaint({frame=typeof requestAnimationFrame==='function'?requestAnimationFrame:null,task=cb=>setTimeout(cb,0)}={}){
 return new Promise(resolve=>frame?frame(()=>task(resolve)):task(resolve));
}
