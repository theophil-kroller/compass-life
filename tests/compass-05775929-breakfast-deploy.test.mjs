import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compass5929BreakfastBridge} from '../client/compass5929-breakfast-bridge.js';

const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
const bridge=compass5929BreakfastBridge();
const change=(name,src)=>bridge.transform(src,'/repo/client/src/'+name).code;
const foodSource=`export const FOOD_PRESETS=[
 ['supplement-bcaa-alphaminos','🥤','BCAA','Nahrungsergänzung','1 Portion',35,35],
].map(([id,emoji,title,group,defaultAmount='',kcalLow=null,kcalHigh=null])=>({
 id,emoji,title,group,defaultAmount,kcalLow,kcalHigh,
 ...(id==='supplement-bcaa-alphaminos'?{foo:true}:{}),
}));
export function nutritionKcalEstimate(food,amount){
 const original=String(food.defaultAmount||'').toLowerCase(),given=String(amount||food.defaultAmount||'').toLowerCase().trim();
 const parseNumber=v=>Number(String(v).replace(',','.'));
 return null;
}`;

test('historical Vite/PWA chain remains textually unchanged, add-ons run after .58',()=>{
 assert.match(cfg,/plugins: \[compass5910StrengthHabitsBridge\(\), nutrition3Bridge\(\)/);
 assert.match(cfg,/compass747Bridge\(\), compass748Bridge\(\), compass749Bridge\(\), VitePWA\(/);
 assert.match(cfg,/VitePWA\([\s\S]*?\),\s*\/\/ Guarded 0\.5\.77\.50/);
 assert.match(cfg,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(cfg,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5928VtaperLuxBridge\(\), compass5929BreakfastBridge\(\)\)/);
 assert.equal((cfg.match(/compass5928VtaperLuxBridge\(\)/g)||[]).length,1);
});

test('Lyttos, honey, both KoRo purees and two one-tap breakfast presets are unique',()=>{
 const modified=change('personal-journal-v5692.js',foodSource);
 const {foods,estimate}=new Function(modified.replace('export const FOOD_PRESETS','const FOOD_PRESETS').replace('export function nutritionKcalEstimate','function nutritionKcalEstimate')+'\nreturn {foods:FOOD_PRESETS,estimate:nutritionKcalEstimate};')();
 for(const id of ['lyttos-greek-natur','honey','koro-pistachio-puree','koro-black-tahini','lyttos-pistachio-breakfast','lyttos-tahini-breakfast']){
  assert.equal(foods.filter(x=>x.id===id).length,1);
 }
 const p=foods.find(x=>x.id==='lyttos-pistachio-breakfast'),t=foods.find(x=>x.id==='lyttos-tahini-breakfast');
 assert.equal(p.group,'Frühstück');assert.equal(t.group,'Frühstück');
 assert.ok(Math.abs(estimate(p,p.defaultAmount).low-317)<=3);
 assert.ok(Math.abs(estimate(t,t.defaultAmount).low-311)<=3);
 const changed=estimate(p,'150 g Joghurt + 5 g Honig + 10 g Pistazienmus');
 assert.ok(changed.low<290);
 assert.ok(estimate(t,'0 g Joghurt + 0 g Honig + 0 g Tahini').low===0);
 assert.equal(estimate(p,'2000 g Joghurt + 15 g Honig + 15 g Pistazienmus'),null);
});

test('nutrition analysis retains separate quantities, product source provenance and unknowns',()=>{
 const sample=`const profile=(name,a,u,values,source,extra,note)=>({name,a,u,values,source,extra,note});
 const LABELLED={
 'supplement-bcaa-alphaminos':profile('BCAA',13,'g',{kcal:35},'Etikett',{},''),
 };
 function nutritionParts(foodId,amount,food){
 const source=food||{id:foodId,defaultAmount:''};
 const piece=(id,qty,unit,part)=>({id,qty,unit,part});
 const amountNumber=x=>Number(String(x).replace(',','.'));
 if(foodId==='matcha'||foodId==='matcha-oat-plain'){return [];}
 return [];
 }
 return {LABELLED,nutritionParts};`;
 const result=change('nutrition-intelligence-v57712.js',sample);
 const {LABELLED,nutritionParts}=new Function(result)();
 assert.equal(LABELLED['koro-pistachio-puree'].values.kcal,658);
 assert.equal(LABELLED['koro-black-tahini'].values.kcal,616);
 assert.match(LABELLED['lyttos-greek-natur'].source,/Vorläufig/);
 const recipe=nutritionParts('lyttos-tahini-breakfast','150 g Joghurt + 12 g Honig + 9 g Tahini');
 assert.deepEqual(recipe.map(x=>[x.id,x.qty]),[['lyttos-greek-natur',150],['honey',12],['koro-black-tahini',9]]);
});

test('release number follows main and lockscreen after the .28 transform',()=>{
 const main=change('main.js',"const COMPASS_CLIENT_VERSION='0.5.77.59.28';\nconst footer=`Build 0.5.77.59.28`; ");
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.29'/);
 assert.match(main,/Build 0\.5\.77\.59\.29/);
 const locked=change('ars-vivendi-lock-v5775922.js',`const label='Build 0.5.77.59.28';`);
 assert.match(locked,/Build 0\.5\.77\.59\.29/);
});

test('guarded integration fails instead of silently shipping partial food data',()=>{
 assert.throws(()=>change('nutrition-intelligence-v57712.js','const LABELLED={};'),/anchor/);
});
