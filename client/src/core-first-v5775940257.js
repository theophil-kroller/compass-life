/** Compass Core First: small encrypted GTD journal deltas and idle policy.
 * Pure functions are intentionally independent of browser and personal data.
 */
const dict = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
function objectChanges(before,after){
 const old=dict(before), next=dict(after), changes={};
 for(const id of new Set([...Object.keys(old),...Object.keys(next)])){
  if(!Object.prototype.hasOwnProperty.call(next,id)){changes[id]=null;continue;}
  if(JSON.stringify(old[id])!==JSON.stringify(next[id]))changes[id]=structuredClone(next[id]);
 }
 return changes;
}
export function gtdDelta(before,after){
 const delta={kind:'gtd',tasks:objectChanges(before.tasks,after.tasks),projects:objectChanges(before.projects,after.projects),
 taskPending:objectChanges(before.taskPending,after.taskPending),projectPending:objectChanges(before.projectPending,after.projectPending)};
 if(JSON.stringify(before.recentTags)!==JSON.stringify(after.recentTags))delta.recentTags=structuredClone(after.recentTags??[]);
 return delta;
}
export function applyGtdDelta(state,delta){
 if(delta?.kind!=='gtd')throw Error('Unbekannter GTD-Journaleintrag');
 for(const field of ['tasks','projects','taskPending','projectPending']){
  const target=state[field] ||= {};
  for(const [id,value] of Object.entries(dict(delta[field]))){
   if(value===null)delete target[id];else target[id]=value;
  }
 }
 if(Object.prototype.hasOwnProperty.call(delta,'recentTags'))state.recentTags=delta.recentTags;
 return state;
}
export function createCoreIdlePolicy({quietMs=10000, maxDelayMs=120000}={}){
 let lastActivity=0,lastScheduled=0;
 return {
  noteActivity(now){lastActivity=now;},
  beginWait(now){if(!lastScheduled)lastScheduled=now;},
  maySync(now,{visible=true,online=true,editing=false}={}){
   if(!visible||!online||editing)return false;
   return now-lastActivity>=quietMs || lastScheduled>0&&now-lastScheduled>=maxDelayMs;
  },
  nextDelay(now){const quiet=Math.max(0,quietMs-(now-lastActivity));const max=lastScheduled?Math.max(0,maxDelayMs-(now-lastScheduled)):maxDelayMs;return Math.max(250,Math.min(quiet||250,max||250));},
  reset(){lastScheduled=0;},
  state(){return {lastActivity,lastScheduled};}
 };
}
