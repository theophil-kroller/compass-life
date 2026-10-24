import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,copyFileSync,mkdtempSync,mkdirSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {dailyDozenEvidence} from '../client/src/daily-dozen-auto-v57734.js';
import {DAILY_DOZEN,dailyDozenSummary,dailyDozenView,setDailyDozen,mergeDailyDozen} from '../client/src/daily-dozen-v57733.js';
import {EXERCISES,strengthSetRow} from '../client/src/strength-editor-v57732.js';
import {nutritionLongevity734Bridge} from '../client/nutrition-longevity734-bridge.js';
const D='2026-10-24';
const st=(rows)=>({nutritionJournal:{entries:rows.map((x,i)=>({id:'e'+i,at:D+'T10:00:00',...x})),customFoods:[]}});
test('12 correct Daily Dozen categories with 24 ticks remain backward compatible',()=>{
 assert.equal(DAILY_DOZEN.length,12);assert.equal(DAILY_DOZEN.reduce((v,x)=>v+x.target,0),24);
 assert.equal(dailyDozenSummary({},D).completed,0);
});
test('unsweetened Chinese green tea is automatically one BEVERAGE, not fruit/greens',()=>{
 const state=st([{foodId:'green-tea-chinese',amount:'1 Tasse (250 ml)'}]);
 assert.equal(dailyDozenEvidence(state,D).totals.beverages,1);
 const row=dailyDozenSummary(state,D).rows.find(x=>x.id==='beverages');
 assert.equal(row.count,1);assert.equal(row.source,'auto');
 assert.match(dailyDozenView(state,{day:D,today:D}),/Aus Tagebuch erkannt/);
});
test('20g peanuts contribute anti-ageing nut intake but not a complete Daily Dozen nuts serving',()=>{
 const state=st([{foodId:'peanuts',amount:'1 Handvoll (20 g)'}]);
 const result=dailyDozenSummary(state,D);
 assert.equal(result.evidence.nutGrams,20);
 assert.equal(result.rows.find(x=>x.id==='nuts').count,0);
 assert.match(dailyDozenView(state,{day:D,today:D}),/20 g von ca. 30 g/);
});
test('30g peanuts + 10g mixed nuts add to a documented nuts serving',()=>{
 const model=dailyDozenSummary(st([{foodId:'peanuts',amount:'30 g'},{foodId:'mixed-nuts',amount:'10 g'}]),D);
 assert.equal(model.rows.find(x=>x.id==='nuts').count,1);
});
test('food eaten on another date and deleted food are not inferred',()=>{
 const s={nutritionJournal:{entries:[{at:'2026-10-23T13:00:00',foodId:'apple'},{at:D+'T13:00:00',foodId:'apple',deleted:true}]}};
 assert.equal(dailyDozenSummary(s,D).rows.find(x=>x.id==='fruit').count,0);
});
test('mixed or imprecise meals are never auto-counted',()=>{
 const s=st([{foodId:'mensa-study-veggie'},{foodId:'buffet'},{foodId:'other-food'}]);
 assert.equal(dailyDozenSummary(s,D).completed,0);
});
test('manual explicit cancellation overrides automatic tick; next increment restores it',()=>{
 const s=st([{foodId:'green-tea-chinese',amount:'250 ml'}]);
 setDailyDozen(s,D,'beverages',-1);
 assert.equal(dailyDozenSummary(s,D).rows.find(x=>x.id==='beverages').count,0);
 setDailyDozen(s,D,'beverages',1);
 assert.equal(dailyDozenSummary(s,D).rows.find(x=>x.id==='beverages').count,1);
});
test('manual Daily Dozen changes are reconciled by updatedAt across devices',()=>{
 const a={[D]:{beverages:{count:1,updatedAt:'2026-10-24T08:00:00Z'}}};
 const b={[D]:{beverages:{count:0,updatedAt:'2026-10-24T09:00:00Z'}}};
 assert.equal(mergeDailyDozen(a,b)[D].beverages.count,0);
});
test('Hip Thrusts and custom curls are in the easy-access favourites at top of EACH set',()=>{
 for(const id of ['hip-thrust','curl-to-press','hammer-to-press','biceps-curl','military-press'])assert.ok(EXERCISES.some(x=>x.id===id));
 const html=strengthSetRow(2,{exerciseId:'hip-thrust',reps:10,weightKg:30});
 assert.match(html,/⭐ Deine häufigen Übungen/);assert.match(html,/Hip Thrust/);
 assert.match(html,/name="reps-2"/);assert.match(html,/value="30"/);
});
test('mobile editor has stacked exercise selector and two numeric inputs; accessible 48px controls',()=>{
 const css=readFileSync(new URL('../client/src/strength-editor-v57732.css',import.meta.url),'utf8');
 assert.match(css,/label:first-of-type\{grid-column:1\/-1\}/);
 assert.match(css,/min-height:48px/);assert.match(css,/position:sticky/);
});
test('bridge protects mismatched version/anchors',()=>{
 const b=nutritionLongevity734Bridge();assert.throws(()=>b.transform('invalid','/repo/client/src/main.js'),/Integrationsanker/);
});
test('bridge correctly adds subtab, update actions, cacao test-free new version',()=>{
 const raw=["const COMPASS_CLIENT_VERSION='0.5.77.33';","import './nutrition-guidance-v57733.css';","dailyDozenDay733=localDateString(new Date());",'🌿 Daily Dozen</button></nav>',"nutritionView712==='daily-dozen'?dailyDozenView(state,{day:dailyDozenDay733,today:localDate()}):nutritionHistoryView","['journal','nutrients','timing','trends','connections','fats','daily-dozen'].includes(id)",'function refreshDailyDozen733(){',' // Daily Dozen .33: save individual counters, no page rebuild / scroll jump.'].join('\n');
 const out=nutritionLongevity734Bridge().transform(raw,'/repo/client/src/main.js').code;
 for(const t of ['0.5.77.34','antiAgingEightView','anti-aging','aa734-day','refreshAntiAging734'])assert.ok(out.includes(t),t);
});
test('green tea preset and caffeine profile inserted with provenance and 38 mg/250 ml estimate',()=>{
 const b=nutritionLongevity734Bridge();
 const preset=b.transform("['tea-unsweetened','🍵','Tee ungesüßt','Getränke','1 Tasse (250 ml)',0,5]",'/repo/client/src/personal-journal-v5692.js').code;
 assert.match(preset,/green-tea-chinese/);assert.match(preset,/0,3/);
 const ingredients="const LABELLED={\n'milk-my-vay':profile\nfor(const [id,micros] of Object.entries(GENERIC_MICRONUTRIENTS))";
 const profile=b.transform(ingredients,'/repo/client/src/nutrition-intelligence-v57712.js').code;
 assert.match(profile,/Koffein \(Teein\)/);assert.match(profile,/value:38/);assert.match(profile,/mode:'estimate'/);
});
test('Anti-Aging Eight runtime works with stubbed nutrition modules, does not infer fasting from one entry',async()=>{
 const temp=mkdtempSync(join(tmpdir(),'c734-'));writeFileSync(join(temp,'package.json'),' {"type":"module"} ');
 const source=new URL('../client/src/',import.meta.url).pathname;
 for(const name of ['daily-dozen-auto-v57734.js','daily-dozen-v57733.js','anti-aging-eight-v57734.js'])copyFileSync(join(source,name),join(temp,name));
 writeFileSync(join(temp,'personal-journal-v5692.js'),"export const nutritionEntries=s=>s?.nutritionJournal?.entries||[];export const nutritionFoods=s=>s?.nutritionJournal?.customFoods||[];");
 writeFileSync(join(temp,'nutrition-intelligence-v57712.js'),"export const nutrientEntry=(food,entry)=>({knownKeys:new Set(),values:{}});");
 const m=await import(pathToFileURL(join(temp,'anti-aging-eight-v57734.js')).href);
 const model=m.antiAgingEightModel(st([{foodId:'peanuts',amount:'20 g'}]),D);
 assert.equal(m.ANTI_AGING_EIGHT.length,8);assert.equal(model.rows.find(x=>x.id==='nuts').status,'observed');
 assert.equal(model.rows.find(x=>x.id==='caloric').status,'unknown');
 for(const id of ['nad','xeno'])assert.equal(model.rows.find(x=>x.id===id).status,'unmeasurable');
 assert.match(m.antiAgingEightView({}, {day:D,today:D}),/How Not to Age/);
});
