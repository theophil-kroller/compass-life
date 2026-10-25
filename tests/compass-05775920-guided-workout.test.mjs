import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {compass5910StrengthHabitsBridge} from '../client/compass5910-strength-habits-bridge.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const guide=read('client/src/strength-guided-v5775920.js');
const coach=read('client/src/strength-coach-v5775910.js');
const bridge=read('client/compass5910-strength-habits-bridge.js');
const source=guide.replace(/^import.*$/gm,'').replace(/export (function|const) /g,'$1 ').replace('import.meta.env?.BASE_URL',"'/'")+'\nthis.API={makeGuidedSnapshot,matchingGuidedSessions,confirmedGuidedSets,exerciseMovementSvg,validPlateWeight,targetCircleLabel};';
const API=runInNewContext(source,{crypto:{randomUUID:()=> 'guided-1'},Date,Number,String,Math,RegExp});

test('workout player is dynamic-only and retains workout plan prescription',()=>{
 assert.match(bridge,/import\('\.\/strength-guided-v5775920\.js'\)/);
 assert.match(guide,/export function openGuidedWorkout/);
 assert.match(coach,/▶ Workout starten/);
 assert.match(coach,/onSession/);
 assert.match(coach,/planNextWorkout/);
 assert.doesNotMatch(read('client/src/strength-coach-v5775910.js'),/^import .*strength-guided/m);
});
test('confirmed sets are saved separately from Garmin, with null (unknown) reps/weights',()=>{
 const obj=API.makeGuidedSnapshot({goal:'vtaper',equipment:'home',title:'Test',exercises:[{id:'dumbbell-row',title:'Rudern',sets:3,reps:'8–12',restSeconds:90}]},'2026-10-25T10:00:00.000Z');
 assert.equal(obj.source,'compass-guided-v5920');
 assert.equal(obj.exercises[0].confirmedSets.length,0);
 obj.exercises[0].confirmedSets.push({confirmed:true,setNumber:1,completedAt:'2026-10-25T10:02:00Z',reps:null,weightKg:null});
 assert.equal(API.confirmedGuidedSets(obj)[0].reps,null);
 assert.equal(API.confirmedGuidedSets(obj)[0].weightKg,null);
 assert.match(guide,/data-act="confirm"/);
 assert.match(guide,/onSession\(data\)/);
});
test('Garmin association is a timestamp suggestion only, requiring manual confirmation',()=>{
 const obj=API.makeGuidedSnapshot({goal:'vtaper',equipment:'gym',title:'Test',exercises:[{id:'squat',title:'Squat',sets:3,reps:'5',restSeconds:150}]},'2026-10-25T10:00:00.000Z');
 obj.exercises[0].confirmedSets.push({confirmed:true,setNumber:1,reps:5,weightKg:55});
 const data={strengthGuidedSessions:[obj]};
 assert.equal(API.matchingGuidedSessions(data,'2026-10-25T10:10:00.000Z').length,1);
 assert.equal(API.matchingGuidedSessions(data,'2026-10-25T16:00:00.000Z').length,0);
 assert.match(bridge,/str620-prefill/);
 assert.match(bridge,/window\.confirm/);
 assert.match(bridge,/strengthSetRow/);
 assert.doesNotMatch(guide,/putStrengthAnnotation\(/);
});
test('checklist and strength top provide explicit direct-start buttons',()=>{
 assert.match(bridge,/Coach/);
 assert.match(bridge,/str620-guided-start/);
 assert.match(bridge,/str620-guided-start/);
 assert.match(bridge,/function habitQuickOverlay/);
 assert.match(bridge,/client\/src\/strength-insights-v57728\.js/);
 assert.match(bridge,/storeStrengthGuidedSession/);
});
test('state changes are durable and deduplicated, without overwriting Garmin FIT data',()=>{
 assert.match(bridge,/st\.strengthGuidedSessions/);
 assert.match(bridge,/previous\.findIndex\(item=>item\.id===session\.id\)/);
 assert.match(bridge,/await mutate\(st=>/);
 assert.doesNotMatch(bridge,/st\.healthImports\.garmin/);
});
test('schematic movement drawings have accessible descriptions and two phases',()=>{
 const markup=API.exerciseMovementSvg('ab-wheel-kneeling');
 assert.match(markup,/Start/);assert.match(markup,/Ziel/);
 assert.match(markup,/Schematische Start- und Zielhaltung/);
 assert.match(markup,/Ab Wheel/);
 assert.match(guide,/role="img"/);
});
test('no activity is counted unless user clicks set confirmed',()=>{
 assert.match(guide,/sets\.push\(\{confirmed:true/);
 assert.match(guide,/started=true;active=true/);
 assert.match(guide,/if\(started\)void persist\(finish\)/);
 assert.match(guide,/\(\!plan\?\.exercises\?\.length\)/);
});
test('strength-insights plugin inserts CTAs above Muscle Map without new Vite plugin',()=>{
 const snippet='return `<div><section class="work-card"><div class="work-heading"><span>💪 Krafttraining · Muscle Map';
 const out=compass5910StrengthHabitsBridge().transform(snippet,'/repo/client/src/strength-insights-v57728.js').code;
 assert.ok(out.indexOf('str620-guided-start')<out.indexOf('💪 Krafttraining · Muscle Map'));
 assert.ok(out.includes('strength-coach-open'));
});

test('v59.21 Coach treats StrongLifts as opt-in gym-only and home plates as shared inventory',()=>{
 assert.match(coach,/mode==='stronglifts'/);
 assert.match(coach,/location==='gym'&&mode==='stronglifts'/);
 assert.match(coach,/HOME_EQUIPMENT=\{dumbbells:2,connectorWeightKg:0,availablePlateKg:28/);
 assert.ok(coach.includes('28 kg Scheiben insgesamt'));
 assert.match(coach,/data-place="home"/);
 assert.match(coach,/data-place="gym"/);
 assert.match(bridge,/💪 Coach/);
});
test('v59.21 set circles mark explicitly confirmed reps, and enforce home total plate limit',()=>{
 assert.match(guide,/data-act="set-circle"/);
 assert.match(guide,/confirmedSets/);
 assert.match(guide,/setNumber:index/);
 assert.match(guide,/HOME_PLATES_KG=28/);
 assert.match(guide,/validPlateWeight/);
 assert.match(guide,/navigator\.wakeLock/);
 assert.equal(API.validPlateWeight(28,'home'),true);
 assert.equal(API.validPlateWeight(30,'home'),false);
 assert.equal(API.validPlateWeight(35,'gym'),true);
 assert.equal(API.targetCircleLabel('8–12 \/ Seite'),'8');
});
