/** Compass .59.40.7 — auditable plateau, rest and Fitdays trend evidence.
 * No diagnosis of muscle growth, no fabricated RIR/rest, no automated edits.
 * Evidence rules are conservative product heuristics, not validated clinical cutoffs.
 */
const goodDay=d=>/^\d{4}-\d\d-\d\d$/.test(String(d||''));
const median=x=>{const a=x.filter(Number.isFinite).sort((a,b)=>a-b);return a.length?(a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2):null;};
const deltaDays=(a,b)=>goodDay(a)&&goodDay(b)?Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000):null;
const validTime=t=>{const n=Date.parse(t||'');return Number.isFinite(n)?n:null;};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round=(x,digits=1)=>Number.isFinite(x)?Number(x.toFixed(digits)):null;
const focusNames={back:'Rücken / Latissimus',shoulders:'Schultern',chest:'Brust',quads:'Oberschenkel',posterior:'Beinrückseite',core:'Rumpf'};
const interesting=new Set(['back','shoulders']);

/** Only truly observed start->previous completion qualifies as real rest.
 * Two completion timestamps alone contain the next set's work, and are not rest.
 */
export function coachRestEvidence47(exercise){
 const rows=(Array.isArray(exercise?.confirmedSets)?exercise.confirmedSets:[])
  .filter(s=>s?.confirmed===true).sort((a,b)=>(a.setNumber||0)-(b.setNumber||0));
 const accurate=[],betweenConfirmations=[];
 for(let i=1;i<rows.length;i++){
  const prev=rows[i-1],current=rows[i];
  const end=validTime(prev.completedAt),start=validTime(current.setStartedAt),nextEnd=validTime(current.completedAt);
  if(end!==null&&start!==null&&start>=end&&start-end<=3600e3){accurate.push((start-end)/1000);continue;}
  if(end!==null&&nextEnd!==null&&nextEnd>=end&&nextEnd-end<=3600e3)betweenConfirmations.push((nextEnd-end)/1000);
 }
 return {measuredSeconds:accurate,intervalSeconds:betweenConfirmations,
  medianMeasuredSeconds:median(accurate),measuredCount:accurate.length,
  intervalCount:betweenConfirmations.length};
}
export function coachRestRecommendation47(primary,kind='general'){
 // Starting points, not biological thresholds and not a replacement for readiness.
 return kind==='isolation'||['shoulders','biceps','triceps'].includes(primary)?120:180;
}

function sessionEvidence(state,exerciseId,today){
 const out=[];
 for(const session of Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[]){
  if(session?.source!=='compass-guided-v5920'||!(session.completed===true||session.finishedAt))continue;
  const day=String(session.startedAt||'').slice(0,10);if(!goodDay(day)||day>today)continue;
  const age=deltaDays(day,today);if(age===null||age>100)continue;
  for(const exercise of session.exercises||[]){
   if(exercise.exerciseId!==exerciseId)continue;
   const sets=(exercise.confirmedSets||[]).filter(s=>s?.confirmed&&Number.isInteger(s.reps)&&s.reps>0&&s.reps<=100);
   if(sets.length<2)continue;
   const weighted=sets.filter(s=>Number.isFinite(s.weightKg)&&s.weightKg>0);
   const kilos=median(weighted.map(s=>s.weightKg));
   // Never treat sets at unrelated loads as one comparable observation.
   if(kilos!==null&&weighted.some(s=>Math.abs(s.weightKg-kilos)>.05))continue;
   const load=weighted.length===sets.length?kilos:null;
   const reps=median(sets.map(s=>s.reps));
   const validRir=sets.map(s=>s.rir).filter(x=>Number.isInteger(x)&&x>=0&&x<=4);
   const rest=coachRestEvidence47(exercise);
   out.push({day,sessionId:session.id||session.startedAt,exerciseId,reps,load,sets:sets.length,rir:median(validRir),rest:rest.medianMeasuredSeconds,restCount:rest.measuredCount,intervalCount:rest.intervalCount});
  }
 }
 // More than one occurrence per day is not four independent training days.
 const byDay=new Map();for(const x of out.sort((a,b)=>a.day.localeCompare(b.day)))byDay.set(x.day,x);
 return [...byDay.values()].sort((a,b)=>a.day.localeCompare(b.day));
}

