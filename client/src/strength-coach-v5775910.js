/** Opt-in local training assistant. Imported ONLY after clicking "Trainingscoach".
 * No API calls, no external model, and no changes to private strength data.
 * Heuristics are training-planning aids rather than EMG or injury assessment.
 */
import {strengthPeriod} from './strength-insights-v57728.js';
import {detailedMuscleData} from './strength-anatomy-v57737.js';
import {EXERCISES} from './strength-editor-v57732.js';
import './strength-coach-v5775910.css';

const safe=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const GROUPS={back:'Rücken/Lat',shoulders:'Schultern',core:'Bauch/Rumpf',chest:'Brust',quads:'Oberschenkel',posterior:'Beinrückseite',glutes:'Gesäß',biceps:'Bizeps',triceps:'Trizeps'};
const GOALS={
 balance:{label:'Ausgeglichen trainieren',targets:['back','shoulders','core','chest','quads','posterior','glutes'],note:'Unterrepräsentierte Muskelgruppen nach belegten Sätzen berücksichtigen.'},
 vtaper:{label:'V-Taper',targets:['back','shoulders','back','shoulders','core'],note:'Latissimus, seitliche/hintere Schultern und Rumpf betonen; Beine bleiben im Plan.'},
 abs:{label:'Bauchmuskeln / Sixpack',targets:['core','core','back','quads','posterior'],note:'Rumpf kräftigen; sichtbare Bauchmuskeln hängen auch von Körperfett und Ernährung ab. Kein lokaler Fettabbau.'},
 strength:{label:'Allgemeine Kraft',targets:['quads','chest','back','posterior','shoulders','core'],note:'Grundbewegungen und progressive, kontrollierte Laststeigerung. StrongLifts 5×5 ist eine mögliche Struktur.'}
};
const IDEAS=[
 ['ab-wheel-kneeling','core','home','rollout','Vom Knie abrollen; Rippen unten, Gesäß leicht anspannen. Nur so weit rollen, wie der Rumpf stabil bleibt.','abs,balance,vtaper'],
 ['plank','core','home','plank','Rumpf fest halten, ohne ins Hohlkreuz zu sinken.','abs,balance'],
 ['dead-bug','core','home','core','Langsam gegenläufig Arm und Bein strecken, unterer Rücken stabil.','abs,balance'],
 ['dumbbell-floor-press','chest','home','press','Auf dem Boden drücken; Ellbogen kontrolliert ablegen.','strength,balance'],
 ['dumbbell-row','back','home','pull','Einarmig ziehen, Schulterblatt Richtung Wirbelsäule führen.','vtaper,balance,strength'],
 ['dumbbell-pullover','back','home','pull','Leicht starten, Schultern beweglich halten, nicht ins Hohlkreuz gehen.','vtaper'],
 ['dumbbell-lateral-raise','shoulders','home','raise','Leichtes Gewicht, Arme seitlich kontrolliert anheben.','vtaper,balance'],
 ['goblet-squat','quads','home','squat','Brust aufrecht, Knie in Zehenrichtung.','strength,balance'],
 ['dumbbell-romanian-deadlift','posterior','home','hinge','Hüfte zurückführen, Wirbelsäule neutral.','strength,balance'],
 ['dumbbell-shoulder-press','shoulders','home','press','Ohne Schwung über Kopf drücken.','strength,vtaper'],
 ['barbell-overhead-press','shoulders','home','press','Nur mit sicher fixierter Verbindungsstange und geeigneter Last; kontrolliert drücken.','strength'],
 ['barbell-row','back','home','pull','Mit sicher verbundener Hantel und stabiler Rumpfposition rudern.','strength,vtaper'],
 ['bench','chest','gym','press','Stabile Schulterposition, kontrollierte Bewegung.','strength'],
 ['squat','quads','gym','squat','Saubere Tiefe, Technik vor Gewicht.','strength,balance'],
 ['deadlift','posterior','gym','hinge','Hantel nah am Körper, Rumpf stabil.','strength,balance'],
 ['lat-pulldown','back','gym','pull','Zur oberen Brust ziehen, nicht hinter den Nacken.','vtaper,balance'],
 ['cable-straight-arm-pulldown','back','gym','pull','Arme weitgehend gestreckt, Bewegung aus der Schulter.','vtaper'],
 ['cable-single-arm-row','back','gym','pull','Pro Seite vollständig und kontrolliert ziehen.','vtaper,balance'],
 ['cable-lateral-raise','shoulders','gym','raise','Kabelzug auf Schulterhöhe kontrollieren; leicht starten.','vtaper'],
 ['cable-rear-delt-fly','shoulders','gym','raise','Arme weit öffnen, Schultern nicht hochziehen.','vtaper,balance'],
 ['face-pull','shoulders','gym','pull','Zum Gesicht ziehen, Ellenbogen nach außen.','vtaper,balance'],
 ['cable-crunch','core','gym','core','Rumpf beugen, nicht nur die Hüfte bewegen.','abs'],
 ['cable-woodchop','core','gym','core','Drehung ruhig führen; keine ruckartige Rotation.','abs'],
 ['barbell-row','back','gym','pull','Oberkörper stabil, kontrolliert zum Rumpf rudern.','strength,vtaper']
];
const catalog=new Map(EXERCISES.map(x=>[x.id,x]));
const shape=(kind)=>{
 const figure='<circle cx="48" cy="24" r="7"/><path d="M48 32 L48 70 M48 40 L28 58 M48 40 L69 57 M48 70 L31 99 M48 70 L65 99"/>';
 const variants={
 rollout:'<circle cx="96" cy="92" r="10"/><path d="M23 89 L39 76 L67 76 L87 91 M23 89 L10 108 M44 70 L32 58 M39 76 L31 98"/>',
 pull:'<path d="M8 20 H86 M30 20 V40 M62 20 V40"/><circle cx="47" cy="54" r="8"/><path d="M47 62 V88 M47 69 L30 42 M47 69 L64 42 M47 88 L28 107 M47 88 L66 107"/>',
 press:'<path d="M19 23 H77 M35 23 L35 46 M61 23 L61 46"/>'+figure,
 raise:'<circle cx="48" cy="24" r="7"/><path d="M48 31 V75 M48 44 L14 45 M48 44 L82 45 M48 75 L32 103 M48 75 L64 103"/>',
 squat:'<circle cx="48" cy="23" r="7"/><path d="M48 30 L44 63 M44 42 L27 57 M44 42 L62 57 M44 63 L67 74 L59 103 M44 63 L25 76 L18 102"/>',
 hinge:'<circle cx="71" cy="33" r="7"/><path d="M64 37 L37 64 M49 53 L51 87 M37 64 L21 88 M51 87 L46 107 M51 87 L69 105"/>',
 core:'<circle cx="51" cy="38" r="7"/><path d="M48 45 L45 73 M45 52 L20 67 M45 52 L73 68 M45 73 L22 91 M45 73 L77 92"/>',
 plank:'<circle cx="20" cy="64" r="7"/><path d="M27 67 L64 70 L92 88 M26 68 L16 89 M64 70 L59 92"/>'
 };
 return `<svg viewBox="0 0 115 115" role="img" aria-label="Schematische Bewegungsillustration" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${variants[kind]||figure}</g><path d="M5 110 H110" stroke="currentColor" stroke-opacity=".2"/></svg>`;
};
export function proposeStrengthTraining(state,{goal='balance',equipment='home',today}={}){
 const profile=GOALS[goal]||GOALS.balance;
 const period=strengthPeriod(state,{range:'28',today:today||new Date().toISOString().slice(0,10)});
 const anatomy=detailedMuscleData(period);
 const counts=Object.fromEntries(Object.keys(GROUPS).map(group=>[group,0]));
 const last=Object.fromEntries(Object.keys(GROUPS).map(group=>[group,null]));
 const recorded=period.events.filter(x=>x.exerciseId&&Number(x.reps)>0&&catalog.has(x.exerciseId));
 for(const event of recorded){const group=catalog.get(event.exerciseId)?.primary;if(!(group in counts))continue;counts[group]++;if(event.day&&(!last[group]||event.day>last[group]))last[group]=event.day;}
 const mapped=recorded.length;
 const sorted=IDEAS.filter(([id,,place])=>place===equipment&&catalog.has(id)).map(([id,muscle,place,kind,cue,priorities],i)=>{
   const item=catalog.get(id);const priority=priorities.split(',').includes(goal)?5:0;
   const focus=profile.targets.filter(x=>x===muscle).length*4;
   const exposure=counts[muscle]||0;
   const balance=mapped>0?Math.max(0,8-exposure)*.75:0;
   const daysSince=last[muscle]&&/^\d{4}-\d{2}-\d{2}$/.test(last[muscle])?Math.max(0,Math.round((Date.parse((today||new Date().toISOString().slice(0,10))+'T12:00:00Z')-Date.parse(last[muscle]+'T12:00:00Z'))/86400000)):null;
   const recency=mapped>0&&daysSince!==null?(daysSince>=7?1:daysSince<=1?-1:0):0;
   const fine=anatomy.regions?.[muscle==='back'?'latissimus':muscle==='shoulders'?'deltoid_side':'rectus_abdominis']?.primary||0;
   return {id,title:item.name,muscle,place,kind,cue,priority,score:priority+focus+balance+recency-Math.min(4,fine*.25)-i*.01,
    explanation:mapped>0?`${GROUPS[muscle]}: ${exposure} selbst zugeordnete Hauptsätze in 28 Tagen${daysSince!==null?` · zuletzt vor ${daysSince} Tagen`:''}. Nicht erfasste Einheiten bleiben unbekannt.`:`Für ${profile.label} geeignet; noch keine ausreichende Muskelhistorie zum Vergleich.`};
 }).sort((a,b)=>b.score-a.score);
 const selected=[],byMuscle=new Map();
 for(const x of sorted){if(selected.length>=6)break;const n=byMuscle.get(x.muscle)||0;if(n>=2)continue;byMuscle.set(x.muscle,n+1);selected.push(x);}
 return {profile,selected,period,mapped,counts,coverageKnown:mapped>0,anatomy};
}

