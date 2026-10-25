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
   mod.openMakkoGuide({
    onSession:async session=>{
      if(!state||!session||!session.totalSeconds)return;
      // Sessions are persisted inside the already encrypted Vault, never in public localStorage.
      await mutate(st=>{
       const prior=Array.isArray(st.makkoHoSessions)?st.makkoHoSessions:[];
       if(prior.some(row=>row.id===session.id))return;
       st.makkoHoSessions=[...prior,{...session,day:localDate()}].slice(-400);
      });
    },
    onFinish:async()=>{if(!habitIsDone(state,'hakka-5'))await runAction('habit-toggle','hakka-5');}
   });
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
   if(s.includes("function habitInsightsView(){")){
    s=change(s,"function habitInsightsView(){","function makkoTimeInsights(st){\n const rows=(Array.isArray(st?.makkoHoSessions)?st.makkoHoSessions:[]).filter(x=>x&&Number(x.totalSeconds)>0&&Array.isArray(x.holds));\n if(!rows.length)return '<section class=\"work-card\"><div class=\"work-heading\"><span>🌸 Makko-Ho · Übungszeit</span></div><p class=\"muted-line\">Nach deiner ersten Übung erscheinen hier die tatsächlich gehaltenen Zeiten und dein Verlauf.</p></section>';\n const sorted=[...rows].sort((a,b)=>String(a.finishedAt||'').localeCompare(String(b.finishedAt||'')));\n const complete=sorted.filter(x=>x.completed);\n const latest=sorted[sorted.length-1];\n const today=new Date();today.setHours(12,0,0,0);\n const dates=Array.from({length:14},(_,i)=>{const d=new Date(today);d.setDate(d.getDate()-(13-i));return localDateString(d);});\n const values=dates.map(day=>sorted.filter(x=>x.day===day).reduce((n,x)=>n+Math.round(Number(x.totalSeconds)||0),0));\n const recent=values.slice(-7).reduce((a,b)=>a+b,0);\n const earlier=values.slice(0,7).reduce((a,b)=>a+b,0);\n const max=Math.max(60,...values);\n const mins=n=>Math.round(n/60*10)/10;\n const dots=dates.map((d,i)=>'<div title=\"'+h(d)+' · '+values[i]+' Sekunden\" style=\"display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:0\"><div style=\"height:48px;display:flex;align-items:flex-end\"><span style=\"display:block;width:10px;height:'+Math.max(3,Math.round(values[i]/max*46))+'px;border-radius:8px;background:'+(values[i]?'#40846b':'#dce7de')+'\"></span></div><small style=\"font-size:9px;color:#6f8076\">'+d.slice(8)+'</small></div>').join('');\n const parts=latest.holds.map(row=>'<div style=\"display:flex;justify-content:space-between;gap:12px;padding:4px 0;border-bottom:1px solid #e6eee8\"><span>'+h(({metal:'ZENKUTSU',earth:'KOKYŪ',fire:'KOKAN',water:'ASHI',innerfire:'KOSA',wood:'SOKUHO'})[row.pose]||row.pose)+(row.side?' · '+(row.side==='left'?'links':'rechts'):'')+'</span><strong>'+Math.max(0,Math.round(row.seconds))+' s</strong></div>').join('');\n return '<section class=\"work-card\" aria-label=\"Makko-Ho Fortschritt\"><div class=\"work-heading\"><span>🌸 Makko-Ho · Übungszeit</span><small>'+complete.length+' vollständig · '+sorted.length+' erfasst</small></div><div class=\"habit569-kpis\"><div><small>Letzte Session</small><strong>'+mins(latest.totalSeconds)+' min</strong></div><div><small>Letzte 7 Tage</small><strong>'+mins(recent)+' min</strong></div><div><small>Vorige 7 Tage</small><strong>'+mins(earlier)+' min</strong></div></div><div style=\"margin:14px 0;display:flex;align-items:end;gap:5px;min-height:68px\" aria-label=\"14 Tage Haltezeit in Sekunden\">'+dots+'</div><details><summary>Letzte Session · Zeiten pro Haltung</summary><div style=\"margin-top:10px;font-size:13px\">'+parts+'</div></details><p class=\"muted-line\" style=\"margin-top:8px\">Nur aktive Haltezeit; Pausen zählen nicht. Vorzeitig beendete Sessions sind gesondert erfasst.</p></section>';\n}\nfunction habitInsightsView(){",'Makko session statistics helper');
    const insightAnchor="${journalSyncPanel()}<section class=\"work-card\"><div class=\"work-heading\"><span>${ico('checkSquare',18)} Habit Tracker";
    s=change(s,insightAnchor,insightAnchor.replace('$'+'{journalSyncPanel()}','$'+'{journalSyncPanel()}$'+'{makkoTimeInsights(state)}'),'Makko stats in habit insights');
   }
   return {code:s,map:null};
  }
  return null;
 }};
}
