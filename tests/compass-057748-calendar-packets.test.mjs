import test from 'node:test';
import assert from 'node:assert/strict';
import {capacityCalendarModel,capacityCalendarView,remainingWork,saveWorkPacketSettings,workPacketSettings,effectiveCapacityState748} from '../client/src/capacity-calendar-v57748.js';
import {saveCapacitySettings} from '../client/src/capacity-guardian-v57747.js';
import {compass748Bridge} from '../client/compass748-bridge.js';
import {compass747Bridge} from '../client/compass747-bridge.js';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const today='2026-10-26',now=new Date('2026-10-26T08:00:00+01:00');
const coverage={complete:true,start:'2026-10-01',end:'2026-11-20'};
const fresh=now.getTime()-300000;
const task=(id,title,dueDate,extra={})=>({id,title,dueDate,category:'Pruefungen',workflow:'next',...extra});
function example(){
 const state={tasks:{a:task('a','60 Prüfungen korrigieren','2026-10-29',{progressTarget:60,progressCurrent:20}),b:task('b','Paper schreiben','2026-10-30',{category:'Forschung'})},projects:{},uiPreferences:{capacity:{startHour:9,endHour:15,bufferMinutes:10,minSlotMinutes:30,availabilityTitles:'Work'}}};
 saveCapacitySettings(state,{focusHours:15,reservePct:20,estimates:{b:'1.5'}});
 saveWorkPacketSettings(state,{a:{count:'',unitMinutes:'8',blockMinutes:'48'}});
 return state;
}
const ctx=(s,overrides={})=>({today,now,calendarEvents:[],calendarCoverage:coverage,calendarUpdatedAt:fresh,calendarConnected:true,...overrides});
test('counter determines remaining corrections and user rate determines remaining minutes',()=>{
 const s=example(),m=remainingWork(s,s.tasks.a);
 assert.equal(m.remainingCount,40);assert.equal(m.minutes,320);
 assert.equal(m.blockMinutes,48);
});
test('counter updates without editing packet settings',()=>{
 const s=example();s.tasks.a.progressCurrent=30;
 assert.equal(remainingWork(s,s.tasks.a).minutes,240);
});

