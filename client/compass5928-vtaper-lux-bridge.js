/** Compass 0.5.77.59.28: additive, fail-closed integration on the verified .27 base.
 * Loaded AFTER legacy pre-transforms, never rewrites the encrypted Vault or its passphrase flow.
 */
export const RELEASE_5928='0.5.77.59.28';
export function compass5928VtaperLuxBridge(){
 const change=(src,from,to,label)=>{
  const occurrences=src.split(from).length-1;
  if(occurrences!==1)throw Error(`Compass .59.28: ${label} requires one anchor; got ${occurrences}`);
  return src.replace(from,to);
 };
 return {name:'compass-vtaper-lux-5928',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  let s=source;
  const patch=(from,to,label)=>{s=change(s,from,to,label);};
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   patch(" ['supplement-bluebonnet-one-men'",` ['supplement-bcaa-alphaminos','🥤','PROFUEL Alphaminos BCAA 2:1:1 · Wassermelone','Nahrungsergänzung','1 Portion (13 g Pulver)',35,35],
 ['supplement-bluebonnet-one-men'`,'BCAA preset');
   patch(" ...(id==='matcha'||id==='matcha-oat-plain'?{",` ...(id==='supplement-bcaa-alphaminos'?{proteinG:6.9,bcaaG:10,leucineG:5,isoleucineG:2.5,valineG:2.5,recipeNote:'Alphaminos 2:1:1 · 13 g Pulver = 35 kcal laut Etikett · 10 g BCAA. Kein vollständiges Protein; Leucin 5 g, Isoleucin 2,5 g, Valin 2,5 g.'}:{}),
 ...(id==='matcha'||id==='matcha-oat-plain'?{`,'BCAA exact label amino acids');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/nutrition-intelligence-v57712.js')){
   patch('const LABELLED={',`const LABELLED={
 'supplement-bcaa-alphaminos':profile('PROFUEL Alphaminos BCAA 2:1:1 · Wassermelone',13,'g',
  {kcal:35,protein:6.9,fiber:0.6,salt:0.02},'Fotografiertes Produktetikett',
  {leucine:{label:'L-Leucin',value:5,unit:'g'},isoleucine:{label:'L-Isoleucin',value:2.5,unit:'g'},valine:{label:'L-Valin',value:2.5,unit:'g'},bcaaTotal:{label:'BCAA gesamt',value:10,unit:'g'}},
  '1 Portion (13 g Pulver) laut Etikett: 35 kcal, 6,9 g Eiweiß, 10 g BCAA. Fett, Kohlenhydrate und Zucker jeweils unter 0,5 g; keine exakten Nullwerte. Keine Belege für ein verpflichtendes Einnahmefenster.'),`,'precise BCAA macro and amino-acid source');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-editor-v57732.js')){
   patch(" ['cable-high-to-low-fly'",` ['pike-pushup','Pike Push-up · Bodyweight','Zuhause · Bodyweight','shoulders',['triceps','core']],
 ['decline-pushup','Decline Push-up · Füße erhöht','Zuhause · Bodyweight','chest',['shoulders','triceps']],
 ['prone-y-raise','Prone Y-Raise · Boden','Zuhause · Bodyweight','shoulders',['back']],
 ['cable-high-to-low-fly'`,'V-Taper bodyweight exercise catalog');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-coach-v5775910.js')){
   patch("const WORKOUT_SETS={",`const WORKOUT_SETS={
 'pike-pushup':[3,'6–12',90], 'decline-pushup':[2,'8–15',90], 'prone-y-raise':[2,'12–20',60],`,'bodyweight prescriptions');
   patch("  home:['dumbbell-row','dumbbell-lateral-raise','dumbbell-pullover','goblet-squat','ab-wheel-kneeling','dumbbell-romanian-deadlift'],", "  home:['dumbbell-row','dumbbell-lateral-raise','pike-pushup','dumbbell-pullover','prone-y-raise','goblet-squat','ab-wheel-kneeling','decline-pushup','dumbbell-romanian-deadlift'],",'V-Taper home pool');
   patch("  gym:['lat-pulldown','cable-lateral-raise','cable-rear-delt-fly','cable-single-arm-row','squat','cable-crunch']},", "  gym:['lat-pulldown','cable-lateral-raise','cable-rear-delt-fly','cable-straight-arm-pulldown','cable-single-arm-row','face-pull','squat','cable-crunch']},",'V-Taper gym pool');
   patch("export function planNextWorkout(state,{goal='balance'", "export function planNextWorkout(state,{goal='vtaper'",'V-Taper default planner');
   patch("GOALS[goal]?goal:'balance'", "GOALS[goal]?goal:'vtaper'",'V-Taper fallback');
   patch("o.goal:'balance'", "o.goal:'vtaper'",'V-Taper saved preferences fallback');
   patch("return {goal:'balance',equipment:'home'", "return {goal:'vtaper',equipment:'home'",'V-Taper initial preferences');
   patch(" const period=strengthPeriod(state,{range:'28',today:todayValue,includeCoach:false});",` const level=strengthCoachLevel5928(state,todayValue);
 const period=strengthPeriod(state,{range:'28',today:todayValue,includeCoach:false});`,'train level calculation');
   patch("const [sets,reps,restSeconds]=spec?", "const [sets,reps,restSeconds]=spec?",'prescription identity');
   patch("  const primary=item.primary||IDEAS.find",`  // Session dosage is conservative when little performance history is available.
  const adjustedSets=strongLifts?sets:(selectedGoal==='vtaper'&&level.level==='beginner'?Math.min(sets,2):sets);
  const primary=item.primary||IDEAS.find`,'adaptive volume');
   patch("id,{reps,sets,equipment:location,strongLifts}", "id,{reps,sets:adjustedSets,equipment:location,strongLifts}",'progression matches sets');
   patch("kind:IDEAS.find(x=>x[0]===id)?.[3]||'squat',sets,reps,restSeconds", "kind:IDEAS.find(x=>x[0]===id)?.[3]||'squat',sets:adjustedSets,reps,restSeconds",'adaptive sets in plan');
   patch("history,sourceStats:history.sourceStats,balances,health,", "history,sourceStats:history.sourceStats,balances,health,level,",'level in plan');
   patch("  <section class=\"str619-plan-head\"",`  <div class="str628-level"><strong>V-Taper · dokumentierter Trainingsstand: \${safe(plan.level.label)}</strong><small>Dokumentation: \${safe(plan.level.score)}/100 (Datenabdeckung, nicht Kraftwert) · \${safe(plan.level.explanation)} Kein automatischer 1RM-Test und kein Madcow-Wechsel.</small></div>
  <section class="str619-plan-head"`,'training level badge');
   // Bodyweight training does not prescribe imaginary external weights or fake load progression.
   patch(" const progression=strengthProgressionForExercise(history,id,{reps,sets:adjustedSets,equipment:location,strongLifts});",` const progression=['pike-pushup','decline-pushup','prone-y-raise'].includes(id)?
  {lastKg:null,suggestedKg:null,action:'bodyweight',message:'Körpergewicht: Technik, Bewegungsumfang und Wiederholungen schrittweise verbessern.'}:
  strengthProgressionForExercise(history,id,{reps,sets:adjustedSets,equipment:location,strongLifts});`,'bodyweight progression');
   patch("function coachPrefs(){",`function strengthCoachLevel5928(state,today){
 const sessions=(Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[])
  .filter(s=>s?.source==='compass-guided-v5920'&&s?.exercises?.some(e=>e.confirmedSets?.some(x=>x.confirmed))&&/^\d{4}-\d{2}-\d{2}$/.test(String(s.startedAt||'').slice(0,10))&&String(s.startedAt).slice(0,10)<=today);
 const dates=[...new Set(sessions.map(s=>String(s.startedAt).slice(0,10)))].sort();
 const span=dates.length>1?Math.round((Date.parse(dates.at(-1)+'T12:00:00Z')-Date.parse(dates[0]+'T12:00:00Z'))/86400000):0;
 const scoredSets=sessions.flatMap(s=>s.exercises||[]).flatMap(e=>e.confirmedSets||[]).filter(x=>x.confirmed);
 const weighted=scoredSets.filter(x=>Number.isFinite(x.weightKg)&&x.weightKg>0).length;
 const score=Math.min(100,Math.round(Math.min(45,dates.length*.5)+Math.min(35,span/14)+20*weighted/Math.max(1,scoredSets.length))); // coverage score, NOT biological maturity
 // Missing historic training is NOT evidence that a lifter is a beginner.
 if(dates.length<6)return {level:'unknown',score,label:'noch nicht bestimmbar',sessions:dates.length,spanDays:span,
  explanation:dates.length+' bestätigte Tage: zu wenig Verlauf für eine Einstufung. Basisvolumen unverändert.'};
 if(span<56)return {level:'beginner',score,label:'Aufbauphase · vorläufig',sessions:dates.length,spanDays:span,
  explanation:dates.length+' Trainingstage in '+span+' Tagen dokumentiert; dosierter Einstieg (2 Sätze).'};
 if(dates.length<70||span<240)return {level:'intermediate',score,label:'geübte Trainingsroutine (vorläufig)',sessions:dates.length,spanDays:span,
  explanation:'Längere dokumentierte Routine. Stärke und Technik separat prüfen; keine automatische Madcow-Einstufung.'};
 return {level:'intermediate',score,label:'langfristig trainiert · Technik prüfen',sessions:dates.length,spanDays:span,
  explanation:'Viel Trainingshistorie; Advanced-Status erfordert Technik, Progression und Leistungstests.'};
}
function coachPrefs(){`,'train-level method');
   patch("function coachPrefs(){",`function coachPrefs(){
 try{if(!localStorage.getItem('compass:vtaper-primary-migrated-v5928')){
    const prior=JSON.parse(localStorage.getItem(WORKOUT_PREF_KEY)||'{}');
    localStorage.setItem(WORKOUT_PREF_KEY,JSON.stringify({...prior,goal:'vtaper',mode:'smart'}));
    localStorage.setItem('compass:vtaper-primary-migrated-v5928','1');
   }}catch{}`,'one-time V-Taper preference migration');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-guided-v5775920.js')){
   patch("import './strength-guided-v5775920.css';", "import './strength-guided-v5775920.css';\nimport {routineActive5928,routineEnded5928,routineStopped5928} from './compass-5928-routine-guard.js';",'active guided workout holds vault open');
   patch("const COACH_PREMIUM_PHOTOS=new Set(","const VTAPER_PHOTOS=new Set(['pike-pushup','decline-pushup','prone-y-raise']);\nconst VTAPER_PHOTO_ROOT=VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v5775928/');\nconst COACH_PREMIUM_PHOTOS=new Set(",'V-Taper photo directory');
   patch('<div class="str621-load-block"><div class="str621-load-title">',
     '<div class="str621-load-block" style="${VTAPER_PHOTOS.has(curr.id)?\'display:none\':\'\'}"><div class="str621-load-title">',
     'hide external plate controls for bodyweight only');
   patch("PREMIUM_VISUALS.has(curr.id)?",'VTAPER_PHOTOS.has(curr.id)?`<figure class="str620-premium-figure"><img src="${VTAPER_PHOTO_ROOT}${curr.id}.webp" width="1000" height="325" alt="${esc(curr.title)}: Ausgangs- und Zielposition" loading="eager" decoding="async"/><figcaption>Bodyweight · Start → Ende · KI-Visualisierung</figcaption></figure>`:PREMIUM_VISUALS.has(curr.id)?','V-Taper premium photo switch');
   // A short factual after-workout note; not a mandatory BCAA timing window.
   patch("started=true;active=true;void wake();","started=true;active=true;routineActive5928();void wake();",'guided workout active flag');
   patch("function close(finish=false){",`function close(finish=false){
  if(finish)routineEnded5928();else routineStopped5928();`,'guided workout five minute completion grace');
   patch("function close(finish=false){",`function close(finish=false){
  if(finish)queueMicrotask(()=>{
   const message='Training abgeschlossen. Für Hypertrophie zählt vor allem die Proteinversorgung über den ganzen Tag. Optional: PROFUEL BCAA (13 g / 35 kcal) im Ernährungstracker erfassen – kein Pflicht-Zeitfenster.';
   document.dispatchEvent(new CustomEvent('compass:post-workout-nutrition-5928',{detail:{message}}));
  });`,'optional post-workout nutrition');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   patch("import './ars-vivendi-lock-v5775922.css';", "import './ars-vivendi-lock-v5775922.css';\nimport './compass-5928-lux.css';",'lockscreen luxe css');
   patch("       <button class=\"ars22-tap\"",`       <span class="ars28-gold-rings" aria-hidden="true"><i></i><i></i><i></i></span>
       <div class="ars28-version">Compass Life · Build 0.5.77.59.28</div>
       <button class="ars22-tap"`,'golden circles + version');
   patch("trigger.addEventListener('click',displayForm);",`trigger.addEventListener('click',()=>{
     if(shell.classList.contains('ars28-entering'))return;
     shell.classList.add('ars28-entering');
     window.setTimeout(()=>{if(shell&&!wasOpen){displayForm();shell.classList.remove('ars28-entering');}},540);
    });`,'touch interaction');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/wim-hof-player-v5775921.js')){
   patch("import './wim-hof-player-v5775921.css';",`import './wim-hof-player-v5775921.css';
import {routineActive5928,routineEnded5928,routineStopped5928,saveWimCheckpoint5928,clearWimCheckpoint5928,pendingWimCheckpoint5928} from './compass-5928-routine-guard.js';`,'Wim-Hof durable activity gate');
   patch("function resetAudio(){audio.pause();","function resetAudio(){routineStopped5928();audio.pause();",'track change resets active routine');
   patch("audio.ontimeupdate=tick;",`audio.ontimeupdate=()=>{tick();saveWimCheckpoint5928(track,audio.currentTime,audio.duration);};`,'audio checkpoint');
   patch("audio.onloadedmetadata=tick;",`audio.onloadedmetadata=()=>{
   const pending=pendingWimCheckpoint5928();
   if(pending?.track===track&&Number.isFinite(pending.positionSeconds)&&pending.positionSeconds>60&&
      Date.now()-Date.parse(pending.recordedAt||'')<36*3600000&&Number.isFinite(audio.duration)&&audio.duration>60){
     try{audio.currentTime=Math.min(pending.positionSeconds,Math.max(0,audio.duration-12));status('Unterbrochene Routine fortsetzen ab '+formatTime(audio.currentTime));}catch{}
   }tick();
  };`,'resume verified audio progress');
   patch("audio.onended=async()=>{if(closed)return;playing=false;release();",`audio.onended=async()=>{if(closed)return;playing=false;routineEnded5928();release();`,'mark completed grace before callback');
   patch("await onComplete({track,finishedAt:new Date().toISOString(),durationSeconds:Math.round(audio.duration||0)});",`await onComplete({track,finishedAt:new Date().toISOString(),durationSeconds:Math.round(audio.duration||0)});clearWimCheckpoint5928(track);`,'on-complete persistence');
   patch("await audio.play();playing=true;void keepAwake();",`await audio.play();playing=true;routineActive5928();void keepAwake();`,'active playback holds vault open');
   patch("audio.pause();playing=false;release();setButtons();return;",`audio.pause();playing=false;routineStopped5928();release();setButtons();return;`,'pause gate');
   patch("function stop(){audio.pause();",`function stop(){routineStopped5928();clearWimCheckpoint5928(track);audio.pause();`,'stop gate');
   patch("function close(){if(closed)return;",`function close(){routineStopped5928();if(closed)return;`,'close gate');
   patch("audio.pause();playing=false;release();setButtons();status('Pausiert');",`audio.pause();playing=false;routineStopped5928();release();setButtons();status('Pausiert');`,'pause button gate');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/main.js')){
   const versions=s.match(/const COMPASS_CLIENT_VERSION='[^']+';/g)||[];
   if(versions.length!==1)throw Error('Compass .59.28: legacy main version anchor must be unique');
   patch(versions[0],"const COMPASS_CLIENT_VERSION='0.5.77.59.28';",'visible main application version');
   patch("if(state&&Date.now()-lastActivity>15*60*1000){await morningBeforeLock();",`if(state&&Date.now()-lastActivity>15*60*1000&&document.documentElement.dataset.compassRoutineActive!=='yes'&&Number(document.documentElement.dataset.compassRoutineGraceUntil||0)<Date.now()){await morningBeforeLock();`,'inactivity guard while routine plays plus 5min grace');
   patch("<footer>Compass · Private Beta · Lokal verschlüsselt ${ico('shield',13)}</footer>",`<footer>Compass · Private Beta · Lokal verschlüsselt · Build 0.5.77.59.28 \${ico('shield',13)}</footer>`,'visible build footer');
   patch("window.addEventListener('offline',render);",`document.addEventListener('compass:post-workout-nutrition-5928',e=>{
  // Never auto-log a supplement. The athlete decides whether anything was consumed.
  toast(e.detail?.message||'Workout abgeschlossen.');
 });
window.addEventListener('offline',render);`,'post workout banner');
   return {code:s,map:null};
  }
  return null;
 }};
}
