import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {previousLocalDay,yesterdayIntentions} from '../client/src/yesterday-intentions-v57710.js';
import {buildStressDayTimeline,stressDayTimelineView} from '../client/src/stress-day-timeline-v57710.js';
import {buildStressContext} from '../client/src/stress-context-v5778.js';
import {buildStressPatterns} from '../client/src/stress-patterns-v5779.js';
const task=(id,plannedDate,other={})=>({id,title:id,category:'Allgemein',workflow:'next',completed:false,archived:false,projectId:null,plannedDate,...other});
test('yesterday intention survives only next morning and does not become a due date',()=>{
 const state={tasks:{a:task('a','2026-10-22'),b:task('b','2026-10-21'),c:task('c','2026-10-22',{completed:true}),d:task('d','2026-10-22',{workflow:'hold'}),e:task('e','2026-10-23')}};
 assert.equal(previousLocalDay('2026-10-23'),'2026-10-22');
 assert.deepEqual(yesterdayIntentions(state,'2026-10-23').map(x=>x.task.id),['a','d']);
 assert.equal(yesterdayIntentions(state,'2026-10-23').find(x=>x.task.id==='a').canPlan,true);
 assert.equal(yesterdayIntentions(state,'2026-10-23').find(x=>x.task.id==='d').canPlan,false);
 assert.ok(!yesterdayIntentions(state,'2026-10-24').some(x=>x.task.id==='a'));
 assert.equal(state.tasks.a.plannedDate,'2026-10-22');assert.equal(state.tasks.a.dueDate,undefined);
 assert.equal(previousLocalDay('2027-01-01'),'2026-12-31');
});
test('uncompleted recorded day plan also appears, then expires without rewriting task',()=>{
 const start=new Date('2026-10-22T09:00:00Z').getTime();
 const state={tasks:{a:task('a',null)},uiPreferences:{dailyPlanBlocks:[{id:'block',day:'2026-10-22',taskId:'a',start,end:start+60*60000,minutes:60,done:false}]}};
 assert.deepEqual(yesterdayIntentions(state,'2026-10-23').map(x=>x.task.id),['a']);
 assert.equal(yesterdayIntentions(state,'2026-10-24').length,0);
 state.uiPreferences.dailyPlanBlocks[0].done=true;
 assert.equal(yesterdayIntentions(state,'2026-10-23').length,0);
});
const day='2026-10-22';
const entries=[{id:'a',summary:'Work',start:{dateTime:'2026-10-22T08:00:00+02:00'},end:{dateTime:'2026-10-22T16:00:00+02:00'}},
 {id:'b',summary:'Lehrveranstaltung Entrepreneurship',start:{dateTime:'2026-10-22T10:00:00+02:00'},end:{dateTime:'2026-10-22T11:00:00+02:00'}}];
const points=[{at:'2026-10-22T08:00:00Z',stress:88},{at:'2026-10-22T08:05:00Z',stress:83},{at:'2026-10-22T08:10:00Z',stress:40},{at:'2026-10-22T17:00:00Z',stress:80}];
const sources={daySummary:{day,points},calendarEvents:entries,activities:[],garminSessions:[],timeRows:[{title:'Fußball eins gegen eins mit Sohn',category:'family',start:'2026-10-22T18:00:00+02:00',end:'2026-10-22T19:00:00+02:00'},{title:'Work',start:'2026-10-22T12:00:00+02:00',end:'2026-10-22T15:00:00+02:00'}],calendarCoverage:{start:day,end:day,complete:true}};
test('daily timeline shows specific classes and family activity while Work is only muted background',()=>{
 const model=buildStressDayTimeline(sources);
 assert.equal(model.appointments.length,2);assert.equal(model.appointments.filter(x=>x.generic).length,1);
 assert.equal(model.calendarTotal,1);assert.equal(model.sessions.length,1);
 const html=stressDayTimelineView(model);
 assert.match(html,/Lehrveranstaltung Entrepreneurship/);assert.match(html,/Fußball eins gegen eins mit Sohn/);assert.match(html,/Arbeitsblock · ohne konkrete Tätigkeit/);
 assert.match(html,/Stress im Tagesablauf|STRESS IM TAGESABLAUF/);assert.match(html,/Kalender · geplant, Teilnahme nicht bestätigt/);
 assert.match(html,/Früh · 06–12 Uhr/);assert.match(html,/Abend · 18–24 Uhr/);
 assert.doesNotMatch(html,/NaN|undefined/);
});
test('generic Work does not become a named stress context finding or pattern; no calendar history is disclosed as unknown',()=>{
 const model={stressDays:[{day,points}]};
 const context=buildStressContext({model,calendarEvents:entries,calendarCoverage:sources.calendarCoverage});
 const high=context.recentPeaks;
 assert.ok(high.some(x=>x.calendar.some(y=>y.title==='Lehrveranstaltung Entrepreneurship')));
 assert.ok(!high.some(x=>x.calendar.some(y=>y.title==='Work')));
 const groups=buildStressPatterns({model,calendarEvents:entries,calendarCoverage:sources.calendarCoverage});
 assert.ok(!groups.groups.some(x=>x.recent?.some(y=>y.title==='Work')));
 const unknown=buildStressDayTimeline({...sources,calendarCoverage:null});
 assert.match(stressDayTimelineView(unknown),/nicht vollständig bestätigt/);
});
test('screen wiring places yesterday panel in today, history hint only in next actions and timeline on stress page',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const view=readFileSync(new URL('../client/src/insights-wellness.js',import.meta.url),'utf8');
 assert.match(main,/yesterday710Panel\(selectedDay\)/);
 assert.match(main,/nextScope&&yesterdayIds\.has\(t\.id\)/);
 assert.match(main,/action==='yesterday710-plan-today'/);
 assert.match(main,/timeRows:timeEntries\(state\)/);
 assert.match(view,/stressDayTimelineView\(timeline\)/);
});
