import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fitdaysInterpretationView,resolvedBodyMetrics} from '../client/src/fitdays-interpretation-v57759402517.js';
const sample={at:'2026-10-29T09:30:00',day:'2026-10-29',weightKg:87.1,bodyFatPct:24.4,visceralFat:8};
test('184cm and 87.1kg compute BMI 25.73 when Fitdays BMI field absent',()=>{
 const r=resolvedBodyMetrics(sample,184);
 assert.equal(r.bmi,25.73);assert.equal(r.bmiOrigin,'computed');assert.equal(sample.bmi,undefined);
 const html=fitdaysInterpretationView([sample],{heightCm:184,today:'2026-10-30'});
 assert.match(html,/BMI aus dem Gewicht berechnet/);assert.match(html,/25,7/);assert.match(html,/184 cm/);
 assert.match(html,/fdi-type-point/);assert.match(html,/fdi-zone-legend/);
 assert.match(html,/Viszeralfett/);assert.match(html,/Subkutanes Fett/);
 assert.match(html,/Nicht im Export/);
});
test('preexisting Fitdays BMI wins; never derive absent BMI without documented height',()=>{
 assert.equal(resolvedBodyMetrics({...sample,bmi:24.5},184).bmi,24.5);
 assert.equal(resolvedBodyMetrics(sample,null).bmi,null);
 assert.equal(resolvedBodyMetrics(sample,80).bmi,null);
});
test('body references appear BEFORE the previous plots and health figure',()=>{
 const m=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(m,/insightTab==='body'\?fitdaysInterpretationView\([\s\S]*?heightCm:[\s\S]*?184,targetWeightKg:[\s\S]*?\}\)\+bodyTransformationView\([\s\S]*?\+healthBodyView\(/);
});
