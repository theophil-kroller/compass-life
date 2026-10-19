import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseGarminActivitiesCsv} from '../client/src/garmin-activities-csv.js';
import {sportsPeriodWindow,sportsShiftAnchor,sportsRows,sportsTrendSeries,summarizeSports,sportsInsightsView,normalizedSportDistance} from '../client/src/sports-insights.js';
const csv='Activity Type,Date,Title,Distance,Time,Calories\nOpen Water Swimming,2026-10-17 14:05:02,Lake Open Water Swimming,431,00:24:00,120\nCycling,2026-10-18 14:05:02,City Cycling,14.2,00:55:00,120\nOther,2026-10-18 19:05:02,Graz Dancing,1.11,01:25:00,170\nCycling,2025-10-18 14:05:02,City Cycling,12.2,00:45:00,120\n';
const rows=parseGarminActivitiesCsv(csv);
test('0.5.25 Garmin CSV swimming metres converted to km at import, old vault data read-time repaired',()=>{
 assert.equal(rows[0].distanceKm,.431);assert.equal(rows[0].distanceUnitAssumed,'m-converted');
 assert.equal(rows[1].distanceKm,14.2);
 assert.equal(normalizedSportDistance({...rows[0],distanceKm:431,distanceUnitAssumed:'km'},'swimming'),.431);
 const g=summarizeSports(rows,[],{start:'2026-10-01',end:'2026-10-19'});
 assert.equal(g.find(x=>x.type==='swimming').distanceKm,.431);
});
test('0.5.25 calendar windows are inclusive, anchored and capped to today',()=>{
 assert.deepEqual(sportsPeriodWindow('week','2026-10-19','2026-10-19').start,'2026-10-19');
 assert.equal(sportsPeriodWindow('month','2026-10-05','2026-10-19').end,'2026-10-19');
 assert.equal(sportsPeriodWindow('quarter','2026-08-07','2026-10-19').label,'Q3 2026');
 assert.equal(sportsPeriodWindow('year','2025-08-07','2026-10-19').end,'2025-12-31');
 assert.equal(sportsPeriodWindow('rolling12','2026-10-19','2026-10-19').start,'2025-11-01');
 assert.equal(sportsShiftAnchor('month','2026-10-19',1,'2026-10-19'),'2026-10-19');
 assert.equal(sportsShiftAnchor('month','2026-10-19',-1,'2026-10-19'),'2026-09-19');
});
test('0.5.25 sport tiles show the correct period, metric and trends without calendar assumptions',()=>{
 const period=sportsPeriodWindow('month','2026-10-18','2026-10-19');
 const filtered=sportsRows(rows,[],period);assert.equal(filtered.length,3);
 const chart=sportsTrendSeries(filtered,'month','time');assert.equal(chart.length,1);
 const html=sportsInsightsView(rows,[],period,{mode:'month',anchor:'2026-10-18',today:'2026-10-19',label:period.label,metric:'time',selected:'cycling'});
 for(const keyword of ['sports-card-grid','sports-trend-chart','sports-type-card','sports-period-tab','sports-metric-tab','data-action="sports-shift"','data-action="sports-select"','Radfahren'])assert.match(html,new RegExp(keyword));
 assert.doesNotMatch(html,/2025-10-18/);
});
test('0.5.25 menu handlers wired on both Activity and Insights without touching backend',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const phrase of ["if(action==='sports-mode')","if(action==='sports-shift')","if(action==='sports-metric')","if(action==='sports-select')",'sportsPeriodWindow(sportsMode'])assert.ok(main.includes(phrase));
});
