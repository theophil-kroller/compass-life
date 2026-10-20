import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeMonthlySeries,financeExpenseOverview,financeRecurringCandidates,financeSearchTransactions,monthDistance} from '../client/src/finance-analytics.js';
import {financeTrendsView,financeCategoryDetailView,financeRecurringView,financeLedgerView,financeCashflowDetailView} from '../client/src/finance-enhancements.js';
import {financeDashboardView,expenseSankey,FINANCE_TABS} from '../client/src/finance-dashboard.js';
import {financeViewModel,categorizeTransaction,classifyBankTransaction} from '../client/src/finance-core.js';
const t=(id,day,amountCents,merchant,category,flow='expense',needsReview=false)=>({id,day,amountCents,merchant,description:merchant,category,flow,needsReview});
const entries=[
 t('food1','2026-07-03',-1800,'HOFER','Lebensmittel / Supermarkt'),
 t('food2','2026-08-03',-2400,'HOFER','Lebensmittel / Supermarkt'),
 t('food3','2026-09-03',-2400,'HOFER','Lebensmittel / Supermarkt'),
 t('tel1','2026-07-07',-1299,'Magenta Telekom','Verträge & Abos / Telekommunikation'),
 t('tel2','2026-08-07',-1299,'Magenta Telekom','Verträge & Abos / Telekommunikation'),
 t('tel3','2026-09-07',-1499,'Magenta Telekom','Verträge & Abos / Telekommunikation'),
 t('dep1','2026-09-11',-30000,'flatex','Transfer / Depot & Wertpapiere','transfer'),
 t('pay1','2026-09-13',-5100,'Paypal','Prüfen / Noch ungeklärt','expense',true),
 t('pay2','2026-09-14',2100,'Rückzahlung?','Prüfen / Noch ungeklärt','income',true),
 t('earn','2026-09-05',230000,'Arbeitgeber','Einnahmen / Gehalt','income'),
 t('reimb','2026-09-16',1200,'Erstattung','Rückerstattung / Rückzahlung','refund'),
];
test('0.5.14 separate confirmed spending, unclear outflow, unclear incoming and transfer',()=>{
 const s=financeMonthlySeries(entries),sept=s.at(-1);assert.equal(sept.month,'2026-09');
 assert.equal(sept.expenseCents,2400+1499);assert.equal(sept.pendingOutCents,5100);assert.equal(sept.pendingInCents,2100);
 assert.equal(sept.transfersOutCents,30000);assert.equal(sept.incomeCents,230000);assert.equal(sept.refundCents,1200);
 const model=financeViewModel(entries);assert.equal(model.pendingOutCents,5100);assert.equal(model.pendingInCents,2100);
 const sankey=expenseSankey(model);assert.match(sankey,/Prüfung ausstehend/);assert.doesNotMatch(sankey,/7[,.]200/);
});
test('0.5.14 monthly periods, category details and chronological adjacent comparison',()=>{
 assert.equal(monthDistance('2025-12','2026-01'),1);assert.equal(monthDistance('2026-02','2026-04'),2);assert.equal(monthDistance('broken','2026-04'),null);
 assert.equal(financeMonthlySeries(entries,'2026-09').length,1);
 const v=financeExpenseOverview(entries,'2026');assert.equal(v.monthChange.deltaCents,200); // 3899 vs 3699
 assert.equal(v.openOutCents,5100);assert.equal(v.openInCents,2100);
 assert.equal(v.categories.find(x=>x.name==='Lebensmittel').cents,6600);
 assert.ok(v.merchants.some(x=>x.name==='HOFER'));
});
test('0.5.14 recurring: consistent telecom is candidate, grocery not, user confirms or excludes',()=>{
 const candidate=financeRecurringCandidates(entries);const phone=candidate.find(x=>x.key==='MAGENTA TELEKOM');assert.ok(phone);
 assert.equal(phone.months,3);assert.equal(phone.status,'candidate');assert.ok(!candidate.some(x=>x.merchant==='HOFER'));
 assert.equal(financeRecurringCandidates(entries,{'MAGENTA TELEKOM':'fixed'}).find(x=>x.key==='MAGENTA TELEKOM').status,'fixed');
 assert.equal(financeRecurringCandidates(entries,{'MAGENTA TELEKOM':'exclude'}).length,0);
 const page=financeRecurringView(entries);assert.match(page,/Als Fixkosten bestätigen/);assert.match(page,/Kandidat/);
});
test('0.5.14 ledger search is case-insensitive, paginated, editable and HTML-escaped',()=>{
 const malicious=t('mal','2026-09-01',-1234,'<img src=x onerror=alert(1)>','Shopping / Online-Shopping');
 const v=financeSearchTransactions([...entries,malicious],{query:'MAGENTA',period:'2026-09'});assert.equal(v.count,1);assert.equal(v.rows[0].id,'tel3');
 const many=financeSearchTransactions(entries,{page:999,pageSize:2});assert.equal(many.page,many.pages-1);
 const html=financeLedgerView([malicious]);assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img src=x/);assert.match(html,/data-finance-edit="mal"/);
 assert.match(financeCashflowDetailView(entries),/Cashflow|Konto bewegt/);
});
test('0.5.14 existing navigation adds reversible category editor and readable trends',()=>{
 assert.ok(FINANCE_TABS.some(x=>x.title==='Buchungen'));
 const state={financeTransactions:entries,financeRecurringRules:{}};
 for(const pane of ['Überblick','Cashflow','Ausgaben','Fixkosten','Sparpotenzial','Buchungen']){
   const html=financeDashboardView(state,pane,'2026');assert.match(html,/finance-preview/);assert.ok(html.length>800);
 }
 assert.match(financeTrendsView(entries),/Monatsvergleich|Monatsvergleich/i);
 assert.match(financeCategoryDetailView(entries),/Lebensmittel/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.67\.1'/);
 assert.match(main,/data-finance-edit/);assert.match(main,/finance-recurring-fixed/);
 assert.doesNotMatch(main,/\/api\/finance/);
});

test('0.5.14 explicit category/flow validation prevents silent misclassification',()=>{
 const expense=t('e','2026-09-01',-1200,'Provider','Verträge & Abos / Telekommunikation');
 assert.throws(()=>categorizeTransaction(expense,'Einnahmen / Gehalt','income'),/Vorzeichen/);
 assert.throws(()=>categorizeTransaction(expense,'Verträge & Abos / Telekommunikation','transfer'),/passen nicht/);
 const refund={...expense,amountCents:1200};
 assert.throws(()=>categorizeTransaction(refund,'Verträge & Abos / Telekommunikation','expense'),/Vorzeichen/);
 const custom=[{merchantKey:'PROVIDER',category:'Verträge & Abos / Telekommunikation',flow:'expense'}];
 const c=classifyBankTransaction(refund,custom);assert.equal(c.category,'Einnahmen / Eingang ohne klare Herkunft'); // must not inherit outgoing category
 assert.equal(c.flow,'income');
});
test('0.5.14 users can restore excluded subscription suggestions',()=>{
 const html=financeRecurringView(entries,{'MAGENTA TELEKOM':'exclude'});
 assert.match(html,/ausgeschlossene Händler anzeigen/);assert.match(html,/Wieder prüfen/);
});
