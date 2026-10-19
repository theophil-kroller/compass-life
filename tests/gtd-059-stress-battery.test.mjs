import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {garminStressEnergyFromRecords} from '../client/src/garmin-fit.js';
import {commitHealthImport} from '../client/src/health-import.js';
import {buildWellnessInsights,stressZone,wellnessDayChart,wellnessDayBars,insightsStressView,insightsEnergyView} from '../client/src/insights-wellness.js';
import {INSIGHT_TABS} from '../client/src/insights.js';
const epoch=Date.UTC(1989,11,31)/1000,sec=s=>Math.floor(Date.parse(s)/1000-epoch);
const sample=(at,stress,energy)=>({type:227,fields:{1:sec(at),0:stress,3:energy}});
const R=[sample('2026-10-15T07:00:00Z',50,50),sample('2026-10-15T07:01:00Z',40,49),sample('2026-10-15T07:02:00Z',60,48),sample('2026-10-15T07:06:00Z',-2,47),sample('2026-10-15T07:11:00Z',-1,127),sample('2026-10-15T07:45:00Z',80,40)];
test('227 field 0 is Garmin stress; 1 is timestamp; 3 is Body Energy; compress five minutes with median stress and last battery',()=>{
 const points=garminStressEnergyFromRecords(R);
 assert.equal(points.length,3);assert.equal(points[0].stress,50);assert.equal(points[0].bodyBattery,48);
 assert.equal(points[1].stress,null);assert.equal(points[1].bodyBattery,47);
 assert.equal(points[2].stress,80);assert.equal(points[2].bodyBattery,40);
 assert.ok(points.every(x=>!('serial' in x)&&!('location' in x)));
});
test('Fit stress negative sentinels, out-of-range body battery and empty windows do not create zeros',()=>{
 const records=[sample('2026-10-15T08:00:00Z',-2,127),sample('2026-10-15T08:01:00Z',-1,-128)];
 assert.deepEqual(garminStressEnergyFromRecords(records),[]);
 assert.equal(stressZone(null),null);assert.equal(stressZone(25),'Ruhe');assert.equal(stressZone(26),'Niedrig');assert.equal(stressZone(50),'Niedrig');assert.equal(stressZone(75),'Mittel');assert.equal(stressZone(100),'Hoch');
});
test('re-imports merge by timestamp, are idempotent, and preserve earlier sleep, HRV, Fitdays',()=>{
 const s={};const points=garminStressEnergyFromRecords(R);
 const preview={fitdays:[],garminNights:[],garminHrv:[],garminWellness:points};
 assert.deepEqual(commitHealthImport(s,preview),[0,0,0]);
 assert.equal(s.healthImports.garminWellness.length,3);
 commitHealthImport(s,preview);assert.equal(s.healthImports.garminWellness.length,3);
 s.healthImports.garminWellness[0]={...s.healthImports.garminWellness[0],bodyBattery:null};
 commitHealthImport(s,{...preview,garminWellness:[{...points[0],stress:null}]});
 assert.equal(s.healthImports.garminWellness[0].bodyBattery,48);
 assert.equal(s.healthImports.garminWellness[0].stress,50);
});
test('valid data is grouped locally by day; charged/drained only across <=15 minute gaps',()=>{
 const pts=garminStressEnergyFromRecords(R);
 const view=buildWellnessInsights({garminWellness:pts},'2026-10-18','7');
 assert.equal(view.summaries.length,1);
 assert.equal(view.summaries[0].charged,0);
 assert.equal(view.summaries[0].drained,1); // 48→47 over 5min; 47→40 with a gap is excluded
 assert.equal(view.stressCount,2);
 assert.equal(view.zoneCounts.Niedrig,1);
 assert.equal(view.zoneCounts.Hoch,1);
 assert.equal(view.avgStress,65);
});
test('stress and energy show charts built from measured values, no synthetic confidence intervals or fabricated baseline',()=>{
 const pts=garminStressEnergyFromRecords(R);const v={garminWellness:pts};
 const stress=insightsStressView(v,'7','2026-10-18');
 const energy=insightsEnergyView(v,'7','2026-10-18');
 assert.match(stress,/Belastungsstufen/);assert.match(stress,/Mein Stress im Tagesverlauf/);
 assert.match(stress,/Stress-Messpunkte/);assert.match(energy,/Tageshoch und Tagestief/);
 assert.match(energy,/Aufgeladen/);assert.match(energy,/Verbraucht/);
 assert.match(stress,/insights-wellness-day/);assert.match(energy,/insights-wellness-day/);assert.match(energy,/Stress im Hintergrund/);
 assert.match(stress,/Kein 95%-Konfidenzintervall/);
 assert.doesNotMatch(stress+energy,/Garmin-HRV-Baseline|Diagnose: /);
});
test('stress and energy tabs integrated into actual Insights and current version, no worker migration',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.45'/);
 assert.match(main,/insightsStressView/);assert.match(main,/insightsEnergyView/);
 assert.match(main,/insights-wellness-day/);
 for(const id of ['stress','energy'])assert.equal(INSIGHT_TABS.find(x=>x.id===id).state,'live');
});
