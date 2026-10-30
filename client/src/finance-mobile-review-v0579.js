/** Small, touch-first finance classification UI; no heavy charts or external calls. */
import {FINANCE_CATEGORIES,safeMerchantRule,merchantKey} from './finance-core.js';
import {accountMatches} from './finance-revolut.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=x=>(Number(x||0)/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const categoryOptions=(selected='')=>(selected==='Prüfen / Noch ungeklärt'?'<option value="" selected disabled>Bitte Kategorie auswählen</option>':'')+FINANCE_CATEGORIES.map(([a,b])=>{const value=`${a} / ${b}`;return `<option value="${esc(value)}" ${selected===value?'selected':''}>${esc(value)}</option>`;}).join('');
const flows=[['expense','Ausgabe'],['income','Einnahme'],['refund','Rückerstattung'],['transfer','Umbuchung / Investment'],['cash','Bargeld']];
export function mobileFinanceReviewRows(state={},account='all'){
 const waiting=new Set((state.financeMobileDecisions||[]).filter(x=>x.status==='pending').map(x=>x.transactionId));
 return (Array.isArray(state.financeTransactions)?state.financeTransactions:[]).filter(t=>t.needsReview&&!waiting.has(t.id)&&accountMatches(t,account)).sort((a,b)=>String(b.day||'').localeCompare(String(a.day||''))||String(a.id).localeCompare(String(b.id)));
}
export function mobileFinanceReviewView(state={},options={}){
 const rows=mobileFinanceReviewRows(state,options.account||'all'),limit=10,page=Math.min(Math.max(0,Number(options.page)||0),Math.max(0,Math.ceil(rows.length/limit)-1)),shown=rows.slice(page*limit,(page+1)*limit),waiting=(state.financeMobileDecisions||[]).filter(x=>x.status==='pending').length;
 const conflicts=(state.financeMobileDecisions||[]).filter(x=>x.status==='conflict').length;
 const forms=shown.map(t=>`<form class="fin79-review-card" data-finance-confirm="${esc(t.id)}">
 <div class="fin79-review-top"><strong>${esc(t.merchant||'Unbekannter Zahlungspartner')}</strong><strong>${esc(eur(t.amountCents))}</strong></div>
 <small>${esc(t.day||'Datum unbekannt')} · ${esc(t.accountId||'')}</small>
 <details class="fin79-review-details"><summary>Buchungstext anzeigen</summary><p>${esc(String(t.description||'').replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g,'[IBAN]'))}</p></details>
 <label>Kategorie<select name="category" required>${categoryOptions(t.category)}</select></label>
 <label>Geldfluss<select name="flow" required>${flows.map(([value,label])=>`<option value="${value}" ${t.flow===value?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
 ${safeMerchantRule(t.merchant)?`<label class="fin79-checkbox"><input type="checkbox" name="remember" value="yes"/> Zuordnung für künftige Buchungen dieses Händlers merken</label>`:''}
 <button type="submit" class="primary-btn">Zuordnen &amp; nächste Buchung →</button>
 </form>`).join('');
 return `<section class="fin79-mobile-review" aria-label="Unklassifizierte Buchungen auf dem Handy">
 <header><span class="fin53-eyebrow">FINANZEN / UNKLASSIFIZIERT</span><h2>Offene Buchungen zuordnen</h2><p>${rows.length} noch zu prüfen${waiting?` · ${waiting} vorgemerkt`:''}. Entscheidungen bleiben bis zur Synchronisierung lokal verschlüsselt.</p></header>
 ${conflicts?`<div class="fin79-sync-status" role="alert">${conflicts} Zuordnung(en) konnten am Hauptgerät wegen geänderter Buchungen nicht übernommen werden. Finanzdaten aktualisieren und erneut prüfen.</div>`:''}
 ${forms||'<p class="fin79-review-empty">Keine offenen Buchungen in diesem Konto oder alle Änderungen bereits vorgemerkt.</p>'}
 <div class="fin79-review-pagination"><button type="button" class="secondary-btn" data-action="finance79-prev" ${page<1?'disabled':''}>← Zurück</button><span>${rows.length?`${page+1} / ${Math.max(1,Math.ceil(rows.length/limit))}`:'0 offen'}</span><button type="button" class="secondary-btn" data-action="finance79-next" ${(page+1)*limit>=rows.length?'disabled':''}>Weitere →</button></div>
 </section>`;
}
