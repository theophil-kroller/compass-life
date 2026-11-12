/** Compass 0.5.91.44 · Read-only V-Taper Nutrition Coach.
 * Daily values are computed from the existing encrypted nutrition journal.
 * Estimates are useful quantified values, NOT evidence of missing meals.
 * Never store inferred intake, alter a meal, or change a training prescription.
 */
import {nutritionTrendsIndex} from './nutrition-trends-v57726.js';
import {nutritionFoods} from './personal-journal-v5692.js';
import {nutrientEntry} from './nutrition-intelligence-v57712.js';
import {personalEnergyEstimate} from './energy-goal-v575.js';
import {activityEnergyByDay} from './activity-energy-57741.js';
import {proteinTarget88} from './coach-integration-v0588.js';

const validDay=d=>typeof d==='string'&&/^20\d\d-\d\d-\d\d$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
const gap=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const avg=a=>a.length?a.reduce((v,n)=>v+n,0)/a.length:null;
const round=(n,places=0)=>finite(n)?Math.round(n*10**places)/10**places:null;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=0)=>finite(n)?n.toLocaleString('de-AT',{minimumFractionDigits:d,maximumFractionDigits:d}):'–';
const ranges=[7,14,42];

function blockStart(state,today){
 const cycle=state?.strengthCycle,blocks=Array.isArray(cycle?.blocks)?cycle.blocks:[];
 const selected=blocks.find(b=>b.id===cycle.activeBlockId)||blocks.filter(b=>validDay(b.startDay)&&b.startDay<=today).sort((a,b)=>b.startDay.localeCompare(a.startDay))[0];
 return validDay(selected?.startDay)&&selected.startDay<=today?selected.startDay:null;
}
function weightObservations(state,start,today){
 const byDay=new Map();
 for(const p of state?.healthImports?.fitdays||[]){
  const day=validDay(p?.day)?p.day:typeof p?.at==='string'?p.at.slice(0,10):'';
  if(!validDay(day)||day<start||day>today||!finite(p.weightKg)||p.weightKg<30||p.weightKg>350)continue;
  const at=Number.isFinite(Date.parse(p?.at||''))?Date.parse(p.at):Date.parse(day+'T12:00:00Z');
  const prior=byDay.get(day);if(!prior||at>=prior.at)byDay.set(day,{day,value:p.weightKg,at});
 }
 return [...byDay.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
/** Robust cross-day median slope: no inference from one morning, minimum span. */
export function vtaperWeightTrend144(rows,days){
 const minCount=days===7?5:7,minSpan=days===7?5:9;
 if(rows.length<minCount||gap(rows[0].day,rows.at(-1).day)<minSpan)return null;
 const slopes=[];
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const d=gap(rows[i].day,rows[j].day);
  if(d>=Math.max(3,Math.floor(minSpan/2)))slopes.push((rows[j].value-rows[i].value)/d*7);
 }
 if(!slopes.length)return null;
 slopes.sort((a,b)=>a-b);const m=Math.floor(slopes.length/2);
 return {kgPerWeek:round(slopes.length%2?slopes[m]:(slopes[m-1]+slopes[m])/2,2),days:rows.length,spanDays:gap(rows[0].day,rows.at(-1).day),method:'robuster Median der Gewichtstrends'};
}
/** 0.5.91.45 · Concrete vegetarian menu products with computed, portion-specific
 * kcal and protein. No inventory assumption; this is a suggestion, never a log.
 * All names and numeric values come from the existing Compass food catalog.
 */
const PROTEIN_MENU_CANDIDATES_145=Object.freeze([
 {id:'bio-magertopfen-250g',amount:'1 Becher (250 g)',kind:'Milchprodukt'},
 {id:'spar-freefrom-bio-skyr-250g',amount:'1 Becher (250 g)',kind:'Milchprodukt'},
 {id:'ehrmann-high-protein-skyr-natural-450g',amount:'250 g',kind:'Milchprodukt'},
 {id:'spar-naturpur-bio-skyr-mango-maracuja-400g',amount:'1 Becher',kind:'Milchprodukt'},
 {id:'ehrmann-high-protein-vegan-chocolate-200g',amount:'1 Becher',kind:'Snack · pflanzlich'},
 {id:'milsani-skyr-maracuja-150g',amount:'2 Becher (300 g)',kind:'Milchprodukt'},
 {id:'ironmaxx-vegan-protein-shake-mixed-berries',amount:'1 Glas (30 g Pulver + 300 ml Wasser)',kind:'Shake · pflanzlich'},
 {id:'alpro-plant-protein-vanilla-pudding-200g',amount:'1 Becher (200 g)',kind:'Snack · pflanzlich'},
 {id:'alpro-plant-protein-chocolate-pudding-200g',amount:'1 Becher (200 g)',kind:'Snack · pflanzlich'}
]);
/** Returns only existing, quantified, substantial protein choices.
 * Caller-supplied 'budget' refers to an average, NOT today's available kcal.
 */
export function vtaperProteinOptions145(state,{needed=null,budget=null}={}){
 const foods=new Map(nutritionFoods(state).map(f=>[f.id,f]));
 const rows=[];
 for(const candidate of PROTEIN_MENU_CANDIDATES_145){
  const food=foods.get(candidate.id);if(!food)continue;
  const result=nutrientEntry(food,{foodId:candidate.id,amount:candidate.amount});
  const protein=result.values.protein,kcal=result.values.kcal;
  if(!finite(protein)||!finite(kcal)||protein<12||kcal<=0||kcal>450)continue;
  rows.push({id:candidate.id,title:food.title,emoji:food.emoji||'🥣',amount:candidate.amount,kind:candidate.kind,
   protein:round(protein,1),kcal:round(kcal),proteinPer100Kcal:round(protein/kcal*100,1),
   estimatedProtein:result.estimatedKeys.has('protein')||result.partialKeys.has('protein'),
   estimatedKcal:result.estimatedKeys.has('kcal')||result.partialKeys.has('kcal'),
   fitsAverageBudget:finite(budget)?kcal<=budget:null,
   gapCoverage:finite(needed)&&needed>0?round(Math.min(protein,needed),1):null});
 }
 // First four contain diverse genuine options, not four almost identical dairy brands.
 const byDensity=(a,b)=>b.proteinPer100Kcal-a.proteinPer100Kcal||b.protein-a.protein;
 const dairy=rows.filter(r=>r.kind==='Milchprodukt').sort(byDensity);
 const shake=rows.filter(r=>r.kind.startsWith('Shake')).sort(byDensity);
 const plant=rows.filter(r=>r.kind.startsWith('Snack')).sort(byDensity);
 const chosen=[];
 for(const candidate of [dairy[0],shake[0],plant[0],dairy[1],...rows.slice().sort(byDensity)]){
  if(candidate&&!chosen.some(x=>x.id===candidate.id))chosen.push(candidate);
 }
 return chosen;
}
export function vtaperNutritionModel144(state,{today=new Date().toLocaleDateString('sv-SE'),nutritionIndex=null}={}){
 if(!validDay(today))throw Error('Datum für V-Taper-Ernährungsanalyse ungültig.');
 const index=nutritionIndex?.days instanceof Map?nutritionIndex:nutritionTrendsIndex(state);
 // No new personal data is persisted. Use the same energy model as the existing Nutrition tab.
 const now=new Date(today+'T12:00:00');
 const energy=personalEnergyEstimate(state,now);
 const activity=energy.ready&&energy.settings?.enabled?activityEnergyByDay(state,energy,{today,baselineDays:28}):null;
 const latestWeight=(state?.healthImports?.fitdays||[]).filter(p=>(validDay(p?.day)?p.day:p?.at?.slice(0,10))<=today&&finite(p.weightKg)&&p.weightKg>30)
  .sort((a,b)=>String(b.day||b.at).localeCompare(String(a.day||a.at)))[0]?.weightKg||null;
 const target=proteinTarget88(state);
 const proteinMin=finite(latestWeight)?Math.round(latestWeight*1.6):Math.round(target*.94),proteinMax=finite(latestWeight)?Math.round(latestWeight*2):Math.round(target*1.18);
 const activeStart=blockStart(state,today);
 const windows={};
 for(const days of ranges){
  const start=days===42&&activeStart&&gap(activeStart,today)<=41?activeStart:shift(today,1-days);
  const seen=[];
  for(let day=start;day<=today;day=shift(day,1)){
   const r=index.days.get(day)?.summary;if(!r?.entries)continue;
   const kcalCov=r.coverage?.kcal||{},proteinCov=r.coverage?.protein||{};
   seen.push({day,entries:r.entries,kcal: kcalCov.known>0&&finite(r.totals?.kcal)?r.totals.kcal:null,
    protein:proteinCov.known>0&&finite(r.totals?.protein)?r.totals.protein:null,
    kcalKnown:kcalCov.known||0,kcalUnknown:kcalCov.unknown||0,kcalEstimated:kcalCov.estimated||0,
    proteinKnown:proteinCov.known||0,proteinUnknown:proteinCov.unknown||0,proteinEstimated:proteinCov.estimated||0});
  }
  const kc=seen.filter(r=>finite(r.kcal)),pr=seen.filter(r=>finite(r.protein));
  const deficitRows=kc.filter(r=>energy.ready&&finite(energy.tdee)).map(r=>({day:r.day,amount:(activity?.byDay?.get(r.day)?.tdee??energy.tdee)-r.kcal}));
  const weightRows=weightObservations(state,start,today),weight=vtaperWeightTrend144(weightRows,days);
  windows[days]={days,start,today,tracked:seen.length,calendarDays:gap(start,today)+1,rows:seen,
   kcalDays:kc.length,proteinDays:pr.length,avgKcal:round(avg(kc.map(r=>r.kcal))),avgProtein:round(avg(pr.map(r=>r.protein)),1),
   kcalMissing:kc.reduce((n,r)=>n+r.kcalUnknown,0),proteinMissing:pr.reduce((n,r)=>n+r.proteinUnknown,0),
   kcalEstimatedDays:kc.filter(r=>r.kcalEstimated>0).length,proteinEstimatedDays:pr.filter(r=>r.proteinEstimated>0).length,
   avgDeficit:round(avg(deficitRows.map(r=>r.amount))),deficitDays:deficitRows.length,weight,
   weightDays:weightRows.length,blockAligned:days===42&&start===activeStart&&activeStart!==null,
   // A window average never pretends to be today's remaining calorie budget.
   proteinGap:pr.length&&finite(avg(pr.map(r=>r.protein)))?round(Math.max(0,proteinMin-avg(pr.map(r=>r.protein))),1):null,
   avgCalorieRoom:energy.ready&&kc.length?round(energy.target-avg(kc.map(r=>r.kcal))):null};
  windows[days].foodOptions=vtaperProteinOptions145(state,{needed:windows[days].proteinGap,budget:windows[days].avgCalorieRoom});
 }
 const recent=windows[14],seven=windows[7];
 // Do not classify intake using a single day, or mistake estimated portions for omitted meals.
 const enoughIntake=recent.kcalDays>=7, enoughProtein=seven.proteinDays>=4;
 const weeklyWeight=recent.weight?.kgPerWeek??windows[42].weight?.kgPerWeek??null;
 const pctWeight=finite(weeklyWeight)&&finite(latestWeight)?weeklyWeight/latestWeight*100:null;
 let headline='Wir beobachten deinen Ernährungs- und Gewichtstrend weiter.';
 if(finite(pctWeight)&&pctWeight<-.85&&enoughIntake)headline='Dein Gewicht sinkt recht schnell – Energiebilanz und Erholung gemeinsam prüfen.';
 else if(finite(pctWeight)&&pctWeight<=-.15&&pctWeight>=-.85)headline='Dein Gewicht entwickelt sich moderat abwärts – passend zum Fettabbauziel.';
 else if(enoughIntake&&finite(recent.avgDeficit)&&recent.avgDeficit>=150&&recent.avgDeficit<=500)headline='Deine geschätzte Energiebilanz liegt im moderaten Defizitbereich.';
 else if(recent.tracked>0)headline='Die Ernährungsroutine ist dokumentiert – entscheidend ist der Trend über mehrere Wochen.';
 let advice='Behalte deine Routine bei. Ein einzelner Tag mit mehr Hunger ist kein Grund für eine Korrektur.';
 let food=null;
 if(enoughProtein&&finite(seven.avgProtein)&&seven.avgProtein<proteinMin){
  food=seven.foodOptions[0]||null;
  advice=`Der 7-Tage-Proteindurchschnitt liegt unter der Orientierung von etwa ${proteinMin} g. Ergänze bei Bedarf eine geeignete Proteinquelle innerhalb deines Kalorienbudgets.`;
 }else if(finite(pctWeight)&&pctWeight<-.85&&enoughIntake){
  advice='Prüfe bei anhaltend schnellem Gewichtsverlust über weitere 1–2 Wochen dein Energiedefizit, Kraftleistungen, Hunger und Erholung. Keine Kompensation einzelner Tage.';
 }else if(enoughIntake&&finite(recent.avgDeficit)&&recent.avgDeficit<0&&weeklyWeight!==null&&weeklyWeight>=0){
  advice='Über mehrere Wochen ist kein rechnerisches Defizit erkennbar. Überprüfe gemeinsam mit dem Coach den Gewichtstrend und die Verbrauchsschätzung, bevor du etwas änderst.';
 }
 return {today,energyReady:energy.ready,estimatedTdee:energy.ready?energy.tdee:null,energySource:energy.ready?`${energy.resting?.method||'Energieformel'} · Aktivitätsfaktor ${energy.pal}`:energy.reason||'Noch keine Schätzung',
  activityAdjusted:Boolean(activity?.ready),target,proteinMin,proteinMax,latestWeight,windows,headline,advice,food,source:'encrypted-journal-readonly',noDailyJudgement:true};
}
function meter144(value,max){
 const pct=finite(value)&&finite(max)&&max>0?Math.max(0,Math.min(100,value/max*100)):0;
 return `<div class="vt144-meter"><i style="width:${pct.toFixed(1)}%"></i></div>`;
}
function spark144(rows,metric,threshold){
 const values=rows.map(r=>r[metric]).filter(finite);
 if(!values.length)return '<p class="vt144-empty">Keine quantifizierten Tage in diesem Zeitraum.</p>';
 const max=Math.max(1,...values,finite(threshold)?threshold:0)*1.1;
 const bars=rows.map(r=>`<span class="${finite(r[metric])?'has-value':'no-value'}" style="height:${finite(r[metric])?Math.max(3,r[metric]/max*100).toFixed(1):2}%" title="${esc(r.day)} · ${finite(r[metric])?fmt(r[metric],metric==='protein'?1:0)+(metric==='protein'?' g':' kcal'):'ohne quantifizierten Wert'}"></span>`).join('');
 return `<div class="vt144-bars" role="img" aria-label="Tageswerte ${metric==='protein'?'Protein':'Kalorien'}, nur dokumentierte Werte">${bars}</div>`;
}
function proteinOptionsHtml145(w){
 const options=w.foodOptions||[];
 if(!options.length)return '';
 const target=finite(w.proteinGap)?w.proteinGap:null;
 const intro=target===null?'Proteinbedarf: kein verlässlicher Periodendurchschnitt berechenbar.':target>0
  ?`Der Periodendurchschnitt liegt rechnerisch ${fmt(target,1)} g unter der unteren Proteinorientierung. Die Produkte sind optionale Ergänzungen, keine Pflicht.`
  :'Dein erfasster Proteindurchschnitt erreicht die untere Orientierung. Diese Lebensmittel sind nur Alternativen, keine Aufforderung mehr zu essen.';
 const render=r=>`<article class="vt145-food-choice" data-menu-food="${esc(r.id)}">
  <div class="vt145-food-title"><span aria-hidden="true">${esc(r.emoji)}</span><strong>${esc(r.title)}</strong></div>
  <div class="vt145-food-kind">${esc(r.kind)}</div>
  <div class="vt145-food-portion">${esc(r.amount)}</div>
  <div class="vt145-food-macros"><span><strong>${fmt(r.protein,1)} g</strong> Protein</span><span><strong>${fmt(r.kcal)}</strong> kcal</span></div>
  ${r.estimatedProtein||r.estimatedKcal?'<small>Einzelne Makrowerte geschätzt</small>':''}
 </article>`;
 return `<section class="vt145-protein-menu" aria-label="Proteinreiche Produkte aus deinem Compass-Menü" data-vt145-for-period="${w.days}">
  <div class="vt145-food-head"><strong>🥣 Konkrete Proteinoptionen aus deinem Menü</strong><small>${options.length} gespeicherte Produkte</small></div>
  <p>${esc(intro)}</p>
  <div class="vt145-food-grid">${options.slice(0,4).map(render).join('')}</div>
  ${options.length>4?`<details class="vt145-more"><summary>Weitere ${options.length-4} passende Produkte anzeigen</summary><div class="vt145-food-grid">${options.slice(4).map(render).join('')}</div></details>`:''}
  <small class="vt145-menu-foot">Portionswerte aus deiner Compass-Lebensmitteldatenbank; Vorschläge können auch Mahlzeiten ersetzen. Kein Nachweis, was du zu Hause hast. Die Angabe ist keine automatische Buchung und kein Tages-Kalorienrest.</small>
 </section>`;
}
function panel144(w,m){
 const deficit=finite(w.avgDeficit)?`${w.avgDeficit>=0?'−':'+'}${fmt(Math.abs(w.avgDeficit))} kcal/Tag`:'–';
 const trend=w.weight?`${w.weight.kgPerWeek>0?'+':''}${fmt(w.weight.kgPerWeek,2)} kg/Woche`:'Noch zu wenig Waagenverlauf';
 const consistency=w.tracked?`${w.kcalDays}/${w.tracked} Tage mit kcal · ${w.proteinDays}/${w.tracked} mit Protein`:'Keine protokollierten Tage';
 return `<div class="vt144-period-panel" data-nutrition-days="${w.days}">
  <div class="vt144-stats">
   <div><small>Ø Energieaufnahme</small><strong>${finite(w.avgKcal)?fmt(w.avgKcal)+' kcal':'–'}</strong><span>${w.kcalDays} quantifizierte Tage</span></div>
   <div><small>Ø Energiebilanz · Schätzung</small><strong>${esc(deficit)}</strong><span>${m.energyReady?'gegen geschätzten Tagesverbrauch':'Verbrauch noch nicht berechenbar'}</span></div>
   <div><small>Ø Protein</small><strong>${finite(w.avgProtein)?fmt(w.avgProtein,1)+' g':'–'}</strong><span>Orientierung ${fmt(m.proteinMin)}–${fmt(m.proteinMax)} g/Tag</span></div>
   <div><small>Gewichtstrend</small><strong>${esc(trend)}</strong><span>${w.weightDays} Waagenmessungen</span></div>
  </div>
  ${meter144(w.avgProtein,m.proteinMin)}
  <div class="vt144-meter-key"><span>Protein · Mittel der dokumentierten Tage</span><span>erste Orientierung ${fmt(m.proteinMin)} g</span></div>
  <details class="vt144-detail"><summary>Tagesverlauf & Datengrundlage ansehen</summary>
   <div class="vt144-trend-row"><strong>Kalorien</strong>${spark144(w.rows,'kcal',m.estimatedTdee)}</div>
   <div class="vt144-trend-row"><strong>Protein</strong>${spark144(w.rows,'protein',m.proteinMin)}</div>
   <p>Erfasste Tage: ${w.tracked} von ${w.calendarDays}. ${consistency}. ${w.kcalEstimatedDays} Tage mit geschätzten kcal, ${w.proteinEstimatedDays} Tage mit geschätzten Proteinwerten. Schätzung bedeutet nicht „fehlende Mahlzeit“. Einträge ohne den jeweiligen Nährwert werden nicht als null gewertet.${w.kcalMissing?' Bei '+w.kcalMissing+' Lebensmitteleinträgen fehlt ein kcal-Wert.':''}${w.proteinMissing?' Bei '+w.proteinMissing+' Lebensmitteleinträgen fehlt ein Proteinwert.':''}</p>
   <p>Erhaltungskalorien: ${m.energyReady?'ca. '+fmt(m.estimatedTdee)+' kcal/Tag (Modellwert)':'noch nicht schätzbar'}. ${esc(m.energySource)}. ${m.activityAdjusted?'Garmin-Nettoaktivitäten wurden relativ zum üblichen Aktivitätsniveau berücksichtigt.':'Keine zusätzliche tägliche Garmin-Kaloriengutschrift.'} Gewichtstrend = Median paarweiser Tagessteigungen, keine gemessene Kalorienbilanz. ${w.blockAligned?'42-Tage-Ansicht beginnt mit dem aktiven Trainingsblock.':'Rollierendes Beobachtungsfenster.'}</p>
  </details>
 </div>`;
}
export function vtaperNutritionHtml144(m){
 const options=[[7,'7 Tage'],[14,'14 Tage'],[42,'6-Wochen-Block']];
 const tabs=options.map(([days,label])=>`<label><input type="radio" name="vt144-period" value="${days}" ${days===14?'checked':''}><span>${esc(label)}</span></label>`).join('');
 const panels=options.map(([days])=>panel144(m.windows[days],m)).join('');
 const foodPanels=options.map(([days])=>proteinOptionsHtml145(m.windows[days])).join('');
 return `<section class="vt144-nutrition" aria-label="V-Taper Ernährungscoach" data-nutrition-source="tracked" data-version="0.5.91.44">
  <div class="vt144-head"><div><span class="vt144-eyebrow">COMPASS · ERNÄHRUNG & BODY RECOMPOSITION</span><h3>Unterstützt deine Ernährung den V-Taper?</h3><p>Kalorien · Protein · Gewichtstrend · dein bestehender 6-Wochen-Zyklus</p></div><span class="vt144-quiet">Langfristig statt Tagesurteil</span></div>
  <div class="vt144-switch" role="group" aria-label="Zeitraum der Ernährungsanalyse">${tabs}</div>
  ${panels}
  <div class="vt144-coaching"><div><span class="vt144-dot"></span><strong>${esc(m.headline)}</strong></div><p>${esc(m.advice)}</p>${foodPanels}<small>Ein einzelner Tag über dem Kalorienziel führt zu keiner Warnung oder Kompensationsforderung. Die Werte beruhen auf deinen vorhandenen Einträgen; Aufnahme und Verbrauch sind Schätzungen, keine direkte Kalorimetrie.</small></div>
 </section>`;
}
