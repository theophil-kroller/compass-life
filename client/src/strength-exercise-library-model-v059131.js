/** Compass 0.5.91.31 · Opt-in exercise library.
 * Only completed, explicitly confirmed sets go to the existing encrypted guided
 * session store; no parallel history, auto-completion or network side effects.
 */
import {EXERCISES} from './strength-editor-v57732.js';
import {NEW_EXERCISES_BY_ID_89} from './strength-exercise-library-v0589.js';
import {readEquipment115,dumbbellCount115,exactLoad115} from './strength-equipment-v059115.js';
const base=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/,'/');
const groups=Object.freeze({'Brust':'Brust','Rücken':'Rücken','Rücken / Beine':'Rücken / Beine','Beine':'Beine & Gesäß','Schultern':'Schultern','Arme':'Arme','Rumpf':'Rumpf','Kombinationsübungen':'Kombination','StrongLifts 5×5':'Kraft','Kraft & Koordination':'Kraft','Funktionell':'Funktionell'});
const GYM_ONLY_131=new Set(['bench','incline-bench','chest-press','chest-fly','lat-pulldown','cable-row','leg-press','leg-extension','leg-curl','triceps-pushdown','pallof-press','cable-straight-arm-pulldown','cable-single-arm-row','cable-lateral-raise','cable-rear-delt-fly','cable-crunch','cable-woodchop','sled-push','face-pull']);
export const BENCH_REQUIRED_131=new Set(['incline-bench','bench','close-grip-bench','hip-thrust','skullcrusher','triceps-curl','dumbbell-bench-press','seated-dumbbell-press','prone-y-raise']);
const series131=Object.freeze({
 'v059131':['biceps-curl','hammer-curl','triceps-pushdown','triceps-extension','wrist-curl','triceps-curl','skullcrusher','reverse-curl','concentration-curl'],
 'v059130':['shoulder-press','lateral-raise','reverse-fly','seated-dumbbell-press','pike-pushup','prone-y-raise'],
 'v059129':['calf-raise','romanian-deadlift','leg-press','lunge','leg-extension','leg-curl','hip-thrust','glute-bridge'],
 'v059128':['pullup','cable-row','crunch','pallof-press','curl-to-press','hammer-to-press'],
 'v059127':['incline-bench','pushup','chest-press','chest-fly','close-grip-bench','decline-pushup','incline-pushup'],
 'v059126':['calf-raise'],
 'v5775927':['squat','bench','barbell-row','military-press','dumbbell-shoulder-press','dumbbell-romanian-deadlift','cable-lateral-raise','face-pull','plank','dead-bug','cable-straight-arm-pulldown','cable-single-arm-row','cable-rear-delt-fly','cable-crunch','cable-woodchop','dumbbell-floor-press','barbell-overhead-press'],
 'v5775920':['dumbbell-row','dumbbell-lateral-raise','ab-wheel-kneeling','goblet-squat','lat-pulldown','deadlift','dumbbell-pullover']
});
const newRoots=Object.freeze({'one-arm-dumbbell-snatch':'one_arm_dumbbell_snatch','dumbbell-front-squat':'dumbbell_front_squat','dumbbell-walking-lunge':'dumbbell_walking_lunge','sled-push':'sled_push','farmers-walk':'farmers_walk','dumbbell-bench-press':'dumbbell_bench_press'});

export const EXERCISE_LIBRARY_ENTRIES_131=Object.freeze(EXERCISES.map(ex=>Object.freeze({...ex,section:groups[ex.group]||ex.group,places:GYM_ONLY_131.has(ex.id)?['gym']:['home','gym']})));
/** Return only local reviewed asset paths; no query-based image substitution. */
export function exercisePhoto131(exerciseId){
 for(const [version,ids] of Object.entries(series131))if(ids.includes(exerciseId))return {kind:'pair',url:`${base}strength-visuals-${version}/${exerciseId}.webp`,series:version};
 if(Object.hasOwn(newRoots,exerciseId))return {kind:'double',start:`${base}strength-visuals-v0589/${newRoots[exerciseId]}_start.webp`,end:`${base}strength-visuals-v0589/${newRoots[exerciseId]}_end.webp`,series:'v0589'};
 return null;
}
export function lastConfirmedLoad131(state,exerciseId){
 let latest=null;
 for(const session of Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[]){
  if(session?.source!=='compass-guided-v5920')continue;
  for(const exercise of session.exercises||[]){
   if(exercise.exerciseId!==exerciseId)continue;
   for(const set of exercise.confirmedSets||[]){
    if(set?.confirmed!==true||!Number.isFinite(set.weightKg)||set.weightKg<0)continue;
    const t=Date.parse(set.completedAt||set.updatedAt||session.startedAt||'');
    if(Number.isFinite(t)&&(!latest||t>latest.t))latest={t,kg:set.weightKg,completedAt:set.completedAt||null};
   }
  }
 }
 return latest?{weightKg:latest.kg,completedAt:latest.completedAt}:null;
}
export function singleExercisePlan131(state,id,{place='home',sets=3,reps='8–12'}={}){
 const e=EXERCISE_LIBRARY_ENTRIES_131.find(x=>x.id===id);
 if(!e)throw Error('Unbekannte Übung – der Datensatz wurde nicht angelegt.');
 if(!e.places.includes(place))throw Error('Die gewählte Übung benötigt Geräte im Gym. Bitte Trainingsort ändern.');
 const count=Number(sets);if(!Number.isInteger(count)||count<1||count>6)throw Error('Bitte 1 bis 6 Sätze wählen.');
 const safeReps=String(reps).trim();if(!/^\d{1,3}(?:[–-]\d{1,3})?(?:\s*(?:Sek\.|sec|s))?(?:\s*\/\s*(?:Seite|Bein))?$/.test(safeReps))throw Error('Wiederholungen oder Sekunden bitte prüfen.');
 const last=lastConfirmedLoad131(state,id);
 const profile=place==='home'?readEquipment115():null;
 const db=dumbbellCount115(id);
 const suggested=last&&(!db||place!=='home'||exactLoad115(profile,last.weightKg,db))?last.weightKg:null;
 const item={id:e.id,title:e.name,primary:e.primary,sets:count,reps:safeReps,restSeconds:e.primary==='quads'||e.primary==='posterior'?90:75,lastKg:last?.weightKg??null,suggestedKg:suggested,warmupSets:[],targetReps:null,progressionHint:last?'Letztes tatsächlich bestätigtes Gewicht als Orientierung, keine automatische Laststeigerung.':'Noch kein gesichertes Coach-Gewicht. Gewicht selbst wählen.'};
 return {mode:'single',variant:'library',goal:'balance',equipment:place,title:`Einzelübung · ${e.name}`,equipmentProfile:profile,exercises:[item],optionalChoice:'skipped'};
}
