import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,copyFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {smartNutritionGroups,smartNutritionFoods,nutritionDaypart,SMOOTHIE_INGREDIENTS,smoothieRecipe,smoothieParts,readSmoothieForm,smoothieEditFields} from '../client/src/nutrition-smart-smoothie-v57736.js';
import {nutrition736Bridge} from '../client/nutrition736-bridge.js';
const bridge=nutrition736Bridge();
const apply=(source,path)=>bridge.transform(source,'/temp/client/src/'+path)?.code;
const demoFoods=[{id:'matcha',group:'Frühstück'},{id:'mensa-study-veggie',group:'Mahlzeiten'},{id:'green-tea-chinese',group:'Getränke'},{id:'coffee',group:'Getränke'},{id:'smoothie-personal',group:'Getränke'},{id:'peanuts',group:'Snacks'},{id:'butter',group:'Zutaten'}];

test('time-of-day adapts food categories without removing anything',()=>{
 for(const h of [8,12,17,22])assert.equal(smartNutritionGroups(demoFoods,h).length,5);
 assert.equal(smartNutritionGroups(demoFoods,8)[0],'Frühstück');
 assert.equal(smartNutritionGroups(demoFoods,12)[0],'Mahlzeiten');
 assert.equal(smartNutritionGroups(demoFoods,17)[0],'Getränke');
 assert.equal(smartNutritionGroups(demoFoods,21)[0],'Getränke');
 assert.equal(nutritionDaypart(11),'midday');
 assert.deepEqual(smartNutritionFoods(demoFoods,'Getränke').map(x=>x.id),['green-tea-chinese','smoothie-personal','coffee']);
});
test('smoothie comprises exactly eight separate ingredients with assumed weights',()=>{
 assert.equal(SMOOTHIE_INGREDIENTS.length,8);
 for(const id of ['banana','sesame','pollen','cinnamon','ginger','blueberries','mint','nuts'])assert.ok(SMOOTHIE_INGREDIENTS.find(x=>x.id===id));
 const fresh=smoothieRecipe();assert.equal(fresh.find(x=>x.id==='sesame').grams,15);
 assert.equal(fresh.find(x=>x.id==='blueberries').grams,75);
 assert.ok(fresh.every(x=>x.assumed));
});
test('editing individual grams preserves defaults for absent fields and actual zero if specified',()=>{
 const rec=smoothieRecipe([{id:'sesame',grams:22,assumed:false},{id:'pollen',grams:0,assumed:false}]);
 assert.equal(rec.find(x=>x.id==='sesame').grams,22);
 assert.equal(rec.find(x=>x.id==='pollen').grams,0);
 assert.equal(rec.find(x=>x.id==='banana').grams,120);
 const fd=new FormData();for(const r of rec)fd.set('smoothie-'+r.id,String(r.grams));
 assert.equal(readSmoothieForm(fd).find(x=>x.id==='sesame').grams,22);
 assert.match(smoothieEditFields({recipe:rec}),/Schöpfer/);
 assert.match(smoothieEditFields({recipe:rec}),/name="smoothie-sesame"/);
});
test('per ingredient macro and micronutrients and missing bee-pollen data are not fabricated',()=>{
 const p=smoothieParts();assert.equal(p.length,8);
 assert.ok(p.find(x=>x.name.startsWith('Banane')).values.potassium>300);
 assert.ok(p.find(x=>x.name.includes('Blaubeeren')).values.vitaminC>0);
 assert.deepEqual(p.find(x=>x.name.includes('Blütenpollen')).values,{});
 assert.ok(p.every(x=>x.estimatedKeys?.length===Object.keys(x.values).length));
 const total=p.reduce((n,x)=>n+(x.values.kcal||0),0);
 assert.ok(total>350&&total<550,`unrealistic subtotal ${total}`);
});
test('new source bridge rejects missing anchors rather than silently creating broken versions',()=>{
 assert.throws(()=>apply('invalid','main.js'),/Integrationsanker/);
 assert.throws(()=>apply('invalid','nutrition-intelligence-v57712.js'),/Integrationsanker/);
});
test('personal journal bridge adds tile, snapshot, hour-sensitive sorting and gram editor',()=>{
 const src=[
  "import {mergePeopleDirectory} from './people-sync-v57719.js';",
  "['smoothie','🥤','Smoothie','Getränke','1 Glas (300 ml)',120,280]",
  " ...(id==='matcha'||id==='matcha-oat-plain'?{",
  'const foods=nutritionFoods(state),groups=[...new Set(foods.map(f=>f.group))];',
  'foods.filter(f=>f.group===group).map(f=>',
  'const idx=state.nutritionJournal.entries.findIndex(e=>e.id===item.id);',
  '<label>Notiz (optional)<textarea name="note" rows="2" maxlength="500">${esc(editing.note||\'\')}</textarea></label>'
 ].join('\n');
 const transformed=apply(src,'personal-journal-v5692.js');
 assert.match(transformed,/smoothie-personal/);
 assert.match(transformed,/smartNutritionGroups/);
 assert.match(transformed,/smartNutritionFoods/);
 assert.match(transformed,/item.recipe=smoothieRecipe\(recent\?\.recipe\)/);
 assert.match(transformed,/smoothieEditFields\(editing\)/);
});
test('main bridge preserves already installed .35 but adds local plant-compound tab and per-entry edits',()=>{
 const src=[
  "const COMPASS_CLIENT_VERSION='0.5.77.35';",
  "import './touch-insights-v57735.css';",
  'antiAgingDay734=localDateString(new Date());',
  '🌱 Anti-Aging Eight</button></nav>',
  "nutritionView712==='anti-aging'?antiAgingEightView(state,{day:antiAgingDay734,today:localDate()}):nutritionHistoryView",
  "['journal','nutrients','timing','trends','connections','fats','daily-dozen','anti-aging'].includes(id)",
  'function refreshAntiAging734(){',
  ' // Anti-Aging Eight .34: only replace its own panel, never scroll to top.',
  "item.note=String(fd.get('note')||'').slice(0,500);item.updatedAt=stamp();"
 ].join('\n');
 const transformed=apply(src,'main.js');
 assert.match(transformed,/COMPASS_CLIENT_VERSION='0.5.77.36'/);
 assert.match(transformed,/refreshPhyto736\(\)/);
 assert.match(transformed,/nutritionView712==='phyto'/);
 assert.match(transformed,/readSmoothieForm/);
});
test('nutrition intelligence preserves known nutrient sources, models missing ingredients as missing',()=>{
 const src=[
 "import {nutritionEntries,nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';",
 "const parts=nutritionParts(entry.foodId,entry.amount,food),totals={},knownKeys=new Set();",
 "{kcal:2,fat:0,saturated:0,carbs:0,sugar:0},'BfR / EFSA: generischer Grüntee-Richtwert',{caffeine:{label:'Koffein (Teein)',value:38,unit:'mg',mode:'estimate'}}",
 "LABELLED['green-tea-chinese'].estimatedNutrients=['kcal'];",
 "profile('Filterkaffee · Richtwert 200 ml',200,'ml',{kcal:2},'Schätzung / EFSA',{caffeine:{label:'Koffein',value:90,unit:'mg',mode:'estimate'}}",
 "for(const [id,micros] of Object.entries(GENERIC_MICRONUTRIENTS))"
 ].join('\n');
 const transformed=apply(src,'nutrition-intelligence-v57712.js');
 assert.match(transformed,/smoothieParts\(entry.recipe\)/);
 assert.match(transformed,/manganese:\.46/);
 assert.match(transformed,/catechins/);
 assert.match(transformed,/chlorogenicAcids/);
 assert.match(transformed,/estimatedNutrients=\['kcal','potassium'/);
});
test('Daily Dozen explicitly and transparently derives portions from saved recipe weights',()=>{
 const src=[
  'const localDay=at=>',
  "const records=state?.nutritionJournal?.entries||[], totals={fruit:0,nuts:0,beverages:0};",
  'const sources={fruit:[],nuts:[],beverages:[]};let nutGrams=0;',
  "const foodId=String(entry.foodId||''),type=VERIFIED_DAILY_FOODS[foodId];if(!type)continue;"
 ].join('\n');
 const transformed=apply(src,'daily-dozen-auto-v57734.js');
 assert.match(transformed,/totals.berries\+\+/);
 assert.match(transformed,/smoothieRecipe\(entry.recipe\)/);
 assert.match(transformed,/Menge ggf. geschätzt/);
});
test('polyphenols model separates compounds and does not claim ORAC health scores',async()=>{
 // Real repo has personal-journal module; this isolated test stubs it in temp.
 const root=mkdtempSync(join(tmpdir(),'compass-phyto736-'));
 mkdirSync(join(root,'client','src'),{recursive:true});
 writeFileSync(join(root,'package.json'),'{"type":"module"}');
 writeFileSync(join(root,'client','src','personal-journal-v5692.js'),`export const nutritionEntries=s=>s.nutritionJournal?.entries||[];export const nutritionFoods=s=>s.nutritionJournal?.foods||[];`);
 for(const name of ['nutrition-smart-smoothie-v57736.js','nutrition-phyto-v57736.js'])copyFileSync(new URL('../client/src/'+name,import.meta.url),join(root,'client','src',name));
 const {phytoModel,nutritionPhytoView}=await import(pathToFileURL(join(root,'client','src','nutrition-phyto-v57736.js')).href);
 const at='2026-10-24T12:00:00';
 const state={nutritionJournal:{entries:[
  {id:'a',at,foodId:'green-tea-chinese',amount:'1 Tasse (250 ml)'},
  {id:'b',at,foodId:'coffee',amount:'200 ml'},
  {id:'c',at,foodId:'smoothie-personal',recipe:smoothieRecipe(),amount:'1 Portion'},
  {id:'d',at,foodId:'butter-hofer',amount:'10 g'}],foods:[]}};
 const model=phytoModel(state,{today:'2026-10-24',period:7});
 assert.equal(model.records,4);assert.equal(model.groups.length,3);
 assert.equal(model.groups.find(x=>x.id==='catechins').low,50);
 assert.ok(model.groups.find(x=>x.id==='anthocyanins').high>300);
 assert.equal(model.unsupported.length,1);
 const rendered=nutritionPhytoView(state,{today:'2026-10-24',period:7});
 assert.match(rendered,/Chlorogensäuren/);assert.match(rendered,/Nicht/gi);
 assert.match(rendered,/keine Messung einer antioxidativen Wirkung/);
});
