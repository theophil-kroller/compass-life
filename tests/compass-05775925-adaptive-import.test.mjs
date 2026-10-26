import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {compass5910StrengthHabitsBridge} from '../client/compass5910-strength-habits-bridge.js';
const root=new URL('../',import.meta.url);
const text=readFileSync(new URL('client/src/strength-coach-v5775910.js',root),'utf8');
const guided=readFileSync(new URL('client/src/strength-guided-v5775920.js',root),'utf8');
const EXERCISES=['dumbbell-row','dumbbell-lateral-raise','dumbbell-pullover','goblet-squat','dumbbell-romanian-deadlift','ab-wheel-kneeling','dumbbell-floor-press','squat','bench','barbell-row','military-press','deadlift','lat-pulldown','cable-lateral-raise','cable-rear-delt-fly','cable-single-arm-row','cable-crunch','cable-straight-arm-pulldown','cable-woodchop','face-pull'].map(id=>({id,name:id,primary:id.includes('row')||id.includes('pulldown')||id.includes('pullover')?'back':id.includes('lateral')?'shoulders':'core',secondary:[]}));
const translated=text.replace(/^import .*;\s*$/gm,'').replace(/export (function|const) /g,'$1 ');
const ctx={EXERCISES,strengthPeriod:()=>({events:[],sessions:[],unassigned:0}),detailedMuscleData:()=>({regions:{}}),Date,Intl,Math,Number,String,localStorage:{getItem:()=>null,setItem:()=>{}},console};
const api=runInNewContext(translated+'\nthis.API={planNextWorkout,strengthProgressionForExercise};',ctx);
const last=(kg,reps)=>({valid:reps.map((r,i)=>({exerciseId:'dumbbell-row',weightKg:kg,reps:r,day:'2026-10-25',sessionId:'c1',setNumber:i+1}))});

test('Double progression retains actual weight; suggests higher reps until every planned set reaches upper bound',()=>{
 const r=api.strengthProgressionForExercise(last(8,[9,10,10]),'dumbbell-row',{reps:'8–12',sets:3,equipment:'home'});
 assert.equal(r.lastKg,8);assert.equal(r.action,'increase-reps');assert.equal(r.suggestedKg,null);
});
test('Load increase is separate suggestion, never silently applied to previous weight',()=>{
 const r=api.strengthProgressionForExercise(last(8,[12,12,12]),'dumbbell-row',{reps:'8–12',sets:3,equipment:'home'});
 assert.equal(r.lastKg,8);assert.equal(r.suggestedKg,10);assert.equal(r.action,'increase-load');
 const gym=api.strengthProgressionForExercise(last(60,[5,5,5,5,5]),'dumbbell-row',{reps:'5',sets:5,equipment:'gym',strongLifts:true});
 assert.equal(gym.lastKg,60);assert.equal(gym.suggestedKg,62.5);
});
test('Home equipment total 28 kg is respected in progression',()=>{
 const r=api.strengthProgressionForExercise(last(28,[12,12,12]),'dumbbell-row',{reps:'8–12',sets:3,equipment:'home'});
 assert.equal(r.action,'max-home');assert.equal(r.suggestedKg,null);
});
test('Unknown or inconsistent workout does not invent a weight progression',()=>{
 const unknown=api.strengthProgressionForExercise({valid:[{exerciseId:'dumbbell-row',weightKg:null,reps:12,day:'2026-10-25',sessionId:'c1'}]},'dumbbell-row',{reps:'8–12',sets:3});
 assert.equal(unknown.lastKg,null);assert.equal(unknown.suggestedKg,null);
 const partial=api.strengthProgressionForExercise(last(8,[12]),'dumbbell-row',{reps:'8–12',sets:3});
 assert.equal(partial.suggestedKg,null);
});
test('Guided player prefills LAST ACTUAL kg, not recommended higher weight',()=>{
 assert.match(guided,/plateKg=previousLoad\(0\)/);
 assert.match(guided,/plateKg=previousLoad\(ex\)/);
 assert.match(guided,/progressionHint/);
 assert.doesNotMatch(guided,/plateKg=plan\.exercises\[0\]\.suggestedKg/);
});
test('Garmin editor Vite transform includes recents, English aliases, and nonpersisting suggestions',()=>{
 const fixture=[
 " ['pallof-press','Pallof Press','Rumpf','core',['shoulders']],",
 "export function strengthSetRow(i,s={}){",
 " const groups=['StrongLifts 5×5'],favorites=['hip-thrust'],",
 "  favoritesOptions='x',",
 "  options='<option value=\"\">Übung zuordnen …</option>'+favoritesOptions+groups.map(g=>g).join('');",
 " return '<div></div>';",
 "}",
 "const reversed=[...sessions].reverse(),pending=foo;",
 'const current=reversed.find(s=>s.id===editingId);',
 " const prior=findStrengthAnnotation(state,current),raw=prior?.sets||current.sets||[],count=80;",
 " const sets=Array.from({length:count},(_,i)=>{const s=raw[i]||{reps:null,weightKg:null};return !prior&&s.source==='garmin-fit-set'&&s.weightKg===0?{...s,weightKg:null}:s;});",
 "const html=`${prompt}<details><summary>Trainingseinheit zum Bearbeiten auswählen<details><form id=\"str732-form\"><div class=\"str732-rows\">${sets.map((set,i)=>strengthSetRow(i,set)).join('')}</div></form>`;"
 ].join('\n');
 const plugin=compass5910StrengthHabitsBridge();
 const out=plugin.transform(fixture,'/repo/client/src/strength-editor-v57732.js').code;
 assert.match(out,/function compassRecentExerciseIds/);
 assert.match(out,/compassGarminEnglishId/);
 assert.match(out,/Zuletzt verwendet/);
 assert.match(out,/strengthSetRow\(i,set,recentUsed\)/);
 assert.match(out,/if\(!prior\)for\(const item of sets\)/);
 const helperText=out.slice(out.indexOf('function compassRecentExerciseIds(state){'),out.indexOf('export function strengthSetRow(i,s={},recent=[]){'));
 const ctx2={byId:new Map([['dumbbell-row',true],['dumbbell-lateral-raise',true],['lat-pulldown',true]])};
 const result=runInNewContext(helperText+'\nthis.fn={compassGarminEnglishId,compassRecentExerciseIds};',ctx2);
 assert.equal(result.compassGarminEnglishId('ONE_ARM_DUMBBELL_ROW'),'dumbbell-row');
 assert.equal(result.compassGarminEnglishId('Lat Pulldown'),'lat-pulldown');
 assert.equal(result.compassGarminEnglishId('Arm Curl Special'),null);
 const recent=result.compassRecentExerciseIds({strengthGuidedSessions:[{startedAt:'2026-10-26T08:00:00Z',exercises:[{exerciseId:'dumbbell-row',confirmedSets:[{confirmed:true,completedAt:'2026-10-26T08:15:00Z'}]}]}],strengthJournal:{annotations:[{updatedAt:'2026-10-26T07:00:00Z',sets:[{exerciseId:'lat-pulldown'}]}]}});
 assert.deepEqual(Array.from(recent),['dumbbell-row','lat-pulldown']);
});
