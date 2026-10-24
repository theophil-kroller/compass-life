import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {strength730Bridge} from '../client/strength730-bridge.js';
import {strength729Bridge} from '../client/strength729-bridge.js';
const extension=strength730Bridge();
// Minimal exact excerpt of the current upstream sports classifier; guarded anchors
// deliberately fail if a future upstream release changes its representation.
const excerpt=`const TYPES={running:['Laufen','🏃','#6B9E90'],martial:['Kampfsport','🥋','#B77A73'],sauna:['Sauna & Therme','♨','#D49A72'],other:['Sonstige Aktivitäten','✦','#9AAFA4']};
const sportMap={19:'paddling'};
function titleType(title){const x=String(title||'').toLocaleLowerCase('de-AT');
 return 'other';
}
function resolve(s){const titleCategory=titleType(s.title||s.activityType||'');const activityCategory=titleType(s.activityType||'');const type=titleCategory!=='other'?titleCategory:activityCategory!=='other'?activityCategory:(sportMap[s.sport]||'other');return type;}
({TYPES,titleType,resolve});`;
function model(){
 const result=extension.transform(excerpt,'/code/client/src/sports-insights.js');
 assert.ok(result&&result.code);
 return runInNewContext(result.code);
}
test('separate Krafttraining card exists and classifies Strength Training / Weight Training',()=>{
 const m=model();
 assert.equal(m.TYPES.strength[0],'Krafttraining');
 for(const title of ['Strength Training','Weight Training','Krafttraining','Muskeltraining','Hanteltraining'])assert.equal(m.titleType(title),'strength');
 assert.equal(m.resolve({title:'Strength Training',activityType:'Strength Training',sport:19,source:'garmin-activities-csv'}),'strength');
});
test('existing Garmin CSV sport=19 uses source-aware strength; genuine FIT sport=19 remains paddling',()=>{
 const m=model();
 assert.equal(m.resolve({title:'',activityType:'',sport:19,source:'garmin-activities-csv'}),'strength');
 assert.equal(m.resolve({title:'',activityType:'',sport:19,source:'garmin-fit-session'}),'paddling');
 assert.equal(m.resolve({title:'Random Training',sport:null,source:'garmin-fit-session'}),'other');
});
test('personal manual Strength and unrelated activities classified distinctly',()=>{
 const m=model();
 assert.equal(m.titleType('Krafttraining – Beine'),'strength');
 assert.equal(m.titleType('Radfahren'),'other'); // other legacy classifiers run after added precheck
});
test('client version patch is chained from .28 through .29 into .30',()=>{
 const id='/code/client/src/main.js';
 const v29=strength729Bridge().transform("const COMPASS_CLIENT_VERSION='0.5.77.28';",id).code;
 const v30=extension.transform(v29,id).code;
 assert.match(v30,/0\.5\.77\.30/);
 assert.throws(()=>extension.transform("const COMPASS_CLIENT_VERSION='0.5.77.28';",id),/Basis 0\.5\.77\.29/);
});
test('fail-closed anchor checking, other modules not transformed',()=>{
 assert.throws(()=>extension.transform('unrecognized source','/code/client/src/sports-insights.js'),/Integrationsanker/);
 assert.equal(extension.transform('arbitrary','/code/client/src/insights-fitness.js'),null);
});
