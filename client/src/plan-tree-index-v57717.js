/** Single-pass project and task tree indexes for the Planen view. */
const key=(projectId,parentTaskId)=>String(projectId)+'|'+String(parentTaskId||'');
const ordered=(xs)=>[...xs].sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||String(a.title||'').localeCompare(String(b.title||''),'de')||String(a.id).localeCompare(String(b.id)));
export function buildPlanTreeIndex(state={}){
 const projects=new Map(),tasks=new Map(),counts=new Map(),allProjects=state?.projects||{};
 const push=(map,id,entry)=>{if(!map.has(id))map.set(id,[]);map.get(id).push(entry);};
 const orphanProjects=[];
 for(const p of Object.values(allProjects)){
  if(!p)continue;
  if(p.parentId&&(!allProjects[p.parentId]||p.parentId===p.id||allProjects[p.parentId]?.isTemplate))orphanProjects.push(p);
  else push(projects,p.parentId||'',p);
 }
 for(const t of Object.values(state?.tasks||{})){
  if(!t||t.archived)continue;
  push(tasks,key(t.projectId,t.parentTaskId),t);
  counts.set(t.projectId,(counts.get(t.projectId)||0)+1);
 }
 for(const items of projects.values())items.sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||String(a.title||'').localeCompare(String(b.title||''),'de')||String(a.id).localeCompare(String(b.id)));
 for(const items of tasks.values())items.sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||String(a.title||'').localeCompare(String(b.title||''),'de')||String(a.id).localeCompare(String(b.id)));
 return {projects,tasks,counts,orphans:ordered(orphanProjects),projectChildren:id=>projects.get(id||'')||[],taskChildren:(p,parent)=>tasks.get(key(p,parent))||[]};
}
