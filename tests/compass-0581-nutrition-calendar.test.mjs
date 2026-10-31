import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {nutritionFoods,recommendedNutritionFoods} from '../client/src/personal-journal-v5692.js';
import {isAustrianWorkday} from '../client/src/waiting-followup-v57715.js';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('Germknödel and editable Kitcheri are in food catalog',()=>{
 const foods=nutritionFoods({});
 assert.ok(foods.some(x=>x.id==='hofer-germknoedel'));
 assert.ok(foods.some(x=>x.id==='kitcheri-personal'));
 assert.match(read('../client/src/personal-recipes-v57737.js'),/Mung Dal/);
});
test('weekends and Austrian statutory holidays are distinct from workdays',()=>{
 assert.equal(isAustrianWorkday('2026-10-30'),true);
 assert.equal(isAustrianWorkday('2026-10-31'),false);
 assert.equal(isAustrianWorkday('2026-11-01'),false);
 assert.equal(isAustrianWorkday('2026-10-26'),false);
 assert.equal(isAustrianWorkday('2026-11-02'),true);
});
test('Mensa meals are not recommended on Saturday while recorded logs remain',()=>{
 const state={nutritionJournal:{entries:[{foodId:'mensa-study-veggie',id:'m1',at:'2026-10-30T11:00:00Z'},{foodId:'banana',id:'b1',at:'2026-10-30T11:00:00Z'}]}};
 const week=recommendedNutritionFoods(state,new Date('2026-10-30T11:00:00Z'));
 const sat=recommendedNutritionFoods(state,new Date('2026-10-31T11:00:00Z'));
 assert.ok(week.some(x=>x.id==='mensa-study-veggie'));
 assert.ok(!sat.some(x=>x.id==='mensa-study-veggie'));
 assert.ok(sat.some(x=>x.id==='banana'));
});
test('Today resets after resume and mobile login supports visualViewport',()=>{
 const main=read('../client/src/main-full-v57759402510.js'),lock=read('../client/src/ars-vivendi-lock-full-v5775922.js');
 assert.match(main,/refreshCurrentDayIfNeeded/);assert.match(main,/visibilitychange/);assert.match(main,/manuallyChosenDay/);
 assert.match(lock,/visualViewport/);
});
