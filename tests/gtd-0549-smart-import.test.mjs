import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {detectSmartImport,inspectSmartFiles,committedSmartImport,normalizeImportHistory,collectFolderFiles,smartImportHubView,inspectZipDirectory,smartImportGroups} from '../client/src/smart-import-hub-v49.js';
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
 await assert.rejects(inspectSmartFiles(Array.from({length:2001},()=>mk('a.csv',''))),/2000 Dateien/);
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

// Minimal ZIP central-directory fixture: scanning names must work without unzipping any data.
function sampleZip(names){
 const enc=new TextEncoder(),central=[];let offset=0;
 for(const name of names){const bytes=enc.encode(name),head=new Uint8Array(46+bytes.length),view=new DataView(head.buffer);
  view.setUint32(0,0x02014b50,true);view.setUint16(28,bytes.length,true);head.set(bytes,46);central.push(head);}
 const total=central.reduce((sum,x)=>sum+x.length,0),all=new Uint8Array(total+22);let pos=0;
 for(const part of central){all.set(part,pos);pos+=part.length;}
 const eof=new DataView(all.buffer);eof.setUint32(pos,0x06054b50,true);eof.setUint16(pos+8,names.length,true);eof.setUint16(pos+10,names.length,true);eof.setUint32(pos+12,total,true);eof.setUint32(pos+16,0,true);
 return all;
}
test('ZIP central directory recognizes supported Garmin data without filename assumptions',async()=>{
 const zip=sampleZip(['Monitoring/2026-05-01.fit','sleepData.json']);
 const f=mk('2026-05-01.zip','');f.size=zip.length;f.slice=(start,end)=>({arrayBuffer:async()=>zip.slice(start,end).buffer});
 const details=await inspectZipDirectory(f);assert.equal(details.kind,'health');assert.equal(details.memberCount,2);assert.equal(details.confidence,'high');
 const old=globalThis.crypto;Object.defineProperty(globalThis,'crypto',{configurable:true,value:webcrypto});
 try{f.arrayBuffer=async()=>zip.buffer;const rows=await inspectSmartFiles([f]);assert.equal(rows[0].kind,'health');assert.deepEqual(rows[0].members,['Monitoring/2026-05-01.fit','sleepData.json']);}finally{if(old===undefined)delete globalThis.crypto;else Object.defineProperty(globalThis,'crypto',{configurable:true,value:old});}
});
test('identically structured daily ZIPs are one selectable group, unknown content stays unknown',async()=>{
 const zip=sampleZip(['records/data.xml','metadata.json']);
 const f=mk('2026-05-01.zip','');f.size=zip.length;f.slice=(start,end)=>({arrayBuffer:async()=>zip.slice(start,end).buffer});
 const result=await inspectZipDirectory(f);assert.equal(result.kind,'unknown');assert.match(result.reason,/XML|JSON/);
 const arr=Array.from({length:120},(_,i)=>({name:`2026-05-${i}.zip`,kind:'unknown',layout:result.layout,reason:result.reason,size:zip.length}));
 const groups=smartImportGroups(arr);assert.equal(groups.length,1);assert.equal(groups[0].indexes.length,120);
 const html=smartImportHubView({entries:arr});assert.match(html,/120 × gleichartige Dateien/);assert.match(html,/data-smart49-group="0"/);
 assert.ok(!html.includes('0 MB'));
});
test('archive classification never uses Health Daten path alone as evidence',async()=>{
 const f=mk('2026-05-01.zip','PK\u0003\u0004');const z=await inspectZipDirectory(f);
 assert.equal(z.kind,'unknown');assert.match(z.reason,/unvollständiges ZIP|nicht gefunden/);
});
