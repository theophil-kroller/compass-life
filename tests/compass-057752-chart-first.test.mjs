import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {compass752Bridge} from '../client/compass752-bridge.js';
const clientPath=new URL('../client/',import.meta.url);
const read=p=>readFileSync(new URL(p,clientPath),'utf8');
const mainFixture=`import './premium-ui-v57751.css';
const COMPASS_CLIENT_VERSION='0.5.77.51';
function insightsScreen(){ return chrome(\`<div class="insight-workspace" aria-label="Compass Insights · Personal Analytics">\${content}</div>\`); }
function todayWork(){return \`<div class="today-layout premium751-today">\${calendarRail()}<section class="today-tasks">\${taskList(dayTasks,'day')}</section>\${todaySmartPanel()}</div>\`;}
`;
const sleepFixture=`export function insightsSleepView(model,selectedNight='',ico=()=>'',today='',imported={},healthAi={}){
 const sleep=renderSleepIntelligence({nights:[]}); const findings=healthFindings({});
 return \`<div class="insight-sleep-content">
 \${healthFindingsView(findings,healthAi.order||[],healthAi.status||'')}
 \${sleepDataProvenance(model,imported)}
 \${sleep}
 <details class="sleep550-extra sleep550-extended"><summary>Weitere Analysen: Schlafkonsistenz, Boxplots & HRV</summary>\${sleepHrvScatter([])}</details>
 <div class="insight-footnote">Quelle: Garmin</div></div>\`;
}`;
test('new bridge is fail-closed and applies only to the intended files',()=>{
 const bridge=compass752Bridge();
 assert.equal(bridge.transform('anything','/workspace/client/src/tasks.js'),null);
 assert.throws(()=>bridge.transform('broken','/workspace/client/src/main.js'),/version/);
 assert.throws(()=>bridge.transform(mainFixture.replace('COMPASS_CLIENT_VERSION','UNEXPECTED'),'/workspace/client/src/main.js'),/version/);
});
test('real main integration upgrades version and UI class without altering Today flow',()=>{
 const code=compass752Bridge().transform(mainFixture,'/workspace/client/src/main.js').code;
 assert.match(code,/COMPASS_CLIENT_VERSION='0\.5\.77\.52'/);
 assert.match(code,/import '\.\/chart-first-v57752\.css'/);
 assert.match(code,/cf52-insight cf52-\$\{insightTab\}/);
 assert.match(code,/todayWork\(\)/);
 assert.match(code,/todaySmartPanel\(\)/);
 assert.match(code,/taskList\(dayTasks,'day'\)/);
 const filename=join(tmpdir(),`compass752main-${process.pid}.mjs`);
 writeFileSync(filename,code);
 try{execFileSync(process.execPath,['--check',filename]);}finally{unlinkSync(filename);}
});
test('sleep analytics are first and deeper plots open on first visit',()=>{
 const code=compass752Bridge().transform(sleepFixture,'/workspace/client/src/insights.js').code;
 const p=code.indexOf(' ${sleep}'), h=code.indexOf(' ${healthFindingsView');
 assert.ok(p>=0&&h>p,'Sleep visuals must precede findings and prose');
 assert.match(code,/<details class="sleep550-extra sleep550-extended" open>/);
 assert.match(code,/Quellen &amp; Datenqualität/);
 assert.match(code,/sleepDataProvenance\(model,imported\)/);
 assert.match(code,/sleepHrvScatter/);
 const filename=join(tmpdir(),`compass752sleep-${process.pid}.mjs`);
 writeFileSync(filename,code);
 try{execFileSync(process.execPath,['--check',filename]);}finally{unlinkSync(filename);}
});
test('sleep fails closed if upstream markup changed or doubled',()=>{
 const b=compass752Bridge();
 assert.throws(()=>b.transform('export function nope(){}','/workspace/client/src/insights.js'),/sleep charts/);
 assert.throws(()=>b.transform(sleepFixture+sleepFixture,'/workspace/client/src/insights.js'),/sleep charts/);
});
test('chart-first CSS puts real daily charts before explanatory copy and avoids Today changes',()=>{
 const css=read('src/chart-first-v57752.css');
 for(const part of ['.cf52-stress','.cf52-energy','.cf52-body','.cf52-sleep','sleep550-extended','bt749-metric:first-child'])assert.ok(css.includes(part),part);
 assert.match(css,/insight-wellness>\.insight-chart-card\{order:1/);
 assert.match(css,/insight-wellness>\.insight-kpi-grid[\s\S]*?\{order:2/);
 assert.doesNotMatch(css,/\.today-tasks|\.today-center|\.today-context-rail/);
 assert.doesNotMatch(css,/\.bt749-cards\s*\{\s*display\s*:\s*none/);
});
test('plugin order .51→.52 and historical fail-closed ordering are preserved',()=>{
 const c=read('vite.config.js');
 assert.match(c,/import \{ compass752Bridge \} from '\.\/compass752-bridge\.js'/);
 assert.match(c,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\)\]/);
 assert.match(c,/compass747Bridge\(\), compass748Bridge\(\), compass749Bridge\(\), VitePWA/);
});
