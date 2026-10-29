/** Compass .40.25.8 — continue the audited encrypted journal to review & task edit,
 * cache the Today family panel until relevant inputs change, measure subprocesses.
 */
export function compass5940258CorePerformance(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.8 ${label}: expected 1 anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-5940258-core-performance',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.7','Build 0.5.77.59.40.25.8','lock version'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.7';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.8';",'version');
  s=once(s,'Build 0.5.77.59.40.25.7','Build 0.5.77.59.40.25.8','footer');
  s=once(s,"import {gtdDelta,createCoreIdlePolicy} from './core-first-v5775940257.js';",
    "import {gtdDelta,createCoreIdlePolicy} from './core-first-v5775940257.js';\nimport {reviewCheckpoint,restoreReviewCheckpoint,createTodayPanelMemo} from './core-performance-v5775940258.js';",'import');
  s=once(s,`let fastGtdMutationRevision=0;
async function mutate(fn,committedEditForm=null,skipFinalRender=false,options=null) {`,
 `let fastGtdMutationRevision=0;
let coreTodayDataRevision=0;
const coreTodayFamilyMemo=createTodayPanelMemo();
async function mutate(fn,committedEditForm=null,skipFinalRender=false,options=null) {`,'today revision');
  s=once(s,`  const fastGtd=options?.fastGtd===true&&tab!=='people';
  const fastPlanning=fastGtd||options?.fastPlanning===true&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&tab!=='people';`,
 `  const fastGtd=options?.fastGtd===true&&tab!=='people';
  const fastReview=options?.fastReview===true&&tab==='review';
  const fastPlanning=fastReview||fastGtd||options?.fastPlanning===true&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&tab!=='people';`,'review fast flag');
  s=once(s,`  const previous=fastGtd?gtdCheckpoint(state,{singleTaskId:options?.singleTaskId||null}):fastPlanning?planningCheckpoint(state):structuredClone(state);`,
 `  const previous=fastReview?reviewCheckpoint(state,{singleProjectId:options?.singleProjectId||null}):fastGtd?gtdCheckpoint(state,{singleTaskId:options?.singleTaskId||null}):fastPlanning?planningCheckpoint(state):structuredClone(state);`,'review checkpoint');
  s=once(s,`    fn(state);invalidateDerivedInsights();`,
 `    fn(state);invalidateDerivedInsights();
    if(!fastPlanning)coreTodayDataRevision++;`,'data invalidation');
  s=once(s,`      if(fastPlanning)gtdDurableWrite=vault.appendCoreGtdDelta(gtdDelta(previous,state));`,
 `      gtdDurableWrite=vault.appendCoreGtdDelta(gtdDelta(previous,state));`,'journal payload');
  s=once(s,`        if(fastPlanning){restorePlanningCheckpoint(state,previous);options?.onFailed?.();}else state=previous;`,
 `        if(fastReview){restoreReviewCheckpoint(state,previous);options?.onFailed?.();}
        else if(fastPlanning){restorePlanningCheckpoint(state,previous);options?.onFailed?.();}else state=previous;`,'review rollback');
  // REVIEW: update the UI first, write a small encrypted review snapshot to IDB,
  // and sync the review record only AFTER its local journal commit.
  s=once(s,`reviewEditingTaskId=null;await mutate(s=>{s.weeklyReview=nextReviewStep(s.weeklyReview,index);s.reviewPending=true;});return;`,
 `reviewEditingTaskId=null;await mutate(s=>{s.weeklyReview=nextReviewStep(s.weeklyReview,index);s.reviewPending=true;},null,true,{fastReview:true});return;`,'review next');
  s=once(s,`await mutate(s=>{s.weeklyReview=reviewedStep(s.weeklyReview,current.id);if(current.id==='finish'){s.weeklyReview.completedAt=stamp();s.weeklyReview.notes=notes;}s.reviewPending=true;});return;`,
 `await mutate(s=>{s.weeklyReview=reviewedStep(s.weeklyReview,current.id);if(current.id==='finish'){s.weeklyReview.completedAt=stamp();s.weeklyReview.notes=notes;}s.reviewPending=true;},null,true,{fastReview:true});return;`,'review complete');
  s=once(s,`reviewEditingTaskId=null;reviewProjectId=null;await mutate(s=>{s.weeklyReview=newReview();s.reviewPending=true;});return;`,
 `reviewEditingTaskId=null;reviewProjectId=null;await mutate(s=>{s.weeklyReview=newReview();s.reviewPending=true;},null,true,{fastReview:true});return;`,'review reset');
  s=once(s,`await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;s.weeklyReview.inspectedProjects=[...new Set([...s.weeklyReview.inspectedProjects,id])];s.weeklyReview.updatedAt=stamp();s.reviewPending=true;});reviewProjectId=null;toast('Projekt geprüft. Nächstes Projekt direkt hier.');return;`,
 `await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;s.weeklyReview.inspectedProjects=[...new Set([...s.weeklyReview.inspectedProjects,id])];s.weeklyReview.updatedAt=stamp();s.reviewPending=true;},null,true,{fastReview:true,singleProjectId:id,onApplied:()=>{reviewProjectId=null;notice='Projekt geprüft.';},onFailed:()=>{notice='';error='Projektprüfung konnte nicht lokal gesichert werden.';}});return;`,'review project');
  s=once(s,`if(!state.tasks?.[id])return;await mutate(s=>{s.tasks[id].completed=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});reviewEditingTaskId=null;return;`,
 `if(!state.tasks?.[id])return;await mutate(s=>{s.tasks[id]={...s.tasks[id],completed:true,updatedAt:stamp()};s.taskPending[id]=true;},null,true,{fastGtd:true,fastPlanning:true,singleTaskId:id,onApplied:()=>{reviewEditingTaskId=null;}});return;`,'review task');
  // Inspector: this is a single task replacement; never copy health/finance.
  s=once(s,`await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);},taskEditForm);toast('Aufgabe aktualisiert.');`,
 `await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);},taskEditForm,true,{fastGtd:true,fastPlanning:true,singleTaskId:id,onApplied:()=>{notice='Aufgabe aktualisiert.';error='';},onFailed:()=>{notice='';error='Aufgabe konnte nicht lokal gesichert werden.';}});`,'inspector edit');
  // Today checkbox: do not scan all tasks for the counter in the immediate paint.
  // The final count is validated on the next full view refresh.
  s=once(s,` if(counter){const rows=tasksForDay(state,selectedDay).filter(t=>!waitingSourceId(t));counter.textContent=rows.filter(t=>t.completed).length+' / '+rows.length+' erledigt';}`,
 ` if(counter){const match=counter.textContent.match(/(\\d+)\\s*\\/\\s*(\\d+)/);if(match){
   const previouslyComplete=!task.completed;const done=Math.max(0,Math.min(Number(match[2]),Number(match[1])+(previouslyComplete?-1:1)));
   counter.textContent=done+' / '+match[2]+' erledigt';
  }}`,'checkbox count');
  // Avoid rebuilding the same birthday/family panels when the user edits unrelated GTD values.
  s=once(s,`  const familyPeople=state.people||{};
  const familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
  const familyNow=localDate();
  const familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
  if(tab==='today'){
   const birthdays=todayBirthdayHighlights(calendarEvents,e=>eventAppearance(e),familyPeople,familyNow);
   content=todayBirthdayPanel(birthdays)+familyTodayPanel(familyProposals,familyTodayObservations(familyVisible,familyPeople,state,{today:familyNow}))+content;
  }`,
 `  const familyPeople=state.people||{};
  const familyNow=localDate();
  let familyVisible=null, familyProposals=null;
  if(tab==='today'){
   const familyStarted=performanceTrace.start();
   const familyMarkup=coreTodayFamilyMemo.get([coreTodayDataRevision,journalRevision,state.people,state.familyRadar,calendarEvents,calendarEvents.length,calendarUpdatedAt,showHiddenCalendarEvents,familyNow],()=>{
    const familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
    const familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
    const birthdays=todayBirthdayHighlights(calendarEvents,e=>eventAppearance(e),familyPeople,familyNow);
    return todayBirthdayPanel(birthdays)+familyTodayPanel(familyProposals,familyTodayObservations(familyVisible,familyPeople,state,{today:familyNow}));
   });
   performanceTrace.end('Heute: Familien- und Geburtstagsradar',tab,familyStarted);
   content=familyMarkup+content;
  }else{
   familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
   familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
  }`,'family cache');
  // Return stable, user-visible measurements for the next profiling iteration.
  s=once(s,`function todayScreen(){return chrome(compass56TodayWorkspace());}`,
 `function todayScreen(){const coreStarted=performanceTrace.start();const workspace=compass56TodayWorkspace();performanceTrace.end('Heute: Aufgaben und Kalender',tab,coreStarted);
   const chromeStarted=performanceTrace.start();const html=chrome(workspace);performanceTrace.end('Heute: Shell und Hinweise',tab,chromeStarted);return html;}`,'today breakdown');
  return {code:s,map:null};
 }};
}
