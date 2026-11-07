import {guidedSetDay} from './strength-session-days-v059121.js';
/** Compass 0.5.91.14 · evidence-led V-Taper cycles.
 * Cycle decisions are stored in the existing encrypted journal, never as a
 * second workout log. All statistics use strengthPeriod's Garmin/Coach merge.
 */
import {strengthPeriod} from './strength-insights-v57728.js';
import {coachPlateau47,sessionEvidence47} from './strength-plateau-v57759407.js';
const dayValue=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d||''))&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const gap=(a,b)=>Math.floor((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const add=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const STORE='compass:vtaper:cycle-v5935';
export const CYCLE_LENGTH_WEEKS=6;
const BREAK_DAYS=21;
const asArray=v=>Array.isArray(v)?v:[];
const stamp=()=>new Date().toISOString();
const validBlock=b=>b&&dayValue(b.startDay)&&typeof b.id==='string';
/** Legacy reader is read-only for migration; never creates a cycle. */
export function readCycle35(){
 try{const x=JSON.parse(localStorage.getItem(STORE)||'null');return dayValue(x?.startDay)?{startDay:x.startDay,deloadUntil:dayValue(x.deloadUntil)?x.deloadUntil:null}:null;}catch{return null;}
}
/** Legacy API retained for compatibility with pre-.91.14 clients. */
export function saveCycleAction35(action,today){
 if(!dayValue(today)||!['start','deload','resume'].includes(action))return null;
 try{const previous=readCycle35()||{startDay:today,deloadUntil:null};
 const next=action==='start'?{startDay:today,deloadUntil:null}:action==='deload'?{...previous,deloadUntil:add(today,6)}:{...previous,deloadUntil:null};
 localStorage.setItem(STORE,JSON.stringify(next));return next;}catch{return null;}
}
export const SHOULDER_REGIONS_35=Object.freeze({
 lateral:['dumbbell-lateral-raise','cable-lateral-raise','lateral-raise'],
 posterior:['reverse-fly','cable-rear-delt-fly','face-pull'],
 anterior:['dumbbell-front-raise','shoulder-press','seated-dumbbell-press','dumbbell-shoulder-press','dumbbell-overhead-press','military-press','barbell-overhead-press','pike-pushup']
});
export function shoulderRegions35(history,today){
 const rows=asArray(history?.valid),counts={lateral:0,posterior:0,anterior:0};let recognised=0;
 for(const row of rows){if(!dayValue(row.day)||gap(row.day,today)<0||gap(row.day,today)>6)continue;
 for(const [group,ids] of Object.entries(SHOULDER_REGIONS_35))if(ids.includes(row.exerciseId)){counts[group]++;recognised++;break;}}
 return {counts,recognised,unknown:!history?.usable,method:'Gezählte dokumentierte Übungssätze; keine gemessene Muskelaktivierung. Unspezifische Garmin-Übungen bleiben unbekannt.'};
}
/** A session is evidence of actual training, not a proposed/unstarted workout.
 * Garmin completed activity summaries may have unknown sets. Coach-only
 * sessions must contain a confirmed set. The upstream strengthPeriod merges
 * FIT, CSV and Coach before any counts are taken. */
export function cycleEvidence35(state,today){
 if(!dayValue(today))return {sessions:[],days:[],period:null};
 const period=strengthPeriod(state,{range:'all',today});
 const sessions=asArray(period.sessions).filter(s=>dayValue(s.day)&&s.day<=today&&(
  (asArray(s.sets).length>0)||Number.isInteger(s.reportedSets)&&s.reportedSets>0||
  (s.source!=='compass-guided-v5920'&&s.summaryOnly===true&&Boolean(s.start))||
  (s.source!=='compass-guided-v5920'&&Boolean(s.start)&&Boolean(s.end))
 ));
 const days=[...new Set(sessions.map(s=>s.day))].sort();
 return {sessions,days,period};
}
/** Latest continuous cluster, after a gap of at least 21 calendar days. This
 * identifies a start candidate, not a silent reset of a saved block. */
export function proposedCycleStart35(days){
 const sorted=[...new Set(asArray(days).filter(dayValue))].sort();if(!sorted.length)return null;
 let start=sorted[0];for(let i=1;i<sorted.length;i++)if(gap(sorted[i-1],sorted[i])>=BREAK_DAYS)start=sorted[i];
 return {startDay:start,firstRecordedDay:sorted[0],latestDay:sorted.at(-1),reason:start===sorted[0]?'Erster bestätigter Trainingstag der verfügbaren Historie.':`Neuer zusammenhängender Verlauf ab ${start}: vorangegangene Trainingspause von mindestens ${BREAK_DAYS} Tagen.`,confidence:'heuristic'};
}
const blockId=d=>`vtaper-${d}`;
const newBlock=(day,number=1,source='inferred',at=stamp())=>({id:`${blockId(day)}-${number}`,number,startDay:day,status:'active',source,updatedAt:at,deloadUntil:null,pausedAt:null,pausedDays:0,extendedUntil:null,evaluation:null});
const normalizeStorage=x=>x&&Array.isArray(x.blocks)?{
 schemaVersion:2,activeBlockId:String(x.activeBlockId||''),blocks:x.blocks.filter(validBlock).map(b=>({...b})),updatedAt:String(x.updatedAt||'')
}:null;
export function mergeStrengthCycles35(local,remote){
 const a=normalizeStorage(local),b=normalizeStorage(remote);if(!a)return b;if(!b)return a;
 const rows=new Map();for(const row of [...a.blocks,...b.blocks]){const old=rows.get(row.id);if(!old||String(row.updatedAt||'')>=String(old.updatedAt||''))rows.set(row.id,row);}
 const newest=String(a.updatedAt||'')>=String(b.updatedAt||'')?a:b;
 const activeBlockId=rows.has(newest.activeBlockId)?newest.activeBlockId:(rows.has(a.activeBlockId)?a.activeBlockId:b.activeBlockId);
 return {schemaVersion:2,activeBlockId,blocks:[...rows.values()].sort((x,y)=>x.startDay.localeCompare(y.startDay)),updatedAt:newest.updatedAt};
}
export function initialCycleStorage35(state,{today,legacy=null,evidence=null}={}){
 if(!dayValue(today))return null;
 const existing=normalizeStorage(state?.strengthCycle);if(existing?.blocks?.length)return null;
 const data=evidence||cycleEvidence35(state,today),candidate=proposedCycleStart35(data.days);
 if(!candidate)return null;
 // Respect an explicit preexisting choice if it is not after today; old local
 // preferences never override the already-synced block from another device.
 const chosen=dayValue(legacy?.startDay)&&legacy.startDay<=today?legacy.startDay:candidate.startDay;
 const source=chosen===candidate.startDay?'inferred':'migrated-local';
 const block=newBlock(chosen,1,source);
 if(dayValue(legacy?.deloadUntil)&&legacy.deloadUntil>=chosen)block.deloadUntil=legacy.deloadUntil;
 return {schemaVersion:2,activeBlockId:block.id,blocks:[block],updatedAt:block.updatedAt};
}
export function cycleBlockEvaluation35(sessions,{startDay,today,health={},state=null,pausedDays=0,extendedUntil=null}={}){
 const naturalEnd=add(startDay,41+pausedDays),endDay=dayValue(extendedUntil)&&extendedUntil>naturalEnd?extendedUntil:naturalEnd,stop=today<endDay?today:endDay;
 const within=asArray(sessions).filter(s=>s.day>=startDay&&s.day<=stop);
 const unique=[...new Set(within.map(s=>s.day))];const sets=within.flatMap(s=>asArray(s.sets));
 const confirmed=sets.filter(s=>s?.confirmed!==false);
 const countOnly=within.reduce((n,s)=>n+Math.max(0,(Number.isInteger(s.reportedSets)?s.reportedSets:0)-asArray(s.sets).length),0);
 const anyUnknown=within.some(s=>!asArray(s.sets).length||Number.isInteger(s.reportedSets)&&s.reportedSets>asArray(s.sets).length);
 const knownReps=confirmed.filter(s=>Number.isInteger(s.reps)&&s.reps>0).map(s=>s.reps);
 const volumeSets=confirmed.filter(s=>Number.isFinite(s.weightKg)&&s.weightKg>0&&Number.isInteger(s.reps)&&s.reps>0);
 const muscle={};for(const s of confirmed){const group=s.primary;if(!group)continue;muscle[group]=(muscle[group]||0)+1;}
 const exercise=new Map();for(const session of within)for(const s of asArray(session.sets)){
  if(!s?.exerciseId||!Number.isFinite(s.weightKg)||s.weightKg<=0||!Number.isInteger(s.reps)||s.reps<=0)continue;
  const arr=exercise.get(s.exerciseId)||[];arr.push({day:session.day,kg:s.weightKg,reps:s.reps,primary:s.primary||null});exercise.set(s.exerciseId,arr);
 }
 const progression=[];for(const [id,rows] of exercise){rows.sort((a,b)=>a.day.localeCompare(b.day));if(new Set(rows.map(r=>r.day)).size<2)continue;const first=rows[0],last=rows.at(-1);if(last.kg>first.kg||last.kg===first.kg&&last.reps>first.reps)progression.push(id);}
 const plateaus=[];
 if(state)for(const [id,rows] of exercise){
  const comparable=sessionEvidence47(state,id,today).filter(x=>x.day>=startDay&&x.day<=stop);
  if(comparable.length<4)continue;
  const recent=comparable.slice(-4);
  if(gap(recent[0].day,recent.at(-1).day)<21)continue;
  const res=coachPlateau47(state,id,{today,primary:rows.at(-1)?.primary||'back',healthAttention:health.attention===true});
  if(res.status==='possible-plateau')plateaus.push({exerciseId:id,action:res.action,reason:res.reason});
 }
 const knownRir=asArray(state?.strengthGuidedSessions)
  .filter(s=>s?.source==='compass-guided-v5920'&&!s.deleted)
  .flatMap(session=>asArray(session.exercises).flatMap(e=>asArray(e.confirmedSets).filter(set=>set?.confirmed===true&&guidedSetDay(session,set)>=startDay&&guidedSetDay(session,set)<=stop)))
  .filter(set=>Number.isInteger(set.rir)&&set.rir>=0&&set.rir<=4).map(set=>set.rir);
 const last=asArray(within).at(-1)?.day||null;
 return {startDay,endDay,observedThrough:stop,trainingDays:unique.length,confirmedSets:confirmed.length+countOnly||null,
  knownDetailSets:confirmed.length,unknownSets:anyUnknown,
  repetitions:knownReps.length?knownReps.reduce((a,b)=>a+b,0):null,
  volumeKg:volumeSets.length?Math.round(volumeSets.reduce((n,s)=>n+s.weightKg*s.reps,0)):null,
  muscleSets:muscle,progression,plateaus,bodyComposition:health?.body?.latest?{latest:{...health.body.latest},trend:health.body.trend??null}:null,recordedRir:knownRir.length,
  meanRir:knownRir.length?Math.round(knownRir.reduce((a,b)=>a+b,0)/knownRir.length*10)/10:null,
  recoveryAttention:health.attention===true,lastTrainingDay:last,sessionCount:within.length};
}
export function cycleRecommendation35(evaluation,{health={},interrupted=false,deloadActive=false}={}){
 if(interrupted||evaluation.trainingDays<3||(evaluation.confirmedSets??0)<6||evaluation.unknownSets&&!evaluation.knownDetailSets)
  return {code:'D',label:'Block verlängern oder Daten vervollständigen',reason:'Unterbrechung oder noch zu wenige bestätigte Satzdetails für eine belastbare Periodisierung.'};
 if(deloadActive)return {code:'C',label:'Gewählte Entlastung prüfen',reason:'Die Entlastung wurde bewusst gewählt; kein automatischer Eingriff in den Trainingsplan.'};
 if(health.attention===true&&evaluation.recordedRir>=4&&evaluation.meanRir!==null&&evaluation.meanRir<=1.5)
  return {code:'C',label:'Entlastungswoche erwägen',reason:'Wiederholt niedrige RIR-Angaben zusammen mit ungünstigem Schlaf-/HRV-Vergleich; keine automatische Entlastung.'};
 if((evaluation.plateaus?.length||!evaluation.progression.length)&&evaluation.trainingDays>=4&&(evaluation.confirmedSets??0)>=12)
  return {code:'B',label:'Trainingsschwerpunkt prüfen',reason:'Noch keine dokumentierte vergleichbare Last-/Wiederholungssteigerung; Plateau nur anhand bestehender Plateauanalyse bestätigen.'};
 return {code:'A',label:'Progression fortsetzen',reason:'Bestätigte Trainingstage mit dokumentierter Entwicklung; vorhandene Plateau- und Erholungsregeln gelten weiter.'};
}
export function coachCycle35(state,{today,goal='vtaper',history={},health={},cycle=null}={}){
 const evidence=cycleEvidence35(state,today),stored=normalizeStorage(state?.strengthCycle);
 const pending=stored?.blocks.length?null:initialCycleStorage35(state,{today,legacy:cycle,evidence});
 const storage=stored?.blocks?.length?stored:pending;
 const block=storage?.blocks.find(b=>b.id===storage.activeBlockId)||storage?.blocks.at(-1)||null;
 const paused=!!(block?.status==='paused');
 const pausedDays=(block?.pausedDays||0)+(paused&&dayValue(block.pausedAt)?Math.max(0,gap(block.pausedAt,today)):0);
 const elapsed=block&&today>=block.startDay?Math.max(0,gap(block.startDay,today)-pausedDays):null;
 const week=elapsed===null?null:Math.floor(elapsed/7)+1;
 const dueReview=week!==null&&week>CYCLE_LENGTH_WEEKS&&(!dayValue(block.extendedUntil)||today>block.extendedUntil);
 const deloadActive=!!(block?.deloadUntil&&block.deloadUntil>=today);
 const evaluation=block?cycleBlockEvaluation35(evidence.sessions,{startDay:block.startDay,today,health,state,pausedDays,extendedUntil:block.extendedUntil}):null;
 const last=evaluation?.lastTrainingDay,daysIdle=last?gap(last,today):null;
 const interrupted=daysIdle!==null&&daysIdle>=BREAK_DAYS;
 const recommendation=evaluation?cycleRecommendation35(evaluation,{health,interrupted,deloadActive}):null;
 const shoulder=shoulderRegions35(history,today);
 const recent=asArray(state?.strengthGuidedSessions).filter(s=>s?.source==='compass-guided-v5920'&&!s.deleted)
  .flatMap(session=>asArray(session.exercises).flatMap(e=>asArray(e.confirmedSets).filter(set=>set?.confirmed===true&&guidedSetDay(session,set)<=today)
    .map(set=>({...set,_at:set.completedAt||session.startedAt}))))
  .filter(set=>Number.isInteger(set.rir)&&set.rir>=0&&set.rir<=4)
  .sort((a,b)=>String(b._at||'').localeCompare(String(a._at||''))).slice(0,12);
 const hard=recent.length>=4&&recent.filter(s=>s.rir===0).length>=3;
 const suggestDeload=goal==='vtaper'&&health.attention===true&&hard&&!deloadActive;
 const phase=!block?'unconfigured':paused?'paused':deloadActive?'deload':dueReview?'review':'build';
 return {week,displayWeek:Math.min(6,week||0),phase,deloadActive,dueReview,suggestDeload,shoulder,
  startDay:block?.startDay||null,blockNumber:block?.number||null,block,storage,pendingStorage:pending,daysUntilReview:elapsed===null?null:Math.max(0,42-elapsed),
  autoInferred:!!pending,proposal:proposedCycleStart35(evidence.days),trainingDays:evaluation?.trainingDays??0,activeSets:evaluation?.confirmedSets??null,
  evaluation,recommendation,daysIdle,interrupted,historyBlocks:storage?.blocks||[],
  recentRir:recent.length,frequentFailure:hard,healthAttention:health.attention===true,
  reason:!block?'Noch keine bestätigte Krafttrainingseinheit. Der Block startet automatisch nach einer dokumentierten Trainingseinheit.':
   paused?'Block manuell pausiert. Vorhandene Trainingsdaten bleiben erhalten.':
   interrupted?`${daysIdle} Tage seit dem letzten dokumentierten Training. Fortsetzen, pausieren oder neuen Block wählen – kein automatischer Reset.`:
   dueReview?'Sechs Wochen vergangen: dokumentierte Entwicklung prüfen und den nächsten Schritt selbst entscheiden.':
   `Blockwoche ${week} von 6 · ${evaluation.trainingDays} Trainingstage dokumentiert. Wochen sind ein Planungsrahmen, kein starrer Belastungsplan.`};
}
/** Call ONLY from the existing encrypted vault mutate path. No set or workout is changed. */
export function applyCycleAction35(state,{action,today,legacy=null,startDay=null,health={}}={}){
 if(!dayValue(today))throw Error('Ungültiger Stichtag');
 let storage=normalizeStorage(state.strengthCycle)||initialCycleStorage35(state,{today,legacy});
 if(!storage)return null;
 if(action==='init'&&normalizeStorage(state.strengthCycle))return state.strengthCycle;
 const blocks=storage.blocks.map(b=>({...b}));let active=blocks.find(b=>b.id===storage.activeBlockId)||blocks.at(-1);
 if(action==='set-start'){
  if(!dayValue(startDay)||startDay>today)throw Error('Bitte ein gültiges Startdatum bis heute wählen.');
  active.startDay=startDay;active.source='manual';
 }else if(action==='pause'){if(active.status!=='paused'){active.status='paused';active.pausedAt=today;active.resumedAt=null;}}
 else if(action==='resume'){if(active.status==='paused'&&dayValue(active.pausedAt)){active.pausedDays=(active.pausedDays||0)+Math.max(0,gap(active.pausedAt,today));}active.status='active';active.pausedAt=null;active.resumedAt=today;}
 else if(action==='deload'){active.deloadUntil=add(today,6);}
 else if(action==='deload-end'){active.deloadUntil=null;}
 else if(action==='extend'){active.extendedUntil=add(today,13);}
 else if(action==='new'){
  const evidence=cycleEvidence35(state,today);
  active.evaluation=cycleBlockEvaluation35(evidence.sessions,{startDay:active.startDay,today,health,state,pausedDays:active.pausedDays||0,extendedUntil:active.extendedUntil});
  active.status='finished';active.endedAt=today;active.updatedAt=stamp();
  const next=newBlock(startDay&&dayValue(startDay)?startDay:today,Math.max(...blocks.map(b=>b.number||1))+1,'manual');
  if(next.startDay>today)throw Error('Neuer Trainingsblock darf nicht in der Zukunft beginnen.');
  blocks.push(next);active=next;
 }else if(action!=='init')throw Error('Unbekannte Zyklusaktion');
 active.updatedAt=stamp();storage={schemaVersion:2,activeBlockId:active.id,blocks,updatedAt:active.updatedAt};
 state.strengthCycle=storage;return storage;
}
