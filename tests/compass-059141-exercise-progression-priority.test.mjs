import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exerciseProgressionModel141,regionLoadSummary141,exerciseProgressionView141} from '../client/src/strength-exercise-progression-v059141.js';
const period={today:'2026-11-12',sessions:[
 {day:'2026-11-06',sets:[{exerciseId:'dumbbell-row',exercise:'Kurzhantelrudern',weightKg:10,reps:12},{exerciseId:'dumbbell-row',weightKg:8,reps:14},{exerciseId:'dumbbell-lateral-raise',weightKg:5,reps:10}]},
 {day:'2026-11-12',sets:[{exerciseId:'dumbbell-row',exercise:'Kurzhantelrudern',weightKg:12,reps:9},{exerciseId:'dumbbell-row',weightKg:10,reps:12},{exerciseId:'dumbbell-lateral-raise',weightKg:5,reps:12},{exerciseId:'unknown-name',weightKg:90,reps:10},{exerciseId:'dumbbell-row',weightKg:null,reps:null}]}
]};
test('progression uses one top working weight per exercise/day; does not sum kg for muscles',()=>{
 const m=exerciseProgressionModel141(period);
 const r=m.exercises.find(x=>x.id==='dumbbell-row');
 assert.equal(r.sessions.length,2);assert.equal(r.sessions[0].kg,10);assert.equal(r.sessions[1].kg,12);
 assert.equal(r.changed,2);assert.equal(r.label,'Last gesteigert');
 assert.ok(!m.exercises.some(x=>x.id==='unknown-name'));
 const note=regionLoadSummary141(m,'latissimus');
 assert.match(note,/keine kg je Muskel/);assert.match(note,/12 kg/);
 assert.doesNotMatch(note,/90 kg/);
});
test('equal load with higher reps is visible progress, not invented force',()=>{
 const m=exerciseProgressionModel141(period);const d=m.exercises.find(x=>x.id==='dumbbell-lateral-raise');
 assert.equal(d.changed,0);assert.equal(d.repsChanged,2);
 assert.equal(d.label,'Mehr Wiederholungen');
 const html=exerciseProgressionView141(period);
 assert.match(html,/Deine Kraftprogression/);assert.match(html,/polyline/);assert.match(html,/höchste dokumentierte Arbeitslast/);
 assert.match(html,/nicht automatisch ein Kraftzuwachs/);
});
test('read only and no guessed weight if only repetitions are known',()=>{
 const x=structuredClone(period);exerciseProgressionView141(period);assert.deepEqual(period,x);
 const m=exerciseProgressionModel141({sessions:[{day:'2026-11-12',sets:[{exerciseId:'plank',reps:3,weightKg:null}]}]});
 assert.equal(m.exercises[0].latest.kg,null);
 assert.match(exerciseProgressionView141({sessions:[]}),/brauchen wir bestätigte Übungen/);
});
test('strength view promotes atlas and progression ahead of statistics, keeping original below',()=>{
 const s=readFileSync(new URL('../client/src/strength-insights-full-repair-v57759402511.js',import.meta.url),'utf8');
 assert.match(s,/const remainder=withEditor\.replace\(atlas,''\)/);
 assert.match(s,/opening\+'\\n'\+atlas\+'\\n'\+exerciseProgressionView141\(period\)/);
 assert.match(s,/return ordered\.replace/);
 const pp=readFileSync(new URL('../client/src/strength-premium-v57738.js',import.meta.url),'utf8');
 assert.match(pp,/exerciseByRegion:exerciseProgressionModel141\(model\)\.byRegion/);
 assert.match(pp,/regionLoadSummary141/);
});
