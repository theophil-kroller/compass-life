import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {syncKeyFromPhrase,encryptSection,decryptSection,newSalt,privateSection,privateChanged,applyPrivateSection} from '../client/src/private-device-sync-v30.js';
import {privateMirror} from '../worker/src/private-device-mirror.js';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const phrase='Dies-ist-meine-lange-private-Geratepassphrase-2026';
test('E2EE sync password derives equal key on both devices and encrypts data',async()=>{
  const salt=newSalt(),a=await syncKeyFromPhrase(phrase,salt),b=await syncKeyFromPhrase(phrase,salt);
  assert.equal(a,b);const data={financeTransactions:[{id:'t-1',merchant:'Mein privater Händler',amountCents:-1234}],financeRules:[]};
  const encrypted=await encryptSection(a,'finance',data);
  assert.ok(!JSON.stringify(encrypted).includes('Mein privater Händler'));
  assert.deepEqual(await decryptSection(b,'finance',encrypted),data);
  const wrongKey=await syncKeyFromPhrase('Andere-Lange-geheime-Passphrase-2026',salt);await assert.rejects(()=>decryptSection(wrongKey,'finance',encrypted),/falsch|beschädigt/);
  await assert.rejects(()=>decryptSection(b,'health',encrypted),/falsch|beschädigt/);
});
test('Private sync only includes whitelisted local sections',()=>{
 const state={records:{private:'inbox'},authToken:'secret',financeTransactions:[{id:1}],healthImports:{garminSessions:[{id:'garmin1'}]},manualActivities:{},tasks:{private:'task'},financeSavingsGoals:[{id:'g'}]};
 assert.deepEqual(privateSection(state,'finance').financeSavingsGoals,[{id:'g'}]);
 assert.ok(!('records' in privateSection(state,'finance')));
 assert.deepEqual(privateSection(state,'health').healthImports.garminSessions,[{id:'garmin1'}]);
 assert.ok(!privateChanged(state,{...state,records:{private:'other'}}));
 assert.ok(privateChanged(state,{...state,financeTransactions:[{id:2}]}));
 const next=applyPrivateSection(state,'finance',{financeTransactions:[{id:3}],records:{BAD:'should-not-copy'}});
 assert.deepEqual(next.financeTransactions,[{id:3}]);assert.deepEqual(next.records,{private:'inbox'});
});
test('Short sync phrases are refused, non-finance payloads refused',async()=>{
 await assert.rejects(()=>syncKeyFromPhrase('12345',newSalt()),/mindestens 16/);
 const key=await syncKeyFromPhrase(phrase,newSalt());
 await assert.rejects(()=>encryptSection(key,'inbox',{records:['secret']}),/unbekannt/);
});
function fakeDb(){const rows=new Map();return {rows,prepare(sql){return {bind(...v){return {async first(){if(sql.includes('WHERE owner_sub=? AND kind=?'))return rows.get(`${v[0]}:${v[1]}`)||null;for(const [k,r] of rows)if(k.startsWith(v[0]+':'))return {salt:r.salt};return null;},async run(){if(sql.startsWith('INSERT')){const [owner,kind,salt,iv,ciphertext,compressed,updated_at]=v,idx=owner+':'+kind;if(rows.has(idx))return {meta:{changes:0}};rows.set(idx,{version:1,salt,iv,ciphertext,compressed,updated_at});return {meta:{changes:1}};}if(sql.startsWith('UPDATE')){const [iv,ciphertext,compressed,updated_at,owner,kind,version,salt]=v,idx=owner+':'+kind,r=rows.get(idx);if(!r||r.version!==version||r.salt!==salt)return {meta:{changes:0}};rows.set(idx,{...r,iv,ciphertext,compressed,updated_at,version:version+1});return {meta:{changes:1}};}if(sql.startsWith('DELETE FROM private_device_mirror_parts'))return {meta:{changes:0}};if(sql.startsWith('DELETE')){rows.delete(v[0]+':'+v[1]);return {meta:{changes:1}};}return {meta:{changes:0}};}};}};}};}
test('Encrypted worker mirror isolates owners and rejects stale versions',async()=>{
 const env={DB:fakeDb()},id={sub:'account-1'},str={salt:newSalt(),iv:newSalt().slice(0,16),ciphertext:'a'.repeat(32),compressed:true,baseVersion:0};
 const post=(value,k='finance',identity=id)=>privateMirror(new Request('https://example.test/api/private-device/'+k,{method:'POST',body:JSON.stringify(value)}),env,identity);
 const get=(k='finance',identity=id)=>privateMirror(new Request('https://example.test/api/private-device/'+k),env,identity);
 let res=await post(str);assert.equal(res.status,200);assert.equal((await res.json()).version,1);
 res=await post(str);assert.equal(res.status,409);
 res=await post({...str,baseVersion:1,ciphertext:'b'.repeat(32)});assert.equal(res.status,200);
 assert.equal((await (await get()).json()).record.version,2);
 assert.equal((await (await get('finance',{sub:'another-account'})).json()).record,null);
 res=await post({...str,baseVersion:0,salt:newSalt()},'health');assert.equal(res.status,409);
});

