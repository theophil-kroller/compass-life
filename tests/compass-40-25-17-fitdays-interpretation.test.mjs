import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseFitdaysRows,commitHealthImport} from '../client/src/health-import.js';
import {fitdaysInterpretationView} from '../client/src/fitdays-interpretation-v57759402517.js';
const heading=['Date','Weight','Body Fat','Muscle Mass','Visceral Fat','Subcutaneous Fat','BMI','WHR','BMR','Fat-free body weight','Body Age','ASMI'];
const dated=(date='2026-10-29T08:00')=>[date,87.1,24.4,61.4,8,17.4,25.7,0.89,1791,65.9,44,8.6];
test('Fitdays parser imports only real extended fields with units and sensible caps',()=>{
 const rows=parseFitdaysRows([heading,dated()]);assert.equal(rows.length,1);
 assert.equal(rows[0].subcutaneousFatPct,17.4);assert.equal(rows[0].bmi,25.7);
 assert.equal(rows[0].whr,0.89);assert.equal(rows[0].bmrKcal,1791);
 assert.equal(rows[0].fatFreeKg,65.9);assert.equal(rows[0].bodyAge,44);assert.equal(rows[0].asmi,8.6);
 assert.equal(rows[0].weightKg,87.1);assert.equal(rows[0].segmentFat instanceof Object,true);
});
test('Unprovided optional columns stay null, not derived from height or fat mass',()=>{
 const rows=parseFitdaysRows([['Date','Weight','Body Fat'],['2026-10-29T08:00',87.1,24.4]]);
 assert.equal(rows[0].bmi,null);assert.equal(rows[0].subcutaneousFatPct,null);assert.equal(rows[0].whr,null);
 assert.equal(rows[0].bmrKcal,null);assert.equal(rows[0].fatFreeKg,null);
});
test('Repeating less complete export does not erase previous optional imported measurements',()=>{
 const full=parseFitdaysRows([heading,dated()])[0];
 const short=parseFitdaysRows([['Date','Weight','Body Fat','Muscle Mass','Visceral Fat'],['2026-10-29T08:00',87.1,24.4,61.4,8]])[0];
 assert.equal(full.id,short.id);
 const state={};const blank={garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]};
 commitHealthImport(state,{...blank,fitdays:[full]});commitHealthImport(state,{...blank,fitdays:[short]});
 assert.equal(state.healthImports.fitdays.length,1);assert.equal(state.healthImports.fitdays[0].bmi,25.7);assert.equal(state.healthImports.fitdays[0].whr,.89);
});
test('Interpretation is read-only and does not conflate Fitdays index, percent or kcal',()=>{
 const row=parseFitdaysRows([heading,dated()])[0],original=JSON.stringify(row);
 const html=fitdaysInterpretationView([row],{today:'2026-10-30',range:'28'});
 for(const x of ['Viszeralfett','Subkutanes Fett','BMI','WHR','Grundumsatz','BMI × Körperfett','17,4','1','Fitdays-Messwert'])assert.match(html,new RegExp(x));
 assert.match(html,/Übergewicht/);assert.match(html,/Hersteller|geräteabhängig/);assert.match(html,/BIA/);
 assert.equal(JSON.stringify(row),original);
 assert.doesNotMatch(html,/72\/100|10\.000/);
});
test('Missing values have no artificial medical diagnosis or Body Type classification',()=>{
 const row=parseFitdaysRows([['Date','Weight','Body Fat'],['2026-10-29T08:00',87.1,24.4]])[0];
 const html=fitdaysInterpretationView([row],{today:'2026-10-30',range:'28'});
 assert.match(html,/Nicht im Export/);assert.match(html,/BMI wird nicht aus einer angenommenen Körpergröße berechnet/);
 assert.doesNotMatch(html,/bmi 25\.7/);assert.doesNotMatch(html,/72\/100 Points/);
});
test('new interpretation view is additive to body transformation and genuine Fitdays figure',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(main,/bodyTransformationView\(state,[\s\S]+?\+fitdaysInterpretationView\([\s\S]+?\+healthBodyView\(/);
 assert.match(main,/fitdaysInterpretationView/);assert.match(main,/insightTab==='strength'/);
});
