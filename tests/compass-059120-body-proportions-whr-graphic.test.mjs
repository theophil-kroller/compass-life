import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {latestTapeSession,bodyProportionMetrics,whtrReference,modelledFrontWidthCm,proportionalBodySvg,bodyProportionsPanel} from '../client/src/body-proportions-v059120.js';
import {whrReferenceGraphic,fitdaysInterpretationView} from '../client/src/fitdays-interpretation-v57759402517.js';
import {putBodyMeasurement,bodyMeasurementDashboardModel,bodyMeasurementDashboardHtml} from '../client/src/body-measurements-v05918.js';
// All metrics below are SYNTHETIC and intentionally different from the user's private records.
const day='2026-10-11', at='2026-10-11T10:00:00Z';
const example={shoulder:119,chest:102,waist:90,hip:98,neck:38,head:57,leftUpperArm:34,rightUpperArm:33,leftThigh:54,rightThigh:52,leftCalf:38,rightCalf:38};
const state=()=>({nutritionJournal:{bodyMeasures88:[]},healthImports:{fitdays:[]}});
const record=(s,key,value,when=at,qualityStatus='confirmed')=>putBodyMeasurement(s,{regionId:key,at:when,day:when.slice(0,10),valueCm:value,source:'fitdays-plus',qualityStatus,method:'smart-tape',protocol:'controlled'});
const all=(s=state())=>{for(const [k,v] of Object.entries(example))record(s,k,v);return s;};
const model=s=>bodyMeasurementDashboardModel(s,{today:'2026-11-04',range:'90'});

