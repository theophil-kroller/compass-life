import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {addHoldingSnapshot,validateHoldingSnapshot,latestHoldings} from '../client/src/finance-holdings-v19.js';
import {portfolioHistoricalPoints,netWorth19View,netWorthOverviewCard} from '../client/src/finance-net-worth-v19.js';
import {wealthSummary} from '../client/src/finance-wealth-consolidation.js';
const holding=(symbol,day,quantity='5',priceCents=15000)=>({symbol,name:`Holding ${symbol}`,kind:'etf',day,quantity,priceCents});
const snap=(type,label,day,cents)=>({type,label,day,cents});
test('0.5.19 holdings are strictly validated, priced in cents, replaced on exact same day',()=>{
 let h=addHoldingSnapshot([],holding('IE00TEST','2026-08-15','2.5',12345));
 assert.equal(h[0].valueCents,30863);
 h=addHoldingSnapshot(h,holding('IE00TEST','2026-08-15','3',12345));
 assert.equal(h.length,1);assert.equal(h[0].valueCents,37035);
 assert.throws(()=>validateHoldingSnapshot(holding('IE00TEST','2026-02-30')));
 assert.throws(()=>validateHoldingSnapshot({...holding('IE00TEST','2026-08-15'),name:'<img onerror=alert(1)>' ,quantity:'Infinity'}));
 assert.throws(()=>validateHoldingSnapshot(holding('IE00TEST','2026-08-15','1',1e12)));
});
test('0.5.19 only latest holding per security contributes to total; sold positions become zero',()=>{
 const positions=[holding('IE00TEST','2026-08-15','5'),holding('IE00TEST','2026-09-15','0'),holding('IE00B','2026-09-15','2')].reduce(addHoldingSnapshot,[]);
 assert.equal(latestHoldings(positions).length,1);assert.equal(latestHoldings(positions)[0].valueCents,30000);
 assert.equal(wealthSummary({financeHoldings:positions}).totalObservedCents,30000);
});
test('0.5.19 manual flatex holdings supplement wealth but never duplicate a flatex aggregate',()=>{
 const financeHoldings=[holding('ETF123','2026-10-15','4',20000)];
 const v=wealthSummary({financeHoldings});assert.equal(v.flatexHoldingsIncludedCents,80000);assert.equal(v.totalObservedCents,80000);
 const mixed=wealthSummary({financeHoldings,financeWealthSnapshots:[snap('flatex','flatex gesamt','2026-10-15',100000)]});
 assert.equal(mixed.totalObservedCents,100000);assert.equal(mixed.flatexHoldingsIncludedCents,0);assert.equal(mixed.flatexOverlap,true);
 assert.match(netWorth19View({financeHoldings,financeWealthSnapshots:[snap('flatex','flatex gesamt','2026-10-15',100000)]},'2026-10-19'),/Doppelzählungen/);
});
test('0.5.19 historical net worth never fills missing account dates with guessed balances',()=>{
 const financeWealthSnapshots=[snap('bank','Checking','2026-08-01',10000),snap('bank','Checking','2026-09-01',14000),snap('bank','Savings','2026-08-01',25000),snap('bank','Savings','2026-10-01',28000)];
 const p=portfolioHistoricalPoints({financeWealthSnapshots});assert.deepEqual(p.points.map(x=>x.day),['2026-08-01']);assert.equal(p.points[0].netCents,35000);
});
test('0.5.19 correct liabilities reduce net worth without reducing positive asset allocation',()=>{
 const s={financeWealthSnapshots:[snap('bank','Checking','2026-08-01',100000),snap('liability','Loan','2026-08-01',80000),snap('bank','Checking','2026-09-01',120000),snap('liability','Loan','2026-09-01',75000)]};
 const p=portfolioHistoricalPoints(s);assert.equal(p.points.length,2);assert.equal(p.points[0].assetsCents,100000);assert.equal(p.points[0].netCents,20000);assert.equal(p.points[1].netCents,45000);
 assert.match(netWorth19View(s,'2026-10-19'),/Veränderung zwischen vergleichbaren Stichtagen/);
 assert.match(netWorthOverviewCard(s),/450,00/);
});
test('0.5.19 empty state and incomplete crypto valuations are clearly indicated',()=>{
 assert.match(netWorth19View({},'2026-10-19'),/Noch keine/);
 const mixed={krakenPortfolio:{balances:{XXBT:'1',ETH:'3'},quotesEur:{XXBT:'100'}},financeWealthSnapshots:[snap('bank','Checking','2026-09-01',120000)]};
 const html=netWorth19View(mixed,'2026-10-19');assert.match(html,/Teilweise erfasst/);assert.match(html,/Kraken wird nur in seiner separat datierten Historie/);
});
test('0.5.19 escapes user-controlled labels, never publishes raw account details',()=>{
 const s={financeHoldings:[{...holding('ETF','2026-10-01'),name:'<img src=x onerror=alert(1)>'}]};
 assert.doesNotMatch(netWorth19View(s),/<img src/);assert.match(netWorth19View(s),/&lt;img/);
});
test('0.5.19 is wired into Portfolio and local form without changing workers',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8'),dash=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.22'/);assert.match(main,/finance-holding-add/);assert.match(dash,/netWorth19View\(state,today\)/);assert.match(dash,/netWorthOverviewCard/);
});
