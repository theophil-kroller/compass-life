/** Compass .59.35 — optional V-Taper six-week block and conservative recovery.
 * No diagnostic readiness score; no inference from unrecorded workouts.
 * Cycle preferences contain no GPS, health data, or workouts. Never contact cloud.
 */
const dayValue=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d||''))&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const gap=(a,b)=>Math.floor((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const add=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const STORE='compass:vtaper:cycle-v5935';
export const CYCLE_LENGTH_WEEKS=6;
export function readCycle35(){
 try{const x=JSON.parse(localStorage.getItem(STORE)||'null');return dayValue(x?.startDay)?{startDay:x.startDay,deloadUntil:dayValue(x.deloadUntil)?x.deloadUntil:null}:null;}catch{return null;}
}
/** Invoked only from explicit Coach buttons. Nothing is created on opening Today. */
export function saveCycleAction35(action,today){
 if(!dayValue(today)||!['start','deload','resume'].includes(action))return null;
 try{
  const previous=readCycle35()||{startDay:today,deloadUntil:null};
  const next=action==='start'?{startDay:today,deloadUntil:null}:
   action==='deload'?{...previous,deloadUntil:add(today,6)}:{...previous,deloadUntil:null};
  localStorage.setItem(STORE,JSON.stringify(next));return next;
 }catch{return null;}
}
export const SHOULDER_REGIONS_35=Object.freeze({
 lateral:['dumbbell-lateral-raise','cable-lateral-raise'],
 posterior:['cable-rear-delt-fly','face-pull','prone-y-raise'],
 anterior:['dumbbell-shoulder-press','dumbbell-overhead-press','military-press','barbell-overhead-press','pike-pushup']
});
export function shoulderRegions35(history,today){
 const rows=Array.isArray(history?.valid)?history.valid:[];
 const counts={lateral:0,posterior:0,anterior:0};
 let recognised=0;
 for(const row of rows){
  if(!dayValue(row.day)||gap(row.day,today)<0||gap(row.day,today)>6)continue;
  for(const [group,ids] of Object.entries(SHOULDER_REGIONS_35)){
   if(ids.includes(row.exerciseId)){counts[group]++;recognised++;break;}
  }
 }
 return {counts,recognised,unknown:!history?.usable,method:'Gezählte dokumentierte Übungssätze; keine gemessene Muskelaktivierung. Unspezifische Garmin-Übungen bleiben unbekannt.'};
}
/** Deload is merely proposed after multiple convergent warning signals.
 * No automatic load reduction from isolated HRV or day-to-day soreness.
 */
export function coachCycle35(state,{today,goal='vtaper',history={},health={},cycle=null}={}){
 const config=cycle||null;
 const days=config&&dayValue(today)?gap(config.startDay,today):null;
 const week=days!==null&&days>=0?Math.floor(days/7)+1:null;
 const dueReview=week!==null&&week>CYCLE_LENGTH_WEEKS;
 const deloadActive=!!(config?.deloadUntil&&config.deloadUntil>=today&&days!==null&&days>=0);
 const all=(Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[])
  .filter(s=>s?.source==='compass-guided-v5920'&&String(s.startedAt||'').slice(0,10)<=today)
  .sort((a,b)=>String(b.startedAt).localeCompare(String(a.startedAt)));
 const recent=all.slice(0,3).flatMap(s=>(s.exercises||[]).flatMap(e=>e.confirmedSets||[])).filter(s=>s.confirmed&&Number.isInteger(s.rir)&&s.rir>=0&&s.rir<=4);
 const hard=recent.length>=4&&recent.filter(s=>s.rir===0).length>=3;
 const close=history?.latest&&dayValue(history.latest)&&gap(history.latest,today)<=1&&gap(history.latest,today)>=0;
 const correlated=health?.attention===true&&hard;
 const suggested=!!(goal==='vtaper'&&correlated&&recent.length>=4);
 return {week,phase:deloadActive?'deload':dueReview?'review':week?'build':'unconfigured',
  deloadActive,dueReview,suggestDeload:suggested&&!deloadActive,
  recentRir:recent.length,healthAttention:!!health?.attention,frequentFailure:hard,close,
  reason:deloadActive?'Du hast eine Entlastungswoche gewählt: weniger Sätze, Last bleibt deine Entscheidung.':
   dueReview?'Sechs Wochen abgeschlossen: Fortschritt und Erholung prüfen, dann neuen Trainingsblock ausdrücklich starten.':
   suggested?'Wiederholt RIR 0 und gleichzeitig zwei ungünstige persönliche Schlaf-/HRV-Trends. Eine Entlastungswoche könnte helfen.':
   week?`Blockwoche ${week} von 6 · progressive Wiederholungen und Lasten weiter dokumentieren.`:
   'Noch kein Trainingsblock gestartet. Sechs Wochen sind ein Planungsrahmen, kein automatischer Deload.',
  shoulder:shoulderRegions35(history,today)};
}
