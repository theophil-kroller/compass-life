/** Compass 0.5.47 · explainable, read-only planning proposals.
 * Everything is computed from a fully covered, fresh capacity forecast and GTD task data.
 * Proposed blocks are NOT reservations, calendar entries, or new deadlines.
 */
import {isActionAvailable,isTemplateTask} from './tasks.js';

const DAY=/^\d{4}-\d{2}-\d{2}$/;
const asDay=v=>typeof v==='string'&&DAY.test(v)&&!Number.isNaN(Date.parse(v+'T12:00:00'))?v:null;
const dayAfter=v=>Date.parse(`${v}T00:00:00`)+86400000;
export function remainingTaskMinutes(task){
 const estimated=task?.estimateMinutes;
 if(!Number.isSafeInteger(estimated)||estimated<5)return null;
 const target=task.progressTarget,current=task.progressCurrent??0;
 if(target==null)return estimated;
 if(!Number.isSafeInteger(target)||target<1||!Number.isSafeInteger(current)||current<0||current>target)return null;
 return Math.ceil(estimated*(target-current)/target);
}
function nearestProjectDeadline(state,id){
 let due=null;const visited=new Set();
 while(id&&!visited.has(id)){
  visited.add(id);const p=state?.projects?.[id];if(!p)break;
  const d=asDay(p.kind==='project'?p.dueDate:null);
  if(d&&(!due||d<due))due=d;
  id=p.parentId;
 }
 return due;
}
function deadline(state,task){
 const own=asDay(task.dueDate),parent=nearestProjectDeadline(state,task.projectId);
 return [own,parent].filter(Boolean).sort()[0]||null;
}
function priority(entry,day){
 let score=0;const t=entry.task;
 if(entry.due){
  const remaining=Math.round((Date.parse(entry.due+'T12:00:00')-Date.parse(day+'T12:00:00'))/86400000);
  score+=remaining<0?125:remaining<=1?110:remaining<=3?92:remaining<=7?72:remaining<=14?55:30;
 }
 if(t.flagged)score+=12;
 if(t.plannedDate===day)score+=8;
 return score;
}
/** Returns a deterministic preview with zero side effects. Hard deadlines are processed first;
 * within a task, longer work may occupy several consecutive free blocks.
 * Shortfalls are an estimate, never a claim that the user *must* fill every free minute.
 */
