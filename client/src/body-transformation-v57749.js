/** Compass 0.5.77.49 — Body Transformation Intelligence.
 * Local, read-only join of documented Fitdays, Garmin strength and nutrition data.
 * Body impedance estimates are not direct muscle/fat measurements; observations
 * are not causal evidence of an effect of protein intake or strength training.
 */
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validDay=x=>typeof x==='string'&&DAY.test(x)&&Number.isFinite(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;
const shift=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
const number=(v,d=1)=>Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:d,minimumFractionDigits:d}):'–';
const fmtDate=d=>new Date(d+'T12:00:00Z').toLocaleDateString('de-AT',{day:'2-digit',month:'short',year:'numeric'});
const bounded=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?v:null;
const mean=x=>x.length?x.reduce((a,b)=>a+b,0)/x.length:null;
const windowDays={'7':7,'28':28,'90':90,'365':365,all:null};
function measurementDate(r){
 if(validDay(r?.day))return r.day;
 const x=typeof r?.at==='string'?r.at.slice(0,10):'';
 return validDay(x)?x:null;
}
function numericField(row,key){
 if(key==='weightKg')return bounded(row?.weightKg,20,400);
 if(key==='bodyFatPct')return bounded(row?.bodyFatPct,1,80);
 if(key==='muscleKg')return bounded(row?.muscleKg,1,200);
 if(key==='waterPct')return bounded(row?.waterPct,1,95);
 return null;
}
function normalizedFitdays(rows,start,today){
 const keyed=new Map();
 for(const r of Array.isArray(rows)?rows:[]){
  const day=measurementDate(r);if(!day||day>today||(start&&day<start))continue;
  if(['weightKg','bodyFatPct','muscleKg'].every(k=>numericField(r,k)===null))continue;
  const prev=keyed.get(day),date=Date.parse(r?.at||day+'T12:00:00Z');
  if(prev&&Number.isFinite(date)&&date<prev.time)continue;
  keyed.set(day,{day,time:Number.isFinite(date)?date:0,weightKg:numericField(r,'weightKg'),bodyFatPct:numericField(r,'bodyFatPct'),muscleKg:numericField(r,'muscleKg'),waterPct:numericField(r,'waterPct')});
 }
 return [...keyed.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
function nutritionSeries(index,start,today){
 const entries=index?.days instanceof Map?[...index.days.entries()]:[];
 const rows=[];
 for(const [day,b] of entries){
  if(!validDay(day)||day>today||(start&&day<start))continue;
  const summary=b?.summary||b;
  const p=summary?.coverage?.protein||{},k=summary?.coverage?.kcal||{};
  const protein=p.known>0?bounded(summary?.totals?.protein,0,600):null;
  const kcal=k.known>0?bounded(summary?.totals?.kcal,0,12000):null;
  rows.push({day,protein,kcal,partial:Boolean(p.unknown||p.partial||p.minimum),estimated:Boolean(p.estimated),count:summary?.entries||0});
 }
 return rows.sort((a,b)=>a.day.localeCompare(b.day));
}
function strengthSeries(sessions,start,today){
 const byDay=new Map();let incomplete=0;
 for(const s of Array.isArray(sessions)?sessions:[]){
  const day=measurementDate(s);if(!day||day>today||(start&&day<start))continue;
  const sets=s?.sets?.length||0,reported=Number.isInteger(s?.reportedSets)&&s.reportedSets>=0?s.reportedSets:0;
  const count=Math.max(sets,reported),rec=byDay.get(day)||{day,sessions:0,sets:0,unassigned:0};
  rec.sessions++;rec.sets+=count;rec.unassigned+=Math.max(0,reported-sets);
  byDay.set(day,rec);
  if(count===0)incomplete++;
 }
 return {rows:[...byDay.values()].sort((a,b)=>a.day.localeCompare(b.day)),incomplete};
}
const metricDefinition={weightKg:{label:'Gewicht',unit:'kg',digits:1,color:'#397D74'},bodyFatPct:{label:'Körperfett (BIA)',unit:'%',digits:1,color:'#C18B62'},muscleKg:{label:'Muskelmasse (BIA)',unit:'kg',digits:1,color:'#597DA4'}};
/** No interpolation: a missing day stays null, including gaps between imports. */
function metric(rows,key){
 const observations=rows.filter(r=>Number.isFinite(r[key])).map(r=>({day:r.day,value:r[key]}));
 const first=observations[0]||null,last=observations.at(-1)||null;
 return {key,...metricDefinition[key],points:observations,count:observations.length,first,last,delta:first&&last&&first.day!==last.day?last.value-first.value:null};
}
export function bodyTransformationModel(state,{today=new Date().toLocaleDateString('sv-SE'),range='90',nutritionIndex=null,strengthSessions=[]}={}){
 const target=validDay(today)?today:new Date().toLocaleDateString('sv-SE');
 const selection=Object.hasOwn(windowDays,String(range))?String(range):'90';
 const start=windowDays[selection]===null?null:shift(target,1-windowDays[selection]);
 const fitdays=normalizedFitdays(state?.healthImports?.fitdays,start,target);
 const nutrition=nutritionSeries(nutritionIndex,start,target),strength=strengthSeries(strengthSessions,start,target);
 const metrics=Object.values(metricDefinition).map((_,i)=>metric(fitdays,Object.keys(metricDefinition)[i]));
 const proteinDays=nutrition.filter(r=>r.protein!==null),kcalDays=nutrition.filter(r=>r.kcal!==null);
 const activityDays=new Set(strength.rows.map(r=>r.day));
 const joinedProteinStrengthDays=proteinDays.filter(r=>activityDays.has(r.day)).length;
 const latestMeasurement=fitdays.at(-1)?.day||null;
 return {today:target,start,range:selection,fitdays,metrics,weight:metrics[0],fat:metrics[1],muscle:metrics[2],nutrition,strength:strength.rows,
  sourceCounts:{fitdays:fitdays.length,protein:proteinDays.length,kcal:kcalDays.length,proteinPartial:proteinDays.filter(r=>r.partial||r.estimated).length,
   strength:strength.rows.length,strengthSessions:strength.rows.reduce((v,r)=>v+r.sessions,0),sets:strength.rows.reduce((v,r)=>v+r.sets,0),
   incompleteStrength:strength.incomplete,joinedProteinStrengthDays},
  last:{fitdays:latestMeasurement,protein:proteinDays.at(-1)?.day||null,strength:strength.rows.at(-1)?.day||null},
  avgProteinObserved:mean(proteinDays.map(r=>r.protein)),
  // Fat-free mass is derived and BIA-based, never added to device-reported muscle.
  estimatedFatFreeKg:fitdays.at(-1)?.weightKg!=null&&fitdays.at(-1)?.bodyFatPct!=null?
   fitdays.at(-1).weightKg*(1-fitdays.at(-1).bodyFatPct/100):null};
}
function plot(points,{start,today,label,unit,decimals=1,color='#397D74',empty='Keine dokumentierten Messwerte.'}={}){
 if(!points.length)return `<p class="bt749-empty">${esc(empty)}</p>`;
 const W=660,H=164,L=48,R=20,T=17,B=39;
 const values=points.map(p=>p.value),lo=Math.min(...values),hi=Math.max(...values),pad=Math.max((hi-lo)*.18,Math.abs(lo)*.012,.25);
 const ymin=lo-pad,ymax=hi+pad;
 const from=start||points[0].day,to=today||points.at(-1).day;
 const first=Date.parse(from+'T12:00:00Z'),last=Date.parse(to+'T12:00:00Z'),span=Math.max(86400000,last-first);
 const X=d=>L+(Date.parse(d+'T12:00:00Z')-first)/span*(W-L-R);
 const Y=v=>T+(ymax-v)/(ymax-ymin)*(H-T-B);
 const xgrid=[0,.25,.5,.75,1].map(f=>{const x=L+f*(W-L-R);return `<line x1="${x.toFixed(2)}" y1="${T}" x2="${x.toFixed(2)}" y2="${H-B}" stroke="currentColor" opacity=".07"/>`;}).join('');
 const ticks=[0,.5,1].map(f=>{const y=Y(ymin+(ymax-ymin)*f);return `<text x="${L-7}" y="${(y+3).toFixed(2)}" text-anchor="end">${esc(number(ymin+(ymax-ymin)*f,decimals))}</text>`;}).join('');
 const dots=points.map(p=>`<circle cx="${X(p.day).toFixed(2)}" cy="${Y(p.value).toFixed(2)}" r="${points.length>180?2.5:4.5}" fill="${p.partial||p.estimated?'#fff':color}" stroke="${color}" stroke-width="${p.partial||p.estimated?2:1.2}" tabindex="0"><title>${esc(fmtDate(p.day))}: ${esc(number(p.value,decimals))} ${esc(unit)}${p.partial||p.estimated?' · geschätzter oder partieller Protokollwert':''}</title></circle>`).join('');
 return `<svg class="bt749-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} · ${points.length} einzelne dokumentierte Werte ohne Interpolation"><g class="bt749-grid">${xgrid}${ticks}</g>${dots}<text x="${L}" y="${H-9}">${esc(fmtDate(from))}</text><text x="${W-R}" y="${H-9}" text-anchor="end">${esc(fmtDate(to))}</text></svg>`;
}
const stale=(d,today)=>!d?'Noch kein Import':`${fmtDate(d)}${(Date.parse(today)-Date.parse(d))/86400000>30?' · älter als 30 Tage':''}`;
function metricCard(m,model){
 const change=m.delta===null?'Noch kein Vergleich möglich':`${m.delta>0?'+':''}${number(m.delta,m.digits)} ${m.unit} · erste vs. letzte Messung im Zeitraum`;
 return `<article class="bt749-metric"><div class="bt749-label"><span>${esc(m.label)}</span><small>${m.count} Messdatum${m.count===1?'':'en'}</small></div><div class="bt749-number">${m.last?esc(number(m.last.value,m.digits))+' <small>'+esc(m.unit)+'</small>':'–'}</div><p class="bt749-change">${esc(change)}</p>${plot(m.points,{...m,start:model.start,today:model.today,label:m.label,unit:m.unit,decimals:m.digits,color:m.color})}</article>`;
}
function occupancy(rows,metricName,color,start,today){
 const points=rows.filter(r=>Number.isFinite(r[metricName])).map(r=>({day:r.day,value:r[metricName],partial:r.partial,estimated:r.estimated}));
 return plot(points,{start,today,label:metricName==='protein'?'Protokolliertes Protein':'Garmin Krafttraining',unit:metricName==='protein'?'g':'Sätze',decimals:0,color,empty:metricName==='protein'?'Keine quantifizierbaren Proteinprotokolle.':'Keine Krafttrainings-Sätze im Import.'});
}
export function bodyTransformationView(state,options={}){
 const m=bodyTransformationModel(state,options),c=m.sourceCounts;
 return `<section class="bt749-shell" aria-label="Body Transformation Intelligence">
 <header class="bt749-head"><div><span class="bt749-kicker">RELAXED CONTROL · BODY TRANSFORMATION</span><h2>Körper, Training &amp; Ernährung</h2><p>Individuelle Messpunkte statt geglätteter Kurven. Drei Datenquellen auf einer Zeitachse, ohne aus einzelnen Werten einen Trainingserfolg zu behaupten.</p></div><span class="bt749-period">${esc(m.start?`${fmtDate(m.start)} – ${fmtDate(m.today)}`:'Gesamte Datenhistorie')}</span></header>
 <div class="bt749-cards">${m.metrics.map(metric=>metricCard(metric,m)).join('')}</div>
 <div class="bt749-support">
  <article class="bt749-observations"><div class="bt749-row"><h3>💪 Garmin Krafttraining</h3><strong>${c.strengthSessions} Sessions · ${c.sets} Sätze</strong></div><p>${c.strength} Trainingstag(e) dokumentiert; Einzelsätze und CSV-Gesamtzahlen werden nicht doppelt gezählt, sofern sie zuvor als dieselbe Session zusammengeführt wurden.</p>${occupancy(m.strength,'sets','#4C809E',m.start,m.today)}</article>
  <article class="bt749-observations"><div class="bt749-row"><h3>🌱 Ernährungsjournal · Protein</h3><strong>${m.avgProteinObserved===null?'–':number(m.avgProteinObserved,0)+' g'} <small>Ø erfasster Tage</small></strong></div><p>${c.protein} Tag(e) mit quantifizierter Proteinzufuhr; davon ${c.proteinPartial} mit unvollständigen, geschätzten oder Mindestwerten. Fehlende Tage zählen ausdrücklich nicht als 0 g. Offene Kreise kennzeichnen teilweise bekannte oder geschätzte Tage.</p>${occupancy(m.nutrition,'protein','#9C769B',m.start,m.today)}</article>
 </div>
 <div class="bt749-footer"><div><strong>Datenabdeckung</strong><p>Fitdays: ${c.fitdays} Messtag(e), letzter ${esc(stale(m.last.fitdays,m.today))}. Garmin Krafttraining: ${c.strength} Tag(e), letzter ${esc(stale(m.last.strength,m.today))}. Protein: ${c.protein} Tag(e), letzter ${esc(stale(m.last.protein,m.today))}.</p><p>Training und Protein am selben Tag dokumentiert: <strong>${c.joinedProteinStrengthDays}</strong> Tag(e). Das ist eine zeitliche Überlappung, kein Wirksamkeitsnachweis.</p></div><p class="bt749-disclaimer"><strong>Methodik:</strong> Fitdays ist eine BIA-Schätzung; Gewichtsschwankungen, Hydratation, Messzeit und Gerätealgorithmus können Fett- und Muskelwerte beeinflussen. Die Deltas zeigen ausschließlich erste und letzte Messung des gewählten Zeitraums und sind keine Wachstumsdiagnose. Ernährungsdaten sind protokollierte Teilmengen; aus fehlenden Einträgen lässt sich kein Kaloriendefizit bestimmen. Keine automatische Gesundheitsbewertung oder Trainingsempfehlung.</p></div>
 </section>`;
}
