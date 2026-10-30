/** Compass Life Report 0.5.77.59.40.18 – read-only, print-to-PDF, local-first.
 * Never stores decrypted report content, uploads it to a PDF server, or imputes absent data.
 * SVGs are rendered by the SAME existing Insights functions as the dashboard.
 */
import {buildLifeBalanceRadar,buildLifeBalanceHistory,lifeBalanceRadarView} from './life-balance-radar-v563.js';
import {renderSleepYearDistribution} from './sleep-year-v552.js';
import {nutritionTimingView} from './nutrition-timing-v57725.js';
import {nutritionTrendsView} from './nutrition-trends-v57726.js';
import {financeViewModel} from './finance-core.js';
import {expenseSankey} from './finance-dashboard.js';
import {hierarchicalSankey} from './finance-exotic-hierarchy.js';
import {placesInsightsView,placeClusters} from './insights-places.js';
import {dailyDozen5930} from './daily-dozen-v5775930.js';
import {nutritionDay} from './nutrition-intelligence-v57712.js';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY=/^\d{4}-\d\d-\d\d$/;
const iso=x=>{if(typeof x!=='string')return '';const d=x.slice(0,10);return DAY.test(d)&&Number.isFinite(Date.parse(d+'T12:00:00Z'))?d:'';};
const onDate=d=>Date.parse(d+'T12:00:00Z');
const round=(x,p=1)=>Number(x.toFixed(p));
const fmt=x=>Number(x).toLocaleString('de-AT',{maximumFractionDigits:1});
const periodDays={month:30,quarter:90,half:180,threequarters:270,year:365};
export const REPORT_PERIODS=Object.freeze(periodDays);
export function reportWindow(now='2026-10-28',period='year'){
 const end=iso(now)||new Date().toISOString().slice(0,10),days=periodDays[period]||365;
 const start=new Date(onDate(end)-(days-1)*86400000).toISOString().slice(0,10);
 return {start,end,days,period:Object.hasOwn(periodDays,period)?period:'year'};
}
const dated=(rows,field='day')=>(Array.isArray(rows)?rows:[]).filter(x=>x&&iso(x[field]||x.at||x.start)).map(x=>({...x,__day:iso(x[field]||x.at||x.start)}));
const inWindow=(day,w)=>day>=w.start&&day<=w.end;
const within=(rows,w,field='day')=>dated(rows,field).filter(x=>inWindow(x.__day,w));
function quality(label,rows,w,{required=false,staleDays=14,field='day',note=''}={}){
 const eligible=within(rows,w,field),all=dated(rows,field),last=all.reduce((p,x)=>x.__day>p?x.__day:p,'');
 const age=last?Math.floor((onDate(w.end)-onDate(last))/86400000):null;
 const stale=age===null||age>staleDays||age<0;
 return {id:label,label,count:eligible.length,last:last||null,age,stale,required,note};
}
export function reportReadiness(state={},settings={}){
 const w=reportWindow(settings.now||new Date().toISOString().slice(0,10),settings.period);
 const h=state.healthImports||{};
 const rows=[
  quality('Garmin Schlaf',h.garminNights,w,{staleDays:3,note:'Nur bereits importierte Nächte; kein Live-Zugriff auf Garmin Connect.'}),
  quality('Garmin HRV',h.garminHrv,w,{staleDays:4,note:'Fehlende Tage werden nicht interpoliert.'}),
  quality('Garmin Stress',h.garminWellness,w,{staleDays:4,field:'at'}),
  quality('Fitdays',h.fitdays,w,{staleDays:30,field:'at',note:'Nur gespeicherte Messungen.'}),
  quality('Ernährung',state.nutritionJournal?.entries,w,{staleDays:7,field:'at',note:'Fehlende Einträge sind nicht automatisch Fastentage.'})
 ];
 if(settings.finance)rows.push(quality('Finanzen',state.financeTransactions,w,{staleDays:45,field:'day',note:'Konten und ungeklärte Buchungen können unvollständig sein.'}));
 if(settings.places)rows.push(quality('Standorte',state.placesVisits,w,{staleDays:60,field:'start',note:'Google Timeline ist ein manueller Import; kein kontinuierliches GPS-Protokoll.'}));
 return {window:w,sources:rows,stale:rows.filter(x=>x.stale),ready:rows.some(x=>x.count>0),checkedAt:new Date().toISOString()};
}
function nightMinutes(n){
 const value=Number(n?.sleepMinutes);
 if(Number.isFinite(value)&&value>0&&value<=1440)return value;
 const t=n?.totals||{};
 const parts=['deep','light','rem'];
 return parts.every(k=>Number.isFinite(t[k]))?parts.reduce((a,k)=>a+t[k],0):null;
}
function samples(state,w){
 const h=state.healthImports||{};
 const sleep=within(h.garminNights,w).map(x=>({day:x.__day,value:nightMinutes(x)})).filter(x=>x.value!==null);
 const hrv=within(h.garminHrv,w).map(x=>({day:x.__day,value:Number(x.nightAverageMs)})).filter(x=>x.value>0&&x.value<500);
 const stress=within(h.garminWellness,w,'at').map(x=>({day:x.__day,value:Number(x.stress)})).filter(x=>Number.isFinite(x.value)&&x.value>=0&&x.value<=100);
 const body=within(h.fitdays,w,'at').map(x=>({day:x.__day,value:Number(x.weightKg)})).filter(x=>x.value>=20&&x.value<=400);
 return {sleep,hrv,stress,body};
}
const mean=a=>a.length?a.reduce((s,n)=>s+n,0)/a.length:null;
function dailyMean(rows){const m=new Map();for(const x of rows){const l=m.get(x.day)||[];l.push(x.value);m.set(x.day,l);}return new Map([...m].map(([day,x])=>[day,mean(x)]));}
export function pairedCorrelation(left,right,{minPairs=20,lagDays=0}={}){
 const l=dailyMean(left),r=dailyMean(right),paired=[];
 for(const [day,v] of l){const target=new Date(onDate(day)+lagDays*86400000).toISOString().slice(0,10);if(r.has(target))paired.push([v,r.get(target)]);}
 if(paired.length<minPairs)return {n:paired.length,r:null,lagDays,valid:false};
 const av=mean(paired.map(x=>x[0])),bv=mean(paired.map(x=>x[1]));
 const a=paired.reduce((s,p)=>s+(p[0]-av)*(p[1]-bv),0),b=paired.reduce((s,p)=>s+(p[0]-av)**2,0),c=paired.reduce((s,p)=>s+(p[1]-bv)**2,0);
 const corr=b>0&&c>0?a/Math.sqrt(b*c):null;
 return {n:paired.length,r:corr===null?null:round(corr,2),lagDays,valid:corr!==null};
}
export function reportEvidence(state={},settings={}){
 const w=reportWindow(settings.now||new Date().toISOString().slice(0,10),settings.period),m=samples(state,w),facts=[];
 const add=(id,text,detail)=>facts.push({id,text,detail});
 if(m.sleep.length){const minutes=mean(m.sleep.map(x=>x.value));add('sleep',`${m.sleep.length} erfasste Nächte; mittlere dokumentierte Schlafdauer ${Math.floor(minutes/60)} h ${String(Math.round(minutes%60)).padStart(2,'0')} min.`,`${m.sleep.length}/${w.days} Kalendertage mit Schlafwerten`);}
 if(m.hrv.length)add('hrv',`${m.hrv.length} HRV-Nächte im Berichtszeitraum; Mittelwert ${fmt(round(mean(m.hrv.map(x=>x.value))))} ms.`,`${m.hrv.length} gemessene Tage, keine klinische Interpretation`);
 if(m.body.length){const sorted=m.body.slice().sort((a,b)=>a.day.localeCompare(b.day));if(sorted.length>1)add('weight',`Gewicht vom ersten zum letzten Messpunkt: ${fmt(sorted[0].value)} auf ${fmt(sorted.at(-1).value)} kg.`,`${sorted.length} Messpunkte; kein Rückschluss auf Ursachen`);}
 const entries=within(state.nutritionJournal?.entries,w,'at').filter(x=>!x.deleted);
 if(entries.length)add('nutrition',`${entries.length} dokumentierte Ernährungs- und Getränkeeinträge in diesem Zeitraum.`,`Die Anzahl der Einträge misst nicht die Vollständigkeit der Ernährung.`);
 const corr=pairedCorrelation(m.sleep,m.hrv);
 if(corr.valid)add('correlation',`Schlafdauer und nächtliche HRV: beobachteter Pearson-Zusammenhang r = ${fmt(corr.r)} bei ${corr.n} gepaarten Tagen.`,`Deskriptive Korrelation, keine Kausalität; keine Kontrolle für Drittvariablen.`);
 if(settings.finance){const tx=within(state.financeTransactions,w),vm=financeViewModel(tx,'all');if(tx.length)add('finance',`${tx.length} Finanzbuchungen im Zeitraum; bestätigte Konsumausgaben ${fmt(vm.expenseCents/100)} €; ${vm.pending.length} ungeklärte Buchungen.`,`Nicht alle Konten oder Buchungsarten müssen abgedeckt sein. Transfers sind kein Konsum.`);}
 if(settings.places){const visits=within(state.placesVisits,w,'start');const clusters=placeClusters(state.placesVisits||[],state.placesLabels||{},w);if(clusters.length)add('places',`${clusters.length} dokumentierte Aufenthaltsgruppen auf Basis von ${visits.length} im Berichtsfenster beginnenden Aufenthalten.`,`Gruppen ca. 25 km; Lücken sind unbekannt, nicht unbewegte Tage. Keine lückenlose Reiseroute.`);}
 return {window:w,facts,correlations:[{kind:'sleep-hrv',...corr}],coverage:{sleep:m.sleep.length,hrv:m.hrv.length,stress:m.stress.length,fitdays:m.body.length,nutrition:entries.length}};
}
/** Traceable, read-only suggestions. Every implication is limited to the logged dataset.
 * Do not classify missed logs as missed intake, or incomplete transactions as overspending.
 * Model can choose only pre-approved IDs, and cannot introduce advice or invented data.
 */
