/** Compass 0.5.77.38: nutritional history, source values preserved.
 * Compact hover/focus/tap pill INSIDE the right-hand kcal cell; no expandable
 * full-width row. This is delivered as an actual source file, not a Vite patch.
 */
import {nutritionFoods,nutritionEntries,nutritionKcalEstimate} from './personal-journal-v5692.js';
import {personalEnergyEstimate} from './energy-goal-v575.js';
import {nutritionMissingEnergyPill} from './nutrition-missing-pill-v577371.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayLocal=d=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;};
const shift=(d,n)=>{const x=new Date(`${d}T12:00:00`);x.setDate(x.getDate()+n);return dayLocal(x);};
export function nutritionDailyHistory(state,{period=30,now=new Date()}={}){
 const days=[7,30,90].includes(+period)?+period:30,today=dayLocal(now),foods=new Map(nutritionFoods(state).map(f=>[f.id,f]));
 const byDay=new Map();
 for(const e of nutritionEntries(state)){
  const day=dayLocal(e.at);if(day>today||day<shift(today,1-days))continue;
  const row=byDay.get(day)||{day,low:0,high:0,known:0,unknown:0,total:0,missingItems:[],supplementItems:[]};
  row.total++;
  const food=foods.get(e.foodId),estimate=nutritionKcalEstimate(food,e.amount,e.recipe);
  if(estimate){row.low+=estimate.low;row.high+=estimate.high;row.known++;}
  else{
   const detail={id:e.id,foodId:e.foodId,title:food?.title||'Produkt nicht mehr vorhanden',emoji:food?.emoji||'🍴',amount:String(e.amount||''),reason:!food?'Produktzuordnung fehlt':food.kcalLow==null?'Keine kcal-Angabe hinterlegt':'Menge kann nicht umgerechnet werden'};
   if(food?.group==='Nahrungsergänzung')row.supplementItems.push(detail);
   else{row.unknown++;row.missingItems.push(detail);}
  }
  byDay.set(day,row);
 }
 return Array.from({length:days},(_,i)=>{const day=shift(today,-i);return byDay.get(day)||{day,low:0,high:0,known:0,unknown:0,total:0,missingItems:[],supplementItems:[]};});
}
export function nutritionHistoryView(state,{period=30,now=new Date()}={}){
 const records=nutritionDailyHistory(state,{period,now}),goal=personalEnergyEstimate(state,now);
 const ready=goal.ready&&goal.settings.enabled&&Number.isFinite(goal.target)&&Number.isFinite(goal.tdee);
 const max=Math.max(2500,ready?goal.tdee*1.45:0,...records.map(r=>r.high));
 const shown=records.filter(r=>r.total>0),fmt=x=>Math.round(x).toLocaleString('de-AT');
 const legend=ready?`<p class="n577-legend"><span>🟢 Bis ≈ ${fmt(goal.target)} kcal: rechnerisches Abnahmeziel</span><span>🟠 Erhaltung ≈ ${fmt(goal.tdee)} kcal</span><span>🔴 Darüber: rechnerischer Überschuss</span></p>`:'<p class="muted-line">Farbverlauf als neutrale Referenz (0 bis '+fmt(max)+' kcal). Persönliche Zielgrenzen unter „Persönliches Energieziel“ aktivieren.</p>';
 return `<section class="work-card n577-history" aria-label="Historie Ernährung mit kcal-Balken"><div class="work-heading"><span>📊 Ernährung · Tagesverlauf</span><small>${shown.length} protokollierte Tage</small></div><p class="muted-line">Nur erfasste Speisen und Getränke. Die Bandbreite umfasst Schätzunsicherheit, nicht fehlende Mahlzeiten.</p>${legend}<div class="n577-spectrum-heading"><span>Dunkelgrün</span><span>Hellgrün</span><span>Orange</span><span>Hellrot</span><span>Dunkelrot</span></div><div class="n577-spectrum-legend" aria-label="Farbskala dunkelgrün bis dunkelrot"></div><div class="n577-days">${shown.map(r=>{
  const low=Math.min(100,r.low/max*100),high=Math.min(100,r.high/max*100),known=r.known>0;
  const label=new Date(r.day+'T12:00:00').toLocaleDateString('de-AT',{day:'2-digit',month:'short'});
  return `<div class="n577-day ${r.total?'has-entries':'empty'}" title="${esc(r.day)}"><span class="n577-date">${esc(label)}</span><div class="n577-bar" role="img" aria-label="${esc(r.day)}: ${r.known?`${fmt(r.low)} bis ${fmt(r.high)} kcal geschätzt`:'keine kcal-Schätzung'}${r.unknown?`, ${r.unknown} ohne Schätzung`:''}"><i class="n577-zones-gradient" aria-hidden="true"></i>${known?`<i class="n577-range" style="left:${low.toFixed(2)}%;width:${Math.max(0.4,high-low).toFixed(2)}%"></i><i class="n577-mid" style="left:${((low+high)/2).toFixed(2)}%"></i>`:''}</div><div class="n577-amount"><span class="n577-kcal-value">${r.known?`${fmt(r.low)}–${fmt(r.high)}`:'–'}</span>${nutritionMissingEnergyPill(r)}</div></div>`;
 }).join('')||'<p class="muted-line">Noch keine Einträge in diesem Zeitraum.</p>'}</div><p class="n577-note">Nicht dokumentierte Tage werden nicht als Fastentage dargestellt. Ohne Ziel ist der Verlauf nur eine neutrale Referenzskala; mit aktivem Ziel dienen die Farben ausschließlich als rechnerische Orientierung. Alkoholische Getränke werden nur als Lebensmittel erfasst, ohne Bewertung.</p></section>`;
}
