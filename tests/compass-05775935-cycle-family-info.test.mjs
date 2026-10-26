import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {familyTodayObservations,familyTodayPanel,familySuggestions} from '../client/src/family-radar-v5775931.js';
import {shoulderRegions35,coachCycle35,saveCycleAction35,readCycle35} from '../client/src/strength-cycle-v5775935.js';
import {compass5935CycleReleaseBridge} from '../client/compass5935-cycle-release-bridge.js';

const today='2026-10-26';
const child={id:'n',name:'Nathanael',relationKind:'family'};
const adult={id:'b',name:'Bettina Klampfer',relationKind:'friend'};
const e=(id,summary,date)=>({id,summary,start:{date},status:'confirmed'});
const calendar=[e('english','Nathanael: Englisch-Schularbeit','2026-11-04'),e('math','Nathanael: Mathematik-Schularbeit','2026-11-08'),e('adult','Bettina Klampfer: Mathematik-Schularbeit','2026-11-03')];

test('An English exam next week appears as an informational Today notice without generating learning tasks',()=>{
 const people={n:child,b:adult};const state={tasks:{},projects:{}};
 const suggestions=familySuggestions(calendar,people,state,{today});
 assert.ok(!suggestions.some(x=>x.id==='english'),'English is observe-only by default');
 const info=familyTodayObservations(calendar,people,state,{today});
 assert.deepEqual(info.map(x=>x.id),['english','math']);
 const html=familyTodayPanel(suggestions,info);
 assert.match(html,/Englisch-Schularbeit/);
 assert.match(html,/Schularbeit im Blick behalten/);
 assert.doesNotMatch(html,/Bettina/);
 assert.equal(Object.keys(state.tasks).length,0);
 assert.ok((html.match(/data-action="fr31-person"/g)||[]).length<=2);
});
test('Informationshinweise are hidden when the exam is more than 14 days away or the family role is disabled',()=>{
 assert.deepEqual(familyTodayObservations([e('late','Nathanael: Englisch-Schularbeit','2026-11-13')],{n:child},{},{today}),[]);
 assert.deepEqual(familyTodayObservations(calendar,{n:child},{familyRadar:{rules:{n:{enabled:false}}}},{today}),[]);
 const unmatchedChild=familyTodayObservations(calendar,{b:adult},{},{today});
 assert.deepEqual(unmatchedChild.map(x=>x.id),['english','math']);
 assert.ok(unmatchedChild.every(x=>x.personId===null),'only already-confirmed child prefixes may appear before People sync');
 assert.ok(unmatchedChild.every(x=>x.personName!=='Bettina Klampfer'));
});
test('Observational exam deduplicates a same-event actionable math suggestion',()=>{
 const proposals=familySuggestions(calendar,{n:child},{},{today});
 const info=familyTodayObservations(calendar,{n:child},{},{today});
 const html=familyTodayPanel(proposals,info);
 assert.equal((html.match(/Mathematik-Schularbeit/g)||[]).length,1);
 assert.equal((html.match(/Englisch-Schularbeit/g)||[]).length,1);
});
test('Longer-term cycle is opt-in, never inferred from one night of Garmin data',()=>{
 const no=coachCycle35({}, {today,health:{attention:true},history:{valid:[]}});
 assert.equal(no.week,null);assert.equal(no.suggestDeload,false);assert.equal(no.deloadActive,false);
 const active=coachCycle35({}, {today:'2026-11-03',cycle:{startDay:today},history:{valid:[]}});
 assert.equal(active.week,2);assert.equal(active.phase,'build');
 const review=coachCycle35({}, {today:'2026-12-09',cycle:{startDay:today},history:{valid:[]}});
 assert.equal(review.dueReview,true);assert.equal(review.phase,'review');
});
test('Multi-signal deload remains advice and explicit user choice',()=>{
 const state={strengthGuidedSessions:[{source:'compass-guided-v5920',startedAt:'2026-10-25T09:00:00Z',exercises:[{confirmedSets:[0,0,0,1,1].map(rir=>({confirmed:true,rir}))}]}]};
 const recommended=coachCycle35(state,{today,goal:'vtaper',health:{attention:true},history:{valid:[]},cycle:{startDay:today}});
 assert.equal(recommended.suggestDeload,true);assert.equal(recommended.deloadActive,false);
 const noHealth=coachCycle35(state,{today,goal:'vtaper',health:{attention:false},history:{valid:[]},cycle:{startDay:today}});
 assert.equal(noHealth.suggestDeload,false);
 const chosen=coachCycle35(state,{today,health:{attention:true},history:{valid:[]},cycle:{startDay:today,deloadUntil:'2026-11-01'}});
 assert.equal(chosen.deloadActive,true);
});
test('Shoulder-region counts include only identified exercises; broad Garmin category remains unknown',()=>{
 const history={valid:[{day:today,exerciseId:'dumbbell-lateral-raise'},{day:today,exerciseId:'cable-rear-delt-fly'},{day:today,exerciseId:'face-pull'},{day:today,exerciseId:null}],usable:true};
 const m=shoulderRegions35(history,today);
 assert.deepEqual(m.counts,{lateral:1,posterior:2,anterior:0});assert.equal(m.recognised,3);
});
test('Cycle preference actions need opt-in and are local only',()=>{
 const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 try{
  assert.equal(readCycle35(),null);
  assert.equal(saveCycleAction35('invalid',today),null);
  assert.equal(readCycle35(),null);
  saveCycleAction35('start',today);assert.equal(readCycle35().startDay,today);
  saveCycleAction35('deload',today);assert.equal(readCycle35().deloadUntil,'2026-11-01');
  saveCycleAction35('resume',today);assert.equal(readCycle35().deloadUntil,null);
 }finally{delete globalThis.localStorage;}
});
test('.35 version release replaces only the previous verified badge and app version',()=>{
 const p=compass5935CycleReleaseBridge();
 const app=p.transform("const COMPASS_CLIENT_VERSION='0.5.77.59.34'; const x='Build 0.5.77.59.34';",'/repo/client/src/main.js').code;
 assert.match(app,/0\.5\.77\.59\.35/);
 const lock=p.transform("const x='Build 0.5.77.59.34';",'/repo/client/src/ars-vivendi-lock-v5775922.js').code;
 assert.match(lock,/0\.5\.77\.59\.35/);
 assert.throws(()=>p.transform('unrelated','/repo/client/src/main.js'),/badge/);
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5934CoachBridge\(\)\)/);
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5935CycleReleaseBridge\(\)\)/);
});
test('Family and Coach functions are wired through existing narrow integration, not a second Today data fetch',()=>{
 const bridge=readFileSync(new URL('../client/compass5931-family-radar-bridge.js',import.meta.url),'utf8');
 assert.match(bridge,/familyTodayObservations\(familyVisible,familyPeople,state/);
 const coach=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 assert.match(coach,/coachCycle35/);assert.match(coach,/data-cycle35/);
 assert.doesNotMatch(coach,/getCurrentPosition/);
});
