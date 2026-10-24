import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {compass749Bridge} from '../client/compass749-bridge.js';

// This is the ACTUAL transformed branch layout after Strength .28; the old
// .49 mock incorrectly assumed that Activity immediately followed Body.
const prepared48 = `
import './capacity-calendar-v57748.css';
const COMPASS_CLIENT_VERSION='0.5.77.48';
function screen(){return insightTab==='body'?healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition):insightTab==='strength'?strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today}):insightTab==='activity'?fitnessInsightsView():null;}
async function save(){await mutate(st=>saveCapacitySettings(st,{focusHours,reservePct,estimates}),null,true);}
`;

test('hotfix survives the real Strength .28 → .48 body/strength/activity branch order',()=>{
 const out=compass749Bridge().transform(prepared48,'/repo/client/src/main.js').code;
 assert.match(out,/COMPASS_CLIENT_VERSION='0\.5\.77\.49\.1'/);
 assert.match(out,/insightTab==='body'\?bodyTransformationView\(state/);
 assert.match(out,/healthBodyView\(state\?\.healthImports\|\|\{\},insightPeriod,insightBodyComposition\):insightTab==='strength'/);
 assert.match(out,/insightTab==='strength'\?strengthInsightsView/);
 assert.match(out,/insightTab==='activity'\?fitnessInsightsView/);
 assert.match(out,/saveCapacitySettings749\(st/);
 assert.equal(out.match(/bodyTransformationView\(state/g)?.length,1);
 const path=join(tmpdir(),`compass-hotfix-${process.pid}.mjs`);
 writeFileSync(path,out);
 try { execFileSync(process.execPath,['--check',path]); } finally { unlinkSync(path); }
});

test('fails closed for missing or duplicated body expression and unaffected paths',()=>{
 const bridge=compass749Bridge();
 assert.equal(bridge.transform(prepared48,'/repo/client/src/other.js'),null);
 assert.throws(()=>bridge.transform(prepared48.replace("insightTab==='body'?healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition)",'missing'),'/repo/client/src/main.js'),/body insights screen/);
 const repeated=prepared48.replace('function screen(){return', 'function screen(){return') + "\nconst duplicate = insightTab==='body'?healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition);\n";
 assert.throws(()=>bridge.transform(repeated,'/repo/client/src/main.js'),/body insights screen/);
});

test('regression fixture reflects actual Strength .28 rewrite from repo',()=>{
 const strength=readFileSync(new URL('../client/strength728-bridge.js',import.meta.url),'utf8');
 assert.match(strength,/insightTab==='strength'\?strengthInsightsView/);
 assert.match(strength,/insightTab==='activity'\?fitnessInsightsView/);
 assert.match(prepared48,/insightTab==='strength'\?strengthInsightsView/);
});
