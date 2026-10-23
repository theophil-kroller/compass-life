/** Compass 0.5.23 – descriptive GTD review, no inferred deadlines or automatic task creation.
 * All signals use the already synchronized project/task fields. */
import {nextActions,projectTasks,projectNeedsReview,localDate,validLocalTask,isTemplateTask} from './tasks.js';

const dayMs=86400000;
export function ageDays(iso,day=localDate()){
 if(typeof iso!=='string'||!/^\d{4}-\d{2}-\d{2}/.test(iso))return null;
 const d=Date.parse(iso.slice(0,10)+'T12:00:00Z'),now=Date.parse(day+'T12:00:00Z');
 return Number.isFinite(d)&&Number.isFinite(now)?Math.max(0,Math.floor((now-d)/dayMs)):null;
}
export function projectHealth(state,day=localDate()){
 const available=new Set(nextActions(state,day).map(x=>x.id));
 // Build once; projectTasks() previously scanned the entire task set per project.
 const byProject=new Map();
 for(const task of Object.values(state?.tasks||{}))if(task&&!task.archived&&task.projectId){
  if(!byProject.has(task.projectId))byProject.set(task.projectId,[]);
  byProject.get(task.projectId).push(task);
 }
 const items=Object.values(state?.projects||{}).filter(p=>(p.kind||'project')==='project'&&p.status==='active'&&!p.isTemplate).map(p=>{
  const tasks=byProject.get(p.id)||[],open=tasks.filter(t=>!t.completed),ready=open.filter(t=>available.has(t.id));
  const reviewDue=projectNeedsReview(p,day),reviewAge=ageDays(p.reviewedAt,day);
  const hasNoAction=ready.length===0;
  const due=p.dueDate&&p.dueDate<day;
  const daysUntilReview=p.reviewedAt?Math.max(0,(p.reviewIntervalDays||7)-(reviewAge??0)):0;
  const warnings=[];
  if(hasNoAction)warnings.push('Keine verfügbare Next Action');
  if(reviewDue)warnings.push(p.reviewedAt?'Review-Intervall erreicht':'Noch nie geprüft');
  if(due)warnings.push('Projekt-Deadline überschritten');
  return {project:p,open:open.length,ready:ready.length,reviewDue,hasNoAction,reviewAge,daysUntilReview,overdueDeadline:!!due,warnings,severity:due?'urgent':hasNoAction?'blocked':reviewDue?'review':'ok'};
 });
 const rank={urgent:0,blocked:1,review:2,ok:3};
 items.sort((a,b)=>rank[a.severity]-rank[b.severity]||a.project.title.localeCompare(b.project.title,'de'));
 return {items,active:items.length,withoutAction:items.filter(x=>x.hasNoAction).length,dueReviews:items.filter(x=>x.reviewDue).length,lateProjects:items.filter(x=>x.overdueDeadline).length};
}
/** An unmodified Waiting For task is a review hint, not an overdue obligation. */
export function waitingReview(state,day=localDate(),thresholdDays=7){
 const items=Object.values(state?.tasks||{}).filter(t=>!t.archived&&!isTemplateTask(state,t)&&!t.completed&&t.workflow==='waiting').map(task=>{
  const age=ageDays(task.updatedAt,day);
  return {task,daysSinceEdit:age,needsAttention:age!==null&&age>=thresholdDays};
 });
 items.sort((a,b)=>Number(b.needsAttention)-Number(a.needsAttention)||(b.daysSinceEdit??-1)-(a.daysSinceEdit??-1)||a.task.title.localeCompare(b.task.title,'de'));
 return {items,attention:items.filter(x=>x.needsAttention).length,unknownAge:items.filter(x=>x.daysSinceEdit===null).length};
}
/** A deliberate one-off copy, not a recurrence rule. Never propagate a past due date. */
export function repeatedTask(original,newId,at=new Date().toISOString()){
 if(!original?.completed||original.archived||typeof newId!=='string')throw Error('Nur abgeschlossene, nicht archivierte Aufgaben können wiederholt werden.');
 const t={...original,id:newId,completed:false,archived:false,workflow:'next',flagged:false,
   plannedDate:null,dueDate:null,deferUntil:null,parentTaskId:null,sortOrder:0,progressCurrent:0,
   updatedAt:at,version:undefined};
 if(!validLocalTask(t))throw Error('Die wiederholte Aufgabe wäre ungültig.');
 return t;
}
