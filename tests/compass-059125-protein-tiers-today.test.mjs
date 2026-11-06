import test from 'node:test';
import assert from 'node:assert/strict';
import {proteinScaleBands125,proteinTodayMarkup88,proteinTarget88,addOpenFood88} from '../client/src/coach-integration-v0588.js';
const day='2026-11-06';
const state=(weight=86)=>({healthImports:{fitdays:[{day:'2026-11-05',weightKg:weight}]},nutritionJournal:{entries:[],customFoods:[],proteinCoach88:{targetG:145}}});
test('86kg body weight has original agreed 100–120 foundation, 120–140 optimum, 140–150 optional',()=>{
 const b=proteinScaleBands125(state(),day);
 assert.deepEqual([b.basis,b.optimumStart,b.optimumEnd,b.optionalEnd],[100,120,140,150]);
 assert.equal(b.weight,86);
});
test('today compact score uses a graded scale rather than 112 / 145g pass fail',()=>{
 const s=state();addOpenFood88(s,{title:'Essen',at:day+'T12:00:00Z',nutrients:{protein:112}});
 const html=proteinTodayMarkup88(s,day,{compact:true});
 assert.match(html,/112 g Protein erfasst/);
 assert.match(html,/Grundlage 100–120 g/);
 assert.match(html,/Optimal 120–140 g/);
 assert.match(html,/Optional 140–150 g/);
 assert.match(html,/ci125-protein-marker/);
 assert.match(html,/data-action="ci88-food-open"/);
 assert.doesNotMatch(html,/112 \/ 145 g/);
 assert.equal(proteinTarget88(s),145,'existing manual target preserved');
});
test('an empty food log remains unknown instead of an invented zero intake',()=>{
 const html=proteinTodayMarkup88(state(),day,{compact:true});
 assert.match(html,/Noch keine Proteinwerte/);
 assert.doesNotMatch(html,/ci125-protein-marker/);
 assert.doesNotMatch(html,/aria-valuenow="0"/);
});
test('weight boundaries change with measured weight and respect historical observation dates',()=>{
 const s=state(100);
 s.healthImports.fitdays.push({day:'2026-11-07',weightKg:120});
 assert.deepEqual([proteinScaleBands125(s,day).basis,proteinScaleBands125(s,day).optimumStart,proteinScaleBands125(s,day).optimumEnd,proteinScaleBands125(s,day).optionalEnd],[120,140,160,175]);
 assert.equal(proteinScaleBands125(s,'2026-11-08').weight,120);
});
test('unknown weight shows provisional bands and keeps food partial',()=>{
 const s=state();s.healthImports.fitdays=[];
 const html=proteinTodayMarkup88(s,day,{compact:true});
 assert.match(html,/Vorläufige Skala/);
 assert.match(html,/Erfasste Teilbilanz/);
});
test('full Today component retains existing quick food action and the scale',()=>{
 const html=proteinTodayMarkup88(state(),day,{compact:false});
 assert.match(html,/ci88-protein-today/);
 assert.match(html,/ci125-protein-scale/);
 assert.match(html,/ci88-food-open/);
});