test('Cloud snapshot stores only ciphertext in real SQLite, with CAS and owner isolation',async()=>{
 const {DatabaseSync}=await import('node:sqlite');const {readFileSync}=await import('node:fs');
 const db=new DatabaseSync(':memory:');
 try{
  db.exec(readFileSync(new URL('../worker/migrations/0014_private_device_mirror.sql',import.meta.url),'utf8'));db.exec(readFileSync(new URL('../worker/migrations/0017_private_device_chunks.sql',import.meta.url),'utf8'));
  const env={DB:{prepare(sql){return {bind(...args){return {first:async()=>db.prepare(sql).get(...args)||null,run:async()=>({meta:{changes:Number(db.prepare(sql).run(...args).changes)}})};}};}}};
  const salt=newSalt(),key=await syncKeyFromPhrase(phrase,salt);const data={financeTransactions:[{id:'1',description:'Sehr private Buchungsinformation'}]};
  const payload={...await encryptSection(key,'finance',data),salt,baseVersion:0};
  const url='https://unit.test/api/private-device/finance';
  const push=x=>privateMirror(new Request(url,{method:'POST',body:JSON.stringify(x)}),env,{sub:'owner-1'});
  const pull=sub=>privateMirror(new Request(url),env,{sub});
  const created=await push(payload);assert.equal(created.status,200);
  const row=db.prepare("SELECT ciphertext FROM private_device_mirror WHERE owner_sub='owner-1'").get();
  assert.ok(!row.ciphertext.includes('private Buchungsinformation'));
  const fetched=(await (await pull('owner-1')).json()).record;assert.deepEqual(await decryptSection(key,'finance',fetched),data);
  assert.equal((await (await pull('other')).json()).record,null);
  assert.equal((await push(payload)).status,409);
  assert.equal((await push({...payload,baseVersion:1})).status,200);
 }finally{db.close();}
});
test('Representative 1740 Garmin sessions and 2500 bank transactions fit encrypted mirror limits',async()=>{
 const key=await syncKeyFromPhrase(phrase,newSalt());
 const sessions=Array.from({length:1740},(_,i)=>({id:'ga-'+i,title:`Cycling ${i%16?'Radfahren':'Radtour'}`,durationMinutes:24+i%15,distanceKm:2.18+i%33,start:`2026-01-${String(1+i%28).padStart(2,'0')}T12:01:10`,source:'garmin-activities-csv'}));
 const bank=Array.from({length:2500},(_,i)=>({id:'tr-'+i,merchant:'Biogast Einkauf',description:`Debit card ${i} Bio Bestellung`,amountCents:-3220-i,category:'Lebensmittel / Einkauf',day:`2026-01-${String(1+i%28).padStart(2,'0')}`}));
 const h=await encryptSection(key,'health',{healthImports:{garminSessions:sessions}});
 const f=await encryptSection(key,'finance',{financeTransactions:bank});
 assert.ok(h.ciphertext.length<940000);assert.ok(f.ciphertext.length<940000);
 assert.equal((await decryptSection(key,'health',h)).healthImports.garminSessions.length,1740);
 assert.equal((await decryptSection(key,'finance',f)).financeTransactions.length,2500);
});
