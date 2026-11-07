/** 0.5.91.35 — V-Taper shoulder-head planning on actual confirmed set evidence.
 * Effective sets are heuristic credits, NOT measured EMG or clinical recovery.
 * Direct = 1, accessory compound contribution = 0.35 per confirmed set.
 * Same set never receives two credits for one shoulder head; stabilizers = 0.
 */
import {EXERCISE_ANATOMY} from './strength-anatomy-v57737.js';
import {homeAttachmentAllows135} from './strength-home-attachments-v059135.js';
const HEADS=Object.freeze({anterior:'deltoid_front',lateral:'deltoid_side',posterior:'deltoid_rear'});
export const SHOULDER_TARGETS_135=Object.freeze({
 anterior:Object.freeze({minimum:0,softMaximum:8}),
 lateral:Object.freeze({minimum:4,softMaximum:9}),
 posterior:Object.freeze({minimum:4,softMaximum:9})
});
const CREDITS=Object.freeze({primary:1,secondary:0.35});
// These core/anti-rotation movements involve shoulder bracing, not meaningful
// anterior-delt hypertrophy credits despite legacy qualitative anatomy tags.
const SHOULDER_BRACING_ONLY_135=new Set(['plank','pallof-press','ab-wheel-kneeling','cable-woodchop']);
const dayGap=(day,today)=>{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(day))||!/^\d{4}-\d{2}-\d{2}$/.test(String(today)))return null;
 const gap=Math.round((Date.parse(today+'T12:00:00Z')-Date.parse(day+'T12:00:00Z'))/86400000);
 return Number.isFinite(gap)&&gap>=0?gap:null;
};
export function shoulderContribution135(exerciseId){
 const anatomy=EXERCISE_ANATOMY[exerciseId];const output={anterior:0,lateral:0,posterior:0};
 if(!anatomy||SHOULDER_BRACING_ONLY_135.has(exerciseId))return output;
 for(const [key,region] of Object.entries(HEADS)){
  output[key]=anatomy.primary.includes(region)?CREDITS.primary:anatomy.secondary.includes(region)?CREDITS.secondary:0;
 }
 return output;
}
export function effectiveShoulderLoad135(events,today){
 const counts={anterior:0,lateral:0,posterior:0},direct={...counts},indirect={...counts},last={anterior:null,lateral:null,posterior:null};
 let matched=0;
 for(const e of Array.isArray(events)?events:[]){
  const days=dayGap(e?.day,today);
  if(days===null||days>6||!(Number(e?.reps)>0))continue;
  const anatomy=EXERCISE_ANATOMY[e?.exerciseId];if(!anatomy)continue;
  matched++;
  const contribution=shoulderContribution135(e.exerciseId);
  for(const key of Object.keys(counts)){
   const value=contribution[key];if(!value)continue;
   counts[key]+=value;if(value===1)direct[key]+=1;else indirect[key]+=value;
   if(!last[key]||e.day>last[key])last[key]=e.day;
  }
 }
 const rounded=values=>Object.fromEntries(Object.entries(values).map(([k,v])=>[k,Math.round(v*100)/100]));
 return {counts:rounded(counts),direct:rounded(direct),indirect:rounded(indirect),last,matched,method:'Bestätigte zugeordnete Sätze der letzten sieben Tage: direkter Zielmuskel = 1, indirekte Beteiligung = 0,35; Stabilisation = 0. Keine EMG- oder Erholungsmessung.',targets:SHOULDER_TARGETS_135};
}
const HOME_BASE=Object.freeze([
 'dumbbell-row','dumbbell-lateral-raise','reverse-fly','dumbbell-pullover',
 'goblet-squat','dumbbell-romanian-deadlift','ab-wheel-kneeling',
 'dumbbell-floor-press','dumbbell-shoulder-press','calf-raise'
]);
const HOME_CABLE=Object.freeze(['lat-pulldown','cable-straight-arm-pulldown','face-pull','cable-rear-delt-fly','cable-lateral-raise','cable-single-arm-row']);
const GYM_BASE=Object.freeze(['lat-pulldown','cable-lateral-raise','cable-rear-delt-fly','cable-single-arm-row',
 'face-pull','cable-straight-arm-pulldown','squat','cable-crunch','bench']);
const WEIGHT=Object.freeze({
 'dumbbell-row':12,'dumbbell-lateral-raise':12,'reverse-fly':12,'dumbbell-pullover':9,
 'goblet-squat':10,'dumbbell-romanian-deadlift':9,'ab-wheel-kneeling':8,
 'dumbbell-floor-press':8,'dumbbell-shoulder-press':4,'calf-raise':5,
 'lat-pulldown':12,'cable-straight-arm-pulldown':9,'face-pull':12,'cable-rear-delt-fly':12,
 'cable-lateral-raise':12,'cable-single-arm-row':11,'assisted-pullup':11,
 'squat':9,'cable-crunch':8,'bench':7
});
const VOLUME_MIN=Object.freeze({back:7,quads:4,posterior:4,chest:3,core:3,calves:2});
const REPS_COST=Object.freeze({'dumbbell-lateral-raise':3,'reverse-fly':3,'face-pull':3,'cable-rear-delt-fly':3,'cable-lateral-raise':3});
const SHOULDER_ISOLATION=new Set(['dumbbell-lateral-raise','reverse-fly','face-pull','cable-rear-delt-fly','cable-lateral-raise']);
const OVERHEAD=new Set(['dumbbell-shoulder-press']);
/** For future HomeGym, only readiness explicitly confirmed by the user unlocks candidates. */
export function vtaperCandidates135(place='home',attachments={cableReady:false,pullupReady:false}){
 if(place==='gym')return [...GYM_BASE];
 return [...HOME_BASE,...HOME_CABLE.filter(id=>homeAttachmentAllows135(id,attachments)),
  ...(homeAttachmentAllows135('assisted-pullup',attachments)?['assisted-pullup']:[])];
}
const lastAge=(day,today)=>dayGap(day,today);
const regionFor=id=>{
 const x=shoulderContribution135(id);
 return x.lateral>=1?'lateral':x.posterior>=1?'posterior':x.anterior>=1?'anterior':null;
};
/** Deterministic planning. A short session remains ≤3 exercises, never auto-appends accessories.
 * History from the caller is already Garmin/Coach deduplicated; unknown summary
 * workouts remain unknown. Does not persist or mutate any recorded set.
 */
