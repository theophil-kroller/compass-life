import test from 'node:test';
import assert from 'node:assert/strict';
import {strengthPeriod,strengthInsightsView,strengthSummariesWithFit,strengthTrainingDots} from '../client/src/strength-insights-v57728.js';
import {strength729Bridge} from '../client/strength729-bridge.js';
const day='2026-04-10';
const csv=(time,reps,sets)=>({id:`garmin-csv|${time}`,day,start:`${day}T${time}`,sport:19,activityType:'Strength Training',title:'Strength',durationMinutes:15,totalReps:reps,totalSets:sets,source:'garmin-activities-csv',localTimeNoOffset:true});
const csv1=csv('11:45:35',42,3),csv2=csv('12:15:45',30,3);
const base={healthImports:{garminSessions:[csv1,csv2],garminStrength:[]}};
const set=(n,c=0)=>({index:n,exercise:'Bankdrücken',category:c,reps:10,weightKg:15,primary:'chest'});
const fit=(start,sets)=>({id:`strength|${start}`,day,start,end:null,sets,source:'garmin-fit-strength'});
test('2 Garmin Activities-CSV rows are visible as 1 training day, 6 unassigned sets and 72 reps',()=>{
 const m=strengthPeriod(base,{range:'28',today:day});
 assert.equal(m.trainingDays,1);assert.equal(m.sessions.length,2);assert.equal(m.activeSets,6);
 assert.equal(m.unassigned,6);assert.equal(m.knownSets,0);assert.equal(m.csvOnly,2);
 assert.equal(m.csvOnlyReps,72);assert.equal(m.volumeKg,null);
 assert.ok(m.balance.every(b=>!b.notable));
 const html=strengthInsightsView(base,{range:'28',today:day});
 assert.match(html,/2 CSV-Einheit/);assert.match(html,/72 Wiederholungen/);
 assert.match(html,/Aktive Sätze/);assert.match(html,/11:45/);assert.match(html,/12:15/);
 assert.match(html,/Übungen unbekannt/);assert.match(strengthTrainingDots(m),/6 aktive Sätze/);
});
test('CSV is combined with matching UTC FIT session start, no double counting',()=>{
 const withFit={healthImports:{garminSessions:base.healthImports.garminSessions,garminStrength:[fit(`${day}T09:45:35.000Z`,[set(0),set(1)])]}};
 const list=strengthSummariesWithFit(withFit);assert.equal(list.length,2);
 assert.equal(list.filter(x=>x.summaryOnly).length,1);
 const m=strengthPeriod(withFit,{range:'28',today:day});
 assert.equal(m.activeSets,6,'3 csv first, 3 csv second, not 8');
 assert.equal(m.knownSets,2);assert.equal(m.unassigned,4);
 assert.equal(m.csvExtra,1);assert.equal(m.csvOnlySets,3);
});
test('later full FIT replaces CSV missing sets and conserves second session',()=>{
 const state={healthImports:{garminSessions:base.healthImports.garminSessions,garminStrength:[
  fit(`${day}T09:45:35.000Z`,[set(0),set(1),set(2)]),
  fit(`${day}T10:15:45.000Z`,[set(0),set(1),set(2)])
 ]}};
 const m=strengthPeriod(state,{range:'28',today:day});
 assert.equal(m.sessions.length,2);assert.equal(m.activeSets,6);assert.equal(m.knownSets,6);
 assert.equal(m.unassigned,0);assert.equal(m.csvOnly,0);
 assert.equal(m.csvOnlyReps,0);assert.equal(m.volumeKg,900);
});
test('CSV data with no Total Sets remains as valid training day with unknown sets, never fake zero measurements',()=>{
 const blank={healthImports:{garminSessions:[csv('11:45:35',null,null)],garminStrength:[]}};
 const m=strengthPeriod(blank,{range:'7',today:day});
 assert.equal(m.trainingDays,1);assert.equal(m.activeSets,0);
 const html=strengthInsightsView(blank,{range:'7',today:day});
 assert.match(html,/Sätze unbekannt/);
 assert.match(html,/Wiederholungen nicht angegeben/);
 assert.match(html,/Satzanzahl nicht angegeben/);
});
test('update bridge transforms 0.5.77.28 to 0.5.77.29 with guarded validation',()=>{
 const b=strength729Bridge();const id='/repo/client/src/main.js';
 const old="const COMPASS_CLIENT_VERSION='0.5.77.28';";
 assert.match(b.transform(old,id).code,/0\.5\.77\.29/);
 assert.throws(()=>b.transform('other',id),/Basis 0\.5\.77\.28/);
 assert.equal(b.transform('other','/repo/client/src/insights.js'),null);
});

test('Garmin CSV reader bridge preserves real Total Sets and Total Reps, no fake zeros',()=>{
 const b=strength729Bridge();
 const source=`const sport=SPORT[activityType.toLowerCase()]??0,day=at.slice(0,10);
 result.push({distanceUnitAssumed:swim&&rawDistance!==null&&rawDistance>30?'m-converted':'km'});`;
 const transformed=b.transform(source,'/repo/client/src/garmin-activities-csv.js').code;
 assert.match(transformed,/totalSets=validNumber\(field\(row,'total sets'\)/);
 assert.match(transformed,/totalSets,totalReps/);
 assert.throws(()=>b.transform('wrong','/repo/client/src/garmin-activities-csv.js'),/Integrationsanker/);
});
