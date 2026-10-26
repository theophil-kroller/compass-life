import test from 'node:test';
import assert from 'node:assert/strict';
import {familyPrefix,familyKind,familyEvents,familySuggestions,familyRules,familyAccept,familyChoose,familyTodayPanel,familyPersonPanel} from '../client/src/family-radar-v5775931.js';
const d='2026-10-28';
const person={id:'n1',name:'Nathanael',aliases:'Nathaniel'};
const other={id:'s1',name:'Seraphina'};
const event=(id,summary,day)=>({id,summary,start:{date:day},status:'confirmed'});
const events=[
 event('math7','Nathanael: Mathematik-Schularbeit in einer Woche','2026-11-04'),
 event('math','Nathanael: Mathematik-Schularbeit','2026-11-11'),
 event('en','Nathanael: Englisch-Schularbeit','2026-11-07'),
 event('holiday','Nathanael: Herbstferien','2026-10-29'),
 event('deadline','Nathanael: Praktikumsplatz und Unterlagen spätestens abgeben!','2026-11-18'),
 event('project','Nathanael: Projektwoche Berufsorientierung','2026-11-15'),
 event('stranger','Seraphina: Mathematik-Schularbeit','2026-11-08'),
 event('work','Arbeit: Besprechung','2026-11-05')
];
let nonce=0;const uuid=()=>`00000000-0000-4000-8000-${String(++nonce).padStart(12,'0')}`;
test('Nathanael prefix and generic person aliases, no fuzzy cross-person assignment',()=>{
 assert.equal(familyPrefix(events[1],person),'Mathematik-Schularbeit');
 assert.equal(familyPrefix(event('x','Nathaniel: Test','2026-11-12'),person),'Test');
 assert.equal(familyPrefix(events[6],person),null);
 assert.equal(familyPrefix(events[7],person),null);
 assert.equal(familyPrefix({id:'math',summary:'Nathanael: Test',status:'cancelled'},person),null);
});
test('One-week reminder folds into original without duplicate suggested task',()=>{
 const result=familyEvents(events,person,{today:d});
 assert.equal(result.filter(e=>e.kind==='exam'&&e.subject==='mathematik schularbeit').length,1);
 assert.deepEqual(result.find(e=>e.id==='math').linkedReminders,['math7']);
 assert.equal(result.filter(e=>e.id==='math7').length,0);
});
test('Mathematics advice at 14 days; English exam informational by default',()=>{
 const picks=familySuggestions(events,{n1:person},{},{today:d});
 assert.ok(picks.some(e=>e.id==='math'&&e.action.kind==='learning'));
 assert.ok(!picks.some(e=>e.id==='en'));
});
test('An organisational submission deadline is a preparation recommendation, not automatically a project',()=>{
 const picks=familySuggestions(events,{n1:person},{},{today:d});
 const due=picks.find(e=>e.id==='deadline');
 assert.equal(due.kind,'deadline');assert.equal(due.action.kind,'organise');
 assert.equal(due.day,'2026-11-18');
});
test('Holiday, project week and other events remain informational, and cancelled are excluded',()=>{
 const rows=familyEvents([...events,event('c','Nathanael: Mathematik-Test','2026-11-12')].map(e=>e.id==='c'?{...e,status:'cancelled'}:e),person,{today:d});
 assert.ok(rows.some(e=>e.kind==='holiday'));
 assert.ok(rows.some(e=>e.kind==='project'));
 assert.ok(!rows.some(e=>e.id==='c'));
});
test('Only user confirmation creates tasks; repeated acceptance is idempotent',()=>{
 const state={tasks:{},projects:{},taskPending:{}};
 const picked=familySuggestions(events,{n1:person},state,{today:d}).find(e=>e.id==='math');
 assert.equal(Object.keys(state.tasks).length,0);
 const result=familyAccept(state,picked,person,{today:d,uuid});
 assert.equal(result.created.length,2);
 assert.equal(result.created[0].category,'Familie');
 assert.equal(result.created[0].calendarSourceId,'math');
 assert.equal(result.created[0].dueDate,null);
 assert.equal(familyAccept(state,picked,person,{today:d,uuid}).created.length,0);
 assert.equal(familySuggestions(events,{n1:person},state,{today:d}).filter(e=>e.id==='math').length,0);
});
test('Accepting paperwork creates one actionable task with true deadline, not a calendar event',()=>{
 const state={tasks:{},taskPending:{},projects:{}};
 const picked=familySuggestions(events,{n1:person},state,{today:d}).find(e=>e.id==='deadline');
 const done=familyAccept(state,picked,person,{today:d,uuid});
 assert.equal(done.created.length,1);assert.equal(done.created[0].dueDate,picked.day);
 assert.equal(done.created[0].projectId,null);
 assert.equal(events.length,8); // source is never mutated
});
test('Dismiss, postpone, and existing work prevent duplicate suggestions',()=>{
 const state={familyRadar:{},tasks:{}};
 const picked=familySuggestions(events,{n1:person},state,{today:d}).find(e=>e.id==='math');
 assert.ok(familyChoose(state,picked.key,'snoozed',d));
 assert.ok(!familySuggestions(events,{n1:person},state,{today:d}).some(e=>e.id==='math'));
 assert.ok(familySuggestions(events,{n1:person},state,{today:'2026-11-01'}).some(e=>e.id==='math'));
 familyChoose(state,picked.key,'dismissed',d);
 assert.ok(!familySuggestions(events,{n1:person},state,{today:'2026-11-01'}).some(e=>e.id==='math'));
});
test('Rules are configurable per person without affecting others',()=>{
 const state={familyRadar:{rules:{n1:{mathSupport:false,otherExams:'support',mathLead:5}}}};
 assert.equal(familyRules(state,person).mathSupport,false);
 assert.equal(familyRules(state,other).mathSupport,true);
 const picks=familySuggestions(events,{n1:person},state,{today:d});
 assert.ok(picks.some(e=>e.id==='en'));
 assert.ok(!picks.some(e=>e.id==='math'));
});
test('HTML is escaped and mobile markup has no fixed-width content',()=>{
 const row=event('unsafe','Nathanael: <script>alert(1)</script>','2026-11-14');
 const render=familyPersonPanel(familyEvents([row],person,{today:d}),[],person);
 assert.doesNotMatch(render,/<script>/);assert.match(render,/&lt;script&gt;/);
 assert.match(render,/fr31-person/);
 assert.match(familyTodayPanel(familySuggestions(events,{n1:person},{},{today:d})),/fr31-today/);
});
test('Hidden and removed calendar events disappear after a refresh',()=>{
 const filtered=familyEvents(events,person,{today:d,includeHidden:e=>e.id!=='math'});
 assert.ok(!filtered.some(e=>e.id==='math'));
 const removed=familyEvents(events.filter(e=>e.id!=='deadline'),person,{today:d});
 assert.ok(!removed.some(e=>e.id==='deadline'));
});

