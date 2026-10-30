/** Compass 0.5.77.39 · Reference-style strength dashboard.
 * Uses Compass' own data and region mapping but redraws the body illustration in a
 * slimmer line-art style closer to the user's preferred fitness-app references.
 * This remains a model of documented involvement, not measured EMG/fatigue/growth.
 */
import { detailedMuscleData,EXERCISE_ANATOMY } from './strength-anatomy-v57737.js';

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

/** Professional anatomical vector paths, loaded on demand from the Apache-2.0
 * body-muscles package. Do not fall back to previous cartoon/polygon geometry.
 * The installed npm package is bundled by Vite; no runtime CDN/network dependency.
 */
const OFF_FILL='#1d2633';
const LABELS=Object.freeze({
 pectoral_upper:'Oberer Brustmuskel',pectoral_lower:'Großer Brustmuskel',
 deltoid_front:'Vorderer Deltamuskel',deltoid_side:'Seitlicher Deltamuskel',deltoid_rear:'Hinterer Deltamuskel',
 biceps:'Bizeps',brachialis:'Brachialis',triceps:'Trizeps',
 forearm_flex:'Unterarmbeuger',forearm_ext:'Unterarmstrecker',
 rectus_abdominis:'Gerader Bauchmuskel',obliques:'Schräge Bauchmuskulatur',
 trapezius_upper:'Oberer Trapezmuskel',trapezius_mid:'Mittlerer/unterer Trapezmuskel',
 rhomboids:'Rautenmuskel',latissimus:'Latissimus',erector_spinae:'Rückenstrecker',
 glute_max:'Großer Gesäßmuskel',glute_med:'Mittlerer Gesäßmuskel',
 quadriceps:'Quadrizeps',adductors:'Adduktoren',hamstrings:'Ischiocrurale Muskulatur (Beinbeuger)',
 calves_gastro:'Zwillingswadenmuskel (Gastrocnemius)',calves_soleus:'Schollenmuskel (Soleus)',
 tibialis:'Vorderer Schienbeinmuskel (Tibialis anterior)'
});
const ANATOMY_OVERRIDES={
 head:'Kopf',face:'Gesicht',nape:'Nacken',spine:'Wirbelsäule',
 'hip-flexor':'Hüftbeuger',foot:'Fuß',knee:'Kniebereich',elbow:'Ellbogen',hand:'Hand',neck:'Hals'
};
/** Match detailed path names against original Compass exercise→muscle IDs.
 * Note that this is an anatomical grouping approximation, not EMG. */
export function compassRegionForAnatomyId(id,view){
 const x=String(id||'');
 if(x.startsWith('chest-upper'))return 'pectoral_upper';
 if(x.startsWith('chest-lower'))return 'pectoral_lower';
 if(x.startsWith('shoulder-front'))return 'deltoid_front';
 if(x.startsWith('shoulder-side'))return 'deltoid_side';
 if(x.startsWith('deltoid-rear'))return 'deltoid_rear';
 if(x.startsWith('biceps'))return 'biceps';
 if(x.startsWith('triceps'))return 'triceps';
 if(x.startsWith('forearm-flexors'))return 'forearm_flex';
 if(x.startsWith('forearm-extensors'))return 'forearm_ext';
 if(x.startsWith('forearm'))return view==='front'?'forearm_flex':'forearm_ext';
 if(x.startsWith('abs'))return 'rectus_abdominis';
 if(x.startsWith('obliques')||x.startsWith('serratus'))return 'obliques';
 if(x.startsWith('traps-upper'))return 'trapezius_upper';
 if(x.startsWith('traps'))return 'trapezius_mid';
 if(x.startsWith('lats'))return 'latissimus';
 if(x.startsWith('lower-back')||x==='spine')return 'erector_spinae';
 if(x.startsWith('gluteus-maximus'))return 'glute_max';
 if(x.startsWith('gluteus-medius'))return 'glute_med';
 if(x.startsWith('quads'))return 'quadriceps';
 if(x.startsWith('adductors'))return 'adductors';
 if(x.startsWith('hamstrings'))return 'hamstrings';
 if(x.startsWith('calves-gastroc'))return 'calves_gastro';
 if(x.startsWith('calves-soleus'))return 'calves_soleus';
 if(x.startsWith('tibialis'))return 'tibialis';
 return null;
}
function colorForRegion(region,mode,cycPrimary,cycSecondary,activity){
 const pr=activity!=='cycling'?(region?.primary||0):0,sec=activity!=='cycling'?(region?.secondary||0):0;
 if(pr||sec){
  if(mode==='roles')return pr?'#f06436':'#edbf4b';
  const weight=(region?.index||0);
  return weight>=8?'#e6532e':weight>=5?'#ed7926':weight>=2.5?'#efa536':'#efcc5b';
 }
 if(activity!=='strength'&&cycPrimary)return '#ef9d34';
 if(activity!=='strength'&&cycSecondary)return '#e7c35e';
 return OFF_FILL;
}
let anatomyPackagePromise;
function loadAnatomyPaths(){
 if(!anatomyPackagePromise)anatomyPackagePromise=import('body-muscles');
 return anatomyPackagePromise;
}
/** Mount paths in the elements created by the synchronous Compass render.
 * The dynamic import is local to the Vite bundle, works offline after PWA install.
 * Accepting a loader here allows deterministic tests without the npm package. */
