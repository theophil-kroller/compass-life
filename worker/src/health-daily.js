// Device-linked health summaries. Never trusts owner ID from the device.
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const hex=a=>Array.from(a,v=>v.toString(16).padStart(2,'0')).join('');
const hash=async x=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(x))));
const dateOk=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\d$/.test(x)&&!Number.isNaN(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;
const amount=(v,max)=>v===undefined||v===null||(Number.isInteger(v)&&v>=0&&v<=max);
export function validHealthDay(x){
 return !!(x&&dateOk(x.day)&&amount(x.steps,100000)&&amount(x.sleepMinutes,1440)&&amount(x.exerciseMinutes,1440)&&
  Object.keys(x).every(k=>['day','steps','sleepMinutes','exerciseMinutes'].includes(k))&&
  ['steps','sleepMinutes','exerciseMinutes'].some(k=>Object.hasOwn(x,k)&&x[k]!==null));
}
async function body(req,limit=16000){const t=await req.text();if(t.length>limit)throw Error('too-large');return JSON.parse(t);}
const tokenFrom=req=>(req.headers.get('authorization')||'').replace(/^Bearer /,'');
async function device(req,env){const token=tokenFrom(req);if(!/^ch1_[a-f0-9]{64}$/.test(token))return null;
 const row=await env.DB.prepare('SELECT owner_sub FROM health_devices WHERE token_hash=? AND revoked=0').bind(await hash(token)).first();
 return row?{sub:row.owner_sub}:null;
}
export async function startHealthPair(env,identity){
 const code=String(crypto.getRandomValues(new Uint32Array(1))[0]%100000000).padStart(8,'0');
 const created=new Date().toISOString(),expires=new Date(Date.now()+10*60000).toISOString();
 await env.DB.prepare('DELETE FROM health_pair_codes WHERE owner_sub=?').bind(identity.sub).run();
 await env.DB.prepare('INSERT INTO health_pair_codes(code_hash,owner_sub,expires_at,created_at) VALUES(?,?,?,?)').bind(await hash(code),identity.sub,expires,created).run();
 return json({code,expiresAt:expires});
}
export async function claimHealthPair(req,env){
 let data;try{data=await body(req,300);}catch{return json({error:'invalid-body'},400);}
 if(!/^\d{8}$/.test(data?.code||''))return json({error:'invalid-code'},400);
 // All claim attempts consume one of at most 8 guesses per 10-minute bucket per IP, reusing watch limiter table.
 const ip=req.headers.get('CF-Connecting-IP')||'unknown';const key=await hash('health-pair:'+ip);
 const window=Math.floor(Date.now()/600000);
 const row=await env.DB.prepare('SELECT window_start,attempts FROM watch_pair_attempts WHERE ip_hash=?').bind(key).first();
 if(row?.window_start===window&&row.attempts>=8)return json({error:'rate-limited'},429);
 await env.DB.prepare('INSERT INTO watch_pair_attempts(ip_hash,window_start,attempts) VALUES(?,?,1) ON CONFLICT(ip_hash) DO UPDATE SET window_start=excluded.window_start,attempts=CASE WHEN window_start=excluded.window_start THEN attempts+1 ELSE 1 END').bind(key,window).run();
 const ch=await hash(data.code),found=await env.DB.prepare('SELECT owner_sub FROM health_pair_codes WHERE code_hash=? AND expires_at>?').bind(ch,new Date().toISOString()).first();
 if(!found)return json({error:'invalid-or-expired-code'},401);
 const deleted=await env.DB.prepare('DELETE FROM health_pair_codes WHERE code_hash=? AND expires_at>?').bind(ch,new Date().toISOString()).run();
 if(deleted.meta?.changes!==1)return json({error:'already-used'},409);
 const token='ch1_'+hex(crypto.getRandomValues(new Uint8Array(32)));
 await env.DB.prepare('INSERT INTO health_devices(token_hash,owner_sub,label,created_at) VALUES(?,?,?,?)').bind(await hash(token),found.owner_sub,'Compass Android Health Connect',new Date().toISOString()).run();
 return json({token,paired:true});
}
export async function uploadHealthDays(req,env){
 const d=await device(req,env);if(!d)return json({error:'unauthorized'},401);
 let data;try{data=await body(req,12000);}catch{return json({error:'invalid-body'},400);}
 if(!Array.isArray(data?.days)||data.days.length<1||data.days.length>14||!data.days.every(validHealthDay))return json({error:'invalid-days'},400);
 const now=new Date().toISOString(),maxDay=new Date(Date.now()+86400000).toISOString().slice(0,10),minDay=new Date(Date.now()-32*86400000).toISOString().slice(0,10);
 if(data.days.some(x=>x.day>maxDay||x.day<minDay))return json({error:'invalid-date-range'},400);
 const seen=new Set();if(data.days.some(x=>{if(seen.has(x.day))return true;seen.add(x.day);return false;}))return json({error:'duplicate-days'},400);
 const ops=data.days.map(x=>env.DB.prepare(`INSERT INTO health_daily(owner_sub,day,steps,sleep_minutes,exercise_minutes,updated_at) VALUES(?,?,?,?,?,?)
 ON CONFLICT(owner_sub,day) DO UPDATE SET steps=COALESCE(excluded.steps,health_daily.steps),sleep_minutes=COALESCE(excluded.sleep_minutes,health_daily.sleep_minutes),exercise_minutes=COALESCE(excluded.exercise_minutes,health_daily.exercise_minutes),updated_at=excluded.updated_at`)
  .bind(d.sub,x.day,x.steps??null,x.sleepMinutes??null,x.exerciseMinutes??null,now));
 await env.DB.batch(ops);return json({ok:true,count:data.days.length});
}
export async function listHealthDays(req,env,identity){
 const days=Math.max(1,Math.min(90,Number(new URL(req.url).searchParams.get('days'))||30));
 const rows=await env.DB.prepare('SELECT day,steps,sleep_minutes,exercise_minutes,updated_at FROM health_daily WHERE owner_sub=? ORDER BY day DESC LIMIT ?').bind(identity.sub,days).all();
 return json({days:(rows.results||[]).map(x=>({day:x.day,steps:x.steps,sleepMinutes:x.sleep_minutes,exerciseMinutes:x.exercise_minutes,updatedAt:x.updated_at}))});
}
export async function listHealthDevices(env,identity){const rows=await env.DB.prepare('SELECT token_hash,label,created_at FROM health_devices WHERE owner_sub=? AND revoked=0').bind(identity.sub).all();return json({devices:(rows.results||[]).map(x=>({deviceHash:x.token_hash,label:x.label,createdAt:x.created_at}))});}
export async function revokeHealthDevice(req,env,identity){let d;try{d=await body(req,300);}catch{return json({error:'invalid-body'},400);}if(!/^[a-f0-9]{64}$/.test(d?.deviceHash||''))return json({error:'invalid-device'},400);
 await env.DB.prepare('UPDATE health_devices SET revoked=1 WHERE owner_sub=? AND token_hash=?').bind(identity.sub,d.deviceHash).run();return json({revoked:true});}

export async function deleteHealthDays(env,identity){
 const result=await env.DB.prepare('DELETE FROM health_daily WHERE owner_sub=?').bind(identity.sub).run();
 return json({deleted:true,count:result.meta?.changes||0});
}
