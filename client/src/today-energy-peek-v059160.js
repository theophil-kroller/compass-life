/** Compass 0.5.91.60 – descriptive energy/deficit status in the Today inspector.
 * Shares the EXACT daily kcal estimate and personal TDEE with the existing
 * Nutrition quick meter; never projects an unfinished day or modifies a goal.
 * This intentionally runs in the Today core, without importing Insights views.
 */
import {dayEnergyStatus} from './energy-goal-v575.js';
import {nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const fmt=n=>Number.isFinite(n)?Math.round(n).toLocaleString('de-AT'):'–';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validDay=day=>/^\d{4}-\d{2}-\d{2}$/.test(day||'')&&Number.isFinite(Date.parse(day+'T12:00:00'));
const calendarDay=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const pct=(x,max)=>clamp(x/max*100,0,100);
const range=(a,b)=>Math.round(a)===Math.round(b)?fmt(a):`${fmt(a)}–${fmt(b)}`;

/** Deficit labels use the same practical 600–900 kcal stages as V-Taper, but
 * are statuses, NOT permission to restrict food or a recommendation to skip it.
 */
export function describeDeficit160(deficit){
 if(!finite(deficit))return {tone:'neutral',label:'Keine Berechnung'};
 if(deficit< -25)return {tone:'over',label:'Über dem Erhaltungsbedarf'};
 if(deficit<200)return {tone:'maintain',label:'Nahe Erhaltung'};
 if(deficit<400)return {tone:'gentle',label:'Sanftes Defizit'};
 if(deficit<600)return {tone:'moderate',label:'Moderates Defizit'};
 if(deficit<800)return {tone:'ambitious',label:'Ambitioniertes Abnahmeziel'};
 if(deficit<=900)return {tone:'high',label:'Sehr ambitioniertes Defizit'};
 return {tone:'high',label:'Sehr hohes rechnerisches Defizit'};
}
/** Returns values for a SELECTED Today date, not the machine-clock date.
 * Only known, logged foods are counted. The current observed balance is
 * distinct from the separately selected hypothetical V-Taper scenario.
 */
export function todayEnergyModel160(state,day,{now=new Date()}={}){
 if(!state||!validDay(day))return {ready:false,reason:'Kein Tagesstand'};
 const at=calendarDay(now)===day?now:new Date(`${day}T12:00:00`);
 const g=dayEnergyStatus(state,{now:at,foods:nutritionFoods(state),estimate:nutritionKcalEstimate});
 if(!g.settings.enabled)return {ready:false,reason:'Persönliches Energieziel in Ernährung aktivieren',enabled:false,day};
 if(!g.ready)return {ready:false,reason:g.reason||'Energiebedarf noch nicht berechenbar',enabled:true,day};
 // Water-only logs (0 kcal) do not become a large 'deficit' achievement.
 if(g.known===0||(g.high===0&&g.low===0))return {ready:true,known:false,day,consumed:null,deficit:null,tdee:g.tdee,target:g.target,logged:g.logged,unknown:g.unknown};
 const intake=(g.low+g.high)/2,deficit=g.tdee-intake;
 return {ready:true,known:true,day,intakeLow:g.low,intakeHigh:g.high,consumed:intake,
  deficitLow:g.tdee-g.high,deficitHigh:g.tdee-g.low,deficit,tdee:g.tdee,target:g.target,
  logged:g.logged,knownEntries:g.known,unknown:g.unknown,stage:describeDeficit160(deficit),
  currentDay:calendarDay(now)===day};
}
export function todayEnergyMarkup160(state,day,{now=new Date()}={}){
 const m=todayEnergyModel160(state,day,{now});
 if(!m.ready)return `<div class="ci160-energy-peek ci160-tone-neutral" aria-label="Kalorienbilanz"><div class="ci160-energy-head"><strong>⚡ Kalorien & Defizit</strong><small>${esc(m.reason)}</small></div></div>`;
 if(!m.known)return `<div class="ci160-energy-peek ci160-tone-neutral" aria-label="Kalorienbilanz"><div class="ci160-energy-head"><strong>⚡ Noch keine Kalorienaufnahme erfasst</strong><small>Gesamtbedarf ≈ ${fmt(m.tdee)} kcal · ${m.logged?'keine quantifizierten kcal':'noch kein Eintrag'}</small></div></div>`;
 const max=Math.max(m.tdee*1.2,m.intakeHigh+50),targetX=pct(m.target,max),maintainX=pct(m.tdee,max),markerX=pct(m.consumed,max);
 const deficitText=m.deficitLow>0?`≈ ${fmt(m.deficit)} kcal Defizit`:m.deficitHigh<0?`≈ ${fmt(-m.deficit)} kcal Überschuss`:'≈ Erhaltungsbedarf';
 const aria=`${range(m.intakeLow,m.intakeHigh)} Kilokalorien erfasst; bei bisherigem Tagesstand ${range(m.deficitLow,m.deficitHigh)} Kilokalorien Bilanz zum Gesamtbedarf von ${fmt(m.tdee)} Kilokalorien; ${m.stage.label}.`;
 const marker=`<span class="ci160-energy-marker" style="left:${markerX.toFixed(2)}%" aria-hidden="true"></span>`;
 const summary=`<div class="ci160-energy-head"><span><strong>⚡ ${range(m.intakeLow,m.intakeHigh)} kcal erfasst</strong><small>${m.currentDay?'Heute · Zwischenstand':'Ausgewählter Tag'}${m.unknown?' · '+m.unknown+' ohne kcal':''}</small></span><b class="ci160-energy-balance">${esc(deficitText)}</b></div>`;
 const meter=`<div class="ci160-energy-track" role="img" aria-label="${esc(aria)}"><span class="ci160-zone ci160-zone-loss" style="width:${targetX.toFixed(2)}%"></span><span class="ci160-zone ci160-zone-maintain" style="width:${Math.max(0,maintainX-targetX).toFixed(2)}%"></span><span class="ci160-zone ci160-zone-surplus" style="width:${Math.max(0,100-maintainX).toFixed(2)}%"></span>${marker}</div>`;
 const details=`<div class="ci160-energy-caption"><strong>${esc(m.stage.label)}</strong><small>Gesamtbedarf ≈ ${fmt(m.tdee)} kcal${m.intakeLow!==m.intakeHigh?' · Defizitspanne '+range(m.deficitLow,m.deficitHigh)+' kcal':''} · ${m.currentDay?'Stand jetzt, keine Endbilanz':'protokollierter Tagesstand'}</small></div>`;
 return `<div class="ci160-energy-peek ci160-tone-${m.stage.tone}" aria-label="Kalorien und rechnerisches Tagesdefizit">${summary}${meter}${details}</div>`;
}
