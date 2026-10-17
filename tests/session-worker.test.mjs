import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

// Run the actual Worker module without external jose dependencies: only Google ID-token
// verification is stubbed; every opaque-session operation uses real WebCrypto.
const file=new URL('../worker/src/index.js',import.meta.url);
let source=await fs.readFile(file,'utf8');
source=source.replace("import { createRemoteJWKSet, jwtVerify } from 'jose';", `const createRemoteJWKSet=()=>({});\nconst jwtVerify=async(token)=>{if(token!=='google-ok')throw Error('invalid token');return {payload:{email_verified:true,email:'owner@example.org',sub:'google-user-1'}};};`);
source=source.replace("import {MAX_BATCH, validateMutation, validCursor, cleanMutation} from './validation.js';",'const MAX_BATCH=25;const validateMutation=()=>null;const validCursor=()=>0;const cleanMutation=x=>x;');
source=source.replace("import {createPair,claimPair,acceptWatchSession,listWatchSessions,listWatchDevices,revokeWatchDevice,watchPlanning} from './watch.js';", `const createPair=()=>{};const claimPair=()=>{};const acceptWatchSession=()=>{};const listWatchSessions=()=>{};const listWatchDevices=()=>{};const revokeWatchDevice=()=>{};const watchPlanning=()=>{};`);
source=source.replace("import {listTasks,putTask} from './tasks.js';", "const listTasks=()=>{};const putTask=()=>{};");
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
function fakeD1(){
 const sessions=new Map();
 const db={prepare(sql){
   return {bind(...values){
     return {
       async first(){return sql.includes('FROM auth_sessions')?(sessions.get(values[0])??null):null;},
       async run(){
         if(sql.includes('INSERT INTO auth_sessions')){
           const [hash,sub,email,created,expiry]=values;
           sessions.set(hash,{owner_sub:sub,owner_email:email,created_at:created,expires_at:expiry});
         }else if(sql.includes('UPDATE auth_sessions SET')){
           const [expiry,hash]=values;const session=sessions.get(hash);
           if(session)session.expires_at=expiry;
         }else if(sql.includes('DELETE FROM auth_sessions'))sessions.delete(values[0]);
         return {meta:{changes:1}};
       }
     };
   }};
 }};
 return {db,sessions};
}
function request(method,path,token){return new Request('https://compass-api.example.workers.dev'+path,{method,headers:{origin:'https://theophil-kroller.github.io',...(token?{authorization:`Bearer ${token}`}:{})}});}
function makeEnv(db){return {DB:db,GOOGLE_CLIENT_ID:'test.apps.googleusercontent.com',OWNER_EMAIL:'owner@example.org',ALLOWED_ORIGIN:'https://theophil-kroller.github.io'};}

test('Google ID token is exchanged for revocable 30-day opaque token; no plaintext token stored in D1',async()=>{
 const {db,sessions}=fakeD1();const env=makeEnv(db);
 const first=await worker.fetch(request('POST','/api/session','google-ok'),env);
 assert.equal(first.status,200);const {token,email,expiresAt}=await first.json();
 assert.match(token,/^cs1_[0-9a-f]{64}$/);assert.equal(email,'owner@example.org');
 assert.ok(Date.parse(expiresAt)>Date.now()+29*86400000);
 assert.equal(sessions.size,1);assert.equal(sessions.has(token),false);
 const resumed=await worker.fetch(request('GET','/api/me',token),env);
 assert.equal(resumed.status,200);assert.equal((await resumed.json()).email,email);
 const revoked=await worker.fetch(request('DELETE','/api/session',token),env);
 assert.equal(revoked.status,200);assert.equal(sessions.size,0);
 assert.equal((await worker.fetch(request('GET','/api/me',token),env)).status,401);
});
test('session belongs to configured owner; invalid or expired credentials rejected',async()=>{
 const {db,sessions}=fakeD1();const env=makeEnv(db);
 const issued=await (await worker.fetch(request('POST','/api/session','google-ok'),env)).json();
 const session=[...sessions.values()][0];session.expires_at='2020-01-01T00:00:00.000Z';
 assert.equal((await worker.fetch(request('GET','/api/me',issued.token),env)).status,401);
 session.expires_at=new Date(Date.now()+4*86400000).toISOString();
 assert.equal((await worker.fetch(request('GET','/api/me',issued.token),env)).status,200);
 assert.ok(Date.parse(session.expires_at)>Date.now()+29*86400000);
 env.OWNER_EMAIL='another@example.org';
 assert.equal((await worker.fetch(request('GET','/api/me',issued.token),env)).status,401);
});
test('CORS allows DELETE for explicit session revocation',async()=>{
 const {db}=fakeD1();const r=await worker.fetch(request('OPTIONS','/api/session'),makeEnv(db));
 assert.equal(r.status,204);assert.match(r.headers.get('access-control-allow-methods'),/DELETE/);
});
