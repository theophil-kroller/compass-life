/** Compass .59.20 guided workout. Opt-in dynamic import; no eager media or cloud calls.
 * Manual confirmations are kept separate from Garmin/FIT and never auto-annotate imports.
 */
import './strength-guided-v5775920.css';
import {correctGuidedSessionSetWeight122} from './strength-set-corrections-v059122.js';
import './strength-set-corrections-v059122.css';
import {guidedPlanFromSession,resumeExerciseIndex} from './strength-workout-resume-v57759405.js';
import {readEquipment115,dumbbellCount115,availableLoads115,exactLoad115,plateText115,plateSvg115} from './strength-equipment-v059115.js';
import './strength-equipment-v059115.css';
import {validRir34} from './strength-adaptive-v5775934.js';
import {exerciseImagePair89,NEW_EXERCISES_BY_ID_89,guidedBonusCandidate92} from './strength-exercise-library-v0589.js';
import './strength-visual-v0589.css';
import './strength-adaptive-v5775934.css';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clock=s=>`${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`;
const numericReps=s=>{const m=String(s??'').match(/\d+/);return m?Number(m[0]):null;};
export const HOME_PLATES_KG=28;
export const HOME_PLATE_INVENTORY=Object.freeze([{kg:2.5,count:4},{kg:2,count:4},{kg:1.5,count:4},{kg:1,count:4}]);
export const maxHomeWeight=(exerciseId)=>HOME_PLATES_KG; // Available inventory total; exact physical loading depends on grips and clamps.
export function targetCircleLabel(reps){return /sek\.|sec|s\b/i.test(String(reps))?`${numericReps(reps)||'–'}s`:String(numericReps(reps)??'✓');}
// Plate weight represents plates fitted to the selected implement, not 30 kg per dumbbell.
export function validPlateWeight(value,place,exerciseId=''){const n=Number(value);return Number.isFinite(n)&&n>=0&&n<=(place==='home'?maxHomeWeight(exerciseId):500);}

