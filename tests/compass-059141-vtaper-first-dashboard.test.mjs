import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {vtaperTapeCheckins141,vtaperOverviewModel141,vtaperOverviewHtml141} from '../client/src/vtaper-overview-v059141.js';
import {bodyMeasurementDashboardModel} from '../client/src/body-measurements-v05918.js';
const at0='2026-11-04T07:10:00.000Z',at1='2026-11-11T21:30:00.000Z',at2='2026-11-18T07:00:00.000Z';
const data={shoulder:[120,122,123],waist:[90,88,87],chest:[103,107,108],hip:[100,100,99],leftUpperArm:[31,32,32.5],rightUpperArm:[31,32.6,33]};
function tape(at,index){return Object.entries(data).map(([regionId,values])=>({id:`${at}-${regionId}`,at,day:at.slice(0,10),regionId,source:'fitdays-plus',method:'smart-tape',protocol:'Fitdays+ Smart Tape',valueCm:values[index],qualityStatus:'confirmed'}));}
const source=()=>({nutritionJournal:{bodyMeasures88:[...tape(at0,0),...tape(at1,1)],bodyMeasureContexts140:[{id:at1,postWorkout:true,updatedAt:'2026-11-12T09:00:00Z'}]}});
const trans={weight:{count:15,last:{value:85.2},delta:-1.7},fat:{count:14,last:{value:23.6},delta:-1.3},sourceCounts:{strength:19,sets:179,protein:17,kcal:18,proteinPartial:5},range:'28'};
const evaluate=(s=source(),date='2026-11-12')=>vtaperOverviewModel141(bodyMeasurementDashboardModel(s,{today:date,range:'all'}),trans);
test('first-screen dashboard: 2 actual paired check-ins, precise ratio and signed goal-directed changes',()=>{
 const m=evaluate();assert.equal(m.sessions.length,2);assert.equal(m.comparable,true);
 assert.equal(m.ratioFirst,120/90);assert.equal(m.ratioLatest,122/88);
 assert.equal(m.ratioPct,3.98);assert.equal(m.direction,'improving');
 assert.equal(m.measures.find(x=>x.id==='shoulder').change,2);
 assert.equal(m.measures.find(x=>x.id==='waist').change,-2);
 assert.equal(m.measures.find(x=>x.id==='arms').change,1.3);
 assert.equal(m.lowConfidence,true);assert.equal(m.pump,true);
 const html=vtaperOverviewHtml141(m);
 assert.match(html,/Dein V-Taper-Fortschritt/);assert.match(html,/3,98 %/);
 assert.match(html,/SCHULTER \/ TAILLE/);assert.match(html,/Deine Silhouette/);
 assert.match(html,/04\.11\.2026/);assert.match(html,/11\.11\.2026/);
 assert.match(html,/nach einem Workout/); // below check will confirm wording case
 assert.match(html,/19 Tage/);assert.match(html,/179 erfasste Sätze/);
 assert.match(html,/Körperfett \(BIA\)/);assert.match(html,/kein Körperscan/);
});
test('week-to-week comparison uses previous DIFFERENT-day check-in, not historical baseline',()=>{
 const s=source();s.nutritionJournal.bodyMeasures88.push(...tape(at2,2));
 const m=evaluate(s,'2026-11-20');
 assert.equal(m.first.day,'2026-11-11');assert.equal(m.latest.day,'2026-11-18');
 assert.equal(m.measures.find(x=>x.id==='shoulder').change,1);
 assert.equal(m.measures.find(x=>x.id==='waist').change,-1);
});
test('different sources or different timestamps never combine into a fabricated silhouette',()=>{
 const s=source();s.nutritionJournal.bodyMeasures88=s.nutritionJournal.bodyMeasures88.filter(x=>x.regionId!=='waist');
 const m=evaluate(s);assert.equal(m.comparable,false);assert.equal(m.ratioLatest,null);
 assert.match(vtaperOverviewHtml141(m),/Dein V-Taper startet hier/);
});
test('exclude questionable readings and keep missing values missing',()=>{
 const s=source();const latestWaist=s.nutritionJournal.bodyMeasures88.find(x=>x.day==='2026-11-11'&&x.regionId==='waist');latestWaist.qualityStatus='questionable';
 assert.equal(vtaperTapeCheckins141(bodyMeasurementDashboardModel(s,{today:'2026-11-12',range:'all'})).length,1);
 const model=evaluate(s);assert.equal(model.comparable,false);assert.equal(model.measures[0].change,null);
});
test('dashboard does not change source data or silently correct post-workout cm',()=>{
 const s=source(),before=structuredClone(s);
 const m=evaluate(s);vtaperOverviewHtml141(m);assert.deepEqual(s,before);
 assert.equal(m.latest.values.shoulder,122);assert.equal(m.latest.values.waist,88);
});
test('app mounts the score-free overview FIRST, then original Fitdays/Smart Tape and body transformation',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 const body=main.slice(main.indexOf("insightTab==='body'?vtaperOverviewHtml141("));
 assert.ok(body.startsWith("insightTab==='body'?vtaperOverviewHtml141(vtaperOverviewModel141(bodyOverviewTapeModel,bodyTransformModel))+fitdaysInterpretationView"));
 assert.ok(body.indexOf('vtaperOverviewHtml141')<body.indexOf('fitdaysInterpretationView'));
 assert.ok(body.indexOf('fitdaysInterpretationView')<body.indexOf('bodyTransformationView'));
 assert.ok(body.indexOf('bodyTransformationView')<body.indexOf('healthBodyView'));
 const release=readFileSync(new URL('../client/src/compass-release-v57759402519.js',import.meta.url),'utf8');assert.match(release,/0\.5\.91\.41/);
});
