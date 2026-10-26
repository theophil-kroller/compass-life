/** Compass .59.20 guided workout. Opt-in dynamic import; no eager media or cloud calls.
 * Manual confirmations are kept separate from Garmin/FIT and never auto-annotate imports.
 */
import './strength-guided-v5775920.css';
import {validRir34} from './strength-adaptive-v5775934.js';
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
 return {id,source:'compass-guided-v5920',startedAt,finishedAt:null,completed:false,goal:plan.goal,equipment:plan.equipment,planTitle:plan.title,
  exercises:plan.exercises.map(e=>({exerciseId:e.id,title:e.title,plannedSets:e.sets,plannedReps:e.reps,restSeconds:e.restSeconds,confirmedSets:[]})),
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
// Schematic two-phase movement drawings; explicitly not photorealistic technique instruction.
function joint(x,y){return `<circle cx="${x}" cy="${y}" r="6.5" fill="#f1c4a0" stroke="#507863" stroke-width="1.5"/>`;}
function figure(type,finished=false){
 const g=`stroke="#305c47" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8"`;
 const d={
  lateral:finished?'M70 47 L25 30 M70 47 L115 30 M70 53 L70 99 M70 99 L50 136 M70 99 L90 136':'M70 47 L49 76 M70 47 L91 76 M70 53 L70 99 M70 99 L50 136 M70 99 L90 136',
  pulldown:finished?'M70 49 L43 54 L30 35 M70 49 L97 54 L110 35 M70 55 L70 99 M70 99 L49 136 M70 99 L91 136':'M70 49 L50 20 L50 9 M70 49 L90 20 L90 9 M70 55 L70 99 M70 99 L49 136 M70 99 L91 136',
  press:finished?'M70 49 L51 20 L51 5 M70 49 L89 20 L89 5 M70 53 L70 99 M70 99 L50 136 M70 99 L90 136':'M70 49 L45 54 L45 34 M70 49 L95 54 L95 34 M70 53 L70 99 M70 99 L50 136 M70 99 L90 136',
  squat:finished?'M70 50 L70 92 M70 63 L50 78 M70 63 L90 78 M70 92 L49 120 L42 138 M70 92 L89 120 L96 138':'M70 50 L70 89 M70 63 L48 78 M70 63 L92 78 M70 89 L41 94 L37 136 M70 89 L99 94 L103 136',
  row:finished?'M97 47 L67 75 M67 75 L89 96 M76 70 L56 90 M67 75 L61 135 M67 75 L105 136':'M97 47 L67 75 M67 75 L108 104 M76 70 L44 117 M67 75 L61 135 M67 75 L105 136',
  hinge:finished?'M70 50 L70 90 M70 65 L49 103 M70 65 L91 103 M70 90 L50 136 M70 90 L90 136':'M98 54 L70 85 M70 85 L51 113 M70 85 L89 113 M70 85 L50 136 M70 85 L90 136',
  rollout:finished?'M38 102 L83 75 M83 75 L114 106 M38 102 L21 134 M38 102 L60 134':'M47 93 L77 77 M77 77 L90 108 M47 93 L27 134 M47 93 L59 134',
  core:finished?'M70 49 L70 89 M70 62 L36 56 M70 62 L102 35 M70 89 L41 133 M70 89 L105 130':'M70 49 L70 89 M70 62 L36 87 M70 62 L104 87 M70 89 L48 133 M70 89 L92 133'};
 const head=type==='row'?joint(101,40):type==='hinge'&&!finished?joint(106,48):type==='rollout'?joint(finished?82:81,70):joint(70,37);
 const weights=['lateral','press','row'].includes(type)?`<rect x="${finished?'15':'38'}" y="${finished?'24':'73'}" width="12" height="9" rx="2" fill="#628b77" opacity=".7"/>`:'';
 return `<g ${g}><path d="${d[type]||d.core}"/></g>${head}${weights}`;
}
export function exerciseMovementSvg(exerciseId){
 const [title,cue,type]=descriptions[exerciseId]||['Bewegung kontrolliert ausführen','Technik vor Tempo.','core'];
 const show=(end)=>`<svg viewBox="0 0 140 160" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M8 145 H132" stroke="#b2c6b6" stroke-width="2"/>${figure(type,end)}</svg>`;
 return `<div class="str620-motion" role="img" aria-label="Schematische Start- und Zielhaltung: ${esc(title)}"><div>${show(false)}<small>Start</small></div><span aria-hidden="true">→</span><div>${show(true)}<small>Ziel</small></div></div><p class="str620-cue">${esc(cue)}</p>`;
}
/** Exercise-by-exercise player. Confirming a set is required; viewing alone never counts. */
export function openGuidedWorkout({plan,onSession=async()=>{}}={}){
 if(!plan?.exercises?.length)throw Error('Kein Workout-Plan vorhanden.');
 let ex=0,started=false,resting=false,restSeconds=0,restUntil=0,restTimer=null,restVibrated=false,closed=false,completed=false,active=false,wakeLock=null,plateKg=null;
 let snapshot=makeGuidedSnapshot(plan),before=document.activeElement,saveChain=Promise.resolve();
 const previousLoad=i=>{const kg=plan.exercises[i]?.lastKg;return Number.isFinite(kg)&&kg>0&&validPlateWeight(kg,plan.equipment,plan.exercises[i]?.id)?kg:null;};
 plateKg=previousLoad(0);
 const host=document.createElement('div');host.className='str620-overlay';host.innerHTML='<section class="str620-panel" role="dialog" aria-modal="true" aria-label="Geführtes Krafttraining"></section>';document.body.append(host);
 const el=host.firstElementChild;
 const place=plan.equipment==='gym'?'gym':'home';
 const proposedReps=idx=>numericReps(plan.exercises[idx].reps);
 const numericValue=()=>plateKg===null?'':String(plateKg);
 const timeBased=idx=>/sek\.|sec|s\b/i.test(String(plan.exercises[idx].reps));
 function persist(finished=false){snapshot.updatedAt=new Date().toISOString();if(finished){snapshot.completed=completed;snapshot.finishedAt=snapshot.updatedAt;}
  const data=structuredClone(snapshot);saveChain=saveChain.catch(()=>{}).then(()=>onSession(data));return saveChain;}
 function releaseWake(){try{void wakeLock?.release?.();}catch{}wakeLock=null;}
 async function wake(){if(!active||closed||document.hidden||wakeLock||!navigator.wakeLock?.request)return;try{const lock=await navigator.wakeLock.request('screen');if(closed||!active){void lock.release();return;}wakeLock=lock;lock.addEventListener?.('release',()=>{if(wakeLock===lock)wakeLock=null;});}catch{}}
 const visibility=()=>{if(document.visibilityState==='visible'&&active)void wake();else releaseWake();};
 document.addEventListener('visibilitychange',visibility);
 function stopRest(){clearInterval(restTimer);restTimer=null;resting=false;restVibrated=false;}
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
 function close(finish=false){if(closed)return;closed=true;active=false;stopRest();releaseWake();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',onKey);host.remove();if(started)void persist(finish).catch(e=>console.warn('Workout-Sicherung fehlgeschlagen',e));before?.focus?.({preventScroll:true});}
 const onKey=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',onKey);
 function setRest(seconds){const total=Math.max(180,seconds);restVibrated=false;resting=total>0;restSeconds=total;restUntil=performance.now()+total*1000;clearInterval(restTimer);if(resting)restTimer=setInterval(timerTick,250);}
 function render(){
  const curr=plan.exercises[ex],record=snapshot.exercises[ex],done=record.confirmedSets.length,allDone=done>=curr.sets;
  const circles=Array.from({length:curr.sets},(_,i)=>{
    const old=record.confirmedSets.find(r=>r.setNumber===i+1&&r.confirmed);
    const label=old?(timeBased(ex)?targetCircleLabel(curr.reps):String(old.reps??'✓')):targetCircleLabel(curr.reps);
    return `<button type="button" class="str621-rep-circle ${old?'is-confirmed':''}" data-act="set-circle" data-set="${i+1}" aria-pressed="${Boolean(old)}" aria-label="Satz ${i+1}: ${old?'erledigt, '+label+' Wiederholungen. Tippen zum Korrigieren':'noch offen. Tippen zum Bestätigen'}" ${started?'':'disabled'}><strong>${esc(label)}</strong><small>${i+1}</small></button>`;
   }).join('');
  el.innerHTML=`<header class="str620-head"><div><small>COMPASS · HEUTIGER WORKOUT</small><h2>${esc(plan.title)}</h2><p>${ex+1} / ${plan.exercises.length} Übungen · ${esc(({back:'Rücken',shoulders:'Schultern',chest:'Brust',quads:'Beine',posterior:'Beinrückseite',core:'Rumpf'})[curr.primary]||curr.primary||'')}</p></div><button type="button" data-act="close" class="str620-close" aria-label="Schließen">×</button></header>
   <div class="str620-progress" aria-label="Übungsfortschritt">${plan.exercises.map((_,i)=>`<span class="${i<ex?'is-done':i===ex?'is-active':''}"></span>`).join('')}</div>
   <div class="str621-load-block"><div class="str621-load-title"><strong>${place==='home'?'Scheiben am Trainingsgerät':'Trainingsgewicht'}</strong><small>${place==='home'?`${maxHomeWeight(curr.id)} kg Scheiben insgesamt vorhanden · Griffgewicht separat`:'kg · inklusive Stange/Gerät falls zutreffend'}</small></div><div class="str621-load-controls"><button type="button" data-act="minus-plates" aria-label="Gewicht um 1 kg verringern">−</button><label><input inputmode="decimal" type="number" data-plates min="0" max="${place==='home'?maxHomeWeight(curr.id):500}" step="0.5" placeholder="–" value="${numericValue()}" aria-label="Gewicht in Kilogramm"/> kg</label><button type="button" data-act="plus-plates" aria-label="Gewicht um 1 kg erhöhen">+</button></div></div>
   <div class="str620-stage"><div class="str620-art">${PREMIUM_VISUALS.has(curr.id)?`<figure class="str620-premium-figure"><img src="${VISUAL_ROOT}${curr.id}.webp" width="506" height="504" alt="${esc(curr.title)}: Start- und Endposition als Übungsbild" loading="eager" decoding="async"/><figcaption>${curr.id==='dumbbell-pullover'?'Pullover · Hantel kontrolliert hinter den Kopf und zurück':'Start <span aria-hidden="true">→</span> Ziel'}</figcaption></figure><p class="str620-cue">${esc((descriptions[curr.id]||[])[1]||'Kontrolliert bewegen.')}</p>`:COACH_PREMIUM_PHOTOS.has(curr.id)?`<figure class="str620-premium-figure"><img src="${COACH_PREMIUM_VISUAL_ROOT}${curr.id}.webp" width="1152" height="864" alt="${esc(curr.title)}: Start- und Endposition · Premium-Übungsbild" loading="eager" decoding="async"/><figcaption>Start → Ende · Studioaufnahme (KI-Visualisierung, Technik selbst prüfen)</figcaption></figure><p class="str620-cue">${esc((descriptions[curr.id]||[])[1]||'Körperhaltung kontrollieren, Bewegung sauber ausführen.')}</p>`:COACH_NEW_VISUALS.has(curr.id)?`<figure class="str620-premium-figure"><img src="${COACH_NEW_VISUAL_ROOT}${curr.id}.svg" width="1000" height="560" alt="${esc(curr.title)}: schematische Start- und Endposition" loading="eager" decoding="async"/><figcaption>Bewegung · Start → Ende (technische Illustration)</figcaption></figure><p class="str620-cue">${esc((descriptions[curr.id]||[])[1]||'Technik vor Gewicht, Bewegungsradius individuell anpassen.')}</p>`:exerciseMovementSvg(curr.id)}</div><div class="str620-metadata"><small>ÜBUNG ${ex+1}</small><h3>${esc(curr.title)}</h3><div class="str620-setcount">${done} / ${curr.sets} Sätze</div><div class="str620-plan">${esc(curr.reps)} Wdh. empfohlen · 3 Min. Satzpause</div>${curr.progressionHint?`<p class="str625-progression" style="font-size:12px;line-height:1.4;color:#40715b;margin:7px 0 0"><strong>Letztes Training:</strong> ${esc(curr.lastKg===null?"Gewicht unbekannt":curr.lastKg+" kg")} · ${esc(curr.progressionHint)}</p>`:""}

   <div class="str621-sets-head"><strong>Sätze</strong><span>${done} / ${curr.sets} bestätigt</span></div><div class="str621-reps" role="group" aria-label="Sätze und Wiederholungen">${circles}</div>${done?`<div class="str34-rir-panel" aria-label="Anstrengungsfeedback pro Satz"><div class="str34-rir-head"><strong>Satz ${record.confirmedSets.at(-1)?.setNumber} · Wiederholungen in Reserve</strong><small>RIR · optional</small></div><div class="str34-rir-values">${[0,1,2,3,4].map(n=>`<button type="button" data-act="rir" data-set="${record.confirmedSets.at(-1)?.setNumber}" data-rir="${n}" aria-pressed="${record.confirmedSets.at(-1)?.rir===n}">${n===4?'4+':n}</button>`).join('')}</div><details class="str34-rir-other"><summary>Frühere Sätze korrigieren</summary>${record.confirmedSets.filter(s=>s.confirmed).map(s=>`<label>Satz ${s.setNumber}<select data-act="rir-select" data-set="${s.setNumber}"><option value="">–</option>${[0,1,2,3,4].map(n=>`<option value="${n}" ${s.rir===n?'selected':''}>${n===4?'4+':n}</option>`).join('')}</select></label>`).join('')}</details></div>`:''}<p class="str621-set-hint">${!started?'▶ starten, dann jeden absolvierten Satz antippen.':'Kreis antippen = Satz bestätigen; erneut tippen = Wiederholungen korrigieren.'}</p>
   ${resting?`<div class="str620-rest">Satzpause <small data-rest-phase>${restSeconds>90?'Phase 1 / 2':'Phase 2 / 2'}</small> · <strong data-rest-clock>${clock(restSeconds)}</strong><small>90 + 90s · Vibration bei 1:30</small><button type="button" data-act="skip-rest">Überspringen</button></div>`:allDone?'<p class="str620-success">✓ Übung abgeschlossen.</p>':''}
   </div></div>
   <footer class="str620-bottom"><button class="str620-secondary" type="button" data-act="prev" ${ex===0?'disabled':''}>← Zurück</button><div class="str620-actions">${!started?'<button type="button" class="str620-primary" data-act="start">▶ Starten</button>':resting?'<button type="button" class="str620-primary" data-act="skip-rest">⏭ Weiter</button>':allDone?`<button type="button" class="str620-primary" data-act="next">${ex===plan.exercises.length-1?'✓ Training beenden':'Nächste Übung →'}</button>`:`<button type="button" class="str620-primary" data-act="confirm">✓ Satz ${done+1} bestätigen</button>`}</div></footer>
   <small class="str620-disclaimer">Nur bestätigte Sätze werden als durchgeführt gespeichert. Garmin-Daten bleiben unverändert.</small>`;
  el.querySelector('[data-act="close"]').onclick=()=>close();
  el.querySelector('[data-act="prev"]').onclick=()=>{if(ex===0)return;stopRest();ex--;plateKg=previousLoad(ex);render();};
  el.querySelector('[data-act="start"]')?.addEventListener('click',()=>{started=true;active=true;void wake();void persist().catch(console.warn);render();});
  el.querySelector('[data-act="skip-rest"]')?.addEventListener('click',()=>{stopRest();render();});
  const weightBox=el.querySelector('[data-plates]');
  const setWeight=value=>{
    if(value===''||value===null){plateKg=null;return true;}
    const raw=String(value).replace(',','.');
    if(!validPlateWeight(raw,place,curr.id)){if(weightBox)weightBox.setCustomValidity(place==='home'?`Maximal ${maxHomeWeight(curr.id)} kg Scheiben für diese Übung.`:'Gewicht überprüfen.');return false;}
    plateKg=Number(raw);if(weightBox)weightBox.setCustomValidity('');return true;
  };
  weightBox?.addEventListener('change',e=>{if(!setWeight(e.target.value))e.target.reportValidity();});
  ['plus','minus'].forEach(sign=>el.querySelector(`[data-act="${sign}-plates"]`)?.addEventListener('click',()=>{
    const current=Number.isFinite(plateKg)?plateKg:0;
    setWeight(Math.min(place==='home'?maxHomeWeight(curr.id):500,Math.max(0,current+(sign==='plus'?1:-1))));
    if(weightBox)weightBox.value=numericValue();
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
      const target=proposedReps(ex)||1;
      prior.reps=(prior.reps??target)<=0?target:Math.max(0,(prior.reps??target)-1);
      prior.updatedAt=new Date().toISOString();
    }else{
      sets.push({confirmed:true,setNumber:index,reps:timeBased(ex)?null:proposedReps(ex),weightKg:plateKg,completedAt:new Date().toISOString()});
      if(sets.length<curr.sets)setRest(curr.restSeconds);
    }
    void persist().catch(console.warn);render();
  }
  const saveRir=(index,value)=>{const set=record.confirmedSets.find(s=>s.setNumber===index&&s.confirmed);if(!set)return;const rir=validRir34(value);if(rir===null){delete set.rir;}else set.rir=rir;set.updatedAt=new Date().toISOString();void persist().catch(console.warn);render();};
  el.querySelectorAll('[data-act="rir"]').forEach(button=>button.onclick=()=>saveRir(Number(button.dataset.set),button.dataset.rir));
  el.querySelectorAll('[data-act="rir-select"]').forEach(select=>select.onchange=()=>saveRir(Number(select.dataset.set),select.value));
  el.querySelectorAll('[data-act="set-circle"]').forEach(button=>button.onclick=()=>confirmSet(Number(button.dataset.set)));
  el.querySelector('[data-act="confirm"]')?.addEventListener('click',()=>{
    const next=Array.from({length:curr.sets},(_,i)=>i+1).find(i=>!record.confirmedSets.some(r=>r.setNumber===i));
    if(next)confirmSet(next);
  });
  el.querySelector('[data-act="next"]')?.addEventListener('click',()=>{
    stopRest();if(ex===plan.exercises.length-1){completed=true;close(true);return;}ex++;plateKg=previousLoad(ex);render();
  });
 }
 render();return {close,save:()=>persist()};
}
