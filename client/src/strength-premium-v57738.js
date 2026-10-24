/** Compass 0.5.77.39 · Reference-style strength dashboard.
 * Uses Compass' own data and region mapping but redraws the body illustration in a
 * slimmer line-art style closer to the user's preferred fitness-app references.
 * This remains a model of documented involvement, not measured EMG/fatigue/growth.
 */
import { detailedMuscleData } from './strength-anatomy-v57737.js';

const e=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
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

const BODY_FILL='#2a3342';
const BODY_STROKE='#8f9aab';
const INNER_STROKE='#566275';
const OFF_FILL='#1f2733';

function colorForRegion(region, mode='roles', cyclingPrimary=false, cyclingSecondary=false, activity='combined'){
 const primary=region?.primary||0, secondary=region?.secondary||0, index=region?.index||0;
 const hasStrength=activity!=='cycling' && (primary>0 || secondary>0);
 if(hasStrength){
  if(mode==='roles') return primary>0 ? '#ef533f' : '#f2c857';
  return index>=8 ? '#df4d38' : index>=5 ? '#ea7d2f' : index>=2.5 ? '#f3b24c' : '#f3cf67';
 }
 if(activity!=='strength' && cyclingPrimary) return '#f2a531';
 if(activity!=='strength' && cyclingSecondary) return '#f2c857';
 return OFF_FILL;
}
function strokeForRegion(region, cyclingPrimary=false, cyclingSecondary=false, activity='combined'){
 const hasStrength=activity!=='cycling' && ((region?.primary||0)>0 || (region?.secondary||0)>0);
 if(hasStrength || cyclingPrimary || cyclingSecondary) return '#101720';
 return '#6a7588';
}
function regionTitle(region, cyclingPrimary=false, cyclingSecondary=false){
 return `${region?.label||''}: ${region?.primary||0} Hauptsätze; ${region?.secondary||0} unterstützende Satzbeteiligungen${cyclingPrimary||cyclingSecondary?'; bei dokumentiertem Radfahren anatomisch mitbeansprucht (kein Satz)':''}`;
}
function pathNode(region,path,fill,stroke){
 const title=regionTitle(region);
 return `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" tabindex="0" aria-label="${e(title)}"><title>${e(title)}</title></path>`;
}
function nodeFor(id, region, markup, fill, stroke){
 const title=regionTitle(region);
 return markup.replace(/__FILL__/g,fill).replace(/__STROKE__/g,stroke).replace(/__TITLE__/g,e(title)).replace(/__ID__/g,id);
}

