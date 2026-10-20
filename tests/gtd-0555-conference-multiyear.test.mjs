import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {worktimeYearComparison,worktimeYearWeeks,weeklyTrendBand,worktimeYearComparisonView} from '../client/src/worktime-multiyear-v555.js';
import {conferenceEntries,conferenceProjectPlan,conferenceAssessment,setConferenceStatus,newConference} from '../client/src/conference-radar-v555.js';
const DAYS=Array.from({length:3},(_,j)=>Array.from({length:45},(_,i)=>({day:new Date(Date.UTC(2024+j,0,8+i*7)).toISOString().slice(0,10),hours:35+i%5+j*2}))).flat();
const MAIN=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
test('Annual comparison groups documented months by year and excludes incomplete October 2026',()=>{
 const rows=[{day:'2024-01-09',hours:7},{day:'2025-01-09',hours:9},{day:'2026-09-14',hours:5},{day:'2026-10-09',hours:6},{day:'2026-11-01',hours:30}];
 const d=worktimeYearComparison(rows,'2026-10-20');
 assert.equal(d[0].months[0].hours,7);assert.equal(d[1].months[0].hours,9);
 assert.equal(d[2].months[9].hours,6);assert.equal(d[2].months[9].completed,false);
 assert.equal(d[2].months[10].hours,0);
 const html=worktimeYearComparisonView(rows,'2026-10-20','month');
 for(const x of ['2024','2025','2026','Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'])assert.ok(html.includes(x),x);
 assert.match(html,/data-action="worktime-compare-mode" data-id="week"/);
 assert.match(html,/Laufender Monat/);
});
test('Weekly mode plots separate weekly observations per year, uses real ISO weekly dates',()=>{
 const rows=worktimeYearWeeks(DAYS,2025,'2026-10-20');assert.ok(rows.every(r=>r.year===2025));
 assert.ok(rows.some(r=>r.month===2));
 const html=worktimeYearComparisonView(DAYS,'2026-10-20','week');
 assert.match(html,/Jeder Punkt = dokumentierte ISO-Woche/);
 assert.match(html,/95-%-Konfidenzintervall/);
 assert.match(html,/data-id="month"/);
 assert.match(html,/2025-01/);
});
test('Exploratory band uses only completed weeks from >=2 years and disappears for sparse data',()=>{
 assert.equal(weeklyTrendBand(worktimeYearComparison(DAYS.filter(d=>d.day.startsWith('2024')),'2026-10-20')).length,0);
 const series=worktimeYearComparison(DAYS,'2026-10-20');const band=weeklyTrendBand(series);
 assert.ok(band.length>3);assert.ok(band.every(x=>x.lower<=x.mean&&x.mean<=x.upper&&x.n>=8&&x.years>=2));
});
test('Multi-year view is wired into existing Insights and arrow switch, not another main menu',()=>{
 assert.match(MAIN,/worktimeYearComparisonView\(state\?\.workTime\?\.days/);
 assert.match(MAIN,/if\(action==='worktime-compare-mode'\)/);
 assert.match(MAIN,/const tag=id==='projects'&&!disabled\?'a':'button'/);
 assert.match(MAIN,/bootSearch\.get\('view'\)/);
});
test('Conference Radar retains official source, planned projects go through existing exchange and remain local',()=>{
 const rows=conferenceEntries({});assert.ok(rows.length>=2);assert.ok(rows.every(r=>r.source.startsWith('https://')));
 const r=rows[0],plan=conferenceProjectPlan(r);
 assert.ok(plan.projects.length>=1);assert.ok(plan.tasks.length>=5);
 const stored=setConferenceStatus({},r.id,'merken');assert.ok(stored.length===1);assert.equal(conferenceEntries({conferenceRadar:stored}).find(x=>x.id===r.id)?.status,'merken');
 const ass=conferenceAssessment(r,{status:'stale'}, {},'2026-10-20');assert.equal(ass.state,'unknown');
 assert.throws(()=>newConference({title:'Invalid',topics:['Nachhaltigkeit'],region:'Europa',source:'javascript:alert(1)'},'bad'),/Quelle/);
});
