import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {applyCalendarWindow,visibleCachedCalendar} from '../client/src/calendar-cache-v574.js';
import {familyTodayObservations,familyTodayPanel,familySuggestions,familyRules} from '../client/src/family-radar-v5775931.js';
import {compass5936CalendarAccessRelease} from '../client/compass5936-calendar-access-release.js';

const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const today='2026-10-26';
const seenAt='2026-10-26T09:05:00.000Z';
const event=(id,summary,day)=>({id,summary,start:{date:day},end:{date:day},status:'confirmed'});
const archive=applyCalendarWindow(null,[
 event('en','Nathanael: Englisch-Schularbeit','2026-11-04'),
 event('ma','Nathanael: Mathematik-Schularbeit','2026-11-08'),
 event('friend','Bettina Klampfer: Mathematik-Schularbeit','2026-11-03')
],{start:'2026-10-01',end:'2026-12-01',seenAt});
const people={son:{id:'son',name:'Nathanael Kroller',relationKind:'other'},friend:{id:'friend',name:'Bettina Klampfer',relationKind:'friend'}};
function runCalendarSnippet({token='',expires=0,arch=archive,events=visibleCachedCalendar(archive)}={}){
 const a=main.indexOf('function calendarAccess36(){');
 const b=main.indexOf('function calendarConnectUI(){',a);
 assert.ok(a>0&&b>a,'Native display helper must be loaded');
 const context={calendarToken:token,calendarExpires:expires,calendarEvents:events,state:{calendarArchive:arch},
  h:x=>String(x),calendarCardRows:()=>'<div>English exam cached</div>',calendarFilterToggle:()=>'<button>Filter</button>',
  calendarConnectUI:()=>'<button>Connect Google</button>',Date,Boolean,String,Number};
 vm.runInNewContext(main.slice(a,b)+'\nglobalThis.result={access:calendarAccess36(),body:calendarRowsOrConnect36("2026-11-04")};',context);
 return context.result;
}

test('Previously imported Google calendar appears with no OAuth token and displays cache freshness',()=>{
 const data=runCalendarSnippet();
 assert.equal(data.access.canDisplay,true);
 assert.equal(data.access.tokenValid,false);
 assert.equal(data.access.count,3);
 assert.match(data.body,/English exam cached/);
 assert.match(data.body,/verschlüsselten Tresor/);
 assert.match(data.body,/26\.10\.2026/);
 assert.match(data.body,/Connect Google/,'Google permission is for optional refresh');
});
test('Empty never-imported calendar asks for consent without pretending to have events',()=>{
 const data=runCalendarSnippet({arch:null,events:[]});
 assert.equal(data.access.canDisplay,false);
 assert.equal(data.access.cached,false);
 assert.match(data.body,/Connect Google/);
 assert.doesNotMatch(data.body,/English exam cached/);
});
test('Archived Nathanael exam is informational on Today even if person profile contains surname',()=>{
 const entries=visibleCachedCalendar(archive);
 const suggestions=familySuggestions(entries,people,{}, {today});
 const info=familyTodayObservations(entries,people,{}, {today});
 assert.deepEqual(info.map(x=>x.id),['en','ma']);
 assert.ok(!suggestions.some(x=>x.id==='en'),'English remains informational');
 assert.equal(familyRules({},people.son).enabled,true);
 assert.equal(familyRules({},people.friend).enabled,false);
 const html=familyTodayPanel(suggestions,info);
 assert.match(html,/Englisch-Schularbeit/);
 assert.doesNotMatch(html,/Bettina/);
});
test('Cached calendar supports old Nathaniel prefix without matching unrelated adults',()=>{
 const entries=[event('old','Nathaniel: Englisch-Schularbeit','2026-11-04')];
 assert.deepEqual(familyTodayObservations(entries,people,{}, {today}).map(x=>x.id),['old']);
 const person={id:'adult',name:'Nathanael Schmidt',relationKind:'friend'};
 assert.equal(familyRules({},person).enabled,false);
});
test('School exams with German compound names are recognised without a separating hyphen',()=>{
 const entries=[event('compound','Nathanael: Englischschularbeit','2026-11-04'),event('short','Nathanael: Mathe SA','2026-11-08')];
 const info=familyTodayObservations(entries,people,{}, {today});
 assert.deepEqual(info.map(x=>x.id),['compound','short']);
 const notes=familyTodayPanel(familySuggestions(entries,people,{}, {today}),info);
 assert.match(notes,/Englischschularbeit/);
 assert.doesNotMatch(notes,/Bettina/);
});
test('A known child prefix is still an informational hint before contacts sync on this device',()=>{
 const peopleMissing={};const entries=[event('e','Nathanael: Englischschularbeit','2026-11-04')];
 const observations=familyTodayObservations(entries,peopleMissing,{}, {today});
 assert.equal(observations.length,1);
 assert.equal(observations[0].personId,null);
 assert.match(familyTodayPanel([],observations),/data-action="agenda-open" data-id="e"/);
 assert.deepEqual(familyTodayObservations([event('b','Bettina: Mathe SA','2026-11-04')],{}, {},{today}),[]);
 const parentExcluded={p:{id:'p',name:'Nathanael',relationKind:'family'}};
 const off={familyRadar:{rules:{p:{enabled:false}}}};
 assert.deepEqual(familyTodayObservations(entries,parentExcluded,off,{today}),[]);
});
test('Token presence no longer gates calendar rows, forecast events and people suggestions',()=>{
 assert.match(main,/body:calendarRowsOrConnect36\(localDateString\(new Date\(\)\)/);
 assert.match(main,/calendarRowsOrConnect36\(selectedDay\)/);
 assert.match(main,/const ev=calendarReadable36\(\)\?visibleCalendarEvents\(day\):\[\]/);
 assert.match(main,/if\(!calendarReadable36\(\)\|\|!person\)return '';/);
 assert.match(main,/if\(!state\|\|!calendarReadable36\(\)\)return '';/);
 assert.match(main,/restoreCalendarFromVault\(state\)/);
 assert.match(main,/calendarToken='';calendarEvents=\[\]/,'OAuth stays ephemeral on lock');
});
test('Release is after .35 and does not modify the historic plugin chain',()=>{
 const p=compass5936CalendarAccessRelease();
 const changed=p.transform("const COMPASS_CLIENT_VERSION='0.5.77.59.35';const x='Build 0.5.77.59.35';",'/repo/client/src/main.js').code;
 assert.match(changed,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.36'/);
 assert.match(changed,/Build 0\.5\.77\.59\.36/);
 assert.match(p.transform("const x='Build 0.5.77.59.35';",'/repo/client/src/ars-vivendi-lock-v5775922.js').code,/\.36/);
 assert.throws(()=>p.transform('wrong','/repo/client/src/main.js'),/previous version badge/);
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5935CycleReleaseBridge\(\)\);\s*compassConfig\.plugins\.push\(compass5936CalendarAccessRelease\(\)\)/);
});
