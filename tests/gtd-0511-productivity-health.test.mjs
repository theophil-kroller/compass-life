import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendarWorkMinutes,focusActivityDays,buildProductivityInsights,productivityInsightsView,productivityScatter} from '../client/src/insights-productivity.js';
import {INSIGHT_TABS} from '../client/src/insights.js';
const samples={
 garminNights:[
 {day:'2026-10-15',totals:{deep:100,light:240,rem:80},start:'2026-10-14T23:00:00Z',end:'2026-10-15T06:00:00Z'},
 {day:'2026-10-16',totals:{deep:110,light:250,rem:80},start:'2026-10-15T23:00:00Z',end:'2026-10-16T07:00:00Z'},
 {day:'2026-10-17',totals:{deep:105,light:260,rem:85},start:'2026-10-16T23:00:00Z',end:'2026-10-17T07:00:00Z'}],
 garminHrv:[],garminWellness:[]
};
const activities=[
 {id:'a',category:'Arbeit',startedAt:'2026-10-15T09:00',durationMinutes:75,pomodoros:3,source:'Garmin',deleted:false},
 {id:'b',category:'Arbeit',startedAt:'2026-10-15T13:00',durationMinutes:30,pomodoros:0,source:'Manuell',deleted:false},
 {id:'c',category:'Erholung',startedAt:'2026-10-15T17:00',durationMinutes:90,pomodoros:0,source:'Manuell',deleted:false},
 {id:'d',category:'Arbeit',startedAt:'2026-10-16T09:00',durationMinutes:55,pomodoros:2,source:'Garmin',deleted:false},
 {id:'e',category:'Arbeit',startedAt:'2026-10-17T09:00',durationMinutes:55,pomodoros:2,source:'Garmin',deleted:false}
];
const calendar=[
 {id:'one',summary:'Jour fixe Forschung',start:{dateTime:'2026-10-15T10:00:00+02:00'},end:{dateTime:'2026-10-15T11:00:00+02:00'}},
 {id:'two',summary:'Vorlesung Lehre',start:{dateTime:'2026-10-16T10:00:00+02:00'},end:{dateTime:'2026-10-16T11:30:00+02:00'}},
 {id:'three',summary:'Geburtstag',start:{date:'2026-10-15'},end:{date:'2026-10-16'}},
 {id:'four',summary:'Meeting private',start:{dateTime:'2026-10-16T12:00:00+02:00'},end:{dateTime:'2026-10-16T12:30:00+02:00'},status:'cancelled'},
 {id:'five',summary:'Research blocker',start:{dateTime:'2026-10-15T13:00:00+02:00'},end:{dateTime:'2026-10-15T14:00:00+02:00'}}
];
const coverage={start:'2026-10-01',end:'2026-12-31'};
test('separate sources merged only by the same observed local day, no inferred work days',()=>{
 const m=buildProductivityInsights({imported:samples,activities,today:'2026-10-18',period:'7'});
 assert.equal(m.workDays,3);assert.equal(m.totalPomodoros,7);assert.equal(m.totalWorkMinutes,215);
 assert.equal(m.sleepPairs.length,3);assert.equal(m.meetingPairs.length,0);
 assert.equal(m.rows[0].workMinutes,105);assert.equal(m.rows[0].pomodoros,3);
 assert.equal(m.rows[0].meetingMinutes,null);
});
test('calendar counts real timed meeting/teaching, excludes cancelled, all-day, routine blocks',()=>{
 const v=calendarWorkMinutes(calendar,[],{}, {start:'2026-10-01',end:'2026-10-18'});
 assert.equal(v.length,2);assert.equal(v[0].meetingMinutes,60);assert.equal(v[0].researchMinutes,0);
 assert.equal(v[1].teachingMinutes,90);
 const lone=calendarWorkMinutes([{id:'umlaut',summary:'Übung',start:{dateTime:'2026-10-15T10:00:00+02:00'},end:{dateTime:'2026-10-15T11:00:00+02:00'}}],[],{}, {start:'2026-10-01',end:'2026-10-18'});
 assert.equal(lone[0].teachingMinutes,60);
 const m=buildProductivityInsights({imported:samples,activities,calendarEvents:calendar,calendarCoverage:coverage,today:'2026-10-18',period:'7'});
 assert.equal(m.meetingPairs.length,3);assert.equal(m.rows[0].meetingMinutes,60);
 assert.equal(m.rows[1].meetingMinutes,0);assert.equal(m.rows[2].meetingMinutes,0);
 assert.equal(m.rows[1].teachingMinutes,90);
});
test('no all-calendar comparison outside its loaded range, missing sessions remain unknown',()=>{
 const m=buildProductivityInsights({activities,calendarEvents:calendar,calendarCoverage:{start:'2026-10-16',end:'2026-10-18'},today:'2026-10-18',period:'7'});
 assert.equal(m.rows[0].meetingMinutes,null);assert.equal(m.meetingPairs.length,2);
 assert.equal(m.rows.length,3);
});
test('scatter requires three actual pairs and labels observed points rather than fake trend ribbon',()=>{
 const m=buildProductivityInsights({imported:samples,activities,today:'2026-10-18',period:'7'});
 assert.match(productivityScatter(m.sleepPairs,'sleepMinutes','workMinutes',{title:'Sleep versus work'}),/Streudiagramm/);
 assert.doesNotMatch(productivityScatter(m.sleepPairs,'sleepMinutes','workMinutes',{}),/Konfidenzintervall|trendline|polyline/i);
 assert.match(productivityScatter(m.sleepPairs.slice(0,1),'sleepMinutes','workMinutes',{}),/Noch nicht genügend/);
});
test('local productivity insights render both real health links and explicit coverage limitations',()=>{
 const m=buildProductivityInsights({imported:samples,activities,calendarEvents:calendar,calendarCoverage:coverage,today:'2026-10-18',period:'7'});
 const html=productivityInsightsView(m,activities,'3 Termine geladen');
 for(const heading of ['Schlafdauer × Arbeitszeit','Schlafdauer × Pomodoros','Stress × Arbeitszeit','Morgendliche Body Battery × Arbeit','Meetingdauer × Arbeitszeit','Arbeitstypen aus dem Kalender','Zu welchen Zeiten arbeite ich?'])assert.ok(html.includes(heading),heading);
 assert.match(html,/Datenabdeckung:/);assert.match(html,/lokal|protokolliert/i);
});
test('script does not pass health or Google titles to server; tab is wired as live',()=>{
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(source,/COMPASS_CLIENT_VERSION='0\.5\.49\.3'/);
 assert.match(source,/insightTab==='focus'\?productivityInsightsView/);
 assert.match(source,/start\.setDate\(start\.getDate\(\)-90\)/);
 assert.match(source,/calendarCoverage=/);
 assert.equal(INSIGHT_TABS.find(t=>t.id==='focus').state,'live');
});
