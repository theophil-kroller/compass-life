import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {peopleRecoveryStep5933,peopleRecoveryPanel5933} from '../client/src/people-mobile-recovery-v5775933.js';
import {familySuggestions,familyTodayPanel} from '../client/src/family-radar-v5775931.js';

const entry=(id,summary,day)=>({id,summary,start:{date:day},status:'confirmed'});
const person={id:'p1',name:'Nathanael',aliases:'Nathaniel'};

test('nonempty People directory has no recovery prompt',()=>{
 assert.equal(peopleRecoveryPanel5933({count:2}), '');
});
test('empty phone without explicit encrypted mirror offers only setup, never cloud sharing',()=>{
 const step=peopleRecoveryStep5933({count:0});
 assert.equal(step.kind,'setup');assert.equal(step.action.kind,'tab');
 const html=peopleRecoveryPanel5933({count:0});
 assert.match(html,/data-tab="system"/);assert.doesNotMatch(html,/people-sync719-toggle/);
});
test('encrypted mirror without contacts opt-in asks explicit consent',()=>{
 const step=peopleRecoveryStep5933({mirrorReady:true,enabled:false,authenticated:true});
 assert.equal(step.kind,'consent');assert.equal(step.action.id,'people-sync719-toggle');
 assert.match(peopleRecoveryPanel5933({mirrorReady:true,enabled:false,authenticated:true}),/Kontakt-Sync hier aktivieren/);
});
test('authorized and online phone can explicitly refresh; offline never offers a broken button',()=>{
 const a=peopleRecoveryStep5933({mirrorReady:true,enabled:true,authenticated:true,online:true,syncStatus:'ok'});
 assert.equal(a.kind,'empty-remote');assert.equal(a.action.id,'people-sync719-now');
 const offline=peopleRecoveryStep5933({mirrorReady:true,enabled:true,authenticated:true,online:false});
 assert.equal(offline.action,null);
});
test('no People recovery work in Today and Focus layout is unchanged',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/peopleRecoveryPanel5933\(\{count:counts\.all/);
 assert.match(main,/if\(tab==='people'&&state\?\.peopleSyncEnabled===true/);
 assert.match(main,/journalSyncStatus!=='ok'/);
 assert.doesNotMatch(main,/function todayScreen\(\).*peopleRecoveryPanel5933/);
});
test('Family Radar today stays small and does not turn reminders into extra events',()=>{
 const events=[entry('math','Nathanael: Mathematik-Schularbeit','2026-11-11'),entry('math-rem','Nathanael: Mathematik-Schularbeit in einer Woche','2026-11-04'),entry('due','Nathanael: Praktikumsplatz abgeben','2026-11-17'),entry('other','Nathanael: Mathe-Test','2026-11-13')];
 const items=familySuggestions(events,{p1:person},{},{today:'2026-11-01'});
 assert.equal(items.filter(x=>x.id==='math').length,1);
 assert.equal(items.filter(x=>x.id==='math-rem').length,0);
 const html=familyTodayPanel(items);
 assert.match(html,/fr31-today/);
 assert.ok((html.match(/class="fr371-row"/g)||[]).length<=2);
 assert.ok((html.match(/data-action="fr31-person"/g)||[]).length<=4);
});
test('Calendar event prefix index supports aliases and disappears when event is removed',()=>{
 const a=[entry('x','Nathaniel: Mathematik-Schularbeit','2026-11-11')];
 assert.equal(familySuggestions(a,{p1:person},{},{today:'2026-11-01'}).length,1);
 assert.equal(familySuggestions([],{p1:person},{},{today:'2026-11-01'}).length,0);
});
test('bridge is version-only and does not rewrite existing handler or People screen',async()=>{
 const {compass5933PeopleFamilyBridge}=await import('../client/compass5933-people-family-bridge.js');
 const plugin=compass5933PeopleFamilyBridge();
 const src="const COMPASS_CLIENT_VERSION='0.5.77.59.32';\nconst mark='Build 0.5.77.59.32';\nfunction runAction(){};";
 const result=plugin.transform(src,'/repo/client/src/main.js').code;
 assert.match(result,/0\.5\.77\.59\.33/);assert.match(result,/function runAction\(\)\{\}/);
 assert.throws(()=>plugin.transform('wrong','/repo/client/src/main.js'),/badge/);
});
