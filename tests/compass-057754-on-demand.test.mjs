import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createOnDemandRouteLoader} from '../client/src/on-demand-v57754.js';
import {FINANCE_TABS,FINANCE_GROUPS,INSIGHT_TABS,INSIGHT_PERIODS} from '../client/src/lazy-routes-v57754.js';
import {compass754Bridge} from '../client/compass754-bridge.js';

const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('route loaders do not import anything before explicit activation and load each group once',async()=>{
 let loaded=0;const steps=[];
 const loader=createOnDemandRouteLoader({finance:[['overview',async()=>{loaded++;return {view:1}}],['details',async()=>{loaded++;return {view:2}}]],insights:[['sleep',async()=>{loaded++;return {view:3}}]]},(kind,status)=>steps.push([kind,status.completed]));
 assert.equal(loaded,0);assert.equal(loader.get('finance').status,'idle');
 const [a,b]=await Promise.all([loader.ensure('finance'),loader.ensure('finance')]);
 assert.strictEqual(a,b);assert.equal(loaded,2);
 assert.equal(loader.get('insights').status,'idle');assert.equal(loader.get('finance').status,'ready');
 await loader.ensure('finance');assert.equal(loaded,2);
 await loader.ensure('insights');assert.equal(loaded,3);assert.deepEqual(steps.filter(x=>x[0]==='insights').map(x=>x[1]),[0,1,1]);
});

test('loader reports real module progress and allows retry after an import error',async()=>{
 let attempts=0;const observed=[];
 const loader=createOnDemandRouteLoader({finance:[['views',()=>{attempts++;return attempts===1?Promise.reject(new Error('offline')):Promise.resolve('ok');}]]},(kind,state)=>observed.push([state.status,state.completed]));
 await assert.rejects(loader.ensure('finance'),/offline/);
 assert.equal(loader.get('finance').status,'failed');
 await loader.ensure('finance');assert.equal(loader.get('finance').status,'ready');assert.equal(attempts,2);
 assert.ok(observed.some(([s])=>s==='failed'));
});

test('metadata keeps finance panes and insight routes available without importing their renderers',()=>{
 assert.ok(FINANCE_TABS.find(x=>x.title==='Überblick'));
 assert.ok(FINANCE_TABS.find(x=>x.title==='Portfolio'));
 assert.deepEqual(FINANCE_GROUPS.map(x=>x.title),['Überblick','Ausgaben','Vermögen','Planung','Werkzeuge']);
 assert.ok(INSIGHT_TABS.some(t=>t.id==='sleep'));
 assert.ok(INSIGHT_TABS.some(t=>t.id==='sources'));
 assert.ok(INSIGHT_PERIODS.some(([id])=>id==='365'));
 const code=readFileSync(new URL('../client/src/lazy-routes-v57754.js',import.meta.url),'utf8');
 assert.doesNotMatch(code,/import .*finance-dashboard|import .*insights\.js/);
});

