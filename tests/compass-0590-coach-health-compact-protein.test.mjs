import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {strengthCoachHealthContext,coachSleepMinutes90} from '../client/src/strength-coach-recovery-v5775926.js';
import {coachHealthCoverage90,coachHealthCoverageMarkup90} from '../client/src/coach-health-coverage-v0590.js';
import {proteinTodayMarkup88,addOpenFood88} from '../client/src/coach-integration-v0588.js';
const src=file=>readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
const day=(n)=>new Date(Date.parse('2026-11-01T12:00:00Z')-n*86400000).toISOString().slice(0,10);
const sleep=(age,minutes=460)=>({day:day(age),totals:{deep:100,light:minutes-180,rem:80},at:`${day(age)}T08:10:00Z`});
const hrv=(age,ms=55)=>({day:day(age),nightAverageMs:ms});
const ctx=(nights,hrvs=[])=>strengthCoachHealthContext({healthImports:{garminNights:nights,garminHrv:hrvs}},{today:day(0)});
test('Garmin stage totals are accepted; user history is not falsely reported as missing',()=>{
 const nights=[sleep(0),sleep(1),...Array.from({length:35},(_,i)=>sleep(i+3))];
 const m=ctx(nights);assert.equal(m.sleep.usable,true);assert.equal(m.sleep.recentCount,2);assert.equal(m.sleep.baselineCount,35);assert.equal(m.sleep.recentMinutes,460);assert.equal(m.sleep.totalDays,37);
});
test('Direct sleepMinutes remains supported without overwriting Garmin stages',()=>{
 assert.equal(coachSleepMinutes90({sleepMinutes:410,totals:{deep:40,light:180,rem:45}}),410);
 assert.equal(coachSleepMinutes90({totals:{deep:45,light:240,rem:90}}),375);
 assert.equal(coachSleepMinutes90({totals:{deep:null,light:null,rem:null}}),null);
});
test('Imported year of Garmin sleep remains visible when last 45 days have no observations',()=>{
 const nights=Array.from({length:365},(_,i)=>sleep(i+65));
 const m=ctx(nights);assert.equal(m.sleep.usable,false);assert.equal(m.sleep.totalDays,365);assert.equal(m.sleep.recentCount,0);assert.equal(m.sleep.baselineCount,0);
 const v=coachHealthCoverage90(m.sleep,{kind:'sleep'});assert.match(v.history,/365 Tage im Garmin-Archiv/);assert.match(v.main,/365 historische Nächte/);assert.match(v.status,/Aktuelle Datenlücke/);
});
test('A single recent HRV night does not count as a valid comparison despite baseline 40 nights',()=>{
 const m=ctx([], [hrv(0),...Array.from({length:40},(_,i)=>hrv(i+3))]);
 assert.equal(m.hrv.usable,false);assert.equal(m.hrv.recentCount,1);assert.equal(m.hrv.baselineCount,40);
 const v=coachHealthCoverage90(m.hrv,{kind:'hrv'});
 assert.match(v.main,/55 ms · vorläufig/);assert.match(v.comparison,/1\/2/);assert.match(v.history,/41 Tage/);
});
test('Missing nights do not become zero recovery scores',()=>{
 const m=ctx([]);assert.equal(m.sleep.recentMinutes,null);assert.equal(m.sleep.usable,false);assert.equal(m.status,'insufficient');
 const html=coachHealthCoverageMarkup90(m.sleep,{kind:'sleep'});assert.doesNotMatch(html,/Zu wenig Werte|0 min/);assert.match(html,/Keine Messungen/);
});
test('Duplicate Garmin observations from same calendar day do not inflate sleep reference',()=>{
 const nights=[sleep(0),sleep(1),sleep(3),{...sleep(3),at:day(3)+'T09:00:00Z'},...Array.from({length:9},(_,i)=>sleep(i+4))];
 const m=ctx(nights);assert.equal(m.sleep.baselineCount,10);assert.equal(m.sleep.usable,true);
});
test('Main coach uses source-compatible recovery context and descriptive coverage',()=>{
 const main=src('strength-coach-v5775910.js');assert.match(main,/coachHealthCoverageMarkup90\(plan.health.sleep/);assert.match(main,/coachHealthCoverageMarkup90\(plan.health.hrv/);assert.doesNotMatch(main,/:'Zu wenig Werte'/);
});
test('Protein compact view keeps partial ledger and quick food action',()=>{
 const state={healthImports:{fitdays:[]},nutritionJournal:{entries:[],customFoods:[]}};
 const markup=proteinTodayMarkup88(state,day(0),{compact:true});assert.match(markup,/ci90-protein-peek/);assert.match(markup,/Noch keine Proteinwerte/);assert.match(markup,/Erfasste Teilbilanz/);assert.match(markup,/ci88-food-open/);
 const at=day(0)+'T12:00:00Z';addOpenFood88(state,{title:'Testfood',at,nutrients:{protein:24.5}});
 assert.match(proteinTodayMarkup88(state,day(0),{compact:true}),/24,5/);
});
test('Today no longer renders full-width protein banner and instead renders it in right rail',()=>{
 const main=src('main-full-v57759402510.js');
 assert.match(main,/proteinTodayMarkup88\(state,selectedDay,\{compact:true\}\)/);
 assert.match(main,/chrome\(mensaTodayCompact\(\)\+workspace\)/);
 assert.match(main,/if\(action==='ci88-food-open'\)\{if\(tab==='today'\)/);
 assert.match(main,/if\(action==='compass56-recommend'\)/);
});
test('Right rail protein disappears for open recommendation or task inspector',()=>{
 const main=src('main-full-v57759402510.js');
 assert.match(main,/todayInspectorOpen&&state\?\.tasks/);
 assert.match(main,/compass56RecommendationMarkup&&compass56RecommendationDay===selectedDay\?compass56RecommendationPanel\(\):compass56RecommendationButton\(\)/);
 const styles=src('gtd-workspace-v57756.css');assert.match(styles,/ci90-protein-peek/);assert.match(styles,/@media\(max-width:760px\)/);
});