export function reportRecommendations(state={},settings={}){
 const w=reportWindow(settings.now||new Date().toISOString().slice(0,10),settings.period);
 const m=samples(state,w),items=[];
 const add=(id,area,observation,suggestion,method)=>items.push({id,area,observation,suggestion,method});
 const validEntries=within(state.nutritionJournal?.entries,w,'at').filter(x=>!x.deleted);
 const days=[...new Set(validEntries.map(e=>e.__day))].sort();
 if(days.length>=14){
  const dozen=days.map(day=>dailyDozen5930(state,{day}));
  const mapped=dozen.reduce((n,x)=>n+x.mapped,0);
  // Enough evidence to speak about *logged* pattern; never extrapolate to unlogged meals.
  if(mapped>=10){
   const cats=dozen[0]?.rows||[];
   const stats=cats.filter(c=>c.id!=='exercise').map(c=>{
     const seen=dozen.reduce((n,d)=>n+(d.rows.find(x=>x.id===c.id)?.observed||0),0);
     const pct=seen/(c.goal*days.length);
     return {...c,seen,ratio:pct};
   }).sort((a,b)=>a.ratio-b.ratio);
   const under=stats.filter(c=>c.ratio<.35).slice(0,2);
   for(const cat of under)add('dd-'+cat.id,'Ernährung · Daily Dozen',
    `${cat.label}: ${fmt(round(cat.seen/days.length))} von ${cat.goal} Orientierungsportionen je protokolliertem Tag im Mittel (${days.length} Tage; ${mapped} zugeordnete Einträge).`,
    `Prüfe, ob sich ${cat.label.toLowerCase()} unkompliziert häufiger in deinen Speiseplan integrieren lässt. Fehlende Protokolle bedeuten nicht, dass du diese Lebensmittel nicht gegessen hast.`,
    'Berechnung aus dokumentierten, automatisch zugeordneten Daily-Dozen-Portionen. Kein klinischer Nährstoffmangel oder Ernährungsvollständigkeitsnachweis.');
  }
 }
 if(m.sleep.length>=14){
  const avg=mean(m.sleep.map(x=>x.value));
  if(avg<420)add('sleep-habit','Schlaf & Erholung',
   `${m.sleep.length} aufgezeichnete Nächte; durchschnittlich ${Math.floor(avg/60)} h ${String(Math.round(avg%60)).padStart(2,'0')} min Schlaf.`,
   'Überlege, ob sich ausreichend Zeit für Schlaf einplanen lässt. Die häufig genannte Erwachsenen-Orientierung liegt bei etwa 7–9 Stunden; individueller Bedarf variiert. Für eine Einschätzung zählen auch Schlafqualität und Wohlbefinden.',
   'Dokumentierte Schlafminuten; unter 7 h im Mittel über mindestens 14 Nächte. Keine medizinische Diagnose.');
  const mid=Math.ceil(m.sleep.length/2),ordered=m.sleep.slice().sort((a,b)=>a.day.localeCompare(b.day));
  const prior=ordered.slice(0,mid),recent=ordered.slice(mid),delta=mean(recent.map(x=>x.value))-mean(prior.map(x=>x.value));
  if(prior.length>=10&&recent.length>=10&&Math.abs(delta)>=40)add('sleep-trend','Schlaf · Trend',
   `Die zweite Hälfte der dokumentierten Nächte lag im Mittel ${Math.round(Math.abs(delta))} Minuten ${delta>0?'über':'unter'} der ersten Hälfte (${prior.length} bzw. ${recent.length} Nächte).`,
   'Beobachte, ob sich dieser Verlauf in den kommenden Wochen bestätigt; unterschiedliche Messdichte und Wochentage können den Eindruck verändern.',
   'Zwei zeitlich getrennte Gruppen dokumentierter Nächte; kein standardisierter Vorher-Nachher-Versuch.');
 }
 if(days.length>=14){
  let completeDays=0,percentages=[];
  for(const day of days){
   const d=nutritionDay(state,day);
   const e=d.entries.length;
   const kcal=d.totals.kcal, sat=d.totals.saturated;
   const coverK=d.coverage.kcal,coverS=d.coverage.saturated;
   // No denominator if any tracked food lacks an energy or saturated-fat profile.
   if(e>0&&coverK?.known===e&&coverS?.known===e&&coverK?.partial===0&&coverS?.partial===0&&kcal>=600&&sat>=0){
    completeDays++;
    percentages.push(100*sat*9/kcal);
   }
  }
  if(completeDays>=14){
   const avg=mean(percentages),above=percentages.filter(x=>x>10).length;
   if(avg>10&&above>=Math.ceil(completeDays*.6))add('saturated-fat','Ernährung · Fettqualität',
    `An ${completeDays} auswertbaren protokollierten Tagen betrug der rechnerische Anteil gesättigter Fettsäuren im Mittel ${fmt(round(avg))} % der dokumentierten Energie; ${above} Tage lagen über 10 %.`,
    'Schau dir die dominierenden Fettquellen in Compass an und erwäge, gesättigte Fette teilweise durch ungesättigte Alternativen zu ersetzen. Produktwerte und Portionsschätzungen können abweichen.',
    'Gesättigte Fettsäuren × 9 kcal / dokumentierte Energie; nur Tage mit vollständigem Fett- und Energiewert pro Eintrag. 10 % ist eine allgemeine Ernährungsorientierung, keine individuelle Diagnose.');
  }
 }
 if(settings.finance){
  const tx=within(state.financeTransactions,w),vm=financeViewModel(tx,'all');
  if(tx.length>=15&&vm.pending.length>=3)add('finance-review','Finanzen · Datenqualität',
   `${vm.pending.length} von ${tx.length} importierten Buchungen sind noch ungeklärt.`,
   'Prüfe und klassifiziere zuerst die offenen Buchungen, bevor Compass Trends oder Sparpotenziale bewertet. Transfers und interne Umbuchungen sollten getrennt bleiben.',
   'Ungeklärte Buchungen laut bestehender Compass-Finanzklassifikation; noch keine Aussage über Ausgabendisziplin.');
  // Explicitly avoid "overspending" advice from unverified categories or incomplete bank coverage.
 }
 return items;
}
// Local LLM may only REORDER existing evidence identifiers; it cannot create report claims.
export async function rankEvidenceLocally(facts,{fetcher=fetch,timeoutMs=12000}={}){
 if(!facts.length)return [];
 const c=new AbortController(),timer=setTimeout(()=>c.abort(),timeoutMs);
 try{
  const models=await fetcher('http://127.0.0.1:1234/v1/models',{signal:c.signal});
  if(!models.ok)throw Error('LM Studio Modellliste nicht erreichbar');
  const found=await models.json(),model=found.data?.[0]?.id;
  if(typeof model!=='string'||model.length>200)throw Error('In LM Studio ist kein Modell geladen');
  const response=await fetcher('http://127.0.0.1:1234/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json'},signal:c.signal,body:JSON.stringify({model,temperature:0,max_tokens:250,messages:[
   {role:'system',content:'Ordne ausschließlich die gegebenen Fakten und bereits geprüften Empfehlungen nach redaktioneller Relevanz. Antwort NUR als JSON {"ids":["...","..."]}. Keine neuen Aussagen, Zahlen, Diagnosen, Vermutungen oder zusätzlichen IDs.'},
   {role:'user',content:JSON.stringify(facts.map(f=>({id:f.id,text:f.text,detail:f.detail})))}
  ]})});
  if(!response.ok)throw Error('LM Studio HTTP '+response.status);
  const body=await response.json(),txt=String(body.choices?.[0]?.message?.content||'');
  const match=txt.match(/\{[\s\S]*\}/);if(!match)throw Error('Lokale KI: ungültiges Antwortformat');
  const ordered=JSON.parse(match[0]).ids,allowed=new Set(facts.map(f=>f.id));
  if(!Array.isArray(ordered)||ordered.length!==facts.length||new Set(ordered).size!==ordered.length||ordered.some(x=>!allowed.has(x)))throw Error('KI-Vorschlag enthielt nicht belegte IDs');
  return ordered;
 }finally{clearTimeout(timer);}
}
const extractSvg=(html,predicate=()=>true)=>{
 const matches=String(html||'').match(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi)||[];
 return matches.find(predicate)||'';
};
function chartSection(eyebrow,title,chart,description){
 return chart?`<section class="clp-page clp-chapter"><div class="clp-kicker">${esc(eyebrow)}</div><h2>${esc(title)}</h2><figure class="clp-figure">${chart}</figure><p class="clp-caption">${esc(description)}</p></section>`:'';
}
const formatDate=d=>new Date(onDate(d)).toLocaleDateString('de-AT',{day:'numeric',month:'long',year:'numeric'});
function chapterFacts(facts,ids){return facts.filter(x=>ids.includes(x.id)).map(x=>`<p class="clp-finding"><b>${esc(x.text)}</b><span>${esc(x.detail)}</span></p>`).join('');}
export function reportDocument(state={},settings={}){
 const report=reportEvidence(state,settings),check=reportReadiness(state,settings),w=report.window;
 const advice=reportRecommendations(state,settings);
 const noData='<p class="clp-empty">Für diesen Zeitraum liegen keine geeigneten Messdaten vor. Es werden keine Werte ergänzt.</p>';
 const sleepData=within(state.healthImports?.garminNights,w).map(x=>({...x,sleepMinutes:nightMinutes(x)})).filter(x=>x.sleepMinutes>0);
 const sleepSvg=sleepData.length?extractSvg(renderSleepYearDistribution(sleepData,w.end,'day')):'';
 const nutritionEvents=within(state.nutritionJournal?.entries,w,'at').filter(x=>!x.deleted);
 const chartState={...state,nutritionJournal:{...(state.nutritionJournal||{}),entries:nutritionEvents}};
 const nutritionSvg=nutritionEvents.length?extractSvg(nutritionTimingView(chartState,{mode:'all',anchor:w.end,now:new Date(onDate(w.end))}),x=>x.includes('ni725-dots')):'';
 const nutritionTrend=nutritionEvents.length?extractSvg(nutritionTrendsView(chartState,{mode:'all',anchor:w.end,metric:'protein',now:new Date(onDate(w.end))})):'';
 const radar=buildLifeBalanceRadar(state,{today:w.end,period:w.days>=30?30:7});
 const radarSvg=extractSvg(lifeBalanceRadarView(radar,{history:buildLifeBalanceHistory(state,{today:w.end,period:w.days>=30?30:7,count:2})}));
 const finTransactions=settings.finance?within(state.financeTransactions,w):[];
 const vm=financeViewModel(finTransactions,'all');
 const financeSvg=finTransactions.length?extractSvg(hierarchicalSankey(finTransactions,'all'))||extractSvg(expenseSankey(vm)):'';
 const visits=settings.places?(state.placesVisits||[]).filter(x=>iso(x?.end)>=w.start&&iso(x?.start)<=w.end):[];
 const worldHtml=visits.length?placesInsightsView({visits,labels:state.placesLabels||{},range:w,mapRegion:'world',mapZoom:1,nights:[]}):'';
 const mapSvg=extractSvg(worldHtml,x=>x.includes('places-world-svg'));
 const facts=report.facts;
 const chosen=settings.rankedIds?.length?settings.rankedIds.map(id=>facts.find(f=>f.id===id)).filter(Boolean):facts;
 const leading=chosen.slice(0,5).map(x=>`<li><strong>${esc(x.text)}</strong><small>${esc(x.detail)}</small></li>`).join('')||'<li>Für diesen Zeitraum liegen noch keine ausreichend dokumentierten Beobachtungen vor.</li>';
 const dataRows=check.sources.map(s=>`<tr><th>${esc(s.label)}</th><td>${s.count}</td><td>${s.last?esc(s.last):'–'}</td><td>${s.stale?'⚠ Importstand prüfen':'Erfasster Stand'}</td></tr>`).join('');
 const generatedAt=new Date().toLocaleString('de-AT');
 const sections=[
  chartSection('01 / THE BIG PICTURE','Life Balance',radarSvg,'Vorhandenes Life-Balance-Radar aus Compass. Fehlende Dimensionen bleiben ohne Wert; Zeitspuren sind keine unabhängigen Messungen.'),
  chartSection('02 / REST & RECOVERY','Schlaf im Jahresverlauf',sleepSvg,'Jeder Punkt entspricht einer importierten Garmin-Schlafnacht. Die Darstellung nutzt die bestehende Compass-Schlafgrafik; fehlende Nächte bleiben Lücken.'),
  chartSection('03 / NUTRITION','Ernährungsrhythmus',nutritionSvg,'Originaler Compass-Dot-Plot: Zeitpunkt und Größe der erfassten Aufnahmen. Daten im Gesamtmodus enthalten auch ältere Einträge; ausgewertet werden nur Daten des gewählten Berichtszeitraums.'),
  chartSection('04 / NUTRITION','Nährstofftrends',nutritionTrend,'Erfasste Proteinmengen je dokumentiertem Tag; unvollständige Lebensmitteldaten sind Teilbilanzen.'),
  settings.finance?chartSection('05 / MONEY FLOW','Finanzströme · Sankey',financeSvg,'Originaler Compass-Sankey aus bestätigten Buchungskategorien. Transfers und ungeklärte Abgänge sind nicht mit Konsumausgaben gleichzusetzen.'): '',
  settings.places?chartSection('06 / MY YEAR IN PLACES','Wo ich unterwegs war',mapSvg,'Originale Compass-Worldmap mit importierten Aufenthaltsgruppen. Keine Route, keine GPS-Vollständigkeitsbehauptung. Daten bleiben lokal.'):''
 ].filter(Boolean).join('');
 const correlation=report.correlations[0];
 const orderedAdvice=settings.rankedIds?.length?advice.slice().sort((a,b)=>{const ai=settings.rankedIds.indexOf(a.id),bi=settings.rankedIds.indexOf(b.id);return (ai<0?9999:ai)-(bi<0?9999:bi);}):advice;
 const suggestions=orderedAdvice.map((x,i)=>`<div class="clp-advice"><span class="clp-advice-n">${String(i+1).padStart(2,'0')} · ${esc(x.area)}</span><h3>${esc(x.observation)}</h3><p>${esc(x.suggestion)}</p><small>${esc(x.method)}</small></div>`).join('')||'<p class="clp-empty">Für belastbare individualisierte Empfehlungen liegen noch keine ausreichenden beziehungsweise vollständig genug beschriebenen Beobachtungen vor.</p>'; 
 const correlationHtml=correlation.valid?`<p class="clp-finding"><b>Schlaf / HRV: r = ${fmt(correlation.r)} (n = ${correlation.n})</b><span>Pearson-Korrelation über Tage mit beiden Messungen, ohne Kontrolle anderer Einflüsse. Keine kausale Aussage.</span></p>`:`<p class="clp-empty">Schlaf und HRV: ${correlation.n} passende Messtage; für diese Auswertung sind mindestens 20 notwendig. Es wird kein Korrelationskoeffizient ausgewiesen.</p>`;
 return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Compass Life · Ars Vivendi · ${esc(w.end)}</title><style>${REPORT_CSS}</style></head><body>
 <div class="clp-actions"><strong>Compass Life · Druckansicht</strong><button type="button" onclick="window.print()">Als PDF sichern / Drucken</button><small>Im Druckdialog „Als PDF speichern“ wählen · Hintergrundgrafiken aktivieren.</small></div>
 <main class="clp-document">
 <section class="clp-cover clp-page"><div class="clp-monogram">◈</div><div class="clp-label">COMPASS LIFE · PRIVATE EDITION</div><div class="clp-cover-center"><p>PERSONAL LIFE & WELLBEING REPORT</p><h1>Ars Vivendi</h1><h3>The Art of Living</h3></div><div class="clp-cover-bottom"><span>${esc(formatDate(w.start))} — ${esc(formatDate(w.end))}</span><span>CONFIDENTIAL · LOCAL EDITION</span></div></section>
 <section class="clp-page clp-preface"><div class="clp-kicker">EDITORIAL / EXECUTIVE SUMMARY</div><h2>Mein Leben in Daten</h2><p class="clp-intro">Dieser Bericht beschreibt ausschließlich Beobachtungen, die zum Erstellungszeitpunkt in Compass vorhanden waren. Er unterscheidet dokumentierte Werte, unvollständige Quellen und Korrelationen. Kein Algorithmus ergänzt fehlende Tage.</p><ol class="clp-findings">${leading}</ol><p class="clp-method-note">Empfehlungen werden aus dokumentierten, qualitätsgeprüften Mustern abgeleitet, nicht von der KI erfunden. Redaktionelle Reihenfolge: ${settings.rankedIds?.length?'durch lokales LM-Studio-Modell sortiert, Aussagen unverändert':'regelbasiert'}. Die Formulierungen sind aus validierten Messwerten abgeleitet; das Modell darf keine neuen Aussagen erstellen.</p></section>
 ${sections||noData}
 <section class="clp-page clp-chapter"><div class="clp-kicker">EVIDENCE-BASED GUIDANCE / PERSONAL REFLECTIONS</div><h2>Was ich ausprobieren könnte</h2><p class="clp-intro">Die folgenden Vorschläge entstehen ausschließlich aus überprüfbaren Einträgen und definierten, vorsichtigen Entscheidungsregeln. Sie sind Anregungen, keine Diagnose oder unabhängige Beratung.</p>${suggestions}</section>
 <section class="clp-page clp-chapter"><div class="clp-kicker">07 / LONGITUDINAL INTELLIGENCE</div><h2>Trends & Zusammenhänge</h2>${chapterFacts(facts,['sleep','hrv','weight','finance','nutrition','places'])}${correlationHtml}<p class="clp-caption">Unterschiedliche Quellen besitzen unterschiedliche Messdichten. Fehlende Messungen sind keine Nullwerte. Korrelationen zeigen Zusammenhänge, keine Ursachen; sie sind ohne zusätzliche Kontrollvariablen nicht prädiktiv.</p></section>
 <section class="clp-page clp-chapter"><div class="clp-kicker">APPENDIX / SOURCE AUDIT</div><h2>Data Integrity</h2><p class="clp-intro">Berichtszeitraum: ${esc(w.start)} bis ${esc(w.end)} · generiert ${esc(generatedAt)}. Es wurde kein Live-Garmin- oder Fitdays-Abgleich garantiert. Der Report ist ein Snapshot des bereits importierten lokalen Vaults.</p><table><thead><tr><th>Quelle</th><th>Datensätze</th><th>Letztes Datum</th><th>Hinweis</th></tr></thead><tbody>${dataRows}</tbody></table><p class="clp-caption">Datenverarbeitung: im geöffneten, entsperrten Browserfenster. Kein Cloud-PDF-Dienst; kein Upload von Koordinaten oder Finanzbuchungen. Lokale KI, falls aktiviert, erhält nur explizit freigegebene aggregierte Sätze (keine Rohdaten). Finanz- und Ortskapitel nur bei vorheriger Auswahl. Print-to-PDF nutzt den lokalen Browser-Druckdialog.</p></section>
 <footer class="clp-footer">COMPASS LIFE · ARS VIVENDI <span>CONFIDENTIAL · ${esc(w.end)}</span></footer>
 </main></body></html>`;
}
export function reportSetupView(state={},settings={}){
 const check=reportReadiness(state,settings);
 return `<section class="clp-setup" aria-label="Compass Life Report"><div class="clp-title"><div><span class="page-overline">COMPASS LIFE / ARS VIVENDI</span><h2>Premium Life Report</h2><p>Deine bestehenden Grafiken als zusammenhängender, lokal erzeugter PDF-Bericht. Die Jahreskarte, Sankey und sensiblen Kapitel nur nach deiner Freigabe.</p></div><span class="clp-mark">◈</span></div>
 <div class="clp-inputs"><label>Berichtszeitraum<select id="clp-period"><option value="month" ${settings.period==='month'?'selected':''}>30 Tage</option><option value="quarter" ${settings.period==='quarter'?'selected':''}>90 Tage</option><option value="year" ${!settings.period||settings.period==='year'?'selected':''}>365 Tage · Annual</option></select></label><label class="clp-check"><input id="clp-finance" type="checkbox" ${settings.finance?'checked':''}/> Finanzkapitel mit Sankey aufnehmen</label><label class="clp-check"><input id="clp-places" type="checkbox" ${settings.places?'checked':''}/> Persönliche Weltkarte aufnehmen</label></div>
 <div class="clp-readiness"><h3>Data Integrity · Importstand</h3>${check.sources.map(s=>`<div class="clp-source"><span>${s.stale?'○':'●'} ${esc(s.label)} <small>${s.count} Werte im Zeitraum</small></span><span>${s.last?esc(s.last):'Keine Daten'}${s.stale?' · prüfen':''}</span></div>`).join('')}<p>„Importstand prüfen“ bedeutet nicht, dass eine Live-Synchronisierung mit Garmin, Fitdays oder Banken erfolgt ist. Der Bericht verwendet ausschließlich den aktuell lokal entschlüsselten Datenbestand.</p></div>
 <div class="clp-setup-actions"><button type="button" class="primary-btn" data-action="clp-preview" ${check.ready?'':'disabled'}>Report-Vorschau öffnen / PDF erstellen</button><button type="button" class="secondary-btn" data-action="clp-ai" ${reportEvidence(state,settings).facts.length+reportRecommendations(state,settings).length?'':'disabled'}>Beobachtungen & Empfehlungen lokal priorisieren</button><button type="button" class="secondary-btn" data-action="clp-refresh">Compass-Daten neu abgleichen</button></div><p role="status" class="muted-line">${esc(settings.aiStatus||'Lokale KI ist optional. Ohne sie bleiben die datenbasierten Empfehlungen verfügbar; sie sortiert ausschließlich nachgewiesene Aussagen.')}</p><p class="clp-foot">Der Druckdialog erzeugt auf deinem Gerät ein PDF. Für präzise Druckgrafiken werden die originalen Compass-SVGs benutzt. Keine Screenshots oder externen PDF-Dienste.</p></section>`;
}
export const REPORT_CSS=`
@page{size:A4;margin:13mm 14mm 18mm}
*{box-sizing:border-box}body{margin:0;background:#eaece9;color:#263833;font:12px/1.6 Georgia,'Times New Roman',serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.clp-actions{display:flex;gap:12px;align-items:center;justify-content:center;padding:15px;background:#fff;font:14px system-ui,sans-serif;position:sticky;top:0;z-index:4}.clp-actions button{background:#183c33;color:#fff;border:none;border-radius:9px;padding:12px 18px;cursor:pointer}.clp-actions small{font-size:11px;color:#667}
.clp-document{width:210mm;margin:24px auto;background:white;box-shadow:0 16px 55px #0002}.clp-page{min-height:260mm;padding:20mm 16mm 14mm;break-after:page;page-break-after:always;background:white;overflow:hidden}.clp-cover{background:#102d28;color:#f2ecdd;display:flex;flex-direction:column;justify-content:space-between}.clp-monogram{font-size:58px;color:#cbb47e}.clp-label,.clp-kicker,.clp-cover-center p,.clp-cover-bottom,.clp-footer{font:11px/1.4 system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase}.clp-label{color:#d4bc84}.clp-cover-center{margin:40px 0 60px}.clp-cover-center h1{font-size:62px;font-weight:400;line-height:1.1;margin:16px 0 4px;letter-spacing:-.035em}.clp-cover-center h3{font-size:25px;font-weight:400;color:#d4bc84;margin:0}.clp-cover-bottom{display:flex;justify-content:space-between;border-top:1px solid #a98e596b;padding-top:20px;color:#d0c6b0}
.clp-kicker{color:#ac8b51;margin-bottom:25px}.clp-page h2{font-size:37px;font-weight:400;letter-spacing:-.025em;color:#163a32;line-height:1.2;margin:0 0 25px}.clp-intro{max-width:150mm;font-size:15px;line-height:1.85}.clp-findings{padding:0 0 0 25px;margin-top:24px}.clp-findings li{padding:13px 0;border-bottom:1px solid #dfebe7;font-size:15px}.clp-findings small{display:block;font:11px/1.7 system-ui,sans-serif;color:#586b63;margin-top:5px}.clp-method-note,.clp-caption{border-top:1px solid #d9e4dc;padding-top:12px;color:#58746a;font:10px/1.7 system-ui,sans-serif;margin-top:18px}.clp-figure{margin:18px 0 0;width:100%;display:block;overflow:hidden}.clp-figure svg{display:block;width:100%;max-height:190mm;height:auto;overflow:visible}.clp-figure svg text{font-family:Arial,'Helvetica Neue',sans-serif}.clp-figure .places-world-svg{border-radius:7px}.clp-figure .ni725-dots{max-height:160mm}.clp-finding{padding:13px 0;border-bottom:1px solid #e1e9e3}.clp-finding b{font-weight:600;font-size:14px}.clp-finding span{display:block;font:11px/1.7 system-ui,sans-serif;color:#607369;margin-top:4px}.clp-empty{font:13px/1.6 system-ui,sans-serif;color:#678}.clp-advice{padding:16px 0 18px;border-bottom:1px solid #dfe7e2;break-inside:avoid}.clp-advice-n{font:10px system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#99733f}.clp-advice h3{font-weight:400;font-size:17px;color:#183e32;margin:10px 0}.clp-advice p{font-size:12px;line-height:1.65}.clp-advice small{font:10px/1.5 system-ui,sans-serif;color:#65746e}.clp-page table{width:100%;border-collapse:collapse;font:10px/1.5 system-ui,sans-serif;table-layout:fixed}.clp-page td,.clp-page th{padding:11px 5px;text-align:left;border-bottom:1px solid #e0e8e2;overflow-wrap:anywhere}.clp-page th{color:#45685d}.clp-footer{padding:12mm 14mm;display:flex;justify-content:space-between;color:#60776d}
@media print{body{background:white}.clp-actions{display:none}.clp-document{margin:0;width:auto;box-shadow:none}.clp-page{min-height:auto;padding:7mm 0 0;break-after:page;page-break-after:always}.clp-cover{min-height:260mm;padding:10mm 12mm}.clp-footer{display:none}}
`;