const fixture=[
"import {financeDashboardView,FINANCE_TABS,FINANCE_GROUPS,financeGroupForPane} from './finance-dashboard.js';",
"import {financePremiumOverviewView} from './finance-premium-v57753.js';",
"import {INSIGHT_TABS,INSIGHT_PERIODS,buildSleepInsights,insightsSleepView,insightsPlannedView} from './insights.js';",
"import {insightsStressView,insightsEnergyView} from './insights-wellness.js';",
"import {fitnessInsightsView} from './insights-fitness.js';",
"import {buildProductivityInsights,productivityInsightsView} from './insights-productivity.js';",
"import {exploreDays,exploreView,EXPLORE_FIELDS} from './insights-explorer.js';",
"const COMPASS_CLIENT_VERSION='0.5.77.53';",
"const app=document.getElementById('app');",
"function vaultScreen(){return chrome('<div>Unlocked</div>');}",
"function todayScreen(){return chrome('Heute');}",
"function financeScreen(){if(financePane==='Überblick')return chrome(financePremiumOverviewView(state,{period:financePeriod,account:financeAccount,today:localDate()}));return chrome(financeDashboardView(state));}",
"function insightsScreen(){return chrome(insightsSleepView(buildSleepInsights(state,localDate(),'28')));}",
"function render(){if(!state){app.innerHTML=vaultScreen()+(feelingOverlayOpen?feelingOverlay():'' );}else{app.innerHTML=tab==='today'?todayScreen():tab==='finance'?financeScreen():insightsScreen();}}",
"async function syncNow(){busy=true;render();\n  try {\n    const health=await request(config.apiUrl,authToken,'/api/health');\n  } finally {busy=false;render();}}",
"async function onAction(action){if(action==='finance-pane'){return;}}",
"function navigate(){if((tab==='activity'||tab==='overview'||tab==='progress'||tab==='recovery'||tab==='insights')&&authToken)reloadWatchSessions().catch(()=>{});if((tab==='progress'||tab==='recovery'||tab==='insights')&&authToken){reloadHealth().catch(()=>{});reloadWidgetDevices().catch(()=>{});}}",
"function unlock(){morningRestoreConfig();\n      const savedMorningDraft=state?.miracleMorning?.draft;}",
].join('\n');

test('guarded integration splits Finance and Insights, preserves Today and gives a standalone vault',()=>{
 const bridge=compass754Bridge(),out=bridge.transform(fixture,'/repo/client/src/main.js').code;
 assert.match(out,/COMPASS_CLIENT_VERSION='0\.5\.77\.54'/);
 assert.match(out,/import\('\.\/finance-dashboard\.js'\)/);
 assert.match(out,/import\('\.\/finance-premium-v57753\.js'\)/);
 assert.match(out,/import\('\.\/insights\.js'\)/);
 assert.doesNotMatch(out,/import \{financeDashboardView/);
 assert.doesNotMatch(out,/import \{INSIGHT_TABS,INSIGHT_PERIODS,buildSleepInsights/);
 assert.match(out,/function todayScreen\(\)\{return chrome\('Heute'\);\}/);
 assert.match(out,/function financeScreen\(\)\{if\(!compass54Ready\('finance'\)\)/);
 assert.match(out,/function insightsScreen\(\)\{if\(!compass54Ready\('insights'\)\)/);
 assert.match(out,/aria-label="Compass Tresor entsperren"/);
 assert.doesNotMatch(out,/function vaultScreen\(\)\{return chrome\(/);
 assert.match(out,/role="progressbar"/);
 assert.match(out,/!bootView&&!bootCapture\)tab='today'/);
 assert.doesNotMatch(out,/busy=true;render\(\);/);
 const path=join(tmpdir(),`compass54-${process.pid}.mjs`);writeFileSync(path,out);
 try{execFileSync(process.execPath,['--check',path]);}finally{unlinkSync(path);}
 assert.equal(bridge.transform(fixture,'/repo/client/src/other.js'),null);
});

test('fail-closed bridge rejects missing anchors, rather than silently shipping half a migration',()=>{
 const b=compass754Bridge();
 assert.throws(()=>b.transform(fixture.replace("const COMPASS_CLIENT_VERSION='0.5.77.53';",'// none'),'/repo/client/src/main.js'),/version/);
 assert.throws(()=>b.transform(fixture.replace('function vaultScreen(){','function otherScreen(){'),'/repo/client/src/main.js'),/vault screen/);
 assert.throws(()=>b.transform(fixture.replace("import {insightsStressView,insightsEnergyView} from './insights-wellness.js';",'// missing'),'/repo/client/src/main.js'),/lazy wellness/);
});

test('existing Vite chain remains ordered and includes the new lazy route stage last',()=>{
 const s=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(s,/import \{ compass754Bridge \} from '\.\/compass754-bridge\.js'/);
 assert.match(s,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\),/);
});
