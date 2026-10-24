/** Compass 0.5.77.26 · Nutrition Insights 2.
 * Source-aware daily dot plots, macro trends, micronutrient reference averages,
 * caffeine/salt context, weekday distributions. Pure/read-only, incremental cache.
 * Every metric is based on logged, known portions ONLY; missing != zero.
 */
import {nutritionFoods} from './personal-journal-v5692.js';
import {nutrientEntry,NUTRIENT_LABELS} from './nutrition-intelligence-v57712.js';
import {DAILY_NRV,CAFFEINE_EFSA_ADULT_ORIENTATION_MG} from './nutrition-reference-v57722.js';
import {macroSuggestions} from './macro-goals-v57723.js';
import {nutritionTimingPeriod,shiftNutritionTimingPeriod} from './nutrition-timing-v57725.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeNum=x=>Number.isFinite(x)?x:null;
const round=x=>Math.round(x*100)/100;
const dayOf=stamp=>{const d=new Date(stamp);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const dayDate=x=>new Date(x+'T12:00:00');
const weekday=day=>(dayDate(day).getDay()+6)%7;
const fmt=n=>Number.isFinite(n)?n.toLocaleString('de-AT',{maximumFractionDigits:1}):'–';
const avg=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const icons={kcal:'⚡',protein:'💪',fat:'🥑',carbs:'🌾',fiber:'🌿',sugar:'🍬',saturated:'🧈',salt:'🧂',caffeine:'☕',vitaminA:'👁️',vitaminC:'🍊',vitaminD:'☀️',vitaminE:'🌻',vitaminB1:'🌾',vitaminB2:'🥛',vitaminB6:'🌰',vitaminB12:'🧬',calcium:'🦴',magnesium:'💪',iron:'🩸',zinc:'🛡️',potassium:'🍌',iodine:'🌊',selenium:'🔬',folate:'🥦'};
export const NUTRIENT_TREND_METRICS=Object.freeze([
 {key:'protein',label:'Protein',unit:'g',color:'#4B83AB'},
 {key:'carbs',label:'Kohlenhydrate',unit:'g',color:'#D77A5F'},
 {key:'fat',label:'Fett',unit:'g',color:'#BC8B55'},
 {key:'fiber',label:'Ballaststoffe',unit:'g',color:'#608A70'},
 {key:'sugar',label:'Zucker',unit:'g',color:'#BF7592'},
 {key:'saturated',label:'Gesättigte Fette',unit:'g',color:'#9A86A7'},
 {key:'salt',label:'Salz',unit:'g',color:'#D27C56'},
 {key:'caffeine',label:'Koffein',unit:'mg',color:'#5E769C'}
]);
export const NUTRIENT_TREND_MICROS=Object.freeze(['vitaminC','vitaminD','vitaminB12','vitaminE','vitaminA','calcium','magnesium','iron','zinc','potassium','iodine','selenium','vitaminB1','vitaminB2','vitaminB6']);
const metricByKey=new Map(NUTRIENT_TREND_METRICS.map(x=>[x.key,x]));
const cache=new WeakMap();
const newBucket=()=>({items:new Map(),summary:null});
function summarize(day,b){
 const items=[...b.items.values()],totals={},coverage={};
 const keys=[...new Set([...Object.keys(NUTRIENT_LABELS),'caffeine'])];
 for(const key of keys){
  let known=0,unknown=0,estimated=0,partial=0,minimum=0,value=0;
  for(const item of items){const v=item.values[key];
   if(Number.isFinite(v)){known++;value+=v;if(item.estimated.has(key))estimated++;if(item.partial.has(key))partial++;if(item.minimum.has(key))minimum++;}
   else unknown++;
  }
  coverage[key]={known,unknown,estimated,partial,minimum};
  if(known)totals[key]=round(value);
 }
 return {day,entries:items.length,totals,coverage};
}
const entryFingerprint=e=>JSON.stringify([e.id,e.foodId,e.at,e.amount,e.note,e.updatedAt,e.deleted]);
/** Recalculate only dirty dates. Both edits and changed product profiles invalidate
 * the correct cache partitions, without adding new keys to the encrypted vault. */
export function nutritionTrendsIndex(state){
 const journal=state?.nutritionJournal||{},raw=Array.isArray(journal.entries)?journal.entries:[];
 const foods=nutritionFoods(state),foodById=new Map(foods.map(f=>[f.id,f]));
 const foodSignature=foods.map(f=>JSON.stringify([f.id,f.updatedAt,f.nutrients,f.nutrientBasis,f.kcalLow,f.kcalHigh,f.defaultAmount])).join('|');
 let index=cache.get(state);
 if(!index||index.foodSignature!==foodSignature){index={foodSignature,rows:new Map(),days:new Map()};cache.set(state,index);}
 const seen=new Set(),dirty=new Set();
 const unlink=old=>{const bucket=index.days.get(old.day);if(bucket){bucket.items.delete(old.id);dirty.add(old.day);if(!bucket.items.size)index.days.delete(old.day);}};
 for(const entry of raw){
  if(!entry||!entry.id)continue;
  const id=String(entry.id);seen.add(id);const sig=entryFingerprint(entry),old=index.rows.get(id);
  if(old?.sig===sig)continue;
  if(old)unlink(old);
  if(entry.deleted||!Number.isFinite(Date.parse(entry.at))){index.rows.delete(id);continue;}
  const day=dayOf(entry.at);if(!day){index.rows.delete(id);continue;}
  const data=nutrientEntry(foodById.get(entry.foodId),entry),values={...data.values};
  const estimated=new Set(data.estimatedKeys),partial=new Set(data.partialKeys),minimum=new Set();
  // Bioactive ingredient values are per part. Never count a compound twice.
  // A minimum/estimate stays labelled even when there are mixed-source meals.
  const extras=(data.parts||[]).flatMap(p=>p.extra||[]).filter(e=>e.key==='caffeine');
  const knownCaf=extras.filter(e=>Number.isFinite(e.value));
  if(knownCaf.length){values.caffeine=round(knownCaf.reduce((a,e)=>a+e.value,0));
   if(knownCaf.some(e=>e.mode==='estimate'))estimated.add('caffeine');
   if(knownCaf.some(e=>e.mode==='minimum'))minimum.add('caffeine');
   if(knownCaf.length<extras.length)partial.add('caffeine');
  }
  // Any quantified values from approximate recipe profiles are estimates.
  const record={id,sig,day,values,estimated,partial,minimum};
  index.rows.set(id,record);if(!index.days.has(day))index.days.set(day,newBucket());
  index.days.get(day).items.set(id,record);dirty.add(day);
 }
 for(const [id,old] of index.rows)if(!seen.has(id)){unlink(old);index.rows.delete(id);}
 for(const day of dirty){const bucket=index.days.get(day);if(bucket)bucket.summary=summarize(day,bucket);}
 return index;
}
export function nutritionTrendsSeries(state,{mode='week',anchor=dayOf(new Date()),now=new Date(),metric='protein'}={}){
 const period=nutritionTimingPeriod(mode,anchor,now),index=nutritionTrendsIndex(state);
 const days=period.mode==='all'?[...index.days.keys()].filter(d=>d<=period.today).sort():period.days;
 const rows=days.map(day=>index.days.get(day)?.summary||summarize(day,newBucket()));
 const knownRows=rows.filter(r=>r.coverage[metric]?.known>0);
 const observed=rows.filter(r=>r.entries>0),partialDays=knownRows.filter(r=>r.coverage[metric].unknown||r.coverage[metric].partial).length;
 const estimatedDays=knownRows.filter(r=>r.coverage[metric].estimated||r.coverage[metric].minimum).length;
 const goal=macroSuggestions(state),preferred=goal.prefs?.enabled&&goal.ready;
 const guide={protein:preferred?goal.protein:null,carbs:preferred?goal.carbs:null,fat:preferred?goal.fat:null,salt:5,caffeine:CAFFEINE_EFSA_ADULT_ORIENTATION_MG}[metric]??null;
 const guideKind=['salt','caffeine'].includes(metric)?'upper':preferred?'orientation':'none';
 const weekdayGroups=Array.from({length:7},(_,i)=>({weekday:i,rows:knownRows.filter(r=>weekday(r.day)===i)})).map(group=>({...group,mean:avg(group.rows.map(r=>r.totals[metric]))}));
 return {period,rows,observed,knownRows,metric,guide,guideKind,weekdayGroups,
  mean:avg(knownRows.map(r=>r.totals[metric])),coverage:{observedDays:observed.length,knownDays:knownRows.length,partialDays,estimatedDays,missingDays:observed.length-knownRows.length}};
}
export function nutrientMicroSummary(state,{mode='week',anchor=dayOf(new Date()),now=new Date()}={}){
 // Derive from the already cached daily entry summaries. The averaging base is
 // *days with a known measured/estimated value*, not all dates of the calendar.
 const {period,rows,observed}=nutritionTrendsSeries(state,{mode,anchor,now});
 return {period,logged:observed.length,items:NUTRIENT_TREND_MICROS.map(key=>{
  const nrv=DAILY_NRV[key],matching=observed.filter(r=>r.coverage[key]?.known>0),values=matching.map(r=>r.totals[key]);
  const known=matching.length,partial=matching.filter(r=>r.coverage[key].unknown||r.coverage[key].partial).length;
  const estimated=matching.filter(r=>r.coverage[key].estimated>0).length;
  const mean=avg(values);return {key,label:NUTRIENT_LABELS[key]?.[0]||key,unit:NUTRIENT_LABELS[key]?.[1]||'',reference:nrv,
   mean,percent:Number.isFinite(nrv)&&nrv>0&&mean!==null?mean/nrv*100:null,known,missing:observed.length-known,partial,estimated};
 })};
}
function goalText(series){if(series.guide===null)return '';
 return series.guideKind==='upper'?`${series.metric==='salt'?'WHO-Salzorientierung':'EFSA-Koffeinorientierung'} · ${fmt(series.guide)} ${metricByKey.get(series.metric)?.unit||''} (kein Ziel)`:`Individuelle Makroorientierung · ${fmt(series.guide)} g (optional aktiviert)`;
}
/** SVG daily dot scatter; all-time mode permits horizontal scrolling for 1-year+
 * precision instead of compressing 365 exact observations into meaningless pixels. */
function dotGraph(series){
 const {rows,metric,guide,knownRows,period}=series,def=metricByKey.get(metric),width=period.mode==='all'?Math.max(870,rows.length*9+105):925,height=257,left=57,right=width-20,top=19,bottom=216;
 if(!rows.length||!knownRows.length)return '<p class="muted-line">Für diesen Nährstoff liegen im Zeitraum noch keine quantifizierten Tage vor.</p>';
 const upper=Math.max(1,guide||0,...knownRows.map(r=>r.totals[metric]))*1.16;
 const x=i=>left+(i+.5)*(right-left)/rows.length,y=v=>bottom-Math.min(upper,v)/upper*(bottom-top);
 const guides=[0,.25,.5,.75,1].map(f=>`<line x1="${left}" y1="${y(upper*f)}" x2="${right}" y2="${y(upper*f)}" stroke="currentColor" opacity=".1"/><text x="${left-7}" y="${y(upper*f)+3}" text-anchor="end" class="ni726-axis">${fmt(upper*f)}</text>`).join('');
 const goal=Number.isFinite(guide)?`<line x1="${left}" y1="${y(guide)}" x2="${right}" y2="${y(guide)}" stroke="${series.guideKind==='upper'?'#BD6853':'#6B8C78'}" stroke-width="1.6" stroke-dasharray="7 5"/>`:'';
 const threshold=period.mode==='week'?1:period.mode==='month'?5:Math.max(1,Math.ceil(rows.length/12));
 const labels=rows.map((r,i)=>i%threshold===0||i===rows.length-1?`<text class="ni726-axis" x="${x(i)}" y="240" text-anchor="middle">${period.mode==='all'?r.day.slice(2):dayDate(r.day).toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit'})}</text>`:'').join('');
 const dots=rows.map((r,i)=>{
  const cov=r.coverage[metric];if(!cov?.known)return '';
  const estimated=cov.estimated||cov.minimum,partial=cov.unknown||cov.partial;
  const tooltip=`${r.day}: ${fmt(r.totals[metric])} ${def.unit}; ${cov.known}/${r.entries} Einträge mit Wert${partial?'; unvollständige Teilbilanz':''}${estimated?'; enthält geschätzte/Mindestwerte':''}`;
  return `<circle cx="${x(i)}" cy="${y(r.totals[metric])}" r="${period.mode==='all'?3.1:5.2}" fill="${estimated?'#fff':def.color}" stroke="${def.color}" stroke-width="${estimated?2.3:1.3}" ${partial?'stroke-dasharray="2 1"':''} class="ni726-dot" tabindex="0" role="img" aria-label="${esc(tooltip)}"><title>${esc(tooltip)}</title></circle>`;
 }).join('');
 const chart=`<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Tagespunktdiagramm ${esc(def.label)}. Jeder Punkt ist eine dokumentierte Tages-Teilbilanz; Lücken bedeuten unbekannte Werte.">${guides}${goal}${dots}${labels}<text class="ni726-axis" x="8" y="13">${esc(def.unit)}</text></svg>`;
 return `<div class="ni726-graph-scroll" tabindex="0" aria-label="Punktdiagramm horizontal scrollen">${chart}</div><div class="ni726-legend"><span><i style="background:${def.color}"></i>Erfasster Tageswert</span><span><i class="ni726-hollow" style="border-color:${def.color}"></i>Schätzung/Mindestwert beteiligt</span>${goal?`<span><i class="ni726-dash"></i>${esc(goalText(series))}</span>`:''}</div>`;
}
function microGraph(data){
 if(!data.logged)return '<p class="muted-line">In diesem Zeitraum noch keine Ernährung protokolliert.</p>';
 return `<div class="ni726-micro-grid">${data.items.map(x=>{
  const percent=x.percent,known=x.known>0,shown=known?`${Math.round(percent)} % EU-NRV · Ø ${fmt(x.mean)} ${esc(x.unit)}`:'Nicht bestimmt';
  const pct=known?Math.min(100,Math.max(0,percent)):0,overflow=known&&percent>100;
  return `<div class="ni726-micro-row"><span class="ni726-micro-name"><span aria-hidden="true">${icons[x.key]||'🧪'}</span>${esc(x.label)}</span><div class="ni726-micro-meter"><span style="width:${pct.toFixed(2)}%"></span><i style="left:100%"></i></div><span class="ni726-micro-num">${shown}${overflow?' ↑':''}<small>${known?`${x.known}/${data.logged} Tage mit Wert${x.missing?' · '+x.missing+' Tage ohne Wert':''}${x.partial?' · '+x.partial+' Teilbilanzen':''}${x.estimated?' · teils geschätzt':''}`:'Keine quantifizierten Einträge'}</small></span></div>`;
 }).join('')}</div><p class="ni726-note">Die Ø-Werte verwenden ausschließlich Tage <strong>mit</strong> dokumentierten Nährstoffwerten, nicht fehlende Tage als null. EU-NRV sind allgemeine Kennzeichnungsreferenzen, keine individuellen Bedarfswerte und keine sicheren Obergrenzen. 120 % heißt nicht automatisch „zu viel“, 50 % nicht automatisch „Mangel“.</p>`;
}
function weekdayGraph(series){
 const {weekdayGroups,metric}=series,def=metricByKey.get(metric);
 if(!series.knownRows.length)return '<p class="muted-line">Noch keine Tage mit bekannten Werten für den Wochentagsvergleich.</p>';
 const width=810,height=212,left=48,right=793,top=20,bottom=167,scaleMax=Math.max(1,...series.knownRows.map(r=>r.totals[metric]),series.guide||0)*1.17;
 const x=i=>left+(i+.5)*(right-left)/7,y=v=>bottom-v/scaleMax*(bottom-top);
 const hlines=[0,.5,1].map(f=>`<line x1="${left}" y1="${y(scaleMax*f)}" x2="${right}" y2="${y(scaleMax*f)}" stroke="currentColor" opacity=".12"/><text x="${left-8}" y="${y(scaleMax*f)+3}" text-anchor="end" class="ni726-axis">${fmt(scaleMax*f)}</text>`).join('');
 const names=['Mo','Di','Mi','Do','Fr','Sa','So'];
 const elems=weekdayGroups.map(g=>{
  const cx=x(g.weekday),dots=g.rows.map((r,i)=>{
   const jitter=((i%7)-3)*3.7;const cov=r.coverage[metric];const title=`${r.day}: ${fmt(r.totals[metric])} ${def.unit}${cov.unknown?' · nur bekannte Einträge':''}`;
   return `<circle cx="${cx+jitter}" cy="${y(r.totals[metric])}" r="3.7" fill="${cov.estimated||cov.minimum?'#fff':def.color}" stroke="${def.color}" stroke-width="1.3"><title>${esc(title)}</title></circle>`;
  }).join('');
  const mid=g.mean!==null?`<line x1="${cx-21}" y1="${y(g.mean)}" x2="${cx+21}" y2="${y(g.mean)}" stroke="${def.color}" stroke-width="2.6"/>`:'';
  return `${dots}${mid}<text class="ni726-axis" x="${cx}" y="183" text-anchor="middle">${names[g.weekday]}</text><text class="ni726-axis" x="${cx}" y="198" text-anchor="middle">n=${g.rows.length}</text>`;
 }).join('');
 return `<div class="ni726-weekdays-scroll"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Einzelne dokumentierte Tageswerte nach Wochentag, Querstriche sind Mittelwerte">${hlines}${elems}</svg></div><p class="ni726-note">Jeder Punkt ist ein tatsächlich protokollierter Tageswert; Querstrich = Mittel der vorhandenen Tage. Fehlende Tage werden nicht als 0 ergänzt. Mit wenigen Einträgen sind Wochentagsvergleiche noch nicht aussagekräftig.</p>`;
}
export function nutritionTrendsView(state,{mode='week',anchor=dayOf(new Date()),metric='protein',now=new Date()}={}){
 if(!metricByKey.has(metric))metric='protein';
 const s=nutritionTrendsSeries(state,{mode,anchor,metric,now}),p=s.period,m=nutrientMicroSummary(state,{mode,anchor,now}),def=metricByKey.get(metric);
 const buttons=NUTRIENT_TREND_METRICS.map(x=>`<button type="button" data-action="ni726-metric" data-id="${x.key}" class="${metric===x.key?'selected':''}" aria-pressed="${metric===x.key}">${icons[x.key]||'•'} ${esc(x.label)}</button>`).join('');
 return `<div class="ni726-root">
  <section class="work-card"><div class="work-heading"><span>📊 Nährstoff-Trends · Tagespunkte</span><small>${s.coverage.observedDays} Tage protokolliert</small></div>
    <div class="ni725-controls"><div class="ni725-range">${[['week','Woche'],['month','Monat'],['all','Gesamt']].map(([id,label])=>`<button type="button" data-action="ni726-mode" data-id="${id}" class="${p.mode===id?'selected':''}" aria-pressed="${p.mode===id}">${label}</button>`).join('')}</div><div class="ni725-pager"><button type="button" aria-label="Vorheriger Zeitraum" data-action="ni726-shift" data-id="prev" ${p.mode==='all'?'disabled':''}>‹</button><strong>${esc(p.label)}</strong><button type="button" aria-label="Nächster Zeitraum" data-action="ni726-shift" data-id="next" ${!p.canNext?'disabled':''}>›</button></div></div>
    <div class="ni726-metrics">${buttons}</div>
    <div class="ni726-summary"><div><small>${icons[metric]} Ø erfasster ${esc(def.label)} / Tag mit Wert</small><strong>${s.mean===null?'–':fmt(s.mean)+' '+def.unit}</strong></div><div><small>Quantifizierte Tage</small><strong>${s.coverage.knownDays} / ${s.coverage.observedDays}</strong></div><div><small>Unsichere Teilbilanzen</small><strong>${s.coverage.partialDays+s.coverage.estimatedDays>0?`${s.coverage.partialDays} unvollständig · ${s.coverage.estimatedDays} geschätzt`:'Keine markierten'}</strong></div></div>
    <p class="ni726-note"><strong>Ein Punkt = ein Kalendertag</strong>, nicht eine künstlich geglättete Kurve. Der Wert addiert nur bekannte Lebensmittelwerte; fehlende Mahlzeiten und fehlende Nährstoffangaben machen ihn zur Teilbilanz. Bei Koffein können Matcha-Herstellerwerte lediglich Mindestwerte sein. ${s.guideKind==='upper'?'Die gestrichelte Grenze ist keine empfohlene Zufuhr.':''}</p>
    ${dotGraph(s)}
  </section>
  <section class="work-card"><div class="work-heading"><span>🍊 Vitamine &amp; Mineralstoffe · Durchschnitt</span><small>Quellenqualität sichtbar</small></div><p class="muted-line">Ø Aufnahme je <strong>Tag mit einem bekannten Wert</strong>; ein Vergleich mit EU-NRV ist nur eine Orientierung. Alle Nährstoffsymbole bleiben erhalten.</p>${microGraph(m)}</section>
  <section class="work-card"><div class="work-heading"><span>📅 Wochentagsmuster · ${icons[metric]} ${esc(def.label)}</span><small>Einzelpunkte + Mittelstriche</small></div>${weekdayGraph(s)}</section>
  </div>`;
}
export const shiftNutritionTrendsPeriod=shiftNutritionTimingPeriod;
