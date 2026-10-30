/** Compass 0.5.63 – Life Balance Radar.
 * Explicit, inspectable personal reference values; no proprietary health scores, invented
 * measurements, interpolation over missing dates, or implicit relationship assessment.
 * All computations stay client-side; configuration is persisted only in the encrypted vault.
 */
import {sleepMinutes} from './insights.js';
import {joinedFitnessDays} from './insights-fitness.js';
import {financialHealthEvidence} from './financial-health-v5672.js';
import {contactImpulse,preference} from './relationship-radar-v564.js';
import {activeCare,relationshipReview} from './relationship-intelligence-v568.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=x=>Math.max(0,Math.min(100,Math.round(x)));
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const validDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const shift=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const dec=(v,d=0)=>Number(v).toLocaleString('de-AT',{maximumFractionDigits:d});
export const BALANCE_DEFAULTS=Object.freeze({sleepMinutes:480,stepsDaily:8000,weeklyHours:45,weightKg:null,bodyFatTargetPct:null});
export function balanceGoals(value={}){
 const obj=value&&typeof value==='object'?value:{};
 const num=(field,min,max,defaultValue)=>{const n=Number(obj[field]);return obj[field]!==''&&obj[field]!=null&&Number.isFinite(n)&&n>=min&&n<=max?n:defaultValue;};
 return {sleepMinutes:num('sleepMinutes',240,720,480),stepsDaily:num('stepsDaily',1000,30000,8000),weeklyHours:num('weeklyHours',10,80,45),weightKg:num('weightKg',30,300,null),bodyFatTargetPct:num('bodyFatTargetPct',4,65,null)};
}
export function validateBalanceGoals(value){
 for(const [key,min,max] of [['sleepMinutes',240,720],['stepsDaily',1000,30000],['weeklyHours',10,80]]){
  if(!Number.isFinite(Number(value?.[key]))||Number(value[key])<min||Number(value[key])>max)throw Error('Bitte gültige persönliche Zielwerte eingeben.');
 }
 if(value.weightKg!==''&&value.weightKg!=null&&(!Number.isFinite(Number(value.weightKg))||Number(value.weightKg)<30||Number(value.weightKg)>300))throw Error('Gewichtsziel: 30–300 kg oder leer.');
 if(value.bodyFatTargetPct!==''&&value.bodyFatTargetPct!=null&&(!Number.isFinite(Number(value.bodyFatTargetPct))||Number(value.bodyFatTargetPct)<4||Number(value.bodyFatTargetPct)>65))throw Error('Körperfett-Richtwert: 4–65 % oder leer.');
 return {sleepMinutes:Number(value.sleepMinutes),stepsDaily:Number(value.stepsDaily),weeklyHours:Number(value.weeklyHours),weightKg:value.weightKg===''||value.weightKg==null?null:Number(value.weightKg),bodyFatTargetPct:value.bodyFatTargetPct===''||value.bodyFatTargetPct==null?null:Number(value.bodyFatTargetPct)};
}
function axis(key,label,score,detail,hint,tab,insight,observed=0,latest=null){return {key,label,score:score==null?null:clamp(score),detail,hint,tab,insight,observed,latest};}
const recent=(rows,start,today,key='day')=>(Array.isArray(rows)?rows:[]).filter(r=>validDay(r?.[key])&&r[key]>=start&&r[key]<=today);
const freshest=rows=>rows.length?rows.map(r=>r.day).sort().at(-1):null;
/** Independent ledger evidence for the radar. The 12-month forecast deliberately needs
 * reconciled financial patterns and a current opening balance. That standard must not be
 * misreported as 'no bank data' in a historical cashflow indicator.
 * Unreviewed entries are explicitly provisional; known own-account/capital transfers never
 * become income or spending. No live bank balances are inferred.
 */
export function financeRadarEvidence(transactions=[],today='2026-10-20'){
 return financialHealthEvidence({financeTransactions:transactions},today);
}
/** Worktime is imported as individual documented calendar dates. An arbitrary rolling
 * 7-day slice almost always straddles TWO calendar weeks; requiring three rows in
 * each half discards otherwise complete weeks. Use finished ISO weeks instead.
 * The boundary may reach at most six days outside the radar's labeled interval
 * to include the whole preceding week. Unrecorded days are never imputed as zero.
 */
