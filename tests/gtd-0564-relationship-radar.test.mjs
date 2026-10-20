import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CONTACT_TYPES,addContactEntry,contactTypeLabel} from '../client/src/people-relationships-v24.js';
import {CONTACT_WEIGHTS,contactWeight,preference,contactImpulse,impulseQueue,pauseContact,mapAngle,mapPosition,mapDrop,safePersonDetails,relatedProjectIds} from '../client/src/relationship-radar-v564.js';
const today='2026-10-20';
const person=(type='call',day='2026-09-18')=>({id:'martin',name:'Martin',closeness:81,contactCadenceDays:30,contactLog:[{id:'c1',type,day,note:''}]});
test('0.5.64 communication channels use meeting > video > call > chat > email points',()=>{
 assert.deepEqual(['meeting','video','call','message','email'].map(contactWeight),[5,4,3,2,1]);
 assert.ok(CONTACT_TYPES.some(([id])=>id==='email'));
 assert.equal(contactTypeLabel('email'),'E-Mail');
});
test('0.5.64 stronger contact modestly delays impulse, never changes closeness',()=>{
 const meet=contactImpulse(person('meeting'),'2026-10-15'),mail=contactImpulse(person('email'),'2026-10-15');
 assert.ok(meet.threshold>mail.threshold);
 assert.ok(meet.score<=mail.score);
 assert.equal(preference(person('meeting')).closeness,81);
 assert.equal(contactImpulse(person('meeting'),'2026-10-15').score<=100,true);
});
test('0.5.64 pause and restart suppress contact impulse and avoid backlogged reminder',()=>{
 const p=person('call','2026-05-01');
 assert.equal(impulseQueue({martin:p},today).length,1);
 const paused=pauseContact(p,true,today);
 assert.equal(impulseQueue({martin:paused},today).length,0);
 assert.equal(contactImpulse(paused,today).reason,'Kontaktimpulse pausiert');
 const resumed=pauseContact(paused,false,today);
 assert.equal(contactImpulse(resumed,today).due,false);
 assert.equal(contactImpulse(resumed,'2026-12-01').due,true);
 assert.equal(resumed.contactLog.length,1);
});
test('0.5.64 without confirmed contact, no fake meeting and no nagging',()=>{
 assert.equal(impulseQueue({x:{id:'x',name:'X',contactCadenceDays:7}},today).length,0);
 assert.equal(contactImpulse({id:'x',contactCadenceDays:7},today).weight,0);
});
test('0.5.64 radial map stable and drag updates closeness, not contact history',()=>{
 const p=person();assert.equal(mapAngle(p),mapAngle(p));
 const near=mapDrop(p,235,245),far=mapDrop(p,235,420);
 assert.ok(near.closeness>far.closeness);
 assert.deepEqual(near.contactLog,p.contactLog);
 assert.ok(mapPosition({...p,closeness:96}).r<mapPosition({...p,closeness:15}).r);
});
test('0.5.64 editable personal details and project references are scoped',()=>{
 assert.deepEqual(safePersonDetails({partnerName:'  Nina  ',childrenInfo:'Ja',sharedHobbies:'Zouk'}),{partnerName:'Nina',childrenInfo:'Ja',sharedHobbies:'Zouk',importantEvents:'',catchUpNotes:''});
 assert.throws(()=>safePersonDetails({catchUpNotes:'x'.repeat(1201)}));
 assert.deepEqual(relatedProjectIds({relatedProjectIds:['p1','invalid']},{p1:{id:'p1'}}),['p1']);
});
test('0.5.64 UI includes navigation, quick log confirmation, map and accessible sliders',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8'),css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 for(const v of ['relationship-map','relationship-tabs','person-project-create-form','person-project-link-form','person-quick-log','person-contact-form','relationship-closeness-slider','relationship-cadence-slider','person-pause-toggle','relationship-details-form','contactImpulse','impulseQueue']) assert.ok(main.includes(v)||css.includes(v),v);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.66'/);
 assert.match(css,/linear-gradient\(90deg,#7cb1d4/);
});
