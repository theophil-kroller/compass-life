import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateWealthPlan,validateWealthGoal,addWealthGoal,wealthScenarioSeries,wealthPlanningModel,wealthPlanningView} from '../client/src/finance-wealth-planning-v20.js';
const snap=(type,label,cents,day='2026-10-15')=>({type,label,cents,day});
const basic={financeWealthSnapshots:[snap('bank','Giro',350000),snap('other','Other assets',500000),snap('liability','Loan',200000)]};
const full={monthlyLivingCents:200000,monthlyPassiveCents:75000,monthlyContributionCents:20000,annualReturnBps:300,annualInflationBps:200,horizonYears:10};
test('0.5.20 only manual values contribute to financial coverage',()=>{
 const empty=wealthPlanningModel(basic);assert.equal(empty.coverage,null);assert.equal(empty.scenarios,null);
 const model=wealthPlanningModel({...basic,financeWealthPlan:full});
 assert.equal(model.coverage,37.5);assert.equal(model.liquidMonths,1.75);assert.equal(model.wealth.totalObservedCents,650000);
});
test('0.5.20 transfers, salaries, crypto trades cannot silently become passive income',()=>{
 const model=wealthPlanningModel({...basic,financeTransactions:[{day:'2026-10-01',flow:'income',amountCents:1000000},{day:'2026-10-02',flow:'transfer',amountCents:1500000}],financeWealthPlan:{...full,monthlyPassiveCents:0}});
 assert.equal(model.coverage,0);
});
test('0.5.20 inflation affects future living costs, not nominal asset return scenarios',()=>{
 const data=wealthPlanningModel({...basic,financeWealthPlan:{...full,horizonYears:10,annualInflationBps:0}});
 const more=wealthPlanningModel({...basic,financeWealthPlan:{...full,horizonYears:10,annualInflationBps:300}});
 assert.equal(data.futureLivingCents,200000);assert.ok(more.futureLivingCents>260000);
 assert.ok(more.futureCoverage<data.futureCoverage);
 assert.equal(more.scenarios.data.at(-1).basis,data.scenarios.data.at(-1).basis);
});
test('0.5.20 scenario math starts with observed value and includes month-end contributions',()=>{
 const plan={...full,monthlyContributionCents:10000,annualReturnBps:0,horizonYears:3};
 const rows=wealthScenarioSeries(1_000_000,plan).data;assert.equal(rows.length,4);assert.equal(rows[0].basis,1_000_000);assert.equal(rows.at(-1).basis,1_360_000);
 assert.ok(rows.at(-1).vorsichtig<rows.at(-1).basis&&rows.at(-1).basis<rows.at(-1).hoch);
});
test('0.5.20 input validation rejects negative expenses, NaN and unrealistic inputs',()=>{
 assert.throws(()=>validateWealthPlan({...full,monthlyLivingCents:-1}));
 assert.throws(()=>validateWealthPlan({...full,monthlyLivingCents:NaN}));
 assert.throws(()=>validateWealthPlan({...full,annualReturnBps:2000}));
 assert.throws(()=>validateWealthPlan({...full,horizonYears:100}));
 assert.throws(()=>validateWealthGoal({id:'g-test',label:'Home',kind:'net',targetCents:10000,targetDay:'2026-02-30'}));
});
test('0.5.20 wealth goals are local, constrained and progress is type-specific',()=>{
 const goals=addWealthGoal([],{id:'g-reserve',label:'Liquidity cushion',kind:'liquid',targetCents:700000,targetDay:'2027-01-01'});
 const m=wealthPlanningModel({...basic,financeWealthGoals:goals});assert.equal(m.goals[0].available,350000);assert.equal(m.goals[0].percentage,50);
 const net=addWealthGoal(goals,{id:'g-net',label:'Savings goal',kind:'net',targetCents:1000000,targetDay:''});
 assert.equal(wealthPlanningModel({...basic,financeWealthGoals:net}).goals[1].percentage,65);
 assert.equal(addWealthGoal(net,{...net[0],label:'Updated reserve'}).length,2);
});
test('0.5.20 empty accounts never invent liquidity or a return scenario',()=>{
 const m=wealthPlanningModel({financeWealthPlan:full});assert.equal(m.liquidMonths,null);assert.equal(m.scenarios,null);
 const html=wealthPlanningView({financeWealthPlan:full});assert.match(html,/fehlt noch ein erfasster Vermögensstand/);assert.doesNotMatch(html,/NaN/);
});
test('0.5.20 HTML escapes the user goal label and scenario bands are appropriately described',()=>{
 const goal={id:'g-escape',label:'<img src=x onerror=alert(1)>',kind:'net',targetCents:1000000,targetDay:''};
 const html=wealthPlanningView({...basic,financeWealthPlan:full,financeWealthGoals:[goal]});
 assert.doesNotMatch(html,/<img src/);assert.match(html,/&lt;img/);assert.match(html,/kein Konfidenzintervall/);
 assert.match(html,/finance-wealth-plan-form/);assert.match(html,/finance-wealth-goal-form/);
});
test('0.5.20 UI is wired locally without any new worker endpoint or cloud transfer',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const finance=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.67\.1'/);
 assert.match(main,/finance-wealth-goal-remove/);assert.match(main,/financeWealthPlan=plan/);
 assert.match(finance,/wealthPlanningView\(state\)/);
});
