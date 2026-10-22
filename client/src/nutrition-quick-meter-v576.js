/** Compass 0.5.76: compact, descriptive kcal budget for the food quick-capture surface.
 * Only explicitly logged foods enter the totals; no extrapolation of an unfinished day.
 */
import {dayEnergyStatus} from './energy-goal-v575.js';
import {nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';
const num=v=>Math.round(v).toLocaleString('de-AT');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=(v,max)=>Math.max(0,Math.min(100,v/max*100));
export function quickEnergyMeter(state,{now=new Date()}={}){
 if(!state)return '<div class="pj576-energy-pending"><strong>Heute · kcal-Schätzung</strong><small>Den Tresor entsperren, um den bisherigen Tagesstand und das persönliche Energieziel zu sehen. Verschlüsselt vorgemerkte Einträge erscheinen nach dem Entsperren.</small></div>';
 const g=dayEnergyStatus(state,{now,foods:nutritionFoods(state),estimate:nutritionKcalEstimate});
 const count=g.known?`${num(g.low)}–${num(g.high)} kcal`:'– kcal';
 const details=`${g.known} geschätzt${g.unknown?' · '+g.unknown+' ohne Schätzung':''}`;
 // Visualization always appears. Without a configured energy target, use a neutral
 // illustrative spectrum and label it as non-personalized; never infer weight loss.
 if(!g.settings.enabled||!g.ready){
  const total=Math.max(2500,g.high*1.08);
  const low=pct(g.low,total),high=pct(g.high,total);
  return `<section class="pj576-energy" aria-label="Kalorienaufnahme: visuelle Schätzspanne"><div class="pj576-energy-head"><span><strong>Heute erfasst · Schätzung</strong><small>${esc(details)}</small></span><strong class="pj576-kcal">${esc(count)}</strong></div>
  <div class="pj576-energy-track pj576-spectrum" role="img" aria-label="Farbverlauf von dunkelgrün, hellgrün über orange bis hellrot und dunkelrot. Ohne eingerichtetes Energieziel ist die Skala nur illustrativ.">${g.known?`<span class="pj576-range" style="left:${low.toFixed(2)}%;width:${Math.max(.5,high-low).toFixed(2)}%"></span><span class="pj576-point" style="left:${pct((g.low+g.high)/2,total).toFixed(2)}%"></span>`:''}</div>
  <div class="pj576-energy-scale"><span>0 kcal</span><span>${num(total)} kcal · neutrale Referenzskala</span></div>
  <p class="pj576-energy-note">Farbverlauf ohne persönliche Zielgrenzen. ${g.settings.enabled?esc(g.reason||'Kalorienziel derzeit nicht berechenbar.'):'Persönliches kcal-Ziel unter Insights → Ernährung freiwillig aktivieren.'} Nur dokumentierte Lebensmittel; <strong>keine</strong> vollständige Tagesbilanz.</p></section>`;
 }
 // End-of-day energy-budget orientation, never a prediction of weight change.
 const total=Math.max(g.tdee+700,g.high*1.06,1800);const target=Math.min(total,g.target),neutral=Math.min(total,g.tdee),slight=Math.min(total,neutral+400);
 const bandStart=pct(g.low,total),bandEnd=pct(g.high,total),rangeWidth=Math.max(.5,bandEnd-bandStart);
 const track=`<span class="pj576-zone loss-dark" style="width:${pct(target*.62,total).toFixed(2)}%"></span><span class="pj576-zone loss-light" style="width:${pct(target*.38,total).toFixed(2)}%"></span><span class="pj576-zone maintain" style="width:${pct(neutral-target,total).toFixed(2)}%"></span><span class="pj576-zone gain" style="width:${pct(slight-neutral,total).toFixed(2)}%"></span><span class="pj576-zone more-gain" style="width:${pct(total-slight,total).toFixed(2)}%"></span>`;
 const status=g.status==='over'?'Hinweis: Die erfasste Spanne liegt bereits über dem Abnahmeziel.':g.status==='possible'?'Die erfasste Spanne berührt oder überschreitet möglicherweise dein Abnahmeziel.':'';
 return `<section class="pj576-energy" aria-label="Kalorienziel und erfasster Tagesstand"><div class="pj576-energy-head"><span><strong>Heute erfasst · Schätzung</strong><small>${esc(details)}</small></span><strong class="pj576-kcal">${esc(count)}</strong></div>
 <div class="pj576-energy-track" role="img" aria-label="Theoretische Energiebereiche: grün Abnahmedefizit, gelb Gewichtserhalt, rot rechnerischer Überschuss. Markierung: ${esc(g.known?count:'noch keine Schätzung')}">${track}${g.known?`<span class="pj576-range" style="left:${bandStart.toFixed(2)}%;width:${rangeWidth.toFixed(2)}%"></span><span class="pj576-point" style="left:${pct((g.low+g.high)/2,total).toFixed(2)}%"></span>`:''}</div>
 <div class="pj576-energy-scale"><span>Abnahmeziel ≈ ${num(target)}</span><span>Erhaltung ≈ ${num(neutral)} kcal</span></div>
 <p class="pj576-energy-note">Grün: rechnerisches Defizit · Gelb: Erhaltung · Rot: Überschuss. Nur erfasste Lebensmittel – niedrige Zwischenstände sind <strong>keine</strong> bestätigte Tagesbilanz.${g.unknown?' Für '+g.unknown+' Einträge fehlt eine kcal-Schätzung.':''}</p>${status?`<p class="pj576-energy-alert" role="status">${esc(status)}</p>`:''}</section>`;
}