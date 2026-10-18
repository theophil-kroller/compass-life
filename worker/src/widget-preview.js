// Read-only, separately scoped widget credentials. Does not expose Inbox notes,
// browser vault material, Google Calendar, or auth sessions.
const reply=(data,code=200)=>new Response(JSON.stringify(data),{status:code,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const hex=a=>Array.from(a,v=>v.toString(16).padStart(2,'0')).join('');
const sha=async x=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(x))));
const token=req=>(req.headers.get('authorization')||'').replace(/^Bearer /,'');
async function data(req,cap=250){try{const str=await req.text();if(str.length>cap)return null;return JSON.parse(str);}catch{return null;}}
export async function startWidgetPair(env,identity){
 const code=String(crypto.getRandomValues(new Uint32Array(1))[0]%100000000).padStart(8,'0');
 const now=new Date().toISOString(),expiry=new Date(Date.now()+10*60000).toISOString();
 await env.DB.prepare('DELETE FROM widget_pair_codes WHERE owner_sub=?').bind(identity.sub).run();
 await env.DB.prepare('INSERT INTO widget_pair_codes(code_hash,owner_sub,expires_at,created_at) VALUES(?,?,?,?)').bind(await sha(code),identity.sub,expiry,now).run();
 return reply({code,expiresAt:expiry});
}
export async function claimWidgetPair(req,env){
 const input=await data(req);if(!/^\d{8}$/.test(input?.code||''))return reply({error:'invalid-code'},400);
 const ip=req.headers.get('CF-Connecting-IP')||'unknown',key=await sha('widget-pair:'+ip),window=Math.floor(Date.now()/600000);
 const attempts=await env.DB.prepare('SELECT window_start,attempts FROM watch_pair_attempts WHERE ip_hash=?').bind(key).first();
 if(attempts?.window_start===window&&attempts.attempts>=8)return reply({error:'rate-limited'},429);
 await env.DB.prepare('INSERT INTO watch_pair_attempts(ip_hash,window_start,attempts) VALUES(?,?,1) ON CONFLICT(ip_hash) DO UPDATE SET window_start=excluded.window_start,attempts=CASE WHEN window_start=excluded.window_start THEN attempts+1 ELSE 1 END').bind(key,window).run();
 const h=await sha(input.code);const found=await env.DB.prepare('SELECT owner_sub FROM widget_pair_codes WHERE code_hash=? AND expires_at>?').bind(h,new Date().toISOString()).first();
 if(!found)return reply({error:'invalid-or-expired-code'},401);
 const removed=await env.DB.prepare('DELETE FROM widget_pair_codes WHERE code_hash=? AND expires_at>?').bind(h,new Date().toISOString()).run();
 if(removed.meta?.changes!==1)return reply({error:'already-used'},409);
 const credential='cw1_'+hex(crypto.getRandomValues(new Uint8Array(32)));
 await env.DB.prepare('INSERT INTO widget_devices(token_hash,owner_sub,label,created_at) VALUES(?,?,?,?)').bind(await sha(credential),found.owner_sub,'Compass Android Widget',new Date().toISOString()).run();
 return reply({token:credential,paired:true});
}
export async function widgetSummary(req,env){
 const raw=token(req);if(!/^cw1_[a-f0-9]{64}$/.test(raw))return reply({error:'unauthorized'},401);
 const device=await env.DB.prepare('SELECT owner_sub FROM widget_devices WHERE token_hash=? AND revoked=0').bind(await sha(raw)).first();
 if(!device)return reply({error:'unauthorized'},401);
 // Use UTC request day bound to user's device-local date (validated). No PII in query parameters.
 const day=new URL(req.url).searchParams.get('day');
 const validDay=typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&!Number.isNaN(Date.parse(day+'T12:00:00Z'))&&new Date(day+'T12:00:00Z').toISOString().slice(0,10)===day;
 const nowDay=new Date().toISOString().slice(0,10);
 if(!validDay || Math.abs(Date.parse(day+'T12:00:00Z')-Date.parse(nowDay+'T12:00:00Z'))>2*86400000)return reply({error:'invalid-day'},400);
 const today=await env.DB.prepare(`SELECT count(*) AS count FROM planning_tasks WHERE owner_sub=? AND archived=0 AND completed=0 AND workflow='next' AND
  (planned_date<=? OR (due_date IS NOT NULL AND due_date<=?))`).bind(device.owner_sub,day,day).first();
 const next=await env.DB.prepare(`SELECT title,due_date,planned_date FROM planning_tasks WHERE owner_sub=? AND archived=0 AND completed=0 AND workflow='next' AND (due_date IS NOT NULL OR planned_date IS NOT NULL)
  ORDER BY CASE WHEN due_date IS NOT NULL AND due_date<? THEN 0 ELSE 1 END,
  COALESCE(due_date,planned_date) ASC,title ASC LIMIT 1`).bind(device.owner_sub,day).first();
 const health=await env.DB.prepare('SELECT day,steps,sleep_minutes,exercise_minutes FROM health_daily WHERE owner_sub=? AND day<=? ORDER BY day DESC LIMIT 7').bind(device.owner_sub,day).all();
 const sleep=(health.results||[]).map(x=>x.sleep_minutes).filter(Number.isFinite);
 const steps=(health.results||[]).find(x=>x.day===day)?.steps??null;
 return reply({generatedAt:new Date().toISOString(),day,openToday:Math.min(999,today?.count??0),next:next?{title:next.title.slice(0,80),dueDate:next.due_date||next.planned_date}:null,
  sleepAverageMinutes:sleep.length?Math.round(sleep.reduce((a,b)=>a+b,0)/sleep.length):null,sleepMeasuredDays:sleep.length,stepsToday:steps});
}
export async function listWidgetDevices(env,identity){const q=await env.DB.prepare('SELECT token_hash,label,created_at FROM widget_devices WHERE owner_sub=? AND revoked=0').bind(identity.sub).all();return reply({devices:(q.results||[]).map(x=>({deviceHash:x.token_hash,label:x.label,createdAt:x.created_at}))});}
export async function revokeWidgetDevice(req,env,identity){const input=await data(req);if(!/^[a-f0-9]{64}$/.test(input?.deviceHash||''))return reply({error:'invalid-device'},400);
 await env.DB.prepare('UPDATE widget_devices SET revoked=1 WHERE owner_sub=? AND token_hash=?').bind(identity.sub,input.deviceHash).run();return reply({revoked:true});}
