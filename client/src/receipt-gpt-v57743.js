import {categoryInfo,RECEIPT_CATEGORY_GROUPS,receiptCategoryForItem,mergeReceiptCategoryRules} from './receipt-categories-v57745.js';
/** Compass 0.5.77.44: GPT-assisted receipt JSON inbox (not finance bookings).
 * User checks before commit; unknowns are null; no silent bank/food logging.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validDate=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||'')))return false;const d=new Date(s+'T12:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===s;};
const money=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<100000?Math.round(x*100)/100:null;
const trim=(x,max)=>String(x||'').trim().slice(0,max);
export const RECEIPT_SCHEMA='compass_receipt_v1';
export const RECEIPT_GPT_PROMPT=`Lies das hochgeladene Foto oder PDF eines Supermarkt-Kassenbons aus. Gib AUSSCHLIESSLICH valides JSON zurück (keine Markdown-Codezäune). Bei einem Bon ein Objekt, bei mehreren Bons ein Array solcher Objekte, nach diesem Schema:\n{\n  "schema":"compass_receipt_v1",\n  "merchant":"Hofer",\n  "date":"2026-10-24",\n  "currency":"EUR",\n  "total":null,\n  "items":[{\n    "description":"Produktname wie am Bon",\n    "quantity":1,\n    "unit":"Stück",\n    "unit_price":null,\n    "total":2.49,\n    "category":"Lebensmittel",\n    "confidence":"high"\n  }],\n  "notes":["Unsichere Positionen oder Rabattzuordnungen erläutern"]\n}\nRegeln: Belasse unbekannte Felder bei null. Rate keine Produktnamen, Grammzahlen oder Preise. Trenne nach Möglichkeit Mengen, Einzelpreis und Zeilensumme. Erhalte Rabatte als eigene negative Position NICHT; beschreibe sie in notes und gib ggf. den tatsächlich gezahlten Artikelpreis an. Wähle category aus Lebensmittel, Getränke, Haushalt, Drogerie, Bücher, Sonstiges. Für confidence high/medium/low. Bestimme Datum und Gesamtsumme nur wenn lesbar; EUR nur wenn der Bon es unterstützt. Erfasse keinerlei Zahlungs- oder Kartennummern, Namen, Anschriften, Kunden-IDs. Stimmt die Summe der Positionen nicht mit total überein, notiere die Abweichung; erfinde keine Position. Die Rückgabe dient ausschließlich einer prüfbaren Compass-Vorschau und erzeugt keine Finanzbuchung.`;
function fingerprint(x){const raw=[x.merchant.toLowerCase(),x.date,x.total??'?',...x.items.map(v=>v.description.toLowerCase()+'@'+(v.total??'?'))].join('|');let h=2166136261;for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619);}return 'rcpt-'+(h>>>0).toString(16);}
/** Accept plain JSON, GPT markdown fences, and the escaped multiline form from
 * ChatGPT copy/paste. Only decode copy-format artefacts, never guess prices. */
