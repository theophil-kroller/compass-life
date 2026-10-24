/** Compass 0.5.77.38 · Original, responsive strength dashboard design.
 * Documented sets are counts, not muscle activation measurements. Cycling remains a
 * separate qualitative biomechanical overlay; never converted into resistance sets.
 */
import {detailedMuscleSvg,detailedMuscleData} from './strength-anatomy-v57737.js';
const e=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
const fmt=(v,d=0)=>Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:d}):'–';
const isDay=x=>/^\d{4}-\d{2}-\d{2}$/.test(x||'');
const shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
const dayShort=d=>`${d.slice(8)}.${d.slice(5,7)}.`;
const countSets=s=>Math.max(s.sets?.length||0,s.reportedSets||0);

export function strengthPremiumTimeline(model,cycling={sessions:[]},{range='28',today}={}){
 const end=isDay(today)?today:model.today;
 const number=range==='all'?56:Math.min(Math.max(Number(range)||28,7),56);
 const totals=new Map();
 for(const s of model.sessions||[]){const r=totals.get(s.day)||{strength:0,cycling:0};r.strength+=countSets(s);totals.set(s.day,r);}
 for(const s of cycling.sessions||[]){const r=totals.get(s.day)||{strength:0,cycling:0};r.cycling+=Number(s.durationMinutes)||0;totals.set(s.day,r);}
 const rows=Array.from({length:number},(_,i)=>{const day=shift(end,i+1-number);return {day,...(totals.get(day)||{strength:0,cycling:0})};});
 const weekLabels=[];for(let i=0;i<rows.length;i+=7)weekLabels.push(`<span>${e(dayShort(rows[i].day))}</span>`);
 const boxes=rows.map(row=>{
  const strength=row.strength>0,bike=row.cycling>0,level=strength?(row.strength>=10?4:row.strength>=6?3:row.strength>=3?2:1):0;
  const cls=strength&&bike?`is-both level-${level}`:strength?`is-strength level-${level}`:bike?'is-cycling':'is-unknown';
  return `<span class="str738-day ${cls}" tabindex="0" role="img" aria-label="${e(row.day)}: ${row.strength} dokumentierte Kraftsätze, ${fmt(row.cycling)} Radfahrminuten" title="${e(dayShort(row.day))} · ${row.strength?row.strength+' Kraftsätze':'keine protokollierten Kraftsätze'}${row.cycling?' · '+fmt(row.cycling)+' Min. Radfahren':''}"></span>`;
 }).join('');
 return `<div class="str738-calendar" aria-label="Trainingsraster"><div class="str738-calendar-head"><strong>TRAININGSRHYTHMUS</strong><span>${fmt(number)} Tage · jeder Punkt ein Kalendertag</span></div><div class="str738-calendar-grid" style="--str738-days:${number}">${boxes}</div><div class="str738-calendar-labels">${weekLabels.join('')}</div><div class="str738-calendar-legend"><span><i class="str738-legend-swatch set"></i>Kraft</span><span><i class="str738-legend-swatch bike"></i>Radfahren</span><span><i class="str738-legend-swatch none"></i>Keine Aufzeichnung</span></div></div>`;
}
export function strengthPremiumKpis(model,cycling={rides:0,minutes:0}){
 const complete=model.events?.filter(s=>Number.isFinite(s.reps)&&s.reps>0)||[];
 const measuredReps=complete.reduce((sum,s)=>sum+s.reps,0);
 const knownReps=complete.length>0;
 const reported=model.csvOnlyReps>0?model.csvOnlyReps:0;
 const minutes=(model.sessions||[]).reduce((sum,s)=>sum+(Number(s.durationMinutes)||0),0);
 const kpis=[
  ['AKTIVE SÄTZE',model.activeSets===0&&model.sessions.length?'–':fmt(model.activeSets),'Garmin / eigene Einträge'],
  ['WIEDERHOLUNGEN',knownReps?fmt(measuredReps):reported?fmt(reported):'–',knownReps?'aus erfassten Einzelsätzen':reported?'aus Garmin-CSV':'noch nicht erfasst'],
  ['GEWICHTSVOLUMEN',model.volumeKg==null?'–':fmt(model.volumeKg,1)+' kg','nur dokumentierte kg × Wdh.'],
  ['KRAFTZEIT',minutes>0?fmt(minutes/60,1)+' h':'–','nur Aktivitäten mit Dauer'],
  ['RADFAHRTEN',fmt(cycling.rides||0),`${fmt(cycling.minutes||0)} Min. · getrennt gezählt`]
 ];
 return `<div class="str738-kpis">${kpis.map(([a,b,c])=>`<div class="str738-kpi"><small>${e(a)}</small><strong>${e(b)}</strong><span>${e(c)}</span></div>`).join('')}</div>`;
}
/** Re-color our own 25-region anatomical SVG as subdued line art on an ink background.
 * The geometry and per-region labels remain live SVG paths, keyboard focusable.
 */
