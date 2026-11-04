import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseFitdaysSmartTapeRows,bodyMeasurementDashboardModel} from '../client/src/body-measurements-v05918.js';
import {commitHealthImport} from '../client/src/health-import.js';
import {fitdaysInterpretationView,currentWhrEvidence,whrInterpretation} from '../client/src/fitdays-interpretation-v57759402517.js';
const header=['Time','Head','Neck','Shoulder','Chest','Waist','Hip','L Arm','R Arm','L Thigh','R Thigh','L Calf','R Calf','Waist-to-Hip Ratio'];
// Synthetic, NEVER a copy of the user's real Fitdays values.
const example=['2026-11-04 18:41','57 cm','37 cm','112 cm','99 cm','92 cm','100 cm','33 cm','31 cm','52 cm','51 cm','38 cm','39 cm','0.9'];
const state=()=>({healthImports:{fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]},nutritionJournal:{bodyMeasures88:[]}});
const batch=x=>({bodyTape:x,fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]});
const model=s=>bodyMeasurementDashboardModel(s,{today:'2026-11-04',range:'28'});
const view=(rows,s,extra={})=>fitdaysInterpretationView(rows,{today:'2026-11-04',range:'28',smartTapeWhrSeries:model(s).waistHip,whrReferenceSex:'male',...extra});
test('smart tape source actually carries measured waist and hip with dated ratio and provenance',()=>{
 const s=state();commitHealthImport(s,batch(parseFitdaysSmartTapeRows([header,example])));
 assert.equal(s.healthImports.fitdays.length,0);
 const w=model(s).waistHipLatest;
 assert.equal(w.waistCm,92);assert.equal(w.hipCm,100);assert.equal(w.ratio,.92);
 assert.equal(w.source,'fitdays-plus');assert.equal(w.day,'2026-11-04');assert.equal(w.sourceIds.length,2);
});
test('WHR renders even with NO scale rows, using tape-only evidence rather than a dash',()=>{
 const s=state();commitHealthImport(s,batch(parseFitdaysSmartTapeRows([header,example])));
 const html=view([],s);
 assert.match(html,/Waist-to-hip ratio · WHR · Fitdays\+ Smart Tape/);
 assert.match(html,/>0,920</);assert.match(html,/Oberhalb des Orientierungswerts/);
 assert.match(html,/Taille 92 cm ÷ Hüfte 100 cm/);assert.match(html,/04-11|2026-11-04/);
 assert.match(html,/Erste WHR-Messung/);
});
test('latest Smart Tape supersedes older scale WHR without touching scale data',()=>{
 const s=state();commitHealthImport(s,batch(parseFitdaysSmartTapeRows([header,example])));
 const older=[{day:'2026-11-02',at:'2026-11-02T07:00:00',weightKg:87,bodyFatPct:23,whr:.81}];const snapshot=JSON.stringify(older);
 const html=view(older,s);
 assert.match(html,/Waist-to-hip ratio · WHR/);assert.match(html,/>0,920\s*</);
 assert.match(html,/Fitdays\+ Smart Tape · direkt aus Umfangsmessungen/);
 assert.match(html,/WHR 0,920/);assert.equal(JSON.stringify(older),snapshot);
});
test('a newer valid scale WHR takes chronological precedence over an old tape reading',()=>{
 const scale=[{day:'2026-11-05',at:'2026-11-05T08:00:00',whr:.88}];
 const evidence=currentWhrEvidence(scale,[{day:'2026-11-04',at:'2026-11-04T18:41:00Z',ratio:.92,waistCm:92,hipCm:100}]);
 assert.equal(evidence.latest.ratio,.88);assert.equal(evidence.latest.origin,'fitdays');
});
test('when neither source provides WHR, indicator stays honestly unavailable',()=>{
 const s=state();const html=view([{day:'2026-11-04',at:'2026-11-04T08:00:00',weightKg:87}],s);
 assert.match(html,/Waist-to-hip ratio · WHR/);assert.doesNotMatch(html,/Oberhalb des Orientierungswerts/);
 assert.equal(currentWhrEvidence([],[]).latest,null);
});
test('do not combine mismatched measurement methods, timestamps or questionable values',()=>{
 const s=state();commitHealthImport(s,batch(parseFitdaysSmartTapeRows([header,example])));
 s.nutritionJournal.bodyMeasures88.find(x=>x.regionId==='hip').qualityStatus='questionable';
 assert.equal(model(s).waistHip.length,0);
 s.nutritionJournal.bodyMeasures88.find(x=>x.regionId==='hip').qualityStatus='confirmed';
 s.nutritionJournal.bodyMeasures88.find(x=>x.regionId==='hip').method='other-device';
 assert.equal(model(s).waistHip.length,0);
});
test('general WHR status does not invent a sex-specific diagnosis when preference absent',()=>{
 assert.equal(whrInterpretation(.94,'male').kind,'above-reference');
 assert.equal(whrInterpretation(.89,'male').kind,'below-reference');
 assert.equal(whrInterpretation(.86,'female').kind,'above-reference');
 assert.equal(whrInterpretation(.88,'').kind,'sex-dependent');
 assert.equal(whrInterpretation(.94,'').kind,'above-both');
 assert.equal(whrInterpretation(null,'').kind,'unknown');
});
test('new WHR bridge is wired into existing Insights body screen, with no new database',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(main,/bodyTapeModel=insightTab==='body'\?bodyMeasurementDashboardModel/);
 assert.match(main,/smartTapeWhrSeries:bodyTapeModel\.waistHip/);
 assert.match(main,/whrReferenceSex:state\?\.nutritionJournal\?\.energyGoal\?\.formulaSex/);
 assert.doesNotMatch(main,/healthImports\.smartTapeWhr\s*=/);
});
