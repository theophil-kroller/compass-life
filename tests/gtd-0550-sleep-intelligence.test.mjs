import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sleepHM,compareSleepWindows,sleepMonthSummaries,sleepPersonalReference,sleepCoverageWeek,sleepStageCurve,renderSleepIntelligence} from '../client/src/sleep-intelligence-v550.js';
import {buildSleepInsights,insightsSleepView} from '../client/src/insights.js';
const add=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+86400000*n).toISOString().slice(0,10);
const night=(day,minutes=420)=>({day,start:new Date(Date.parse(day+'T06:00:00Z')-minutes*60000).toISOString(),end:day+'T06:00:00Z',totals:{deep:90,rem:90,light:minutes-180,awake:15},stages:[{stage:3,start:day+'T02:00:00Z',end:day+'T03:00:00Z'}],sleepMinutes:minutes});
test('duration is always human h:min and missing values do not turn into zero',()=>{
 assert.equal(sleepHM(420),'7 h 00 min');assert.equal(sleepHM(401.5),'6 h 42 min');assert.equal(sleepHM(null),'–');assert.equal(sleepHM(-3),'–');
});
test('current partial work week compares exactly matching previous weekdays, not full previous week',()=>{
 const rows=[];for(let i=0;i<14;i++)rows.push(night(add('2026-10-05',i),i<7?420:360));
 const v=compareSleepWindows(rows,'2026-10-14','week');
 assert.equal(v.start,'2026-10-12');assert.equal(v.end,'2026-10-14');assert.equal(v.previousStart,'2026-10-05');assert.equal(v.previousEnd,'2026-10-07');
 assert.equal(v.current.length,3);assert.equal(v.previous.length,3);assert.equal(v.delta,-60);
});
test('calendar month comparisons match only elapsed month days and handle February safely',()=>{
 const days=[...Array.from({length:27},(_,i)=>night(add('2026-02-01',i),450)),...Array.from({length:5},(_,i)=>night(add('2026-03-01',i),390))];
 const v=compareSleepWindows(days,'2026-03-05','month');
 assert.equal(v.previousEnd,'2026-02-05');assert.equal(v.previous.length,5);assert.equal(v.current.length,5);assert.equal(v.delta,-60);
 const b=compareSleepWindows(days,'2026-03-31','month');assert.equal(b.previousEnd,'2026-02-28');
});
test('comparisons do not infer trend from isolated nights',()=>{
 const v=compareSleepWindows([night('2026-10-19',360),night('2026-10-12',480)],'2026-10-19','week');
 assert.equal(v.delta,null);assert.equal(v.comparable,false);
});
test('annual months include empty months as unknown, not 0 hours; May to October window',()=>{
 const months=sleepMonthSummaries([night('2026-05-07',450),night('2026-08-13',380),night('2026-10-19',420)],'2026-10-20');
 assert.equal(months.length,12);assert.equal(months.at(-1).month,'2026-10');
 assert.equal(months.find(x=>x.month==='2026-06').mean,null);assert.equal(months.find(x=>x.month==='2026-05').count,1);
 assert.equal(months.at(-1).days,20);
});
test('personal observed range only uses historical nights and needs at least 14',()=>{
 let rows=[night('2026-10-19',170),night('2026-10-18',440)];
 assert.equal(sleepPersonalReference(rows,'2026-10-19').status,'unknown');
 rows=[night('2026-10-19',200),...Array.from({length:30},(_,i)=>night(add('2026-09-15',i),410+i%4*20))];
 const ref=sleepPersonalReference(rows,'2026-10-19');assert.equal(ref.status,'below');assert.equal(ref.count,30);
});
test('week slots retain missing days, avoiding fabricated nights',()=>{
 const rows=sleepCoverageWeek([night('2026-10-19',420)],'2026-10-20');assert.equal(rows.length,7);assert.equal(rows.filter(r=>r.night).length,1);
});
test('responsive weekly click target, right hand detail, phase timeline, h:min and annual view are rendered',()=>{
 const rows=[night('2026-05-12',420),night('2026-10-18',390),night('2026-10-19',435)];
 const html=renderSleepIntelligence({nights:rows,today:'2026-10-20',selectedNight:'2026-10-18',period:'365',sleepTimeline:()=>'<svg id="garmin-phases"></svg>'});
 for(const p of ['Schlaf im Überblick','Letzte 7 Tage','Schlaf über zwölf Monate','365-Tage-Kalender','data-action="insights-night-day"','2026-10-18','6 h 30 min','Schlafphasen im Tagesverlauf','keine medizinische'])assert.ok(html.includes(p),p);
 assert.match(html,/Keine Messung/);assert.doesNotMatch(html,/NaN|Infinity/);
 assert.equal((html.match(/sleep550-year-month/g)||[]).length>=12,true);
});
test('Garmin daily detail has night efficiency only if plausible, never invents sleep data',()=>{
 const html=renderSleepIntelligence({nights:[night('2026-10-19',420)],today:'2026-10-20',period:'7',sleepTimeline:()=>'<svg></svg>'});
 assert.match(html,/Schlafphasen-Verteilung/);assert.match(html,/Schlafeffizienz\*/);assert.match(html,/Letzte 7 Tage/);
 assert.doesNotMatch(html,/Schlaf über zwölf Monate/);
 const none=renderSleepIntelligence({nights:[],today:'2026-10-20',period:'365'});
 assert.match(none,/Noch keine Schlafmessungen/);assert.doesNotMatch(none,/NaN|Infinity/);
});
test('integrates into insights model without deleting HRV, advanced sleep stats or requiring cloud migrations',()=>{
 const data={garminNights:[night('2026-05-05',440),night('2026-10-19',450)]};
 const m=buildSleepInsights(data,'2026-10-20','28','Europe/Vienna');
 assert.equal(m.nights.length,1);assert.equal(m.allNights.length,2);
 const html=insightsSleepView(m,'',()=>'', '2026-10-20');
 assert.match(html,/Weitere Analysen/);assert.match(html,/Meine beobachtete HRV-Spanne/);assert.match(html,/Garmin-Sleep-Need-Wert/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.51'/);
});

test('stage curve connects real adjacent stages, excludes unknown blocks, and labels local time',()=>{
 const day=night('2026-10-19',420);
 day.stages=[{stage:3,start:'2026-10-19T00:00:00Z',end:'2026-10-19T01:00:00Z'},
  {stage:2,start:'2026-10-19T01:00:00Z',end:'2026-10-19T02:00:00Z'},
  {stage:4,start:'2026-10-19T03:00:00Z',end:'2026-10-19T04:00:00Z'}];
 const html=sleepStageCurve(day,'UTC');assert.match(html,/Schlafphasen im Tagesverlauf/);
 assert.match(html,/Tief/);assert.match(html,/REM/);assert.match(html,/Leicht/);assert.ok((html.match(/<path /g)||[]).length>=3);
 assert.match(sleepStageCurve({stages:[]}),/Keine detaillierten/);
});