export function coachPlateau47(state,exerciseId,{today=new Date().toISOString().slice(0,10),primary='back',healthAttention=false,weeklyKnownSets=null,activeDeload=false}={}){
 const series=sessionEvidence(state,exerciseId,today);
 if(series.length<4)return {status:'insufficient',count:series.length,reason:'Mindestens vier dokumentierte vollständige Trainingstage nötig.',action:'gather',restDays:series.filter(s=>s.rest!==null).length};
 const recent=series.slice(-4),days=deltaDays(recent[0].day,recent.at(-1).day);
 if(days<21)return {status:'insufficient',count:recent.length,reason:'Trainingsvergleich benötigt mindestens 21 Tage.',action:'gather',restDays:recent.filter(s=>s.rest!==null).length};
 const loads=recent.map(s=>s.load);
 if(loads.some(x=>x===null)&&!loads.every(x=>x===null))return {status:'incomparable',count:4,reason:'Sätze mit dokumentierter und unbekannter Last nicht vermischen.',action:'review'};
 if(loads.every(x=>x!==null)&&Math.max(...loads)-Math.min(...loads)>Math.max(1,median(loads)*.05))
  return {status:'incomparable',count:4,reason:'Die Trainingsgewichte haben sich verändert; kein gleichartiger Plateauvergleich.',action:'review'};
 const gains=recent.at(-1).reps-recent[0].reps;
 if(gains>=1)return {status:'progressing',count:4,days,deltaReps:round(gains),action:'continue',reason:'Wiederholungsleistung ist gestiegen.'};
 const consistent=recent.map(s=>s.reps);const narrow=Math.max(...consistent)-Math.min(...consistent)<=1;
 if(!narrow)return {status:'incomparable',count:4,days,action:'review',reason:'Schwankende Satzleistung: noch kein belastbares Plateau.'};
 const actualRest=recent.map(s=>s.rest).filter(Number.isFinite);
 if(actualRest.length>=3&&Math.max(...actualRest)-Math.min(...actualRest)>=120)
  return {status:'incomparable',count:4,days,action:'standardize-rest',reason:'Die dokumentierten Satzpausen variieren um mindestens zwei Minuten. Zuerst die Pausen vergleichbar halten.'};
 const restMedian=median(actualRest),recommended=coachRestRecommendation47(primary);
 const lir=recent.map(s=>s.rir).filter(Number.isFinite),lastRir=lir.length?lir.at(-1):null;
 let action='review',reason='Mögliches Leistungsplateau: Ursachen prüfen, bevor du Belastung oder Übung änderst.';
 if(actualRest.length>=2&&restMedian<recommended-30){action='longer-rest';reason=`Dokumentierte Satzpausen zuletzt im Median ${Math.round(restMedian)} s. Teste ${recommended} s und vergleiche Satzleistung bei sonst gleichen Bedingungen.`;}
 else if(activeDeload||healthAttention||(lir.length>=2&&lir.slice(-2).every(x=>x<=1)&&recent.at(-1).reps<recent[0].reps)){
  action='consider-deload';reason='Hohe Beanspruchung oder mögliche Erholungsbelastung: eine konservative Entlastung erwägen, bevor das Volumen steigt.';
 }else if(lastRir!==null&&lastRir>=3){action='progress-reps';reason='Noch deutliche Wiederholungsreserve: nächste saubere Wiederholung bei gleicher Last testen.';}
 else if(interesting.has(primary)&&Number.isFinite(weeklyKnownSets)&&weeklyKnownSets<10){action='consider-volume';reason='Rücken-/Schulter-Trainingsvolumen liegt unter einem häufig verwendeten Hypertrophie-Richtbereich. Einen zusätzlichen Arbeitssatz erwägen, nur bei guter Erholung.';}
 else if(actualRest.length<2){action='measure-rest';reason='Pausendauer bislang unzureichend dokumentiert; zuerst die tatsächlichen Pausen zwischen den Sätzen messen.';}
 else if(days<35){action='continue';reason='Zuerst unter vergleichbaren Bedingungen länger beobachten; Übungswechsel nicht schon nach wenigen Wochen erzwingen.';}
 else {action='variation';reason='Bei stabilen Pausen und unveränderter Satzleistung eine gezielte Änderung des Wiederholungsbereichs oder Übungswinkels als 3–4-wöchigen Versuch erwägen.';}
 return {status:'possible-plateau',count:4,days,deltaReps:round(gains),restMedianSeconds:round(restMedian),measuredRestDays:actualRest.length,lastRir,action,reason};
}

