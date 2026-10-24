import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {capacityGuardianModel,capacityGuardianTeaser,capacityGuardianView,capacitySettings,saveCapacitySettings} from '../client/src/capacity-guardian-v57747.js';
import {compass747Bridge} from '../client/compass747-bridge.js';
const TODAY='2026-10-24';
const task=(id,dueDate,fields={})=>({id,title:`Task ${id}`,dueDate,category:'Forschung',...fields});
const state=()=>({tasks:{a:task('a','2026-10-26'),b:task('b','2026-10-27'),old:task('old','2026-10-20'),done:task('done','2026-10-28',{completed:true})},projects:{},uiPreferences:{}});
const budget=(s,h,est,buffer=20)=>saveCapacitySettings(s,{focusHours:h,reservePct:buffer,estimates:est});
test('no input means unknown capacity, never guesses available calendar time',()=>{
 const s=state(),m=capacityGuardianModel(s,{today:TODAY});
 assert.equal(m.totalCapacity,null);assert.equal(m.dailyBudget,null);assert.equal(m.overdue.length,1);
 assert.equal(m.future.length,2);assert.equal(m.unknown.length,2);
 const html=capacityGuardianView(s,{today:TODAY});
 assert.match(html,/Bitte Fokusbudget angeben/);assert.doesNotMatch(html,/Du schaffst/);
 assert.match(html,/keine Kalenderbuchung/);assert.match(html,/Garmin-\/Fitdays-Werte veraltet/);
});
test('estimate and weekly focus budget saved only to vault prefs, tasks untouched',()=>{
 const s=state(); const original=JSON.stringify(s.tasks);
 budget(s,7.5,{a:'2.25',b:'1.25'},25);
 assert.equal(capacitySettings(s).weeklyFocusHours,7.5);
 assert.equal(capacitySettings(s).reservePct,25);
 assert.equal(capacitySettings(s).estimates.a,135);
 assert.equal(capacitySettings(s).estimates.b,75);
 assert.equal(JSON.stringify(s.tasks),original);
});
test('weekdays, weekends and buffer applied without calendar-free claims',()=>{
 const s=state();budget(s,10,{a:'2',b:'2'},20);
 const m=capacityGuardianModel(s,{today:TODAY});
 assert.equal(m.dailyBudget,96);
 // Saturday 24 -> Mon 26 = 1 workday; Tue 27 = 2 workdays
 assert.equal(m.checklist[0].remainingCapacity,96);
 assert.equal(m.checklist[1].remainingCapacity,192);
 assert.equal(m.checklist[0].status,'overbooked');
 assert.equal(m.checklist[1].status,'overbooked');
 assert.equal(m.totalKnownMinutes,240);
});
test('the deadline is only safe when all preceding relevant estimates exist',()=>{
 const s=state();budget(s,20,{a:'1'},20);
 const m=capacityGuardianModel(s,{today:TODAY});
 assert.equal(m.checklist[0].status,'within_estimate');
 assert.equal(m.checklist[1].status,'incomplete');
 assert.equal(m.unknown.length,1);
 assert.match(capacityGuardianView(s,{today:TODAY}),/Weitere Schätzungen fehlen/);
});
test('a known lower-bound can warn even if some task estimates remain missing',()=>{
 const s=state();budget(s,2,{a:'12'},20);
 const m=capacityGuardianModel(s,{today:TODAY});
 assert.equal(m.checklist[0].status,'overbooked');
 assert.equal(m.checklist[1].status,'overbooked');
});
test('overdue tasks separated and milestones displayed without duplicate hours',()=>{
 const s=state();s.projects.p={id:'p',title:'Paper',kind:'project',dueDate:'2026-10-27',status:'active'};
 budget(s,5,{a:2},20);
 const m=capacityGuardianModel(s,{today:TODAY});
 assert.equal(m.overdue.length,1);assert.equal(m.milestones.length,1);assert.equal(m.totalKnownMinutes,120);
 const html=capacityGuardianView(s,{today:TODAY});
 assert.match(html,/Überfällige GTD-Fristen/);assert.match(html,/Zusätzliche Projektfristen/);
 assert.match(html,/nicht als geschätzte Arbeitsstunden gezählt/);
});
test('archived, completed, templates excluded; flagged without artificial due included separately',()=>{
 const s=state();s.tasks.t=task('t','2026-10-26',{projectId:'templ'});s.projects.templ={id:'templ',isTemplate:true};
 s.tasks.n={id:'n',title:'Do not invent due',flagged:true};s.tasks.hidden=task('hidden','2026-10-26',{archived:true});
 const m=capacityGuardianModel(s,{today:TODAY});
 assert.equal(m.future.length,2);assert.equal(m.unscheduled.length,1);
 assert.match(capacityGuardianView(s,{today:TODAY}),/ohne Fälligkeit/);
});
test('effort validation and per-task edits can be cleared but unknown IDs ignored',()=>{
 const s=state();assert.throws(()=>saveCapacitySettings(s,{focusHours:100}),/0 bis 40/);
 assert.throws(()=>saveCapacitySettings(s,{focusHours:4,reservePct:70}),/0 bis 60/);
 assert.throws(()=>saveCapacitySettings(s,{focusHours:4,estimates:{a:-1}}),/größer 0/);
 budget(s,5,{a:'1.5',wrong:'12'});assert.equal(s.uiPreferences.capacityGuardian.estimates.wrong,undefined);
 budget(s,5,{a:''});assert.equal(s.uiPreferences.capacityGuardian.estimates.a,undefined);
});
test('XSS escaped in title / project data and form input names',()=>{
 const s=state();s.tasks.a.title='<svg onload=alert(1)>';
 const html=capacityGuardianView(s,{today:TODAY});
 assert.doesNotMatch(html,/<svg onload/);assert.match(html,/&lt;svg onload/);
});
test('teaser shows forward-looking GTD only and routes to dedicated tab',()=>{
 const s=state();const html=capacityGuardianTeaser(s,{today:TODAY});
 assert.match(html,/capacity747-open/);assert.match(html,/Ausblick/);
});
test('bridge checks upstream integration anchors instead of silently patching wrong code',()=>{
 const b=compass747Bridge();assert.throws(()=>b.transform('broken','/p/client/src/main.js'),/anchor/);
 assert.equal(b.transform('anything','/p/client/src/other.js'),null);
});
const mock=`
import {weeklyIntelligenceView} from './weekly-intelligence-v57746.js';
const COMPASS_CLIENT_VERSION='0.5.77.46';
const tabDef=insightTab==='weekly'?{label:'Wochenkompass'}:null;
const compactInsights=[['weekly','Wochenkompass','calendar'],['dreamworld','Traumwelt','moon']];
const content=insightTab==='weekly'?weeklyIntelligenceView(state,{today:localDate(),offset:weeklyOffset746}):insightTab==='dreamworld'?null:null;
function nav(){return \`<button type="button" class="nav-item \${tab==='insights'&&insightTab==='weekly'?'is-active':''}" data-action="calm-insight-view" data-id="weekly">\${ico('calendar',19)}<span>Wochenkompass</span></button>\`;}
function bind() {let a=1;}
function action(action,id){
 if(action==='insights-tab'){if(id==='touch'||id==='dreamworld'||id==='weekly'||INSIGHT_TABS.some(t=>t.id===id)){render();}return;}
 if(action==='calm-insight-view'){if(id==='dreamworld'||id==='weekly'||INSIGHT_TABS.some(t=>t.id===id)||['balance'].includes(id)){render();}return;}
 if(action==='weekly746-shift'){render();return;}
}
`;
test('bridge transforms real markup anchors into syntactically valid JS',()=>{
 const result=compass747Bridge().transform(mock,'/work/client/src/main.js');
 const out=result.code;
 for(const key of ['0.5.77.47','capacityGuardianView','capacity747-open','data-id="capacity"','#cap747-form','capacityGuardianTeaser'])assert.ok(out.includes(key),key);
 const path=join(tmpdir(),'capacity747-'+process.pid+'.mjs');writeFileSync(path,out);
 try{execFileSync(process.execPath,['--check',path]);}finally{unlinkSync(path);}
});
test('Vite plugin is ordered after Weekly 746 and before 748/PWA',()=>{
 const txt=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(txt,/compass746Bridge\(\), compass747Bridge\(\)/);
 assert.match(txt,/compass747Bridge\(\), compass748Bridge\(\), VitePWA/);
});
