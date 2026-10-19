import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import * as people from '../client/src/people-occasions.js';
import * as perspectives from '../client/src/context-perspectives.js';
import * as tasks from '../client/src/tasks.js';
import * as life from '../client/src/life-intelligence-v22.js';
import * as gtd23 from '../client/src/gtd-intelligence-v23.js';
import * as personLinks from '../client/src/person-links.js';
import * as discoveryFilter from '../client/src/discovery-category-filter.js';
import * as review from '../client/src/guided-review.js';
import * as tags from '../client/src/smart-tags.js';
import * as personMatching from '../client/src/people-matching.js';
import * as calendar from '../client/src/calendar-rules.js';
import * as occasions from '../client/src/occasion-planning.js';
import * as activities from '../client/src/activity-management.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const styles=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const compiled=main.replace(/^import .*;\r?\n/gm,'').replace('registerSW({immediate:true});','').split("document.addEventListener('keydown'")[0]+`
 globalThis.testUI=(current,mode,events=[])=>{state=current;tab=mode;calendarEvents=events;render();return app.innerHTML;};
 globalThis.testAction=(action,id,stepId)=>runAction(action,id,stepId);
 globalThis.getState=()=>state;
`;
function setup(){
 const app={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
 const document={getElementById:()=>app,querySelector:()=>null,addEventListener:()=>{},visibilityState:'visible'};
 const ctx={document,window:{addEventListener:()=>{}},location:{search:''},history:{replaceState:()=>{}},navigator:{onLine:false},URLSearchParams,URL,Date,Intl,crypto:webcrypto,structuredClone,console,fetch:()=>Promise.reject(Error('offline')),setTimeout,clearTimeout};
 Object.assign(ctx,gtd23,life,tasks,calendar,occasions,activities,people,perspectives,review,tags,personMatching,personLinks,discoveryFilter);
 ctx.vault={save:async()=>{},lock:()=>{}};
 runInNewContext(compiled,ctx,{filename:'browser-ui-smoke.js',timeout:2000});
 return ctx;
}
const base=()=>tasks.prepareTasks({format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
test('Birthday validation respects optional year, leap years, incomplete dates and impossible birthdays',()=>{
 for(const [md,year] of [['',null],['02-29',null],['02-29',2000],['12-31',1983],['10-18',null]])assert.equal(people.validPersonBirthday(md,year),true,md);
 for(const [md,year] of [['',1980],['02-29',2001],['02-30',null],['13-02',null],['00-10',null],['03-00',null],['01-21',1820],['01-21',3000]])assert.equal(people.validPersonBirthday(md,year),false,md);
});
test('Local contact birthdays repeat each year and cross year boundaries correctly',()=>{
 const book={a:{id:'a',name:'Alex Example',birthdayMonthDay:'01-05',birthdayYear:null},b:{id:'b',name:'No date',birthdayMonthDay:''}};
 const list=people.personalBirthdays(book,'2026-12-01',70);
 assert.equal(list.length,1);assert.equal(list[0].date,'2027-01-05');assert.equal(list[0].source,'people');
});
test('Leap birthdays are observed on February 28 in non-leap years and Feb 29 in leap years',()=>{
 const book={a:{id:'a',name:'Leap',birthdayMonthDay:'02-29',birthdayYear:2000}};
 assert.equal(people.personalBirthdays(book,'2027-01-01',70)[0].date,'2027-02-28');
 assert.equal(people.personalBirthdays(book,'2028-01-01',70)[0].date,'2028-02-29');
});
test('Matching calendar birthday and unique person birthday are shown once',()=>{
 const d='2026-11-14';const book={a:{id:'a',name:'Ilona Example',birthdayMonthDay:'11-14'}};
 const events=[{id:'evt1',eventType:'birthday',summary:'Geburtstag von Ilona',start:{date:d}}];
 const list=people.occasionsWithPeople(events,e=>calendar.classifyCalendarEvent(e),book,'2026-10-01',70);
 assert.equal(list.filter(x=>x.kind==='birthday').length,1);assert.equal(list.find(x=>x.kind==='birthday').source,'people');
});
test('Ambiguous first names are not merged; exact full-name and same dates are merged',()=>{
 const book={a:{id:'a',name:'Anna Meyer',birthdayMonthDay:'11-14'},b:{id:'b',name:'Anna Schulz',birthdayMonthDay:'11-14'}};
 const list=people.occasionsWithPeople([{id:'evt',eventType:'birthday',summary:'Anna Geburtstag',start:{date:'2026-11-14'}}],()=>({}),book,'2026-10-01',70);
 assert.equal(list.filter(x=>x.kind==='birthday').length,3);
 const exact=people.occasionsWithPeople([{id:'evt',eventType:'birthday',summary:'Anna Meyer Geburtstag',start:{date:'2026-11-14'}}],()=>({}),book,'2026-10-01',70);
 assert.equal(exact.filter(x=>x.kind==='birthday').length,2);
});
test('New dashboard is a full-width horizontal timeline with working week and day navigation',async()=>{
 const ui=setup();const state=base();const today=tasks.localDate();
 const tomorrow=occasions.shiftDay(today,1);const inWeekTwo=occasions.shiftDay(today,9);
 const events=[{id:'e1',summary:'Gym',start:{date:tomorrow}},{id:'e2',summary:'Sauna',start:{date:inWeekTwo}}];
 let html=ui.testUI(state,'overview',events);
 assert.match(html,/timeline-axis/);assert.match(html,/Woche 1/);assert.match(html,/timeline-week-next/);
 assert.match(html,/data-action="timeline-day"/);assert.doesNotMatch(html,/timeline-branch-day/);
 await ui.testAction('timeline-week-next');html=ui.testUI(ui.getState(),'overview',events);
 assert.match(html,/Woche 2/);assert.match(html,/Sauna/);
 await ui.testAction('timeline-day',inWeekTwo);html=ui.testUI(ui.getState(),'overview',events);
 assert.match(html,/aria-pressed="true"/);
 await ui.testAction('timeline-horizon','14');html=ui.testUI(ui.getState(),'overview',events);
 assert.match(html,/Woche 1/);
 assert.match(styles,/timeline-axis::before/);
});
test('Weekly Review has no duplicate big explanation and has a full-width practical work pane',()=>{
 const html=setup().testUI(base(),'review');
 assert.doesNotMatch(html,/Dein Weekly Review/);
 assert.match(html,/assistant-review/);assert.match(html,/assistant-current/);assert.match(styles,/\.assistant-review-grid/);
});
test('People page displays birthday editor; contact birthday is included in suggestion panel without Google Calendar',async()=>{
 const ui=setup(),state=base();const date=occasions.shiftDay(tasks.localDate(),4),md=date.slice(5);
 state.people={personA:{id:'personA',name:'Birthday Person',tag:'birthday person',note:'',birthdayMonthDay:md,birthdayYear:null}};
 let html=ui.testUI(state,'people');
 assert.match(html,/person-birthday-form/);assert.match(html,/Geburtsjahr \(optional\)/);
 html=ui.testUI(state,'today');assert.match(html,/Birthday Person/);assert.match(html,/Geschenk besorgen/);
 const occasion=people.occasionsWithPeople([],()=>({}),state.people,tasks.localDate()).find(x=>x.kind==='birthday');
 await ui.testAction('occasion-accept',occasion.id,'gift');
 assert.equal(Object.keys(ui.getState().tasks).length,1);
 assert.match(Object.values(ui.getState().tasks)[0].title,/Geschenk besorgen/);
});
