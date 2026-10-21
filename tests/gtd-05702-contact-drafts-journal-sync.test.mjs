import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {addContactEntry, contactSummary, contactInitiatorLabel, validContactEntry} from '../client/src/people-relationships-v24.js';
const main=fs.readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const code=fs.readFileSync(new URL('../client/src/people-relationships-v24.js',import.meta.url),'utf8');
test('historical contact entries retain valid unknown initiator',()=>{
 const old={id:'x',day:'2026-10-20',type:'message',note:'Hallo'};
 assert.equal(validContactEntry(old,'2026-10-21'),true);
 assert.equal(contactSummary({contactLog:[old]},'2026-10-21').items.length,1);
 assert.equal(contactInitiatorLabel(old.initiator),'Nicht erfasst');
});
test('contact initiator is explicit and preserved in new entries',()=>{
 const entry={id:'y',day:'2026-10-20',type:'call',note:'Rückruf',initiator:'other'};
 assert.equal(validContactEntry(entry,'2026-10-21'),true);
 assert.equal(validContactEntry({...entry,initiator:'invalid'},'2026-10-21'),false);
 const result=addContactEntry({id:'p',contactLog:[]},entry,'2026-10-21');
 assert.equal(result.person.contactLog[0].initiator,'other');
 assert.equal(contactInitiatorLabel('other'),'Von der anderen Person');
});
test('contact drafts saved in encrypted vault without re-render on each keystroke',()=>{
 assert.match(main,/state\.contactDrafts\?\?=\{\}/);
 assert.match(main,/contactDraftSaveTimer=setTimeout\(\(\)=>\{persist\(\)/);
 assert.match(main,/if\(tab==='people'&&!contactSaving&&editingContact/);
 assert.match(main,/if\(s\.contactDrafts\)delete s\.contactDrafts\[id\]/);
 assert.match(code,/initiator:item\.initiator\|\|'unknown'/);
});
test('journal sync visibly diagnoses actual remote worktime status',()=>{
 assert.match(main,/journalRemoteActiveStart=remoteData\.quickWorktime\?\.activeStart\|\|''/);
 assert.match(main,/journalRemoteVersion=Number\(remote\?\.version\|\|0\)/);
 assert.match(main,/journalLastError=ex\.message/);
 assert.match(main,/Cloud-Timer seit/);
});
