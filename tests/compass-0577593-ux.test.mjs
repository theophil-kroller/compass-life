import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {compass7593UxBridge} from '../client/compass7593-ux-bridge.js';

const fixture=String.raw`
calmNavGroup=['shopping','templates','projects','overview','next','forecast','radar','flagged','hold','someday'].includes(tab)?'plan':tab==='insights'||tab==='activity'||tab==='progress'||tab==='recovery'?'insights':tab==='finance'?'finance':'';
function navItem(id,label,icon){return label;}
function chrome(content){return \`\${navItem('forecast','Kalender & Forecast','calendar')}\`+content;}
function bind(){
 const el={dataset:{tab:'recovery'}};
 app.querySelectorAll('[data-tab]').forEach(el=>el.onclick=ev=>{ev?.preventDefault?.();const target=el.dataset.tab;if(!target)return;if(target==='today')todayInspectorOpen=false;tab=target;calmNavGroup=['overview','projects','templates','shopping','next','forecast','radar','flagged','hold','someday'].includes(tab)?'plan':['insights','activity','progress','recovery'].includes(tab)?'insights':'';if(tab==='finance')calmNavGroup='finance';render();});
}
async function runAction(action,id){if(action==='calm-finance-group'){return;}if(action==='calm-nav-group'){return;}}
function recoveryScreen(){return chrome(\`\${discoveryPanel()}<section class="work-card recovery-idea-hub"></section>\`);}
function activityScreen(){return chrome(\`<div class="activity-summary-insights"></div>\`);}
function progressScreen(){return chrome(\`<div class="progress-view"></div>\`);}
async function handleVault(){
  if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}toast('Lokaler Tresor bereit'+recoveryMessage+'.');
}
`;
const src=fixture.replaceAll('\\`','`').replaceAll('\\${','${');
const bridge=compass7593UxBridge();
const code=bridge.transform(src,'/test/client/src/main.js').code;

test('Planning recovery has no Insights tabs; activity/progress retain their navigation',()=>{
 assert.doesNotMatch(code,/insights750Subtabs\('recovery',insightTab\)/);
 assert.match(code,/insights750Subtabs\('activity',insightTab\)/);
 assert.match(code,/insights750Subtabs\('progress',insightTab\)/);
 assert.equal((code.match(/insights750Subtabs\(/g)||[]).length,2);
 assert.match(code,/\$\{discoveryPanel\(\)\}/);
 assert.match(code,/class="progress-view"/);
});
test('successful unlock sets Focus/Today but preserves deferred capture',()=>{
 const reset=code.indexOf("compass55Mode='focus'");
 const existingCapture=code.indexOf('if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}');
 assert.ok(reset>=0&&reset<existingCapture);
 assert.match(code,/if\(!captureAfterUnlock&&!bootView\)\{tab='today';todayInspectorOpen=false;calmNavGroup='';\}/);
 assert.match(code,/localStorage\.setItem\(COMPASS55_MODE_KEY,'focus'\)/);
 // Capture shortcut is handled after the Focus reset and remains available.
 assert.match(code,/if\(captureAfterUnlock\)\{captureOverlayOpen=true;captureAfterUnlock=false;\}/);
});
test('Focus reinitialization follows successful unlock; capture shortcut wins',async()=>{
 const make=(capture,view=null)=>{
  const storage=[];
  const ctx={captureAfterUnlock:capture,bootView:view,captureOverlayOpen:false,compass55Mode:'extended',
   COMPASS55_MODE_KEY:'compass.ui.focus.v57755',localStorage:{setItem(...args){storage.push(args);}},
   tab:capture?'inbox':'insights',todayInspectorOpen:true,calmNavGroup:'insights',
   recoveryMessage:'',toast:()=>{},app:{querySelectorAll:()=>[]},render:()=>{}};
  vm.createContext(ctx);
  vm.runInContext(code,ctx);
  return {ctx,storage};
 };
 let {ctx,storage}=make(false);
 await vm.runInContext('handleVault()',ctx);
 assert.equal(ctx.compass55Mode,'focus');
 assert.equal(ctx.tab,'today');
 assert.equal(ctx.todayInspectorOpen,false);
 assert.equal(ctx.calmNavGroup,'');
 assert.equal(ctx.captureOverlayOpen,false);
 assert.deepEqual(storage,[['compass.ui.focus.v57755','focus']]);
 ({ctx,storage}=make(true));
 await vm.runInContext('handleVault()',ctx);
 assert.equal(ctx.tab,'inbox');
 assert.equal(ctx.compass55Mode,'focus');
 assert.equal(ctx.captureOverlayOpen,true);
 assert.equal(ctx.captureAfterUnlock,false);
 ({ctx,storage}=make(false,'projects'));
 ctx.tab='projects';ctx.calmNavGroup='plan';
 await vm.runInContext('handleVault()',ctx);
 assert.equal(ctx.compass55Mode,'focus');
 assert.equal(ctx.tab,'projects');
 assert.equal(ctx.calmNavGroup,'plan');
});

test('transformed HTML and JS parse; non-main modules are unchanged',()=>{
 assert.equal(bridge.transform('return 42;', '/test/client/src/not-main.js'),null);
 const dir=mkdtempSync(join(tmpdir(),'compass593-'));
 try{
  const file=join(dir,'compiled.mjs');writeFileSync(file,code);
  execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('production Vite preserves .47-.49/PWA and .50-.58 adjacency; .59.3 runs before .50',()=>{
 const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(config,/import \{ compass7593UxBridge \} from '\.\/compass7593-ux-bridge\.js';/);
 assert.match(config,/compass747Bridge\(\), compass748Bridge\(\), compass749Bridge\(\), VitePWA\(/);
 assert.match(config,/VitePWA\([\s\S]*?\),\s*\/\/ Guarded 0\.5\.77\.50/);
 assert.match(config,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(config,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/);
});


test('.59.8 routes leisure into Planen and Life Balance from Insights header',()=>{
 assert.match(code,/navItem\('recovery','Freizeit & Erholung','heart'\)/);
 assert.match(code,/someday','recovery'\]\.includes\(tab\)\?'plan'/);
 assert.match(code,/if\(target==='recovery'\)\{compass55Mode='extended'/);
 assert.match(code,/if\(action==='calm-nav-group'&&id==='insights'\)\{tab='insights';insightTab='balance'/);
 assert.doesNotMatch(code,/insights750Subtabs\('recovery'/);
});
