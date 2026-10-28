/** Ars Vivendi Annual 0.5.77.59.40.23 (chart atlas / additional source graphics) — chronological, evidence-first print edition.
 * Extends the 40.18 report rather than replacing its proven data audit and recommendation engine.
 * Financial, location, relationship and emotional data only after independent opt-in.
 * Never exports or uploads report payload, and never imputes missing records.
 */
import {reportReadiness,reportEvidence,reportRecommendations,reportWindow,pairedCorrelation} from './life-report-v577594018.js';
import {annualChartAtlas} from './annual-chart-atlas-v4023.js';
import {annualFatKnowledge,annualNutritionKnowledge,annualFinanceKnowledge,ANNUAL_KNOWLEDGE_CSS} from './annual-knowledge-v4024.js';
import {editorialAnnualPages,EDITORIAL_CSS} from './annual-editorial-v4025.js';
import {MICRO_ATLAS_CSS} from './annual-micronutrient-v4025.js';

import {buildLifeBalanceRadar,buildLifeBalanceHistory,lifeBalanceRadarView} from './life-balance-radar-v563.js';
import {renderSleepYearDistribution} from './sleep-year-v552.js';
import {worktimeWeeks,worktimeView} from './worktime-v553.js';
import {bodyTransformationView,bodyTransformationModel} from './body-transformation-v57749.js';
import {strengthInsightsView,strengthPeriod,strengthTrainingDots,strengthPrintBodySvg} from './strength-insights-v57728.js';
import {detailedMuscleData,detailedMuscleSvg} from './strength-anatomy-v57737.js';
import {compassRegionForAnatomyId} from './strength-premium-v57738.js';
import {nutritionTimingView} from './nutrition-timing-v57725.js';
import {nutritionTrendsView} from './nutrition-trends-v57726.js';
import {nutritionFatView} from './nutrition-fat-quality-v57731.js';
import {nutritionPhytoView} from './nutrition-phyto-v57736.js';
import {antiAgingEightModel} from './anti-aging-eight-v57734.js';
import {dailyDozen5930,DAILY_DOZEN_5930} from './daily-dozen-v5775930.js';
import {nutritionDay} from './nutrition-intelligence-v57712.js';
import {financeMonthlySeries,financeExpenseOverview} from './finance-analytics.js';
import {financeViewModel} from './finance-core.js';
import {hierarchicalSankey,hierarchicalFlows,signedSunburst,radialSankey,voronoiTreemap} from './finance-exotic-hierarchy.js';
import {merchantDisplay} from './finance-merchant-editor.js';
import {expenseSankey} from './finance-dashboard.js';
import {spendingCalendar,spendingStreamgraph,spendingAlluvial} from './finance-exotic-time.js';
import {relationshipMapView} from './relationship-map-v567.js';
import {feelingStats} from './feeling-wheel-v565.js';
import {placesInsightsView,placeClusters} from './insights-places.js';

