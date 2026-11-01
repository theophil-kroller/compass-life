import {test} from 'node:test';
import assert from 'node:assert/strict';
import {financeSemanticFingerprint,financeDuplicateIndex,financeActiveTransactions,financeUniqueImports} from '../client/src/finance-duplicate-guard-v05916.js';
import {previewBankFiles,financeViewModel} from '../client/src/finance-core.js';
import {premiumFinanceModel,financeMonthBreakdown,financeAccountStatusModel,financePremiumOverviewView} from '../client/src/finance-premium-v57753.js';

const eng='Client: Technische Beispiel Universität Purpose of use: Lohn/Gehalt 80033827/202610 Client IBAN: AT123456789 Client BIC: BKAUATWWXXX';
const ger='Auftraggeber: Technische Beispiel Universität Verwendungszweck: Lohn/Geha 80033827/202610 IBAN Auftraggeber: AT123456789 BIC Auftraggeber: BKAUATWWXXX';
const salary=(id,description=eng,opts={})=>({id,day:'2026-10-15',valueDay:'2026-10-15',amountCents:260951,accountId:'raiffeisen:current:EUR',currency:'EUR',merchant:'Universität Beispiel',description,flow:'income',category:'Einnahmen / Gehalt',needsReview:false,source:'rule',...opts});
const interest={id:'flatex-1',day:'2026-10-01',valueDay:'2026-10-01',amountCents:898,accountId:'flatex:cash:EUR',currency:'EUR',merchant:'flatex',description:'Ertragsausschüttung',flow:'income',category:'Einnahmen / Kapitalerträge',needsReview:false};
const ledger=[salary('english'),salary('german',ger),interest];

test('English and German export of same payroll produce distinct provider IDs but same strong financial identity',()=>{
 const a=salary('en'),b=salary('de',ger);
 assert.notEqual(a.id,b.id);assert.ok(financeSemanticFingerprint(a));assert.equal(financeSemanticFingerprint(a),financeSemanticFingerprint(b));
 const idx=financeDuplicateIndex([a,b]);assert.equal(idx.groups.length,1);assert.equal(idx.rows.length,1);
});
test('existing duplicate is suppressed in monthly totals and auditable drill-down without deleting vault rows',()=>{
 const state={financeTransactions:ledger};
 assert.equal(ledger.length,3);
 const m=premiumFinanceModel(state,{period:'2026-10',today:'2026-11-01'});
 assert.equal(m.income,261849);assert.equal(m.records,2);
 assert.equal(financeMonthBreakdown(state,'all','2026-10','2026-11-01').income.length,2);
 assert.equal(financeViewModel(ledger,'2026-10').incomeCents,261849);
 const view=financePremiumOverviewView(state,{period:'2026-10',today:'2026-11-01'});
 assert.match(view,/1 sichere Import-Dublette\(n\) bereits neutralisiert/);
 assert.match(view,/finance-duplicate-restore/);
});
test('cross-language dedup can be manually overridden; original encrypted entries remain intact',()=>{
 const state={financeTransactions:ledger,financeDistinctTransactionIds:['german']};
 assert.equal(premiumFinanceModel(state,{period:'2026-10',today:'2026-11-01'}).income,522800);
 assert.equal(financeActiveTransactions(ledger,['german']).length,3);
 assert.equal(ledger.length,3);
});
test('two real same-day equal salaries with distinct payment references both count',()=>{
 const b=salary('different',ger.replace('80033827/202610','80033999/202610'));
 assert.equal(financeDuplicateIndex([salary('a'),b]).rows.length,2);
});
test('same date and value at another bank must NOT be deduplicated',()=>{
 const b=salary('other',ger,{accountId:'n26:current:EUR'});
 assert.equal(financeDuplicateIndex([salary('a'),b]).rows.length,2);
});
test('same date amount and merchant with no reliable reference is NOT automatically merged',()=>{
 const a=salary('a','Card payment at Café Beispiel');const b=salary('b','Card payment at Café Beispiel');
 assert.equal(financeDuplicateIndex([a,b]).rows.length,2);
});
test('repeat payroll one month later is not mistaken for a duplicate',()=>{
 assert.equal(financeDuplicateIndex([salary('a'),salary('b',ger,{day:'2026-11-15'})]).rows.length,2);
});
test('import guard prevents duplicate in both preview and final mutation against the latest vault state',()=>{
 const csvLine=desc=>`15.10.2026;"${desc}";15.10.2026;2609,51;EUR;`;
 const en=csvLine(eng),de=csvLine(ger);
 const files=[{name:'english.csv',text:en},{name:'deutsch.csv',text:de}];
 const prev=previewBankFiles(files,[]);
 assert.equal(prev.rows.length,1);assert.equal(prev.duplicates,1);
 const second=previewBankFiles([{name:'deutsch.csv',text:de}],prev.rows);
 assert.equal(second.rows.length,0);assert.equal(second.duplicates,1);
 const committed=financeUniqueImports(prev.rows,[salary('original',eng)]);
 assert.equal(committed.rows.length,0);assert.equal(committed.duplicates,1);
});
test('account balance bridge also counts the underlying payroll only once',()=>{
 const state={financeTransactions:ledger,financeWealthSnapshots:[{id:'anchor',type:'bank',label:'Raiffeisen · Giro',day:'2026-10-14',cents:100000}]};
 const model=financeAccountStatusModel(state,'2026-11-01','2026-10-31');
 const account=model.accounts.find(a=>a.id==='raiffeisen:current:EUR');
 assert.equal(account?.bridgeCount,1);
 assert.equal(account?.balanceCents,360951);
});