export function makeGuidedSnapshot(plan,startedAt=new Date().toISOString(),id=(globalThis.crypto?.randomUUID?.()||`guided-${Date.now()}-${Math.random().toString(36).slice(2)}`)){
 return {id,source:'compass-guided-v5920',startedAt,finishedAt:null,completed:false,goal:plan.goal,equipment:plan.equipment,planTitle:plan.title,mode:plan.mode||'smart',variant:plan.variant||null,
  currentExerciseIndex:0,started:false,restUntilAt:null,workingWeights:{},
  optionalChoice:plan.optionalChoice||'skipped',optionalExerciseId:plan.optionalExerciseId||null,
  planSnapshot:{title:plan.title,goal:plan.goal,equipment:plan.equipment,equipmentProfile:plan.equipmentProfile||null,exercises:plan.exercises.map(e=>({id:e.id,title:e.title,primary:e.primary||'',sets:e.sets,reps:e.reps,restSeconds:e.restSeconds,lastKg:e.lastKg??null,suggestedKg:e.suggestedKg??null,warmupSets:e.warmupSets||[],progressionHint:e.progressionHint||'',targetReps:Array.isArray(e.targetReps)?e.targetReps.slice(0,e.sets):null}))},
  exercises:plan.exercises.map(e=>({exerciseId:e.id,title:e.title,plannedSets:e.sets,plannedReps:e.reps,targetReps:Array.isArray(e.targetReps)?e.targetReps.slice(0,e.sets):null,restSeconds:e.restSeconds,primary:e.primary||'',confirmedSets:[]})),
  updatedAt:startedAt};
}
export function matchingGuidedSessions(state,garminStart,{maxOffsetMinutes=120}={}){
 const time=Date.parse(garminStart||'');if(!Number.isFinite(time))return [];
 return (Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[])
  .filter(s=>s&&s.source==='compass-guided-v5920'&&Array.isArray(s.exercises)&&s.exercises.some(e=>e.confirmedSets?.length))
  .map(s=>({...s,offsetMinutes:Math.abs(Date.parse(s.startedAt)-time)/60000}))
  .filter(s=>Number.isFinite(s.offsetMinutes)&&s.offsetMinutes<=maxOffsetMinutes)
  .sort((a,b)=>a.offsetMinutes-b.offsetMinutes);
}
export function confirmedGuidedSets(session){return (session?.exercises||[]).flatMap(e=>(e.confirmedSets||[]).filter(r=>r.confirmed).map(r=>({exerciseId:e.exerciseId,reps:Number.isInteger(r.reps)&&r.reps>=0?r.reps:null,weightKg:Number.isFinite(r.weightKg)&&r.weightKg>=0?r.weightKg:null,completedAt:r.completedAt||null})));}
const VISUAL_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'strength-visuals-v5775920/';
const PREMIUM_VISUALS=new Set(['dumbbell-row','dumbbell-lateral-raise','ab-wheel-kneeling','goblet-squat','lat-pulldown','deadlift','dumbbell-pullover']);
const COACH_NEW_VISUAL_ROOT=VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v5775926/');
const COACH_PREMIUM_VISUAL_ROOT=VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v5775927/');
// 0.5.91.26: owner-approved photographic start/end exercise pairs, never schematic fallback.
const CUSTOM_PHOTO_ROOT_126=VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v059126/');
const CUSTOM_PHOTO_EXERCISES_126=new Set(['calf-raise']);
// 0.5.91.27 chest-series: photographic START/END exercises approved for the coach.
// This is a separate static asset collection, preserving all previously approved media.
const CHEST_PHOTO_ROOT_127=VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v059127/');
const CHEST_PHOTO_EXERCISES_127=new Set([
 'incline-bench','pushup','chest-press','chest-fly','close-grip-bench','decline-pushup','incline-pushup'
]);
// 0.5.91.28: six owner-referenced START/ENDE panels for the uncovered back,
// core and combination movements. No changes to exercise history or other media.
const BACK_CORE_PHOTO_ROOT_128=VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v059128/');
const BACK_CORE_PHOTO_EXERCISES_128=new Set([
 'pullup','cable-row','crunch','pallof-press','curl-to-press','hammer-to-press'
]);
// 0.5.91.29 – Eight *individually generated* leg/glute start/end images.
// This branch precedes the old calf photo on purpose, preserving that image on disk.
const LEG_GLUTE_PHOTO_ROOT_129=VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v059129/');
const LEG_GLUTE_PHOTO_EXERCISES_129=new Set([
 'calf-raise','romanian-deadlift','leg-press','lunge',
 'leg-extension','leg-curl','hip-thrust','glute-bridge'
]);
const LEG_GLUTE_PHOTO_HEIGHT_129=Object.freeze({"calf-raise":1015,"romanian-deadlift":995,"leg-press":770,"lunge":990,"leg-extension":885,"leg-curl":795,"hip-thrust":665,"glute-bridge":495});
const LEG_GLUTE_PHASE_CUES_129=Object.freeze({
 'calf-raise':'Fußballen stabil auf der Platte; Fersen tief → Fersen hoch. Hanteln ruhig seitlich halten.',
 'romanian-deadlift':'Aus aufrechtem Stand die Hüfte nach hinten schieben; Knie leicht gebeugt, Rücken neutral, Langhantel dicht an den Beinen.',
 'leg-press':'Aus gebeugten Knien kontrolliert nach vorn drücken; Knie weder nach innen kippen noch hart verriegeln.',
 'lunge':'Aufrecht starten und kontrolliert in den Ausfallschritt absenken; Knie in Fußrichtung, Kurzhanteln seitlich.',
 'leg-extension':'Knie vom gebeugten Zustand kontrolliert gegen das Polster strecken, ohne Schwung.',
 'leg-curl':'Aus kontrollierter Kniestreckung die Unterschenkel Richtung Gesäß beugen, Hüfte bleibt stabil.',
 'hip-thrust':'Obere Rückenpartie an der Bank; Hüfte mit gepolsterter Stange heben, ohne den Rücken zu überstrecken.',
 'glute-bridge':'Rückenlage, Füße stabil, Gesäß anspannen und Becken anheben, dann kontrolliert senken.'
});
const COACH_PREMIUM_PHOTOS=new Set(['squat','bench','barbell-row','military-press','dumbbell-shoulder-press','dumbbell-romanian-deadlift','cable-lateral-raise','face-pull','plank','dead-bug','cable-straight-arm-pulldown','cable-single-arm-row','cable-rear-delt-fly','cable-crunch','cable-woodchop','dumbbell-floor-press','barbell-overhead-press']);
const COACH_NEW_VISUALS=new Set(['dead-bug', 'plank', 'dumbbell-floor-press', 'dumbbell-romanian-deadlift', 'dumbbell-shoulder-press', 'barbell-overhead-press', 'barbell-row', 'bench', 'squat', 'cable-straight-arm-pulldown', 'cable-single-arm-row', 'cable-lateral-raise', 'cable-rear-delt-fly', 'face-pull', 'cable-crunch', 'cable-woodchop', 'military-press', 'cable-row']);
const descriptions={
 'dumbbell-row':['Ellbogen am Körper zurückführen','Stütze dich stabil ab, ziehe die Kurzhantel Richtung Hüfte.','row'],
 'barbell-row':['Stabiler Rumpf · Stange zum Bauch','Hüfte nach hinten, Rücken neutral, zur Taille ziehen.','row'],
 'cable-single-arm-row':['Am Kabel zum Körper ziehen','Ellbogen kontrolliert zurück, nicht aus dem Rücken reißen.','row'],
 'lat-pulldown':['Stange zur oberen Brust','Schulterblätter nach unten führen, Nacken lang lassen.','pulldown'],
 'cable-straight-arm-pulldown':['Arme gestreckt Richtung Hüfte','Schultern tief, kontrollierte Lat-Bewegung.','pulldown'],
 'dumbbell-lateral-raise':['Arme seitlich bis Schulterhöhe','Leichte Hanteln, kein Schwung.','lateral'],
 'cable-lateral-raise':['Seitliches Anheben am Kabel','Arm leicht gebeugt, kontrolliert heben.','lateral'],
 'cable-rear-delt-fly':['Arme nach außen führen','Hintere Schulter ohne Schulterhochziehen.','lateral'],
 'face-pull':['Seil zum Gesicht ziehen','Ellenbogen nach außen und auf Schulterhöhe.','pulldown'],
 'ab-wheel-kneeling':['Ab Wheel nach vorne rollen','Bauch anspannen, nicht ins Hohlkreuz fallen.','rollout'],
 'goblet-squat':['Kontrolliert in die Kniebeuge','Brust aufrecht, Knie folgen den Zehen.','squat'],
 squat:['Hüfte absenken und aufrichten','Rumpf stabilisieren, Knie kontrolliert beugen.','squat'],
 'dumbbell-romanian-deadlift':['Hüfte zurück · Oberkörper nach vorne','Rücken neutral, Hanteln nah am Bein.','hinge'],
 deadlift:['Stange nah am Bein heben','Technik und Kontrolle vor Last.','hinge'],
 'dumbbell-floor-press':['Kurzhanteln vom Boden hochdrücken','Ellenbogen kontrolliert am Boden absetzen.','press'],
 bench:['Langhantel über der Brust drücken','Schulterblätter stabil, Stange kontrolliert senken.','press'],
 'dumbbell-shoulder-press':['Kurzhanteln nach oben drücken','Ohne Hohlkreuz und ohne Schwung.','press'],
 'military-press':['Langhantel über Kopf drücken','Rumpf und Gesäß anspannen, stabil stehen.','press'],
 'dumbbell-pullover':['Hantel hinter den Kopf führen','Nur in kontrolliertem Schulterbereich arbeiten.','press'],
 'cable-crunch':['Bauch am Seil einrollen','Aus dem Bauch beugen, nicht nur mit der Hüfte.','core'],
 'cable-woodchop':['Diagonale Rumpfbewegung','Kontrolliert drehen, ohne zu reißen.','core'],
 plank:['Plank halten','Gesäß und Bauch fest, neutrale Wirbelsäule.','core'],
 'dead-bug':['Arm und Bein gegenläufig strecken','Rücken bleibt stabil am Boden.','core']
};
/** No stick figures for missing photos. Use honest, exercise-specific START/END
 *  instructions until a user-approved photo pair exists; do not substitute a
 *  photo of a different movement or pretend a generic skeleton is personalized.
 */
