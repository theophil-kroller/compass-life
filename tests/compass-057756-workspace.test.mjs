import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {compass755Bridge} from '../client/compass755-bridge.js';
import {compass756Bridge} from '../client/compass756-bridge.js';

// Integration with the exact fixture from the preceding successful .55.2 test,
// so these tests exercise the transformation chain, not an invented .56-only fixture.
const earlier=readFileSync(new URL('./compass-057755-lightning-fast.test.mjs', import.meta.url),'utf8');
const marker='const fixture=`';
const start=earlier.indexOf(marker),end=earlier.indexOf('`;\n\ntest(',start+marker.length);
assert.ok(start>=0&&end>start,'previous build fixture exists');
let priorFixture=Function('return '+earlier.slice(start+'const fixture='.length,end+1))();
priorFixture=priorFixture.replace('function radarScreen(){return null;}',
 'function radarScreen(){return null;}\nfunction todayScreen(){return chrome(`${calendarDeadlinePanel()}${occasionPanel()}${todayWork()}`);}')
;
const after55=compass755Bridge().transform(priorFixture,'/repo/client/src/main.js').code;
const finalCode=compass756Bridge().transform(after55,'/repo/client/src/main.js').code;

test('the chain uses .55.2 and the new bridge is last',()=>{
 const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(vite,/compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(finalCode,/COMPASS_CLIENT_VERSION='0\.5\.77\.56'/);
});
test('all transformed JavaScript parses as an ECMAScript module',()=>{
 const file=join(tmpdir(),`compass-v57756-${process.pid}.mjs`);
 writeFileSync(file,finalCode);
 try{execFileSync(process.execPath,['--check',file]);}finally{unlinkSync(file);}
});
test('Focus uses one accessible target icon, not text switch pills',()=>{
 assert.match(finalCode,/class="compass55-mode-switch compass56-mode-switch"/);
 assert.match(finalCode,/class="compass56-mode-button/);
 assert.match(finalCode,/aria-label="\$\{compass55Mode==='focus'\?/);
 assert.doesNotMatch(finalCode,/>Focus<\/button><button/);
});
test('Feelings and nutrition remain actionable in Focus',()=>{
 const css=readFileSync(new URL('../client/src/gtd-workspace-v57756.css',import.meta.url),'utf8');
 assert.match(css,/\.compass55-focus \.fw65-top-trigger/);
 assert.match(css,/\.compass55-focus \.pj92-food-trigger/);
 assert.match(css,/display:inline-flex !important/);
 assert.match(priorFixture,/data-action="feeling-open"|function todayWork\(/); // main source checks separately
});
test('Today uses new working layout without eager intelligence or occasion panels',()=>{
 assert.match(finalCode,/function todayScreen\(\)\{return chrome\(compass56TodayWorkspace\(\)\);\}/);
 assert.match(finalCode,/class="today-layout compass56-today"/);
 assert.match(finalCode,/function compass56RecommendationButton\(\)/);
 assert.match(finalCode,/compass56RecommendationMarkup&&compass56RecommendationDay===selectedDay/);
 assert.match(finalCode,/if\(action==='compass56-recommend'\)/);
 assert.match(finalCode,/if\(action==='compass56-planning'\)/);
});
test('Default Today builds with task list, but zero recommendation, research or occasion computations',()=>{
 const i=finalCode.indexOf('let compass56RecommendationMarkup='),j=finalCode.indexOf('\nfunction todayScreen(){',i);
 assert.ok(i>=0&&j>i);
 const part=finalCode.slice(i,j);
 const calls=[];
 const crash=name=>(()=>{calls.push(name);throw Error('Unexpected default work: '+name);});
 const context={
  selectedDay:'2026-10-25',state:{},todayInspectorOpen:false,calendarToken:false,
  localDateString:()=> '2026-10-25',tasksForDay:()=>[{id:'x',completed:false}],waitingSourceId:()=>false,
  Intl,Date,h:x=>String(x),ico:()=>'<icon>',taskList:()=>'<tasks>',taskCreateForm:()=>'<taskform>',
  calendarRail:()=>'<calendar>',calendarConnectUI:()=>'<connect>',calendarCardRows:crash('calendarRows'),compass55InspectorContent:()=>'<inspector>',
  yesterday710Panel:crash('yesterday'),waiting715TodayPanel:crash('waiting'),calendarDeadlinePanel:crash('deadlines'),
  occasionPanel:crash('occasion'),eventAgendaPanel:crash('eventAgenda'),researchRefreshPanel:crash('research'),
  gtdTodaySummary:crash('review'),todaySmartPanel:crash('recommendations')
 };
 vm.createContext(context);vm.runInContext(part+'\nthis.generated=compass56TodayWorkspace();',context);
 assert.match(context.generated,/class="work-card today-tasks compass56-primary"/);
 assert.match(context.generated,/<tasks>/);
 assert.match(context.generated,/class="compass56-expand"/);
 assert.equal(calls.length,0);
});
test('Optional panels can be turned on, but never precomputed',()=>{
 const i=finalCode.indexOf('let compass56RecommendationMarkup='),j=finalCode.indexOf('\nfunction todayScreen(){',i);
 const part=finalCode.slice(i,j);
 assert.match(part,/compass56PlanningOpen\?`<section class="compass56-extra"/);
 assert.match(finalCode,/compass56RecommendationMarkup=todaySmartPanel\(\)/);
 assert.match(finalCode,/compass56RecommendationMarkup='';compass56RecommendationDay=''/);
});
test('Fail-closed behavior detects changed source structure',()=>{
 assert.throws(()=>compass756Bridge().transform(after55.replace('function todayScreen(){','function myTodayScreen(){'),'/repo/client/src/main.js'),/Today route/);
});
