/** Compass 0.5.77.29 · Strength & Muscle Map, read-only in local Vault.
 * Counts classified active sets, not muscle hypertrophy or measured activation.
 * Suggestions are optional exercise ideas, never training prescriptions.
 */
import {MUSCLE_GROUPS,strengthMuscles,mergeStrengthImports} from './garmin-strength-v57728.js';
import {applyStrengthAnnotations,manualExerciseMuscles} from './strength-editor-v57732.js';
import {mergeGuidedStrengthSessions} from './strength-coach-history-v5775926.js';
const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(x,dec=0)=>typeof x==='number'&&Number.isFinite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:dec}):'–';
const day=x=>x instanceof Date?`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`:String(x);
const shift=(d,n)=>{const v=new Date(d+'T12:00:00');v.setDate(v.getDate()+n);return day(v);};
const ranges={7:'7 Tage',28:'4 Wochen',90:'90 Tage',365:'1 Jahr',all:'Gesamt'};
export const STRENGTH_EXERCISE_IDEAS=Object.freeze({
 chest:['Liegestütze','Bankdrücken mit Kurzhanteln','Brustpresse'],
 back:['Rudern am Kabel','Klimmzug oder Latzug','Einarmiges Kurzhantelrudern'],
 shoulders:['Seitheben','Schulterdrücken','Face Pull'],
 biceps:['Kurzhantel-Curls','Hammer-Curls','Kabel-Curls'],
 triceps:['Trizepsdrücken am Kabel','Enge Liegestütze','Überkopf-Trizepsstrecken'],
 forearms:['Farmer Carry','Handgelenk-Curls','Dead Hang'],
 core:['Dead Bug','Plank','Pallof Press'],
 quads:['Kniebeugen','Ausfallschritte','Beinpresse'],
 posterior:['Rumänisches Kreuzheben','Beinbeuger am Gerät','Hip Hinge'],
 glutes:['Hip Thrust','Glute Bridge','Ausfallschritte'],
 calves:['Stehendes Wadenheben','Sitzendes Wadenheben','Einbeinige Wadenheben']
});
export const OPPOSING_PAIRS=Object.freeze([['chest','back','Drücken / Ziehen'],['quads','posterior','Vorder- / Rückseite Beine'],['biceps','triceps','Bizeps / Trizeps']]);
const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'');
const reportedCount=v=>Number.isInteger(v)&&v>=0&&v<=3000?v:null;
const isStrengthSummary=s=>s?.source==='garmin-activities-csv'&&(s.sport===19||/strength|krafttraining/i.test(`${s.activityType||''} ${s.title||''}`));
/** Compare local-time Garmin CSV rows to the UTC activity FIT session start. The CSV
 * explicitly lacks a timezone. Date.parse of a naive timestamp uses the viewer's
 * local zone; ±1/±2h covers a file imported in another common European time zone.
 * Match by start minute, not just same date, so two workouts are not merged.
 */
export function strengthSummariesWithFit(state){
 const fits=mergeStrengthImports([],state?.healthImports?.garminStrength||[]).map(x=>({...x}));
 const csv=(state?.healthImports?.garminSessions||[]).filter(isStrengthSummary);
 const used=new Set(),summaries=[];
 for(const row of csv){
  const when=Date.parse(row.start||'');if(!Number.isFinite(when))continue;
  let matched=-1,best=Infinity;
  for(let i=0;i<fits.length;i++){
   if(used.has(i))continue;
   const start=Date.parse(fits[i].start||'');if(!Number.isFinite(start))continue;
   // The source date may have no timezone; choose the smallest plausible offset.
   const error=Math.min(...[0,3600000,-3600000,7200000,-7200000].map(offset=>Math.abs(when+offset-start)));
   if(error<150000&&error<best){matched=i;best=error;}
  }
  const sets=reportedCount(row.totalSets),reps=reportedCount(row.totalReps);
  if(matched>=0){
   const fit=fits[matched];
   fits[matched]={...fit,reportedSets:sets??fit.reportedSets??null,reportedReps:reps??fit.reportedReps??null,
    summarySource:'garmin-activities-csv',summaryTitle:row.title||fit.summaryTitle||null};
   used.add(matched);
  }else{
   summaries.push({id:`strength-csv|${row.start}`,day:row.day||row.start.slice(0,10),start:row.start,
    end:null,sets:[],reportedSets:sets,reportedReps:reps,durationMinutes:row.durationMinutes??null,
    title:row.title||'Krafttraining',source:'garmin-activities-csv',summaryOnly:true});
  }
 }
 return [...fits,...summaries].sort((a,b)=>a.start.localeCompare(b.start));
}
const setsKnown=s=>s.sets?.length||0;
const setsCount=s=>Math.max(setsKnown(s),s.reportedSets??0);

