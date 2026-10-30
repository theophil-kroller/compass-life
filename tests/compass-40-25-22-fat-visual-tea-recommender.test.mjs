import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fatMassPoints,fatMassVisualView} from '../client/src/body-fat-visual-v57759402522.js';
import {FOOD_PRESETS,nutritionQuickView,recommendedNutritionFoods,nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {bioactiveForEntry} from '../client/src/nutrition-phyto-v57736.js';
import {dailyDozenEvidence} from '../client/src/daily-dozen-auto-v57734.js';
const row=(at,weightKg,bodyFatPct)=>({at,day:at.slice(0,10),weightKg,bodyFatPct});
test('fat comparison recalculates whenever the latest Fitdays weight or body fat changes',()=>{
 const old=row('2026-10-27T06:00:00.000Z',90,25);
 const now=row('2026-10-30T06:00:00.000Z',80,20);
 const points=fatMassPoints([now,old]);
 assert.deepEqual(points.map(x=>x.fatKg),[22.5,16]);
 assert.deepEqual(points.map(x=>x.fatFreeKg),[67.5,64]);
 const a=fatMassVisualView([old]);const b=fatMassVisualView([old,now]);
 assert.match(a,/22,5 kg/);assert.match(b,/16,0 kg/);assert.match(b,/20,0 %/);
 assert.match(b,/80,0 kg/);assert.match(b,/2026-10-30/);
 assert.doesNotMatch(b,/(?:87,1 kg|21,3 kg)/);
 assert.match(b,/Fettmasse · einzelne Messpunkte/);
 assert.equal((b.match(/cfat-item /g)||[]).length,7);
 assert.match(b,/cfat-current/);
});
test('fat visual handles missing and stale data safely and includes no fabricated fat mass',()=>{
 assert.equal(fatMassVisualView([]),'');
 assert.equal(fatMassVisualView([row('2026-10-29T08:00:00.000Z',86,null)]),'');
 assert.match(fatMassVisualView([row('2026-10-29T08:00:00.000Z',86,24)]),/mindestens zwei echte Fitdays-Messungen/);
 const asset=new URL('../client/public/compass-fat-tissue-v57759402522.webp',import.meta.url);
 assert.ok(existsSync(asset));
});
test('historic green tea id is restored in quick menu and all other nutrition modules',()=>{
 const tea=FOOD_PRESETS.find(f=>f.id==='green-tea-chinese');
 assert.ok(tea);assert.equal(tea.group,'Getränke');assert.equal(tea.defaultAmount,'1 Tasse (250 ml)');
 assert.deepEqual([tea.kcalLow,tea.kcalHigh],[0,3]);
 assert.ok(PRODUCT_PROFILES['green-tea-chinese']?.extra?.caffeine?.value===38);
 const sample={nutritionJournal:{entries:[{foodId:'green-tea-chinese',at:'2026-10-30T10:00:00',amount:tea.defaultAmount}],customFoods:[]}};
 assert.equal(dailyDozenEvidence(sample,'2026-10-30').totals.beverages,1);
 assert.ok(bioactiveForEntry(sample.nutritionJournal.entries[0]).length>0);
 const html=nutritionQuickView(sample,{dateToday:'2026-10-30T10:10:00'});
 assert.match(html,/Chinesischer Grüntee/);assert.match(html,/Recommended/);
 assert.equal(nutritionKcalEstimate(tea,tea.defaultAmount).high,3);
});
test('recommended foods are local, based on entry time and recency, no cloud dependency',()=>{
 const st={nutritionJournal:{customFoods:[],entries:[
  {id:'a',foodId:'green-tea-chinese',at:'2026-10-28T09:10:00'},
  {id:'b',foodId:'green-tea-chinese',at:'2026-10-29T09:15:00'},
  {id:'c',foodId:'coffee',at:'2026-10-29T19:00:00'},
  {id:'d',foodId:'banana',at:'2026-10-30T08:45:00'},
  {id:'e',foodId:'water-glass',at:'2026-10-29T09:25:00',deleted:true},
  {id:'x',foodId:'coffee',at:'2026-10-30T23:00:00'}
 ]}};
 const m=recommendedNutritionFoods(st,'2026-10-30T09:00:00');
 assert.equal(m[0].id,'green-tea-chinese');assert.ok(m.some(x=>x.id==='banana'));
 assert.ok(!m.some(x=>x.id==='water-glass'));
 assert.equal(recommendedNutritionFoods(null,'2026-10-30T09:00:00').length,0);
 assert.ok(nutritionQuickView(st,{dateToday:'2026-10-30T09:00:00'}).indexOf('Recommended')<nutritionQuickView(st,{dateToday:'2026-10-30T09:00:00'}).indexOf('Frühstück'));
 const after=recommendedNutritionFoods(st,'2026-10-31T19:10:00');
 assert.ok(after.some(x=>x.id==='coffee'));
});
test('fat visual sits in Fitdays body analysis before old detailed plots',()=>{
 const f=readFileSync(new URL('../client/src/fitdays-interpretation-v57759402517.js',import.meta.url),'utf8');
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(f,/fatMassVisualView\(selected\)/);
 assert.ok(f.indexOf('fatMassVisualView(selected)')<f.indexOf('fdi-more'));
 assert.match(main,/body-fat-visual-v57759402522\.css/);
});