export function selectVtaperExercises135({history={},today,place='home',minutes=25,attachments={},pain=false,healthAttention=false,catalog=null}={}){
 const shoulder=effectiveShoulderLoad135(history.valid||[],today);
 const volume={...shoulder.counts},groupCounts={...(history.counts7||{})};
 const last=history.last||{},candidates=vtaperCandidates135(place,attachments);
 const max=minutes===25?3:minutes===45?5:6;
 const selected=[];const groups={};let shoulderIsolation=0;
 // Rank repeatedly with virtual reservations so two candidate exercises do
 // not unknowingly consume the same remaining shoulder-head budget.
 while(selected.length<max){
  let best=null;
  for(const [index,id] of candidates.entries()){
   if(selected.includes(id))continue;
   if(catalog&&!catalog.has(id))continue;
   if(pain&&OVERHEAD.has(id))continue;
   const item=catalog?.get(id);const primary=item?.primary||'back';
   if((groups[primary]||0)>=(minutes===25?1:2))continue;
   if(SHOULDER_ISOLATION.has(id)&&shoulderIsolation>=(minutes===25?2:3))continue;
   const head=regionFor(id),contribution=shoulderContribution135(id),hasPrimaryHead=Boolean(head);
   if(hasPrimaryHead&&volume[head]>=SHOULDER_TARGETS_135[head].softMaximum)continue;
   // Avoid excessive front-delt pressing when indirect pressing already exists.
   if(head==='anterior'&&(volume.anterior>=4||healthAttention||pain))continue;
   let score=WEIGHT[id]||6;
   if(hasPrimaryHead){
    const target=SHOULDER_TARGETS_135[head];
    score+=(target.minimum-volume[head])*1.7;
    if(head==='lateral'||head==='posterior')score+=3;
    if(head==='anterior')score-=5;
    const age=lastAge(shoulder.last[head],today);
    score-=(age===0?16:age===1?8:age===2?3:0);
   }else{
    const missing=(VOLUME_MIN[primary]??3)-(groupCounts[primary]||0);
    score+=Math.max(-5,Math.min(7,missing*1.1));
   }
   const age=lastAge(last[primary],today);
   score-=(age===0?12:age===1?6:age===2?2:0);
   if(id==='dumbbell-shoulder-press'&&healthAttention)score-=8;
   if((groups[primary]||0)>0)score-=8;
   // Goal: three distinct movement patterns in 25 minutes, not three shoulder
   // isolations. No extrapolation from undocumented Garmin activities.
   if(minutes===25&&selected.length===2&&selected.every(x=>SHOULDER_ISOLATION.has(x))&&SHOULDER_ISOLATION.has(id))continue;
   const estimatedSets=REPS_COST[id]||3;
   const effort=estimatedSets*(0.85)+(estimatedSets-1)*(id==='dumbbell-row'||id==='lat-pulldown'?1.5:1)+0.8;
   const used=selected.reduce((n,x)=>n+3*.85+2*(x==='dumbbell-row'?1.5:1)+.8,5);
   if(selected.length>=2&&used+effort>minutes+0.1)continue;
   if(!best||score>best.score||(score===best.score&&index<best.index))best={id,primary,contribution,score,index};
  }
  if(!best)break;
  selected.push(best.id);groups[best.primary]=(groups[best.primary]||0)+1;
  if(SHOULDER_ISOLATION.has(best.id))shoulderIsolation++;
  for(const head of Object.keys(volume))volume[head]+=best.contribution[head]*3;
  groupCounts[best.primary]=(groupCounts[best.primary]||0)+3;
 }
 return {ids:selected,shoulder,projected:volume,method:'Set-basierte Heuristik: drei Übungen in 25 Minuten; seitliche/hintere Schulter, Rücken und übrige Regionen nach dokumentierter Vorbelastung. Keine RIR- oder Laständerung.'};
}
/** Do not exceed an already almost-full head target after the daily selection. */
export function capShoulderSets135({id,baseSets,shoulder}={}){
 if(!Number.isInteger(baseSets)||baseSets<1)return baseSets;
 const head=regionFor(id);if(!head)return baseSets;
 const credit=shoulderContribution135(id)[head];
 const remaining=SHOULDER_TARGETS_135[head].softMaximum-(shoulder?.counts?.[head]||0);
 return Math.max(1,Math.min(baseSets,Math.floor(Math.max(1,remaining)/credit)));
}
