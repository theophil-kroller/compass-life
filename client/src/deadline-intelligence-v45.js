/** Compass 0.5.45: explainable, read-only deadline pressure. No schedules are written.
 * Evaluates dated, open, actionable work against the COVERED capacity horizon.
 * Estimates are user-supplied; omitted estimates are explicitly unresolved.
 */
import {isTemplateTask,projectIsActive} from './tasks.js';
const isDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'));
const dayStart=s=>new Date(`${s}T00:00:00`).getTime();
function inheritedDue(state,projectId){
 const seen=new Set();let nearest=null,id=projectId;
 while(id&&!seen.has(id)){
  seen.add(id);const p=state?.projects?.[id];if(!p)break;
  if(p.kind==='project'&&isDate(p.dueDate)&&(!nearest||p.dueDate<nearest))nearest=p.dueDate;
  id=p.parentId;
 }
 return nearest;
}
/** A conservative capacity-vs-demand alert, not an optimizer. All estimates are remaining minutes. */
export function deadlineIntelligence(state,forecast,{today=forecast?.from,warningRatio=0.2}={}){
 if(forecast?.status!=='ready')return {status:'unavailable',reason:forecast?.status||'unknown',items:[],unknown:0};
 const tasks=Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&!isTemplateTask(state,t)&&(!t.projectId||projectIsActive(state,t.projectId)));
 const dated=[],undated=[],soft=[];
 const hasOpenChildren=id=>tasks.some(x=>x.parentTaskId===id);
 for(const t of tasks){
  const due=[t.dueDate,inheritedDue(state,t.projectId)].filter(isDate).sort()[0]||null;
  if(!due){if(isDate(t.plannedDate))soft.push(t);continue;}
  if(!['next'].includes(t.workflow||'next'))continue; // waiting/hold are not controllable labor
  if(hasOpenChildren(t.id))continue; // parent's estimate may summarize child work: avoid double counting // waiting/hold are not scheduled as controllable labor
  const remaining=t.progressTarget!=null&&Number.isSafeInteger(t.progressCurrent)&&t.progressTarget>0&&t.estimateMinutes!=null
   ?Math.ceil(t.estimateMinutes*(t.progressTarget-t.progressCurrent)/t.progressTarget):t.estimateMinutes;
  if(remaining===0)continue; // piece-counter target reached; task stays open until confirmed
  const entry={task:t,due,minutes:Number.isInteger(remaining)&&remaining>=5?remaining:null,inherited:due!==t.dueDate};
  if(entry.minutes===null)undated.push(entry);else dated.push(entry);
 }
 dated.sort((a,b)=>a.due.localeCompare(b.due)||a.task.title.localeCompare(b.task.title,'de'));
 const slots=(forecast.slots||[]).filter(s=>Number.isFinite(s.start)&&Number.isFinite(s.end)&&s.end>s.start);
 const earliest=dayStart(today);const horizon=forecast.through;
 const latestStartFor=(minutes,due)=>{
  let left=minutes;const limit=dayStart(due)+86400000;
  for(const slot of slots.filter(s=>s.start<limit).sort((a,b)=>b.end-a.end)){
   const end=Math.min(slot.end,limit),available=Math.floor((end-slot.start)/60000);
   if(available<=0)continue;
   if(available>=left)return end-left*60000;
   left-=available;
  }
  return null;
 };
 const items=[];let cumulative=0;
 for(const entry of dated){
  cumulative+=entry.minutes;
  const within=entry.due<=horizon;
  const capacity=slots.filter(s=>s.start<dayStart(entry.due)+86400000&&s.end>earliest).reduce((n,s)=>n+s.minutes,0);
  const overdue=entry.due<today;
  // Deadline > horizon: cannot conclude feasibility from a shorter calendar window.
  const slack=within?capacity-cumulative:null;
  const status=overdue?'overdue':!within?'beyond-horizon':slack<0?'conflict':slack<Math.max(30,cumulative*warningRatio)?'tight':'ok';
  items.push({...entry,capacity:within?capacity:null,cumulative,slack,status,latestStart:within&&!overdue&&slack>=0?latestStartFor(cumulative,entry.due):null});
 }
 const status=items.some(e=>e.status==='conflict'||e.status==='overdue')?'risk':items.some(e=>e.status==='tight')?'tight':items.length?'ok':'no-deadlines';
 return {status,items,unknown:undated.length,unknownTasks:undated.sort((a,b)=>a.due.localeCompare(b.due)).slice(0,12),soft:soft.length,within:items.filter(e=>e.due<=horizon),horizon,source:forecast.source,
  caveat:'Nur offene, ausführbare Aufgaben mit Aufwandsschätzung und erfasster Frist. Andere Verpflichtungen, Wartezeiten und private Belastung sind möglicherweise nicht enthalten.'};
}
