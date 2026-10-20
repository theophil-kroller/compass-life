import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLifeBalanceRadar,validateBalanceGoals,lifeBalanceRadarView} from '../client/src/life-balance-radar-v563.js';
const day='2026-10-20';
const metric=(m,id)=>m.axes.find(a=>a.key===id);
const goals={sleepMinutes:480,stepsDaily:8000,weeklyHours:45,weightKg:null,bodyFatTargetPct:22};
test('Fitdays body fat is always visible; score only after personalized calibration',()=>{
 const imports={fitdays:[{day:'2026-10-17',at:'2026-10-17T08:00:00Z',weightKg:81.4,bodyFatPct:30.7,muscleKg:33.2}]};
 const unset=buildLifeBalanceRadar({healthImports:imports},{today:day});
 assert.equal(metric(unset,'body').score,null);
 assert.match(metric(unset,'body').detail,/30,7 % Körperfett/);
 const set=buildLifeBalanceRadar({healthImports:imports,lifeBalanceGoals:goals},{today:day});
 assert.ok(metric(set,'body').score<100&&metric(set,'body').score>0);
 assert.match(lifeBalanceRadarView(set),/bodyFatTargetPct/);
 const old=buildLifeBalanceRadar({healthImports:{fitdays:[{day:'2026-05-17',weightKg:81.4,bodyFatPct:30.7}]},lifeBalanceGoals:goals},{today:day});
 assert.equal(metric(old,'body').score,null);
 assert.deepEqual(validateBalanceGoals({...goals,bodyFatTargetPct:''}).bodyFatTargetPct,null);
 assert.throws(()=>validateBalanceGoals({...goals,bodyFatTargetPct:70}),/Körperfett/);
});
test('Historical cashflow generates a financial indicator without claiming a verified bank balance',()=>{
 const transactions=[];
 for(const month of ['2026-06','2026-07','2026-08','2026-09']){
  transactions.push({day:`${month}-02`,amountCents:300000,flow:'income',currency:'EUR',category:'Gehalt',description:'Gehalt'});
  transactions.push({day:`${month}-06`,amountCents:-190000,flow:'expense',currency:'EUR',category:'Wohnen',description:'Fixkosten'});
 }
 const m=buildLifeBalanceRadar({financeTransactions:transactions},{today:day});
 assert.ok(metric(m,'finance').score!==null);
 assert.match(metric(m,'finance').detail,/Einnahmenbasis/);
 assert.match(metric(m,'finance').hint,/keine Aussage zur aktuellen Zahlungsfähigkeit/);
 assert.equal(metric(buildLifeBalanceRadar({financeTransactions:transactions},{today:day,historicalOnly:true}),'finance').score,null);
});
test('Relationship Radar 0.5.64 cadence and pause are respected in Life Balance',()=>{
 const call=(id,last,paused=false)=>({id,name:id,contactCadenceDays:30,contactPaused:paused,contactLog:[{id:id+'-1',type:'call',day:last,note:''}]});
 const m=buildLifeBalanceRadar({people:{a:call('a','2026-08-02'),b:call('b','2026-10-18'),c:call('c','2026-01-10',true)}},{today:day});
 assert.equal(metric(m,'people').observed,2);
 assert.equal(metric(m,'people').score,50);
 assert.match(metric(m,'people').hint,/Pause\/Play/);
});

test('Historical body trace does not reuse Fitdays measurements from outside the selected period',()=>{
 const m=buildLifeBalanceRadar({lifeBalanceGoals:goals,healthImports:{fitdays:[{day:'2026-09-25',weightKg:81.4,bodyFatPct:30.7}]}},{today:day,period:7,historicalOnly:true});
 assert.equal(metric(m,'body').score,null);
 assert.match(metric(m,'body').detail,/30,7 % Körperfett/);
});
