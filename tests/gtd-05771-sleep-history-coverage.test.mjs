import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sleepConsistencyChart,buildSleepInsights,sleepDataProvenance} from '../client/src/insights.js';
import {sleepArchiveWindow,renderSleepIntelligence} from '../client/src/sleep-intelligence-v550.js';
import {commitHealthImport} from '../client/src/health-import.js';
const day=(d,minutes=405)=>({day:d,sleepMinutes:minutes,start:`${d}T00:10:00Z`,end:`${d}T07:00:00Z`,stages:[],totals:{deep:75,light:minutes-150,rem:75}});
test('Sleep consistency never draws observations outside visible axis; no hidden 220-night cap',()=>{
 const all=[{day:'2025-07-14',bedMinutes:1410,wakeMinutes:1850},{day:'2026-10-01',bedMinutes:1390,wakeMinutes:1825},{day:'2026-10-21',bedMinutes:1400,wakeMinutes:1850}];
 const monthly=sleepConsistencyChart(all,{start:'2026-10-01',end:'2026-10-22'});
 assert.match(monthly,/2 tatsächlich gezeichnete Nächte/);assert.doesNotMatch(monthly,/14\. Juli/);
 const many=Array.from({length:440},(_,i)=>({...all[0],day:new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10)}));
 const yearly=sleepConsistencyChart(many,{start:'2025-01-01',end:'2026-10-22'});
 assert.match(yearly,/440 tatsächlich gezeichnete Nächte/);
 assert.equal((yearly.match(/fill="#657AAE"><title>/g)||[]).length,440);
});
test('The prior annual window contains July 2025 even when current window starts November',()=>{
 const nights=[day('2025-07-15'),day('2025-10-10'),day('2025-12-04'),day('2026-10-21')];
 const current=sleepArchiveWindow(nights,'2026-10-22');
 assert.equal(current.start,'2025-11-01');assert.equal(current.older,true);assert.equal(current.count,2);
 const previous=sleepArchiveWindow(nights,'2026-10-22','2025-10-22');
 assert.equal(previous.start,'2024-11-01');assert.equal(previous.count,2);assert.equal(previous.older,false);assert.equal(previous.newer,true);
 const html=renderSleepIntelligence({nights,period:'365',today:'2026-10-22',yearAnchor:'2025-10-22'});
 assert.match(html,/2024-11 – 2025-10/);assert.match(html,/2025-07-15/);
 assert.doesNotMatch(html,/2026-10-21 · 6 h/);
 assert.match(html,/data-action="insights-year-window" data-id="next"/);
 assert.match(html,/data-action="insights-year-mode" data-id="day"/);
 assert.match(html,/365-Tage-Kalender/);
});
test('Vault provenance distinguishes stored, measurable, selected and import time',()=>{
 const imported={garminNights:[day('2025-07-15'),day('2026-10-21'),{day:'2025-08-11',totals:{}}],lastImportAt:'2026-10-22T12:00:00.000Z'};
 const model=buildSleepInsights(imported,'2026-10-22','28','Europe/Vienna');
 const html=sleepDataProvenance(model,imported);
 assert.match(html,/3 gespeicherte Nächte/);assert.match(html,/2 mit auswertbarer Schlafdauer/);
 assert.match(html,/2025-07-15 – 2026-10-21/);assert.match(html,/Aktuelle Auswahl: 1 auswertbare Nächte/);
 assert.match(html,/1 gespeicherte Einträge ohne auswertbare Schlafdauer/);
});
test('Garmin backfill merges older July nights without replacing October records',()=>{
 const s={healthImports:{fitdays:[],garminNights:[day('2026-10-20')],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]}};
 commitHealthImport(s,{fitdays:[],garminNights:[day('2025-07-01')],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]});
 assert.deepEqual(s.healthImports.garminNights.map(n=>n.day),['2025-07-01','2026-10-20']);
 assert.ok(s.healthImports.lastImportAt);
});
test('Main has independent year paging action, preserving granularity buttons',()=>{
 const src=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(src,/action==='insights-year-window'/);assert.match(src,/action==='insights-year-mode'/);
 assert.match(src,/insightYearAnchor/);assert.match(src,/COMPASS_CLIENT_VERSION='0\.5\.77\.(?:7|8|9|10)'/);
});
