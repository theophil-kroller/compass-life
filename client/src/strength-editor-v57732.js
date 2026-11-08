/** Compass 0.5.77.32. Opt-in local annotations of Garmin strength training.
 * This is an independent, editorial exercise catalog, not a copy of Garmin's proprietary list.
 * Muscle assignment is a practical approximation; never a measured activation.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const EXERCISES=Object.freeze([
 ['bench','Bankdrücken','Brust','chest',['triceps','shoulders']],
 ['incline-bench','Schrägbankdrücken','Brust','chest',['shoulders','triceps']],
 ['pushup','Liegestütze','Brust','chest',['triceps','shoulders']],
 ['chest-press','Brustpresse','Brust','chest',['triceps','shoulders']],
 ['chest-fly','Butterfly / Fliegende','Brust','chest',['shoulders']],
 ['pullup','Klimmzüge','Rücken','back',['biceps','forearms']],
 ['lat-pulldown','Latzug','Rücken','back',['biceps','forearms']],
 ['cable-row','Rudern am Kabel','Rücken','back',['biceps']],
 ['dumbbell-row','Einarmiges Kurzhantelrudern','Rücken','back',['biceps']],
 ['barbell-row','Langhantelrudern','Rücken','back',['biceps','posterior']],
 ['deadlift','Kreuzheben','Rücken / Beine','posterior',['back','glutes']],
 ['romanian-deadlift','Rumänisches Kreuzheben','Beine','posterior',['glutes','back']],
 ['squat','Kniebeugen','Beine','quads',['glutes','posterior']],
 ['leg-press','Beinpresse','Beine','quads',['glutes']],
 ['lunge','Ausfallschritte','Beine','quads',['glutes','posterior']],
 ['leg-extension','Beinstrecker','Beine','quads',[]],
 ['leg-curl','Beinbeuger','Beine','posterior',[]],
 ['hip-thrust','Hip Thrust','Beine','glutes',['posterior']],
 ['glute-bridge','Glute Bridge','Beine','glutes',['posterior']],
 ['calf-raise','Wadenheben','Beine','calves',[]],
 ['shoulder-press','Schulterdrücken','Schultern','shoulders',['triceps']],
 ['lateral-raise','Seitheben','Schultern','shoulders',[]],
 ['face-pull','Face Pull','Schultern','shoulders',['back']],
 ['reverse-fly','Reverse Fly','Schultern','shoulders',['back']],
 ['biceps-curl','Bizepscurls','Arme','biceps',['forearms']],
 ['hammer-curl','Hammercurls','Arme','biceps',['forearms']],
 ['triceps-pushdown','Trizepsdrücken','Arme','triceps',[]],
 ['triceps-extension','Überkopf-Trizepsstrecken','Arme','triceps',[]],
 ['wrist-curl','Unterarmcurls','Arme','forearms',[]],
 ['plank','Plank','Rumpf','core',['shoulders']],
 ['dead-bug','Dead Bug','Rumpf','core',[]],
 ['crunch','Crunches','Rumpf','core',[]],
 ['pallof-press','Pallof Press','Rumpf','core',['shoulders']],
 // Compass .33: compound exercises that also target primary/secondary muscle groups.
 ['military-press','Military Press (stehend, Langhantel)','StrongLifts 5×5','shoulders',['triceps','core']],
 ['curl-to-press','Curl to Press (Bizepscurl → Schulterdrücken)','Kombinationsübungen','biceps',['shoulders','triceps','forearms']],
 ['hammer-to-press','Hammer Curl to Press (Hammercurl → Schulterdrücken)','Kombinationsübungen','shoulders',['biceps','triceps','forearms']],
 ['triceps-curl','Trizeps-Curl / French Press (Strecken)','Arme','triceps',[]],
 ['skullcrusher','Skull Crushers / liegendes Trizepsstrecken','Arme','triceps',[]],
 ['close-grip-bench','Enges Bankdrücken','Brust','triceps',['chest','shoulders']],
 ['reverse-curl','Reverse Curls','Arme','forearms',['biceps']],
 ['concentration-curl','Konzentrationscurls','Arme','biceps',['forearms']],
 ['seated-dumbbell-press','Kurzhantel-Schulterdrücken sitzend','Schultern','shoulders',['triceps']],
 // Same stable IDs as Compass Coach; include V-Taper home + gym catalog.
 ['ab-wheel-kneeling','Ab-Wheel aus dem Knien','Rumpf','core',['shoulders']],
 ['dumbbell-floor-press','Kurzhantel-Bodendrücken','Brust','chest',['triceps','shoulders']],
 ['dumbbell-pullover','Kurzhantel-Pullover','Rücken','back',['chest','triceps']],
 ['dumbbell-lateral-raise','Kurzhantel-Seitheben','Schultern','shoulders',[]],
 ['goblet-squat','Goblet-Kniebeuge','Beine','quads',['glutes','core']],
 ['dumbbell-romanian-deadlift','Rumänisches Kurzhantel-Kreuzheben','Beine','posterior',['glutes','back']],
 ['dumbbell-shoulder-press','Kurzhantel-Schulterdrücken','Schultern','shoulders',['triceps']],
 ['barbell-overhead-press','Langhantel-Überkopfdrücken','Schultern','shoulders',['triceps','core']],
 ['cable-straight-arm-pulldown','Latzug mit gestreckten Armen','Rücken','back',['triceps']],
 ['cable-single-arm-row','Einarmiges Kabelrudern','Rücken','back',['biceps']],
 ['cable-lateral-raise','Seitheben am Kabel','Schultern','shoulders',[]],
 ['cable-rear-delt-fly','Hintere Schulter am Kabel','Schultern','shoulders',['back']],
 ['cable-crunch','Kabel-Crunch','Rumpf','core',[]],
 ['cable-woodchop','Kabel-Woodchop','Rumpf','core',['shoulders']],
 ['decline-pushup','Liegestütze mit erhöhten Füßen','Brust','chest',['triceps','shoulders','core']],
 ['incline-pushup','Liegestütze mit erhöhten Händen','Brust','chest',['triceps','shoulders']],
 ['pike-pushup','Pike-Liegestütze','Schultern','shoulders',['triceps','core']],
 ['prone-y-raise','Y-Heben in Bauchlage','Schultern','shoulders',['back']],
 // 0.5.89 · Six opt-in individual movements; distinct from existing generic ids.
 ['one-arm-dumbbell-snatch','Einarmiges Kurzhantel-Reißen','Kraft & Koordination','posterior',['shoulders','glutes','quads','core']],
 ['dumbbell-front-squat','Kurzhantel-Frontkniebeuge','Beine','quads',['glutes','core','posterior']],
 ['dumbbell-walking-lunge','Gehender Kurzhantel-Ausfallschritt','Beine','quads',['glutes','posterior','core']],
 ['sled-push','Gewichtsschlitten schieben','Funktionell','quads',['glutes','posterior','core']],
 ['farmers-walk','Farmergang mit Kurzhanteln','Funktionell','forearms',['core','back','shoulders']],
 ['dumbbell-bench-press','Kurzhantel-Bankdrücken','Brust','chest',['triceps','shoulders']],
 ['dumbbell-front-raise','Kurzhantel-Frontheben','Schultern','shoulders',[]],
 ['assisted-pullup','Klimmzüge mit Assistenzband','Rücken','back',['biceps','forearms']]
].map(([id,name,group,primary,secondary])=>Object.freeze({id,name,group,primary,secondary})));
export const STRONGLIFTS_5X5=Object.freeze({
 A:Object.freeze([{exerciseId:'squat',sets:5,reps:5},{exerciseId:'bench',sets:5,reps:5},{exerciseId:'barbell-row',sets:5,reps:5}]),
 B:Object.freeze([{exerciseId:'squat',sets:5,reps:5},{exerciseId:'military-press',sets:5,reps:5},{exerciseId:'deadlift',sets:1,reps:5}])
});
const byId=new Map(EXERCISES.map(x=>[x.id,x]));
// FIT exercise_title values can be text labels. Map only unique, exact labels,
// not broad categories (e.g. 'Row') or summaries without exercise_name.
const normGarminTitle92=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');


/** English first, German clarification second; titles are practical English aliases,
 * not a claim that every Garmin firmware uses exactly the same wording. IDs are stable. */
