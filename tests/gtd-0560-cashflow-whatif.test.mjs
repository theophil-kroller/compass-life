import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cashflowDateOK,validatedPlanEvent,validateCashflowSettings,cashflowModel,cashflowDashboard} from '../client/src/finance-cashflow-v560.js';
const today='2026-10-20';
const months=['2026-04','2026-05','2026-06','2026-07','2026-08','2026-09'];
const transactions=months.flatMap((m,i)=>[
 {id:'s'+i,day:m+'-01',flow:'income',amountCents:250000,currency:'EUR',needsReview:false},
 {id:'e'+i,day:m+'-11',flow:'expense',amountCents:-150000,currency:'EUR',needsReview:false},
 {id:'t'+i,day:m+'-12',flow:'transfer',amountCents:-100000,currency:'EUR',needsReview:false},
]);
test('dates are real calendar dates; scenario must be validated',()=>{
 assert.equal(cashflowDateOK('2026-02-29'),false);
 assert.equal(cashflowDateOK('2028-02-29'),true);
 assert.throws(()=>validatedPlanEvent({day:today,kind:'expense',amountCents:-2,label:'Bad'}));
 assert.throws(()=>validateCashflowSettings({openingCents:-1,bufferCents:0,asOf:today},today));
 assert.throws(()=>validateCashflowSettings({openingCents:100,bufferCents:0,asOf:'2026-12-01'},today));
});
test('reliable historical movements exclude asset transfers; no fabricated bank balance',()=>{
 const m=cashflowModel({transactions,today});
 assert.equal(m.monthlyIncome,250000);assert.equal(m.monthlyExpense,250000);
 assert.equal(m.opening,null);assert.equal(m.year.length,12);assert.equal(m.year[0].balance,null);
 assert.equal(m.year[0].expectedIncome,0);assert.equal(m.year[11].change<=0,true);
});
test('urgent payment is a conditional scenario, without mutating transaction history',()=>{
 const original=structuredClone(transactions);const x=cashflowModel({transactions,settings:{openingCents:400000,bufferCents:100000,asOf:today},today,whatIf:{day:today,cents:100000}});
 assert.equal(x.verdict,'conditional');assert.equal(x.year[0].scenarioChange,-100000);
 assert.deepEqual(transactions,original);
 const risk=cashflowModel({transactions,settings:{openingCents:80000,bufferCents:100000,asOf:today},today,whatIf:{day:today,cents:800000}});
 assert.equal(risk.verdict,'risk');
});
test('outdated balance or patchy history never promises affordability',()=>{
 const stale=cashflowModel({transactions,settings:{openingCents:200000,bufferCents:50000,asOf:'2026-10-19'},today,whatIf:{day:today,cents:100000}});
 assert.equal(stale.verdict,'unavailable');assert.equal(stale.opening,null);
 const short=cashflowModel({transactions:transactions.slice(0,2),settings:{openingCents:200000,bufferCents:50000,asOf:today},today,whatIf:{day:today,cents:100000}});
 assert.equal(short.verdict,'unavailable');
});
test('one-off payments are counted once in their month, outside dates are not projected',()=>{
 const event=validatedPlanEvent({id:'plan-test-aaa',day:'2027-01-15',label:'Travel',kind:'expense',amountCents:70000});
 const income=validatedPlanEvent({id:'plan-test-bbb',day:'2027-02-03',label:'Honorary',kind:'income',amountCents:80000});
 const m=cashflowModel({transactions,planned:[event,income],today});
 assert.equal(m.year[3].plannedChange,-70000);assert.equal(m.year[4].plannedChange,80000);
 assert.equal(m.year[0].plannedChange,0);
});
test('UI exposes review, plan save and proper warnings',()=>{
 const html=cashflowDashboard({financeTransactions:transactions},today,{label:'Unexpected',day:today,cents:50000});
 assert.match(html,/Keine belastbare Ja\/Nein-Antwort/);
 assert.match(html,/finance-560-what-if/);assert.match(html,/finance-560-settings/);assert.match(html,/finance-560-commit-scenario/);
 const main=fs.readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/finance-560-commit-scenario/);assert.match(main,/finance-560-remove-event/);
 const dashboard=fs.readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');assert.match(dashboard,/cashflowDashboard\(state,today,ui.financeWhatIf/);
});

test('private family transfers lower bank runway; confirmed own-account transfers do not',()=>{
 const t=transactions.map(x=>({...x,category:x.flow==='transfer'?'Transfer / Eigene Konten':undefined}));
 const own=cashflowModel({transactions:t,today});
 const privateRows=t.map(x=>x.flow==='transfer'?{...x,category:'Transfer / Private Überweisung'}:x);
 const other=cashflowModel({transactions:privateRows,today});
 assert.equal(own.monthlyExpense,150000);
 assert.equal(other.monthlyExpense,250000);
});
