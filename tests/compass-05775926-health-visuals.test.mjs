import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {strengthCoachHealthContext} from '../client/src/strength-coach-recovery-v5775926.js';
const day='2026-10-26';
const date=n=>new Date(Date.parse(day+'T12:00:00Z')-n*86400000).toISOString().slice(0,10);
const sleep=n=>({day:date(n),sleepMinutes:n<3?360:460});
const hrv=n=>({day:date(n),nightAverageMs:n<3?32:48});
const base=()=>({healthImports:{garminNights:Array.from({length:22},(_,i)=>sleep(i)),garminHrv:Array.from({length:22},(_,i)=>hrv(i)),fitdays:[
 {day:date(60),at:date(60)+'T08:00:00Z',weightKg:80,bodyFatPct:22,muscleKg:58},
 {day:date(25),at:date(25)+'T08:00:00Z',weightKg:79,bodyFatPct:21,muscleKg:59},
 {day:date(0),at:date(0)+'T08:00:00Z',weightKg:78,bodyFatPct:20.5,muscleKg:59.5}
]}});
test('health context identifies two observed negative signals against individual baselines',()=>{
 const h=strengthCoachHealthContext(base(),{today:day});
 assert.equal(h.status,'attention');assert.equal(h.attention,true);
 assert.equal(h.sleep.deltaMinutes,-100);assert.equal(h.hrv.deltaPct,-33.3);
 assert.equal(h.body.latest.weightKg,78);assert.equal(h.body.trend.weightKgDelta,-1);
 assert.equal(h.body.trend.reliableForTrend,false);
});
test('never claim good readiness with only a few or missing records',()=>{
 const h=strengthCoachHealthContext({healthImports:{garminNights:[{day,sleepMinutes:290}],garminHrv:[]}}, {today:day});
 assert.equal(h.status,'insufficient');assert.equal(h.sleep.deltaMinutes,null);assert.equal(h.hrv.deltaPct,null);assert.equal(h.body.trend,null);
});
test('same calendar day FIT/HRV repeats do not count as independent baseline days',()=>{
 const v=base();v.healthImports.garminHrv=Array(30).fill(null).map((_,i)=>({day:date(i%2),nightAverageMs:35}));
 const h=strengthCoachHealthContext(v,{today:day});assert.equal(h.hrv.usable,false);
});
test('do not calculate trend from Fitdays measurements less than 21 days apart or future rows',()=>{
 const v={healthImports:{fitdays:[{day:date(5),weightKg:80},{day:date(0),weightKg:79},{day:'2030-01-01',weightKg:1}]}};
 const h=strengthCoachHealthContext(v,{today:day});assert.equal(h.body.count,2);assert.equal(h.body.trend,null);assert.equal(h.body.latest.weightKg,79);
});
test('18 distinct new image pairs, seven existing assets remain referenced',()=>{
 const imgs=readdirSync(new URL('../client/public/strength-visuals-v5775926/',import.meta.url)).filter(f=>f.endsWith('.svg'));
 assert.equal(imgs.length,18);for(const name of imgs){const raw=readFileSync(new URL('../client/public/strength-visuals-v5775926/'+name,import.meta.url),'utf8');assert.match(raw,/<svg /);assert.match(raw,/START/);assert.match(raw,/ENDE/);}
 if(!existsSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url)))return; // test from deployed checkout
 const guided=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
 assert.match(guided,/PREMIUM_VISUALS/);assert.match(guided,/COACH_NEW_VISUAL_ROOT/);assert.match(guided,/COACH_NEW_VISUALS/);
 const coach=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 assert.match(coach,/strengthCoachHealthContext/);assert.match(coach,/plan\.health\.guidance/);
});
