import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {vtaperNutritionModel144,vtaperNutritionHtml144,vtaperProteinOptions145} from '../client/src/vtaper-nutrition-coach-v059144.js';
import {nutritionFoods} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';

const day='2026-11-12';
const shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
function state(protein=75){
 const customFoods=[{id:'my-food',title:'Gemischte vegetarische Tagesmahlzeiten',defaultAmount:'1 Portion',nutrientBasis:'perPortion',nutrients:{protein,kcal:1850},source:'Eigene Portionsschätzung'}];
 const entries=Array.from({length:14},(_,i)=>({id:'entry-'+i,foodId:'my-food',amount:'1 Portion',at:shift(day,i-13)+'T12:00:00Z'}));
 const fitdays=Array.from({length:17},(_,i)=>({day:shift(day,i-16),at:shift(day,i-16)+'T07:00:00Z',weightKg:86.5-i*.02}));
 return {nutritionJournal:{entries,customFoods,energyGoal:{enabled:true,birthYear:1983,birthMonth:5,heightCm:185,formulaSex:'male',method:'mifflin',activity:'moderate',deficit:300}},healthImports:{fitdays}};
}

test('suggestions use real names and portion-based macros from existing Compass menu',()=>{
 const st=state(),prev=structuredClone(st),foods=new Map(nutritionFoods(st).map(f=>[f.id,f]));
 const suggestions=vtaperProteinOptions145(st,{needed:65,budget:450});
 assert.ok(suggestions.length>=6);
 assert.deepEqual(st,prev,'ranking must not change vault data');
 const ids=new Set();
 for(const row of suggestions){
  assert.ok(foods.has(row.id),row.id);
  assert.ok(!ids.has(row.id),'no duplicate products');ids.add(row.id);
  assert.equal(row.title,foods.get(row.id).title);
  assert.ok(row.protein>=12&&row.kcal<=450);
  const original=nutrientEntry(foods.get(row.id),{foodId:row.id,amount:row.amount}).values;
  assert.ok(Math.abs(row.protein-original.protein)<.12,row.id);
  assert.ok(Math.abs(row.kcal-original.kcal)<1,row.id);
 }
});
test('offers dairy, a real vegan shake and a plant-based Alpro snack without inventing products',()=>{
 const options=vtaperProteinOptions145(state());
 const first=options.slice(0,4);
 assert.ok(first.some(x=>x.kind==='Milchprodukt'));
 assert.ok(first.some(x=>x.kind.startsWith('Shake')));
 assert.ok(first.some(x=>x.kind.startsWith('Snack')));
 assert.ok(options.find(x=>x.id==='bio-magertopfen-250g')?.protein>=30);
 assert.ok(options.find(x=>x.id==='ironmaxx-vegan-protein-shake-mixed-berries')?.protein>=22);
 assert.ok(options.find(x=>x.id==='alpro-plant-protein-chocolate-pudding-200g')?.protein>=20);
});
test('all selected 7/14/42 day periods display product cards with explicit portions and no automatic nutrition logging',()=>{
 const st=state(),snapshot=structuredClone(st),m=vtaperNutritionModel144(st,{today:day});
 for(const days of [7,14,42]){
  assert.ok(m.windows[days].foodOptions.length>=4);
  assert.ok(m.windows[days].foodOptions.some(x=>x.title.includes('Skyr')));
 }
 const html=vtaperNutritionHtml144(m);
 assert.match(html,/Konkrete Proteinoptionen aus deinem Menü/);
 assert.match(html,/SPAR free from/);
 assert.match(html,/IronMaxx 100% Vegan Protein Zero/);
 assert.match(html,/Alpro Plant Protein Pudding/);
 assert.match(html,/250 g/);
 assert.match(html,/30 g Pulver/);
 assert.match(html,/keine automatische Buchung/);
 assert.equal((html.match(/data-vt145-for-period=/g)||[]).length,3);
 assert.equal(st.nutritionJournal.entries.length,14);
 assert.deepEqual(st,snapshot);
});
test('high protein average still allows browsing food choices without urging additional intake',()=>{
 const m=vtaperNutritionModel144(state(165),{today:day});
 assert.equal(m.windows[7].proteinGap,0);
 assert.equal(m.food,null);
 assert.match(vtaperNutritionHtml144(m),/keine Aufforderung mehr zu essen/);
});
test('real menu suggestion does not claim a daily remaining-calorie amount from a historical average',()=>{
 const m=vtaperNutritionModel144(state(75),{today:day});
 assert.ok(m.windows[7].avgCalorieRoom!==null);
 const html=vtaperNutritionHtml144(m);
 assert.match(html,/kein Tages-Kalorienrest/);
 assert.doesNotMatch(html,/Du hast heute noch \d+ kcal/);
});
test('version, styling, and no-transaction rules are bundled for the new release',()=>{
 const css=readFileSync(new URL('../client/src/vtaper-nutrition-coach-v059144.css',import.meta.url),'utf8');
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(css,/data-vt145-for-period="14"/);
 assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0.5.91.45'/);
 assert.ok(!readFileSync(new URL('../client/src/vtaper-nutrition-coach-v059144.js',import.meta.url),'utf8').includes('addNutrition('));
});
