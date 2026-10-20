import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {recoveryCandidates,recoveryEvidence,recoveryView} from '../client/src/recovery-timeoff-v554.js';
import {worktimeView} from '../client/src/worktime-v553.js';
const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const from='2026-10-20',day='2026-10-22';
const dateMs=(d,h)=>Date.parse(`${d}T${String(h).padStart(2,'0')}:00:00Z`);
const S={id:'id',projectId:'p',title:'Korrekturen',estimateMinutes:200,workflow:'next',completed:false,archived:false,dueDate:'2026-10-23',contextTags:[]};
const baseState=(estimate=200)=>({projects:{p:{id:'p',kind:'project',status:'active'}},tasks:{id:{...S,estimateMinutes:estimate}},workTime:{lastBalance:{day:from,hours:125.76},vacation:{balanceHours:192,asOf:from,hoursPerDay:8},days:[]},uiPreferences:{dailyPlanBlocks:[]}});
function forecast(minutes=240){
 const days=[{day:from,minutes:0,workMinutes:0,off:true},{day:'2026-10-21',minutes:300,workMinutes:480,off:false},{day,minutes,workMinutes:480,off:false},{day:'2026-10-23',minutes:60,workMinutes:480,off:false}];
 const slots=days.filter(d=>!d.off).map(d=>({day:d.day,start:dateMs(d.day,9),end:dateMs(d.day,9)+d.minutes*60000,minutes:d.minutes}));
 return {status:'ready',from,through:'2026-10-23',days,slots,totalMinutes:slots.reduce((s,x)=>s+x.minutes,0),source:'Google Calendar'};
}
test('Clicking a project reopens its hierarchy and visible inspector; Today remains an independent action',()=>{
 assert.match(source,/if\(action==='project-select'\)\{[\s\S]*?projectCollapsed\.delete\(id\);selectedProjectId=id;selectedTaskId=null;/);
 assert.match(source,/const details=app\.querySelector\('\.project-properties'\);if\(details\)details\.open=true/);
 assert.match(source,/<details class="project-properties" open>/);
 assert.match(source,/data-action="project-select"/);
 assert.match(source,/data-action="tree-plan-today"/);
 assert.match(css,/\.tree-line\.fin43-project-row \.tree-label:hover/);
});
test('Month labels cover all twelve months at actual calendar positions, with KW hover information',()=>{
 const days=Array.from({length:12},(_,i)=>({day:`2026-${String(i+1).padStart(2,'0')}-14`,hours:40,overtimeBalance:10}));
 const chart=worktimeView({days,lastBalance:{day:from,hours:10}},2026,45,null,from);
 for(const month of ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'])assert.match(chart,new RegExp(`>${month}<`));
 assert.match(chart,/KW \d+ · 2026-/);
});
test('Recommender never claims safe without current complete calendar or known balances',()=>{
 const s=baseState();let r=recoveryCandidates(s,{status:'stale'}, {today:from});assert.equal(r.status,'unavailable');
 r=recoveryCandidates({...s,workTime:{}},forecast(),{kind:'vacation',today:from});assert.equal(r.status,'unknown-balance');
 r=recoveryCandidates(s,forecast(),{kind:'za',today:from});assert.equal(r.status,'ready');assert.ok(r.options.length>0);assert.equal(r.options[0].remainingHours,117.76);
});
test('Time-off simulation compares with same baseline: a short deadline window becomes at risk',()=>{
 const s=baseState(700),f=forecast(300);
 const r=recoveryCandidates(s,f,{today:from,kind:'za'});
 assert.ok(r.options.some(x=>x.rating==='risk'||x.rating==='uncertain'));
 assert.ok(r.options.every(x=>x.needsApproval&&x.remainingHours===117.76));
 assert.equal(s.tasks.id.plannedDate,undefined);assert.equal(s.workTime.lastBalance.hours,125.76);
});
test('Missing task estimates yield uncertainty, not green feasible',()=>{
 const r=recoveryCandidates(baseState(null),forecast(),{today:from});
 assert.equal(r.options[0].rating,'uncertain');assert.ok(r.options[0].unknownCount>0);
});
test('Existing manual day block downgrades confidence; vacation and ZA are read-only',()=>{
 const s=baseState(50);s.uiPreferences.dailyPlanBlocks=[{day,start:dateMs(day,9),end:dateMs(day,10),done:false}];
 const r=recoveryCandidates(s,forecast(),{today:from,kind:'vacation'});
 const d=r.options.find(x=>x.day===day);assert.equal(d.rating,'uncertain');assert.equal(d.alreadyPlanned,1);
 assert.match(recoveryView(r,recoveryEvidence({},[],from),{kind:'vacation',open:true}),/keine Kalenderänderung/);
});
test('Work hours and sleeping patterns are factual trends, not medical diagnoses',()=>{
 const nights=Array.from({length:18},(_,i)=>({day:new Date(Date.parse('2026-09-26T12:00:00Z')+i*86400000).toISOString().slice(0,10),sleepMinutes:420}));
 const e=recoveryEvidence({},nights,from,45);
 assert.equal(e.sleepDown,false);assert.equal(e.workElevated,false);assert.match(e.message,/kein|Kein/);
});
