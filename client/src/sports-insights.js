/** Compass 0.5.25 — activity-centric analytics. All calculations are local and descriptive.
 * Intervals do not imply a complete Garmin history. No GPS/calendar distances are inferred.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=1)=>Number(n).toLocaleString('de-AT',{maximumFractionDigits:d});
const TYPES={running:['Laufen','🏃','#6B9E90'],cycling:['Radfahren','🚲','#3E8A78'],walking:['Spazierengehen','🚶','#8BAE77'],hiking:['Wandern / Hiking','🥾','#8DAB75'],ski:['Skifahren','⛷️','#6B9BC9'],swimming:['Schwimmen','🏊','#5C9DBB'],paddling:['Kayak / SUP','🛶','#699EB2'],dancing:['Tanzen','♫','#B08CC5'],disc:['Disc Golf','◎','#CB9B6E'],martial:['Kampfsport','🥋','#B77A73'],sauna:['Sauna & Therme','♨','#D49A72'],other:['Sonstige Aktivitäten','✦','#9AAFA4']};
const DISTANCE_TYPES=new Set(['running','cycling','walking','hiking','ski','swimming','paddling']);
const sportMap={1:'running',2:'cycling',5:'swimming',11:'walking',12:'ski',13:'ski',14:'ski',16:'hiking',17:'hiking',19:'paddling',21:'cycling'};
function titleType(title){const x=String(title||'').toLocaleLowerCase('de-AT');
 if(/\b(zouk|bachata|salsa|tanz\w*|danc\w*|forró|kizomba)\b/u.test(x))return 'dancing';
 if(/disc\s*golf|discgolf|frisbee golf/u.test(x))return 'disc';
 if(/sauna|therme|wellness|dampfbad/u.test(x))return 'sauna';
 if(/kayak|kajak|kanu|canoe|stand.?up.?padd|\bsup\b/u.test(x))return 'paddling';
 if(/ski|snowboard|langlauf/u.test(x))return 'ski';
 if(/wander|hiking|trekking|bergwander/u.test(x))return 'hiking';
 if(/radfahr|cycling|fahrrad|\bbike\b/u.test(x))return 'cycling';
 if(/schwimm|swim/u.test(x))return 'swimming';
 if(/spazier|walking|walk\b/u.test(x))return 'walking';
 if(/laufen|joggen|running/u.test(x))return 'running';
 if(/kampfsport|karate|judo|kickbox|taekwondo|\bboxen\b|martial arts/u.test(x))return 'martial';
 return 'other';
}
const inRange=(day,range)=>day&&(!range?.start||day>=range.start)&&(!range?.end||day<=range.end);
const iso=d=>`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
const dayOf=s=>new Date(`${s}T12:00:00Z`);
const addDay=(s,n)=>{const d=dayOf(s);d.setUTCDate(d.getUTCDate()+n);return iso(d);};
const startOfWeek=s=>{const d=dayOf(s);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return iso(d);};
const monthBegin=s=>s.slice(0,7)+'-01';
const addMonth=(s,n)=>{const d=dayOf(monthBegin(s));d.setUTCMonth(d.getUTCMonth()+n);return iso(d);};
export const SPORTS_MODES=[['week','Woche'],['month','Monat'],['quarter','Quartal'],['year','Jahr'],['rolling12','12 Monate'],['all','Gesamt']];
export function sportsPeriodWindow(mode='all',anchor='2026-10-19',today='2026-10-19'){
 const endDay=/^\d{4}-\d\d-\d\d$/.test(today)?today:'2026-10-19';
 const date=/^\d{4}-\d\d-\d\d$/.test(anchor)?(anchor>endDay?endDay:anchor):endDay;
 const y=date.slice(0,4),m=+date.slice(5,7);let start=null,end=endDay,label='Gesamter Zeitraum';
 if(mode==='week'){start=startOfWeek(date);end=addDay(start,6);label=`Woche ab ${start}`;}
 else if(mode==='month'){start=monthBegin(date);end=addDay(addMonth(start,1),-1);label=new Intl.DateTimeFormat('de-AT',{month:'long',year:'numeric',timeZone:'UTC'}).format(dayOf(start));}
 else if(mode==='quarter'){const q=Math.floor((m-1)/3)+1;start=`${y}-${String((q-1)*3+1).padStart(2,'0')}-01`;end=addDay(addMonth(start,3),-1);label=`Q${q} ${y}`;}
 else if(mode==='year'){start=`${y}-01-01`;end=`${y}-12-31`;label=y;}
 else if(mode==='rolling12'){start=addMonth(monthBegin(date),-11);end=addDay(addMonth(monthBegin(date),1),-1);label=`12 Monate bis ${date.slice(0,7)}`;}
 if(end>endDay)end=endDay;
 return {start,end,label,mode:SPORTS_MODES.some(x=>x[0]===mode)?mode:'all'};
}
export function sportsShiftAnchor(mode,anchor,amount,today){if(mode==='all')return today;
 const d=dayOf(anchor);if(mode==='week')d.setUTCDate(d.getUTCDate()+7*amount);
 else if(mode==='month')d.setUTCMonth(d.getUTCMonth()+amount);
 else if(mode==='quarter')d.setUTCMonth(d.getUTCMonth()+3*amount);
 else if(mode==='year')d.setUTCFullYear(d.getUTCFullYear()+amount);
 else d.setUTCMonth(d.getUTCMonth()+amount);
 return iso(d)>today?today:iso(d);
}
// Garmin Activities.csv swimming has distance in METRES despite other disciplines using km.
// Older imports have source=garmin-activities-csv and distanceUnitAssumed=km; correct only
// their obviously metre-scale swimming values. A FIT distance in km is not touched.
export function normalizedSportDistance(s,type){const n=s?.distanceKm==null?null:Number(s.distanceKm);
 if(n===null||!Number.isFinite(n)||n<0)return null;
 if(type==='swimming'&&s.source==='garmin-activities-csv'&&n>30&&s.distanceUnitAssumed!=='m-converted')return n/1000;
 return n<1000?n:null;
}
export function sportsRows(sessions=[],activities=[],range={}){
 const rows=[];
 for(const s of sessions){if(!s||!inRange(s.day,range))continue;
  const titleCategory=titleType(s.title||s.activityType||'');const activityCategory=titleType(s.activityType||'');const type=titleCategory!=='other'?titleCategory:activityCategory!=='other'?activityCategory:(sportMap[s.sport]||'other');const mins=Number(s.durationMinutes);
  if(!Number.isFinite(mins)||mins<=0||mins>1440)continue;
  const km=normalizedSportDistance(s,type);
  rows.push({id:String(s.id||s.start),at:s.start,day:s.day,type,mins,km,avgHr:Number.isFinite(Number(s.avgHr))&&s.avgHr!=null?Number(s.avgHr):null,source:'garmin'});
 }
 for(const a of activities){if(!a||a.deleted||!inRange(String(a.startedAt||'').slice(0,10),range))continue;
  const type=titleType(a.title),mins=Number(a.durationMinutes);if(!Number.isFinite(mins)||mins<=0||mins>1440||type==='other')continue;
  const at=a.startedAt,d=Date.parse(at);const likelyDuplicate=rows.some(x=>x.source==='garmin'&&x.type===type&&x.day===at.slice(0,10)&&Number.isFinite(d)&&Number.isFinite(Date.parse(x.at))&&Math.abs(d-Date.parse(x.at))<=30*60000&&Math.abs(x.mins-mins)<=Math.max(15,mins*.25));
  if(likelyDuplicate)continue;
  const km=a.distanceKm==null?null:Number(a.distanceKm);
  rows.push({id:String(a.id),at,day:at.slice(0,10),type,mins,km:Number.isFinite(km)&&km>=0&&km<1000?km:null,avgHr:null,source:'personal'});
 }
 return rows.sort((a,b)=>b.day.localeCompare(a.day));
}
export function summarizeSports(sessions=[],activities=[],range={}){
 const groups=new Map();for(const row of sportsRows(sessions,activities,range)){let v=groups.get(row.type);if(!v){const [label,icon,color]=TYPES[row.type];v={type:row.type,label,icon,color,count:0,minutes:0,distanceKm:0,measuredDistance:false,garmin:0,personal:0,days:new Set(),hrSum:0,hrN:0};groups.set(row.type,v);}
 v.count++;v.minutes+=row.mins;v.days.add(row.day);if(row.km!==null){v.distanceKm+=row.km;v.measuredDistance=true;}if(row.avgHr!==null){v.hrSum+=row.avgHr;v.hrN++;}v[row.source]++;
 }
 return [...groups.values()].map(x=>({...x,activeDays:x.days.size,days:undefined,avgHr:x.hrN?x.hrSum/x.hrN:null})).sort((a,b)=>b.minutes-a.minutes);
}
const sportValue=(row,metric)=>metric==='count'?1:metric==='distance'?(DISTANCE_TYPES.has(row.type)?row.km??0:0):row.mins/60;
export function sportsTrendSeries(rows,mode,metric='time'){
 const grouping=mode==='week'?'day':mode==='month'?'week':mode==='quarter'?'month':'month';const periods=new Map();
 for(const row of rows){const key=grouping==='day'?row.day:grouping==='week'?startOfWeek(row.day):row.day.slice(0,7);if(!periods.has(key))periods.set(key,{});const val=periods.get(key);val[row.type]=(val[row.type]||0)+sportValue(row,metric);}
 return [...periods].sort(([a],[b])=>a.localeCompare(b)).map(([period,parts])=>({period,parts}));
}
function trendChart(rows,mode,metric,selected){const series=sportsTrendSeries(rows,mode,metric);if(!series.length)return '';
 const full=series.slice(-32),top=[...new Set(rows.map(r=>r.type))].sort((a,b)=>rows.filter(r=>r.type===b).reduce((s,x)=>s+sportValue(x,metric),0)-rows.filter(r=>r.type===a).reduce((s,x)=>s+sportValue(x,metric),0)).slice(0,7);
 const keys=selected?[selected]:top;
 const totals=full.map(p=>keys.reduce((s,k)=>s+(p.parts[k]||0),0)),max=Math.max(1,...totals),unit=metric==='time'?'h':metric==='distance'?'km':'Einheiten';
 const columns=full.map((p,i)=>{const total=totals[i];const stack=keys.map(key=>{const val=p.parts[key]||0;return val>0?`<span style="height:${Math.max(0.6,100*val/max)}%;background:${TYPES[key]?.[2]||'#9AAFA4'}" title="${esc(TYPES[key]?.[0]||key)} · ${fmt(val,1)} ${unit}"></span>`:'';}).join('');return `<div class="sports-trend-col" title="${esc(p.period)} · ${fmt(total,1)} ${unit}"><div class="sports-trend-stack">${stack}</div><small>${i%Math.max(1,Math.floor(full.length/7))===0||i===full.length-1?esc(i===0||p.period.endsWith('-01')?p.period:p.period.slice(5)||p.period):''}</small></div>`;}).join('');
 return `<section class="sports-trend"><div class="sports-trend-heading"><strong>${selected?esc(TYPES[selected]?.[0]||selected)+' · ':''}Entwicklung nach ${metric==='time'?'Stunden':metric==='distance'?'Kilometern':'Einheiten'}</strong><small>${full.length} Zeitabschnitte · nur dokumentierte Aktivitäten</small></div><div class="sports-trend-chart" role="img" aria-label="Gestapelte Aktivitätsbalken nach Zeitraum">${columns}</div><div class="sports-trend-legend">${keys.map(k=>`<span><i style="background:${TYPES[k]?.[2]}"></i>${esc(TYPES[k]?.[0]||k)}</span>`).join('')}</div></section>`;
}
export function sportsInsightsView(sessions=[],activities=[],range={},options={}){
 const mode=options.mode||'all',today=options.today||range.end||'2026-10-19',anchor=options.anchor||today,metric=['time','count','distance'].includes(options.metric)?options.metric:'time';
 const selected=options.selected&&TYPES[options.selected]?options.selected:'';const groups=summarizeSports(sessions,activities,range),rows=sportsRows(sessions,activities,range),total=groups.reduce((s,g)=>s+g.minutes,0),distance=groups.filter(x=>x.measuredDistance&&DISTANCE_TYPES.has(x.type)).reduce((s,g)=>s+g.distanceKm,0);
 const tabs=SPORTS_MODES.map(([id,label])=>`<button type="button" data-action="sports-mode" data-id="${id}" class="sports-period-tab ${mode===id?'active':''}" aria-pressed="${mode===id}">${label}</button>`).join('');
 const metrics=[['time','Zeit'],['count','Einheiten'],['distance','Distanz']].map(([id,label])=>`<button type="button" data-action="sports-metric" data-id="${id}" class="sports-metric-tab ${metric===id?'active':''}" aria-pressed="${metric===id}">${label}</button>`).join('');
 const selectedRows=selected?rows.filter(r=>r.type===selected):[];
 return `<article class="insight-chart-card sports-insights"><div class="insight-figure-title"><div><small>SPORT & FREIZEIT · ACTIVITY INTELLIGENCE</small><h3>Wofür verwende ich meine Zeit?</h3></div><span class="insight-figure-note">${esc(range.start||'Beginn')} – ${esc(range.end||'heute')}</span></div>
 <div class="sports-control-line"><div class="sports-period-tabs" aria-label="Aktivitätszeitraum">${tabs}</div><div class="sports-period-arrows"><button type="button" data-action="sports-shift" data-id="-1" aria-label="Vorheriger Zeitraum" ${mode==='all'?'disabled':''}>‹</button><span>${esc(options.label||'Gesamt')}</span><button type="button" data-action="sports-shift" data-id="1" aria-label="Nächster Zeitraum" ${mode==='all'||sportsShiftAnchor(mode,anchor,1,today)===anchor?'disabled':''}>›</button></div></div>
 <div class="sports-summary"><span><strong>${fmt(total/60)} h</strong> dokumentiert</span><span><strong>${fmt(groups.reduce((s,g)=>s+g.count,0),0)}</strong> Einheiten</span><span><strong>${fmt(distance,1)} km</strong> dokumentierte Distanz</span><span><strong>${fmt(new Set(rows.map(r=>r.day)).size,0)}</strong> aktive Tage</span></div>
 <div class="sports-metric-tabs" aria-label="Aktivitätskennzahl">${metrics}</div>
 ${groups.length?`<div class="sports-card-grid">${groups.map(g=>{const value=metric==='count'?g.count:metric==='distance'?g.distanceKm:g.minutes/60;const suffix=metric==='count'?'Einheiten':metric==='distance'?'km':'h';const relevant=metric==='distance'?g.measuredDistance&&DISTANCE_TYPES.has(g.type):true;return `<button type="button" data-action="sports-select" data-id="${esc(g.type)}" aria-pressed="${selected===g.type}" class="sports-type-card ${selected===g.type?'active':''}"><span class="sports-type-head"><span class="sports-type-icon" aria-hidden="true">${esc(g.icon)}</span><strong>${esc(g.label)}</strong></span><span class="sports-type-amount">${relevant?fmt(value,1)+' '+suffix:'–'}</span><span class="sports-card-meter"><i style="width:${Math.max(.8,100*g.minutes/Math.max(total,1))}%;background:${g.color}"></i></span><span class="sports-card-bottom">${fmt(g.count,0)} ${g.count===1?'Einheit':'Einheiten'} · Ø ${fmt(g.minutes/g.count,0)} min</span><span class="sports-card-bottom">${fmt(g.activeDays,0)} aktive Tage${g.measuredDistance&&DISTANCE_TYPES.has(g.type)?' · '+fmt(g.distanceKm,1)+' km':''}</span></button>`;}).join('')}</div>`:'<p class="insight-no-data">Noch keine zuordenbaren Aktivitäten im Zeitraum. Über Datenquellen kannst du Garmin Activities.csv importieren.</p>'}
 ${selected?`<div class="sports-selected-detail"><button type="button" data-action="sports-select" data-id="${esc(selected)}" aria-label="Aktivitätsfilter entfernen">× Filter entfernen</button><strong>${esc(TYPES[selected][0])}</strong><span>${selectedRows.length} Einheiten · ${fmt(selectedRows.reduce((s,r)=>s+r.mins,0)/60)} h · Ø ${selectedRows.length?fmt(selectedRows.reduce((s,r)=>s+r.mins,0)/selectedRows.length,0):'–'} min</span><span>Letzte Einheiten: ${selectedRows.slice(0,4).map(x=>`${esc(x.day)} (${fmt(x.mins,0)} min)`).join(' · ')||'–'}</span></div>`:''}
 ${trendChart(rows,mode,metric,selected)}
 <p class="insight-figure-note">Garmin-Sessions und bestätigte Aktivitäten. Schwimmstrecken aus älteren Garmin-CSV-Importen werden als Meter interpretiert und in km umgerechnet; Distanz bei Tanzen/Sauna ist keine verlässliche Sportkennzahl. Fehlende Werte werden nicht geschätzt. Einheiten können mehrere Aufzeichnungen am selben Tag enthalten.</p></article>`;
}
