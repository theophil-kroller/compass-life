import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INBOX_FLAG_TAG,inboxFlagged,visibleInboxTags,setInboxFlag} from '../client/src/inbox-flags-v27.js';
import {inboxTaskDraft} from '../client/src/inbox-promotion-v27.js';
import {tagCatalog} from '../client/src/smart-tags.js';
import {inboxRecords} from '../client/src/tasks.js';
const uid=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const record={id:uid(1),title:'Budget besprechen',note:'Fragen zur Planung',tags:['katja'],deleted:false};
const state=()=>({records:{[record.id]:{...record,tags:[...record.tags]}},tasks:{},projects:{}});
test('Inbox flag is reversible, invisible as a person tag, and uses existing synced record tags',()=>{
 const tagged=setInboxFlag(record.tags,true);
 assert.equal(inboxFlagged({tags:tagged}),true);
 assert.deepEqual(visibleInboxTags(tagged),['katja']);
 assert.deepEqual(setInboxFlag(tagged,false),['katja']);
 const s=state();s.records[record.id].tags=tagged;
 assert.equal(inboxRecords(s).length,1);
 assert.equal(tagCatalog(s).some(t=>t.tag===INBOX_FLAG_TAG),false);
});
test('Inbox flag carries to project task without leaking internal tag or changing notes and names',()=>{
 const s=state();s.records[record.id].tags=setInboxFlag(record.tags,true);
 const task=inboxTaskDraft(s,record.id,{tags:['katja'],workflow:'next'},uid(2));
 assert.equal(task.flagged,true);
 assert.deepEqual(task.tags,['katja']);
 assert.equal(task.note,'Fragen zur Planung');
 assert.equal(s.records[record.id].deleted,false);
});
test('Flag takes up one of 12 valid record tags; refuse instead of dropping a user tag',()=>{
 const twelve=Array.from({length:12},(_,i)=>'tag'+i);
 assert.throws(()=>setInboxFlag(twelve,true),/Maximal 11/);
 assert.equal(setInboxFlag(twelve,false).length,12);
 assert.equal(setInboxFlag([...twelve.slice(0,11),INBOX_FLAG_TAG],true).length,12);
});
test('Tree and Inbox rows have inline flag buttons, flagged perspective includes captured thoughts',()=>{
 const code=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(code,/class=\\?"tree-flag-toggle/);
 assert.match(code,/class=\\?"inbox-row-flag/);
 assert.match(code,/action==='inbox-flag'/);
 assert.match(code,/inboxRecords\(state\)\.filter\(inboxFlagged\)/);
 assert.match(code,/flagged:inboxFlagged\(r\)/);
 assert.match(css,/\.tree-flag-toggle\.is-flagged/);
});