export function workBalanceEvidence(work={}, {start='2026-10-15',today='2026-10-21',period=7,weeklyLimit=45}={}){
 if(!validDay(start)||!validDay(today)||start>today||![7,30].includes(Number(period)))throw Error('Ungültiger Arbeitszeit-Zeitraum.');
 const monday=d=>shift(d,-((new Date(d+'T12:00:00Z').getUTCDay()+6)%7));
 const from=monday(start);
 const all=Array.isArray(work?.days)?work.days:[];
 const groups=new Map();
 for(const row of all){
  if(!validDay(row?.day)||row.day<from||row.day>today||!Number.isFinite(row.hours)||row.hours<0||row.hours>24)continue;
  const key=monday(row.day),days=groups.get(key)||new Map();
  days.set(row.day,row.hours);groups.set(key,days);
 }
 const complete=[...groups].map(([week,days])=>({start:week,end:shift(week,6),count:days.size,hours:[...days.values()].reduce((a,b)=>a+b,0)}))
  .filter(w=>w.end<=today).sort((a,b)=>a.start.localeCompare(b.start));
 const eligible=complete.filter(w=>w.count>=3);
 // A seven-day radar measures one finished week, a 30-day radar their average.
 const used=Number(period)===7?eligible.slice(-1):eligible;
 const recentEnough=used.length&&used.at(-1).end>=shift(today,Number(period)===7?-14:-21);
 const average=recentEnough?mean(used.map(w=>w.hours)):null;
 const observed=[...groups.values()].reduce((n,days)=>n+days.size,0);
 const detail=average!==null?`Ø ${dec(average,1)} h · ${used.length} abgeschlossene ISO-${used.length===1?'Woche':'Wochen'} (${used[0].start}–${used.at(-1).end}; ${used.reduce((n,w)=>n+w.count,0)} dokumentierte Tage)`:
  !all.length?'Keine Arbeitszeitdaten importiert':
  !groups.size?'Keine Arbeitszeit-Einträge im gewählten Zeitraum':
  !eligible.length?`${observed} dokumentierte Tage, aber keine abgeschlossene ISO-Woche mit mindestens 3 Einträgen`:
  'Die letzten ausreichend dokumentierten Wochen liegen zu weit zurück';
 return {score:average===null?null:clamp(100-Math.max(0,average-weeklyLimit)*5),average,detail,observed,weeks:used,latest:used.at(-1)?.end??null};
}
export function buildLifeBalanceRadar(state={}, {today='2026-10-20',period=7,healthDays=[],historicalOnly=false}={}){
 if(!validDay(today)||![7,30].includes(Number(period)))throw Error('Ungültiger Zeitraum des Life Balance Radars.');
 const n=Number(period),start=shift(today,1-n),g=balanceGoals(state.lifeBalanceGoals),data=state.healthImports||{};
 const enough=n===7?3:8;
 const nights=recent(data.garminNights,start,today).map(row=>({...row,value:sleepMinutes(row)})).filter(x=>x.value!=null&&x.value>=120&&x.value<=900);
 const sleepAvg=mean(nights.map(x=>x.value)),sleepFresh=freshest(nights);
 const sleep=axis('sleep','Schlaf',nights.length>=enough&&sleepFresh>=shift(today,-7)?100-Math.min(100,Math.abs(sleepAvg-g.sleepMinutes)/g.sleepMinutes*100):null,
  sleepAvg===null?'Keine auswertbaren Schlafnächte':`Ø ${dec(sleepAvg/60,1)} h · ${nights.length} Nächte`,
  `Abweichung vom persönlichen Richtwert ${dec(g.sleepMinutes/60,1)} h. Keine medizinische Beurteilung.`, 'insights','sleep',nights.length,sleepFresh);
 const movement=joinedFitnessDays(data,healthDays,today,{start,end:today});
 const steps=movement.filter(r=>Number.isFinite(r.steps)&&r.steps>=0),exercise=movement.filter(r=>Number.isFinite(r.exerciseMinutes)&&r.exerciseMinutes>=0);
 const stepsAvg=mean(steps.map(r=>r.steps)),stepsFresh=freshest(steps),exerciseAvg=mean(exercise.map(r=>r.exerciseMinutes));
 const activity=axis('activity','Aktivität',steps.length>=enough&&stepsFresh>=shift(today,-7)?stepsAvg/g.stepsDaily*100:null,
  (stepsAvg===null?'Keine Schritt-Messungen':`Ø ${dec(stepsAvg)} Schritte · ${steps.length} Tage`)+(exerciseAvg===null?'':` · Ø ${dec(exerciseAvg)} Trainingsmin. (Health Connect, ${exercise.length} Tage)`),
  `Anteil des selbst wählbaren Schrittziels ${dec(g.stepsDaily)}. Garmin vor Health Connect, niemals addiert. Health-Connect-Trainingsminuten sind keine Garmin-Intensitätsminuten und fließen nicht zusätzlich in den Schritt-Score ein.`, 'insights','activity',steps.length,stepsFresh);
 const taskList=Object.values(state.tasks||{}).filter(t=>t&&!t.archived&&!t.isTemplate),inbox=Object.values(state.records||{}).filter(r=>r&&!r.deleted&&!r.tags?.includes('dreams'));
 const openTasks=taskList.filter(t=>!t.completed),projects=Object.values(state.projects||{}).filter(p=>p&&p.status==='active'&&p.kind!=='folder'&&!p.isTemplate);
 const stalled=projects.filter(p=>!openTasks.some(t=>t.projectId===p.id&&(t.workflow||'next')==='next')).length;
 const overdue=openTasks.filter(t=>t.dueDate&&t.dueDate<today).length;
 const gtdPresent=!!(taskList.length||inbox.length||projects.length);
 const gtd=axis('gtd','GTD-Klarheit',!historicalOnly&&gtdPresent?100-Math.min(100,inbox.length*7+stalled*12+overdue*9):null,
  gtdPresent?`${inbox.length} Inbox · ${stalled} Projekte ohne Next Action`:'Noch keine Aufgaben-/Projektdaten',
  'Ein organisatorischer Hygiene-Indikator, kein Maß für Leistung oder persönlichen Wert.','review',null,inbox.length+openTasks.length,null);
 const workload=workBalanceEvidence(state.workTime||{},{start,today,period:n,weeklyLimit:g.weeklyHours});
 const work=axis('work','Arbeitsbalance',workload.score,workload.detail,
  `Letzte abgeschlossene, ausreichend dokumentierte ISO-Woche(n) als Referenz. Richtwert ${g.weeklyHours} h/Woche; fehlende Tage werden nicht als Freizeit gezählt. Unter dem Richtwert bedeutet nicht automatisch gute Erholung.`,
  'insights','worktime',workload.observed,workload.latest);
 const byDay=new Map();for(const row of Array.isArray(data.garminWellness)?data.garminWellness:[]){
  const day=typeof row?.at==='string'&&Number.isFinite(Date.parse(row.at))?row.at.slice(0,10):null;
  if(!validDay(day)||day<start||day>today||!Number.isFinite(row.bodyBattery)||row.bodyBattery<0||row.bodyBattery>100)continue;
  const prior=byDay.get(day);byDay.set(day,Math.max(prior??0,row.bodyBattery));
 }
 const battery=[...byDay].map(([day,value])=>({day,value})),batteryAvg=mean(battery.map(x=>x.value));
 const recovery=axis('recovery','Erholung',battery.length>=enough&&freshest(battery)>=shift(today,-7)?batteryAvg:null,
  batteryAvg===null?'Keine Body-Battery-Werte':`Ø Tagesmaximum ${dec(batteryAvg)} · ${battery.length} Tage`,
  'Nur Garmin Body Battery (Geräteindikator), keine diagnostische Erholungsmessung.','insights','energy',battery.length,freshest(battery));
 const fit=recent(data.fitdays,shift(today,-90),today).filter(x=>Number.isFinite(x.weightKg)&&x.weightKg>0).sort((a,b)=>a.day.localeCompare(b.day));
 const weight=fit.at(-1),weightRecent=weight?.day>=shift(today,-45)&&(!historicalOnly||weight.day>=start);
 // Fitdays exports BIA estimates, not a clinical body-fat diagnosis. Show the measured
 // value even without a goal; only map it to 0–100 after explicit user calibration.
 const fat=Number.isFinite(weight?.bodyFatPct)&&weight.bodyFatPct>=1&&weight.bodyFatPct<=75?weight.bodyFatPct:null;
 const fatTarget=Number.isFinite(g.bodyFatTargetPct)?g.bodyFatTargetPct:null;
 const fatScore=weightRecent&&fat!=null&&fatTarget!=null?100-Math.min(100,Math.abs(fat-fatTarget)/fatTarget*100):null;
 const weightScore=weightRecent&&g.weightKg?100-Math.min(100,Math.abs(weight.weightKg-g.weightKg)/g.weightKg*500):null;
 const bodyDetail=weight?`${fat==null?'Körperfett nicht erfasst':dec(fat,1)+' % Körperfett (Fitdays)'} · ${dec(weight.weightKg,1)} kg · ${weight.day}${!weightRecent?' · Messung älter als 45 Tage':''}`:'Keine Fitdays-Messung';
 const body=axis('body','Körper',fatScore??weightScore,
  bodyDetail,
  fatTarget!=null?'Abstand zum selbst festgelegten Körperfett-Richtwert '+dec(fatTarget,1)+' %. Fitdays-BIA ist eine Schätzung, keine Diagnose.':g.weightKg?'Abstand zum selbst festgelegten Gewichtsrichtwert. Fitdays-Werte sind Schätzungen.':'Für einen 0–100-Zielnähe-Score bitte optional einen persönlichen Körperfett- oder Gewichtsrichtwert setzen. Der Messwert selbst wird auch ohne Ziel angezeigt.','insights','body',fit.length,weight?.day||null);
 // The financial signal uses everyday income/expenses, excluding capital transfers.
 // A verified reserve is an independent input; portfolio growth remains descriptive.
 const ledger=!historicalOnly?financialHealthEvidence(state,today):null;
 const financeScore=ledger?.score??null;
 const financeDetail=ledger?.score!=null?
  `Laufender Cashflow${ledger.provisional?' (vorläufig)':''} · ${ledger.monthCount} Monate · Ø Einnahmen ${dec(ledger.incomeMonthly/100)} € · Ø laufende Ausgaben ${dec(ledger.expenseMonthly/100)} €`:
  ledger?.cause||'Keine auswertbare Bankhistorie';
 const financeHint=ledger?.score!=null?
  `${ledger.supported} von ${ledger.total} Buchungen auswertbar; ${ledger.excluded} Eigen-/Anlagetransfers ausgeschlossen, ${ledger.pending} ungeprüft. ${ledger.verifiedBalance?'Bestätigte Tagesreserve enthalten.':'Ohne heute bestätigten Bankbestand keine Reservedeckung.'} Kein Bonitäts- oder Vermögensrating.`:
  'Für einen Finanzindikator sind mindestens zwei geeignete abgeschlossene Monate mit Einnahmen und Ausgaben nötig.';
 const finance=axis('finance','Finanzen',financeScore,financeDetail,financeHint,
  'finance',null,ledger?.monthCount??0,ledger?.latest??null);
 finance.evidence=ledger;
 // The 0.5.64 relationship cadence and pause state are authoritative. A paused
 // contact is excluded; no one is scored for distance or closeness alone.
 const participants=!historicalOnly?Object.values(state.people||{}).filter(p=>activeCare(p)&&!preference(p).paused).map(p=>contactImpulse(p,today)).filter(p=>p.hasHistory):[];
 const due=participants.filter(p=>p.due).length;
 const people=axis('people','Kontakte',participants.length?100-due/participants.length*100:null,
  participants.length?`${participants.length-due} von ${participants.length} im gewünschten Kontaktrhythmus · ${due} Kontaktimpulse fällig`:'Noch keine aktiven Kontaktintervalle mit bestätigtem Verlauf',
  'Relationship Radar 0.5.64: individueller Kontaktrhythmus und Pause/Play berücksichtigt; kein Beziehungsqualitäts- oder Nähe-Score.','people',null,participants.length,null);
 const contactReview=!historicalOnly?relationshipReview(state.people||{},today):null;
 people.evidence={covered:participants.length-due,total:participants.length,due,
  latest:(contactReview?.recent||[]).slice(0,5).map(x=>({person:x.personName,day:x.day,type:x.type})),
  reachOut:(contactReview?.due||[]).slice(0,6).map(x=>({person:x.person?.name||'',days:x.daysSince,threshold:x.threshold})),
  noLog:(contactReview?.forgotten||[]).slice(0,5).map(x=>x.name),
  drift:(contactReview?.drift||[]).map(x=>({person:x.person?.name||'',days:x.daysSince,usual:x.usualDays}))};
 const axes=[sleep,activity,gtd,finance,people,body,recovery,work];
 const known=axes.filter(x=>x.score!=null);
 return {axes,period:n,start,today,goals:g,coverage:known.length,total:axes.length,mean:known.length?Math.round(mean(known.map(x=>x.score))):null};
}
/** Historical overlays only evaluate dated measurements; current tasks, finances and people
 * are deliberately never projected into historical periods. These are not stored snapshots.
 */