export const STRENGTH_ENGLISH_NAMES=Object.freeze({
 'bench':'Barbell Bench Press','incline-bench':'Incline Bench Press','pushup':'Push-Up',
 'chest-press':'Chest Press','chest-fly':'Chest Fly','pullup':'Pull-Up','lat-pulldown':'Lat Pulldown',
 'cable-row':'Seated Cable Row','dumbbell-row':'One-Arm Dumbbell Row','barbell-row':'Barbell Row',
 'deadlift':'Deadlift','romanian-deadlift':'Romanian Deadlift','squat':'Barbell Squat',
 'leg-press':'Leg Press','lunge':'Lunge','leg-extension':'Leg Extension','leg-curl':'Leg Curl',
 'hip-thrust':'Hip Thrust','glute-bridge':'Glute Bridge','calf-raise':'Calf Raise',
 'shoulder-press':'Shoulder Press','lateral-raise':'Lateral Raise','face-pull':'Face Pull',
 'reverse-fly':'Reverse Fly','biceps-curl':'Biceps Curl','hammer-curl':'Hammer Curl',
 'triceps-pushdown':'Triceps Pushdown','triceps-extension':'Overhead Triceps Extension',
 'wrist-curl':'Wrist Curl','plank':'Plank','dead-bug':'Dead Bug','crunch':'Crunch',
 'pallof-press':'Pallof Press','military-press':'Military Press',
 'curl-to-press':'Curl to Press','hammer-to-press':'Hammer Curl to Press',
 'triceps-curl':'Triceps Curl / French Press','skullcrusher':'Skull Crusher',
 'close-grip-bench':'Close-Grip Bench Press','reverse-curl':'Reverse Curl',
 'concentration-curl':'Concentration Curl','seated-dumbbell-press':'Seated Dumbbell Shoulder Press',
 'ab-wheel-kneeling':'Kneeling Ab-Wheel Rollout','dumbbell-floor-press':'Dumbbell Floor Press',
 'dumbbell-pullover':'Dumbbell Pullover','dumbbell-lateral-raise':'Dumbbell Lateral Raise',
 'goblet-squat':'Goblet Squat','dumbbell-romanian-deadlift':'Dumbbell Romanian Deadlift',
 'dumbbell-shoulder-press':'Dumbbell Shoulder Press','barbell-overhead-press':'Barbell Overhead Press',
 'cable-straight-arm-pulldown':'Straight-Arm Cable Pulldown',
 'cable-single-arm-row':'Single-Arm Cable Row','cable-lateral-raise':'Cable Lateral Raise',
 'cable-rear-delt-fly':'Cable Rear-Delt Fly','cable-crunch':'Cable Crunch',
 'cable-woodchop':'Cable Woodchop','decline-pushup':'Decline Push-Up',
 'incline-pushup':'Incline Push-Up','pike-pushup':'Pike Push-Up','prone-y-raise':'Prone Y Raise',
 'one-arm-dumbbell-snatch':'One-Arm Dumbbell Snatch','dumbbell-front-squat':'Dumbbell Front Squat',
 'dumbbell-walking-lunge':'Dumbbell Walking Lunge','sled-push':'Sled Push',
 'farmers-walk':"Farmer's Walk / Farmer's Carry",'dumbbell-bench-press':'Dumbbell Bench Press',
 'dumbbell-front-raise':'Dumbbell Front Raise','assisted-pullup':'Assisted Pull-Up'
});
const GERMAN_CLARIFICATIONS=Object.freeze({
 'hip-thrust':'Hüftheben','glute-bridge':'Gesäßbrücke',
 'face-pull':'Zug zum Gesicht am Seil','reverse-fly':'Rückwärtsfliegende',
 plank:'Unterarmstütz','dead-bug':'Käferübung','pallof-press':'Anti-Rotations-Press',
 'crunch':'Bauchpressen'
});
export const strengthExerciseLabel=(id)=>{
 const x=byId.get(id);if(!x)return String(id||'');
 const en=STRENGTH_ENGLISH_NAMES[id]||x.name,de=GERMAN_CLARIFICATIONS[id]||x.name;
 return de.startsWith(`${en} (`)?de:`${en} (${de})`;
};
export const V_TAPER_HOME_EXERCISES=Object.freeze([
 'dumbbell-row','dumbbell-lateral-raise','reverse-fly','dumbbell-pullover','goblet-squat',
 'ab-wheel-kneeling','dumbbell-romanian-deadlift','dumbbell-floor-press','dumbbell-shoulder-press',
 'decline-pushup','pike-pushup','prone-y-raise','barbell-row','calf-raise'
]);
export const V_TAPER_GYM_EXERCISES=Object.freeze([
 'lat-pulldown','cable-lateral-raise','cable-rear-delt-fly','cable-single-arm-row',
 'cable-straight-arm-pulldown','squat','cable-crunch','face-pull','barbell-row'
]);
const strengthRecentIds=state=>{
 const rows=[];
 for(const a of state?.strengthJournal?.annotations||[]){
  for(const [i,set] of (a.sets||[]).entries())if(byId.has(set.exerciseId))
   rows.push({id:set.exerciseId,at:Date.parse(a.start||a.updatedAt)||0,i});
 }
 for(const session of state?.strengthGuidedSessions||[]){
  for(const exercise of session.exercises||[])if(byId.has(exercise.exerciseId)&&exercise.confirmedSets?.some(s=>s.confirmed===true))
   rows.push({id:exercise.exerciseId,at:Date.parse(session.finishedAt||session.startedAt)||0,i:0});
 }
 rows.sort((a,b)=>b.at-a.at||b.i-a.i);
 return [...new Set(rows.map(x=>x.id))].slice(0,10);
};

