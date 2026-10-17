export const TASK_CATEGORIES=['Allgemein','Forschung','Lehre','Pruefungen','Verwaltung','Meeting','Weiterbildung','Familie','Beziehungsdynamiken'];
export const CATEGORY_LABELS={Pruefungen:'Prüfungen',Beziehungsdynamiken:'Counseling'};
export function prepareTasks(s){s.tasks??={};s.taskPending??={};s.taskVersions??={};s.taskConflicts??={};return s;}
export const dateIsValid=s=>s==null||s===''||/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
export function validLocalTask(t){return Boolean(t&&t.title?.trim()&&t.title.length<=180&&(t.note||'').length<=3000&&(t.plannedDate||t.dueDate)&&dateIsValid(t.plannedDate)&&dateIsValid(t.dueDate)&&TASK_CATEGORIES.includes(t.category));}
export const taskPlain=t=>({id:t.id,title:t.title,note:t.note||'',plannedDate:t.plannedDate||null,dueDate:t.dueDate||null,category:t.category,completed:!!t.completed,archived:!!t.archived});
export const sameTask=(a,b)=>Boolean(a&&b&&JSON.stringify(taskPlain(a))===JSON.stringify(taskPlain(b)));
export function localDate(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
export function tasksForDay(state,day){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&(t.plannedDate===day||t.dueDate===day)).sort((a,b)=>Number(a.completed)-Number(b.completed)||a.title.localeCompare(b.title,'de'));}
export function dueTasks(state,limit=120){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&t.dueDate).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||a.title.localeCompare(b.title,'de')).slice(0,limit);}
export function mergeTaskSnapshot(state,cloud){prepareTasks(state);for(const remote of cloud){const id=remote.id;const ver=state.taskVersions[id]||0;if(state.taskPending[id]||state.taskConflicts[id])continue;if(remote.version>=ver){state.tasks[id]=remote;state.taskVersions[id]=remote.version;}}}
