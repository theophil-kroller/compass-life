import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {EXERCISES,manualExerciseMuscles,putStrengthAnnotation,applyStrengthAnnotations,strengthEditorView,findStrengthAnnotation} from '../client/src/strength-editor-v57732.js';
import {strengthNutrition732Bridge} from '../client/strength-nutrition732-bridge.js';
const day='2026-10-24';
const session={id:'strength-csv|2026-10-24T11:45:00',start:'2026-10-24T11:45:00',day,reportedSets:3,reportedReps:42,sets:[],summaryOnly:true};
const importFit={id:'strength|2026-10-24T09:45:00.000Z',start:'2026-10-24T09:45:00.000Z',day,reportedSets:3,sets:[{reps:15,weightKg:0,category:7},{reps:9,weightKg:0,category:7},{reps:18,weightKg:0,category:7}]};
test('editor covers >=30 independent exercises and relevant muscles',()=>{
 assert.ok(EXERCISES.length>=30);assert.equal(new Set(EXERCISES.map(x=>x.id)).size,EXERCISES.length);
 assert.equal(manualExerciseMuscles('bench').primary,'chest');assert.equal(manualExerciseMuscles('squat').primary,'quads');
 assert.equal(manualExerciseMuscles('invalid').known,false);
});
test('manual CSV mapping becomes exact observed sets in muscle map',()=>{
 const st={};const data=[{exerciseId:'bench',reps:'15',weightKg:'25'},{exerciseId:'bench',reps:'9',weightKg:'27.5'},{exerciseId:'cable-row',reps:'18',weightKg:'30'}];
 putStrengthAnnotation(st,{sessionId:session.id,start:session.start,sets:data});
 const [merged]=applyStrengthAnnotations(st,[session]);
 assert.equal(merged.sets.length,3);assert.equal(merged.sets[0].reps,15);assert.equal(merged.sets[1].weightKg,27.5);
 assert.equal(merged.sets[2].exercise,'Rudern am Kabel');assert.equal(merged.summaryOnly,false);
 assert.match(strengthEditorView(st,[merged],''),/Trainingseinheit zum Bearbeiten auswählen/);
 assert.match(strengthEditorView(st,[merged],merged.id),/name="weight-2"/);
});
test('existing user edit stays after later FIT export; new sets appended',()=>{
 const st={};putStrengthAnnotation(st,{sessionId:session.id,start:session.start,sets:[{exerciseId:'biceps-curl',reps:15,weightKg:10}]});
 const [f]=applyStrengthAnnotations(st,[importFit]);assert.equal(f.sets.length,3);
 assert.equal(f.sets[0].exerciseId,'biceps-curl');assert.equal(f.sets[0].weightKg,10);
 assert.equal(f.sets[1].reps,9);assert.equal(f.sets[2].reps,18);
 assert.equal(findStrengthAnnotation(st,importFit).sessionId,session.id);
});
test('repeat save updates annotation rather than duplicates',()=>{
 const st={};const set=[{exerciseId:'bench',reps:10,weightKg:22.5}];
 putStrengthAnnotation(st,{sessionId:session.id,start:session.start,sets:set});
 putStrengthAnnotation(st,{sessionId:session.id,start:session.start,sets:[{...set[0],weightKg:25}]});
 assert.equal(st.strengthJournal.annotations.length,1);assert.equal(st.strengthJournal.annotations[0].sets[0].weightKg,25);
});
test('rejects negative and impossible reps/weight; keeps zero and missing distinct',()=>{
 assert.throws(()=>putStrengthAnnotation({}, {sessionId:session.id,start:session.start,sets:[{exerciseId:'bench',reps:-1,weightKg:0}]}));
 const st={};putStrengthAnnotation(st,{sessionId:session.id,start:session.start,sets:[{exerciseId:'plank',reps:'',weightKg:'0'}]});
 assert.equal(st.strengthJournal.annotations[0].sets[0].reps,null);assert.equal(st.strengthJournal.annotations[0].sets[0].weightKg,0);
});
test('HTML escapes session ID and never interpolates arbitrary exercise text',()=>{
 const evil={...session,id:'evil" onmouseover="alert(1)'};
 const h=strengthEditorView({},[evil],evil.id);
 assert.ok(!h.includes('data-session-id="evil" onmouseover'));
 assert.match(h,/&quot;/);
});
test('bridge transforms actual previously shipped strength & Nutrition .31 sources',()=>{
 const bridge=strengthNutrition732Bridge(),base=process.cwd();
 for(const p of ['client/src/strength-insights-v57728.js','client/src/nutrition-fat-quality-v57731.js']){
  // On uploaded project these are existing files from 0.5.77.31.
  const code=fs.readFileSync(p,'utf8');const out=bridge.transform(code,'/source/'+p).code;
  assert.ok(out.length>code.length-2000);
  if(p.includes('strength-insights'))assert.match(out,/applyStrengthAnnotations/);
  else{assert.match(out,/Dr. Michael Greger/);assert.doesNotMatch(out,/DGE \/ ÖGE/);}
 }
});
test('source bridge refuses inconsistent bases',()=>{
 const b=strengthNutrition732Bridge();assert.throws(()=>b.transform('abc','/source/client/src/main.js'),/Integrationsanker/);
});
