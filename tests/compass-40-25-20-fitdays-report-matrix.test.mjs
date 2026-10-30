import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fitdaysInterpretationView,fitdaysBodyTypeZone,resolvedBodyMetrics} from '../client/src/fitdays-interpretation-v57759402517.js';
const sample={day:'2026-10-29',at:'2026-10-29T07:00:00',weightKg:87.1,bodyFatPct:24.4,visceralFat:8,bmrKcal:1791,fatFreeKg:65.9};
const make=(r=sample,opts={})=>fitdaysInterpretationView([r],{today:'2026-10-30',range:'28',heightCm:184,...opts});
test('Report shows eleven body type cells, Fitdays-style categorical strips, and accurate point',()=>{
 const html=make();
 for(const name of ['Athletes','Muscular fat','Overweight','Muscle','Fit','Slightly fat','Muscular slim','Slim','Invisible fat','Too thin','Thin'])assert.match(html,new RegExp(name));
 assert.equal((html.match(/class="fdi-type-region /g)||[]).length,11);
 for(const section of ['Obesity assessment','Body fat rate','Body type assessment','Other indicators','Visceral fat grade','Basal metabolic rate','Fat-free body weight'])assert.match(html,new RegExp(section));
 assert.match(html,/data-type="overweight"/);
 assert.match(html,/25,7/);assert.match(html,/24,4/);assert.match(html,/1[\s\u00a0.]791/);assert.match(html,/65,9/);
 assert.match(html,/fdi-type-point/);assert.match(html,/fdi-crosshair-y/);assert.match(html,/fdi-crosshair-x/);
 assert.match(html,/fdi-report-segment selected/);
 assert.match(html,/25,0/);assert.match(html,/18,5/);assert.match(html,/20,0/);
 assert.equal(fitdaysBodyTypeZone(25.7,24.4),'Overweight');
});
test('No target is fabricated and no 116% copied from sample screenshot',()=>{
 const s=make();assert.match(s,/Kein Zielgewicht hinterlegt/);assert.doesNotMatch(s,/116\s?%/);
 const withGoal=make(sample,{targetWeightKg:80});assert.match(withGoal,/Zielgewicht 80 kg/);assert.match(withGoal,/108,9/);
});
test('Missing measurements render without fake BMR or explicit manufacturer classification',()=>{
 const html=make({day:sample.day,at:sample.at,weightKg:87.1,bodyFatPct:24.4});
 assert.match(html,/Fettfreie Masse/);assert.match(html,/berechnet/);assert.match(html,/Basal metabolic rate/);
 assert.match(html,/–/);assert.doesNotMatch(html,/1791/);
 assert.match(html,/grafische Annäherung/);assert.match(html,/keine validierte Körpertypdiagnose/);
});
test('Outside diagram bounds has no fake plotted marker; missing BMI uses missing state',()=>{
 assert.equal(fitdaysBodyTypeZone(NaN,24),null);
 assert.equal(fitdaysBodyTypeZone(17,33),null);
 const o=make({...sample,bodyFatPct:34});assert.doesNotMatch(o,/class="fdi-type-point"/);
 const missing=fitdaysInterpretationView([{...sample,bmi:null}],{today:'2026-10-30',heightCm:null});
 assert.match(missing,/BMI wird nicht aus einer angenommenen Körpergröße berechnet/);
});
test('Only selected body matrix visualization changes; transformation, 184cm, release and original measurements remain',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 const release=readFileSync(new URL('../client/src/compass-release-v57759402519.js',import.meta.url),'utf8');
 assert.match(main,/insightTab==='body'\?fitdaysInterpretationView/);
 assert.match(main,/heightCm:184,targetWeightKg:/);
 assert.match(main,/\+bodyTransformationView\(state,/);
 assert.match(main,/\+healthBodyView\(/);
 assert.match(release,/0\.5\.77\.59\.40\.25\.21/);
 const b=JSON.stringify(sample);make();assert.equal(JSON.stringify(sample),b);
 assert.equal(resolvedBodyMetrics(sample,184).bmiOrigin,'computed');
});