export function premiumStrengthSvg(model,side,mode,cycling,activity){
 return detailedMuscleSvg(model,side,mode,cycling,activity)
  .replace('class="str728-body str737-detail-svg"','class="str728-body str737-detail-svg str738-body"')
  .replaceAll('fill="#F3F5F3"','fill="#1d2530"')
  .replaceAll('fill="#F0F1F0"','fill="#1d2530"')
  .replaceAll('fill="#F2F3F2"','fill="#222c38"')
  .replaceAll('stroke="#D4DAD7"','stroke="#85919d"')
  .replaceAll('stroke="#D3D8D5"','stroke="#71808e"')
  .replaceAll('fill="#E1E4E3"','fill="#303a48"')
  .replaceAll('stroke="#fff"','stroke="#101923"')
  .replaceAll('stroke="#F9FAF9"','stroke="#74808b"');
}
export function strengthPremiumRanking(model,cycling,activity='combined'){
 const data=detailedMuscleData(model),showStrength=activity!=='cycling',showCycling=activity!=='strength'&&(cycling?.rides||0)>0;
 const regions=Object.values(data.regions).filter(r=>(showStrength&&r.index>0)||(showCycling&&(cycling.regions.primary.includes(r.id)||cycling.regions.secondary.includes(r.id))));
 const sorted=regions.sort((a,b)=>(showStrength?b.index-a.index:0)||(cycling?.regions.primary.includes(b.id)?1:0)-(cycling?.regions.primary.includes(a.id)?1:0)).slice(0,9);
 const peak=Math.max(1,...sorted.map(r=>r.index));
 const bars=sorted.map((r,i)=>{
  const bike=showCycling&&(cycling.regions.primary.includes(r.id)||cycling.regions.secondary.includes(r.id));
  const index=showStrength?r.index:0;
  const width=showStrength&&index?Math.max(8,index/peak*100):bike?28:0;
  const label=showStrength&&index?`${fmt(r.primary)} Haupt · ${fmt(r.secondary)} Neben`:bike?'Radfahren · anatomische Beteiligung':'keine Zuordnung';
  return `<div class="str738-muscle-row"><span class="str738-muscle-rank">${i+1}</span><span class="str738-muscle-name">${e(r.label)}</span><span class="str738-muscle-track"><i style="width:${width}%" class="${bike&&!index?'is-biking':''}"></i></span><span class="str738-muscle-detail">${e(label)}</span></div>`;
 }).join('');
 return `<section class="str738-ranked" aria-label="Muskelregionen nach Satzbeteiligung"><div class="str738-rank-head"><h3>MUSKELBETEILIGUNG</h3><span>${fmt(data.mapped)} zugeordnete Sätze · ${fmt(data.unmapped)} noch offen</span></div>${bars||'<p>Ordne im Satzeditor Übungen zu, um die Muskelbeteiligung zu sehen. Radfahrten werden separat berücksichtigt.</p>'}<p>Eine Satzbeteiligung ist keine Messung von Muskelaktivierung, Ermüdung oder Wachstum. Radfahrminuten werden nicht in Sätze umgerechnet.</p></section>`;
}
export function strengthPremiumMap(model,cycling,activity='combined',side='front'){
 const mode=side==='back'?'load':'roles';
 const legend=mode==='roles'?[['#E64B38','Hauptmuskel'],['#F8C94A','Unterstützend']]:[['#F6D763','Wenige Sätze'],['#F1872E','Mehr'],['#C83C3C','Viele']];
 if(activity!=='strength'&&cycling?.rides)legend.push(['#F28C25','Radfahren (primär)']);
 legend.push(['#303a48','Nicht zugeordnet']);
 const front=premiumStrengthSvg(model,'front',mode,cycling,activity),back=premiumStrengthSvg(model,'back',mode,cycling,activity);
 const disclaimer=activity==='cycling'?'Qualitative Beanspruchung beim Treten; keine gemessene Kraft oder Muskelermüdung.':activity==='combined'?'Krafttraining und Radfahren sind getrennte Datentypen; Farben zeigen Beteiligung, keine addierten Kraftsätze.':'Satzbasierte Zuordnung, keine direkte physiologische Messung.';
 return `<section class="str738-visual" aria-label="Große Muskelkarte vorne und hinten"><header class="str738-visual-head"><div><span class="str738-eyebrow">ANATOMISCHE ÜBERSICHT</span><h3>Deine beanspruchten Muskeln</h3></div><span class="str738-mode-label">${activity==='cycling'?'RAD':activity==='strength'?'KRAFT':'KRAFT + RAD'}</span></header><div class="str738-figures"><figure><div class="str738-figure">${front}</div><figcaption>VORNE</figcaption></figure><figure><div class="str738-figure">${back}</div><figcaption>HINTEN</figcaption></figure></div><div class="str738-visual-legend">${legend.map(([color,label])=>`<span><i style="background:${color}"></i>${e(label)}</span>`).join('')}</div><p class="str738-map-note">${e(disclaimer)}</p></section>${strengthPremiumRanking(model,cycling,activity)}`;
}
