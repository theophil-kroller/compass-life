/** .40.25.6 - lightweight GTD checkpoints and immediate progress painting.
 * Copies tasks/projects for rollback, never the years of health, nutrition, finance,
 * calendar and other private Vault records. Does not persist or sync itself.
 */
export function gtdCheckpoint(state,{singleTaskId=null}={}){
 const taskItems=state.tasks||{}, projectItems=state.projects||{};
 const tasks=singleTaskId?{...taskItems,[singleTaskId]:taskItems[singleTaskId]?{...taskItems[singleTaskId]}:undefined}:
   Object.fromEntries(Object.entries(taskItems).map(([id,t])=>[id,{...t}]));
 return {tasks,projects:Object.fromEntries(Object.entries(projectItems).map(([id,p])=>[id,{...p}])),taskPending:{...(state.taskPending||{})},
  projectPending:{...(state.projectPending||{})},recentTags:Array.isArray(state.recentTags)?[...state.recentTags]:state.recentTags};
}
export function paintGtdProgress(root,id,task){
 if(!root?.querySelectorAll||!task)return;
 const target=Math.max(1,Number(task.progressTarget)||1),current=Math.max(0,Math.min(target,Number(task.progressCurrent)||0));
 for(const btn of root.querySelectorAll('[data-action="task-progress-plus"],[data-action="task-progress-minus"]')){
  if(btn.dataset.id!==id)continue;
  btn.disabled=task.completed||task.archived||btn.dataset.action==='task-progress-plus'&&current>=target||btn.dataset.action==='task-progress-minus'&&current<=0;
  const row=btn.closest('.v42-task-progress');
  if(row){
   row.title=`${current} von ${target} Stück bearbeitet${current===target?' · Ziel erreicht':''}`;
   const text=row.querySelector('.v42-progress-count');if(text)text.textContent=`${current}/${target}`;
   const bar=row.querySelector('progress');if(bar){bar.value=current;bar.max=target;bar.setAttribute('aria-valuenow',String(current));}
  }
  const inspector=btn.closest('.v559-progress-actions');if(inspector){const strong=inspector.querySelector('strong');if(strong)strong.textContent=`${current}/${target}`;}
 }
 // Keep the expanded progress editor consistent without rebuilding the inspector.
 for(const input of root.querySelectorAll('#task-edit-form [name="progressCurrent"]')){
  if(input.closest('form')?.dataset.id===id)input.value=String(current);
 }
 for(const title of root.querySelectorAll('#task-edit-form .v42-progress-options summary')){
  if(title.closest('form')?.dataset.id===id)title.textContent=`⚙ Fortschrittsziel festlegen · ${current}/${target}`;
 }
}
