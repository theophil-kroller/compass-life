import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildWellnessInsights,insightsStressView} from '../client/src/insights-wellness.js';
import {buildStressPatterns,stressPatternsView,stressPatternType} from '../client/src/stress-patterns-v5779.js';
const dates=['2026-10-16','2026-10-17','2026-10-18'];
const iso=(date,hhmm)=>new Date(`${date}T${hhmm}:00`).toISOString();
const event=(day,id,title,start='10:00',end='10:30')=>({id,summary:title,start:{dateTime:iso(day,start)},end:{dateTime:iso(day,end)}});
const sample=(day,clock,stress)=>({at:iso(day,clock),stress,bodyBattery:65});
const context={calendarCoverage:{start:'2026-10-01',end:'2026-10-31',complete:true}};
const getModel=(points)=>buildWellnessInsights({garminWellness:points},'2026-10-20','28');
const meetings=dates.map((day,i)=>event(day,'m'+i,'Jour fixe Forschung'));
const paired=dates.flatMap(day=>[['09:35',30],['09:40',20],['10:05',85],['10:10',95],['10:40',35],['10:45',40]].map(([t,v])=>sample(day,t,v)));

test('three independent meeting days show matched before/during/after, with per-event weighting',()=>{
 const r=buildStressPatterns({model:getModel(paired),calendarEvents:meetings,...context});
 const m=r.groups.find(g=>g.label==='Meetings & Besprechungen');
 assert.ok(m,'Meeting must be classified even when calendar category is Neutral');
 assert.equal(m.events,3);assert.equal(m.duringN,3);assert.equal(m.completeN,3);assert.equal(m.beforeAfterN,3);
 assert.equal(m.avgDuring,90);assert.equal(m.highDuring,100);assert.equal(m.pairedBefore,25);assert.equal(m.pairedAfter,37.5);
 assert.equal(m.delta,12.5);assert.equal(m.trendReady,true);
 assert.equal(m.days,3);
 const html=stressPatternsView(r);
 assert.match(html,/Meetings &amp; Besprechungen/);assert.match(html,/30 Minuten vor/);assert.match(html,/60 Minuten nach/);
 assert.match(html,/12,5 Punkte/);assert.match(html,/Wiederholt beobachtet/);
});

test('Garmin stress suppressed during sport is missing, but before/after matching survives',()=>{
 const points=dates.flatMap(day=>[['17:35',65],['17:40',75],['18:35',40],['18:40',35]].map(([t,v])=>sample(day,t,v)));
 const activities=dates.map((day,i)=>({id:'bike'+i,startedAt:day+'T18:00',durationMinutes:30,title:'MTB Training',category:'Erholung'}));
 const r=buildStressPatterns({model:getModel(points),activities,...context});
 const a=r.groups.find(g=>g.label==='Sport & Bewegung');
 assert.ok(a);assert.equal(a.events,3);assert.equal(a.duringN,0);assert.equal(a.avgDuring,null);
 assert.equal(a.highDuring,null);assert.equal(a.beforeAfterN,3);assert.equal(a.delta,-32.5);
 assert.equal(a.trendReady,true);
 const view=stressPatternsView(r);assert.match(view,/MTB Training/);assert.match(view,/keine Ursachenanalyse/i);assert.doesNotMatch(view,/NaN|undefined/);
});

test('one event or same-day-only events are not presented as repeated personal pattern',()=>{
 const r=buildStressPatterns({model:getModel(paired),calendarEvents:[meetings[0]],...context});
 const m=r.groups.find(g=>g.label==='Meetings & Besprechungen');
 assert.equal(m.beforeAfterN,1);assert.equal(m.trendReady,false);
 assert.match(stressPatternsView(r),/mindestens 3 Ereignisse an 2 verschiedenen Tagen/);
});

test('unknown and invalid sensor readings stay missing; identical timestamps do not count twice',()=>{
 const r=buildStressPatterns({model:getModel([sample(dates[0],'09:35',null),sample(dates[0],'09:40',-1),sample(dates[0],'10:05',85),sample(dates[0],'10:05',85)]),calendarEvents:[meetings[0]],...context});
 assert.equal(r.points,1);assert.equal(r.groups.length,0);assert.equal(r.unmeasured,1);
 assert.match(stressPatternsView(r),/Noch keine zeitlich verknüpfbaren Einträge/);
});

test('calendar gaps cannot be interpreted as an absence of stress or appointments',()=>{
 const r=buildStressPatterns({model:getModel(paired),calendarEvents:meetings,calendarCoverage:{start:'2026-10-19',end:'2026-10-20',complete:true}});
 assert.equal(r.groups.length,0);assert.equal(r.excludedCalendar,3);
 assert.match(stressPatternsView(r),/außerhalb des vollständig synchronisierten Zeitraums/);
});

test('categories distinguish research, teaching, leisure, sauna, social, and calendar meetings',()=>{
 const examples=[
  [{title:'Paper schreiben',category:'Arbeit'},'calendar','Forschung & Schreiben'],
  [{title:'Allgemeine Management Übung',category:'Neutral'},'calendar','Lehre & Unterricht'],
  [{title:'Sauna Graz',category:'Erholung'},'calendar','Sauna & Therme'],
  [{title:'Zouk Social',category:'Erholung'},'calendar','Tanzen'],
  [{title:'Abend mit Freunden',category:'Soziales'},'calendar','Soziale Kontakte'],
  [{title:'Paper lesen',category:'Arbeit'},'activity','Forschung & Schreiben'],
  [{title:'Arbeitszeit',category:'Arbeit'},'activity','Arbeitssessions']
 ];
 for(const [e,source,expected] of examples)assert.equal(stressPatternType(e,source)[1],expected,e.title);
});

test('HTML content escaped and full Stress page includes personal pattern analysis without server changes',()=>{
 const e=event(dates[0],'x','Besprechung <script>alert(1)</script>');
 const r=buildStressPatterns({model:getModel(paired),calendarEvents:[e],...context});
 const html=stressPatternsView(r);
 assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);
 const view=insightsStressView({garminWellness:paired},'28','2026-10-20','','day',14,0,{calendarEvents:meetings,...context});
 assert.match(view,/Was fällt bei meinen Aktivitäten wiederholt auf/);
 assert.match(view,/30 Minuten vor/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.(?:9|10)'/);
 assert.match(main,/insightTab==='stress'\?insightsStressView/);
});
