/** Compass 0.5.77.46 – Weekly Life Intelligence.
 * Every observation comes from an explicit local journal or imported measurement.
 * Week = seven fully elapsed calendar days, starting yesterday and movable back.
 * Empty / old sources are never represented as a measured zero or a live status.
 */
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validDay=s=>DAY.test(s||'')&&Number.isFinite(Date.parse(`${s}T12:00:00Z`))&&new Date(`${s}T12:00:00Z`).toISOString().slice(0,10)===s;
const number=(x,d=0)=>Number.isFinite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:d}):'–';
const euro=n=>Number.isFinite(n)?n.toLocaleString('de-AT',{style:'currency',currency:'EUR'}):'–';
const minutes=m=>Number.isFinite(m)?`${number(m/60,1)} h`:'–';
const localDay=iso=>{const d=new Date(iso);return Number.isFinite(d.getTime())?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:null;};
const dayChange=(d,days)=>{const x=new Date(`${d}T12:00:00Z`);x.setUTCDate(x.getUTCDate()+days);return x.toISOString().slice(0,10);};
const daysBetween=(a,b)=>Math.round((Date.parse(`${a}T12:00:00Z`)-Date.parse(`${b}T12:00:00Z`))/86400000);
const average=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
const coverage=(map,start,end)=>Array.from(map.keys()).filter(d=>d>=start&&d<=end).length;
const latest=map=>[...map.keys()].sort().at(-1)||null;
const short=d=>new Date(`${d}T12:00:00Z`).toLocaleDateString('de-AT',{day:'numeric',month:'short'});
const isoDate=v=>validDay(v)?v:(typeof v==='string'?localDay(v):null);
const eachWeekDay=end=>Array.from({length:7},(_,i)=>dayChange(end,i-6));
const add=(map,day,v)=>{if(!validDay(day)||!Number.isFinite(v))return;map.set(day,(map.get(day)||0)+v);};
const latestText=(source,end,kind='Import')=>!source?`${kind}: keine Daten`:source>end?`${kind}: Stand ${short(source)}`:`${kind}: letzter Wert ${short(source)}${daysBetween(end,source)>6?' · älter als eine Woche':''}`;
export function weeklyPeriod({today,offset=0}={}){
 const target=validDay(today)?today:localDay(new Date());
 const n=Math.max(0,Math.min(104,Math.floor(Number(offset)||0)));
 const end=dayChange(target,-1-n*7),start=dayChange(end,-6);
 return {start,end,previousStart:dayChange(start,-7),previousEnd:dayChange(start,-1),today:target,offset:n,days:eachWeekDay(end)};
}
function observedNights(s){const map=new Map();
 for(const n of s?.healthImports?.garminNights||[]){
  const t=n?.totals||{};const vals=[t.deep,t.light,t.rem];
  if(!validDay(n?.day)||!vals.some(Number.isFinite))continue;
  const sum=vals.reduce((v,x)=>v+(Number.isFinite(x)&&x>=0?x:0),0);
  if(sum>0&&sum<=1440)map.set(n.day,sum);
 }return map;
}
function observedSteps(s){const map=new Map();for(const x of s?.healthImports?.garminFitness||[])if(validDay(x?.day)&&Number.isFinite(x.steps)&&x.steps>=0){const prev=map.get(x.day);if(prev==null||x.steps>prev)map.set(x.day,x.steps);}return map;}
function observedFitdays(s,field){const map=new Map();for(const f of s?.healthImports?.fitdays||[]){const day=isoDate(f?.day)||isoDate(f?.at);const v=f?.[field];if(validDay(day)&&Number.isFinite(v)&&v>0){const old=map.get(day);if(!old||String(f.at||'')>=old.at)map.set(day,{value:v,at:String(f.at||'')});}}return new Map([...map].map(([d,x])=>[d,x.value]));}
function observedNutrition(s){const map=new Map();for(const x of s?.nutritionJournal?.entries||[]){if(x?.deleted||!x?.foodId)continue;const day=isoDate(x.at);if(!validDay(day))continue;map.set(day,(map.get(day)||0)+1);}return map;}
function observedTime(s){const map=new Map(),research=new Map(),family=new Map();
 const quick=(s?.quickWorktime?.sessions||[]).filter(x=>x?.id&&x.start&&x.end).map(x=>({...x,...(s?.timeJournal?.overrides?.[x.id]||{})}));
 const own=(s?.timeJournal?.entries||[]).filter(x=>x?.id);
 const dedup=new Map();for(const x of [...quick,...own])if(!x.deleted&&x.start&&x.end)dedup.set(x.id,x);
 for(const x of dedup.values()){
  const a=new Date(x.start),b=new Date(x.end);if(!Number.isFinite(a.getTime())||!Number.isFinite(b.getTime())||b<=a||b-a>48*3600000)continue;
  // Attribute intervals to each local calendar day they actually overlap.
  let cursor=new Date(a),steps=0;
  while(cursor<b&&steps++<3){const day=localDay(cursor);const midnight=new Date(cursor);midnight.setHours(24,0,0,0);const until=new Date(Math.min(midnight.getTime(),b.getTime()));const mins=(until-cursor)/60000;
   if(mins>0){add(map,day,mins);if(x.category==='family')add(family,day,mins);
    if(/(?:dissertation|doktorat|forschung|research|literaturreview|paper|publikation|promotion)/iu.test(`${x.project||''} ${x.title||''}`))add(research,day,mins);
   }cursor=until;
  }
 }
 return {all:map,research,family};
}
function observedReceipts(s){const map=new Map(),count=new Map();for(const x of s?.receiptJournal?.entries||[]){if(x?.deleted||!validDay(x.date)||!Number.isFinite(x.total)||x.total<0)continue;add(map,x.date,x.total);add(count,x.date,1);}return {values:map,count};}
const windowValues=(map,p)=>p.days.filter(day=>map.has(day)).map(day=>map.get(day));
const previousValues=(map,p)=>eachWeekDay(p.previousEnd).filter(day=>map.has(day)).map(day=>map.get(day));
function series(map,p,{type='average'}={}){
 const values=windowValues(map,p),previous=previousValues(map,p);
 return {points:p.days.map(day=>({day,value:map.has(day)?map.get(day):null})),count:values.length,previousCount:previous.length,
  value:values.length?(type==='sum'?values.reduce((a,b)=>a+b,0):average(values)):null,
  previous:previous.length?(type==='sum'?previous.reduce((a,b)=>a+b,0):average(previous)):null,
  last:latest(map),type};
}
export function weeklyIntelligenceModel(state,{today,offset=0}={}){
 const p=weeklyPeriod({today,offset}),nights=observedNights(state),steps=observedSteps(state),weight=observedFitdays(state,'weightKg'),fat=observedFitdays(state,'bodyFatPct'),nutr=observedNutrition(state),time=observedTime(state),receipts=observedReceipts(state);
 const domains={sleep:series(nights,p),steps:series(steps,p),weight:series(weight,p),fat:series(fat,p),nutrition:series(nutr,p,{type:'sum'}),time:series(time.all,p,{type:'sum'}),research:series(time.research,p,{type:'sum'}),family:series(time.family,p,{type:'sum'}),receipts:series(receipts.values,p,{type:'sum'}),receiptCount:series(receipts.count,p,{type:'sum'})};
 const tasks=Object.values(state?.tasks||{}).filter(t=>t&&!t.completed&&!t.archived&&t.dueDate&&validDay(t.dueDate)&&!state?.projects?.[t.projectId]?.isTemplate);
 const overdue=tasks.filter(t=>t.dueDate<p.today),upcoming=tasks.filter(t=>t.dueDate>=p.today&&t.dueDate<=dayChange(p.today,14)).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||String(a.title).localeCompare(String(b.title),'de'));
 const researchTasks=tasks.filter(t=>t.category==='Forschung'&&t.dueDate<=dayChange(p.today,30));
 const notice=[];
 if(domains.sleep.count===0)notice.push('Für diese Woche liegen keine importierten Schlafwerte vor.');
 else if(domains.sleep.count<4)notice.push(`Schlafvergleich nur mit ${domains.sleep.count} von 7 Nächten – geringe Datenabdeckung.`);
 if(domains.nutrition.count>0)notice.push(`Ernährung an ${domains.nutrition.count} Tagen protokolliert. Fehlende Tage sind keine Fastentage.`);
 if(domains.research.count>0)notice.push(`${minutes(domains.research.value)} ausdrücklich als Forschung/Doktorat dokumentiert.`);
 if(overdue.length)notice.push(`${overdue.length} offene GTD-Frist${overdue.length===1?'':'en'} liegt${overdue.length===1?'':'liegen'} zurück. Das ist eine aktuelle Aufgabenprüfung, keine rückwirkende Wochenmessung.`);
 if(!notice.length)notice.push('Aus den bisher verfügbaren Daten ergibt sich noch keine belastbare Wochenbeobachtung.');
 return {period:p,domains,overdue,upcoming,researchTasks,notice:notice.slice(0,4),sources:{nights:latest(nights),steps:latest(steps),fitdays:latest(weight),nutrition:latest(nutr),time:latest(time.all),receipts:latest(receipts.values)},totalObserved:Object.values(domains).reduce((n,d)=>n+d.count,0)};
}

