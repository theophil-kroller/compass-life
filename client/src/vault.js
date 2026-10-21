// Per-installation encrypted IndexedDB vault. The passphrase and CryptoKey never leave the browser.
const DB_NAME='compass-vault-a1';
const ITERATIONS=310000;
let key=null;
const enc=new TextEncoder();const dec=new TextDecoder();
const to64=bytes=>{let raw='';for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(raw);};
const from64=str=>Uint8Array.from(atob(str),x=>x.charCodeAt(0));

function openDb() {
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>req.result.createObjectStore('kv');
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function kvGet(k) {
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('kv','readonly');const req=tx.objectStore('kv').get(k);
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    tx.oncomplete=()=>db.close();
  });
}
async function kvDelete(k) {
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('kv','readwrite');tx.objectStore('kv').delete(k);
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
  });
}
async function kvPut(k,v) {
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
  });
}
async function derive(passphrase,salt) {
  const material=await crypto.subtle.importKey('raw',enc.encode(passphrase),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},
    material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export function emptyState(){return {format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]};}
export async function exists(){return !!(await kvGet('meta'));}
export async function create(passphrase) {
  if((await exists())) throw new Error('Der Tresor existiert bereits.');
  if(passphrase.length<12) throw new Error('Bitte mindestens 12 Zeichen verwenden.');
  const salt=crypto.getRandomValues(new Uint8Array(16));
  key=await derive(passphrase,salt);
  await kvPut('meta',{format:1,salt:to64(salt),iterations:ITERATIONS});
  const state=emptyState();await save(state);return state;
}
export async function unlock(passphrase) {
  const meta=await kvGet('meta');if(!meta)throw new Error('Kein lokaler Tresor vorhanden.');
  const candidate=await derive(passphrase,from64(meta.salt));
  const entry=await kvGet('payload');if(!entry)throw new Error('Tresordaten fehlen.');
  try {
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(entry.iv)},candidate,from64(entry.data));
    const state=JSON.parse(dec.decode(plain));
    if(state.format!==1 || !state.records || !Array.isArray(state.pending))throw new Error('Unbekanntes Format.');
    key=candidate;return state;
  } catch {throw new Error('Passphrase falsch oder Tresor beschädigt.');}
}
export async function save(state) {
  if(!key)throw new Error('Tresor gesperrt.');
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(state)));
  await kvPut('payload',{iv:to64(iv),data:to64(new Uint8Array(ciphertext))});
}
export function lock(){key=null;}
export async function exportEncrypted() {
  return {application:'Compass',vaultVersion:1,meta:await kvGet('meta'),payload:await kvGet('payload'),sealedCapture:{publicKey:await kvGet(publicCaptureKey),privateKey:await kvGet(privateCaptureKey),queue:await kvGet(lockedQueueKey)}};
}
export async function importEncrypted(bundle) {
  if(await exists())throw new Error('Import nur in einem neuen, leeren Browser-Tresor möglich.');
  if(bundle?.application!=='Compass'||bundle?.vaultVersion!==1||!bundle.meta?.salt||!bundle.payload?.data)
    throw new Error('Ungültiger Compass-Tresorexport.');
  await kvPut('meta',bundle.meta);await kvPut('payload',bundle.payload);
  if(bundle.sealedCapture?.publicKey&&bundle.sealedCapture?.privateKey){await kvPut(privateCaptureKey,bundle.sealedCapture.privateKey);await kvPut(publicCaptureKey,bundle.sealedCapture.publicKey);if(Array.isArray(bundle.sealedCapture.queue))await kvPut(lockedQueueKey,bundle.sealedCapture.queue);}
}

// Compass bearer credentials are encrypted using the active local vault key.
// They are not part of the record sync or the ordinary vault state export.
export async function saveSession(session) {
  if(!key)throw new Error('Tresor gesperrt.');
  if(!session?.token?.startsWith('cs1_') || !session?.email)throw new Error('Ungültige Sitzung.');
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const payload=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(session)));
  await kvPut('auth_session',{iv:to64(iv),data:to64(new Uint8Array(payload))});
}
export async function loadSession() {
  if(!key)throw new Error('Tresor gesperrt.');
  const item=await kvGet('auth_session');
  if(!item)return null;
  try{
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(item.iv)},key,from64(item.data));
    const session=JSON.parse(dec.decode(plain));
    if(!session?.token?.startsWith('cs1_')||!session?.email)return null;
    return session;
  }catch{return null;}
}
export async function clearSession() {await kvDelete('auth_session');}

