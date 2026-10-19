/** Compass 0.5.31 — compact, evidence-based finance overview.
 * Presentation-only. All data are already present in the unlocked encrypted Vault.
 * No inferred bank balances, budget attainment or future direct-debit dates.
 */
import {escapeFinance} from './finance-core.js';
import {financeRecurringCandidates} from './finance-analytics.js';
import {flexBudgetModel,validateSavingsGoal} from './finance-flex-budget-v30.js';
const h=escapeFinance;
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const shortMonth=m=>new Intl.DateTimeFormat('de-AT',{month:'short'}).format(new Date(`${m}-15T12:00:00Z`));
const monthKey=day=>/^\d{4}-(?:0[1-9]|1[0-2])-[0-3]\d$/.test(String(day||''))?day.slice(0,7):null;
const validCents=t=>Number.isSafeInteger(t?.amountCents);
const expense=t=>t?.needsReview===false&&t.flow==='expense'&&validCents(t)&&t.amountCents<0;
const income=t=>t?.needsReview===false&&t.flow==='income'&&validCents(t)&&t.amountCents>0;
const go=(pane,label)=>`<button type="button" class="fin31-link" data-action="finance-pane" data-id="${h(pane)}">${h(label)} →</button>`;

export function financeMonthlyMini(rows=[]){
 const groups=new Map();
 for(const t of rows){const month=monthKey(t.day);if(!month||!validCents(t))continue;
  const m=groups.get(month)||{month,spend:0,income:0,count:0};m.count++;
  if(expense(t))m.spend-=t.amountCents;else if(income(t))m.income+=t.amountCents;
  groups.set(month,m);
 }
 const months=[...groups.values()].sort((a,b)=>a.month.localeCompare(b.month)).slice(-7);
 const max=Math.max(1,...months.flatMap(x=>[x.spend,x.income]));
 return `<section class="fin31-card fin31-months" aria-label="Monatlicher Geldfluss"><header class="fin31-card-header"><div><strong>Monatsentwicklung</strong><small>Bestätigte Einnahmen und Konsumausgaben</small></div>${go('Cashflow','Cashflow')}</header>
 ${months.length?`<div class="fin31-month-chart" role="img" aria-label="Monatliche Einnahmen und Konsumausgaben in den tatsächlich importierten Monaten">${months.map(m=>`<div class="fin31-month" title="${h(m.month)} · Einnahmen ${h(eur(m.income))} · Konsum ${h(eur(m.spend))} · ${m.count} importierte Buchungen"><div class="fin31-month-bars"><i class="fin31-income" style="height:${(100*m.income/max).toFixed(2)}%"></i><i class="fin31-spend" style="height:${(100*m.spend/max).toFixed(2)}%"></i></div><small>${h(shortMonth(m.month))}</small></div>`).join('')}</div><div class="fin31-legend"><span><i class="fin31-income"></i>Einnahmen</span><span><i class="fin31-spend"></i>Konsum</span></div><p class="fin31-footnote">Monate ohne Buchungen werden ausgelassen; es wird keine vollständige Datenabdeckung unterstellt.</p>`:'<p class="fin31-empty">Noch keine Monatsdaten importiert.</p>'}</section>`;
}

export function financeRecentPeek(rows=[]){
 const latest=rows.filter(t=>monthKey(t.day)&&validCents(t)).slice().sort((a,b)=>b.day.localeCompare(a.day)||String(a.id||'').localeCompare(String(b.id||''))).slice(0,5);
 return `<section class="fin31-card fin31-recent" aria-label="Letzte importierte Buchungen"><header class="fin31-card-header"><div><strong>Letzte Buchungen</strong><small>Importierte Vorgänge · alle Geldflussarten</small></div>${go('Buchungen','Alle')}</header>
 ${latest.length?`<div class="fin31-transactions">${latest.map(t=>{const label=String(t.merchantDisplayName||t.merchant||t.description||'Ohne Empfänger').slice(0,110),cat=String(t.category||'Ohne Kategorie').slice(0,90),pending=Boolean(t.needsReview),sign=t.amountCents<0?'−':'+';return `<div class="fin31-transaction"><span class="fin31-transaction-day">${h(t.day.slice(8,10))}.${h(t.day.slice(5,7))}.</span><span class="fin31-transaction-name"><strong title="${h(label)}">${h(label)}</strong><small title="${h(cat)}">${h(cat)}${pending?' · prüfen':''}</small></span><b class="${t.amountCents<0?'fin31-out':'fin31-in'}">${sign}${h(eur(Math.abs(t.amountCents)))}</b></div>`;}).join('')}</div>`:'<p class="fin31-empty">Keine Buchungen im gewählten Zeitraum.</p>'}</section>`;
}

