import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
import {mergeReceiptJournals} from '../client/src/receipt-gpt-v57743.js';

const time='2026-10-28T13:00:00.000Z';
const bon=(id,updatedAt=time,deleted=false)=>({id,schema:'compass_receipt_v1',date:'2026-10-28',merchant:'Spar',currency:'EUR',total:3.49,items:[{description:'Bio Brot',total:3.49}],updatedAt,deleted});
const dream=id=>({id,kind:'night',at:time,updatedAt:time,title:'Traum'});
const workout=id=>({sessionId:id,start:time,updatedAt:time,sets:[{exerciseId:'squat',reps:5,weightKg:50}]});

test('CRITICAL: previously saved receipts survive an empty remote mirror and a second merge',()=>{
  const local={receiptJournal:{entries:[bon('old')],categoryRules:{'spar|bio brot':{category:'bakery',updatedAt:time}}}};
  const result=mergeJournalData(local,{});
  assert.equal(result.receiptJournal.entries.length,1);
  assert.equal(result.receiptJournal.entries[0].id,'old');
  assert.ok(result.receiptJournal.categoryRules);
  const twice=mergeJournalData(result,{});
  assert.deepEqual(twice.receiptJournal,result.receiptJournal);
});

test('CRITICAL: a cloud receipt and a local receipt are both retained, including classification rules',()=>{
  const local={receiptJournal:{entries:[bon('local')]}};
  const remote={receiptJournal:{entries:[bon('remote')]}};
  const merged=mergeJournalData(local,remote);
  assert.deepEqual(merged.receiptJournal.entries.map(x=>x.id),['local','remote']);
  assert.deepEqual(mergeJournalData(merged,remote).receiptJournal,merged.receiptJournal);
});

test('CRITICAL: receipt tombstones win without resurrecting deleted documents',()=>{
  const original=bon('old','2026-10-28T13:00:00.000Z');
  const deleted=bon('old','2026-10-28T14:00:00.000Z',true);
  const m=mergeJournalData({receiptJournal:{entries:[original]}},{receiptJournal:{entries:[deleted]}});
  assert.equal(m.receiptJournal.entries.length,1);
  assert.equal(m.receiptJournal.entries[0].deleted,true);
  assert.equal(mergeReceiptJournals(m.receiptJournal,{}).entries[0].deleted,true);
});

test('CRITICAL: dream and strength journals also survive journal synchronisation',()=>{
  const local={dreamJournal:{entries:[dream('night')]},strengthJournal:{annotations:[workout('gym')]}};
  const merged=mergeJournalData(local,{});
  assert.equal(merged.dreamJournal.entries.length,1);
  assert.equal(merged.strengthJournal.annotations.length,1);
  assert.deepEqual(mergeJournalData(merged,{}).strengthJournal,merged.strengthJournal);
});

test('CRITICAL: actual full-source app uses exactly the same journal merge before persisting',()=>{
  const code=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
  assert.match(code,/receiptJournal:st\.receiptJournal\|\|\{entries:\[\]\}/);
  assert.match(code,/st\.receiptJournal=m\.receiptJournal/);
  const old={receiptJournal:{entries:[bon('saved')]},dreamJournal:{entries:[dream('d')]},strengthJournal:{annotations:[workout('w')]}};
  const result=mergeJournalData(old,{});
  const snapshot={...old};
  snapshot.receiptJournal=result.receiptJournal;
  snapshot.dreamJournal=result.dreamJournal;
  snapshot.strengthJournal=result.strengthJournal;
  assert.equal(snapshot.receiptJournal.entries.length,1);
  assert.equal(snapshot.dreamJournal.entries.length,1);
  assert.equal(snapshot.strengthJournal.annotations.length,1);
});
