/** Compass 0.5.91.46 — exercise tonnage associated with anatomical muscle roles.
 * Read-only view on the same deduplicated strengthPeriod sessions used by Compass.
 * NOT a measure of mechanical muscle force, activation, growth or recovery.
 * Multiple primary muscles may each show the same exercise tonnage, so values
 * across muscle rows MUST NOT be summed to a person-wide training volume.
 */
import {ANATOMY_REGIONS,EXERCISE_ANATOMY,isAnatomyClassifiedSet137} from './strength-anatomy-v57737.js';

const DAY=/^\d{4}-\d{2}-\d{2}$/;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>Number(x).toLocaleString('de-AT',{maximumFractionDigits:1});
const shiftDay=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
const isFiniteLoad=s=>typeof s?.weightKg==='number'&&Number.isFinite(s.weightKg)&&s.weightKg>0&&s.weightKg<=500&&Number.isInteger(s.reps)&&s.reps>0&&s.reps<=500;
const empty=()=>({primaryKg:0,secondaryKg:0,primarySets:0,secondarySets:0,weightedPrimary:0,weightedSecondary:0,unweightedPrimary:0,unweightedSecondary:0});

/** Primary/secondary results are *parallel attributions*, not additive weights.
 * Each row receives the recorded exercise's kg × reps, with no speculative
 * per-muscle force sharing or per-hand multiplier.
 */
export function muscleExerciseTonnage146(model,{days=7,end=model?.today}={}){
 if(!DAY.test(end||'')||!Number.isInteger(days)||days<1||days>366)return {days,end,rows:[],recordedSets:0,weightedSets:0};
 const start=shiftDay(end,1-days);
 const rows=Object.fromEntries(ANATOMY_REGIONS.map(r=>[r.id,{...r,...empty()}]));
 let recordedSets=0,weightedSets=0;
 for(const session of model?.sessions||[])for(const set of session?.sets||[]){
  const day=DAY.test(set?.day||'')?set.day:session?.day;
  if(!DAY.test(day||'')||day<start||day>end||!isAnatomyClassifiedSet137(set))continue;
  const roles=EXERCISE_ANATOMY[set.exerciseId];
  if(!roles)continue;
  recordedSets++;
  const load=isFiniteLoad(set)?set.weightKg*set.reps:null;
  if(load!==null)weightedSets++;
  for(const id of new Set(roles.primary||[])){
   const r=rows[id];if(!r)continue;
   r.primarySets++;
   if(load!==null){r.primaryKg+=load;r.weightedPrimary++;}else r.unweightedPrimary++;
  }
  for(const id of new Set(roles.secondary||[])){
   const r=rows[id];if(!r||(roles.primary||[]).includes(id))continue;
   r.secondarySets++;
   if(load!==null){r.secondaryKg+=load;r.weightedSecondary++;}else r.unweightedSecondary++;
  }
 }
 return {days,start,end,rows:Object.values(rows),recordedSets,weightedSets};
}

/** Comparison is shown only when both windows contain comparable weighted
 * exercise sets. More tonnage is an observation, not proof of hypertrophy.
 */
export function muscleTonnageComparison146(model,{days=7,end=model?.today}={}){
 const current=muscleExerciseTonnage146(model,{days,end});
 if(!DAY.test(end||'')||!current.rows.length)return {...current,previous:null,regions:[]};
 const previous=muscleExerciseTonnage146(model,{days,end:shiftDay(end,-days)});
 const priorById=new Map(previous.rows.map(r=>[r.id,r]));
 const regions=current.rows.map(r=>{
  const p=priorById.get(r.id)||empty();
  const deltaKg=r.weightedPrimary&&p.weightedPrimary?r.primaryKg-p.primaryKg:null;
  return {...r,previousPrimaryKg:p.weightedPrimary?p.primaryKg:null,deltaKg};
 });
 return {...current,previous,regions};
}

