import test from 'node:test';
import assert from 'node:assert/strict';
import {schoolDeadlinesForWatch,colleaguesForWatch,colleagueMeetingRank} from '../client/src/watch-projection-v5125.js';
const localDay=s=>new Date(s).toISOString().slice(0,10);
test('Nathanael: all-day schoolwork is represented as N: regardless of exact name variant',()=>{
 const events=[
  {summary:'Nathanael: Mathematik-Schularbeit',start:{date:'2026-10-30'}},
  {summary:'Nathaniel – Englisch Prüfung',start:{date:'2026-11-01'}},
  {summary:'N: Biologie-Test',start:{date:'2026-11-03'}},
  {summary:'Nathanael: Mathematik-Schularbeit',start:{date:'2026-10-30'}},
  {summary:'Max: Biologie-Test',start:{date:'2026-11-03'}},
  {summary:'Nathanael: Schwimmtraining',start:{date:'2026-11-02'}},
 ];
 const got=schoolDeadlinesForWatch(events,'2026-10-28',localDay);
 assert.equal(got.length,3);
 assert.deepEqual(got.map(x=>x.title),['N: Mathematik-Schularbeit','N: Englisch Prüfung','N: Biologie-Test']);
});
test('dateTime and 10-day window are handled, no false unrelated deadlines',()=>{
 const e=[
 {summary:'Nathanael: Latein Klausur',start:{dateTime:'2026-10-29T08:00:00Z'}},
 {summary:'N: Geschichte Schularbeit',start:{date:'2026-11-07'}},
 {summary:'Nathanael: Test',start:{date:'2026-10-27'}}
 ];
 const got=schoolDeadlinesForWatch(e,'2026-10-28',localDay);
 assert.equal(got.length,1);assert.equal(got[0].date,'2026-10-29');
});
test('auto colleague projection excludes friends, relatives, closed tasks and notes',()=>{
 const people=[{id:'1',name:'Dr. Andrea Muster',relationKind:'colleague'},{id:'2',name:'Martin',relationKind:'friend'},{id:'3',name:'Johanna Mitarbeiter',relationKind:'colleague'}];
 const index=new Map([['1',{tasks:[{title:'Projekt besprechen',note:'secret'}],inbox:[]}],['2',{tasks:[{title:'Privater Termin'}],inbox:[]}],['3',{tasks:[],inbox:[]}]]);
 const events=[{title:'Jour fixe mit Dr. Andrea Muster',start:'09:00',end:'10:30'}];
 const got=colleaguesForWatch(people,index,events,'2026-10-28');
 assert.deepEqual(got.map(p=>p.name),['Dr. Andrea Muster','Johanna Mitarbeiter']);
 assert.deepEqual(got[0].points,['Projekt besprechen']);
 assert.equal('note' in got[0],false);
 assert.equal(colleagueMeetingRank(people[0],events),540);
 assert.equal(colleagueMeetingRank(people[0],events,"2026-10-28",600),100000);
});