const FIG={
 front:{
  outline:[
   '<ellipse cx="140" cy="54" rx="35" ry="43" fill="none" stroke="'+BODY_STROKE+'" stroke-width="3"/>',
   '<path d="M122 98 L158 98 L162 122 Q184 126 200 138 L216 219 L203 245 186 236 190 205 176 246 176 290 170 481 142 483 136 353 132 353 126 483 98 481 92 290 92 246 78 205 82 236 65 245 52 219 64 138 Q80 126 102 122 L106 98 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M64 138 L48 174 44 222 56 247 74 238 78 206 70 180 78 149 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M216 138 L232 174 236 222 224 247 206 238 202 206 210 180 202 149 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M92 290 L94 485 116 483 123 355 118 323 108 305 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M188 290 L186 485 164 483 157 355 162 323 172 305 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>'
  ],
  lines:[
   '<path d="M122 129 Q140 138 158 129" fill="none" stroke="'+INNER_STROKE+'" stroke-width="2"/>',
   '<path d="M117 167 Q140 178 163 167" fill="none" stroke="'+INNER_STROKE+'" stroke-width="1.8"/>',
   '<path d="M140 126 L140 290" fill="none" stroke="'+INNER_STROKE+'" stroke-width="2"/>',
   '<path d="M116 194 L128 194 M152 194 L164 194 M117 221 L129 221 M151 221 L163 221 M119 248 L130 248 M150 248 L161 248" fill="none" stroke="'+INNER_STROKE+'" stroke-width="1.7" stroke-linecap="round"/>',
   '<path d="M109 177 L98 218 L103 255" fill="none" stroke="'+INNER_STROKE+'" stroke-width="1.6"/>',
   '<path d="M171 177 L182 218 L177 255" fill="none" stroke="'+INNER_STROKE+'" stroke-width="1.6"/>'
  ],
  regions:{
   pectoral_upper:[
    'M106 132 Q120 120 138 130 L138 163 Q116 168 102 152 Z',
    'M174 132 Q160 120 142 130 L142 163 Q164 168 178 152 Z'
   ],
   pectoral_lower:[
    'M102 152 Q121 166 138 163 L138 186 Q116 191 100 178 Z',
    'M178 152 Q159 166 142 163 L142 186 Q164 191 180 178 Z'
   ],
   deltoid_front:[
    'M100 121 Q84 125 76 142 L87 164 L106 144 Z',
    'M180 121 Q196 125 204 142 L193 164 L174 144 Z'
   ],
   deltoid_side:[
    'M78 143 Q67 154 64 170 L74 184 88 164 Z',
    'M202 143 Q213 154 216 170 L206 184 192 164 Z'
   ],
   biceps:[
    'M78 182 L92 188 Q88 219 79 253 L63 247 Q71 211 78 182 Z',
    'M202 182 L188 188 Q192 219 201 253 L217 247 Q209 211 202 182 Z'
   ],
   brachialis:[
    'M83 252 L97 258 L93 281 L79 279 Z',
    'M197 252 L183 258 L187 281 L201 279 Z'
   ],
   forearm_flex:[
    'M79 280 L96 286 L86 335 L70 329 Z',
    'M201 280 L184 286 L194 335 L210 329 Z'
   ],
   rectus_abdominis:[
    'M126 193 L138 193 L138 219 L126 219 Z','M142 193 L154 193 L154 219 L142 219 Z',
    'M124 222 L136 222 L136 247 L124 247 Z','M144 222 L156 222 L156 247 L144 247 Z',
    'M124 250 L136 250 L136 276 L124 276 Z','M144 250 L156 250 L156 276 L144 276 Z'
   ],
   obliques:[
    'M112 186 L124 194 L120 260 L107 271 L100 230 Z',
    'M168 186 L156 194 L160 260 L173 271 L180 230 Z'
   ],
   quadriceps:[
    'M105 301 L126 301 L121 410 L99 432 L96 364 Z',
    'M175 301 L154 301 L159 410 L181 432 L184 364 Z',
    'M128 302 L138 302 L136 420 L127 436 Z',
    'M152 302 L142 302 L144 420 L153 436 Z'
   ],
   adductors:[
    'M140 302 L132 303 L128 360 L140 387 Z',
    'M140 302 L148 303 L152 360 L140 387 Z'
   ],
   tibialis:[
    'M102 396 L115 397 L117 464 L103 473 Z',
    'M178 396 L165 397 L163 464 L177 473 Z'
   ]
  }
 },
 back:{
  outline:[
   '<ellipse cx="140" cy="54" rx="35" ry="43" fill="none" stroke="'+BODY_STROKE+'" stroke-width="3"/>',
   '<path d="M122 98 L158 98 L162 122 Q184 126 200 138 L216 219 L203 245 186 236 190 205 176 246 176 290 170 481 142 483 136 353 132 353 126 483 98 481 92 290 92 246 78 205 82 236 65 245 52 219 64 138 Q80 126 102 122 L106 98 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M64 138 L48 174 44 222 56 247 74 238 78 206 70 180 78 149 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M216 138 L232 174 236 222 224 247 206 238 202 206 210 180 202 149 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M92 290 L94 485 116 483 123 355 118 323 108 305 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>',
   '<path d="M188 290 L186 485 164 483 157 355 162 323 172 305 Z" fill="'+BODY_FILL+'" stroke="'+BODY_STROKE+'" stroke-width="3" stroke-linejoin="round"/>'
  ],
  lines:[
   '<path d="M124 124 Q140 138 156 124" fill="none" stroke="'+INNER_STROKE+'" stroke-width="2"/>',
   '<path d="M140 124 L140 292" fill="none" stroke="'+INNER_STROKE+'" stroke-width="2"/>',
   '<path d="M108 159 Q122 170 140 174 Q158 170 172 159" fill="none" stroke="'+INNER_STROKE+'" stroke-width="1.7"/>',
   '<path d="M110 177 L120 217 L115 262 M170 177 L160 217 L165 262" fill="none" stroke="'+INNER_STROKE+'" stroke-width="1.6"/>',
   '<path d="M110 285 Q124 274 140 274 Q156 274 170 285" fill="none" stroke="'+INNER_STROKE+'" stroke-width="2"/>'
  ],
  regions:{
   trapezius_upper:[
    'M108 126 L140 144 L128 174 L100 154 Z','M172 126 L140 144 L152 174 L180 154 Z'
   ],
   trapezius_mid:[
    'M110 174 L140 146 L140 196 L118 205 Z','M170 174 L140 146 L140 196 L162 205 Z'
   ],
   rhomboids:[
    'M118 207 L140 197 L140 244 L124 234 Z','M162 207 L140 197 L140 244 L156 234 Z'
   ],
   deltoid_side:[
    'M78 143 Q67 154 64 170 L74 184 88 164 Z','M202 143 Q213 154 216 170 L206 184 192 164 Z'
   ],
   deltoid_rear:[
    'M100 121 Q84 125 76 142 L87 164 L106 144 Z','M180 121 Q196 125 204 142 L193 164 L174 144 Z'
   ],
   latissimus:[
    'M108 178 L122 208 L122 268 L99 248 L90 204 Z','M172 178 L158 208 L158 268 L181 248 L190 204 Z'
   ],
   triceps:[
    'M78 182 L92 188 Q88 219 79 253 L63 247 Q71 211 78 182 Z','M202 182 L188 188 Q192 219 201 253 L217 247 Q209 211 202 182 Z'
   ],
   forearm_ext:[
    'M79 280 L96 286 L86 335 L70 329 Z','M201 280 L184 286 L194 335 L210 329 Z'
   ],
   erector_spinae:[
    'M132 248 L140 255 L140 300 L129 296 Z','M148 248 L140 255 L140 300 L151 296 Z'
   ],
   glute_med:[
    'M108 267 Q121 258 138 264 L132 283 L104 290 Z','M172 267 Q159 258 142 264 L148 283 L176 290 Z'
   ],
   glute_max:[
    'M103 288 L138 282 L140 334 Q123 343 103 327 Z','M177 288 L142 282 L140 334 Q157 343 177 327 Z'
   ],
   hamstrings:[
    'M105 337 L132 337 L128 441 L100 430 Z','M175 337 L148 337 L152 441 L180 430 Z'
   ],
   calves_gastro:[
    'M103 430 L120 432 L122 472 L111 494 L100 470 Z','M177 430 L160 432 L158 472 L169 494 L180 470 Z'
   ],
   calves_soleus:[
    'M113 494 L122 474 L120 523 L104 529 Z','M167 494 L158 474 L160 523 L176 529 Z'
   ]
  }
 }
};

