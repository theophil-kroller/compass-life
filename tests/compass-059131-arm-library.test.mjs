import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
import {EXERCISE_LIBRARY_ENTRIES_131,exercisePhoto131,singleExercisePlan131,lastConfirmedLoad131} from '../client/src/strength-exercise-library-model-v059131.js';
import {resumableGuidedSession,guidedPlanFromSession} from '../client/src/strength-workout-resume-v57759405.js';
const client=new URL('../client/',import.meta.url);
const source=(name)=>readFileSync(new URL(`src/${name}`,client),'utf8');
const manifest=JSON.parse(readFileSync(new URL('public/strength-visuals-v059131/manifest.json',client),'utf8'));
const ids=['biceps-curl','hammer-curl','triceps-pushdown','triceps-extension','wrist-curl','triceps-curl','skullcrusher','reverse-curl','concentration-curl'];
test('all nine arm panels are standalone valid WebP files with exact SHA-256',()=>{
 assert.equal(manifest.count,9);assert.equal(manifest.release,'0.5.91.31');
 assert.deepEqual(Object.keys(manifest.images),ids);
 const hashes=new Set();
 for(const id of ids){
  const file=readFileSync(new URL(`public/strength-visuals-v059131/${id}.webp`,client));
  assert.equal(file.toString('ascii',0,4),'RIFF');assert.equal(file.toString('ascii',8,12),'WEBP');
  assert.ok(file.length>20_000,id);
  assert.equal(createHash('sha256').update(file).digest('hex'),manifest.images[id].sha256,id);
  assert.deepEqual(manifest.images[id].phases,['START','ENDE']);
  assert.ok(manifest.images[id].width>=1000&&manifest.images[id].height>=650);
  assert.equal(EXERCISES.find(x=>x.id===id)?.group,'Arme');
  hashes.add(manifest.images[id].sha256);
  assert.equal(exercisePhoto131(id).series,'v059131');
 }
 assert.equal(hashes.size,9);
});
test('original chest/back/leg/shoulder/calf images are untouched and preferred where appropriate',()=>{
 for(const prefix of ['v059127','v059128','v059129','v059130']){
  const old=JSON.parse(readFileSync(new URL(`public/strength-visuals-${prefix}/manifest.json`,client),'utf8'));
  for(const [id,meta] of Object.entries(old.images)){
   const file=readFileSync(new URL(`public/strength-visuals-${prefix}/${id}.webp`,client));
   assert.equal(createHash('sha256').update(file).digest('hex'),meta.sha256,id);
  }
 }
 assert.ok(statSync(new URL('public/strength-visuals-v059126/calf-raise.webp',client)).size>20_000);
 assert.equal(exercisePhoto131('calf-raise').series,'v059129');
 assert.equal(exercisePhoto131('shoulder-press').series,'v059130');
 assert.equal(exercisePhoto131('incline-bench').series,'v059127');
});
test('library exposes all 66 canonical exercises, photo links, filter metadata and gym requirements',()=>{
 assert.equal(EXERCISE_LIBRARY_ENTRIES_131.length,66);
 assert.deepEqual([...new Set(EXERCISE_LIBRARY_ENTRIES_131.map(x=>x.id))].length,66);
 assert.deepEqual(EXERCISE_LIBRARY_ENTRIES_131.find(x=>x.id==='triceps-pushdown').places,['gym']);
 assert.ok(EXERCISE_LIBRARY_ENTRIES_131.find(x=>x.id==='biceps-curl').places.includes('home'));
 assert.equal(exercisePhoto131('biceps-curl').kind,'pair');
 assert.equal(exercisePhoto131('one-arm-dumbbell-snatch').kind,'double');
});
test('a voluntary single exercise retains normal guided session schema, no synthetic confirmed sets',()=>{
 const plan=singleExercisePlan131({},'biceps-curl',{place:'home',sets:2,reps:'10–12'});
 assert.equal(plan.mode,'single');assert.equal(plan.variant,'library');
 assert.equal(plan.exercises.length,1);assert.equal(plan.exercises[0].sets,2);
 const snap={id:'single-131',source:'compass-guided-v5920',startedAt:'2026-11-06T18:00:00.000Z',updatedAt:'2026-11-06T18:00:00.000Z',finishedAt:null,completed:false,mode:plan.mode,variant:plan.variant,goal:plan.goal,equipment:plan.equipment,planTitle:plan.title,planSnapshot:{exercises:plan.exercises},exercises:[{exerciseId:plan.exercises[0].id,title:plan.exercises[0].title,plannedSets:2,plannedReps:plan.exercises[0].reps,confirmedSets:[]}]};
 assert.equal(snap.source,'compass-guided-v5920');assert.equal(snap.mode,'single');assert.equal(snap.variant,'library');
 assert.equal(snap.exercises[0].confirmedSets.length,0);
 assert.equal(snap.exercises[0].confirmedSets.filter(x=>x.confirmed).length,0);
 assert.equal(snap.completed,false);
 snap.exercises[0].confirmedSets.push({confirmed:true,setNumber:1,reps:11,weightKg:11,rir:2,completedAt:'2026-11-06T18:09:00.000Z',completedDay:'2026-11-06'});
 assert.equal(snap.exercises[0].confirmedSets[0].weightKg,11);
 const recovery=resumableGuidedSession({strengthGuidedSessions:[snap]},{now:Date.parse('2026-11-06T18:20:00.000Z')});
 assert.equal(recovery.id,'single-131');
 assert.equal(guidedPlanFromSession(recovery).exercises[0].id,'biceps-curl');
});
test('last actual set weight wins by timestamp, not older session with more sets',()=>{
 const state={strengthGuidedSessions:[
  {source:'compass-guided-v5920',startedAt:'2026-11-06T12:00:00Z',exercises:[{exerciseId:'biceps-curl',confirmedSets:Array.from({length:3},(_,i)=>({confirmed:true,weightKg:9,completedAt:`2026-11-06T12:0${i}:00Z`}))}]},
  {source:'compass-guided-v5920',startedAt:'2026-11-06T16:00:00Z',exercises:[{exerciseId:'biceps-curl',confirmedSets:[{confirmed:true,weightKg:11,completedAt:'2026-11-06T16:04:00Z'}]}]}
 ]};
 assert.equal(lastConfirmedLoad131(state,'biceps-curl').weightKg,11);
 assert.equal(singleExercisePlan131(state,'biceps-curl',{place:'home'}).exercises[0].suggestedKg,11);
 assert.equal(lastConfirmedLoad131(state,'hammer-curl'),null);
});
test('no workout created by opening preview; invalid choices and missing gym equipment are rejected',()=>{
 assert.throws(()=>singleExercisePlan131({},'missing-exercise'));
 assert.throws(()=>singleExercisePlan131({},'leg-press',{place:'home'}));
 assert.throws(()=>singleExercisePlan131({},'biceps-curl',{sets:0}));
 assert.throws(()=>singleExercisePlan131({},'biceps-curl',{sets:7}));
 assert.throws(()=>singleExercisePlan131({},'biceps-curl',{reps:'<script>'}));
 assert.equal(singleExercisePlan131({},'plank',{reps:'30 Sek.'}).exercises[0].reps,'30 Sek.');
});
test('guided player prioritizes arm media and bypasses three-exercise onboarding only for single mode',()=>{
 const s=source('strength-guided-v5775920.js');
 assert.ok(s.indexOf('ARM_PHOTO_EXERCISES_131.has(curr.id)?')<s.indexOf('SHOULDER_PHOTO_EXERCISES_130.has(curr.id)?'));
 assert.match(s,/let overview=!resumeSession&&plan\.mode!=='single'/);
 assert.match(s,/sets\.push\(\{confirmed:true/);
 assert.match(s,/correctGuidedSessionSetWeight122/);
 assert.match(s,/data-act=\"set-reps\"/);
 assert.match(s,/row\.reps=value/);
 assert.match(s,/saveRir=/);
});
test('library launch is present in Strength Coach and habits; both reuse same encrypted session callback',()=>{
 const coach=source('strength-coach-v5775910.js');const main=source('main-full-v57759402510.js');
 const ui=source('strength-exercise-library-ui-v059131.js');
 assert.match(coach,/str131-library-launch/);assert.match(coach,/openExerciseLibrary131\(\{state,onSession\}\)/);
 assert.match(main,/action==='str131-library-open'/);assert.match(main,/openExerciseLibrary131\(\{state,onSession:storeStrengthGuidedSession\}\)/);
 assert.match(main,/async function storeStrengthGuidedSession\(session\)/);
 assert.match(main,/st\.strengthGuidedSessions=/);
 assert.match(ui,/guided\.openGuidedWorkout\(\{plan,onSession\}\)/);
 assert.match(ui,/data-search/);
 assert.match(ui,/data-pick/);
 assert.match(ui,/data-sets/);
});
test('release version consistent',()=>{
 assert.equal(JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8')).version,'0.5.91.31');
 assert.equal(JSON.parse(readFileSync(new URL('package.json',client),'utf8')).version,'0.5.91.31');
 assert.match(source('compass-release-v57759402519.js'),/0\.5\.91\.31/);
 assert.match(source('main-full-v57759402510.js'),/COMPASS_CLIENT_VERSION='0\.5\.91\.31'/);
});