test('18 December internship deadline becomes a proposal 21 days before due date',()=>{
 const internship=[event('18dec','Nathanael: Praktikumsplatz und Unterlagen spätestens abgeben!','2026-12-18')];
 const early=familySuggestions(internship,{n1:person},{},{today:'2026-11-25'});
 assert.equal(early.length,0);
 const onTime=familySuggestions(internship,{n1:person},{},{today:'2026-12-01'});
 assert.equal(onTime.length,1);
 assert.equal(onTime[0].day,'2026-12-18');
});

test('Explicit family internship project creates Familie folder, 4 steps and prevents duplicate projects',async()=>{
 const {familyAcceptProject}=await import('../client/src/family-radar-v5775931.js');
 const state={projects:{},tasks:{},projectPending:{},taskPending:{}};
 const chosen=familySuggestions([event('d18','Nathanael: Praktikumsplatz und Unterlagen spätestens abgeben!','2026-12-18')],{n1:person},state,{today:'2026-12-01'})[0];
 const x=familyAcceptProject(state,chosen,person,{today:'2026-12-01',uuid});
 assert.equal(x.tasks.length,4);
 assert.equal(x.project.category,'Familie');
 assert.equal(x.project.calendarSourceId,'d18');
 assert.equal(x.project.parentId,x.folder.id);
 assert.equal(x.tasks.at(-1).dueDate,'2026-12-18');
 assert.equal(familyAcceptProject(state,chosen,person,{today:'2026-12-01',uuid}).tasks.length,0);
 assert.equal(familySuggestions([event('d18','Nathanael: Praktikumsplatz und Unterlagen spätestens abgeben!','2026-12-18')],{n1:person},state,{today:'2026-12-01'}).length,0);
});
