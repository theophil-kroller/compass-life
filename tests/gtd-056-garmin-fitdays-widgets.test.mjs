import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodeGarminFit,garminWellnessFromRecords,garminSleepJson} from '../client/src/garmin-fit.js';
import {parseFitdaysRows,commitHealthImport,missingGarminDays,isXls,isZip} from '../client/src/health-import.js';
import {healthTrendSvg,sleepTimeline,importedHealthDashboard} from '../client/src/health-dashboard.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const makeFit=()=>{
 const base=Date.UTC(1989,11,31)/1000;
 const t=s=>Math.floor(Date.parse(s)/1000-base);
 const records=[];
 const def=(local,global,fields)=>{
  const b=Buffer.alloc(6+fields.length*3);b[0]=0x40|local;b[1]=0;b[2]=0;b.writeUInt16LE(global,3);b[5]=fields.length;
  fields.forEach(([num,size,type],i)=>{b[6+i*3]=num;b[7+i*3]=size;b[8+i*3]=type});records.push(b);
 };
 const data=(local,fields)=>{records.push(Buffer.from([local]));const b=Buffer.alloc(fields.reduce((n,f)=>n+f[1],0));let p=0;for(const [v,n] of fields){if(n===1)b.writeUInt8(v,p);else if(n===2)b.writeUInt16LE(v,p);else if(n===4)b.writeUInt32LE(v,p);p+=n;}records.push(b)};
 def(0,521,[[3,4,134],[5,4,134]]);
 data(0,[[t('2026-05-04T22:00:00Z'),4],[t('2026-05-05T05:30:00Z'),4]]);
 def(1,275,[[253,4,134],[0,1,0]]);
 data(1,[[t('2026-05-04T22:15:00Z'),4],[2,1]]);
 data(1,[[t('2026-05-04T23:15:00Z'),4],[3,1]]);
 data(1,[[t('2026-05-05T00:15:00Z'),4],[4,1]]);
 data(1,[[t('2026-05-05T03:15:00Z'),4],[1,1]]);
 def(2,370,[[253,4,134],[0,2,132],[1,2,132]]);
 data(2,[[t('2026-05-05T06:00:00Z'),4],[6400,2],[5760,2]]);
 const binary=Buffer.concat(records),header=Buffer.alloc(14);header[0]=14;header[1]=0x10;header.writeUInt16LE(100,2);header.writeUInt32LE(binary.length,4);header.write('.FIT',8,'ascii');
 return Buffer.concat([header,binary,Buffer.alloc(2)]);
};
test('FIT binary extracts actual change points, sleep stage totals and HRV scaling without inventing unknown intervals',()=>{
 const output=garminWellnessFromRecords(decodeGarminFit(makeFit()));
 assert.equal(output.night.day,'2026-05-05');assert.equal(output.night.start,'2026-05-04T22:00:00.000Z');
 assert.equal(output.night.totals.deep,60);assert.equal(output.night.totals.rem,180);
 assert.equal(output.night.totals.unknown,15);
 assert.equal(output.hrv.nightAverageMs,45);assert.equal(output.hrv.weeklyAverageMs,50);
 assert.equal(output.night.stages[0].stage,0);
});
test('Garmin complete account JSON can supply aggregate nights, and never invents phase timestamps',()=>{
 const data=[{dailySleepDTO:{calendarDate:'2026-01-06',sleepStartTimestampGMT:'2026-01-05T22:30:00Z',sleepEndTimestampGMT:'2026-01-06T06:10:00Z',deepSleepSeconds:3600,remSleepSeconds:4500,lightSleepSeconds:16000,awakeSleepSeconds:900}}];
 const result=garminSleepJson(data);assert.equal(result.length,1);assert.equal(result[0].totals.deep,60);assert.deepEqual(result[0].stages,[]);
});
test('Fitdays rows accept real export date notation, duplicate headers and metric reference strings',()=>{
 const rows=[['Date','Weight','Body Fat','Body Water','Visceral Fat','Muscle Mass','Skeletal Muscle'],['06:56 Sep.25,2026','86.9(63.3-85.7)kg','24.8','55.1%','8','60.9(50.7-63.2)kg','43.1%'],['06:57 Sep.25,2026','87.0kg','24.9','55.0%','8','60.8kg','43%']];
 const out=parseFitdaysRows(rows);assert.equal(out.length,2);assert.equal(out[0].day,'2026-09-25');
 assert.equal(out[0].weightKg,86.9);assert.equal(out[0].bodyFatPct,24.8);assert.equal(out[0].muscleKg,60.9);
 const state={};const [newBodies]=commitHealthImport(state,{fitdays:out,garminNights:[],garminHrv:[]});
 assert.equal(newBodies,2);assert.equal(commitHealthImport(state,{fitdays:out,garminNights:[],garminHrv:[]})[0],0);
 assert.equal(state.healthImports.fitdays.length,2);
});
test('Garmin nights from multiple archives merge per day; only actual missing nights are proposed',()=>{
 const days=[{day:'2026-10-15'},{day:'2026-10-17'}];assert.deepEqual(missingGarminDays(days,'2026-10-19'),['2026-10-18','2026-10-19']);
 const s={};assert.deepEqual(commitHealthImport(s,{fitdays:[],garminNights:days,garminHrv:[]}),[0,2,0]);
 assert.deepEqual(commitHealthImport(s,{fitdays:[],garminNights:days,garminHrv:[]}),[0,0,0]);
 const detailed={day:'2026-10-15',stages:[{start:'2026-10-14T23:00:00Z',end:'2026-10-14T23:30:00Z',stage:3}]};
 commitHealthImport(s,{fitdays:[],garminNights:[detailed],garminHrv:[]});
 commitHealthImport(s,{fitdays:[],garminNights:[{day:'2026-10-15',stages:[]}],garminHrv:[]});
 assert.equal(s.healthImports.garminNights[0].stages.length,1,'historical summaries must not overwrite FIT timeline');
});
test('Health charts are accessible, preserve missing values, and distinguish source detail',()=>{
 const date='2026-05-05';const svg=healthTrendSvg([{day:date,weightKg:80}], 'weightKg','Körpergewicht','kg');assert.match(svg,/role="img"/);
 const sleep=garminWellnessFromRecords(decodeGarminFit(makeFit())).night;
 assert.match(sleepTimeline(sleep),/Schlafstadien/);
 assert.match(importedHealthDashboard({fitdays:[],garminNights:[sleep],garminHrv:[]},90,date),/Schlafphasen/);
});
test('Widget fallback layouts use supported views and fit Samsung homescreen; companion starts with two clear choices',()=>{
 const android='android/CompassWidget/app/src/main/';
 const today=read(android+'res/layout/widget_today.xml'),events=read(android+'res/layout/widget_events.xml');
 assert.doesNotMatch(today+events,/<Space\b|<View\b/);
 const focus=read(android+'res/xml/widget_info.xml'),discovery=read(android+'res/xml/widget_events_info.xml');
 assert.match(focus,/targetCellHeight="3"/);assert.match(discovery,/targetCellHeight="3"/);
 const main=read(android+'java/at/compasslife/widget/MainActivity.java');
 assert.match(main,/Widget verbinden/);assert.match(main,/Gesundheit einrichten/);
 assert.match(read(android+'AndroidManifest.xml'),/WidgetSettingsActivity/);
});

test('Fitdays segmented arm, leg and trunk values separate kg from reference percentages',()=>{
 const rows=[['Date','Weight','Right Arm-Segmental fat analysis','Trunk-Muscle balance'],['06:56 Sep.25,2026','86.9kg','1.1kg/149.5%/Standard','27.9kg/98.2%/Standard']];
 const result=parseFitdaysRows(rows);assert.equal(result[0].segmentFat.rightArm.kg,1.1);assert.equal(result[0].segmentFat.rightArm.relativePct,149.5);assert.equal(result[0].segmentMuscle.trunk.kg,27.9);
 const html=importedHealthDashboard({fitdays:result,garminNights:[],garminHrv:[]},'all');assert.match(html,/Fettmasse nach Körperregion/);assert.match(html,/Rumpf/);
});
