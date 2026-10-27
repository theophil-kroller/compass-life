import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {smoothieRecipe} from '../client/src/nutrition-smart-smoothie-v57736.js';
import {compass59404NutritionBridge} from '../client/compass59404-nutrition-bridge.js';
const D='2026-10-27';
const row=(foodId,recipe,at=D+'T08:18:00')=>({id:'smoothie1',foodId,recipe,amount:'1 Portion',at});
const state=(entries)=>({nutritionJournal:{entries,customFoods:[]}});
const category=(model,key)=>model.rows.find(x=>x.id===key);
test('Personal smoothie adds berries, banana, nuts plus black sesame and spices in one background projection',()=>{
 const s=state([row('smoothie-personal',smoothieRecipe())]);
 const ledger=dailyDozenIngredientEvidence404(s,D);
 assert.equal(ledger.totals.berries,1);
 assert.equal(ledger.totals.fruit,1);
 assert.equal(ledger.nutGrams,45); // 30 g nuts + 15 g sesame
 assert.equal(ledger.totals.nuts,1.5);
 assert.equal(ledger.totals.spices,1);
 assert.equal(ledger.totals.beverages,0); // food ingredients are not counted as water
 const chart=dailyDozen5930(s,{day:D});
 assert.equal(category(chart,'berries').observed,1);
 assert.equal(category(chart,'fruits').observed,1);
 assert.equal(category(chart,'nuts').observed,1);
 assert.equal(category(chart,'spices').observed,1);
 assert.equal(chart.entries,1);
 assert.equal(chart.mapped,1);
});
test('Previously saved recipe does not invent turmeric; existing entries recalculate automatically',()=>{
 const old=smoothieRecipe().filter(x=>x.id!=='turmeric');
 const historical=smoothieRecipe(old);
 assert.equal(historical.find(x=>x.id==='turmeric').grams,0);
 assert.equal(smoothieRecipe().find(x=>x.id==='turmeric').grams,.4);
 const s=state([row('smoothie-personal',old)]);
 assert.equal(category(dailyDozen5930(s,{day:D}),'berries').observed,1);
 assert.ok(dailyDozenIngredientEvidence404(s,D).notes.spices.length>0);
});
test('Editing, deleted entries, zeroed ingredients and date changes recompute rather than persist phantom checkboxes',()=>{
 const saved=smoothieRecipe().map(x=>({...x,grams:['blueberries','nuts','sesame'].includes(x.id)?0:x.grams}));
 const s=state([row('smoothie-personal',saved)]);
 assert.equal(category(dailyDozen5930(s,{day:D}),'berries').observed,0);
 assert.equal(category(dailyDozen5930(s,{day:D}),'nuts').observed,0);
 s.nutritionJournal.entries[0].recipe=smoothieRecipe();
 assert.equal(category(dailyDozen5930(s,{day:D}),'berries').observed,1);
 s.nutritionJournal.entries[0].deleted=true;
 assert.equal(dailyDozen5930(s,{day:D}).observed,0);
 s.nutritionJournal.entries[0].deleted=false;
 s.nutritionJournal.entries[0].at='2026-10-26T08:18:00';
 assert.equal(dailyDozen5930(s,{day:D}).observed,0);
});
test('Personally saved salad ingredients contribute to same ledger, no egg counted as fruit or greens',()=>{
 const s=state([row('salad-personal',null),row('bean-salad-personal',null,D+'T12:05:00')]);
 const m=dailyDozen5930(s,{day:D});
 assert.ok(category(m,'greens').observed>0);
 assert.ok(category(m,'legumes').observed>0);
 assert.ok(category(m,'nuts').observed>0);
});
test('Late Vite plugin delegates Daily Dozen auto evidence and Anti-Aging to the shared ingredient logic',async()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compassConfig\.plugins\.push\(compass59404NutritionBridge\(\)\)/);
 const imports=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...cfg.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 let code=readFileSync(new URL('../client/src/daily-dozen-auto-v57734.js',import.meta.url),'utf8');
 for(const name of names){const mod=await import(new URL('../client/'+imports.get(name),import.meta.url));const result=mod[name]().transform(code,'/repo/client/src/daily-dozen-auto-v57734.js');if(result?.code)code=result.code;}
 assert.match(code,/return dailyDozenIngredientEvidence404\(state,day\)/);
 assert.match(code,/import \{dailyDozenIngredientEvidence404\}/);
 const plugin=compass59404NutritionBridge();
 assert.match(plugin.transform("Build 0.5.77.59.40.3\nconst COMPASS_CLIENT_VERSION='0.5.77.59.40.3';",'/repo/client/src/main.js').code,/59\.40\.4/);
});
