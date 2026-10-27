/** Compass .59.40.6 — transparent, conservative, evidence-informed V-Taper progression.
 * RIR is ordinal self-report, 4+ means >=4 (not exactly four), and Garmin has
 * no inferred RIR. Never infer a measured recovery or guarantee hypertrophy.
 * Suggestions NEVER mutate the logged weight or prescribe training to failure.
 */
const BODYWEIGHT_46=new Set(['pike-pushup','decline-pushup','prone-y-raise','ab-wheel-kneeling','dead-bug','plank']);
const dayISO=s=>/^\d{4}-\d\d-\d\d$/.test(String(s||''))?String(s):null;
const limits=range=>{
 const match=String(range||'').match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
 if(!match||/sek\.|sec|(?:^|\s)\d+s\b/i.test(String(range||'')))return null;
 const lo=Number(match[1]),hi=Number(match[2]||match[1]);
 return lo>0&&hi>=lo&&hi<101?{lo,hi}:null;
};
export function latestCoachRirSession46(state,exerciseId,today){
 const cut=dayISO(today)||new Date().toISOString().slice(0,10);
 const sessions=(Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[])
  .filter(s=>s?.source==='compass-guided-v5920'&&!s.deleted&&(s.completed===true||Boolean(s.finishedAt))&&String(s.startedAt||'').slice(0,10)<=cut&&
   Array.isArray(s.exercises)&&s.exercises.some(e=>e.exerciseId===exerciseId&&e.confirmedSets?.some(r=>r.confirmed===true)));
 const chosen=sessions.sort((a,b)=>String(b.startedAt||'').localeCompare(String(a.startedAt||'')))[0];
 if(!chosen)return null;
 const sets=chosen.exercises.filter(e=>e.exerciseId===exerciseId).flatMap(e=>e.confirmedSets||[])
  .filter(s=>s?.confirmed===true&&Number.isInteger(s.reps)&&s.reps>0)
  .sort((a,b)=>Number(a.setNumber||0)-Number(b.setNumber||0));
 if(!sets.length)return null;
 const day=String(chosen.startedAt||'').slice(0,10);
 const elapsed=Math.floor((Date.parse(cut+'T12:00:00Z')-Date.parse(day+'T12:00:00Z'))/86400000);
 return {day,elapsed,sets,sessionId:chosen.id||'',isFinished:chosen.completed===true||Boolean(chosen.finishedAt)};
}
/** New rep targets based on latest *confirmed* per-set outcomes at the same actual load.
 * Outcomes deliberately depend on one recorded session (not blended Garmin data).
 * RIR unknown => no RIR-driven override. A single 4+ is low confidence.
 */
