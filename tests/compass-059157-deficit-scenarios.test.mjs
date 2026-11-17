import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEFICIT_TIERS57,deficitPlan57} from '../client/src/vtaper-deficit-scenarios-v059157.js';
import {vTaperModel88,vTaperView88} from '../client/src/coach-integration-v0588.js';
const date=(n)=>new Date(Date.parse('2026-10-24T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const training={id:'strength-1',source:'compass-guided-v5920',startedAt:'2026-10-24T08:00:00Z',completed:true,exercises:[{exerciseId:'dumbbell-row',confirmedSets:[{confirmed:true,reps:10,weightKg:12}]}]};
const state={strengthGuidedSessions:[training],healthImports:{fitdays:Array.from({length:22},(_,i)=>({day:date(i),at:`${date(i)}T07:00:00Z`,weightKg:87-i*.06,bodyFatPct:23.5}))},nutritionJournal:{energyGoal:{birthYear:1983,birthMonth:2,heightCm:185,formulaSex:'male',method:'mifflin',activity:'active',deficit:500},entries:[],customFoods:[]}};
test('deficit planner offers 600, 700, 800 and 900 kcal when the personal planning floor permits',()=>{
 assert.deepEqual(DEFICIT_TIERS57.slice(-4).map(x=>x.kcal),[600,700,800,900]);
 const plan=deficitPlan57(state,{today:date(21),selected:900});
 assert.equal(plan.ready,true);
 assert.equal(plan.allowedMax,900);
 assert.equal(plan.eligible,true);
 assert.ok(plan.targetKcal>=plan.resting);
 assert.equal(plan.selected,900);
});
test('high deficit stages are disabled whenever target intake would drop below the planning floor',()=>{
 const lowActivity={...state,nutritionJournal:{...state.nutritionJournal,energyGoal:{...state.nutritionJournal.energyGoal,activity:'low'}}};
 const plan=deficitPlan57(lowActivity,{today:date(21),selected:900});
 assert.equal(plan.ready,true);
 assert.equal(plan.selected,null);
 assert.ok(plan.allowedMax<900);
 assert.ok(plan.tiers.find(t=>t.kcal===900).available===false);
});
test('700-900-kcal what-if scenarios do not flatten to same forecast or mutate the observations',()=>{
 const original=JSON.stringify(state);
 const base={eligible:true,pastAvgDeficitKcal:600,selected:600};
 const x=vTaperModel88(state,{today:date(21),horizonMonths:6,deficitLevel:600,deficitPlan:base});
 const y=vTaperModel88(state,{today:date(21),horizonMonths:6,deficitLevel:900,deficitPlan:{...base,selected:900}});
 assert.equal(x.sufficient,true);
 assert.equal(y.sufficient,true);
 assert.notDeepEqual(x.forecast,y.forecast);
 assert.ok(y.forecast[1].weightRangeKg[0]<x.forecast[1].weightRangeKg[0]);
 assert.equal(JSON.stringify(state),original);
});
test('interactive scenario buttons and click actions are connected to current Strength view',()=>{
 const src=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(src,/deficitOpen:coachDeficitOpen57,deficitLevel:coachDeficitLevel57/);
 assert.match(src,/action==='ci57-deficit-open'/);
 assert.match(src,/action==='ci57-deficit-stage'/);
 assert.match(src,/\[0,200,300,400,500,600,700,800,900\]/);
 const markup=vTaperView88(state,{today:date(21),deficitOpen:true,deficitLevel:900});
 assert.match(markup,/−900 kcal\/Tag/);
 assert.match(markup,/data-action="ci57-deficit-stage"/);
});
