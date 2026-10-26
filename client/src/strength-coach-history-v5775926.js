/** Compass 0.5.77.59.26 | Ephemeral unified Coach + Garmin strength read-model.
 * Confirmed Coach sets are mapped to the existing exercise catalog. They are
 * NOT persisted into Garmin FIT rows and they are NOT counted merely on preview.
 * Pairing is deliberately evidence-based: 120-minute session candidate window,
 * but exact exercise/reps/load (or compatible unassigned set) for set matching.
 */
import {manualExerciseMuscles} from './strength-editor-v57732.js';

const dateValue=(value)=>{
 const parsed=Date.parse(value||'');
 return Number.isFinite(parsed)?parsed:null;
};
const localDay=(value)=>{
 const stamp=dateValue(value);
 if(stamp===null)return null;
 const local=new Date(stamp).toLocaleDateString('sv-SE');
 return /^\d{4}-\d{2}-\d{2}$/.test(local)?local:null;
};
const isPositiveInt=value=>Number.isInteger(value)&&value>0&&value<=500;
const validLoad=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=500;
const normalizedWeight=value=>validLoad(value)?value:null;
const closeLoad=(a,b)=>a===null||b===null||Math.abs(a-b)<=0.25;
const compatibleReps=(a,b)=>isPositiveInt(a)&&isPositiveInt(b)&&a===b;
const isUnknownExercise=set=>!set?.exerciseId||!manualExerciseMuscles(set.exerciseId).known;
const originalGarminSet=set=>set?.source!=='compass-guided-confirmed'&&!set?.pairedWithGarmin&&!set?.coachMatched;
const eligibleSession=session=>session?.source==='compass-guided-v5920'&&dateValue(session.startedAt)!==null;

/** Read confirmed Coach sets; for sets recorded without reps, retain the set
 * as known performed work but do not invent reps/weight/volume. A synthetic
 * count-only set may enter the map; it must not drive load progression.
 */
export function coachConfirmedStrengthSets(session){
 if(!eligibleSession(session))return [];
 const rows=[];
 for(const exercise of Array.isArray(session.exercises)?session.exercises:[]){
  const muscles=manualExerciseMuscles(exercise?.exerciseId);
  if(!muscles.known)continue;
  const usedNumbers=new Set();
  for(const set of Array.isArray(exercise.confirmedSets)?exercise.confirmedSets:[]){
   if(set?.confirmed!==true)continue;
   const index=Number.isInteger(set.setNumber)&&set.setNumber>0?set.setNumber:null;
   if(index!==null&&usedNumbers.has(index))continue;
   if(index!==null)usedNumbers.add(index);
   rows.push({
    source:'compass-guided-confirmed',exerciseId:exercise.exerciseId,exercise:muscles.name,
    category:null,primary:muscles.primary,secondary:[...muscles.secondary],knownMuscles:true,
    reps:isPositiveInt(set.reps)?set.reps:null,weightKg:normalizedWeight(set.weightKg),
    start:set.completedAt||session.startedAt,end:set.completedAt||session.startedAt,
    setNumber:index,confirmed:true
   });
  }
 }
 return rows;
}

/** Pure aggregation. Never changes the caller's state or original sessions.
 * Keep summary-only reportedSets as a ceiling for missing sets, so a 4-set
 * Garmin CSV + 3 confirmed Coach sets becomes 3 known + 1 unassigned, not 7.
 */
export function mergeGuidedStrengthSessions(garminSessions,state,{today=null,start=null}={}){
 const original=Array.isArray(garminSessions)?garminSessions:[];
 const sessions=original.map(s=>({...s,sets:[...(Array.isArray(s.sets)?s.sets:[])]}));
 const sources={coachSets:0,pairedSets:0,coachOnlySessions:0,matchedSets:0,unresolvedPairs:0};
 const seen=new Set();
 for(const guided of Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[]){
  if(!eligibleSession(guided))continue;
  const key=String(guided.id||guided.startedAt);
  if(seen.has(key))continue;seen.add(key);
  const performed=coachConfirmedStrengthSets(guided);
  if(!performed.length)continue;
  const stamp=dateValue(guided.startedAt),day=localDay(guided.startedAt);
  if(!day||(today&&day>today)||(start&&day<start))continue;
  const candidates=sessions.map((s,i)=>({s,i,delta:Math.abs((dateValue(s.start)??Infinity)-stamp)}))
   .filter(x=>x.s.source!=='compass-guided-v5920'&&x.delta<=120*60000)
   .sort((a,b)=>a.delta-b.delta);
  const target=candidates[0]?.s||null;
  if(!target){
   sessions.push({id:`coach|${key}`,source:'compass-guided-v5920',day,start:guided.startedAt,
    end:guided.finishedAt||guided.updatedAt||guided.startedAt,sets:performed,activeSets:performed.length,
    reportedSets:performed.length,summaryOnly:false,coachOnly:true,completed:Boolean(guided.completed)});
   sources.coachOnlySessions++;sources.coachSets+=performed.length;
   continue;
  }
  const consumed=new Set();
  // The same Garmin row cannot be paired with two Coach confirmations.
  for(const coach of performed){
   let exact=target.sets.findIndex((g,i)=>!consumed.has(i)&&originalGarminSet(g)&&g?.exerciseId===coach.exerciseId&&compatibleReps(g.reps,coach.reps)&&closeLoad(normalizedWeight(g.weightKg),coach.weightKg));
   if(exact>=0){consumed.add(exact);sources.matchedSets++;continue;}
   // Repair only evidence-compatible *unassigned* Garmin sets. No index guessing.
   exact=target.sets.findIndex((g,i)=>!consumed.has(i)&&originalGarminSet(g)&&isUnknownExercise(g)&&compatibleReps(g.reps,coach.reps)&&closeLoad(normalizedWeight(g.weightKg),coach.weightKg));
   if(exact>=0){
    const garmin=target.sets[exact];
    target.sets[exact]={...garmin,exerciseId:coach.exerciseId,exercise:coach.exercise,
     primary:coach.primary,secondary:coach.secondary,knownMuscles:true,
     reps:isPositiveInt(garmin.reps)?garmin.reps:coach.reps,
     weightKg:validLoad(garmin.weightKg)?garmin.weightKg:coach.weightKg,
     coachMatched:true};
    consumed.add(exact);sources.pairedSets++;continue;
   }
   // Do not discard a real confirmed Coach set merely because a FIT has an
   // unknown, nonmatching set. Such mismatches remain visible for review.
   target.sets.push({...coach,pairedWithGarmin:true});sources.coachSets++;
   if(candidates.length)sources.unresolvedPairs++;
  }
  target.coachLinked=true;
  target.reportedSets=Math.max(Number.isInteger(target.reportedSets)?target.reportedSets:0,target.sets.length);
  target.summaryOnly=false;
 }
 sessions.sort((a,b)=>String(a.start||'').localeCompare(String(b.start||'')));
 return {sessions,sources};
}