export async function mountPremiumAnatomy(root,loader=loadAnatomyPaths){
 if(!root?.querySelectorAll)return 0;
 const targets=[...root.querySelectorAll('.str740-svg:not([data-anatomy-ready])')];
 if(!targets.length)return 0;
 const pkg=await loader();
 let count=0;
 for(const svg of targets){
  if(!svg.isConnected)continue;
  const view=svg.dataset.anatomyView==='back'?'back':'front';
  let info;try{info=JSON.parse(svg.dataset.anatomyInfo||'{}');}catch{info={};}
  const groupInfo=info.regions||{},bikePrimary=info.cyclingPrimary||[],bikeSecondary=info.cyclingSecondary||[];
  const parts=view==='front'?pkg.FRONT_MUSCLES:pkg.BACK_MUSCLES;
  if(!Array.isArray(parts)||!parts.length)throw Error('Anatomiedaten fehlen.');
  // Svg paths from a maintained anatomical data set, not fabricated polygons.
  svg.innerHTML=parts.map(part=>{
   const id=compassRegionForAnatomyId(part.id,view);
   const row=id?groupInfo[id]:null;
   const cyclingPrimary=id&&bikePrimary.includes(id),cyclingSecondary=id&&bikeSecondary.includes(id);
   const active=id&&((info.activity!=='cycling'&&((row?.primary||0)+(row?.secondary||0)>0))||(info.activity!=='strength'&&(cyclingPrimary||cyclingSecondary)));
   const fill=id&&info.todayRegions?.includes(id)?'#ed4b42':id&&info.recentRegions?.includes(id)?'#ee963a':id&&info.supportingRegions?.includes(id)?'#f0c955':id?colorForRegion(row,info.mode||'roles',cyclingPrimary,cyclingSecondary,info.activity||'combined'):'#232d3c';
   const name=LABELS[id]||Object.entries(ANATOMY_OVERRIDES).find(([k])=>part.id.startsWith(k))?.[1]||part.name||part.id;
   const note=id?`${info.todayRegions?.includes(id)?'Heute trainiert · ':info.recentRegions?.includes(id)?'In den letzten 7 Tagen trainiert · ':''}${row?.primary||0} Hauptsätze · ${row?.secondary||0} unterstützend${cyclingPrimary||cyclingSecondary?' · Radfahren beteiligt':''}`:'Anatomische Orientierung';
   const title=`${name} – ${note}`;
   return `<path d="${e(part.path)}" class="str740-muscle${active?' is-active':''}" fill="${fill}" stroke="${active?'#f4ded0':'#9daabd'}" stroke-width="${active?'0.18':'0.14'}" stroke-linejoin="round" role="img" tabindex="0" data-muscle-name="${e(name)}" data-muscle-note="${e(note)}" aria-label="${e(title)}"><title>${e(title)}</title></path>`;
  }).join('');
  svg.dataset.anatomyReady='1';
  const figure=svg.closest('figure');
  const tip=figure?.querySelector('.str740-muscle-tip');
  const show=el=>{
   if(!tip||!el)return;
   tip.textContent=`${el.dataset.muscleName}: ${el.dataset.muscleNote}`;
   tip.hidden=false;
  };
  const hide=()=>{if(tip&&!tip.dataset.pinned)tip.hidden=true;};
  svg.addEventListener('pointerover',ev=>show(ev.target.closest?.('[data-muscle-name]')));
  svg.addEventListener('pointerout',hide);
  svg.addEventListener('focusin',ev=>show(ev.target.closest?.('[data-muscle-name]')));
  svg.addEventListener('focusout',hide);
  svg.addEventListener('click',ev=>{
   const target=ev.target.closest?.('[data-muscle-name]');if(!target)return;
   if(tip){tip.dataset.pinned='1';show(target);}
  });
  svg.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&tip){tip.hidden=true;delete tip.dataset.pinned;return;}if((ev.key==='Enter'||ev.key===' ')&&tip){const target=ev.target.closest?.('[data-muscle-name]');if(target){ev.preventDefault();tip.dataset.pinned='1';show(target);}}});
  figure?.addEventListener('pointerleave',()=>{if(tip){tip.hidden=true;delete tip.dataset.pinned;}});
  count++;
 }
 return count;
}
/** A placeholder only; a local bundle supplies professionally traced shapes. */
export function premiumStrengthSvg(model,view,mode,cycling,activity){
 const data=detailedMuscleData(model);
 const records=Object.fromEntries(Object.entries(data.regions).map(([id,r])=>[id,{primary:r.primary,secondary:r.secondary,index:r.index}]));
 const current=typeof model?.today==='string'?model.today:new Date().toLocaleDateString('sv-SE');
 const recentStart=shift(current,-7),todayRegions=new Set(),recentRegions=new Set(),supportingRegions=new Set();
 for(const session of model?.sessions||[]){const day=session.day;if(!isDay(day)||day>current)continue;
  for(const set of session.sets||[]){if(!(Number(set?.reps)>0))continue;const anatomy=EXERCISE_ANATOMY[set.exerciseId];if(!anatomy)continue;
   for(const id of anatomy.primary){if(day===current)todayRegions.add(id);else if(day>=recentStart)recentRegions.add(id);}
   for(const id of anatomy.secondary){if(day===current)supportingRegions.add(id);else if(day>=recentStart)recentRegions.add(id);}
  }
 }
 const info={regions:records,activity,mode,todayRegions:[...todayRegions],recentRegions:[...recentRegions].filter(id=>!todayRegions.has(id)),supportingRegions:[...supportingRegions].filter(id=>!todayRegions.has(id)),cyclingPrimary:cycling?.rides?cycling.regions.primary:[],cyclingSecondary:cycling?.rides?cycling.regions.secondary:[]};
 const back=view==='back';
 return `<svg class="str738-body str740-svg" data-anatomy-view="${back?'back':'front'}" data-anatomy-info="${e(JSON.stringify(info))}" viewBox="${back?'37 0 35 93':'0 0 35 93'}" role="img" aria-label="Anatomische Muskelkarte ${back?'hinten':'vorne'}, über 70 detaillierte Muskelbereiche"><text x="${back?'44':'8'}" y="48" class="str740-loading">Anatomie wird geladen …</text></svg>`;
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
 const legend=[['#ed4b42','Heute trainiert (primär)'],['#ee963a','Letzte 7 Tage'],['#f0c955','Heute unterstützend']];
 if(activity!=='strength'&&cycling?.rides)legend.push(['#f2a531','Radfahren (primär)']);
 legend.push([OFF_FILL,'Nicht zugeordnet']);
 // Wait until Compass has inserted this HTML into the document. No old cartoon fallback.
 if(typeof document!=='undefined'&&typeof queueMicrotask==='function')queueMicrotask(()=>mountPremiumAnatomy(document).catch(ex=>{console.error('Anatomie nicht geladen:',ex);document.querySelectorAll('.str740-loading').forEach(n=>{n.textContent='Anatomie konnte nicht geladen werden.';});}));
 const front=premiumStrengthSvg(model,'front',mode,cycling,activity),back=premiumStrengthSvg(model,'back',mode,cycling,activity);
 const disclaimer=activity==='cycling'?'Qualitative Beanspruchung beim Treten; keine gemessene Kraft oder Muskelermüdung.':activity==='combined'?'Krafttraining und Radfahren sind getrennte Datentypen; Farben zeigen Beteiligung. Radfahrminuten werden nicht in Sätze umgerechnet.':'Satzbasierte Zuordnung, keine direkte physiologische Messung.';
 return `<section class="str738-visual str739-visual" aria-label="Große Muskelkarte vorne und hinten"><header class="str738-visual-head"><div><span class="str738-eyebrow">ANATOMISCHE ÜBERSICHT</span><h3>Deine beanspruchten Muskeln</h3></div><span class="str738-mode-label">${activity==='cycling'?'RAD':activity==='strength'?'KRAFT':'KRAFT + RAD'}</span></header><div class="str738-figures str739-figures str740-figures"><figure><div class="str738-figure str739-figure str740-figure">${front}</div><figcaption>VORNE</figcaption><output class="str740-muscle-tip" hidden aria-live="polite"></output></figure><figure><div class="str738-figure str739-figure str740-figure">${back}</div><figcaption>HINTEN</figcaption><output class="str740-muscle-tip" hidden aria-live="polite"></output></figure></div><div class="str738-visual-legend">${legend.map(([color,label])=>`<span><i style="background:${color}"></i>${e(label)}</span>`).join('')}</div><p class="str738-map-note">${e(disclaimer)}</p></section>${strengthPremiumRanking(model,cycling,activity)}`;
}