test('1 – only actual simultaneous measurements can form proportional silhouette',()=>{
 const s=all(),shot=latestTapeSession(model(s));
 assert.equal(shot.day,day);assert.equal(Object.keys(shot.values).length,12);
 assert.equal(shot.values.shoulder,119);
 const later='2026-11-04T15:02:00Z';record(s,'shoulder',130,later);
 assert.equal(latestTapeSession(model(s)).values.shoulder,119,'partial newer measuring must not combine with older torso');
});
test('2 – no inferred silhouette with missing torso data',()=>{
 const s=state();record(s,'waist',96);record(s,'hip',105);
 assert.equal(latestTapeSession(model(s)),null);
 const html=bodyProportionsPanel(model(s),{heightCm:185});
 assert.match(html,/vollständige Smart-Tape-Messung/);
 assert.doesNotMatch(html,/bp120-svg/);
});
test('3 – measured ratios and bilateral differences are correct, distinct from health thresholds',()=>{
 const shot=latestTapeSession(model(all()));const m=bodyProportionMetrics(shot,{heightCm:185,weightKg:84});
 assert.equal(m.whr,Math.round(90/98*1000)/1000);
 assert.equal(m.whtr,Math.round(90/185*1000)/1000);
 assert.equal(m.shoulderWaist,Math.round(119/90*1000)/1000);
 assert.equal(m.chestWaist,Math.round(102/90*1000)/1000);
 assert.equal(m.shoulderHip,Math.round(119/98*1000)/1000);
 assert.equal(m.armDeltaCm,1);assert.equal(m.thighDeltaCm,2);assert.equal(m.calfDeltaCm,0);
 assert.ok(Math.abs(m.bmi-84/1.85**2)<.01);
});
test('4 – no hardcoded anthropometrics; missing height and weight remain unknown',()=>{
 const s=all(),shot=latestTapeSession(model(s));
 const metrics=bodyProportionMetrics(shot);
 assert.equal(metrics.whtr,null);assert.equal(metrics.bmi,null);
 const page=bodyProportionsPanel(model(s));
 assert.match(page,/Größe unbekannt/);assert.match(page,/Körpergröße unter Ernährung/);
 assert.doesNotMatch(page,/WHtR 0,5/);
});
test('5 – NICE classification across boundaries is not a V-taper category',()=>{
 assert.equal(whtrReference(.48).kind,'reference');
 assert.equal(whtrReference(.50).kind,'elevated');
 assert.equal(whtrReference(.60).kind,'high');
 assert.equal(whtrReference(null).kind,'unknown');
});
test('6 – body widths are model-derived, scale monotonically with circumference',()=>{
 assert.ok(modelledFrontWidthCm(100,.70)>modelledFrontWidthCm(90,.70));
 assert.equal(modelledFrontWidthCm(NaN,.7),null);
 const shot=latestTapeSession(model(all()));
 const baseline=proportionalBodySvg(shot,{heightCm:185});
 const modified={...shot,values:{...shot.values,waist:108}};
 assert.notEqual(proportionalBodySvg(modified,{heightCm:185}),baseline);
 assert.match(baseline,/modellierte Tiefenannahmen/);
 assert.match(baseline,/smart-tape-region/);
 assert.match(baseline,/185 cm/);
});
test('7 – accessible circumference map and trend detail stay usable on mobile',()=>{
 const s=all(),html=bodyMeasurementDashboardHtml(model(s),{selectedRegionId:'leftUpperArm',heightCm:185,weightKg:84});
 assert.match(html,/bm918-detail/);assert.match(html,/bp120-svg bm918-body-map/);
 assert.match(html,/data-id="leftUpperArm"/);assert.match(html,/aria-pressed="true"/);
 assert.match(html,/Baseline/);assert.match(html,/weder ein Muskelwachstumsbeweis/);
});
test('8 – WHR numeric indicator is accompanied by visible reference bars and marker (male)',()=>{
 const html=whrReferenceGraphic(.935,{sex:'male'});
 assert.match(html,/WHR-Referenzskala/);assert.match(html,/0,935/);
 assert.match(html,/fdi-whr-ruler/);assert.match(html,/fdi-whr-pointer/);
 assert.match(html,/0,90 · Männer/);assert.doesNotMatch(html,/threshold female/);
 assert.match(html,/role="img"/);
});
test('9 – sex parameter is not inferred; unknown uses two reference thresholds',()=>{
 const html=whrReferenceGraphic(.87);
 assert.match(html,/threshold female/);assert.match(html,/threshold male/);
 assert.match(html,/Ohne persönlichen Referenzparameter/);
 assert.match(html,/fdi-whr-band uncertain/);
 const female=whrReferenceGraphic(.87,{sex:'female'});
 assert.match(female,/Referenzgrenze 0,85 · Frauen/);
 assert.doesNotMatch(female,/threshold male/);
});
test('10 – no invented reference marker when WHR was not measured',()=>{
 assert.match(whrReferenceGraphic(null),/keine Positionsmarkierung/);
 assert.doesNotMatch(whrReferenceGraphic(null),/fdi-whr-pointer/);
});
test('11 – visible WHR graphic appears for Smart Tape-only imported measurements',()=>{
 const s=all();const ratio=model(s).waistHip;
 const html=fitdaysInterpretationView([],{today:'2026-11-04',range:'90',smartTapeWhrSeries:ratio,whrReferenceSex:'male'});
 assert.match(html,/WHR-Referenzskala/);assert.match(html,/fdi-whr-pointer/);
 assert.match(html,/Fitdays\+ Smart Tape/);
});
test('12 – visible WHR graphic appears with scale rows; no hidden-only details',()=>{
 const s=all(),fitdays=[{day:'2026-10-12',at:'2026-10-12T08:10:00Z',weightKg:84,bodyFatPct:22,waistCm:89,hipCm:97}];
 const page=fitdaysInterpretationView(fitdays,{today:'2026-11-04',range:'90',smartTapeWhrSeries:model(s).waistHip,whrReferenceSex:'male'});
 const reference=page.indexOf('fdi-whr-graphic');
 assert.ok(reference>=0);
 assert.ok(reference<page.indexOf('<details class="fdi-more"'));
});
test('13 – questionable or staggered measurements cannot silently generate ratios',()=>{
 const s=state();const values={shoulder:119,chest:102,waist:90,hip:98};
 for(const [k,v] of Object.entries(values))record(s,k,v,at,k==='chest'?'questionable':'confirmed');
 assert.equal(latestTapeSession(model(s)),null);
 const next=state();record(next,'waist',94);record(next,'hip',102,'2026-10-12T10:00:00Z');
 assert.equal(model(next).waistHipLatest,null);
});
test('14 – app uses encrypted tape data and optional configured height instead of fixed anthropometrics',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(main,/heightCm:bodyHeightCm,targetWeightKg/);
 assert.match(main,/heightCm:bodyHeightCm,weightKg:bodyWeightKg/);
 assert.match(main,/smartTapeWhrSeries:bodyTapeModel.waistHip/);
 assert.doesNotMatch(main,/heightCm:184,targetWeightKg/);
});
