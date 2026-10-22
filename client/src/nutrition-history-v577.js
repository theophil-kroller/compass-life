/** Compass 0.5.76.1: visually compare observed food log ranges, without treating them as a full diet. */
import {nutritionFoods,nutritionEntries,nutritionKcalEstimate} from './personal-journal-v5692.js';
import {personalEnergyEstimate} from './energy-goal-v575.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayLocal=d=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;};
const shift=(d,n)=>{const x=new Date(`${d}T12:00:00`);x.setDate(x.getDate()+n);return dayLocal(x);};
export function nutritionDailyHistory(state,{period=30,now=new Date()}={}){
 const days=[7,30,90].includes(+period)?+period:30,today=dayLocal(now),foods=new Map(nutritionFoods(state).map(f=>[f.id,f]));
 const byDay=new Map();
 for(const e of nutritionEntries(state)){
  const day=dayLocal(e.at);if(day>today||day<shift(today,1-days))continue;
  const item=byDay.get(day)||{day,low:0,high:0,known:0,unknown:0,total:0};item.total++;
  const k=nutritionKcalEstimate(foods.get(e.foodId),e.amount);
  if(k){item.low+=k.low;item.high+=k.high;item.known++;}else item.unknown++;
  byDay.set(day,item);
 }
 return Array.from({length:days},(_,i)=>{const day=shift(today,-i);return byDay.get(day)||{day,low:0,high:0,known:0,unknown:0,total:0};});
}
export function nutritionHistoryView(state,{period=30,now=new Date()}={}){
 const records=nutritionDailyHistory(state,{period,now}),goal=personalEnergyEstimate(state,now);
 const ready=goal.ready&&goal.settings.enabled&&Number.isFinite(goal.target)&&Number.isFinite(goal.tdee);
 const max=Math.max(2000,ready?goal.tdee*1.45:0,...records.map(r=>r.high));
 const fmt=x=>Math.round(x).toLocaleString('de-AT');
 const legend=ready?`<p class="n577-legend"><span>🟢 Bis ≈ ${fmt(goal.target)} kcal: rechnerisches Abnahmeziel</span><span>🟠 Erhaltung ≈ ${fmt(goal.tdee)} kcal</span><span>🔴 Darüber: rechnerischer Überschuss</span></p>`:'<p class="muted-line">Für die persönlichen Farbzonen kannst du unten unter „Persönliches Energieziel“ deine Richtwerte aktivieren. Bis dahin erscheint eine neutrale Skala.</p>';
 return `<section class="work-card n577-history" aria-label="Historie Ernährung mit kcal-Balken"><div class="work-heading"><span>📊 Ernährung · Tagesverlauf</span><small>${records.filter(r=>r.total).length} protokollierte Tage</small></div><p class="muted-line">Nur erfasste Speisen und Getränke. Die Bandbreite umfasst Schätzunsicherheit, nicht fehlende Mahlzeiten.</p>${legend}<div class="n577-days">${records.map(r=>{const low=Math.min(100,r.low/max*100),high=Math.min(100,r.high/max*100),known=r.known>0;
 const label=new Date(r.day+'T12:00:00').toLocaleDateString('de-AT',{day:'2-digit',month:'short'});
 return `<div class="n577-day ${r.total?'has-entries':'empty'}" title="${esc(r.day)}"><span class="n577-date">${esc(label)}</span><div class="n577-bar" role="img" aria-label="${esc(r.day)}: ${r.known?`${fmt(r.low)} bis ${fmt(r.high)} kcal geschätzt`:'keine kcal-Schätzung'}${r.unknown?`, ${r.unknown} ohne Schätzung`:''}">${ready?`<i class="n577-zone loss" style="width:${(goal.target/max*100).toFixed(2)}%"></i><i class="n577-zone maintain" style="left:${(goal.target/max*100).toFixed(2)}%;width:${(Math.max(0,goal.tdee-goal.target)/max*100).toFixed(2)}%"></i><i class="n577-zone gain" style="left:${(goal.tdee/max*100).toFixed(2)}%;right:0"></i>`:''}${known?`<i class="n577-range" style="left:${low.toFixed(2)}%;width:${Math.max(0.4,high-low).toFixed(2)}%"></i><i class="n577-mid" style="left:${((low+high)/2).toFixed(2)}%"></i>`:''}</div><span class="n577-amount">${r.known?`${fmt(r.low)}–${fmt(r.high)}`:'–'}<small>${r.unknown?` · ${r.unknown} ohne Wert`:''}</small></span></div>`;}).join('')}</div><p class="n577-note">Leere Tage sind nicht gleich Fastentage. Die Farbskala vergleicht geschätzte Aufnahme mit einem rechnerischen Ziel, nicht mit tatsächlich verifiziertem Abnehmen oder Zunehmen. Alkoholische Getränke werden nur als Lebensmittel erfasst, ohne Bewertung.</p></section>`;
}