const GARMIN_ALIASES_92=new Map();
for(const entry of EXERCISES){
 for(const label of [entry.name,STRENGTH_ENGLISH_NAMES[entry.id]]){
  if(!label)continue;
  const key=normGarminTitle92(label);
  if(key.length<7)continue; // no vague 2-3 letter aliases
  const prev=GARMIN_ALIASES_92.get(key);
  GARMIN_ALIASES_92.set(key,prev&&prev!==entry.id?null:entry.id);
 }
}
for(const [id,aliases] of Object.entries({
 'one-arm-dumbbell-snatch':['Dumbbell Snatch','Single Arm Dumbbell Snatch','Single-Arm Dumbbell Snatch'],
 'dumbbell-front-squat':['Dumbbell Front Squat','Front Squat with Dumbbells'],
 'dumbbell-walking-lunge':['Dumbbell Walking Lunge','Walking Lunge with Dumbbells'],
 'sled-push':['Sled Push','Prowler Push'],
 'farmers-walk':['Farmers Walk','Farmer Carry','Farmers Carry','Farmer\'s Walk'],
 'dumbbell-bench-press':['Dumbbell Bench Press','DB Bench Press'],
 // Exact names for rear-delt movements: common FIT/manual variants should
 // resolve to the same stable muscle-map ID, not be silently left unassigned.
 'reverse-fly':['Dumbbell Reverse Fly','Reverse Dumbbell Fly','Dumbbell Rear Delt Fly',
  'Seated Bent-Over Rear Delt Raise','Seated Bent Over Rear Delt Raise',
  'Bent Over Rear Delt Raise','Seated Reverse Fly','Bent-Over Reverse Fly',
  'Reverse Dumbbell Delt Fly','Dumbbell Reverse Delt Fly'],
 'dumbbell-lateral-raise':['DB Lateral Raise','Dumbbell Side Lateral Raise'],
 'dumbbell-front-raise':['DB Front Raise','Dumbbell Front Raise'],
 'assisted-pullup':['Band Assisted Pull Up','Band Assisted Pull-Up', 'Assisted Pullup'],
 'face-pull':['Cable Face Pull','Rope Face Pull']
}))for(const label of aliases){const key=normGarminTitle92(label),prev=GARMIN_ALIASES_92.get(key);GARMIN_ALIASES_92.set(key,prev&&prev!==id?null:id);}
/** Annotate an identified FIT title without changing Garmin raw data or guessing
 * the identity of a broad set category. A user's saved edit always takes priority.
 */