function renderFigure(side,data,mode,cycling,activity){
 const fig=FIG[side];
 const bike=cycling?.rides>0 && activity!=='strength' ? cycling.regions : {primary:[],secondary:[]};
 const defs=`<defs><filter id="str739-glow-${side}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#f1b347" flood-opacity="0.22"/></filter></defs>`;
 const regions=Object.entries(fig.regions).map(([id,parts])=>{
  const region=data.regions[id]||{label:id,primary:0,secondary:0,index:0};
  const cyclingPrimary=bike.primary.includes(id), cyclingSecondary=bike.secondary.includes(id);
  const fill=colorForRegion(region,mode,cyclingPrimary,cyclingSecondary,activity);
  const stroke=strokeForRegion(region,cyclingPrimary,cyclingSecondary,activity);
  return parts.map(part=>pathNode(region,part,fill,stroke)).join('');
 }).join('');
 return `<svg viewBox="0 0 280 560" class="str738-body str739-body" role="img" aria-label="Muskelkarte ${side==='front'?'vorne':'hinten'} im Referenzstil">${defs}${fig.outline.join('')}${regions}<g class="str739-inner">${fig.lines.join('')}</g></svg>`;
}

export function premiumStrengthSvg(model,side,mode,cycling,activity){
 const data=detailedMuscleData(model);
 return renderFigure(side,data,mode,cycling,activity);
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
 return `<section class="str738-ranked" aria-label="Muskelregionen nach Satzbeteiligung"><div class="str738-rank-head"><h3>MUSKELBETEILIGUNG</h3><span>${fmt(data.mapped)} zugeordnete Sätze · ${fmt(data.unmapped)} noch offen</span></div>${bars||'<p>Ordne im Satzeditor Übungen zu, um die Muskelbeteiligung zu sehen. Radfahrten werden separat berücksichtigt.</p>'}<p>Eine Satzbeteiligung ist keine Messung von Muskelaktivierung, Ermüdung oder Wachstum. Mit Fitdays-Körperdaten sollte nur der Trend über Wochen und Monate interpretiert werden, nicht ein einzelner Tageswert.</p></section>`;
}

export function strengthPremiumMap(model,cycling,activity='combined',side='front'){
 const mode=side==='back'?'load':'roles';
 const legend=mode==='roles'?[['#ef533f','Hauptmuskel'],['#f2c857','Unterstützend']]:[['#f3cf67','Wenige Sätze'],['#f3b24c','Mehr'],['#df4d38','Viele']];
 if(activity!=='strength'&&cycling?.rides)legend.push(['#f2a531','Radfahren (primär)']);
 legend.push([OFF_FILL,'Nicht zugeordnet']);
 const front=premiumStrengthSvg(model,'front',mode,cycling,activity),back=premiumStrengthSvg(model,'back',mode,cycling,activity);
 const disclaimer=activity==='cycling'?'Qualitative Beanspruchung beim Treten; keine gemessene Kraft oder Muskelermüdung.':activity==='combined'?'Krafttraining und Radfahren sind getrennte Datentypen; Farben zeigen Beteiligung, keine addierten Kraftsätze.':'Satzbasierte Zuordnung, keine direkte physiologische Messung.';
 return `<section class="str738-visual str739-visual" aria-label="Große Muskelkarte vorne und hinten"><header class="str738-visual-head"><div><span class="str738-eyebrow">ANATOMISCHE ÜBERSICHT</span><h3>Deine beanspruchten Muskeln</h3></div><span class="str738-mode-label">${activity==='cycling'?'RAD':activity==='strength'?'KRAFT':'KRAFT + RAD'}</span></header><div class="str738-figures str739-figures"><figure><div class="str738-figure str739-figure">${front}</div><figcaption>VORNE</figcaption></figure><figure><div class="str738-figure str739-figure">${back}</div><figcaption>HINTEN</figcaption></figure></div><div class="str738-visual-legend">${legend.map(([color,label])=>`<span><i style="background:${color}"></i>${e(label)}</span>`).join('')}</div><p class="str738-map-note">${e(disclaimer)}</p></section>${strengthPremiumRanking(model,cycling,activity)}`;
}