const PHASE_TEXT_126=Object.freeze({
 'incline-bench':['Schrägbank einstellen, Gewichte kontrolliert vor der oberen Brust halten.','Gewichte ohne Schwung nach oben drücken, Schultern stabil lassen.'],
 'pushup':['Hände ungefähr schulterbreit, Körper in einer geraden Linie stützen.','Brust kontrolliert absenken und wieder hochdrücken.'],
 'chest-press':['Sitzhöhe einstellen, Griffposition auf Brusthöhe wählen.','Griffe nach vorne drücken und kontrolliert zurückführen.'],
 'chest-fly':['Arme seitlich geöffnet, Ellbogen leicht gebeugt, Schultern stabil.','Arme vor der Brust zusammenführen und langsam wieder öffnen.'],
 'pullup':['Im schulterbreiten Griff hängen, Rumpf stabil, Schultern aktiv.','Körper ohne Schwung hochziehen und kontrolliert absenken.'],
 'cable-row':['Aufrecht am Kabelzug sitzen, Arme nach vorne gestreckt.','Griff Richtung Rumpf ziehen, Schulterblätter kontrolliert zurückführen.'],
 'romanian-deadlift':['Hanteln vor den Oberschenkeln, Knie leicht gebeugt.','Hüfte nach hinten führen; aus der Hüfte wieder aufrichten.'],
 'leg-press':['Füße sicher auf der Plattform, Knie gebeugt, Rücken angelehnt.','Plattform kontrolliert wegdrücken, Knie nicht hart durchstrecken.'],
 'lunge':['Stabiler aufrechter Stand, Platz für einen Ausfallschritt.','Schritt nach vorne, beide Knie beugen, kontrolliert zurück.'],
 'leg-extension':['Sitz und Schienbeinpolster anpassen, Knie gebeugt.','Unterschenkel gegen das Polster anheben und langsam senken.'],
 'leg-curl':['Maschine anpassen, Knie in passender Drehachse positionieren.','Fersen kontrolliert Richtung Gesäß ziehen und wieder strecken.'],
 'hip-thrust':['Oberer Rücken abgestützt, Füße stabil am Boden, Hüfte unten.','Hüfte anheben, Gesäß anspannen, kontrolliert absenken.'],
 'glute-bridge':['In Rückenlage die Knie beugen und die Füße aufstellen.','Becken anheben, Gesäß anspannen, kontrolliert absenken.'],
 'calf-raise':['Mit Fußballen auf der Hantelscheibe stehen, Fersen tiefer absenken.','Fersen aktiv hochdrücken und langsam wieder absenken.'],
 'shoulder-press':['Gewichte auf Schulterhöhe, Füße und Rumpf stabil.','Gewichte kontrolliert über Kopf drücken und wieder senken.'],
 'lateral-raise':['Arme neben dem Körper, leichte Ellbogenbeugung.','Arme ohne Schwung seitlich heben und kontrolliert senken.'],
 'reverse-fly':['Oberkörper leicht vorgebeugt, Arme nach unten geführt.','Arme seitlich nach außen öffnen, Schulterblätter stabil.'],
 'biceps-curl':['Ellbogen nah am Körper, Handflächen nach vorne.','Unterarme beugen, Oberarme ruhig halten, kontrolliert senken.'],
 'hammer-curl':['Hanteln im neutralen Griff neben den Oberschenkeln halten.','Unterarme mit neutralem Griff beugen und langsam absenken.'],
 'triceps-pushdown':['Seil oder Stange am Kabelzug, Ellbogen am Rumpf.','Unterarme nach unten strecken und kontrolliert beugen.'],
 'triceps-extension':['Gewicht oberhalb oder hinter dem Kopf halten, Oberarme stabil.','Ellbogen strecken und langsam in die Ausgangslage zurückkehren.'],
 'wrist-curl':['Unterarme auflegen, Handgelenke frei, leichtes Gewicht.','Handgelenke beugen und langsam wieder strecken.'],
 'crunch':['In Rückenlage die Knie beugen, Rumpf entspannt auf dem Boden.','Brustkorb kontrolliert zum Becken einrollen, langsam absenken.'],
 'pallof-press':['Seitlich zum Kabelzug stehen, Griff vor der Brust halten.','Griff gerade nach vorne drücken ohne den Rumpf zu verdrehen.'],
 'curl-to-press':['Gewichte neben dem Körper, stabiler Stand.','Curl ausführen, dann kontrolliert über Kopf drücken und zurück.'],
 'hammer-to-press':['Gewichte im neutralen Griff neben dem Körper.','Neutralen Curl ausführen, anschließend über Kopf drücken und zurück.'],
 'triceps-curl':['Gewicht mit kontrolliert gebeugten Ellbogen vorbereiten.','Ellbogen ohne Oberarm-Schwung strecken und langsam beugen.'],
 'skullcrusher':['In Rückenlage Gewicht über der Brust, Oberarme stabil.','Ellbogen beugen, Gewicht Richtung Kopf senken, wieder strecken.'],
 'close-grip-bench':['Auf der Bank liegen, enger aber komfortabler Griff.','Stange kontrolliert zur Brust senken und nach oben drücken.'],
 'reverse-curl':['Hantel im Obergriff halten, Oberarme am Körper.','Ellbogen beugen, Handgelenke neutral halten und langsam senken.'],
 'concentration-curl':['Sitzend Ellbogen am inneren Oberschenkel abstützen.','Unterarm beugen und ohne Schwung kontrolliert senken.'],
 'seated-dumbbell-press':['Aufrecht sitzen, Hanteln auf Schulterhöhe.','Beide Hanteln kontrolliert über Kopf drücken und absenken.'],
 'incline-pushup':['Hände auf stabiler Erhöhung, Beine gestreckt, Körper gerade.','Brust Richtung Erhöhung führen und wieder hochdrücken.'],
 'decline-pushup':['Füße stabil erhöht, Hände auf dem Boden, Rumpf angespannt.','Brust zum Boden führen und kontrolliert hochdrücken.'],
 'pike-pushup':['Hüfte nach oben, Hände auf dem Boden, Kopf vor den Händen.','Ellbogen beugen, Kopf kontrolliert absenken und hochdrücken.'],
 'prone-y-raise':['In Bauchlage Arme schräg nach vorne in Y-Position halten.','Arme leicht anheben, Schulterblätter stabil, langsam senken.']
});
/** Historical API name kept for test/bridge compatibility. No SVG anatomy here. */
export function exerciseMovementSvg(exerciseId){
 const phases=PHASE_TEXT_126[exerciseId]||[
  'Ausgangsposition der Übung kontrolliert einnehmen.',
  'Bewegung ohne Schwung ausführen und kontrolliert zurückkehren.'
 ];
 const title=descriptions[exerciseId]?.[0]||String(exerciseId||'Übung').replace(/-/g,' ');
 return `<div class="str126-text-motion" role="group" aria-label="Start- und Endposition als Text: ${esc(title)}"><div class="str126-photo-pending">Für diese Übung liegt noch kein freigegebenes Start-/Endfoto vor – keine Strichmännchen-Grafik.</div><div class="str126-steps"><section><small>START</small><p>${esc(phases[0])}</p></section><section><small>ENDE</small><p>${esc(phases[1])}</p></section></div></div>`;
}
/** Exercise-by-exercise player. Confirming a set is required; viewing alone never counts. */
export function openGuidedWorkout({plan,onSession=async()=>{},resumeSession=null}={}){
 if(resumeSession)plan=guidedPlanFromSession(resumeSession);
 if(!plan?.exercises?.length)throw Error('Kein Workout-Plan vorhanden.');
 // A four-card onboarding view exposes, but does not automatically schedule,
 // the day's optional movement. Resumed workouts retain their saved decisions.
 const bonusCandidate=!resumeSession?guidedBonusCandidate92(plan):null;
 let optionalChoice=resumeSession?.optionalChoice||'pending';
 const coreExercises=plan.exercises.map(e=>({...e}));

 let ex=resumeSession?resumeExerciseIndex(resumeSession):0,started=Boolean(resumeSession),resting=false,restSeconds=0,restUntil=0,restTimer=null,restVibrated=false,closed=false,completed=false,active=Boolean(resumeSession),wakeLock=null,plateKg=null;
 let snapshot=resumeSession?structuredClone(resumeSession):makeGuidedSnapshot(plan),before=document.activeElement,saveChain=Promise.resolve(),saveStatus='saved',saveSerial=0;
 let overview=!resumeSession;
 // Do not store a fourth confirmed exercise merely for viewing a suggestion.
 const setBonusChoice=(choice)=>{
  if(started)return;
  optionalChoice=choice;
  plan={...plan,exercises:choice==='accepted'&&bonusCandidate?[...coreExercises,bonusCandidate]:coreExercises};
  snapshot=makeGuidedSnapshot({...plan,optionalChoice:choice,optionalExerciseId:bonusCandidate?.id||null});
  snapshot.optionalChoice=choice;snapshot.optionalExerciseId=bonusCandidate?.id||null;
 };

 snapshot.workingWeights||={};
 const activeProfile=plan.equipmentProfile||readEquipment115();
 const validActual=(value,id)=>{const count=dumbbellCount115(id);return count?Boolean(exactLoad115(activeProfile,Number(value),count)):validPlateWeight(value,plan.equipment,id);};
 const previousLoad=i=>{const saved=snapshot.workingWeights?.[i];const suggestion=plan.exercises[i]?.suggestedKg;const initial=Number.isFinite(suggestion)?suggestion:plan.exercises[i]?.lastKg;const kg=saved===null?null:Number.isFinite(saved)?saved:initial;return Number.isFinite(kg)&&kg>=0&&validActual(kg,plan.exercises[i]?.id)?kg:null;};
 plateKg=previousLoad(0);
 const host=document.createElement('div');host.className='str620-overlay';host.innerHTML='<section class="str620-panel" role="dialog" aria-modal="true" aria-label="Geführtes Krafttraining"></section>';document.body.append(host);
 const el=host.firstElementChild;
 const place=plan.equipment==='gym'?'gym':'home';
 const proposedReps=(idx,setIndex=1)=>{const value=plan.exercises[idx].targetReps?.[setIndex-1];return Number.isInteger(value)&&value>0?value:numericReps(plan.exercises[idx].reps);};
 const numericValue=()=>plateKg===null?'':String(plateKg);
 const timeBased=idx=>/sek\.|sec|s\b/i.test(String(plan.exercises[idx].reps));
 function persist(finished=false){snapshot.updatedAt=new Date().toISOString();snapshot.started=started;snapshot.currentExerciseIndex=ex;if(finished){snapshot.completed=completed;snapshot.finishedAt=snapshot.updatedAt;}
  const data=structuredClone(snapshot),serial=++saveSerial;saveStatus='saving';const show=()=>{const indicator=el.querySelector('[data-save-status]');if(indicator)indicator.textContent=saveStatus==='saved'?'✓ Gesichert':saveStatus==='saving'?'Speichert …':'⚠ Nicht gesichert · erneut versuchen';};show();
  saveChain=saveChain.catch(()=>{}).then(()=>onSession(data)).then(()=>{if(serial===saveSerial){saveStatus='saved';show();}},e=>{if(serial===saveSerial){saveStatus='error';show();}throw e;});return saveChain;}
 function releaseWake(){try{void wakeLock?.release?.();}catch{}wakeLock=null;}
 async function wake(){if(!active||closed||document.hidden||wakeLock||!navigator.wakeLock?.request)return;try{const lock=await navigator.wakeLock.request('screen');if(closed||!active){void lock.release();return;}wakeLock=lock;lock.addEventListener?.('release',()=>{if(wakeLock===lock)wakeLock=null;});}catch{}}
 const visibility=()=>{if(document.visibilityState==='visible'&&active)void wake();else releaseWake();};
 document.addEventListener('visibilitychange',visibility);
 function stopRest(){clearInterval(restTimer);restTimer=null;resting=false;restVibrated=false;snapshot.restUntilAt=null;}
 function timerTick(){
  restSeconds=Math.max(0,Math.ceil((restUntil-performance.now())/1000));
  if(restSeconds<=90&&!restVibrated&&resting){
   restVibrated=true;
   try{if(typeof navigator.vibrate==='function')navigator.vibrate(120);}catch{} // optional Android vibration; never interrupt the workout
  }
  const t=el.querySelector('[data-rest-clock]');if(t)t.textContent=clock(restSeconds);
  const phase=el.querySelector('[data-rest-phase]');if(phase)phase.textContent=restSeconds>90?'Phase 1 / 2':'Phase 2 / 2';
  if(restSeconds===0){stopRest();render();}
 }
 function close(finish=false){if(closed)return;closed=true;active=false;stopRest();releaseWake();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',onKey);window.removeEventListener('pagehide',onPageHide);host.remove();if(started)void persist(finish).catch(e=>console.warn('Workout-Sicherung fehlgeschlagen',e));before?.focus?.({preventScroll:true});}
 const onKey=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',onKey);
 const onPageHide=()=>{if(started&&!closed)void persist().catch(console.warn);};window.addEventListener('pagehide',onPageHide);
 function setRest(seconds){const total=plan.mode==='stronglifts'?Math.max(60,seconds):Math.max(180,seconds);restVibrated=false;resting=total>0;restSeconds=total;restUntil=performance.now()+total*1000;snapshot.restUntilAt=new Date(Date.now()+total*1000).toISOString();clearInterval(restTimer);if(resting)restTimer=setInterval(timerTick,250);}
 function render(){
  if(overview){
   const chosen=optionalChoice==='accepted';
   el.innerHTML=`<header class="str620-head"><div><small>COMPASS · DEIN TRAINING</small><h2>${esc(plan.title)}</h2><p>3 Hauptübungen · ${bonusCandidate?'1 freiwilliger Vorschlag':'kein sicherer Zusatzvorschlag'}</p></div><button type="button" data-act="close" class="str620-close" aria-label="Schließen">×</button></header>
    <section class="str92-overview" aria-label="Vier Trainingsfelder">${coreExercises.map((exercise,i)=>`<article class="str92-tile"><small>ÜBUNG ${i+1} · FEST</small><strong>${esc(exercise.title)}</strong><span>${exercise.sets} × ${esc(exercise.reps)}</span></article>`).join('')}
     <article class="str92-tile str92-optional"><small>ÜBUNG 4 · FREIWILLIG</small>${bonusCandidate?`<strong>${esc(bonusCandidate.title)}</strong><span>${bonusCandidate.sets} × ${esc(bonusCandidate.reps)} · ca. ${bonusCandidate.extraMinutes} Minuten zusätzlich</span><p>${esc(bonusCandidate.reason)}</p><div class="str92-choice"><button type="button" data-act="accept-bonus" aria-pressed="${chosen}">✓ Machen</button><button type="button" data-act="skip-bonus" aria-pressed="${optionalChoice==='skipped'}">Überspringen</button></div><small>${chosen?'✓ Im Training enthalten':optionalChoice==='skipped'?'Übersprungen – keine Sätze verbucht':'Nicht automatisch eingeplant'}</small>`:'<strong>Heute kein sicherer Zusatz</strong><span>Die drei Übungen bleiben unverändert.</span>'}</article></section>
    <footer class="str620-bottom"><small>Dein 25-Minuten-Plan bleibt mit drei Übungen erhalten. Eine vierte Übung verlängert den Plan nur nach deiner Wahl.</small><button type="button" class="str620-primary" data-act="start-workout">▶ Training beginnen</button></footer>`;
   el.querySelector('[data-act="close"]').onclick=()=>close();
   el.querySelector('[data-act="accept-bonus"]')?.addEventListener('click',()=>{setBonusChoice('accepted');render();});
   el.querySelector('[data-act="skip-bonus"]')?.addEventListener('click',()=>{setBonusChoice('skipped');render();});
   el.querySelector('[data-act="start-workout"]').onclick=()=>{if(optionalChoice!=='accepted')setBonusChoice('skipped');overview=false;started=true;active=true;void wake();void persist().catch(console.warn);render();};
   return;
  }
  const curr=plan.exercises[ex],record=snapshot.exercises[ex],done=record.confirmedSets.length,allDone=done>=curr.sets;
  const activeDumbbells=place==='home'?dumbbellCount115(curr.id):null;
  const actualLevels=activeDumbbells?availableLoads115(activeProfile,{dumbbells:activeDumbbells}):[];
  const liveLoad=activeDumbbells&&Number.isFinite(plateKg)?exactLoad115(activeProfile,plateKg,activeDumbbells):null;
  const loadDetail=activeDumbbells?`<details class="str115-guide-details" aria-label="Scheibenbeladung und Gewichtsberechnung"><summary aria-label="Scheibenbelegung anzeigen oder schließen"><span aria-hidden="true">🏋️</span> Scheibenbelegung <small>${liveLoad?`${liveLoad.plateKg.toLocaleString('de-AT')} kg/Hantel`:'Gewicht prüfen'}</small></summary><div class="str115-guide-body"><strong>${liveLoad?`${liveLoad.plateKg.toLocaleString('de-AT')} kg Scheiben je Hantel`:'Scheibenbeladung auswählen'}</strong>${liveLoad?plateSvg115(liveLoad):''}<small>${esc(plateText115(liveLoad))}</small><details><summary>Weitere baubare Stufen</summary><p>${actualLevels.filter(x=>x.plateKg>0).map(x=>`${x.plateKg.toLocaleString('de-AT')} kg`).join(' · ')}</p><small>Bei zwei Hanteln gilt das gemeinsame Inventar; Griffgewicht bleibt separat.</small></details>${curr.progressionHint?`<p>${esc(curr.progressionHint)}</p>`:''}</div></details>`:'';
  const circles=Array.from({length:curr.sets},(_,i)=>{
    const old=record.confirmedSets.find(r=>r.setNumber===i+1&&r.confirmed);
    const label=old?(timeBased(ex)?targetCircleLabel(curr.reps):String(old.reps??'✓')):(timeBased(ex)?targetCircleLabel(curr.reps):String(proposedReps(ex,i+1)??'✓'));
    return `<button type="button" class="str621-rep-circle ${old?'is-confirmed':''}" data-act="set-circle" data-set="${i+1}" aria-pressed="${Boolean(old)}" aria-label="Satz ${i+1}: ${old?'erledigt, '+label+' Wiederholungen. Tippen zum Korrigieren':'noch offen. Tippen zum Bestätigen'}" ${started?'':'disabled'}><strong>${esc(label)}</strong><small>${i+1}</small></button>`;
   }).join('');
  el.innerHTML=`<header class="str620-head"><div><small>COMPASS · HEUTIGER WORKOUT</small><h2>${esc(plan.title)}</h2><p>${ex+1} / ${plan.exercises.length} Übungen · ${esc(({back:'Rücken',shoulders:'Schultern',chest:'Brust',quads:'Beine',posterior:'Beinrückseite',core:'Rumpf'})[curr.primary]||curr.primary||'')}</p></div><button type="button" data-act="close" class="str620-close" aria-label="Schließen">×</button></header>
   <div class="str620-progress" aria-label="Übungsfortschritt">${plan.exercises.map((_,i)=>`<span class="${i<ex?'is-done':i===ex?'is-active':''}"></span>`).join('')}</div>
   <div class="str621-load-block"><div class="str621-load-title"><strong>${place==='home'?'Scheiben am Trainingsgerät':'Trainingsgewicht'}</strong><small>${place==='home'?`${maxHomeWeight(curr.id)} kg Scheiben insgesamt vorhanden · Griffgewicht separat`:'kg · inklusive Stange/Gerät falls zutreffend'}</small></div><div class="str621-load-controls"><button type="button" data-act="minus-plates" aria-label="Gewicht um 1 kg verringern">−</button><label><input inputmode="decimal" type="number" data-plates min="0" max="${activeDumbbells?actualLevels.at(-1)?.plateKg??0:place==='home'?maxHomeWeight(curr.id):500}" step="0.5" placeholder="–" value="${numericValue()}" aria-label="Gewicht in Kilogramm"/> kg</label><button type="button" data-act="plus-plates" aria-label="Gewicht um 1 kg erhöhen">+</button></div></div>
   ${loadDetail}
  <div class="str620-stage"><div class="str620-art">${LEG_GLUTE_PHOTO_EXERCISES_129.has(curr.id)?`<figure class="str620-premium-figure str129-leg-glute-figure"><img src="${LEG_GLUTE_PHOTO_ROOT_129}${curr.id}.webp" width="1448" height="${LEG_GLUTE_PHOTO_HEIGHT_129[curr.id]||850}" alt="${esc(curr.title)} – individuelles KI-Übungsbild: links START, rechts ENDE" loading="eager" decoding="async"/><figcaption>START → ENDE · Individuelle KI-Visualisierung anhand deiner Fotoreferenz</figcaption></figure><p class="str620-cue">${esc(LEG_GLUTE_PHASE_CUES_129[curr.id]||'Langsam und kontrolliert bewegen.')}</p>`:BACK_CORE_PHOTO_EXERCISES_128.has(curr.id)?`<figure class="str620-premium-figure str128-back-core-figure"><img src="${BACK_CORE_PHOTO_ROOT_128}${curr.id}.webp" width="1448" height="850" alt="${esc(curr.title)}: linkes Bild START, rechtes Bild ENDE; KI-generierte Bewegungsdarstellung" loading="eager" decoding="async"/><figcaption>START → ENDE · Realistische KI-Visualisierung auf Basis der persönlichen Fotoreferenz · Technik selbst prüfen</figcaption></figure><p class="str620-cue">${esc((PHASE_TEXT_126[curr.id]||[]).join(' → ')||'Langsam und kontrolliert bewegen.')}</p>`:CHEST_PHOTO_EXERCISES_127.has(curr.id)?`<figure class="str620-premium-figure str127-chest-figure"><img src="${CHEST_PHOTO_ROOT_127}${curr.id}.webp" width="1448" height="1086" alt="${esc(curr.title)}: realistisch dargestellte Anfangs- und Endposition derselben Übung nebeneinander" loading="eager" decoding="async"/><figcaption>START → ENDE · Zwei Bewegungsphasen · KI-Visualisierung mit persönlicher Fotoreferenz</figcaption></figure><p class="str620-cue">${esc((PHASE_TEXT_126[curr.id]||[]).join(' → ')||'Übung kontrolliert durchführen und die Haltung stabil halten.')}</p>`:CUSTOM_PHOTO_EXERCISES_126.has(curr.id)?`<figure class="str620-premium-figure str126-calf-figure"><img src="${CUSTOM_PHOTO_ROOT_126}${curr.id}.webp" width="1448" height="1086" alt="Calf Raise: Links mit zwei schweren Kurzhanteln und den Fußballen auf einer Hantelscheibe, Fersen tief; rechts auf den Zehenspitzen mit erhobenen Fersen" loading="eager" decoding="async"/><figcaption>START: Fersen tief → ENDE: Fersen hoch · 2 Kurzhanteln auf Hantelscheibe · KI-Visualisierung</figcaption></figure><p class="str620-cue">Fußballen auf der Platte lassen; Fersen langsam senken, kontrolliert auf die Zehenspitzen drücken. Bei zwei schweren Hanteln auf stabilen Stand achten.</p>`:NEW_EXERCISES_BY_ID_89.has(curr.id)?`<figure class="str620-premium-figure str589-figure"><div class="str589-photo-pair"><img src="${exerciseImagePair89(curr.id,VISUAL_ROOT.replace('strength-visuals-v5775920/','')).start}" alt="${esc(curr.title)}: Ausgangsposition" loading="eager" decoding="async" width="768" height="600"/><img src="${exerciseImagePair89(curr.id,VISUAL_ROOT.replace('strength-visuals-v5775920/','')).end}" alt="${esc(curr.title)}: zweite Bewegungsphase" loading="eager" decoding="async" width="768" height="600"/></div><figcaption>Start → Endposition · KI-Visualisierung, keine individuelle Technikfreigabe</figcaption></figure><p class="str620-cue">${esc(NEW_EXERCISES_BY_ID_89.get(curr.id).cue)}</p>`:PREMIUM_VISUALS.has(curr.id)?`<figure class="str620-premium-figure"><img src="${VISUAL_ROOT}${curr.id}.webp" width="506" height="504" alt="${esc(curr.title)}: Start- und Endposition als Übungsbild" loading="eager" decoding="async"/><figcaption>${curr.id==='dumbbell-pullover'?'Pullover · Hantel kontrolliert hinter den Kopf und zurück':'Start <span aria-hidden="true">→</span> Ziel'}</figcaption></figure><p class="str620-cue">${esc((descriptions[curr.id]||[])[1]||'Kontrolliert bewegen.')}</p>`:COACH_PREMIUM_PHOTOS.has(curr.id)?`<figure class="str620-premium-figure"><img src="${COACH_PREMIUM_VISUAL_ROOT}${curr.id}.webp" width="1152" height="864" alt="${esc(curr.title)}: Start- und Endposition · Premium-Übungsbild" loading="eager" decoding="async"/><figcaption>Start → Ende · Studioaufnahme (KI-Visualisierung, Technik selbst prüfen)</figcaption></figure><p class="str620-cue">${esc((descriptions[curr.id]||[])[1]||'Körperhaltung kontrollieren, Bewegung sauber ausführen.')}</p>`:exerciseMovementSvg(curr.id)}</div><div class="str620-metadata"><small>ÜBUNG ${ex+1}</small><h3>${esc(curr.title)}</h3><div class="str620-setcount">${done} / ${curr.sets} Sätze</div>${curr.warmupSets?.length?`<small class="sl88-warmups">Aufwärmen (nicht als Arbeitssatz zählen): ${curr.warmupSets.map(w=>`${w.kg} kg × ${w.reps}`).join(' · ')}</small>`:''}<div class="str620-plan">${curr.targetReps?.length?'RIR-Ziele: '+esc(curr.targetReps.join(' / '))+' Wdh.':esc(curr.reps)+' Wdh. empfohlen'} · ${curr.restSeconds} s Satzpause</div>${curr.progressionHint?`<details class="str625-progression str616-progression-details"><summary>Trainingsprogression · zuletzt ${esc(curr.lastKg===null?"Gewicht unbekannt":curr.lastKg+" kg")}</summary><p>${esc(curr.progressionHint)}</p></details>`:""}

   <div class="str621-sets-head"><strong>Sätze</strong><span>${done} / ${curr.sets} bestätigt</span></div><div class="str621-reps" role="group" aria-label="Sätze und Wiederholungen">${circles}</div>${done?`<div class="str34-rir-panel" aria-label="Anstrengungsfeedback pro Satz"><div class="str34-rir-head"><strong>Satz ${record.confirmedSets.at(-1)?.setNumber} · Wiederholungen in Reserve</strong><small>RIR · optional</small></div><div class="str34-rir-values">${[0,1,2,3,4].map(n=>`<button type="button" data-act="rir" data-set="${record.confirmedSets.at(-1)?.setNumber}" data-rir="${n}" aria-pressed="${record.confirmedSets.at(-1)?.rir===n}">${n===4?'4+':n}</button>`).join('')}</div><details class="str34-rir-other"><summary>Bestätigte Sätze: Gewicht / RIR korrigieren</summary><div class="str122-guided-weight-list">${record.confirmedSets.filter(s=>s.confirmed).map(s=>`<label>Satz ${s.setNumber} · RIR <select data-act="rir-select" data-set="${s.setNumber}"><option value="">–</option>${[0,1,2,3,4].map(n=>`<option value="${n}" ${s.rir===n?'selected':''}>${n===4?'4+':n}</option>`).join('')}</select><span>Tatsächlich <input data-act="set-weight" data-set="${s.setNumber}" inputmode="decimal" type="number" min="0" max="500" step="0.5" value="${Number.isFinite(s.weightKg)?s.weightKg:''}" aria-label="Satz ${s.setNumber}: tatsächlich verwendete kg"/> kg</span></label>`).join('')}</div><small class="str122-guided-weight-help">Gewichtsänderung nach Bestätigung wird für diesen Satz gespeichert. Geplante und andere Satzgewichte bleiben unverändert.</small></details></div>`:''}<p class="str621-set-hint">${!started?'▶ starten, dann jeden absolvierten Satz antippen.':'Kreis antippen = Satz bestätigen; erneut tippen = Wiederholungen korrigieren.'}</p>
   ${resting?`<div class="str620-rest">Satzpause <small data-rest-phase>${restSeconds>90?'Phase 1 / 2':'Phase 2 / 2'}</small> · <strong data-rest-clock>${clock(restSeconds)}</strong><small>${plan.mode==='stronglifts'?`${curr.restSeconds} s geplant · Hinweis bei 1:30 Rest`: '90 + 90s · Vibration bei 1:30'}</small><button type="button" data-act="skip-rest">Überspringen</button></div>`:allDone?'<p class="str620-success">✓ Übung abgeschlossen.</p>':''}
   </div></div>
   <footer class="str620-bottom"><button class="str620-secondary" type="button" data-act="prev" ${ex===0?'disabled':''}>← Zurück</button><div class="str620-actions">${!started?'<button type="button" class="str620-primary" data-act="start">▶ Starten</button>':resting?'<button type="button" class="str620-primary" data-act="skip-rest">⏭ Weiter</button>':allDone?`<button type="button" class="str620-primary" data-act="next">${ex===plan.exercises.length-1?'✓ Training beenden':'Nächste Übung →'}</button>`:`<button type="button" class="str620-primary" data-act="confirm">✓ Satz ${done+1} bestätigen</button>`}</div></footer>
   <button type="button" class="str620-save-status" data-save-status data-act="retry-save" title="Speicherstatus · antippen, um erneut zu sichern" aria-label="Gespeicherte Workoutdaten prüfen oder erneut sichern">${saveStatus==='saved'?'✓ Gesichert':saveStatus==='saving'?'Speichert …':'⚠ Nicht gesichert · erneut versuchen'}</button><small class="str620-disclaimer">Nur bestätigte Sätze werden als durchgeführt gespeichert. Garmin-Daten bleiben unverändert.</small>`;
  el.querySelector('[data-act="close"]').onclick=()=>close();
  el.querySelector('[data-act="retry-save"]')?.addEventListener('click',()=>{if(started)void persist().catch(console.warn);});
  el.querySelector('[data-act="prev"]').onclick=()=>{if(ex===0)return;stopRest();ex--;plateKg=previousLoad(ex);void persist().catch(console.warn);render();};
  el.querySelector('[data-act="start"]')?.addEventListener('click',()=>{started=true; active=true;void wake();void persist().catch(console.warn);render();});
  el.querySelector('[data-act="skip-rest"]')?.addEventListener('click',()=>{stopRest();render();});
  const weightBox=el.querySelector('[data-plates]');
  const setWeight=value=>{
    if(value===''||value===null){plateKg=null;return true;}
    const raw=String(value).replace(',','.');
    if(!validActual(raw,curr.id)){if(weightBox)weightBox.setCustomValidity(activeDumbbells?'Diese symmetrische Beladung ist mit deinem Scheibenbestand nicht möglich.':'Gewicht überprüfen.');return false;}
    plateKg=Number(raw);if(weightBox)weightBox.setCustomValidity('');return true;
  };
  weightBox?.addEventListener('change',e=>{if(!setWeight(e.target.value))e.target.reportValidity();else{snapshot.workingWeights[ex]=plateKg;if(started)void persist().catch(console.warn);render();}});
  ['plus','minus'].forEach(sign=>el.querySelector(`[data-act="${sign}-plates"]`)?.addEventListener('click',()=>{
    const current=Number.isFinite(plateKg)?plateKg:0;
    const levels=activeDumbbells?actualLevels.map(x=>x.plateKg):null;
    const next=levels?(sign==='plus'?levels.find(v=>v>current+.001):[...levels].reverse().find(v=>v<current-.001)):(current+(sign==='plus'?1:-1));
    if(next===undefined)return;
    if(!setWeight(Math.min(place==='home'?maxHomeWeight(curr.id):500,Math.max(0,next))))return;
    if(weightBox)weightBox.value=numericValue();snapshot.workingWeights[ex]=plateKg;if(started)void persist().catch(console.warn);render();
  }));
  function confirmSet(index){
    if(!started||index<1||index>curr.sets)return;
    if(weightBox&&!setWeight(weightBox.value)){weightBox.reportValidity();return;}
    const sets=snapshot.exercises[ex].confirmedSets;
    const prior=sets.find(r=>r.setNumber===index&&r.confirmed);
    if(prior){
      // Once confirmed, each tap adjusts the achieved repetition count down by one,
      // wrapping to the plan target. Never guesses a set merely from opening a picture.
      if(timeBased(ex))return;
      const target=proposedReps(ex,index)||1;
      prior.reps=(prior.reps??target)<=0?target:Math.max(0,(prior.reps??target)-1);
      prior.updatedAt=new Date().toISOString();
    }else{
      const confirmedAt=new Date(),completedAt=confirmedAt.toISOString(),completedDay=confirmedAt.toLocaleDateString('sv-SE');
      sets.push({confirmed:true,setNumber:index,reps:timeBased(ex)?null:proposedReps(ex,index),weightKg:plateKg,completedAt,completedDay});
      if(sets.length<curr.sets)setRest(curr.restSeconds);
    }
    void persist().catch(console.warn);render();
    // Keep RIR available immediately after confirming a set, even on short screens.
    el.querySelector('.str34-rir-panel')?.scrollIntoView?.({block:'nearest',behavior:'auto'});
  }
  const saveRir=(index,value)=>{const set=record.confirmedSets.find(s=>s.setNumber===index&&s.confirmed);if(!set)return;const rir=validRir34(value);if(rir===null){delete set.rir;}else set.rir=rir;set.updatedAt=new Date().toISOString();void persist().catch(console.warn);render();el.querySelector(`.str34-rir-panel [data-act="rir"][data-rir="${rir}"]`)?.scrollIntoView?.({block:'nearest',behavior:'auto'});};
  el.querySelectorAll('[data-act="rir"]').forEach(button=>button.onclick=()=>saveRir(Number(button.dataset.set),button.dataset.rir));
  el.querySelectorAll('[data-act="rir-select"]').forEach(select=>select.onchange=()=>saveRir(Number(select.dataset.set),select.value));
  el.querySelectorAll('[data-act="set-weight"]').forEach(input=>input.onchange=()=>{try{correctGuidedSessionSetWeight122(snapshot,{exerciseId:curr.id,setNumber:Number(input.dataset.set),weightKg:input.value});const keepOpen=el.querySelector('.str34-rir-other')?.open;void persist().catch(console.warn);render();if(keepOpen)el.querySelector('.str34-rir-other').open=true;}catch(err){input.setCustomValidity(err.message);input.reportValidity();}});
  el.querySelectorAll('[data-act="set-circle"]').forEach(button=>button.onclick=()=>confirmSet(Number(button.dataset.set)));
  el.querySelector('[data-act="confirm"]')?.addEventListener('click',()=>{
    const next=Array.from({length:curr.sets},(_,i)=>i+1).find(i=>!record.confirmedSets.some(r=>r.setNumber===i));
    if(next)confirmSet(next);
  });
  el.querySelector('[data-act="next"]')?.addEventListener('click',()=>{
    stopRest();if(ex===plan.exercises.length-1){completed=true;close(true);return;}ex++;plateKg=previousLoad(ex);void persist().catch(console.warn);render();
  });
 }
 if(resumeSession){const until=Date.parse(snapshot.restUntilAt||'');const remaining=Number.isFinite(until)?Math.max(0,Math.ceil((until-Date.now())/1000)):0;if(remaining>0){resting=true;restSeconds=remaining;restUntil=performance.now()+remaining*1000;restVibrated=remaining<=90;restTimer=setInterval(timerTick,250);}void wake();}
 render();return {close,save:()=>persist()};
}
