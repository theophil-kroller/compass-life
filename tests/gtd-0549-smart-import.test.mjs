import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {detectSmartImport,inspectSmartFiles,committedSmartImport,normalizeImportHistory,collectFolderFiles,smartImportHubView} from '../client/src/smart-import-hub-v49.js';
const file=(name,content)=>new File([content],name,{lastModified:123456});
const mk=(name,content)=>{const buf=new TextEncoder().encode(content);return {name,size:buf.length,slice:(start,end)=>({arrayBuffer:async()=>buf.slice(start,end).buffer}),arrayBuffer:async()=>buf.buffer};};
test('financial formats detected by actual contents rather than name',()=>{
 const first='Booking Date,Value Date,Partner Name,Partner Iban,Type,Payment Reference,Account Name,Amount (EUR),Original Amount,Original Currency,Exchange Rate\n';
 assert.equal(detectSmartImport({name:'random.csv',head:first}).kind,'bank');
 assert.equal(detectSmartImport({name:'bank.csv',head:'Note,Date,Value\n'}).kind,'unknown');
 assert.equal(detectSmartImport({name:'positions.csv',head:'stichtag;isin;bezeichnung;art;stueck;kurs_eur;marktwert_eur;einstand_eur\n'}).kind,'flatex');
});
test('Timeline and project JSON identified independently of filename',()=>{
 assert.equal(detectSmartImport({name:'data.json',head:'{"semanticSegments":[]}'}).kind,'places');
 assert.equal(detectSmartImport({name:'data.json',head:'{"format":"compass-project-exchange","version":1}'}).kind,'project');
 assert.equal(detectSmartImport({name:'bank.json',head:'{"title":"my diary"}'}).kind,'unknown');
 assert.equal(detectSmartImport({name:'kraken.json',head:'{"format":"compass-kraken-readonly-v1","balances":{}}'}).kind,'kraken');
 assert.equal(detectSmartImport({name:'Fitdays-history.xlsx',head:'',bytes:Uint8Array.from([80,75,3,4])}).kind,'health');
});
test('file extension alone never silently promotes unknown exports to bank or health',()=>{
 assert.equal(detectSmartImport({name:'Konto Daten.csv',head:'hello,world'}).kind,'unknown');
 assert.equal(detectSmartImport({name:'unknown.zip',head:'',bytes:Uint8Array.from([80,75,3,4])}).kind,'unknown');
 assert.equal(detectSmartImport({name:'wellness.fit',head:'',bytes:Uint8Array.from([0,0,0,0])}).kind,'unknown');
});
test('content SHA-256 dedupes identical incoming files and confirmed ledger entries',async()=>{
 const old=globalThis.crypto;Object.defineProperty(globalThis,'crypto',{configurable:true,value:webcrypto});
 try{
  const items=await inspectSmartFiles([mk('bank-a.json','{"semanticSegments":[]}'),mk('bank-b.json','{"semanticSegments":[]}')]);
  assert.equal(items[0].kind,'places');assert.equal(items[0].duplicate,false);assert.equal(items[1].duplicate,true);
  const ledger=committedSmartImport([],[items[0]],'places');assert.equal(ledger.length,1);
  assert.equal((await inspectSmartFiles([mk('bank-c.json','{"semanticSegments":[]}')],ledger))[0].duplicate,true);
  assert.equal(committedSmartImport(ledger,[{digest:'garbage'}],'bank').length,1);
  assert.equal(normalizeImportHistory([{digest:'nonhex'}]).length,0);
 }finally{if(old===undefined)delete globalThis.crypto;else Object.defineProperty(globalThis,'crypto',{configurable:true,value:old});}
});
test('oversized or excessive batches rejected before reading file contents',async()=>{
 await assert.rejects(inspectSmartFiles([mk('big.zip','data'),{name:'huge',size:130*1024*1024}]),/125 MB/);
 await assert.rejects(inspectSmartFiles(Array.from({length:121},()=>mk('a.csv',''))),/120 Dateien/);
});
test('folder scan reads only supported local filenames and warns on count limits',async()=>{
 const entries=[{kind:'file',name:'bank.csv',getFile:async()=>mk('bank.csv','date;amount')},{kind:'file',name:'password.txt',getFile:async()=>mk('password.txt','secret')},{kind:'file',name:'image.jpg',getFile:async()=>mk('image.jpg','no')},{kind:'directory',name:'inside',values:async function*(){yield {kind:'file',name:'fitdays.xls',getFile:async()=>mk('fitdays.xls','xls')};}}];
 const folder={values:async function*(){for(const x of entries)yield x;}};
 const s=await collectFolderFiles(folder);assert.deepEqual(s.files.map(x=>x.name),['bank.csv','password.txt','fitdays.xls']);
});
test('view escapes untrusted filenames and offers confirmation-only staging',()=>{
 const view=smartImportHubView({entries:[{name:'<img src=x>',kind:'unknown',size:20,reason:'Not determined',duplicate:false}],history:[]});
 assert.ok(view.includes('&lt;img src=x&gt;'));assert.ok(!view.includes('<img src=x>'));assert.match(view,/Nur nach Freigabe|nur nach Freigabe/i);
 assert.match(view,/id="smart49-files"/);assert.match(view,/Smart Import Hub/);
});
