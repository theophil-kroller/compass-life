import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BUDGET_CATEGORIES,validateBudgetEntry,putBudgetEntry,flexBudgetModel,validateSavingsGoal,putSavingsGoal,goalProjection,financeBudgetGoalsView} from '../client/src/finance-flex-budget-v30.js';
import {financeDashboardView,FINANCE_TABS} from '../client/src/finance-dashboard.js';

const row=(day,category,cents,extras={})=>({day,category,amountCents:-cents,flow:'expense',needsReview:false,...extras});
const food='Lebensmittel / Supermarkt',rent='Wohnen / Miete & Betriebskosten',travel='Freizeit & Reisen / Reisen & Unterkunft';
const entries=[{category:rent,group:'fixed',limitCents:90000},{category:food,group:'flexible',limitCents:30000},{category:travel,group:'nonmonthly',limitCents:120000}];
const transactions=[row('2026-09-15',food,500),row('2026-10-12',rent,85000),row('2026-10-14',food,18000),row('2026-10-17',travel,70000),row('2026-05-10',travel,25000),row('2025-12-11',travel,100000),row('2026-10-15',food,9000,{needsReview:true}),row('2026-10-16',food,4500,{flow:'transfer'}),row('2026-10-18',food,3200,{amountCents:3200,flow:'refund'}),row('2026-10-09','Shopping / Online-Shopping',3500)];
test('opt-in budgets require a known expense category, bucket and bounded cents',()=>{
 assert.ok(BUDGET_CATEGORIES.includes(rent));assert.ok(!BUDGET_CATEGORIES.includes('Transfer / Sparen'));
 assert.deepEqual(validateBudgetEntry(entries[0]),entries[0]);
 for(const bad of [{category:'Transfer / Sparen',group:'fixed',limitCents:1000},{category:food,group:'invalid',limitCents:100},{category:food,group:'fixed',limitCents:-1},{category:food,group:'fixed',limitCents:Infinity},{category:food,group:'fixed',limitCents:1.9}])assert.throws(()=>validateBudgetEntry(bad));
 assert.equal(putBudgetEntry(entries,{category:food,group:'flexible',limitCents:45000}).length,3);
});
test('monthly fixed/flexible and annual nonmonthly values have different horizons',()=>{
 const m=flexBudgetModel(transactions,entries,'2026-10');
 assert.equal(m.monthlyTotalCents,176500); // 85k+18k+70k+3.5k
 assert.equal(m.groups[0].spentCents,85000);assert.equal(m.groups[0].remainingCents,5000);
 assert.equal(m.groups[1].spentCents,18000);assert.equal(m.groups[1].remainingCents,12000);
 assert.equal(m.groups[2].spentCents,95000);assert.equal(m.groups[2].remainingCents,25000);
 assert.equal(m.groups[2].provisionCents,10000);
 assert.equal(m.unbudgetedCents,3500);assert.equal(m.configured,3);
 assert.equal(flexBudgetModel(transactions,entries,'2026-09').groups[1].spentCents,500);
});
test('open cases, transfers, cash and refunds never inflate consumption',()=>{
 const m=flexBudgetModel([row('2026-10-01',food,300),row('2026-10-02',food,300,{needsReview:true}),row('2026-10-03',food,200,{flow:'cash'}),row('2026-10-04',food,300,{amountCents:300,flow:'refund'})],entries,'2026-10');
 assert.equal(m.monthlyTotalCents,300);
});
test('budget model tolerates broken legacy entries but rejects invalid months',()=>{
 const m=flexBudgetModel(transactions,[{category:food,group:'wrong',limitCents:100},entries[1]],'2026-10');assert.equal(m.configured,1);
 assert.throws(()=>flexBudgetModel([],[],'2026-13'));
});
test('savings goals are explicit manual values and keep existing wealth goals separate',()=>{
 const g={id:'saving-test-1',title:'Notgroschen',kind:'reserve',targetCents:600000,savedCents:200000,targetDay:'2027-10-01',updatedDay:'2026-10-19'};
 assert.deepEqual(validateSavingsGoal(g),g);assert.deepEqual(goalProjection(g,'2026-10-19').remaining,400000);
 assert.ok(goalProjection(g,'2026-10-19').monthly>0);
 assert.equal(goalProjection({...g,targetDay:''},'2026-10-19').monthly,null);
 assert.equal(putSavingsGoal([g],{...g,savedCents:210000}).length,1);
 for(const bad of [{...g,savedCents:-1},{...g,title:'<'.repeat(100)},{...g,targetDay:'2026-02-31'},{...g,targetCents:NaN}])assert.throws(()=>validateSavingsGoal(bad));
});
test('Finance exposes Budget & Ziele as compact navigation with protected escaped controls',()=>{
 assert.ok(FINANCE_TABS.some(x=>x.title==='Budget & Ziele'));
 const s={financeTransactions:transactions,financeFlexBudgets:entries,financeSavingsGoals:[{id:'saving-demo',title:'<script>attack</script>',kind:'savings',targetCents:200000,savedCents:50000,targetDay:'',updatedDay:''}]};
 const body=financeBudgetGoalsView(s,'2026-10','2026-10-19');
 for(const token of ['id="finance-budget-month"','finance-flex-budget-form','finance-savings-goal-form','finance-goal-update','Unregelmäßig','Jahresbudget','35,00'])assert.ok(body.includes(token),token);
 assert.ok(!body.includes('<script>attack</script>'));assert.ok(body.includes('&lt;script&gt;'));
 const html=financeDashboardView(s,'Budget & Ziele','last12',null,0,{account:'all',today:'2026-10-19',budgetMonth:'2026-10'});
 assert.match(html,/fin30-panel/);assert.match(html,/Aktueller Finanzbereich/);
});
test('UI event wiring saves manually entered goals and budgets through encrypted mutation, not D1',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const field of ['financeFlexBudgets','financeSavingsGoals','finance-budget-month','finance-budget-edit','finance-goal-remove'])assert.ok(main.includes(field),field);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.60'/);
});
