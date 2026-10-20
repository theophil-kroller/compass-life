import test from 'node:test';
import assert from 'node:assert/strict';
import {sleepStageCurve,sleepEfficiencyRing,renderSleepIntelligence} from '../client/src/sleep-intelligence-v550.js';
import {healthFindings,healthFindingsView,validateHealthModelRank,rankHealthFindingsLocally} from '../client/src/health-intelligence-v551.js';
import {insightsSleepView,buildSleepInsights} from '../client/src/insights.js';
import {readFileSync} from 'node:fs';
const shift=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
function night(day,minutes=420){return {day,sleepMinutes:minutes,totals:{deep:90,rem:80,light:minutes-170},start:new Date(Date.parse(day+'T07:00:00Z')-(minutes+60)*60000).toISOString(),end:day+'T07:00:00Z',stages:[]};}
test('smooth sleep stage SVG has curved Q transitions, genuine gaps disconnected, and all measured times remain',()=>{
 const n=night('2026-10-19');
 n.stages=[{start:'2026-10-19T01:00:00Z',end:'2026-10-19T01:25:00Z',stage:2},{start:'2026-10-19T01:25:00Z',end:'2026-10-19T02:00:00Z',stage:3},{start:'2026-10-19T02:20:00Z',end:'2026-10-19T03:00:00Z',stage:4}];
 const html=sleepStageCurve(n,'UTC');assert.match(html,/sleep553-single-path/);assert.match(html,/ Q /);assert.equal((html.match(/sleep553-single-path/g)||[]).length,2);assert.match(html,/01:25/);
});
test('sleep efficiency SVG renders a ring only for plausible numeric percentages',()=>{
 assert.match(sleepEfficiencyRing(84),/circle/);assert.match(sleepEfficiencyRing(84),/84%/);assert.match(sleepEfficiencyRing(84),/stroke-dasharray/);assert.match(sleepEfficiencyRing(null),/nicht berechenbar/);assert.match(sleepEfficiencyRing(101),/nicht berechenbar/);
});
test('navigation skips missing nights and disables arrows at the ends',()=>{
 const rows=[night('2026-10-12'),night('2026-10-19')];
 const html=renderSleepIntelligence({nights:rows,today:'2026-10-20',selectedNight:'2026-10-19',period:'28'});
 assert.match(html,/Vorherige gemessene Nacht/);assert.match(html,/data-id="2026-10-12"/);assert.match(html,/Nächste gemessene Nacht" title="Nächste gemessene Nacht" disabled|disabled aria-label="Nächste gemessene Nacht"/);
 assert.match(html,/sleep551-efficiency-ring/);
});
test('insight comparisons require sufficient actual nights and explain possible causes rather than diagnose',()=>{
 const rows=[];for(let i=0;i<37;i++)rows.push(night(shift('2026-09-14',i),i>=30?340:450));
 const findings=healthFindings({nights:rows,today:'2026-10-20'});
 assert.ok(findings.some(x=>x.id==='sleep-trend'&&x.kind==='watch'));
 const html=healthFindingsView(findings);assert.match(html,/Mögliche Erklärung/);assert.match(html,/Was bedeutet das für mich/);assert.match(html,/keine Diagnose/);
 assert.equal(healthFindings({nights:[night('2026-10-19')],today:'2026-10-20'}).length,0);
});
test('HRV requires enough days; local model output cannot create new findings',()=>{
 const imported={garminHrv:[...Array.from({length:22},(_,i)=>({day:shift('2026-09-19',i),nightAverageMs:56})),...Array.from({length:7},(_,i)=>({day:shift('2026-10-14',i),nightAverageMs:39}))]};
 const findings=healthFindings({nights:[],imported,today:'2026-10-20'});
 assert.ok(findings.some(f=>f.id==='hrv-change'));assert.match(findings[0].meaning,/keine kritische Gesundheitswarnung/);
 assert.deepEqual(validateHealthModelRank('{"ids":["unknown","hrv-change","hrv-change"]}',findings),['hrv-change']);
 assert.throws(()=>validateHealthModelRank('{"ideas":"you have a disease"}',findings));
});
test('LM Studio is not contacted without explicit call, and only validates IDs in tool result',async()=>{
 let count=0;const f=healthFindings({nights:[],today:'2026-10-20'});assert.equal(count,0);assert.equal(f.length,0);
 const one=[{id:'sleep-stable',observation:'stable',evidence:'30 nights'}];
 const fetcher=async(url)=>{count++;if(url.endsWith('/models'))return {ok:true,json:async()=>({data:[{id:'qwen-local'}]})};return {ok:true,json:async()=>({choices:[{message:{content:'{"ids":["unknown", "sleep-stable"]}'}}]})};};
 assert.deepEqual(await rankHealthFindingsLocally(one,fetcher),['sleep-stable']);assert.equal(count,2);
});
test('real insights link uses vault data and has no new worker endpoint',()=>{
 const data={garminNights:[night('2026-10-19')]};const model=buildSleepInsights(data,'2026-10-20','28');
 const html=insightsSleepView(model,'2026-10-19',()=>'', '2026-10-20',data);
 assert.match(html,/HEALTH INTELLIGENCE/);assert.match(html,/Schlaf im Überblick/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/health551-local-summary/);assert.match(main,/rankHealthFindingsLocally/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.53\.1'/);
});

test('late activity observations require comparison groups and reflect sleep dates rather than calendar guesses',()=>{
 const rows=Array.from({length:65},(_,i)=>night(shift('2026-08-17',i),i%3===0?360:430));
 const sessions=rows.filter((_,i)=>i%3===0).map(n=>({start:new Date(Date.parse(n.start)-120*60000).toISOString(),end:new Date(Date.parse(n.start)-45*60000).toISOString(),day:shift(n.day,-1)}));
 const f=healthFindings({nights:rows,imported:{garminSessions:sessions},today:'2026-10-20'});
 assert.ok(f.some(x=>x.id==='late-activity'));
 assert.match(f.find(x=>x.id==='late-activity').meaning,/kein Nachweis/);
});
test('stress and body battery hints use daily coverage thresholds and do not convert missing points into zeros',()=>{
 const wellness=[];
 for(let i=0;i<38;i++){const day=shift('2026-09-13',i);for(let j=0;j<14;j++)wellness.push({at:`${day}T07:${String(j*3).padStart(2,'0')}:00Z`,stress:i<31?25:65,bodyBattery:i<31?75:43});}
 const f=healthFindings({nights:[],imported:{garminWellness:wellness},today:'2026-10-20'});
 assert.ok(f.some(x=>x.id==='stress-trend'));
 assert.ok(f.some(x=>x.id==='battery-trend'));
 const incomplete=healthFindings({nights:[],imported:{garminWellness:wellness.filter(x=>x.at.slice(11,13)==='06')},today:'2026-10-20'});
 assert.ok(!incomplete.some(x=>x.id==='stress-trend'));
});
