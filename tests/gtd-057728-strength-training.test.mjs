import test from 'node:test';
import assert from 'node:assert/strict';
import {strengthFitField,strengthSetsFromRecords,garminStrengthSessionsFromRecords,mergeStrengthImports,fitTime} from '../client/src/garmin-strength-v57728.js';
import {strengthPeriod,strengthInsightsView} from '../client/src/strength-insights-v57728.js';
import {strength728Bridge} from '../client/strength728-bridge.js';
import {nutrition3Bridge} from '../client/nutrition3-bridge.js';
const fitSeconds=iso=>Math.floor((Date.parse(iso)-Date.UTC(1989,11,31))/1000);
const day='2026-10-24';
const at=(m)=>`2026-10-24T10:${String(m).padStart(2,'0')}:00.000Z`;
const record=(category,minute,{reps=10,weight=16,subtype=1,type=1}={})=>({type:225,fields:{3:reps,4:weight===null?null:weight*16,5:type,6:fitSeconds(at(minute)),7:[category],8:[subtype],254:fitSeconds(at(minute+1)),0:60000}});
const session=()=>({type:18,fields:{2:fitSeconds(at(0)),253:fitSeconds(at(25)),5:4,6:20}});
const exercises=(categories=[0,0,23])=>[session(),...categories.map((c,i)=>record(c,i*3+1)),{type:264,fields:{0:0,1:1,2:'Langhantel Bankdrücken'}}];