/** .59.19 – rule-based next workout, no network calls, no invented fatigue scores.
 * Exercises are only classified when a known exercise ID and reps are present.
 * This does not infer true recovery, hypertrophy, RPE or readiness from Garmin.
 */
const WORKOUT_PREF_KEY='compass:strength-coach:preferences-v5919';
const WORKOUT_GROUP_ORDER=['back','shoulders','chest','core','quads','posterior','glutes','biceps','triceps'];
const DAY_MS=86400000;
const WORKOUT_SETS={
 'ab-wheel-kneeling':[3,'6–10',90], 'dead-bug':[2,'8–12 / Seite',45],plank:[3,'30–45 Sek.',45],
 'dumbbell-row':[3,'8–12 / Seite',90],'dumbbell-pullover':[2,'10–12',75],
 'dumbbell-lateral-raise':[3,'12–15',60],'dumbbell-shoulder-press':[3,'6–10',90],
 'dumbbell-floor-press':[3,'8–12',90],'goblet-squat':[3,'8–12',90],
 'dumbbell-romanian-deadlift':[3,'8–12',90],
 'lat-pulldown':[3,'8–12',90],'cable-lateral-raise':[3,'12–15',60],
 'cable-rear-delt-fly':[3,'12–15',60],'cable-single-arm-row':[3,'8–12 / Seite',75],
 'cable-straight-arm-pulldown':[3,'10–15',60],'cable-crunch':[3,'10–15',60],
 'cable-woodchop':[2,'10 / Seite',60],'face-pull':[3,'12–15',60],
 squat:[3,'5–8',120],deadlift:[2,'5–6',150],bench:[3,'6–8',120],
 'military-press':[3,'6–8',120],'barbell-row':[3,'6–8',120]
};
const WORKOUT_POOLS={
 vtaper:{
  home:['dumbbell-row','dumbbell-lateral-raise','dumbbell-pullover','goblet-squat','ab-wheel-kneeling','dumbbell-romanian-deadlift'],
  gym:['lat-pulldown','cable-lateral-raise','cable-rear-delt-fly','cable-single-arm-row','squat','cable-crunch']},
 abs:{
  home:['ab-wheel-kneeling','dead-bug','goblet-squat','dumbbell-row','dumbbell-romanian-deadlift'],
  gym:['cable-crunch','cable-woodchop','squat','lat-pulldown','deadlift']},
 strength:{
  home:['goblet-squat','dumbbell-floor-press','dumbbell-row','dumbbell-romanian-deadlift','dumbbell-shoulder-press'],
  gym:['squat','bench','barbell-row']},
 balance:{
  home:['dumbbell-row','goblet-squat','dumbbell-romanian-deadlift','dumbbell-floor-press','dumbbell-lateral-raise','ab-wheel-kneeling','dumbbell-shoulder-press'],
  gym:['lat-pulldown','squat','deadlift','bench','cable-lateral-raise','cable-rear-delt-fly','cable-crunch']}
};
const STRONG_LIFTS={
 A:[['squat',5,5],['bench',5,5],['barbell-row',5,5]],
 B:[['squat',5,5],['military-press',5,5],['deadlift',1,5]]
};
function ageDays(day,today){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(day||''))||!/^\d{4}-\d{2}-\d{2}$/.test(String(today||'')))return null;
 const age=Math.round((Date.parse(today+'T12:00:00Z')-Date.parse(day+'T12:00:00Z'))/DAY_MS);
 return Number.isFinite(age)&&age>=0?age:null;
}
function annotatedHistory(period,today){
 const valid=(period?.events||[]).filter(e=>e?.exerciseId&&catalog.has(e.exerciseId)&&Number(e.reps)>0&&ageDays(e.day,today)!==null);
 const counts7=Object.fromEntries(WORKOUT_GROUP_ORDER.map(g=>[g,0]));
 const counts28=Object.fromEntries(WORKOUT_GROUP_ORDER.map(g=>[g,0]));
 const last=Object.fromEntries(WORKOUT_GROUP_ORDER.map(g=>[g,null]));
 const days=new Set();
 for(const e of valid){
  days.add(e.day);
  const exercise=catalog.get(e.exerciseId);
  const groups=[exercise.primary,...(Array.isArray(exercise.secondary)?exercise.secondary:[])];
  const dayAge=ageDays(e.day,today);
  for(let i=0;i<groups.length;i++){
   const g=groups[i];if(!(g in counts28))continue;
   const weight=i===0?1:0.5;
   counts28[g]+=weight;
   if(dayAge<=6)counts7[g]+=weight;
   if(!last[g]||e.day>last[g])last[g]=e.day;
  }
 }
 const latest=valid.reduce((latest,e)=>!latest||e.day>latest?e.day:latest,null);
 return {valid,counts7,counts28,last,latest,distinctDays:days.size,usable:valid.length>=6&&days.size>=2};
}
function nextStrongLiftsVariant(history){
 const latest=history.latest;if(!latest)return 'A';
 const exercises=new Set(history.valid.filter(e=>e.day===latest).map(e=>e.exerciseId));
 // Only infer A/B if their defining exercises were actually logged.
 if(exercises.has('military-press')||exercises.has('deadlift'))return 'A';
 if(exercises.has('bench')||exercises.has('barbell-row'))return 'B';
 return 'A';
}
/** Proposed plan: deterministic, equipment-filtered, with honest uncertainty.
 * It never prescribes load increases or treats missing data as a zero load.
 */