const H=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d/.test(s)?s.slice(0,10):'';
const rows=(x)=>Array.isArray(x)?x:[];
const inWindow=(arr,w,key='day')=>rows(arr).filter(r=>r&&!r.deleted&&day(r[key]||r.at||r.start)>=w.start&&day(r[key]||r.at||r.start)<=w.end);
const n=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
const mean=ns=>ns.length?ns.reduce((s,v)=>s+v,0)/ns.length:null;
const fmt=(v,d=1)=>Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:d}):'—';
const date=s=>day(s)?new Date(`${day(s)}T12:00:00Z`).toLocaleDateString('de-AT',{day:'numeric',month:'long',year:'numeric'}):'—';
const title=(index,eyebrow,heading,deck)=>`<header class="av19-heading"><div class="av19-overline">${String(index).padStart(2,'0')} / ${H(eyebrow)}</div><h2>${H(heading)}</h2><p>${H(deck)}</p></header>`;
const takeSvg=(html)=>[...String(html||'').matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi)].map(m=>m[0]);
// Report charts must never pick a toolbar icon, a loading placeholder or an uncontrolled SVG.
const printableSvg=svg=>Boolean(svg&&!/Anatomie wird geladen|str740-loading/i.test(svg)&&/<svg\b/i.test(svg)&&svg.length<1_600_000);
const chartSvg=(html,needle)=>takeSvg(html).find(s=>s.includes(needle)&&printableSvg(s))||'';
export function dailyMetricMeans(points){
 const grouped=new Map();for(const p of rows(points)){if(!day(p.day)||!Number.isFinite(p.value))continue;const x=grouped.get(day(p.day))||{sum:0,count:0};x.sum+=p.value;x.count++;grouped.set(day(p.day),x);}
 return [...grouped].sort((a,b)=>a[0].localeCompare(b[0])).map(([d,r])=>({day:d,value:r.sum/r.count,count:r.count}));
}
const guard=(fn)=>{try{return fn()}catch{return ''}}; // Optional legacy charts must never crash an entire annual.
const figures=(html,max=3)=>takeSvg(html).filter(printableSvg).slice(0,max);
const dayNumber=d=>Date.parse(`${d}T12:00:00Z`);
const dayShift=(d,delta)=>new Date(dayNumber(d)+delta*86400000).toISOString().slice(0,10);
const monthLabels=['Jän','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const card=(label,value,detail)=>`<div class="av19-stat"><small>${H(label)}</small><b>${H(value)}</b><span>${H(detail)}</span></div>`;
const essay=(heading,paragraph,provenance)=>`<aside class="av19-comment"><strong>${H(heading)}</strong><p>${H(paragraph)}</p>${provenance?`<small>${H(provenance)}</small>`:''}</aside>`;
const fig=(heading,svg,caption,{wide=false}={})=>svg?`<figure class="av19-figure${wide?' av19-figure-wide':''}"><figcaption>${H(heading)}</figcaption>${svg}<p>${H(caption)}</p></figure>`:'';
const page=(kicker,inner,{wide=false}={})=>`<section class="av19-page${wide?' av19-landscape':''}"><div class="av19-running">COMPASS LIFE <span>ARS VIVENDI · PRIVATE ANNUAL</span></div><div class="av19-kicker">${H(kicker)}</div>${inner}</section>`;
const chapter=(n,kicker,name,deck)=>page('PART '+String(n).padStart(2,'0')+' / '+kicker,`<div class="av19-chapter-label">${String(n).padStart(2,'0')} / THE CHRONICLE</div><h1>${H(name)}</h1><p class="av19-lead">${H(deck)}</p><div class="av19-ornament">◈</div>`,{wide:false}).replace('class="av19-page"','class="av19-page av19-chapter"');
const twoplots=(a,b)=>`<div class="av19-stack">${a}${b}</div>`;
/** The report uses precisely the same 70+ anatomical paths as Compass' premium
 * strength dashboard. Paths are loaded from the installed body-muscles package
 * before document creation and embedded as static SVG in the printable snapshot.
 * Never substitute the small 10-muscle silhouette when professional paths exist.
 */
export function annualPremiumAnatomy(model,parts=[],side='front'){
 if(!Array.isArray(parts)||parts.length<20)return '';
 const anatomy=detailedMuscleData(model), back=side==='back';
 const shapes=parts.filter(p=>p&&typeof p.path==='string'&&p.path.length<120000);
 if(shapes.length<20)return '';
 const svg=shapes.map(p=>{
  const regionId=compassRegionForAnatomyId(p.id,side),r=regionId?anatomy.regions[regionId]:null;
  const color=r?.primary>0?'#e95e37':r?.secondary>0?'#e8bd52':'#b4c1bf';
  const title=`${p.name||p.id}: ${r?.primary||0} Hauptsätze, ${r?.secondary||0} unterstützende Sätze`;
  return `<path d="${H(p.path)}" fill="${color}" stroke="#fff" stroke-width="0.07" stroke-linejoin="round"><title>${H(title)}</title></path>`;
 }).join('');
 return `<svg class="av22-anatomy-detailed" viewBox="${back?'37 0 35 93':'0 0 35 93'}" role="img" aria-label="Compass Premium-Muskelkarte ${back?'Rückseite':'Vorderseite'} mit ${shapes.length} anatomischen SVG-Regionen">${svg}</svg>`;
}
/** Auditable transaction hierarchy: only confirmed expense rows, NEVER account
 * transfers, cash withdrawals or unclassified outflows. Grouping is exactly the
 * existing finance hierarchy used in Compass Dashboard. */
export function annualFinanceCategories(transactions=[]){
 const groups=hierarchicalFlows(transactions).filter(g=>!g.special&&g.cents>0),total=groups.reduce((n,g)=>n+g.cents,0);
 return {groups,total,topShare:total?groups[0].cents/total:0};
}
export function annualCategoryBars(info,max=11){
 const groups=info.groups.slice(0,max),total=info.total;
 if(!groups.length||!total)return '';
 const W=1000,L=270,R=177,T=24,row=46,H=T+groups.length*row+12,bar=W-L-R;
 const lines=groups.map((g,i)=>{const y=T+i*row;const share=g.cents/total;return `<g><text x="${L-14}" y="${y+17}" text-anchor="end" font-size="17" fill="#24483d">${Htm(g.name.slice(0,33))}</text><rect x="${L}" y="${y}" width="${bar}" height="23" rx="4" fill="#e9eeeb"/><rect x="${L}" y="${y}" width="${(share*bar).toFixed(2)}" height="23" rx="4" fill="${Htm(g.color||'#477e74')}"/><text x="${L+bar+12}" y="${y+17}" font-size="17" fill="#2e4c42">${Htm(fmt(g.cents/100,0))} €</text><text x="${W-4}" y="${y+17}" font-size="15" fill="#607168" text-anchor="end">${Htm(fmt(share*100))}%</text></g>`;}).join('');
 return `<svg class="av22-finance-category-chart" role="img" aria-label="Klassifizierte Konsumausgaben je Hauptkategorie, Beträge und Prozentanteile" viewBox="0 0 ${W} ${H}">${lines}</svg>`;
}
function annualCategoryRows(info,limit=7){
 return `<table class="av19-table av22-subcategory-table"><thead><tr><th>Hauptkategorie / Unterkategorie</th><th>Betrag</th><th>Anteil am Konsum</th></tr></thead><tbody>${info.groups.slice(0,limit).flatMap(g=>[
 `<tr class="av22-parent"><th>${H(g.name)}</th><td>${H(fmt(g.cents/100,2))} €</td><td>${H(fmt(g.cents/Math.max(1,info.total)*100))}%</td></tr>`,
 ...(g.children||[]).slice(0,3).map(c=>`<tr><td>↳ ${H(c.name)}</td><td>${H(fmt(c.cents/100,2))} €</td><td>${H(fmt(c.cents/Math.max(1,info.total)*100))}%</td></tr>`)
 ]).join('')}</tbody></table>`;
}
export function annualMerchantRanking(transactions=[],top=12){
 const merchants=new Map();
 for(const t of rows(transactions)){
  if(t?.needsReview||t.flow!=='expense'||!Number.isFinite(t.amountCents)||t.amountCents>=0)continue;
  const name=merchantDisplay(t)||'Nicht benannter Händler';const prev=merchants.get(name)||0;merchants.set(name,prev-t.amountCents);
 }
 return [...merchants].map(([name,cents])=>({name,cents})).sort((a,b)=>b.cents-a.cents).slice(0,top);
}

const width=W=>Number(W).toFixed(1);
// Compact, vector-true plot with a fixed calendar x-axis. No imputed samples and no invented connecting line.
export function annualDots(points,w,{label='Messpunkte',unit='',color='#3f8776',min=null,max=null}={}){
 const data=rows(points).filter(p=>day(p.day)&&Number.isFinite(p.value)&&p.day>=w.start&&p.day<=w.end).sort((a,b)=>a.day.localeCompare(b.day));
 if(!data.length)return '';
 const vals=data.map(p=>p.value),lo=Math.min(...vals),hi=Math.max(...vals),delta=Math.max(hi-lo,1),bottom=min??lo-delta*.12,top=max??hi+delta*.12;
 const W=960,H=240,L=67,R=25,T=25,B=43;const X=d=>L+(dayNumber(d)-dayNumber(w.start))/Math.max(1,dayNumber(w.end)-dayNumber(w.start))*(W-L-R),Y=v=>T+(top-v)/Math.max(.0001,top-bottom)*(H-T-B);
 const ticks=[0,.25,.5,.75,1].map(p=>{const y=Y(bottom+(top-bottom)*p);return `<line x1="${L}" x2="${W-R}" y1="${width(y)}" y2="${width(y)}" stroke="#e4ebe5"/><text x="${L-8}" y="${width(y+4)}" text-anchor="end" font-size="12" fill="#658078">${Htm(fmt(bottom+(top-bottom)*p))}</text>`;}).join('');
 const monthTicks=[];let cursor=w.start.slice(0,7)+'-01';if(cursor<w.start)cursor=new Date(Date.UTC(+cursor.slice(0,4),+cursor.slice(5,7),1)).toISOString().slice(0,10);
 while(cursor<=w.end){const x=X(cursor);monthTicks.push(`<line x1="${width(x)}" y1="${T}" x2="${width(x)}" y2="${H-B}" stroke="#edf1ee"/><text x="${width(x)}" y="${H-11}" text-anchor="middle" font-size="11" fill="#587468">${monthLabels[Number(cursor.slice(5,7))-1]} ${cursor.slice(2,4)}</text>`);cursor=new Date(Date.UTC(+cursor.slice(0,4),Number(cursor.slice(5,7)),1)).toISOString().slice(0,10);}
 const dots=data.map(p=>`<circle cx="${width(X(p.day))}" cy="${width(Y(p.value))}" r="${data.length>280?2.2:3.7}" fill="${Htm(color)}"><title>${Htm(p.day)}: ${Htm(fmt(p.value))} ${Htm(unit)}</title></circle>`).join('');
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${Htm(label)}: ${data.length} tatsächliche Messpunkte, fehlende Tage leer">${monthTicks.join('')}${ticks}${dots}</svg>`;
}
export function annualBars(items,{label='Vergleich',color='#41796e',maxCount=52,format='value'}={}){
 const data=rows(items).slice(0,maxCount).filter(x=>Number.isFinite(x.value));if(!data.length)return '';
 const W=960,H=260,L=62,R=20,T=26,B=47,max=Math.max(...data.map(x=>x.value),1),width=(W-L-R)/data.length;
 const bars=data.map((x,i)=>{const h=Math.max(0,x.value/max*(H-T-B)),left=L+i*width+Math.min(2,width*.14);return `<rect x="${left.toFixed(1)}" y="${(H-B-h).toFixed(1)}" width="${Math.max(2,width*.72).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${Htm(x.color||color)}"><title>${Htm(x.label)} · ${Htm(fmt(x.value))}</title></rect>${i%Math.max(1,Math.ceil(data.length/12))===0?`<text x="${(left+width*.35).toFixed(1)}" y="${H-13}" text-anchor="middle" font-size="11" fill="#64746b">${Htm(x.label)}</text>`:''}`;}).join('');
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${Htm(label)}"><line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="#b9ccc3"/><text x="15" y="20" font-size="12" fill="#688077">${Htm(format)}</text>${bars}</svg>`;
}
export function annualDailyDozen(state,w){
 const d=inWindow(state.nutritionJournal?.entries,w,'at'),days=[...new Set(d.map(x=>day(x.at)))].filter(Boolean).sort();
 if(!days.length)return {days:0,assigned:0,items:[],svg:''};
 const models=days.map(day=>dailyDozen5930(state,{day}));const assigned=models.reduce((s,x)=>s+x.mapped,0);
 const items=DAILY_DOZEN_5930.map(category=>{const total=models.reduce((s,m)=>s+(m.rows.find(r=>r.id===category.id)?.observed||0),0);return {...category,average:total/days.length,ratio:total/(days.length*category.goal)};});
 const W=960,H=570,L=225,R=83,T=19,rowHeight=43,barWidth=W-L-R,barHeight=15;
 const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Daily Dozen: mittlere protokollierte Portionen je beobachtetem Tag, ${days.length} Tage">${items.map((x,i)=>{const y=T+i*rowHeight;return `<text x="${L-12}" y="${y+12}" text-anchor="end" font-size="15" fill="#27483d">${Htm(x.label)}</text><rect x="${L}" y="${y}" width="${barWidth}" height="${barHeight}" rx="5" fill="#e6ede8"/><rect x="${L}" y="${y}" width="${Math.max(0,Math.min(1,x.ratio))*barWidth}" height="${barHeight}" rx="5" fill="${x.ratio>=.75?'#397f6c':'#ba9363'}"/><text x="${W-R+12}" y="${y+13}" font-size="15" fill="#536d61">${Htm(fmt(x.average))}/${x.goal}</text>`;}).join('')}</svg>`;
 return {days:days.length,assigned,items,svg};
}
function Htm(s){return H(s);}
function cvGraph(html,idx=0){return figures(html,idx+1)[idx]||'';}
const entriesFor=(state,w)=>inWindow(state.nutritionJournal?.entries,w,'at');
const sourceNote='Nur lokal importierte, dokumentierte Werte; fehlende Tage oder Konten werden nicht zu Nullwerten ergänzt.';
// Registered chart atlas: every topic is a print-safe, evidence-based selection of existing Compass data models.
function atlasPages(sections,chapterNumber){
 const pages=[];
 for(const item of sections){
  // At most two vector graphics per sheet: each must remain legible on A4.
  const plots=rows(item.plots);
  for(let i=0;i<plots.length;i+=2){
   const pair=plots.slice(i,i+2);
   const main=pair.map(x=>fig(x.label,x.svg,x.caption)).join('');
   const heading=i?`${item.heading} · Fortsetzung`:item.heading;
   pages.push(page(item.topic,`${title(chapterNumber,item.topic,heading,item.deck)}<div class="${pair.length>1?'av19-stack':''}">${main}</div>${i+2>=plots.length?essay('Was die Grafik aussagt',item.insight,'Beobachtungsdaten aus Compass · keine Hochrechnung auf fehlende Tage'):''}`));
  }
 }
 return pages;
}
export function annualInventory(state={},settings={}){
 const r=reportReadiness(state,settings),w=r.window,items=[];const put=(id,label,count,sensitive=false)=>items.push({id,label,count,sensitive,available:count>0});
 put('work','Arbeitszeit',inWindow(state.workTime?.days,w).length);
 put('focus','Zeiterfassung & Lebensbereiche',inWindow(state.timeJournal?.entries,w,'start').length+inWindow(state.quickWorktime?.sessions,w,'start').length);
 put('sport','Sport & Freizeit',inWindow(state.healthImports?.garminSessions,w).length);
 put('sleep','Schlaf',inWindow(state.healthImports?.garminNights,w).length);
 put('hrv','HRV',inWindow(state.healthImports?.garminHrv,w).length);
 put('body','Fitdays Körper',inWindow(state.healthImports?.fitdays,w,'at').length);
 put('nutrition','Ernährung',entriesFor(state,w).length);
 put('finance','Finanzen',settings.finance?inWindow(state.financeTransactions,w).length:0,true);
 put('people','Menschen',settings.people?Object.values(state.people||{}).length:0,true);
 put('feelings','Gefühle',settings.feelings?inWindow(state.feelingCheckins,w,'at').length:0,true);
 put('places','Orte',settings.places?inWindow(state.placesVisits,w,'start').length:0,true);
 return {window:w,items,sources:r.sources,missing:items.filter(i=>!i.available),generatedAt:r.checkedAt};
}
export function annualDocument(state={},settings={}){
 const inv=annualInventory(state,settings),w=inv.window,ev=reportEvidence(state,settings),guidance=reportRecommendations(state,settings),S=[];
 const chartAtlas=annualChartAtlas(state,w);
 const checked=inv.items.filter(x=>x.available).length;
 const dateRange=`${date(w.start)} — ${date(w.end)}`;
 const labs=inv.items.filter(i=>i.available).map(i=>i.label);
 // Cover, full original SVG life radar and transparent source coverage.
 S.push(`<section class="av19-page av19-cover"><div class="av19-brand">◈ <span>COMPASS LIFE / PRIVATE ARCHIVE</span></div><div class="av19-cover-middle"><small>THE PERSONAL CHRONICLE</small><h1>Ars Vivendi</h1><p>A Life Examined. A Life Beautifully Lived.</p><div class="av19-cover-rule"></div><em>${H(dateRange)}</em></div><div class="av19-cover-bottom"><span>THE ANNUAL EDITION</span><span>CONFIDENTIAL · PRIVATE COLLECTION</span></div></section>`);
 S.push(page('EDITORIAL / READ THIS FIRST',`${title(0,'LIFE AT A GLANCE','Das Jahr in Perspektive','Die folgenden Erkenntnisse betreffen ausschließlich dokumentierte Beobachtungen im gewählten Zeitraum.')}<div class="av19-stats">${card('Dokumentierte Bereiche',String(checked),`${inv.items.length} untersuchte Lebensbereiche`)}${card('Berichtszeitraum',`${w.days} Tage`,'Kalenderzeitraum, nicht Datenabdeckung')}${card('Datenprüfung',`${inv.sources.filter(s=>!s.stale).length}/${inv.sources.length}`,'Quellen mit zeitnahem erfasstem Stand')}</div><div class="av19-fact-list">${ev.facts.slice(0,7).map((f,i)=>`<article><span>0${i+1}</span><div><b>${H(f.text)}</b><small>${H(f.detail)}</small></div></article>`).join('')||'<p>Keine belastbaren Fakten für den Zeitraum.</p>'}</div>${essay('Redaktioneller Grundsatz','Jede Angabe stammt aus einem bereits importierten Mess- oder Tagebucheintrag. Eine lokale KI kann belegte Aussagen priorisieren, aber keine neuen Fakten erzeugen.','Datenstand und Unsicherheiten im Anhang dokumentiert.')}`));
 const radarState={...state,financeTransactions:settings.finance?state.financeTransactions:[],people:settings.people?state.people:{}};
 const radar=guard(()=>cvGraph(lifeBalanceRadarView(buildLifeBalanceRadar(radarState,{today:w.end,period:30}),{history:buildLifeBalanceHistory(radarState,{today:w.end,period:30,count:3})})));
 if(radar){S.push(page('I / THE BIG PICTURE',`${title(1,'LIFE BALANCE','Die großen Lebensbereiche','Eine gemeinsame Perspektive – nicht die Verrechnung von Lebensqualität zu einer einzigen Punktzahl.')}${fig('Compass Life Balance · Periodenvergleich',radar,'Originalgrafik des Life-Balance-Radars. Einzelne fehlende Achsen bleiben leer.')}`));}
 // Workload: original weekly source chart + explicit yearly workload distribution.
 const workStart=w.days>=300?`${w.start.slice(0,4)}-01-01`:w.start;const wd=rows(state.workTime?.days).filter(x=>x&&!x.deleted&&day(x.day)>=workStart&&day(x.day)<=w.end);const availableYears=[...new Set(wd.map(d=>+d.day.slice(0,4)))];
 if(wd.length){S.push(chapter(2,'TIME & FOCUS','Meine Zeit','Wie viel Raum haben Arbeit, Fokus und Erholung im dokumentierten Jahr eingenommen?'));
  for(const yr of availableYears){const weeks=worktimeWeeks(wd,yr),workChart=guard(()=>chartSvg(worktimeView({...state.workTime,days:wd},yr,45,null,w.end,false),'Wochenstunden'));
   const heavy=weeks.filter(p=>p.hours>45).length,rangeSum=weeks.reduce((s,x)=>s+x.hours,0),weekly=annualBars(weeks.map(x=>({label:x.start.slice(5),value:x.hours,color:x.hours>45?'#be7965':'#5c9385'})),{label:'Arbeitszeit',format:'Stunden',maxCount:54});
   S.push(page('II / WORKLOAD',`${title(2,'WORK & RECOVERY',`Arbeitsbelastung ${yr}`,'Echte Excel-Zeiterfassungswerte und Kalenderwochen, keine Hochrechnung für fehlende Wochen.')}<div class="av19-stats">${card('Erfasste Stunden',`${fmt(rangeSum,0)} h`,'Summe dokumentierter Wochen')}${card('Wochen mit Werten',String(weeks.length),'Fehlende Wochen sind unbekannt')}${card('Wochen über 45 h',String(heavy),'Nur erfasste Kalenderwochen')}</div>${fig('52 Wochen · dokumentierte Arbeitsbelastung',weekly,'Rot markiert: mehr als 45 h. Nicht dokumentierte Kalenderwochen sind keine Urlaubsnachweise.')}${workChart?fig('Compass · Arbeitszeit-Jahresgrafik',workChart,'Originaldarstellung der Compass-Arbeitszeitstatistik.'):''}`));
  }
 }
 // Time Journal: work versus leisure only on explicitly categorized sessions (not all free time).
 const logs=[...rows(state.timeJournal?.entries),...rows(state.quickWorktime?.sessions)].filter(x=>x&&!x.deleted&&day(x.start)>=w.start&&day(x.start)<=w.end&&Number.isFinite(Date.parse(x.start))&&Number.isFinite(Date.parse(x.end))&&Date.parse(x.end)>Date.parse(x.start));
 const journalByMonth=new Map();for(const e of logs){const length=(Date.parse(e.end)-Date.parse(e.start))/3600000;if(length>48)continue;const key=day(e.start).slice(0,7);const r=journalByMonth.get(key)||{work:0,rest:0,other:0};r[e.category==='work'?'work':['health','leisure','family'].includes(e.category)?'rest':'other']+=length;journalByMonth.set(key,r);}
 if(journalByMonth.size){const labels=[...journalByMonth.keys()].sort(),hours=sum=>labels.map(k=>({label:k.slice(2),value:journalByMonth.get(k)?.[sum]??0}));
  S.push(page('II / RECORDED LIFE AREAS',`${title(2,'TIME ALLOCATION','Arbeit, Aktivitäten & Erholung','Diese Visualisierung zählt nur ausdrücklich erfasste Zeiteinträge; freie Zeit ohne Eintrag wird nicht bewertet.')}<div class="av19-stats">${card('Zeit-Einträge',String(logs.length),'Unabhängig von Excel-Arbeitszeit')}${card('Erfasste Arbeit',`${fmt(hours('work').reduce((a,b)=>a+b.value,0))} h`,'Nur Arbeitskategorie')}${card('Erfasste Freizeit/Erholung',`${fmt(hours('rest').reduce((a,b)=>a+b.value,0))} h`,'Sport, Familie, Gesundheit')}</div>${fig('Dokumentierte Arbeitszeit nach Monat',annualBars(hours('work'),{label:'Zeitjournal Arbeit',format:'Stunden'}),'Zeitjournal-Kategorien; nicht mit Excel-Zeiterfassung zu addieren.')}${fig('Dokumentierte Freizeit und Erholung nach Monat',annualBars(hours('rest'),{label:'Zeitjournal Freizeit',format:'Stunden',color:'#b39c68'}),'Nur aktiv protokollierte Sessions, kein Anspruch auf Vollständigkeit.')}`));
 }
 // Garmin: last year's nightly dots, HRV and stress.
 const nights=inWindow(state.healthImports?.garminNights,w),sleep=nights.map(x=>({day:x.day,value:n(x.sleepMinutes)??(['deep','light','rem'].every(k=>n(x.totals?.[k])!==null)?['deep','light','rem'].reduce((s,k)=>s+x.totals[k],0):null)})).filter(x=>x.value>0&&x.value<1440);
 const hrv=inWindow(state.healthImports?.garminHrv,w).map(x=>({day:x.day,value:n(x.nightAverageMs)})).filter(x=>x.value>0&&x.value<500);
 const stressRaw=inWindow(state.healthImports?.garminWellness,w,'at').map(x=>({day:day(x.at),value:n(x.stress)})).filter(x=>x.value>=0&&x.value<=100);const stress=dailyMetricMeans(stressRaw);
 if(sleep.length||hrv.length||stress.length){S.push(chapter(3,'REST & RECOVERY','Schlaf, Stress & Regeneration','Körperliche Regeneration im tatsächlichen Zeitverlauf. Fehlende Nächte bleiben sichtbar fehlend.'));
  const sleepOriginal=sleep.length?guard(()=>cvGraph(renderSleepYearDistribution(nights.map(x=>({...x,sleepMinutes:n(x.sleepMinutes)})),w.end,'day'))):'';
  S.push(page('III / SLEEP',`${title(3,'REST & RECOVERY','Dein Schlaf im Jahresverlauf','Die Dauer jeder dokumentierten Nacht – auf einer einheitlichen Stundenskala.')}<div class="av19-stats">${card('Erfasste Nächte',String(sleep.length),`${w.days} Tage im Fenster`)}${card('Mittel der Messungen',mean(sleep.map(x=>x.value))!==null?`${fmt(mean(sleep.map(x=>x.value))/60,2)} h`:'—','Mittel der erfassten Nächte')}</div>${fig('Schlaf-Dot-Plot · gesamter Berichtszeitraum',annualDots(sleep.map(x=>({...x,value:x.value/60})),w,{label:'Schlafdauer',unit:'h',min:0}),'Punkte sind echte Nächte; die X-Achse umfasst den gesamten Zeitraum.')}${sleepOriginal?fig('Compass-Schlafjahr · Originalvisualisierung',sleepOriginal,'Die bestehende Compass-Schlafgrafik bleibt im Jahresbericht erhalten.'):''}`));
  if(hrv.length||stress.length)S.push(page('III / HRV & STRESS',`${title(3,'AUTONOMIC RECOVERY','HRV & Belastung','Zwei eigenständige Messgrößen – keine Verwechslung von Stressindex und Schlafwert.')}${fig('Nächtliche HRV',annualDots(hrv,w,{label:'HRV',unit:'ms',color:'#527da2'}),`${hrv.length} dokumentierte HRV-Messungen; Interpretation nur innerhalb des persönlichen Zeitverlaufs.`)}${fig('Garmin-Stress · Tagesmittel dokumentierter Messungen',annualDots(stress,w,{label:'Stress',unit:'Index',color:'#bd8469',min:0,max:100}),`${stress.length} Tage mit Messungen aus ${stressRaw.length} dokumentierten Stress-Messpunkten; Tagesmittel, kein lückenloses Stressprofil.`)}`));
 }
 S.push(...atlasPages(chartAtlas.health,3));
 // Body composition BIA: the original three graphics and no invented physiology.
 const bmi=bodyTransformationModel(state,{today:w.end,range:w.days>90?'365':'90'}),fit=bodyTransformationView(state,{today:w.end,range:w.days>90?'365':'90'}),bodySvgs=figures(fit,5);
 if(bmi.fitdays.length){S.push(chapter(4,'BODY & STRENGTH','Mein Körper','Gewicht, Körperfett und Muskelmasse als getrennte Veränderungen – keine erfundene Muskelzunahme.'));
  S.push(page('IV / BODY COMPOSITION',`${title(4,'BODY COMPOSITION','Körperzusammensetzung','Fitdays-BIA-Werte sind Schätzungen und reagieren unter anderem auf Hydratation und Messbedingungen.')}<div class="av19-stats">${card('Messzeitpunkte',String(bmi.fitdays.length),'Fitdays, dokumentiert')}${card('Gewicht',bmi.weight.last?`${fmt(bmi.weight.last.value)} kg`:'—','Letzter importierter Messwert')}${card('Muskelmasse',bmi.muscle.last?`${fmt(bmi.muscle.last.value)} kg`:'—','BIA-Schätzung')}</div>${fig('Gewicht',bodySvgs[0]||'','Einzelne gemessene Werte, fehlende Tage nicht interpoliert.')}${fig('Körperfett',bodySvgs[1]||'','Prozentualer BIA-Schätzwert; Unterschiede bei wenigen Messungen vorsichtig interpretieren.')}${fig('Muskelmasse',bodySvgs[2]||'','BIA-Muskelmasse ist kein direkter Nachweis von Muskelwachstum.')}`));
 }
 // Use synchronous, print-safe originals. The interactive anatomy SVG contains only a
 // loading placeholder until browser hydration; it cannot be copied into a static report.
 const strengthModel=guard(()=>strengthPeriod(state,{range:w.days>90?'365':'28',today:w.end}));
 if(strengthModel&&(strengthModel.sessions.length||strengthModel.knownSets)){
  const fronts=annualPremiumAnatomy(strengthModel,settings.anatomy?.FRONT_MUSCLES,'front')||guard(()=>detailedMuscleSvg(strengthModel,'front','roles'));
  const backs=annualPremiumAnatomy(strengthModel,settings.anatomy?.BACK_MUSCLES,'back')||guard(()=>detailedMuscleSvg(strengthModel,'back','roles'));
  const strengthDots=guard(()=>chartSvg(strengthTrainingDots(strengthModel),'Tagespunkte'));
  const groups=strengthModel.groups.filter(g=>g.primary||g.secondary).sort((a,b)=>(b.primary+b.secondary)-(a.primary+a.secondary)).slice(0,12);
  const groupBars=annualBars(groups.map(g=>({label:g.label,value:g.primary,color:'#397c6c'})),{label:'Dokumentierte Hauptsätze je Muskelgruppe',format:'Sätze',maxCount:12});
  S.push(page('IV / MUSCLE & STRENGTH',`${title(4,'STRENGTH INSIGHTS','Training & Muskelbalance','Aus bestätigten Garmin-/Coach-Sätzen berechnet. Originale Compass-Premium-Anatomie, statisch und druckfähig.')}<div class="av19-stats">${card('Trainingstage',String(strengthModel.trainingDays),'Garmin + Coach')}${card('Sätze mit Muskelzuordnung',String(strengthModel.knownSets),'Nur dokumentierte Sets')}${card('Offene Zuordnung',String(strengthModel.unassigned),'Unbekannt bleibt unbekannt')}</div><div class="av21-muscle-maps av22-muscle-maps">${fig('Vorderseite · Originalanatomie',fronts,'Rot: Hauptsätze · Gold: Nebenbeteiligung · Grau: nicht zugeordnet.')}${fig('Rückseite · Originalanatomie',backs,'Die Farbe beschreibt Satzbeteiligung, nicht Muskelwachstum oder EMG.')}</div>`,{}));
  if(strengthDots||groupBars)S.push(page('IV / STRENGTH PROGRESSION',`${title(4,'STRENGTH INSIGHTS','Training im Zeitverlauf','Dokumentierte Trainingstage und Hauptsatzverteilung; ohne Ergänzung fehlender Übungen.')}<div class="av19-stack">${fig('Trainingstage · Original-Dot-Plot',strengthDots,'Garmin und bestätigte Coach-Sätze.')}${fig('Muskelgruppen · klassifizierte Hauptsätze',groupBars,'Die Grafik enthält nur zugeordnete Sätze. Details siehe Trainingsjournal in Compass.')}</div>`));
 }
 /* Detailed body science now precedes body plots in the Editorial Edition. */
 S.push(...atlasPages(chartAtlas.sports,4));
 // Nutrition: 5 deliberately separated designed spreads, all based on actual journal.
 const food=entriesFor(state,w),dozen=annualDailyDozen(state,w);
 if(food.length){S.push(chapter(5,'NUTRITION & LONGEVITY','Meine Ernährung','Welche Ernährungsrhythmen und Nährstoffmuster sind in den dokumentierten Einträgen tatsächlich sichtbar?'));
  const isolated={...state,nutritionJournal:{...(state.nutritionJournal||{}),entries:food}},timing=guard(()=>figures(nutritionTimingView(isolated,{mode:'all',anchor:w.end,now:new Date(dayNumber(w.end))}),2)),energyDays=[...new Set(food.map(x=>day(x.at)))].filter(Boolean).sort();
  const energy=energyDays.map(d=>{const x=nutritionDay(isolated,d);return {day:d,value:x.totals?.kcal,known:x.coverage?.kcal?.known,entries:x.entries.length}}).filter(x=>Number.isFinite(x.value)&&x.known>0);
  S.push(page('V / ENERGY & RHYTHM',`${title(5,'NUTRITION','Energie und Essensrhythmus','Was wurde wann erfasst? Aufnahmemuster statt pauschaler Tagesdurchschnitte.')}<div class="av19-stats">${card('Einträge',String(food.length),'Speisen und Getränke')}${card('Protokollierte Tage',String(energyDays.length),`${w.days} Kalendertage insgesamt`)}${card('Tage mit kcal',String(energy.length),'Berechenbare Teilsummen')}</div>${fig('Ernährungs-Timing · Original-Dot-Plot',timing.find(x=>x.includes('ni725-dots'))||timing[0]||'','Originalgrafik aus Compass: Größe und Uhrzeit der Einträge.')}${fig('Dokumentierte Tagesenergie · kcal',annualDots(energy,w,{label:'kcal',unit:'kcal',color:'#bd8b65'}),'Nur bekannte Energieanteile: kein Nachweis der tatsächlich gesamten täglichen Aufnahme.')}`));
  S.push(page('V / DAILY DOZEN',`${title(5,'DR. GREGER','Daily Dozen über die Zeit','Die vollständigen zwölf Orientierungskategorien, bezogen auf Tage mit Tagebucheinträgen.')}${fig(`Protokollierte Portionen je erfasstem Tag · n = ${dozen.days}`,dozen.svg,`${dozen.assigned} konservativ zugeordnete Einzelbelege. Niedrige Balken können auch unvollständige Dokumentation bedeuten.`,{wide:true})}${essay('Was die Grafik aussagt','Sie beschreibt, welche Portionen in deinen Compass-Einträgen zugeordnet werden konnten. Sie behauptet nicht, dass du andere Lebensmittel nicht gegessen hast.','Quelle: Compass Daily-Dozen-Evidence-Ledger')}`));
  const macros=['protein','fat','carbs','fiber'];const macroHtml=macros.map(metric=>{const v=guard(()=>cvGraph(nutritionTrendsView(isolated,{mode:'all',anchor:w.end,metric,now:new Date(dayNumber(w.end))})));return fig({protein:'Eiweiß',fat:'Fett',carbs:'Kohlenhydrate',fiber:'Ballaststoffe'}[metric]||metric,v,`Originaler Compass-Nährstofftrend (${metric}); nur erfasste Teilmengen.`);}).filter(Boolean);
  if(macroHtml.length)S.push(page('V / MACRONUTRIENTS',`${title(5,'MACROS','Makronährstoffe','Echte Tageswerte statt einer unzulässigen extrapolierten Jahresbilanz.')}<div class="av19-quad">${macroHtml.join('')}</div>`));
  const fat=guard(()=>figures(nutritionFatView(isolated,{days:String(Math.min(w.days,365)),today:w.end}),4));
  if(fat.length)S.push(page('V / FAT QUALITY',`${title(5,'FATTY ACIDS','Fettqualität & Fettsäuren','Gesättigte, einfach und mehrfach ungesättigte Fettsäuren; die Abdeckung variiert je Lebensmittel.')}<div class="av19-stack">${fat.slice(0,3).map((s,i)=>fig(['Fettverteilung','Fettsäure-Verlauf','Weitere Fettkennzahlen'][i],s,'Originale Compass-Fettqualitätsgrafik; generische Produktwerte bleiben Schätzungen.')).join('')}</div>`));
  const phyto=guard(()=>figures(nutritionPhytoView(isolated,{period:Math.min(w.days,365),today:w.end}),3));
  if(phyto.length)S.push(page('V / PHYTONUTRIENTS',`${title(5,'PLANT COMPOUNDS','Pflanzenstoffe & Antioxidantien','Schätzwerte aus beschriebenen Lebensmitteln, keine gemessenen Antioxidantien im Blut.')}<div class="av19-stack">${phyto.slice(0,3).map((s,i)=>fig(['Polyphenole und weitere Pflanzenstoffe','Dokumentierte Lebensmittelgruppen','Pflanzliche Vielfalt'][i],s,'Vorhandene Compass-Phyto-Visualisierung.')).join('')}</div>`));
  const aa=guard(()=>antiAgingEightModel(isolated,w.end));if(aa?.rows?.length){
   S.push(page('V / ANTI-AGING EIGHT',`${title(5,'LONGEVITY','Anti-Aging Eight · acht konkrete Themen','Dokumentierte pflanzliche Ernährung und vorsichtige Orientierung nach Dr. Greger. Keine Biomarker- oder Lebensdauerprognose.')}<div class="av22-eight-grid">${aa.rows.map(x=>`<article class="av22-eight-item"><div class="av22-eight-head"><strong>${H(x.title)}</strong><span>${x.status==='observed'?'Dokumentiert':x.status==='partial'?'Teilinformation':x.status==='unmeasurable'?'Nicht messbar':'Nicht belegt'}</span></div><p>${H(x.value)}</p><small>${H(x.reason)}</small></article>`).join('')}</div>${essay('Beobachtung, keine medizinische Prognose',`Diese acht Themen wurden für den letzten erfassten Tag (${w.end}) geprüft. Sie sind keine acht messbaren Anti-Aging-Scores und dürfen nicht als Jahresstatistik interpretiert werden.`)}`));}

 }
 S.push(...annualFatKnowledge(state,w));
 S.push(...annualNutritionKnowledge(state,w));
 S.push(...atlasPages(chartAtlas.nutrition,5));
 // Finance: multi-panel + large sankey + monthly flow visualizations. No transfers as expense.
 const tx=settings.finance?inWindow(state.financeTransactions,w):[];
 if(tx.length){S.push(chapter(6,'THE FINANCIAL LIFE','Mein Geld','Wohin Geld geflossen ist – und was echte Ausgaben, Transfers oder Investitionen waren.'));
  const vm=financeViewModel(tx,'all'),fm=financeMonthlySeries(tx,'all');
  const months=fm.map(m=>({label:m.month.slice(2),value:m.expenseCents/100}));
  S.push(page('VI / THE FINANCIAL YEAR',`${title(6,'MONEY FLOW','Ausgaben im Jahresverlauf','Monatsbalken zeigen ausschließlich klassifizierte Konsumausgaben.')}<div class="av19-stats">${card('Buchungen',String(tx.length),'Erfasster Kontenbestand')}${card('Konsumausgaben',`${fmt(vm.expenseCents/100)} €`,'Ohne interne Transfers')}${card('Zu klären',String(vm.pending.length),'Noch nicht klassifiziert')}</div>${fig('Konsumausgaben · Monatsvergleich',annualBars(months,{label:'Monatliche Ausgaben',format:'€'}),'Unvollständige Monate sind nicht mit vollständigen Monaten gleichzusetzen.')}${fig('Spending Calendar · Originalgrafik',cvGraph(spendingCalendar(tx)),'Tage ohne Bankumsatz sind nicht automatisch konsumfreie Tage.')}`));
  const spending=annualFinanceCategories(tx),merchantRank=annualMerchantRanking(tx);
  if(spending.groups.length){
   const share=spending.topShare;
   S.push(page('VI / EXPENDITURE ANATOMY',`${title(6,'CATEGORY SPENDING','Wohin dein Geld tatsächlich floss','Die Hauptkategorien in Euro und Prozent. Nur geprüfte Konsumausgaben – keine Eigenüberträge, Abhebungen oder ungeklärte Buchungen.')}<div class="av19-stats">${card('Konsum',`${fmt(spending.total/100,0)} €`,'Nur klassifizierte Ausgaben')}${card('Größte Kategorie',H(spending.groups[0].name),`${fmt(share*100)} % der klassifizierten Ausgaben`)}${card('Kategorien',String(spending.groups.length),'Keine Transferkategorien')}</div>${fig('Die Ausgaben nach Hauptkategorie',annualCategoryBars(spending),'Länge und Betrag zeigen den Anteil an den klassifizierten Konsumausgaben.')}${essay('Was aus der Verteilung hervorsticht',`Die größte erfasste Ausgabenkategorie ist „${spending.groups[0].name}“ mit ${fmt(spending.groups[0].cents/100,0)} € bzw. ${fmt(share*100)} % der klassifizierten Konsumausgaben. Ob das viel oder wenig ist, erfordert einen Vergleichszeitraum und deine persönliche Einordnung.`,`${tx.length} Bankbuchungen im ausgewählten Zeitraum; ungeklärte und unvollständige Konten separat zu prüfen.`)}`));
   S.push(page('VI / UNDER THE SURFACE',`${title(6,'SUBCATEGORY LEDGER','Wohin das Geld innerhalb der Kategorien floss','Konkrete Unterkategorien, keine abstrakten Farbringe. Die Summen folgen der bestehenden Compass-Finanzklassifikation.')}<div class="av22-ledger">${annualCategoryRows(spending,7)}</div>${essay('Lesehilfe','Die Anteile beziehen sich auf die gesamten klassifizierten Konsumausgaben. Händler, die über Zahlungsdienste oder ungeklärte Buchungen laufen, können nur eingeschränkt zugeordnet werden.')}`));
   const radial=guard(()=>cvGraph(radialSankey(tx)));
   if(radial)S.push(page('VI / THE CATEGORY ATLAS',`${title(6,'RADIAL FLOWS','Der Konsum im Radialdiagramm','Innere und äußere Ringe zeigen dieselben echten Kategorien und Unterkategorien in der Compass-Visualisierung.')}<div class="av22-large-chart">${fig('Compass · Radial-Sankey nach Kategorien',radial,'Die Ringflächen zeigen klassifizierte Ausgaben; die präzisen Beträge stehen auf den vorhergehenden Seiten.',{wide:true})}</div>`));
   const voronoi=guard(()=>cvGraph(voronoiTreemap(tx)));
   if(voronoi)S.push(page('VI / THE CATEGORY LANDSCAPE',`${title(6,'VORONOI','Die Ausgaben als Flächen','Die originalen Compass-Voronoi-Zellen zeigen die Größenordnung der Hauptkategorien auf einen Blick.')}<div class="av22-large-chart">${fig('Compass · gewichtete Voronoi-Treemap',voronoi,'Die Zellflächen approximieren Anteile; exakte Beträge siehe Kategorienregister.',{wide:true})}</div>`));
   if(merchantRank.length){S.push(page('VI / THE MERCHANT INDEX',`${title(6,'FINANCIAL DETAIL','Bei welchen Händlern du Geld ausgegeben hast','Die wichtigsten ausgewerteten Zahlungspartner. Kein Kaufurteil – und Zahlungsdienste können verschiedene Zwecke bündeln.')}<table class="av19-table av22-merchant-table"><thead><tr><th>Händler / Zahlungspartner</th><th>Betrag</th><th>Anteil</th></tr></thead><tbody>${merchantRank.map(m=>`<tr><td>${H(m.name)}</td><td>${H(fmt(m.cents/100,2))} €</td><td>${H(fmt(m.cents/Math.max(1,spending.total)*100))} %</td></tr>`).join('')}</tbody></table>`));}
  }
  const sankey=guard(()=>cvGraph(hierarchicalSankey(tx,'all'))||cvGraph(expenseSankey(vm)));
  if(sankey)S.push(page('VI / FULL BLEED FINANCIAL ANATOMY',`${title(6,'FINANCIAL ANATOMY','Die Wege des Geldes','Detaillierter Sankey mit allen erfassten Wegen; keine Kategorie wird abgeschnitten.')}${fig('Geldströme · detaillierter Sankey',sankey,'Klassifizierte Ausgaben von Konten zu Kategorien und Zahlungspartnern. Im A4-Archiv vollständig; für feinere Beschriftungen die interaktive Finanzgrafik separat groß drucken.',{wide:true})}`,{wide:true}));
  const sunburst=guard(()=>cvGraph(signedSunburst(tx)));
  if(sunburst)S.push(page('VI / CATEGORY ANATOMY',`${title(6,'SPENDING STRUCTURE','Wofür das Geld eingesetzt wurde','Klassifizierte Ausgabenkategorien in der originalen Compass-Hierarchie.')}<div class="av19-hero-figure">${fig('Sunburst · Ausgabenkategorien',sunburst,'Signierter Sunburst mit Abgängen und Zuflüssen; Transferanteile sind in dieser Grafik separat gekennzeichnet und ausdrücklich kein Konsum.',{wide:true})}</div>`));
  const stream=guard(()=>cvGraph(spendingStreamgraph(tx)));
  if(stream)S.push(page('VI / COMPOSITION',`${title(6,'SPENDING PATTERNS','Wofür das Geld eingesetzt wurde','Die Verteilung der erfassten Ausgaben über die Zeit.')}${fig('Streamgraph · Ausgabenkategorien',stream,'Bestehender Compass-Streamgraph. Keine Kausalität oder Bewertung des Konsums.')}`));
 }
 if(tx.length&&settings.finance)S.push(...annualFinanceKnowledge(tx,w));
 // Sensitive person and feeling domains; never auto-included.
 const people=settings.people?Object.values(state.people||{}).filter(x=>x?.id&&x?.name):[];
 if(people.length){S.push(chapter(7,'HUMAN CONNECTIONS','Meine Menschen','Die Beziehungslandkarte dokumentiert Nähe-Einschätzungen. Sie bewertet keine Beziehungen.'));
  S.push(page('VII / RELATIONSHIP MAP',`${title(7,'HUMAN CONNECTIONS','Die Beziehungslandkarte','Freiwillig dokumentierte Nähe und soziale Lebensbereiche im Berichtsstand.')}${fig('Compass Relationship Map',guard(()=>cvGraph(relationshipMapView(people,null,{today:w.end}))),`Momentaufnahme von ${people.length} gespeicherten Kontakten, nicht der historische Verlauf ihrer Nähe.`)}`));
 }
 const fe=settings.feelings?inWindow(state.feelingCheckins,w,'at'):[];
 if(fe.length){S.push(chapter(8,'INNER LANDSCAPE','Meine Gefühlswelt','Keine emotionale Gesamtbewertung: nur freiwillig erfasste Erfahrungen und Intensitäten.'));
  const stats=feelingStats(fe,w.end,w.days),groups=stats.groups.slice(0,12),bar=annualBars(groups.map(g=>({label:g.label,value:g.count,color:g.color})),{label:'Gefühlsnennungen',format:'Nennungen'});
  S.push(page('VIII / THE INNER LANDSCAPE',`${title(8,'INNER LANDSCAPE','Gefühle im Rückblick','Häufigkeit und Intensität der selbst dokumentierten Gefühlswörter.')}<div class="av19-stats">${card('Check-ins',String(stats.entries),'Freiwillig erfasst')}${card('Tage',String(stats.activeDays),'Mit Check-in')}${card('Gefühlsnennungen',String(groups.reduce((n,g)=>n+g.count,0)),'Mehrfachnennungen möglich')}</div>${fig('Die dokumentierten Gefühle',bar,'Häufigkeiten ergeben keine psychologische Diagnose.')}${essay('Persönliche Interpretation','Die Häufigkeit einer Emotion zeigt, wie oft du sie erfasst hast – nicht, wie oft du sie tatsächlich erlebt hast.','Keine Hochrechnung auf nicht protokollierte Tage.')}`));
 }
 const visits=settings.places?inWindow(state.placesVisits,w,'start'):[];
 if(visits.length){S.push(chapter(9,'PLACES & JOURNEYS','Meine Welt','Wo ich gewesen bin, soweit Standortdaten vorhanden sind.'));
  const geo=guard(()=>cvGraph(placesInsightsView({visits,labels:state.placesLabels||{},nights:[],range:w,mapRegion:'world',mapZoom:1})));const clusters=placeClusters(visits,state.placesLabels||{},w);
  if(geo)S.push(page('IX / YOUR YEAR ON THE MAP',`${title(9,'THE GEOGRAPHY OF LIFE','Ein Jahr auf der Weltkarte','Dokumentierte Aufenthaltsorte im ganzen Jahr; keine permanente Ortung oder vollständige Reiseroute.')}${fig('My Year in Places · Compass Worldmap',geo,`${clusters.length} Gruppen aus ${visits.length} protokollierten Aufenthalten. Fehlende Ortsdaten sind keine Nichtbesuche.`)}`,{wide:true}));
 }
 // Evidence-led interdisciplinary discoveries: no unverified causality.
 S.push(chapter(10,'DISCOVERIES & DECISIONS','Was ich erkenne','Belegte Beobachtungen und mögliche nächste Schritte – nicht algorithmisch erfundene Geschichten.'));
 const corr=pairedCorrelation(sleep,hrv),cross=[];
 if(corr.valid)cross.push({title:'Schlaf und HRV',finding:`r = ${fmt(corr.r)} bei ${corr.n} gepaarten Messtagen`,note:'Deskriptiver Pearson-Zusammenhang, keine Kausalität. Dritte Einflüsse nicht kontrolliert.'});
 if(wd.length&&sleep.length){const workWeeks=new Map();for(const row of wd){const d=new Date(`${row.day}T12:00:00Z`),offset=(d.getUTCDay()+6)%7,k=dayShift(row.day,-offset);workWeeks.set(k,(workWeeks.get(k)||0)+row.hours);}const paired=[];for(const [week,h] of workWeeks){const end=dayShift(week,6),values=sleep.filter(x=>x.day>=week&&x.day<=end).map(x=>x.value);if(values.length>=3)paired.push({day:week,work:h,sleep:mean(values)});}const c=pairedCorrelation(paired.map(x=>({day:x.day,value:x.work})),paired.map(x=>({day:x.day,value:x.sleep})),{minPairs:8});if(c.valid)cross.push({title:'Arbeitsbelastung und Schlaf',finding:`r = ${fmt(c.r)} bei ${c.n} Wochen mit ≥ 3 Schlafnächten`,note:'Gleichzeitiger Wochenvergleich, ohne externe Einflussgrößen. Korrelation erklärt keine Ursachen.'});}
 if(wd.length>=10){const num=worktimeWeeks(wd,Number(w.end.slice(0,4))),high=num.filter(x=>x.hours>45).length;
  if(num.length>=8)cross.push({title:'Arbeitsbelastung · dokumentierte Wochen',finding:`${high} von ${num.length} Kalenderwochen über 45 h`,note:'Der Anteil bezieht sich nur auf Wochen mit erfasster Excel-Arbeitszeit; nicht erfasste Wochen bleiben unbekannt. Vergleiche Schlaf- und Erholungskurven zeitlich, ohne Ursachen zu behaupten.'});}
 if(tx.length&&settings.finance){const cat=annualFinanceCategories(tx);if(cat.total>0&&cat.groups.length){const major=cat.groups[0];cross.push({title:'Ausgabenstruktur · wichtigste Kategorie',finding:`${major.name}: ${fmt(major.cents/100,0)} € (${fmt(major.cents/cat.total*100)} % des Konsums)`,note:'Anteil an bestätigten Ausgaben; Transfers und ungeklärte Buchungen nicht enthalten. Kein normatives Sparurteil.'});}}
 if(bmi.fitdays.length>=3){const first=bmi.weight?.first?.value,last=bmi.weight?.last?.value;if(Number.isFinite(first)&&Number.isFinite(last))cross.push({title:'Körpergewicht · dokumentierte Entwicklung',finding:`${fmt(first)} kg → ${fmt(last)} kg (${last>=first?'+':''}${fmt(last-first)} kg)`,note:'Fitdays-Messpunkte; BIA-Muskel-/Fettanteile benötigen gleiche Messbedingungen und mehrere Vergleichsmessungen.'});}
 if(dozen.days>=5){const low=dozen.items.filter(x=>x.ratio<.25).map(x=>x.label).slice(0,3);if(low.length)cross.push({title:'Ernährungstagebuch · Dokumentationsmuster',finding:`Selten zugeordnet: ${low.join(', ')}`,note:`Nur ${dozen.days} erfasste Ernährungstage. Eine fehlende Zuordnung beweist keinen tatsächlichen Mangel.`});}
 const discoveryBatches=cross.length?Array.from({length:Math.ceil(cross.length/3)},(_,i)=>cross.slice(i*3,i*3+3)):[[]];
 for(const [batchNo,batch] of discoveryBatches.entries()){
  const offset=batchNo*3;
  const content=batch.map((x,i)=>`<article><span>DISCOVERY ${String(offset+i+1).padStart(2,'0')}</span><h3>${H(x.title)}</h3><strong>${H(x.finding)}</strong><p>${H(x.note)}</p></article>`).join('')||'<p>Im gewählten Zeitraum gibt es noch zu wenige hinreichend gepaarte Messwerte für eine überprüfbare übergreifende Korrelation.</p>';
  S.push(page('X / LONGITUDINAL INTELLIGENCE',`${title(10,'INSIGHTS',batchNo?'Weitere geprüfte Beobachtungen':'Trends & Zusammenhänge','Nur zeitlich und fachlich gedeckte Beobachtungen werden als Zusammenhänge bezeichnet.')}<div class="av19-discoveries">${content}</div>${batchNo===discoveryBatches.length-1?essay('Die Grenze jeder Erkenntnis','Zeitliche Nähe, Unterschiede zwischen Quartalen und Korrelationen liefern Fragen für das nächste Jahr. Sie beweisen keine Ursache und ersetzen keine medizinische oder finanzielle Beratung.'):''}`));
 }
 const suggestions=guidance.map((g,i)=>`<article class="av19-advice"><small>BELEG ${String(i+1).padStart(2,'0')} · ${H(g.area)}</small><h3>${H(g.observation)}</h3><p><b>Möglicher nächster Schritt:</b> ${H(g.suggestion)}</p><footer>${H(g.method)}</footer></article>`).join('');
 S.push(page('X / PERSONAL GUIDANCE',`${title(10,'THE YEAR AHEAD','Was ich ausprobieren könnte','Persönliche, datenbasierte Handlungsideen mit jeweils überprüfbarer Beobachtung.')}<div class="av19-advice-list">${suggestions||'<p>Die Voraussetzungen für individualisierte Empfehlungen sind noch nicht erfüllt. Compass erfindet keine Ratschläge aus Datenlücken.</p>'}</div>`));
 const sources=inv.sources.map(x=>`<tr><th>${H(x.label)}</th><td>${fmt(x.count,0)}</td><td>${H(x.last||'—')}</td><td>${x.stale?'Importstand prüfen':'Zeitnaher erfasster Stand'}</td></tr>`).join('');
 const domains=inv.items.map(i=>`<tr><th>${H(i.label)}</th><td>${fmt(i.count,0)}</td><td>${i.sensitive?'Nur bei Freigabe':'Automatisch'}</td><td>${i.available?'Dokumentiert':'Nicht im Report / keine Werte'}</td></tr>`).join('');
 S.push(page('APPENDIX / EVIDENCE LEDGER',`${title(11,'METHOD & SOURCES','Methodik & Datenqualität','Vollständigkeit ist etwas anderes als Aktualität. Für externe Quellen existiert keine automatische Garantie des neuesten Stands.')}<h3>Datenquellen & Aktualität</h3><table class="av19-table"><thead><tr><th>Quelle</th><th>Datensätze</th><th>Letzter Wert</th><th>Prüfhinweis</th></tr></thead><tbody>${sources}</tbody></table><h3>Kapitelinventar</h3><table class="av19-table"><thead><tr><th>Bereich</th><th>Anzahl</th><th>Freigabe</th><th>Status</th></tr></thead><tbody>${domains}</tbody></table>${essay('Datenstand',`Berichtszeitraum: ${w.start} bis ${w.end}. Erstellt ${new Date().toLocaleString('de-AT')}. Keine unprotokollierte Garmin-, Fitdays-, Banken- oder Standort-Synchronisierung wird angenommen.`)}`));
 S.push(page('COLOPHON / PRIVATE EDITION',`<div class="av19-endmark">◈</div><h2 class="av19-colophon">Ars Vivendi</h2><p class="av19-colophon-sub">A record of moments. A record of choices. A record of a life.</p><div class="av19-close-rule"></div><p>Compass Life · ${H(dateRange)}</p><p class="av19-note">Dieser persönliche Report wurde lokal im entsperrten Browser erstellt. Ausdrucke und PDFs enthalten vertrauliche Informationen. Berechnete Auswertungen sind auf den dokumentierten Datenstand begrenzt. Die originale Grafikbibliothek bleibt für die einzelnen Fachperspektiven erhalten.</p>`));
 const edition=editorialAnnualPages(S,state,w,settings);
 return `<!doctype html><html lang="de"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Compass · Ars Vivendi Annual · ${H(w.end)}</title><style>${ANNUAL_PRINT_CSS+ANNUAL_KNOWLEDGE_CSS+EDITORIAL_CSS+MICRO_ATLAS_CSS}</style></head><body><div class="av19-actions"><strong>ARS VIVENDI · PRIVATE ANNUAL</strong><span>Jahreschronik mit ${edition.length} gestalteten Reportbögen</span><button type="button" id="av21-print" onclick="window.print()">Als PDF drucken</button><button type="button" onclick="(function(){const b=new Blob(['<!doctype html>'+document.documentElement.outerHTML],{type:'text/html;charset=utf-8'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='Compass-Ars-Vivendi-${H(w.end)}.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000)})()">Offline-HTML sichern</button><small>Bei blockiertem Druckdialog: erst HTML lokal sichern und separat öffnen. Beim Drucken Kopf-/Fußzeilen aus, Hintergrundgrafiken an.</small></div><main class="av19-document">${edition.join('')}</main></body></html>`;
}
export function annualSetupView(state={},settings={}){
 const inv=annualInventory(state,settings);
 const flags=[['finance','Finanzen · Sankey & Ausgaben'],['places','Orte · persönliche Weltkarte'],['people','Menschen · Beziehungslandkarte'],['feelings','Innenwelt · Gefühlschronik']];
 return `<section class="clp-setup av19-setup" aria-label="Ars Vivendi Annual Edition"><div class="clp-title"><div><span class="page-overline">COMPASS LIFE / THE PRIVATE COLLECTION</span><h2>Ars Vivendi · Annual Edition</h2><p>Deine persönliche Jahreschronik. Großformatige Grafiken, echte Jahresverläufe, datenbasierte Entdeckungen – ohne unbelegte Zahlen.</p></div><span class="clp-mark">◈</span></div><div class="clp-inputs"><label>Zeitraum<select id="clp-period"><option value="month" ${settings.period==='month'?'selected':''}>30 Tage</option><option value="quarter" ${settings.period==='quarter'?'selected':''}>90 Tage</option><option value="year" ${(!settings.period||settings.period==='year')?'selected':''}>365 Tage · Annual</option></select></label></div><div class="av19-private"><h3>Private Kapitel – nur nach deiner Freigabe</h3><p>Finanz-, Aufenthalts-, Beziehungs- und Gefühlsdaten werden nicht automatisch in einen Report übernommen.</p>${flags.map(([key,label])=>`<label><input id="clp-${key}" type="checkbox" ${settings[key]?'checked':''}/><span>${H(label)}</span></label>`).join('')}</div><div class="clp-readiness"><h3>Report Readiness · geprüfte Datenabdeckung</h3>${inv.items.map(i=>`<div class="clp-source"><span>${i.available?'●':'○'} ${H(i.label)} <small>${i.sensitive?'Opt-in':'lokal'} · ${i.count} Werte</small></span><span>${i.available?'Vorhanden':'Keine Daten / nicht freigegeben'}</span></div>`).join('')}<p>Der Importstand wird angezeigt; damit ist kein automatischer Zugriff auf Garmin Connect, Fitdays oder Bankdaten belegt. Bitte bei Bedarf vor dem Ausdruck nachimportieren.</p></div><div class="clp-setup-actions"><button class="primary-btn" type="button" data-action="clp-preview" ${inv.items.some(i=>i.available)?'':'disabled'}>Annual-Vorschau öffnen / PDF</button><button class="secondary-btn" type="button" data-action="clp-ai">Belegte Einsichten lokal priorisieren</button><button class="secondary-btn" type="button" data-action="clp-refresh">Verbindungen & Importstand prüfen</button></div><p class="muted-line" role="status">${H(settings.aiStatus||'Keine Daten werden zu einem fremden PDF-Dienst übertragen. Lokale KI darf keine neuen Fakten ergänzen.')}</p></section>`;
}
export const ANNUAL_PRINT_CSS=`
@page{size:A4;margin:0}
*{box-sizing:border-box}html,body{margin:0;padding:0}body{background:#d9dedb;color:#203b33;font-family:Georgia,'Times New Roman',serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.av19-actions{position:sticky;top:0;z-index:9;display:flex;align-items:center;gap:17px;flex-wrap:wrap;background:#fff;padding:12px 28px;font:12px system-ui,sans-serif;color:#3c5047}.av19-actions button{background:#12372c;color:#fff;border:0;padding:11px 16px;border-radius:7px;cursor:pointer}.av19-actions span{flex:1}
.av19-document{margin:20px auto;width:210mm;box-shadow:0 10px 34px #0002}.av19-page{page-break-after:always;break-after:page;position:relative;width:210mm;height:297mm;padding:14mm 21mm 13mm;background:#fff;overflow:hidden;display:flex;flex-direction:column;gap:4mm}.av19-page:last-child{break-after:auto}.av19-landscape{width:210mm;height:297mm;padding:14mm 21mm 13mm}.av19-running{display:flex;justify-content:space-between;font:9px/1.2 system-ui,sans-serif;letter-spacing:.20em;color:#708078;border-bottom:1px solid #dce5df;padding-bottom:5mm}.av19-running span{color:#ae9466}.av19-kicker,.av19-overline{font:10px/1.2 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#aa8a5d}.av19-kicker{margin-top:0}.av19-heading h2{font-size:29px;font-weight:400;line-height:1.22;color:#183c33;margin:7px 0 9px}.av19-heading p{font:12px/1.65 system-ui,sans-serif;color:#64746b;margin:0;max-width:145mm}.av19-figure{width:100%;margin:0;display:flex;flex-direction:column;gap:3mm;break-inside:avoid;min-width:0}.av19-figure figcaption{font:600 11px/1.3 system-ui,sans-serif;letter-spacing:.03em;color:#2f5d4c}.av19-figure svg{width:100%;max-width:100%;height:auto;max-height:100mm;display:block;overflow:hidden;color:#324e43}.av19-figure svg text{font-family:'Helvetica Neue',Arial,sans-serif}.av19-figure p{font:9px/1.55 system-ui,sans-serif;color:#758079;margin:1px 0}.av19-figure-wide svg{max-height:165mm}.av19-landscape .av19-heading p{max-width:160mm}.av19-landscape .av19-figure svg{max-height:165mm}
.av21-muscle-maps{display:grid;grid-template-columns:1fr 1fr;gap:8mm;align-items:start}.av21-muscle-maps .av19-figure svg{height:135mm;max-height:135mm;max-width:100%;width:auto;margin:0 auto}.av21-muscle-maps .av19-figure{align-items:center;text-align:center}.av19-stack{display:grid;gap:8mm}.av19-stack .av19-figure svg{max-height:57mm}.av19-quad{display:grid;grid-template-columns:1fr 1fr;gap:9mm 5mm}.av19-quad .av19-figure svg{max-height:65mm}.av19-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.av19-stat{border-top:1px solid #c7d7ca;padding:3mm 0 2mm;min-width:0}.av19-stat small{font:10px/1.25 system-ui,sans-serif;color:#6c8076;display:block}.av19-stat b{font:400 24px/1.3 Georgia,serif;color:#154633;display:block;letter-spacing:-.02em}.av19-stat span{font:9px/1.45 system-ui,sans-serif;color:#8b938e;display:block}.av19-comment{margin-top:auto;background:#f4f7f4;border-left:2px solid #c7a772;padding:5mm 6mm}.av19-comment strong{font-size:14px;font-weight:400;color:#284b3b}.av19-comment p{font-size:12px;line-height:1.65;margin:2mm 0}.av19-comment small{font:9px/1.5 system-ui,sans-serif;color:#74877c}.av19-cover{background:#0c2d25;color:#faf5e9;justify-content:space-between;padding:20mm 23mm}.av19-brand{display:flex;gap:13px;align-items:center;font-size:39px;color:#cdb27b}.av19-brand span{font:10px system-ui,sans-serif;letter-spacing:.18em}.av19-cover-middle{margin-bottom:23mm}.av19-cover-middle small{font:10px system-ui,sans-serif;letter-spacing:.3em;color:#dfcf9d}.av19-cover-middle h1{font:400 66px/1.1 Georgia,serif;letter-spacing:-.04em;margin:17px 0}.av19-cover-middle p{font-size:21px;font-style:italic;color:#ddc18b}.av19-cover-rule{border-top:1px solid #87764f;margin:25mm 0 9mm}.av19-cover-middle em{font:12px system-ui,sans-serif;color:#e1d7b8}.av19-cover-bottom{display:flex;justify-content:space-between;border-top:1px solid #87764f;padding-top:7mm;font:9px system-ui,sans-serif;letter-spacing:.16em;color:#bfa878}.av19-chapter{justify-content:center;background:#f5f4ef}.av19-chapter-label{font:14px system-ui,sans-serif;letter-spacing:.2em;color:#b69663}.av19-chapter h1{font:400 54px/1.1 Georgia,serif;margin:5mm 0;color:#183d32}.av19-chapter .av19-lead{font-size:20px;line-height:1.6;color:#6c7769;max-width:115mm}.av19-ornament{font-size:51px;color:#b6a079;margin-top:12mm}.av19-fact-list{display:grid;gap:5mm}.av19-fact-list article{display:flex;gap:5mm;border-bottom:1px solid #e7eee8;padding-bottom:4mm}.av19-fact-list article>span{font:12px system-ui,sans-serif;color:#bf9d6f}.av19-fact-list b{font-weight:400;font-size:13px}.av19-fact-list small{display:block;margin-top:2mm;font:10px system-ui,sans-serif;color:#789080}.av19-discoveries{display:grid;gap:7mm}.av19-discoveries article,.av19-advice{border-left:2px solid #beab7a;padding:3mm 5mm;background:#f6f7f2}.av19-discoveries article>span,.av19-advice small{font:9px system-ui,sans-serif;letter-spacing:.16em;color:#9b7e55}.av19-discoveries h3,.av19-advice h3{font:400 22px Georgia,serif;color:#173d32;margin:4mm 0}.av19-discoveries strong{font:17px Georgia,serif}.av19-discoveries p,.av19-advice p{font:12px/1.6 system-ui,sans-serif}.av19-advice-list{display:grid;gap:5mm}.av19-advice{break-inside:avoid}.av19-advice h3{font-size:16px;margin:2mm 0}.av19-advice footer{font:9px/1.5 system-ui,sans-serif;color:#728479}.av19-table{border-collapse:collapse;width:100%;font:10px/1.5 system-ui,sans-serif}.av19-table th,.av19-table td{padding:6px 4px;text-align:left;border-bottom:1px solid #e0e8e1;overflow-wrap:anywhere}.av19-table th{color:#396050}.av19-page>h3{font-weight:400;color:#375a48;margin:3mm 0 0}.av19-endmark{margin-top:50mm;font-size:60px;color:#bda878}.av19-colophon{font:400 50px Georgia,serif;margin:0}.av19-colophon-sub{font-style:italic;font-size:19px;color:#a48650}.av19-close-rule{border-top:1px solid #b5a075;margin:20mm 0 5mm}.av19-note{font:11px/1.9 system-ui,sans-serif;color:#84918c;margin-top:auto}.av19-setup .av19-private{border:1px solid #d7e4dc;border-radius:12px;padding:13px;margin-top:12px}.av19-private label{display:flex;gap:8px;align-items:center;margin:9px 0}.av19-private p{color:#718476;font-size:12px}

.av22-muscle-maps .av19-figure svg.av22-anatomy-detailed{height:155mm;max-height:155mm;max-width:100%;width:100%;object-fit:contain}
.av22-muscle-maps .av19-figure figcaption{font-size:12px}
.av22-finance-category-chart{width:100%;height:auto;max-height:155mm!important}
.av22-ledger{flex:1;min-height:0;overflow:hidden}
.av22-subcategory-table{font-size:10px;line-height:1.3}
.av22-subcategory-table td,.av22-subcategory-table th{padding:4px 5px}
.av22-subcategory-table .av22-parent{background:#edf4ef;color:#183a30;font-weight:bold}
.av22-subcategory-table td:nth-child(n+2),.av22-subcategory-table th:nth-child(n+2){white-space:nowrap;text-align:right}
.av22-large-chart{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.av22-large-chart .av19-figure{width:100%;max-height:205mm}
.av22-large-chart .av19-figure svg{width:100%;height:auto;max-height:190mm}
.av22-eight-grid{display:grid;grid-template-columns:1fr 1fr;gap:4mm;min-height:0}
.av22-eight-item{border-top:1px solid #cddbd1;padding:3mm 1mm;min-width:0}
.av22-eight-head{display:flex;justify-content:space-between;align-items:baseline;gap:2mm}
.av22-eight-head strong{font:15px Georgia,serif;color:#234a3e}
.av22-eight-head span{font:8px system-ui,sans-serif;color:#9f8057;white-space:nowrap}
.av22-eight-item p{font:11px/1.45 system-ui,sans-serif;color:#385c51;margin:2mm 0}
.av22-eight-item small{font:9px/1.45 system-ui,sans-serif;color:#75877c}
.av22-merchant-table{font-size:13px;line-height:1.5}
.av22-merchant-table td,.av22-merchant-table th{padding:9px 5px}
.av22-merchant-table td:nth-child(n+2),.av22-merchant-table th:nth-child(n+2){text-align:right}
@media print{html,body{background:#fff}.av19-actions{display:none}.av19-document{margin:0;width:auto;box-shadow:none}.av19-page{margin:0}}
`;
