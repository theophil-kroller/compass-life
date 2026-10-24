/** Compass 0.5.77.43 · Personal dream / daydream / fantasy journal.
 * No interpretation, diagnosis, telemetry or external service.
 * Persistence via Compass encrypted Vault and the opt-in E2EE journal mirror.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const localDay=x=>{const d=new Date(x);return Number.isNaN(d.getTime())?'':`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
export const DREAM_KINDS=Object.freeze([{id:'night',label:'Nachttraum',icon:'🌙'},{id:'daydream',label:'Tagtraum',icon:'☁️'},{id:'fantasy',label:'Fantasie',icon:'✨'}]);
const kinds=new Set(DREAM_KINDS.map(x=>x.id));
const normalizeTags=x=>Array.isArray(x)?x.map(String).map(s=>s.trim()).filter(Boolean).slice(0,10):String(x||'').split(/[,;\n]/).map(s=>s.trim()).filter(Boolean).slice(0,10);
export function dreamEntries(state,{days=0,now=new Date(),kind='all'}={}){
 const raw=Array.isArray(state?.dreamJournal?.entries)?state.dreamJournal.entries:[];
 const start=days>0?now.getTime()-days*86400000:-Infinity;
 return raw.filter(x=>x&&!x.deleted&&kinds.has(x.kind)&&iso(x.at)&&Date.parse(x.at)<=now.getTime()&&Date.parse(x.at)>=start&&(kind==='all'||x.kind===kind)).sort((a,b)=>String(b.at).localeCompare(String(a.at)));
}
export function putDreamEntry(state,raw={}){
 if(!state||typeof state!=='object')throw Error('Tresor nicht verfügbar.');
 const entry={
  id:String(raw.id||globalThis.crypto?.randomUUID?.()||`dream-${Date.now()}-${Math.random().toString(36).slice(2)}`),
  kind:kinds.has(raw.kind)?raw.kind:'night',at:String(raw.at||new Date().toISOString()),
  title:String(raw.title||'').trim().slice(0,140),body:String(raw.body||'').trim().slice(0,10000),
  mood:['positive','neutral','mixed','negative','unknown'].includes(raw.mood)?raw.mood:'unknown',
  vividness:raw.vividness===''||raw.vividness==null?null:Number(raw.vividness),
  lucid:raw.lucid===true,tags:normalizeTags(raw.tags),
  updatedAt:new Date().toISOString(),deleted:false
 };
 if(!iso(entry.at)||Date.parse(entry.at)>Date.now()+60000)throw Error('Zeitpunkt ungültig.');
 if(!entry.body&&!entry.title)throw Error('Bitte einen Titel oder eine Erinnerung notieren.');
 if(entry.vividness!=null&&(!Number.isInteger(entry.vividness)||entry.vividness<1||entry.vividness>5))throw Error('Lebendigkeit muss zwischen 1 und 5 liegen.');
 state.dreamJournal??={entries:[]};state.dreamJournal.entries??=[];
 const index=state.dreamJournal.entries.findIndex(x=>x.id===entry.id);
 if(index<0)state.dreamJournal.entries.push(entry);else state.dreamJournal.entries[index]=entry;
 return entry;
}
export function deleteDreamEntry(state,id){
 const entry=state?.dreamJournal?.entries?.find(x=>x.id===id);
 if(!entry)return false;entry.deleted=true;entry.updatedAt=new Date().toISOString();return true;
}
export function mergeDreamJournals(a={},b={}){
 const map=new Map();for(const obj of [a,b])for(const e of Array.isArray(obj?.entries)?obj.entries:[]){
  if(!e?.id||!kinds.has(e.kind)||!iso(e.at))continue;
  const previous=map.get(e.id),rev=x=>String(x.updatedAt||x.at||'');
  if(!previous||rev(e)>rev(previous)||(rev(e)===rev(previous)&&e.deleted&&!previous.deleted))map.set(e.id,e);
 }
 return {entries:[...map.values()].sort((x,y)=>x.id.localeCompare(y.id))};
}
export function dreamInsights(state,{days=30,now=new Date()}={}){
 const filtered=dreamEntries(state,{days,now});
 const byKind=Object.fromEntries(DREAM_KINDS.map(x=>[x.id,0]));
 const byMood={positive:0,neutral:0,mixed:0,negative:0,unknown:0};
 const tags=new Map(),byDay=new Map();
 for(const e of filtered){byKind[e.kind]++;byMood[e.mood]??=0;byMood[e.mood]++;for(const t of e.tags||[])tags.set(t,(tags.get(t)||0)+1);const d=localDay(e.at);byDay.set(d,(byDay.get(d)||0)+1);}
 return {count:filtered.length,byKind,byMood,tagCounts:[...tags.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8),byDay};
}
const dateInput=raw=>{if(!iso(raw))return '';const d=new Date(raw);const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;};
export function dreamJournalView(state,{days=30,editingId='',kind='all',now=new Date()}={}){
 const all=dreamEntries(state,{now}),rows=dreamEntries(state,{days,now,kind}),editing=all.find(x=>x.id===editingId);
 const insights=dreamInsights(state,{days,now});
 const marks=Array.from({length:Math.min(30,days)},(_,i)=>{const date=new Date(now.getFullYear(),now.getMonth(),now.getDate()-Math.min(30,days)+i+1),d=localDay(date),n=insights.byDay.get(d)||0;return `<span class="dream743-dot ${n?'has-entry':''}" title="${esc(d)}: ${n} erfasst" aria-label="${esc(d)}, ${n} Einträge"></span>`;}).join('');
 const fresh=editing||{kind:'night',title:'',body:'',mood:'unknown',vividness:null,tags:[],at:new Date().toISOString(),lucid:false};
 return `<section class="dream743-root" aria-label="Traumwelt">
 <section class="work-card dream743-lead"><div class="work-heading"><span>🌙 Traumwelt · Erinnerungen & Fantasien</span><small>Privat · verschlüsselter Tresor</small></div>
 <p class="muted-line">Nachtträume, Tagträume und bewusste Fantasien – getrennt von GTD-„Dreams“. Nur erfasste Erinnerungen, keine automatische Traumdeutung.</p>
 <div class="dream743-kind-row">${DREAM_KINDS.map(k=>`<button type="button" class="dream743-chip ${fresh.kind===k.id?'selected':''}" data-action="dream743-select-kind" data-id="${k.id}">${k.icon} ${k.label}</button>`).join('')}</div>
 <form id="dream743-form" class="dream743-form"><input type="hidden" name="id" value="${esc(fresh.id||'')}">
 <label>Art<select name="kind">${DREAM_KINDS.map(k=>`<option value="${k.id}" ${k.id===fresh.kind?'selected':''}>${k.icon} ${k.label}</option>`).join('')}</select></label>
 <label>Wann?<input type="datetime-local" name="at" value="${esc(dateInput(fresh.at))}" required></label>
 <label class="dream743-wide">Titel (optional)<input name="title" maxlength="140" placeholder="Ein Stichwort genügt" value="${esc(fresh.title)}"></label>
 <label class="dream743-wide">Erinnerung / Vorstellung<textarea name="body" rows="4" maxlength="10000" placeholder="Was ist passiert, was hast du gedacht, gefühlt oder dir vorgestellt?">${esc(fresh.body)}</textarea></label>
 <label>Gefühl<select name="mood">${[['unknown','Keine Einordnung'],['positive','Angenehm'],['negative','Unangenehm'],['mixed','Gemischt'],['neutral','Neutral']].map(([v,t])=>`<option value="${v}" ${v===fresh.mood?'selected':''}>${t}</option>`).join('')}</select></label>
 <label>Lebendigkeit (optional)<select name="vividness"><option value="">Nicht bewertet</option>${[1,2,3,4,5].map(v=>`<option value="${v}" ${fresh.vividness===v?'selected':''}>${v}/5</option>`).join('')}</select></label>
 <label class="dream743-wide">Motive (kommagetrennt)<input name="tags" maxlength="300" placeholder="z. B. Wasser, Bewegung, Familie" value="${esc((fresh.tags||[]).join(', '))}"></label>
 <label class="dream743-check"><input type="checkbox" name="lucid" ${fresh.lucid?'checked':''}> Klartraum / bewusst, dass ich träume</label>
 <div class="dream743-form-actions"><button type="submit" class="primary-btn">${editing?'Änderungen speichern':'Erinnerung speichern'}</button>${editing?'<button type="button" class="secondary-btn" data-action="dream743-reset">Abbrechen</button>':''}</div></form>
 </section>
 <section class="work-card dream743-history"><div class="work-heading"><span>🔎 Traumtagebuch & Muster</span><small>${insights.count} Einträge in ${days} Tagen</small></div>
 <div class="dream743-filter">${[7,30,90].map(n=>`<button type="button" class="secondary-btn ${days===n?'selected':''}" data-action="dream743-period" data-id="${n}">${n} Tage</button>`).join('')} <select aria-label="Traumart filtern" id="dream743-kind-filter"><option value="all">Alle Arten</option>${DREAM_KINDS.map(k=>`<option value="${k.id}" ${k.id===kind?'selected':''}>${k.label}</option>`).join('')}</select></div>
 <div class="dream743-dots" role="group" aria-label="Tage mit protokollierten Träumen">${marks}</div>
 <div class="dream743-kpis">${DREAM_KINDS.map(k=>`<div><strong>${insights.byKind[k.id]}</strong><span>${k.icon} ${k.label}</span></div>`).join('')}</div>
 ${insights.tagCounts.length?`<p class="muted-line">Wiederkehrende eigene Stichwörter: ${insights.tagCounts.map(([t,n])=>`${esc(t)} (${n})`).join(' · ')}</p>`:''}
 <div class="dream743-entry-list">${rows.slice(0,80).map(x=>{const meta=DREAM_KINDS.find(k=>k.id===x.kind);return `<article class="dream743-entry"><div class="dream743-entry-head"><strong>${meta?.icon||'🌙'} ${esc(x.title||meta?.label||'Erinnerung')}</strong><small>${esc(new Date(x.at).toLocaleString('de-AT',{dateStyle:'medium',timeStyle:'short'}))}</small></div><p>${esc(x.body).replace(/\n/g,'<br>')}</p><div class="dream743-entry-actions"><span>${esc((x.tags||[]).join(' · '))}</span><button type="button" class="secondary-btn" data-action="dream743-edit" data-id="${esc(x.id)}">Bearbeiten</button><button type="button" class="secondary-btn" data-action="dream743-delete" data-id="${esc(x.id)}">Löschen</button></div></article>`;}).join('')||'<p class="muted-line">In diesem Zeitraum wurde noch keine Erinnerung erfasst. Das bedeutet nicht, dass du nicht geträumt hast.</p>'}</div>
 </section></section>`;
}
