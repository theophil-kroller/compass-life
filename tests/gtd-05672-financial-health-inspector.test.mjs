import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financialHealthEvidence} from '../client/src/financial-health-v5672.js';
import {buildLifeBalanceRadar,lifeBalanceRadarView,balanceAxisInspector} from '../client/src/life-balance-radar-v563.js';
const today='2026-10-21';
const tx=(months=['2026-05','2026-06','2026-07'])=>months.flatMap((m,i)=>[
 {day:`${m}-04`,id:`pay${i}`,amountCents:300000,flow:'income',category:'Einkommen',currency:'EUR'},
 {day:`${m}-08`,id:`rent${i}`,amountCents:-110000,flow:'transfer',category:'Transfer / Private Überweisung',description:'Betriebskosten',currency:'EUR'},
 {day:`${m}-10`,id:`food${i}`,amountCents:-45000,flow:'expense',category:'Lebensmittel',currency:'EUR'},
]);
test('Investing and own-account transfers do not reduce consumption-based cashflow signal',()=>{
 const base=tx(), before=financialHealthEvidence({financeTransactions:base},today);
 const extra=base.concat(['2026-05','2026-06','2026-07'].flatMap((m,i)=>[
  {id:'deposit'+i,day:`${m}-15`,amountCents:-500000,flow:'transfer',category:'Transfer / Depot & Wertpapiere',currency:'EUR'},
  {id:'saving'+i,day:`${m}-16`,amountCents:-200000,flow:'transfer',category:'Transfer / Sparen',currency:'EUR'},
  {id:'own'+i,day:`${m}-17`,amountCents:-60000,flow:'transfer',category:'Transfer / Eigene Konten',currency:'EUR'}
 ]));
 const after=financialHealthEvidence({financeTransactions:extra},today);
 assert.equal(before.score,after.score);assert.equal(before.expense,after.expense);assert.equal(after.excluded,9);
 assert.equal(after.excludedBy.invest,6);
});
test('Reserve is never inferred from transactions, stale confirmation cannot influence score',()=>{
 const rows=tx(),base=financialHealthEvidence({financeTransactions:rows},today);
 const stale=financialHealthEvidence({financeTransactions:rows,financeCashflowSettings:{openingCents:800000,asOf:'2026-10-20'}},today);
 assert.equal(base.reserveScore,null);assert.equal(stale.reserveScore,null);assert.equal(stale.score,base.score);
 const fresh=financialHealthEvidence({financeTransactions:rows,financeCashflowSettings:{openingCents:800000,asOf:today}},today);
 assert.ok(fresh.reserveScore!==null);assert.ok(fresh.score!==null);assert.ok(fresh.verifiedBalance);
});
test('People score counts contacts on rhythm correctly and offers truthful explanation',()=>{
 const people=Object.fromEntries([1,2,3,4].map(n=>[String(n),{id:String(n),name:`Mensch ${n}`,contactCadenceDays:30,contactHistory:[{day:'2026-10-20',type:'meeting'}]}]));
 const model=buildLifeBalanceRadar({people,financeTransactions:tx()},{today});
 const contact=model.axes.find(a=>a.key==='people');
 if(contact.observed>0){assert.match(contact.detail,/im gewünschten Kontaktrhythmus/);assert.doesNotMatch(contact.detail,/0 von 4.*erreicht/);}
 const finance=model.axes.find(a=>a.key==='finance');
 const html=balanceAxisInspector(finance,model);
 assert.match(html,/Ø Einnahmen \/ Monat/);assert.match(html,/Eigen-\/Kapitaltransfers ausgeschlossen/);assert.match(html,/WIE WIRD GERECHNET/);
});
test('Radar has right-side inspector and clickable axis; overview has no duplicate radar',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const view=lifeBalanceRadarView(buildLifeBalanceRadar({financeTransactions:tx()},{today}),{activeAxis:'finance'});
 assert.match(view,/class="lbr63-aside lbr672-side-panel"/);assert.match(view,/data-action="balance-select" data-id="finance"/);
 assert.match(view,/lbr672-explanation/);assert.match(main,/action==='balance-select'/);
 const section=main.match(/function homeScreen\(\)\{[\s\S]*?\n\}/)?.[0];
 assert.ok(section);assert.doesNotMatch(section,/lifeBalanceRadarView|buildLifeBalanceRadar/);
 assert.match(main,/insightTab==='balance'\?lifeBalanceRadarView/);
});
