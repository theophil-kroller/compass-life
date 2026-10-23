/**
 * Compass 0.5.77.17 – One-pass, read-only person/agenda projection.
 * The people view previously rescanned every task and every Inbox item for
 * EVERY person, twice per contact in the list. Build one inverted tag index.
 * Workflows and tag semantics intentionally match person-links.js.
 */
const normalized = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase('de').trim().replace(/^#/, '').replace(/\s+/g, ' ');
const openTask = (task,projects) => !!(task&&!task.archived&&!task.completed&&!projects?.[task.projectId]?.isTemplate);
const openRecord = record => !!(record&&!record.deleted&&!(record.tags||[]).some(tag=>String(tag).toLowerCase()==='dreams'));
const getTags = item => new Set([...(item?.tags||[]),...(item?.contextTags||[])].map(normalized).filter(Boolean));
const compareTasks = (a,b) =>
 (a.workflow==='waiting'?1:0)-(b.workflow==='waiting'?1:0)
 || Number(!!b.flagged)-Number(!!a.flagged)
 || String(a.dueDate||'9999-12-31').localeCompare(String(b.dueDate||'9999-12-31'))
 || String(a.title||'').localeCompare(String(b.title||''),'de');
/** Return Map(personId -> {tasks, inbox}), never mutate source arrays. */
export function buildPersonAgendaIndex(people=[],tasks={},records=[],projects={}){
 const byTag=new Map(), result=new Map();
 for(const person of people||[]){
  if(!person?.id)continue;
  result.set(person.id,{tasks:[],inbox:[]});
  const tag=normalized(person.tag);
  if(!tag)continue;
  if(!byTag.has(tag))byTag.set(tag,[]);
  byTag.get(tag).push(person.id);
 }
 function collect(item,kind){
  const ids=new Set();
  for(const tag of getTags(item))for(const id of byTag.get(tag)||[])ids.add(id);
  for(const id of ids)result.get(id)?.[kind].push(item);
 }
 for(const task of Object.values(tasks||{}))if(openTask(task,projects))collect(task,'tasks');
 for(const record of records||[])if(openRecord(record))collect(record,'inbox');
 for(const entry of result.values())entry.tasks.sort(compareTasks);
 return result;
}
/** Prioritize actionable agenda work; keep alphabetical ordering within a tier. */
export function sortPeopleByOpenItems(people=[],index=new Map()){
 const count=p=>{const r=index.get(p.id);return (r?.tasks.length||0)+(r?.inbox.length||0);};
 return [...(people||[])].sort((a,b)=>count(b)-count(a)||String(a.name||'').localeCompare(String(b.name||''),'de'));
}