test('packet totals feed earlier guardian risk calculation without mutating stored estimate',()=>{
 const s=example(),r=effectiveCapacityState748(s);
 assert.equal(r.uiPreferences.capacityGuardian.estimates.a,320);
 assert.equal(s.uiPreferences.capacityGuardian.estimates.a,undefined);
 assert.equal(s.uiPreferences.capacityGuardian.estimates.b,90);
});
test('settings preserved next to budget and estimates; validates invalid data',()=>{
 const s=example();const old=JSON.stringify(s.tasks);
 saveWorkPacketSettings(s,{b:{count:12,unitMinutes:5,blockMinutes:30}});
 assert.equal(workPacketSettings(s).b.count,12);
 assert.equal(s.uiPreferences.capacityGuardian.weeklyFocusHours,15);
 assert.equal(JSON.stringify(s.tasks),old);
 assert.throws(()=>saveWorkPacketSettings(s,{b:{count:12,unitMinutes:0,blockMinutes:30}}),/Minuten/);
});
test('calendar absent never suggests a time block',()=>{
 const s=example(),m=capacityCalendarModel(s,ctx(s,{calendarConnected:false}));
 assert.equal(m.status,'disconnected');assert.equal(m.plans.length,0);
 assert.match(capacityCalendarView(s,ctx(s,{calendarConnected:false})),/Keine bestätigten freien Zeitfenster/);
});
test('incomplete or stale coverage never suggests concrete free time',()=>{
 const s=example();
 const partial=capacityCalendarModel(s,ctx(s,{calendarCoverage:{complete:false}}));
 const stale=capacityCalendarModel(s,ctx(s,{calendarUpdatedAt:now.getTime()-3*3600000}));
 assert.equal(partial.status,'partial');assert.equal(stale.status,'stale');assert.equal(partial.plans.length,0);assert.equal(stale.plans.length,0);
});
test('opaque meeting with buffer blocks proposed work',()=>{
 const s=example();const busy=[{summary:'Meeting',start:{dateTime:'2026-10-26T09:00:00+01:00'},end:{dateTime:'2026-10-26T14:50:00+01:00'}}];
 const m=capacityCalendarModel(s,ctx(s,{calendarEvents:busy}));
 assert.ok(m.plans.every(p=>p.day!=='2026-10-26'));
});
test('opaque all-day block removes that day',()=>{
 const s=example();const events=[{summary:'Ferien',start:{date:'2026-10-26'},end:{date:'2026-10-27'}}];
 const m=capacityCalendarModel(s,ctx(s,{calendarEvents:events}));
 assert.equal(m.plans.some(p=>p.day===today),false);
});
test('time blocks never exceed calendar slot, user focus budget or due dates',()=>{
 const s=example(),m=capacityCalendarModel(s,ctx(s));
 assert.equal(m.status,'ready');assert.ok(m.plans.length>0);
 const perDay=new Map();for(const p of m.plans){assert.ok(p.end>p.start);assert.ok(p.day<=s.tasks[p.taskId].dueDate);assert.ok(p.minutes<=48||p.taskId==='b');assert.equal((p.end-p.start)/60000,p.minutes);perDay.set(p.day,(perDay.get(p.day)||0)+p.minutes)}
 for(const n of perDay.values())assert.ok(n<=m.dailyCap);
 for(let i=0;i<m.plans.length;i++)for(let j=i+1;j<m.plans.length;j++)if(m.plans[i].day===m.plans[j].day)assert.ok(m.plans[i].end<=m.plans[j].start||m.plans[j].end<=m.plans[i].start);
});
test('tasks with unknown effort not silently counted as finished',()=>{
 const s=example();s.tasks.c=task('c','Ohne Schätzung','2026-10-31',{category:'Forschung'});
 const m=capacityCalendarModel(s,ctx(s));assert.ok(m.unknown.some(x=>x.task.id==='c'));assert.match(capacityCalendarView(s,ctx(s)),/Aufwandsschätzung/);
});
test('completed and postponed work not auto-scheduled',()=>{
 const s=example();s.tasks.b.workflow='hold';s.tasks.a.completed=true;
 assert.equal(capacityCalendarModel(s,ctx(s)).plans.length,0);
});
test('missing focus budget keeps time planning disabled even with fresh calendar',()=>{
 const s=example();s.uiPreferences.capacityGuardian.weeklyFocusHours=null;
 const m=capacityCalendarModel(s,ctx(s));assert.equal(m.plans.length,0);assert.match(capacityCalendarView(s,ctx(s)),/Fokusbudget noch nicht festgelegt/);
});
test('escaping protects task markup and potentially malicious strings',()=>{
 const s=example();s.tasks.a.title='<svg/onload=alert(1)>';
 const html=capacityCalendarView(s,ctx(s));assert.doesNotMatch(html,/<svg\/onload/);assert.match(html,/&lt;svg/);
});
test('bridge fails closed, points to real Vite anchors, transforms syntactically',()=>{
 const bridge=compass748Bridge();assert.throws(()=>bridge.transform('bad','/repo/client/src/main.js'),/anchor/);
 assert.equal(bridge.transform('wrong','/repo/client/src/x.js'),null);
 const mock=`
import './capacity-guardian-v57747.css';
const COMPASS_CLIENT_VERSION='0.5.77.47';
const content=insightTab==='capacity'?capacityGuardianView(state,{today:localDate()}):foo;
function bind() {;
 const capacityForm747=app.querySelector('#cap747-form');
}
async function action(action,id){
 if(action==='capacity747-open'){return;}
}
`;
 const out=bridge.transform(mock,'/repo/client/src/main.js').code;
 for(const v of ['0.5.77.48','capacityCalendarView','cap748-calendar-refresh','#cap748-packets-form','saveWorkPacketSettings'])assert.ok(out.includes(v),v);
 const p='/tmp/compass-748-bridge-mock-'+process.pid+'.mjs';writeFileSync(p,out);
 try{execFileSync(process.execPath,['--check',p]);}finally{unlinkSync(p);}
 const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
 const conf=readFileSync(resolve(base,'client/vite.config.js'),'utf8');
 assert.match(conf,/compass747Bridge\(\), compass748Bridge\(\), VitePWA/);
});

// Run the 0.5.77.47 and 0.5.77.48 transforms on the *same* source.
test('consecutive bridges apply without missing anchor and emit valid JS',()=>{
 const fixture=readFileSync(new URL('./compass-057747-capacity.test.mjs',import.meta.url),'utf8');
 const match=fixture.match(/const mock=`([\s\S]*?)`;\ntest\('bridge transforms/);
 assert.ok(match,'0.5.77.47 source mock available');
 const base=match[1].replaceAll('\\`','`').replaceAll('\\${','${').replace('function action(action,id){','async function action(action,id){');
 const after47=compass747Bridge().transform(base,'/repo/client/src/main.js').code;
 const after48=compass748Bridge().transform(after47,'/repo/client/src/main.js').code;
 assert.match(after48,/COMPASS_CLIENT_VERSION='0\.5\.77\.48'/);
 assert.match(after48,/calendarCoverage,calendarUpdatedAt,calendarConnected/);
 const p='/tmp/compass-748-chain-'+process.pid+'.mjs';writeFileSync(p,after48);
 try{execFileSync(process.execPath,['--check',p]);}finally{unlinkSync(p);}
});
