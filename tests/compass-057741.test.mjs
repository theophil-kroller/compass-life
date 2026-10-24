import test from 'node:test';
import assert from 'node:assert/strict';
import {activityEnergyByDay,distinctGarminCalorieSessions,dailyKcalGradient} from '../client/src/activity-energy-57741.js';
import {waterSportMuscleSummary,waterSportSummaryView} from '../client/src/water-sport-muscles-57741.js';
import {compass741Bridge} from '../client/compass741-bridge.js';
import {readFileSync} from 'node:fs';
const goal={ready:true,settings:{enabled:true},resting:{kcal:1800},tdee:2450,target:2150};
const days=Array.from({length:15},(_,i)=>{const d=new Date('2026-10-10T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);});
const row=(day,start,calories,duration=60,id='a')=>({day,start,calories,durationMinutes:duration,id,source:'garmin-activities-csv'});
test('no fake daily calorie adjustment with missing monitoring; old goals remain',()=>{
 const d=activityEnergyByDay({healthImports:{garminSessions:[row('2026-10-24','2026-10-24T11:00',500)]}},goal,{today:'2026-10-24'});
 assert.equal(d.ready,false);assert.equal(d.byDay.size,0);
});
test('duplicate Garmin activity CSV/FIT records count only once',()=>{
 const samples=[row('2026-10-23','2026-10-23T10:00',525,60,'csv'),{...row('2026-10-23','2026-10-23T11:00',531,61,'fit'),source:'garmin-fit-session'}];
 assert.equal(distinctGarminCalorieSessions({garminSessions:samples}).length,1);
});
test('sports day target increases above the observed 28-day baseline, never adds resting calories twice',()=>{
 const imports={garminFitness:days.map(day=>({day,steps:6500})),garminSessions:[row('2026-10-24','2026-10-24T11:00',500)]};
 const m=activityEnergyByDay({healthImports:imports},goal,{today:'2026-10-24'});
 assert.equal(m.ready,true);
 const value=m.byDay.get('2026-10-24');
 assert.ok(value.delta>0);assert.ok(value.target>goal.target);assert.ok(value.delta<500);
 assert.match(value.source,/28-Tage-Mittel/);
});
test('activity thresholds are relative by day but share the same kcal chart axis',()=>{
 const str=dailyKcalGradient({target:2400,tdee:2700},3500);
 assert.match(str,/linear-gradient/);assert.match(str,/#[a-f\d]{6}/i);
 assert.notEqual(str,dailyKcalGradient({target:2100,tdee:2400},3500));
});
test('paddling sessions recognize kayak and SUP independently of strength sets',()=>{
 const s={healthImports:{garminSessions:[
   {id:'kayak',day:'2026-10-24',start:'2026-10-24T09:00',activityType:'Kayaking',durationMinutes:78},
   {id:'sup',day:'2026-10-23',start:'2026-10-23T10:00',title:'Stand Up Paddleboarding',durationMinutes:65}
 ]}};
 const m=waterSportMuscleSummary(s,{range:'28',today:'2026-10-24'});
 assert.equal(m.rides,2);assert.equal(m.kayaks,1);assert.equal(m.sups,1);
 assert.ok(m.regions.primary.includes('latissimus'));
 assert.ok(m.regions.secondary.includes('calves_gastro'));
 assert.match(waterSportSummaryView(m),/Keine.*Kraftsätze/i);
});
test('unknown kayak imports do not generate fake muscle contribution',()=>{
 const m=waterSportMuscleSummary({healthImports:{garminSessions:[]}},{today:'2026-10-24'});
 assert.equal(m.rides,0);assert.deepEqual(m.regions.primary,[]);
});
test('Vite keeps all previous bridges in order and runs the new one before PWA',()=>{
 const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 const sequence=['strengthPremium738Bridge()', 'compass741Bridge()', 'strengthSync742Bridge()', 'VitePWA('];
 let prev=-1;for(const stage of sequence){const at=config.indexOf(stage);assert.ok(at>prev,stage+' must follow prior stage');prev=at;}
});
test('main.js transformed chrome shows shopping only with active lists and includes direct action',()=>{
 const sample=`const COMPASS_CLIENT_VERSION='0.5.77.40';\nimport './strength-premium-v57738.css';\nfunction chrome(content){\n ${'${worktimeQuickButton()}${habitQuickButton()}'}\n}\nif(action==='shopping713-create'){ }\nif(!['combined','strength','cycling'].includes(id))return;`;
 const out=compass741Bridge().transform(sample,'/app/client/src/main.js').code;
 assert.match(out,/0\.5\.77\.41/);assert.match(out,/shopping741QuickButton/);
 assert.match(out,/if\(!active\.length\)return ''/);assert.match(out,/shopping741-open/);
 assert.match(out,/shopping741-count/);assert.match(out,/\['combined','strength','cycling','water'\]/);
});
test('source transforms detect changed integration contract instead of silently failing',()=>{
 assert.throws(()=>compass741Bridge().transform('a wrong source','/app/client/src/main.js'),/integrationsanker|requires one integration anchor/);
});
