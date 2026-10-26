import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compass5930MobileLongevityBridge} from '../client/compass5930-mobile-longevity-bridge.js';
import {dailyDozen5930,DAILY_DOZEN_5930,dailyDozen5930View} from '../client/src/daily-dozen-v5775930.js';
const bridge=compass5930MobileLongevityBridge();
const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
test('legacy and .29 registrations stay byte-for-byte anchored; .30 is additive',()=>{
 assert.match(cfg,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5928VtaperLuxBridge\(\), compass5929BreakfastBridge\(\)\)/);
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5930MobileLongevityBridge\(\)\)/);
 assert.ok(cfg.indexOf('compass5930MobileLongevityBridge()')>cfg.indexOf('compass5929BreakfastBridge()'));
});
test('Daily Dozen uses 12 official groups and 24 total target checks, with zero invented observations',()=>{
 assert.equal(DAILY_DOZEN_5930.length,12);
 assert.equal(DAILY_DOZEN_5930.reduce((n,x)=>n+x.goal,0),24);
 const none=dailyDozen5930({nutritionJournal:{entries:[]}},{day:'2026-10-26'});
 assert.equal(none.observed,0);assert.equal(none.entries,0);
 const model=dailyDozen5930({nutritionJournal:{entries:[
  {id:'a',foodId:'lyttos-pistachio-breakfast',amount:'150 g Joghurt + 15 g Honig + 15 g Pistazienmus',at:'2026-10-26T08:00:00',deleted:false},
  {id:'b',foodId:'supplement-bcaa-alphaminos',amount:'13 g',at:'2026-10-26T11:00:00'}
 ]}},{day:'2026-10-26'});
 assert.equal(model.entries,2);
 assert.equal(model.rows.find(x=>x.id==='nuts').observed,0.5);
 assert.equal(model.unmapped,1);
 assert.equal(model.rows.find(x=>x.id==='exercise').observed,0);
 assert.match(dailyDozen5930View(model),/Keine Anti-Aging-Prognose/);
});
test('mobile Focus appearance is not modified by the .30 CSS',()=>{
 const css=readFileSync(new URL('../client/src/mobile-direct-v5775930.css',import.meta.url),'utf8');
 assert.match(css,/\.cm930-direct\{display:none\}/);
 assert.match(css,/data-cm930-mode="extended"/);
 assert.doesNotMatch(css,/data-cm930-mode="focus"/);
});
test('source transformations fail closed for incompatible release version',()=>{
 assert.throws(()=>bridge.transform("const COMPASS_CLIENT_VERSION='0.5.77.58.2';",'/repo/client/src/main.js'),/anchor/);
});
