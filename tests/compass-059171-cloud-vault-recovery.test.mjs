import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {webcrypto} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {recoveryLocator,cloudBackupVault,cloudRecoverVault,backupParts} from '../client/src/vault-recovery-v059171.js';
import {vaultRecoveryPublic,vaultRecoveryPrivate} from '../worker/src/vault-recovery-v059171.js';
import {verifyEncryptedBundle} from '../client/src/vault.js';
globalThis.crypto??=webcrypto;
const salt64=bytes=>Buffer.from(bytes).toString('base64');
function makeDb(){
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys = ON;');
 return {db,env:{DB:{prepare(sql){let args;return {bind(...values){args=values;return this;},first(){return db.prepare(sql).get(...args)||null;},all(){return {results:db.prepare(sql).all(...args)};},run(){const result=db.prepare(sql).run(...args);return {meta:{changes:result.changes}};}}}}}};
}
function simpleBundle(){return {application:'Compass',vaultVersion:1,meta:{salt:salt64(webcrypto.getRandomValues(new Uint8Array(16))),iterations:310000},payload:{iv:salt64(webcrypto.getRandomValues(new Uint8Array(12))),data:'A'.repeat(350000)},coreJournal:[]};}
async function encryptedBundle(password){
 const salt=webcrypto.getRandomValues(new Uint8Array(16));const iv=webcrypto.getRandomValues(new Uint8Array(12));
 const material=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 const key=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
 const payload=await webcrypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify({format:1,records:{id:{title:'private task'}},pending:[]})));
 return {application:'Compass',vaultVersion:1,meta:{salt:salt64(salt),iterations:310000},payload:{iv:salt64(iv),data:salt64(new Uint8Array(payload))},coreJournal:[]};
}
test('password-derived recovery key is deterministic and never contains plaintext password',async()=>{
 const a=await recoveryLocator('a-unique-Vault-passphrase-long-2026');
 const b=await recoveryLocator('a-unique-Vault-passphrase-long-2026');
 const c=await recoveryLocator('another-unique-Vault-passphrase-2026');
 assert.match(a,/^[a-f0-9]{64}$/);assert.equal(a,b);assert.notEqual(a,c);
 assert.doesNotMatch(a,/unique|Vault/);
});
test('public Cloudflare recovery returns only committed encrypted backups, no OAuth token',async()=>{
 const {db,env}=makeDb();db.exec(await fs.readFile(new URL('../worker/migrations/0021_vault_recovery.sql',import.meta.url),'utf8'));
 const oldFetch=globalThis.fetch,remote='https://compass-api.example.workers.dev';
 const requestLog=[];
 globalThis.fetch=async(url,opts={})=>{
   const req=new Request(url,opts);requestLog.push([req.method,new URL(url).pathname,opts.body||'']);
   if(req.method==='GET')return vaultRecoveryPublic(req,env);
   return vaultRecoveryPrivate(req,env,{sub:'owner1',email:'owner@example.test'});
 };
 try{
   const password='safely remembered passphrase 123456';const locator=await recoveryLocator(password);
   await assert.rejects(cloudRecoverVault(remote,locator),/noch keine|Cloud-Tresorsicherung/i);
   const bundle=simpleBundle();const result=await cloudBackupVault(remote,'cs1_'+'a'.repeat(64),locator,bundle);
   assert.ok(result.at);assert.ok(result.partCount>=3);
   const restored=await cloudRecoverVault(remote,locator);
   assert.deepEqual(restored,bundle);
   assert.equal(requestLog.filter(([method])=>method==='GET').some(([method,path])=>path.includes('/api/vault-recovery/')),true);
   assert.ok(requestLog.filter(([method])=>method==='POST').length>=5);
   assert.ok(requestLog.every(([method,path,body])=>!body.includes(password)));
   assert.ok(db.prepare("SELECT COUNT(*) AS n FROM vault_recovery_snapshots WHERE status='ready'").get().n===1);
 }finally{globalThis.fetch=oldFetch;db.close();}
});
test('wrong vault passphrase cannot decrypt bundle; backed-up data validated before importing',async()=>{
 const backup=await encryptedBundle('correct-unusual-compass-phrase');
 assert.equal(await verifyEncryptedBundle('correct-unusual-compass-phrase',backup),true);
 assert.equal(await verifyEncryptedBundle('incorrect-unusual-passphrase',backup),false);
 assert.throws(()=>backupParts({application:'Compass',vaultVersion:1,meta:{},payload:{}}));
});
test('corrupted cloud chunk fails checksum before local import',async()=>{
 const {db,env}=makeDb();db.exec(await fs.readFile(new URL('../worker/migrations/0021_vault_recovery.sql',import.meta.url),'utf8'));
 const remote='https://compass-api.example.workers.dev',locator=await recoveryLocator('integrity-test-password-123');
 const oldFetch=globalThis.fetch;
 globalThis.fetch=async(url,options={})=>{const req=new Request(url,options);return req.method==='GET'?vaultRecoveryPublic(req,env):vaultRecoveryPrivate(req,env,{sub:'owner1'});};
 try{
  await cloudBackupVault(remote,'cs1_'+'b'.repeat(64),locator,simpleBundle());
  const row=db.prepare('SELECT snapshot_id,part_index FROM vault_recovery_parts ORDER BY part_index LIMIT 1').get();
  db.prepare('UPDATE vault_recovery_parts SET part=? WHERE snapshot_id=? AND part_index=?').run('tampered',row.snapshot_id,row.part_index);
  await assert.rejects(cloudRecoverVault(remote,locator),/Prüfsumme/);
 }finally{globalThis.fetch=oldFetch;db.close();}
});
