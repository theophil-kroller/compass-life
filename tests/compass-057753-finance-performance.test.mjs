import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {premiumFinanceRange,premiumFinanceModel,financePremiumOverviewView} from '../client/src/finance-premium-v57753.js';
import {compass753Bridge} from '../client/compass753-bridge.js';

const tx=(day,amountCents,flow,category='Lebensmittel',rest={})=>({day,amountCents,flow,category,accountId:'n26:current:EUR',...rest});
const today='2026-10-24';
test('finance overview aggregates only confirmed income and spending; never counts own transfers',()=>{
 const state={financeTransactions:[
  tx('2026-10-01',260000,'income'),tx('2026-10-07',-48000,'expense','Wohnung / Betriebskosten'),tx('2026-10-11',-5000,'expense','Lebensmittel / Hofer'),
  tx('2026-10-12',-200000,'transfer'),tx('2026-10-13',200000,'transfer'),
  tx('2026-10-14',-7600,'expense','Reisen',{needsReview:true}),tx('2026-10-19',1400,'refund')
 ]};
 const m=premiumFinanceModel(state,{period:'current',account:'all',today});
 assert.equal(m.income,260000);assert.equal(m.expense,53000);assert.equal(m.pending,7600);
 assert.equal(m.refund,1400);assert.equal(m.flow,208400);
 assert.equal(m.review,1);assert.deepEqual(m.categories.map(x=>x.name),['Wohnung','Lebensmittel']);
 assert.equal(m.months.length,1);assert.equal(m.months[0].expense,53000);
 const html=financePremiumOverviewView(state,{period:'current',today});
 assert.match(html,/fin53-chart-scroll/);assert.match(html,/finance-period/);assert.match(html,/finance-account/);
 assert.match(html,/finance-pane/);assert.doesNotMatch(html,/fin30-deep-insights/);assert.doesNotMatch(html,/finance-import-manager/);
});
test('account and period filters stay valid, with missing months not fabricated as zero',()=>{
 const state={financeTransactions:[
  tx('2026-01-09',-1400,'expense'),tx('2026-03-12',-2800,'expense'),tx('2026-08-12',-7300,'expense'),
  tx('2026-10-02',-800,'expense','Essen',{accountId:'revolut:current:EUR'})
 ]};
 const m=premiumFinanceModel(state,{period:'last12',account:'n26:current:EUR',today});
 assert.deepEqual(m.months.map(x=>x.month),['2026-01','2026-03','2026-08']);
 assert.equal(m.expense,11500);
 assert.equal(premiumFinanceRange('last3',today).from,'2026-08-01');
 assert.equal(premiumFinanceRange('current',today).from,'2026-10-01');
 assert.equal(premiumFinanceRange('2025',today).to,'2025-12-31');
 const escaped=financePremiumOverviewView({financeTransactions:[tx(today,-1500,'expense','<img onerror=alert(1)>')]},{period:'current',today});
 assert.doesNotMatch(escaped,/<img onerror/);assert.match(escaped,/&lt;img/);
});
test('renders empty data honestly and never implies live bank balance or rate of return',()=>{
 const s=financePremiumOverviewView({}, {today});
 assert.match(s,/Noch keine klassifizierten Buchungen/);assert.match(s,/keine geschätzten Kontostände/i);
 assert.doesNotMatch(s,/0 % Rendite/);
});
test('large historical imports have bounded initial aggregation and no costly extended dashboard render',()=>{
 const rows=Array.from({length:25000},(_,i)=>tx('2026-'+String(i%12+1).padStart(2,'0')+'-12',-(i%3800+100),'expense',`Gruppe ${i%25}`));
 const st={financeTransactions:rows};
 const t0=performance.now();
 const m=premiumFinanceModel(st,{period:'last12',today});
 const elapsed=performance.now()-t0;
 assert.ok(elapsed<2500,`25k transaction aggregation unexpectedly slow: ${elapsed.toFixed(0)} ms`);
 assert.equal(m.records,rows.filter(x=>x.day<=today).length);
 assert.ok(m.months.length<=12);
 const code=readFileSync(new URL('../client/compass753-bridge.js',import.meta.url),'utf8');
 assert.match(code,/if\(financePane==='Überblick'\)return chrome\(financePremiumOverviewView/);
});
test('guarded main integration routes only Überblick to the fast path, not Heute or detail panes',()=>{
 const fixture=`const COMPASS_CLIENT_VERSION='0.5.77.52';\nimport './chart-first-v57752.css';\nfunction todayScreen(){return chrome(todayWork());}\nfunction financeScreen(){return chrome(financeDashboardView(state,financePane));}`;
 const b=compass753Bridge();const result=b.transform(fixture,'/work/client/src/main.js').code;
 assert.match(result,/COMPASS_CLIENT_VERSION='0\.5\.77\.53'/);
 assert.match(result,/financePane==='Überblick'\)return chrome\(financePremiumOverviewView/);
 assert.match(result,/return chrome\(financeDashboardView/);
 assert.match(result,/function todayScreen\(\)\{return chrome\(todayWork\(\)\);\}/);
 assert.equal(b.transform(fixture,'/work/client/src/misc.js'),null);
 assert.throws(()=>b.transform(fixture.replace('financeScreen','otherScreen'),'/work/client/src/main.js'),/fast.path|overview/);
});
test('sleep renderer shows week and trend before weekly-average tiles, with phase distribution visible',()=>{
 const fixture=`function sleep(){return \`<section class="sleep550">\n  <header class="sleep550-lead">Schlaf</header>\n  <div class="sleep550-summary">Wochendurchschnitt</div>\n  <div class="sleep550-insight-note">Vorheriger Zeitraum</div>\n  <div class="sleep550-primary">Wochenchart</div>\n  <article class="insight-chart-card sleep550-trend">Trendchart</article>\n  \${showYear?sleepAnnualView(nights,today,yearMode,yearAnchor):'<div/> ' }\n  <details class="sleep550-extra sleep550-statistics"><summary>Verteilung</summary></details>\n </section>\`;}`;
 const code=compass753Bridge().transform(fixture,'/repo/client/src/sleep-intelligence-v550.js').code;
 assert.ok(code.indexOf('Wochenchart')<code.indexOf('Wochendurchschnitt'));
 assert.ok(code.indexOf('Trendchart')<code.indexOf('Wochendurchschnitt'));
 assert.match(code,/<details class="sleep550-extra sleep550-statistics" open>/);
 assert.throws(()=>compass753Bridge().transform('unrelated','/repo/client/src/sleep-intelligence-v550.js'),/sleep priority/);
});
test('Vite plugin chain preserves historical transforms and includes .53 after .52',()=>{
 const c=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(c,/import \{ compass753Bridge \} from '\.\/compass753-bridge\.js'/);
 assert.match(c,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\)\]/);
});
