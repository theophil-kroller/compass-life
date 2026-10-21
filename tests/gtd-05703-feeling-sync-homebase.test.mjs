import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {mergeFeelingCheckins,mergeJournalData} from '../client/src/personal-journal-v5692.js';
import {safePersonDetails} from '../client/src/relationship-radar-v564.js';
import {newSalt,syncKeyFromPhrase,encryptSection,decryptSection} from '../client/src/private-device-sync-v30.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const row=(id,edit)=>({id,at:'2026-10-21T10:00:00.000Z',day:'2026-10-21',items:[{id:'joy',intensity:edit?8:6}],note:edit?'Nachträglich reflektiert':'Morgens',...(edit?{editedAt:'2026-10-21T11:00:00.000Z'}:{})});
test('0.5.70.3 newly logged emotion from phone joins earlier desktop chronicle without duplicate',()=>{
 const phone={feelingCheckins:[row('phone')]};
 const desktop={feelingCheckins:[row('desktop')]};
 const incoming=mergeJournalData(desktop,phone);
 assert.equal(incoming.feelingCheckins.length,2);
 assert.deepEqual(mergeJournalData(incoming,phone).feelingCheckins,incoming.feelingCheckins);
 assert.deepEqual(mergeJournalData(phone,desktop).feelingCheckins,incoming.feelingCheckins);
});
test('0.5.70.3 an edited check-in retains original timestamp and overrides stale version',()=>{
 const edit=row('same',true),old=row('same');
 assert.deepEqual(mergeFeelingCheckins([old],[edit]),[edit]);
 assert.deepEqual(mergeFeelingCheckins([edit],[old]),[edit]);
 assert.equal(mergeFeelingCheckins([old],[edit])[0].at,old.at);
});
test('0.5.70.3 imported legacy journal without feelings preserves both local and cloud check-ins',()=>{
 const local={feelingCheckins:[row('phone')],quickWorktime:{activeStart:'2026-10-21T09:34:00.000Z',updatedAt:'2026-10-21T09:34:00.000Z',sessions:[]}};
 const legacy={quickWorktime:{activeStart:'',updatedAt:'2026-10-20T17:00:00.000Z',sessions:[]}};
 const joined=mergeJournalData(local,legacy);
 assert.deepEqual(joined.feelingCheckins,local.feelingCheckins);
 assert.equal(joined.quickWorktime.activeStart,local.quickWorktime.activeStart);
});
test('0.5.70.3 encrypted journal roundtrip includes personal feelings',async()=>{
 globalThis.crypto??=webcrypto;
 const salt=newSalt(),key=await syncKeyFromPhrase('Mein-sicherer-Test-Schluessel-24!',salt);
 const payload=mergeJournalData({feelingCheckins:[row('f1')],quickWorktime:{activeStart:'2026-10-21T09:34:00.000Z',updatedAt:'2026-10-21T09:34:00.000Z',sessions:[]}},{});
 const cipher=await encryptSection(key,'journal',payload);
 assert.ok(!cipher.ciphertext.includes('Morgens'));
 assert.deepEqual(await decryptSection(key,'journal',cipher),payload);
});
test('0.5.70.3 cloud sync carries feelings and confirms after roundtrip',()=>{
 assert.match(main,/function journalSyncPayload\(st\).*feelingCheckins/);
 assert.match(main,/function journalFingerprint\(s\).*feelingCheckins/);
 assert.match(main,/const checked=await mirrorGet\('journal'\)/);
 assert.match(main,/const checkedData=await decryptSection\(cfg\.key,'journal',checked\)/);
 assert.match(main,/journalRemoteActiveStart=checkedData\.quickWorktime\?\.activeStart/);
});
test('0.5.70.3 homebase city and country are optional, trimmed and bounded',()=>{
 assert.deepEqual(safePersonDetails({homeCity:' Graz ',homeCountry:' Österreich '}).homeCity,'Graz');
 assert.equal(safePersonDetails({homeCity:'Graz',homeCountry:'Österreich'}).homeCountry,'Österreich');
 assert.throws(()=>safePersonDetails({homeCity:'x'.repeat(121)}));
 assert.match(main,/name="homeCity"/);
 assert.match(main,/name="homeCountry"/);
});
