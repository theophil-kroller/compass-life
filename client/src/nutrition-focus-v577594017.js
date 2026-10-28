/** Compass Nutrition UX .40.17 — chart-first, data-backed daily view.
 * Presentation-only. Does not write to vault, change sync or edit food estimates.
 * Existing detailed charts are passed as lazy section renderers by the main UI.
 */
import {nutritionFoods,nutritionEntries,nutritionKcalEstimate} from './personal-journal-v5692.js';
import {nutritionConsumptionKind,nutritionEnergyTier} from './nutrition-timing-v57725.js';
import {dailyDozen5930} from './daily-dozen-v5775930.js';
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayFor=at=>{const d=new Date(at);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const format=n=>Number(n).toLocaleString('de-AT',{maximumFractionDigits:0});
const detailViews=Object.freeze(['timing','trends','connections','fats','anti-aging','phyto']);
const mainTabs=Object.freeze([['journal','Heute'],['daily-dozen','Daily Dozen'],['nutrients','Nährstoffe'],['timing','Trends']]);
const trendTabs=Object.freeze([['timing','Essenszeiten'],['trends','Nährstoff-Trends'],['connections','Zusammenhänge'],['fats','Fettqualität'],['anti-aging','Anti-Aging Eight'],['phyto','Pflanzenstoffe']]);
export function nutritionFocusDay4017(state,day){
 const foods=new Map(nutritionFoods(state).map(f=>[f.id,f]));
 const entries=nutritionEntries(state).filter(e=>dayFor(e.at)===day).map(e=>{
  const food=foods.get(e.foodId),estimate=nutritionKcalEstimate(food,e.amount,e.recipe);
  const low=Number(estimate?.low),high=Number(estimate?.high);
  const known=estimate!=null&&Number.isFinite(low)&&Number.isFinite(high);
  const kcal=known?(low+high)/2:null;
  const kind=nutritionConsumptionKind(food);
  return {id:e.id,title:food?.title||'Lebensmittel ohne Zuordnung',emoji:food?.emoji||'🍽️',amount:e.amount||food?.defaultAmount||'',time:new Date(e.at),kind,kcal,low:known?low:null,high:known?high:null,known};
 }).filter(e=>Number.isFinite(+e.time)).sort((a,b)=>+a.time-+b.time);
 const known=entries.filter(e=>e.known);const dozen=dailyDozen5930(state,{day});
 return {day,entries,dozen,low:known.reduce((v,e)=>v+e.low,0),high:known.reduce((v,e)=>v+e.high,0),unknown:entries.length-known.length,drinks:entries.filter(e=>e.kind==='drink').length,known:known.length};
}
export function nutritionDotChart4017(model){
 const x0=30,x1=850,top=29,bottom=125,axisY=93;
 const xTime=t=>x0+(t/24)*(x1-x0);
 const ticks=[0,3,6,9,12,15,18,21,24].map(hr=>`<g><line x1="${xTime(hr)}" y1="${top}" x2="${xTime(hr)}" y2="${axisY+3}" stroke="currentColor" stroke-opacity=".12"/><text x="${xTime(hr)}" y="${bottom}" class="nf4017-tick" text-anchor="middle">${String(hr).padStart(2,'0')}:00</text></g>`).join('');
 const dots=model.entries.map((e,i)=>{
  const hour=e.time.getHours()+e.time.getMinutes()/60+e.time.getSeconds()/3600;
  const x=xTime(hour),y=e.kind==='drink'?50:79;
  const r=e.known?[0,6,9,12,15][nutritionEnergyTier(e.kcal)??0]:8;
  const stroke=e.kind==='drink'?'#4d8cb7':'#2b8066';
  const label=`${e.time.toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'})} · ${e.title} · ${e.known?`ca. ${format(e.low)}–${format(e.high)} kcal`:'kcal noch unbekannt'}`;
  // Exact clock time on X. Overlapping items use separate, visually paired lanes without moving time.
  const collisions=model.entries.slice(0,i).filter(other=>Math.abs(+other.time-+e.time)<20*60000 && other.kind===e.kind).length;
  const yy=y+(collisions%3-1)*4;
  return `<g class="nf4017-dot" role="img" aria-label="${h(label)}"><title>${h(label)}</title><circle cx="${x.toFixed(2)}" cy="${yy}" r="${r}" fill="${e.known?stroke:'transparent'}" fill-opacity=".78" stroke="${stroke}" stroke-width="${e.known?1.6:2.1}" ${e.known?'':'stroke-dasharray="3 3"'}/>${e.kind==='drink'?`<circle cx="${x.toFixed(2)}" cy="${yy}" r="2.1" fill="white"/>`:''}</g>`;
 }).join('');
 return `<section class="nf4017-plot" aria-label="Ernährung heute als Zeitdiagramm"><div class="nf4017-section-heading"><div><h3>Dein Tag auf einen Blick</h3><p>Jeder Punkt ist ein tatsächlich erfasster Eintrag. Position = Uhrzeit, Größe = geschätzte Energie.</p></div><button type="button" class="nf4017-link" data-action="ni712-view" data-id="timing">Wochenverlauf ansehen</button></div><svg viewBox="0 0 880 137" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Zeitverlauf der heute protokollierten Speisen und Getränke" class="nf4017-svg"><rect x="${x0}" y="34" width="${x1-x0}" height="64" rx="13" fill="#418f7c" fill-opacity=".05"/><text x="10" y="54" class="nf4017-axis-icon">💧</text><text x="10" y="83" class="nf4017-axis-icon">🍽️</text><line x1="${x0}" x2="${x1}" y1="${axisY}" y2="${axisY}" stroke="currentColor" stroke-opacity=".22"/>${ticks}${dots}</svg>${model.entries.length?'':'<p class="nf4017-empty">Heute noch keine Lebensmittel oder Getränke erfasst.</p>'}<div class="nf4017-chart-legend"><span><i class="nf4017-mark is-food"></i> Essen</span><span><i class="nf4017-mark is-drink"></i> Getränke</span><span><i class="nf4017-mark is-unknown"></i> kcal unbekannt</span></div></section>`;
}
function summaryCards(model){
 const energy=model.known?`≈ ${format(model.low)}–${format(model.high)}`:'–';
 const percent=model.dozen.goal?100*model.dozen.observed/model.dozen.goal:0;
 return `<div class="nf4017-summary" aria-label="Zusammenfassung der erfassten Werte"><div class="nf4017-summary-item"><small>Geschätzte Energie · erfasst</small><strong>${energy} <span>kcal</span></strong><small>${model.unknown?`${model.unknown} Eintrag${model.unknown===1?'':'e'} ohne kcal`:'Keine offenen kcal-Schätzungen'}</small></div><button type="button" class="nf4017-summary-item nf4017-summary-button" data-action="ni712-view" data-id="daily-dozen"><small>Daily Dozen · dokumentiert</small><span class="nf4017-mini-track"><i style="width:${Math.min(100,percent).toFixed(1)}%"></i></span><strong>${model.dozen.observed.toLocaleString('de-AT')} / ${model.dozen.goal}</strong><small>Zur vollständigen Checkliste</small></button><div class="nf4017-summary-item"><small>Heute erfasst</small><strong>${model.entries.length} <span>Einträge</span></strong><small>${model.drinks} davon Getränke · kein Vollständigkeitsnachweis</small></div></div>`;
}
function recentRows(model){
 const rows=model.entries.slice(-6).reverse();
 return `<section class="nf4017-recent"><div class="nf4017-section-heading"><h3>Zuletzt erfasst</h3><button type="button" class="nf4017-link" data-action="pj92-nutrition-add">+ Lebensmittel erfassen</button></div>${rows.length?`<div class="nf4017-recent-list">${rows.map(e=>`<button type="button" class="nf4017-recent-row" data-action="pj92-food-edit" data-id="${h(e.id)}" aria-label="${h(e.title)} bearbeiten"><span class="nf4017-recent-emoji" aria-hidden="true">${h(e.emoji)}</span><span class="nf4017-recent-title"><strong>${h(e.title)}</strong><small>${e.time.toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'})}${e.amount?' · '+h(e.amount):''}</small></span><span class="nf4017-recent-energy">${e.known?`≈ ${format(e.kcal)} kcal`:'kcal offen'}</span></button>`).join('')}</div>`:'<p class="nf4017-empty">Dein erster Eintrag erscheint direkt hier.</p>'}</section>`;
}
export function nutritionWorkspace4017(state,{day,view='journal',editingId='',renderSection,renderHistory,renderJournal,renderManualDozen,renderSync}={}){
 if(typeof renderSection!=='function'||typeof renderHistory!=='function'||typeof renderJournal!=='function'||typeof renderManualDozen!=='function'||typeof renderSync!=='function')throw Error('Nutrition .40.17: missing view renderers');
 const active=detailViews.includes(view)?'timing':view;
 const nav=`<nav class="nf4017-nav" aria-label="Ernährung: vier Hauptbereiche">${mainTabs.map(([id,label])=>`<button type="button" data-action="ni712-view" data-id="${id}" class="${active===id?'selected':''}" aria-current="${active===id?'page':'false'}">${label}</button>`).join('')}</nav>`;
 const header=`<div class="nf4017-header"><div><small>ERNÄHRUNG · DEIN TAGEBUCH</small><h2>Ernährung</h2><p>Heute erfassen, visuell verstehen und bei Bedarf tiefer analysieren.</p></div><button type="button" class="nf4017-primary" data-action="pj92-food-open">+ Erfassen</button></div>`;
 let body='';
 if(active==='journal'){
  const model=nutritionFocusDay4017(state,day);
  body=`${nutritionDotChart4017(model)}${summaryCards(model)}${recentRows(model)}<details class="nf4017-detail" ${editingId?'open':''}><summary>Einträge bearbeiten und Tagebuchdetails</summary>${renderJournal()}</details><details class="nf4017-detail"><summary>Bisherige kcal-Verlaufsgrafiken anzeigen</summary>${renderHistory()}</details>`;
 }else if(active==='daily-dozen'){
  body=`<p class="nf4017-explain">Tagesverteilung deiner dokumentierten Lebensmittel. Fehlende Einträge sind keine Aussage über tatsächliche Ernährung.</p>${renderSection('daily-dozen')}<details class="nf4017-detail"><summary>Manuelle Checkliste und Korrekturen</summary>${renderManualDozen()}</details>`;
 }else if(active==='nutrients'){
  body=renderSection('nutrients');
 }else{
  body=`<nav class="nf4017-subnav" aria-label="Erweiterte Ernährungsanalysen">${trendTabs.map(([id,label])=>`<button type="button" data-action="ni712-view" data-id="${id}" class="${view===id?'selected':''}" aria-pressed="${view===id}">${label}</button>`).join('')}</nav>${renderSection(view)}`;
 }
 return `<section class="nf4017-workspace">${header}${nav}<div class="nf4017-body">${body}</div>${renderSync()}</section>`;
}
