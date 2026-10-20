import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {personalConnections,personalConnectionsView} from '../client/src/personal-connections-v566.js';
const day=i=>`2026-10-${String(i).padStart(2,'0')}`;
const check=(d,items)=>({id:`test-${d}`,day:day(d),at:day(d)+'T18:00:00Z',items});
const fixture=()=>({
 feelingCheckins:[
  ...[2,4,6,8,10,12].map(d=>check(d,[{id:'anger',intensity:7},{id:'calm',intensity:2}])),
  ...[3,5,7,9,11,13].map(d=>check(d,[{id:'joy',intensity:5}]))
 ],
 healthImports:{garminNights:Array.from({length:12},(_,i)=>({day:day(i+2),totals:{deep:90,light:290+(i%3)*10,rem:90}})),
 garminFitness:Array.from({length:12},(_,i)=>({day:day(i+2),steps:5000+i*300})),
 garminWellness:Array.from({length:12},(_,i)=>({at:day(i+2)+'T10:00:00Z',bodyBattery:60+i})).concat([{at:day(2)+'T19:00:00Z',bodyBattery:95}])},
 workTime:{days:Array.from({length:12},(_,i)=>({day:day(i+2),hours:i%2?6:9}))}
});
test('0.5.66 compares only observed days with feeling check-ins, never missing-day negatives',()=>{
 const s=fixture(),m=personalConnections(s,{today:day(20),days:30,emotionId:'anger'});
 assert.equal(m.checkinDays,12);assert.equal(m.emotionDays,6);
 assert.ok(m.analysis.every(a=>a.sufficient&&a.coverage===12));
 const work=m.analysis.find(a=>a.key==='work');assert.equal(work.selectedCount,6);assert.equal(work.otherCount,6);
 assert.equal(work.selectedMean,9);assert.equal(work.otherMean,6);
});
test('0.5.66 multiple check-ins on same day are not double-counted; maximum intensity used',()=>{
 const s=fixture();s.feelingCheckins.push({...check(2,[{id:'anger',intensity:9}]),id:'another-2'});
 const m=personalConnections(s,{today:day(20),days:30});
 assert.equal(m.checkins,13);assert.equal(m.checkinDays,12);assert.equal(m.emotionDays,6);
 const card=m.analysis.find(x=>x.key==='battery');assert.equal(card.selectedCount,6);
 assert.ok(card.selectedMean>=60);
});
test('0.5.66 missing metrics stay missing and are never filled with zeros',()=>{
 const s=fixture();s.workTime.days=[];s.healthImports.garminWellness=[];
 const m=personalConnections(s,{today:day(20),days:30});
 assert.equal(m.analysis.find(a=>a.key==='work').coverage,0);
 assert.equal(m.analysis.find(a=>a.key==='battery').coverage,0);
 assert.equal(m.analysis.find(a=>a.key==='steps').coverage,12);
 assert.match(personalConnectionsView(m),/Keine gemeinsamen Mess- und Check-in-Tage/);
});
test('0.5.66 insufficient cohorts do not produce unsupported comparison claim',()=>{
 const s=fixture();s.feelingCheckins=[check(2,[{id:'anger',intensity:6}])];
 const m=personalConnections(s,{today:day(20),days:30});
 assert.equal(m.emotionDays,1);assert.ok(m.analysis.every(a=>!a.sufficient));
 assert.match(personalConnectionsView(m),/Noch nicht genügend vergleichbare Tage/);
});
test('0.5.66 rejects invalid selection and escapes untrusted content',()=>{
 assert.throws(()=>personalConnections({}, {today:'nonsense'}));
 assert.throws(()=>personalConnections({}, {emotionId:'bogus'}));
 const m=personalConnections({}, {today:day(20),days:90});
 const html=personalConnectionsView(m);
 assert.match(html,/Zusammenhänge entdecken/);assert.match(html,/Zusammenhang ist keine Ursache/);
 assert.match(html,/data-action="connection-emotion"/);
 assert.match(html,/data-action="connection-period"/);
});
test('0.5.66 global integration and mobile Insights tab remain available',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const insights=readFileSync(new URL('../client/src/insights.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0.5.68'/);
 assert.match(main,/insightTab==='connections'/);
 assert.match(main,/action==='connection-emotion'/);
 assert.match(main,/action==='connection-period'/);
 assert.match(insights,/id:'connections'/);
 assert.match(css,/\.pc66-grid/);
});
test('0.5.66 relationship perspective uses confirmed contact logs only, with no person scoring',()=>{
 const s=fixture();s.people={a:{id:'a',name:'Private contact',contactLog:[{day:day(2),type:'meeting'},{day:day(3),type:'call'},{day:day(4),type:'message'},{day:day(4),type:'email'}]}};
 const m=personalConnections(s,{today:day(20),days:30});
 assert.equal(m.social.withContactDays,3);assert.equal(m.social.withEmotion,2);
 assert.equal(m.social.withoutLogDays,9);
 const html=personalConnectionsView(m);
 assert.match(html,/Persönlicher Austausch/);assert.match(html,/Fehlende Kontaktprotokolle sind keine kontaktfreien Tage/);
 assert.ok(!html.includes('Private contact'));
});
