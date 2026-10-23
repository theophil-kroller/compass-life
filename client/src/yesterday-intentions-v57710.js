/** Only show still-open intentions from exactly the previous local day.
 * No automatic carry-over, no edits, no fake due dates or permanent badges.
 */
import {isTemplateTask,isActionAvailable} from './tasks.js';
import {dayPlanBlocks} from './daily-planning-v48.js';
const DAY=/^\d{4}-\d{2}-\d{2}$/;
export function previousLocalDay(today){
 if(!DAY.test(today))return '';
 const d=new Date(today+'T12:00:00Z');if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==today)return '';
 d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10);
}
export function yesterdayIntentions(state,today){
 const yesterday=previousLocalDay(today);if(!yesterday)return [];
 const blocks=new Set(dayPlanBlocks(state,yesterday).filter(b=>!b.done).map(b=>b.taskId));
 return Object.values(state?.tasks||{}).filter(t=>t&&!t.archived&&!t.completed&&!isTemplateTask(state,t)&&!state?.taskConflicts?.[t.id]&&
  (t.plannedDate===yesterday||(!t.plannedDate&&blocks.has(t.id)))&&t.plannedDate!==today&&t.dueDate!==today)
  .map(t=>({task:t,canPlan:isActionAvailable(state,t,today),fromBlock:blocks.has(t.id)}))
  .sort((a,b)=>Number(b.canPlan)-Number(a.canPlan)||a.task.title.localeCompare(b.task.title,'de'));
}
