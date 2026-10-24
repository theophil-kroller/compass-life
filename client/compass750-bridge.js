/** Compass 0.5.77.50 — consolidate Insights navigation after 0.5.77.49.1.
 * pre-transform runs AFTER older bridges, before compilation; no vault changes.
 */
export function compass750Bridge(){
 const once=(s,a,b,label)=>{
  const n=s.split(a).length-1;
  if(n!==1)throw Error(`Compass .50: ${label}: expected one anchor; found ${n}`);
  return s.replace(a,b);
 };
 return {name:'compass-750-insights-navigation',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;
  const ch=(a,b,label)=>{s=once(s,a,b,label);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.49.1';","const COMPASS_CLIENT_VERSION='0.5.77.50';",'visible version');
  ch("import './body-transformation-v57749.css';",
   "import './body-transformation-v57749.css';\nimport {INSIGHTS750_EXTERNAL,insights750Allowed,insights750Group,insights750Sidebar,insights750PrimaryTabs,insights750Subtabs,insights750Cockpit} from './insights-navigation-v57750.js';\nimport './insights-navigation-v57750.css';",'imports');

  // Replace only the Insights sidebar branch, not finance, planning or people.
  const start='<div class="calm-subitems" id="calm-nav-insights">';
  const end=' </div>`:\'\'}\n </div>\n <div class="calm-nav-group">';
  const a=s.indexOf(start),b=a>=0?s.indexOf(end,a+start.length):-1;
  if(a<0||b<0||s.indexOf(start,a+1)>=0||s.indexOf(end,b+end.length)>=0)
   throw Error('Compass .50: Insights sidebar: ambiguous or missing boundary');
  const backStart=s.indexOf('<button type="button" class="calm-mobile-nav-back"',a+start.length);
  const backEnd=backStart>=0?s.indexOf('</button>',backStart):-1;
  if(backStart<0||backEnd<0||backEnd>=b)throw Error('Compass .50: mobile sidebar back button missing');
  const back=s.slice(backStart,backEnd+'</button>'.length);
  s=s.slice(0,a+start.length)+'\n '+back+'\n ${insights750Sidebar(tab,insightTab,ico)}\n'+s.slice(b);

  const tabsPattern=/const tabs=compactInsights\.map\([^\n]*\)\.join\(''\);/g;
  const found=[...s.matchAll(tabsPattern)];
  if(found.length!==1)throw Error(`Compass .50: top toolbar: expected one anchor; found ${found.length}`);
  ch(found[0][0],'const tabs=insights750PrimaryTabs(tab,insightTab,ico);','five primary tabs');
  // We now have visible text subtabs; remove the old duplicate mini health icons.
  ch('const healthChoices=healthMode?', 'const healthChoices=false&&healthMode?', 'duplicate health mini-menu');
  ch('const tabDef=insightTab===\'capacity\'?',
   "const tabDef=insightTab==='intelligence'?{label:'Intelligence-Cockpit',subtitle:'Übersichten, Muster und nächste Schritte'}:insightTab==='capacity'?",'cockpit heading');
  ch("const content=insightTab==='capacity'?",
   "const content=insightTab==='intelligence'?insights750Cockpit(state,{today:localDate()}):insightTab==='capacity'?",'cockpit content');
  ch(' <div class="insight-view-header ${insightTab===\'sources\'?',
   ' ${insights750Subtabs(tab,insightTab)}\n <div class="insight-view-header ${insightTab===\'sources\'?', 'subtabs location');
  // Existing feature actions keep working. This only dispatches the new two-level nav.
  ch("if(action==='calm-nav-group'){",`if(action==='ins750-group'||action==='ins750-open'){
  const group=action==='ins750-group'?insights750Group(id):null;
  const target=group?(insights750Last[id]&&group.tabs.some(([key])=>key===insights750Last[id])?insights750Last[id]:group.default):id;
  if(!insights750Allowed(target))return;
  const owner=insights750GroupFor750(target);
  if(owner&&!INSIGHTS750_EXTERNAL.has(target))insights750Last[owner]=target;
  tab=INSIGHTS750_EXTERNAL.has(target)?target:'insights';
  if(tab==='insights')insightTab=target;
  calmNavGroup='insights';
  if(target==='places')insightPeriod='all';
  render();return;
 }
 if(action==='calm-nav-group'){`, 'group action');
  ch("let sleepMemo={data:null,period:'',today:'',value:null};",
   `let insights750Last=Object.create(null);
 function insights750GroupFor750(target){return ['intelligence','health','life','time','sources'].find(key=>insights750Group(key)?.tabs.some(([id])=>id===target))||null;}
 let sleepMemo={data:null,period:'',today:'',value:null};`, 'remember subtabs');
  return {code:s,map:null};
 }};
}
