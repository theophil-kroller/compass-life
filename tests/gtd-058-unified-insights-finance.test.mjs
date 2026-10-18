import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {percentile,hrvObservedBand,weeklyDistributions,joinedSleepHrv,sleepDistributionChart,hrvReferenceView,sleepHrvScatter} from '../client/src/insights-stats.js';
import {healthSourcesView,healthBodyView,healthConnectActivityView} from '../client/src/health-dashboard.js';
import {FINANCE_EXPORTS,FINANCE_PANES,financePreviewView} from '../client/src/finance-preview.js';
import {INSIGHT_TABS,buildSleepInsights,insightsSleepView} from '../client/src/insights.js';

const date=n=>`2026-10-${String(n).padStart(2,'0')}`;
const sleep=Array.from({length:18},(_,i)=>({day:date(i+1),sleepMinutes:350+i*5,totals:{deep:60,light:220,rem:70},start:`${date(i+1)}T00:00:00Z`,end:`${date(i+1)}T06:00:00Z`,stages:[]}));
const hr=Array.from({length:18},(_,i)=>({day:date(i+1),nightAverageMs:36+i,weeklyAverageMs:null}));

test('percentile interpolates observed values and never invents a missing interval',()=>{
 assert.equal(percentile([4,2,3,1],.5),2.5);
 assert.equal(percentile([], .2),null);
 assert.deepEqual(hrvObservedBand(hr.slice(0,13)),{count:13,low:null,high:null,median:null});
 const band=hrvObservedBand(hr);assert.equal(band.count,18);assert.ok(band.low>=36&&band.high<=53&&band.low<band.high);
});
test('weekly sleep uses real individual nights and IQR requires three nights',()=>{
 const w=weeklyDistributions([{day:'2026-10-12',sleepMinutes:420},{day:'2026-10-13',sleepMinutes:460},{day:'2026-10-14',sleepMinutes:440},{day:'2026-10-19',sleepMinutes:350}]);
 assert.equal(w.length,2);assert.equal(w[0].median,440);assert.equal(w[0].q1,430);assert.equal(w[0].q3,450);
 assert.equal(w[1].q1,null);
 const svg=sleepDistributionChart(sleep);assert.match(svg,/Interquartilsbereich/);assert.match(svg,/kein 95%-Konfidenzintervall/);
});
test('sleep and HRV are joined by actual night, not independent sort position',()=>{
 const pairs=joinedSleepHrv(sleep,hr.slice(2,8));assert.equal(pairs.length,6);assert.equal(pairs[0].day,'2026-10-03');
 assert.match(sleepHrvScatter(sleep,hr),/Streudiagramm Schlafdauer und HRV/);
 assert.doesNotMatch(sleepHrvScatter(sleep,hr),/Konfidenzintervall/);
 assert.match(sleepHrvScatter(sleep,[]),/mindestens drei Nächte/);
});
test('HRV now uses dynamic trailing band rather than static full-range rectangle or fake baseline',()=>{
 const html=hrvReferenceView(hr);
 assert.match(html,/Rollendes 20.–80. Perzentil/);
 assert.match(html,/mitlaufende/);
 assert.match(html,/95%-KI/);
 assert.doesNotMatch(html,/baselineBand=/);
 assert.match(hrvReferenceView(hr.slice(0,4)),/mindestens 14 Nächte/);
});
test('consolidated Insights retains actual Garmin sleep, Fitdays body and Health Connect activity',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.4\.17\.5'/);
 assert.match(main,/navItem\('insights','Insights · Gesundheit'/);
 assert.doesNotMatch(main,/navItem\('health'/);
 assert.match(main,/if\(bootView==='health'\|\|bootView==='places'\)tab='insights'/);
 assert.match(main,/insightTab=bootView==='places'\?'places':bootView==='health'\?'sources':'sleep'/);
 assert.match(main,/healthSourcesView/);assert.match(main,/healthBodyView/);assert.match(main,/healthConnectActivityView/);
 assert.ok(['sleep','body','sources','activity'].every(id=>INSIGHT_TABS.find(t=>t.id===id)?.state==='live'));
 const model=buildSleepInsights({garminNights:sleep.map(n=>({...n})),garminHrv:hr},'2026-10-18','28','UTC');
 const html=insightsSleepView(model);assert.match(html,/Meine beobachtete HRV-Spanne/);assert.match(html,/Schlaf und HRV zusammen/);
});
test('sources offer actual import control but not a duplicate health analytics chart',()=>{
 const html=healthSourcesView({garminNights:sleep,garminHrv:hr,fitdays:[]});
 assert.match(html,/health-import-input/);assert.match(html,/connect\.garmin\.com/);
 assert.doesNotMatch(html,/health-trend-grid|health-sleep-card/);
 const body=healthBodyView({fitdays:[{day:'2026-10-15',at:'2026-10-15T08:00:00',weightKg:80.5,bodyFatPct:21.2}]},'28');
 assert.match(body,/80,5/);assert.match(body,/21,2/);assert.doesNotMatch(body,/Garmin-HRV|Schlafphasen im Detail/);
});
test('Health Connect steps and exercise remain in the integrated activity pane, with zero distinct from missing',()=>{
 const html=healthConnectActivityView([{day:'2026-10-15',steps:5000,exerciseMinutes:30},{day:'2026-10-16',steps:0,exerciseMinutes:null}],'all');
 assert.match(html,/Schritte/);assert.match(html,/Trainingsminuten/);
 assert.match(html,/2 tatsächlich erfassten Tagen/);assert.match(html,/1 tatsächlich erfassten Tagen/);
});
test('Finance scaffold is informative but has no bank access, upload control, or fictional transactions',()=>{
 assert.equal(FINANCE_PANES.length,9);
 const kraken=FINANCE_EXPORTS.find(x=>x.label==='Kraken');assert.match(kraken.href,/support\.kraken\.com/);
 const flatex=FINANCE_EXPORTS.find(x=>x.label.includes('flatex'));assert.match(flatex.href,/flatex\.at/);
 const html=financePreviewView(()=>'<svg/>');assert.match(html,/noch kein Import/);
 assert.doesNotMatch(html,/<input|type="file"|transaction|apiKey/);
});
