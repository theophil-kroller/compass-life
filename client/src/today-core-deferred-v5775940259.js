/** Compass .40.25.9: quick Today birthdays, asynchronously computed Family Radar.
 * The Core needs no worker state and no unencrypted persistent cache.
 */
import {calendarEventDay} from './calendar-rules.js';
import {familySuggestions,familyTodayObservations,familyTodayPanel} from './family-radar-v5775931.js';
import {shiftDay} from './occasion-planning.js';
export function calendarBirthdayCandidates(events=[],today='',daysAhead=7){
 const limit=shiftDay(today,daysAhead);
 if(!today||!limit)return [];
 return (Array.isArray(events)?events:[]).filter(e=>{
  if(!e||e.status==='cancelled')return false;
  const date=calendarEventDay(e);
  return date>=today&&date<=limit;
 });
}
/** Send only the Family Radar's relevant calendar horizon and minimal personal fields.
 * Filtering must preserve explicitly configured child roles and all existing rule semantics.
 */
export function familyWorkerSnapshot(events=[],people={},state={},today='',appearance=()=>({}),showHidden=false){
 const limit=shiftDay(today,30);
 const relevant=(Array.isArray(events)?events:[]).filter(e=>{
  if(!e||e.status==='cancelled'||!e.id||!String(e.summary||'').includes(':'))return false;
  const date=calendarEventDay(e);
  return date>=today&&date<=limit && (showHidden||!appearance(e)?.hidden);
 }).map(e=>({id:e.id,summary:e.summary,status:e.status,start:e.start,end:e.end}));
 const selectedPeople={};
 for(const [key,p] of Object.entries(people||{}))if(p&&typeof p==='object')
  selectedPeople[key]={id:p.id,name:p.name,aliases:p.aliases,relationKind:p.relationKind};
 const tasks={};
 for(const [id,t] of Object.entries(state?.tasks||{}))if(t?.familyRadarKey&&!t.archived)
  tasks[id]={familyRadarKey:t.familyRadarKey,archived:false};
 const projects={};
 for(const [id,p] of Object.entries(state?.projects||{}))if(p?.familyRadarKey&&!p.archived)
  projects[id]={familyRadarKey:p.familyRadarKey,archived:false};
 return {today,events:relevant,people:selectedPeople,state:{tasks,projects,familyRadar:state?.familyRadar||{}}};
}
export function buildFamilyTodayHtml(payload){
 const {today,events,people,state}=payload;
 const suggestions=familySuggestions(events,people,state,{today});
 const observations=familyTodayObservations(events,people,state,{today});
 return familyTodayPanel(suggestions,observations);
}
const same=(a,b)=>!!a&&!!b&&a.length===b.length&&a.every((x,i)=>x===b[i]);
export function createDeferredFamilyCache(){
 let savedKey=null,savedHtml=null,activeKey=null,token=0,worker=null,pending=false;
 const stop=()=>{if(worker){worker.terminate?.();worker=null;}pending=false;activeKey=null;};
 return {
  peek(key){return same(savedKey,key)?savedHtml:null;},
  isPending(key){return pending&&same(activeKey,key);},
  schedule(key,input,onReady,{workerFactory,fallback=buildFamilyTodayHtml}={}){
   if(same(savedKey,key)){onReady(savedHtml);return;}
   if(pending&&same(activeKey,key))return;
   stop();activeKey=key.slice();pending=true;const run=++token;
   const finish=html=>{if(run!==token||!same(activeKey,key))return;
    savedKey=key.slice();savedHtml=String(html||'');pending=false;activeKey=null;onReady(savedHtml);
   };
   const fallbackRun=()=>{if(run!==token)return;
    try{finish(fallback(input));}catch(ex){console.warn('Compass Familienradar wird später erneut geprüft',ex);pending=false;activeKey=null;}
   };
   try{
    if(typeof workerFactory!=='function')throw Error('Worker unavailable');
    const created=workerFactory();worker=created;
    created.onmessage=event=>{
     if(event.data?.job!==run)return;
     if(event.data?.error){created.terminate?.();worker=null;setTimeout(fallbackRun,0);return;}
     finish(event.data?.html);
    };
    created.onerror=()=>{created.terminate?.();worker=null;setTimeout(fallbackRun,0);};
    created.postMessage({job:run,input});
   }catch{worker?.terminate?.();worker=null;setTimeout(fallbackRun,0);}
  },
  clear(){++token;stop();savedKey=null;savedHtml=null;}
 };
}
