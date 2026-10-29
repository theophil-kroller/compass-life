/** Compass .40.25.9 — fast Today shell and non-blocking Family Radar worker. */
export function compass5940259TodayDeferred(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.9 ${label}: expected 1 anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-5940259-today-deferred',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.8','Build 0.5.77.59.40.25.9','lock version'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.8';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.9';",'version');
  s=once(s,'Build 0.5.77.59.40.25.8','Build 0.5.77.59.40.25.9','footer');
  s=once(s,"import {reviewCheckpoint,restoreReviewCheckpoint,createTodayPanelMemo} from './core-performance-v5775940258.js';",
    "import {reviewCheckpoint,restoreReviewCheckpoint,createTodayPanelMemo} from './core-performance-v5775940258.js';\nimport {calendarBirthdayCandidates,familyWorkerSnapshot,createDeferredFamilyCache} from './today-core-deferred-v5775940259.js';",'import');
  s=once(s,`const coreTodayFamilyMemo=createTodayPanelMemo();`,
  `const coreTodayFamilyMemo=createTodayPanelMemo();
const core259FamilyCache=createDeferredFamilyCache();
let core259FamilyKey=null;
const core259FamilyKeyNow=()=>[coreTodayDataRevision,journalRevision,state?.people,state?.familyRadar,calendarEvents,calendarEvents.length,calendarUpdatedAt,state?.calendarRules,state?.calendarOverrides,showHiddenCalendarEvents,localDate()];
function core259FamilyAfterPaint(){
 if(tab!=='today'||!state||document.visibilityState==='hidden')return;
 const key=core259FamilyKeyNow();
 if(!core259FamilyKey||!key.every((x,i)=>x===core259FamilyKey[i]))return;
 if(core259FamilyCache.peek(key)!==null||core259FamilyCache.isPending(key))return;
 const input=familyWorkerSnapshot(calendarEvents,state.people||{},state,localDate(),e=>eventAppearance(e),showHiddenCalendarEvents);
 const started=performanceTrace.start();
 core259FamilyCache.schedule(key,input,html=>{
  performanceTrace.end('Heute: Familienradar Worker fertig',tab,started);
  if(!state||tab!=='today'||!key.every((x,i)=>x===core259FamilyKeyNow()[i]))return;
  const host=app.querySelector('[data-core259-family]');if(!host)return;
  host.innerHTML=html;
  host.querySelectorAll('[data-action]').forEach(el=>{el.onclick=ev=>{ev.preventDefault();runAction(el.dataset.action,el.dataset.id,el.dataset.step,el.dataset.day);};});
 },{workerFactory:()=>new Worker(new URL('./today-family-worker-v5775940259.js',import.meta.url),{type:'module'})});
}`,'deferred coordinator');
  s=once(s,`  const familyPeople=state.people||{};
  const familyNow=localDate();
  let familyVisible=null, familyProposals=null;
  if(tab==='today'){
   const familyStarted=performanceTrace.start();
   const familyMarkup=coreTodayFamilyMemo.get([coreTodayDataRevision,journalRevision,state.people,state.familyRadar,calendarEvents,calendarEvents.length,calendarUpdatedAt,showHiddenCalendarEvents,familyNow],()=>{
    const familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
    const familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
    const birthdays=todayBirthdayHighlights(calendarEvents,e=>eventAppearance(e),familyPeople,familyNow);
    return todayBirthdayPanel(birthdays)+familyTodayPanel(familyProposals,familyTodayObservations(familyVisible,familyPeople,state,{today:familyNow}));
   });
   performanceTrace.end('Heute: Familien- und Geburtstagsradar',tab,familyStarted);
   content=familyMarkup+content;
  }else{
   familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
   familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
  }`,
  `  const familyPeople=state.people||{};
  const familyNow=localDate();
  let familyVisible=null, familyProposals=null;
  if(tab==='today'){
   const familyStarted=performanceTrace.start();
   const birthdayStarted=performanceTrace.start();
   const birthdays=todayBirthdayHighlights(calendarBirthdayCandidates(calendarEvents,familyNow,7),e=>eventAppearance(e),familyPeople,familyNow);
   performanceTrace.end('Heute: Geburtstage sofort',tab,birthdayStarted);
   const key=core259FamilyKeyNow();core259FamilyKey=key;
   const fromWorker=core259FamilyCache.peek(key);
   content=todayBirthdayPanel(birthdays)+'<div data-core259-family style="display:contents">'+(fromWorker??'')+'</div>'+content;
   performanceTrace.end('Heute: Familien- und Geburtstagsradar',tab,familyStarted);
  }else{
   familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
   familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
  }`,'async family panel');
  s=once(s,` if(!state){app.innerHTML=vaultScreen()`, ` if(!state){core259FamilyCache.clear();core259FamilyKey=null;app.innerHTML=vaultScreen()`,'clear on lock');
  s=once(s,` performanceTrace.end('Bildschirm rendern',tab,renderMeasurement);`,
  ` performanceTrace.end('Bildschirm rendern',tab,renderMeasurement);
 if(tab==='today'&&core259FamilyKey&&core259FamilyCache.peek(core259FamilyKey)===null){
   const run=()=>setTimeout(core259FamilyAfterPaint,0);
   if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(run));else run();
 }`,'worker after paint');
  s=once(s,`window.addEventListener('offline',render);`,
  `document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state&&tab==='today'&&core259FamilyKey){
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(core259FamilyAfterPaint);else setTimeout(core259FamilyAfterPaint,0);
  }});
window.addEventListener('offline',render);`,'resume deferred radar');
  return {code:s,map:null};
 }};
}
