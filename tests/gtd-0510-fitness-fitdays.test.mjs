import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodeGarminFit,garminMonitoringFromRecords,garminSessionsFromRecords} from '../client/src/garmin-fit.js';
import {parseGarminFile,commitHealthImport} from '../client/src/health-import.js';
import {joinedFitnessDays,fitnessInsightsView} from '../client/src/insights-fitness.js';
import {fitdaysFigureReport} from '../client/src/fitdays-figure.js';
import {healthBodyView,healthSourcesView} from '../client/src/health-dashboard.js';
import {INSIGHT_TABS} from '../client/src/insights.js';
const epoch=Date.UTC(1989,11,31)/1000,fitAt=s=>Math.round(Date.parse(s)/1000-epoch);
const records=[
 {type:55,fields:{253:fitAt('2026-10-15T08:00:00Z'),5:6,3:230,2:25200,4:600000}},
 {type:55,fields:{253:fitAt('2026-10-15T21:00:00Z'),5:6,3:5294,2:443211,4:5610000}},
 {type:55,fields:{253:fitAt('2026-10-15T21:01:00Z'),5:2,3:50000,2:55555555}},
 {type:55,fields:{253:fitAt('2026-10-15T23:00:00Z'),5:6,3:null,2:null}},
 {type:55,fields:{253:fitAt('2026-10-16T12:00:00Z'),5:6,3:600,2:52211,4:20000}}
];
test('FIT monitoring 55 converts walking steps/distance correctly and never adds snapshots or cycling strokes',()=>{
 const rows=garminMonitoringFromRecords(records);
 assert.equal(rows.length,2);assert.equal(rows[0].steps,5294);assert.equal(rows[0].distanceKm,4.43);assert.equal(rows[0].activeMinutes,93.5);
 assert.equal(rows[1].steps,600);
 assert.equal(garminMonitoringFromRecords([{type:55,fields:{253:fitAt('2026-10-15T08:00:00Z'),5:2,3:5000}}]).length,0);
});
test('FIT rejects invalid snapshots, never stores position, and sessions contain only safe summaries',()=>{
 assert.deepEqual(garminMonitoringFromRecords([{type:55,fields:{253:fitAt('2026-10-15T08:00:00Z'),5:6,3:4294967295,2:-1}}]),[]);
 const sessions=garminSessionsFromRecords([{type:18,fields:{2:fitAt('2026-10-15T12:00:00Z'),253:fitAt('2026-10-15T13:00:00Z'),5:2,8:3600000,9:1679000,11:447,16:125,17:161,0:12345678,1:23456789}}]);
 assert.equal(sessions.length,1);assert.equal(sessions[0].distanceKm,16.79);assert.equal(sessions[0].durationMinutes,60);
 assert.ok(!('position_lat' in sessions[0]));assert.ok(!('lat' in sessions[0]));
});
function fitMessage(global,fields,values){
 const array=[];const u16=n=>[n&255,(n>>8)&255];const u32=n=>[n&255,(n>>8)&255,(n>>16)&255,(n>>24)&255];
 array.push(0x40,0,0,...u16(global),fields.length);
 for(const [number,size,base] of fields)array.push(number,size,base);
 array.push(0);
 for(let i=0;i<fields.length;i++){const n=values[i],size=fields[i][1];array.push(...(size===1?[n]:size===2?u16(n):u32(n)));}
 return array;
}
test('binary FIT decoder reads global 55 monitoring and global 18 session records without GPS fields',async()=>{
 const messages=[...fitMessage(55,[[253,4,0x86],[5,1,0],[3,4,0x86],[2,4,0x86]],[fitAt('2026-10-15T08:00:00Z'),6,5294,443211])];
 const header=[12,0x20,0,0,messages.length,0,0,0,46,70,73,84];const bytes=new Uint8Array([...header,...messages,0,0]);
 const parsed=await parseGarminFile(bytes,'wellness.fit');assert.equal(parsed.fitness[0].steps,5294);assert.equal(parsed.fitness[0].distanceKm,4.43);
 assert.ok(!('garminRoutes' in parsed));
 assert.equal(decodeGarminFit(bytes).filter(x=>x.type===55).length,1);
});
test('bulk re-import is idempotent and supplements local vault without changing prior sleep or Fitdays',()=>{
 const state={healthImports:{fitdays:[{id:'one',day:'2026-10-15',at:'2026-10-15T06:00:00'}],garminNights:[{day:'2026-10-15',stages:[{}]}],garminHrv:[],garminWellness:[],lastImportAt:null}};
 const preview={fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:garminMonitoringFromRecords(records),garminSessions:garminSessionsFromRecords([{type:18,fields:{2:fitAt('2026-10-15T12:00:00Z'),253:fitAt('2026-10-15T13:00:00Z'),8:3600000}}])};
 commitHealthImport(state,preview);commitHealthImport(state,preview);
 assert.equal(state.healthImports.garminFitness.length,2);assert.equal(state.healthImports.garminSessions.length,1);
 assert.equal(state.healthImports.fitdays.length,1);assert.equal(state.healthImports.garminNights.length,1);
});
test('Garmin preferred to Health Connect same-day steps, but independent HC exercise minutes kept',()=>{
 const v={garminFitness:[{day:'2026-10-15',steps:5294,distanceKm:4.43,activeMinutes:93.5}]};
 const joined=joinedFitnessDays(v,[{day:'2026-10-15',steps:6030,exerciseMinutes:42},{day:'2026-10-16',steps:3000,exerciseMinutes:30}],'2026-10-18','7');
 assert.equal(joined[0].steps,5294);assert.equal(joined[0].stepsSource,'Garmin FIT');assert.equal(joined[0].exerciseMinutes,42);
 assert.equal(joined[1].steps,3000);assert.equal(joined[1].stepsSource,'Health Connect');
 const html=fitnessInsightsView(v,[{day:'2026-10-15',steps:6030,exerciseMinutes:42}],'7','2026-10-18');
 assert.match(html,/Schritte im Zeitverlauf/);assert.match(html,/Health Connect/);assert.match(html,/niemals addiert/);
});
test('Fitdays human silhouette labels five authentic regions, kg vs reference percentages and graceful missing data',()=>{
 const regions=Object.fromEntries(['rightArm','leftArm','trunk','rightLeg','leftLeg'].map((x,i)=>[x,{kg:1.4+i,relativePct:95+i*3}]));
 const entry={at:'2026-10-15T06:00:00',day:'2026-10-15',weightKg:85,bodyFatPct:24,segmentFat:regions,segmentMuscle:regions};
 const html=fitdaysFigureReport(entry);
 for(const k of ['Rechter Arm','Linker Arm','Rumpf','Rechtes Bein','Linkes Bein'])assert.match(html,new RegExp(k));
 assert.match(html,/95 % Referenz/);assert.match(html,/1,4 kg/);assert.match(html,/svg/);
 assert.doesNotMatch(html,/Körperfettanteil dieser Region ist/);
 const body=healthBodyView({fitdays:[entry]},90);assert.match(body,/Mein Körper im Detail/);assert.match(body,/Segmentwerte auch als Balken/);
 assert.match(healthSourcesView({garminFitness:[{day:'2026-10-15',steps:5294}]}),/Garmin-Aktivitätstage/);
});
test('0.5.10 routes activity tab to Garmin+Health Connect and leaves cloud and worker untouched',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.68\.1'/);
 assert.match(main,/fitnessInsightsView\(state\?\.healthImports/);
 assert.equal(INSIGHT_TABS.find(x=>x.id==='activity').state,'live');
});