export function rirProgression46(state,exerciseId,{today,reps,plannedSets=3,lastKg=null,equipment='home',goal='vtaper',strongLifts=false,healthAttention=false,deload=false,weightStepKg=2}={}){
 if(goal!=='vtaper'||strongLifts)return null;
 const range=limits(reps);if(!range)return null;
 const recent=latestCoachRirSession46(state,exerciseId,today);
 const bodyweight=BODYWEIGHT_46.has(exerciseId);
 if(!recent||recent.elapsed<0||recent.elapsed>28||(!bodyweight&&(!Number.isFinite(lastKg)||lastKg<=0)))return null;
 const sets=recent.sets.filter(s=>bodyweight?(s.weightKg===null||s.weightKg===0||s.weightKg===undefined):(Number.isFinite(s.weightKg)&&Math.abs(s.weightKg-lastKg)<.05));
 if(sets.length<Math.min(2,plannedSets))return null;
 const R=sets.filter(s=>Number.isInteger(s.rir)&&s.rir>=0&&s.rir<=4);
 if(!R.length)return null;
 const repsNow=sets.slice(0,plannedSets).map(s=>s.reps);
 const anyFailure=R.some(s=>s.rir===0);
 const high=R.every(s=>s.rir>=3)&&R.some(s=>s.rir===4);
 const avg=R.reduce((sum,s)=>sum+s.rir,0)/R.length;
 const recovered=!healthAttention&&!deload;
 // One RIR report only grants a cautious +1 rep suggestion, never a load jump.
 const trustLoad=R.length>=Math.min(2,plannedSets)&&sets.length>=plannedSets;
 const atUpper=sets.length>=plannedSets&&sets.slice(0,plannedSets).every(s=>s.reps>=range.hi);
 const step=Number(weightStepKg)||2;
 const smallStep=!bodyweight&&step>0&&step/lastKg<=.075&&(equipment!=='home'||lastKg+step<=28); // 7.5% is a conservative default, not a clinical threshold.
 const next=sets.slice(0,plannedSets).map(s=>{
  const rir=Number.isInteger(s.rir)&&s.rir>=0&&s.rir<=4?s.rir:null;
  const base=Math.max(1,Math.min(range.hi,s.reps));
  if(!recovered||rir===0||rir===1)return base;
  if(rir===4)return Math.min(range.hi,base+1);
  if(rir===3)return Math.min(range.hi,base+1);
  if(rir===2)return base<range.hi?base+1:base;
  // Missing feedback is never treated as easy: use recorded reps as the target.
  return base;
 });
 const fatigue=healthAttention||deload;
 const noIncrease=anyFailure||avg<1.5;
 if(fatigue)return {action:'hold-recovery',targetReps:repsNow.map(r=>Math.max(1,Math.min(range.hi,r))),lastRir:avg,confidence:R.length>=2?'moderate':'low',suggestedKg:null,
  message:'Erholung/Entlastung berücksichtigen: letzte Wiederholungen zunächst stabilisieren. RIR allein ist kein Erholungstest.'};
 if(noIncrease)return {action:'hold-fatigue',targetReps:next,lastRir:avg,confidence:R.length>=2?'moderate':'low',suggestedKg:null,
  message:'RIR 0–1: gleiche Last und saubere Technik priorisieren. Kein automatischer Belastungssprung.'};
 if(atUpper){
  // 4+ signals large reserve but does not license a 25% dumbbell jump.
  if(trustLoad&&smallStep&&R.every(s=>s.rir>=2))return {action:'increase-load',targetReps:[],lastRir:avg,confidence:'moderate',suggestedKg:Math.round((lastKg+step)*100)/100,
   message:`Alle ${plannedSets} Arbeitssätze an der Obergrenze bei RIR ≥2. +${step.toLocaleString('de-AT')} kg als optionaler nächster Versuch (Lastsprung ≤7,5 %).`};
  return {action:'hold-at-cap',targetReps:repsNow.map(r=>Math.min(range.hi,r)),lastRir:avg,confidence:trustLoad?'moderate':'low',suggestedKg:null,
   message:bodyweight?'Körpergewichtsübung am Zielbereich: anspruchsvollere Variante oder kontrollierte Ausführung prüfen, keine fiktive Gewichtssteigerung.':'Obergrenze erreicht. Erst kontrollierte Wiederholungen bestätigen; großer Lastsprung oder unvollständige RIR-Daten – feinere Gewichte bzw. Übungsvariante prüfen.'};
 }
 const changed=next.some((v,i)=>v>repsNow[i]);
 return {action:changed?'increase-reps':'hold',targetReps:next,lastRir:avg,confidence:R.length>=2?'moderate':'low',suggestedKg:null,
  message:changed?`RIR-gestützte Wiederholungsziele bei ${bodyweight?'Körpergewicht':lastKg.toLocaleString('de-AT')+' kg'}: ${next.join(' / ')}. Zielbereich RIR 1–3, überwiegend etwa 2; Technik und Erholung haben Vorrang.`:
   'Gleiche Last und Wiederholungen zunächst stabilisieren; RIR-Angabe und Technik beim nächsten Training erneut beurteilen.'};
}