test('FIT strength field parser decodes category arrays, kg values and invalid sentinels without fabricating zeros',()=>{
 assert.deepEqual(strengthFitField(new Uint8Array([0,0,23,0]),4,true),[0,23]);
 assert.equal(strengthFitField(new Uint8Array([0,1]),4,true),256);
 assert.equal(strengthFitField(new Uint8Array([255,255]),4,true),null);
 assert.equal(strengthFitField(new Uint8Array([0,0,128,65]),8,true),16);
});
test('FIT sets: active only; preserve repetitions, weights, exercise names and missing values',()=>{
 const entries=[session(),record(0,2),record(0,5,{type:0}),record(23,9,{reps:null,weight:null}),{type:264,fields:{0:0,1:1,2:'Bankdrücken personalisiert'}}];
 const got=strengthSetsFromRecords(entries);
 assert.equal(got.length,2);
 assert.equal(got[0].exercise,'Bankdrücken personalisiert');
 assert.equal(got[0].weightKg,16);
 assert.equal(got[1].reps,null);
 assert.equal(got[1].weightKg,null);
 assert.equal(got[1].primary,'back');
 assert.equal(fitTime(fitSeconds(at(2))),at(2));
});
test('FIT session groups sets under stable start identity and handles empty/supplemental imports',()=>{
 assert.deepEqual(garminStrengthSessionsFromRecords([session()]),[]);
 const [s]=garminStrengthSessionsFromRecords(exercises());
 assert.equal(s.id,`strength|${at(0)}`);
 assert.equal(s.activeSets,3);
 assert.equal(s.sets[0].primary,'chest');
 assert.equal(s.identifiedSets,3);
});
test('re-import of incomplete day is idempotent; later fuller file expands set count, same-size edits refresh',()=>{
 const a=garminStrengthSessionsFromRecords(exercises([0,23]));
 const b=garminStrengthSessionsFromRecords(exercises([0,23,28,17]));
 const first=mergeStrengthImports([],a);
 assert.equal(mergeStrengthImports(first,a).length,1);
 const next=mergeStrengthImports(first,b);
 assert.equal(next.length,1);
 assert.equal(next[0].activeSets,4);
 assert.equal(mergeStrengthImports(next,a)[0].activeSets,4);
 const corrected=structuredClone(next[0]);corrected.sets[0].weightKg=24;
 const final=mergeStrengthImports(next,[corrected]);
 assert.equal(final[0].sets[0].weightKg,24);
 assert.equal(final[0].sets.length,4);
});
test('unknown exercises are not misreported as untrained groups; no fake strength volume',()=>{
 const rows=[session(),record(500,2,{weight:null,reps:null})];
 const [s]=garminStrengthSessionsFromRecords(rows);
 const m=strengthPeriod({healthImports:{garminStrength:[s]}},{range:'7',today:day});
 assert.equal(m.unassigned,1);assert.equal(m.knownSets,0);assert.equal(m.volumeKg,null);
 assert.equal(m.balance.some(b=>b.notable),false);
});
test('balance tip remains descriptive; morning snapshots treated as partial day',()=>{
 const [s]=garminStrengthSessionsFromRecords(exercises([0,0,0,0,0,0,0,23]));
 const state={healthImports:{garminStrength:[s]}};
 const m=strengthPeriod(state,{range:'28',today:day});
 assert.equal(m.trainingDays,1);assert.equal(m.activeSets,8);
 assert.ok(m.groups.find(g=>g.id==='chest').primary>m.groups.find(g=>g.id==='back').primary);
 const html=strengthInsightsView(state,{range:'28',today:day,side:'back'});
 assert.match(html,/Muskelkarte/);assert.match(html,/Rückseite/);assert.match(html,/heutiger Tag noch offen/);
 assert.match(html,/Übungsideen/);assert.match(html,/Langhantel Bankdrücken/);
});
test('bridge installs on the .27 Vite pipeline; rejects a missing source anchor instead of silently breaking',()=>{
 const b=strength728Bridge();
 assert.match(b.transform('// FIT binary reader.\nconst wanted=[275,521,370,227,55,18].includes(def.global),vals={};\nif(wanted&&f.size<=128)vals[f.num]=fieldValue(b.subarray(offset,offset+f.size),f.base,def.little);', '/repo/client/src/garmin-fit.js').code,/225,264,27/);
 assert.throws(()=>b.transform('unrelated','/repo/client/src/garmin-fit.js'),/Integrationsanker/);
 const old="import {decodeGarminFit,garminWellnessFromRecords,garminSleepJson,garminStressEnergyFromRecords,garminMonitoringFromRecords,garminSessionsFromRecords} from './garmin-fit.js';\n"+
 'const nights=new Map(),hrvs=new Map(),wellness=new Map(),fitness=new Map(),sessions=new Map();\n'+
 'for(const item of garminSessionsFromRecords(rows))sessions.set(item.id,item);\n'+
 'return {nights:[...nights.values()],hrvs:[...hrvs.values()],wellness:[...wellness.values()].sort((a,b)=>a.at.localeCompare(b.at)),fitness:[...fitness.values()].sort((a,b)=>a.day.localeCompare(b.day)),sessions:[...sessions.values()].sort((a,b)=>a.start.localeCompare(b.start))};\n'+
 'return {nights,hrvs:[],wellness:[],fitness:[],sessions:[],read:1,failed:[]};\n'+
 'if(!parsed.nights.length&&!parsed.hrvs.length&&!parsed.wellness.length&&!parsed.fitness.length&&!parsed.sessions.length)throw Error(\n'+
 'const result={fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[],errors:[],processed:0,fileResults:[]};\n'+
 'result.garminSessions.push(...(v.sessions||[]));\n'+
 'result.garminSessions=unique(result.garminSessions,x=>x.id).sort((a,b)=>a.start.localeCompare(b.start));\n'+
 'garminSessions:[],lastImportAt:null};\n'+
 'target.garminSessions=[...sessionMap.values()].sort((a,b)=>a.start.localeCompare(b.start));';
 const patched=b.transform(old,'/repo/client/src/health-import.js').code;
 assert.match(patched,/garminStrength/);assert.match(patched,/mergeStrengthImports/);
});
test('stacked version bridge preserves Nutrition 3 with separate strength tab',()=>{
 const source=`const COMPASS_CLIENT_VERSION='0.5.77.26';\nimport './nutrition-trends-v57726.css';\nlet journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;\nconst tabs='📊 Nährstoff-Trends</button></nav>';\nconst view=nutritionView712==='trends'?nutritionTrendsView(state,{mode:nutritionTrendsMode726,anchor:nutritionTrendsAnchor726,metric:nutritionTrendsMetric726}):nutritionHistoryView;\nif(!['journal','nutrients','timing','trends'].includes(id))return;\n // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.\nfunction render(){}\n const balanceGoalsForm=app.querySelector('#lbr63-goals-form');\nconst compactInsights=[['activity','Aktivität','activity']];\nconst sidebar=\`\${navItem('activity','Aktivitäten','activity')}\`;\nconst content=:insightTab==='activity'?fitnessInsightsView(`;
 const first=nutrition3Bridge().transform(source,'/repo/client/src/main.js').code;
 const second=strength728Bridge().transform(first,'/repo/client/src/main.js').code;
 assert.match(second,/0\.5\.77\.28/);assert.match(second,/nutritionConnectionsView/);assert.match(second,/strengthInsightsView/);
 assert.match(second,/str728-range/);
 assert.match(second,/Krafttraining/);
});