// Write-only quick capture. RSA private key is AES-GCM-wrapped by the vault key.
// Nothing in the public-key queue can be decrypted while the vault is locked.
// IndexedDB holds ciphertext only, and the plaintext never leaves this device.
const lockedQueueKey='sealed_capture_queue_v568';
const publicCaptureKey='sealed_capture_public_v568';
const privateCaptureKey='sealed_capture_private_v568';
let captureQueueSerial=Promise.resolve();
export async function setupSealedCapture(){
 if(!key)throw Error('Tresor muss zum Einrichten entsperrt sein.');
 const priorPublic=await kvGet(publicCaptureKey),priorPrivate=await kvGet(privateCaptureKey);
 if(priorPublic&&priorPrivate)return;
 if(priorPublic||priorPrivate)throw Error('Unvollständiger Schnellerfassungsschlüssel – bitte Backup prüfen.');
 const pair=await crypto.subtle.generateKey({name:'RSA-OAEP',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['encrypt','decrypt']);
 const pkcs8=await crypto.subtle.exportKey('pkcs8',pair.privateKey);
 const spki=await crypto.subtle.exportKey('spki',pair.publicKey);
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const wrapped=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,pkcs8);
 // Persist private key before making the public key available.
 await kvPut(privateCaptureKey,{iv:to64(iv),data:to64(new Uint8Array(wrapped))});
 await kvPut(publicCaptureKey,to64(new Uint8Array(spki)));
}
export async function sealedCaptureReady(){return !!(await kvGet(publicCaptureKey)&&await kvGet(privateCaptureKey));}
async function appendSealedRecord(record){
 const run=async()=>{
  const encoded=await kvGet(publicCaptureKey);if(!encoded)throw Error('Einmal den Tresor entsperren, um die sichere Schnellerfassung zu aktivieren.');
  const publicKey=await crypto.subtle.importKey('spki',from64(encoded),{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt']);
  const aesBytes=crypto.getRandomValues(new Uint8Array(32)),aesKey=await crypto.subtle.importKey('raw',aesBytes,'AES-GCM',false,['encrypt']);
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const id=record.id;const payload=enc.encode(JSON.stringify(record));
  if(payload.byteLength>14000)throw Error('Eintrag für sicheren Eingangspuffer zu groß.');
  const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},aesKey,payload);
  const wrappedKey=await crypto.subtle.encrypt({name:'RSA-OAEP'},publicKey,aesBytes);
  const queue=await kvGet(lockedQueueKey)||[];
  if(queue.length>=100)throw Error('Sicherer Eingangspuffer voll. Bitte den Tresor entsperren.');
  queue.push({id,iv:to64(iv),data:to64(new Uint8Array(encrypted)),wrapped:to64(new Uint8Array(wrappedKey))});
  await kvPut(lockedQueueKey,queue);return queue.length;
 };
 const result=captureQueueSerial.then(run);captureQueueSerial=result.catch(()=>{});return result;
}
export async function appendSealedCapture(title,note=''){
 const cleanTitle=String(title||'').trim(),cleanNote=String(note||'').trim();
 if(!cleanTitle||cleanTitle.length>1000||cleanNote.length>10000)throw Error('Titel oder Notiz ist ungültig.');
 return appendSealedRecord({id:crypto.randomUUID(),title:cleanTitle,note:cleanNote,createdAt:new Date().toISOString()});
}
export async function appendSealedFeeling(entry){
 if(!entry?.id||!Array.isArray(entry.items)||!entry.items.length)throw Error('Gefühls-Check-in ist ungültig.');
 return appendSealedRecord({kind:'feeling',id:entry.id,entry,createdAt:entry.at});
}
export async function appendSealedWorktime(entry){
 if(!entry||!['start','stop'].includes(entry.type))throw Error('Arbeitszeit-Ereignis ist ungültig.');
 const id=crypto.randomUUID();
 return appendSealedRecord({kind:'worktime',id,entry:{type:entry.type,at:entry.at||new Date().toISOString()},createdAt:entry.at||new Date().toISOString()});
}
export async function appendSealedHabit(entry){
 if(!entry?.habitId||!entry?.day)throw Error('Habit-Eintrag ist ungültig.');
 const id=crypto.randomUUID();
 return appendSealedRecord({kind:'habit',id,entry:{habitId:String(entry.habitId),title:String(entry.title||entry.habitId),slot:String(entry.slot||''),day:String(entry.day),done:entry.done!==false,at:entry.at||new Date().toISOString()},createdAt:entry.at||new Date().toISOString()});
}
export async function readSealedCaptures(){
 if(!key)throw Error('Tresor gesperrt.');
 await captureQueueSerial;
 const wrapped=await kvGet(privateCaptureKey);if(!wrapped)return [];
 const decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(wrapped.iv)},key,from64(wrapped.data));
 const privateKey=await crypto.subtle.importKey('pkcs8',decrypted,{name:'RSA-OAEP',hash:'SHA-256'},false,['decrypt']);
 const queue=await kvGet(lockedQueueKey)||[];
 const entries=[];
 for(const item of queue){
  const secret=await crypto.subtle.decrypt({name:'RSA-OAEP'},privateKey,from64(item.wrapped));
  const aes=await crypto.subtle.importKey('raw',secret,'AES-GCM',false,['decrypt']);
  const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(item.iv)},aes,from64(item.data));
  const parsed=JSON.parse(dec.decode(plaintext));
  if(parsed.id!==item.id)throw Error('Sichere Erfassung: Integritätsprüfung fehlgeschlagen.');
  entries.push(parsed);
 }
 return entries;
}
export async function acknowledgeSealedCaptures(ids){
 if(!key)throw Error('Tresor gesperrt.');
 const selected=new Set(ids);await captureQueueSerial;
 const queue=await kvGet(lockedQueueKey)||[];
 await kvPut(lockedQueueKey,queue.filter(item=>!selected.has(item.id)));
}
