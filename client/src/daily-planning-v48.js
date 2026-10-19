/** Compass 0.5.48 – small, explainable day plans. No Google writes.
 * Blocks are stored in the encrypted local vault under uiPreferences.dailyPlanBlocks.
 * A block is a personal intention, NOT a calendar reservation or task completion.
 */
import {isActionAvailable,isTemplateTask} from './tasks.js';
import {remainingTaskMinutes} from './proactive-planner-v47.js';
import {deadlineUrgency} from './urgency-intelligence-v48.js';
import {deadlineIntelligence} from './deadline-intelligence-v45.js';
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const MIN=60000;
const safeDay=day=>typeof day==='string'&&DAY.test(day)&&new Date(day+'T12:00:00').toString()!=='Invalid Date';
const validEntry=b=>b&&typeof b.id==='string'&&b.id.length<100&&typeof b.taskId==='string'&&b.taskId.length<100&&safeDay(b.day)&&Number.isSafeInteger(b.start)&&Number.isSafeInteger(b.end)&&Number.isSafeInteger(b.minutes)&&b.minutes>=5&&b.minutes<=240&&b.end-b.start===b.minutes*MIN&&new Date(b.start).getFullYear()>=2020;
export function dayPlanBlocks(state,day=null){
 const raw=state?.uiPreferences?.dailyPlanBlocks;
 if(!Array.isArray(raw))return [];
 return raw.filter(b=>validEntry(b)&&(!day||b.day===day)).sort((a,b)=>a.start-b.start||a.id.localeCompare(b.id));
}
export function dayCandidates(state,day,limit=48,{forecast=null,today=forecast?.from||day}={}){
 if(!safeDay(day))return [];
 const pressure=deadlineUrgency(state,forecast,{today});
 const assignments=dayPlanBlocks(state,day);
 const inDay=new Set(assignments.map(b=>b.taskId));
 return Object.values(state?.tasks||{}).filter(t=>t&&isActionAvailable(state,t,day)&&!isTemplateTask(state,t)&&!state?.taskConflicts?.[t.id])
  .map(task=>{
   const minutes=remainingTaskMinutes(task);
   const scheduled=assignments.filter(b=>b.taskId===task.id).reduce((n,b)=>n+b.minutes,0);
   const urgency=pressure.get(task.id)||{score:null,level:0,tone:'neutral',label:'Keine harte Frist',detail:'',due:null};
   const due=urgency.due;
   const score=(urgency.score??0)+(task.plannedDate===day?12:0)+(task.flagged?8:0)+(inDay.has(task.id)?3:0);
   return {task,minutes,scheduled,due,urgency,score,estimateUnknown:minutes===null};
  })
  .filter(x=>x.minutes===null?x.scheduled===0:x.minutes>x.scheduled)
  .sort((a,b)=>b.urgency.level-a.urgency.level||b.score-a.score||((a.due||'9999').localeCompare(b.due||'9999'))||a.task.title.localeCompare(b.task.title,'de'))
  .slice(0,Math.max(1,Math.min(150,limit)));
}
/** Starts for 30-minute drop targets within each verified free slot. */
export function dayDropTargets(forecast,day,{stepMinutes=30}={}){
 if(forecast?.status!=='ready'||!safeDay(day))return [];
 const span=Math.max(15,Math.min(60,stepMinutes))*MIN;
 return (forecast.days?.find(d=>d.day===day)?.slots||[]).flatMap(slot=>{
  const result=[];
  for(let t=slot.start;t+15*MIN<=slot.end&&result.length<36;t+=span)result.push({day,start:t,windowEnd:slot.end});
  return result;
 }).slice(0,80);
}
function timeWithinDay(day,start,end){
 if(!(Number.isSafeInteger(start)&&Number.isSafeInteger(end)))return false;
 const base=new Date(day+'T00:00:00').getTime();
 return start>=base&&end<=new Date(day+'T23:59:59').getTime()+1000;
}
/** Validate from *current* capacity and GTD data at every placement, never trust a DOM slot. */
export function placeDayBlock(state,forecast,proposal,{now=new Date(),idFactory=null}={}){
 const {taskId,day,start,minutes=60,moveId=null}=proposal||{};
 if(!safeDay(day)||typeof taskId!=='string'||!Number.isSafeInteger(start)||!Number.isSafeInteger(minutes)||minutes<5||minutes>240)throw Error('Ungültiger Arbeitsblock.');
 if(forecast?.status!=='ready'||day<forecast.from||day>forecast.through)throw Error('Kalenderdaten fehlen oder sind nicht aktuell. Bitte Kalender aktualisieren.');
 const task=state?.tasks?.[taskId];
 if(!task||!isActionAvailable(state,task,day)||isTemplateTask(state,task)||state?.taskConflicts?.[taskId])throw Error('Diese Aufgabe ist keine verfügbare Next Action.');
 const end=start+minutes*MIN;
 if(!timeWithinDay(day,start,end))throw Error('Der Arbeitsblock muss am selben Tag liegen.');
 if(start<now.getTime()-MIN)throw Error('Vergangene Zeitfenster können nicht neu belegt werden.');
 const available=(forecast.days?.find(d=>d.day===day)?.slots||[]).some(s=>start>=s.start&&end<=s.end);
 if(!available)throw Error('Hier ist nicht genug freie Kalenderzeit. Belegte Termine bleiben geschützt.');
 const entries=dayPlanBlocks(state);
 const current=moveId?entries.find(b=>b.id===moveId):null;
 if(moveId&&(!current||current.done||current.taskId!==taskId))throw Error('Der Arbeitsblock kann nicht mehr verschoben werden.');
 const others=entries.filter(b=>b.id!==moveId);
 if(others.some(b=>b.start<end&&start<b.end))throw Error('Dieses Zeitfenster ist bereits für eine andere Aufgabe vorgemerkt.');
 const remaining=remainingTaskMinutes(task);
 const allocated=others.filter(b=>b.taskId===taskId&&!b.done&&!task.completed).reduce((n,b)=>n+b.minutes,0);
 if(remaining!==null&&allocated+minutes>remaining)throw Error('Die geplante Zeit übersteigt den geschätzten Restaufwand dieser Aufgabe.');
 if(remaining===null&&others.some(b=>b.taskId===taskId))throw Error('Für weitere Blöcke bitte zunächst den Aufgabenaufwand schätzen.');
 const id=moveId||idFactory?.()||globalThis.crypto?.randomUUID?.();
 if(typeof id!=='string'||!id||id.length>=100)throw Error('Block-ID fehlt.');
 const block={id,taskId,day,start,end,minutes,done:false,estimateUnknown:remaining===null,createdAt:current?.createdAt||now.toISOString()};
 return [...others,block].sort((a,b)=>a.start-b.start||a.id.localeCompare(b.id));
}
export function updateDayBlock(state,blockId,action){
 const blocks=dayPlanBlocks(state),current=blocks.find(b=>b.id===blockId);
 if(!current)throw Error('Arbeitsblock nicht gefunden.');
 if(action==='remove')return blocks.filter(b=>b.id!==blockId);
 if(action==='toggleDone')return blocks.map(b=>b.id===blockId?{...b,done:!b.done}:b);
 throw Error('Unbekannte Aktion.');
}
export function dayPlanStatus(state,day,now=new Date(),forecast=null){
 const blocks=dayPlanBlocks(state,day);
 const done=blocks.filter(b=>b.done||state?.tasks?.[b.taskId]?.completed);
 const completeMinutes=done.reduce((n,b)=>n+b.minutes,0),plannedMinutes=blocks.reduce((n,b)=>n+b.minutes,0);
 const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const dueOpen=Object.values(state?.tasks||{}).filter(t=>t&&!t.archived&&!t.completed&&!isTemplateTask(state,t)&&t.dueDate&&t.dueDate<=day).length;
 const pressure=forecast?.status==='ready'&&day===today?deadlineIntelligence(state,forecast,{today}):null;
 const atRisk=pressure?.items?.filter(x=>x.status==='conflict'||x.status==='overdue').length||0;
 let code='unplanned',label='Noch kein Tagesplan';
 if(!blocks.length&&day<=today&&dueOpen){code=atRisk?'risk':'review';label=atRisk?'Frist gefährdet':'Offene Fristen prüfen';}
 if(blocks.length){
  if(day>today){code='future';label='Vorbereitet';}
  else if(day<today){code=done.length===blocks.length&&dueOpen===0?'ontrack':'review';label=code==='ontrack'?'Tagesplan abgeschlossen':'Rückblick prüfen';}
  else if(atRisk){code='risk';label='Frist gefährdet';}
  else if(done.length===blocks.length&&dueOpen===0){code='ontrack';label='Tagesplan erledigt';}
  else if(done.length===blocks.length){code='review';label='Fristen prüfen';}
  else{code='active';label='Noch offen';}
 }
 return {day,code,label,blocks:blocks.length,done:done.length,open:blocks.length-done.length,completeMinutes,plannedMinutes,dueOpen,atRisk};
}
