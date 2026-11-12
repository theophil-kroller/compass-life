/** Compass 0.5.91.41 · Strength progression: load belongs to an exercise, never to one muscle.
 * Pure, read-only; use already deduplicated Garmin + confirmed Coach sets.
 * Heaviest working set is a load trend, not an estimated measure of muscular force.
 */
import {EXERCISE_ANATOMY} from './strength-anatomy-v57737.js';
import {vtaperBenefit141} from './strength-vtaper-purpose-v059141.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
const num=v=>n(v)===null?'–':v.toLocaleString('de-AT',{maximumFractionDigits:2});
const isoDay=x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x||''));
const safeWeight=s=>n(s?.weightKg)!==null&&s.weightKg>0&&s.weightKg<=500?s.weightKg:null;
const safeReps=s=>Number.isInteger(s?.reps)&&s.reps>0&&s.reps<=200?s.reps:null;
const say=ex=>ex?.name||String(ex?.id||'Übung').replace(/-/g,' ');

export function exerciseProgressionModel141(model){
 const byId=new Map();
 for(const session of model?.sessions||[]){
  for(const set of session?.sets||[]){
   const id=String(set?.exerciseId||'');
   // An unknown or manually unresolved FIT category cannot imply a specific muscle.
   if(!id||!EXERCISE_ANATOMY[id])continue;
   const day=isoDay(set.day)?set.day:session.day;
   if(!isoDay(day))continue;
   const kg=safeWeight(set),reps=safeReps(set);
   if(kg===null&&reps===null)continue;
   const ex=byId.get(id)||{id,name:String(set.exercise||'').trim()||id.replace(/-/g,' '),days:new Map(),muscles:EXERCISE_ANATOMY[id].primary};
   const prev=ex.days.get(day);
   // For each day chart the heaviest confirmed working set; at equal load,
   // choose more repetitions. Never sum dumbbell + machine loads by muscle.
   const candidate={day,kg,reps,rir:n(set.rir),at:set.start||session.start||''};
   if(!prev||(kg??0)>(prev.kg??0)||kg===prev.kg&&(reps??0)>(prev.reps??0))ex.days.set(day,candidate);
   byId.set(id,ex);
  }
 }
 const exercises=[...byId.values()].map(ex=>{
  const sessions=[...ex.days.values()].sort((a,b)=>a.day.localeCompare(b.day));
  const latest=sessions.at(-1),previous=sessions.length>1?sessions.at(-2):null;
  const loads=sessions.filter(x=>x.kg!==null);
  const best=loads.length?Math.max(...loads.map(x=>x.kg)):null;
  const changed=previous&&latest.kg!==null&&previous.kg!==null?Math.round((latest.kg-previous.kg)*100)/100:null;
  const repsChanged=previous&&latest.kg===previous.kg&&latest.reps!==null&&previous.reps!==null?latest.reps-previous.reps:null;
  const label=changed>0?'Last gesteigert':changed<0?'Zuletzt geringere Last':repsChanged>0?'Mehr Wiederholungen':changed===0?'Last gehalten':'Noch kein direkter Vergleich';
  return {...ex,sessions,latest,previous,best,changed,repsChanged,label};
 }).sort((a,b)=>b.latest.day.localeCompare(a.latest.day)||b.sessions.length-a.sessions.length||a.id.localeCompare(b.id));
 const byRegion={};
 for(const ex of exercises){
  const roles=EXERCISE_ANATOMY[ex.id];
  for(const region of [...roles.primary,...roles.secondary]){
   const rows=byRegion[region]||[];
   rows.push({id:ex.id,name:say(ex),day:ex.latest.day,kg:ex.latest.kg,reps:ex.latest.reps,sessions:ex.sessions.length,primary:roles.primary.includes(region)});
   byRegion[region]=rows;
  }
 }
 for(const rows of Object.values(byRegion))rows.sort((a,b)=>b.day.localeCompare(a.day)||Number(b.primary)-Number(a.primary));
 return {exercises,byRegion};
}

export function regionLoadSummary141(progression,id){
 const rows=progression?.byRegion?.[id]||[];
 if(!rows.length)return 'Keine eindeutig dokumentierte Übung mit Gewichtsangabe';
 return 'Übungen (keine kg je Muskel): '+rows.slice(0,3).map(x=>`${x.name}: ${x.kg!==null?`${num(x.kg)} kg${x.reps!==null?' × '+x.reps:''}`:x.reps+' Wdh.'} (${x.day})`).join(' · ');
}

