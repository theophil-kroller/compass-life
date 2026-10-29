import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compass743Bridge} from '../client/compass743-bridge.js';

const id='/build/client/src/personal-journal-v5692.js';
const current=readFileSync(new URL('../client/src/personal-journal-v5692.js',import.meta.url),'utf8');
const markers=[
 "import {mergeDreamJournals} from './dream-journal-v57743.js';",
 "import {mergeReceiptJournals} from './receipt-gpt-v57743.js';",
 'dreamJournal:mergeDreamJournals(lc.dreamJournal,rc.dreamJournal),',
 'receiptJournal:mergeReceiptJournals(lc.receiptJournal,rc.receiptJournal),'
];
const count=(s,marker)=>s.split(marker).length-1;

test('security update: already-integrated journal is not transformed twice',()=>{
 for(const marker of markers)assert.equal(count(current,marker),1,marker);
 assert.equal(compass743Bridge().transform(current,id),null);
});

test('original history: legacy journal still receives both E2EE merges exactly once',()=>{
 let legacy=current;
 for(const marker of markers){assert.equal(count(legacy,marker),1);legacy=legacy.replace(marker,'');}
 const transformed=compass743Bridge().transform(legacy,id);
 assert.ok(transformed?.code,'original, unintegrated source must be transformed');
 for(const marker of markers)assert.equal(count(transformed.code,marker),1,marker);
 assert.equal(compass743Bridge().transform(transformed.code,id),null);
});

test('incomplete or duplicate E2EE integration fails closed',()=>{
 const missingReceiptMerge=current.replace(markers[3],'');
 assert.throws(()=>compass743Bridge().transform(missingReceiptMerge,id),/partial or duplicate E2EE/);
 const duplicatedImport=current.replace(markers[1],markers[1]+'\n'+markers[1]);
 assert.throws(()=>compass743Bridge().transform(duplicatedImport,id),/partial or duplicate E2EE/);
});
