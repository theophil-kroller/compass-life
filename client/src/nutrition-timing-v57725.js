/** Compass 0.5.77.25 — Nutrition Insights 1: fast local dots, intake windows,
 * observed overnight intervals & kcal time series. Read-only; no new vault schema.
 * All clock times reflect the viewer's local time zone, consistent with the journal.
 */
import {nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';
import {nutrientEntry} from './nutrition-intelligence-v57712.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ISO=/^\d{4}-\d{2}-\d{2}$/;
const localDay=x=>{const d=x instanceof Date?x:new Date(x);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const dayDate=s=>new Date(`${s}T12:00:00`);
const shift=(day,n)=>{const d=dayDate(day);d.setDate(d.getDate()+n);return localDay(d);};
const weekMonday=day=>{const d=dayDate(day);d.setDate(d.getDate()-((d.getDay()+6)%7));return localDay(d);};
const monthStart=day=>`${day.slice(0,7)}-01`;
const fmtDay=day=>dayDate(day).toLocaleDateString('de-AT',{weekday:'short',day:'2-digit',month:'2-digit'});
const fmtHour=ms=>new Date(ms).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'});
const fmtMin=minutes=>Number.isFinite(minutes)?`${Math.floor(minutes/60)} h ${String(Math.round(minutes%60)).padStart(2,'0')} min`:'–';
const num=x=>Math.round(x).toLocaleString('de-AT');
const cache=new WeakMap();
const VALID_MODES=['week','month','all'];
export function nutritionTimingPeriod(mode='week',anchor=localDay(new Date()),now=new Date()){
 mode=VALID_MODES.includes(mode)?mode:'week';const today=localDay(now);anchor=ISO.test(anchor)&&Number.isFinite(+dayDate(anchor))?anchor:today;
 if(anchor>today)anchor=today;
 const first=mode==='week'?weekMonday(anchor):mode==='month'?monthStart(anchor):'';
 let last=mode==='week'?shift(first,6):today;
 // month-end derived with local calendar arithmetic (DST-safe).
 if(mode==='month'){const d=dayDate(first);d.setMonth(d.getMonth()+1);d.setDate(0);last=localDay(d);}
 if(last>today)last=today;
 const days=[];
 if(mode!=='all')for(let day=first;day<=last;day=shift(day,1))days.push(day);
 const label=mode==='week'?`${fmtDay(first)} – ${fmtDay(last)}`:mode==='month'?dayDate(first).toLocaleDateString('de-AT',{month:'long',year:'numeric'}):'Gesamter erfasster Zeitraum';
 return {mode,anchor,first,last,today,days,label,canNext:mode!=='all'&&last<today};
}
export function shiftNutritionTimingPeriod(mode,anchor,delta,now=new Date()){
 const p=nutritionTimingPeriod(mode,anchor,now);if(p.mode==='all')return p.anchor;
 if(delta>0&&!p.canNext)return p.anchor;
 if(p.mode==='week')return shift(p.first,7*Math.sign(delta));
 const date=dayDate(p.first);date.setMonth(date.getMonth()+Math.sign(delta));return localDay(date);
}
const fingerprint=e=>JSON.stringify([e.id,e.foodId,e.at,e.amount,e.note,e.updatedAt,e.deleted]);
function newBucket(){return {events:new Map(),summary:null};}
function summarize(day,b){
 const events=[...b.events.values()].filter(e=>e.caloric).sort((a,z)=>a.ms-z.ms);
 const known=events.filter(e=>Number.isFinite(e.kcal)), unknown=events.length-known.length;
 const low=known.reduce((v,e)=>v+(e.kcalLow??e.kcal),0);
 const high=known.reduce((v,e)=>v+(e.kcalHigh??e.kcal),0);
 const first=events[0]?.ms??null,last=events.at(-1)?.ms??null;
 return {day,events,entries:events.length,known:known.length,unknown,low,high,kcal:known.reduce((v,e)=>v+e.kcal,0),first,last,
  eatingMinutes:first!==null&&last!==null?(last-first)/60000:null,overnightMinutes:null,overnightValid:false};
}
/** Incrementally cached per-day summaries: only added/changed/deleted journal rows
 * trigger a nutrition recalculation. Navigating periods reuses summaries; no persistence. */
export function nutritionTimingIndex(state){
 const journal=state?.nutritionJournal||{},raw=Array.isArray(journal.entries)?journal.entries:[];
 const foods=nutritionFoods(state),foodById=new Map(foods.map(f=>[f.id,f]));
 // Changes to product reference calories are reflected without user migrations.
 const foodSignature=foods.map(f=>`${f.id}|${f.updatedAt||''}|${f.kcalLow}|${f.kcalHigh}|${f.nutrientBasis||''}|${JSON.stringify(f.nutrients||{})}`).join(';');
 let index=cache.get(state);
 if(!index||index.foodSignature!==foodSignature){index={foodSignature,rows:new Map(),days:new Map()};cache.set(state,index);}
 const present=new Set(),dirty=new Set();
 const unlink=row=>{const bucket=index.days.get(row.day);if(bucket){bucket.events.delete(row.id);dirty.add(row.day);if(!bucket.events.size)index.days.delete(row.day);}};
 for(const entry of raw){
  if(!entry||!entry.id)continue;
  const id=String(entry.id);present.add(id);const sig=fingerprint(entry),existing=index.rows.get(id);
  if(existing?.sig===sig)continue;
  if(existing)unlink(existing);
  if(entry.deleted||!Number.isFinite(Date.parse(entry.at))){index.rows.delete(id);continue;}
  const food=foodById.get(entry.foodId),dt=new Date(entry.at),day=localDay(dt);
  const approx=nutritionKcalEstimate(food,entry.amount);
  const nutrients=nutrientEntry(food,entry);
  const rawKcal=nutrients.values.kcal;
  const kcal=Number.isFinite(rawKcal)?rawKcal:approx?(approx.low+approx.high)/2:null;
  // A micronutrient capsule without a declared energy value must NOT be treated
  // as a meal in fasting windows. This does not assert that it has 0 kcal.
  const caloric=kcal!==null?kcal>0:Boolean(food&&food.group!=='Nahrungsergänzung'&&!/^(water|tea|sparkling-water)$/i.test(entry.foodId));
  const item={id,ms:+dt,day,title:food?.title||'Unbekanntes Lebensmittel',emoji:food?.emoji||'🍽️',amount:entry.amount||'',kcal,
   kcalLow:approx?.low??kcal,kcalHigh:approx?.high??kcal,caloric,estimated:(!nutrients.knownKeys.has('kcal'))||!!food?.uncertain};
  index.rows.set(id,{sig,...item});
  if(!index.days.has(day))index.days.set(day,newBucket());
  index.days.get(day).events.set(id,item);dirty.add(day);
 }
 for(const [id,row] of index.rows)if(!present.has(id)){unlink(row);index.rows.delete(id);}
 for(const day of dirty){const bucket=index.days.get(day);if(bucket)bucket.summary=summarize(day,bucket);}
 return index;
}
export function nutritionTimingSeries(state,{mode='week',anchor=localDay(new Date()),now=new Date()}={}){
 const period=nutritionTimingPeriod(mode,anchor,now),index=nutritionTimingIndex(state),today=period.today;
 const summaryFor=day=>index.days.get(day)?.summary||summarize(day,newBucket());
 let days=period.mode==='all'?[...index.days.keys()].filter(day=>day<=today).sort():period.days;
 const rows=days.map(day=>({...summaryFor(day)}));
 for(const row of rows){
  const prev=summaryFor(shift(row.day,-1));
  // Strictly adjacent calendar dates; no invented fast from gaps.
  if(row.first!==null&&prev.last!==null&&row.first>prev.last){row.overnightMinutes=(row.first-prev.last)/60000;row.overnightValid=true;}
 }
 const weekAnchor=period.mode==='week'?period.first:weekMonday(today);
 const weeklyDays=Array.from({length:7},(_,i)=>shift(weekAnchor,i));
 const weekly=weeklyDays.map(day=>{
  const first=summaryFor(day).first,prev=summaryFor(shift(day,-1)).last;
  return {day,minutes:day<=today&&first!==null&&prev!==null&&first>prev?(first-prev)/60000:null};
 }).filter(r=>r.minutes!==null);
 const longest=weekly.sort((a,b)=>b.minutes-a.minutes)[0]||null;
 const observed=rows.filter(row=>row.entries>0),overnights=rows.filter(row=>row.overnightValid);
 const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
 const events=observed.flatMap(day=>day.events);
 return {period,rows,observed,events,longest,stats:{logged:observed.length,entries:events.length,avgFirst:mean(observed.map(r=>r.first===null?null:(new Date(r.first).getHours()*60+new Date(r.first).getMinutes())).filter(Number.isFinite)),avgLast:mean(observed.map(r=>r.last===null?null:(new Date(r.last).getHours()*60+new Date(r.last).getMinutes())).filter(Number.isFinite)),avgEating:mean(observed.filter(r=>r.entries>=2).map(r=>r.eatingMinutes).filter(Number.isFinite)),avgFasting:mean(overnights.map(r=>r.overnightMinutes)),avgKcal:mean(observed.filter(r=>r.known>0).map(r=>r.kcal)),fastingPairs:overnights.length,unknownKcal:observed.reduce((n,r)=>n+r.unknown,0)}};
}
export const FOOD_DAYPARTS=Object.freeze([
 {from:0,to:5,label:'Nacht',icon:'🌙',color:'#67718A',bg:'#6D7599'},
 {from:5,to:7.5,label:'Frühmorgen',icon:'🌅',color:'#ED922F',bg:'#ED922F'},
 {from:7.5,to:10.5,label:'Morgen',icon:'☀️',color:'#E97B37',bg:'#E97B37'},
 {from:10.5,to:14.5,label:'Mittag',icon:'🍽️',color:'#D34D53',bg:'#D34D53'},
 {from:14.5,to:17.5,label:'Nachmittag',icon:'🌤️',color:'#C76A78',bg:'#C76A78'},
 {from:17.5,to:20.5,label:'Abend',icon:'🌆',color:'#4187C8',bg:'#4187C8'},
 {from:20.5,to:24,label:'Spätabend',icon:'🌙',color:'#355C9F',bg:'#355C9F'}
]);
export const colorForHour=h=>FOOD_DAYPARTS.find(p=>h>=p.from&&h<p.to)?.color||'#355C9F';
function hourFraction(ms){const d=new Date(ms);return d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;}
function clock(m){if(!Number.isFinite(m))return '–';const min=Math.round(m)%(24*60);return `${String(Math.floor(min/60)).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`;}
function timingDotPlot(series,selectedId){
 const {period,rows}=series;
 // All-time retains exact events, grouped by year/month only to keep the SVG navigable.
 const groups=period.mode==='all'?[...new Set(rows.map(r=>r.day.slice(0,7)))].sort():rows.map(r=>r.day);
 const groupKey=day=>period.mode==='all'?day.slice(0,7):day;
 const byGroup=new Map(groups.map(g=>[g,[]]));for(const event of series.events)byGroup.get(groupKey(event.day))?.push(event);
 const x0=84,x1=912,width=x1-x0,rowH=period.mode==='week'?30:period.mode==='month'?21:26,top=38,chartH=groups.length*rowH,baseY=top+chartH;
 const xHour=h=>x0+h/24*width;
 const zones=FOOD_DAYPARTS.map(p=>`<rect x="${xHour(p.from)}" y="${top-8}" width="${xHour(p.to)-xHour(p.from)}" height="${chartH+15}" fill="${p.bg}" opacity="0.045"/><line x1="${xHour(p.from)}" x2="${xHour(p.from)}" y1="${top-8}" y2="${baseY+8}" stroke="currentColor" opacity=".11"/>`).join('');
 const ticks=[0,3,6,9,12,15,18,21,24].map(h=>`<text x="${xHour(h)}" y="23" text-anchor="middle" class="ni725-axis">${String(h).padStart(2,'0')}h</text>`).join('');
 const labels=groups.map((g,i)=>{const y=top+i*rowH+rowH/2;const label=period.mode==='all'?g:period.mode==='week'?fmtDay(g):dayDate(g).toLocaleDateString('de-AT',{day:'2-digit',weekday:'short'});
 return `<text x="76" y="${y+3}" text-anchor="end" class="ni725-y-label">${esc(label)}</text><line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="currentColor" opacity=".09"/>`;}).join('');
 const dots=groups.map((g,i)=>{
  const events=byGroup.get(g)||[];
  return events.map((e,k)=>{
   const f=hourFraction(e.ms),y=top+i*rowH+rowH/2;
   // In all-time display dots jitter vertically to reveal overlapping days,
   // never horizontally: the x coordinate remains the real clock time.
   const jitter=period.mode==='all'?((dayDate(e.day).getDate()%9)-4)*Math.min(1.35,(rowH-10)/8):0;
   const title=`${e.day} · ${fmtHour(e.ms)} · ${e.emoji} ${e.title}${e.kcal!==null?` · ca. ${num(e.kcal)} kcal`:' · kcal unbekannt'}`;
   return `<circle class="ni725-dot ${selectedId===e.id?'is-selected':''}" data-action="ni725-event" data-id="${esc(e.id)}" cx="${xHour(f).toFixed(2)}" cy="${(y+jitter).toFixed(2)}" r="${period.mode==='week'?5.7:period.mode==='month'?4.2:3.75}" fill="${colorForHour(f)}" tabindex="0" role="button" aria-label="${esc(title)}"><title>${esc(title)}</title></circle>`;
  }).join('');}).join('');
 const height=baseY+69;
 const footer=FOOD_DAYPARTS.filter(p=>p.from>=5).map(p=>`<text x="${xHour((p.from+p.to)/2)}" y="${baseY+36}" text-anchor="middle" class="ni725-zone-icon">${p.icon}</text><text x="${xHour((p.from+p.to)/2)}" y="${baseY+51}" text-anchor="middle" class="ni725-zone-label">${p.label==='Frühmorgen'?'Früh':p.label==='Nachmittag'?'Nachm.':p.label==='Spätabend'?'Spät':p.label}</text>`).join('');
 return `<div class="ni725-dot-scroller"><svg class="ni725-dots" viewBox="0 0 934 ${height}" role="group" aria-label="Exakte Uhrzeiten aller protokollierten Kalorienaufnahmen nach Tagen; Punkte sind auswählbar">${zones}${ticks}${labels}${dots}${footer}</svg></div>`;
}
function eatingFastingChart(series){
 const rows=series.rows,visible=series.period.mode==='all'?rows.slice(-31):rows;
 if(!visible.length)return '<p class="muted-line">Noch keine protokollierten Tage.</p>';
 const clockPos=ms=>Math.min(100,Math.max(0,hourFraction(ms)/24*100));
 return `<div class="ni725-window-list">${visible.map(r=>{
  const has=r.first!==null,from=has?clockPos(r.first):0,to=has?clockPos(r.last):0;
  const fasting=r.overnightValid?fmtMin(r.overnightMinutes):'–';const reliableWindow=r.entries>=2;
  return `<div class="ni725-window-row"><span class="ni725-window-day">${esc(fmtDay(r.day))}</span><div class="ni725-timeline" title="${has?`Erste Aufnahme ${fmtHour(r.first)}, letzte ${fmtHour(r.last)}`:'Keine Einträge'}">${has?`<i class="ni725-eating-window" style="left:${from.toFixed(3)}%;width:${Math.max(.5,to-from).toFixed(3)}%"></i><i class="ni725-start" style="left:${from.toFixed(3)}%"></i><i class="ni725-end" style="left:${to.toFixed(3)}%"></i>`:''}</div><span class="ni725-window-times">${has?`${fmtHour(r.first)}–${fmtHour(r.last)}`:'–'}<small>${has?(reliableWindow?`Essfenster ${fmtMin(r.eatingMinutes)}`:'Essfenster unbekannt'):'Nicht erfasst'}</small></span><span class="ni725-fast">${fasting}<small>Pause davor${r.overnightValid?'*':''}</small></span></div>`;
 }).join('')}</div>${series.period.mode==='all'&&rows.length>31?'<p class="muted-line">Für die Tagesbalken werden die letzten 31 protokollierten Tage gezeigt; die Gesamtauswertung oben umfasst alle Einträge.</p>':''}`;
}
function kcalTrend(series){
 const raw=series.rows;
 const rows=series.period.mode==='all'?(()=>{
  const months=new Map();for(const r of raw){const mon=r.day.slice(0,7);const x=months.get(mon)||{day:mon,kcal:0,known:0,logged:0,unknown:0};if(r.entries){x.logged++;x.known+=r.known?1:0;x.kcal+=r.kcal;x.unknown+=r.unknown;}months.set(mon,x);}return [...months.values()].sort((a,b)=>a.day.localeCompare(b.day)).map(x=>({...x,kcal:x.known?x.kcal/x.known:0}));})():raw;
 if(!rows.length)return '<p class="muted-line">Noch keine Daten für den Trend.</p>';
 const startX=64,endX=918,startY=25,endY=211,w=endX-startX,h=endY-startY;
 const max=Math.max(400,...rows.map(r=>r.known?r.kcal:0))*1.12;
 const x=i=>startX+(rows.length===1?.5:i/(rows.length-1))*w;
 const y=k=>endY-Math.min(max,k)/max*h;
 let paths=[],active='';for(let i=0;i<rows.length;i++){
  if(!rows[i].known){if(active)paths.push(active);active='';continue;}
  const point=`${x(i).toFixed(1)},${y(rows[i].kcal).toFixed(1)}`;active+=(active?' L':'M')+point;
 }if(active)paths.push(active);
 let rolling=[];if(series.period.mode!=='all'){
  for(let i=0;i<rows.length;i++){
   const window=rows.slice(Math.max(0,i-6),i+1).filter(r=>r.known>0);
   rolling.push(window.length>=3?window.reduce((n,r)=>n+r.kcal,0)/window.length:null);
  }
 }
 let rollingPath='',rollingSegments=[];for(let i=0;i<rolling.length;i++){
  if(rolling[i]===null){if(rollingPath)rollingSegments.push(rollingPath);rollingPath='';continue;}
  rollingPath+=(rollingPath?' L':'M')+`${x(i).toFixed(1)},${y(rolling[i]).toFixed(1)}`;
 }if(rollingPath)rollingSegments.push(rollingPath);
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${startX}" y1="${y(max*t)}" x2="${endX}" y2="${y(max*t)}" stroke="currentColor" opacity=".12"/><text x="${startX-7}" y="${y(max*t)+4}" text-anchor="end" class="ni725-axis">${num(max*t)}</text>`).join('');
 const ticks=rows.map((r,i)=>({r,i})).filter(({i})=>i===0||i===rows.length-1||(rows.length>12&&i%Math.ceil(rows.length/7)===0)).map(({r,i})=>`<text x="${x(i)}" y="233" text-anchor="middle" class="ni725-axis">${esc(series.period.mode==='all'?r.day:dayDate(r.day).toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit'}))}</text>`).join('');
 const dots=rows.map((r,i)=>r.known?`<circle cx="${x(i)}" cy="${y(r.kcal)}" r="${rows.length>50?2.7:4.4}" fill="#4786B1"><title>${esc(r.day)} · ${num(r.kcal)} kcal${r.unknown?` · ${r.unknown} ohne kcal-Wert`:''}${series.period.mode==='all'?' je protokolliertem Tag':''}</title></circle>`:'').join('');
 return `<div class="ni725-trend-scroller"><svg viewBox="0 0 940 251" role="img" aria-label="Geschätzte Kalorien der dokumentierten Tage, Punkte und gleitender Siebentagesdurchschnitt">${grid}${paths.map(d=>`<path d="${d}" fill="none" stroke="#4786B1" stroke-width="2"/>`).join('')}${rollingSegments.map(d=>`<path d="${d}" fill="none" stroke="#DA8861" stroke-width="2.4" stroke-dasharray="7 5"/>`).join('')}${dots}${ticks}<text x="8" y="14" class="ni725-axis">kcal</text></svg></div><div class="ni725-legend"><span><i style="background:#4786B1"></i>Geschätzte protokollierte kcal</span>${series.period.mode!=='all'?'<span><i style="background:#DA8861"></i>7-Tage-Trend (mind. 3 erfasste Tage)</span>':'<span>Gesamt: Monatsmittel je erfasstem Tag</span>'}</div>`;
}
export function nutritionTimingSelectedMarkup(state,id){
 const e=nutritionTimingIndex(state).rows.get(String(id));
 if(!e||!e.caloric)return '';
 return `<div class="ni725-selected"><span>${esc(e.emoji)} <strong>${esc(e.title)}</strong> · ${esc(e.day)} ${fmtHour(e.ms)} · ${e.kcal===null?'kcal unbekannt':`ca. ${num(e.kcal)} kcal`}</span><button type="button" class="secondary-btn" data-action="ni725-edit" data-id="${esc(e.id)}">Eintrag bearbeiten</button></div>`;
}
export function nutritionTimingView(state,{mode='week',anchor=localDay(new Date()),selectedId='',now=new Date()}={}){
 const m=nutritionTimingSeries(state,{mode,anchor,now}),p=m.period,s=m.stats;
 const selected=m.events.find(e=>e.id===selectedId);
 const kpi=(icon,label,value,sub='')=>`<div class="ni725-kpi"><span>${icon} ${esc(label)}</span><strong>${esc(value)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`;
 const selectedWeek=p.mode==='week'?'dieser ausgewählten Woche':'dieser Kalenderwoche';
 return `<div class="ni725-insights"><section class="work-card"><div class="work-heading"><span>🕒 Essensrhythmus &amp; Trends</span><small>${s.logged} protokollierte Tage</small></div><div class="ni725-controls"><div class="ni725-range">${[['week','Woche'],['month','Monat'],['all','Gesamt']].map(([id,title])=>`<button type="button" data-action="ni725-mode" data-id="${id}" class="${p.mode===id?'selected':''}" aria-pressed="${p.mode===id}">${title}</button>`).join('')}</div><div class="ni725-pager"><button type="button" aria-label="Vorheriger Zeitraum" title="Vorheriger Zeitraum" data-action="ni725-shift" data-id="prev" ${p.mode==='all'?'disabled':''}>‹</button><strong>${esc(p.label)}</strong><button type="button" aria-label="Nächster Zeitraum" title="Nächster Zeitraum" data-action="ni725-shift" data-id="next" ${!p.canNext?'disabled':''}>›</button></div></div><div class="ni725-kpis">${kpi('🌅','Ø erste Kalorie',clock(s.avgFirst))}${kpi('🌙','Ø letzte Kalorie',clock(s.avgLast))}${kpi('🍽️','Ø Essfenster',fmtMin(s.avgEating))}${kpi('⏳','Ø protokollierte Nachtpause',fmtMin(s.avgFasting),`${s.fastingPairs} auswertbare Nächte`)}${kpi('🏆','Längste Pause der Woche',fmtMin(m.longest?.minutes),m.longest?`${fmtDay(m.longest.day)} · ${selectedWeek}`:'Noch keine aufeinanderfolgenden Tage')}${kpi('⚡','Ø protokollierte kcal / Tag',s.avgKcal===null?'–':`≈ ${num(s.avgKcal)}`,`${s.logged} erfasste Tage`)}</div><p class="ni725-disclaimer">Alle Kennzahlen beziehen sich <strong>nur auf dokumentierte Aufnahmen</strong>. Lange Pausen sind keine bestätigten Fastenintervalle; Lücken im Tagebuch können sie künstlich verlängern. Einträge mit unbekannter Kalorienmenge können die Zeitangaben zusätzlich unsicher machen. Nicht erfasste Tage zählen nicht als Fastentage.</p></section>
 <section class="work-card"><div class="work-heading"><span>🌅 Essenszeiten · jeder Punkt ein Eintrag</span><small>${s.entries} Kalorienereignisse</small></div><p class="muted-line">Horizontal die genaue Uhrzeit (00–24 Uhr), vertikal ${p.mode==='all'?'Monate mit allen Originalpunkten':p.mode==='week'?'Wochentage':'Kalendertage'}. Farbe = Tageszeit: morgens Orange, mittags Rot, abends Blau. Tippe auf einen Punkt für Details.</p>${m.events.length?timingDotPlot(m,selectedId):'<p class="muted-line">Für diesen Zeitraum sind noch keine Kalorienaufnahmen dokumentiert.</p>'}<div id="ni725-selection">${selected?nutritionTimingSelectedMarkup(state,selectedId):''}</div></section>
 <section class="work-card"><div class="work-heading"><span>⏳ Essfenster &amp; protokollierte Fastenpausen</span><small>24-Stunden-Achse</small></div><p class="muted-line">Die farbige Strecke verbindet erste und letzte erfasste Kalorienaufnahme. Die Pause davor reicht vom letzten Eintrag des <em>unmittelbaren Vortags</em> bis zur ersten Aufnahme dieses Tages.</p>${eatingFastingChart(m)}<p class="ni725-disclaimer">*Protokollierte Esspause, nicht als tatsächlich eingehaltenes Fasten verifiziert. Bei nur einem Eintrag ist das Essfenster nicht zuverlässig bestimmbar.</p></section>
 <section class="work-card"><div class="work-heading"><span>📈 Kalorien · Verlauf</span><small>Trend statt Tagesbewertung</small></div><p class="muted-line">Punkte sind geschätzte Kalorien aus <strong>erfassten</strong> Lebensmitteln. Fehlende Mahlzeiten sind nicht enthalten; leere Tage werden nicht als 0 kcal dargestellt.${s.unknownKcal?` ${s.unknownKcal} Einträge ohne kcal-Wert.`:''}</p>${kcalTrend(m)}</section></div>`;
}
