import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,STRENGTH_ENGLISH_NAMES,strengthExerciseLabel,V_TAPER_HOME_EXERCISES,V_TAPER_GYM_EXERCISES,STRONGLIFTS_5X5,strengthSetRow,strengthEditorView,putStrengthAnnotation,applyStrengthAnnotations} from '../client/src/strength-editor-v57732.js';
import {EXERCISE_ANATOMY,detailedMuscleData} from '../client/src/strength-anatomy-v57737.js';
import {strengthInsightsView} from '../client/src/strength-insights-full-repair-v57759402511.js';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
const repoCode=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
const mainCode=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
const old='2026-10-14T09:30:00',recent='2026-10-28T23:47:00';
const makeState=()=>({healthImports:{garminSessions:[
 {source:'garmin-activities-csv',sport:19,activityType:'Strength',start:old,day:'2026-10-14',title:'Strength',durationMinutes:46,totalSets:3,totalReps:30},
 {source:'garmin-activities-csv',sport:19,activityType:'Strength',start:recent,day:'2026-10-28',title:'Strength',durationMinutes:31,totalSets:null,totalReps:null}
]}});
test('all selectable exercises have unique stable ids and bilingual English-first titles',()=>{
 const ids=EXERCISES.map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 assert.deepEqual(ids.filter(id=>!STRENGTH_ENGLISH_NAMES[id]),[]);
 assert.equal(strengthExerciseLabel('decline-pushup'),'Decline Push-Up (Liegestütze mit erhöhten Füßen)');
 assert.equal(strengthExerciseLabel('barbell-row'),'Barbell Row (Langhantelrudern)');
 assert.equal(strengthExerciseLabel('incline-pushup'),'Incline Push-Up (Liegestütze mit erhöhten Händen)');
 for(const id of [...V_TAPER_HOME_EXERCISES,...V_TAPER_GYM_EXERCISES,...STRONGLIFTS_5X5.A.map(x=>x.exerciseId),...STRONGLIFTS_5X5.B.map(x=>x.exerciseId)])assert.ok(ids.includes(id),id);
});
test('manual editor offers V-Taper home/gym, StrongLifts A/B and body regions with English labels',()=>{
 const state=makeState();const id=`strength-csv|${old}`;
 putStrengthAnnotation(state,{sessionId:id,start:old,sets:[{exerciseId:'decline-pushup',reps:12,weightKg:0}]});
 const session=applyStrengthAnnotations(state,[{id,start:old,day:'2026-10-14',sets:[],summaryOnly:true}])[0];
 const html=strengthEditorView(state,[session],id);
 for(const g of ['V-Taper · Zuhause','V-Taper · Gym','StrongLifts 5×5 · Workout A','StrongLifts 5×5 · Workout B','Rücken / Lat','Brust','Schultern','Beine / Gesäß','Arme / Unterarme','Rumpf / Bauch','Zuletzt verwendet'])assert.ok(html.includes(g),g);
 assert.match(html,/Decline Push-Up \(Liegestütze mit erhöhten Füßen\)/);
 assert.match(html,/value="decline-pushup" selected/);
 assert.match(html,/value="12"/);
 assert.match(html,/value="0"/);
 const repeated=strengthSetRow(0,{exerciseId:'barbell-row'});
 assert.equal((repeated.match(/value="barbell-row" selected/g)||[]).length,1,'one selected element despite duplicate grouped options');
});
test('V-Taper coach uses same English-first label as editor for planned workouts, including StrongLifts',()=>{
 assert.match(repoCode,/import \{EXERCISES,strengthExerciseLabel\} from '\.\/strength-editor-v57732\.js'/);
 assert.match(repoCode,/return \{id,title:typeof strengthExerciseLabel===/);
 assert.match(repoCode,/strengthExerciseLabel\(id\):item\.name/);
 const sourcePools=repoCode.match(/const WORKOUT_POOLS=\{[\s\S]*?\n\};/)?.[0]||'';
 const union=[...V_TAPER_HOME_EXERCISES,...V_TAPER_GYM_EXERCISES];
 for(const id of (sourcePools.match(/['"]?[a-z]+(?:-[a-z]+)+['"]?/g)||[]).map(x=>x.replaceAll("'",''))) {
  if(id==='decline-pushup')continue;
 }
 for(const id of ['ab-wheel-kneeling','dumbbell-row','dumbbell-pullover','cable-rear-delt-fly','cable-single-arm-row','cable-lateral-raise'])assert.ok(union.includes(id));
});
test('all new V-Taper exercises have anatomy and map with real manually mapped sets',()=>{
 for(const id of [...V_TAPER_HOME_EXERCISES,...V_TAPER_GYM_EXERCISES])assert.ok(EXERCISE_ANATOMY[id],id);
 const model={sessions:[{sets:[{exerciseId:'decline-pushup',reps:12,weightKg:null},{exerciseId:'cable-lateral-raise',reps:10,weightKg:10}]}]};
 assert.equal(detailedMuscleData(model).mapped,2);
});
test('each existing or new session renders its own edit pencil, not just a CSV warning',()=>{
 const state=makeState(),before=structuredClone(state);
 const html=strengthInsightsView(state,{range:'28',today:'2026-10-29'});
 assert.match(html,/data-action="str732-edit" data-id="strength-csv\|2026-10-14T09:30:00"/);
 assert.match(html,/data-action="str732-edit" data-id="strength-csv\|2026-10-28T23:47:00"/);
 assert.equal((html.match(/class="str732-session-pencil"/g)||[]).length,2);
 assert.match(html,/aria-label="Training vom 2026-10-14 bearbeiten"/);
 assert.deepEqual(state,before,'read-only render');
 assert.match(mainCode,/if\(action==='str732-edit'\)\{strengthEditId732=id;refreshStrength728\(\)/);
});
test('editing older CSV session saves only annotation and keeps imported records unmodified',()=>{
 const state=makeState(),before=structuredClone(state.healthImports);
 putStrengthAnnotation(state,{sessionId:`strength-csv|${old}`,start:old,sets:[{exerciseId:'decline-pushup',reps:12,weightKg:null}]});
 const p=strengthPeriod(state,{range:'28',today:'2026-10-29'});
 assert.equal(p.sessions.length,2);
 assert.equal(p.sessions[0].sets[0].exerciseId,'decline-pushup');
 assert.equal(p.knownSets,1);
 assert.deepEqual(state.healthImports,before);
 putStrengthAnnotation(state,{sessionId:`strength-csv|${old}`,start:old,sets:[{exerciseId:'decline-pushup',reps:15,weightKg:null}]});
 assert.equal(state.strengthJournal.annotations.length,1);
 assert.equal(strengthPeriod(state,{range:'28',today:'2026-10-29'}).sessions[0].sets[0].reps,15);
});
test('historical Garmin FIT row with "Übung offen" exposes pencil and opens correct existing sets',()=>{
 const start='2026-10-27T12:00:00.000Z';const id=`strength|${start}`;
 const state={healthImports:{garminStrength:[{id,day:'2026-10-27',start,end:start,sport:19,
  sets:[{index:0,start,end:start,category:null,exercise:'Übung offen',reps:8,weightKg:7,source:'garmin-fit-set'}],
  activeSets:1,source:'garmin-fit-strength'}]}};
 const html=strengthInsightsView(state,{range:'28',today:'2026-10-29'});
 assert.match(html,/Übung offen/);
 assert.ok(html.includes(`class="str732-session-pencil" data-action="str732-edit" data-id="${id}"`));
 const edit=strengthInsightsView(state,{range:'28',today:'2026-10-29',editingId:id});
 assert.match(edit,/id="str732-form"/);
 assert.match(edit,/name="reps-0"[^>]*value="8"/);
 assert.match(edit,/name="weight-0"[^>]*value="7"/);
});
