const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const valid64=(s,min,max)=>typeof s==='string'&&s.length>=min&&s.length<=max&&/^[A-Za-z0-9+/]*={0,2}$/.test(s);
export async function privateMirror(req,env,identity){
 const path=new URL(req.url).pathname,kind=path.split('/').at(-1);
 if(!['finance','health'].includes(kind))return json({error:'unknown-kind'},404);
 const owner=identity.sub;
 if(req.method==='GET'){
  const row=await env.DB.prepare('SELECT version,salt,iv,ciphertext,compressed,updated_at,chunk_id,chunk_count FROM private_device_mirror WHERE owner_sub=? AND kind=?').bind(owner,kind).first();
  return json({record:row?{version:row.version,salt:row.salt,iv:row.iv,ciphertext:row.ciphertext,compressed:Boolean(row.compressed),updatedAt:row.updated_at,...(row.chunk_id?{chunked:true,chunkId:row.chunk_id,chunkCount:row.chunk_count}: {})}:null});
 }
 if(req.method==='DELETE'){
  await env.DB.prepare('DELETE FROM private_device_mirror WHERE owner_sub=? AND kind=?').bind(owner,kind).run();await env.DB.prepare('DELETE FROM private_device_mirror_parts WHERE owner_sub=? AND kind=?').bind(owner,kind).run();return json({deleted:true});
 }
 if(req.method!=='POST')return json({error:'method-not-allowed'},405);
 const length=Number(req.headers.get('content-length')||0);if(length>1_000_000)return json({error:'payload-too-large'},413);
 let body;try{const t=await req.text();if(t.length>1_000_000)return json({error:'payload-too-large'},413);body=JSON.parse(t);}catch{return json({error:'invalid-json'},400);}
 if(!Number.isSafeInteger(body?.baseVersion)||body.baseVersion<0||body.baseVersion>999_999_999||!valid64(body.salt,20,32)||!valid64(body.iv,16,24)||!valid64(body.ciphertext,24,940000)||typeof body.compressed!=='boolean')return json({error:'invalid-payload'},400);
 // Enforce one key salt per owner's finance+health mirror. Avoid mixing incompatible keys across devices.
 const existing=await env.DB.prepare('SELECT salt FROM private_device_mirror WHERE owner_sub=? LIMIT 1').bind(owner).first();
 if(existing&&existing.salt!==body.salt)return json({error:'different-sync-key'},409);
 const now=new Date().toISOString();let changes=0;
 if(body.baseVersion===0){const r=await env.DB.prepare('INSERT INTO private_device_mirror(owner_sub,kind,version,salt,iv,ciphertext,compressed,updated_at) VALUES(?,?,1,?,?,?,?,?) ON CONFLICT(owner_sub,kind) DO NOTHING').bind(owner,kind,body.salt,body.iv,body.ciphertext,body.compressed?1:0,now).run();changes=r.meta?.changes||0;}
 else{const r=await env.DB.prepare('UPDATE private_device_mirror SET version=version+1,iv=?,ciphertext=?,compressed=?,updated_at=?,chunk_id=NULL,chunk_count=0 WHERE owner_sub=? AND kind=? AND version=? AND salt=?').bind(body.iv,body.ciphertext,body.compressed?1:0,now,owner,kind,body.baseVersion,body.salt).run();changes=r.meta?.changes||0;}
 if(!changes)return json({error:'version-conflict'},409);
 // Keep prior encrypted parts for a short time, allowing an in-flight receiver to finish.
 const cutoff=new Date(Date.now()-7*86400000).toISOString();
 await env.DB.prepare('DELETE FROM private_device_mirror_parts WHERE owner_sub=? AND kind=? AND created_at<?').bind(owner,kind,cutoff).run();
 return json({version:body.baseVersion+1,updatedAt:now});
}
