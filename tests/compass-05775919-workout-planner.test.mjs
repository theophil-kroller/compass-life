import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

const read=name=>readFileSync(new URL('../client/src/'+name,import.meta.url),'utf8');
const source=read('strength-coach-v5775910.js');
const css=read('strength-coach-v5775910.css');
const catalog=[
 ['ab-wheel-kneeling','core'],['plank','core'],['dead-bug','core'],
 ['dumbbell-floor-press','chest'],['dumbbell-row','back'],['dumbbell-pullover','back'],
 ['dumbbell-lateral-raise','shoulders'],['goblet-squat','quads'],
 ['dumbbell-romanian-deadlift','posterior'],['dumbbell-shoulder-press','shoulders'],
 ['barbell-overhead-press','shoulders'],['barbell-row','back'],
 ['bench','chest'],['squat','quads'],['deadlift','posterior'],['military-press','shoulders'],
 ['lat-pulldown','back'],['cable-straight-arm-pulldown','back'],
 ['cable-single-arm-row','back'],['cable-lateral-raise','shoulders'],
 ['cable-rear-delt-fly','shoulders'],['face-pull','shoulders'],
 ['cable-crunch','core'],['cable-woodchop','core']
].map(([id,primary])=>({id,name:id,primary,secondary:[]}));
function context(events=[],unassigned=0){
 const ctx=createContext({
  EXERCISES:catalog,
  strengthPeriod:()=>({events,unassigned,sessions:[],groups:[],knownSets:events.length}),
  detailedMuscleData:()=>({regions:{}}),
  console,
  localStorage:{getItem:()=>null,setItem:()=>{}},
 });
 const transformed=source.replace(/^import .*;\s*$/gm,'').replace(/export (function|const) /g,'$1 ');
 runInContext(transformed+'\nthis.plan=planNextWorkout;this.legacy=proposeStrengthTraining;this.copy=coachCopyText;',ctx);
 return ctx;
}
const log=(id,day,reps=8)=>({exerciseId:id,day,reps});
test('No Garmin assignment does not become a false undertrained-muscle conclusion',()=>{
 const c=context([],75),p=c.plan({}, {goal:'balance',equipment:'home',today:'2026-10-25'});
 assert.equal(p.evidence,'none');assert.equal(p.known,0);assert.equal(p.missing,75);
 assert.equal(p.cautious,false);assert.equal(p.history.usable,false);
 assert.ok(p.exercises.every(x=>catalog.some(c=>c.id===x.id)));
 assert.ok(p.recoveryNote.includes('Keine zugeordneten'));
});
test('V-Taper is properly home-equipment-filtered with real set prescriptions',()=>{
 const p=context().plan({},{goal:'vtaper',equipment:'home',today:'2026-10-25',minutes:45});
 assert.ok(p.exercises.some(x=>x.id==='dumbbell-row'));
 assert.ok(p.exercises.some(x=>x.id==='dumbbell-lateral-raise'));
 assert.ok(p.exercises.every(x=>!x.id.startsWith('cable-')));
 assert.equal(p.exercises.length,5);
 for(const x of p.exercises){assert.ok(x.sets>=1);assert.ok(x.reps);assert.ok(x.restSeconds>=30);}
});
test('Gym Strength alternates StrongLifts A/B from last classified session, deadlift is 1x5',()=>{
 const a=context().plan({},{goal:'strength',equipment:'gym',today:'2026-10-25'});
 assert.equal(a.variant,'A');assert.deepEqual(Array.from(a.exercises,x=>x.id),['squat','bench','barbell-row']);
 assert.ok(a.exercises.every(x=>x.sets===5&&x.reps==='5'));
 const b=context([log('squat','2026-10-23',5),log('bench','2026-10-23',5),log('barbell-row','2026-10-23',5)]).plan({}, {goal:'strength',equipment:'gym',today:'2026-10-25'});
 assert.equal(b.variant,'B');assert.deepEqual(Array.from(b.exercises,x=>x.id),['squat','military-press','deadlift']);
 const deadlift=b.exercises.find(x=>x.id==='deadlift');assert.equal(deadlift.sets,1);assert.equal(deadlift.reps,'5');
 const next=context([log('military-press','2026-10-24',5),log('deadlift','2026-10-24',5)]).plan({},{goal:'strength',equipment:'gym',today:'2026-10-25'});
 assert.equal(next.variant,'A');
});
test('Recently recorded work triggers caution, not medical readiness or fake rest score',()=>{
 const d='2026-10-24';
 const rows=[log('dumbbell-row',d),log('goblet-squat',d),log('dumbbell-lateral-raise',d),log('dead-bug','2026-10-20'),log('goblet-squat','2026-10-20'),log('dumbbell-floor-press','2026-10-20')];
 const p=context(rows).plan({},{goal:'vtaper',equipment:'home',today:'2026-10-25'});
 assert.equal(p.cautious,true);assert.equal(p.history.usable,true);
 assert.ok(p.recoveryNote.includes('nächsten geeigneten Trainingstag'));
 assert.ok(p.exercises.some(x=>x.ageDays===1));
});
test('Short slot warns if Strength 5x5 does not fit; never silently reduces sets',()=>{
 const p=context().plan({},{goal:'strength',equipment:'gym',minutes:25,today:'2026-10-25'});
 assert.equal(p.timeFit,'longer');assert.ok(p.estimatedMinutes>25);
 assert.deepEqual(Array.from(p.exercises,x=>x.sets),[5,5,5]);
});
test('User-visible next plan can be copied, but no state mutation or fabricated weights',()=>{
 const st={key:1};const ctx=context(),p=ctx.plan(st,{goal:'abs',equipment:'home',today:'2026-10-25'});
 const copied=ctx.copy(p);assert.ok(p.exercises.some(x=>x.id==='ab-wheel-kneeling'));assert.ok(copied.includes('ab-wheel-kneeling'));
 assert.ok(copied.includes('×'));assert.ok(!copied.includes('kg'));assert.deepEqual(st,{key:1});
});
test('Legacy proposed exercises and goal filters remain compatible',()=>{
 const ctx=context(),p=ctx.legacy({},{goal:'abs',equipment:'home',today:'2026-10-25'});
 assert.equal(p.coverageKnown,false);assert.ok(p.selected.some(x=>x.id==='ab-wheel-kneeling'));
});
test('Premium dialog remains mobile-responsive, settings device-local, no eager dependencies',()=>{
 assert.match(css,/\.str619-options/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/@media\(max-width:390px\)/);
 assert.match(source,/WORKOUT_PREF_KEY=/);
 assert.match(source,/localStorage\.setItem\(WORKOUT_PREF_KEY/);
 assert.match(source,/\.str619-copy/);
 assert.doesNotMatch(source,/fetch\(/);
 assert.doesNotMatch(source,/createOscillator|AudioContext/);
});
