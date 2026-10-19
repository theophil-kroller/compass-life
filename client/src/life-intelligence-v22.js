/** Compass 0.5.22. Encrypted local-only life goals and explainable daily choices.
 * Do not turn preferences or suggested due dates into synchronised task metadata.
 */
import {nextActions,localDate,TASK_CATEGORIES} from './tasks.js';

export const LIFE_GOAL_LIMIT=40;
const uuid=/^[0-9a-f-]{36}$/i;
export const energyModes=['offen','low','medium','high'];
export const timeModes=[15,30,60,120];
export function validateLifeGoal(goal){
 return !!(goal&&typeof goal==='object'&&uuid.test(goal.id)&&typeof goal.title==='string'&&goal.title.trim().length>0&&goal.title.length<=120&&
  typeof(goal.outcome||'')==='string'&&(goal.outcome||'').length<=600&&TASK_CATEGORIES.includes(goal.area)&&
  ['active','paused','achieved'].includes(goal.status)&&Array.isArray(goal.projectIds)&&goal.projectIds.length<=30&&new Set(goal.projectIds).size===goal.projectIds.length&&goal.projectIds.every(x=>uuid.test(x))&&
  (!goal.targetDate||/^\d{4}-\d{2}-\d{2}$/.test(goal.targetDate)&&!Number.isNaN(Date.parse(goal.targetDate+'T12:00:00Z'))));
}
export function lifeGoals(state){return (Array.isArray(state?.lifeGoals)?state.lifeGoals:[]).filter(validateLifeGoal);}
export function goalsForProject(state,projectId){return lifeGoals(state).filter(g=>g.status==='active'&&g.projectIds.includes(projectId));}
export function lifeGoalProgress(state,goal){
 const projects=goal.projectIds.map(id=>state?.projects?.[id]).filter(Boolean);
 const ids=new Set(projects.map(p=>p.id));
 const tasks=Object.values(state?.tasks||{}).filter(t=>!t.archived&&ids.has(t.projectId));
 return {projects:projects.length,taskCount:tasks.length,completed:tasks.filter(t=>t.completed).length,missingProjects:goal.projectIds.length-projects.length};
}
const daysUntil=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
/** Estimates are only a user-selected task budget, not inferred free calendar capacity. */
export function smartDailyChoices(state,{day=localDate(),minutes=60,energy='offen',context='',limit=3}={}){
 if(!timeModes.includes(minutes)||!energyModes.includes(energy))throw Error('Ungültiger Planungsfilter.');
 const items=nextActions(state,day),eligible=[];let skippedTime=0,skippedContext=0;
 for(const task of items){
  const tags=task.contextTags||[];
  if(context&&(!tags.includes(context)&&!(context.startsWith('group:')&&tags.some(t=>t.startsWith(context.slice(6)+'-'))))){skippedContext++;continue;}
  if(task.estimateMinutes&&task.estimateMinutes>minutes){skippedTime++;continue;}
  const reasons=[];let score=0;
  if(task.dueDate){const delta=daysUntil(day,task.dueDate);
   if(delta<0){score+=45;reasons.push('Harte Frist bereits überschritten');}
   else if(delta===0){score+=40;reasons.push('Harte Frist heute');}
   else if(delta<=3){score+=26;reasons.push(`Harte Frist in ${delta} Tag(en)`);}
  }
  if(task.flagged){score+=12;reasons.push('Von dir markiert');}
  if(task.plannedDate===day){score+=8;reasons.push('Für heute geplant');}
  const goal=goalsForProject(state,task.projectId)[0];
  if(goal){score+=15;reasons.push(`Bezug zum Ziel „${goal.title}“`);}
  if(task.estimateMinutes){score+=Math.max(0,9-Math.round(task.estimateMinutes/20));reasons.push(`${task.estimateMinutes} Min. geschätzt`);}
  else reasons.push('Dauer noch nicht geschätzt');
  if(energy!=='offen'){
   const tagged=tags.find(x=>x.startsWith('energy-'));
   if(tagged){if(tagged==='energy-'+energy){score+=8;reasons.push(`Passt zu deiner Energie: ${energy}`);}else {score-=12;reasons.push('Energiebedarf weicht von deiner Angabe ab');}}
   else reasons.push('Energiebedarf nicht erfasst');
  }
  eligible.push({task,score,reasons,goalId:goal?.id||null});
 }
 eligible.sort((a,b)=>b.score-a.score||Number(!!a.task.flagged)-Number(!!b.task.flagged)||a.task.title.localeCompare(b.task.title,'de'));
 return {items:eligible.slice(0,Math.min(3,Math.max(1,limit))),count:eligible.length,skippedTime,skippedContext,hasEstimates:eligible.some(x=>x.task.estimateMinutes!=null)};
}
