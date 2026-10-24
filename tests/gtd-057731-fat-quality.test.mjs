import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {nutrition731Bridge} from '../client/nutrition731-bridge.js';
const filepath=new URL('../client/src/nutrition-fat-quality-v57731.js',import.meta.url);
const text=readFileSync(filepath,'utf8');
const foodDefs=[{id:'peanuts',title:'Hofer gesalzene Erdnüsse',defaultAmount:'1 Handvoll (20 g; abgewogen)'},{id:'mensa-study-veggie',title:'Vegetarischer Study-Teller'},{id:'monin-caramel',title:'Monin Salted Caramel'}];
function load(entries=[],foods=foodDefs){
 const source=text.replace(/^import .*;\n/gm,'').replace(/^export /gm,'').concat('\n({fatEntry,fatQualityModel,nutritionFatView,FAT_REFERENCES,FAT_FIELDS});');
 const nutritionParts=(id,amount)=>{
   if(id==='peanuts'){const m=String(amount).match(/(\d+)\s*g/i);const g=m?Number(m[1]):20;return [{unit:'g',amount:g,part:'Produkt',values:{fat:50*g/100,saturated:7*g/100},estimatedKeys:[],source:'Schätzung'}]};
   if(id==='monin-caramel')return [{unit:'ml',amount:10,part:'Produkt',values:{fat:0,saturated:0},source:'Etikett',estimatedKeys:[]}];
   return [];
 };
 return runInNewContext(source,{nutritionEntries:()=>entries,nutritionFoods:()=>foods,nutritionParts,Date,Intl,Number,Math,String,Object,Array,RegExp,Set,Map});
}
const sample=(id,at,amount)=>({foodId:id,at,amount});
test('20 g salted peanuts: fat split, ALA separate from PUFA, zero plant cholesterol',()=>{
 const m=load();const x=m.fatEntry(foodDefs[0],sample('peanuts','2026-10-24T10:40:00+02:00','20 g'));
 assert.equal(x.values.fat,10);assert.equal(x.values.saturated,1.4);
 assert.equal(x.values.mono,5.2362);assert.equal(x.values.poly,1.9546);
 assert.equal(x.values.ala,.005);assert.equal(x.values.omega6,1.9388);
 assert.equal(x.values.cholesterol,0);
 assert.equal(x.coverage.mono.estimate,1);
 assert.ok(x.values.poly>x.values.omega6);
});
test('fried egg USDA generic estimate includes cholesterol, DHA and real recipe caveat',()=>{
 const x=load().fatEntry({id:'fried-egg',defaultAmount:'1 Stück'},sample('fried-egg','2026-10-24T12:00:00+02:00','1 Stück'));
 assert.ok(x.values.cholesterol>180&&x.values.cholesterol<190);
 assert.ok(x.values.dha>28&&x.values.dha<30);
 assert.equal(x.coverage.cholesterol.estimate,1);
});
test('unknown recipe remains unknown rather than false zero',()=>{
 const x=load().fatEntry(foodDefs[1],sample('mensa-study-veggie','2026-10-24T15:00:00+02:00','1 Teller'));
 for(const k of ['fat','saturated','mono','poly','ala','omega6','cholesterol']){assert.equal(x.values[k],null);assert.equal(x.coverage[k].status,'missing');}
});
test('0 g fat product retains genuine zero, never confuses with missing',()=>{
 const x=load().fatEntry(foodDefs[2],sample('monin-caramel','2026-10-24T08:00:00+02:00','10 ml'));
 assert.equal(x.values.fat,0);assert.equal(x.values.mono,0);assert.equal(x.values.ala,0);assert.equal(x.values.cholesterol,0);
 assert.equal(x.coverage.ala.status,'rounded');
});
test('local journal days, missing-coverage status and point graph',()=>{
 const entries=[sample('peanuts','2026-10-23T12:00:00+02:00','20 g'),sample('mensa-study-veggie','2026-10-23T15:00:00+02:00','1 Teller'),sample('peanuts','2026-10-24T11:00:00+02:00','40 g')];
 const mod=load(entries);const data=mod.fatQualityModel({},{days:30,today:'2026-10-24'});
 assert.equal(data.rows.length,2);assert.equal(data.coverage.ala.known,2);assert.equal(data.coverage.ala.missing,1);
 assert.equal(data.rows[0].coverage.ala.missing,1);
 assert.equal(data.rows[1].values.cholesterol,0);
 const html=mod.nutritionFatView({},{days:'30',metric:'ala',today:'2026-10-24'});
 assert.match(html,/Punktdiagramm/);assert.match(html,/ni731-plot/);assert.match(html,/unvollständig/);assert.match(html,/Omega‑3 ALA/);
});
test('all presets, including user custom foods, appear in catalog while no unknown gets fabricated',()=>{
 const foods=[...foodDefs,{id:'new-user-food',title:'Kunstwerk <Test>'}];const m=load([],foods);
 const output=m.nutritionFatView({});assert.match(output,/Kunstwerk &lt;Test&gt;/);assert.ok(!output.includes('Kunstwerk <Test>'));
 assert.equal(m.fatQualityModel({}).catalog.length,foods.length);
});
test('strict guarded bridge from .30 to .31',()=>{
 const bridge=nutrition731Bridge();const path='/repo/client/src/main.js';
 const base=`const COMPASS_CLIENT_VERSION='0.5.77.30';
import './nutrition-connections-v57727.css';
let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;
🔗 Zusammenhänge</button></nav>
nutritionView712==='connections'?nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays}):nutritionHistoryView
['journal','nutrients','timing','trends','connections'].includes(id)
 // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.
function render(){`;
 const result=bridge.transform(base,path);
 assert.match(result.code,/0\.5\.77\.31/);
 assert.match(result.code,/data-id="fats"/);
 assert.match(result.code,/nutritionFatView/);
 assert.match(result.code,/ni731-metric/);
 assert.throws(()=>bridge.transform(base.replace('0.5.77.30','0.5.77.29'),path),/Integrationsanker/);
 assert.equal(bridge.transform('no code','/repo/client/src/insights-fitness.js'),null);
});
test('peanut measured handful is only food with 20g default; mixed nuts untouched',()=>{
 const bridge=nutrition731Bridge();
 const input="['peanuts','🥜','Hofer gesalzene Erdnüsse','Snacks','1 Handvoll (30 g; geschätzt)',175,190]\nitems.push({value:(m[1]?parseNumber(m[1]):1)*30,unit:'g'});";
 const result=bridge.transform(input,'/repo/client/src/personal-journal-v5692.js').code;
 assert.match(result,/1 Handvoll \(20 g; abgewogen\)/);assert.match(result,/food\.id==='peanuts'\?20:30/);
});
