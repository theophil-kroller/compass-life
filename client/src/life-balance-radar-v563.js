/** Compass 0.5.63 – Life Balance Radar.
 * Explicit, inspectable personal reference values; no proprietary health scores, invented
 * measurements, interpolation over missing dates, or implicit relationship assessment.
 * All computations stay client-side; configuration is persisted only in the encrypted vault.
 */
import {sleepMinutes} from './insights.js';
import {joinedFitnessDays} from './insights-fitness.js';
import {cashflowModel} from './finance-cashflow-v560.js';
import {contactImpulse,preference} from './relationship-radar-v564.js';

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
export function financeRadarEvidence(transactions=[], today='2026-10-20'){
 const rows=Array.isArray(transactions)?transactions:[];
 const earliest=cashflowMonthForRadar(today,-36), current=today.slice(0,7);
 const groups=new Map();let supported=0,pending=0,invalid=0,excluded=0;
 const ownTransfer=new Set(['Transfer / Eigene Konten','Transfer / Kreditkartenabrechnung','Transfer / Sparen','Transfer / Krypto','Transfer / Depot & Wertpapiere']);
 for(const tx of rows){
  const day=String(tx?.day||''),cents=tx?.amountCents;
  if(!validDay(day)||day>today||!Number.isSafeInteger(cents)||!cents||tx?.currency&&tx.currency!=='EUR'){invalid++;continue;}
  const month=day.slice(0,7);
  if(month<earliest||month>=current)continue; // closed months only; never partial current month
  if(tx.linkedTransferId||ownTransfer.has(tx.category)||tx.flow==='transfer'&&tx.category!=='Transfer / Private Überweisung'){
   excluded++;continue;
  }
  if(tx.flow==='income'&&cents<0||tx.flow==='expense'&&cents>0){invalid++;continue;}
  const item=groups.get(month)||{month,income:0,expense:0,rows:0,pending:0};
  if(cents>0)item.income+=cents;else item.expense+=-cents;
  item.rows++;supported++;
  if(tx.needsReview){pending++;item.pending++;}
  groups.set(month,item);
 }
 const complete=[...groups.values()].filter(x=>x.income>0&&x.expense>0).sort((a,b)=>a.month.localeCompare(b.month)).slice(-12);
 const monthCount=complete.length;
 const income=complete.reduce((a,x)=>a+x.income,0);
 const expense=complete.reduce((a,x)=>a+x.expense,0);
 const provisional=monthCount<3||complete.some(x=>x.pending>0);
 const newest=[...groups.keys()].sort().at(-1)||null;
 const late=!!newest&&newest<cashflowMonthForRadar(today,-12);
 // At least two paired bank months support a *provisional* historical cashflow.
 // It is not a solvency, wealth or credit score; fresh individual balances remain unknown.
 const score=monthCount>=2&&income>0&&expense>0&&!late?clamp(50+250*(income-expense)/income):null;
 const cause=!rows.length?'Noch keine Bankbuchungen importiert':
  !supported?'Bankbuchungen vorhanden, aber keine geeigneten abgeschlossenen EUR-Monate im Betrachtungsfenster':
  late?'Letzter auswertbarer Monat liegt mehr als zwölf Monate zurück':
  monthCount<2?`${supported} auswertbare Buchungen von ${rows.length} insgesamt, jedoch nur ${monthCount} Monate mit Ein- und Ausgängen (mindestens 2 benötigt). ${excluded} Eigen-/Kapitaltransfers ausgeschlossen, ${invalid} unlesbar oder ohne EUR-Betrag.`:null;
 return {score,monthCount,income,expense,supported,pending,excluded,invalid,latest:newest,provisional,cause,source:'Bankbuchungen'};
}
function cashflowMonthForRadar(today,offset){const [y,m]=today.slice(0,7).split('-').map(Number);return new Date(Date.UTC(y,m-1+offset,1)).toISOString().slice(0,7);}
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
 const wRows=recent(state.workTime?.days,start,today).filter(r=>Number.isFinite(r.hours)&&r.hours>=0&&r.hours<=24);
 // Assess documented seven-day chunks instead of treating holidays or missing days as zero work.
 const weeklyGroups=new Map();for(const row of wRows){const day=new Date(row.day+'T12:00:00Z');const monday=shift(row.day,-((day.getUTCDay()+6)%7));const group=weeklyGroups.get(monday)||[];group.push(row);weeklyGroups.set(monday,group);}
 const weeks=[...weeklyGroups.values()].filter(r=>r.length>=3).map(rows=>({hours:rows.reduce((s,x)=>s+x.hours,0),day:freshest(rows)}));
 const averageHours=mean(weeks.map(x=>x.hours));
 const work=axis('work','Arbeitsbalance',weeks.length&&freshest(wRows)>=shift(today,-14)?100-Math.max(0,averageHours-g.weeklyHours)*5:null,
  averageHours===null?'Keine ausreichenden Wochenprotokolle':`Ø ${dec(averageHours,1)} h · ${weeks.length} erfasste Wochen`,
  `Wöchentlicher Grenzwert ${g.weeklyHours} h. Unter dem Grenzwert bedeutet nicht automatisch gute Erholung.`, 'insights','worktime',wRows.length,freshest(wRows));
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
 // Two distinct questions: historical cashflow coverage can be scored from imported
 // income/outflows; current solvency REQUIRES a manually confirmed today's cash balance.
 // We never pretend the first indicator proves the second.
 let financial=null,financeError=null;
 try{if(!historicalOnly&&state.financeTransactions?.length){financial=cashflowModel({transactions:state.financeTransactions,settings:state.financeCashflowSettings||{},planned:state.financePlannedCashflows||[],recurringRules:state.financeRecurringRules||{},today});}}
 catch(err){financeError=String(err?.message||err||'Berechnung fehlgeschlagen').slice(0,130);}
 const complete=(financial?.recent||[]).filter(r=>r.rows>0&&r.income>0&&r.spent>0);
 const inflow=complete.length>=3?financial.monthlyIncome:null;
 const outflow=complete.length>=3?financial.monthlyExpense:null;
 const ready=!historicalOnly&&inflow>0&&outflow>0;
 const ledger=!historicalOnly?financeRadarEvidence(state.financeTransactions||[],today):null;
 const financeScore=ready?clamp(50+250*(inflow-outflow)/inflow):ledger?.score??null;
 const financeMonths=ready?complete.length:ledger?.monthCount||0;
 const financeDetail=ready?`Historischer Cashflow · Ø Einnahmenbasis ${dec(inflow/100)} € · Ø Ausgaben ${dec(outflow/100)} € · ${financeMonths} Monate`:
  ledger?.score!=null?`Historischer Bank-Cashflow${ledger.provisional?' (vorläufig; geringe Abdeckung oder ungeprüfte Buchungen)':''} · ${financeMonths} Monate · ${ledger.latest} · ${ledger.supported} von ${(state.financeTransactions||[]).length} Buchungen`:
  ledger?.cause||'Keine auswertbare Bankhistorie';
 const finance=axis('finance','Finanzen',financeScore,
  financeDetail,
  'Cashflow-Indikator aus importierten Bankbewegungen, keine Vermögens- oder Liquiditätsdiagnose. Datenbasis und Monatsabdeckung bei den Finanzdetails prüfen. '+(ledger?.pending?`${ledger.pending} Buchungen ungeprüft. `:'')+(financeError?`Prognosemodul: ${financeError}. `:'')+(financial?.opening==null?'Ohne heute bestätigten Bankbestand keine Aussage zur aktuellen Zahlungsfähigkeit.':'Die tatsächliche Liquiditätsprognose findest du unter Finanzen.'),
  'finance',null,financeMonths,ready?complete.at(-1)?.month:ledger?.latest||null);
 // The 0.5.64 relationship cadence and pause state are authoritative. A paused
 // contact is excluded; no one is scored for distance or closeness alone.
 const participants=!historicalOnly?Object.values(state.people||{}).filter(p=>preference(p).cadence>0&&!preference(p).paused).map(p=>contactImpulse(p,today)).filter(p=>p.hasHistory):[];
 const due=participants.filter(p=>p.due).length;
 const people=axis('people','Kontakte',participants.length?100-due/participants.length*100:null,
  participants.length?`${due} von ${participants.length} selbst gewählten Kontaktintervallen erreicht`:'Noch keine aktiven Kontaktintervalle mit bestätigtem Verlauf',
  'Relationship Radar 0.5.64: individueller Kontaktrhythmus und Pause/Play berücksichtigt; kein Beziehungsqualitäts- oder Nähe-Score.','people',null,participants.length,null);
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
export function lifeBalanceRadarView(model,{compact=false,history=[]}={}){
 const {axes,period,coverage,total}=model,selected=axes.filter(x=>x.score!=null);
 const segments=[25,50,75,100].map(r=>`<polygon points="${points(axes.map((_,i)=>geom(i,r*1.26)))}" fill="none" stroke="#416071" stroke-opacity="${r===100?'.64':'.42'}" stroke-width="1"/>`).join('');
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
 const nodes=axes.map((a,i)=>{const [x,y]=geom(i,a.score==null?126:a.score*1.26);return `<circle cx="${x}" cy="${y}" r="${a.score==null?3.2:5}" fill="${a.score==null?'#6F8896':'#A5F2DB'}" stroke="#163345" stroke-width="2"><title>${esc(a.label)}: ${a.score==null?'Keine Bewertung':a.score+' / 100'} · ${esc(a.detail)}</title></circle>`;}).join('');
 const axisLabels=axes.map((a,i)=>{const [x,y]=geom(i,159);return `<text x="${x}" y="${y+4}" text-anchor="middle" fill="${a.score==null?'#8097A6':'#CBDCE4'}" font-size="11.5">${esc(a.label)}</text>`;}).join('');
 const details=axes.map(a=>{const destination=target(a);return `<button type="button" class="lbr63-metric ${a.score==null?'lbr63-unknown':''}" data-action="balance-drill" data-id="${esc(destination.tab)}" data-step="${esc(destination.insight||'')}" aria-label="${esc(a.label)} Details öffnen"><span class="lbr63-dot"></span><span class="lbr63-metric-title">${esc(a.label)}</span><strong>${a.score==null?'–':a.score+' / 100'}</strong><small>${esc(a.detail)}</small></button>`;}).join('');
 const coverageNote=axes.filter(a=>a.score==null).map(a=>`<li><strong>${esc(a.label)}</strong> · ${esc(a.detail)}</li>`).join('');
 return `<section class="lbr63 ${compact?'lbr63-compact':''}" aria-label="Life Balance Radar" data-version="0.5.63">
 <header class="lbr63-top"><div><div class="lbr63-eyebrow">COMPASS · PERSONAL INTELLIGENCE</div><h2>Life Balance Radar</h2><p>${period===7?'Letzte 7 Tage':'Letzte 30 Tage'} · Deine persönlichen Richtwerte</p></div><div class="lbr63-header-actions"><div class="lbr63-period" role="group" aria-label="Zeitraum des Life Balance Radars">${[7,30].map(n=>`<button type="button" class="${period===n?'chosen':''}" data-action="balance-period" data-id="${n}" aria-pressed="${period===n}">${n} T</button>`).join('')}</div><div class="lbr63-history-choose" role="group" aria-label="Vergleich mit früheren Zeiträumen"><span>Zeitspuren</span>${[0,1,2].map(n=>`<button type="button" data-action="balance-history" data-id="${n}" class="${history.length===n?'chosen':''}" aria-pressed="${history.length===n}">${n===0?'Aus':n===1?'2':'3'}</button>`).join('')}</div>${compact?'<button type="button" class="lbr63-details-link" data-action="balance-open">Details ↗</button>':''}</div></header>
 <div class="lbr63-layout"><div class="lbr63-chart"><svg viewBox="0 0 390 390" role="img" aria-label="Radar mit acht Achsen; ${coverage} davon mit ausreichender Datengrundlage. Fehlende Werte bleiben offen."><defs><linearGradient id="lbr63area" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#84D9C9" stop-opacity=".30"/><stop offset="1" stop-color="#829DE0" stop-opacity=".05"/></linearGradient><radialGradient id="lbr63halo"><stop stop-color="#2D7E85" stop-opacity=".22"/><stop offset="1" stop-color="#122132" stop-opacity="0"/></radialGradient></defs><circle cx="195" cy="195" r="166" fill="url(#lbr63halo)"/>${segments}${spokes}${historicLines}${area}${lines}${nodes}${axisLabels}<circle cx="195" cy="195" r="2.3" fill="#8099A9"/></svg><div class="lbr63-temporal-legend" aria-label="Verglichene Zeiträume">${legend}</div></div>
 <div class="lbr63-aside"><div class="lbr63-coverage"><span>VERFÜGBARE DIMENSIONEN</span><strong>${coverage}<small> / ${total}</small></strong><p>${coverage<8?'Unvollständige Achsen bleiben bewusst offen.':'Alle acht Bereiche haben aktuelle, ausreichend belastbare Indikatoren.'}</p></div><div class="lbr63-key"><i></i> Beobachteter Zielerfüllungswert <span></span> Unbewerteter Bereich</div>${!compact?`<div class="lbr63-aside-note">Hohe Werte bedeuten Nähe zu einem Richtwert, nicht automatisch Gesundheit oder Wohlbefinden. Ein Gesamtscore wird bewusst nicht gebildet.</div>`:''}</div></div>
 ${compact?`<div class="lbr63-compact-bottom"><p class="lbr63-note">${coverage} von ${total} Bereichen auswertbar · Fehlende Werte werden nicht geschätzt.</p>${coverageNote?`<details class="lbr63-coverage-help"><summary>Warum fehlen ${total-coverage} Werte?</summary><ul>${coverageNote}</ul></details>`:''}</div>`:`<div class="lbr63-list" aria-label="Bereichsdetails">${details}</div><details class="lbr63-goals"><summary>Persönliche Richtwerte anpassen</summary><form id="lbr63-goals-form"><label>Schlafziel (Stunden)<input name="sleepHours" type="number" min="4" max="12" step="0.25" value="${model.goals.sleepMinutes/60}" required></label><label>Schrittziel / Tag<input name="stepsDaily" type="number" min="1000" max="30000" step="100" value="${model.goals.stepsDaily}" required></label><label>Arbeitszeit-Grenzwert / Woche (h)<input name="weeklyHours" type="number" min="10" max="80" step="0.5" value="${model.goals.weeklyHours}" required></label><label>Optional: Gewichtsrichtwert (kg)<input name="weightKg" type="number" min="30" max="300" step="0.1" placeholder="Kein Ziel gesetzt" value="${model.goals.weightKg??''}"></label><label>Optional: persönlicher Körperfett-Richtwert (%)<input name="bodyFatTargetPct" type="number" min="4" max="65" step="0.1" placeholder="Kein Ziel gesetzt" value="${model.goals.bodyFatTargetPct??''}"></label><button class="primary-btn" type="submit">Richtwerte speichern</button></form><p>Fitdays-Körperfett wird als Messwert angezeigt. Ein 0–100-Zielnähe-Score entsteht nur, wenn du persönlich einen Körperfett- oder Gewichtsrichtwert festlegst. Das ist keine medizinische Einstufung. Kontakte verwenden die selbst gewählten Rhythmen aus dem Relationship Radar; Pausen werden respektiert.</p></details><p class="lbr63-note">Vergleichslinien beruhen ausschließlich auf historischen Messwerten: GTD, Kontakte und aktuelle Cashflow-Deckung besitzen ohne gespeicherte Vergangenheit keine rückwirkenden Scores. Scores beschreiben deine Zielnähe im angegebenen Zeitraum. Unterschiedliche Datenquellen und Skalen sind nicht medizinisch oder wissenschaftlich gleichwertig. Garmin-Werte sind Geräteindikatoren; Liquidität beruht auf Schätzungen. Öffne jede Dimension für ihre zugrunde liegenden Daten.</p>`}
 </section>`;
}
