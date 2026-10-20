/** Private device mirror, chunk transport. The server NEVER sees plaintext health/finance data.
 * Transfer is staged then committed by a version-checked single-row update; receivers only
 * discover committed transfers. A failed upload preserves the previously committed version.
 */
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const idOK=x=>typeof x==='string'&&/^[0-9a-f-]{36}$/.test(x);
const valid64=(x,min,max)=>typeof x==='string'&&x.length>=min&&x.length<=max&&/^[A-Za-z0-9+/]*={0,2}$/.test(x);
const MAX_PART=180000,MAX_PARTS=180;
async function body(req,max=205000){
 if(Number(req.headers.get('content-length')||0)>max)return null;
 try{const txt=await req.text();return txt.length<=max?JSON.parse(txt):null;}catch{return null;}
}
export async function privateMirrorChunks(req,env,identity){
 const u=new URL(req.url),m=u.pathname.match(/^\/api\/private-device\/(finance|health)\/(parts|commit)$/);
 if(!m)return json({error:'not-found'},404);
 const [,kind,action]=m,owner=identity.sub;
 if(action==='parts'&&req.method==='GET'){
  const transferId=u.searchParams.get('transferId'),partIndex=Number(u.searchParams.get('partIndex'));
  if(!idOK(transferId)||!Number.isSafeInteger(partIndex)||partIndex<0||partIndex>=MAX_PARTS)return json({error:'invalid-part'},400);
  const record=await env.DB.prepare('SELECT chunk_id,chunk_count FROM private_device_mirror WHERE owner_sub=? AND kind=?').bind(owner,kind).first();
  if(!record)return json({error:'not-committed'},404); // Part ID is unguessable; old committed transfers remain briefly readable.
  const row=await env.DB.prepare('SELECT part FROM private_device_mirror_parts WHERE owner_sub=? AND kind=? AND transfer_id=? AND part_index=?').bind(owner,kind,transferId,partIndex).first();
  return row?json({part:row.part}):json({error:'incomplete-transfer'},409);
 }
 if(req.method!=='POST')return json({error:'method-not-allowed'},405);
 const d=await body(req);if(!d)return json({error:'invalid-json'},400);
 if(action==='parts'){
  if(!idOK(d.transferId)||!Number.isSafeInteger(d.partIndex)||d.partIndex<0||d.partIndex>=MAX_PARTS||!valid64(d.part,1,MAX_PART))return json({error:'invalid-part'},400);
  const now=new Date().toISOString();
  await env.DB.prepare('INSERT INTO private_device_mirror_parts(owner_sub,kind,transfer_id,part_index,part,created_at) VALUES(?,?,?,?,?,?) ON CONFLICT(owner_sub,kind,transfer_id,part_index) DO UPDATE SET part=excluded.part').bind(owner,kind,d.transferId,d.partIndex,d.part,now).run();
  return json({accepted:true,index:d.partIndex});
 }
 if(!idOK(d.transferId)||!Number.isSafeInteger(d.partCount)||d.partCount<2||d.partCount>MAX_PARTS||!Number.isSafeInteger(d.baseVersion)||d.baseVersion<0||d.baseVersion>999999999||!valid64(d.salt,20,32)||!valid64(d.iv,16,24)||typeof d.compressed!=='boolean')return json({error:'invalid-payload'},400);
 const stats=await env.DB.prepare('SELECT COUNT(*) AS c, MIN(part_index) AS first_index, MAX(part_index) AS last_index, SUM(LENGTH(part)) AS total FROM private_device_mirror_parts WHERE owner_sub=? AND kind=? AND transfer_id=?').bind(owner,kind,d.transferId).first();
 if(stats?.c!==d.partCount||stats.first_index!==0||stats.last_index!==d.partCount-1||stats.total<24||stats.total>MAX_PART*MAX_PARTS)return json({error:'incomplete-transfer'},409);
 const existing=await env.DB.prepare('SELECT salt FROM private_device_mirror WHERE owner_sub=? LIMIT 1').bind(owner).first();
 if(existing&&existing.salt!==d.salt)return json({error:'different-sync-key'},409);
 const now=new Date().toISOString();let changes=0;
 if(d.baseVersion===0){const r=await env.DB.prepare('INSERT INTO private_device_mirror(owner_sub,kind,version,salt,iv,ciphertext,compressed,updated_at,chunk_id,chunk_count) VALUES(?,?,1,?, ?, ?, ?, ?, ?, ?) ON CONFLICT(owner_sub,kind) DO NOTHING').bind(owner,kind,d.salt,d.iv,'',d.compressed?1:0,now,d.transferId,d.partCount).run();changes=r.meta?.changes||0;}
 else{const r=await env.DB.prepare('UPDATE private_device_mirror SET version=version+1,iv=?,ciphertext=?,compressed=?,updated_at=?,chunk_id=?,chunk_count=? WHERE owner_sub=? AND kind=? AND version=? AND salt=?').bind(d.iv,'',d.compressed?1:0,now,d.transferId,d.partCount,owner,kind,d.baseVersion,d.salt).run();changes=r.meta?.changes||0;}
 if(!changes)return json({error:'version-conflict'},409);
 // Old ciphertext chunks are retained for 7 days so a concurrent receiver holding an
 // earlier manifest can finish downloading. Staged/obsolete chunks are pruned later.
 const cutoff=new Date(Date.now()-7*86400000).toISOString();
 await env.DB.prepare('DELETE FROM private_device_mirror_parts WHERE owner_sub=? AND kind=? AND transfer_id<>? AND created_at<?').bind(owner,kind,d.transferId,cutoff).run();
 return json({version:d.baseVersion+1,updatedAt:now,chunked:true});
}
