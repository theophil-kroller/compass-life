/** Compass Life 0.5.77.54 — GTD-first on-demand Insights + Finance.
 * Guarded compile-time transform after .53. No changes to durable state/vault schema.
 */
export function compass754Bridge(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .54: ${label}: expected exactly one anchor; found ${n}`);return s.replace(a,b);};
 return {name:'compass-754-on-demand',enforce:'pre',transform(source,id){
  const file=id.replace(/\\/g,'/').split('?')[0];
  if(!file.endsWith('/client/src/main.js'))return null;
  let s=source;
  const ch=(a,b,label)=>{s=once(s,a,b,label);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.53';", "const COMPASS_CLIENT_VERSION='0.5.77.54';",'version');
  ch("import {financeDashboardView,FINANCE_TABS,FINANCE_GROUPS,financeGroupForPane} from './finance-dashboard.js';",
     "import {FINANCE_TABS,FINANCE_GROUPS,financeGroupForPane,INSIGHT_TABS,INSIGHT_PERIODS} from './lazy-routes-v57754.js';\nimport {createOnDemandRouteLoader} from './on-demand-v57754.js';\nimport './on-demand-v57754.css';\nlet financeDashboardView,financePremiumOverviewView;",'remove heavy finance static import');
  ch("import {financePremiumOverviewView} from './finance-premium-v57753.js';",'', 'remove premium finance static import');
  ch("import {INSIGHT_TABS,INSIGHT_PERIODS,buildSleepInsights,insightsSleepView,insightsPlannedView} from './insights.js';",
     'let buildSleepInsights,insightsSleepView,insightsPlannedView;', 'remove sleep analytics static import');
  ch("import {insightsStressView,insightsEnergyView} from './insights-wellness.js';", 'let insightsStressView,insightsEnergyView;', 'lazy wellness');
  ch("import {fitnessInsightsView} from './insights-fitness.js';",'let fitnessInsightsView;', 'lazy fitness');
  ch("import {buildProductivityInsights,productivityInsightsView} from './insights-productivity.js';",'let buildProductivityInsights,productivityInsightsView;', 'lazy productivity');
  ch("import {exploreDays,exploreView,EXPLORE_FIELDS} from './insights-explorer.js';",'let exploreDays,exploreView;','lazy explorer');
  // Finance navigation metadata remains tiny and resident; costly chart modules stay out of initial chunks.
  const helper=`
const compass54Loader=createOnDemandRouteLoader({
 finance:[['overview',()=>import('./finance-premium-v57753.js')],['details',()=>import('./finance-dashboard.js')]],
 insights:[['sleep',()=>import('./insights.js')],['wellness',()=>import('./insights-wellness.js')],['fitness',()=>import('./insights-fitness.js')],['productivity',()=>import('./insights-productivity.js')],['explore',()=>import('./insights-explorer.js')]]
},(kind,status)=>{
 const track=app.querySelector('[data-compass54-track="'+kind+'"]');
 if(track){const percent=status.total?Math.round(status.completed/status.total*100):0;track.style.width=percent+'%';track.parentElement?.setAttribute('aria-valuenow',String(percent));}
 const progress=app.querySelector('[data-compass54-progress="'+kind+'"]');
 if(progress)progress.textContent=status.completed+' / '+status.total+' Module geladen';
});
function compass54Ready(kind){return compass54Loader.get(kind)?.status==='ready'&& (kind==='finance'?typeof financeDashboardView==='function'&&typeof financePremiumOverviewView==='function':typeof insightsSleepView==='function'&&typeof insightsEnergyView==='function');}
function compass54Load(kind){
 return compass54Loader.ensure(kind).then(modules=>{
  if(kind==='finance'){
   financePremiumOverviewView=modules.overview.financePremiumOverviewView;
   financeDashboardView=modules.details.financeDashboardView;
  } else {
   ({buildSleepInsights,insightsSleepView,insightsPlannedView}=modules.sleep);
   ({insightsStressView,insightsEnergyView}=modules.wellness);
   ({fitnessInsightsView}=modules.fitness);
   ({buildProductivityInsights,productivityInsightsView}=modules.productivity);
   ({exploreDays,exploreView}=modules.explore);
  }
  if(state&&tab===kind)render();
 }).catch(err=>{
  console.error('Compass Modul konnte nicht vorbereitet werden',kind,err);
  if(state&&tab===kind)render();
 });
}
function compass54LoadingScreen(kind){
 const info=compass54Loader.get(kind),title=kind==='finance'?'Finanzen':'Insights';
 if(info.status==='idle'){
  const start=()=>{if(state&&tab===kind)compass54Load(kind);};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(start);else queueMicrotask(start);
 }
 const progress=info.total?Math.round(info.completed/info.total*100):0;
 const failed=info.status==='failed';
 return chrome(__TICK__<section class="compass54-load" aria-label="__DOLLAR__{title} werden vorbereitet" aria-live="polite">
  <h2>__DOLLAR__{failed?title+' konnte nicht geöffnet werden':'Compass bereitet '+title+' vor'}</h2>
  <p>__DOLLAR__{failed?'Die Module konnten nicht geladen werden. Prüfe die Verbindung und versuche es erneut.':'Compass is preparing your data for a fast experience. Das GTD-Arbeitssystem bleibt davon unabhängig.'}</p>
  __DOLLAR__{failed?'':__TICK__<div class="compass54-load-track" role="progressbar" aria-label="Modul-Fortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="__DOLLAR__{progress}"><span class="compass54-load-fill" data-compass54-track="__DOLLAR__{kind}" style="width:__DOLLAR__{progress}%"></span></div><div class="compass54-load-status" data-compass54-progress="__DOLLAR__{kind}">__DOLLAR__{info.completed} / __DOLLAR__{info.total} Module geladen</div>__TICK__}
  __DOLLAR__{failed?'<button type="button" class="secondary-btn" data-action="compass54-retry">Erneut versuchen</button>':''}
 </section>__TICK__);
}
`;
  // Using placeholder markers below avoids accidental interpolation by this bridge's own JS template literal.
  const helperFixed=helper.replace(/__TICK__/g,'`').replace(/__DOLLAR__/g,'$');
  ch('const app=document.getElementById(\'app\');',"const app=document.getElementById('app');\n"+helperFixed,'module loader declaration');
  ch('function financeScreen(){',"function financeScreen(){if(!compass54Ready('finance'))return compass54LoadingScreen('finance');",'finance load guard');
  ch('function insightsScreen(){',"function insightsScreen(){if(!compass54Ready('insights'))return compass54LoadingScreen('insights');",'insights load guard');
  // Dedicated locked screen: no app navigation, no analytics and no mock Today below it.
  const vaultBegin='function vaultScreen(){',vaultEnd='\nfunction todayScreen(){';
  const a=s.indexOf(vaultBegin),b=a>=0?s.indexOf(vaultEnd,a):-1;
  if(a<0||b<0||s.indexOf(vaultBegin,a+1)>=0)throw Error('Compass .54: vault screen boundaries missing');
  const vault=`function vaultScreen(){
 return __TICK__<main class="compass54-lock" aria-label="Compass Tresor entsperren">
 <section class="compass54-lock-card"><img class="compass54-mark" src="__DOLLAR__{import.meta.env.BASE_URL}icon-192.png" alt="" width="68" height="68"/>
 <h1>__DOLLAR__{hasVault?'Willkommen zurück':'Compass einrichten'}</h1><p>__DOLLAR__{hasVault?'Dein persönlicher Arbeitsraum ist geschützt.':'Deine Daten bleiben lokal verschlüsselt. Richte eine Passphrase ein.'}</p>
 __DOLLAR__{notice?__TICK__<div class="alert" role="status">__DOLLAR__{h(notice)}</div>__TICK__:''}
 __DOLLAR__{error?__TICK__<div class="alert bad" role="alert">__DOLLAR__{h(error)}</div>__TICK__:''}
 <form id="vault-form" autocomplete="off"><label class="sr-only" for="passphrase">Passphrase</label><input id="passphrase" name="passphrase" type="password" required minlength="12" autocomplete="current-password" placeholder="Passphrase" />
 __DOLLAR__{!hasVault?__TICK__<label class="sr-only" for="passphrase-repeat">Passphrase wiederholen</label><input id="passphrase-repeat" name="repeat" type="password" required minlength="12" autocomplete="new-password" placeholder="Passphrase wiederholen"/>__TICK__:''}
 <button type="submit" class="primary-btn">__DOLLAR__{hasVault?'Entsperren':'Tresor erstellen'}</button>
 __DOLLAR__{!hasVault?__TICK__<label class="restore-label" for="encrypted-import">Verschlüsseltes Backup wiederherstellen</label><input id="encrypted-import" type="file" accept="application/json"/>__TICK__:''}
 </form><small class="compass54-lock-foot">Compass · Relaxed Control · Lokal verschlüsselt</small></section></main>__TICK__;
}`.replace(/__TICK__/g,'`').replace(/__DOLLAR__/g,'$');
  s=s.slice(0,a)+vault+s.slice(b);
  // The original render() remains responsible for the lock/unlock binding and overlays.
  // Optimize sync status repaint, without hiding synchronization conflicts.
  ch('busy=true;render();\n  try {\n    const health=await request(config.apiUrl,authToken,\'/api/health\');',
     "busy=true;\n  try {\n    const health=await request(config.apiUrl,authToken,'/api/health');", 'do not redraw GTD merely because sync started');
  ch("if(action==='finance-pane'){", "if(action==='compass54-retry'){if(tab==='finance'||tab==='insights'){compass54Load(tab);render();}return;}\n    if(action==='finance-pane'){", 'module retry handler');
  ch("if((tab==='activity'||tab==='overview'||tab==='progress'||tab==='recovery'||tab==='insights')&&authToken)reloadWatchSessions().catch(()=>{});if((tab==='progress'||tab==='recovery'||tab==='insights')&&authToken){reloadHealth().catch(()=>{});reloadWidgetDevices().catch(()=>{});}",
     "if((tab==='activity'||tab==='overview'||tab==='progress'||tab==='recovery')&&authToken)reloadWatchSessions().catch(()=>{});if((tab==='progress'||tab==='recovery')&&authToken){reloadHealth().catch(()=>{});reloadWidgetDevices().catch(()=>{});}", 'stop triple refresh during Insights route activation');
  ch('morningRestoreConfig();\n      const savedMorningDraft=', "morningRestoreConfig();\n      if(!bootView&&!bootCapture)tab='today';\n      const savedMorningDraft=",'Today default after unlocking');
  ch("app.innerHTML=vaultScreen()+(feelingOverlayOpen?", "app.innerHTML=vaultScreen()+(feelingOverlayOpen?",'locked hook existence'); // no-op assertion
  ch("if(!state){app.innerHTML=vaultScreen()+(feelingOverlayOpen?", "if(!state){app.innerHTML=vaultScreen()+(feelingOverlayOpen?",'locked render anchor'); // no-op assertion
  return {code:s,map:null};
 }};
}
