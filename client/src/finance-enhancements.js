import {safeMerchantRule} from './finance-core.js';
/** Compass Finance 0.5.14 — transparent trends, recurrence candidates and editable ledger. */
import {FINANCE_CATEGORIES,escapeFinance} from './finance-core.js';
import {financeExpenseOverview,financeMonthlySeries,financeRecurringCandidates,financeSearchTransactions} from './finance-analytics.js';
const h=escapeFinance;
export const finEuro=c=>Number(c/100||0).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const finPct=v=>Number(v).toLocaleString('de-AT',{maximumFractionDigits:1})+' %';
const fmtMonth=m=>{try{return new Intl.DateTimeFormat('de-AT',{month:'short',year:'2-digit'}).format(new Date(m+'-15T12:00:00'));}catch{return m;}};
const options=(value)=>`${value==='Prüfen / Noch ungeklärt'?'<option value="" selected disabled>Bitte Kategorie wählen</option>':''}`+FINANCE_CATEGORIES.filter(([a,b])=>a!=='Prüfen').map(([a,b])=>{const cat=`${a} / ${b}`;return `<option value="${h(cat)}" ${cat===value?'selected':''}>${h(cat)}</option>`;}).join('');
const types=(value)=>[['expense','Ausgabe'],['income','Einnahme'],['refund','Erstattung'],['transfer','Transfer/Investment'],['cash','Bargeld']].map(([id,label])=>`<option value="${id}" ${value===id?'selected':''}>${label}</option>`).join('');
const empty=message=>`<p class="insight-no-data">${h(message)}</p>`;

/** Purpose-category pictograms are purely local, deterministic and never infer a purchase from merchant name. */
export function financeLedgerIcon(transaction={}){
 const parent=String(transaction.category||'').split(' / ')[0];
 const child=String(transaction.category||'').split(' / ')[1]||'';
 let name='receipt';
 if(transaction.needsReview)name='help';
 else if(transaction.flow==='income')name='banknote';
 else if(transaction.flow==='refund')name='refund';
 else if(transaction.flow==='transfer')name='transfer';
 else if(transaction.flow==='cash')name='wallet';
 else if(parent==='Lebensmittel')name=/Bäckerei/i.test(child)?'bread':'cart';
 else name=({
  'Wohnen':'home','Essen & Ausgehen':'utensils','Mobilität':'bike','Familie':'users',
  'Gesundheit & Sport':'heart','Freizeit & Reisen':'plane','Bildung & Beruf':'book',
  'Verträge & Abos':'repeat','Finanzen':'bank','Shopping':'bag','Sonstiges':'receipt'
 })[parent]||'receipt';
 const paths={
  banknote:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h.01M19 15h.01"/>',
  cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l2.4 11.4a2 2 0 0 0 2 1.6H19a2 2 0 0 0 2-1.6L22 8H5"/>',
  bread:'<path d="M4 12a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v7H4z"/><path d="M8 8V5m8 3V5"/>',
  refund:'<path d="M3 11a9 9 0 1 0 4-7"/><path d="M3 3v8h8"/>',
  transfer:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
  wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M15 14h2"/>',
  home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  utensils:'<path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M17 21V4c3 3 3 8 0 11"/>',
  bike:'<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-10 5 10h4M10 7h4"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2"/><path d="M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 4 5"/>',
  heart:'<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z"/>',
  plane:'<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  book:'<path d="M4 4h7a3 3 0 0 1 3 3v14H7a3 3 0 0 0-3 1zM20 4h-3a3 3 0 0 0-3 3v14h3a3 3 0 0 1 3 1z"/>',
  repeat:'<path d="M4 7h14l-3-3m3 3-3 3M20 17H6l3-3m-3 3 3 3"/>',
  bank:'<path d="M3 10h18M5 10v9m5-9v9m4-9v9m5-9v9M2 21h20L12 3 2 9z"/>',
  bag:'<rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  receipt:'<path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2zM8 8h8M8 12h8"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-1 1-2 1.5-2 3M12 17h.01"/>'
 };
 return `<span class="fin-ledger-icon fin-ledger-icon--${name}" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg></span>`;
}


