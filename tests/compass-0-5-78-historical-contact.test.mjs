import {test} from 'node:test';import assert from 'node:assert/strict';
import {historicalWimHofTime,habitTimeModel} from '../client/src/habit-time-v57759402525.js';
import {touchDerivedMeetings,personWithTouchMeetings} from '../client/src/touch-contact-projection-v0578.js';
import {contactSummary} from '../client/src/people-relationships-v24.js';
const day='2026-10-30';
test('Completed historical evening Wim-Hof habit gets transparent estimate, no source mutation',()=>{
 const s={habitsQuick:{items:[{id:'wim-hof',slot:'Abend'}],completions:[{habitId:'wim-hof',day,done:true}]}};
 const before=JSON.stringify(s);
 const generated=historicalWimHofTime(s);assert.equal(generated.length,1);assert.equal(generated[0].estimated,true);assert.ok(generated[0].minutes>23);
 const model=habitTimeModel(s,{anchor:day,days:7});assert.equal(model.rows.length,1);assert.equal(model.estimatedMinutes,model.total);
 assert.equal(JSON.stringify(s),before);
});
test('Measured Wim-Hof overrides earlier estimate and never double-counts on same day',()=>{
 const s={habitsQuick:{items:[{id:'wim-hof',slot:'Abend'}],completions:[{habitId:'wim-hof',day,done:true}]},habitTimeSessions:[{id:'real',habitId:'wim-hof',at:'2026-10-30T21:00:00Z',day,minutes:13,updatedAt:'2026-10-30T21:00:00Z'}]};
 const model=habitTimeModel(s,{anchor:day,days:7});assert.equal(model.total,13);assert.equal(model.estimatedMinutes,0);
});
test('Coach time on same date as Morning activity remains when intervals do not overlap',()=>{
 const s={miracleMorning:{sessions:[{id:'mm',startedAt:'2026-10-30T06:00:00Z',finishedAt:'2026-10-30T06:30:00Z',day,steps:[{seconds:600}]}]},strengthGuidedSessions:[{id:'gym',startedAt:'2026-10-30T14:00:00Z',finishedAt:'2026-10-30T14:25:00Z'}]};
 const m=habitTimeModel(s,{anchor:day,days:7});assert.equal(m.total,35);assert.equal(m.groups.find(x=>x.habitId==='strength').minutes,25);
});
test('Person-linked touch projects exactly one meeting per day; deletion and reassignment reflected',()=>{
 const s={touchJournal:{entries:[{id:'a',personId:'ilona',kinds:['hug'],at:'2026-10-30T11:00:00'},{id:'b',personId:'ilona',kinds:['kiss'],at:'2026-10-30T16:00:00'},{id:'c',personId:'other',kinds:['hug'],at:'2026-10-30T15:00:00'}]}};
 let p=personWithTouchMeetings({id:'ilona',contactLog:[]},s);
 assert.equal(contactSummary(p,'2026-10-30').items.length,1);assert.equal(contactSummary(p,day).last.type,'meeting');
 s.touchJournal.entries[0].deleted=true;s.touchJournal.entries[1].personId='other';
 assert.equal(touchDerivedMeetings(s,'ilona').length,0);
});
test('Existing same-day confirmed meeting suppresses duplicate touch-derived record',()=>{
 const manual={id:'manual',type:'meeting',day};const s={touchJournal:{entries:[{id:'one',personId:'ilona',kind:'hug',at:'2026-10-30T09:00:00'}]}};
 assert.equal(personWithTouchMeetings({id:'ilona',contactLog:[manual]},s).contactLog.length,1);
});
