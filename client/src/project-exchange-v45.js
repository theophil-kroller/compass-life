/** Compass Project Exchange v1: offline JSON plan with opt-in reviewed commit.
 * No content is transmitted to AI/services by this module. No evaluation or executable input.
 */
import {validProject,validLocalTask,TASK_CATEGORIES,projectPlain,taskPlain,projectDescendantIds,validProjectParent} from './tasks.js';
export const EXCHANGE_FORMAT='compass-project-exchange';
export const EXCHANGE_VERSION=1;
const clean=s=>String(s??'').trim();
const requireKey=k=>typeof k==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(k);
const isDate=s=>s==null||s===''||/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'));
const uuid=/^[0-9a-f-]{36}$/i;
const LIMITS={projects:120,tasks:1200,bytes:1024*1024};
function assert(condition,message){if(!condition)throw new Error(message);}
/** Selection: export one folder/project subtree or all projects (within a bounded size). */
export function exportProjectPlan(state,rootId=null){
 const projects=Object.values(state?.projects||{}).filter(p=>!p.isTemplate&&(!rootId||p.id===rootId||projectDescendantIds(state,rootId).has(p.id)));
 assert(!rootId||projects.some(p=>p.id===rootId),'Projekt für den Export nicht gefunden.');
 const included=new Set(projects.map(p=>p.id)), tasks=Object.values(state?.tasks||{}).filter(t=>!t.archived&&included.has(t.projectId));
 assert(projects.length<=LIMITS.projects&&tasks.length<=LIMITS.tasks,'Zu großer Plan für den JSON-Export. Bitte auf einen Ordner eingrenzen.');
 return {format:EXCHANGE_FORMAT,version:EXCHANGE_VERSION,exportedAt:new Date().toISOString(),
  description:'Offline bearbeiten, dann in Compass Vorschau prüfen und ausgewählte Änderungen bestätigen.',
  projects:projects.map(p=>({key:p.id,id:p.id,parentKey:included.has(p.parentId)?p.parentId:null,...Object.fromEntries(['title','outcome','category','status','kind','folderIcon','projectType','dueDate','reviewIntervalDays','sortOrder'].map(k=>[k,projectPlain(p)[k]]))})),
  tasks:tasks.map(t=>({key:t.id,id:t.id,projectKey:t.projectId,parentTaskKey:tasks.some(x=>x.id===t.parentTaskId)?t.parentTaskId:null,
   ...Object.fromEntries(['title','note','category','plannedDate','dueDate','workflow','flagged','tags','contextTags','deferUntil','estimateMinutes','progressCurrent','progressTarget','sortOrder','completed'].map(k=>[k,taskPlain(t)[k]]))}))};
}
/** Parse and normalize; strictly forbid references outside this manifest except known IDs being updated. */
export function parseProjectPlan(input){
 const raw=typeof input==='string'?(assert(input.length<=LIMITS.bytes,'Datei zu groß (maximal 1 MB).'),JSON.parse(input)):input;
 assert(raw&&typeof raw==='object'&&!Array.isArray(raw),'Keine Projektdatei.');
 assert(raw.format===EXCHANGE_FORMAT&&raw.version===EXCHANGE_VERSION,'Unbekanntes Austauschformat oder Version.');
 assert(Array.isArray(raw.projects)&&Array.isArray(raw.tasks)&&raw.projects.length>0,'Mindestens ein Projekt erforderlich.');
 assert(raw.projects.length<=LIMITS.projects&&raw.tasks.length<=LIMITS.tasks,'Zu viele Projekte oder Aufgaben.');
 const keys=new Set(),projectKeys=new Set(),taskKeys=new Set();
 for(const p of raw.projects){assert(p&&requireKey(p.key)&&!keys.has(p.key),'Projekt-Schlüssel fehlt oder ist doppelt.');keys.add(p.key);projectKeys.add(p.key);}
 for(const t of raw.tasks){assert(t&&requireKey(t.key)&&!keys.has(t.key),'Aufgaben-Schlüssel fehlt oder ist doppelt.');keys.add(t.key);taskKeys.add(t.key);}
 const projects=raw.projects.map((p,i)=>{
  assert(!p.parentKey||projectKeys.has(p.parentKey),'Übergeordnetes Projekt nicht in Importdatei.');
  assert(!p.id||uuid.test(p.id),'Ungültige Projekt-ID.');
  assert(isDate(p.dueDate),'Ungültiges Projektdatum.');
  const data={key:p.key,id:p.id||null,parentKey:p.parentKey||null,title:clean(p.title),outcome:clean(p.outcome),category:p.category||'Allgemein',status:p.status||'active',kind:p.kind||'project',folderIcon:(p.kind||'project')==='folder'?(p.folderIcon||'folder'):null,projectType:p.projectType||'parallel',dueDate:p.dueDate||null,reviewIntervalDays:p.reviewIntervalDays??7,sortOrder:p.sortOrder??(i+1)*100};
  assert(validProject({...data,id:'00000000-0000-4000-8000-000000000001',parentId:null}),'Ungültige Projektdaten: '+data.title);return data;
 });
 const tasks=raw.tasks.map((t,i)=>{
  assert(projectKeys.has(t.projectKey),'Aufgabe verweist auf unbekanntes Projekt.');
  assert(!t.parentTaskKey||taskKeys.has(t.parentTaskKey),'Unteraufgabe verweist auf unbekannte Aufgabe.');
  assert(!t.id||uuid.test(t.id),'Ungültige Aufgaben-ID.');
  assert(isDate(t.dueDate)&&isDate(t.plannedDate)&&isDate(t.deferUntil),'Ungültiges Aufgabendatum.');
  const data={key:t.key,id:t.id||null,projectKey:t.projectKey,parentTaskKey:t.parentTaskKey||null,title:clean(t.title),note:clean(t.note),category:t.category||'Allgemein',workflow:t.workflow||'next',plannedDate:t.plannedDate||null,dueDate:t.dueDate||null,deferUntil:t.deferUntil||null,flagged:!!t.flagged,tags:t.tags||[],contextTags:t.contextTags||[],estimateMinutes:t.estimateMinutes??null,progressCurrent:t.progressCurrent??0,progressTarget:t.progressTarget??null,sortOrder:t.sortOrder??(i+1)*100,completed:!!t.completed};
  assert(validLocalTask({...data,id:'00000000-0000-4000-8000-000000000001',projectId:null,parentTaskId:null}),'Ungültige Aufgabendaten: '+data.title);
  return data;
 });
 // Check acyclicity and task parent bound to same project.
 const pMap=new Map(projects.map(p=>[p.key,p])),tMap=new Map(tasks.map(t=>[t.key,t]));
 for(const p of projects){let k=p.key,seen=new Set();while(k){assert(!seen.has(k),'Projekt-Zyklus erkannt.');seen.add(k);k=pMap.get(k)?.parentKey;}}
 for(const t of tasks){let k=t.key,seen=new Set();while(k){assert(!seen.has(k),'Unteraufgaben-Zyklus erkannt.');seen.add(k);const parent=tMap.get(k);if(parent?.parentTaskKey){assert(tMap.get(parent.parentTaskKey)?.projectKey===t.projectKey,'Unteraufgabe liegt in einem anderen Projekt.');}k=parent?.parentTaskKey;}}
 for(const t of tasks)assert(pMap.get(t.projectKey)?.kind!=='folder','Aufgaben können nicht unmittelbar in Ordnern liegen.');
 return {format:EXCHANGE_FORMAT,version:EXCHANGE_VERSION,projects,tasks};
}
export function projectImportPreview(state,plan){
 const p=plan.projects.map(x=>({...x,exists:!!(x.id&&state?.projects?.[x.id]),sameTitle:Object.values(state?.projects||{}).some(s=>s.title.toLocaleLowerCase('de')===x.title.toLocaleLowerCase('de')&&s.id!==x.id)}));
 const t=plan.tasks.map(x=>({...x,exists:!!(x.id&&state?.tasks?.[x.id]),sameTitle:Object.values(state?.tasks||{}).some(s=>s.title.toLocaleLowerCase('de')===x.title.toLocaleLowerCase('de')&&s.id!==x.id)}));
 return {projects:p,tasks:t,creates:p.filter(x=>!x.exists).length+t.filter(x=>!x.exists).length,updates:p.filter(x=>x.exists).length+t.filter(x=>x.exists).length,similar:p.filter(x=>x.sameTitle).length+t.filter(x=>x.sameTitle).length};
}
/** Pure staged mutation, validates ALL proposed records before changing state. */
export function applyProjectPlan(state,plan,{selectedProjectKeys=null,updateExisting=false,idFactory,baseline=null}={}){
 assert(typeof idFactory==='function','ID-Erzeugung fehlt.');
 const chosen=selectedProjectKeys?new Set(selectedProjectKeys):new Set(plan.projects.map(p=>p.key));
 const projectMap=new Map(plan.projects.map(p=>[p.key,p]));
 // Excluded parents skip their entire subtree; never silently promote a child to the root.
 const usable=new Set();const canUse=(key)=>{if(!chosen.has(key))return false;const p=projectMap.get(key);return !!p&&(!p.parentKey||canUse(p.parentKey));};
 for(const p of plan.projects)if(canUse(p.key))usable.add(p.key);
 assert(usable.size>0,'Kein vollständiges Projekt ausgewählt.');
 const pRows=plan.projects.filter(p=>usable.has(p.key)),tRows=plan.tasks.filter(t=>usable.has(t.projectKey));
 const ids=new Map([...pRows,...tRows].map(x=>[x.key,(x.id&&((state.projects||{})[x.id]||(state.tasks||{})[x.id]))?x.id:idFactory()]));
 assert(new Set(ids.values()).size===ids.size,'IDs in Importdatei kollidieren.');
 const newProjects=pRows.map(p=>{
  const existing=state.projects?.[ids.get(p.key)];if(existing&&!updateExisting)return null;
  assert(!state.projectConflicts?.[ids.get(p.key)],'Projektkonflikt vor Import auflösen.');
  const row={...existing,id:ids.get(p.key),title:p.title,outcome:p.outcome,category:p.category,status:p.status,kind:p.kind,folderIcon:p.folderIcon,projectType:p.projectType,dueDate:p.dueDate,reviewIntervalDays:p.reviewIntervalDays,sortOrder:p.sortOrder,parentId:p.parentKey?ids.get(p.parentKey):null,isTemplate:false,reviewedAt:existing?.reviewedAt||null};
  assert(validProject(row),'Projekt kann nicht übernommen werden.');return row;
 }).filter(Boolean);
 const newTasks=tRows.map(t=>{
  const existing=state.tasks?.[ids.get(t.key)];if(existing&&!updateExisting)return null;
  assert(!state.taskConflicts?.[ids.get(t.key)],'Aufgabenkonflikt vor Import auflösen.');
  const row={...existing,id:ids.get(t.key),projectId:ids.get(t.projectKey),parentTaskId:t.parentTaskKey?ids.get(t.parentTaskKey):null,title:t.title,note:t.note,category:t.category,workflow:t.workflow,plannedDate:t.plannedDate,dueDate:t.dueDate,deferUntil:t.deferUntil,flagged:t.flagged,tags:t.tags,contextTags:t.contextTags,estimateMinutes:t.estimateMinutes,progressCurrent:t.progressCurrent,progressTarget:t.progressTarget,sortOrder:t.sortOrder,completed:t.completed,archived:false,updatedAt:new Date().toISOString()};
  assert(validLocalTask(row),'Aufgabe kann nicht übernommen werden.');return row;
 }).filter(Boolean);
 // No implicit overwrite of locally modified records since preview.
 if(baseline){for(const x of [...newProjects,...newTasks]){const prev=baseline[x.id];if(prev!==undefined){const live=state.projects?.[x.id]||state.tasks?.[x.id];assert(JSON.stringify(live)===prev,'Änderungen seit der Vorschau erkannt. Import erneut prüfen.');}}}
 const output={...state,projects:{...state.projects},tasks:{...state.tasks},projectPending:{...state.projectPending},taskPending:{...state.taskPending}};
 for(const p of newProjects){output.projects[p.id]=p;output.projectPending[p.id]=true;}
 for(const t of newTasks){output.tasks[t.id]=t;output.taskPending[t.id]=true;}
 for(const p of newProjects){assert(!p.parentId||!!output.projects[p.parentId],'Ordnerreferenz fehlt.');assert(validProjectParent(output,p.id,p.parentId),'Zyklische Projektbeziehung.');}
 for(const t of Object.values(output.tasks)){if(t.archived)continue;
  if(t.projectId)assert(output.projects[t.projectId]?.kind==='project','Projekt enthält Aufgaben und kann nicht als Ordner importiert werden.');
  if(t.parentTaskId)assert(output.tasks[t.parentTaskId]?.projectId===t.projectId,'Unteraufgaben-Hierarchie ist inkonsistent.');
 }
 return {state:output,projects:newProjects.length,tasks:newTasks.length};
}
