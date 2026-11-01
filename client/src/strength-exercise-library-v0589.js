/** Compass 0.5.89 · optional extensions to the existing exercise catalog.
 * Canonical set history remains strengthJournal / strengthGuidedSessions.
 * Aliases are editorial Garmin-compatible labels, NOT asserted Garmin FIT IDs.
 */
export const NEW_EXERCISES_89=Object.freeze([
 {id:'one-arm-dumbbell-snatch',slug:'one_arm_dumbbell_snatch',english:'One-Arm Dumbbell Snatch',german:'Einarmiges Kurzhantel-Reißen',primary:'posterior',secondary:['shoulders','glutes','quads','core'],pattern:'explosive-hinge',equipment:['dumbbell'],places:['home','gym'],goal:'Explosivkraft',reps:'3–5 / Seite',sets:3,restSeconds:120,recovery:'Mindestens ein Erholungstag nach schwerer hinterer Kettenbelastung; nur kontrollierte Technik.',progression:'Erst Technik und Geschwindigkeit, dann behutsame Last; nicht nach RIR allein steigern.',replaces:['dumbbell-romanian-deadlift'],aliases:['Dumbbell Snatch','Single-Arm Dumbbell Snatch','Kurzhantelreißen','Einarmiges Reißen'],requiresApproval:true,cue:'Neutraler Rücken, Hantel nah am Körper; explosiv strecken und kontrolliert über Kopf stabilisieren. Bei HWS-/Rückenbeschwerden nicht ausführen.'},
 {id:'dumbbell-front-squat',slug:'dumbbell_front_squat',english:'Dumbbell Front Squat',german:'Kurzhantel-Frontkniebeuge',primary:'quads',secondary:['glutes','core','posterior'],pattern:'squat',equipment:['dumbbells'],places:['home','gym'],goal:'Kraft/Hypertrophie',reps:'6–10',sets:3,restSeconds:90,recovery:'48 Stunden nach schwerem Beintraining als vorsichtiger Richtwert.',progression:'Erst saubere Tiefe, dann Wiederholungen oder Gewicht; nicht gleichzeitig automatisch Goblet Squat.',replaces:['goblet-squat','squat'],aliases:['DB Front Squat','Front Squat with Dumbbells','Kurzhantel Front Squat'],cue:'Hanteln stabil auf Schulterhöhe, Brustkorb aufrecht, Knie in Zehenrichtung; unterer Rücken neutral.'},
 {id:'dumbbell-walking-lunge',slug:'dumbbell_walking_lunge',english:'Dumbbell Walking Lunge',german:'Gehender Ausfallschritt mit Kurzhanteln',primary:'quads',secondary:['glutes','posterior','core'],pattern:'unilateral-lunge',equipment:['dumbbells'],places:['home','gym'],goal:'Hypertrophie/Stabilität',reps:'8–12 / Bein',sets:2,restSeconds:75,recovery:'48 Stunden nach schwerem Beintraining als vorsichtiger Richtwert.',progression:'Schrittkontrolle, dann Wiederholungen und Last; Fortschritt pro Bein erfassen.',replaces:['goblet-squat','squat'],aliases:['Walking Lunge','Dumbbell Lunge','Gehende Ausfallschritte'],cue:'Stabiler Schritt nach vorn, hinteres Knie knapp über dem Boden; kein seitliches Einknicken.'},
 {id:'sled-push',slug:'sled_push',english:'Sled Push',german:'Gewichtsschlitten schieben',primary:'quads',secondary:['glutes','posterior','core'],pattern:'sled-drive',equipment:['sled'],places:['gym'],goal:'Kraftausdauer/Funktion',reps:'20 Sek.',sets:4,restSeconds:90,recovery:'Nach anspruchsvollen Schlittenläufen Erholung der Beine berücksichtigen.',progression:'Schlittengewicht oder Strecke/Zeit schrittweise steigern, Reibung des Bodens beachten.',replaces:['squat'],aliases:['Prowler Push','Sled Press','Schlitten schieben'],cue:'Schulter über den Griffen, Rumpf neutral, aktive kurze Schritte. Nur im Studio mit Schlitten.'},
 {id:'farmers-walk',slug:'farmers_walk',english:"Farmer's Walk / Farmer's Carry",german:'Farmergang / Koffertragen mit zwei Hanteln',primary:'forearms',secondary:['core','back','shoulders'],pattern:'loaded-carry',equipment:['dumbbells'],places:['home','gym'],goal:'Griffkraft/Stabilität',reps:'30 Sek.',sets:3,restSeconds:75,recovery:'Griffkraft und Rumpf nach starkem Zugtraining entlasten.',progression:'Gewicht, Strecke oder Dauer – nur eine Variable pro Einheit deutlich erhöhen.',replaces:['plank'],aliases:['Farmers Walk','Farmer Carry','Farmers Carry','Bauernlauf'],cue:'Aufrecht tragen, Rippen über Becken, ruhig vorwärts gehen, Schultern nicht hochziehen.'},
 {id:'dumbbell-bench-press',slug:'dumbbell_bench_press',english:'Dumbbell Bench Press',german:'Kurzhantel-Bankdrücken',primary:'chest',secondary:['triceps','shoulders'],pattern:'horizontal-press',equipment:['dumbbells','bench'],places:['gym'],goal:'Hypertrophie/Kraft',reps:'8–12',sets:3,restSeconds:90,recovery:'Brust und vordere Schulter bei nächster Druckübung beachten.',progression:'Erst alle Sätze kontrolliert im oberen Wiederholungsbereich, dann kleine Gewichtssteigerung.',replaces:['bench','dumbbell-floor-press','pushup','decline-pushup'],aliases:['DB Bench Press','Kurzhantelbankdrücken','Chest Press Dumbbells'],cue:'Schulterblätter stabil, Ellbogen nicht weit ausstellen, kontrolliert neben der Brust senken; Bank erforderlich.'}
].map(entry=>Object.freeze({...entry,secondary:Object.freeze(entry.secondary),places:Object.freeze(entry.places),equipment:Object.freeze(entry.equipment),replaces:Object.freeze(entry.replaces),aliases:Object.freeze(entry.aliases)})));
export const NEW_EXERCISES_BY_ID_89=new Map(NEW_EXERCISES_89.map(e=>[e.id,e]));
const normal=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function resolveExerciseAlias89(value){const needle=normal(value);return NEW_EXERCISES_89.find(e=>[e.id,e.english,e.german,...e.aliases].some(alias=>normal(alias)===needle))?.id||null;}
/** No new program: an explicitly picked extra substitutes one exercise and is never auto-prescribed. */
export function insertOptionalExercise89(ids,{optionalExercise='',equipment='home',strongLifts=false,techniqueApproved=false,pain=false,healthAttention=false,append=false}={}){
 const original=Array.isArray(ids)?[...ids]:[];
 const entry=NEW_EXERCISES_BY_ID_89.get(optionalExercise);
 if(!entry||strongLifts)return {ids:original,reason:entry&&strongLifts?'StrongLifts-Plan bleibt unverändert.':''};
 if(!entry.places.includes(equipment))return {ids:original,reason:'Die gewählte Übung benötigt Ausstattung am anderen Trainingsort.'};
 if(entry.requiresApproval&&(!techniqueApproved||pain||healthAttention))return {ids:original,reason:'Snatch nur nach expliziter Technikfreigabe und ohne akute Beschwerden.'};
 if(original.includes(entry.id))return {ids:original,selected:entry.id};
 // A longer, explicitly accepted workout may add the movement; short sessions swap.
 if(append&&original.length<6)return {ids:[...original,entry.id],selected:entry.id,mode:'bonus',reason:'Freiwillige Zusatzübung, ausschließlich nach Bestätigung.'};
 const replacement=original.findIndex(id=>entry.replaces.includes(id));
 if(replacement>=0)original.splice(replacement,1,entry.id);
 else if(original.length)original.splice(original.length-1,1,entry.id);
 else original.push(entry.id);
 return {ids:original,selected:entry.id,mode:'swap',reason:'Freiwillige Auswahl ersetzt eine Übung statt das Trainingsvolumen automatisch zu erhöhen.'};
}
export const NEW_EXERCISE_IMAGE_ROOT_89='strength-visuals-v0589/';
export function exerciseImagePair89(id,base='/'){const info=NEW_EXERCISES_BY_ID_89.get(id);if(!info)return null;const root=String(base).replace(/\/?$/,'/')+NEW_EXERCISE_IMAGE_ROOT_89;return {start:root+info.slug+'_start.webp',end:root+info.slug+'_end.webp'};}

