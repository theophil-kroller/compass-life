/** Compass 0.5.15 · Trip attribution, local and explicit.
 * A date, foreign merchant or travel-looking category is NOT proof of trip spending.
 * Trip links are stored separately from bank transactions and their category rules.
 */
import {escapeFinance} from './finance-core.js';
const h=escapeFinance;
const money=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const dateOK=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return false;const d=new Date(`${value}T12:00:00Z`);return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value;};
const dateDelta=(a,b)=>Math.round((Date.parse(`${b}T12:00:00Z`)-Date.parse(`${a}T12:00:00Z`))/86400000);
export function validFinanceTrip(t){return !!t&&typeof t.id==='string'&&/^[a-zA-Z0-9-]{8,90}$/.test(t.id)&&typeof t.name==='string'&&t.name.trim().length>=2&&t.name.trim().length<=100&&dateOK(t.start)&&dateOK(t.end)&&dateDelta(t.start,t.end)>=0&&dateDelta(t.start,t.end)<=366;}
export function createFinanceTrip({id,name,start,end}){
 const t={id:String(id||''),name:String(name||'').trim().slice(0,100),start:String(start||''),end:String(end||'')};
 if(!validFinanceTrip(t))throw new Error('Bitte einen Reisenamen (2–100 Zeichen) und einen gültigen Zeitraum von maximal 367 Tagen eingeben.');
 return t;
}
export const travelAttributable=t=>!!t&&Number.isFinite(t.amountCents)&&((t.amountCents<0&&['expense','cash'].includes(t.flow))||(t.amountCents>0&&t.flow==='refund')||Boolean(t.needsReview&&t.amountCents<0&&t.flow!=='transfer'));
const travelLike=t=>/^(?:Freizeit & Reisen \/ (?:Flüge|Reisen & Unterkunft)|Familie \/ Kinderreisen|Mobilität \/ (?:Öffentliche Verkehrsmittel|Auto & Tanken|Parken & Maut))$/.test(t.category||'');
const prebookedLike=t=>/^(?:Freizeit & Reisen \/ (?:Flüge|Reisen & Unterkunft)|Familie \/ Kinderreisen)$/.test(t.category||'')||/\b(?:flugticket|flugreise|flight ticket|train ticket|rail ticket|zugfahrt|reisebuchung)\b/iu.test(t.description||'');
/** Do not assign based on coincidence. Suggest only; allow paid-in-advance tickets. */
export function tripSuggestion(t,trip){
 if(!validFinanceTrip(trip)||!dateOK(t?.day)||!travelAttributable(t))return null;
 if(t.day>=trip.start&&t.day<=trip.end)return {reason:'Buchung im Reisezeitraum · bitte prüfen',priority:travelLike(t)?2:1};
 if(prebookedLike(t)&&t.day<trip.start&&dateDelta(t.day,trip.start)<=365)return {reason:'Mögliche Vorausbuchung vor Reisebeginn',priority:2};
 return null;
}
const sortByDay=(a,b)=>String(b.day).localeCompare(String(a.day))||String(a.id).localeCompare(String(b.id));
/** Exclusions stored by trip ID, not in imported bank rows. */
export function tripCandidateRows(transactions=[],trip,links={},exclusions={},query='',mode='suggested'){
 if(!validFinanceTrip(trip))return [];
 const q=String(query||'').trim().normalize('NFKC').toLocaleLowerCase('de-AT');
 return transactions.filter(t=>travelAttributable(t)&&!links[t.id]&&!exclusions[`${trip.id}|${t.id}`]).map(t=>({...t,suggestion:tripSuggestion(t,trip)}))
  .filter(t=>mode==='all'||Boolean(t.suggestion))
  .filter(t=>!q||[t.day,t.description,t.merchant,t.category].some(s=>String(s||'').normalize('NFKC').toLocaleLowerCase('de-AT').includes(q)))
  .sort((a,b)=>(b.suggestion?.priority||0)-(a.suggestion?.priority||0)||sortByDay(a,b));
}
export function tripReport(trip,transactions=[],links={}){
 const found=transactions.filter(t=>links[t.id]===trip.id);
 const buckets=new Map();let expenseCents=0,refundCents=0,cashCents=0,unresolvedCents=0,unresolvedCount=0,linkedCount=0;
 for(const t of found){if(!travelAttributable(t))continue;linkedCount++;const v=Math.abs(t.amountCents);
  if(t.needsReview){unresolvedCents+=v;unresolvedCount++;continue;}
  if(t.flow==='cash'){cashCents+=v;continue;}
  if(t.flow==='refund'){refundCents+=v;continue;}
  if(t.flow==='expense'){expenseCents+=v;const category=String(t.category||'Sonstiges').split(' / ')[0];buckets.set(category,(buckets.get(category)||0)+v);}
 }
 return {trip,rows:found.filter(travelAttributable).sort(sortByDay),linkedCount,expenseCents,refundCents,cashCents,unresolvedCents,unresolvedCount,netCents:expenseCents-refundCents,categories:[...buckets].map(([name,cents])=>({name,cents})).sort((a,b)=>b.cents-a.cents)};
}
export function tripDelete(tripId,links={},exclusions={}){
 return {links:Object.fromEntries(Object.entries(links).filter(([,id])=>id!==tripId)),exclusions:Object.fromEntries(Object.entries(exclusions).filter(([key])=>!key.startsWith(`${tripId}|`)))};
}
function miniBars(report){if(!report.categories.length)return '<p class="insight-no-data">Noch keine bestätigten Konsumausgaben dieser Reise zugeordnet.</p>';
 const max=report.categories[0].cents;
 return `<div class="fin-trip-bars">${report.categories.map(c=>`<div class="fin-trip-bar"><div><span>${h(c.name)}</span><strong>${h(money(c.cents))}</strong></div><span class="fin-trip-meter"><i style="width:${Math.max(1,100*c.cents/max).toFixed(1)}%"></i></span></div>`).join('')}</div>`;
}
const mask=s=>h(String(s||'').replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g,'[IBAN]'));
const tripTime=t=>`${h(t.start)} – ${h(t.end)}`;
/** HTML rendering is intentionally pure so trips can be tested without the app shell. */
export function financeTravelView(state={},selectedId='',query='',mode='suggested',page=0){
 const trips=(state.financeTrips||[]).filter(validFinanceTrip).slice().sort((a,b)=>b.start.localeCompare(a.start));
 const transactions=state.financeTransactions||[],links=state.financeTripAssignments||{},exclusions=state.financeTripExcluded||{};
 const current=trips.find(t=>t.id===selectedId)||trips[0];
 const tripOptions=trips.map(t=>`<button type="button" class="fin-trip-choice ${current?.id===t.id?'is-selected':''}" data-action="finance-trip-select" data-id="${h(t.id)}"><strong>${h(t.name)}</strong><small>${tripTime(t)}</small></button>`).join('');
 const createForm=`<form id="finance-trip-create" class="fin-trip-form"><label>Reise / Ort<input name="name" required minlength="2" maxlength="100" placeholder="z. B. Australien 2026"/></label><label>Von<input name="start" type="date" required /></label><label>Bis<input name="end" type="date" required /></label><button type="submit" class="primary-btn">Reise anlegen</button></form>`;
 if(!current)return `<section class="fin-analysis-section"><span class="insight-kicker">FINANZEN / REISEN</span><h3>Was haben deine Reisen gekostet?</h3><p>Lege zunächst eine Reise mit Zeitraum an. Anschließend schlägt Compass passende Buchungen vor – <strong>ohne sie automatisch zuzurechnen</strong>. Auch vorab bezahlte Flüge oder Hotels können berücksichtigt werden.</p>${createForm}<p class="fin-disclaimer">Derzeit nur Raiffeisen-EUR-Buchungen. Revolut, N26, DKB, flatex und Kraken werden erst in späteren Builds unterstützt. Rohdaten bleiben verschlüsselt im lokalen Vault.</p></section>`;
 const report=tripReport(current,transactions,links);
 const candidates=tripCandidateRows(transactions,current,links,exclusions,query,mode);
 const safePage=Math.min(Math.max(0,Math.trunc(Number(page)||0)),Math.max(0,Math.ceil(candidates.length/20)-1)),shown=candidates.slice(safePage*20,(safePage+1)*20);
 const unlinked=report.rows.map(t=>{const special=t.flow==='cash'?'Bargeldbehebung, nicht als Konsum gerechnet':t.needsReview?'Kategorie noch unklar – nicht in Summe':t.flow==='refund'?'Erstattung, reduziert Ausgaben':'Bestätigte Ausgabe';return `<article class="fin-trip-transaction"><div><strong>${h(t.day)} · ${h(t.merchant)}</strong><small>${h(t.category)} · ${h(special)}</small><details><summary>Buchungsdetails</summary><p class="fin-bank-text">${mask(t.description)}</p></details></div><strong>${h(money(Math.abs(t.amountCents)))}</strong><button type="button" class="secondary-btn" data-action="finance-trip-unassign" data-id="${h(t.id)}">Entfernen</button></article>`;}).join('');
 const pending=shown.map(t=>`<article class="fin-trip-transaction"><div><strong>${h(t.day)} · ${h(t.merchant)}</strong><small>${h(t.category)} · ${h(t.suggestion?.reason||'Manuell gesucht')}</small><details><summary>Buchungsdetails</summary><p class="fin-bank-text">${mask(t.description)}</p></details></div><strong>${h(money(Math.abs(t.amountCents)))}</strong><button type="button" class="primary-btn" data-action="finance-trip-add" data-id="${h(t.id)}">Zuordnen</button><button type="button" class="secondary-btn" data-action="finance-trip-exclude" data-id="${h(t.id)}">Ausblenden</button></article>`).join('');
 const excludedIds=Object.keys(exclusions).filter(k=>k.startsWith(`${current.id}|`));
 const summary=trips.map(t=>{const v=tripReport(t,transactions,links);return `<div class="fin-trip-comparison-row"><span>${h(t.name)} <small>${h(t.start.slice(0,4))}</small></span><strong>${h(money(v.netCents))}</strong><small>${v.linkedCount} zugeordnet</small></div>`;}).join('');
 return `<section class="fin-analysis-section fin-travel-workspace"><div class="fin-analysis-head"><div><span class="insight-kicker">FINANZEN / REISEN</span><h3>Reisekosten aus deinen Buchungen</h3><p>Reisen sind <strong>zusätzliche Zuordnungen</strong>, keine Änderungen deiner Ausgabenkategorien. Nur bestätigte Buchungen zählen.</p></div><span class="quiet-tag">${trips.length} Reise(n)</span></div>
 <div class="fin-trip-selector">${tripOptions}</div><details class="fin-trip-new"><summary>Neue Reise anlegen</summary>${createForm}</details>
 <div class="fin-trip-selected"><div><h3>${h(current.name)}</h3><small>${tripTime(current)} · Raiffeisen-EUR-Auszug, unvollständige Kontenabdeckung</small></div><button type="button" class="secondary-btn" data-action="finance-trip-delete" data-id="${h(current.id)}">Reise löschen</button></div>
 <div class="fin-kpi-grid"><article class="fin-kpi"><small>Bestätigte Ausgaben</small><strong>${h(money(report.expenseCents))}</strong><span>Nur tatsächlich zugeordnet</span></article><article class="fin-kpi"><small>Abzüglich Erstattungen</small><strong>${h(money(report.netCents))}</strong><span>Netto-Ausgaben der Reise</span></article><article class="fin-kpi"><small>Bargeldbehebungen</small><strong>${h(money(report.cashCents))}</strong><span>Separat, kein nachgewiesener Konsum</span></article><article class="fin-kpi"><small>Unklare Zuordnungen</small><strong>${h(money(report.unresolvedCents))}</strong><span>${report.unresolvedCount} nicht mitgerechnet</span></article></div>
 <div class="fin-trip-columns"><article class="insight-chart-card"><h3>Reisekosten nach Kategorie</h3>${miniBars(report)}</article><article class="insight-chart-card"><h3>Reisen vergleichen</h3><div class="fin-trip-comparison">${summary}</div></article></div>
 <article class="fin-trip-list-card"><div class="fin-analysis-head"><div><h3>${report.linkedCount} zugeordnete Buchungen</h3><p class="fin-disclaimer">Vorabzahlungen bleiben auch dann Teil der Reise, wenn das Buchungsdatum außerhalb des Reisezeitraums liegt.</p></div></div><div class="fin-trip-transactions">${unlinked||'<p class="insight-no-data">Noch keine zugeordneten Zahlungen. Wähle unten Buchungen aus.</p>'}</div></article>
 <article class="fin-trip-list-card"><h3>Buchungen für diese Reise prüfen</h3><p>Die Vorschläge beruhen auf Datum und vorhandener Kategorie, nicht auf einer automatischen Orts- oder Ländererkennung. Regelmäßige Zahlungen sind möglicherweise keine Reisekosten.</p><div class="fin-trip-filter"><label>Suche <input id="finance-trip-query" type="search" maxlength="100" value="${h(query)}" placeholder="Hotel, Flug, Betrag oder Händler …" /></label><label>Auswahl <select id="finance-trip-mode"><option value="suggested" ${mode!=='all'?'selected':''}>Vorschläge aus dem Reisezeitraum</option><option value="all" ${mode==='all'?'selected':''}>Alle Bankbuchungen durchsuchen</option></select></label></div><div class="fin-ledger-count">${candidates.length} mögliche Buchungen · ${excludedIds.length} ausgeblendet</div><div class="fin-trip-transactions">${pending||'<p class="insight-no-data">Keine weiteren Vorschläge. Bei vorab bezahlten Reisen die Suche auf alle Buchungen erweitern.</p>'}</div><div class="fin-paging"><button type="button" data-action="finance-trip-prev" ${safePage===0?'disabled':''}>← Zurück</button><span>${safePage+1} / ${Math.max(1,Math.ceil(candidates.length/20))}</span><button type="button" data-action="finance-trip-next" ${safePage>=Math.ceil(candidates.length/20)-1?'disabled':''}>Weiter →</button></div>${excludedIds.length?`<button type="button" class="secondary-btn" data-action="finance-trip-show-excluded">${excludedIds.length} ausgeblendete Vorschläge zurücksetzen</button>`:''}</article>
 <p class="fin-disclaimer">Reisekosten sind aktuell nur so vollständig wie deine importierten Konten. Bargeld kann andernorts ausgegeben worden sein, Kartenzahlungen können zusätzliche Wechselkurskosten enthalten und Pauschalbeträge auch Ausgaben anderer Personen. Compass berechnet keine vollständigen Reisekosten, bevor du weitere Konten ergänzt und die Zuordnungen geprüft hast.</p></section>`;
}