/** Segment trends are BIA estimates only. Separate lean arm/trunk mass cannot
 * establish deltoid or lat hypertrophy; require repeated, spaced measurements.
 */
export function coachFitdaysSegments47(state,{today=new Date().toISOString().slice(0,10)}={}){
 const byDay=new Map();
 for(const row of Array.isArray(state?.healthImports?.fitdays)?state.healthImports.fitdays:[]){
  const day=row?.day||String(row?.at||'').slice(0,10),age=deltaDays(day,today);
  if(!goodDay(day)||age===null||age<0||age>120)continue;
  if(!row?.segmentMuscle||typeof row.segmentMuscle!=='object')continue;
  const old=byDay.get(day);if(!old||String(old.at||'')<String(row.at||''))byDay.set(day,row);
 }
 const rows=[...byDay.values()].sort((a,b)=>a.day.localeCompare(b.day));
 if(rows.length<6)return {status:'insufficient',count:rows.length,rows:[],message:`${rows.length} / 6 Messtage mit segmentalen Fitdays-Werten; Trend noch nicht auswertbar.`};
 const first=rows.slice(0,3),last=rows.slice(-3),span=deltaDays(first[0].day,last.at(-1).day);
 if(span<28)return {status:'insufficient',count:rows.length,rows:[],message:'Mindestens 28 Tage zwischen ersten und letzten segmentalen Messungen benötigt.'};
 const keys=[['rightArm','Rechter Arm'],['leftArm','Linker Arm'],['trunk','Rumpf'],['rightLeg','Rechtes Bein'],['leftLeg','Linkes Bein']];
 const segments=keys.map(([key,label])=>{
  const a=first.map(x=>x.segmentMuscle?.[key]?.kg).filter(x=>Number.isFinite(x)&&x>0);
  const b=last.map(x=>x.segmentMuscle?.[key]?.kg).filter(x=>Number.isFinite(x)&&x>0);
  return {key,label,from:a.length>=2?median(a):null,to:b.length>=2?median(b):null,deltaKg:a.length>=2&&b.length>=2?round(median(b)-median(a),2):null};
 });
 return {status:segments.some(x=>x.deltaKg!==null)?'exploratory':'insufficient',count:rows.length,from:first[0].day,to:last.at(-1).day,span,rows:segments,
  message:'Fitdays-BIA: Geräteschätzwerte, empfindlich gegenüber Wasserhaushalt und Messbedingungen. Kein direkter Nachweis von Latissimus- oder Schultermuskelwachstum.'};
}
/** Safe strategy trial: longer rest is proposed on the NEXT generated plan only;
 * old sessions and logged loads are never altered. Starting the plan is user-controlled.
 */
