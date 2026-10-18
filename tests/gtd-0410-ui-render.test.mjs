import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import * as tasks from '../client/src/tasks.js';
import * as calendar from '../client/src/calendar-rules.js';
import * as activities from '../client/src/activity-management.js';
import * as occasions from '../client/src/occasion-planning.js';
const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const compiled=source.replace(/^import .*;\r?\n/gm,'').replace('registerSW({immediate:true});','').split("document.addEventListener('keydown'")[0]+`
 globalThis.testUI=(current,mode,events=[])=>{state=current;tab=mode;calendarEvents=events;render();return app.innerHTML;};
 globalThis.testAction=(action,id,stepId)=>runAction(action,id,stepId);
 globalThis.readState=()=>state;
`;
function context(){
 const app={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
 const document={getElementById:()=>app,querySelector:()=>null,addEventListener:()=>{},visibilityState:'visible'};
 const window={addEventListener:()=>{}};
 const ctx={app,document,window,location:{search:''},history:{replaceState:()=>{}},navigator:{onLine:false},URLSearchParams,URL,Date,Intl,crypto:webcrypto,structuredClone,console,fetch:()=>Promise.reject(new Error('No network')),setTimeout,clearTimeout};
 Object.assign(ctx,tasks,calendar,activities,occasions);
 ctx.vault={save:async()=>{},lock:()=>{}};
 // Avoid timers, network, browser listeners: HTML view rendering and actions only.
 runInNewContext(compiled,ctx,{filename:'compass-main-browser-smoke.js',timeout:2000});
 return ctx;
}
test('Every navigation screen renders without missing functions, including previously disabled people/progress/recovery',()=>{
 const ui=context();const state=tasks.prepareTasks({format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 for(const [mode,expected] of [['today','Heute'],['overview','Timeline'],['people','Kontakte'],['progress','Projektfortschritt'],['recovery','Erholung'],['activity','Aktivitätsverwaltung'],['review','Weekly Review'],['projects','Projekte'],['next','Next Actions'],['flagged','Flagged'],['hold','Waiting'],['someday','Dreams'],['system','System'],['inbox','Inbox'],['forecast','Forecast']]){
  const html=ui.testUI(state,mode);
  assert.ok(html.includes(expected),`${mode} missing ${expected}`);
  assert.ok(!html.includes('is-disabled'),`${mode}: navigation unexpectedly disabled`);
 }
});
test('Occasion acceptance/dismissal creates only chosen task, links it to Next Actions, and prevents duplicate acceptance',async()=>{
 const ui=context();const state=tasks.prepareTasks({format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);const d=tasks.localDate(tomorrow);
 const events=[{id:'birthday-ui-test',summary:'Geburtstag von Paul',start:{date:d},eventType:'birthday'}];
 let html=ui.testUI(state,'today',events);
 assert.match(html,/Geburtstagsgrüße übermitteln/);
 const occasion=occasions.upcomingOccasions(events,e=>calendar.classifyCalendarEvent(e),tasks.localDate()).find(x=>x.kind==='birthday');
 assert.ok(occasion);
 await ui.testAction('occasion-accept',occasion.id,'gift');
 assert.equal(Object.keys(ui.readState().tasks).length,1);
 assert.match(Object.values(ui.readState().tasks)[0].title,/Geschenk/);
 assert.ok(tasks.validLocalTask(Object.values(ui.readState().tasks)[0]));
 await ui.testAction('occasion-accept',occasion.id,'gift');
 assert.equal(Object.keys(ui.readState().tasks).length,1);
 await ui.testAction('occasion-dismiss',occasion.id,'cake');
 assert.equal(ui.readState().occasionChoices[occasions.occasionStepKey(occasion,occasions.OCCASION_STEPS.birthday.find(x=>x.id==='cake'))],'dismissed');
 html=ui.testUI(ui.readState(),'today',events);
 assert.match(html,/Wieder anzeigen/);
});
