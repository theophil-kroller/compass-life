import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLifeBalanceRadar,buildLifeBalanceHistory,workBalanceEvidence,lifeBalanceRadarView} from '../client/src/life-balance-radar-v563.js';
const day=(d,h=8)=>({day:d,hours:h});
const week=['2026-10-12','2026-10-13','2026-10-14','2026-10-15','2026-10-16'].map(x=>day(x));
const axis=(model,key)=>model.axes.find(a=>a.key===key);
test('7-day radar includes the completed ISO week even when sliding interval cuts Monday/Tuesday off',()=>{
 const model=buildLifeBalanceRadar({workTime:{days:week}},{today:'2026-10-21',period:7});
 assert.equal(model.start,'2026-10-15');
 assert.equal(axis(model,'work').score,100);
 assert.match(axis(model,'work').detail,/40 h/);
 assert.match(axis(model,'work').detail,/2026-10-12–2026-10-18/);
 assert.equal(axis(model,'work').observed,5);
 assert.match(lifeBalanceRadarView(model),/Arbeitsbalance/);
});
test('Incomplete current week is not extrapolated and does not erase the latest complete week',()=>{
 const model=buildLifeBalanceRadar({workTime:{days:[...week,day('2026-10-19',12),day('2026-10-20',12)]}},{today:'2026-10-21'});
 assert.equal(axis(model,'work').score,100);
 assert.match(axis(model,'work').detail,/2026-10-18/);
});
test('Overtime reduces score; 30-day radar averages adequately documented full weeks',()=>{
 const earlier=['2026-10-05','2026-10-06','2026-10-07','2026-10-08','2026-10-09'].map(x=>day(x,10));
 const all=[...earlier,...week];
 const seven=workBalanceEvidence({days:all},{start:'2026-10-15',today:'2026-10-21',period:7,weeklyLimit:45});
 assert.equal(seven.average,40);
 const thirty=workBalanceEvidence({days:all},{start:'2026-09-22',today:'2026-10-21',period:30,weeklyLimit:45});
 assert.equal(thirty.average,45);
 assert.equal(thirty.weeks.length,2);
 const high=workBalanceEvidence({days:earlier},{start:'2026-10-08',today:'2026-10-14',period:7,weeklyLimit:45});
 assert.equal(high.score,75);
});
test('Historical seven-day periods do not copy the current workweek',()=>{
 const all=[...['2026-10-05','2026-10-06','2026-10-07','2026-10-08','2026-10-09'].map(x=>day(x,10)),...week];
 const model=buildLifeBalanceRadar({workTime:{days:all}},{today:'2026-10-21'});
 const [previous]=buildLifeBalanceHistory({workTime:{days:all}},{today:'2026-10-21'});
 assert.equal(axis(model,'work').score,100);
 assert.equal(axis(previous,'work').score,75);
});
test('No import or only an incomplete week remains explicitly unknown',()=>{
 const empty=workBalanceEvidence({}, {start:'2026-10-15',today:'2026-10-21'});
 assert.equal(empty.score,null);
 assert.match(empty.detail,/Keine Arbeitszeitdaten/);
 const partial=workBalanceEvidence({days:[day('2026-10-19'),day('2026-10-20')]},{start:'2026-10-15',today:'2026-10-21'});
 assert.equal(partial.score,null);
 assert.match(partial.detail,/keine abgeschlossene ISO-Woche/);
});
