import test from 'node:test';
import assert from 'node:assert/strict';
import {compass741Bridge} from '../client/compass741-bridge.js';
const B=compass741Bridge();
const transform=(path,src)=>B.transform(src,'/repo/client/src/'+path)?.code;
test('the known history template gets a day-specific threshold and user-visible kcal goal',()=>{
 const src=`import {personalEnergyEstimate} from './energy-goal-v575.js';
 function nutritionHistoryView(state,{now}={}){
  const goal=personalEnergyEstimate(state,now),ready=true,records=[],activity=0;
  const max=Math.max(2500,ready?goal.tdee*1.45:0,...records.map(r=>r.high));
  const shown=records,fmt=x=>x,esc=x=>x,legend='';
  return \`<div>\${legend}<div class="n577-spectrum-heading">\${shown.map(r=>{
  const low=Math.min(100,r.low/max*100),high=Math.min(100,r.high/max*100),known=r.known>0;
  return \`<i class="n577-zones-gradient" aria-hidden="true"></i><div class="n577-amount"><span class="n577-kcal-value">\${nutritionMissingEnergyPill(r)}</div></div>\`;
  }).join('')}</div>\`;
 }`;
 const out=transform('nutrition-history-v577.js',src);
 assert.match(out,/dailyKcalGradient\(dayTarget,max\)/);
 assert.match(out,/🎯/);
 assert.match(out,/activityEnergyByDay\(state,goal/);
 assert.match(out,/n577-zones-gradient.*dynamicBackground/);
});
test('nutrition preset and source profiles are added only once with correct source markings',()=>{
 const stub=`const FOOD_PRESETS=[\n ['other-food','➕','Anderes','Sonstiges']\n];
export function nutritionKcalEstimate(food,amount){const given=String(amount); const parseNumber=v=>Number(String(v).replace(',','.'));}`;
 const out=transform('personal-journal-v5692.js',stub);
 assert.equal((out.match(/hofer-germknoedel/g)||[]).length,1);
 assert.match(out,/hofer-butter-brezel/);
 assert.match(out,/butter.*Schätzung · widersprüchliche Produktdaten/s);
 const nutrient=transform('nutrition-intelligence-v57712.js',`const LABELLED={\n 'mixed-nuts':profile('mix',10,'g',{})};`);
 assert.match(nutrient,/Community-Profile/);assert.match(nutrient,/starke Datenabweichung/i);
});
test('strength view wires the water session summary and new tab',()=>{
 const src=`import {strengthPremiumTimeline,strengthPremiumKpis,strengthPremiumMap} from './strength-premium-v57738.js';
const cycling=cyclingMuscleSummary(state,{range,today});
\${[['combined','Gemeinsam'],['strength','Krafttraining'],['cycling','🚲 Radfahren']].map(x=>x).join('')}
\${strengthPremiumMap(m,cycling,activity,side)}`;
 const out=transform('strength-insights-v57728.js',src);
 assert.match(out,/waterSportMuscleSummary/);assert.match(out,/Kajak \/ SUP/);
 assert.match(out,/strengthPremiumMap\(m,cycling,activity,side,water\)/);
});
