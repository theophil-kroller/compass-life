/** Compass 0.5.48 · transparent deadline urgency for available GTD actions.
 * No predictions from historical productivity or fake commitments. All values are advisory.
 * "Gefährdet" is emitted ONLY when a verified, fresh working-time forecast cannot fit
 * the known cumulative hard-deadline workload. Beyond-horizon or unknown estimates are
 * explicitly uncertain and never labelled mathematically impossible.
 */
import {isTemplateTask,projectIsActive} from './tasks.js';
import {deadlineIntelligence} from './deadline-intelligence-v45.js';
import {remainingTaskMinutes} from './proactive-planner-v47.js';

const DAY=/^\d{4}-\d{2}-\d{2}$/;
const validDay=d=>typeof d==='string'&&DAY.test(d)&&!Number.isNaN(Date.parse(`${d}T12:00:00`));
const dayDiff=(d,today)=>Math.round((Date.parse(`${d}T12:00:00`)-Date.parse(`${today}T12:00:00`))/86400000);
const duration=n=>`${Math.floor(n/60)} h ${String(Math.round(n%60)).padStart(2,'0')} min`;
function effectiveDue(state,task){
 let due=validDay(task?.dueDate)?task.dueDate:null;
 const visited=new Set();let id=task?.projectId;
 while(id&&!visited.has(id)){
  visited.add(id);const p=state?.projects?.[id];if(!p)break;
  if(p.kind==='project'&&validDay(p.dueDate)&&(!due||p.dueDate<due))due=p.dueDate;
  id=p.parentId;
 }
 return due;
}
const daysScore=days=>days<0?100:days===0?92:days===1?76:days<=3?56:days<=7?42:days<=14?28:days<=21?15:8;
const workloadScore=ratio=>ratio>=.9?91:ratio>=.75?80:ratio>=.55?67:ratio>=.35?49:ratio>=.2?35:15;
const toneFor=score=>score>=80?'red':score>=62?'orange':score>=40?'yellow':'green';
/** No artificial hard date. Request a decision only if neither an inherited due nor a soft planning day exists. */
export function needsDateDecision(state,task){
 return Boolean(task&&!effectiveDue(state,task)&&!validDay(task.plannedDate));
}

const SEVERITY=Object.freeze({neutral:0,green:1,yellow:2,orange:3,red:4,risk:5});
/** Map<taskId,{score,tone,label,detail,level,...}>. Never persists inferred scores. */
export function deadlineUrgency(state,forecast,{today=forecast?.from}={}){
 const out=new Map();
 if(!validDay(today))return out;
 const intelligence=deadlineIntelligence(state,forecast,{today});
 const byTask=new Map((intelligence.items||[]).map(item=>[item.task.id,item]));
 for(const task of Object.values(state?.tasks||{})){
  if(!task||task.completed||task.archived||isTemplateTask(state,task)||task.workflow&&task.workflow!=='next'||task.projectId&&!projectIsActive(state,task.projectId))continue;
  const item=byTask.get(task.id),due=item?.due||effectiveDue(state,task);
  if(!due){out.set(task.id,{score:null,tone:'neutral',level:0,label:needsDateDecision(state,task)?'Datum prüfen':'Wunschtag vorhanden',detail:needsDateDecision(state,task)?'Noch kein Termin: Entscheide zwischen Wunschtag, echter Deadline oder bewusst ohne Datum lassen.':'Wunschtag ist vorhanden; keine künstliche harte Frist.',due:null,needsDate:needsDateDecision(state,task)});continue;}
  const days=dayDiff(due,today),remaining=remainingTaskMinutes(task);
  let score=daysScore(days),tone=toneFor(score),atRisk=false,capacity=null,demand=null;
  const covered=forecast?.status==='ready'&&due>=forecast.from&&due<=forecast.through;
  if(covered&&item&&Number.isFinite(item.capacity)&&remaining!==null){
   // deadlineIntelligence accounts for ALL earlier known hard deadlines, not only this task.
   // Do not subtract manually scheduled blocks a second time: this labor is still pending
   // until the task/progress counter is actually updated.
   capacity=item.capacity;demand=item.cumulative;
   const ratio=capacity>0?demand/capacity:Infinity;
   if(demand>capacity){atRisk=true;tone='risk';score=100;}
   else score=Math.max(score,workloadScore(ratio));
   if(!atRisk)tone=toneFor(score);
  }else if(days<0&&remaining!==0){atRisk=true;tone='risk';score=100;}
  // A missing estimate or a deadline beyond the known horizon is NOT proven feasible.
  const missingEstimate=remaining===null;
  let label=atRisk?(days<0?'Frist überschritten':'Kapazität reicht nicht'):
   tone==='red'?'Sofort priorisieren':tone==='orange'?'Sehr dringend':tone==='yellow'?'Bald beginnen':'Mit Puffer';
  let detail=`Harte Frist ${due} · ${days<0?`${Math.abs(days)} Tage überfällig`:days===0?'heute':`noch ${days} Tage`}`;
  if(covered&&capacity!==null){detail+=` · ${duration(demand)} fällige Arbeit / ${duration(capacity)} reguläre freie Zeit bis zur Frist`;}
  else if(missingEstimate){detail+=' · Aufwand nicht geschätzt: Machbarkeit unbekannt';}
  else if(!covered){detail+=' · außerhalb des verifizierten Kalenderhorizonts: Machbarkeit noch offen';}
  else {detail+=' · unvollständiger Kalender oder Aufwand: Machbarkeit noch offen';}
  if(missingEstimate&&!detail.includes('Aufwand nicht geschätzt'))detail+=' · Aufwand der Aufgabe noch nicht geschätzt';
  out.set(task.id,{score,tone,level:SEVERITY[tone],atRisk,label,detail,due,days,remaining,capacity,demand,covered,estimateUnknown:missingEstimate});
 }
 return out;
}
