/** Compass 0.5.77.48 — realistic calendar capacity and work packets after .47.
 * Strict transforms fail closed when an earlier build is missing.
 */
export function compass748Bridge(){
 const once=(source,from,to,label)=>{
  const count=source.split(from).length-1;
  if(count!==1)throw Error(`Compass .48: ${label}: expected one integration anchor, got ${count}`);
  return source.replace(from,to);
 };
 return {name:'compass-748-calendar-work-packets',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let code=source;const change=(a,b,k)=>{code=once(code,a,b,k);};
  change("const COMPASS_CLIENT_VERSION='0.5.77.47';","const COMPASS_CLIENT_VERSION='0.5.77.48';",'version');
  change("import './capacity-guardian-v57747.css';","import './capacity-guardian-v57747.css';\nimport {capacityCalendarView,saveWorkPacketSettings,effectiveCapacityState748} from './capacity-calendar-v57748.js';\nimport './capacity-calendar-v57748.css';",'module imports');
  change("const content=insightTab==='capacity'?capacityGuardianView(state,{today:localDate()}):",
    "const content=insightTab==='capacity'?capacityGuardianView(effectiveCapacityState748(state),{today:localDate()})+capacityCalendarView(state,{today:localDate(),now:new Date(),calendarEvents,calendarCoverage,calendarUpdatedAt,calendarConnected:!!(calendarToken&&Date.now()<calendarExpires)||Boolean(state?.calendarArchive?.completed)}):", 'calendar-aware rendering');
  change(" const capacityForm747=app.querySelector('#cap747-form');",` const packetsForm748=app.querySelector('#cap748-packets-form');
 if(packetsForm748)packetsForm748.onsubmit=async event=>{
  event.preventDefault();if(!state)return;
  const fd=new FormData(packetsForm748),rows={};
  for(const task of Object.values(state.tasks||{})){
   if(!task?.id||!fd.has('packet:'+task.id+':unitMinutes'))continue;
   rows[task.id]={count:fd.get('packet:'+task.id+':count'),unitMinutes:fd.get('packet:'+task.id+':unitMinutes'),blockMinutes:fd.get('packet:'+task.id+':blockMinutes')};
  }
  try{await mutate(st=>saveWorkPacketSettings(st,rows),null,true);toast('Arbeitsblöcke im lokalen Tresor gespeichert.');}
  catch(ex){toast('Arbeitspakete: '+ex.message,true);}
 };
 const capacityForm747=app.querySelector('#cap747-form');`, 'work-packet form');
  change("if(action==='capacity747-open'){",`if(action==='cap748-calendar-refresh'){
  try{if(calendarToken&&Date.now()<calendarExpires)await fetchCalendar();else await connectCalendar();}
  catch(ex){toast('Kalender: '+ex.message,true);}
  return;
 }
 if(action==='capacity747-open'){`, 'calendar refresh action');
  return {code,map:null};
 }};
}
