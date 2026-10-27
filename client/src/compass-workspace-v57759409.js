/** Compass .40.9: reusable Today ordering and task archive/trash views.
 * Task archive/trash use the existing synced `archived` field and legal tags;
 * no unsupported remote schema fields and no secret deletion claims.
 */
export const TASK_TRASH_TAG49='CompassPapierkorb';
export const TASK_PURGED_TAG49='CompassEntfernt';
export function todayOrdered49(items){
 return [...items].sort((a,b)=>Number(a.completed)-Number(b.completed)||
   ((a.sortOrder??0)>0?0:1)-((b.sortOrder??0)>0?0:1)||
   (a.sortOrder??0)-(b.sortOrder??0)||String(a.title||'').localeCompare(String(b.title||''),'de'));
}
export function todayMove49(state,day,id,delta){
 const items=todayOrdered49(Object.values(state?.tasks||{}).filter(t=>!t.archived&&
  (t.plannedDate===day||t.dueDate===day)&&!t.completed));
 const i=items.findIndex(t=>t.id===id),j=i+delta;
 if(i<0||j<0||j>=items.length)return [];
 [items[i],items[j]]=[items[j],items[i]];
 return items.map((t,n)=>({id:t.id,sortOrder:(n+1)*100}));
}
export function taskLife49(t){
 if(!t?.archived)return null;
 if((t.tags||[]).includes(TASK_PURGED_TAG49))return 'purged';
 return (t.tags||[]).includes(TASK_TRASH_TAG49)?'trash':'archived';
}
export function taskLifecycleView49(state,group,ico,escape){
 const archive=group==='archived';
 const tasks=Object.values(state?.tasks||{}).filter(t=>taskLife49(t)===group);
 return `<section class="p49-task-vault" aria-label="${archive?'Archivierte Aufgaben':'Aufgaben im Papierkorb'}"><h3>${ico('checkSquare',16)} ${archive?'Archivierte Aufgaben':'Aufgaben im Papierkorb'} · ${tasks.length}</h3>${tasks.map(t=>`<div class="p49-task-vault-row"><strong>${escape(t.title)}</strong><div><button type="button" data-action="task49-restore" data-id="${escape(t.id)}">Wiederherstellen</button>${archive?`<button type="button" data-action="task49-trash" data-id="${escape(t.id)}">Papierkorb</button>`:`<button type="button" class="p49-danger" data-action="task49-redact" data-id="${escape(t.id)}" title="Aufgabeninhalt entfernen, technische Synchronisationssperre bleibt">Inhalt endgültig entfernen</button>`}</div></div>`).join('')||'<small>Keine Aufgaben in diesem Bereich.</small>'}</section>`;
}
