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
       'access-control-allow-methods':'GET, POST, OPTIONS',
       'access-control-allow-headers':'Authorization, Content-Type',
       'access-control-max-age':'600'} : {'vary':'Origin'};
}
function configIsSafe(env) {
  return !!(env.DB && env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com') &&
    !env.GOOGLE_CLIENT_ID.includes('REPLACE') && env.OWNER_EMAIL?.includes('@') &&
    env.OWNER_EMAIL !== 'owner@example.com' && /^https?:\/\//.test(env.ALLOWED_ORIGIN));
}
async function authorize(req,env) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ') || auth.length > 12000) return null;
  try {
    const {payload} = await jwtVerify(auth.slice(7),googleKeys,{
      issuer:['accounts.google.com','https://accounts.google.com'],
      audience:env.GOOGLE_CLIENT_ID, clockTolerance:10
    });
    if (!payload.email_verified || String(payload.email).toLowerCase() !== env.OWNER_EMAIL.toLowerCase()) return null;
    if (env.OWNER_GOOGLE_SUB && env.OWNER_GOOGLE_SUB !== payload.sub) return null;
    return {sub:String(payload.sub),email:String(payload.email)};
  } catch { return null; }
}
function itemRecord(row) {
  return {id:row.id,title:row.title,note:row.note,deleted:!!row.deleted,
    version:row.version,updatedAt:row.updated_at,kind:row.kind};
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
        (id,owner_sub,kind,title,note,deleted,version,updated_at,last_mutation_id)
        VALUES(?,?,'inbox',?,?,?,1,?,?) ON CONFLICT(id) DO NOTHING`)
        .bind(m.id,sub,m.title,m.note,Number(m.deleted),now,m.mutationId).run();
    } else {
      result=await env.DB.prepare(`UPDATE items SET title=?,note=?,deleted=?,version=version+1,
        updated_at=?,last_mutation_id=? WHERE owner_sub=? AND id=? AND version=?`)
        .bind(m.title,m.note,Number(m.deleted),now,m.mutationId,sub,m.id,m.baseVersion).run();
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
  if (req.method==='GET' && url.pathname==='/api/me') {
    return json({email:identity.email,phase:'A',apiVersion:1});
  }
  if (req.method==='GET' && url.pathname==='/api/sync/pull') {
    const cursor=validCursor(url.searchParams.get('cursor') ?? '0');
    if(cursor===null) return json({error:'invalid-cursor'},400);
    const rows=await env.DB.prepare(`SELECT c.seq,i.id,i.kind,i.title,i.note,i.deleted,i.version,i.updated_at
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
    if (path==='/api/health' && req.method==='GET') return finish(json({ok:true,phase:'A',apiVersion:1}));
    if (!configIsSafe(env)) return finish(json({error:'server-not-configured'},503));
    if (origin && origin!==env.ALLOWED_ORIGIN) return finish(json({error:'origin-not-allowed'},403));
    const identity=await authorize(req,env);
    if (!identity) return finish(json({error:'unauthorized'},401));
    try {return finish(await route(req,env,identity));}
    catch(err) {console.error('Compass API failure',err?.name||'Unknown');return finish(json({error:'internal-server-error'},500));}
  }
};