function sparkline(ex){
 const samples=ex.sessions.slice(-14);
 const weighted=samples.filter(x=>x.kg!==null);
 const hasLoad=weighted.length>0;
 const vals=samples.map(x=>hasLoad?x.kg:x.reps);
 const points=vals.map((v,i)=>({v,x:10+i*(220/Math.max(1,vals.length-1))})).filter(x=>x.v!==null);
 if(points.length<2)return '<span class="str141-no-graph">Ein Trainingstag – noch kein Trend</span>';
 const min=Math.min(...points.map(x=>x.v)),max=Math.max(...points.map(x=>x.v));
 const pad=Math.max(1,(max-min)*.2);
 const y=v=>57-(v-min+pad)/(max-min+2*pad)*48;
 const coords=points.map(x=>`${x.x.toFixed(1)},${y(x.v).toFixed(1)}`).join(' ');
 const dots=points.map(x=>`<circle cx="${x.x.toFixed(1)}" cy="${y(x.v).toFixed(1)}" r="3.3" fill="#f1c982"><title>${esc(`${num(x.v)} ${hasLoad?'kg':'Wdh.'}`)}</title></circle>`).join('');
 const label=`Verlauf über ${points.length} Trainingstage; ${hasLoad?'dokumentierte Arbeitsgewichte':'Wiederholungen ohne dokumentiertes Zusatzgewicht'}`;
 return `<svg viewBox="0 0 240 70" class="str141-spark" role="img" aria-label="${esc(label)}"><line x1="10" y1="57" x2="230" y2="57" stroke="#7993ac" opacity=".35"/><polyline fill="none" stroke="#8de2ce" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round" points="${coords}"/>${dots}</svg>`;
}
function tile(ex){
 const last=ex.latest,unit=last.kg!==null?'kg':'Wdh.',val=last.kg!==null?last.kg:last.reps;
 const best=ex.best!==null?`Bestlast ${num(ex.best)} kg`:`${ex.sessions.length} Trainingstag(e)`;
 const compare=ex.changed>0?`+${num(ex.changed)} kg zum letzten Training`:ex.repsChanged>0?`+${ex.repsChanged} Wiederholungen bei gleicher Last`:ex.label;
 return `<article class="str141-exercise"><div class="str141-exercise-info"><strong>${esc(say(ex))}</strong>${vtaperBenefit141(ex.id)?`<p class="str141-purpose">🎯 ${esc(vtaperBenefit141(ex.id))}</p>`:''}<small>${esc(last.day)} · ${esc(last.reps!==null?`${last.reps} Wdh.`:'Wdh. unbekannt')}</small><div class="str141-last"><b>${esc(num(val))} <span>${unit}</span></b><small>${esc(best)}</small></div><span class="str141-trend ${ex.changed>0||ex.repsChanged>0?'positive':''}">${esc(compare)}</span></div>${sparkline(ex)}</article>`;
}
export function exerciseProgressionView141(model){
 const p=exerciseProgressionModel141(model);
 const ex=p.exercises;
 if(!ex.length)return `<section class="str141-progress" aria-label="Gewichtsprogression pro Übung"><div class="str141-progress-head"><h3>Deine Kraftprogression</h3></div><p>Für die Übungskurven brauchen wir bestätigte Übungen und dokumentierte Gewichte oder Wiederholungen. Unzugeordnete Garmin-Sätze bleiben unbekannt.</p></section>`;
 const top=ex.slice(0,4),rest=ex.slice(4,24);
 return `<section class="str141-progress" aria-label="Gewichtsprogression pro Übung"><div class="str141-progress-head"><div><span class="str141-progress-kicker">STÄRKER WERDEN · TRAINING FÜR TRAINING</span><h3>Deine Kraftprogression</h3></div><small>${ex.length} Übungen mit Daten</small></div><p class="str141-progress-note">Gewichte gehören zu Übungen, nicht zu einzelnen Muskeln. Die Kurven zeigen die höchste dokumentierte Arbeitslast pro Trainingstag – bei Körpergewichtsübungen die Wiederholungen. Höhere Last bei weniger Wiederholungen ist nicht automatisch ein Kraftzuwachs.</p><div class="str141-exercise-grid">${top.map(tile).join('')}</div>${rest.length?`<details class="str141-more"><summary>Weitere ${rest.length} Übungen und ihre Fortschritte</summary><div class="str141-exercise-grid">${rest.map(tile).join('')}</div></details>`:''}</section>`;
}
