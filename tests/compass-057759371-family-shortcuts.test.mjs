import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {familyTodayPanel} from '../client/src/family-radar-v5775931.js';
import {compass59371FamilyShortcutsRelease} from '../client/compass59371-family-shortcuts-release.js';
const root=resolve(new URL('..',import.meta.url).pathname);
const notice={id:'exam-en',personId:'n',personName:'Nathanael',title:'Englisch-Schularbeit',daysLeft:10,action:null};

test('Family notice provides an interactive crystal ball and a separate forecast icon',()=>{
 const html=familyTodayPanel([],[notice]);
 assert.match(html,/🔮/);assert.match(html,/data-action="fr31-person" data-id="n"/);
 assert.match(html,/data-action="fr371-plan" data-id="exam-en"/);
 assert.match(html,/Forecast öffnen/);
 assert.equal((html.match(/class="fr371-row"/g)||[]).length,1);
 assert.equal((html.match(/<button /g)||[]).length,3);
});
test('Unavailable People profile still opens source Calendar and Forecast without fabricating a profile',()=>{
 const html=familyTodayPanel([],[{...notice,personId:null}]);
 assert.match(html,/data-action="agenda-open" data-id="exam-en"/);
 assert.match(html,/data-action="fr371-plan" data-id="exam-en"/);
});
test('HTML, data ids and accessible labels are escaped',()=>{
 const html=familyTodayPanel([],[{...notice,title:'<script>x</script>',id:'" onfocus="alert(1)'}]);
 assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/data-id="" onfocus/);
});
test('release patch routes to planning, opens the selected Family Forecast and bumps versions',()=>{
 const p=compass59371FamilyShortcutsRelease();
 const src=`const COMPASS_CLIENT_VERSION='0.5.77.59.37';
const a='Build 0.5.77.59.37';
async function runAction(action,id,stepId=null,plannerDay=null) {return null;}`;
 const out=p.transform(src,'/repo/client/src/main.js').code;
 assert.match(out,/COMPASS_CLIENT_VERSION='0.5.77.59.37.1'/);
 assert.match(out,/familyStudyEventId37=id;tab='forecast';calmNavGroup='plan'/);
 assert.match(p.transform("const x='Build 0.5.77.59.37';",'/repo/client/src/ars-vivendi-lock-v5775922.js').code,/Build 0.5.77.59.37.1/);
 assert.throws(()=>p.transform('wrong version','/repo/client/src/main.js'),/build label/);
});
test('new plugin is registered after .37 and the complete source transforms and parses',async()=>{
 const config=readFileSync(resolve(root,'client/vite.config.js'),'utf8');
 assert.match(config,/compass5937FamilyPlanningRelease\(\)\);\s*compassConfig\.plugins\.push\(compass59371FamilyShortcutsRelease\(\)\)/);
 const imports=new Map([...config.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(m=>[m[1],m[2]]));
 const names=[...config.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(m=>m[1]);
 let main=readFileSync(resolve(root,'client/src/main.js'),'utf8');
 let lock=readFileSync(resolve(root,'client/src/ars-vivendi-lock-v5775922.js'),'utf8');
 for(const name of names){
  const file=imports.get(name);assert.ok(file,`Missing plugin import ${name}`);
  const mod=await import(pathToFileURL(resolve(root,'client',file)).href);const plugin=mod[name]();
  for(const [type,source] of [['main',main],['lock',lock]]){
   const result=await plugin.transform(source,resolve(root,'client/src',type==='main'?'main.js':'ars-vivendi-lock-v5775922.js'));
   if(result){if(type==='main')main=result.code;else lock=result.code;}
  }
 }
 assert.ok(names.length>=44);assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.39'/);
 assert.match(lock,/Build 0\.5\.77\.59\.39/);
 assert.match(main,/familyStudyEventId37=id;tab='forecast';calmNavGroup='plan'/);
 assert.match(main,/familyForecastPanel37/);assert.match(main,/familyTodayPanel/);
 execFileSync(process.execPath,['--input-type=module','--check'],{input:main});
});
