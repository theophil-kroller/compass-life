import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {bodyTransformationModel,bodyTransformationView} from '../client/src/body-transformation-v57749.js';
import {saveCapacitySettings749} from '../client/src/capacity-preserve-v57749.js';
import {compass749Bridge} from '../client/compass749-bridge.js';
const day='2026-10-24';
const fitdays=[
 {day:'2026-10-01',at:'2026-10-01T07:00:00Z',weightKg:86.1,bodyFatPct:20.2,muscleKg:59.1},
 {day:'2026-10-10',at:'2026-10-10T07:00:00Z',weightKg:85.6,bodyFatPct:19.9,muscleKg:59.4},
 {day:'2026-10-10',at:'2026-10-10T18:00:00Z',weightKg:85.8,bodyFatPct:19.7,muscleKg:59.2},
 {day:'2026-10-20',at:'2026-10-20T07:00:00Z',weightKg:85.0,bodyFatPct:19.5,muscleKg:59.7},
 {day:'2026-10-26',at:'2026-10-26T07:00:00Z',weightKg:75,bodyFatPct:19,muscleKg:61}
];
const state={healthImports:{fitdays},tasks:{a:{id:'a',title:'Test',dueDate:'2026-10-27'}},uiPreferences:{capacityGuardian:{packets:{a:{count:12,unitMinutes:8,blockMinutes:40}}}}};
const nutritionIndex={days:new Map([
 ['2026-10-19',{summary:{entries:3,totals:{protein:55,kcal:1000},coverage:{protein:{known:3,unknown:1,estimated:1},kcal:{known:3,unknown:1}}}}],
 ['2026-10-20',{summary:{entries:2,totals:{protein:80},coverage:{protein:{known:2,unknown:0},kcal:{known:0}}}}],
 ['2026-10-22',{summary:{entries:2,totals:{kcal:1200},coverage:{protein:{known:0,unknown:2},kcal:{known:2}}}}],
 ['2026-10-26',{summary:{entries:1,totals:{protein:100},coverage:{protein:{known:1}}}}]
])};
const strengthSessions=[
 {id:'gym1',day:'2026-10-19',sets:[{reps:10},{reps:12}],reportedSets:3},
 {id:'gym2',day:'2026-10-20',sets:[{reps:8}],reportedSets:1},
 {id:'gym3',day:'2026-10-20',sets:[],reportedSets:2},
 {id:'future',day:'2026-10-26',sets:[{reps:8}],reportedSets:1}
];
const opts={today:day,range:'28',nutritionIndex,strengthSessions};
test('Fitdays uses latest measurement per date, ignores future, never interpolates',()=>{
 const m=bodyTransformationModel(state,opts);
 assert.equal(m.fitdays.length,3);
 assert.equal(m.fat.count,3);assert.equal(m.weight.points[1].value,85.8);
 assert.equal(m.last.fitdays,'2026-10-20');assert.ok(Math.abs(m.weight.delta+1.1)<1e-10);
 assert.ok(Math.abs(m.fat.delta+.7)<1e-10);assert.ok(Math.abs(m.muscle.delta-.6)<1e-10);
});
test('separate dated observations: missing nutrition is not zero and imports after today excluded',()=>{
 const m=bodyTransformationModel(state,opts);
 assert.equal(m.sourceCounts.protein,2);assert.equal(m.sourceCounts.kcal,2);
 assert.equal(m.avgProteinObserved,67.5);
 assert.equal(m.sourceCounts.proteinPartial,1);
 assert.equal(m.sourceCounts.joinedProteinStrengthDays,2);
 assert.equal(m.strength.length,2);assert.equal(m.sourceCounts.strengthSessions,3);
 assert.equal(m.sourceCounts.sets,6);
});
test('range filter only considers last seven days; whole-history accepts earlier observations',()=>{
 assert.equal(bodyTransformationModel(state,{...opts,range:'7'}).weight.count,1);
 assert.equal(bodyTransformationModel(state,{...opts,range:'all'}).weight.count,3);
});
test('empty state is explicit and no imaginary weight, zero calories or muscle gain',()=>{
 const m=bodyTransformationModel({healthImports:{}},{today:day});
 assert.equal(m.weight.count,0);assert.equal(m.weight.delta,null);
 assert.equal(m.estimatedFatFreeKg,null);
 const v=bodyTransformationView({healthImports:{}},{today:day});
 assert.match(v,/Keine dokumentierten Messwerte/);assert.match(v,/einen Trainingserfolg/);
});
test('visible body graphics have individual dots, coverage and uncertainty',()=>{
 const html=bodyTransformationView(state,opts);
 assert.match(html,/Individuelle Messpunkte/);
 assert.match(html,/BIA-Schätzung/);assert.match(html,/teilmengen/i);
 assert.match(html,/circle/);assert.match(html,/Fitdays: 3 Messtag/);
 assert.doesNotMatch(html,/<path class="synthetic-average"/);
});
test('user-provided strings never become unescaped HTML in body measurements',()=>{
 const evil={healthImports:{fitdays:[{day:'2026-10-20',weightKg:83,bodyFatPct:18,muscleKg:59,at:'2026-10-20T06:00:00Z',note:'<script>alert(1)</script>'}]}};
 assert.doesNotMatch(bodyTransformationView(evil,{today:day}),/<script>/);
});
test('saving focus budget preserves work packets introduced in .48',()=>{
 const s=structuredClone(state),before=JSON.stringify(s.uiPreferences.capacityGuardian.packets);
 saveCapacitySettings749(s,{focusHours:'10',reservePct:'20',estimates:{a:'1.5'}});
 assert.equal(JSON.stringify(s.uiPreferences.capacityGuardian.packets),before);
 assert.equal(s.uiPreferences.capacityGuardian.estimates.a,90);
});
test('new bridge fails closed and builds valid JS on prepared .48 anchors',()=>{
 const b=compass749Bridge();assert.throws(()=>b.transform('bad','/repo/client/src/main.js'),/anchor/);
 assert.equal(b.transform('bad','/repo/client/src/other.js'),null);
 const mock=`
import './capacity-calendar-v57748.css';
const COMPASS_CLIENT_VERSION='0.5.77.48';
function overview(){return insightTab==='body'?healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition):insightTab==='activity'?fitnessInsightsView():null;}
async function store(){await mutate(st=>saveCapacitySettings(st,{focusHours,reservePct,estimates}),null,true);}
`;
 const out=b.transform(mock,'/repo/client/src/main.js').code;
 for(const key of ['0.5.77.49','bodyTransformationView','strengthSummariesWithFit','nutritionTrendsIndex','saveCapacitySettings749'])assert.ok(out.includes(key),key);
 const p=join(tmpdir(),'compass-749-'+process.pid+'.mjs');writeFileSync(p,out);
 try{execFileSync(process.execPath,['--check',p]);}finally{unlinkSync(p);}
 const conf=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(conf,/compass748Bridge\(\), compass749Bridge\(\), VitePWA/);
});
