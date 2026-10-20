import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLifeBalanceRadar,financeRadarEvidence,lifeBalanceRadarView} from '../client/src/life-balance-radar-v563.js';
const today='2026-10-21';
const samples=(months,{pending=true}={})=>months.flatMap((month,i)=>[
 {id:`salary-${i}`,day:`${month}-04`,amountCents:280000,description:'Gehaltsueberweisung',flow:'unknown',needsReview:pending,currency:'EUR'},
 {id:`rent-${i}`,day:`${month}-06`,amountCents:-110000,description:'Wohnung Betriebskosten',flow:'transfer',category:'Transfer / Private Überweisung',needsReview:pending,currency:'EUR'},
 {id:`food-${i}`,day:`${month}-09`,amountCents:-25000,description:'Supermarkt',flow:'expense',needsReview:pending,currency:'EUR'},
]);
const axis=(model,id)=>model.axes.find(a=>a.key===id);
test('Radar counts imported, unreviewed mixed bank ledger even when cashflow model cannot confirm three months',()=>{
 const months=['2026-01','2026-02','2026-03','2026-04'];
 const rows=samples(months);
 const model=buildLifeBalanceRadar({financeTransactions:rows},{today});
 const fin=axis(model,'finance');
 assert.ok(Number.isFinite(fin.score));
 assert.match(fin.detail,/vorläufig/);
 assert.match(fin.detail,/Bank-Cashflow/);
 assert.match(fin.hint,/ungeprüft/);
 assert.ok(fin.observed>=3);
 assert.match(lifeBalanceRadarView(model),/vorläufig/);
});
test('Radar uses longer documented history rather than just six prior months',()=>{
 const months=['2025-11','2025-12','2026-01','2026-06'];
 const rows=samples(months,{pending:false});
 const model=buildLifeBalanceRadar({financeTransactions:rows},{today});
 const fin=axis(model,'finance');
 assert.ok(fin.score!=null);
 assert.equal(fin.observed,4);
 assert.equal(fin.latest,'2026-06');
});
test('Verified own-account transfers and capital transfers do not inflate income or spend',()=>{
 const months=['2026-04','2026-05','2026-06'];
 const rows=samples(months,{pending:false});
 for(const [i,m] of months.entries()){
  rows.push({id:`own-${i}`,day:`${m}-05`,amountCents:50000000,flow:'transfer',category:'Transfer / Eigene Konten',currency:'EUR'});
  rows.push({id:`crypto-${i}`,day:`${m}-11`,amountCents:-50000000,flow:'transfer',category:'Transfer / Krypto',currency:'EUR'});
 }
 const x=financeRadarEvidence(rows,today);
 assert.equal(x.monthCount,3);
 assert.equal(x.income,840000);
 assert.equal(x.expense,405000);
 assert.equal(x.excluded,6);
 assert.ok(x.score!==null);
});
test('Missing or partial bank history gives specific reason, not false claim no bank data',()=>{
 const no=financeRadarEvidence([],today);
 assert.match(no.cause,/Noch keine Bankbuchungen/);
 const few=financeRadarEvidence(samples(['2026-07'],{pending:false}),today);
 assert.equal(few.score,null);
 assert.match(few.cause,/nur 1 Monate/);
 const model=buildLifeBalanceRadar({financeTransactions:samples(['2026-07'])},{today});
 assert.equal(axis(model,'finance').score,null);
 assert.match(axis(model,'finance').detail,/auswertbare Buchungen/);
});
test('Historical overlays never copy the current finance score backwards',()=>{
 const rows=samples(['2026-04','2026-05','2026-06']);
 assert.equal(axis(buildLifeBalanceRadar({financeTransactions:rows},{today,historicalOnly:true}),'finance').score,null);
});
