/** Compass .59.20 guided workout. Opt-in dynamic import; no eager media or cloud calls.
 * Manual confirmations are kept separate from Garmin/FIT and never auto-annotate imports.
 */
import './strength-guided-v5775920.css';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clock=s=>`${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`;
const numericReps=s=>{const m=String(s??'').match(/\d+/);return m?Number(m[0]):null;};
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
const PREMIUM_VISUALS=new Set(['dumbbell-row','dumbbell-lateral-raise','ab-wheel-kneeling','goblet-squat','lat-pulldown','deadlift']);
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
 let ex=0,started=false,resting=false,restSeconds=0,restUntil=0,restTimer=null,closed=false,completed=false,active=false,wakeLock=null;
 let snapshot=makeGuidedSnapshot(plan),before=document.activeElement,saveChain=Promise.resolve();
 const host=document.createElement('div');host.className='str620-overlay';host.innerHTML='<section class="str620-panel" role="dialog" aria-modal="true" aria-label="Geführtes Krafttraining"></section>';document.body.append(host);
 const el=host.firstElementChild;
 function persist(finished=false){snapshot.updatedAt=new Date().toISOString();if(finished){snapshot.completed=completed;snapshot.finishedAt=snapshot.updatedAt;}
  const data=structuredClone(snapshot);saveChain=saveChain.catch(()=>{}).then(()=>onSession(data));return saveChain;}
 function releaseWake(){try{void wakeLock?.release?.();}catch{}wakeLock=null;}
 async function wake(){if(!active||closed||document.hidden||wakeLock||!navigator.wakeLock?.request)return;try{const lock=await navigator.wakeLock.request('screen');if(closed||!active){void lock.release();return;}wakeLock=lock;lock.addEventListener?.('release',()=>{if(wakeLock===lock)wakeLock=null;});}catch{}}
 const visibility=()=>{if(document.visibilityState==='visible'&&active)void wake();else releaseWake();};
 document.addEventListener('visibilitychange',visibility);
 function stopRest(){clearInterval(restTimer);restTimer=null;resting=false;}
 function timerTick(){restSeconds=Math.max(0,Math.ceil((restUntil-performance.now())/1000));const t=el.querySelector('[data-rest-clock]');if(t)t.textContent=clock(restSeconds);if(restSeconds===0){stopRest();render();}}
 function close(finish=false){if(closed)return;closed=true;active=false;stopRest();releaseWake();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',onKey);host.remove();if(started)void persist(finish).catch(e=>console.warn('Workout-Sicherung fehlgeschlagen',e));before?.focus?.({preventScroll:true});}
 const onKey=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',onKey);
 function setRest(seconds){resting=seconds>0;restSeconds=seconds;restUntil=performance.now()+seconds*1000;clearInterval(restTimer);if(resting)restTimer=setInterval(timerTick,250);}
 function render(){
  const curr=plan.exercises[ex],record=snapshot.exercises[ex],done=record.confirmedSets.length,allDone=done>=curr.sets;
  el.innerHTML=`<header class="str620-head"><div><small>COMPASS · HEUTIGER WORKOUT</small><h2>${esc(plan.title)}</h2><p>${ex+1} / ${plan.exercises.length} Übungen · ${esc(curr.primary||'')}</p></div><button type="button" data-act="close" class="str620-close" aria-label="Schließen">×</button></header>
   <div class="str620-progress" aria-label="Übungsfortschritt">${plan.exercises.map((_,i)=>`<span class="${i<ex?'is-done':i===ex?'is-active':''}"></span>`).join('')}</div>
   <div class="str620-stage"><div class="str620-art">${PREMIUM_VISUALS.has(curr.id)?`<figure class="str620-premium-figure"><img src="${VISUAL_ROOT}${curr.id}.webp" width="506" height="504" alt="${esc(curr.title)}: Start- und Endposition als Übungsbild" loading="eager" decoding="async"/><figcaption>Start <span aria-hidden="true">→</span> Ziel</figcaption></figure><p class="str620-cue">${esc((descriptions[curr.id]||[])[1]||'Kontrolliert bewegen.')}</p>`:exerciseMovementSvg(curr.id)}</div><div class="str620-metadata"><small>ÜBUNG ${ex+1}</small><h3>${esc(curr.title)}</h3><div class="str620-setcount">${done} / ${curr.sets} Sätze</div><div class="str620-plan">${esc(curr.reps)} Wdh. empfohlen · ${curr.restSeconds}s Pause</div>
   ${!started?'<p>Drücke ▶, um die Trainingseinheit zu beginnen.</p>':resting?`<div class="str620-rest">Pause · <strong data-rest-clock>${clock(restSeconds)}</strong><button type="button" data-act="skip-rest">Überspringen</button></div>`:allDone?'<p class="str620-success">✓ Übung abgeschlossen. Weiter zur nächsten Übung.</p>':`<div class="str620-inputs"><label>Wdh. (optional)<input data-reps type="number" inputmode="numeric" min="0" max="500" placeholder="${esc(curr.reps)}"/></label><label>kg (optional)<input data-weight type="number" inputmode="decimal" min="0" max="500" step="0.25" placeholder="–"/></label></div>`}
   </div></div>
   <footer class="str620-bottom"><button class="str620-secondary" type="button" data-act="prev" ${ex===0?'disabled':''}>← Zurück</button><div class="str620-actions">${!started?'<button type="button" class="str620-primary" data-act="start">▶ Starten</button>':resting?'<button type="button" class="str620-primary" data-act="skip-rest">⏭ Weiter</button>':allDone?`<button type="button" class="str620-primary" data-act="next">${ex===plan.exercises.length-1?'✓ Training beenden':'Nächste Übung →'}</button>`:'<button type="button" class="str620-primary" data-act="confirm">✓ Satz erledigt</button>'}</div></footer>
   <small class="str620-disclaimer">Nur bestätigte Sätze werden als durchgeführt gespeichert. Garmin-Daten bleiben unverändert.</small>`;
  el.querySelector('[data-act="close"]').onclick=()=>close();
  el.querySelector('[data-act="prev"]').onclick=()=>{if(ex===0)return;stopRest();ex--;render();};
  el.querySelector('[data-act="start"]')?.addEventListener('click',()=>{started=true;active=true;void wake();void persist().catch(console.warn);render();});
  el.querySelector('[data-act="skip-rest"]')?.addEventListener('click',()=>{stopRest();render();});
  el.querySelector('[data-act="confirm"]')?.addEventListener('click',()=>{
    const repsRaw=el.querySelector('[data-reps]')?.value,weightRaw=el.querySelector('[data-weight]')?.value;
    const reps=repsRaw===''?null:Number(repsRaw),weightKg=weightRaw===''?null:Number(weightRaw);
    if((reps!==null&&(!Number.isInteger(reps)||reps<0||reps>500))||(weightKg!==null&&(!Number.isFinite(weightKg)||weightKg<0||weightKg>500))){return;}
    snapshot.exercises[ex].confirmedSets.push({confirmed:true,setNumber:done+1,reps,weightKg,completedAt:new Date().toISOString()});
    void persist().catch(console.warn);
    if(done+1<curr.sets)setRest(curr.restSeconds);render();
  });
  el.querySelector('[data-act="next"]')?.addEventListener('click',()=>{
    stopRest();if(ex===plan.exercises.length-1){completed=true;close(true);return;}ex++;render();
  });
 }
 render();return {close,save:()=>persist()};
}
