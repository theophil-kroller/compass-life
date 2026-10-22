/** Compass 0.5.76.1 — voluntary, private physical closeness log. No inference and no relationship scores. */
export const TOUCH_KINDS=Object.freeze([
 {id:'hug',icon:'🫂',name:'Umarmung'}, {id:'dance',icon:'💃',name:'Tanzen'},
 {id:'cuddle',icon:'🤗',name:'Kuscheln'}, {id:'kiss',icon:'💋',name:'Küssen'},
 {id:'sex',icon:'❤️',name:'Sex / Intimität'}, {id:'sleep',icon:'🌙',name:'Zusammen einschlafen'},
 {id:'hold',icon:'🤝',name:'Händchen halten'}, {id:'other',icon:'✨',name:'Andere Nähe'}
]);
export function touchKinds(row){const values=Array.isArray(row?.kinds)?row.kinds:[row?.kind];return [...new Set(values.filter(id=>TOUCH_KINDS.some(k=>k.id===id)))];}
const validTime=s=>typeof s==='string'&&Number.isFinite(Date.parse(s));
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function touchEntries(state){return (Array.isArray(state?.touchJournal?.entries)?state.touchJournal.entries:[]).filter(x=>x&&!x.deleted&&validTime(x.at)&&touchKinds(x).length>0).sort((a,b)=>String(b.at).localeCompare(String(a.at)));}
export function putTouch(state,{id,kind,kinds,at,personId='',person='',note='',deleted=false}={}){
 const selected=[...new Set((Array.isArray(kinds)?kinds:[kind]).filter(x=>TOUCH_KINDS.some(k=>k.id===x)))];
 if(!selected.length)throw Error('Bitte mindestens eine Aktivität auswählen.');
 if(!validTime(at))throw Error('Ungültiger Zeitpunkt.');
 if(!state.touchJournal||typeof state.touchJournal!=='object')state.touchJournal={entries:[]};
 if(!Array.isArray(state.touchJournal.entries))state.touchJournal.entries=[];
 const previous=state.touchJournal.entries.find(x=>x.id===id);
 const row={id:id||crypto.randomUUID(),kind:selected[0],kinds:selected,at,
  personId:String(personId||'').trim().slice(0,120),person:String(person||'').trim().slice(0,100),
  note:String(note||'').trim().slice(0,500),deleted:!!deleted,updatedAt:new Date().toISOString()};
 const index=state.touchJournal.entries.findIndex(x=>x.id===row.id);
 if(index<0)state.touchJournal.entries.push(row);else state.touchJournal.entries[index]=row;
 return row;
}
export function deleteTouch(state,id){const item=state?.touchJournal?.entries?.find(x=>x.id===id);if(!item)throw Error('Eintrag nicht gefunden.');item.deleted=true;item.updatedAt=new Date().toISOString();return item;}
export function mergeTouchJournal(left={},right={}){const m=new Map();for(const r of [...(left?.entries||[]),...(right?.entries||[])]){if(!r||!r.id||!touchKinds(r).length)continue;const prev=m.get(r.id);if(!prev||String(r.updatedAt||'')>String(prev.updatedAt||'')||(String(r.updatedAt||'')===String(prev.updatedAt||'')&&r.deleted===true))m.set(r.id,r);}return {entries:[...m.values()].sort((a,b)=>a.id.localeCompare(b.id))};}
/** Person suggestions are based only on this person's own previously saved activity types. */
export function suggestedTouchKinds(state,personId,limit=3){
 if(!personId)return [];
 const rows=touchEntries(state).filter(e=>e.personId===personId),counts=new Map();
 for(const e of rows)for(const kind of touchKinds(e))counts.set(kind,(counts.get(kind)||0)+1);
 return [...counts].sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([id])=>id);
}
export function touchPersonOptions(state,selected='',fallbackName=''){
 const people=Object.values(state?.people||{}).filter(p=>p?.id&&p?.name&&['family','partner','friend'].includes(p.relationKind)).sort((a,b)=>a.name.localeCompare(b.name,'de'));
 const chosen=people.find(p=>p.id===selected);
 return `<option value="">Ohne Person</option>${people.map(p=>`<option value="${esc(p.id)}" ${p.id===selected?'selected':''}>${esc(p.name)}</option>`).join('')}${selected&&!chosen?`<option value="" selected>Person nicht mehr vorhanden${fallbackName?' · '+esc(fallbackName):''}</option>`:''}`;
}
export function touchKindChoices(selected=[]){
 return `<div class="t577-multi-grid">${TOUCH_KINDS.map(k=>`<label class="t577-kind"><input type="checkbox" name="kinds" value="${k.id}" ${selected.includes(k.id)?'checked':''}><span class="t577-kind-icon">${k.icon}</span><span>${esc(k.name)}</span></label>`).join('')}</div>`;
}
export function touchQuickView(state,{personId='',selected=[]}={}){
 const suggested=suggestedTouchKinds(state,personId);
 return `<form id="t577-capture-form" class="t577-capture-form"><fieldset><legend>Was ist passiert? Mehrfachauswahl</legend>${touchKindChoices(selected)}</fieldset><label>Mit wem?<select name="personId">${touchPersonOptions(state,personId)}</select></label>${suggested.length?`<div class="t577-suggestions">Bei dieser Person bisher: ${suggested.map(id=>{const k=TOUCH_KINDS.find(x=>x.id===id);return `<span>${k.icon} ${esc(k.name)}</span>`;}).join('')}</div>`:''}<label>Wann?<input type="datetime-local" name="at" value="${inputDate(new Date())}" required></label><label>Notiz<input name="note" maxlength="500" placeholder="Optional"></label><div class="t577-actions"><button type="submit" class="primary-btn">Speichern</button><button type="button" class="secondary-btn" data-action="t577-capture-cancel">Abbrechen</button></div></form>`;
}
function inputDate(time){const d=new Date(time);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);}
export function touchPersonSummary(state,personId){
 const rows=touchEntries(state).filter(e=>e.personId===personId);
 const latest=rows[0],kinds=suggestedTouchKinds(state,personId,4);
 return {count:rows.length,latest:latest?.at||'',suggestions:kinds};
}
export function touchHistoryView(state,{editingId='',period=30}={}){
 const now=Date.now(),entries=touchEntries(state).filter(x=>Date.parse(x.at)>=now-period*86400000),edit=touchEntries(state).find(x=>x.id===editingId);
 const byKind=new Map();for(const e of entries)for(const k of touchKinds(e))byKind.set(k,(byKind.get(k)||0)+1);
 const max=Math.max(1,...byKind.values());
 return `<div class="t577-shell"><section class="work-card"><div class="work-heading"><span>🫂 Berührung & Nähe</span><button type="button" class="secondary-btn" data-action="t577-open">+ Erfassen</button></div><div class="t577-period">${[7,30,90].map(n=>`<button type="button" data-action="t577-period" data-id="${n}" class="${n===period?'active':''}">${n} Tage</button>`).join('')}</div></section><section class="work-card"><h3>${entries.length} Begegnungen</h3><div class="t577-bars">${TOUCH_KINDS.filter(k=>byKind.has(k.id)).map(k=>`<div class="t577-count"><span>${k.icon} ${esc(k.name)}</span><div><i style="width:${(byKind.get(k.id)/max*100).toFixed(1)}%"></i></div><strong>${byKind.get(k.id)}</strong></div>`).join('')||'<p class="muted-line">Noch keine Einträge.</p>'}</div></section><section class="work-card"><h3>Chronik</h3><div class="t577-chronicle">${entries.slice(0,100).map(e=>{const names=touchKinds(e).map(id=>TOUCH_KINDS.find(k=>k.id===id)?.icon+' '+TOUCH_KINDS.find(k=>k.id===id)?.name).join(' · ');const person=state?.people?.[e.personId]?.name||e.person||'';return `<button type="button" data-action="t577-edit" data-id="${esc(e.id)}"><span><strong>${esc(names)}</strong><small>${esc(person)}${e.note?' · '+esc(e.note):''}</small></span><time>${new Date(e.at).toLocaleDateString('de-AT',{day:'2-digit',month:'short'})}</time></button>`;}).join('')||'<p class="muted-line">Noch keine Einträge.</p>'}</div></section>${edit?`<section class="work-card"><div class="work-heading"><span>Eintrag bearbeiten</span><button type="button" data-action="t577-cancel">Schließen</button></div><form id="t577-edit-form"><input type="hidden" name="id" value="${esc(edit.id)}"><fieldset><legend>Aktivitäten</legend>${touchKindChoices(touchKinds(edit))}</fieldset><label>Wann?<input type="datetime-local" name="at" required value="${inputDate(edit.at)}"></label><label>Person<select name="personId">${touchPersonOptions(state,edit.personId,edit.person)}</select></label><label>Notiz<textarea name="note" maxlength="500" rows="2">${esc(edit.note)}</textarea></label><div class="t577-actions"><button class="primary-btn" type="submit">Speichern</button><button type="button" class="secondary-btn" data-action="t577-delete" data-id="${esc(edit.id)}">Löschen</button></div></form></section>`:''}</div>`;
}
