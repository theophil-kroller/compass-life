import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=readFileSync(root+'/client/src/nutrition-timing-v57725.js','utf8');
const ctx=vm.createContext({
  nutritionFoods:state=>state.foods,
  nutrientEntry:(food,entry)=>({values:{kcal:entry.kcal??undefined},knownKeys:new Set(Number.isFinite(entry.kcal)?['kcal']:[])}),
  nutritionKcalEstimate:(food,amount)=>food?.kcalLow!=null?{low:food.kcalLow,high:food.kcalHigh}:null
});
const js=source.replace(/^import[^\n]*\n/gm,'').replace(/\bexport (function|const)\b/g,'$1');
vm.runInContext(js+'\nglobalThis.api={nutritionTimingView,nutritionTimingIndex,nutritionTimingSeries,nutritionEnergyTier,nutritionConsumptionKind};',ctx,{filename:'nutrition-timing-v57725.js'});
const {nutritionTimingView,nutritionTimingIndex,nutritionTimingSeries,nutritionEnergyTier,nutritionConsumptionKind}=ctx.api;
const now=new Date('2026-10-25T12:00:00Z');
const foods=[
  {id:'coffee',group:'Getränke',title:'Kaffee',emoji:'☕',kcalLow:12,kcalHigh:12},
  {id:'latella',group:'Getränke',title:'Lattella',emoji:'🥛',kcalLow:275,kcalHigh:275},
  {id:'meal',group:'Mittagessen',title:'Vegetarischer Study Teller',emoji:'🍲',kcalLow:650,kcalHigh:650},
  {id:'chips',group:'Snacks',title:'Pringles Packung',emoji:'🍟',kcalLow:980,kcalHigh:980},
  {id:'unknown',group:'Eigene',title:'Hausgemachter Snack',emoji:'🥐'},
];
const date='2026-10-24';
const entry=(id,hour,foodId,minute=0,kcal=null)=>({id,foodId,at:`${date}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00+02:00`,amount:'1',...(kcal===null?{}:{kcal})});
const state={nutritionJournal:{entries:[entry('coffee',8,'coffee'),entry('latella',9,'latella'),entry('meal',12,'meal'),entry('chips',18,'chips'),entry('unknown',16,'unknown')]},foods};
const render=(mode='week')=>nutritionTimingView(state,{mode,anchor:date,now});

test('uses actual food groups, pictograms, and name fallback for kind',()=>{
 assert.equal(nutritionConsumptionKind({group:'Getränke',title:'Lattella',emoji:'🥛'}),'drink');
 assert.equal(nutritionConsumptionKind({group:'Snacks',title:'Pringles',emoji:'🍟'}),'food');
 assert.equal(nutritionConsumptionKind({group:'Eigene',title:'Kurkuma-Latte',emoji:'🟡'}),'drink');
 assert.equal(nutritionConsumptionKind({group:'Eigene',title:'Kaffee-Kuchen',emoji:'🍰'}),'food');
 assert.equal(nutritionConsumptionKind(null),'food');
});
test('energy tier cutoffs are bounded and unknown is not low-calorie',()=>{
 for(const [value,expect] of [[0,1],[120,1],[121,2],[350,2],[351,3],[700,3],[701,4],[5000,4],[NaN,null],[-5,null],[Infinity,null],[null,null]]){
  assert.equal(nutritionEnergyTier(value),expect,String(value));
 }
});
test('SVG renders accessible Tassen/Teller, four tiers, unknown dashed, times unchanged',()=>{
 const html=render();
 assert.match(html,/Essenszeiten · Tasse &amp; Teller/);
 assert.match(html,/class="ni725-dot ni725-energy-symbol/);
 assert.equal((html.match(/data-action="ni725-event"/g)||[]).length,5);
 assert.equal((html.match(/data-kind="drink"/g)||[]).length,2);
 assert.equal((html.match(/data-kind="food"/g)||[]).length,3);
 for(const tier of [1,2,3,4])assert.match(html,new RegExp(`data-tier="${tier}"`));
 assert.match(html,/data-tier="unknown"/);
 assert.match(html,/ni725-unknown-kcal/);
 assert.match(html,/stroke-dasharray="2.5 2"/);
 assert.match(html,new RegExp('data-hour=\"'+new Date(state.nutritionJournal.entries[0].at).getHours().toFixed(4)+'\"'));
 assert.match(html,new RegExp('data-hour=\"'+new Date(state.nutritionJournal.entries[2].at).getHours().toFixed(4)+'\"'));
 assert.match(html,/tabindex="0" role="button" aria-label="/);
 assert.match(html,/ni725-symbol-hit/);
 assert.match(html,/Größe nach kcal/);
 assert.match(html,/Getränk/);
 assert.match(html,/Nahrung/);
});
test('selection and existing edit handler remain intact; no stored state changes',()=>{
 const original=JSON.stringify(state);
 const html=nutritionTimingView(state,{mode:'week',anchor:date,selectedId:'latella',now});
 assert.match(html,/data-id="latella"/);
 assert.match(html,/ni725-dot ni725-energy-symbol [^"\n]*is-selected/);
 assert.match(html,/data-action="ni725-edit" data-id="latella"/);
 assert.equal(JSON.stringify(state),original);
});
test('year/month views stay available; classified data recalculates after product updates',()=>{
 const before=nutritionTimingIndex(state).rows.get('latella');assert.equal(before.consumptionKind,'drink');
 foods[1].group='Snacks';foods[1].emoji='🍲';foods[1].title='Reis';
 const after=nutritionTimingIndex(state).rows.get('latella');assert.equal(after.consumptionKind,'food');
 for(const mode of ['month','all'])assert.match(render(mode),/data-tier="2"/);
 foods[1].group='Getränke';foods[1].emoji='🥛';foods[1].title='Lattella';
});
test('nutrition timing calculations and fasting source data remain unchanged',()=>{
 const m=nutritionTimingSeries(state,{mode:'week',anchor:date,now});
 assert.equal(m.events.length,5);
 assert.equal(m.stats.unknownKcal,1);
 assert.ok(m.events.every(e=>Number.isFinite(e.ms)));
 assert.ok(m.events.every(e=>['food','drink'].includes(e.consumptionKind)));
});
test('does not alter Vite plugin chain or Vault',()=>{
 assert.doesNotMatch(source,/compass7593UxBridge|localStorage|vault\.unlock|createOnDemandRouteLoader/);
 assert.match(source,/import '\.\/nutrition-cup-plate-v577593\.css'/);
 const css=readFileSync(root+'/client/src/nutrition-cup-plate-v577593.css','utf8');
 assert.match(css,/ni725-energy-symbol/);
 assert.match(css,/focus-visible/);
});

test('coincident events keep the exact same time/X, with different vertical offsets',()=>{
 const duplicate=entry('second-coffee',8,'coffee');
 state.nutritionJournal.entries.push(duplicate);
 try{
  const html=render('week');
  const get=(id)=>{const re=new RegExp('<g class="ni725-dot[^>]*data-id="'+id+'"[^>]*data-hour="([0-9.]+)" transform="translate\\(([0-9.]+) ([0-9.]+)\\)"');const m=html.match(re);assert.ok(m,'missing '+id);return m.slice(1).map(Number);};
  const a=get('coffee'),b=get('second-coffee');
  assert.equal(a[0],b[0]);assert.equal(a[1],b[1]);assert.notEqual(a[2],b[2]);
  assert.equal((html.match(/data-action="ni725-event"/g)||[]).length,6);
 }finally{state.nutritionJournal.entries.pop();}
});
