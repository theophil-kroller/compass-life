import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseFitdaysSmartTapeRows,importFitdaysSmartTape,bodyMeasurementDashboardModel,bodyMeasurementDashboardHtml,
 bodyMeasurementObservations,measurementFingerprint} from '../client/src/body-measurements-v05918.js';
import {commitHealthImport,isXls} from '../client/src/health-import.js';
import {detectSmartImport} from '../client/src/smart-import-hub-v49.js';

// Header/schema verified against Fitdays+ export; synthetic measurements only (no private data in GitHub).
const header=['Time','Head','Neck','Shoulder','Chest','Waist','Hip','L Arm','R Arm','L Thigh','R Thigh','L Calf','R Calf','Waist-to-Hip Ratio'];
const original=['2026-10-15 09:15','58.0 cm','39.1 cm','115.4 cm','101.2 cm','91.5 cm','98.1 cm','33.2 cm','32.5 cm','53.1 cm','52.8 cm','39.2 cm','39.0 cm','0.9'];
const rows=[header,original];
const makeState=()=>({healthImports:{fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]},nutritionJournal:{bodyMeasures88:[]}});
const emptyHealth={fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]};
test('actual Fitdays+ 14-column workbook layout resolves to exactly 12 circumference observations',()=>{
 const data=parseFitdaysSmartTapeRows(rows);assert.equal(data.length,12);
 const named=Object.fromEntries(data.map(r=>[r.regionId,r.valueCm]));
 assert.deepEqual(named,{head:58,neck:39.1,shoulder:115.4,chest:101.2,waist:91.5,hip:98.1,
 leftUpperArm:33.2,rightUpperArm:32.5,leftThigh:53.1,rightThigh:52.8,leftCalf:39.2,rightCalf:39});
 assert.ok(data.every(r=>r.day==='2026-10-15'&&r.sourceLocalTime==='2026-10-15T09:15:00'&&r.source==='fitdays-plus'));
 assert.equal(data[0].originalUnit,'cm');assert.equal(named.shoulder/named.waist>1.25,true);
 assert.deepEqual(importFitdaysSmartTape(rows).map(r=>r.valueCm),data.map(r=>r.valueCm));
});
test('real sample is OLE2 BIFF despite misleading .csv extension and classified as Health',()=>{
 const sample=new Uint8Array([0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1]);
 assert.equal(isXls(sample),true);
 assert.equal(detectSmartImport({name:'Fitdays+_example.csv',head:'binary',bytes:sample}).kind,'health');
});
test('scale CSV format must not be confused with tape rows',()=>{
 assert.equal(parseFitdaysSmartTapeRows([['Date','Weight','Body Fat'],['2026-10-15','85 kg','23%']]),null);
 assert.throws(()=>parseFitdaysSmartTapeRows([header,original.map((v,i)=>i===3?'unreadable':v)]),/Ungültiger/);
 assert.throws(()=>parseFitdaysSmartTapeRows([header,original.map((v,i)=>i===5?'91.5 lb':v)]),/Ungültiger/);
 assert.throws(()=>parseFitdaysSmartTapeRows([header.filter(h=>h!=='R Calf'),original.slice(0,-1)]),/R Calf fehlt/);
});
test('12 canonical observations save to same encrypted bodyMeasures88 journal, no double import',()=>{
 const state=makeState(),preview={...emptyHealth,bodyTape:parseFitdaysSmartTapeRows(rows)};
 assert.equal(commitHealthImport(state,preview).bodyTapeAdded,12);
 assert.equal(state.healthImports.fitdays.length,0);
 assert.equal(bodyMeasurementObservations(state,{today:'2026-10-15'}).length,12);
 assert.equal(commitHealthImport(state,{...preview,bodyTape:parseFitdaysSmartTapeRows(rows)}).bodyTapeAdded,0);
 assert.equal(state.nutritionJournal.bodyMeasures88.length,12);
 assert.equal(new Set(state.nutritionJournal.bodyMeasures88.map(measurementFingerprint)).size,12);
});
test('first measurement is baseline, never presented as verified muscle growth',()=>{
 const state=makeState();commitHealthImport(state,{...emptyHealth,bodyTape:parseFitdaysSmartTapeRows(rows)});
 const model=bodyMeasurementDashboardModel(state,{today:'2026-10-15',range:'28'});
 assert.equal(model.enabled,true);assert.equal(model.series.find(x=>x.id==='leftUpperArm').latest.valueCm,33.2);
 assert.equal(model.series.find(x=>x.id==='leftUpperArm').lastDeltaCm,null);
 const html=bodyMeasurementDashboardHtml(model,{selectedRegionId:'leftUpperArm'});
 assert.match(html,/Baseline/);assert.match(html,/bm918-body-map/);assert.match(html,/bm918-detail/);
 assert.match(html,/data-action="smart-tape-region"/);assert.match(html,/33,2 cm/);
 assert.doesNotMatch(html,/>\+\d+(?:,\d+)? cm/);
});
test('second real measurement shows change vs prior reading and a selectable dot-to-dot curve',()=>{
 const state=makeState();commitHealthImport(state,{...emptyHealth,bodyTape:parseFitdaysSmartTapeRows(rows)});
 const next=original.map((x,i)=>i===0?'2026-10-22 09:15':i===7?'34.4 cm':x);
 commitHealthImport(state,{...emptyHealth,bodyTape:parseFitdaysSmartTapeRows([header,next])});
 const model=bodyMeasurementDashboardModel(state,{today:'2026-10-22',range:'28'});
 const arm=model.series.find(r=>r.id==='leftUpperArm');assert.equal(arm.points.length,2);assert.equal(arm.lastDeltaCm,1.2);
 const html=bodyMeasurementDashboardHtml(model,{selectedRegionId:'leftUpperArm'});
 assert.match(html,/\+1,2 cm/);assert.match(html,/<path d="M/);assert.match(html,/Einzelmessungen \(2\)/);
});
test('app surface, import confirmation and privacy-preserving journal integration are wired',()=>{
 const app=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 const parser=readFileSync(new URL('../client/src/health-import.js',import.meta.url),'utf8');
 assert.match(app,/bodyTapeDashboard:bodyMeasurementDashboardHtml\(bodyMeasurementDashboardModel/);
 assert.match(app,/smart-tape-region/);assert.match(app,/smart-tape-import/);assert.match(app,/bodyTape\|\|\[\]/);
 assert.match(parser,/parseHealthTableFile/);assert.match(parser,/putBodyMeasurement\(s,row\)/);
 assert.match(parser,/parseFitdaysSmartTapeRows\(rows\)/);
});
