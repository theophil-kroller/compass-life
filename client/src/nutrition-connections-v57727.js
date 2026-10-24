/** Compass 0.5.77.27 · Nutrition Insights 3.
 * Local, read-only joins between documented food, following-night Garmin sleep,
 * same-day movement and separately volunteered emotional check-ins.
 * Missing is never zero; descriptive association is never causality.
 */
import {nutritionTrendsIndex} from './nutrition-trends-v57726.js';
import {nutritionTimingIndex} from './nutrition-timing-v57725.js';
import {joinedFitnessDays} from './insights-fitness.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayRe=/^\d{4}-\d{2}-\d{2}$/;
const dayOf=date=>{const d=date instanceof Date?date:new Date(date);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const shift=(day,n)=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return dayOf(d);};
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const fmt=(n,dec=1)=>finite(n)?n.toLocaleString('de-AT',{maximumFractionDigits:dec}):'–';
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const formatDay=day=>new Date(day+'T12:00:00').toLocaleDateString('de-AT',{day:'2-digit',month:'short'});
const mood={calm:['🌿','Ruhe'],joy:['☀️','Freude'],fear:['🌫️','Angst'],anger:['🔥','Wut'],sadness:['🌧️','Trauer'],affection:['❤️','Zuneigung']};
export const NUTRITION_LINK_INPUTS=Object.freeze([
 {id:'lastMeal',label:'Letzte Kalorienaufnahme',unit:'Uhr',icon:'🕒',dec:2},
 {id:'kcal',label:'Dokumentierte Kalorien',unit:'kcal',icon:'⚡',dec:0},
 {id:'protein',label:'Protein',unit:'g',icon:'💪',dec:1},
 {id:'caffeine',label:'Koffein',unit:'mg',icon:'☕',dec:0}
]);
export const NUTRITION_LINK_OUTCOMES=Object.freeze([
 {id:'sleep',label:'Schlafdauer · folgende Nacht',unit:'h',icon:'🌙',dec:2},
 {id:'steps',label:'Schritte · gleicher Tag',unit:'Schritte',icon:'🚶',dec:0},
 ...Object.entries(mood).map(([id,[icon,name]])=>({id:'mood:'+id,label:'Gefühl: '+name+' · gleicher Tag',unit:'Intensität 1–10',icon,dec:1}))
]);
const inputBy=id=>NUTRITION_LINK_INPUTS.find(x=>x.id===id)||NUTRITION_LINK_INPUTS[0];
const outputBy=id=>NUTRITION_LINK_OUTCOMES.find(x=>x.id===id)||NUTRITION_LINK_OUTCOMES[0];
const rangeDays={'30':30,'90':90,'365':365,all:null};
const field=(row,key)=>finite(row?.[key])?row[key]:null;
export function sleepMinutesOf(night){
 const totals=night?.totals||{},parts=['deep','light','rem'].map(k=>field(totals,k));
 if(parts.every(v=>v===null))return null;
 const sum=parts.reduce((n,v)=>n+(v??0),0);
 return sum>0&&sum<=1440?sum:null;
}
const rank=xs=>{
 const pairs=xs.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v),out=Array(xs.length);let a=0;
 while(a<pairs.length){let b=a+1;while(b<pairs.length&&pairs[b].v===pairs[a].v)b++;
  for(let i=a;i<b;i++)out[pairs[i].i]=(a+b+1)/2;a=b;
 }return out;
};
/** Tied-rank-aware Spearman rho, omitted for < 10 pairs or constant values. */
export function nutritionSpearman(pairs){
 if(pairs.length<10)return null;
 const x=rank(pairs.map(p=>p.x)),y=rank(pairs.map(p=>p.y)),mx=mean(x),my=mean(y);
 let co=0,vx=0,vy=0;for(let i=0;i<x.length;i++){const a=x[i]-mx,b=y[i]-my;co+=a*b;vx+=a*a;vy+=b*b;}
 return vx>0&&vy>0?co/Math.sqrt(vx*vy):null;
}
/** A transparent, testable join over normalized known daily observations. No imputation. */
export function joinNutritionObservations(inputs=[],outcomes=[],{today=dayOf(new Date()),range='90',outcome='sleep'}={}){
 const n=Object.hasOwn(rangeDays,String(range))?rangeDays[range]:90;
 const start=n?shift(today,1-n):null, byOutcome=new Map();
 for(const o of outcomes){if(dayRe.test(o?.day||'')&&finite(o.value))byOutcome.set(o.day,o);}
 const rows=inputs.filter(i=>dayRe.test(i?.day||'')&&i.day<=today&&(!start||i.day>=start))
  .sort((a,b)=>a.day.localeCompare(b.day));
 const points=[],withoutOutcome=[],withoutInput=[];
 for(const r of rows){const targetDay=outcome==='sleep'?shift(r.day,1):r.day;
  // Do not treat a future night as observed.
  const target=targetDay<=today?byOutcome.get(targetDay):null;
  if(!finite(r.value)){withoutInput.push(r.day);continue;}
  if(!target){withoutOutcome.push(r.day);continue;}
  points.push({day:r.day,targetDay,x:r.value,y:target.value,partial:!!r.partial,estimated:!!r.estimated,
   source:r.source||'',outcomeSource:target.source||'',checkins:target.checkins||0});
 }
 const known=rows.filter(r=>finite(r.value));
 return {points,rows,from:start,until:today,withInput:known.length,logged:rows.length,
  withoutInput,withoutOutcome,rho:nutritionSpearman(points)};
}
/** Assemble source-aware rows using the existing nutrition indexes and health imports. */
export function nutritionConnectionSeries(state,{input='lastMeal',outcome='sleep',range='90',today=dayOf(new Date()),healthDays=[]}={}){
 input=inputBy(input).id;outcome=outputBy(outcome).id;
 const trends=nutritionTrendsIndex(state),timing=nutritionTimingIndex(state),days=new Set([...trends.days.keys(),...timing.days.keys()]);
 const inputs=[...days].sort().map(day=>{
  const a=trends.days.get(day)?.summary,b=timing.days.get(day)?.summary,c=a?.coverage?.[input];
  let value=null,partial=false,estimated=false;
  if(input==='lastMeal'){
   if(finite(b?.last)){const d=new Date(b.last);value=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;partial=b.unknown>0;estimated=false;}
  }else if(input==='kcal'){
   if(b?.known>0){value=b.kcal;partial=b.unknown>0;estimated=b.events?.some(e=>e.estimated)||false;}
  }else if(c?.known>0){value=field(a?.totals,input);partial=Boolean(c.unknown||c.partial);estimated=Boolean(c.estimated||c.minimum);}
  return {day,value,partial,estimated,source:'Ernährungsjournal'};
 });
 const imported=state?.healthImports||{};let outcomes=[];
 if(outcome==='sleep')outcomes=(imported.garminNights||[]).map(n=>({day:n.day,value:(v=>v===null?null:v/60)(sleepMinutesOf(n)),source:'Garmin Schlaf'}));
 else if(outcome==='steps')outcomes=joinedFitnessDays(imported,healthDays,today,{start:null,end:today})
  .map(r=>({day:r.day,value:field(r,'steps'),source:r.stepsSource||'Aktivitätsimport'}));
 else{
  const id=outcome.slice(5),groups=new Map();
  for(const entry of state?.feelingCheckins||[]){
   if(!entry||!dayRe.test(entry.day||'')||!Array.isArray(entry.items))continue;
   const vals=entry.items.filter(i=>i.id===id&&Number.isInteger(i.intensity)&&i.intensity>=1&&i.intensity<=10);
   if(!vals.length)continue;
   if(!groups.has(entry.day))groups.set(entry.day,[]);
   groups.get(entry.day).push(...vals.map(v=>v.intensity));
  }
  outcomes=[...groups].map(([day,values])=>({day,value:mean(values),checkins:values.length,source:'Freiwilliger Gefühlseintrag'}));
 }
 return {...joinNutritionObservations(inputs,outcomes,{today,range,outcome}),input,outcome,
  inputDef:inputBy(input),outputDef:outputBy(outcome)};
}
function display(v,def){
 if(def.id==='lastMeal'){const total=Math.round(v*60),h=Math.floor(total/60)%24,m=total%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
 return fmt(v,def.dec)+' '+def.unit;
}
function scatter(data){
 const points=data.points;if(!points.length)return '<p class="ni727-empty">Noch keine zeitlich zuordenbaren Datenpaare. Ernährungs- und passende Gesundheits-/Gefühlsdaten für dieselben Tage benötigt.</p>';
 const width=800,height=290,l=72,r=24,t=22,b=61,plotW=width-l-r,plotH=height-t-b;
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
 const xp=Math.max((xmax-xmin)*.1, data.input==='lastMeal'?.6:1),yp=Math.max((ymax-ymin)*.12,data.outcome.startsWith('mood:')?.5:1);
 const axlo=data.input==='lastMeal'?Math.max(0,xmin-xp):Math.max(0,xmin-xp),axhi=data.input==='lastMeal'?Math.min(24,Math.max(axlo+.25,xmax+xp)):Math.max(axlo+.25,xmax+xp);
 const aylo=Math.max(0,ymin-yp),ayhi=Math.max(aylo+.5,ymax+yp);
 const X=v=>l+(v-axlo)/(axhi-axlo)*plotW,Y=v=>t+(ayhi-v)/(ayhi-aylo)*plotH;
 const ygrid=Array.from({length:5},(_,i)=>{const value=aylo+(ayhi-aylo)*i/4,yy=Y(value);return `<line x1="${l}" y1="${yy}" x2="${width-r}" y2="${yy}" stroke="currentColor" opacity=".12"/><text x="${l-11}" y="${yy+4}" text-anchor="end">${esc(fmt(value,data.outputDef.dec))}</text>`;}).join('');
 const xticks=Array.from({length:5},(_,i)=>{const value=axlo+(axhi-axlo)*i/4,xx=X(value);return `<text x="${xx}" y="${height-b+26}" text-anchor="middle">${esc(data.input==='lastMeal'?display(value,data.inputDef):fmt(value,data.inputDef.dec))}</text>`;}).join('');
 const dots=points.map(p=>{
  const tip=`${p.day} → ${p.targetDay}: ${display(p.x,data.inputDef)} / ${display(p.y,data.outputDef)}${p.partial?' · Ernährungs-Teilbilanz':''}${p.estimated?' · Schätzung enthalten':''}${p.checkins?' · '+p.checkins+' Gefühlsnennung(en)':''}`;
  const mark=p.estimated||p.partial;return `<circle class="ni727-dot" cx="${X(p.x).toFixed(2)}" cy="${Y(p.y).toFixed(2)}" r="${points.length>80?3:5}" fill="${mark?'var(--surface,#fff)':'#507C9A'}" stroke="#507C9A" stroke-width="${mark?2.3:1.3}" tabindex="0" aria-label="${esc(tip)}"><title>${esc(tip)}</title></circle>`;
 }).join('');
 return `<div class="ni727-scroller" tabindex="0"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Punktdiagramm ${esc(data.inputDef.label)} und ${esc(data.outputDef.label)}, ${points.length} individuelle Datenpaare">${ygrid}${xticks}${dots}<text class="ni727-axis-label" x="${l}" y="13">${esc(data.outputDef.unit)}</text><text class="ni727-axis-label" x="${width-r}" y="${height-10}" text-anchor="end">${esc(data.inputDef.label)}</text></svg></div><div class="ni727-legend"><span><i class="ni727-solid"></i>Quantifizierter Punkt</span><span><i class="ni727-outline"></i>Teilbilanz / Schätzung</span><span>Jeder Punkt = ein zuordenbarer Protokolltag</span></div>`;
}
export function nutritionConnectionsView(state,{input='lastMeal',outcome='sleep',range='90',today=dayOf(new Date()),healthDays=[]}={}){
 const d=nutritionConnectionSeries(state,{input,outcome,range,today,healthDays});
 const inputButtons=NUTRITION_LINK_INPUTS.map(a=>`<button type="button" data-action="ni727-input" data-id="${a.id}" class="${a.id===d.input?'selected':''}" aria-pressed="${a.id===d.input}">${a.icon} ${esc(a.label)}</button>`).join('');
 const outputOptions=NUTRITION_LINK_OUTCOMES.map(a=>`<option value="${a.id}" ${a.id===d.outcome?'selected':''}>${a.icon} ${esc(a.label)}</option>`).join('');
 const available=d.rho===null?'–':fmt(d.rho,2);
 const rhoText=d.points.length<10?`Ab 10 zuordenbaren Tagen wird eine rein beschreibende Spearman-Rangkorrelation angezeigt (aktuell n = ${d.points.length}).`:
  d.rho===null?'Keine Rangkorrelation berechenbar: mindestens eine Variable hat keine Streuung.':'Spearman ρ beschreibt hier nur die Rangordnung der dokumentierten Punkte, keine Ursache, keine Prognose und keinen statistischen Signifikanztest.';
 const sourceHint=d.outcome==='sleep'?'Schlafdaten tragen das Aufwachdatum; Ernährung vom Vortag wird mit der folgenden Nacht verknüpft.':d.outcome==='steps'?'Schritte vom selben Kalendertag; Garmin-Werte haben Vorrang vor Health Connect.':'Nur die explizit ausgewählte Gefühls-Kategorie mit tatsächlich erfasster Intensität. Andere Gefühle werden NICHT als Intensität 0 behandelt.';
 const recent=[...d.points].reverse().slice(0,24).map(p=>`<tr><td>${esc(formatDay(p.day))}</td><td>${esc(display(p.x,d.inputDef))}${p.estimated||p.partial?' <span title="Schätzung oder unvollständige Ernährungserfassung">◌</span>':''}</td><td>${esc(formatDay(p.targetDay))}</td><td>${esc(display(p.y,d.outputDef))}</td></tr>`).join('');
 return `<div class="ni727-root" aria-label="Nutrition Insights 3 · persönliche Zusammenhänge">
  <section class="work-card ni727-top"><div class="work-heading"><span>🔗 Ernährung &amp; Wohlbefinden · Zusammenhänge</span><small>lokal · explorativ</small></div>
   <div class="ni727-controls"><div class="ni727-ranges" role="group" aria-label="Zeitraum">${[['30','30 Tage'],['90','90 Tage'],['365','1 Jahr'],['all','Gesamt']].map(([id,label])=>`<button type="button" data-action="ni727-range" data-id="${id}" class="${String(range)===id?'selected':''}" aria-pressed="${String(range)===id}">${label}</button>`).join('')}</div>
   <div class="ni727-select-row"><label for="ni727-outcome">Vergleichen mit</label><select id="ni727-outcome" aria-label="Wohlbefindens-Messwert">${outputOptions}</select></div></div>
   <div class="ni727-inputs" role="group" aria-label="Ernährungsvariable">${inputButtons}</div>
   <div class="ni727-kpis"><div><small>Zuordenbare Tage</small><strong>${d.points.length}</strong></div><div><small>Ernährung mit Wert</small><strong>${d.withInput} / ${d.logged}</strong></div><div><small>Ohne passenden Folgewert</small><strong>${d.withoutOutcome.length}</strong></div><div><small>Spearman ρ</small><strong>${available}</strong></div></div>
   <p class="ni727-note"><strong>${esc(sourceHint)}</strong> ${esc(rhoText)}</p>
   ${scatter(d)}
   <p class="ni727-note">Kein automatisch ermittelter Tagesgesamtverzehr: Es werden nur dokumentierte Portionen verwendet. Leere Einträge bedeuten „nicht bekannt“, niemals automatisch 0. Punkte mit ◌ enthalten Schätzungen oder Teilbilanzen. Auswahl, Berechnung und Darstellung bleiben lokal im entsperrten Tresor.</p>
  </section>
  <section class="work-card"><div class="work-heading"><span>🧾 Datenpaare nachvollziehen</span><small>${d.points.length} Paare · letzte ${Math.min(24,d.points.length)} sichtbar</small></div>
   ${d.points.length?`<details class="ni727-details"><summary>Einzeltage und zugeordnete Werte anzeigen</summary><div class="ni727-table-scroll"><table><thead><tr><th>Ernährung am</th><th>${esc(d.inputDef.label)}</th><th>Zieltag</th><th>${esc(d.outputDef.label)}</th></tr></thead><tbody>${recent}</tbody></table></div></details>`:'<p class="ni727-note">Noch keine Datenpaare zum Prüfen.</p>'}
   <div class="ni727-footnote">Interpretation: Selbstbeobachtung mit unvollständigen Aufzeichnungen, potenziellen Messfehlern und vielen Störvariablen (z. B. Wochentag, Arbeitsbelastung, Krankheit). Auch hohe Korrelationen sind kein Hinweis auf eine ernährungsbedingte Wirkung. Keine medizinische Aussage.</div>
  </section></div>`;
}