/** Compass 0.5.90 · ONE opt-in daily idea. Uses the SAME exercise metadata and
 * documented coach history as the core planner. Never mutates a workout.
 * Unknown training history is not interpreted as recovered muscle.
 */
export function suggestOptionalExercise90({plannedIds=[],goal='vtaper',equipment='home',minutes=25,availableMinutes=0,history=null,today='',pain=false,healthAttention=false,strongLifts=false}={}){
 if(strongLifts||pain||healthAttention)return null;
 const current=new Set(plannedIds||[]);
 const target={
  vtaper:{'farmers-walk':6,'dumbbell-bench-press':3,'dumbbell-front-squat':3,'dumbbell-walking-lunge':3,'sled-push':1},
  strength:{'dumbbell-front-squat':7,'dumbbell-bench-press':7,'dumbbell-walking-lunge':5,'farmers-walk':4,'sled-push':4},
  balance:{'dumbbell-walking-lunge':7,'farmers-walk':6,'dumbbell-front-squat':6,'dumbbell-bench-press':5,'sled-push':3},
  abs:{'farmers-walk':8,'dumbbell-walking-lunge':6,'dumbbell-front-squat':5,'sled-push':3,'dumbbell-bench-press':2}
 };
 const targets=target[goal]||target.balance;
 const age=(day)=>/\d{4}-\d{2}-\d{2}/.test(String(day||''))&&/^\d{4}-\d{2}-\d{2}$/.test(String(today||''))?
  Math.round((Date.parse(today+'T12:00:00Z')-Date.parse(day+'T12:00:00Z'))/86400000):null;
 const candidates=NEW_EXERCISES_89.filter(e=>e.places.includes(equipment)&&!e.requiresApproval&&!current.has(e.id)).map(e=>{
  const recent=[e.primary,...e.secondary].map((g,i)=>({g,i,days:age(history?.last?.[g]),sets:Number(history?.counts7?.[g]||0)}));
  // An acute training burden on the primary or important secondary groups
  // must not trigger a next-day optional recommendation.
  if(recent.some(x=>x.days!==null&&x.days>=0&&x.days<=1&&x.sets>=(x.i===0?3:4)))return null;
  const present=plannedIds.some(id=>e.replaces.includes(id));
  const extraTime=Math.ceil(e.sets*.8+Math.max(0,e.sets-1)*e.restSeconds/60);
  // Always permit a *choice* on the four-card overview: the user can extend the
  // 25-minute routine deliberately, but the plan itself is never extended silently.
  const recently=recent.some(x=>x.days!==null&&x.days>=0&&x.days<=2&&x.sets>=2);
  const score=(targets[e.id]||0)+(present?2:0)-(recently?4:0)+(e.places.length===1?0:.1)+(extraTime<=Number(availableMinutes||0)?1:0);
  const reason=present?'Passt als Variation zu einer bereits geplanten Übung.':
   'Setzt einen ergänzenden Trainingsreiz neben den geplanten Hauptübungen.';
  return {...e,score,reason,replaceId:plannedIds.find(id=>e.replaces.includes(id))||null,extraTime};
 }).filter(Boolean).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const pick=candidates[0];if(!pick)return null;
 return {id:pick.id,title:pick.german,english:pick.english,primary:pick.primary,
  reason:pick.reason+' '+pick.cue,
  replacement:pick.replaceId,sets:pick.sets,reps:pick.reps,restSeconds:pick.restSeconds,
  // Suggest an actual add-on only when the routine's remaining time allows it.
  mode:pick.extraTime<=Number(availableMinutes||0)?'conditional-bonus':'swap',
  estimatedExtraMinutes:pick.extraTime};
}

/** 0.5.91.2: Prepares a *proposal*, never an extra completed exercise.
 * A three-exercise smart workout gets at most one fourth option. StrongLifts
 * and safety-blocked days do not acquire an optional prescription.
 */
export function guidedBonusCandidate92(plan){
 if(!plan||plan.mode==='stronglifts'||!Array.isArray(plan.exercises)||plan.exercises.length!==3||!plan.suggestedOptional)return null;
 const idea=plan.suggestedOptional,meta=NEW_EXERCISES_BY_ID_89.get(idea.id);
 if(!meta||meta.requiresApproval||!meta.places.includes(plan.equipment)||plan.exercises.some(e=>e.id===idea.id))return null;
 return {id:meta.id,title:meta.german,primary:meta.primary,secondary:[...meta.secondary],sets:meta.sets,reps:meta.reps,restSeconds:meta.restSeconds,
  lastKg:null,suggestedKg:null,progressionHint:'Freiwillige Übung; Gewicht und Dauer selbst wählen.',reason:idea.reason,
  optional:true,extraMinutes:idea.estimatedExtraMinutes,order:4};
}