export function proactivePlan(state,forecast,{maxBlocks=120,transitionMinutes=10,maxDailyLoad=0.8}={}){
 if(forecast?.status!=='ready'||!Array.isArray(forecast.slots))return {
  status:'unavailable',reason:forecast?.status||'unknown',blocks:[],shortfalls:[],unknown:[],totalMinutes:0,unallocatedMinutes:null
 };
 const from=forecast.from,through=forecast.through;
 const prefs=state?.uiPreferences||{};
 const todayContext=typeof prefs.dailyContext==='string'?prefs.dailyContext:'';
 const todayEnergy=['low','medium','high'].includes(prefs.dailyEnergy)?prefs.dailyEnergy:null;
 const raw=Object.values(state?.tasks||{}).filter(t=>t&&!t.archived&&!t.completed&&!isTemplateTask(state,t));
 const candidates=[],unknown=[];
 for(const task of raw){
  if(!forecast.days.some(day=>!day.off&&isActionAvailable(state,task,day.day)))continue;
  const due=deadline(state,task),minutes=remainingTaskMinutes(task);
  if(minutes===0)continue;
  if(minutes===null){unknown.push({task,due});continue;}
  candidates.push({task,due,minutes,remaining:minutes,score:priority({task,due},from)});
 }
 // Deadlines within the observed horizon take precedence; undated tasks fill remaining space.
 candidates.sort((a,b)=>{
  const tier=x=>x.due&&x.due<=through?0:x.due?1:2;
  return tier(a)-tier(b)||(a.due||'9999-12-31').localeCompare(b.due||'9999-12-31')||b.score-a.score||a.task.title.localeCompare(b.task.title,'de')||a.task.id.localeCompare(b.task.id);
 });
 const pool=forecast.slots.filter(s=>Number.isFinite(s.start)&&Number.isFinite(s.end)&&s.end>s.start&&asDay(s.day)).map(s=>({day:s.day,start:s.start,end:s.end,cursor:s.start,used:false})).sort((a,b)=>a.start-b.start);
 const blocks=[],shortfalls=[];const cap=Math.min(250,Math.max(1,Math.trunc(maxBlocks)||120));
 // Preserve discretionary time and unknown commitments instead of filling every possible minute.
 const dailyLimit=new Map((forecast.days||[]).map(d=>[d.day,Math.max(0,Math.floor(d.minutes*Math.min(0.9,Math.max(0.3,maxDailyLoad))))]));
 const dailyUsed=new Map();
 for(const item of candidates){
  if(item.due&&item.due<from){shortfalls.push({task:item.task,due:item.due,minutes:item.minutes,remaining:item.minutes,reason:'overdue'});continue;}
  const latest=item.due&&item.due<=through?dayAfter(item.due):Infinity;
  const earliest=asDay(item.task.deferUntil);
  const preferred=asDay(item.task.plannedDate);
  for(const slot of pool){
   if(blocks.length>=cap||item.remaining<=0)break;
   if(earliest&&slot.day<earliest)continue;
   if(slot.start>=latest)break;
   // Planned is a preference, not a deadline: undated tasks should not be suggested before that day.
   if(!item.due&&preferred&&slot.day<preferred)continue;
   if(!isActionAvailable(state,item.task,slot.day))continue;
   if(slot.day===from){
    // The user-selected context and energy apply to today only; do not extrapolate to future days.
    const tags=item.task.contextTags||[];
    if(todayContext&&(!tags.includes(todayContext)&&!(todayContext.startsWith('group:')&&tags.some(x=>x.startsWith(todayContext.slice(6)+'-')))))continue;
    const required=tags.find(x=>/^energy-(low|medium|high)$/.test(x));
    if(todayEnergy&&required&&required!=='energy-'+todayEnergy)continue;
   }
   const end=Math.min(slot.end,latest);
   while(item.remaining>0&&blocks.length<cap){
    const free=Math.min(Math.floor((end-slot.cursor)/60000),(dailyLimit.get(slot.day)||0)-(dailyUsed.get(slot.day)||0));
    if(free<5)break;
    const minutes=Math.min(120,item.remaining,free);
    if(minutes<5)break;
    const start=slot.cursor,finish=start+minutes*60000;
    blocks.push({task:item.task,day:slot.day,start,end:finish,minutes,due:item.due,remainingAfter:item.remaining-minutes,
     reason:item.due?'Harte Frist '+item.due:preferred?'Wunschtermin '+preferred:item.task.flagged?'Markierte Next Action':'Verfügbares Arbeitsfenster'});
    item.remaining-=minutes;
    dailyUsed.set(slot.day,(dailyUsed.get(slot.day)||0)+minutes);
    slot.cursor=Math.min(slot.end,finish+transitionMinutes*60000);
    slot.used=true;
   }
  }
  if(item.due&&item.due<=through&&item.remaining>0){shortfalls.push({task:item.task,due:item.due,minutes:item.minutes,remaining:item.remaining,reason:'capacity'});}
 }
 blocks.sort((a,b)=>a.start-b.start||a.task.id.localeCompare(b.task.id));
 const allocated=blocks.reduce((n,b)=>n+b.minutes,0);
 const unknownDated=unknown.filter(x=>x.due&&x.due<=through);
 return {status:'ready',blocks,shortfalls,unknown:unknownDated.slice(0,20),unknownCount:unknownDated.length,
  totalMinutes:allocated,unallocatedMinutes:Math.max(0,forecast.totalMinutes-allocated),candidates:candidates.length,
  source:forecast.source,coverage:{from,through},
  caveat:'Vorschläge, keine Reservierungen. Nur bekannter Aufwand im primären Google-Kalender und im festgelegten Arbeitsfenster. Höchstens 80 % der erkannten freien Tageskapazität werden verplant; zusätzliche Verpflichtungen können fehlen.'};
}