export function buildLifeBalanceHistory(state={}, {today='2026-10-20',period=7,healthDays=[],count=2}={}){
 if(!validDay(today)||![7,30].includes(Number(period)))throw Error('Ungültiger Radar-Zeitraum.');
 const n=Number(period),limit=Math.max(0,Math.min(2,Number(count)||0));
 return Array.from({length:limit},(_,i)=>{
  const end=shift(today,-n*(i+1));
  const model=buildLifeBalanceRadar(state,{today:end,period:n,healthDays,historicalOnly:true});
  return {...model,periodIndex:i+1,label:i===0?'Vorperiode':'Davor',color:i===0?'#B7A2F5':'#E8BD73'};
 });
}
const geom=(index,radius)=>{const a=(index/8)*Math.PI*2-Math.PI/2;return [195+Math.cos(a)*radius,195+Math.sin(a)*radius];};
const points=pts=>pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const target=axis=>axis.tab==='insights'?{tab:'insights',insight:axis.insight}:{tab:axis.tab,insight:null};
export function lifeBalanceBand(score){
 if(score==null)return {label:'Nicht bewertbar',color:'#8296a3',className:'missing'};
 if(score<25)return {label:'Großer Zielabstand',color:'#ed8e84',className:'low'};
 if(score<50)return {label:'Deutlicher Abstand',color:'#e9b879',className:'limited'};
 if(score<75)return {label:'Teilweise erreicht',color:'#d8ce83',className:'medium'};
 if(score<90)return {label:'Weitgehend erreicht',color:'#62b77d',className:'good'};
 return {label:'Im Zielbereich',color:'#4ce0dc',className:'top'};
}
const money=c=>Number.isFinite(c)?(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'}):'–';
/** Explain an axis in-place; details never require scrolling below the chart. */
export function balanceAxisInspector(axis,model){
 if(!axis)return `<div class="lbr672-welcome"><span class="lbr672-kicker">DIMENSIONEN VERSTEHEN</span><h3>Wähle einen Bereich</h3><p>Klicke im Radar auf einen Datenpunkt oder einen Namen. Hier erscheinen Messwerte, Richtwert, Berechnung und Datenqualität – direkt neben der Grafik.</p><small>${model.coverage} von ${model.total} Dimensionen bewertet</small></div>`;
 const e=axis.evidence;
 const val=axis.score==null?'Nicht bewertbar':axis.score+' / 100';
 let computation=axis.hint;
 let evidence='Datenbasis: '+(axis.observed||0)+' Beobachtungen'+(axis.latest?' · letzter Stand '+axis.latest:'');
 let breakdown='';
 if(axis.key==='finance'&&e){
  computation=e.scoreMethod;
  evidence=`Bankbuchungen: ${e.supported} / ${e.total} geeignet · ${e.monthCount} vergleichbare Monate${e.provisional?' · vorläufig':''}.`;
  breakdown=`<div class="lbr672-accounting"><div><span>Ø Einnahmen / Monat</span><strong>${money(e.incomeMonthly)}</strong></div><div><span>Ø laufende Ausgaben</span><strong>${money(e.expenseMonthly)}</strong></div><div><span>Cashflow-Teilscore</span><strong>${e.cashflowScore==null?'–':e.cashflowScore+'/100'}</strong></div><div><span>Liquiditätsreserve</span><strong>${e.reserveMonths==null?'Nicht bestätigt':dec(e.reserveMonths,1)+' Monate'}</strong></div><div><span>Beobachtete Vermögensentwicklung</span><strong>${e.wealth.available?money(e.wealth.changeCents):'Keine vergleichbaren Stichtage'}</strong></div></div>
   <p class="lbr672-fine">${e.excluded} Eigen-/Kapitaltransfers ausgeschlossen (davon ${e.excludedBy?.invest||0} Sparen/Anlagen), ${e.pending} ungeprüfte und ${e.unknown} unklar zugeordnete Buchungen. ${e.wealth.available?'Vermögensvergleich '+esc(e.wealth.first)+'–'+esc(e.wealth.last)+': keine Renditeberechnung.':'Noch kein vollständiger Vermögenszeitvergleich.'}</p>`;
 }else if(axis.key==='people'){
  const p=axis.evidence||{};
  computation='Score = Anteil aktiver, selbst gewählter Kontaktziele, deren Rhythmus noch nicht fällig ist. Haushalt, alltägliche Arbeitskontakte, Pausen und Beziehungen ohne Kontaktziel sind ausgeschlossen. Keine Bewertung von Nähe oder Beziehungsqualität.';
  evidence=`${p.covered??0} von ${p.total??0} im gewünschten Rhythmus · ${p.due??0} Kontaktimpulse fällig. Nur ausdrücklich dokumentierte Kontakte zählen.`;
  const list=(xs,formatter)=>xs.map(formatter).join('');
  breakdown=`<div class="lbr568-contact-insights"><h4>Letzte dokumentierte Interaktionen</h4>${p.latest?.length?list(p.latest,x=>`<div class="lbr568-contact-row"><strong>${esc(x.person)}</strong><small>${esc(x.day)} · ${esc(x.type)}</small></div>`):'<p class="lbr672-fine">Noch keine Interaktionen dokumentiert.</p>'}<h4>Wieder einmal melden?</h4>${p.reachOut?.length?list(p.reachOut,x=>`<div class="lbr568-contact-row"><strong>${esc(x.person)}</strong><small>Letzter Kontakt vor ${Number(x.days)||0} Tagen · Wunschintervall etwa ${Number(x.threshold)||0} Tage</small></div>`):'<p class="lbr672-fine">Aktuell kein Kontaktimpuls fällig.</p>'}${p.drift?.length?`<h4>Aus dem Blick geraten?</h4>${list(p.drift,x=>`<div class="lbr568-contact-row"><strong>${esc(x.person)}</strong><small>Letzter Eintrag vor ${Number(x.days)||0} Tagen · davor etwa alle ${Number(x.usual)||0} Tage dokumentiert</small></div>`)}`:''}${p.noLog?.length?`<h4>Noch kein Kontakt dokumentiert</h4>${list(p.noLog,x=>`<div class="lbr568-contact-row"><strong>${esc(x)}</strong><small>Keine dokumentierte Interaktion · keine Aussage darüber, ob ihr euch gesehen habt</small></div>`)}`:''}<p class="lbr672-fine">Fehlende Protokolle beweisen keinen fehlenden Kontakt. Vorschläge sind freiwillig.</p></div>`;
 }else if(axis.key==='gtd'){
  computation='Start bei 100; je offenem Inbox-Eintrag −7, je aktivem Projekt ohne Next Action −12 und je überfälliger Aufgabe −9 Punkte; begrenzt auf 0–100. Nur ein Organisationsindikator.';
 }else if(axis.key==='sleep'){
  computation='100 minus prozentuale Abweichung deiner mittleren Schlafdauer vom selbst gesetzten Schlafziel. Der Vergleich misst nur die Dauer, nicht die gesamte Schlafqualität.';
 }else if(axis.key==='activity'){
  computation='Schritte im betrachteten Zeitraum im Verhältnis zu deinem persönlichen Tagesziel. Trainingsminuten sind eine zusätzliche Information, nicht automatisch Garmin-Intensitätsminuten.';
 }else if(axis.key==='body'){
  computation='Abstand zu deinem optional selbst gesetzten Körperfett- oder Gewichtsrichtwert. Fitdays-BIA-Schätzungen sind keine medizinische Diagnose.';
 }else if(axis.key==='recovery'){
  computation='Durchschnittlicher beobachteter Tageshöchstwert der Garmin Body Battery (0–100); kein medizinisch validierter Erholungsscore.';
 }else if(axis.key==='work'){
  computation='100 minus 5 Punkte je Arbeitsstunde über deinem persönlichen Wochenrichtwert, bezogen auf ausreichend dokumentierte abgeschlossene Kalenderwochen. Kein Wert für Erholung an sich.';
 }
 const dest=target(axis);
 return `<div class="lbr672-explanation" aria-live="polite"><div class="lbr672-panel-head"><span class="lbr672-kicker">DIMENSION VERSTEHEN</span><button type="button" class="lbr672-panel-clear" data-action="balance-select" data-id="" aria-label="Auswahl schließen">×</button></div><h3>${esc(axis.label)}</h3><strong class="lbr672-score">${esc(val)} · ${esc(lifeBalanceBand(axis.score).label)}</strong><p class="lbr672-period">${esc(model.start)} – ${esc(model.today)}</p><div class="lbr672-panel-scroll"><div class="lbr672-stat"><small>BEOBACHTUNG</small><p>${esc(axis.detail)}</p></div><div class="lbr672-stat"><small>DATENQUELLE / ABDECKUNG</small><p>${esc(evidence)}</p></div>${breakdown}<div class="lbr672-stat"><small>WIE WIRD GERECHNET?</small><p>${esc(computation)}</p></div>${axis.hint&&computation!==axis.hint?`<p class="lbr672-fine">${esc(axis.hint)}</p>`:''}</div><button type="button" class="lbr672-deeplink" data-action="balance-drill" data-id="${esc(dest.tab)}" data-step="${esc(dest.insight||'')}">Detailansicht öffnen ↗</button></div>`;
}

export function lifeBalanceRadarView(model,{compact=false,history=[],activeAxis=null}={}){
 const {axes,period,coverage,total}=model,selected=axes.filter(x=>x.score!=null);
 const segments=[25,50,75,100].map(r=>`<polygon points="${points(axes.map((_,i)=>geom(i,r*1.26)))}" fill="none" stroke="#416071" stroke-opacity="${r===100?'.64':'.42'}" stroke-width="1"/>`).join('');
 const ringMarks=[25,50,75,100].map(r=>`<text x="205" y="${(195-r*1.26-4).toFixed(1)}" fill="#9ab3c4" font-size="9" aria-hidden="true">${r}</text>`).join('');
 const spokes=axes.map((_,i)=>{const [x,y]=geom(i,126);return `<line x1="195" y1="195" x2="${x}" y2="${y}" stroke="#527384" stroke-opacity=".43"/>`;}).join('');
 // Do not connect unknown dimensions with polygon edges: each known adjacent pair is independent.
 const lines=axes.map((axis,i)=>{const next=axes[(i+1)%8];if(axis.score==null||next.score==null)return '';const [x,y]=geom(i,axis.score*1.26),[xx,yy]=geom((i+1)%8,next.score*1.26);return `<line x1="${x}" y1="${y}" x2="${xx}" y2="${yy}" stroke="#94E8D4" stroke-width="2.5" stroke-linecap="round"/>`;}).join('');
 const area=selected.length===8?`<polygon points="${points(axes.map((a,i)=>geom(i,a.score*1.26)))}" fill="url(#lbr63area)" stroke="none"/>`:axes.map((axis,i)=>{const next=axes[(i+1)%8];if(axis.score==null||next.score==null)return '';return `<polygon points="195,195 ${points([geom(i,axis.score*1.26),geom((i+1)%8,next.score*1.26)])}" fill="url(#lbr63area)" stroke="none"/>`;}).join('');
 const historicLines=(Array.isArray(history)?history:[]).map((m,h)=>{
  const series=m.axes||[],color=h===0?'#B7A2F5':'#E8BD73';
  // Historical gaps stay gaps, no interpolation, and no current-state proxies.
  const lines=series.map((a,i)=>{const b=series[(i+1)%8];if(a?.score==null||b?.score==null)return '';
   const [x,y]=geom(i,a.score*1.26),[xx,yy]=geom((i+1)%8,b.score*1.26);
   return `<line x1="${x}" y1="${y}" x2="${xx}" y2="${yy}" stroke="${color}" stroke-width="1.8" stroke-opacity=".92" stroke-dasharray="${h===0?'5 4':'2 5'}" stroke-linecap="round"/>`;
  }).join('');
  const dots=series.map((a,i)=>{if(a?.score==null)return '';const [x,y]=geom(i,a.score*1.26);return `<circle cx="${x}" cy="${y}" r="3.4" fill="${color}" stroke="#152836" stroke-width="1.3"><title>${esc(m.label)} (${esc(m.start)} – ${esc(m.today)}): ${esc(a.label)} ${a.score} / 100 · ${esc(a.detail)}</title></circle>`;}).join('');
  return `<g class="lbr63-history-trace" data-history-index="${h+1}" aria-label="${esc(m.label)} ${esc(m.start)} bis ${esc(m.today)}">${lines}${dots}</g>`;
 }).join('');
 const legend=[{label:'Aktuell',color:'#A5F2DB',start:model.start,end:model.today,coverage:model.coverage},...history.map((m,i)=>({label:m.label,color:i===0?'#B7A2F5':'#E8BD73',start:m.start,end:m.today,coverage:m.coverage}))].map((entry,i)=>`<span class="lbr63-temporal-item"><i style="--trace-color:${entry.color};${i?'border-top-style:dashed;':''}"></i><span>${esc(entry.label)}<small>${esc(entry.start)} – ${esc(entry.end)} · ${entry.coverage}/8</small></span></span>`).join('');
 const nodes=axes.map((a,i)=>{const [x,y]=geom(i,a.score==null?126:a.score*1.26);return `<circle data-action="balance-select" data-id="${esc(a.key)}" class="lbr672-chart-node" tabindex="0" role="button" aria-label="${esc(a.label)} Details anzeigen" cx="${x}" cy="${y}" r="${a.score==null?5:7}" fill="${lifeBalanceBand(a.score).color}" stroke="#163345" stroke-width="2"><title>${esc(a.label)}: ${a.score==null?'Keine Bewertung':a.score+' / 100'} · ${esc(a.detail)}</title></circle>`;}).join('');
 const axisLabels=axes.map((a,i)=>{const [x,y]=geom(i,159);return `<text class="lbr672-axis-name" data-action="balance-select" data-id="${esc(a.key)}" x="${x}" y="${y+4}" text-anchor="middle" fill="${a.score==null?'#8097A6':'#CBDCE4'}" font-size="11.5">${esc(a.label)}</text>`;}).join('');
 const details=axes.map(a=>{const band=lifeBalanceBand(a.score);return `<button type="button" class="lbr63-metric ${a.score==null?'lbr63-unknown':''}" data-action="balance-select" data-id="${esc(a.key)}" aria-label="${esc(a.label)} Erklärung anzeigen"><span class="lbr63-dot" style="background:${band.color}"></span><span class="lbr63-metric-title">${esc(a.label)}</span><strong>${a.score==null?'–':a.score+' / 100'}</strong><small>${esc(band.label)} · ${esc(a.detail)}</small></button>`;}).join('');
 const scale=[{from:'0–24',label:'Großer Abstand',score:0},{from:'25–49',label:'Deutlicher Abstand',score:25},{from:'50–74',label:'Teilweise erreicht',score:50},{from:'75–89',label:'Weitgehend erreicht',score:75},{from:'90–100',label:'Im Zielbereich',score:90}];
 const scaleHtml=`<div class="lbr23-scale" aria-label="Orientierende Zielerreichungsskala von null bis hundert">${scale.map(s=>`<div><i style="background:${lifeBalanceBand(s.score).color}"></i><strong>${s.from}</strong><span>${s.label}</span></div>`).join('')}</div><p class="lbr23-caution">Orientierende Zielnähe, keine medizinische oder allgemeine Bewertung deines Lebens. Die acht Dimensionen verwenden unterschiedliche Berechnungen. Fehlende Daten bleiben unbewertet.</p>`;
 const coverageNote=axes.filter(a=>a.score==null).map(a=>`<li><strong>${esc(a.label)}</strong> · ${esc(a.detail)}</li>`).join('');
 return `<section class="lbr63 ${compact?'lbr63-compact':''}" aria-label="Life Balance Radar" data-version="0.5.63">
 <header class="lbr63-top"><div><div class="lbr63-eyebrow">COMPASS · PERSONAL INTELLIGENCE</div><h2>Life Balance Radar</h2><p>${period===7?'Letzte 7 Tage':'Letzte 30 Tage'} · Deine persönlichen Richtwerte</p></div><div class="lbr63-header-actions"><div class="lbr63-period" role="group" aria-label="Zeitraum des Life Balance Radars">${[7,30].map(n=>`<button type="button" class="${period===n?'chosen':''}" data-action="balance-period" data-id="${n}" aria-pressed="${period===n}">${n} T</button>`).join('')}</div><div class="lbr63-history-choose" role="group" aria-label="Vergleich mit früheren Zeiträumen"><span>Zeitspuren</span>${[0,1,2].map(n=>`<button type="button" data-action="balance-history" data-id="${n}" class="${history.length===n?'chosen':''}" aria-pressed="${history.length===n}">${n===0?'Aus':n===1?'2':'3'}</button>`).join('')}</div>${compact?'<button type="button" class="lbr63-details-link" data-action="balance-open">Details ↗</button>':''}</div></header>
 <div class="lbr63-layout"><div class="lbr63-chart"><svg viewBox="-40 -12 470 420" role="group" aria-label="Radar mit acht Achsen; ${coverage} davon mit ausreichender Datengrundlage. Fehlende Werte bleiben offen."><defs><linearGradient id="lbr63area" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#84D9C9" stop-opacity=".30"/><stop offset="1" stop-color="#829DE0" stop-opacity=".05"/></linearGradient><radialGradient id="lbr63halo"><stop stop-color="#2D7E85" stop-opacity=".22"/><stop offset="1" stop-color="#122132" stop-opacity="0"/></radialGradient></defs><circle cx="195" cy="195" r="166" fill="url(#lbr63halo)"/>${segments}${spokes}${ringMarks}${historicLines}${area}${lines}${nodes}${axisLabels}<circle cx="195" cy="195" r="2.3" fill="#8099A9"/></svg><div class="lbr63-temporal-legend" aria-label="Verglichene Zeiträume">${legend}</div>${scaleHtml}</div>
 <aside class="lbr63-aside lbr672-side-panel">${compact?`<div class="lbr63-coverage"><span>VERFÜGBARE DIMENSIONEN</span><strong>${coverage}<small> / ${total}</small></strong></div>`:balanceAxisInspector(axes.find(a=>a.key===activeAxis),model)}</aside></div>
 ${compact?`<div class="lbr63-compact-bottom"><p class="lbr63-note">${coverage} von ${total} Bereichen auswertbar · Fehlende Werte werden nicht geschätzt.</p>${coverageNote?`<details class="lbr63-coverage-help"><summary>Warum fehlen ${total-coverage} Werte?</summary><ul>${coverageNote}</ul></details>`:''}</div>`:`<nav class="lbr672-dimensions" aria-label="Radar-Dimension wählen">${axes.map(a=>`<button type="button" data-action="balance-select" data-id="${esc(a.key)}" class="${a.key===activeAxis?'is-active':''}" aria-pressed="${a.key===activeAxis}">${esc(a.label)}</button>`).join('')}</nav><details class="lbr63-goals"><summary>Persönliche Richtwerte anpassen</summary><form id="lbr63-goals-form"><label>Schlafziel (Stunden)<input name="sleepHours" type="number" min="4" max="12" step="0.25" value="${model.goals.sleepMinutes/60}" required></label><label>Schrittziel / Tag<input name="stepsDaily" type="number" min="1000" max="30000" step="100" value="${model.goals.stepsDaily}" required></label><label>Arbeitszeit-Grenzwert / Woche (h)<input name="weeklyHours" type="number" min="10" max="80" step="0.5" value="${model.goals.weeklyHours}" required></label><label>Optional: Gewichtsrichtwert (kg)<input name="weightKg" type="number" min="30" max="300" step="0.1" placeholder="Kein Ziel gesetzt" value="${model.goals.weightKg??''}"></label><label>Optional: persönlicher Körperfett-Richtwert (%)<input name="bodyFatTargetPct" type="number" min="4" max="65" step="0.1" placeholder="Kein Ziel gesetzt" value="${model.goals.bodyFatTargetPct??''}"></label><button class="primary-btn" type="submit">Richtwerte speichern</button></form><p>Fitdays-Körperfett wird als Messwert angezeigt. Ein 0–100-Zielnähe-Score entsteht nur, wenn du persönlich einen Körperfett- oder Gewichtsrichtwert festlegst. Das ist keine medizinische Einstufung. Kontakte verwenden die selbst gewählten Rhythmen aus dem Relationship Radar; Pausen werden respektiert.</p></details><p class="lbr63-note">Vergleichslinien beruhen ausschließlich auf historischen Messwerten: GTD, Kontakte und aktuelle Cashflow-Deckung besitzen ohne gespeicherte Vergangenheit keine rückwirkenden Scores. Scores beschreiben deine Zielnähe im angegebenen Zeitraum. Unterschiedliche Datenquellen und Skalen sind nicht medizinisch oder wissenschaftlich gleichwertig. Garmin-Werte sind Geräteindikatoren; Liquidität beruht auf Schätzungen. Öffne jede Dimension für ihre zugrunde liegenden Daten.</p>`}
 </section>`;
}