/** Seven discrete dots aligned to calendar days: never interpolate missing dates. */
export function weeklyDots(series,{name='Messung',unit='',digits=0,color='#397e73',days}={}){
 const points=series?.points||[],observed=points.filter(p=>Number.isFinite(p.value));
 if(!observed.length)return `<p class="weekly746-no-data">Keine protokollierten Werte in dieser Woche.</p>`;
 const W=340,H=104,L=22,R=15,T=18,B=27,values=observed.map(x=>x.value);const lo=Math.min(...values),hi=Math.max(...values),span=(hi-lo)||Math.max(1,Math.abs(hi)*.12),bottom=lo-span*.25,top=hi+span*.25;
 const x=i=>L+i*(W-L-R)/6,y=v=>T+(top-v)/(top-bottom)*(H-T-B);
 const dots=points.map((p,i)=>Number.isFinite(p.value)?`<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="5" fill="${color}" stroke="#fff" stroke-width="1.5" tabindex="0"><title>${esc(short(p.day))}: ${esc(number(p.value,digits))} ${esc(unit)}</title></circle>`:`<circle cx="${x(i).toFixed(1)}" cy="${H-B}" r="2.5" fill="#D4DCD7"><title>${esc(short(p.day))}: kein protokollierter Wert</title></circle>`).join('');
 const labels=points.map((p,i)=>`<text x="${x(i)}" y="${H-7}" text-anchor="middle" font-size="10" fill="#75877e">${esc(p.day.slice(8))}</text>`).join('');
 return `<svg class="weekly746-dots" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(name)}: ${observed.length} gemessene Tage, keine Verbindung über Datenlücken"><line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="#D5E2DB" stroke-width="1"/><line x1="${L}" y1="${T}" x2="${W-R}" y2="${T}" stroke="#EEF1EF" stroke-width="1"/>${dots}${labels}</svg>`;
}
const cover=(s)=>`${s.count}/7 Tage`;
const delta=(s,dec=0)=>s.previous===null||s.value===null?'Kein belastbarer Vorwochenvergleich':s.count<3||s.previousCount<3?'Vorwoche: zu wenige Messungen':`Vorwoche: ${number(s.previous,dec)} · ${s.previousCount}/7 Messtage`;
function card(title,icon,series,{unit='',digits=0,summarize=(v)=>number(v,digits),source='Messungen',plot=true,extra=''}={}){
 return `<article class="weekly746-card"><div class="weekly746-card-title"><span aria-hidden="true">${icon}</span><strong>${esc(title)}</strong><span class="weekly746-coverage">${cover(series)}</span></div><div class="weekly746-value">${series.value===null?'–':esc(summarize(series.value))}</div><div class="weekly746-source">${esc(latestText(series.last,series.points.at(-1)?.day,source))}</div>${plot?weeklyDots(series,{name:title,unit,digits}):''}<div class="weekly746-note">${esc(extra||delta(series,digits))}</div></article>`;
}
const itemLink=t=>`<li><span>${esc(short(t.dueDate))}</span><strong>${esc(t.title||'Ohne Titel')}</strong><small>${esc(t.category||'Aufgabe')}</small></li>`;
export function weeklyIntelligenceView(state,opts={}){
 const m=weeklyIntelligenceModel(state,opts),p=m.period,d=m.domains;
 const complete=date=>short(date);
 const upcoming=m.upcoming.slice(0,5);
 const sources=[['Garmin Schlaf',m.sources.nights],['Garmin Schritte',m.sources.steps],['Fitdays',m.sources.fitdays],['Ernährung',m.sources.nutrition],['Zeitjournal',m.sources.time],['Kassenbons',m.sources.receipts]];
 const taggedTime=d.research.count?`${minutes(d.research.value)} ausdrücklich dokumentiert`:'Keine ausdrücklich als Forschung erfassten Zeitintervalle';
 return `<section class="weekly746-shell" aria-label="Wochenkompass – rückblickende Auswertung">
  <header class="weekly746-heading"><div><p class="weekly746-kicker">COMPASS · WEEKLY LIFE INTELLIGENCE</p><h2>🧭 Dein Wochenkompass</h2><p>Rückblick auf dokumentierte Daten – kein Livezustand. Keine fehlenden Werte als Null ergänzt.</p></div><div class="weekly746-nav"><button type="button" class="secondary-btn" data-action="weekly746-shift" data-id="prev" aria-label="Eine Woche zurück">←</button><span>${esc(complete(p.start))} – ${esc(complete(p.end))}</span><button type="button" class="secondary-btn" data-action="weekly746-shift" data-id="next" ${p.offset===0?'disabled':''} aria-label="Eine Woche vor">→</button><button type="button" class="secondary-btn" data-action="weekly746-current" ${p.offset===0?'disabled':''}>Letzte 7 Tage</button></div></header>
  <div class="weekly746-context"><span>Datengrundlage: letzte vollständig vergangene 7 Tage</span><span>Importdaten können zeitverzögert sein</span><span>Vergleichswerte nur mit erfasster Abdeckung</span></div>
  <div class="weekly746-section-heading"><h3>Körper & Regeneration</h3><span>Messpunkte statt künstlicher Tageswerte</span></div>
  <div class="weekly746-grid">${card('Schlafdauer','🌙',d.sleep,{unit:'min',summarize:v=>minutes(v),source:'Garmin-Schlaf',extra:d.sleep.count?`${cover(d.sleep)} · ${delta(d.sleep,0)}`:'Keine Garmin-Nächte importiert'})}${card('Schritte','🚶',d.steps,{unit:'Schritte',summarize:v=>`${number(v)} Ø/erfasster Tag`,source:'Garmin-Schritte'})}${card('Körpergewicht','⚖️',d.weight,{unit:'kg',digits:1,summarize:v=>`${number(v,1)} kg Ø/Messtag`,source:'Fitdays',extra:'BIA/Wiegedaten schwanken; einzelne Tage nicht als Fett- oder Muskelzuwachs interpretieren.'})}${card('Körperfett (BIA)','◌',d.fat,{unit:'%',digits:1,summarize:v=>`${number(v,1)} % Ø/Messtag`,source:'Fitdays',extra:'Geräteschätzung; Wasserhaushalt und Messbedingungen beeinflussen den Wert.'})}</div>
  <div class="weekly746-section-heading"><h3>Zeit, Forschung & Beziehungen</h3><span>Nur ausdrücklich protokollierte Zeit</span></div>
  <div class="weekly746-grid">${card('Zeitjournal','⏱️',d.time,{unit:'min',summarize:v=>minutes(v),source:'Zeitjournal',extra:'Gesamtdauer der erfassten Intervalle; kein vollständiges 24-h-Zeitbudget.'})}${card('Doktorat / Forschung','🎓',d.research,{unit:'min',summarize:v=>minutes(v),source:'Zeitjournal',extra:taggedTime+' · Erkennung nur über explizite Titel/Projektbezeichnungen.'})}${card('Familie & Beziehungen','❤️',d.family,{unit:'min',summarize:v=>minutes(v),source:'Zeitjournal',extra:'Dokumentierte Familienzeit; Zeit mit deinem Sohn oder deiner Partnerin ist nur mit genauerer Zuordnung getrennt erfassbar.'})}${card('Ernährung protokolliert','🥗',d.nutrition,{unit:'Einträge',summarize:v=>`${number(v)} Einträge`,source:'Ernährungstagebuch',extra:'Nur dokumentierte Einträge. Keine Aussage über vollständige Energieaufnahme.'})}</div>
  <div class="weekly746-section-heading"><h3>Finanzen & Verpflichtungen</h3><span>Bons und GTD getrennt von Banktransaktionen</span></div>
  <div class="weekly746-grid weekly746-finance">${card('Einkäufe mit Kassenbon','🧾',d.receipts,{unit:'€',digits:2,summarize:euro,source:'Bonjournal',extra:`${d.receiptCount.value==null?'Keine Bons für diese Woche importiert':number(d.receiptCount.value)+' Bons für diese Woche importiert'} · keine Aussage über alle Kontobewegungen.`})}<article class="weekly746-card"><div class="weekly746-card-title"><span>🎯</span><strong>Fristen im Blick</strong></div><div class="weekly746-value">${number(m.upcoming.length)} <small>in den nächsten 14 Tagen</small></div><div class="weekly746-source">Aktueller GTD-Aufgabenstand, unabhängig von der Berichtswoche</div>${m.overdue.length?`<p class="weekly746-due">${m.overdue.length} offene überfällige Aufgabe(n)</p>`:''}${upcoming.length?`<ul class="weekly746-deadlines">${upcoming.map(itemLink).join('')}</ul>`:'<p class="weekly746-note">Keine erfassten Fristen im nächsten 14-Tage-Fenster.</p>'}${m.researchTasks.length?`<p class="weekly746-note">${m.researchTasks.length} offene Forschungsfrist(en) innerhalb von 30 Tagen (inkl. überfällige).</p>`:''}</article></div>
  <div class="weekly746-bottom"><section class="weekly746-insight"><h3>Was fällt auf?</h3><ul>${m.notice.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><p>Das sind Beobachtungen, keine Diagnosen oder Ursache-Wirkung-Aussagen. Konsequenzen und Prioritäten bestimmst du.</p></section><section class="weekly746-freshness"><h3>Letzter dokumentierter Datenstand</h3><dl>${sources.map(([name,day])=>`<div><dt>${esc(name)}</dt><dd>${day?esc(complete(day)):'Keine Daten'}</dd></div>`).join('')}</dl><p>Neue Garmin-/Fitdays-Daten erscheinen erst nach deinem Import. Der Wochenkompass behauptet deshalb nicht, deinen heutigen Schlaf oder Energiezustand zu kennen.</p></section></div>
 </section>`;
}
