import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
import {EXERCISE_ANATOMY,EXERCISE_STABILIZERS} from '../client/src/strength-anatomy-v57737.js';
import {readHomeAttachments135,normalizeHomeAttachments135,saveHomeAttachments135,homeAttachmentAllows135} from '../client/src/strength-home-attachments-v059135.js';
import {vtaperCandidates135,effectiveShoulderLoad135,shoulderContribution135,selectVtaperExercises135,capShoulderSets135} from '../client/src/strength-vtaper-balance-v059135.js';
import {EXERCISE_LIBRARY_ENTRIES_131,exerciseAllowedAtPlace135,singleExercisePlan131} from '../client/src/strength-exercise-library-model-v059131.js';
import {dumbbellCount115} from '../client/src/strength-equipment-v059115.js';
const catalog=new Map(EXERCISES.map(x=>[x.id,x]));
const source=file=>readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
const DAY='2026-11-07';
const events=(id,sets,day='2026-11-06')=>Array.from({length:sets},(_,i)=>({exerciseId:id,reps:12,day,weightKg:7,sessionId:'session-'+id,completedAt:day+'T12:00:00Z'}));
const hist=(valid=[])=>({valid,counts7:valid.reduce((a,e)=>{const group=catalog.get(e.exerciseId)?.primary;if(group)a[group]=(a[group]||0)+1;return a;},{}),last:valid.reduce((a,e)=>{const group=catalog.get(e.exerciseId)?.primary;if(group&&(!a[group]||e.day>a[group]))a[group]=e.day;return a;},{})});
const plan=(history=hist(),more={})=>selectVtaperExercises135({history,today:DAY,place:'home',minutes:25,catalog,...more});
test('two canonical new exercises preserve previous 66 stable exercise ids, complete anatomy and stabilization maps',()=>{
 assert.equal(EXERCISES.length,68);assert.equal(new Set(EXERCISES.map(x=>x.id)).size,68);
 assert.deepEqual(new Set(EXERCISES.map(x=>x.id)),new Set(Object.keys(EXERCISE_ANATOMY)));
 assert.deepEqual(new Set(EXERCISES.map(x=>x.id)),new Set(Object.keys(EXERCISE_STABILIZERS)));
 assert.equal(catalog.get('dumbbell-front-raise')?.primary,'shoulders');
 assert.equal(catalog.get('assisted-pullup')?.primary,'back');
});
test('shoulder-anatomy role weights: direct lateral/rear, indirect press and row, no stabilizer credit',()=>{
 assert.equal(shoulderContribution135('dumbbell-lateral-raise').lateral,1);
 assert.equal(shoulderContribution135('reverse-fly').posterior,1);
 assert.equal(shoulderContribution135('dumbbell-front-raise').anterior,1);
 assert.equal(shoulderContribution135('dumbbell-shoulder-press').anterior,1);
 assert.equal(shoulderContribution135('dumbbell-shoulder-press').lateral,.35);
 assert.equal(shoulderContribution135('dumbbell-row').posterior,.35);
 assert.equal(shoulderContribution135('pushup').anterior,.35);
 assert.equal(shoulderContribution135('plank').anterior,0); // stabilizing isn't productive set volume
});
test('all confirmed sets counted by actual date; day 7 excluded, without duplicating same head',()=>{
 const real=[...events('dumbbell-lateral-raise',3),...events('reverse-fly',2),...events('pushup',4),...events('dumbbell-row',3),...events('dumbbell-shoulder-press',2),...events('dumbbell-lateral-raise',5,'2026-10-31')];
 const s=effectiveShoulderLoad135(real,DAY);
 assert.equal(s.counts.lateral,3.7); // 3 direct + 2 x .35 from presses
 assert.equal(s.counts.posterior,3.05); // 2 direct + 3 x .35 rows
 assert.equal(s.counts.anterior,3.4); // 4 x .35 pushups + 2 press
 assert.equal(s.indirect.anterior,1.4);
 assert.equal(s.direct.posterior,2);
 assert.equal(s.last.lateral,'2026-11-06');
});
test('unclear Garmin sessions are not invented as confirmed shoulder sets',()=>{
 const s=effectiveShoulderLoad135([{exerciseId:null,day:DAY,reps:0},{exerciseId:'dumbbell-row',day:DAY,reps:null}],DAY);
 assert.deepEqual(s.counts,{anterior:0,lateral:0,posterior:0});assert.equal(s.matched,0);
});
test('home readiness defaults to false, even when equipment is owned',()=>{
 const s=normalizeHomeAttachments135(null);
 assert.equal(s.cableReady,false);assert.equal(s.pullupReady,false);
 assert.equal(readHomeAttachments135().cableReady,false);
 assert.equal(homeAttachmentAllows135('face-pull',s),false);
 assert.equal(homeAttachmentAllows135('assisted-pullup',s),false);
 assert.ok(!vtaperCandidates135('home',s).includes('face-pull'));
 assert.ok(!vtaperCandidates135('home',s).includes('assisted-pullup'));
});
test('explicit install flags unlock cable and assisted pullups, and never duplicate dumbbell plate inventory',()=>{
 const ready=normalizeHomeAttachments135({cableReady:true,pullupReady:true});
 for(const id of ['face-pull','lat-pulldown','cable-straight-arm-pulldown','cable-rear-delt-fly'])assert.ok(vtaperCandidates135('home',ready).includes(id));
 assert.ok(vtaperCandidates135('home',ready).includes('assisted-pullup'));
 assert.equal(homeAttachmentAllows135('pullup',ready),true);
 assert.equal(dumbbellCount115('dumbbell-front-raise'),2);
 assert.equal(dumbbellCount115('assisted-pullup'),null);
});
test('25 minute V-Taper selects at most three and never auto-inserts Front Raise',()=>{
 const s=plan(hist());assert.equal(s.ids.length,3);
 assert.ok(!s.ids.includes('dumbbell-front-raise'));
 assert.ok(s.ids.includes('dumbbell-lateral-raise')||s.ids.includes('reverse-fly'));
 assert.ok(s.ids.some(id=>catalog.get(id)?.primary==='back'));
});
test('recent high lateral loading prioritizes posterior instead of excessive repeat sets',()=>{
 const s=plan(hist(events('dumbbell-lateral-raise',9)));
 assert.equal(s.ids.includes('dumbbell-lateral-raise'),false);
 assert.ok(s.ids.includes('reverse-fly'));
});
test('high posterior loading skips rear isolation; still supports lateral development',()=>{
 const s=plan(hist(events('reverse-fly',9)));
 assert.equal(s.ids.includes('reverse-fly'),false);
 assert.ok(s.ids.includes('dumbbell-lateral-raise'));
});
test('indirect anterior pressure makes front raises unnecessary even before selection',()=>{
 const s=plan(hist([...events('pushup',6),...events('dumbbell-floor-press',4)]));
 assert.ok(effectiveShoulderLoad135([...events('pushup',6),...events('dumbbell-floor-press',4)],DAY).counts.anterior>=3);
 assert.ok(!s.ids.includes('dumbbell-front-raise'));
});
test('HWS/pain session skips heavy overhead press and preserves conservative set cap',()=>{
 const s=plan(hist(),{pain:true,healthAttention:true});
 assert.equal(s.ids.includes('dumbbell-shoulder-press'),false);
 assert.equal(s.ids.length,3);
 assert.equal(capShoulderSets135({id:'dumbbell-lateral-raise',baseSets:3,shoulder:{counts:{lateral:8.6}}}),1);
});
test('adaptive candidate selection does not change workout history or preferences',()=>{
 const original=hist([...events('dumbbell-row',2),...events('pushup',3)]);const before=JSON.stringify(original);
 plan(original);assert.equal(JSON.stringify(original),before);
});
test('exercise library lets user pick Front Raise at home, but gates uninstalled cable and pull-ups',()=>{
 const fr=EXERCISE_LIBRARY_ENTRIES_131.find(e=>e.id==='dumbbell-front-raise');
 const cable=EXERCISE_LIBRARY_ENTRIES_131.find(e=>e.id==='face-pull');
 assert.ok(fr);assert.equal(exerciseAllowedAtPlace135(fr,'home',{attachments:{}}),true);
 assert.equal(exerciseAllowedAtPlace135(cable,'home',{attachments:{}}),false);
 assert.equal(exerciseAllowedAtPlace135(cable,'home',{attachments:{cableReady:true}}),true);
 assert.throws(()=>singleExercisePlan131({},'face-pull',{place:'home'}),/noch nicht/);
 assert.equal(singleExercisePlan131({},'dumbbell-front-raise',{place:'home',sets:2}).exercises[0].sets,2);
});
test('gym candidates remain available regardless of home attachment flags',()=>{
 for(const id of ['face-pull','lat-pulldown','cable-rear-delt-fly'])assert.ok(vtaperCandidates135('gym',{cableReady:false}).includes(id));
});
test('wiring: adaptive sets applied in actual planner; all old photographic assets left untouched',()=>{
 const coach=source('strength-coach-v5775910.js'),guide=source('strength-guided-v5775920.js');
 assert.match(coach,/selectVtaperExercises135\(/);
 assert.match(coach,/coach34RecommendedSets\(\{state,goal:selectedGoal/);
 assert.match(coach,/capShoulderSets135/);
 assert.match(coach,/data-save-attachments/);
 assert.match(coach,/window\.confirm\('Nur nach sicherer Montage/);
 assert.match(coach,/str131-library-launch/);
 assert.match(guide,/CUSTOM_PHOTO_EXERCISES_126/);
 assert.match(guide,/data-act="set-reps"/);
 assert.match(source('strength-equipment-v059115.js'),/<details class="str115-load str115-collapsible"/);
});
test('new front raise and assisted pullup retain accurate START/ENDE technique cues alongside approved photographs',()=>{
 const guide=source('strength-guided-v5775920.js');
 assert.match(guide,/'dumbbell-front-raise':\['Kurzhanteln/);
 assert.match(guide,/'assisted-pullup':\['Sichere montierte/);
 assert.match(guide,/keine Strichmännchen-Grafik/);
 assert.ok(guide.includes('NEW_PHOTO_EXERCISES_136.has(curr.id)?')); 
});
test('version bumped consistently for photo integration on v0.5.91.35',()=>{
 const r=readFileSync(new URL('../package.json',import.meta.url),'utf8');
 assert.equal(JSON.parse(r).version,'0.5.91.37');
 assert.equal(JSON.parse(readFileSync(new URL('../client/package.json',import.meta.url),'utf8')).version,'0.5.91.37');
 assert.match(source('compass-release-v57759402519.js'),/0\.5\.91\.37/);
 assert.match(source('main-full-v57759402510.js'),/COMPASS_CLIENT_VERSION='0\.5\.91\.37'/);
});
