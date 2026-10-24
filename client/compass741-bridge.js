/** Compass .41 integration on verified .40 (GitHub Actions #201). 
 * Fail closed if any upstream integration anchor changes.
 */
export function compass741Bridge(){
 const one=(s,a,b,k)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .41: ${k} requires one integration anchor, got ${n}`);return s.replace(a,b);};
 const pathOf=id=>id.replace(/\\/g,'/').split('?')[0];
 return {name:'compass-741-shopping-nutrition-paddling',enforce:'pre',transform(source,id){
  const p=pathOf(id);let s=source;
  if(p.endsWith('/client/src/main.js')){
   s=one(s,"const COMPASS_CLIENT_VERSION='0.5.77.40';","const COMPASS_CLIENT_VERSION='0.5.77.41';",'version');
   s=one(s,'function chrome(content){',`function shopping741QuickButton(){
 const active=shoppingLists(state).filter(p=>p.status==='active');
 if(!active.length)return '';
 const selected=active.find(p=>p.id===shoppingSelectedId)||active[0];
 const progress=shoppingProgress(state,selected.id);
 return \`<button type="button" class="quick-utility-button shopping741-quick" data-action="shopping741-open" data-id="\${h(selected.id)}" title="Aktive Einkaufsliste: \${h(selected.title)} (\${progress.done}/\${progress.total})" aria-label="Einkaufsliste öffnen: \${h(selected.title)}"><span class="shopping741-symbol" aria-hidden="true">🛒</span><span class="quick-utility-label">Einkauf</span><small class="shopping741-count">\${progress.remaining}</small></button>\`;
}
function chrome(content){`,'shopping header helper');
   s=one(s,'${worktimeQuickButton()}${habitQuickButton()}','${shopping741QuickButton()}${worktimeQuickButton()}${habitQuickButton()}','shopping header placement');
   s=one(s,"if(action==='shopping713-create'){",`if(action==='shopping741-open'){
   const active=shoppingLists(state).filter(p=>p.status==='active');
   if(!active.length){toast('Keine aktive Einkaufsliste.');return;}
   shoppingSelectedId=active.some(p=>p.id===id)?id:active[0].id;
   tab='shopping';calmNavGroup='plan';render();return;
  }
  if(action==='shopping713-create'){`,'shopping direct navigation');
   s=one(s,"['combined','strength','cycling'].includes(id)","['combined','strength','cycling','water'].includes(id)",'paddling activity action');
   s=one(s,"import './strength-premium-v57738.css';","import './strength-premium-v57738.css';\nimport './compass741.css';",'new styles');
   return {code:s,map:null};
  }
  if(p.endsWith('/client/src/personal-journal-v5692.js')){
   s=one(s," ['other-food','➕','Anderes','Sonstiges']",` ['hofer-germknoedel','🥟','Hofer Germknödel','Snacks','1 Stück (187 g)',496,503],
 ['hofer-butter-brezel','🥨','Hofer Laugenbreze mit Butter','Snacks','1 Breze (95 g) + Butter (10 g)',277,380],
 ['other-food','➕','Anderes','Sonstiges']`,'food presets');
   s=one(s," const parseNumber=v=>Number(String(v).replace(',','.'));",` if(food.id==='hofer-butter-brezel'){
  const whole=given.match(/(\\d+(?:[.,]\\d+)?)\\s*g\\s*(?:breze|laugenbreze)/i);
  const grams=whole?Number(whole[1].replace(',','.')):Number(given.match(/\\((\\d+(?:[.,]\\d+)?)\\s*g\\)/i)?.[1]?.replace(',','.')||95);
  const butter=Number(given.match(/butter\\s*\\(\\s*(\\d+(?:[.,]\\d+)?)\\s*g/i)?.[1]?.replace(',','.')||given.match(/(\\d+(?:[.,]\\d+)?)\\s*g\\s*butter/i)?.[1]?.replace(',','.')||10);
  if(!Number.isFinite(grams)||!Number.isFinite(butter)||grams<=0||grams>400||butter<0||butter>150)return null;
  return {low:Math.round(grams*2.14+butter*7.2),high:Math.round(grams*3.14+butter*7.6),kind:'Schätzung · widersprüchliche Produktdaten'};
 }
 const parseNumber=v=>Number(String(v).replace(',','.'));`,'butter breze grams and kcal');
   return {code:s,map:null};
  }
  if(p.endsWith('/client/src/nutrition-intelligence-v57712.js')){
   s=one(s," 'mixed-nuts':profile(",` 'hofer-germknoedel':profile('Hofer Germknödel · Schätzung',187,'g',{kcal:500,protein:11.7,fat:6.3,carbs:96.6},'Community-Profile: FatSecret 496–503 kcal/187 g',{},'Portion und Rezept bitte mit der tatsächlichen Packung abgleichen.'),
 'hofer-butter-brezel':profile('Hofer Laugenbreze 95 g + Butter 10 g · Schätzung',1,'Portion',{kcal:372,protein:8.1,fat:13.1,saturated:6.3,carbs:53.9,salt:1.7},'FDDB Hofer Backbox 314 kcal/100g + generische Butter; andere Datenbank nur 214 kcal/100g',{},'Starke Datenabweichung und angenommene Buttermengen; keine vollständigen Mikronährstoffe behaupten.'),
 'mixed-nuts':profile(`,'food nutrient source status');
   return {code:s,map:null};
  }
  if(p.endsWith('/client/src/nutrition-history-v577.js')){
   s=one(s,"import {personalEnergyEstimate} from './energy-goal-v575.js';","import {personalEnergyEstimate} from './energy-goal-v575.js';\nimport {activityEnergyByDay,dailyKcalGradient} from './activity-energy-57741.js';",'energy import');
   s=one(s," const max=Math.max(2500,ready?goal.tdee*1.45:0,...records.map(r=>r.high));"," const activity=activityEnergyByDay(state,goal,{today:dayLocal(now)});\n const max=Math.max(2500,ready?goal.tdee*1.45:0,...records.map(r=>r.high),...([...activity.byDay.values()].map(d=>d.tdee*1.45)));",'dynamic energy max');
   s=one(s,"  const low=Math.min(100,r.low/max*100),high=Math.min(100,r.high/max*100),known=r.known>0;","  const dayTarget=ready&&activity.ready?activity.byDay.get(r.day):null;\n  const dynamicBackground=dayTarget?dailyKcalGradient(dayTarget,max):'';\n  const low=Math.min(100,r.low/max*100),high=Math.min(100,r.high/max*100),known=r.known>0;",'day zone adjustment');
   s=one(s,'<i class="n577-zones-gradient" aria-hidden="true"></i>','<i class="n577-zones-gradient" aria-hidden="true" style="${dynamicBackground}"></i>','per day gradient');
   s=one(s,'<div class="n577-amount"><span class="n577-kcal-value">','<div class="n577-amount" title="${dayTarget?`Garmin-bedingte Tagesreferenz: Ziel ca. ${fmt(dayTarget.target)} kcal, Erhaltung ca. ${fmt(dayTarget.tdee)} kcal; Abweichung ${dayTarget.delta>=0?\'+\':\'\'}${fmt(dayTarget.delta)} kcal zum 28-Tage-Mittel.`:activity.reason||\'Basis-Ziel ohne Tagesanpassung\'}"><span class="n577-kcal-value">','daily threshold tooltip');
   s=one(s,'${nutritionMissingEnergyPill(r)}</div></div>',
     '${nutritionMissingEnergyPill(r)}${dayTarget?`<small class="n741-day-goal" title="Erhaltung ca. ${fmt(dayTarget.tdee)} kcal; Basisziel ${fmt(goal.target)} kcal">🎯 ${fmt(dayTarget.target)} kcal · Tagesziel</small>`:\'\'}</div></div>','per day actual goal');
   s=one(s,'${legend}<div class="n577-spectrum-heading">','${legend}<p class="n741-active-legend">${activity.ready?`Die Farben sind pro Tag an deine dokumentierte Garmin-Aktivität relativ zum 28-Tage-Mittel angepasst. Tagesziel und Erhaltung: rechts am Wert beim Hover/Tipp. Keine Sportkalorien doppelt auf den Aktivitätsfaktor addiert.`:`Aktivitätsabhängige Tagesgrenzen noch nicht berechenbar: ${esc(activity.reason)} Vorerst gelten die bisherigen Zielgrenzen.`}</p><div class="n577-spectrum-heading">','energy hint');
   return {code:s,map:null};
  }
  if(p.endsWith('/client/src/strength-insights-v57728.js')){
   s=one(s,"import {strengthPremiumTimeline,strengthPremiumKpis,strengthPremiumMap} from './strength-premium-v57738.js';","import {strengthPremiumTimeline,strengthPremiumKpis,strengthPremiumMap} from './strength-premium-v57738.js';\nimport {waterSportMuscleSummary,waterSportSummaryView} from './water-sport-muscles-57741.js';",'sport import');
   s=one(s,"const cycling=cyclingMuscleSummary(state,{range,today});","const cycling=cyclingMuscleSummary(state,{range,today}); const water=waterSportMuscleSummary(state,{range,today});",'paddling series');
   s=one(s,"['cycling','🚲 Radfahren']","['cycling','🚲 Radfahren'],['water','🛶 Kajak / SUP']",'water tab');
   s=one(s,'${strengthPremiumMap(m,cycling,activity,side)}','${strengthPremiumMap(m,cycling,activity,side,water)}${waterSportSummaryView(water)}','water integration');
   return {code:s,map:null};
  }
  if(p.endsWith('/client/src/strength-premium-v57738.js')){
   const original=`export function strengthPremiumMap(model,cycling,activity='combined',side='front'){`;
   const updated=`export function strengthPremiumMap(model,cycling,activity='combined',side='front',water=null){`;
   s=one(s,original,updated,'sport map signature');
   s=one(s," const mode=side==='back'?'load':'roles';\n const legend=",` const mode=side==='back'?'load':'roles';
 const muscleLayer=activity==='water'?(water||{rides:0,regions:{primary:[],secondary:[]}}):activity==='combined'&&water?.rides?{
  ...cycling,rides:(cycling?.rides||0)+water.rides,
  regions:{primary:[...new Set([...(cycling?.regions?.primary||[]),...water.regions.primary])],secondary:[...new Set([...(cycling?.regions?.secondary||[]),...water.regions.secondary])]} }
 :cycling;
 const sportMode=activity==='water'?'cycling':activity;
 const legend=`, 'selected muscle context');
   s=one(s,"if(activity!=='strength'&&cycling?.rides)legend.push(['#f2a531','Radfahren (primär)']);","if(activity!=='strength'&&muscleLayer?.rides)legend.push(['#f2a531',activity==='water'?'Paddeln (beteiligt)':activity==='combined'?'Ausdauersport beteiligt':'Radfahren (primär)']);",'map legend');
   s=one(s,"premiumStrengthSvg(model,'front',mode,cycling,activity),back=premiumStrengthSvg(model,'back',mode,cycling,activity)","premiumStrengthSvg(model,'front',mode,muscleLayer,sportMode),back=premiumStrengthSvg(model,'back',mode,muscleLayer,sportMode)",'new atlas layer');
   s=one(s,"const disclaimer=activity==='cycling'?","const disclaimer=activity==='water'?'Kajak und SUP beanspruchen Rumpf, Rücken und Arme; individuelle Belastung ist nicht direkt gemessen.':activity==='cycling'?",'paddling disclaimer');
   s=one(s,"${activity==='cycling'?'RAD':activity==='strength'?'KRAFT':'KRAFT + RAD'}","${activity==='water'?'KAJAK / SUP':activity==='cycling'?'RAD':activity==='strength'?'KRAFT':'KRAFT + SPORT'}",'map badge');
   s=one(s,"${strengthPremiumRanking(model,cycling,activity)}`;","${strengthPremiumRanking(model,muscleLayer,sportMode)}`;",'ranking context');
   return {code:s,map:null};
  }
  return null;
 }};
}
