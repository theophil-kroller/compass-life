import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {vtaperOverlayGeometry143,vtaperOverlaySvg143,vtaperOverlayPanel143} from '../client/src/vtaper-overlay-v059143.js';
import {vtaperOverviewModel141,vtaperOverviewHtml141} from '../client/src/vtaper-overview-v059141.js';
import {premiumMuscleHighlight125} from '../client/src/strength-premium-v57738.js';
import {selectVtaperExercises135,vtaperCandidates135,VTAPER_WEEKLY_FOCUS_143} from '../client/src/strength-vtaper-balance-v059135.js';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
const cat=new Map(EXERCISES.map(e=>[e.id,e]));
const at0='2026-11-04T08:00:00Z',at1='2026-11-11T08:00:00Z';
const first={at:at0,day:'2026-11-04',values:{shoulder:111.4,chest:97.6,waist:95.2,hip:100,head:59,neck:39,leftUpperArm:31.7,rightUpperArm:30.9,leftThigh:49.6,rightThigh:51.6,leftCalf:37,rightCalf:39.5}};
const last={at:at1,day:'2026-11-11',values:{shoulder:112.5,chest:101.6,waist:95.3,hip:101,head:59.2,neck:39.1,leftUpperArm:32.8,rightUpperArm:32.2,leftThigh:55.6,rightThigh:54,leftCalf:37.3,rightCalf:36.6}};
test('same absolute model width across check-ins, individual arms and legs kept separate',()=>{
 const a=vtaperOverlayGeometry143(first),b=vtaperOverlayGeometry143(last),strong=vtaperOverlayGeometry143(last,{reference:first,exaggeration:5});
 assert.ok(b.w.shoulder>a.w.shoulder);assert.ok(b.w.waist>a.w.waist);
 assert.ok(b.w.leftUpperArm!==b.w.rightUpperArm);
 assert.ok(strong.w.shoulder>b.w.shoulder);
 assert.ok(Math.abs((strong.w.shoulder-a.w.shoulder)/(b.w.shoulder-a.w.shoulder)-5)<.1);
});
test('body dashboard renders true OVERLAP by default and selectable fivefold difference and full body, not two side by side',()=>{
 const h=vtaperOverlayPanel143(first,last,{heightCm:185,pump:true});
 assert.match(h,/value="real" checked/);assert.match(h,/value="focus"/);assert.match(h,/value="full"/);
 assert.match(h,/Überlagerter Körpervergleich/);assert.match(h,/Gemeinsamer Modellmaßstab/);
 assert.match(h,/kein Körperscan/);assert.match(h,/Pump/);
 const svg=vtaperOverlaySvg143(first,last);
 assert.match(svg,/fill="#45b7a7"/);
 assert.match(vtaperOverlaySvg143(first,{...last,values:{...last.values,waist:93.3}}),/fill="#6caad2"/);
 assert.match(svg,/vorher|erste Messung/i);assert.match(svg,/Schulter/);
 assert.match(svg,/\+1,1 cm/);assert.match(svg,/\+4,0 cm/);
 assert.match(svg,/\+0,1 cm/);
 assert.doesNotMatch(svg,/Veränderungen optisch um Faktor 5/);
 assert.match(vtaperOverlaySvg143(first,last,{exaggeration:5}),/Veränderungen optisch um Faktor 5/);
});
test('dashboard remains a read-only interpretation, no modification to original tape measurements',()=>{
 const snapshot=JSON.stringify([first,last]);const tape={series:Object.keys(first.values).map(id=>({id,points:[first,last].map(s=>({day:s.day,at:s.at,valueCm:s.values[id],source:'fitdays-plus',method:'smart-tape',protocol:'Fitdays+',qualityStatus:'confirmed'}))}))};
 const m=vtaperOverviewModel141(tape,null,{heightCm:185}),html=vtaperOverviewHtml141(m);
 assert.equal(m.heightCm,185);assert.match(html,/Originalmaßstab/);assert.match(html,/Differenzen ×5/);
 assert.doesNotMatch(html,/vt141-figures/);assert.equal(JSON.stringify([first,last]),snapshot);
});
test('yesterday is DARK red while current-day red remains strongest',()=>{
 assert.equal(premiumMuscleHighlight125({yesterdayRegions:['latissimus']},'latissimus').fill,'#a63e53');
 assert.equal(premiumMuscleHighlight125({todayRegions:['latissimus'],yesterdayRegions:['latissimus']},'latissimus').fill,'#ed4b42');
});
test('coach can select home chest, biceps and triceps in addition to shoulder/back, without undocumented attachments',()=>{
 const ids=vtaperCandidates135('home',{cableReady:false,pullupReady:false});
 for(const id of ['pushup','dumbbell-floor-press','biceps-curl','triceps-extension','dumbbell-row','dumbbell-lateral-raise','reverse-fly'])assert.ok(ids.includes(id),id);
 for(const id of ['lat-pulldown','cable-lateral-raise','assisted-pullup'])assert.ok(!ids.includes(id),id);
 assert.ok(VTAPER_WEEKLY_FOCUS_143.back>VTAPER_WEEKLY_FOCUS_143.quads);
});
test('22 consecutive daily 25-min V-taper plans favor upper-body with regular core and limited lower-body maintenance',()=>{
 const valid=[],log=[],origin=new Date('2026-11-01T12:00:00Z');
 for(let day=0;day<22;day++){
  const date=new Date(origin);date.setUTCDate(date.getUTCDate()+day);const today=date.toISOString().slice(0,10);
  const window=valid.filter(e=>e.day>=new Date(date.getTime()-6*86400000).toISOString().slice(0,10));
  const counts7={},last={};for(const e of window){const g=cat.get(e.exerciseId).primary;counts7[g]=(counts7[g]||0)+1;if(!last[g]||last[g]<e.day)last[g]=e.day;}
  const plan=selectVtaperExercises135({history:{valid,counts7,last},today,place:'home',minutes:25,catalog:cat});
  assert.equal(plan.ids.length,3);
  assert.ok(plan.upperChosen>=2,`day ${day}: ${plan.ids}`);
  assert.ok(plan.ids.every(id=>cat.has(id)));
  log.push(...plan.ids.map(id=>cat.get(id).primary));
  for(const id of plan.ids)for(let i=0;i<3;i++)valid.push({day:today,exerciseId:id,reps:10,weightKg:7});
 }
 const times=x=>log.filter(v=>v===x).length;
 assert.ok(times('shoulders')>=5);assert.ok(times('back')>=5);
 assert.ok(times('chest')>=3);assert.ok(times('biceps')>=2);assert.ok(times('triceps')>=2);
 assert.ok(times('core')>=3);assert.ok(times('quads')+times('posterior')<=5);
});
test('StrongLifts is unchanged; source includes active coach focused reason without gym assumption',()=>{
 const src=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 assert.match(src,/strongLifts\?STRONG_LIFTS\[variant\]/);
 assert.match(src,/vtaperUpperChosen/);
 assert.match(src,/Oberkörper heute im Fokus/);
 assert.match(src,/kein.*?RIR/i);
});
