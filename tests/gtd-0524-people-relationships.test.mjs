import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CONTACT_TYPES,addContactEntry,contactSummary,contactReviewQueue,updateContactReviewDays,validContactEntry} from '../client/src/people-relationships-v24.js';
const TODAY='2026-10-19';
const person={id:'p1',name:'Testkontakt',tag:'testkontakt'};
const example=(id='a',day='2026-09-01',note='Gesprochen')=>({id,day,note,type:'call'});

test('0.5.24 history is opt-in; no invented contacts from calendar or Inbox',()=>{
 assert.equal(contactSummary(person,TODAY).hasHistory,false);
 assert.equal(contactSummary(updateContactReviewDays(person,30),TODAY).due,false);
 assert.deepEqual(contactReviewQueue({p1:updateContactReviewDays(person,30)},TODAY),[]);
});
test('0.5.24 manual confirmed contact is dated, sorted, and preserves notes',()=>{
 const a=addContactEntry(person,example('a','2026-09-01','<script>'),TODAY).person;
 const b=addContactEntry(a,example('b','2026-10-18','Neue Notiz'),TODAY).person;
 assert.deepEqual(contactSummary(b,TODAY).items.map(x=>x.id),['b','a']);
 assert.equal(contactSummary(b,TODAY).last.note,'Neue Notiz');
 assert.equal(contactSummary(b,TODAY).daysSince,1);
 assert.equal(addContactEntry(b,example('a'),TODAY).added,false);
});
test('0.5.24 invalid or future contact dates, types and notes rejected',()=>{
 for(const value of [example('x','2026-10-20'),example('x','2026-02-30'),{...example(),type:'fictional'}, {...example(),note:'a'.repeat(1201)}, {...example(),id:''}]){
  assert.equal(validContactEntry(value,TODAY),false);
  assert.throws(()=>addContactEntry(person,value,TODAY));
 }
 assert.equal(validContactEntry(example(),TODAY),true);
});
test('0.5.24 voluntary relationship follow-ups only when explicit opt-in and history exists',()=>{
 const a=addContactEntry(person,example('a','2026-09-01'),TODAY).person;
 assert.equal(contactSummary(a,TODAY).due,false);
 const opted=updateContactReviewDays(a,'30');
 assert.equal(contactSummary(opted,TODAY).due,true);
 assert.equal(contactReviewQueue({p1:opted},TODAY).length,1);
 assert.equal(contactSummary(updateContactReviewDays(opted,0),TODAY).due,false);
 assert.throws(()=>updateContactReviewDays(person,17));
});
test('0.5.24 confirmed calendar contact may be recorded once with stable source id',()=>{
 const a=addContactEntry(person,{...example('a'),sourceEventId:'event-A'},TODAY).person;
 assert.equal(addContactEntry(a,{...example('b'),sourceEventId:'event-A'},TODAY).added,false);
});
test('0.5.24 UI contains contact log, open agenda, and review integration',()=>{
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(source,/COMPASS_CLIENT_VERSION='0\.5\.33'/);
 for(const needle of ['person-contact-form','person-review-days-form','person-contact-delete','people-agenda-first','contactReviewQueue','person-review-open'])assert.ok(source.includes(needle),needle);
 assert.ok(!source.includes('automatisch als stattgefunden'));
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(css,/\.people-contact-row/);
 assert.ok(CONTACT_TYPES.length>=4);
});
