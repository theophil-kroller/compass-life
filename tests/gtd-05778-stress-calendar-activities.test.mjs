import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildWellnessInsights,insightsStressView} from '../client/src/insights-wellness.js';
import {buildStressContext,stressContextView,stressBand} from '../client/src/stress-context-v5778.js';
const day='2026-10-19';
const local=(hour,minute=0)=>new Date(`${day}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00`).toISOString();
const point=(hour,minute,stress)=>({at:local(hour,minute),stress,bodyBattery:65});
const importData={garminWellness:[point(8,0,18),point(9,0,36),point(10,0,65),point(11,0,87),point(11,5,92),point(11,10,88),point(18,0,82)]};
const meeting={id:'m1',summary:'Jour fixe <Forschung>',start:{dateTime:local(10,45)},end:{dateTime:local(11,15)}};
const future={id:'future',summary:'Späteres Meeting',start:{dateTime:local(12,0)},end:{dateTime:local(12,30)}};
const full={start:'2026-10-01',end:'2026-10-31',complete:true};
const data=()=>buildWellnessInsights(importData,day,'7');
test('low medium high groups join actual timestamps to calendar and recorded activity without filling holes',()=>{
 const result=buildStressContext({model:data(),calendarEvents:[meeting,future],calendarCoverage:full,activities:[{id:'a',title:'Schreibtisch Fokus',startedAt:`${day}T10:50`,durationMinutes:35,category:'Arbeit'}]});
 assert.deepEqual(result.bands.map(b=>b.count),[1,1,1,4]);
 const high=result.bands.find(b=>b.id==='high');assert.equal(high.calendarCount,3);assert.equal(high.activityCount,3);assert.equal(high.covered,4);
 assert.equal(high.calendar[0].title,'Jour fixe <Forschung>');assert.ok(!high.calendar.some(x=>x.title==='Späteres Meeting'));
 assert.equal(result.episodesCount,2);assert.equal(result.recentPeaks[0].peak,82);assert.equal(result.recentPeaks[1].peak,92);
 assert.equal(result.recentPeaks[1].calendar[0].title,'Jour fixe <Forschung>');
 const html=stressContextView(result);assert.match(html,/Ruhe/);assert.match(html,/Niedrig/);assert.match(html,/Mittel/);assert.match(html,/Hoch/);
 assert.match(html,/Jour fixe &lt;Forschung&gt;/);assert.doesNotMatch(html,/<Forschung>/);
 assert.match(html,/Schreibtisch Fokus/);
});
test('calendar gaps are unknown, not absence of appointments or 0 calendar activity',()=>{
 const result=buildStressContext({model:data(),calendarEvents:[],calendarCoverage:{start:'2026-10-01',end:'2026-10-18',complete:true}});
 assert.equal(result.incompleteDays,1);assert.equal(result.knownDays,0);
 assert.equal(result.bands.find(b=>b.id==='high').covered,0);
 assert.match(stressContextView(result),/Kalenderabdeckung fehlt/);
 assert.match(stressContextView(result),/Kalenderdaten sind nur für 0 von 1/);
});
test('all-day, cancelled, invalid or hidden calendar events are excluded; unzoned Garmin CSV labeled uncertain',()=>{
 const cancelled={...meeting,id:'c',status:'cancelled'};
 const allDay={id:'all',summary:'Urlaub',start:{date:day},end:{date:'2026-10-20'}};
 const hidden={...meeting,id:'hide',summary:'Privat'};
 const result=buildStressContext({model:data(),calendarEvents:[cancelled,allDay,hidden],calendarCoverage:full,overrides:{hide:{hidden:true}},garminSessions:[{id:'garmin',title:'Zouk Training',start:`${day}T10:59:00`,durationMinutes:25,localTimeNoOffset:true}]});
 assert.equal(result.bands.find(b=>b.id==='high').calendarCount,0);
 assert.equal(result.bands.find(b=>b.id==='high').activityCount,3);
 assert.equal(result.activityCsvUnzoned,true);
 assert.match(stressContextView(result),/Zeitzonenangabe/);
});
test('invalid values and missing samples never become stress zeros; only matched timed sessions count',()=>{
 assert.equal(stressBand(null),null);assert.equal(stressBand(-1),null);assert.equal(stressBand(0),'rest');assert.equal(stressBand(50),'low');assert.equal(stressBand(75),'medium');assert.equal(stressBand(76),'high');
 const result=buildStressContext({model:buildWellnessInsights({garminWellness:[{at:local(11),stress:null},{at:local(11,5),stress:-2}]},day,'7'),calendarCoverage:full});
 assert.equal(result.bands.reduce((s,b)=>s+b.count,0),0);
});
test('stress page receives contexts, without API changes or sending calendar titles to remote services',()=>{
 const html=insightsStressView(importData,'7',day,'','day',14,0,{calendarEvents:[meeting],calendarCoverage:full,activities:[]});
 assert.match(html,/Was war bei meinen Stresswerten los/);assert.match(html,/Belastungsstufen/);assert.match(html,/Hohe Stressphasen/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.\d+(?:\.\d+)*'/);
 assert.match(main,/calendarCoverage,calendarConnected:Boolean\(calendarToken&&Date\.now\(\)<calendarExpires\),activities:activeActivities\(watchSessions,state\)/);
});
