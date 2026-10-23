import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PRODUCT_PROFILES,nutritionParts,nutritionDay,nutritionIntelligenceView} from '../client/src/nutrition-intelligence-v57712.js';
import {FOOD_PRESETS,addNutrition,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {taskSupportPrompt} from '../client/src/task-gpt-handoff-v57712.js';
const at='2026-10-23T12:00:00+02:00';
const base=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const put=(state,id,amount)=>addNutrition(state,{foodId:id,amount,at});
test('supplier profiles preserve source units and product-specific amounts, including entire dried mango and 30g nuts',()=>{
 const nuts=PRODUCT_PROFILES['mixed-nuts'];assert.equal(nuts.reference.amount,100);assert.equal(nuts.nutrients.kcal,649);
 let s=base();put(s,'mixed-nuts');put(s,'dried-mango');put(s,'pistachio-butter-cups');
 const d=nutritionDay(s,'2026-10-23');assert.equal(d.entries.length,3);
 const n=d.entries.find(x=>x.entry.foodId==='mixed-nuts');assert.equal(n.values.kcal,194.7);assert.equal(n.values.protein,5.1);
 assert.equal(d.entries.find(x=>x.entry.foodId==='dried-mango').values.kcal,596);
 assert.equal(d.entries.find(x=>x.entry.foodId==='pistachio-butter-cups').values.kcal,240);
 assert.equal(d.entries.find(x=>x.entry.foodId==='pistachio-butter-cups').values.sugar,11.7);
});
test('Matcha ingredients use confirmed minimum EGCG and EGC content for 30+, preserve milk and honey',()=>{
 const p=nutritionParts('matcha-oat-plain','1 Becher (500 ml; 75 ml Hafermilch)');
 assert.deepEqual(p.map(x=>x.part),['Haferdrink','Matchapulver']);
 assert.equal(p[0].values.calcium,90);assert.equal(p[0].values.vitaminB12,.29);
 assert.equal(p[1].extra.find(x=>x.key==='EGC').value,30);
 assert.equal(p[1].extra.find(x=>x.key==='EGCG').value,60);
 const honey=nutritionParts('matcha','1 Becher (500 ml; 75 ml Hafermilch)');assert.equal(honey[2].values.kcal,21);
 const milk=FOOD_PRESETS.find(x=>x.id==='matcha-oat-plain');assert.deepEqual(nutritionKcalEstimate(milk,milk.defaultAmount),{low:41,high:45,kind:'Etikett + Schätzung'});
});
test('one supplement capsule is one-quarter of four capsule label dose and absent D3 amount stays unknown',()=>{
 const s=base();put(s,'supplement-fuerstenmed','1 Kapsel');
 const d=nutritionDay(s,'2026-10-23'),row=d.entries[0];assert.equal(row.values.vitaminC,32.5);
 assert.equal(row.values.zinc,2.5);assert.equal(row.values.selenium,12.5);
 assert.equal(row.parts[0].extra.find(x=>x.key==='tribulus').value,210);
 assert.equal(d.coverage.vitaminD.known,0);assert.equal(d.coverage.vitaminD.unknown,1);
 assert.equal(d.coverage.kcal.known,0);assert.equal(d.coverage.kcal.unknown,1);
 assert.equal(nutritionParts('supplement-fuerstenmed','4 Kapseln')[0].values.vitaminC,130);
});
test('unknown nutrients are never treated as consumed zero and data coverage is explicit',()=>{
 const s=base();put(s,'rice-pudding');put(s,'other-food');
 const d=nutritionDay(s,'2026-10-23');assert.equal(d.entries.length,2);
 assert.equal(d.coverage.vitaminD.known,0);assert.equal(d.coverage.vitaminD.unknown,2);
 assert.equal(d.coverage.kcal.known,1);assert.equal(d.coverage.kcal.unknown,1);
 const html=nutritionIntelligenceView(s,{day:'2026-10-23',detail:'supplement-fuerstenmed'});
 assert.match(html,/Makro & Mikro/);assert.match(html,/Nicht bestimmt/);assert.match(html,/davon Saponine/);
 assert.match(html,/Menge unbekannt|Etikett/);
});
test('task handoff is an opt-in prompt with one question, draft instructions and no invisible sending',()=>{
 const text=taskSupportPrompt({title:'Fully Rose Co. wegen Geld kontaktieren',note:'Rechnung prüfen'},'Privat');
 assert.match(text,/Fully Rose Co./);assert.match(text,/Rechnung prüfen/);assert.match(text,/E-Mail/);
 assert.match(text,/EINE kurze/);assert.match(text,/per Sprache/);assert.match(text,/erfinde keine Fakten/);
 assert.doesNotMatch(text,/\bSende die E-Mail jetzt\b/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/task-gpt712-copy/);assert.match(main,/taskSupportPrompt\(t,p\?\.title/);
 assert.match(main,/ni712-view/);assert.match(main,/nutritionIntelligenceView/);
});

test('legacy 50g nut logs are preserved while a new handfull means 30g and custom handfull input scales equally',()=>{
 const f=FOOD_PRESETS.find(f=>f.id==='mixed-nuts');
 assert.equal(nutritionParts('mixed-nuts','1 Portion (50 g)',f)[0].values.kcal,324.5);
 assert.equal(nutritionParts('mixed-nuts','1 Handvoll',f)[0].values.kcal,194.7);
 assert.deepEqual(nutritionKcalEstimate(f,'1 Handvoll'),{low:193,high:197,kind:'Schätzung'});
});
test('two slices of documented bread and butter recipe produce twice the nutrition of one slice',()=>{
 const one=nutritionParts('dark-bread-butter','1 Scheibe'),two=nutritionParts('dark-bread-butter','2 Scheiben');
 assert.equal(one.length,2);assert.equal(two.length,2);
 assert.equal(two[0].values.kcal,one[0].values.kcal*2);
 assert.equal(two[1].values.kcal,one[1].values.kcal*2);
});
test('composite recipe nutrition is marked partial when not all component ingredients have nutrient labels',()=>{
 const s=base();put(s,'matcha-oat-plain');
 const d=nutritionDay(s,'2026-10-23');
 assert.equal(d.coverage.calcium.known,1);assert.equal(d.coverage.calcium.partial,1);
 assert.equal(d.totals.calcium,90);
 assert.match(nutritionIntelligenceView(s,{day:'2026-10-23'}),/teilweise unbekannt/);
});
