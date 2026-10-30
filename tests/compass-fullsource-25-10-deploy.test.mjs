import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=x=>readFileSync(path.join(root,x),'utf8');
const full=read('client/src/main-full-v57759402510.js');
const cfg=read('client/vite.fullsource.config.js');
const html=read('client/index.html');
function imports(source,base){const re=/(?:^|\n)import\s+(?:[^;\n]*?\s+from\s+)?['"](\.[^'"]+)['"]|import\(\s*['"](\.[^'"]+)['"]\s*\)/g;let m,missing=[];while((m=re.exec(source))){let dest=path.resolve(base,m[1]||m[2]);if(!existsSync(dest))missing.push(dest);}return missing;}
test('complete web entry retains frozen fullsource imports and displays the package release',()=>{
 assert.ok(full.includes(`const COMPASS_CLIENT_VERSION='${JSON.parse(read('package.json')).version}'`));
 for(const x of ['focusActivityTypeChoices','timeProgressMarkup','projectTimeText','watchHistoryLoading','watchHistoryComplete','activityType:String(d.get(\'activityType\')','unified']){
  if(x!=='unified')assert.ok(full.includes(x),x);
 }
 assert.ok(full.includes("import './focus-productivity-v57759402510.css'"));
 assert.deepEqual(imports(full,path.join(root,'client/src')),[]);
});
test('Vite full snapshot config routes the original HTML to compiled release and retains PWA precache',()=>{
 assert.match(html,/src="\/src\/main\.js"/);
 assert.match(cfg,/main-full-v57759402510\.js/);
 assert.match(cfg,/ars-vivendi-lock-full-v5775922\.js/);
 assert.match(cfg,/maximumFileSizeToCacheInBytes:\s*4\s*\*\s*1024\s*\*\s*1024/);
 assert.match(read('client/package.json'),/vite build --config vite\.fullsource\.config\.js/);
 assert.deepEqual(imports(read('client/src/ars-vivendi-lock-full-v5775922.js'),path.join(root,'client/src')),[]);
});
test('complete release includes new Worker, migration, project classification and historical data',()=>{
 assert.match(read('worker/src/watch.js'),/revision/);
 assert.match(read('worker/migrations/0020_watch_session_revision.sql'),/watch_sessions/);
 assert.match(read('client/src/activity-management.js'),/activityTypeReview/);
 assert.match(read('client/src/personal-journal-v5692.js'),/unifiedTimeBreakdown/);
 assert.match(read('client/src/insights-productivity.js'),/stackedWorkDays/);
 assert.match(read('client/src/main-full-v57759402510.js'),/nextCursor/);
});
test('Vite full-release entry rewrites HTML to snapshot without duplicate scripts',async()=>{
 const vm=await import('node:vm');
 let script=cfg.replaceAll("import { defineConfig } from 'vite';",'').replaceAll("import { VitePWA } from 'vite-plugin-pwa';",'').replace('export default defineConfig(', 'globalThis.exported=defineConfig(');
 const context={process:{env:{VITE_BASE_PATH:'/compass-life/'}},defineConfig:v=>v,VitePWA:o=>({name:'pwa-stub',...o})};
 vm.runInNewContext(script,context);
 const hook=context.exported.plugins[0].transformIndexHtml;
 assert.equal(hook.order,'pre','Vite must transform snapshot imports BEFORE bundling');
 const result=hook.handler(html);
 assert.equal(hook.handler(result),result,'HTML replacement must be idempotent');
 assert.match(result,/src="\/src\/main-full-v57759402510\.js"/);
 assert.match(result,/src="\/src\/ars-vivendi-lock-full-v5775922\.js"/);
 assert.equal((result.match(/src="\/src\/main-full-v57759402510\.js"/g)||[]).length,1);
 assert.doesNotMatch(result,/src="\/src\/main\.js"/);
});
