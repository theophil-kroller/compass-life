import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isGarminActivitiesCsv,parseGarminActivitiesCsv} from '../client/src/garmin-activities-csv.js';
import {inspectHealthFiles,commitHealthImport} from '../client/src/health-import.js';
import {summarizeSports} from '../client/src/sports-insights.js';
import {LIFE_AREAS,validateLifeGoal,lifeGoals} from '../client/src/life-intelligence-v22.js';
const csv='Activity Type,Date,Favorite,Title,Distance,Calories,Time,Avg HR,Max HR\r\nCycling,2026-10-18 21:00:00,false,"Bike, return",3.61,240,00:38:39,100,125\r\nOther,2026-10-18 19:57:25,false,Graz Dancing,1.11,377,01:03:09,100,153\r\nDisc Golf,2026-10-17 16:47:31,false,Graz Disc Golf,2.24,444,01:17:09,101,172\r\n';
const file=(name,data)=>({name,size:Buffer.byteLength(data),arrayBuffer:async()=>Uint8Array.from(Buffer.from(data)).buffer});
test('0.5.22.1 Garmin Activities header is detected, not mistaken for Fitdays',async()=>{
 assert.equal(isGarminActivitiesCsv(csv),true);
 assert.equal(isGarminActivitiesCsv('Date,Weight\n...'),false);
 const p=await inspectHealthFiles([file('Activities.csv',csv)]);
 assert.equal(p.errors.length,0);assert.equal(p.processed,1);assert.equal(p.fitdays.length,0);assert.equal(p.garminSessions.length,3);
 const s={};commitHealthImport(s,p);commitHealthImport(s,p);assert.equal(s.healthImports.garminSessions.length,3);
});
test('0.5.22.1 Garmin CSV accepts quotes and durations; records explicit source and unit uncertainty',()=>{
 const rows=parseGarminActivitiesCsv(csv);assert.equal(rows.length,3);assert.equal(rows[0].title,'Bike, return');
 assert.equal(rows[0].durationMinutes,38.7);assert.equal(rows[0].distanceKm,3.61);
 assert.equal(rows[0].localTimeNoOffset,true);assert.equal(rows[0].distanceUnitAssumed,'km');
 assert.equal(rows[2].source,'garmin-activities-csv');
});
test('0.5.22.1 sport summary recognizes dancing and disc golf titles in Garmin CSV',()=>{
 const r=summarizeSports(parseGarminActivitiesCsv(csv),[],{start:'2026-10-01',end:'2026-10-19'});
 assert.ok(r.some(x=>x.type==='dancing'&&x.count===1));assert.ok(r.some(x=>x.type==='disc'&&x.count===1));assert.ok(r.some(x=>x.type==='cycling'&&x.count===1));
});
test('0.5.22.1 malformed row cannot be interpreted as Garmin activity or become Fitdays',()=>{
 assert.throws(()=>parseGarminActivitiesCsv('Date,Weight\n2026-10-18,80'),/Garmin-Activities/);
 assert.throws(()=>parseGarminActivitiesCsv(csv.replace('2026-10-18 21:00:00','no-date').replace('2026-10-18 19:57:25','no-date').replace('2026-10-17 16:47:31','no-date')),/keine verwertbaren/);
});
test('0.5.22.1 seven areas optional and independent of Compass task category',()=>{
 assert.equal(LIFE_AREAS.length,7);assert.equal(new Set(LIFE_AREAS.map(x=>x[0])).size,7);
 const goal={id:'00000000-0000-4000-8000-000000000111',title:'Dissertation',area:'Forschung',status:'active',projectIds:[],targetDate:null};
 assert.equal(validateLifeGoal(goal),true);assert.equal(validateLifeGoal({...goal,lifeArea:'mental'}),true);
 assert.equal(validateLifeGoal({...goal,lifeArea:'nonsense'}),false);assert.equal(lifeGoals({lifeGoals:[goal]}).length,1);
});
test('0.5.22.1 real link exposed in both source panels; version correct',()=>{
 const h=readFileSync(new URL('../client/src/health-dashboard.js',import.meta.url),'utf8');
 const r=readFileSync(new URL('../client/src/review-import-hub.js',import.meta.url),'utf8');
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const src of [h,r])assert.match(src,/https:\/\/connect\.garmin\.com\/app\/activities/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.62'/);
 assert.match(main,/name="lifeArea"/);assert.match(main,/data-action="life-goal-area"/);
});
