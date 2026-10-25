/** Compass .59.10 — opt-in strength catalogue, local coaching and Makko-Ho.
 * Deliberately FIRST in the existing pre-transform pipeline; no historical
 * .50-.58 transform ordering, Vault, D1 or sync interface changes.
 */
export function compass5910StrengthHabitsBridge(){
 const change=(s,from,to,label)=>{
  const count=s.split(from).length-1;
  if(count!==1)throw Error('Compass .59.10: '+label+' source anchor '+count+' (expected 1)');
  return s.replace(from,to);
 };
 return {name:'compass-5910-strength-habits',enforce:'pre',transform(source,id){
  const name=id.replace(/\\/g,'/').split('?')[0];
  let s=source;
  if(name.endsWith('/client/src/strength-editor-v57732.js')){
   s=change(s," ['pallof-press','Pallof Press','Rumpf','core',['shoulders']],",` ['pallof-press','Pallof Press','Rumpf','core',['shoulders']],
 ['ab-wheel-kneeling','Kneeling Ab Wheel Rollout · Ab Roller kniend','Zuhause · Ab Roller','core',['shoulders','back']],
 ['dumbbell-floor-press','Kurzhantel Floor Press','Zuhause · Kurzhanteln','chest',['triceps','shoulders']],
 ['goblet-squat','Goblet Squat · Kurzhantel-Kniebeuge','Zuhause · Kurzhanteln','quads',['glutes','core']],
 ['dumbbell-romanian-deadlift','Rumänisches Kreuzheben mit Kurzhanteln','Zuhause · Kurzhanteln','posterior',['glutes','back']],
 ['dumbbell-shoulder-press','Kurzhantel-Schulterdrücken stehend','Zuhause · Kurzhanteln','shoulders',['triceps','core']],
 ['dumbbell-lateral-raise','Seitheben mit Kurzhanteln','Zuhause · Kurzhanteln','shoulders',[]],
 ['dumbbell-pullover','Kurzhantel-Pullover','Zuhause · Kurzhanteln','back',['chest','triceps']],
 ['barbell-overhead-press','Langhantel-Schulterdrücken · Verbindungsstange','Zuhause · Verbindungsstange','shoulders',['triceps','core']],
 ['cable-lateral-raise','Seitheben am Kabelzug','Gym · Kabelzug','shoulders',[]],
 ['cable-rear-delt-fly','Reverse Fly am Kabelzug','Gym · Kabelzug','shoulders',['back']],
 ['cable-straight-arm-pulldown','Straight-Arm Pulldown am Kabelzug','Gym · Kabelzug','back',['core','triceps']],
 ['cable-single-arm-row','Einarmiges Rudern am Kabelzug','Gym · Kabelzug','back',['biceps']],
 ['cable-woodchop','Cable Woodchop','Gym · Kabelzug','core',['shoulders']],
 ['cable-crunch','Cable Crunch','Gym · Kabelzug','core',[]],
 ['cable-high-to-low-fly','Kabelzug Fly von oben nach unten','Gym · Kabelzug','chest',['shoulders']],`, 'strength catalog');
   s=change(s,"favorites=['hip-thrust'","favorites=['ab-wheel-kneeling','lat-pulldown','cable-straight-arm-pulldown','cable-lateral-raise','dumbbell-floor-press','hip-thrust'",'favorite first');
   s=change(s,"const reversed=[...sessions].reverse(),pending=", "const coach610='<button type=\"button\" class=\"secondary-btn str610-open-coach\" data-action=\"strength-coach-open\">✦ Trainingscoach · Ziele &amp; Muskelbalance</button>';\n const reversed=[...sessions].reverse(),pending=",'coach control');
   s=change(s,"${prompt}<details><summary>Trainingseinheit zum Bearbeiten auswählen", "${prompt}<div class=\"str610-toolbar\">${coach610}</div><details><summary>Trainingseinheit zum Bearbeiten auswählen", 'coach entry');
   s=change(s,'<div class="str732-rows">','<div class="str610-presets" role="group" aria-label="StrongLifts 5×5"><span>Vorlage:</span><button type="button" data-action="str610-preset" data-id="A">StrongLifts A · 5×5</button><button type="button" data-action="str610-preset" data-id="B">StrongLifts B · 5×5</button></div><div class="str732-rows">','stronglifts controls');
   return {code:s,map:null};
  }
  if(name.endsWith('/client/src/strength-anatomy-v57737.js')){
   s=change(s," 'pallof-press':r(['obliques','rectus_abdominis'],['deltoid_front']),",` 'pallof-press':r(['obliques','rectus_abdominis'],['deltoid_front']),
 'ab-wheel-kneeling':r(['rectus_abdominis','obliques'],['latissimus','deltoid_front','triceps']),
 'dumbbell-floor-press':r(['pectoral_lower'],['triceps','deltoid_front']),
 'goblet-squat':r(['quadriceps','glute_max'],['rectus_abdominis','erector_spinae']),
 'dumbbell-romanian-deadlift':r(['hamstrings','glute_max'],['erector_spinae']),
 'dumbbell-shoulder-press':r(['deltoid_front'],['deltoid_side','triceps','rectus_abdominis']),
 'dumbbell-lateral-raise':r(['deltoid_side'],['trapezius_upper']),
 'dumbbell-pullover':r(['latissimus'],['pectoral_lower','triceps']),
 'barbell-overhead-press':r(['deltoid_front'],['deltoid_side','triceps','rectus_abdominis']),
 'cable-lateral-raise':r(['deltoid_side'],['trapezius_upper']),
 'cable-rear-delt-fly':r(['deltoid_rear','rhomboids'],['trapezius_mid']),
 'cable-straight-arm-pulldown':r(['latissimus'],['triceps','rectus_abdominis']),
 'cable-single-arm-row':r(['latissimus','rhomboids'],['biceps','deltoid_rear']),
 'cable-woodchop':r(['obliques'],['rectus_abdominis','deltoid_front']),
 'cable-crunch':r(['rectus_abdominis'],['obliques']),
 'cable-high-to-low-fly':r(['pectoral_lower'],['deltoid_front']),`, 'anatomy map');
   return {code:s,map:null};
  }
  if(name.endsWith('/client/src/main.js')){
   const planOld=` 4{navItem('overview','Übersicht','layers')}
 4{navItem('next','Next Actions','target')}
 4{navItem('projects','Projekte','folder')}
 4{navItem('templates','Vorlagen','bookmark')}
 4{navItem('shopping','Einkaufslisten','list')}
 4{navItem('forecast','Kalender & Forecast','calendar')}
 4{navItem('radar','Konferenzen','book')}
 4{navItem('flagged','Flagged','flag')}
 4{navItem('hold','On Hold','pause')}
 4{navItem('someday','Dreams · Someday','spark')}`.replaceAll('\u00024','$');
   const planNew=` 4{navItem('next','Next Actions','target')}
 4{navItem('projects','Projekte','folder')}
 4{navItem('forecast','Kalender & Forecast','calendar')}
 4{navItem('shopping','Einkaufslisten','list')}
 <details class="plan610-more" 4{['overview','templates','radar','flagged','hold','someday'].includes(tab)?'open':''}><summary>Weitere Planung</summary>
 4{navItem('flagged','Flagged','flag')}
 4{navItem('hold','On Hold','pause')}
 4{navItem('someday','Dreams · Someday','spark')}
 4{navItem('templates','Vorlagen','bookmark')}
 4{navItem('radar','Konferenzen','book')}
 4{navItem('overview','Übersicht','layers')}
 </details>`.replaceAll('\u00024','$');
   s=change(s,planOld,planNew,'compact Planning navigation');
   const habitTarget=`return '<button type="button" class="habit569-item '+(done?'is-done':'')+'" data-action="habit-toggle"`;
   const habitReplace=`return item.id==='hakka-5'?'<button type="button" class="habit569-item makko610-trigger '+(done?'is-done':'')+'" data-action="makko-guide-start" aria-label="Makko-Ho Übungsfolge starten"><span><strong>▶ Makko-Ho · Meridian-Stretches</strong><small>6 geführte Übungen mit Timer</small></span><span class="habit569-check">'+(done?'✓':'▶')+'</span></button>':'<button type="button" class="habit569-item '+(done?'is-done':'')+'" data-action="habit-toggle"`;
   s=change(s,habitTarget,habitReplace,'play instead of checklist');
   s=change(s,"'<article class=\"habit569-card\"><div class=\"habit569-card-head\"><div><strong>'+h(item.title)+'",
     "'<article class=\"habit569-card\"><div class=\"habit569-card-head\"><div><strong>'+h(item.id==='hakka-5'?'Makko-Ho · 6 Meridian-Stretches':item.title)+'",'habit display name');
   s=change(s,`data-action="habit-toggle" data-id="'+h(item.id)+'">'+(doneToday?'Heute erledigt ✓':'Heute abhaken')+'</button>`,
       `data-action="'+(item.id==='hakka-5'?'makko-guide-start':'habit-toggle')+'" data-id="'+h(item.id)+'">'+(item.id==='hakka-5'?'▶ Übungen starten':doneToday?'Heute erledigt ✓':'Heute abhaken')+'</button>`,'habit analytics launch');
   s=change(s,"if(action==='habit-toggle'){",`if(action==='makko-guide-start'){
   const mod=await import('./makko-ho-guide-v5775910.js');
   mod.openMakkoGuide({onFinish:async()=>{if(!habitIsDone(state,'hakka-5'))await runAction('habit-toggle','hakka-5');}});
   return;
 }
 if(action==='strength-coach-open'){
   if(!state)return toast('Für persönliche Trainingsvorschläge bitte Tresor entsperren.',true);
   const mod=await import('./strength-coach-v5775910.js');
   mod.openStrengthCoach({state,today:localDate()});return;
 }
 if(action==='str610-preset'){
   if(!['A','B'].includes(id))return;
   const rows=app.querySelector('#str732-form .str732-rows');if(!rows)return;
   if([...rows.querySelectorAll('input')].some(x=>String(x.value||'').trim())&&!window.confirm('Vorhandene Satzangaben durch die StrongLifts-Vorlage ersetzen?'))return;
   const mod=await import('./strength-editor-v57732.js');
   const preset=mod.STRONGLIFTS_5X5[id]||[];let index=0;
   rows.innerHTML=preset.flatMap(ex=>Array.from({length:ex.sets},()=>mod.strengthSetRow(index++,{exerciseId:ex.exerciseId,reps:ex.reps,weightKg:null}))).join('');
   rows.querySelector('select')?.focus({preventScroll:true});return;
 }
 if(action==='habit-toggle'){`,'on-demand guides and preset');
   return {code:s,map:null};
  }
  return null;
 }};
}
