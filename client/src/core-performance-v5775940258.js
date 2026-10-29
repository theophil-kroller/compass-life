/** Compass .40.25.8 — narrow review checkpoints and per-data revision memo.
 * These functions cannot access the network or unencrypted storage.
 */
export function reviewCheckpoint(state,{singleProjectId=null}={}){
 const projects=singleProjectId?{...(state.projects||{})}:state.projects||{};
 if(singleProjectId&&projects[singleProjectId])projects[singleProjectId]={...projects[singleProjectId]};
 return {tasks:state.tasks||{},projects,taskPending:state.taskPending||{},
   projectPending:{...(state.projectPending||{})},recentTags:state.recentTags,
   weeklyReview:structuredClone(state.weeklyReview),reviewPending:state.reviewPending,
   reviewVersion:state.reviewVersion,reviewConflict:state.reviewConflict};
}
export function restoreReviewCheckpoint(state,previous){
 for(const field of ['tasks','projects','taskPending','projectPending','recentTags','weeklyReview','reviewPending','reviewVersion','reviewConflict']){
  if(Object.prototype.hasOwnProperty.call(previous,field))state[field]=previous[field];
  else delete state[field];
 }
 return state;
}
export function createTodayPanelMemo(){
 let prior=null,html='';
 return {get(key,build){
  if(prior&&key.length===prior.length&&key.every((item,i)=>item===prior[i]))return html;
  const next=build();html=next;prior=key.slice();return html;
 },clear(){prior=null;html='';}};
}
