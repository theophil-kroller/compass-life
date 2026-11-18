/** 0.5.91.59 · Presentational helpers; no side effects or network reads. */
export function overdueTask59(task,today){
 return Boolean(task&&!task.completed&&!task.archived&&typeof task.dueDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)&&task.dueDate<today);
}
export function todayTopToolbar59(collapsed){
 return `<button type="button" class="today59-top-toggle" data-action="today59-top-toggle" aria-expanded="${!collapsed}" aria-controls="today59-top-content"><span class="today59-top-title">📌 <strong>Hinweise &amp; Vorbereitung</strong><small>Lehre · Geburtstage · Familie · Mensa</small></span><span class="today59-top-action">${collapsed?'Einblenden ▾':'Ausblenden ▴'}</span></button>`;
}