export function canonicalGarminExercise92(set){
 if(set?.exerciseId&&byId.has(set.exerciseId))return set.exerciseId;
 if(set?.identified!==true||typeof set.exercise!=='string')return null;
 return GARMIN_ALIASES_92.get(normGarminTitle92(set.exercise))||null;
}
function withRecognizedGarminMuscles92(set){
 if(!set||set.exerciseId&&manualExerciseMuscles(set.exerciseId).known)return set;
 const id=canonicalGarminExercise92(set);if(!id)return set;
 const x=manualExerciseMuscles(id);
 return {...set,exerciseId:id,primary:x.primary,secondary:[...x.secondary],knownMuscles:true,garminTitleMatched:true};
}
export function manualExerciseMuscles(id){const x=byId.get(id);return x?{name:x.name,primary:x.primary,secondary:x.secondary,known:true}:{name:'Übung offen',primary:null,secondary:[],known:false};}
export function strengthAnnotationKey(s){return String(s?.id||'');}
const offsetMatch=(a,b)=>{const x=Date.parse(a||''),y=Date.parse(b||'');return Number.isFinite(x)&&Number.isFinite(y)&&[0,-2,-1,1,2].some(h=>Math.abs(x-y+h*3600000)<150000);};
const matches=(annotation,session)=>annotation.sessionId===session.id||annotation.start===session.start||offsetMatch(annotation.start,session.start);
export function findStrengthAnnotation(state,session){return (state?.strengthJournal?.annotations||[]).filter(a=>matches(a,session)).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')))[0]||null;}
export function applyStrengthAnnotations(state,sessions=[]){return sessions.map(session=>{
 const ann=findStrengthAnnotation(state,session);if(!ann)return {...session,sets:(session.sets||[]).map(withRecognizedGarminMuscles92)};
 const base=Array.isArray(session.sets)?session.sets:[];
 // Fresh imports may add sets; keep new Garmin sets while preserving manually corrected fields.
 const count=Math.max(base.length,ann.sets.length),sets=[];
 for(let i=0;i<count;i++){
  const raw=base[i]||{index:i,start:session.start,end:session.end,category:null,subtype:null,exercise:'Übung nicht zugeordnet',reps:null,weightKg:null};
  const edit=ann.sets[i];if(!edit){sets.push(withRecognizedGarminMuscles92(raw));continue;}
  const x=manualExerciseMuscles(edit.exerciseId);sets.push({...raw,index:i,exerciseId:edit.exerciseId||null,exercise:edit.exerciseId?x.name:raw.exercise,reps:edit.reps,weightKg:edit.weightKg,primary:x.primary,secondary:x.secondary,knownMuscles:x.known,manuallyEdited:true});
 }
 return {...session,sets,summaryOnly:false,manuallyAnnotated:true};
});}
const toNumber=(v,min,max,integer=false)=>{if(v==null||String(v).trim()==='')return null;const n=Number(String(v).replace(',','.'));if(!Number.isFinite(n)||n<min||n>max||(integer&&!Number.isInteger(n)))throw Error('Ungültige Angabe bei Sätzen / Wiederholungen / Gewicht.');return n;};
export function putStrengthAnnotation(state,{sessionId,start,sets}){
 if(!sessionId||!start||!Number.isFinite(Date.parse(start)))throw Error('Trainingseinheit fehlt.');
 if(!Array.isArray(sets)||!sets.length||sets.length>80)throw Error('Bitte zwischen 1 und 80 Sätze angeben.');
 const cleaned=sets.map(s=>({exerciseId:byId.has(s.exerciseId)?s.exerciseId:null,reps:toNumber(s.reps,0,500,true),weightKg:toNumber(s.weightKg,0,500)}));
 state.strengthJournal??={annotations:[]};state.strengthJournal.annotations??=[];
 const old=state.strengthJournal.annotations.findIndex(x=>x.sessionId===sessionId||x.start===start);
 const item={sessionId,start,sets:cleaned,updatedAt:new Date().toISOString(),source:'manual-compass'};
 if(old<0)state.strengthJournal.annotations.push(item);else state.strengthJournal.annotations[old]=item;
 return item;
}
export function strengthSetRow(i,s={},recent=[]){
 const opt=(id)=>`<option value="${esc(id)}" ${!selected&&s.exerciseId===id?(selected=true,'selected'):''}>${esc(strengthExerciseLabel(id))}</option>`;
 let selected=false;
 const group=(title,ids)=>{
  const valid=[...new Set(ids)].filter(id=>byId.has(id));
  return valid.length?`<optgroup label="${esc(title)}">${valid.map(opt).join('')}</optgroup>`:'';
 };
 const regionGroups=[
  ['Rücken / Lat', ['back']],['Brust',['chest']],['Schultern',['shoulders']],
  ['Beine / Gesäß',['quads','posterior','glutes','calves']],
  ['Arme / Unterarme',['biceps','triceps','forearms']],['Rumpf / Bauch',['core']]
 ];
 const favorites=['hip-thrust','biceps-curl','military-press','triceps-curl','hammer-curl','hammer-to-press','curl-to-press','squat','bench','barbell-row','deadlift'];
 const options='<option value="">Übung zuordnen …</option>'+
  group('★ Zuletzt verwendet',recent)+
  group('⭐ Deine häufigen Übungen · schneller Zugriff',favorites)+
  group('V-Taper · Zuhause',V_TAPER_HOME_EXERCISES)+
  group('V-Taper · Gym',V_TAPER_GYM_EXERCISES)+
  group('Neue optionale Übungen · 0.5.89',['one-arm-dumbbell-snatch','dumbbell-front-squat','dumbbell-walking-lunge','sled-push','farmers-walk','dumbbell-bench-press'])+
  group('StrongLifts 5×5 · Workout A',STRONGLIFTS_5X5.A.map(x=>x.exerciseId))+
  group('StrongLifts 5×5 · Workout B',STRONGLIFTS_5X5.B.map(x=>x.exerciseId))+
  regionGroups.map(([title,regions])=>group(title,EXERCISES.filter(x=>regions.includes(x.primary)).map(x=>x.id))).join('');
 return `<div class="str732-set" data-strength-set="${i}"><span class="str732-count">Satz ${i+1}</span><label>Übung (English / Deutsch)<select name="exercise-${i}">${options}</select></label><label>Wdh.<input inputmode="numeric" type="number" min="0" max="500" step="1" name="reps-${i}" placeholder="–" value="${Number.isFinite(s.reps)?s.reps:''}"></label><label>kg<input inputmode="decimal" type="number" min="0" max="500" step="0.25" name="weight-${i}" placeholder="–" value="${Number.isFinite(s.weightKg)?s.weightKg:''}"></label></div>`;
} 
export function strengthEditorView(state,sessions=[],editingId=''){
 const recentUsed=strengthRecentIds(state),reversed=[...sessions].reverse(),pending=reversed.filter(s=>!s.sets?.length||s.sets.some(x=>!x.exerciseId&&!x.identified));
 const current=reversed.find(s=>s.id===editingId);
 const prompt=pending.length?`<div class="str732-pending" role="status"><strong>💪 ${pending.length} Krafttraining${pending.length===1?'':'seinheiten'} zur Zuordnung</strong><p>Garmin hat die Einheiten erfasst. Wähle hier einfach Übungen und trage Wiederholungen sowie Gewichte ein; kein weiterer FIT-Export notwendig.</p><div class="str732-choices">${pending.slice(0,8).map(s=>`<button type="button" data-action="str732-edit" data-id="${esc(s.id)}">${esc(s.day)} · ${esc(s.start?.slice(11,16)||'')} · ${Math.max(s.reportedSets||0,s.sets?.length||0)||'?'} Sätze →</button>`).join('')}</div></div>`:'';
 const list=reversed.slice(0,20).map(s=>`<button type="button" class="str732-session-choice" data-action="str732-edit" data-id="${esc(s.id)}"><span>${esc(s.day)} · ${esc(s.start?.slice(11,16)||'')} <small>${s.manuallyAnnotated?'✓ Bearbeitet':s.summaryOnly?'Noch nicht zugeordnet':'Garmin/FIT'}</small></span><strong>${Math.max(s.reportedSets||0,s.sets?.length||0)||'–'} Sätze <span aria-hidden="true">✎</span></strong></button>`).join('');
 if(!current)return `<section class="work-card str732-editor"><div class="work-heading"><span>📝 Übungen &amp; Gewichte nachtragen</span><small>Lokales Trainingsjournal</small></div>${prompt}<details><summary>Trainingseinheit zum Bearbeiten auswählen</summary><div class="str732-session-list">${list||'Noch keine Garmin-Krafttrainingseinheit importiert.'}</div></details><p class="str732-help">Die Muskelkarte wird aus den von dir zugeordneten Übungen berechnet; ein automatisch aufgezeichnetes Training wird dabei nicht doppelt gezählt.</p></section>`;
 const prior=findStrengthAnnotation(state,current),raw=prior?.sets||current.sets||[],count=Math.min(80,Math.max(1,current.reportedSets||0,raw.length));
 const sets=Array.from({length:count},(_,i)=>{const s=raw[i]||{reps:null,weightKg:null};return !prior&&s.source==='garmin-fit-set'&&s.weightKg===0?{...s,weightKg:null}:s;});
 return `<section class="work-card str732-editor"><div class="work-heading"><span>✏️ Training bearbeiten · ${esc(current.day)}</span><button type="button" class="secondary-btn" data-action="str732-cancel">Schließen</button></div><p class="str732-help">${esc(current.start?.slice(11,16)||'')} · ${current.reportedReps??'–'} Wiederholungen laut Garmin. Unbekannte Werte bitte leer lassen. Die Zuordnung überschreibt keine importierten Originaldaten.</p><form id="str732-form" data-session-id="${esc(current.id)}" data-start="${esc(current.start)}"><p class="str734-mobile-tip">📱 Zuerst V-Taper / StrongLifts oder Körperregion wählen. Englische Garmin-Bezeichnung steht vor der deutschen Übersetzung.</p><div class="str732-rows">${sets.map((set,i)=>strengthSetRow(i,set,recentUsed)).join('')}</div><div class="str732-buttons"><button type="button" data-action="str732-add-set" class="secondary-btn">+ Satz hinzufügen</button><button type="submit" class="primary-btn">Übungen speichern und Muskelkarte aktualisieren</button></div></form></section>`;
}