/** One active set counts 1 primary and 0.5 secondary in the *visual index*.
 * A dot after the decimal does not represent a physically measured half set.
 */
export function strengthPeriod(state,{range='28',today=day(new Date()),includeCoach=true}={}){
 const all=applyStrengthAnnotations(state,strengthSummariesWithFit(state));
 const start=range==='all'?null:shift(today,1-(Number(range)||28));
 const garmin=all.filter(s=>validDate(s.day)&&s.day<=today&&(!start||s.day>=start));
 const overlaid=includeCoach?mergeGuidedStrengthSessions(garmin,state,{today,start}):null;
 const sessions=overlaid?overlaid.sessions:garmin;
 const coachSources=overlaid?.sources||{coachSets:0,pairedSets:0,coachOnlySessions:0,matchedSets:0,unresolvedPairs:0};
 const groups=Object.fromEntries(MUSCLE_GROUPS.map(x=>[x.id,{...x,primary:0,secondary:0,sessions:0,last:null}]));
 const events=[],unknown=[],days=new Set();let total=0,knownSets=0,unassignedExtra=0,kgVolume=0,volumeSets=0;let csvOnly=0,csvExtra=0,csvOnlySets=0,csvOnlyReps=0,csvOnlyWithSets=0,csvOnlyWithReps=0;
 for(const session of sessions){const touched=new Set();days.add(session.day);
  // CSV counts are genuine observations, but do not invent individual exercises.
  // When a matching activity FIT exists, count each known FIT set once. Only the
  // excess CSV sets remain unassigned until a fuller activity FIT is imported.
  const missing=Math.max(0,(session.reportedSets??0)-setsKnown(session));
  total+=missing;unassignedExtra+=missing;
  if(session.summaryOnly){csvOnly++;if(session.reportedSets!==null){csvOnlyWithSets++;csvOnlySets+=session.reportedSets;}if(session.reportedReps!==null){csvOnlyWithReps++;csvOnlyReps+=session.reportedReps;}}
  else if(missing)csvExtra+=missing;
  for(const set of session.sets||[]){total++;
   const manual=set.exerciseId?manualExerciseMuscles(set.exerciseId):null;
   const category=manual?.known?manual:strengthMuscles(set.category);
   const primary=category.primary,secondary=category.secondary||[];
   const item={...set,sessionId:session.id,day:session.day,exercise:set.exercise||category.name};
   events.push(item);
   if(primary&&groups[primary]){knownSets++;groups[primary].primary++;touched.add(primary);groups[primary].last=session.day;
    for(const id of secondary)if(groups[id]){groups[id].secondary++;touched.add(id);groups[id].last=session.day;}
   }else unknown.push(item);
   if(Number.isFinite(set.reps)&&Number.isFinite(set.weightKg)&&set.reps>0&&set.weightKg>0){kgVolume+=set.reps*set.weightKg;volumeSets++;}
  }
  for(const id of touched)groups[id].sessions++;
 }
 const ranked=Object.values(groups).map(g=>({...g,index:g.primary+g.secondary*.5,daysSince:g.last?Math.max(0,Math.round((Date.parse(today+'T12:00:00Z')-Date.parse(g.last+'T12:00:00Z'))/86400000)):null})).sort((a,b)=>b.index-a.index);
 const maximum=Math.max(1,...ranked.map(x=>x.index));
 // Only draw a conclusion if both sides have sufficient classified observations.
 const balance=OPPOSING_PAIRS.map(([a,b,label])=>{
  const l=groups[a].primary,r=groups[b].primary,total=l+r;
  const notable=total>=6&&Math.min(l,r)/Math.max(1,Math.max(l,r))<.45;
  const under=notable?(l<r?a:b):null;
  return {a,b,label,left:l,right:r,notable,under,ideas:under?STRENGTH_EXERCISE_IDEAS[under]:[]};
 });
 return {today,start,range:ranges[range]?range:'28',sessions,events,unknown,groups:ranked,maximum,
  activeSets:total,knownSets,unassigned:unknown.length+unassignedExtra,trainingDays:days.size,coachSources,
  csvOnly,csvOnlySets,csvOnlyReps,csvOnlyWithSets,csvOnlyWithReps,csvExtra,
  volumeKg:volumeSets?kgVolume:null,volumeSets,balance,latest:sessions.at(-1)?.day||null,
  todayRecorded:sessions.some(s=>s.day===today)};
}
const SHAPES={
 front:{
  shoulders:['M69 91 Q51 95 48 113 L62 139 L83 111 Z','M131 91 Q149 95 152 113 L138 139 L117 111 Z'],
  chest:['M84 102 L100 106 L100 151 Q76 156 72 135 Z','M116 102 L100 106 L100 151 Q124 156 128 135 Z'],
  biceps:['M51 117 L65 140 L56 181 L44 176 Z','M149 117 L135 140 L144 181 L156 176 Z'],
  forearms:['M44 178 L56 184 L45 224 L34 219 Z','M156 178 L144 184 L155 224 L166 219 Z'],
  core:['M84 155 L116 155 L121 215 L79 215 Z'],
  quads:['M80 225 L101 227 L98 320 L73 317 Z','M120 225 L99 227 L102 320 L127 317 Z'],
  calves:['M74 329 L98 329 L93 398 L78 396 Z','M102 329 L126 329 L122 398 L107 396 Z']
 },
 back:{
  shoulders:['M69 91 Q51 95 48 113 L62 139 L83 111 Z','M131 91 Q149 95 152 113 L138 139 L117 111 Z'],
  back:['M84 105 L100 117 L100 208 L72 186 Z','M116 105 L100 117 L100 208 L128 186 Z'],
  triceps:['M51 117 L65 140 L56 181 L44 176 Z','M149 117 L135 140 L144 181 L156 176 Z'],
  forearms:['M44 178 L56 184 L45 224 L34 219 Z','M156 178 L144 184 L155 224 L166 219 Z'],
  glutes:['M78 210 L100 209 L99 247 L75 247 Z','M122 210 L100 209 L101 247 L125 247 Z'],
  posterior:['M80 251 L100 252 L97 321 L73 317 Z','M120 251 L100 252 L103 321 L127 317 Z'],
  calves:['M74 329 L98 329 L93 398 L78 396 Z','M102 329 L126 329 L122 398 L107 396 Z']
 }};
