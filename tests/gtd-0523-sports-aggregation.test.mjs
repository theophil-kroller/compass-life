import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {summarizeSports,sportsInsightsView} from '../client/src/sports-insights.js';
import {fitnessInsightsView} from '../client/src/insights-fitness.js';
import {parseGarminActivitiesCsv} from '../client/src/garmin-activities-csv.js';

const csv='Activity Type,Date,Title,Distance,Time,Calories\nCycling,2026-10-18 16:12:00,City Cycling,6.5,00:38:00,220\nCycling,2026-10-17 15:00:00,City Cycling,12.0,01:04:00,390\nOther,2026-10-17 20:00:00,Graz Dancing,--,01:30:00,300\nDisc Golf,2026-10-16 11:00:00,Disc Golf,--,01:15:00,100\nOther,2026-10-15 19:00:00,Sauna,--,00:40:00,80\n';
const imported={garminSessions:parseGarminActivitiesCsv(csv)};
test('0.5.23 per-sport aggregates count/time/km without guessing missing distances',()=>{
 const types=new Map(summarizeSports(imported.garminSessions,[],{start:'2026-10-01',end:'2026-10-19'}).map(x=>[x.type,x]));
 const cycling=types.get('cycling');
 assert.equal(cycling.count,2);assert.equal(cycling.minutes,102);assert.equal(cycling.distanceKm,18.5);
 assert.equal(types.get('dancing').count,1);assert.equal(types.get('dancing').minutes,90);
 assert.equal(types.get('disc').count,1);assert.equal(types.get('sauna').count,1);
 assert.equal(types.get('sauna').measuredDistance,false);
 assert.equal(summarizeSports(imported.garminSessions,[],{start:'2026-10-18',end:'2026-10-18'})[0].count,1);
});
test('0.5.23 Garmin Activities CSV reimport is idempotent when merged',async()=>{
 const {inspectHealthFiles,commitHealthImport}=await import('../client/src/health-import.js');
 const file={name:'Activities.csv',size:Buffer.byteLength(csv),arrayBuffer:async()=>Uint8Array.from(Buffer.from(csv)).buffer};
 const preview=await inspectHealthFiles([file]);const state={};commitHealthImport(state,preview);commitHealthImport(state,preview);
 assert.equal(state.healthImports.garminSessions.length,5);
});
test('0.5.23 aggregate is shown first and session detail list remains collapsible',()=>{
 const html=fitnessInsightsView(imported,[],'all','2026-10-19');
 const aggregate=html.indexOf('Wofür verwende ich meine Zeit?');
 const list=html.indexOf('Einzelne Garmin-Trainings ansehen');
 assert.ok(aggregate>=0&&list>aggregate);
 assert.match(html,/<details class="insight-chart-card fitness-sessions-details">/);
 assert.match(html,/2 Einheiten · Ø 51 min/);
 assert.match(html,/18,5 km gemessen/);
 assert.match(html,/Keine Distanz erfasst/);
 assert.equal((html.match(/City Cycling/g)||[]).length,2);
});
test('0.5.23 rendered session details escape CSV titles',()=>{
 const imported2={garminSessions:[{id:'x',title:'<img src=x onerror=alert(1)>',day:'2026-10-18',start:'2026-10-18T12:00:00',durationMinutes:12,distanceKm:null,avgHr:null,source:'garmin-activities-csv',localTimeNoOffset:true}]};
 const html=fitnessInsightsView(imported2,[],'all','2026-10-19');
 assert.doesNotMatch(html,/<img src=x/);
 assert.match(html,/&lt;img src=x/);
});