export function normalizeReceiptJSONText(raw){
 if(typeof raw!=='string'||raw.length>160000)throw Error('JSON ist zu groß (maximal 160 KB).');
 let s=raw.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
 // ChatGPT's rich clipboard sometimes turns leading indentation into &#x20;
 // and inserts backslash-newline as a soft break.
 if(/&#(?:x20|32);/i.test(s))s=s.replace(/&#(?:x20|32);/gi,' ');
 if(/\\\r?\n/.test(s))s=s.replace(/\\\r?\n/g,'\n');
 return s;
}
function parseOneReceipt(obj){
 if(!obj||typeof obj!=='object'||Array.isArray(obj)||obj.schema!==RECEIPT_SCHEMA)throw Error('Falsches Schema: compass_receipt_v1 erforderlich.');
 if(!validDate(obj.date))throw Error('Bon-Datum fehlt oder ist nicht im Format JJJJ-MM-TT.');
 const merchant=trim(obj.merchant,100);if(!merchant)throw Error('Händler fehlt.');
 if(obj.currency!=='EUR')throw Error('Derzeit werden nur EUR-Bons unterstützt; Währung nicht stillschweigend umrechnen.');
 if(!Array.isArray(obj.items)||!obj.items.length||obj.items.length>250)throw Error('Bitte zwischen 1 und 250 Positionen angeben.');
 const items=obj.items.map((x,i)=>{
  if(!x||typeof x!=='object')throw Error('Ungültige Position '+(i+1));
  const description=trim(x.description,130);if(!description)throw Error('Produktbezeichnung fehlt in Position '+(i+1));
  const quantity=x.quantity==null?null:Number(x.quantity);
  if(quantity!=null&&(!Number.isFinite(quantity)||quantity<=0||quantity>1000))throw Error('Ungültige Menge in Position '+(i+1));
  const t=x.total==null?null:money(x.total),p=x.unit_price==null?null:money(x.unit_price);
  if(x.total!=null&&t==null||x.unit_price!=null&&p==null)throw Error('Ungültiger Betrag in Position '+(i+1));
  return {description,quantity,unit:trim(x.unit,25)||null,unit_price:p,total:t,category:['Lebensmittel','Getränke','Haushalt','Drogerie','Sonstiges'].includes(x.category)?x.category:'Sonstiges',confidence:['high','medium','low'].includes(x.confidence)?x.confidence:'low'};
 });
 const total=obj.total==null?null:money(obj.total);if(obj.total!=null&&total==null)throw Error('Ungültige Gesamtsumme.');
 const notes=Array.isArray(obj.notes)?obj.notes.slice(0,20).map(x=>trim(x,220)).filter(Boolean):[];
 const x={schema:RECEIPT_SCHEMA,date:obj.date,merchant,currency:'EUR',total,items,notes};
 return {...x,id:fingerprint(x),updatedAt:new Date().toISOString(),deleted:false};
}
/** Each item is validated before any preview or encrypted journal write. */
export function parseReceiptJSONList(raw){
 let obj;
 try{obj=JSON.parse(normalizeReceiptJSONText(raw));}
 catch{throw Error('Kein gültiges JSON. Bitte den vollständigen JSON-Block inklusive [ ] oder { } kopieren.');}
 const list=Array.isArray(obj)?obj:obj&&typeof obj==='object'&&Array.isArray(obj.receipts)?obj.receipts:[obj];
 if(!list.length||list.length>40)throw Error('Zwischen 1 und 40 Bons pro Import erlaubt.');
 const seen=new Set(),results=[];
 for(const [i,entry] of list.entries()){
  let receipt;try{receipt=parseOneReceipt(entry);}catch(ex){throw Error(`Bon ${i+1}: ${ex.message}`);}
  if(seen.has(receipt.id))throw Error(`Bon ${i+1} kommt im selben Import doppelt vor.`);
  seen.add(receipt.id);results.push(receipt);
 }
 return results;
}
/** Historical single-receipt API kept for earlier Compass modules/tests. */
export function parseReceiptJSON(raw){
 const rows=parseReceiptJSONList(raw);
 if(rows.length!==1)throw Error(`${rows.length} Kassenbons erkannt: bitte die Mehrfachvorschau verwenden.`);
 return rows[0];
}
export function receiptWarnings(row){
 if(!row)return [];
 const issues=[],known=row.items.filter(x=>x.total!==null).reduce((n,x)=>n+x.total,0);
 if(row.items.some(x=>x.total===null))issues.push('Einzelne Preise fehlen: Summe nicht vollständig überprüfbar.');
 else if(row.total!==null&&Math.abs(known-row.total)>0.03)issues.push('Positionssumme '+known.toFixed(2)+' € weicht von der Bonsumme '+row.total.toFixed(2)+' € ab (Rabatte, Pfand o. Ä. prüfen).');
 if(row.items.some(x=>x.confidence!=='high'))issues.push('Unsichere Produkte oder Mengen bitte vor dem Speichern prüfen.');
 return issues.concat(row.notes||[]);
}
export function receiptEntries(state){return (state?.receiptJournal?.entries||[]).filter(x=>x&&!x.deleted).sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.updatedAt).localeCompare(String(a.updatedAt)));}
export function putReceipt(state,row){
 if(!state||!row?.id||row.schema!==RECEIPT_SCHEMA)throw Error('Ungeprüfter Bon.');
 state.receiptJournal??={entries:[]};state.receiptJournal.entries??=[];
 const existing=state.receiptJournal.entries.find(x=>x.id===row.id&&!x.deleted);
 if(existing)throw Error('Dieser Bon wurde bereits gespeichert. Kein doppelter Import.');
 const i=state.receiptJournal.entries.findIndex(x=>x.id===row.id);
 if(i>=0)state.receiptJournal.entries[i]={...row,deleted:false,updatedAt:new Date().toISOString()};else state.receiptJournal.entries.push(row);
 return row;
}
/** Never overwrite existing entries; duplicates are returned as skipped. */
export function putReceipts(state,receipts){
 if(!Array.isArray(receipts)||!receipts.length||receipts.length>40)throw Error('Keine gültigen Bons in der Vorschau.');
 if(!state||typeof state!=='object')throw Error('Tresor nicht verfügbar.');
 const ids=new Set();for(const row of receipts){
  if(!row||!row.id||row.schema!==RECEIPT_SCHEMA||ids.has(row.id))throw Error('Bonvorschau ungültig oder doppelt.');
  ids.add(row.id);
 }
 let added=0,skipped=0;
 for(const row of receipts){
  if(state.receiptJournal?.entries?.some(x=>x.id===row.id&&!x.deleted)){skipped++;continue;}
  putReceipt(state,row);added++;
 }
 return {added,skipped};
}
export function deleteReceipt(state,id){const row=state?.receiptJournal?.entries?.find(x=>x.id===id);if(!row)return false;row.deleted=true;row.updatedAt=new Date().toISOString();return true;}
export function mergeReceiptJournals(a={},b={}){
 const rows=new Map();for(const journal of [a,b])for(const x of journal?.entries||[]){if(!x?.id||x.schema!==RECEIPT_SCHEMA)continue;const prev=rows.get(x.id);if(!prev||String(x.updatedAt)>String(prev.updatedAt)||(x.updatedAt===prev.updatedAt&&x.deleted&&!prev.deleted))rows.set(x.id,x);}
 return {entries:[...rows.values()].sort((x,y)=>x.id.localeCompare(y.id)),categoryRules:mergeReceiptCategoryRules(a.categoryRules,b.categoryRules)};
}
/** Descriptive purchases; never turns a checkout item into a consumed meal. */
export function receiptMonthSummary(state,month){
 if(!/^\d{4}-\d{2}$/.test(month))throw Error('Monat ungültig');
 const receipts=receiptEntries(state).filter(r=>r.date.startsWith(month));
 const products=new Map(),categories=new Map(),coverage={known:0,missing:0,uncertain:0};
 for(const receipt of receipts)for(const item of receipt.items||[]){
  const key=String(item.description||'').trim().toLocaleLowerCase('de-AT');
  if(!key)continue;const before=products.get(key)||{name:item.description,quantity:0,unit:item.unit||null,amount:0,unknown:0,count:0};
  before.count++;if(Number.isFinite(item.quantity)&&item.quantity>0&&(!before.unit||before.unit===item.unit)){
   if(!before.unit)before.unit=item.unit||null;before.quantity+=item.quantity;
  }else before.unknown++;
  if(item.total!=null)before.amount+=item.total;else before.unknown++;
  products.set(key,before);
  const assignment=receiptCategoryForItem(state,receipt,item);const category=assignment.category;
  const prior=categories.get(category)||{id:category,label:categoryInfo(category).label,icon:categoryInfo(category).icon,amount:0,count:0,missing:0};
  prior.count++;if(item.total==null){prior.missing++;coverage.missing++;}else{prior.amount=Math.round(Math.round(prior.amount*100)+Math.round(item.total*100))/100;coverage.known=Math.round(Math.round(coverage.known*100)+Math.round(item.total*100))/100;}
  if(assignment.confidence!=='high'&&assignment.confidence!=='manual')coverage.uncertain++;
  categories.set(category,prior);
 }
 return {receipts,products:[...products.values()].sort((a,b)=>b.count-a.count||b.amount-a.amount).slice(0,25),categories:[...categories.values()].sort((a,b)=>b.amount-a.amount||a.label.localeCompare(b.label,'de')),coverage};
}
const euro=x=>x==null?'–':`${x.toLocaleString('de-AT',{minimumFractionDigits:2,maximumFractionDigits:2})} €`;
export function receiptInboxView(state,{draft=null,now=new Date(),month:monthOption=null}={}){
 const rows=receiptEntries(state),month=/^\d{4}-\d{2}$/.test(monthOption||'')?monthOption:`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`,{products,receipts:current,categories,coverage}=receiptMonthSummary(state,month);
 const amount=current.filter(x=>x.total!=null).reduce((s,x)=>s+x.total,0);
 const unknown=current.filter(x=>x.total==null).length;
 const drafts=draft?(Array.isArray(draft)?draft:[draft]):[];
 const previewAmount=drafts.reduce((n,r)=>n+(r.total||0),0);
 const previewKnown=drafts.filter(r=>r.total!=null).length;
 const allAmount=categories.reduce((sum,c)=>sum+c.amount,0),maxValue=Math.max(1,...categories.map(c=>c.amount));
 const categoryOptions=(receipt,item)=>{const assignment=receiptCategoryForItem(state,receipt,item),selected=state?.receiptJournal?.categoryRules?.[assignment.key]?.category;return `<option value="auto" ${!selected||selected==='auto'?'selected':''}>Automatisch: ${esc(categoryInfo(assignment.category).label)}</option>`+RECEIPT_CATEGORY_GROUPS.filter(([id])=>id!=='unknown').map(([id,label])=>`<option value="${id}" ${selected===id?'selected':''}>${esc(label)}</option>`).join('')+`<option value="unknown" ${selected==='unknown'?'selected':''}>Noch zu prüfen</option>`;};
 return `<section class="work-card receipts743-root"><div class="work-heading"><span>🧾 Kassenbons · GPT → JSON → Compass</span><small>Prüfen vor Speichern</small></div><p class="muted-line">Bon fotografieren, den untenstehenden Prompt mit dem Bild an ChatGPT senden und das JSON hier einfügen. Keine automatische Bankbuchung, keine automatischen Ernährungseinträge.</p>
 <section class="receipts745-categories" aria-label="Warenkorb nach Produktgruppen"><div class="receipts745-heading"><div><h3>Wofür gibst du beim Einkaufen Geld aus?</h3><p>Aus den Bonpositionen erkannt · kein Bankumsatz und kein Ernährungsnachweis</p></div><div class="receipts745-month"><button type="button" data-action="receipts745-month" data-id="prev" aria-label="Vormonat">‹</button><strong>${esc(month)}</strong><button type="button" data-action="receipts745-month" data-id="next" aria-label="Folgemonat">›</button></div></div>
 ${categories.length?`<div class="receipts745-stats"><strong>${euro(allAmount)}</strong> bekannte Positionsausgaben · ${current.length} Bon(s) · ${categories.reduce((n,c)=>n+c.count,0)} Positionen${coverage.missing?' · '+coverage.missing+' ohne Preis':''}</div><div class="receipts745-bars">${categories.map(c=>`<div class="receipts745-bar" title="${esc(c.label)}: ${euro(c.amount)}${c.missing?' · '+c.missing+' fehlende Preise':''}"><span class="receipts745-label">${c.icon} ${esc(c.label)}</span><span class="receipts745-track"><i style="width:${Math.max(0,c.amount/maxValue*100).toFixed(1)}%" class="${c.id==='unknown'?'is-unknown':''}"></i></span><strong>${euro(c.amount)}</strong><small>${allAmount>0?(c.amount/allAmount*100).toFixed(1).replace('.',','):'–'} %</small></div>`).join('')}</div><p class="receipts745-explain">${coverage.uncertain} Position(en) mit unbekannter oder nur grober Einordnung. Bei unsicheren Bonkürzeln keine erfundene Produktkategorie.</p>`:'<p class="muted-line">Für diesen Monat sind noch keine Bonpositionen gespeichert. Mit ‹ und › kannst du andere Monate ansehen.</p>'}
 ${current.length?`<details class="receipts745-review"><summary>✏️ Produktgruppen prüfen und korrigieren (${current.reduce((n,r)=>n+r.items.length,0)} Positionen)</summary><p>Wählst du eine Gruppe, merkt sich Compass die Zuordnung für dieselbe Produktbezeichnung bei diesem Händler. Der Kassenbon bleibt unverändert.</p><div class="receipts745-lines">${current.flatMap(r=>r.items.map((item,i)=>{const assigned=receiptCategoryForItem(state,r,item);return `<div class="receipts745-line"><span class="receipts745-description"><strong>${esc(item.description)}</strong><small>${esc(r.merchant)} · ${esc(r.date)} · ${euro(item.total)}${assigned.confidence==='low'?' · ⚠️ prüfen':''}</small></span><select class="receipts745-select" data-receipt-id="${esc(r.id)}" data-receipt-index="${i}" aria-label="Kategorie für ${esc(item.description)}">${categoryOptions(r,item)}</select></div>`;})).slice(0,200).join('')}</div>${current.reduce((n,r)=>n+r.items.length,0)>200?'<p>Die ersten 200 Positionen werden angezeigt.</p>':''}</details>`:''}</section>

 <details class="receipts743-prompt"><summary>GPT-Prompt anzeigen / kopieren</summary><textarea readonly id="receipts743-prompt" rows="8">${esc(RECEIPT_GPT_PROMPT)}</textarea><button type="button" class="secondary-btn" data-action="receipts743-copy">Prompt kopieren</button></details>
 ${drafts.length?`<div class="receipts743-preview" role="status"><h3>Prüfvorschau: ${drafts.length} ${drafts.length===1?'Bon':'Bons'}</h3><p>${previewKnown} Bonsummen bekannt · ${euro(previewAmount)} · Noch nichts gespeichert</p>
 ${drafts.map((r,i)=>`<section class="receipts744-draft"><h4>${i+1}. ${esc(r.merchant)} · ${esc(r.date)} · ${euro(r.total)}</h4><p>${r.items.length} Positionen</p><div class="receipts743-table">${r.items.map(x=>`<div><span>${esc(x.description)}${x.confidence==='low'?' ⚠️':''}<small class="receipts745-preview-category"> · ${esc(categoryInfo(receiptCategoryForItem(state,r,x).category).label)}</small></span><span>${x.quantity??'?'} ${esc(x.unit||'')}</span><strong>${euro(x.total)}</strong></div>`).join('')}</div>
 ${receiptWarnings(r).length?`<ul>${receiptWarnings(r).map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`:'<p>Positionen stimmen rechnerisch mit dem Bon überein. Originalbeleg trotzdem prüfen.</p>'}</section>`).join('')}
 <div class="receipts744-actions"><button type="button" class="primary-btn" data-action="receipts743-confirm">${drafts.length===1?'Geprüften Bon speichern':`${drafts.length} geprüfte Bons speichern`}</button> <button type="button" class="secondary-btn" data-action="receipts743-cancel">Verwerfen</button></div></div>`:
 `<form id="receipts743-form"><label>GPT-JSON hier einfügen<textarea name="json" rows="5" maxlength="160000" placeholder='{"schema":"compass_receipt_v1", ...} oder [ {...}, {...} ]' required></textarea></label><p class="muted-line">Einzelbon und mehrere Bons als JSON-Array werden akzeptiert, ebenso JSON-Codeblöcke aus ChatGPT.</p><button type="submit" class="primary-btn">JSON prüfen (noch nicht speichern)</button></form>`}
 <div class="receipts743-summary"><strong>${rows.length}</strong> Bons gespeichert · <strong>${esc(month)}</strong>: ${current.length} Bons, bekannte Bonsummen <strong>${euro(amount)}</strong>${unknown?' · '+unknown+' ohne lesbare Gesamtsumme':''}</div>
 ${products.length?`<details class="receipts743-products"><summary>Im ${esc(month)} eingekauft · ${products.length} verschiedene Bezeichnungen</summary>${products.map(x=>`<div><span>${esc(x.name)} · ${x.count}× erfasst</span><strong>${euro(x.amount)}${x.unknown?' · unvollständig':''}</strong></div>`).join('')}<p class="muted-line">Einzelpositionen werden nach Bonbezeichnung gruppiert. Ähnliche Namen werden nicht automatisch zusammengelegt.</p></details>`:''}
 ${rows.slice(0,24).map(x=>`<div class="receipts743-saved"><span>🧾 ${esc(x.date)} · ${esc(x.merchant)} · ${x.items.length} Artikel</span><strong>${euro(x.total)}</strong><button type="button" class="secondary-btn" data-action="receipts743-delete" data-id="${esc(x.id)}">Entfernen</button></div>`).join('')}
 <p class="muted-line">Das Einkaufsjournal zeigt nur bonbasierte Ausgaben. Erstattungen, Bargeldbehebungen und Banktransaktionen werden nicht damit gleichgesetzt; kein automatischer Ernährungsnachweis.</p></section>`;
}
