/** Opaque encrypted vault snapshot storage for one-owner Compass.
 * UPLOAD requires the existing Cloudflare bearer session; RECOVERY uses
 * an unguessable password-derived capability, never a plaintext password.
 */
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const locatorOK=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const idOK=s=>typeof s==='string'&&/^[a-f0-9]{32}$/.test(s);
const hashOK=locatorOK;
const te=new TextEncoder();
const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
async function parseBody(req,max){const raw=await req.text();if(raw.length>max)throw Error('too-large');return JSON.parse(raw);}
export async function vaultRecoveryPublic(req,env){
 if(req.method!=='GET')return json({error:'method-not-allowed'},405);
 const parts=new URL(req.url).pathname.split('/').filter(Boolean),locator=parts[2];
 if(!locatorOK(locator))return json({error:'not-found'},404);
 if(parts.length===3){
   const rows=await env.DB.prepare("SELECT id,parts,sha256,completed_at FROM vault_recovery_snapshots WHERE locator=? AND status='ready' ORDER BY completed_at DESC LIMIT 3").bind(locator).all();
   if(!rows.results?.length)return json({error:'not-found'},404);
   return json({versions:rows.results.map(row=>({id:row.id,parts:row.parts,hash:row.sha256,at:row.completed_at}))});
 }
 if(parts.length!==5||!idOK(parts[3])||!/^\d{1,3}$/.test(parts[4]))return json({error:'not-found'},404);
 const index=Number(parts[4]);
 const row=await env.DB.prepare("SELECT part FROM vault_recovery_parts WHERE snapshot_id=? AND part_index=? AND EXISTS(SELECT 1 FROM vault_recovery_snapshots WHERE id=? AND locator=? AND status='ready')").bind(parts[3],index,parts[3],locator).first();
 return row?json({part:row.part}):json({error:'not-found'},404);
}
export async function vaultRecoveryPrivate(req,env,identity){
 if(req.method!=='POST')return json({error:'method-not-allowed'},405);
 let body;try{body=await parseBody(req,350000);}catch{return json({error:'invalid-json-or-too-large'},400);}
 if(!locatorOK(body?.locator)||!idOK(body?.id))return json({error:'invalid-id'},400);
 const owner=identity.sub, path=new URL(req.url).pathname;
 if(path.endsWith('/begin')){
   if(!Number.isInteger(body.parts)||body.parts<1||body.parts>120||!Number.isInteger(body.length)||body.length<1||body.length>20000000||!hashOK(body.hash))return json({error:'invalid-manifest'},400);
   const now=new Date().toISOString();
   const expired=new Date(Date.now()-86400000).toISOString();
   // Clear unfinished uploads after one day; finished backups are kept (last three).
   const abandoned=await env.DB.prepare("SELECT id FROM vault_recovery_snapshots WHERE owner_sub=? AND status='staging' AND created_at<? LIMIT 50").bind(owner,expired).all();
   for(const row of abandoned.results||[])await env.DB.prepare('DELETE FROM vault_recovery_snapshots WHERE id=? AND owner_sub=?').bind(row.id,owner).run();
   await env.DB.prepare("INSERT INTO vault_recovery_snapshots(id,locator,owner_sub,parts,byte_length,sha256,status,created_at) VALUES(?,?,?,?,?,?,'staging',?)").bind(body.id,body.locator,owner,body.parts,body.length,body.hash,now).run();
   return json({ok:true});
 }
 const snapshot=await env.DB.prepare('SELECT * FROM vault_recovery_snapshots WHERE id=? AND locator=? AND owner_sub=?').bind(body.id,body.locator,owner).first();
 if(!snapshot||snapshot.status!=='staging')return json({error:'unknown-transfer'},404);
 if(path.endsWith('/part')){
   if(!Number.isInteger(body.index)||body.index<0||body.index>=snapshot.parts||typeof body.part!=='string'||body.part.length>160000)return json({error:'invalid-part'},400);
   await env.DB.prepare('INSERT OR REPLACE INTO vault_recovery_parts(snapshot_id,part_index,part) VALUES(?,?,?)').bind(body.id,body.index,body.part).run();
   return json({ok:true});
 }
 if(path.endsWith('/commit')){
   const rows=await env.DB.prepare('SELECT part_index,part FROM vault_recovery_parts WHERE snapshot_id=? ORDER BY part_index').bind(body.id).all();
   if(rows.results?.length!==snapshot.parts||rows.results.some((x,i)=>x.part_index!==i))return json({error:'parts-missing'},409);
   const raw=rows.results.map(x=>x.part).join('');
   if(te.encode(raw).length!==snapshot.byte_length||hex(new Uint8Array(await crypto.subtle.digest('SHA-256',te.encode(raw))))!==snapshot.sha256)return json({error:'integrity-mismatch'},422);
   // Only an authenticated owner can create a snapshot; public reads see only completed ones.
   const at=new Date().toISOString();
   await env.DB.prepare("UPDATE vault_recovery_snapshots SET status='ready',completed_at=? WHERE id=? AND status='staging'").bind(at,body.id).run();
   const old=await env.DB.prepare("SELECT id FROM vault_recovery_snapshots WHERE owner_sub=? AND locator=? AND status='ready' ORDER BY completed_at DESC LIMIT -1 OFFSET 3").bind(owner,body.locator).all();
   for(const row of old.results||[])await env.DB.prepare('DELETE FROM vault_recovery_snapshots WHERE id=? AND owner_sub=?').bind(row.id,owner).run();
   return json({ok:true,at});
 }
 return json({error:'not-found'},404);
}
