/** Compass .40.25.7 — durable encrypted GTD deltas, idle cloud sync. */
export function compass5940257CoreFirst(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.7 ${label}: expected one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-5940257-core-first',enforce:'pre',transform(source,id){
 const path=id.replace(/\\/g,'/').split('?')[0];
 if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.6','Build 0.5.77.59.40.25.7','lock version'),map:null};
 if(!path.endsWith('/client/src/main.js'))return null;
 let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.6';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.7';",'version');
 s=once(s,'Build 0.5.77.59.40.25.6','Build 0.5.77.59.40.25.7','footer');
 s=once(s,"import {gtdCheckpoint,paintGtdProgress} from './fast-gtd-actions-v5775940256.js';",`import {gtdCheckpoint,paintGtdProgress} from './fast-gtd-actions-v5775940256.js';
import {gtdDelta,createCoreIdlePolicy} from './core-first-v5775940257.js';`,'imports');
 s=once(s,`const CHANGE_DEBOUNCE_MS=7000;
function scheduleSync(delay=CHANGE_DEBOUNCE_MS) {
  if(!state||!authToken||!navigator.onLine||document.visibilityState==='hidden')return;
  clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{syncTimer=null;syncNow().catch(()=>{});},delay);
}`,
 `const CHANGE_DEBOUNCE_MS=12000;
const coreIdlePolicy=createCoreIdlePolicy({quietMs:10000,maxDelayMs:120000});
coreIdlePolicy.noteActivity(Date.now());
let coreCompactionTimer=null,coreCompactionDue=false;
function scheduleCoreCompaction(){
 coreCompactionDue=true;clearTimeout(coreCompactionTimer);
 coreCompactionTimer=setTimeout(async()=>{
  coreCompactionTimer=null;
  if(!state||document.visibilityState==='hidden'||Date.now()-lastActivity<10000){
   if(state&&document.visibilityState==='visible')scheduleCoreCompaction();return;
  }
  try{await persist();coreCompactionDue=false;}catch(ex){console.warn('Compass local checkpoint postponed',ex);scheduleCoreCompaction();}
 },14000);
}
function scheduleSync(delay=CHANGE_DEBOUNCE_MS) {
  if(!state||!authToken||!navigator.onLine||document.visibilityState==='hidden')return;
  coreIdlePolicy.beginWait(Date.now());
  clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{
   syncTimer=null;
   const editor=document.activeElement?.closest?.('form');
   const editing=!!(editor&&['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName));
   if(!coreIdlePolicy.maySync(Date.now(),{visible:document.visibilityState==='visible',online:navigator.onLine,editing})){
    scheduleSync(Math.max(editing?2000:250,coreIdlePolicy.nextDelay(Date.now())));return;
   }
   coreIdlePolicy.reset();syncNow({silent:true}).catch(()=>{});
  },Math.max(0,delay));
}`,'idle sync');
 s=once(s,`    await syncNow();scheduleJournalSync(0);scheduleWatchCalendarSnapshot();`,
 `    scheduleSync();scheduleJournalSync(12000);scheduleWatchCalendarSnapshot();`,'session initial sync');
 // Journal mirror should run after activity, not on every heavy meal/feeling mutation.
 s=once(s,`journalSyncTimer=setTimeout(()=>{journalSyncTimer=null;syncPersonalJournal().catch(ex=>{console.warn('Journal-Abgleich ausstehend:',ex.message);render();});},delay);`,
 `journalSyncTimer=setTimeout(()=>{journalSyncTimer=null;if(Date.now()-lastActivity<10000&&document.visibilityState==='visible'){scheduleJournalSync(10000);return;}syncPersonalJournal().catch(ex=>{console.warn('Journal-Abgleich ausstehend:',ex.message);});},Math.max(delay,10000));`,'journal idle');
 s=once(s,`if(state.privateDeviceMirror?.key&&authToken&&navigator.onLine)syncPersonalJournal().catch(ex=>{console.warn('Journal-Abgleich ausstehend:',ex.message);render();});`,
 `if(state.privateDeviceMirror?.key&&authToken&&navigator.onLine)scheduleJournalSync(12000);`,'journal mutation');
 s=once(s,`      if(options?.fastTodayVisual!==true&&!options?.inlineGtd)render();
      await afterPlanningPaint();
      if(fastGtd)performanceTrace.end('GTD Aktion bis Paint',tab,actionStart);
    }
    await persist();
    if(!fastGtd)syncQuickPublicFromState();`,
 `      if(options?.fastTodayVisual!==true&&!options?.inlineGtd)render();
      // The small encrypted journal begins BEFORE the paint wait; UI and disk
      // writes run concurrently, but sync starts only after local durability.
      if(fastPlanning)gtdDurableWrite=vault.appendCoreGtdDelta(gtdDelta(previous,state));
      await afterPlanningPaint();
      if(fastGtd)performanceTrace.end('GTD Aktion bis Paint',tab,actionStart);
    }
    if(fastPlanning){
      const durStart=performanceTrace.start();
      await gtdDurableWrite;
      performanceTrace.end('GTD Journal sicher',tab,durStart);
      scheduleCoreCompaction();
    }else await persist();
    if(!fastPlanning)syncQuickPublicFromState();`,'durable journal');
 s=once(s,`  const gtdTicket=fastGtd?++fastGtdMutationRevision:0;`,
 `  const gtdTicket=fastGtd?++fastGtdMutationRevision:0;
  let gtdDurableWrite=null;`,'journal declaration');
 // Adapt the common task operations to the audited narrow rollback + journal.
 s=once(s,`      if(title!==existing.title){await mutate(s=>{s.tasks[id].title=title;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});}`,
 `      if(title!==existing.title){await mutate(s=>{s.tasks[id].title=title;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;},null,true,{fastGtd:true,fastPlanning:true,singleTaskId:id});render();}`,'rename');
 s=once(s,`    if(action==='task-flag'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].flagged=!s.tasks[id].flagged;s.taskPending[id]=true;});return;}`,
 `    if(action==='task-flag'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].flagged=!s.tasks[id].flagged;s.taskPending[id]=true;},null,false,{fastGtd:true,fastPlanning:true,singleTaskId:id});return;}`,'flag');
 s=once(s,`    if(action==='task-toggle'){if(!state?.tasks?.[id])return;if(state.projects?.[state.tasks[id].projectId]?.isTemplate){toast('Vorlage bleibt unverändert. Erstelle eine neue Liste daraus.');return;}const fast=tab==='today'&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&[...app.querySelectorAll('.today-tasks .task-row [data-action="task-toggle"]')].some(el=>el.dataset.id===id);await mutate(s=>{s.tasks[id]={...s.tasks[id],completed:!s.tasks[id].completed,updatedAt:stamp()};s.taskPending[id]=true;},null,fast,fast?{fastPlanning:true,fastTodayVisual:true,onApplied:()=>{compass55FastTaskPaint(id);if(todayInspectorOpen&&selectedTaskId===id)compass55RefreshInspector();}}:null);return;}`,
 `    if(action==='task-toggle'){if(!state?.tasks?.[id])return;if(state.projects?.[state.tasks[id].projectId]?.isTemplate){toast('Vorlage bleibt unverändert. Erstelle eine neue Liste daraus.');return;}const fast=tab==='today'&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&[...app.querySelectorAll('.today-tasks .task-row [data-action="task-toggle"]')].some(el=>el.dataset.id===id);await mutate(s=>{s.tasks[id]={...s.tasks[id],completed:!s.tasks[id].completed,updatedAt:stamp()};s.taskPending[id]=true;},null,fast,{fastGtd:true,fastPlanning:true,singleTaskId:id,...(fast?{fastTodayVisual:true,onApplied:()=>{compass55FastTaskPaint(id);if(todayInspectorOpen&&selectedTaskId===id)compass55RefreshInspector();}}:{})});return;}`,'toggle');
 s=once(s,`    if(action==='task-archive'){if(!confirm('Aufgabe archivieren?'))return;await mutate(s=>{s.tasks[id].archived=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});selectedTaskId=null;todayInspectorOpen=false;return;}`,
 `    if(action==='task-archive'){if(!confirm('Aufgabe archivieren?'))return;await mutate(s=>{s.tasks[id].archived=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;},null,false,{fastGtd:true,fastPlanning:true,singleTaskId:id});selectedTaskId=null;todayInspectorOpen=false;return;}`,'archive');
 // Automatic sync is deliberately quiet: it must not rebuild "Heute" before/after cloud I/O.
 s=once(s,'async function syncNow() {','async function syncNow({silent=false}={}) {','sync signature');
 s=once(s,`  busy=true;
  try {`, `  busy=true;if(!silent)render();
  try {`,'sync entry');
 s=once(s,`    busy=false;render();performanceTrace.end('Cloud-Abgleich',tab,syncMeasurement);`,
 `    busy=false;if(!silent||error||Date.now()-lastActivity>=1500)render();performanceTrace.end('Cloud-Abgleich',tab,syncMeasurement);`,'sync exit');
 s=once(s,`if(retry)scheduleSync(0);`, `if(retry)scheduleSync(CHANGE_DEBOUNCE_MS);`,'sync retry');
 s=once(s,`for(const e of ['pointerdown','keydown','touchstart'])document.addEventListener(e,()=>{lastActivity=Date.now();},{passive:true});`,
 `for(const e of ['pointerdown','keydown','touchstart'])document.addEventListener(e,()=>{lastActivity=Date.now();coreIdlePolicy.noteActivity(lastActivity);},{passive:true});`,'activity');
 s=s.replaceAll(`await editDraftGuard.flush().catch(()=>{});editDraftGuard.reset();vault.lock();`,
 `await editDraftGuard.flush().catch(()=>{});await vault.flushCoreWrites().catch(()=>{});editDraftGuard.reset();vault.lock();`);
 // No heavyweight core checkpoint is forced on pagehide: journal commits are already durable.
 return {code:s,map:null};
 }};
}
