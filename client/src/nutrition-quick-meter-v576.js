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
 if(!g.settings.enabled||!g.ready){
  return `<section class="pj576-energy" aria-label="Bisher erfasste Kalorien"><div class="pj576-energy-head"><span><strong>Heute erfasst</strong><small>${esc(details)}</small></span><strong class="pj576-kcal">${esc(count)}</strong></div><p class="pj576-energy-note">${g.settings.enabled?esc(g.reason||'Berechnung noch nicht möglich.'):'Persönliches kcal-Ziel unter Insights → Ernährung freiwillig aktivieren.'} Keine vollständige Tagesbilanz.</p></section>`;
 }
 // End-of-day energy-budget orientation, never a prediction of weight change.
 const total=Math.max(g.tdee+700,g.high*1.06,1800);const target=Math.min(total,g.target),neutral=Math.min(total,g.tdee),slight=Math.min(total,neutral+400);
 const bandStart=pct(g.low,total),bandEnd=pct(g.high,total),rangeWidth=Math.max(.5,bandEnd-bandStart);
 const track=[{from:0,to:target,cls:'loss'},{from:target,to:neutral,cls:'maintain'},{from:neutral,to:slight,cls:'gain'},{from:slight,to:total,cls:'more-gain'}].filter(z=>z.to>z.from)
   .map(z=>`<span class="pj576-zone ${z.cls}" style="width:${pct(z.to-z.from,total).toFixed(2)}%"></span>`).join('');
 const status=g.status==='over'?'Hinweis: Die erfasste Spanne liegt bereits über dem Abnahmeziel.':g.status==='possible'?'Die erfasste Spanne berührt oder überschreitet möglicherweise dein Abnahmeziel.':'';
 return `<section class="pj576-energy" aria-label="Kalorienziel und erfasster Tagesstand"><div class="pj576-energy-head"><span><strong>Heute erfasst · Schätzung</strong><small>${esc(details)}</small></span><strong class="pj576-kcal">${esc(count)}</strong></div>
 <div class="pj576-energy-track" role="img" aria-label="Theoretische Energiebereiche: grün Abnahmedefizit, gelb Gewichtserhalt, rot rechnerischer Überschuss. Markierung: ${esc(g.known?count:'noch keine Schätzung')}">${track}${g.known?`<span class="pj576-range" style="left:${bandStart.toFixed(2)}%;width:${rangeWidth.toFixed(2)}%"></span><span class="pj576-point" style="left:${pct((g.low+g.high)/2,total).toFixed(2)}%"></span>`:''}</div>
 <div class="pj576-energy-scale"><span>Abnahmeziel ≈ ${num(target)}</span><span>Erhaltung ≈ ${num(neutral)} kcal</span></div>
 <p class="pj576-energy-note">Grün: rechnerisches Defizit · Gelb: Erhaltung · Rot: Überschuss. Nur erfasste Lebensmittel – niedrige Zwischenstände sind <strong>keine</strong> bestätigte Tagesbilanz.${g.unknown?' Für '+g.unknown+' Einträge fehlt eine kcal-Schätzung.':''}</p>${status?`<p class="pj576-energy-alert" role="status">${esc(status)}</p>`:''}</section>`;
}
