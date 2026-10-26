import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {FOOD_PRESETS,nutritionKcalEstimate,nutritionQuickView,addNutrition,nutritionEntries} from '../client/src/personal-journal-v5692.js';
import {nutritionParts,nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {compass5932FoodDesktopBridge} from '../client/compass5932-food-desktop-bridge.js';
const p=id=>FOOD_PRESETS.find(item=>item.id===id);
const ids=['pizza-margherita','krautsalat','stangenbohnensalat','champagne','chocolate-cookie','whipped-cream','chocolate-cookie-cream'];
test('seven new clearly labelled quick-food choices exist exactly once with estimated intervals',()=>{
 for(const id of ids){assert.equal(FOOD_PRESETS.filter(x=>x.id===id).length,1,id);assert.ok(/schätz/i.test(p(id).recipeNote),id);assert.ok(p(id).kcalLow<=p(id).kcalHigh,id);}
 assert.equal(p('pizza-margherita').group,'Mahlzeiten');assert.equal(p('krautsalat').group,'Mahlzeiten');
 assert.equal(p('champagne').group,'Getränke');assert.equal(p('chocolate-cookie-cream').group,'Snacks');
});
test('the quick-food UI exposes four meal components without a GPT or clipboard dependency',()=>{
 const markup=nutritionQuickView({},{});
 for(const id of ['pizza-margherita','krautsalat','champagne','chocolate-cookie-cream'])assert.match(markup,new RegExp(`data-id="${id}"`));
 assert.match(markup,/data-action="pj92-food-tap"/);
});
test('pizza, salads and champagne adjust their estimates to the user-entered quantity',()=>{
 for(const [id,defaultEstimate,edit,ratio] of [['pizza-margherita',650,'150 g',.5],['krautsalat',70,'300 g',2],['champagne',85,'250 ml',2]]){
  const original=nutritionKcalEstimate(p(id),p(id).defaultAmount),changed=nutritionKcalEstimate(p(id),edit);
  assert.ok(original&&changed, id);assert.equal(original.low,defaultEstimate);
  assert.ok(Math.abs(changed.low-original.low*ratio)<=1,id);
 }
});
test('cookie with whipped cream uses two distinct editable ingredient weights for both kcal and nutrients',()=>{
 const item=p('chocolate-cookie-cream');
 const original=nutritionKcalEstimate(item,item.defaultAmount);
 assert.ok(original&&original.low>=400&&original.high<=650);
 const small=nutritionKcalEstimate(item,'50 g Cookie + 10 g Sahne');
 assert.ok(small.low<original.low);
 const parts=nutritionParts(item.id,'50 g Cookie + 10 g Sahne',item);
 assert.deepEqual(parts.map(x=>[x.part,x.amount]),[['Cookie',50],['Schlagsahne',10]]);
 assert.ok(parts.every(x=>/schätz/i.test(x.source)));
 assert.equal(nutritionKcalEstimate(item,'Pizza ohne Gewichtsangabe'),null);
});
test('one meal can be recorded as independent encrypted-journal-compatible nutrition entries',()=>{
 const state={nutritionJournal:{entries:[],customFoods:[]}};
 for(const id of ['pizza-margherita','krautsalat','champagne','chocolate-cookie-cream'])addNutrition(state,{foodId:id,at:'2026-10-26T12:30:00+01:00'});
 assert.deepEqual(nutritionEntries(state).map(x=>x.foodId),['pizza-margherita','krautsalat','champagne','chocolate-cookie-cream']);
 const totals=nutritionDay(state,'2026-10-26');
 assert.equal(totals.entries.length,4);assert.ok(totals.totals.kcal>1000);
});
test('desktop moonlit artwork is isolated to the desktop lockscreen without changing the original phone graphic',()=>{
 const css=readFileSync(new URL('../client/src/ars-vivendi-lock-v5775922.css',import.meta.url),'utf8');
 const js=readFileSync(new URL('../client/src/ars-vivendi-lock-v5775922.js',import.meta.url),'utf8');
 const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(css,/@media\(min-width:720px\)[\s\S]*?\.ars22-wash\{[^}]*var\(--ars22-desktop-bg\)/);
 assert.match(css,/@media\(max-width:719px\)\{\.ars22-art/);
 assert.match(js,/ars-vivendi-lock-v5775922\.png/);
 assert.match(js,/ars-vivendi-moonlit-desktop-v5775932\.webp/);
 assert.match(vite,/includeAssets:\s*\[[^\]]*ars-vivendi-moonlit-desktop-v5775932\.webp/);
 assert.ok(statSync(new URL('../client/public/ars-vivendi-moonlit-desktop-v5775932.webp',import.meta.url)).size>40_000);
});
test('the .32 plugin updates both visible version labels, and never touches unrelated modules',()=>{
 const plugin=compass5932FoodDesktopBridge();
 const sample="const COMPASS_CLIENT_VERSION='0.5.77.59.31'; const label='Build 0.5.77.59.31';";
 const transformed=plugin.transform(sample,'/demo/client/src/main.js')?.code;
 assert.match(transformed,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.32'/);
 assert.match(transformed,/Build 0\.5\.77\.59\.32/);
 assert.equal(plugin.transform(sample,'/demo/client/src/other.js'),null);
 assert.throws(()=>plugin.transform('const broken=1','/demo/client/src/main.js'),/version anchors/);
});

test('Greger Daily Dozen conservatively attributes logged cabbage and green-bean sides, but no pizza/Champagne/dessert bonus',()=>{
 const state={nutritionJournal:{entries:[],customFoods:[]}};
 for(const id of ['pizza-margherita','krautsalat','stangenbohnensalat','champagne','chocolate-cookie-cream'])addNutrition(state,{foodId:id,at:'2026-10-26T12:30:00+01:00'});
 const dd=dailyDozen5930(state,{day:'2026-10-26'});
 assert.equal(dd.rows.find(x=>x.id==='cruciferous').observed,1);
 assert.equal(dd.rows.find(x=>x.id==='vegetables').observed,1);
 assert.equal(dd.rows.find(x=>x.id==='beverages').observed,0);
 assert.equal(dd.rows.find(x=>x.id==='nuts').observed,0);
});
