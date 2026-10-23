import {createPerformanceTrace} from '../client/src/performance-trace-v57719.js';
import * as peopleSync719 from '../client/src/people-sync-v57719.js';
import * as agendaIndex717 from '../client/src/people-agenda-index-v57717.js';
import * as planIndex717 from '../client/src/plan-tree-index-v57717.js';
import {createEditDraftGuard} from '../client/src/edit-draft-guard-v57716.js';
import * as waiting715 from '../client/src/waiting-followup-v57715.js';
import * as friction715 from '../client/src/task-friction-v57715.js';
import * as habitSync5731 from '../client/src/habit-device-sync-v5731.js';
import * as calendarCache574 from '../client/src/calendar-cache-v574.js';
import * as yesterday710 from '../client/src/yesterday-intentions-v57710.js';
import * as contactCare568 from '../client/src/relationship-intelligence-v568.js';
import * as calendarSuggestions568 from '../client/src/calendar-intelligence-v568.js';
import * as feelingWheel65 from '../client/src/feeling-wheel-v565.js';
import * as lifeBalance63 from '../client/src/life-balance-radar-v563.js';
import * as dailyPlanning from '../client/src/daily-planning-v48.js';
import * as deadline from '../client/src/deadline-intelligence-v45.js';
import * as projectExchange from '../client/src/project-exchange-v45.js';
import * as capacity from '../client/src/capacity-engine-v44.js';
import {technicalSettings,TECHNICAL_TOGGLES,wireTechnicalCrosshair} from '../client/src/kraken-technical-v40.js';
import * as inboxFlags from '../client/src/inbox-flags-v27.js';
import * as inboxOrder from '../client/src/inbox-order-v34.js';
import * as treeWorkspace from '../client/src/project-workspace-v27.js';
import * as shopping713 from '../client/src/shopping-lists-v57713.js';
import * as relationships from '../client/src/people-relationships-v24.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import * as tasks from '../client/src/tasks.js';
import * as life from '../client/src/life-intelligence-v22.js';
import * as gtd23 from '../client/src/gtd-intelligence-v23.js';
import * as personLinks from '../client/src/person-links.js';
import * as discoveryFilter from '../client/src/discovery-category-filter.js';
import * as discoveryResearch577 from '../client/src/discovery-research-v577.js';
import * as discoveryFreshness5777 from '../client/src/discovery-freshness-v5777.js';
import * as cinemaModule5772 from '../client/src/cinema-program-v5772.js';
import * as cinemaDetails5773 from '../client/src/cinema-details-v5773.js';
import * as eventSync from '../client/src/event-sync.js';
import * as review from '../client/src/guided-review.js';
import * as tags from '../client/src/smart-tags.js';
import * as personMatching from '../client/src/people-matching.js';
import * as calendar from '../client/src/calendar-rules.js';
import * as activities from '../client/src/activity-management.js';
import * as occasions from '../client/src/occasion-planning.js';
import * as peopleOccasions from '../client/src/people-occasions.js';
import * as perspectives from '../client/src/context-perspectives.js';
import * as recovery from '../client/src/recovery-ideas.js';
import * as eventsImport from '../client/src/event-import.js';
import * as healthVisual from '../client/src/health-visual.js';
import * as healthDashboard from '../client/src/health-dashboard.js';
import * as sportsModule from '../client/src/sports-insights.js';
import * as reviewHubModule from '../client/src/review-import-hub.js';
import * as smartImportHubModule from '../client/src/smart-import-hub-v49.js';
import * as healthCoverage494 from '../client/src/health-data-coverage-v494.js';
import * as timeoff554 from '../client/src/recovery-timeoff-v554.js';
import * as radar555 from '../client/src/conference-radar-v555.js';
const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const compiled=source.replace(/^import .*;\r?\n/gm,'').replace('registerSW({immediate:true});','').split("document.addEventListener('keydown'")[0]+`
 globalThis.testUI=(current,mode,events=[])=>{state=current;tab=mode;calendarEvents=events;render();return app.innerHTML;};
 globalThis.testAction=(action,id,stepId)=>runAction(action,id,stepId);
 globalThis.readState=()=>state;
 globalThis.testCinemaPreview=(p)=>{discoveryImportPreview=p;};
`;
function context(){
 const app={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
 const document={getElementById:()=>app,querySelector:()=>null,addEventListener:()=>{},visibilityState:'visible'};
 const window={addEventListener:()=>{},scrollY:0,scrollTo:()=>{}};
 const ctx={app,document,window,location:{search:''},history:{replaceState:()=>{}},navigator:{onLine:false},URLSearchParams,URL,Date,Intl,crypto:webcrypto,structuredClone,console,fetch:()=>Promise.reject(new Error('No network')),setTimeout,clearTimeout,requestAnimationFrame:(fn)=>fn()};
 Object.assign(ctx,agendaIndex717,planIndex717);
 Object.assign(ctx,waiting715,friction715,yesterday710,dailyPlanning,capacity,deadline,projectExchange,treeWorkspace,shopping713,gtd23,life,tasks,calendar,activities,occasions,peopleOccasions,perspectives,recovery,eventsImport,healthVisual,healthDashboard);
 Object.assign(ctx,contactCare568,calendarSuggestions568);
 Object.assign(ctx,inboxFlags,inboxOrder,review,tags,personMatching,sportsModule,reviewHubModule,personLinks,discoveryFilter,discoveryResearch577,discoveryFreshness5777,cinemaModule5772,cinemaDetails5773,eventSync,relationships);
 Object.assign(ctx,{technicalSettings,TECHNICAL_TOGGLES,wireTechnicalCrosshair});
 ctx.discoveryAppearance=eventsImport.eventAppearance;
 ctx.createEditDraftGuard=createEditDraftGuard;ctx.createPerformanceTrace=createPerformanceTrace;Object.assign(ctx,peopleSync719);
 ctx.vault={save:async()=>{},lock:()=>{}};ctx.privateChanged=()=>false;
 Object.assign(ctx,habitSync5731,calendarCache574);
 Object.assign(ctx,smartImportHubModule,healthCoverage494,timeoff554,radar555,lifeBalance63,feelingWheel65);
 // Avoid timers, network, browser listeners: HTML view rendering and actions only.
 runInNewContext(compiled,ctx,{filename:'compass-main-browser-smoke.js',timeout:2000});
 return ctx;
}
test('Every navigation screen renders without missing functions, including previously disabled people/progress/recovery',()=>{
 const ui=context();const state=tasks.prepareTasks({format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 for(const [mode,expected] of [['today','Heute'],['overview','Timeline'],['people','Kontakte'],['progress','Projektfortschritt'],['recovery','Erholung'],['activity','Aktivitätsverwaltung'],['review','Inbox klären'],['projects','Projekte'],['templates','Vorlagen'],['shopping','Einkaufslisten'],['next','Next Actions'],['flagged','Flagged'],['hold','Waiting'],['someday','Dreams'],['system','System'],['inbox','Inbox'],['forecast','Forecast']]){
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

test('Flagged perspective and Inbox both render one-click flag without navigation',()=>{
 const ui=context();const id='10000000-0000-4000-8000-000000000001';
 const state=tasks.prepareTasks({format:1,records:{[id]:{id,title:'Person um Rückmeldung bitten',note:'',tags:['compass-system-flag','beratung'],deleted:false,updatedAt:'2026-10-19T06:00:00Z'}},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 const flagged=ui.testUI(state,'flagged');
 assert.match(flagged,/Markierte Inbox-Einträge/);
 assert.match(flagged,/Person um Rückmeldung bitten/);
 assert.match(flagged,/data-action="inbox-flag"/);
 const inbox=ui.testUI(state,'inbox');
 assert.match(inbox,/inbox-row-flag is-flagged/);
 assert.doesNotMatch(inbox,/#compass-system-flag/);
});

test('0.5.38 Next Actions expose sorting handles, keyboard/touch arrows and a voluntary Today button',()=>{
 const ui=context();const a='10000000-0000-4000-8000-000000000011',b='10000000-0000-4000-8000-000000000012';
 const mk=(id,title)=>({id,title,category:'Allgemein',workflow:'next',plannedDate:null,dueDate:null,completed:false,archived:false});
 const st=tasks.prepareTasks({format:1,records:{},tasks:{[a]:mk(a,'A Aktion'),[b]:mk(b,'B Aktion')},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 let html=ui.testUI(st,'next');
 assert.match(html,/data-next-drag=/);assert.match(html,/data-next-row=/);
 assert.match(html,/data-action="next-plan-today"/);assert.match(html,/data-action="next-move-up"/);
 const reordered=inboxOrder.inboxMove([],tasks.nextActions(st),b,a,false);
 st.uiPreferences={nextActionManualOrder:reordered};html=ui.testUI(st,'next');
 assert.ok(html.indexOf('B Aktion')<html.indexOf('A Aktion'));
 assert.deepEqual(tasks.nextActions(st).map(x=>x.title),['A Aktion','B Aktion'],'GTD core order is independent of UI order');
});

test('0.5.38 Vormerken writes plannedDate (not dueDate), appears in Today and is reversible',async()=>{
 const ui=context(),id='10000000-0000-4000-8000-000000000013';
 const task={id,title:'Bericht lesen',category:'Allgemein',workflow:'next',plannedDate:null,dueDate:null,completed:false,archived:false};
 const st=tasks.prepareTasks({format:1,records:{},tasks:{[id]:task},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 ui.testUI(st,'next');await ui.testAction('next-plan-today',id);
 assert.equal(ui.readState().tasks[id].plannedDate,tasks.localDate());
 assert.equal(ui.readState().tasks[id].dueDate,null);
 assert.equal(ui.readState().taskPending[id],true,'cloud task sync is queued');
 assert.match(ui.testUI(ui.readState(),'today'),/Bericht lesen/);
 await ui.testAction('next-plan-today',id);
 assert.equal(ui.readState().tasks[id].plannedDate,null);
 assert.equal(ui.readState().tasks[id].dueDate,null);
});


test('0.5.38 Next Actions move-down stores display order in encrypted local preference, without modifying task sortOrder',async()=>{
 const ui=context(),a='10000000-0000-4000-8000-000000000021',b='10000000-0000-4000-8000-000000000022';
 const make=(id,title)=>({id,title,category:'Allgemein',workflow:'next',sortOrder:100,plannedDate:null,dueDate:null,completed:false,archived:false});
 const st=tasks.prepareTasks({format:1,records:{},tasks:{[a]:make(a,'A zuerst'),[b]:make(b,'B danach')},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 ui.testUI(st,'next');await ui.testAction('next-move-down',a);
 assert.equal(ui.readState().uiPreferences.nextActionManualOrder[0],b);
 assert.equal(ui.readState().tasks[a].sortOrder,100);
 const html=ui.testUI(ui.readState(),'next');
 assert.ok(html.indexOf('B danach')<html.indexOf('A zuerst'));
});

test('0.5.38 Today shortcut never changes an existing dueDate',async()=>{
 const ui=context(),id='10000000-0000-4000-8000-000000000023';
 const task={id,title:'Abgabe vorbereiten',category:'Allgemein',workflow:'next',plannedDate:null,dueDate:'2026-11-09',completed:false,archived:false};
 const st=tasks.prepareTasks({format:1,records:{},tasks:{[id]:task},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 ui.testUI(st,'next');await ui.testAction('next-plan-today',id);
 assert.equal(ui.readState().tasks[id].plannedDate,tasks.localDate());
 assert.equal(ui.readState().tasks[id].dueDate,'2026-11-09');
});

test('0.5.54 regression: project title really opens a collapsed project, inspector and its tasks',async()=>{
 const ui=context(),p='10000000-0000-4000-8000-000000000031',t='10000000-0000-4000-8000-000000000032';
 const st=tasks.prepareTasks({format:1,records:{},projects:{[p]:{id:p,kind:'project',title:'Prüfungen',status:'active',projectType:'parallel'}},tasks:{[t]:{id:t,projectId:p,title:'Korrekturen PME',category:'Allgemein',workflow:'next',completed:false,archived:false}},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 let html=ui.testUI(st,'projects');assert.match(html,/data-action="project-select"/);
 await ui.testAction('project-toggle-expand',p);html=ui.testUI(ui.readState(),'projects');
 assert.doesNotMatch(html,/Korrekturen PME/);
 await ui.testAction('project-select',p);html=ui.testUI(ui.readState(),'projects');
 assert.match(html,/Korrekturen PME/);
 assert.match(html,/tree-inspector/);
 assert.match(html,/<details class="project-properties" open>/);
 await ui.testAction('tree-task-select',t);html=ui.testUI(ui.readState(),'projects');
 assert.match(html,/Aufgabendetails/);
});

test('0.5.77.2 cinema view renders each film once, with distinct showtime links retained',async()=>{
 const ui=context(),today=tasks.localDate();
 const base={date:today,city:'Graz',country:'Österreich',category:'Kino',sourceUrl:'https://www.example.org/film',description:'Dokumentarfilm.'};
 const events=[{...base,title:'Atmosphere',venue:'KIZ',startTime:'18:00'},{...base,title:'Atmosphere',venue:'Annenhof',startTime:'20:00'},{...base,title:'Alte Liebe',venue:'KIZ',startTime:'19:00'}];
 const state=tasks.prepareTasks({format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[],discoveredEvents:events});
 const before=ui.testUI(state,'recovery');
 assert.match(before,/3 Termine/);
 await ui.testAction('discovery-view-cinema');
 const html=ui.testUI(state,'recovery');
 assert.match(html,/2 Filme · 3 Vorführungen/);
 assert.equal((html.match(/<h3>Atmosphere<\/h3>/g)||[]).length,1);
 assert.match(html,/Annenhof/);
 assert.match(html,/KIZ/);
 assert.match(html,/18:00/);
 assert.match(html,/20:00/);
 assert.match(html,/data-action="discovery-save"/);
});

test('0.5.77.3 cinema: poster cards, date arrows and enrichment keep existing screenings',async()=>{
 const ui=context(),today=tasks.localDate(),tomorrow=cinemaDetails5773.cinemaDayShift(today,1);
 const base={city:'Graz',country:'Österreich',category:'Kino',sourceUrl:'https://kino.example.org/film',description:'Kinovorführung.'};
 const events=[{...base,title:'Atmosphere',venue:'KIZ',date:today,startTime:'18:00'},{...base,title:'Atmosphere',venue:'Schubertkino',date:tomorrow,startTime:'20:00'}];
 const st=tasks.prepareTasks({format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[],discoveredEvents:events});
 ui.testUI(st,'recovery');await ui.testAction('discovery-view-cinema');
 let html=ui.testUI(st,'recovery');
 assert.match(html,/discovery-film-card cinema-poster/);
 assert.match(html,/Noch keine verifizierte Inhaltsbeschreibung/);
 assert.match(html,/data-action="discovery-cinema-next"/);
 assert.match(html,/KIZ/);assert.doesNotMatch(html,/>Schubertkino · Graz</);
 await ui.testAction('discovery-cinema-next');html=ui.testUI(st,'recovery');assert.match(html,/Schubertkino/);assert.doesNotMatch(html,/>KIZ · Graz</);
 const details={films:[{title:'Atmosphere',description:'Ein Dokumentarfilm untersucht die Verflechtung von globaler Wirtschaft, Wohlstand und ungleichen Lebenschancen anhand konkreter Menschen.',sourceUrl:'https://kino.example.org/synopsis',imageUrl:'https://kino.example.org/poster.jpg'}]};
 ui.testCinemaPreview(cinemaDetails5773.parseCinemaDetailsImport(JSON.stringify(details),st.discoveredEvents));
 await ui.testAction('discovery-import-confirm');html=ui.testUI(st,'recovery');
 assert.match(html,/Verflechtung von globaler Wirtschaft/);assert.match(html,/https:\/\/kino.example.org\/poster.jpg/);
 assert.equal(ui.readState().discoveredEvents.length,2);
 assert.equal(ui.readState().discoveredEvents.filter(e=>e.synopsisSourceUrl).length,2);
});

test('0.5.77.13 existing master template is directly editable and addition keeps template ID',async()=>{
 const ui=context(),p='10000000-0000-4000-8000-000000001213';
 const s=tasks.prepareTasks({format:1,records:{},pending:[],serverVersions:{},cursor:0,conflicts:[],history:[]});
 s.projects[p]={id:p,title:'Einkaufsliste',outcome:'',category:'Allgemein',status:'active',kind:'project',isTemplate:true,projectType:'parallel',parentId:null,reviewIntervalDays:7,sortOrder:100};
 assert.match(ui.testUI(s,'templates'),/tree-template-add-task/);
 await ui.testAction('tree-template-add-task',p);
 const html=ui.testUI(ui.readState(),'templates');
 assert.match(html,/name="projectId" value="10000000-0000-4000-8000-000000001213"/);
 assert.match(html,/Vorlage: <strong>Einkaufsliste<\/strong>/);
 assert.match(html,/name="title" aria-label="Aufgabentitel"/);
});
