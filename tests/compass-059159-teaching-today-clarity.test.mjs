import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {teachingRadarEntries,teachingRadarSetEffort,teachingEffortFor,teachingSubjectKey,teachingRadarPanel,mergeTeachingRadar} from '../client/src/teaching-preparation-radar-v05919.js';
import {overdueTask59,todayTopToolbar59} from '../client/src/today-clarity-v059159.js';
const event=(id,title,day)=>({id,summary:title,start:{dateTime:day+'T10:00:00+01:00'},status:'confirmed'});
const cases=[event('d','Design Thinking (kro)','2026-11-23'),event('m','Marketing (kro)','2026-11-30'),event('b','Business Model Workshop','2026-11-24'),event('i','Intro to Entrepreneurship (kro)','2026-11-26'),event('e','Einleitung, Administration (kro)','2026-11-21')];
test('Course workload: explicit examples get sensible initial colors; high effort is shown before low effort',()=>{
 const rows=teachingRadarEntries(cases,{}, {today:'2026-11-18'});
 assert.deepEqual(rows.map(r=>r.effort.level),['high','high','low','low','low']);
 assert.deepEqual(rows.slice(0,2).map(r=>r.title),['Intro to Entrepreneurship (kro)','Marketing (kro)']);
 assert.ok(rows.some(r=>r.title.includes('Design Thinking')&&r.effort.level==='low'));
});
test('Effort is editable and persists per subject for different event dates/IDs',()=>{
 const s={};const first=teachingRadarEntries([cases[0]],s,{today:'2026-11-18'})[0];
 assert.equal(teachingSubjectKey(first.title),'design thinking');
 assert.equal(teachingRadarSetEffort(s,first,'high','2026-11-18T12:00:00Z'),true);
 const upcoming=teachingRadarEntries([event('new','Design Thinking (abc/kro)','2026-12-02')],s,{today:'2026-11-18'})[0];
 assert.equal(upcoming.effort.level,'high');assert.equal(upcoming.effort.manual,true);
 assert.equal(teachingRadarSetEffort(s,first,'danger'),false);
 assert.equal(teachingEffortFor('Design Thinking (kro)',s).level,'high');
});
test('Subject choices merge by update time while snooze decisions remain intact',()=>{
 const local={decisions:{x:{status:'snoozed',until:'2026-12-01',updatedAt:'2026-11-15'}},efforts:{marketing:{level:'low',updatedAt:'2026-11-16'}}};
 const remote={efforts:{marketing:{level:'high',updatedAt:'2026-11-17'},'design thinking':{level:'medium',updatedAt:'2026-11-16'}}};
 const merged=mergeTeachingRadar(local,remote);
 assert.equal(merged.efforts.marketing.level,'high');assert.equal(merged.efforts['design thinking'].level,'medium');
 assert.equal(merged.decisions.x.status,'snoozed');
});
test('Effort buttons and current color must be present, including category labels',()=>{
 const markup=teachingRadarPanel(teachingRadarEntries(cases,{}, {today:'2026-11-18'}));
 assert.match(markup,/tr919-effort-high/);assert.match(markup,/data-action="tr919-effort"/);
 assert.match(markup,/data-step="low"/);assert.match(markup,/data-step="medium"/);assert.match(markup,/data-step="high"/);
 assert.match(markup,/aria-pressed="true"/);
});
test('Overdue real due dates are red only while tasks are not completed',()=>{
 const due={title:'Überfällig',dueDate:'2026-11-14',plannedDate:'2026-11-18',completed:false};
 assert.equal(overdueTask59(due,'2026-11-18'),true);
 assert.equal(overdueTask59({...due,completed:true},'2026-11-18'),false);
 assert.equal(overdueTask59({...due,dueDate:null},'2026-11-18'),false);
 assert.equal(overdueTask59({...due,dueDate:'2026-11-18'},'2026-11-18'),false);
 assert.equal(overdueTask59({...due,dueDate:'2026-11-20'},'2026-11-18'),false);
});
test('Entire header can be toggled; default displays all reminders and tasks remain outside folding region',()=>{
 assert.match(todayTopToolbar59(false),/aria-expanded="true"/);
 assert.match(todayTopToolbar59(true),/aria-expanded="false"/);
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(main,/todayTopCollapsed59===true/);
 assert.match(main,/s\.uiPreferences\.todayTopCollapsed59=/);
 assert.match(main,/todayMensaMarkup\+'<\/div>'\+content/);
 assert.match(main,/const html=chrome\(workspace,\{todayMensaMarkup:mensaTodayCompact\(\)\}\)/);
 assert.match(main,/data-core259-family/);
 assert.match(main,/overdueTask59\(t,localDate\(\)\)/);
});