export function planNextWorkout(state,{goal='balance',equipment='home',minutes=45,today}={}){
 const todayValue=/^\d{4}-\d{2}-\d{2}$/.test(String(today||''))?today:new Date().toISOString().slice(0,10);
 const selectedGoal=GOALS[goal]?goal:'balance';
 const location=equipment==='gym'?'gym':'home';
 const budget=[25,45,65].includes(Number(minutes))?Number(minutes):45;
 const profile=GOALS[selectedGoal];
 const period=strengthPeriod(state,{range:'28',today:todayValue});
 const history=annotatedHistory(period,todayValue);
 const strongLifts=selectedGoal==='strength'&&location==='gym';
 const variant=strongLifts?nextStrongLiftsVariant(history):null;
 let ids=strongLifts?STRONG_LIFTS[variant].map(x=>x[0]):[...WORKOUT_POOLS[selectedGoal][location]];
 ids=ids.filter(id=>catalog.has(id));
 if(selectedGoal==='balance'&&history.usable){
   const original=new Map(ids.map((id,i)=>[id,i]));
   ids.sort((a,b)=>{
    const score=id=>{
      const muscle=catalog.get(id)?.primary;
      return (history.counts7[muscle]||0)*2+(ageDays(history.last[muscle],todayValue)===0?6:ageDays(history.last[muscle],todayValue)===1?3:0);
    };
    return score(a)-score(b)||(original.get(a)-original.get(b));
   });
 }
 // Limit a short session by exercise count, not by pretending 5x5 fits 25 min.
 const limit=strongLifts?3:budget===25?3:budget===45?5:6;
 ids=ids.slice(0,limit);
 let exercises=ids.map((id,index)=>{
  const item=catalog.get(id);
  const spec=strongLifts?STRONG_LIFTS[variant].find(row=>row[0]===id):null;
  const [sets,reps,restSeconds]=spec?[spec[1],String(spec[2]),id==='deadlift'?180:150]:(WORKOUT_SETS[id]||[3,'8–12',90]);
  const primary=item.primary||IDEAS.find(x=>x[0]===id)?.[1]||'core';
  const age=ageDays(history.last[primary],todayValue);
  const seven=history.counts7[primary]||0;
  let reason=history.usable?
   `${GROUPS[primary]||primary}: ${Number(seven.toFixed(1)).toLocaleString('de-AT')} zugeordnete Satzbeteiligungen / 7 Tage${age!==null?` · zuletzt vor ${age} T.`:''}.`:
   `${GROUPS[primary]||primary}: empfohlen für ${profile.label}; Muskelhistorie noch unvollständig.`;
  if(age!==null&&age<=1&&history.usable)reason+=' Kürzlich beansprucht – bei Bedarf verschieben.';
  return {id,title:item.name||id,primary,kind:IDEAS.find(x=>x[0]===id)?.[3]||'squat',sets,reps,restSeconds,ageDays:age,sevenSets:seven,reason,order:index+1};
 });
 const latestAge=ageDays(history.latest,todayValue);
 const recentlyTrained=history.valid.length>0&&latestAge!==null&&latestAge<=1;
 const cautious=recentlyTrained;
 // Rough session duration, not a promise or a scheduling commitment.
 const estimatedMinutes=Math.round(exercises.reduce((sum,x)=>sum+x.sets*(x.reps==='5'?1.0:0.8)+(x.sets-1)*x.restSeconds/60,5));
 const timeFit=estimatedMinutes>budget?'longer':'fits';
 const missing=Number(period?.unassigned||0);
 const known=history.valid.length;
 const evidence=known===0?'none':!history.usable?'limited':missing>known?'partial':'mapped';
 const balances=history.usable?[
  {name:'Ziehen / Drücken',one:history.counts7.back||0,two:history.counts7.chest||0},
  {name:'Vorder- / Rückseite Beine',one:history.counts7.quads||0,two:history.counts7.posterior||0}
 ]:[];
 return {goal:selectedGoal,equipment:location,budget,profile,variant,exercises,estimatedMinutes,timeFit,
  cautious,recentlyTrained,latestAge,evidence,known,missing,history,balances,
  title:strongLifts?`StrongLifts 5×5 · Workout ${variant}`:selectedGoal==='vtaper'?'V-Taper · Rücken & Schultern':selectedGoal==='abs'?'Core & Ganzkörper':selectedGoal==='strength'?'Kraft · Home Workout':'Muskelbalance · Ganzkörper',
  recoveryNote:cautious?'Letztes zugeordnetes Krafttraining heute/gestern. Dieser Plan ist für den nächsten geeigneten Trainingstag, nicht automatisch für sofort. Erholung und individuelle Belastung prüfen.':
   evidence==='none'?'Keine zugeordneten Übungssätze vorhanden: Es gibt keine belastbare Aussage zur Regeneration.':
   evidence==='limited'?'Für die Erholungsbeurteilung liegen noch zu wenige zugeordnete Trainingstage vor.':'Übungsauswahl basiert auf dokumentierter Belastung, nicht auf gemessener Muskelregeneration.'};
}
function coachPrefs(){
 try{const o=JSON.parse(localStorage.getItem(WORKOUT_PREF_KEY)||'{}');return {goal:GOALS[o.goal]?o.goal:'balance',equipment:o.equipment==='gym'?'gym':'home',minutes:[25,45,65].includes(Number(o.minutes))?Number(o.minutes):45};}
 catch{return {goal:'balance',equipment:'home',minutes:45};}
}
function saveCoachPrefs(p){try{localStorage.setItem(WORKOUT_PREF_KEY,JSON.stringify(p));}catch{}}
function coachCopyText(plan){
 return [plan.title,`${plan.equipment==='home'?'Zuhause':'Gym'} · etwa ${plan.estimatedMinutes} min`,
  ...plan.exercises.map((x,i)=>`${i+1}. ${x.title}: ${x.sets} × ${x.reps}; Pause ${x.restSeconds} s`),
  plan.recoveryNote,'Trainingsempfehlung, keine automatische Trainingsfreigabe.'].join('\n');
}

