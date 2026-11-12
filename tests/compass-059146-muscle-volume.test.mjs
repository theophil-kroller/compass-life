import test from 'node:test';
import assert from 'node:assert/strict';
import {muscleExerciseTonnage146,muscleTonnageComparison146,muscleTonnageView146} from '../client/src/strength-muscle-volume-v059146.js';
import {strengthPremiumMap,strengthPremiumRanking} from '../client/src/strength-premium-v57738.js';

const today='2026-11-12';
const set=(exerciseId,weightKg,reps,day)=>({exerciseId,weightKg,reps,day});
const model=(sets)=>({today,sessions:[{day:today,sets}]});
const region=(summary,id)=>summary.rows.find(x=>x.id===id);

test('Muscle exercise tonnage uses only documented kg × reps and separates primary from secondary',()=>{
 const x=muscleExerciseTonnage146(model([set('dumbbell-lateral-raise',7,12,today),set('dumbbell-lateral-raise',7,10,today),set('dumbbell-row',12,8,today)]));
 assert.equal(region(x,'deltoid_side').primaryKg,154);
 assert.equal(region(x,'deltoid_side').primarySets,2);
 assert.equal(region(x,'trapezius_upper').secondaryKg,154);
 assert.equal(region(x,'trapezius_upper').primaryKg,0);
 assert.equal(region(x,'latissimus').primaryKg,96);
 assert.equal(region(x,'rhomboids').primaryKg,96);
 assert.equal(region(x,'biceps').secondaryKg,96);
 assert.equal(region(x,'biceps').primaryKg,0);
 assert.equal(x.weightedSets,3); // No additive 'total over all muscles'.
});

test('No fabricated kg for bodyweight, missing reps, zero resistance or unmapped FIT sets',()=>{
 const x=muscleExerciseTonnage146(model([
  set('ab-wheel-kneeling',null,8,today),
  set('dumbbell-lateral-raise',8,null,today),
  set('dumbbell-lateral-raise',0,12,today),
  set(null,15,12,today),
  set('unknown-garmin',20,8,today)
 ]));
 assert.equal(x.weightedSets,0);
 assert.equal(region(x,'rectus_abdominis').unweightedPrimary,1);
 assert.equal(region(x,'deltoid_side').unweightedPrimary,1); // set without reps is not anatomically classified
 assert.equal(region(x,'deltoid_side').primarySets,1);
 assert.equal(region(x,'deltoid_side').primaryKg,0);
});

test('Late-night training follows the actual confirmed set day, not session start',()=>{
 const x=muscleExerciseTonnage146({today,sessions:[{day:'2026-11-11',sets:[set('dumbbell-lateral-raise',7,12,'2026-11-11'),set('dumbbell-row',12,10,'2026-11-12')]}]});
 assert.equal(region(x,'deltoid_side').primaryKg,84);
 assert.equal(region(x,'latissimus').primaryKg,120);
 const sameDay=muscleExerciseTonnage146({today,sessions:[{day:'2026-11-11',sets:[set('dumbbell-lateral-raise',7,12,'2026-11-11'),set('dumbbell-row',12,10,'2026-11-12')]}]},{days:1});
 assert.equal(region(sameDay,'deltoid_side').primarySets,0);
 assert.equal(region(sameDay,'latissimus').primaryKg,120);
});

test('Weeks and months calculate different windows and do not invent prior-period trends',()=>{
 const x=model([set('dumbbell-lateral-raise',7,12,'2026-11-12'),set('dumbbell-lateral-raise',6,12,'2026-11-04'),set('dumbbell-lateral-raise',5,12,'2026-10-20')]);
 const w=muscleTonnageComparison146(x,{days:7});
 assert.equal(w.regions.find(r=>r.id==='deltoid_side').primaryKg,84);
 assert.equal(w.regions.find(r=>r.id==='deltoid_side').deltaKg,12);
 const m=muscleTonnageComparison146(x,{days:30});
 assert.equal(m.regions.find(r=>r.id==='deltoid_side').primaryKg,216);
 assert.equal(m.regions.find(r=>r.id==='deltoid_side').deltaKg,null);
});

test('Tonnage UI provides 7/30/42/90-day filters, explicit limits, zero synthetic vault writes',()=>{
 const html=muscleTonnageView146(model([set('dumbbell-row',12,12,today)]));
 assert.match(html,/7 Tage/);assert.match(html,/30 Tage/);assert.match(html,/6 Wochen/);assert.match(html,/90 Tage/);
 assert.match(html,/144 kg/);assert.match(html,/str146-week-trend/);assert.match(html,/nicht addieren/);assert.match(html,/Eigenkörpergewichtsübungen/);
 assert.doesNotMatch(html,/data-action=/);
 const atlas=strengthPremiumMap(model([set('dumbbell-row',12,12,today)]),null,'strength','front');
 assert.match(atlas,/Wie viel hast du bewegt/);
 assert.match(atlas,/MUSKELBETEILIGUNG/);
 const bike=strengthPremiumRanking(model([set('dumbbell-row',12,12,today)]),null,'cycling');
 assert.doesNotMatch(bike,/Wie viel hast du bewegt/);
});
