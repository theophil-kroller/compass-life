import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {distanceMeters39,validFix39,zone39,classifyPosition39,locationSettings39,effectiveContext39,contextTasks39,contextLinks39,locationContextPanel39} from '../client/src/location-context-v5775939.js';
import {compass5939LocationContextRelease} from '../client/compass5939-location-context-release.js';
const fix=(latitude,longitude,accuracy=10)=>({latitude,longitude,accuracy});
const home=zone39(fix(47.07,15.44),300,'2026-10-26T16:00:00Z');
const work=zone39(fix(47.08,15.45),250,'2026-10-26T16:00:00Z');
test('Unknown by default – Compass does not claim user is at home',()=>{
 assert.deepEqual(effectiveContext39({}),{kind:'unknown',mode:'manual',stale:false});
 assert.equal(locationContextPanel39({},[]).includes('Unbekannt'),true);
});
test('Only explicit home and work zones; out-of-range points rejected',()=>{
 assert.equal(validFix39(fix(100,1)),false);
 assert.throws(()=>zone39(fix(47,15),10),/Ortsradius/);
 assert.ok(distanceMeters39(home,work)>1000);
 assert.equal(classifyPosition39(fix(47.07,15.44),{home,work}).kind,'home');
 assert.equal(classifyPosition39(fix(47.08,15.45),{home,work}).kind,'work');
 assert.equal(classifyPosition39(fix(47.1,15.5),{home,work}).kind,'away');
});
test('Uncertain GPS and overlapping zones fail closed instead of falsely inferring presence',()=>{
 assert.deepEqual(classifyPosition39(fix(47.07,15.44,1200),{home,work}).kind,'unknown');
 assert.deepEqual(classifyPosition39(fix(47.07,15.44,10),{home,work:{...home,radius:300}}).kind,'unknown');
 assert.equal(classifyPosition39(fix(47.07,15.44),{}).kind,'unknown');
});
test('Automatic context expires, manual choice always wins',()=>{
 const last={kind:'home',checkedAt:'2026-10-26T12:00:00Z',accuracy:20};
 const cfg={locationContext39:{mode:'auto',zones:{home},last}};
 assert.equal(effectiveContext39(cfg,Date.parse('2026-10-26T12:30:00Z')).kind,'home');
 assert.equal(effectiveContext39(cfg,Date.parse('2026-10-26T15:30:00Z')).kind,'unknown');
 cfg.locationContext39.mode='manual';cfg.locationContext39.manual='away';
 assert.equal(effectiveContext39(cfg).kind,'away');
});
test('Context-aware GTD uses explicit task tags, never title or vague proximity',()=>{
 const tasks=[{id:'1',title:'Office meeting',contextTags:['zuhause']},{id:'2',title:'Büro anrufen',contextTags:['büro']},{id:'3',title:'Erledigung',contextTags:['@unterwegs']},{id:'4',title:'office',contextTags:[]}];
 assert.deepEqual(contextTasks39(tasks,'home').map(x=>x.id),['1']);
 assert.deepEqual(contextTasks39(tasks,'work').map(x=>x.id),['2']);
 assert.deepEqual(contextTasks39(tasks,'away').map(x=>x.id),['3']);
 assert.equal(contextTasks39(tasks,'unknown').length,0);
 assert.deepEqual(contextLinks39('work').map(x=>x[0]),['next','people','forecast']);
});
test('Settings remain collapsed; buttons are accessible and no GPS calls arise from rendering',()=>{
 const html=locationContextPanel39({locationContext39:{mode:'manual',manual:'home',zones:{home}}},[{id:'t',title:'<img onerror=x>',contextTags:['home']}]);
 assert.match(html,/<details class="ctx39-settings">/);assert.match(html,/Standort jetzt prüfen/);
 assert.doesNotMatch(html,/<img onerror/);assert.match(html,/&lt;img/);
 assert.match(html,/data-action="ctx39-manual"/);assert.match(html,/data-action="ctx39-set-zone"/);
 assert.doesNotMatch(html,/getCurrentPosition/);
});
test('Only enrolled locations may be stored, no history or GPS access in model',()=>{
 const src=readFileSync(new URL('../client/src/location-context-v5775939.js',import.meta.url),'utf8');
 assert.doesNotMatch(src,/watchPosition\s*\(/);assert.doesNotMatch(src,/localStorage|sessionStorage|fetch\s*\(/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.doesNotMatch(main,/locationContext39.*journalSyncPayload/);
});
test('Release is narrow and fails closed on wrong badge',()=>{
 const p=compass5939LocationContextRelease();assert.throws(()=>p.transform('bad','/repo/client/src/main.js'),/badge/);
 assert.equal(p.transform('bad','/repo/client/src/other.js'),null);
 assert.match(p.transform("const x='Build 0.5.77.59.38';",'/repo/client/src/ars-vivendi-lock-v5775922.js').code,/59\.39/);
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5938ExperienceRelease\(\)\);\s*compassConfig\.plugins\.push\(compass5939LocationContextRelease\(\)\)/);
});
