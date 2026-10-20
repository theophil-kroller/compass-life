import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INSIGHT_TABS,insightsRange,sleepMinutes,nightClock,buildSleepInsights,insightsLineChart,sleepConsistencyChart,weeklySleepGroups,insightsSleepView,insightsPlannedView} from '../client/src/insights.js';
const fixture={
 garminNights:[
  {day:'2026-10-15',start:'2026-10-14T21:30:00Z',end:'2026-10-15T05:30:00Z',stages:[{stage:3,start:'2026-10-14T22:00:00Z',end:'2026-10-14T23:00:00Z'}],totals:{deep:80,light:220,rem:100,awake:15}},
  {day:'2026-10-16',start:'2026-10-15T23:50:00Z',end:'2026-10-16T06:00:00Z',stages:[],totals:{deep:60,light:230,rem:65,awake:15}},
  {day:'2026-09-18',start:null,end:null,stages:[],totals:{deep:70,light:210,rem:90,awake:30}}
 ],
 garminHrv:[
  {day:'2026-10-15',nightAverageMs:48,weeklyAverageMs:50},
  {day:'2026-10-16',nightAverageMs:45,weeklyAverageMs:null},
  {day:'2026-09-18',nightAverageMs:41,weeklyAverageMs:42}
 ],
 fitdays:[{day:'2026-09-25',at:'2026-09-25T06:56:00',weightKg:86.9}]
};
test('nine icon tabs include sleep, body and data sources as active',()=>{
 assert.deepEqual(INSIGHT_TABS.map(x=>x.id),['sleep','energy','stress','activity','worktime','focus','body','places','explore','sources']);
 assert.equal(INSIGHT_TABS.filter(x=>x.state==='live').length,10);
});
test('sleep minutes exclude awake time, missing data are null, invalid zero is not fabricated',()=>{
 assert.equal(sleepMinutes(fixture.garminNights[0]),400);
 assert.equal(sleepMinutes({totals:{deep:0,light:0,rem:0,awake:20}}),null);
 assert.equal(sleepMinutes({totals:{}}),null);
});
test('clock wraps midnight on a nightly axis and allows a time-zone argument',()=>{
 assert.equal(nightClock('2026-10-15T23:55:00Z','bed','UTC'),1435);
 assert.equal(nightClock('2026-10-16T00:05:00Z','bed','UTC'),1445);
 assert.equal(nightClock('2026-10-16T06:15:00Z','wake','UTC'),1815);
 assert.equal(nightClock(null),null);
});
test('lookback filters each data stream by actual date and provides only observed averages',()=>{
 const m=buildSleepInsights(fixture,'2026-10-18','7','UTC');
 assert.deepEqual(m.nights.map(x=>x.day),['2026-10-15','2026-10-16']);
 assert.equal(m.meanSleepMinutes,377.5);
 assert.equal(m.meanHrv,46.5);
 assert.equal(m.totalHrvDays,2);
 assert.equal(m.timeZone,'UTC');
 assert.equal(insightsRange('2026-10-18','28').start,'2026-09-21');
 assert.equal(insightsRange('2026-10-18','all').start,null);
});
test('with no data metrics stay unknown; no sleep-need, status, or made-up confidence interval',()=>{
 const m=buildSleepInsights({},'2026-10-18','28','UTC');
 assert.equal(m.meanSleepMinutes,null);assert.equal(m.meanHrv,null);
 const html=insightsSleepView(m,'',()=>'<svg></svg>');
 assert.match(html,/Noch keine/);assert.match(html,/Garmin-Sleep-Need-Wert/);
 assert.doesNotMatch(html,/Balanced|Unbalanced|<polygon\b/);
});
test('SVG graphs preserve missing days instead of connecting a single trend across the gap',()=>{
 const svg=insightsLineChart([{day:'2026-10-10',v:40},{day:'2026-10-15',v:43}], [{key:'v',label:'HRV',color:'#8065A9'}],'Nächtliche HRV',{range:insightsRange('2026-10-18','28')});
 assert.match(svg,/role="img"/);assert.match(svg,/Messpunkte/);
 assert.doesNotMatch(svg,/<polyline\b/);
 const adjacent=insightsLineChart([{day:'2026-10-10',v:40},{day:'2026-10-11',v:43}],[{key:'v',label:'HRV',color:'#8065A9'}],'HRV',{range:insightsRange('2026-10-18','28')});
 assert.match(adjacent,/<polyline\b/);
});
test('consistency plot and weekly aggregates follow actual nights and sample counts',()=>{
 const m=buildSleepInsights(fixture,'2026-10-18','28','UTC');
 const svg=sleepConsistencyChart(m.nights,m.range);
 assert.match(svg,/Einschlaf- und Aufwachzeiten/);
 assert.match(svg,/Einschlafen/);assert.match(svg,/Aufwachen/);
 const grouped=weeklySleepGroups(m.nights);
 assert.equal(grouped.reduce((n,x)=>n+x.count,0),2);
 assert.ok(grouped.every(w=>w.mean>0));
});
test('planned panes remain clearly nonfunctional and now open consolidated sources',()=>{
 assert.match(insightsPlannedView('explore',fixture,[],[]),/IN VORBEREITUNG/);
 assert.match(insightsPlannedView('explore',fixture,[],[]),/Explore|statistisch|Daten/);
 assert.match(insightsPlannedView('explore',fixture,[],[]),/Datenquellen öffnen/);
});
test('navigation and 0.5.8 actions are wired into actual client, without cloud migration',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.54'/);
 assert.match(main,/data-action=\"calm-insight-view\"/);assert.match(main,/calm-nav-group/);
 assert.match(main,/insightTab==='sleep'\?insightsSleepView/);
 assert.match(main,/action==='insights-period'/);
 assert.match(main,/action==='insights-tab'/);
 assert.match(main,/insights-night-day/);
 assert.match(main,/healthSourcesView/);assert.doesNotMatch(main,/navItem\('health'/);
});
test('health import gives direct Garmin export access and an inline Fitdays walkthrough',()=>{
 const source=readFileSync(new URL('../client/src/health-dashboard.js',import.meta.url),'utf8');
 assert.match(source,/connect\.garmin\.com\/app\/settings\/accountInformation/);
 assert.match(source,/Fitdays-Export: Wo finde ich ihn\?/);
 assert.match(source,/target="_blank" rel="noopener noreferrer"/);
});
