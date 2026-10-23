import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergePeopleDirectory,markChangedPeople} from '../client/src/people-sync-v57719.js';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
import {createPerformanceTrace} from '../client/src/performance-trace-v57719.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/mobile-planning-v57719.css',import.meta.url),'utf8');
test('Legacy desktop-only contacts survive an empty phone and encrypted journal union',()=>{
 const pc={one:{id:'one',name:'Andrea',tag:'andrea',note:'privat'},two:{id:'two',name:'Martin',tag:'martin'}};
 const merged=mergeJournalData({people:pc},{people:{}});
 assert.equal(Object.keys(merged.people).length,2);
 assert.deepEqual(merged.people,mergeJournalData({people:{}},{people:pc}).people);
 assert.deepEqual(mergePeopleDirectory(pc,{}).people,pc);
});
test('Conflicting same-ID changes converge with update timestamps, and deletions cannot silently resurrect',()=>{
 const pc={p:{id:'p',name:'Person A',updatedAt:'2026-10-22T20:00:00Z'}};
 const phone={p:{id:'p',name:'Person B',updatedAt:'2026-10-23T20:00:00Z'}};
 assert.equal(mergePeopleDirectory(pc,phone).people.p.name,'Person B');
 assert.deepEqual(mergePeopleDirectory(pc,phone),mergePeopleDirectory(phone,pc));
 assert.equal(Object.keys(mergePeopleDirectory(pc,phone,{p:'2026-10-23T21:00:00Z'}).people).length,0);
 const changed={p:{...pc.p,name:'Changed'}};
 const deleted=markChangedPeople(pc,changed,{},'2026-10-23T21:30:00Z');
 assert.equal(changed.p.updatedAt,'2026-10-23T21:30:00Z');
 assert.deepEqual(deleted,{});
 assert.equal(markChangedPeople(pc,{}, {},'2026-10-23T21:30:00Z').p,'2026-10-23T21:30:00Z');
});
test('Opt-in encrypted people sync is separate from ordinary task/inbox synchronization',()=>{
 const body=main.slice(main.indexOf('function journalSyncPayload(st)'),main.indexOf('async function syncPersonalJournal()'));
 assert.match(body,/peopleSyncEnabled===true/);
 assert.match(body,/peopleDeleted/);
 assert.match(main,/people-sync719-toggle/);
 assert.match(main,/ausdrücklich aktivieren/);
 assert.match(main,/Auf diesem Gerät sind keine Kontaktprofile/);
});
test('Mobile project rows prioritize full task title, completion and inspector',()=>{
 assert.match(css,/@media \(max-width:700px\)/);
 assert.match(css,/\.tree-line\.tree-task \.tree-today-check/);
 assert.match(css,/\.tree-line\.tree-task \.tree-flag-toggle/);
 assert.match(css,/white-space:normal/);
 assert.match(css,/\.tree-inline-add/);
});
test('Performance trace is disabled by default, bounded and content-free',()=>{
 let t=0;const perf=createPerformanceTrace({now:()=>t,max:3});
 perf.end('x','today',perf.start());assert.equal(perf.entries().length,0);
 perf.setEnabled(true);
 for(let i=0;i<5;i++){const a=perf.start();t+=12;perf.end('Bildschirm rendern','people',a);}
 assert.equal(perf.entries().length,3);
 assert.equal(perf.summary()[0].avg,12);
 assert.ok(!JSON.stringify(perf.entries()).includes('Fully Rose'));
 assert.match(main,/performanceTrace\.end\('Cloud-Abgleich'/);
 assert.match(main,/performanceTrace\.end\('Tresor speichern'/);
});
