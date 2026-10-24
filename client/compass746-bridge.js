/** Compass 0.5.77.46 — add read-only Weekly Life Intelligence after .45.
 * Fails closed when prior integration anchors no longer match. No server change.
 */
export function compass746Bridge(){
 const one=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .46: ${label}: expected one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-746-weekly-life-intelligence',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;const ch=(a,b,k)=>{s=one(s,a,b,k);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.45';","const COMPASS_CLIENT_VERSION='0.5.77.46';",'visible version');
  ch("import {setReceiptCategory} from './receipt-categories-v57745.js';",
     "import {setReceiptCategory} from './receipt-categories-v57745.js';\nimport {weeklyIntelligenceView} from './weekly-intelligence-v57746.js';\nimport './weekly-intelligence-v57746.css';",'weekly imports');
  ch("let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;",
     "let weeklyOffset746=0;\nlet journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;",'week navigation state');
  ch("const tabDef=insightTab==='dreamworld'?",
     "const tabDef=insightTab==='weekly'?{label:'Wochenkompass',subtitle:'Letzte vollständig vergangene Tage · Datenstand je Quelle'}:insightTab==='dreamworld'?",'weekly insights header');
  ch("const compactInsights=[['dreamworld','Traumwelt','moon']",
     "const compactInsights=[['weekly','Wochenkompass','calendar'],['dreamworld','Traumwelt','moon']",'insights tab');
  ch("const content=insightTab==='dreamworld'?",
     "const content=insightTab==='weekly'?weeklyIntelligenceView(state,{today:localDate(),offset:weeklyOffset746}):insightTab==='dreamworld'?",'weekly content');
  ch("if(action==='insights-tab'){if(id==='touch'||id==='dreamworld'||INSIGHT_TABS.some(t=>t.id===id))",
     "if(action==='insights-tab'){if(id==='touch'||id==='dreamworld'||id==='weekly'||INSIGHT_TABS.some(t=>t.id===id))",'compact weekly action');
  ch("if(action==='calm-insight-view'){if(id==='dreamworld'||INSIGHT_TABS.some(t=>t.id===id)||",
     "if(action==='calm-insight-view'){if(id==='dreamworld'||id==='weekly'||INSIGHT_TABS.some(t=>t.id===id)||",'sidebar weekly action');
  ch('<button type="button" class="nav-item ${tab===\'insights\'&&insightTab===\'dreamworld\'?\'is-active\':\'\'}" data-action="calm-insight-view" data-id="dreamworld">',
     '<button type="button" class="nav-item ${tab===\'insights\'&&insightTab===\'weekly\'?\'is-active\':\'\'}" data-action="calm-insight-view" data-id="weekly">${ico(\'calendar\',19)}<span>Wochenkompass</span></button>\n <button type="button" class="nav-item ${tab===\'insights\'&&insightTab===\'dreamworld\'?\'is-active\':\'\'}" data-action="calm-insight-view" data-id="dreamworld">',
     'weekly sidebar nav');
  ch("if(action==='dream743-open'){",
`if(action==='weekly746-shift'){
  if(!['prev','next'].includes(id))return;
  weeklyOffset746=Math.max(0,Math.min(104,weeklyOffset746+(id==='prev'?1:-1)));
  render();return;
 }
 if(action==='weekly746-current'){weeklyOffset746=0;render();return;}
 if(action==='dream743-open'){`, 'weekly history action');
  return {code:s,map:null};
 }};
}
