import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {compass751Bridge} from '../client/compass751-bridge.js';

const source=`
import './insights-navigation-v57750.css';
const COMPASS_CLIENT_VERSION='0.5.77.50';
function chrome(content) {
 return \`<div class="shell"><aside class="sidebar"><div class="brand"><span class="brand-icon">\${ico('compass',24)}</span><span class="brand-name">Compass</span></div></aside><main class="workspace">\${content}</main></div>\`;
}
function todayWork(locked=false) {return \`<div class="today-layout">\${calendarRail()}<div class="today-center"><section class="work-card today-tasks">\${taskList(dayTasks,'day')}</section><section class="work-card appointments">Termine</section></div><aside class="inspector-rail today-context-rail">\${todayInspectorOpen?taskEditor():todaySmartPanel()}</aside></div>\`;}
function todayScreen(){return chrome(\`\${calendarDeadlinePanel()}\${occasionPanel()}\${todayWork()}\`);}
`;

test('Premium bridge preserves Today task execution, Inspector and calendar logic',()=>{
 const s=compass751Bridge().transform(source,'/tmp/client/src/main.js')?.code;
 assert.ok(s);
 assert.match(s,/COMPASS_CLIENT_VERSION='0\.5\.77\.51'/);
 assert.match(s,/import '\.\/premium-ui-v57751.css'/);
 assert.match(s,/class="shell premium751"/);
 assert.match(s,/class="today-layout premium751-today"/);
 assert.match(s,/\$\{calendarRail\(\)\}/);
 assert.match(s,/\$\{taskList\(dayTasks,'day'\)\}/);
 assert.match(s,/\$\{todayInspectorOpen\?taskEditor\(\):todaySmartPanel\(\)\}/);
 assert.match(s,/function todayScreen\(\)\{return chrome/);
 assert.match(s,/import\.meta\.env\.BASE_URL\}icon-192.png/);
 assert.equal((s.match(/premium751-brandmark/g)||[]).length,1);
 const file=join(tmpdir(),`compass751-test-${process.pid}.mjs`);
 writeFileSync(file,s);
 try{execFileSync(process.execPath,['--check',file]);}finally{unlinkSync(file);}
});

test('Build integration fails closed on missing, duplicate and unexpected source anchors',()=>{
 const bridge=compass751Bridge();
 assert.equal(bridge.transform(source,'/other/client/src/overview.js'),null);
 assert.throws(()=>bridge.transform('unrelated','/app/client/src/main.js'),/version/);
 assert.throws(()=>bridge.transform(source.replace('<div class="today-layout">','<div class="other-layout">'),'/app/client/src/main.js'),/today workspace/);
 assert.throws(()=>bridge.transform(source+`\nconst a="const COMPASS_CLIENT_VERSION='0.5.77.50';";`,'/app/client/src/main.js'),/version/);
});

test('Actual Vite chain extends .50 without breaking preexisting PWA integration',()=>{
 const c=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(c,/import \{ compass750Bridge \} from '\.\/compass750-bridge\.js'/);
 assert.match(c,/import \{ compass751Bridge \} from '\.\/compass751-bridge\.js'/);
 assert.match(c,/compass747Bridge\(\), compass748Bridge\(\), compass749Bridge\(\), VitePWA/);
 assert.match(c,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\),/);
 assert.match(c,/compass750Bridge\(\)[\s\S]*compass751Bridge\(\)/);
});

test('Branded icons are valid, sized for PWA and retain SVG fallback',()=>{
 for(const [name,size] of [['icon-192.png',192],['icon-512.png',512],['apple-touch-icon.png',180]]){
  const data=readFileSync(new URL('../client/public/'+name,import.meta.url));
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(data.readUInt32BE(16),size);assert.equal(data.readUInt32BE(20),size);
 }
 const svg=readFileSync(new URL('../client/public/compass-icon.svg',import.meta.url),'utf8');
 assert.match(svg,/viewBox="0 0 192 192"/);assert.match(svg,/<svg/);assert.match(svg,/linearGradient/);
 const html=readFileSync(new URL('../client/index.html',import.meta.url),'utf8');
 assert.match(html,/rel="apple-touch-icon"/);
 const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(vite,/icon-192\.png/);assert.match(vite,/icon-512\.png/);assert.match(vite,/compass-icon\.svg/);
});

test('Premium CSS highlights Today with its task list, keeps important content visible, and supports mobile/reduced-motion',()=>{
 const css=readFileSync(new URL('../client/src/premium-ui-v57751.css',import.meta.url),'utf8');
 assert.match(css,/\.premium751 \.today-center>\.today-tasks\{order:-10\}/);
 assert.match(css,/\.premium751 \.today-center>\.appointments\{order:-5\}/);
 assert.match(css,/\.premium751 \.today-context-rail/);
 assert.match(css,/@media \(max-width:800px\)/);
 assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/\.today-tasks\s*\{[^}]*display\s*:\s*none/);
});
