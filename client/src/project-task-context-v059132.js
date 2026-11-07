/**
 * Compass 0.5.91.32: Project-local + actions are bound to the clicked project.
 * Untrusted DOM FormData and a restored draft cannot redirect a project-local
 * action to a previously visited lecture/project.
 */
export function resolveNewTaskProject({contextProjectId='',liveProjectId='',formProjectId='',projects={}}={}){
  const context=String(contextProjectId||'');
  const chosen=String(formProjectId||'')||null;
  if(!context)return {projectId:chosen,contextual:false,error:null};
  const project=projects?.[context];
  if(!project||project.kind!=='project'||context!==String(liveProjectId||'')){
    return {projectId:null,contextual:true,error:'stale-project-context'};
  }
  return {projectId:context,contextual:true,error:null};
}
