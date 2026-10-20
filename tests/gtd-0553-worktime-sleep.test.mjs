import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseWorktimeWorkbook,mergeWorktime,remainingVacation,worktimeWeeks,worktimeMonths,worktimeView} from '../client/src/worktime-v553.js';
import {sleepStageCurve} from '../client/src/sleep-intelligence-v550.js';
import {renderSleepYearDistribution} from '../client/src/sleep-year-v552.js';
function sheet(hours={}){const a=Array.from({length:31},()=>[]);for(const [day,row] of Object.entries(hours)){const c=Number(day);a[9][c]=row.start??null;a[12][c]=row.end??null;a[26][c]=row.hours??0;a[29][c]=row.balance??0;a[23][c]=row.za??0;a[24][c]=row.vacation??0;}return a;}
test('xlsx template uses sheet-name date, not stale cached date row; future and incomplete today excluded',()=>{
 const oct=sheet({'18':{hours:7,start:.4,end:.7,balance:128},'19':{hours:9,start:.375,end:.75,balance:125.7667},'20':{hours:6.5,start:.48,end:.75,balance:124.266},'21':{hours:8,start:.4,end:.9,balance:132}});oct[7][1]=42767;
 const result=parseWorktimeWorkbook({'2026_Okt':oct,'2026_Nov':sheet({'01':{hours:8,start:.4,end:.7,balance:136}}),'Graphical Analysis':[]},{today:'2026-10-20',nowMinutes:800});
 assert.deepEqual(result.days.map(d=>d.day),['2026-10-18','2026-10-19']);assert.equal(result.lastBalance.hours,125.7667);
});
test('completed current day may be included and future sheet ignored',()=>{const r=parseWorktimeWorkbook({'2026_Okt':sheet({'20':{hours:6,start:.42,end:.66,balance:130}})},{today:'2026-10-20',nowMinutes:1000});assert.equal(r.days[0].day,'2026-10-20');});
test('reimport updates days idempotently and leaves later vacation baseline intact',()=>{
 const a={days:[{day:'2026-10-21',hours:6,vacationDays:1,overtimeBalance:131}],vacation:{balanceHours:192,asOf:'2026-10-20',hoursPerDay:8}};
 const b=mergeWorktime(a,{days:[{day:'2026-10-21',hours:7,vacationDays:1,overtimeBalance:132}],sheets:[{name:'2026_Okt'}]});
 assert.equal(b.days.length,1);assert.equal(b.days[0].hours,7);assert.equal(b.lastBalance.hours,132);assert.equal(remainingVacation(b,'2026-10-21').hours,184);
 const c=mergeWorktime(b,{days:[],sheets:[]});assert.equal(c.days.length,1);assert.equal(c.vacation.balanceHours,192);
});
test('weeks are true Monday weeks and monthly values sum daily actual hours without workbook chart',()=>{
 const x=[{day:'2026-03-23',hours:12},{day:'2026-03-24',hours:11},{day:'2026-03-29',hours:15},{day:'2026-03-30',hours:10}];
 assert.deepEqual(worktimeWeeks(x,2026).map(w=>[w.start,w.hours]),[['2026-03-23',38],['2026-03-30',10]]);
 assert.equal(worktimeMonths(x,2026)[2].hours,48);assert.match(worktimeView({days:x,lastBalance:{day:'2026-03-30',hours:120}},2026,35),/4-Wochen-Trend/);
});
test('worktime UI has importer and explicit balance controls not recomputed from load curve',()=>{const html=worktimeView({days:[]},2026);assert.match(html,/work553-file/);assert.match(worktimeView({days:[]},2026,45,{days:[{day:'2026-10-19'}],sheets:[{name:'2026_Okt'}],issues:[],lastBalance:null,lastRecorded:'2026-10-19'}),/worktime-confirm/);assert.match(html,/work553-vacation-form/);assert.match(html,/Überzeitguthaben/);});
test('sleep stage chart uses single gradient stroke with no painted-on horizontal overlays',()=>{
 const n={start:'2026-10-19T22:00:00Z',end:'2026-10-20T05:00:00Z',stages:[{stage:2,start:'2026-10-19T22:00:00Z',end:'2026-10-19T23:00:00Z'},{stage:3,start:'2026-10-19T23:00:00Z',end:'2026-10-20T00:00:00Z'},{stage:4,start:'2026-10-20T00:00:00Z',end:'2026-10-20T01:00:00Z'}]};
 const html=sleepStageCurve(n,'Europe/Vienna');assert.match(html,/linearGradient/);assert.match(html,/stroke="url\(#sleep553-stage-0\)"/);assert.match(html,/ Q /);assert.equal((html.match(/<path\b/g)||[]).length,1);assert.doesNotMatch(html,/horizontal overlays/);
});
test('annual month/week plots use seasonal colors and day dots provide 28-day trend',()=>{
 const days=Array.from({length:50},(_,i)=>({day:new Date(Date.UTC(2026,6,1+i)).toISOString().slice(0,10),sleepMinutes:360+i%8*12}));
 assert.match(renderSleepYearDistribution(days,'2026-08-31','month'),/Sommer/);
 assert.match(renderSleepYearDistribution(days,'2026-08-31','week'),/Box = mittlere 50/);
 const html=renderSleepYearDistribution(days,'2026-08-31','day');assert.match(html,/28-Tage-Median/);assert.match(html,/Jahres-IQR/);
});
test('actual main entry binds worktime and week navigation to existing insights UI',()=>{const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');assert.match(main,/insights-week-shift/);assert.match(main,/worktime-confirm/);assert.match(main,/worktimeView\(state\?\.workTime/);});
