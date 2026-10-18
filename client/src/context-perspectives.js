// Non-breaking hierarchical perspectives for existing, synchronised context tags.
// Convention: 'arbeit-uni', 'arbeit-buero' belong to the group 'arbeit'.
// No new tags are inferred or written back to tasks.
export function contextChoices(tasks=[]){
 const tags=[...new Set(tasks.flatMap(t=>Array.isArray(t.contextTags)?t.contextTags:[]).filter(x=>typeof x==='string'))].sort((a,b)=>a.localeCompare(b,'de'));
 const choices=[],groups=new Map();
 for(const tag of tags){
  const dash=tag.indexOf('-');
  if(dash>0&&!/^(energy|attention)-/.test(tag)){
   const group=tag.slice(0,dash);
   groups.set(group,(groups.get(group)||0)+1);
  }
 }
 for(const group of [...groups.keys()].sort((a,b)=>a.localeCompare(b,'de'))){
  if(groups.get(group)>=2)choices.push({value:`group:${group}`,label:`${group} · alle`,group:true});
 }
 for(const tag of tags)choices.push({value:tag,label:`@${tag}`,group:false});
 return choices;
}
export function filterContextTasks(tasks=[],filter=''){
 if(!filter)return tasks;
 if(filter.startsWith('group:')){
  const p=filter.slice('group:'.length);
  return tasks.filter(t=>(t.contextTags||[]).some(tag=>tag===p||tag.startsWith(p+'-')));
 }
 return tasks.filter(t=>(t.contextTags||[]).includes(filter));
}
