import {validFolderIcon} from './folder-icons-v35.js';
export const TASK_CATEGORIES=['Allgemein','Forschung','Lehre','Pruefungen','Verwaltung','Meeting','Weiterbildung','Familie','Beziehungsdynamiken'];
export const CATEGORY_LABELS={Pruefungen:'Prüfungen',Beziehungsdynamiken:'Counseling'};
export const WORKFLOWS=['next','waiting','hold'];
export const PROJECT_STATUSES=['active','hold','completed'];
export const PROJECT_KINDS=['project','folder'];
export const PROJECT_TYPES=['parallel','sequential','single'];
const uuid=/^[0-9a-f-]{36}$/i;
export const ordered=(xs)=>[...xs].sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||String(a.title||'').localeCompare(String(b.title||''),'de')||String(a.id).localeCompare(String(b.id)));
export function childProjects(state,parentId=null){return ordered(Object.values(state?.projects||{}).filter(p=>(p.parentId||null)===(parentId||null)));}
export function projectDescendantIds(state,projectId){const seen=new Set();const visit=id=>{for(const p of childProjects(state,id)){if(seen.has(p.id)||p.id===projectId)continue;seen.add(p.id);visit(p.id);}};visit(projectId);return seen;}
export function validProjectParent(state,id,parentId){if(!parentId)return true;return id!==parentId&&Boolean(state?.projects?.[parentId])&&!projectDescendantIds(state,id).has(parentId);}
export const isTemplateTask=(state,t)=>Boolean(t?.projectId&&state?.projects?.[t.projectId]?.isTemplate);
export function projectIsActive(state,projectId){const seen=new Set();let id=projectId;while(id){if(seen.has(id))return false;seen.add(id);const project=state?.projects?.[id];if(!project)return true;if(project.status!=='active'||project.isTemplate)return false;id=project.parentId||null;}return true;}
export function taskChildren(state,projectId,parentTaskId=null){return ordered(Object.values(state?.tasks||{}).filter(t=>!t.archived&&t.projectId===projectId&&(t.parentTaskId||null)===(parentTaskId||null)));}
export function validTaskParent(state,taskId,projectId,parentTaskId){if(!parentTaskId)return true;const parent=state?.tasks?.[parentTaskId];if(!parent||parent.archived||parent.projectId!==projectId||taskId===parentTaskId)return false;const seen=new Set([taskId]);let next=parent;while(next){if(seen.has(next.id))return false;seen.add(next.id);next=next.parentTaskId?state.tasks[next.parentTaskId]:null;}return true;}
export function hierarchicalProjectTasks(state,id){const result=[],seen=new Set();const items=projectTasks(state,id);const children=(parent)=>ordered(items.filter(t=>(t.parentTaskId||null)===parent));const visit=(t,depth)=>{if(seen.has(t.id))return;seen.add(t.id);result.push({...t,depth});for(const child of children(t.id))visit(child,depth+1)};for(const t of children(null))visit(t,0);for(const t of ordered(items))visit(t,0);return result;}
export function isActionAvailable(state,t,day=localDate()){
 if(t.archived||t.completed||isTemplateTask(state,t)||(t.workflow||'next')!=='next'||(t.deferUntil&&t.deferUntil>day))return false;
 if(t.projectId&&!projectIsActive(state,t.projectId))return false;
 if(t.parentTaskId){const parent=state?.tasks?.[t.parentTaskId];if(parent&&(!parent.projectId||parent.projectId!==t.projectId||parent.completed||parent.archived))return false;}
 if(Object.values(state?.tasks||{}).some(child=>!child.archived&&!child.completed&&child.parentTaskId===t.id))return false;
 if(t.projectId&&state?.projects?.[t.projectId]?.projectType==='sequential'){
   const siblings=taskChildren(state,t.projectId,t.parentTaskId||null).filter(x=>!x.completed);
   if(siblings.length&&siblings[0].id!==t.id)return false;
   let parentId=t.parentTaskId,guard=new Set([t.id]);
   while(parentId){if(guard.has(parentId))return false;guard.add(parentId);const parent=state.tasks[parentId];if(!parent)return false;const level=taskChildren(state,t.projectId,parent.parentTaskId||null).filter(x=>!x.completed);if(level.length&&level[0].id!==parent.id)return false;parentId=parent.parentTaskId;}
 }
 return true;
}
export function prepareTasks(s){s.tasks??={};s.taskPending??={};s.taskVersions??={};s.taskConflicts??={};s.projects??={};s.projectPending??={};s.projectVersions??={};s.projectConflicts??={};return s;}
export const dateIsValid=s=>s==null||s===''||/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
export function parseTags(value){const arr=Array.isArray(value)?value:String(value||'').split(/[;,\n]+/);return [...new Set(arr.map(x=>String(x||'').trim().replace(/^#/,'').toLocaleLowerCase('de')).filter(x=>/^[\p{L}\p{N}][\p{L}\p{N} _-]{0,31}$/u.test(x)))].slice(0,12);}
export const validTags=t=>Array.isArray(t)&&t.length<=12&&t.every(x=>typeof x==='string'&&x.length>0&&x.length<=32&&/^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u.test(x));
export const taskCounterValid=t=>{
 const target=t?.progressTarget??null, current=t?.progressCurrent??0;
 return target===null?current===0:Number.isSafeInteger(target)&&target>=1&&target<=100000&&Number.isSafeInteger(current)&&current>=0&&current<=target;
};
export function advanceTaskCounter(t,step){
 if(!taskCounterValid(t)||t.progressTarget==null||!Number.isSafeInteger(step)||Math.abs(step)!==1)return null;
 return Math.max(0,Math.min(t.progressTarget,(t.progressCurrent??0)+step));
}
export function validLocalTask(t){return Boolean(taskCounterValid(t)&&t&&typeof t.title==='string'&&t.title.trim()&&t.title.length<=180&&typeof (t.note||'')==='string'&&(t.note||'').length<=3000&&dateIsValid(t.plannedDate)&&dateIsValid(t.dueDate)&&TASK_CATEGORIES.includes(t.category)&&(!t.workflow||WORKFLOWS.includes(t.workflow))&&typeof t.flagged!=='string'&&(!t.projectId||/^[0-9a-f-]{36}$/i.test(t.projectId))&&validTags(t.tags??[])&&validTags(t.contextTags??[])&&dateIsValid(t.deferUntil)&&(!t.parentTaskId||uuid.test(t.parentTaskId))&&(t.sortOrder==null||(Number.isSafeInteger(t.sortOrder)&&t.sortOrder>=0&&t.sortOrder<=1000000))&&(t.estimateMinutes==null||(Number.isSafeInteger(t.estimateMinutes)&&t.estimateMinutes>=5&&t.estimateMinutes<=1440)));}
export const taskPlain=t=>({id:t.id,title:t.title,note:t.note||'',plannedDate:t.plannedDate||null,dueDate:t.dueDate||null,category:t.category,completed:!!t.completed,archived:!!t.archived,workflow:t.workflow||'next',flagged:!!t.flagged,projectId:t.projectId||null,tags:t.tags||[],deferUntil:t.deferUntil||null,contextTags:t.contextTags||[],estimateMinutes:t.estimateMinutes??null,parentTaskId:t.parentTaskId||null,sortOrder:t.sortOrder??0,progressCurrent:t.progressCurrent??0,progressTarget:t.progressTarget??null});
export const sameTask=(a,b)=>Boolean(a&&b&&JSON.stringify(taskPlain(a))===JSON.stringify(taskPlain(b)));
export function localDate(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
export function tasksForDay(state,day){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!isTemplateTask(state,t)&&(t.plannedDate===day||t.dueDate===day)).sort((a,b)=>Number(a.completed)-Number(b.completed)||a.title.localeCompare(b.title,'de'));}
export function dueTasks(state,limit=120){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!isTemplateTask(state,t)&&!t.completed&&t.dueDate).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||a.title.localeCompare(b.title,'de')).slice(0,limit);}
export function nextActions(state,day=localDate()){return Object.values(state?.tasks||{}).filter(t=>isActionAvailable(state,t,day)).sort((a,b)=>Number(!!b.flagged)-Number(!!a.flagged)||(a.dueDate||'9999').localeCompare(b.dueDate||'9999')||a.title.localeCompare(b.title,'de'));}
export function flaggedTasks(state){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!isTemplateTask(state,t)&&!t.completed&&t.flagged===true).sort((a,b)=>a.title.localeCompare(b.title,'de'));}
export function heldTasks(state){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!isTemplateTask(state,t)&&!t.completed&&['hold','waiting'].includes(t.workflow)).sort((a,b)=>a.title.localeCompare(b.title,'de'));}
export function blockedByProject(state){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!isTemplateTask(state,t)&&!t.completed&&(t.workflow||'next')==='next'&&t.projectId&&!projectIsActive(state,t.projectId)).sort((a,b)=>a.title.localeCompare(b.title,'de'));}
export const isDreamRecord=r=>!r?.deleted&&Array.isArray(r?.tags)&&r.tags.some(tag=>String(tag).toLowerCase()==='dreams');
export const dreamRecords=state=>Object.values(state?.records||{}).filter(isDreamRecord).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
export const inboxRecords=state=>Object.values(state?.records||{}).filter(r=>!r.deleted&&!isDreamRecord(r)).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
export function projectTasks(state,id){return Object.values(state?.tasks||{}).filter(t=>!t.archived&&t.projectId===id);}
export function contextsFor(state,context){const needle=String(context||'').trim().toLocaleLowerCase('de');return nextActions(state).filter(t=>(t.contextTags||[]).includes(needle));}
export function projectNeedsReview(project,day=localDate()){if(!project||project.isTemplate||project.status!=='active'||project.kind==='folder')return false;if(!project.reviewedAt)return true;const last=Date.parse(project.reviewedAt);if(!Number.isFinite(last))return true;const elapsed=(Date.parse(`${day}T12:00:00Z`)-last)/86400000;return elapsed>=Number(project.reviewIntervalDays||7);}
export function mergeTaskSnapshot(state,cloud){prepareTasks(state);for(const remote of cloud){const id=remote.id;const ver=state.taskVersions[id]||0;if(state.taskPending[id]||state.taskConflicts[id])continue;if(remote.version>=ver){state.tasks[id]=remote;state.taskVersions[id]=remote.version;}}}
export function validProject(p){return Boolean(p&&typeof p.title==='string'&&p.title.trim()&&p.title.length<=140&&typeof(p.outcome||'')==='string'&&(p.outcome||'').length<=800&&TASK_CATEGORIES.includes(p.category)&&PROJECT_STATUSES.includes(p.status||'active')&&PROJECT_KINDS.includes(p.kind||'project')&&PROJECT_TYPES.includes(p.projectType||'parallel')&&validFolderIcon(p.folderIcon)&&((p.kind||'project')==='folder'||p.folderIcon==null)&&(p.isTemplate===undefined||typeof p.isTemplate==='boolean')&&(!(p.isTemplate===true)||p.kind==='project')&&(!p.parentId||uuid.test(p.parentId))&&(p.sortOrder==null||(Number.isSafeInteger(p.sortOrder)&&p.sortOrder>=0&&p.sortOrder<=1000000))&&dateIsValid(p.dueDate)&&Number.isSafeInteger(p.reviewIntervalDays??7)&&(p.reviewIntervalDays??7)>=1&&(p.reviewIntervalDays??7)<=90&&(!p.reviewedAt||!Number.isNaN(Date.parse(p.reviewedAt))));}
export const projectPlain=p=>({id:p.id,title:p.title,outcome:p.outcome||'',category:p.category||'Allgemein',status:p.status||'active',dueDate:p.dueDate||null,reviewIntervalDays:p.reviewIntervalDays??7,reviewedAt:p.reviewedAt||null,kind:p.kind||'project',folderIcon:p.kind==='folder'?(p.folderIcon||'folder'):null,projectType:p.projectType||'parallel',parentId:p.parentId||null,sortOrder:p.sortOrder??0,isTemplate:!!p.isTemplate});
export const sameProject=(a,b)=>Boolean(a&&b&&JSON.stringify(projectPlain(a))===JSON.stringify(projectPlain(b)));
export function mergeProjectSnapshot(state,cloud){prepareTasks(state);for(const remote of cloud){const id=remote.id,ver=state.projectVersions[id]||0;if(state.projectPending[id]||state.projectConflicts[id])continue;if(remote.version>=ver){state.projects[id]=remote;state.projectVersions[id]=remote.version;}}}
export function agendaForEvent(state,event){
 const title=String(event?.summary||'').normalize('NFKC').toLocaleLowerCase('de');
 const tokens=title.match(/[\p{L}\p{N}]+/gu)||[];
 const aliases=[...new Set([...tokens,...(title.match(/\buko\b/gu)||[])])];
 return [...Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed),...Object.values(state?.records||{}).filter(t=>!t.deleted)]
  .filter(x=>(x.tags||[]).some(tag=>{const key=String(tag).toLocaleLowerCase('de');return key.length>=3&&aliases.includes(key);}));
}
