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
  return {application:'Compass',vaultVersion:1,meta:await kvGet('meta'),payload:await kvGet('payload')};
}
export async function importEncrypted(bundle) {
  if(await exists())throw new Error('Import nur in einem neuen, leeren Browser-Tresor möglich.');
  if(bundle?.application!=='Compass'||bundle?.vaultVersion!==1||!bundle.meta?.salt||!bundle.payload?.data)
    throw new Error('Ungültiger Compass-Tresorexport.');
  await kvPut('meta',bundle.meta);await kvPut('payload',bundle.payload);
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
