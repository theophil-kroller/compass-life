import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseFlatexPositionsCsv,flatexSnapshotStats,putFlatexSnapshot,latestFlatexSnapshot} from '../client/src/finance-flatex-positions-v37.js';
import {portfolioProfessionalView} from '../client/src/finance-portfolio-pro-v37.js';
import {wealthSummary} from '../client/src/finance-wealth-consolidation.js';
import {financeDashboardView,FINANCE_TABS} from '../client/src/finance-dashboard.js';
const head='stichtag;isin;bezeichnung;art;stueck;kurs_eur;marktwert_eur;einstand_eur';
const rows=[head,'2026-10-19;IE00TEST1234;Synthetic Global ETF;ETF;2,5;40,00;100,00;80,00','2026-10-19;AT00TEST1234;Synthetic Stock;AKTIE;2;50,00;100,00;115,00','2026-10-19;CASH;Synthetic Cash;CASH;0;0;29,25;29,25'];
const parsed=()=>parseFlatexPositionsCsv(rows.join('\n'));
test('v37 import is precise and idempotent per date, including cash separated from shares',()=>{
 const s=parsed(),v=flatexSnapshotStats(s);assert.equal(v.sharesCents,20000);assert.equal(v.cashCents,2925);assert.equal(v.overallCents,22925);
 assert.equal(v.gainCents,500);assert.equal(putFlatexSnapshot(putFlatexSnapshot([],s),s).length,1);
 assert.equal(latestFlatexSnapshot([s]).day,'2026-10-19');
});
test('v37 rejects corrupted portfolio data and misleading snapshots',()=>{
 assert.throws(()=>parseFlatexPositionsCsv(rows.join('\n').replace('100,00;80,00','900,00;80,00')),/widersprechen/);
 assert.throws(()=>parseFlatexPositionsCsv([rows[0],rows[1],rows[1]].join('\n')),/mehrfach/);
 assert.throws(()=>parseFlatexPositionsCsv(rows.join('\n').replace('2026-10-19;CASH','2026-10-18;CASH')),/Stichtag/);
 assert.throws(()=>parseFlatexPositionsCsv(rows.join('\n').replace('IE00TEST1234','<script>alert')),/ISIN/);
});
test('v37 consolidated wealth does not double count manual aggregate, manual holdings and imported snapshot',()=>{
 const base={financeFlatexSnapshots:[parsed()],financeHoldings:[{day:'2026-10-19',name:'Legacy Example',symbol:'IE00TEST1234',kind:'etf',quantity:'1',priceCents:5000}]};
 const s=wealthSummary(base);assert.equal(s.flatexHoldingsIncludedCents,22925);assert.equal(s.totalObservedCents,22925);assert.equal(s.flatexOverlap,true);
 const aggregate=wealthSummary({...base,financeWealthSnapshots:[{type:'flatex',label:'Manual total',day:'2026-10-19',cents:33000}]});assert.equal(aggregate.flatexHoldingsIncludedCents,0);assert.equal(aggregate.totalObservedCents,33000);
});
test('v37 professional dashboard shows dated allocation, visible holdings, source caution and no invented historical trend',()=>{
 const html=portfolioProfessionalView({financeFlatexSnapshots:[parsed()]});
 assert.match(html,/synthetic/i);assert.match(html,/Positionen &amp; Gewichtung/);assert.match(html,/Finanzdaten|Datenstichtag|kein Kursverlauf/i);
 assert.match(html,/id="finance-flatex-positions-file"/);assert.match(html,/€|EUR/);assert.doesNotMatch(html,/<script>/);
 const dash=financeDashboardView({financeTransactions:[],financeFlatexSnapshots:[parsed()]},'Portfolio','all');assert.match(dash,/PORTFOLIO PROFESSIONAL/);
});
test('v37 exposes every finance tab in the left navigation without any hidden more menu',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const group=main.slice(main.indexOf('id="calm-nav-finance"'),main.indexOf('${navItem(\'review\''));
 assert.match(group,/FINANCE_GROUPS\.map\(group=>/);assert.doesNotMatch(group,/Weitere Analysen|calm-finance-sidebar-more/);
 assert.ok(FINANCE_TABS.length>10);assert.match(main,/finance-flatex-positions-file/);
 const html=financeDashboardView({financeTransactions:[]},'Portfolio','all');assert.doesNotMatch(html,/class="calm-finance-more/);
});
