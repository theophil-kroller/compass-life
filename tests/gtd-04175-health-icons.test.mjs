import test from 'node:test';
import assert from 'node:assert/strict';
import {financeLedgerIcon,financeLedgerView} from '../client/src/finance-enhancements.js';
import {rollingObservations,quantile,fitdaysCompositionChart} from '../client/src/health-rolling.js';
import {insightsStressView,wellnessDayBars} from '../client/src/insights-wellness.js';
import {readFileSync} from 'node:fs';

test('ledger icons derive only from category and transaction type; never from merchant',()=>{
 assert.match(financeLedgerIcon({flow:'income',category:'Einnahmen / Gehalt'}),/fin-ledger-icon--banknote/);
 assert.match(financeLedgerIcon({flow:'expense',category:'Lebensmittel / Supermarkt'}),/fin-ledger-icon--cart/);
 assert.match(financeLedgerIcon({flow:'expense',category:'Lebensmittel / Bäckerei'}),/fin-ledger-icon--bread/);
 assert.match(financeLedgerIcon({flow:'transfer',category:'Transfer / Sparen'}),/fin-ledger-icon--transfer/);
 assert.match(financeLedgerIcon({flow:'expense',category:'<svg onload=alert(1)>'}),/fin-ledger-icon--receipt/);
 assert.doesNotMatch(financeLedgerIcon({flow:'expense',category:'<svg onload=alert(1)>'}),/onload=/);
});
test('rolling envelope respects trailing calendar days and minimum observations',()=>{
 const rows=[1,2,3,4,5,17,18].map(d=>({day:`2026-10-${String(d).padStart(2,'0')}`,v:d*2}));
 const o=rollingObservations(rows,'v',14,5);
 assert.equal(o[3].low,null);
 assert.ok(o[4].low!==null);
 assert.equal(o[5].count,3); // window October 4-17, excludes older days
 assert.equal(quantile([1,2,3,4,5],.5),3);
});
test('Fitdays never stacks overlapping compartments and includes calendar year',()=>{
 const html=fitdaysCompositionChart([{day:'2025-12-30',at:'2025-12-30T07:00:00',weightKg:82,bodyFatPct:25,muscleKg:58,waterPct:51}, {day:'2026-01-03',at:'2026-01-03T07:00:00',weightKg:83,bodyFatPct:25,muscleKg:58,waterPct:51}]);
 assert.match(html,/2025/);assert.match(html,/2026/);assert.match(html,/nicht addiert oder gestapelt/);
 assert.match(fitdaysCompositionChart([{day:'2026-01-03',at:'2026-01-03T07:00:00',weightKg:83,waterPct:51}],'water'),/Körperwasser/);
});
test('stress daily and weekly modes and new action wiring are present',()=>{
 const sample=[{day:'2026-10-15',avgStress:45,stressCount:2}];
 assert.match(wellnessDayBars(sample,'stress','week'),/Wochenblöcke/);
 const html=insightsStressView({garminWellness:[{at:'2026-10-15T08:00:00Z',stress:35,bodyBattery:80}]},'7','2026-10-18','','week');
 assert.match(html,/insights-stress-granularity/);
 assert.match(html,/health-day-switch/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/insights-night-day/);
 assert.match(main,/insights-body-composition/);
});
test('finance ledger renders icon alongside category safely',()=>{
 const row={id:'transaction-01',day:'2026-10-15',flow:'expense',amountCents:-572,merchant:'SPAR',category:'Lebensmittel / Supermarkt',needsReview:false,description:'SPAR',confidence:'confirmed'};
 const html=financeLedgerView([row]);
 assert.match(html,/fin-ledger-icon--cart/);assert.match(html,/SPAR/);
});
