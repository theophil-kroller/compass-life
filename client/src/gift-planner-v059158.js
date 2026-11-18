/** Compass 0.5.91.58 · private, recurring gift planner. Stored inside the encrypted vault.
 * Gift history is retained across years; deletion is a tombstone for device merge.
 */
export const GIFT_OCCASIONS=Object.freeze({christmas:'🎄 Weihnachten',birthday:'🎂 Geburtstag',easter:'🐣 Ostern',other:'✨ Anderer Anlass'});
export const GIFT_STAGES=Object.freeze({idea:'Idee',planned:'Ausgewählt',bought:'Gekauft',wrapped:'Verpackt',given:'Geschenkt'});
const validDay=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
export function giftEntries(state,{includeDeleted=false}={}){
 const entries=Array.isArray(state?.giftPlanner58?.entries)?state.giftPlanner58.entries:[];
 return entries.filter(x=>x?.id&&typeof x.title==='string'&&(includeDeleted||!x.deleted)).sort((a,b)=>Number(b.year)-Number(a.year)||String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
}
export function upsertGift(state,input,{idFactory=()=>crypto.randomUUID(),at=new Date().toISOString()}={}){
 const title=String(input?.title||'').trim(),year=Number(input?.year),occasion=String(input?.occasion||'');
 if(!title||title.length>160)throw Error('Geschenkbezeichnung erforderlich (maximal 160 Zeichen).');
 if(!Number.isInteger(year)||year<2000||year>2200)throw Error('Ungültiges Geschenk-Jahr.');
 if(!(occasion in GIFT_OCCASIONS))throw Error('Unbekannter Anlass.');
 const stage=String(input?.stage||'idea');if(!(stage in GIFT_STAGES))throw Error('Unbekannter Status.');
 const price=String(input?.price||'').trim();if(price&&!/^(?:\d{1,5})(?:[.,]\d{1,2})?$/.test(price))throw Error('Budget bitte als positiven EUR-Betrag angeben.');
 const id=String(input?.id||'')||idFactory(),entries=(state.giftPlanner58??={entries:[]}).entries;
 if(!Array.isArray(entries))throw Error('Ungültige Geschenkliste.');
 const prev=entries.find(x=>x.id===id);
 if(input?.id&&!prev)throw Error('Geschenk nicht gefunden.');
 const row={id,title,year,occasion,stage,personId:String(input?.personId||'').slice(0,128),person:String(input?.person||'').trim().slice(0,120),price:price?Number(price.replace(',','.')):null,note:String(input?.note||'').trim().slice(0,700),updatedAt:at,deleted:false,createdAt:prev?.createdAt||at};
 if(prev)entries[entries.indexOf(prev)]=row;else entries.push(row);
 return row;
}
export function removeGift(state,id,at=new Date().toISOString()){
 const entry=giftEntries(state).find(x=>x.id===id);if(!entry)throw Error('Geschenk nicht gefunden.');entry.deleted=true;entry.updatedAt=at;return entry;
}
export function mergeGiftPlanner(left={},right={}){
 const merged=new Map();for(const row of [...(left?.entries||[]),...(right?.entries||[])]){
  if(!row?.id)continue;const old=merged.get(row.id);
  if(!old||String(row.updatedAt||'')>String(old.updatedAt||'')||(String(row.updatedAt||'')===String(old.updatedAt||'')&&Boolean(row.deleted)&&!old.deleted))merged.set(row.id,row);
 }
 return {entries:[...merged.values()].sort((a,b)=>String(a.id).localeCompare(String(b.id)))};
}
export function giftSummary(state,{year,occasion='christmas'}={}){
 const rows=giftEntries(state).filter(x=>x.year===year&&x.occasion===occasion);
 const given=rows.filter(x=>x.stage==='given').length,bought=rows.filter(x=>['bought','wrapped','given'].includes(x.stage)).length;
 const planned=rows.filter(x=>x.stage!=='idea').length;
 const budget=rows.reduce((sum,x)=>sum+(typeof x.price==='number'?x.price:0),0);
 return {rows,total:rows.length,given,bought,planned,budget};
}
export function giftHistoryForPerson(state,personId){return giftEntries(state).filter(x=>personId&&x.personId===personId&&x.stage==='given');}
export function christmasGiftNudge(state,{today=new Date().toISOString().slice(0,10)}={}){
 if(!validDay(today))return null;const year=Number(today.slice(0,4)),christmas=`${year}-12-24`,delta=Math.round((Date.parse(christmas+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000);
 if(delta<0||delta>60)return null;
 const info=giftSummary(state,{year});const pending=info.rows.filter(x=>!['bought','wrapped','given'].includes(x.stage));
 return {days:delta,...info,pending:pending.length,message:!info.total?`Noch ${delta} Tage bis Heiligabend: Geschenkideen frühzeitig sammeln.`:pending.length?`Noch ${delta} Tage bis Heiligabend · ${pending.length} Geschenk${pending.length===1?'':'e'} noch nicht besorgt.`:`Noch ${delta} Tage bis Heiligabend · alle ${info.total} geplanten Geschenke besorgt.`};
}
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
export function giftPlannerView(state,{year=new Date().getFullYear(),occasion='christmas',editingId=''}={}){
 const values=Object.values(state?.people||{}).filter(p=>p?.id&&p?.name).sort((a,b)=>a.name.localeCompare(b.name,'de'));
 const info=giftSummary(state,{year,occasion}),editing=giftEntries(state).find(x=>x.id===editingId)||null;
 const select=(name,items,current)=>`<select name="${name}">${Object.entries(items).map(([id,label])=>`<option value="${esc(id)}" ${id===current?'selected':''}>${esc(label)}</option>`).join('')}</select>`;
 const who=editing?.personId||'',name=editing?.person||'';
 const personOptions='<option value="">Person frei eingeben</option>'+values.map(x=>`<option value="${esc(x.id)}" ${x.id===who?'selected':''}>${esc(x.name)}</option>`).join('');
 const option=x=>`<option value="${esc(x)}" ${x===String(year)?'selected':''}>${esc(x)}</option>`;
 const entries=info.rows;
 const previous=giftEntries(state).filter(x=>x.year!==year&&x.occasion===occasion).slice(0,80);
 const printRow=(x,old=false)=>{
  const person=state?.people?.[x.personId]?.name||x.person||'Ohne Person',detail=[GIFT_STAGES[x.stage],typeof x.price==='number'?x.price.toLocaleString('de-AT',{style:'currency',currency:'EUR'}):'',x.note].filter(Boolean).join(' · ');
  return `<div class="g58-row"><div><strong>${esc(x.title)}</strong><small>${esc(person)} · ${old?x.year+' · ':''}${esc(detail)}</small></div><div class="g58-actions"><button type="button" class="secondary-btn" data-action="gift58-edit" data-id="${esc(x.id)}">Bearbeiten</button>${!old?`<button type="button" class="secondary-btn" data-action="gift58-next" data-id="${esc(x.id)}">${x.stage==='given'?'✓ Geschenkt':'Status →'}</button>`:''}</div></div>`;
 };
 return `<div class="g58-shell"><section class="work-card"><div class="g58-heading"><div><h2>🎁 Geschenkplaner</h2><p class="muted-line">Wiederkehrende Anlässe, Ideen und Geschenkhistorie – privat im Tresor gespeichert.</p></div></div>
 <div class="g58-filter"><label>Anlass ${select('unused',GIFT_OCCASIONS,occasion).replace('name="unused"','data-gift58-filter="occasion"')}</label><label>Jahr <select data-gift58-filter="year">${[year-2,year-1,year,year+1,year+2].map(option).join('')}</select></label></div>
 <div class="g58-meta"><span>${info.total} Ideen/Geschenke</span><span>${info.bought} besorgt</span><span>${info.given} überreicht</span><span>${info.budget.toLocaleString('de-AT',{style:'currency',currency:'EUR'})} eingetragene Beträge</span></div></section>
 <section class="work-card"><div class="work-heading"><span>${editing?`✎ Geschenk bearbeiten · ${editing.year}`:'＋ Geschenkidee notieren'}</span></div><form id="gift58-form" class="g58-form"><input type="hidden" name="id" value="${esc(editing?.id||'')}"><label>Geschenk <input name="title" maxlength="160" required placeholder="Was möchtest du schenken?" value="${esc(editing?.title||'')}"></label><label>Für wen? <select name="personId">${personOptions}</select></label><label>Andere Person <input name="person" maxlength="120" placeholder="Optional" value="${esc(name)}"></label><label>Status ${select('stage',GIFT_STAGES,editing?.stage||'idea')}</label><label>Budget / Preis (EUR) <input type="text" name="price" inputmode="decimal" placeholder="Optional" value="${editing?.price??''}"></label><label class="g58-wide">Notiz <textarea name="note" rows="2" maxlength="700" placeholder="Link, Größe, Idee, Bezugsquelle …">${esc(editing?.note||'')}</textarea></label><div class="g58-actions g58-wide"><button class="primary-btn" type="submit">${editing?'Änderungen speichern':'Geschenk hinzufügen'}</button>${editing?`<button class="secondary-btn" type="button" data-action="gift58-cancel">Abbrechen</button><button class="secondary-btn" type="button" data-action="gift58-delete" data-id="${esc(editing.id)}">Löschen</button>`:''}</div></form></section>
 <section class="work-card"><h3>${esc(GIFT_OCCASIONS[occasion])} ${year}</h3><div class="g58-rows">${entries.map(x=>printRow(x)).join('')||'<p class="muted-line">Noch keine Geschenkideen gespeichert.</p>'}</div></section>
 <section class="work-card g58-history"><details><summary>Geschenkhistorie aus früheren Jahren (${previous.length})</summary><div class="g58-rows">${previous.map(x=>printRow(x,true)).join('')||'<p class="muted-line">Noch keine früheren Geschenke erfasst.</p>'}</div></details></section></div>`;
}