export function financeBudgetPeek(state={},today='2026-10-19',account='all'){
 const month=today.slice(0,7);
 const accountSelected=account!=='all';
 const model=accountSelected?null:flexBudgetModel(state.financeTransactions||[],state.financeFlexBudgets||[],month);
 const groups=model?.groups.filter(g=>g.budgetCents>0)||[];
 const goals=(Array.isArray(state.financeSavingsGoals)?state.financeSavingsGoals:[]).flatMap(g=>{try{return [validateSavingsGoal(g)];}catch{return [];}}).slice(0,2);
 return `<section class="fin31-card fin31-budget" aria-label="Budgets und Sparziele"><header class="fin31-card-header"><div><strong>Budget &amp; Ziele</strong><small>${h(month)} · manuell definierte Pläne</small></div>${go('Budget & Ziele','Bearbeiten')}</header>
 ${accountSelected?'<p class="fin31-empty">Budgetübersicht gilt für alle Konten. Für den Gesamtüberblick den Kontofilter zurücksetzen.</p>':groups.length?`<div class="fin31-budget-rows">${groups.map(g=>{const fraction=Math.max(0,Math.min(100,g.spentCents/Math.max(1,g.budgetCents)*100));return `<div class="fin31-budget-row"><span>${h(g.label)}${g.id==='nonmonthly'?' · Jahr':' · Monat'}</span><strong>${h(eur(g.spentCents))} / ${h(eur(g.budgetCents))}</strong><div class="fin31-bar"><i style="width:${fraction.toFixed(2)}%;background:${g.color}"></i></div></div>`;}).join('')}</div>`:'<p class="fin31-empty">Noch kein Budget eingerichtet.</p>'}
 ${goals.length?`<div class="fin31-goal-rows">${goals.map(g=>`<div><span>${h(g.title)}</span><strong>${h(eur(g.savedCents))} / ${h(eur(g.targetCents))}</strong><div class="fin31-bar"><i style="width:${Math.min(100,100*g.savedCents/g.targetCents).toFixed(2)}%"></i></div></div>`).join('')}</div><p class="fin31-footnote">Sparfortschritt manuell erfasst, kein automatisch ermittelter Kontostand.</p>`:''}</section>`;
}

export function financeFixedPeek(rows=[],manual={}){
 const confirmed=financeRecurringCandidates(rows,manual).filter(r=>r.status==='fixed'&&r.active);
 const total=confirmed.reduce((sum,r)=>sum+r.meanCents,0);
 return `<section class="fin31-card fin31-fixed" aria-label="Wiederkehrende Kosten"><header class="fin31-card-header"><div><strong>Wiederkehrende Kosten</strong><small>${confirmed.length?`${confirmed.length} persönlich bestätigte Posten`:'Nur bestätigte Fixkosten'}</small></div>${go('Fixkosten','Prüfen')}</header>
 ${confirmed.length?`<div class="fin31-fixed-total"><span>Beobachteter Ø-Betrag je Zyklus</span><strong>${h(eur(total))}</strong></div><div class="fin31-fixed-rows">${confirmed.slice(0,4).map(r=>`<div><span title="${h(r.merchant)}">${h(r.merchant)}</span><b>${h(eur(r.meanCents))}</b></div>`).join('')}</div><p class="fin31-footnote">Vergangene Abbuchungen; kein verifizierter nächster Fälligkeitstermin.</p>`:'<p class="fin31-empty">Noch keine bestätigten regelmäßigen Zahlungen. Mögliche Kandidaten können unter Fixkosten geprüft werden.</p>'}</section>`;
}
