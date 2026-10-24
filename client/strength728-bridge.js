/** Compass 0.5.77.28 · guarded source integration on top of Nutrition 3's .27 bridge.
 * Avoids shipping a forked 600KB main.js or replacing prior modules.
 * Vite's ordered pre-transforms: nutrition3Bridge() then strength728Bridge().
 */
export function strength728Bridge(){
 const change=(source,from,to,label)=>{
  const i=source.indexOf(from);
  if(i<0||source.indexOf(from,i+from.length)>=0)throw Error(`Strength .28: eindeutiger Integrationsanker fehlt (${label}). Vorher Nutrition 3 installieren bzw. Full Source prüfen.`);
  return source.slice(0,i)+to+source.slice(i+from.length);
 };
 return {name:'compass-strength-728',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/garmin-fit.js')){
   let out=change(source,'// FIT binary reader.','import {strengthFitField} from \'./garmin-strength-v57728.js\';\n// FIT binary reader.','FIT import');
   out=change(out,'const wanted=[275,521,370,227,55,18].includes(def.global),vals={};',
    'const wanted=[275,521,370,227,55,18,225,264,27].includes(def.global),vals={};','FIT message numbers');
   out=change(out,'if(wanted&&f.size<=128)vals[f.num]=fieldValue(b.subarray(offset,offset+f.size),f.base,def.little);',
    'if(wanted&&f.size<=128)vals[f.num]=([225,264,27].includes(def.global)?strengthFitField:fieldValue)(b.subarray(offset,offset+f.size),f.base,def.little);','FIT strength decoding');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/health-import.js')){
   let out=change(source,"import {decodeGarminFit,garminWellnessFromRecords,garminSleepJson,garminStressEnergyFromRecords,garminMonitoringFromRecords,garminSessionsFromRecords} from './garmin-fit.js';",
    "import {decodeGarminFit,garminWellnessFromRecords,garminSleepJson,garminStressEnergyFromRecords,garminMonitoringFromRecords,garminSessionsFromRecords} from './garmin-fit.js';\nimport {garminStrengthSessionsFromRecords,mergeStrengthImports} from './garmin-strength-v57728.js';",'health imports');
   const replace=(a,b,label)=>{out=change(out,a,b,label);};
   replace('const nights=new Map(),hrvs=new Map(),wellness=new Map(),fitness=new Map(),sessions=new Map();',
    'const nights=new Map(),hrvs=new Map(),wellness=new Map(),fitness=new Map(),sessions=new Map(),strength=new Map();','strength collection');
   replace('for(const item of garminSessionsFromRecords(rows))sessions.set(item.id,item);',
    'for(const item of garminSessionsFromRecords(rows))sessions.set(item.id,item);\n  for(const item of garminStrengthSessionsFromRecords(rows))strength.set(item.id,mergeStrengthImports(strength.has(item.id)?[strength.get(item.id)]:[],[item])[0]);','FIT set extraction');
   replace('sessions:[...sessions.values()].sort((a,b)=>a.start.localeCompare(b.start))};',
    'sessions:[...sessions.values()].sort((a,b)=>a.start.localeCompare(b.start)),strengthSessions:[...strength.values()].sort((a,b)=>a.start.localeCompare(b.start))};','merge return');
   replace('return {nights,hrvs:[],wellness:[],fitness:[],sessions:[],read:1,failed:[]};',
    'return {nights,hrvs:[],wellness:[],fitness:[],sessions:[],strengthSessions:[],read:1,failed:[]};','JSON fallback');
   replace('&&!parsed.sessions.length)throw Error(', '&&!parsed.sessions.length&&!parsed.strengthSessions.length)throw Error(', 'ZIP result guard');
   replace('const result={fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[],errors:[],processed:0,fileResults:[]};',
    'const result={fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[],garminStrength:[],errors:[],processed:0,fileResults:[]};','preview shape');
   replace('result.garminSessions.push(...(v.sessions||[]));',
    'result.garminSessions.push(...(v.sessions||[]));result.garminStrength.push(...(v.strengthSessions||[]));','parse aggregation');
   replace('result.garminSessions=unique(result.garminSessions,x=>x.id).sort((a,b)=>a.start.localeCompare(b.start));',
    'result.garminSessions=unique(result.garminSessions,x=>x.id).sort((a,b)=>a.start.localeCompare(b.start));\n result.garminStrength=mergeStrengthImports([],result.garminStrength);','preview dedupe');
   replace('garminSessions:[],lastImportAt:null};','garminSessions:[],garminStrength:[],lastImportAt:null};','new vault collections');
   replace('target.garminSessions=[...sessionMap.values()].sort((a,b)=>a.start.localeCompare(b.start));',
    'target.garminSessions=[...sessionMap.values()].sort((a,b)=>a.start.localeCompare(b.start));\n target.garminStrength=mergeStrengthImports(target.garminStrength||[],preview.garminStrength||[]);','idempotent vault strength merge');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/insights.js')){
   return {code:change(source,"{id:'activity',label:'Aktivität',icon:'heart',state:'live',subtitle:'Garmin-Schritte und Aktivitätsdateien sowie Health-Connect-Training'},",
    "{id:'activity',label:'Aktivität',icon:'heart',state:'live',subtitle:'Garmin-Schritte und Aktivitätsdateien sowie Health-Connect-Training'},\n  {id:'strength',label:'Krafttraining',icon:'activity',state:'live',subtitle:'Muskelkarte, dokumentierte Sätze und Trainingsbalance'},",'Insights metadata'),map:null};
  }
  if(path.endsWith('/client/src/main.js')){
   let out=source;const replace=(a,b,label)=>{out=change(out,a,b,label);};
   replace("const COMPASS_CLIENT_VERSION='0.5.77.27';","const COMPASS_CLIENT_VERSION='0.5.77.28';",'after Nutrition 3');
   replace("import './nutrition-connections-v57727.css';",
    "import './nutrition-connections-v57727.css';\nimport {strengthInsightsView} from './strength-insights-v57728.js';\nimport './strength-insights-v57728.css';",'Strength imports');
   replace("let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;",
    "let strengthRange728='28',strengthSide728='front';\nlet journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;",'Strength state');
   replace("['activity','Aktivität','activity']", "['activity','Aktivität','activity'],['strength','Krafttraining','activity']",'Insights top navigation');
   replace("${navItem('activity','Aktivitäten','activity')}",
    "${navItem('activity','Aktivitäten','activity')}\n  <button type=\"button\" class=\"nav-item ${tab==='insights'&&insightTab==='strength'?'is-active':''}\" data-action=\"calm-insight-view\" data-id=\"strength\">${ico('activity',19)}<span>Krafttraining</span></button>", 'sidebar navigation');
   replace(":insightTab==='activity'?fitnessInsightsView(",
    ":insightTab==='strength'?strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today}):insightTab==='activity'?fitnessInsightsView(",'content branch');
   replace("function render(){",
`function refreshStrength728(){
 const old=app.querySelector('.str728-root');
 if(!old||!state){render();return;}
 old.outerHTML=strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today:localDate()});
 app.querySelector('.str728-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
function render(){`,'local Strength redraw');
   replace(' // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.',
` // Strength: fast local map toggle, without re-rendering the whole GTD app.
 if(action==='str728-range'){if(!['7','28','90','365','all'].includes(id))return;strengthRange728=id;refreshStrength728();return;}
 if(action==='str728-side'){if(!['front','back'].includes(id))return;strengthSide728=id;refreshStrength728();return;}
 // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.`, 'range/side events');
   return {code:out,map:null};
  }
  return null;
 }};
}
