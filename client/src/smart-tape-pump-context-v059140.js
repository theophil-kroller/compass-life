/** Compass 0.5.91.40 · User-confirmed post-workout measurement context.
 * All metadata stays in the encrypted nutrition journal and synchronizes by ID.
 * This is a qualitative interpretation aid, NOT a measured edema/pump correction.
 */
import {strengthPeriod} from './strength-insights-v57728.js';
import {EXERCISE_ANATOMY} from './strength-anatomy-v57737.js';

const REGIONS=Object.freeze({
 shoulder:['deltoid_front','deltoid_side','deltoid_rear','trapezius_upper','latissimus'],
 chest:['pectoral_upper','pectoral_lower','latissimus'],
 leftUpperArm:['biceps','brachialis','triceps'],rightUpperArm:['biceps','brachialis','triceps'],
 hip:['glute_max','glute_med'],
 leftThigh:['quadriceps','hamstrings','adductors'],rightThigh:['quadriceps','hamstrings','adductors'],
 leftCalf:['calves_gastro','calves_soleus'],rightCalf:['calves_gastro','calves_soleus']
});
const LABELS={shoulder:'Schulter',chest:'Brust',leftUpperArm:'Oberarm links',rightUpperArm:'Oberarm rechts',hip:'Hüfte',leftThigh:'Oberschenkel links',rightThigh:'Oberschenkel rechts',leftCalf:'Wade links',rightCalf:'Wade rechts'};
const validAt=at=>typeof at==='string'&&Number.isFinite(Date.parse(at))&&/^20\d\d-\d\d-\d\dT/.test(at);
const validTimestamp=x=>{const t=Date.parse(x||'');return Number.isFinite(t)?t:null;};
const tapeRows=state=>(state?.nutritionJournal?.bodyMeasures88||[]).filter(x=>x?.regionId&&!x.deleted&&validAt(x.at));
const contextRows=state=>state?.nutritionJournal?.bodyMeasureContexts140||[];
export const getTapeWorkoutContext140=(state,at)=>contextRows(state).find(x=>x?.id===at)||null;
export function setTapeWorkoutContext140(state,at,postWorkout,{now=new Date().toISOString()}={}){
 if(!validAt(at)||!tapeRows(state).some(x=>x.at===at))throw Error('Smart-Tape-Messung nicht gefunden.');
 if(typeof postWorkout!=='boolean')throw Error('Messzeitpunkt muss bestätigt oder abgewählt werden.');
 if(!validTimestamp(now))throw Error('Änderungszeitpunkt ungültig.');
 state.nutritionJournal??={};state.nutritionJournal.bodyMeasureContexts140??=[];
 const rows=state.nutritionJournal.bodyMeasureContexts140;
 const next={id:at,postWorkout,updatedAt:now};const index=rows.findIndex(x=>x?.id===at);
 if(index<0)rows.push(next);else rows[index]={...rows[index],...next};
 return next;
}
const isSameOrPreviousDay=(day,at)=>{
 const measureDay=at.slice(0,10);
 const previous=new Date(Date.parse(measureDay+'T12:00:00Z')-86400000).toISOString().slice(0,10);
 return day===measureDay||day===previous;
};
/** A source timestamp must precede the tape measurement and be < 4h old.
 * Without a set timestamp a confirmed same-day set remains an unverified
 * association, never an evidence-backed pump attribution.
 */
export function linkedTapeExercises140(strengthSessions=[],at){
 if(!validAt(at))return {matched:[],timeUnknown:[],excludedLater:0};
 const measureAt=Date.parse(at),matched=new Map(),timeUnknown=new Map();let excludedLater=0;
 for(const session of strengthSessions||[]){for(const set of session.sets||[]){
  const anatomy=EXERCISE_ANATOMY[set?.exerciseId];if(!anatomy||!isSameOrPreviousDay(set.day||session.day,at))continue;
  const clock=validTimestamp(set.start||set.completedAt||set.end||session.start||session.end);
  const result={id:set.exerciseId,name:String(set.exercise||set.exerciseId),primary:anatomy.primary};
  if(clock===null){timeUnknown.set(result.id,result);continue;}
  const hours=(measureAt-clock)/3600000;
  if(hours<0){excludedLater++;continue;}
  if(hours>4)continue;
  matched.set(result.id,{...result,hoursSince:lastMin(hours)});
 }}
 return {matched:[...matched.values()],timeUnknown:[...timeUnknown.values()].filter(x=>!matched.has(x.id)),excludedLater};
}
const lastMin=x=>Math.round(x*60)/60;
export function tapePumpAffectedRegions140(exercises=[]){
 const targeted=new Set(exercises.flatMap(x=>x.primary||[]));
 return Object.entries(REGIONS).filter(([,ids])=>ids.some(id=>targeted.has(id))).map(([id])=>id);
}
export function tapeWorkoutCheckins140(state,{today=null,maxSessions=4}={}){
 const byAt=new Map();for(const row of tapeRows(state)){
  if(today&&row.day>today)continue;
  const group=byAt.get(row.at)||{at:row.at,day:row.day,regions:[]};
  group.regions.push(row.regionId);byAt.set(row.at,group);
 }
 const groups=[...byAt.values()].sort((a,b)=>b.at.localeCompare(a.at)).slice(0,maxSessions);
 if(!groups.length)return [];
 // Read the same merged Garmin + confirmed Coach observations used in Muscle Map.
 const workout=strengthPeriod(state,{range:'all',today:today||groups[0].day});
 return groups.map(g=>{
  const flag=getTapeWorkoutContext140(state,g.at),linked=linkedTapeExercises140(workout.sessions,g.at);
  const possiblePumpRegions=flag?.postWorkout===true?tapePumpAffectedRegions140(linked.matched):[];
  return {...g,postWorkout:flag?.postWorkout===true,reviewed:!!flag,linked,
   possiblePumpRegions,possiblePumpLabels:possiblePumpRegions.map(x=>LABELS[x]),
   source:'workout-observation-not-pump-measurement'};
 });
}