/** Exact recorded set counts by calendar day. No phantom zero days and no smoothing. */
export function strengthTrainingDots(m){
 const rows=[...new Set(m.sessions.filter(s=>setsCount(s)>0).map(s=>s.day))].sort().map(d=>({day:d,sets:m.sessions.filter(s=>s.day===d).reduce((n,s)=>n+setsCount(s),0)}));
 if(!rows.length)return '<p class="str728-note">Noch keine Krafttrainingstage mit dokumentierter Satzanzahl gefunden.</p>';
 const W=Math.max(780,rows.length*25),H=215,L=46,R=16,T=20,B=179,max=Math.max(1,...rows.map(r=>r.sets));
 const d0=Date.parse((m.start||rows[0].day)+'T12:00:00Z'),d1=Math.max(d0+86400000,Date.parse(m.today+'T12:00:00Z'));
 const X=r=>L+(Date.parse(r.day+'T12:00:00Z')-d0)/(d1-d0)*(W-L-R),Y=v=>B-v/max*(B-T);
 const grid=[0,.25,.5,.75,1].map(f=>`<line x1="${L}" y1="${Y(max*f)}" x2="${W-R}" y2="${Y(max*f)}" stroke="currentColor" opacity=".1"/><text x="${L-7}" y="${Y(max*f)+3}" text-anchor="end" class="str728-axis">${fmt(max*f,1)}</text>`).join('');
 const dots=rows.map((r,i)=>`<circle cx="${X(r).toFixed(2)}" cy="${Y(r.sets).toFixed(2)}" r="${rows.length>85?3.2:5}" fill="#437D83" stroke="var(--surface,#fff)" stroke-width="1.6"><title>${e(r.day)} · ${r.sets} aktive Sätze${r.day===m.today?' · Tag noch offen':''}</title></circle>`).join('');
 const labels=rows.filter((_,i)=>i%Math.max(1,Math.ceil(rows.length/12))===0||i===rows.length-1).map(r=>`<text x="${X(r)}" y="${H-10}" text-anchor="middle" class="str728-axis">${e(r.day.slice(5))}</text>`).join('');
 return `<div class="str728-dot-scroll" tabindex="0"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tagespunkte: dokumentierte Garmin- und bestätigte Coach-Sätze">${grid}${dots}${labels}</svg></div><p class="str728-note">Jeder Punkt zeigt die gemeldete oder bestätigte Satzanzahl pro Trainingstag aus Garmin und Coach. Ohne Aktivitäts-FIT bleiben Übungsnamen und Muskelgruppen offen. Nicht erfasste Tage sind keine Nulltage. Der heutige Tag bleibt bis zum nächsten Import vorläufig.</p>`;
}
const tone=x=>x===0?'#DBE5E1':x<2?'#B3D6CC':x<4?'#75B2A2':x<8?'#387C76':'#285F76';
function bodySvg(model,side){
 const byId=Object.fromEntries(model.groups.map(g=>[g.id,g])),shapes=SHAPES[side]||SHAPES.front;
 const inners=Object.entries(shapes).map(([id,paths])=>{const group=byId[id],score=group?.index||0,color=tone(score),title=`${group?.label||id}: ${group?.primary||0} Hauptsätze, ${group?.secondary||0} Nebenbeteiligungen`;
  return paths.map(p=>`<path d="${p}" fill="${color}" stroke="#FAFCFB" stroke-width="2.3" tabindex="0"><title>${e(title)}</title></path>`).join('');}).join('');
 return `<svg viewBox="0 0 200 440" class="str728-body" role="img" aria-label="Muskelkarte ${side==='front'?'Vorderseite':'Rückseite'} · dunkler entspricht mehr dokumentierten Übungssätzen">
  <ellipse cx="100" cy="42" rx="27" ry="32" fill="#D8E2DE"/><rect x="91" y="68" width="18" height="21" rx="7" fill="#D8E2DE"/>
  <path d="M69 91 Q100 79 131 91 L153 106 170 200 153 229 138 221 147 181 128 218 127 250 124 329 126 406 107 409 99 335 93 407 77 409 73 327 75 246 71 218 53 179 62 220 47 228 30 200 47 106 Z" fill="#E3E9E6" stroke="#C8D6D0" stroke-width="1.6"/>
  ${inners}<path d="M91 105 Q100 110 109 105" fill="none" stroke="#FAFCFB" stroke-width="1.6"/>
 </svg>`;
}
function stat(label,value,sub){return `<div class="str728-stat"><small>${e(label)}</small><strong>${e(value)}</strong><span>${e(sub)}</span></div>`;}
function groupTiles(m){return m.groups.map(g=>`<div class="str728-muscle"><span class="str728-muscle-mark" style="background:${tone(g.index)}"></span><span class="str728-name">${e(g.label)}</span><span class="str728-track"><i style="width:${Math.max(0,g.index/m.maximum*100)}%;background:${tone(g.index)}"></i></span><strong>${g.primary} <small>Haupt</small></strong><small>${g.secondary?`+ ${g.secondary} Neben`:''}</small><span class="str728-age">${g.last?`${g.daysSince} T. her`:'ohne Zuordnung'}</span></div>`).join('');}
function ideas(m){
 if(m.knownSets<6)return `<p class="str728-note">Noch zu wenige kategorisierte Sätze für eine Balance-Einschätzung. Erfasst werden können Übungen, deren Garmin-Kategorie im exportierten FIT enthalten ist.</p>`;
 const alerts=m.balance.filter(x=>x.notable);
 return `${alerts.length?alerts.map(b=>`<article class="str728-tip"><div><strong>💡 ${e(b.label)}</strong><p>${e(m.groups.find(x=>x.id===b.under)?.label||'Eine Muskelgruppe')} war in diesem Zeitraum seltener Hauptziel (${b.left} : ${b.right} Sätze). Mögliche Ergänzungen:</p><div class="str728-pills">${b.ideas.map(s=>`<span>${e(s)}</span>`).join('')}</div></div></article>`).join(''):`<p class="str728-note">Bei den ausreichend dokumentierten Gegenpaaren ist derzeit kein sehr deutliches Ungleichgewicht erkennbar. Das ist keine Aussage über Kraft, Belastungsverträglichkeit oder Muskelwachstum.</p>`}
 <p class="str728-note">Hinweise beruhen auf Satzhäufigkeiten, nicht auf gemessener Muskelaktivierung. Übungswahl an Technik, Erfahrung, Beschwerden, Ausrüstung und individuelle Ziele anpassen.</p>`;
}
function activityTable(m){return m.sessions.length?`<details class="str728-detail" open><summary>${m.sessions.length} Krafttrainingseinheiten · Details anzeigen</summary><div class="str728-sessions">${[...m.sessions].reverse().slice(0,40).map(s=>{
 if(s.summaryOnly)return `<section class="str728-session"><header><strong>${e(s.day)} · ${e(s.start.slice(11,16))}</strong><small>CSV-Zusammenfassung · ${s.day===m.today?'Tag noch offen':'Training erfasst'}</small></header><div><span>${e(s.title)} · Übungen unbekannt</span><small>${s.reportedSets===null?'Sätze unbekannt':`${s.reportedSets} Sätze`} · ${s.reportedReps===null?'Wdh. unbekannt':`${s.reportedReps} Wdh.`} · ${Number.isFinite(s.durationMinutes)?`${fmt(s.durationMinutes,1)} Min.`:'Dauer unbekannt'}</small></div><p class="str728-note">Für Muskelgruppen und Einzelgewichte die Original-FIT-Datei dieser Aktivität exportieren.</p></section>`;
 const counts=new Map();for(const x of s.sets||[]){const name=x.exercise||strengthMuscles(x.category).name;const row=counts.get(name)||{name,count:0,reps:[],weights:[]};row.count++;if(x.reps!==null)row.reps.push(x.reps);if(x.weightKg!==null)row.weights.push(x.weightKg);counts.set(name,row);}
 return `<section class="str728-session"><header><strong>${e(s.day)}</strong><small>${setsCount(s)} Sätze${s.day===m.today?' · heutiger Tag noch offen':''}</small></header>${s.reportedSets>setsKnown(s)?`<p class="str728-note">Zusätzlich ${s.reportedSets-setsKnown(s)} Sätze laut CSV, noch ohne FIT-Einzelheiten.</p>`:''}${[...counts.values()].map(v=>`<div><span>${e(v.name)}</span><small>${v.count} Sätze · ${v.reps.length?`${v.reps.join('/')} Wdh.`:'Wdh. unbekannt'} · ${v.weights.length?`${v.weights.map(w=>fmt(w,1)).join('/')} kg`:'Gewicht unbekannt'}</small></div>`).join('')}</section>`;
 }).join('')}</div></details>`:'<p class="str728-note">Noch keine Krafttrainingseinheiten aus Garmin Activities-CSV oder Aktivitäts-FIT importiert.</p>';}
