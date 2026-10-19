/** Compass 0.5.28 – deliberate, transaction-scoped counterparty aliases.
 * The bank descriptor is immutable. An alias changes presentation, not payment identity.
 */
import {normalizedMerchant} from './finance-merchant-insights.js';
import {FINANCE_CATEGORIES,categorizeTransaction,validCategory} from './finance-core.js';
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
export const merchantDisplay=t=>normalizedMerchant(t?.merchantDisplayName||t?.merchant||t?.description||'');
export const merchantNameKey=s=>String(s||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('de-AT');
export const isMerchantExpense=t=>!!t&&!t.needsReview&&t.flow==='expense'&&Number.isSafeInteger(t.amountCents)&&t.amountCents<0;
export function merchantRows(rows=[],merchant=''){
 const key=merchantNameKey(merchant);
 return key?rows.filter(t=>isMerchantExpense(t)&&merchantNameKey(merchantDisplay(t))===key):[];
}
export function financeMerchantEdit(rows=[],ids=[],{displayName='',category='',clearAlias=false}={}){
 if(!Array.isArray(rows)||!Array.isArray(ids)||!ids.length||ids.length>5000)throw Error('Bitte Buchungen auswählen.');
 const wanted=new Set(ids.map(String));
 if(wanted.size!==ids.length)throw Error('Doppelte Buchungs-ID in der Auswahl.');
 if(category&&!validCategory(category))throw Error('Bitte eine gültige Kategorie wählen.');
 if(category&&['Prüfen','Einnahmen','Transfer','Bargeld','Rückerstattung'].includes(category.split(' / ')[0]))throw Error('Bei diesen Abgängen sind nur Ausgabenkategorien zulässig.');
 const name=String(displayName).normalize('NFKC').replace(/\s+/g,' ').trim();
 if(!clearAlias&&(!name||name.length>90))throw Error('Der Händlername muss 1 bis 90 Zeichen haben.');
 if(/[\u0000-\u001f\u007f]/.test(name))throw Error('Ungültige Steuerzeichen im Händlernamen.');
 let changed=0;const next=rows.map(t=>{
  if(!wanted.has(String(t.id)))return t;
  if(!isMerchantExpense(t))throw Error('Nur bestätigte Ausgaben lassen sich hier bearbeiten.');
  changed++;
  let edited={...t};if(clearAlias)delete edited.merchantDisplayName;else edited.merchantDisplayName=name;
  if(category&&category!==edited.category)edited=categorizeTransaction(edited,category,'expense');
  return edited;
 });
 if(changed!==wanted.size)throw Error('Die ausgewählten Buchungen haben sich geändert. Bitte neu auswählen.');
 return {rows:next,changed};
}
const opts=FINANCE_CATEGORIES.filter(([parent])=>!['Prüfen','Einnahmen','Transfer','Bargeld','Rückerstattung'].includes(parent))
 .map(([p,c])=>{const s=p+' / '+c;return `<option value="${h(s)}">${h(s)}</option>`;}).join('');
/** Calm inline inspector, next to the Sankey rather than a page navigation. */
export function financeMerchantInspector(rows=[],merchant=''){
 if(!merchant)return '';
 const selected=merchantRows(rows,merchant).sort((a,b)=>String(b.day).localeCompare(String(a.day)));
 if(!selected.length)return `<aside class="fin-merchant-inspector"><div class="fin-merchant-inspector-head"><strong>Händler bearbeiten</strong><button type="button" data-action="finance-merchant-close">Schließen ×</button></div><p>Hier sind im aktuellen Zeitraum keine entsprechenden Ausgaben mehr vorhanden.</p></aside>`;
 const cents=selected.reduce((n,t)=>n-t.amountCents,0);
 return `<aside class="fin-merchant-inspector" aria-label="Händler und Buchungen bearbeiten"><div class="fin-merchant-inspector-head"><div><span class="insight-kicker">BUCHUNGEN IM DIAGRAMM</span><h3>${h(merchant)}</h3><p>${selected.length} Buchung(en) · ${h(eur(cents))} · Änderungen werden sofort im Sankey sichtbar</p></div><button type="button" class="secondary-btn" data-action="finance-merchant-close">Schließen ×</button></div>
 <form id="finance-merchant-bulk-form"><div class="fin-merchant-edit-grid"><label>Einheitlicher Anzeigename<input name="displayName" value="${h(merchant)}" maxlength="90" required list="finance-merchant-names" autocomplete="off" /></label><label>Kategorie zuordnen (optional)<select name="category"><option value="">Bisherige Kategorien beibehalten</option>${opts}</select></label></div>
 <p class="fin-art-note">Wähle unten gezielt die Buchungen. Ein gemeinsamer Anzeigename fasst diese zu einem Händler zusammen. Bei unterschiedlichen Kategorien bleiben die Geldflüsse korrekt getrennt; die Händler-Endknoten werden vereinigt.</p>
 <div class="fin-merchant-selected-list">${selected.slice(0,140).map(t=>`<label class="fin-merchant-selected-row"><input type="checkbox" name="transaction" value="${h(t.id)}" checked/><span><strong>${h(t.day)} · ${h(eur(-t.amountCents))}</strong><small>${h(t.merchant||'Unbekannter Zahlungspartner')} · ${h(t.category||'')}</small><small title="Originaler Banktext">${h((t.description||'').slice(0,175))}</small></span></label>`).join('')}</div>
 ${selected.length>140?`<p class="fin-art-note">Nur die neuesten 140 von ${selected.length} Buchungen sind hier auswählbar. Weitere Buchungen findest du im nächsten Zeitraum.</p>`:''}
 <div class="fin-merchant-inspector-actions"><button type="submit" class="primary-btn">Ausgewählte zusammenführen / speichern</button><button type="submit" name="clearAlias" value="yes" formnovalidate class="secondary-btn">Originalnamen wieder anzeigen</button></div></form></aside>`;
}
