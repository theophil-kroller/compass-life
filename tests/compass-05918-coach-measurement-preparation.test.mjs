import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
import {bodyTransformationModel,bodyTransformationView} from '../client/src/body-transformation-v57749.js';
import {
 SMART_TAPE_FLAGS,BODY_MEASUREMENT_REGIONS,bodyTapeToCm,normalizeBodyMeasurement,
 putBodyMeasurement,markBodyMeasurementDeleted,existingBodyMeasurements,bodyMeasurementObservations,
 bodyMeasurementTrend,bodyMeasurementRatioSeries,bodyMeasurementDashboardModel,
 bodyMeasurementDashboardHtml,detectMeasurementFileContainer,mapVerifiedMeasurementFields,
 importFitdaysSmartTape,adaptiveBodyMeasurementRecommendation,bodyMeasurementCoachEvidence
} from '../client/src/body-measurements-v05918.js';
const now='2026-11-02T09:00:00.000Z';
const row=(over={})=>({regionId:'shoulder',originalValue:120,originalUnit:'cm',at:'2026-11-01T10:30:00Z',source:'manual',...over});

test('Compass Body Transformation reuses existing Coach+Garmin session model without a second training database',()=>{
 const date='2026-10-24';
 const state={healthImports:{fitdays:[],garminSessions:[{source:'garmin-activities-csv',sport:19,day:date,start:date+'T12:00:00Z',title:'Strength Training',totalSets:null}]},
 strengthGuidedSessions:[{id:'coach-1',source:'compass-guided-v5920',startedAt:date+'T12:10:00Z',completed:true,exercises:[{exerciseId:'dumbbell-row',confirmedSets:[
 {setNumber:1,confirmed:true,reps:12,weightKg:12},{setNumber:2,confirmed:true,reps:10,weightKg:12},
 {setNumber:3,confirmed:false,reps:10,weightKg:12}]}]}]};
 const period=strengthPeriod(state,{range:'all',today:date});
 assert.equal(period.sessions.length,1,'Coach and Garmin overlap must form one session');
 assert.equal(period.activeSets,2);
 assert.equal(period.volumeKg,264);
 const body=bodyTransformationModel(state,{today:date,strengthSessions:period.sessions});
 assert.equal(body.sourceCounts.strengthSessions,1);
 assert.equal(body.sourceCounts.sets,2);
 assert.match(bodyTransformationView(state,{today:date,strengthSessions:period.sessions}),/Compass-Coach &amp; Garmin/);
 const app=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(app,/strengthSessions:strengthPeriod\(state,\{range:'all',today:localDate\(\)\}\)\.sessions/);
 assert.doesNotMatch(app,/strengthSessions:strengthSummariesWithFit\(state\)/);
});
test('Coach-only confirmed sessions count; unconfirmed preview does not',()=>{
 const day='2026-10-24';
 const st={strengthGuidedSessions:[{id:'1',source:'compass-guided-v5920',startedAt:day+'T12:00:00Z',exercises:[{exerciseId:'dumbbell-lateral-raise',confirmedSets:[{confirmed:true,reps:12,weightKg:7},{confirmed:false,reps:8,weightKg:7}]}]}]};
 const model=bodyTransformationModel(st,{today:day,strengthSessions:strengthPeriod(st,{range:'all',today:day}).sessions});
 assert.equal(model.sourceCounts.sets,1);assert.equal(model.sourceCounts.strengthSessions,1);
});
test('12 canonical regions and inch to centimeter conversion, rejects invalid units and bounds',()=>{
 assert.equal(BODY_MEASUREMENT_REGIONS.length,12);
 assert.equal(new Set(BODY_MEASUREMENT_REGIONS.map(x=>x.id)).size,12);
 assert.equal(bodyTapeToCm(40,'in'),101.6);
 assert.equal(normalizeBodyMeasurement(row({originalValue:40,originalUnit:'in'}),{now}).valueCm,101.6);
 assert.throws(()=>bodyTapeToCm(40,'feet'),/einheit/i);
 assert.throws(()=>normalizeBodyMeasurement(row({originalValue:-3}),{now}),/positive/);
 assert.throws(()=>normalizeBodyMeasurement(row({originalValue:900}),{now}),/plausibler/);
 assert.throws(()=>normalizeBodyMeasurement(row({at:'2026-02-30T00:00:00Z'}),{now}),/ungültig/);
 assert.throws(()=>normalizeBodyMeasurement(row({regionId:'arm???'}),{now}),/Körperregion/);
});
test('same-day different measurements preserved; exact repeated export deduped even across batches',()=>{
 const state={nutritionJournal:{bodyMeasures88:[]}};
 assert.equal(putBodyMeasurement(state,row({importBatchId:'b1'}),{now}).status,'created');
 assert.equal(putBodyMeasurement(state,row({importBatchId:'b2'}),{now}).status,'duplicate');
 assert.equal(putBodyMeasurement(state,row({at:'2026-11-01T11:30:00Z'}),{now}).status,'created');
 assert.equal(existingBodyMeasurements(state).length,2);
 const first=existingBodyMeasurements(state)[0];
 assert.equal(putBodyMeasurement(state,{...row(),id:first.id,originalValue:121},{now}).status,'updated');
 assert.equal(existingBodyMeasurements(state).length,2);
 assert.equal(markBodyMeasurementDeleted(state,first.id,{now}),true);
 assert.equal(bodyMeasurementObservations(state).length,1);
});
test('legacy Coach measurements and new rows stay in the SAME bodyMeasures88 store and ratio pairs only when observed',()=>{
 const state={nutritionJournal:{bodyMeasures88:[{id:'legacy',day:'2026-10-20',shoulderCm:120,waistCm:90}]}};
 assert.equal(bodyMeasurementRatioSeries(state).length,1);
 assert.equal(bodyMeasurementRatioSeries(state)[0].ratio,1.33);
 putBodyMeasurement(state,row({regionId:'waist',originalValue:85}),{now});
 assert.equal(bodyMeasurementRatioSeries(state).length,1,'no imaginary shoulder measurement on Nov 1');
 putBodyMeasurement(state,row({regionId:'shoulder',originalValue:121}),{now});
 assert.equal(bodyMeasurementRatioSeries(state).length,2);
 const model=bodyMeasurementDashboardModel(state,{today:'2026-11-02',range:'90'});
 assert.equal(model.ratioLatest.ratio,1.42);
 assert.equal(model.features.dashboard,true);
 assert.match(bodyMeasurementDashboardHtml(model),/Körpermaße &amp; Entwicklung/);
 assert.match(bodyMeasurementDashboardHtml(model),/<circle/);
 assert.deepEqual(bodyMeasurementObservations(state,{regionId:'waist'}).map(x=>x.day),['2026-10-20','2026-11-01']);
});
test('trend requires repeated real observations, not interpolated or future values',()=>{
 const points=Array.from({length:5},(_,i)=>({day:`2026-10-${String(i*5+1).padStart(2,'0')}`,valueCm:100-i}));
 assert.equal(bodyMeasurementTrend(points).n,5);
 assert.equal(bodyMeasurementTrend(points.slice(0,2)),null);
 assert.equal(bodyMeasurementTrend(points.map(x=>({...x,day:'2026-10-01'}))),null);
 assert.equal(bodyMeasurementDashboardModel({nutritionJournal:{bodyMeasures88:[]}}, {today:'2026-11-01'}).ratioLatest,null);
});
test('format candidates and opt-in verified mappings: no guessed Fitdays+ file schema',()=>{
 assert.equal(detectMeasurementFileContainer(new Uint8Array([0x50,0x4b,3,4]),'unknown.xlsx'),'zip-container');
 assert.equal(detectMeasurementFileContainer(new TextEncoder().encode('{"a":1}'),'x.json'),'json-candidate');
 assert.equal(detectMeasurementFileContainer(new TextEncoder().encode('a,b\n1,2'),'x.csv'),'csv-candidate');
 assert.throws(()=>mapVerifiedMeasurementFields({meas:10},{fields:{originalValue:'meas'}}),/verifiziert/);
 assert.deepEqual(mapVerifiedMeasurementFields({meas:10},{verified:true,fields:{originalValue:'meas'}}),{originalValue:10});
 assert.throws(()=>importFitdaysSmartTape(new Uint8Array()),/Schema/);
});
test('Smart Tape import/dashboard ON; manual entry and autonomous training adjustment remain OFF',()=>{
 assert.deepEqual(SMART_TAPE_FLAGS,{import:true,dashboard:true,adaptive:false,manualEntry:false});
 assert.equal(adaptiveBodyMeasurementRecommendation().suggestion,null);
 assert.equal(bodyMeasurementCoachEvidence({}).readyForAutomaticAdjustment,false);
 const app=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(app,/body-measurements-v05918/);
});