export function strengthInsightsView(state,{range='28',side='front',today=day(new Date())}={}){
 const m=strengthPeriod(state,{range,today}); const groups=m.groups;
 return `<div class="str728-root" aria-label="Compass Krafttraining und Muskelkarte">
 <section class="work-card"><div class="work-heading"><span>💪 Krafttraining · Muscle Map</span><small>Garmin FIT · Activities-CSV · Coach · lokal im Tresor</small></div>
 <div class="str728-toolbar"><div class="str728-ranges" role="group" aria-label="Trainingszeitraum">${Object.entries(ranges).map(([id,label])=>`<button type="button" data-action="str728-range" data-id="${id}" class="${m.range===id?'selected':''}" aria-pressed="${m.range===id}">${label}</button>`).join('')}</div><div class="str728-ranges" role="group" aria-label="Körperansicht">${[['front','Vorne'],['back','Hinten']].map(([id,label])=>`<button type="button" data-action="str728-side" data-id="${id}" class="${side===id?'selected':''}" aria-pressed="${side===id}">${label}</button>`).join('')}</div></div>
 ${m.csvOnly||m.csvExtra?`<p class="str728-csv-note"><strong>✓ Garmin-Krafttraining erkannt:</strong> ${m.csvOnly} CSV-Einheit(en) ohne Übungsdetails${m.csvOnly?` · ${m.csvOnlyWithSets?`${m.csvOnlySets} Sätze${m.csvOnlyWithSets<m.csvOnly?' (teilweise erfasst)':''}`:'Satzanzahl nicht angegeben'} · ${m.csvOnlyWithReps?`${m.csvOnlyReps} Wiederholungen${m.csvOnlyWithReps<m.csvOnly?' (teilweise erfasst)':''}`:'Wiederholungen nicht angegeben'}`:''}${m.csvExtra?` · ${m.csvExtra} weitere Sätze nur aus CSV`:''}. <span>Unbekannte Sätze bleiben offen. Bestätigte Coach-Sätze können die Zuordnung ergänzen.</span></p>`:''}
 ${m.coachSources.coachSets||m.coachSources.pairedSets||m.coachSources.matchedSets?`<p class="str728-note"><strong>Coach + Garmin:</strong> ${m.coachSources.coachSets} bestätigte Coach-Sätze ergänzt · ${m.coachSources.pairedSets} Garmin-Sätze zugeordnet · ${m.coachSources.matchedSets} bereits zugeordnete Übereinstimmungen nicht doppelt gezählt${m.coachSources.unresolvedPairs?` · ${m.coachSources.unresolvedPairs} Sätze bei zeitlich überlappenden Einheiten noch zu prüfen`:``}.</p>`:``}
 <div class="str728-stats">${stat('Trainingstage',m.trainingDays,'im ausgewählten Zeitraum')}${stat('Aktive Sätze',m.activeSets===0&&m.sessions.length>0?'–':m.activeSets,m.activeSets===0&&m.sessions.length>0?'Satzanzahl nicht angegeben':`${m.knownSets} zugeordnet · ${m.unassigned} offen`)}${stat('Dok. Gewichtsvolumen',m.volumeKg===null?'–':fmt(m.volumeKg,1)+' kg',`${m.volumeSets} Sätze mit Zusatzgewicht × Wdh.`)}${stat('Letztes Training',m.latest||'–',m.todayRecorded?'Heute kann noch ergänzt werden':'Garmin + Coach')}</div>
 <div class="str728-visual"><div class="str728-body-panel">${bodySvg(m,side)}<p class="str728-caption">${side==='front'?'Vorderseite':'Rückseite'} · klassifizierte Übungssätze; Farbintensität nach dokumentierten Haupt- und Nebenbeteiligungen</p></div><div class="str728-distribution"><h3>Beanspruchte Gruppen <small>Haupt / unterstützend</small></h3>${groupTiles(m)}<div class="str728-key"><i style="background:#DBE5E1"></i> Keine klassifizierten Sätze <i style="background:#285F76"></i> mehr erfasste Satzbeteiligungen</div></div></div>
 <p class="str728-note"><strong>Wichtig:</strong> Die Muskelzuordnung ist eine nachvollziehbare <em>Heuristik aus FIT-Kategorien und bestätigten Übungszuordnungen</em>, nicht Garmins exakte Muskelkarte und keine direkte Messung von Muskelwachstum. Unbenannte oder nicht eindeutig klassifizierte Übungen bleiben offen – nicht automatisch „untrainiert“.</p>
 </section>
 <section class="work-card"><div class="work-heading"><span>📈 Trainingsrhythmus · einzelne Tagespunkte</span><small>aktive Sätze</small></div>${strengthTrainingDots(m)}</section>
 <section class="work-card"><div class="work-heading"><span>⚖️ Trainingsbalance &amp; Übungsideen</span><small>Vorschläge, keine Vorgaben</small></div>${ideas(m)}</section>
 <section class="work-card"><div class="work-heading"><span>🗓️ Trainingsjournal</span><small>${m.sessions.length} Trainingseinheiten</small></div>${activityTable(m)}<p class="str728-note">Erneute Garmin-Imports ergänzen Einheiten ohne Doppelzählung: Für dieselbe Aktivität werden FIT-Einzelsätze und die CSV-Zusammenfassung anhand des Startzeitpunkts zusammengeführt. An einem noch laufenden Tag gelten alle Ergebnisse als Zwischenstand; Exakt zugeordnete Coach-/Garmin-Satzpaare zählen nicht doppelt; unsichere Überschneidungen bleiben sichtbar.</p></section>
 </div>`;
}
