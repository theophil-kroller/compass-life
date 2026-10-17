export const TASK_CATEGORIES=['Allgemein','Forschung','Lehre','Pruefungen','Verwaltung','Meeting','Weiterbildung','Familie','Beziehungsdynamiken'];
export const CATEGORY_LABELS={Pruefungen:'Prüfungen',Beziehungsdynamiken:'Counseling'};
export const WORKFLOWS=['next','waiting','hold'];
export const PROJECT_STATUSES=['active','hold','completed'];
export function prepareTasks(s){s.tasks??={};s.taskPending??={};s.taskVersions??={};s.taskConflicts??={};s.projects??={};s.projectPending??={};s.projectVersions??={};s.projectConflicts??={};return s;}
export const dateIsValid=s=>s==null||s===''||/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
export function parseTags(value){const arr=Array.isArray(value)?value:String(value||'').split(/[;,\n]+/);return [...new Set(arr.map(x=>String(x||'').trim().replace(/^#/,'').toLocaleLowerCase('de')).filter(x=>/^[\p{L}\p{N}][\p{L}\p{N} _-]{0,31}$/u.test(x)))].slice(0,12);}
export const validTags=t=>Array.isArray(t)&&t.length<=12&&t.every(x=>typeof x==='string'&&x.length>0&&x.length<=32&&/^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u.test(x));
export function validLocalTask(t){return Boolean(t&&typeof t.title==='string'&&t.title.trim()&&t.title.length<=180&&typeof (t.note||'')==='string'&&(t.note||'').length<=3000&&dateIsValid(t.plannedDate)&&dateIsValid(t.dueDate)&&TASK_CATEGORIES.includes(t.category)&&(!t.workflow||WORKFLOWS.includes(t.workflow))&&typeof t.flagged!=='string'&&(!t.projectId||/^[0-9a-f-]{36}$/i.test(t.projectId))&&validTags(t.tags??[])&&validTags(t.contextTags??[])&&dateIsValid(t.deferUntil)&&(t.estimateMinutes==null||(Number.isSafeInteger(t.estimateMinutes)&&t.estimateMinutes>=5&&t.estimateMinutes<=1440)));}
export const taskPlain=t=>({id:t.id,title:t.title,note:t.note||'',plannedDate:t.plannedDate||null,dueDate:t.dueDate||null,category:t.category,completed:!!t.completed,archived:!!t.archived,workflow:t.workflow||'next',flagged:!!t.flagged,projectId:t.projectId||null,tags:t.tags||[],deferUntil:t.deferUntil||null,contextTags:t.contextTags||[],estimateMinutes:t.estimateMinutes??null});
export const sameTask=(a,b)=>Boolean(a&&b&&JSON.stringify(taskPlain(a))===JSON.stringify(taskPlain(b)));
export function localDate(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
export function tasksForDay(state,day){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&(t.plannedDate===day||t.dueDate===day)).sort((a,b)=>Number(a.completed)-Number(b.completed)||a.title.localeCompare(b.title,'de'));}
export function dueTasks(state,limit=120){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&t.dueDate).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||a.title.localeCompare(b.title,'de')).slice(0,limit);}
export function nextActions(state,day=localDate()){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&(t.workflow||'next')==='next'&&(!t.deferUntil||t.deferUntil<=day)&&(!t.projectId||!state?.projects?.[t.projectId]||state.projects[t.projectId].status==='active')).sort((a,b)=>Number(!!b.flagged)-Number(!!a.flagged)||(a.dueDate||'9999').localeCompare(b.dueDate||'9999')||a.title.localeCompare(b.title,'de'));}
export function flaggedTasks(state){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&t.flagged).sort((a,b)=>a.title.localeCompare(b.title,'de'));}
export function heldTasks(state){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&['hold','waiting'].includes(t.workflow)).sort((a,b)=>a.title.localeCompare(b.title,'de'));}
export function projectTasks(state,id){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&t.projectId===id);}
export function contextsFor(state,context){const needle=String(context||'').trim().toLocaleLowerCase('de');return nextActions(state).filter(t=>(t.contextTags||[]).includes(needle));}
export function projectNeedsReview(project,day=localDate()){if(!project||project.status!=='active')return false;if(!project.reviewedAt)return true;const last=Date.parse(project.reviewedAt);if(!Number.isFinite(last))return true;const elapsed=(Date.parse(`${day}T12:00:00Z`)-last)/86400000;return elapsed>=Number(project.reviewIntervalDays||7);}
export function mergeTaskSnapshot(state,cloud){prepareTasks(state);for(const remote of cloud){const id=remote.id;const ver=state.taskVersions[id]||0;if(state.taskPending[id]||state.taskConflicts[id])continue;if(remote.version>=ver){state.tasks[id]=remote;state.taskVersions[id]=remote.version;}}}
export function validProject(p){return Boolean(p&&typeof p.title==='string'&&p.title.trim()&&p.title.length<=140&&typeof(p.outcome||'')==='string'&&(p.outcome||'').length<=800&&TASK_CATEGORIES.includes(p.category)&&PROJECT_STATUSES.includes(p.status||'active')&&dateIsValid(p.dueDate)&&Number.isSafeInteger(p.reviewIntervalDays??7)&&(p.reviewIntervalDays??7)>=1&&(p.reviewIntervalDays??7)<=90&&(!p.reviewedAt||!Number.isNaN(Date.parse(p.reviewedAt))));}
export const projectPlain=p=>({id:p.id,title:p.title,outcome:p.outcome||'',category:p.category||'Allgemein',status:p.status||'active',dueDate:p.dueDate||null,reviewIntervalDays:p.reviewIntervalDays??7,reviewedAt:p.reviewedAt||null});
export const sameProject=(a,b)=>Boolean(a&&b&&JSON.stringify(projectPlain(a))===JSON.stringify(projectPlain(b)));
export function mergeProjectSnapshot(state,cloud){prepareTasks(state);for(const remote of cloud){const id=remote.id,ver=state.projectVersions[id]||0;if(state.projectPending[id]||state.projectConflicts[id])continue;if(remote.version>=ver){state.projects[id]=remote;state.projectVersions[id]=remote.version;}}}
export function agendaForEvent(state,event){
 const title=String(event?.summary||'').normalize('NFKC').toLocaleLowerCase('de');
 const tokens=title.match(/[\p{L}\p{N}]+/gu)||[];
 const aliases=[...new Set([...tokens,...(title.match(/\buko\b/gu)||[])])];
 return [...Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed),...Object.values(state?.records||{}).filter(t=>!t.deleted)]
  .filter(x=>(x.tags||[]).some(tag=>{const key=String(tag).toLocaleLowerCase('de');return key.length>=3&&aliases.includes(key);}));
}