function periodRows(model,days,weekly){
 const m=muscleTonnageComparison146(model,{days,end:model.today});
 const active=m.regions.filter(r=>r.primarySets||r.secondarySets).sort((a,b)=>b.primaryKg-a.primaryKg||b.primarySets-a.primarySets||b.secondaryKg-a.secondaryKg);
 const peak=Math.max(1,...active.map(r=>r.primaryKg));
 if(!active.length)return '<p class="str146-empty">In diesem Zeitraum sind noch keine eindeutig zugeordneten Kraftsätze erfasst.</p>';
 const rows=active.map(r=>{
  const primary=r.weightedPrimary?`${fmt(r.primaryKg)} kg`:'–';
  const secondary=r.weightedSecondary?`${fmt(r.secondaryKg)} kg`:'–';
  const comparison=r.deltaKg===null?'Noch kein belastbarer Vorperiodenvergleich':`${r.deltaKg>=0?'+':'−'}${fmt(Math.abs(r.deltaKg))} kg zur Vorperiode`;
  const pct=r.weightedPrimary?Math.max(3,r.primaryKg/peak*100):0;
  const unknown=r.unweightedPrimary+r.unweightedSecondary;
  const weekValues=weekly.map(w=>w.find(x=>x.id===r.id)?.primaryKg||0);
  const weekPeak=Math.max(1,...weekValues);
  const weeklyBars=weekValues.map((kg,i)=>`<span title="${esc(`Woche ${i+1}: ${fmt(kg)} kg zugeordnetes Primär-Übungsvolumen`)}" style="height:${kg?Math.max(5,Math.round(kg/weekPeak*100)):0}%"></span>`).join('');
  const mini=`<span class="str146-week-trend" role="img" aria-label="Letzte vier 7-Tage-Fenster, Primär-Übungsvolumen: ${weekValues.map(fmt).join(', ')} kg">${weeklyBars}</span>`;
  return `<div class="str146-row" title="${esc(r.label)} · Primär: ${esc(primary)} aus ${r.weightedPrimary} vollständig gewichteten Sätzen; Neben: ${esc(secondary)}. Mehrfachzuordnungen nicht addieren."><div class="str146-region"><strong>${esc(r.label)}</strong><small>${r.primarySets} Haupt · ${r.secondarySets} Neben${unknown?` · ${unknown} ohne berechenbare kg`:''}</small></div><div class="str146-chart"><span class="str146-bar"><i style="width:${pct.toFixed(1)}%"></i></span><small>${esc(comparison)}</small>${mini}</div><div class="str146-load"><strong>${esc(primary)}</strong><small>primär · Neben ${esc(secondary)}</small></div></div>`;
 }).join('');
 return `<div class="str146-summary"><span>${m.recordedSets} zugeordnete Sätze</span><span>${m.weightedSets} mit kg × Wdh.</span><span>${m.recordedSets-m.weightedSets} ohne berechenbare Last</span></div><div class="str146-rows">${rows}</div>`;
}

/** Native CSS-only selection: works offline, with keyboard and without
 * introducing a second render loop or changing the encrypted vault. */
export function muscleTonnageView146(model){
 if(!DAY.test(model?.today||''))return '';
 const periods=[{days:7,id:'week',label:'7 Tage'},{days:30,id:'month',label:'30 Tage'},{days:42,id:'block',label:'6 Wochen'},{days:90,id:'quarter',label:'90 Tage'}];
 const inputs=periods.map((p,i)=>`<input class="str146-input" type="radio" name="str146-period" id="str146-period-${p.id}" ${i===0?'checked':''}>`).join('');
 const choices=periods.map(p=>`<label for="str146-period-${p.id}">${p.label}</label>`).join('');
 const weekly=Array.from({length:4},(_,i)=>muscleExerciseTonnage146(model,{days:7,end:shiftDay(model.today,-7*(3-i))}).rows);
 const panels=periods.map(p=>`<div class="str146-panel str146-${p.id}" aria-label="Trainingsvolumen der letzten ${p.label}">${periodRows(model,p.days,weekly)}</div>`).join('');
 return `<section class="str146-root" aria-label="Zugeordnetes Übungsvolumen nach Muskelgruppe"><div class="str146-header"><div><span class="str146-eyebrow">TRAININGSVOLUMEN · MUSKELGRUPPEN</span><h3>Wie viel hast du bewegt?</h3><p>Gewicht × Wiederholungen der zugeordneten Übungen. Vergleich mit dem gleich langen vorherigen Zeitraum.</p></div></div>${inputs}<div class="str146-switch" role="group" aria-label="Zeitraum für Trainingsvolumen">${choices}</div><div class="str146-panels">${panels}</div><p class="str146-note"><strong>Wichtig:</strong> Die kg bezeichnen Übungsvolumen, nicht physikalische Belastung eines einzelnen Muskels. Bei Mehrgelenksübungen kann dasselbe Satzvolumen mehreren Hauptmuskeln zugeordnet sein; Muskelwerte deshalb <strong>nicht addieren</strong>. Nebenbeteiligungen sind getrennt ausgewiesen. Eigenkörpergewichtsübungen und Sätze ohne Gewicht bleiben als Sätze sichtbar, ohne erfundene kg. Höheres Volumen allein beweist keinen Muskelzuwachs; Gewicht, Wiederholungen, RIR und Regeneration gehören zur Bewertung.</p></section>`;
}
