import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {familyRules,familySuggestions,familyAccept,familyEvents} from '../client/src/family-radar-v5775931.js';
import {validRir34,confirmedRir34,coach34RecommendedSets,coach34Feedback} from '../client/src/strength-adaptive-v5775934.js';
const day='2026-10-26', uuid=()=> '00000000-0000-4000-8000-000000000001';
const e=(id,name)=>({id,summary:name,start:{date:'2026-11-05'}});
const people={bettina:{id:'bettina',name:'Bettina',relationKind:'friend'},nathanael:{id:'nathanael',name:'Nathanael',relationKind:'other'},seraphina:{id:'seraphina',name:'Seraphina',relationKind:'family'}};
const events=[e('b','Bettina: Mathematik Schularbeit'),e('n','Nathanael: Mathematik Schularbeit'),e('s','Seraphina: Mathematik Schularbeit')];
test('adult friend Bettina is never auto-classified as child; Nathanael and Seraphina remain',()=>{
 assert.equal(familyRules({},people.bettina).enabled,false);
 assert.equal(familyRules({},people.nathanael).enabled,true);
 assert.equal(familyRules({},people.seraphina).enabled,true);
 const suggested=familySuggestions(events,people,{}, {today:day});
 assert.deepEqual(suggested.map(x=>x.personId).sort(),['nathanael','seraphina']);
 assert.equal(familyEvents(events,people.bettina,{today:day}).length,1,'calendar is still calendar, not a family obligation');
});
test('preexisting enabled=true without a child role never makes an adult friend a child',()=>{
 const st={familyRadar:{rules:{bettina:{enabled:true,mathSupport:true}}}};
 assert.equal(familyRules(st,people.bettina).enabled,false);
 assert.equal(familySuggestions(events,people,st,{today:day}).some(x=>x.personId==='bettina'),false);
});
test('manual child role requires family classification, can be disabled, and no invalid GTD creation',()=>{
 const st={familyRadar:{rules:{bettina:{enabled:true,role:'child'}}},tasks:{},projects:{}};
 assert.equal(familyRules(st,people.bettina).enabled,false);
 const forged={personId:'bettina',id:'b',day:'2026-11-05',action:{kind:'learning'},key:'bettina::b::learning',title:'Mathematik'};
 assert.equal(familyAccept(st,forged,people.bettina,{today:day,uuid}).created.length,0);
 st.familyRadar.rules.bettina.role='child';const member={...people.bettina,relationKind:'family'};
 assert.equal(familyRules(st,member).enabled,true);
 st.familyRadar.rules.bettina.enabled=false;
 assert.equal(familyRules(st,member).enabled,false);
});
test('RIR per-set values are validated; missing feedback is never assigned a score',()=>{
 for(const n of [0,1,2,3,4])assert.equal(validRir34(n),n);
 for(const n of ['',null,undefined,-1,5,'quick'])assert.equal(validRir34(n),null);
 const state={strengthGuidedSessions:[{source:'compass-guided-v5920',startedAt:'2026-10-25T10:00:00Z',exercises:[{exerciseId:'dumbbell-row',confirmedSets:[{confirmed:true,rir:2},{confirmed:true,rir:null},{confirmed:false,rir:0}]}]}]};
 assert.deepEqual(confirmedRir34(state,'dumbbell-row',day).map(r=>r.rir),[2]);
 assert.equal(confirmedRir34(state,'lat-pulldown',day).length,0);
});
test('weekly V-Taper dosage reacts conservatively to high volume or adverse sleep and HRV',()=>{
 const common={state:{},goal:'vtaper',exerciseId:'dumbbell-row',primary:'back',baseSets:3,level:{level:'intermediate'},history:{counts7:{back:6}},health:{attention:false},today:day};
 assert.equal(coach34RecommendedSets(common),3);
 assert.equal(coach34RecommendedSets({...common,history:{counts7:{back:20}}}),2);
 assert.equal(coach34RecommendedSets({...common,health:{attention:true}}),2);
 assert.equal(coach34RecommendedSets({...common,goal:'strength'}),3);
 assert.equal(coach34RecommendedSets({...common,level:{level:'beginner'}}),2);
});
test('V-Taper volume unknown if evidence insufficient; does not pretend a zero',()=>{
 const x=coach34Feedback({}, {usable:false,counts7:{back:0}},day);
 assert.equal(x.weekly.find(z=>z.group==='back').observed,null);
 assert.equal(x.recordedRir,0);
 const y=coach34Feedback({}, {usable:true,counts7:{back:11,shoulders:3}},day);
 assert.equal(y.weekly.find(z=>z.group==='back').status,'within');
});
test('existing .28 V-Taper bridge now wires adaptive dosage; guided player records RIR', async()=>{
 const {compass5928VtaperLuxBridge}=await import('../client/compass5928-vtaper-lux-bridge.js');
 const r=compass5928VtaperLuxBridge();
 const coach=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 const guided=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
 const a=r.transform(coach,'/repo/client/src/strength-coach-v5775910.js').code;
 const b=r.transform(guided,'/repo/client/src/strength-guided-v5775920.js').code;
 assert.match(a,/coach34RecommendedSets/);assert.match(a,/coach34Feedback/);
 assert.match(b,/str34-rir-panel/);assert.match(b,/data-act="rir"/);
});
test('.34 release bridge publishes actual app and unlockscreen version',async()=>{
 const {compass5934CoachBridge}=await import('../client/compass5934-coach-release-bridge.js');
 const bridge=compass5934CoachBridge();
 const app=bridge.transform("const COMPASS_CLIENT_VERSION='0.5.77.59.33';\nconst msg='Build 0.5.77.59.33';",'/repo/client/src/main.js').code;
 assert.match(app,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.34'/);
 assert.match(app,/Build 0\.5\.77\.59\.34/);
 const lock=bridge.transform("const msg='Build 0.5.77.59.33';",'/repo/client/src/ars-vivendi-lock-v5775922.js').code;
 assert.match(lock,/Build 0\.5\.77\.59\.34/);
});
