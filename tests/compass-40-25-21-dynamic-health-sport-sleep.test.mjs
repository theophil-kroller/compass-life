import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolvedBodyMetrics,fitdaysInterpretationView} from '../client/src/fitdays-interpretation-v57759402517.js';
import {parseFitdaysRows,commitHealthImport} from '../client/src/health-import.js';
import {sportsRows,sportsInsightsView} from '../client/src/sports-insights.js';
const body=(weight,fat,extras={})=>({day:'2026-10-28',at:'2026-10-28T06:00:00',weightKg:weight,bodyFatPct:fat,...extras});
const mat={leftArm:{kg:3},rightArm:{kg:3},leftLeg:{kg:9},rightLeg:{kg:9}};
test('BMR, BMI, fat-free and segment-muscle index are computed fresh per measurement, not stored',()=>{
 const a=body(87.1,24.4,{segmentMuscle:mat}),b=body(84,20,{segmentMuscle:{...mat,leftLeg:{kg:10}}});
 const prev=JSON.stringify(a),one=resolvedBodyMetrics(a,184),two=resolvedBodyMetrics(b,184);
 assert.equal(one.bmrKcal,1792);assert.equal(one.fatFreeKg,65.85);assert.equal(one.bmi,25.73);assert.equal(one.asmi,7.09);
 assert.notEqual(one.bmrKcal,two.bmrKcal);assert.notEqual(one.bmi,two.bmi);assert.notEqual(one.asmi,two.asmi);
 assert.equal(JSON.stringify(a),prev,'derived body metrics never modify original vault records');
 assert.equal(one.bmrOrigin,'katch-mcardle');assert.equal(one.asmiOrigin,'segment-proxy');
});
test('Fitdays metrics win over formula results, no Garmin activity calories as BMR',()=>{
 const v=resolvedBodyMetrics(body(87,24,{bmrKcal:1740,fatFreeKg:66,bmi:24.5,asmi:8.9,calories:500,restingCalories:2050}),184);
 assert.equal(v.bmrKcal,1740);assert.equal(v.bmi,24.5);assert.equal(v.asmi,8.9);assert.equal(v.bmrOrigin,'fitdays');
 const n=resolvedBodyMetrics({weightKg:82,calories:1000,restingCalories:2150},184);
 assert.equal(n.bmrKcal,null);assert.equal(n.fatFreeKg,null);
});
test('WHR uses live per-day Fitdays estimate or both actual circumferences; never extrapolates a fixed value',()=>{
 const a=resolvedBodyMetrics(body(87,24,{whr:.89}),184),b=resolvedBodyMetrics(body(84,22,{waistCm:81,hipCm:96}),184),c=resolvedBodyMetrics(body(83,19),184);
 assert.equal(a.whr,.89);assert.equal(a.whrOrigin,'fitdays');assert.equal(b.whr,.844);assert.equal(b.whrOrigin,'circumferences');
 assert.equal(c.whr,null);assert.equal(c.whrOrigin,'missing');
 const html=fitdaysInterpretationView([body(84,22,{waistCm:81,hipCm:96})],{today:'2026-10-28',heightCm:184});
 assert.match(html,/Waist-to-hip ratio/);assert.match(html,/Taille \/ Hüfte · berechnet/);
});
test('Fitdays import captures optional waist and hip by actual export field and preserves on sparse reimport',()=>{
 const rows=[['Date','Weight','Body Fat','Waist Circumference','Hip Circumference'],['2026-10-28 06:00',87.1,24.4,84,95]];
 const data=parseFitdaysRows(rows);assert.equal(data[0].waistCm,84);assert.equal(data[0].hipCm,95);
 const st={healthImports:{fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]}};
 const preview=fitdays=>({fitdays,garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]});
 commitHealthImport(st,preview(data));
 commitHealthImport(st,preview(parseFitdaysRows([['Date','Weight','Body Fat'],['2026-10-28 06:00',87.1,24.4]]))); 
 assert.equal(st.healthImports.fitdays.length,1);assert.equal(st.healthImports.fitdays[0].hipCm,95);
});
test('Kraftsport is its own card; Garmin CSV strength differs from real FIT paddling',()=>{
 const sessions=[
  {id:'a',day:'2026-10-28',start:'2026-10-28T09:00:00',durationMinutes:50,title:'Strength Training',source:'garmin-activities-csv'},
  {id:'b',day:'2026-10-28',start:'2026-10-28T11:00:00',durationMinutes:25,title:'',sport:19,source:'garmin-activities-csv'},
  {id:'c',day:'2026-10-28',start:'2026-10-28T12:00:00',durationMinutes:20,title:'',sport:19,source:'garmin-fit-session'}
 ];
 const rows=sportsRows(sessions,[],{end:'2026-10-30'});
 assert.deepEqual(rows.map(x=>x.type).sort(),['paddling','strength','strength']);
 assert.match(sportsInsightsView(sessions,[],{end:'2026-10-30'}),/Kraftsport/);
});
test('Sleep visuals render ahead of health findings and provenance; explanations are below graphs',()=>{
 const src=readFileSync(new URL('../client/src/insights.js',import.meta.url),'utf8');
 const start=src.indexOf('export function insightsSleepView('),end=src.indexOf('export function insightsPlannedView',start);
 const view=src.slice(start,end);
 assert.ok(view.indexOf(' ${sleep}')<view.indexOf(' ${healthFindingsView('));
 assert.ok(view.indexOf('Weitere Analysen')<view.indexOf('Einordnung, Erläuterungen &amp; Datenqualität'));
 assert.ok(view.includes('${sleepDataProvenance(model,imported)}'));
});
