import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
const begin=source.indexOf('function mensaPageVisible(){');
const end=source.indexOf('const mensaLocalDay=',begin);
assert.ok(begin>0&&end>begin);
const code=source.slice(begin,end).replace("import('./mensa-catalog-v57759402512.js')",'fakeImport()');
function createLoader(fakeImport){
 const calls=[];let afterFrame=null;
 const state={mensaCatalog:null,privateDeviceMirror:{key:'test'}};
 const sandbox={
  state,tab:'insights',insightTab:'nutrition',nutritionView712:'mensa',
  mensaApi:null,mensaLoadPending:null,mensaLoadError:'',mensaMessage:'',authToken:'TOKEN',
  navigator:{onLine:true},fakeImport,render:()=>calls.push('render'),
  mutate:async(fn)=>{calls.push('mutate');fn(state);},
  syncPersonalJournal:async()=>{calls.push('remote-sync');},
  requestAnimationFrame:(cb)=>{afterFrame=cb;},setTimeout:(fn,ms)=>{if(ms===12000)return 42;calls.push('schedule');fn();return 7;},clearTimeout:()=>{},
 };
 vm.runInNewContext(`${code}
this.testEnsure=ensureMensaForNutrition;`,sandbox);
 return {sandbox,calls,frame:()=>afterFrame?.()};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('Mensa panel is revealed before seed encryption and cloud sync run',async()=>{
 const loader=createLoader(()=>Promise.resolve({installMensaSeed:st=>{st.mensaCatalog={seedImported:true,entries:[]};}}));
 loader.sandbox.testEnsure();
 await flush();
 assert.equal(loader.calls[0],'render');
 assert.equal(loader.calls.includes('mutate'),false);
 assert.equal(loader.calls.includes('remote-sync'),false);
 loader.frame();await flush();
 assert.equal(loader.calls.includes('mutate'),true);
 assert.equal(loader.calls.includes('remote-sync'),true);
 assert.ok(loader.calls.indexOf('render')<loader.calls.indexOf('mutate'));
});
test('Mensa dynamic import errors surface and do not trigger endless retries',async()=>{
 let attempts=0;
 const loader=createLoader(()=>{attempts++;return Promise.reject(Error('chunk not found'));});
 loader.sandbox.testEnsure();await flush();
 assert.equal(attempts,1);
 assert.match(loader.sandbox.mensaLoadError,/chunk not found/);
 assert.deepEqual(loader.calls,['render']);
 loader.sandbox.testEnsure();await flush();
 assert.equal(attempts,1);
 assert.match(source,/data-action="mensa-retry-load"/);
});
test('Mensa loading is conditional on selecting the Mensa subtab, not merely Today',async()=>{
 const loader=createLoader(()=>Promise.resolve({}));
 loader.sandbox.tab='today';loader.sandbox.testEnsure();
 await flush();assert.deepEqual(loader.calls,[]);
 loader.sandbox.tab='insights';loader.sandbox.nutritionView712='journal';loader.sandbox.testEnsure();
 await flush();assert.deepEqual(loader.calls,[]);
});
test('lazy panel renders an actionable error instead of an eternal spinner',()=>{
 assert.match(source,/mensaLoadError\?`<section class="mensa-load-failure"/);
 assert.match(source,/if\(action==='mensa-retry-load'\)/);
 assert.match(source,/if\(mensaPageVisible\(\)\)render\(\);\s*\/\/ Post-paint initialization/);
});
