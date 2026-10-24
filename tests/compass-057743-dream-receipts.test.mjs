import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=p=>import(new URL(`../${p}`,import.meta.url).href);
const receiptExample={schema:'compass_receipt_v1',merchant:'Hofer',date:'2026-10-24',currency:'EUR',total:4.99,items:[{description:'Blaubeeren 125g',quantity:1,unit:'Pkg',unit_price:4.99,total:4.99,category:'Lebensmittel',confidence:'high'}],notes:[]};
test('three dream kinds separated from GTD dreams and sanitised',async()=>{
 const {putDreamEntry,dreamEntries,dreamInsights}=await load('client/src/dream-journal-v57743.js');
 const state={}; const n=new Date('2026-10-24T10:00:00Z');
 for(const kind of ['night','daydream','fantasy'])putDreamEntry(state,{kind,at:'2026-10-24T08:00:00Z',body:'Wolken und Wasser',tags:'Wasser, Reise'});
 assert.equal(dreamEntries(state,{now:n}).length,3);
 assert.deepEqual(dreamInsights(state,{now:n}).byKind,{night:1,daydream:1,fantasy:1});
 assert.equal(state.someday,undefined);
});
test('dreams merge across devices without dropping local entries',async()=>{
 const {mergeDreamJournals}=await load('client/src/dream-journal-v57743.js');
 const a={entries:[{id:'desktop',kind:'night',at:'2026-10-20T10:00:00Z',updatedAt:'2026-10-20T10:00:00Z',body:'Desktop'}]};
 const b={entries:[{id:'phone',kind:'daydream',at:'2026-10-21T10:00:00Z',updatedAt:'2026-10-21T10:00:00Z',body:'Phone'}]};
 const merged=mergeDreamJournals(a,b);assert.equal(merged.entries.length,2);
 assert.deepEqual(mergeDreamJournals(merged,a),merged);
});
test('dream deletion tombstone wins same-revision conflicts',async()=>{
 const {mergeDreamJournals}=await load('client/src/dream-journal-v57743.js');
 const row={id:'one',kind:'night',at:'2026-10-23T12:00:00Z',updatedAt:'2026-10-23T15:00:00Z'};
 const merged=mergeDreamJournals({entries:[row]},{entries:[{...row,deleted:true}]});assert.equal(merged.entries[0].deleted,true);
});
test('strict receipt schema does not guess missing prices',async()=>{
 const {parseReceiptJSON,receiptWarnings}=await load('client/src/receipt-gpt-v57743.js');
 const row=parseReceiptJSON(JSON.stringify({...receiptExample,total:null,items:[{description:'Brezel',quantity:null,unit:null,unit_price:null,total:null,confidence:'low'}]}));
 assert.equal(row.total,null);assert.equal(row.items[0].total,null);assert.ok(receiptWarnings(row).length>0);
 assert.throws(()=>parseReceiptJSON(JSON.stringify({...receiptExample,currency:'USD'})),/EUR/);
});
test('same receipt cannot be imported twice and receipt journaling does not touch finance',async()=>{
 const {parseReceiptJSON,putReceipt,receiptEntries}=await load('client/src/receipt-gpt-v57743.js');
 const row=parseReceiptJSON(JSON.stringify(receiptExample)); const state={financeTransactions:[{id:'existing'}]};
 putReceipt(state,row);assert.equal(receiptEntries(state).length,1);
 assert.throws(()=>putReceipt(state,row),/bereits/);
 assert.equal(state.financeTransactions.length,1);
});
test('receipt merge preserves data and deletion',async()=>{
 const {parseReceiptJSON,mergeReceiptJournals}=await load('client/src/receipt-gpt-v57743.js');
 const row=parseReceiptJSON(JSON.stringify(receiptExample)),gone={...row,deleted:true,updatedAt:'2026-11-01T00:00:00Z'};
 const merged=mergeReceiptJournals({entries:[row]},{entries:[gone]});assert.equal(merged.entries.length,1);assert.equal(merged.entries[0].deleted,true);
});
test('bridge wires E2EE journaling, purchase review, Dreamworld navigation and resume',async()=>{
 const fs=readFileSync(root+'/client/compass743-bridge.js','utf8');
 for(const x of ['mergeDreamJournals','mergeReceiptJournals','strengthJournal','dreamJournal','receiptJournal','automaticJournalResume743','receiptInboxView','dreamJournalView'])assert.ok(fs.includes(x),x);
 const vite=readFileSync(root+'/client/vite.config.js','utf8');
 const chain=['strengthSync742Bridge()', 'compass743Bridge()', 'compass744Bridge()', 'compass745Bridge()', 'compass746Bridge()', 'compass747Bridge()', 'VitePWA('];
 let prev=-1;for(const key of chain){const at=vite.indexOf(key);assert.ok(at>prev,`Vite order: ${key}`);prev=at;}
});
test('strict bridge fails closed if version .42 not present',async()=>{
 const {compass743Bridge}=await load('client/compass743-bridge.js');
 assert.throws(()=>compass743Bridge().transform('not the right source','/tmp/client/src/main.js'),/Integrationsanker|integration anchor|expected exactly one/);
});
test('month shopping overview aggregates receipt item names but does not mark them eaten',async()=>{
 const {parseReceiptJSON,putReceipt,receiptMonthSummary}=await load('client/src/receipt-gpt-v57743.js');
 const a=parseReceiptJSON(JSON.stringify(receiptExample));
 const b=parseReceiptJSON(JSON.stringify({...receiptExample,date:'2026-10-25',total:3.99,items:[{...receiptExample.items[0],total:3.99,unit_price:3.99}]}));
 const st={};putReceipt(st,a);putReceipt(st,b);
 const m=receiptMonthSummary(st,'2026-10');assert.equal(m.receipts.length,2);assert.equal(m.products.length,1);assert.equal(m.products[0].count,2);
 assert.equal(st.nutritionJournal,undefined);
});