export function financeTrendsView(transactions=[],period='all'){
 const info=financeExpenseOverview(transactions,period),series=info.months.slice(-18);
 if(!series.length)return empty('Noch keine Buchungen. Importiere zuerst deine Raiffeisen-Umsätze.');
 const total=series.reduce((s,m)=>s+m.expenseCents,0),open=series.reduce((s,m)=>s+m.pendingOutCents,0),max=Math.max(1,...series.map(m=>m.expenseCents+m.pendingOutCents));
 const avg=Math.round(total/series.length);
 const label=info.monthChange;
 return `<section class="fin-analysis-section" aria-label="Monatsvergleich und Ausgabentrends">
 <div class="fin-analysis-head"><div><span class="insight-kicker">MONATSVERGLEICH</span><h3>Ausgaben im Zeitverlauf</h3></div><span class="fin-analysis-kpi">${h(finEuro(avg))}<small>Ø je Monat mit Buchungen</small></span></div>
 <div class="fin-compare-chart" role="img" aria-label="Kategorisierte Ausgaben (auch grobe Kategorien) und ungeklärte Abgänge nach Monaten">${series.map(m=>{const valid=m.expenseCents/max*100,unknown=m.pendingOutCents/max*100;return `<div class="fin-compare-col" title="${h(m.month)}: ${h(finEuro(m.expenseCents))} kategorisiert, ${h(finEuro(m.pendingOutCents))} ungeklärt"><div class="fin-compare-bars"><div class="fin-compare-known" style="height:${Math.max(0,valid)}%"></div><div class="fin-compare-pending" style="height:${Math.max(0,unknown)}%"></div></div><small>${h(fmtMonth(m.month))}</small></div>`;}).join('')}</div>
 <div class="insight-legend"><span><i style="background:#387C69"></i>Kategorisierte Ausgaben</span><span><i style="background:#D8AC70"></i>Offene Abgänge</span></div>
 <div class="fin-data-notes">${label?`<div class="fin-change-line"><strong>${h(fmtMonth(label.latest))} vs. ${h(fmtMonth(label.previous))}:</strong> ${label.deltaCents>=0?'+':'−'}${h(finEuro(Math.abs(label.deltaCents)))} ${label.deltaPercent===null?'':`(${label.deltaPercent>=0?'+':''}${h(finPct(label.deltaPercent))})`}</div>`:'<div>Ein direkter Monatsvergleich ist erst bei zwei aufeinanderfolgenden Monaten möglich.</div>'}
 <div>${h(finEuro(open))} noch ungeklärte Abgänge im dargestellten Zeitraum. ${info.openInCents?`${h(finEuro(info.openInCents))} ungeklärte Gutschriften sind ausdrücklich <strong>keine Ausgaben</strong>.`:''}</div></div>
 <p class="fin-disclaimer">Nur importierte Bankbewegungen. Ein Monat mit Umsätzen ist nicht automatisch ein vollständig exportierter Monat; deshalb sind diese Vergleiche deskriptiv, keine gesicherte Budgetprognose.</p></section>`;
}
export function financeCategoryDetailView(transactions=[],period='all'){
 const data=financeExpenseOverview(transactions,period),denom=data.categories.reduce((n,x)=>n+x.cents,0);
 return `<section class="fin-analysis-section"><span class="insight-kicker">AUSGABEN NACH BEREICHEN</span><h3>Was verbraucht welchen Anteil?</h3>
 ${data.categories.length?`<div class="fin-category-analytic">${data.categories.map(c=>`<details class="fin-category-expand"><summary><span class="fin-categ-name">${h(c.name)} <small>${c.count} Buchungen</small></span><span class="fin-categ-amount">${h(finEuro(c.cents))} · ${denom?finPct(100*c.cents/denom):'0 %'}</span></summary><div class="fin-category-meter"><span style="width:${denom?Math.min(100,100*c.cents/denom):0}%"></span></div><div class="fin-categ-details">${c.details.map(d=>`<div><span>${h(d.name.split(' / ').slice(1).join(' / ')||d.name)}</span><strong>${h(finEuro(d.cents))}</strong></div>`).join('')}</div></details>`).join('')}</div>`:empty('Noch keine kategorisierten Ausgaben.')}
 </section><section class="fin-analysis-section"><span class="insight-kicker">ZAHLUNGSPARTNER</span><h3>Größte kategorisierte Ausgaben</h3><div class="fin-category-list">${data.merchants.slice(0,10).map(r=>`<div><span>${h(r.name)}<small>${r.count} Buchungen</small></span><strong>${h(finEuro(r.cents))}</strong></div>`).join('')||empty('Noch keine eindeutigen Buchungen.')}</div><p class="fin-disclaimer">Ein Zahlungsdienst oder Marktplatz sagt allein nichts über den gekauften Artikel aus. Die Zuordnung lässt sich unter „Buchungen“ korrigieren.</p></section>`;
}
export function financeRecurringView(transactions=[],manual={}){
 const recurring=financeRecurringCandidates(transactions,manual),excluded=Object.keys(manual).filter(key=>manual[key]==='exclude'),total=recurring.filter(x=>x.status==='fixed'&&x.active).reduce((s,x)=>s+x.meanCents,0);
 return `<section class="fin-analysis-section"><div class="fin-analysis-head"><div><span class="insight-kicker">REGELMÄSSIGE ZAHLUNGEN</span><h3>Verträge und wiederkehrende Kosten</h3></div><span class="fin-analysis-kpi">${h(finEuro(total))}<small>Ø bestätigte Kandidaten / Monat</small></span></div>
 <p class="fin-disclaimer">Eine wiederholte Abbuchung ist noch kein Abo. „Bestätigen“ kennzeichnet einen persönlich geprüften Fixkostenposten. Der Monatswert beruht weiterhin auf beobachteten Zahlungen, nicht auf einem Vertrag. Der Algorithmus ignoriert typische Einkäufe und Zahlungsdienste.</p>
 ${recurring.length?`<div class="fin-recurring-list">${recurring.map(x=>`<article class="fin-recurring-item"><div class="fin-recurring-title"><strong>${h(x.merchant)}</strong><span class="fin-recurring-status ${x.status==='fixed'?'confirmed':''}">${x.status==='fixed'?'Von dir bestätigt':'Kandidat'}</span></div><div class="fin-recurring-metrics"><span>${h(finEuro(x.meanCents))} Ø pro Buchung</span><span>${x.months} Monate</span><span>${x.active?'Zuletzt erfasst: '+h(x.lastMonth):'Historisch'}</span></div><div class="fin-recurring-controls">${x.status==='fixed'?`<button type="button" class="secondary-btn" data-action="finance-recurring-clear" data-id="${h(x.key)}">Bestätigung aufheben</button>`:`<button type="button" class="secondary-btn" data-action="finance-recurring-fixed" data-id="${h(x.key)}">Als Fixkosten bestätigen</button>`}<button type="button" class="secondary-btn" data-action="finance-recurring-exclude" data-id="${h(x.key)}">Kein regelmäßiger Posten</button></div></article>`).join('')}</div>`:empty('Noch keine ausreichenden Wiederholungen in den jüngsten importierten Monaten erkannt. Für mehr Treffer mehrere Monate importieren.')}
 ${excluded.length?`<details class="fin-recurring-ignored"><summary>${excluded.length} ausgeschlossene Händler anzeigen</summary>${excluded.map(key=>`<div class="fin-recurring-controls"><span>${h(key)}</span><button type="button" class="secondary-btn" data-action="finance-recurring-clear" data-id="${h(key)}">Wieder prüfen</button></div>`).join('')}</details>`:''}</section>`;
}
export function financeLedgerView(transactions=[],period='all',query='',filter='all',page=0){
 const data=financeSearchTransactions(transactions,{query,filter,period,page});
 return `<section class="fin-analysis-section"><span class="insight-kicker">KATEGORIEN PRÜFEN UND KORRIGIEREN</span><h3>Alle Buchungen</h3><p class="fin-disclaimer">Auch automatisch eingeordnete Umsätze lassen sich hier einzeln korrigieren. Eine Einzelkorrektur verändert keine anderen Buchungen und erzeugt keine Händlerregel.</p>
 <div class="fin-ledger-filters"><label>Suche nach Händler oder Kategorie <input type="search" id="finance-ledger-query" maxlength="100" value="${h(query)}" placeholder="Händler, Text, Kategorie …" /></label><label>Art <select id="finance-ledger-filter">${[['all','Alle'],['pending','Noch ungeklärt'],['expense','Kategorisierte Ausgaben'],['transfer','Transfers'],['broad','Grobe Kategorien (nachbearbeitbar)']].map(([value,label])=>`<option value="${value}" ${filter===value?'selected':''}>${label}</option>`).join('')}</select></label></div>
 <div class="fin-ledger-count">${data.count.toLocaleString('de-AT')} passende Buchung(en)</div>
 <div class="fin-ledger-list">${data.rows.map(t=>`<details class="fin-ledger-item"><summary><time>${h(t.day)}</time>${financeLedgerIcon(t)}<span class="fin-ledger-merchant">${h(t.merchant)} <small>${h(t.category)}${t.needsReview?' · bitte prüfen':''}</small></span><strong class="${t.amountCents<0?'is-out':''}">${t.amountCents<0?'−':'+'}${h(finEuro(Math.abs(t.amountCents)))}</strong></summary><form data-finance-edit="${h(t.id)}" class="fin-ledger-edit"><p class="fin-rule-reason">${h(t.ruleReason|| (t.needsReview?'Kategorie prüfen': 'Automatische oder manuell bestätigte Kategorie'))} · ${t.confidence==='broad'?'Grobe Zuordnung: genauer Zweck unbekannt':t.source==='user'?'Von dir bestätigt':'Regelbasierte Zuordnung'}</p><div class="fin-bank-text">${h(t.description||'')}</div><div class="fin-review-fields"><label>Kategorie <select name="category">${options(t.category)}</select></label><label>Geldfluss <select name="flow">${types(t.flow)}</select></label></div>${safeMerchantRule(t.merchant)?`<label class="fin-rule-check"><input type="checkbox" name="remember" value="yes" /> Diese Kategorie für diesen Zahlungspartner merken und auf andere noch nicht bestätigte Buchungen übernehmen</label>`:'<small>Für Zahlungsdienste und unklare Sammelhändler werden keine Sammelregeln gespeichert.</small>'}<button type="submit" class="primary-btn">Korrektur speichern</button></form></details>`).join('')||empty('Für diese Auswahl gibt es keine Buchungen.')}</div>
 <div class="fin-paging"><button type="button" data-action="finance-ledger-prev" ${data.page===0?'disabled':''}>← Zurück</button><span>${data.page+1} / ${data.pages}</span><button type="button" data-action="finance-ledger-next" ${data.page>=data.pages-1?'disabled':''}>Weiter →</button></div>
 </section>`;
}
export function financeCashflowDetailView(transactions=[],period='all'){
 const months=financeMonthlySeries(transactions,period);
 return `<section class="fin-analysis-section"><span class="insight-kicker">BUCHUNGSVERLAUF / CASHFLOW</span><h3>Was wurde tatsächlich auf diesem Konto bewegt?</h3>
 <div class="fin-cashflow-table" role="table"><div class="fin-cashflow-row fin-cashflow-header" role="row"><span>Monat</span><span>Einnahmen</span><span>Konsum</span><span>Transfers abgehend</span><span>Offen abgehend</span></div>
 ${months.slice(-18).reverse().map(m=>`<div class="fin-cashflow-row" role="row"><strong>${h(fmtMonth(m.month))}</strong><span>${h(finEuro(m.incomeCents+m.refundCents))}</span><span>${h(finEuro(m.expenseCents))}</span><span>${h(finEuro(m.transfersOutCents))}</span><span>${h(finEuro(m.pendingOutCents))}</span></div>`).join('')||empty('Noch keine Monatsdaten.')}</div>
 <p class="fin-disclaimer">Gutschriften, Erstattungen, Bargeldbehebungen und interne Transfers werden getrennt erfasst. Die obigen Summen sind <strong>kein Kontostand</strong> und keine vollständige Erfolgsrechnung. Weitere Bankkonten kommen später hinzu.</p>
 </section>`;
}