export function coachPlateauRestPlan47(state,plan,today){
 if(plan?.goal!=='vtaper'||!Array.isArray(plan.exercises))return plan;
 let extra=0;const experiments=[];
 const exercises=plan.exercises.map(e=>{
  const p=coachPlateau47(state,e.id,{today,primary:e.primary,
   healthAttention:plan.health?.attention,weeklyKnownSets:plan.history?.usable?plan.history.counts7?.[e.primary]:null,
   activeDeload:plan.cycle?.deloadActive});
  if(p.action!=='longer-rest')return e;
  const proposed=coachRestRecommendation47(e.primary),old=Number(e.restSeconds)||90;
  if(old>=proposed)return e;
  extra+=Math.max(0,(Number(e.sets)||1)-1)*(proposed-old)/60;
  experiments.push({exerciseId:e.id,fromSeconds:old,toSeconds:proposed,reason:p.reason});
  return {...e,restSeconds:proposed,progressionHint:[e.progressionHint,`Pausenexperiment: ${old} → ${proposed} s`].filter(Boolean).join(' · ')};
 });
 if(!experiments.length)return plan;
 const estimatedMinutes=Math.round(Number(plan.estimatedMinutes||0)+extra);
 return {...plan,exercises,estimatedMinutes,timeFit:estimatedMinutes>plan.budget?'longer':'fits',plateauExperiments47:experiments};
}
export function coachPlateauView47(state,plan,today){
 if(!plan||plan.goal!=='vtaper')return '';
 const segments=coachFitdaysSegments47(state,{today});
 const focus=(plan.exercises||[]).filter(e=>interesting.has(e.primary)).slice(0,5);
 const rows=focus.map(e=>{
  const p=coachPlateau47(state,e.id,{today,primary:e.primary,healthAttention:plan.health?.attention,weeklyKnownSets:plan.history?.usable?plan.history.counts7?.[e.primary]:null,activeDeload:plan.cycle?.deloadActive});
  return `<div class="str407-plateau-row"><span>${safe(e.title)}</span><strong>${p.status==='possible-plateau'?'Mögliches Plateau':p.status==='progressing'?'Progression':'Datenbasis unzureichend'}</strong><small>${safe(p.reason)}</small>${p.status==='possible-plateau'?`<small>Option: ${safe(({ 'longer-rest':'Pausen verlängern','consider-deload':'Entlastung prüfen','progress-reps':'Reps steigern','consider-volume':'Satzvolumen prüfen','measure-rest':'Pausen messen','variation':'Übung/Reps variieren','review':'Verlauf prüfen'})[p.action]||'Prüfen')} · Entscheidung bleibt bei dir.</small>`:''}</div>`;
 }).join('');
 return `<details class="str407-panel"><summary>↗ Plateau-Strategie · Satzpausen · Fitdays-Segmente</summary><div class="str407-panel-body">${plan.plateauExperiments47?.length?`<p><strong>Vorgeschlagener Pausenversuch:</strong> ${plan.plateauExperiments47.map(x=>`${safe(x.fromSeconds)} → ${safe(x.toSeconds)} s`).join(" · ")}. Gilt erst, wenn du das vorgeschlagene Training startest.</p>`:""}<p><strong>Trainingsentwicklung</strong> · vollständig dokumentierte, vergleichbare Einheiten über ≥21 Tage; keine automatische Planänderung.</p>${rows||'<p>Noch kein Rücken-/Schultertraining mit bestätigten Sätzen in diesem Plan.</p>'}<div class="str407-segments"><strong>Fitdays · segmentaler Verlauf (explorativ)</strong><p>${safe(segments.message)}</p>${segments.rows.filter(x=>x.deltaKg!==null).map(x=>`<div class="str407-segment"><span>${safe(x.label)}</span><strong>${x.deltaKg>0?'+':''}${x.deltaKg.toFixed(2)} kg</strong></div>`).join('')}</div><small>Eine stagnierende Körperimpedanz ist kein Beweis für fehlendes Muskelwachstum. Bei jeder Strategie nur eine Hauptvariable ändern und erneut vergleichen.</small></div></details>`;
}
