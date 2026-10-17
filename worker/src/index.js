import {listProjects,putProject} from './projects.js';
import {listTasks,putTask} from './tasks.js';
import {createPair,claimPair,acceptWatchSession,listWatchSessions,listWatchDevices,revokeWatchDevice,watchPlanning} from './watch.js';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import {MAX_BATCH, validateMutation, validCursor, cleanMutation} from './validation.js';

const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const json = (data, code=200, headers={}) => new Response(JSON.stringify(data), {
  status: code,
  headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store',
    'x-content-type-options':'nosniff', ...headers}
});

function cors(origin, env) {
  // One exact origin. Do not use '*' with sensitive APIs.
  return origin && origin === env.ALLOWED_ORIGIN
    ? {'access-control-allow-origin':origin,'vary':'Origin',
       'access-control-allow-methods':'GET, POST, DELETE, OPTIONS',
       'access-control-allow-headers':'Authorization, Content-Type',
       'access-control-max-age':'600'} : {'vary':'Origin'};
}
function configIsSafe(env) {
  return !!(env.DB && env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com') &&
    !env.GOOGLE_CLIENT_ID.includes('REPLACE') && env.OWNER_EMAIL?.includes('@') &&
    env.OWNER_EMAIL !== 'owner@example.com' && /^https?:\/\//.test(env.ALLOWED_ORIGIN));
}
// Server-controlled opaque device sessions (no third-party cookies required).
const SESSION_DAYS=30;
const MS_DAY=86400000;
const secretHex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
async function sha256(value) {
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return secretHex(new Uint8Array(digest));
}
function bearer(req){
  const auth=req.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')||auth.length>12000)return '';
  return auth.slice(7);
}
async function authorizeGoogle(req,env) {
  const token=bearer(req);
  if(!token || token.startsWith('cs1_'))return null;
  try {
    const {payload} = await jwtVerify(token,googleKeys,{
      issuer:['accounts.google.com','https://accounts.google.com'],
      audience:env.GOOGLE_CLIENT_ID, clockTolerance:10
    });
    if (!payload.email_verified || String(payload.email).toLowerCase() !== env.OWNER_EMAIL.toLowerCase()) return null;
    if (env.OWNER_GOOGLE_SUB && env.OWNER_GOOGLE_SUB !== payload.sub) return null;
    return {sub:String(payload.sub),email:String(payload.email)};
  } catch { return null; }
}
async function authorize(req,env) {
  const token=bearer(req);
  if(!token.startsWith('cs1_'))return authorizeGoogle(req,env);
  if(!/^cs1_[0-9a-f]{64}$/.test(token))return null;
  const hash=await sha256(token);
  const session=await env.DB.prepare(
    'SELECT owner_sub,owner_email,expires_at FROM auth_sessions WHERE token_hash=?'
  ).bind(hash).first();
  if(!session || session.expires_at<=new Date().toISOString() ||
    session.owner_email.toLowerCase()!==env.OWNER_EMAIL.toLowerCase() ||
    (env.OWNER_GOOGLE_SUB && session.owner_sub!==env.OWNER_GOOGLE_SUB))return null;
  // Sliding expiry requires roughly one D1 write per device every 23 days, not per sync.
  if(Date.parse(session.expires_at)-Date.now()<7*MS_DAY){
    await env.DB.prepare('UPDATE auth_sessions SET expires_at=? WHERE token_hash=?')
      .bind(new Date(Date.now()+SESSION_DAYS*MS_DAY).toISOString(),hash).run();
  }
  return {sub:session.owner_sub,email:session.owner_email};
}
async function issueSession(env,identity){
  const token='cs1_'+secretHex(crypto.getRandomValues(new Uint8Array(32)));
  const expiresAt=new Date(Date.now()+SESSION_DAYS*MS_DAY).toISOString();
  await env.DB.prepare(`INSERT INTO auth_sessions
    (token_hash,owner_sub,owner_email,created_at,expires_at) VALUES(?,?,?,?,?)`)
    .bind(await sha256(token),identity.sub,identity.email,new Date().toISOString(),expiresAt).run();
  return json({token,email:identity.email,expiresAt});
}
async function revokeSession(req,env){
  const token=bearer(req);
  if(!/^cs1_[0-9a-f]{64}$/.test(token))return json({error:'unauthorized'},401);
  await env.DB.prepare('DELETE FROM auth_sessions WHERE token_hash=?').bind(await sha256(token)).run();
  return json({revoked:true});
}
function itemRecord(row) {
  return {id:row.id,title:row.title,note:row.note,deleted:!!row.deleted,
    version:row.version,updatedAt:row.updated_at,kind:row.kind,tags:JSON.parse(row.tags_json||'[]')};
}
async function getItem(env,sub,id) {
  const row=await env.DB.prepare('SELECT * FROM items WHERE owner_sub=? AND id=?').bind(sub,id).first();
  return row?itemRecord(row):null;
}
async function applyOne(env,sub,raw) {
  const m=cleanMutation(raw);
  const receipt=await env.DB.prepare(
    'SELECT item_id,applied_version FROM mutation_receipts WHERE owner_sub=? AND mutation_id=?'
  ).bind(sub,m.mutationId).first();
  if (receipt) {
    return {mutationId:m.mutationId,status:receipt.item_id===m.id?'duplicate':'rejected',
      id:m.id,version:receipt.applied_version};
  }
  const now=new Date().toISOString();
  try {
    let result;
    if (m.baseVersion===0) {
      result=await env.DB.prepare(`INSERT INTO items
        (id,owner_sub,kind,title,note,deleted,version,updated_at,last_mutation_id,tags_json)
        VALUES(?,?,'inbox',?,?,?,1,?,?,?) ON CONFLICT(id) DO NOTHING`)
        .bind(m.id,sub,m.title,m.note,Number(m.deleted),now,m.mutationId,JSON.stringify(m.tags||[])).run();
    } else {
      result=await env.DB.prepare(`UPDATE items SET title=?,note=?,deleted=?,version=version+1,
        updated_at=?,last_mutation_id=?,tags_json=? WHERE owner_sub=? AND id=? AND version=?`)
        .bind(m.title,m.note,Number(m.deleted),now,m.mutationId,JSON.stringify(m.tags||[]),sub,m.id,m.baseVersion).run();
    }
    if (result.meta?.changes===1) {
      return {mutationId:m.mutationId,id:m.id,status:'applied',version:m.baseVersion+1};
    }
  } catch {
    // A parallel retry can cause a mutation-receipt uniqueness constraint.
    const committed=await env.DB.prepare('SELECT item_id,applied_version FROM mutation_receipts WHERE owner_sub=? AND mutation_id=?')
      .bind(sub,m.mutationId).first();
    if (committed && committed.item_id===m.id) {
      return {mutationId:m.mutationId,id:m.id,status:'duplicate',version:committed.applied_version};
    }
    return {mutationId:m.mutationId,id:m.id,status:'error'};
  }
  return {mutationId:m.mutationId,id:m.id,status:'conflict',remote:await getItem(env,sub,m.id)};
}
async function route(req,env,identity) {
  const url=new URL(req.url);
  if(req.method==='GET' && url.pathname==='/api/projects')return listProjects(env,identity);
  if(req.method==='POST' && url.pathname==='/api/projects')return putProject(req,env,identity);
  if(req.method==='GET' && url.pathname==='/api/tasks')return listTasks(env,identity);
  if(req.method==='POST' && url.pathname==='/api/tasks')return putTask(req,env,identity);
  if(req.method==='POST' && url.pathname==='/api/watch/pair/start')return createPair(env,identity);
  if(req.method==='GET' && url.pathname==='/api/watch/sessions')return listWatchSessions(env,identity);
  if(req.method==='GET' && url.pathname==='/api/watch/devices')return listWatchDevices(env,identity);
  if(req.method==='POST' && url.pathname==='/api/watch/device/revoke')return revokeWatchDevice(req,env,identity);
  if (req.method==='GET' && url.pathname==='/api/me') {
    return json({email:identity.email,phase:'A',apiVersion:1});
  }
  if (req.method==='GET' && url.pathname==='/api/sync/pull') {
    const cursor=validCursor(url.searchParams.get('cursor') ?? '0');
    if(cursor===null) return json({error:'invalid-cursor'},400);
    const rows=await env.DB.prepare(`SELECT c.seq,i.id,i.kind,i.title,i.note,i.tags_json,i.deleted,i.version,i.updated_at
      FROM change_log c JOIN items i ON i.id=c.item_id AND i.owner_sub=c.owner_sub
      WHERE c.owner_sub=? AND c.seq>? ORDER BY c.seq ASC LIMIT 101`).bind(identity.sub,cursor).all();
    const batch=(rows.results||[]).slice(0,100);
    return json({changes:batch.map(r=>({...itemRecord(r),seq:r.seq})),
      cursor:batch.length?batch[batch.length-1].seq:cursor,hasMore:(rows.results||[]).length>100});
  }
  if(req.method==='POST' && url.pathname==='/api/sync/push') {
    const contentLength=Number(req.headers.get('content-length')||'0');
    if(contentLength>350000) return json({error:'body-too-large'},413);
    let body;
    try {
      const payload=await req.text();
      if(payload.length>350000) return json({error:'body-too-large'},413);
      body=JSON.parse(payload);
    } catch { return json({error:'invalid-json'},400); }
    if(!Array.isArray(body.mutations) || body.mutations.length<1 || body.mutations.length>MAX_BATCH)
      return json({error:'invalid-batch'},400);
    const errors=body.mutations.map(validateMutation);
    if(errors.some(Boolean)) return json({error:'invalid-mutation',details:errors},400);
    // Mutations are applied sequentially and each INSERT/UPDATE fires atomic SQL triggers.
    const results=[];
    for(const m of body.mutations) results.push(await applyOne(env,identity.sub,m));
    return json({results});
  }
  return json({error:'not-found'},404);
}
export default {
  async fetch(req,env) {
    const origin=req.headers.get('origin');
    const headers=cors(origin,env);
    const finish=(res)=> {const output=new Response(res.body,res);Object.entries(headers).forEach(([k,v])=>output.headers.set(k,v));return output;};
    if (req.method==='OPTIONS') {
      return finish(new Response(null,{status:origin===env.ALLOWED_ORIGIN?204:403}));
    }
    const path=new URL(req.url).pathname;
    if (path==='/api/health' && req.method==='GET') return finish(json({ok:true,phase:'A',apiVersion:3,planning:true,gtd:true,projects:true}));
    if (!configIsSafe(env)) return finish(json({error:'server-not-configured'},503));
    if (origin && origin!==env.ALLOWED_ORIGIN) return finish(json({error:'origin-not-allowed'},403));
    try {
      if(path==='/api/watch/pair/claim' && req.method==='POST')return finish(await claimPair(req,env));
      if(path==='/api/watch/planning' && req.method==='GET')return finish(await watchPlanning(req,env));
      if(path==='/api/watch/sessions' && req.method==='POST')return finish(await acceptWatchSession(req,env));
      if(path==='/api/session' && req.method==='POST') {
        const googleIdentity=await authorizeGoogle(req,env);
        return finish(googleIdentity?await issueSession(env,googleIdentity):json({error:'unauthorized'},401));
      }
      if(path==='/api/session' && req.method==='DELETE')return finish(await revokeSession(req,env));
      const identity=await authorize(req,env);
      if(!identity)return finish(json({error:'unauthorized'},401));
      return finish(await route(req,env,identity));
    }catch(err){
      console.error('Compass API failure',err?.name||'Unknown');
      return finish(json({error:'internal-server-error'},500));
    }
  }
};
