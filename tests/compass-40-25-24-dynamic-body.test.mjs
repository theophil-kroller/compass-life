import {test} from 'node:test';import {strict as assert} from 'node:assert';
import {fitdaysDynamicBodyModel,fitdaysDynamicBodyView,BODY_FAT_REFERENCE_STAGES} from '../client/src/body-comparison-v57759402524.js';
const row=(pct,weight=86.8,muscleKg=32,at='2026-10-30T09:00:00Z')=>({bodyFatPct:pct,weightKg:weight,muscleKg,at});
test('Fitdays actual values recalculated from latest measured row',()=>{const m=fitdaysDynamicBodyModel([row(20,80,30,'2026-10-29T12:00:00Z'),row(23.5)]);assert.equal(m.fatKg,20.398);assert.equal(m.muscleKg,32);assert.equal(m.bodyFatPct,23.5)});
test('missing muscle stays missing not confused with fat-free mass',()=>{const m=fitdaysDynamicBodyModel([row(19,80,null)]);assert.equal(m.muscleKg,null);assert.match(fitdaysDynamicBodyView([row(19,80,null)]),/Keine Messung/)});
test('body comparisons remain reference but model visual moves',()=>{const a=fitdaysDynamicBodyModel([row(12)]),b=fitdaysDynamicBodyModel([row(27)]);assert.notEqual(a.visualStages[0].id,b.visualStages[0].id);assert.equal(BODY_FAT_REFERENCE_STAGES.length,6)});
test('missing values do not manufacture observations',()=>{assert.equal(fitdaysDynamicBodyModel([row(null)]),null);assert.match(fitdaysDynamicBodyView([]),/benötigen/)});
test('BMI takes entered height and does not label fat percent as obesity diagnosis',()=>{const h=fitdaysDynamicBodyModel([row(23.5)],{heightCm:184});assert.equal(h.bmiClass,'Übergewicht (BMI)');assert.match(fitdaysDynamicBodyView([row(23.5)],{heightCm:184}),/keine klinische Adipositas-Klassifikation/)});