export function readStrengthCoachPreferences(){return coachPrefs();}
export function openStrengthCoach({state,today,onSession=async()=>{}}){
 let prefs=coachPrefs();
 const host=document.createElement('div');host.className='str610-backdrop';
 host.innerHTML='<section class="str610-dialog str619-dialog" role="dialog" aria-modal="true" aria-label="Compass Workout Planner"></section>';
 document.body.append(host);
 const dialog=host.firstElementChild;const before=document.activeElement;let closed=false;
 const close=()=>{if(closed)return;closed=true;host.remove();document.removeEventListener('keydown',onKey);before?.focus?.({preventScroll:true});};
 const onKey=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',onKey);
 host.addEventListener('click',e=>{if(e.target===host)close();});
 function draw(){
  const plan=planNextWorkout(state,{...prefs,today});
  dialog.innerHTML=`<div class="str610-title"><div><small>COMPASS · INTELLIGENTER WORKOUT PLANNER</small><h2>Dein nächster Workout</h2></div><button class="str610-close" aria-label="Schließen" type="button">×</button></div>
  <div class="str610-options str619-options">
   <label>Ziel<select class="str610-goal">${Object.entries(GOALS).map(([id,x])=>`<option value="${id}" ${prefs.goal===id?'selected':''}>${safe(x.label)}</option>`).join('')}</select></label>
   <label>Wo trainierst du?<select class="str610-equipment"><option value="home" ${prefs.equipment==='home'?'selected':''}>🏠 Zuhause · Kurzhanteln & Ab Wheel</option><option value="gym" ${prefs.equipment==='gym'?'selected':''}>🏋️ Gym · StrongLifts & Kabelzug</option></select></label>
   <label>Verfügbare Zeit<select class="str619-minutes"><option value="25" ${prefs.minutes===25?'selected':''}>25 Minuten</option><option value="45" ${prefs.minutes===45?'selected':''}>45 Minuten</option><option value="65" ${prefs.minutes===65?'selected':''}>65 Minuten</option></select></label>
  </div>
  <section class="str619-plan-head" aria-label="Vorgeschlagener Trainingsplan"><div><small>${plan.cautious?'FÜR DEN NÄCHSTEN TRAININGSTAG':'DEIN VORSCHLAG'}</small><h3>${safe(plan.title)}</h3><p>${plan.exercises.length} Übungen · ca. ${plan.estimatedMinutes} Min. · ${plan.equipment==='home'?'Zuhause':'Gym'}</p></div><div class="str620-cta-stack"><button type="button" class="str620-launch" aria-label="Geführtes Workout starten">▶ Workout starten</button><button type="button" class="str619-copy">Plan kopieren</button></div></section>
  ${plan.timeFit==='longer'?`<p class="str619-alert">Dieser Plan benötigt voraussichtlich mehr als die gewählten ${plan.budget} Minuten. Die Sätze werden nicht künstlich verkürzt.</p>`:''}
  <p class="str619-recovery">${safe(plan.recoveryNote)}</p>
  <div class="str619-coverage"><span>Datengrundlage: ${plan.known} zugeordnete Sätze · ${plan.missing} nicht zugeordnet</span><span>${plan.evidence==='none'?'Noch keine Muskelhistorie':plan.evidence==='limited'?'Nur eingeschränkte Historie':plan.evidence==='partial'?'Viele Trainingsdetails fehlen':'Dokumentierte Muskelhistorie'}</span></div>
  ${plan.balances.length?`<div class="str619-balance" aria-label="Dokumentierte Muskelbalance in sieben Tagen">${plan.balances.map(row=>`<div><small>${safe(row.name)}</small><strong>${Number(row.one.toFixed(1))} : ${Number(row.two.toFixed(1))}</strong></div>`).join('')}</div>`:''}
  <div class="str619-workout" role="list">${plan.exercises.map(x=>`<article class="str619-exercise" role="listitem"><div class="str619-number">${x.order}</div><div class="str619-description"><h4>${safe(x.title)}</h4><div class="str619-prescription"><strong>${x.sets} × ${safe(x.reps)}</strong><span>${x.restSeconds} Sek. Satzpause</span></div><details><summary>Warum diese Übung?</summary><p>${safe(x.reason)}</p></details></div></article>`).join('')}</div>
  <p class="str610-disclaimer">${safe(plan.profile.note)} Vorschläge berücksichtigen nur dokumentierte und zugeordnete Sätze; unbekannte Garmin-Daten werden nicht als untrainierte Muskeln gewertet. Die Regeneration ist eine vorsichtige Zeitregel, keine Messung deiner Belastbarkeit. Gewicht und Intensität bestimmst du selbst.</p>`;
  dialog.querySelector('.str610-close').onclick=close;
  const update=(key,val)=>{prefs={...prefs,[key]:val};saveCoachPrefs(prefs);draw();};
  dialog.querySelector('.str610-goal').onchange=e=>update('goal',e.target.value);
  dialog.querySelector('.str610-equipment').onchange=e=>update('equipment',e.target.value);
  dialog.querySelector('.str619-minutes').onchange=e=>update('minutes',Number(e.target.value));
  dialog.querySelector('.str620-launch').onclick=async()=>{
   const guide=await import('./strength-guided-v5775920.js');
   close();guide.openGuidedWorkout({plan,onSession});
  };
  dialog.querySelector('.str619-copy').onclick=async()=>{
   try{await navigator.clipboard.writeText(coachCopyText(plan));dialog.querySelector('.str619-copy').textContent='Kopiert ✓';}
   catch{dialog.querySelector('.str619-copy').textContent='Kopieren nicht verfügbar';}
  };
 }
 draw();dialog.querySelector('select')?.focus({preventScroll:true});return {close};
}
