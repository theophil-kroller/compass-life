/** Compass .40.17 — nutrition presentation architecture.
 * FINAL guarded Vite transform after all legacy nutrition bridges; no changes to
 * persistence, food sources, Garmin, CSS of older charts, or Worker API.
 */
export function compass594017NutritionFocusRelease(){
 const once=(source,from,to,name)=>{
  const count=source.split(from).length-1;
  if(count!==1)throw Error(`Compass .40.17 ${name}: expected 1 anchor, got ${count}`);
  return source.replace(from,to);
 };
 return {name:'compass-594017-nutrition-focus',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))
   return {code:once(source,'Build 0.5.77.59.40.16','Build 0.5.77.59.40.17','lock version'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.16';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.17';",'app version');
  s=once(s,'Build 0.5.77.59.40.16','Build 0.5.77.59.40.17','footer version');
  s=once(s,"import {nutritionHistoryView} from './nutrition-history-v577.js';",`import {nutritionHistoryView} from './nutrition-history-v577.js';\nimport {nutritionWorkspace4017} from './nutrition-focus-v577594017.js';\nimport './nutrition-focus-v577594017.css';`,'nutrition UX import');
  // Previously added by .59.30, this prepend generated the twelve oversized
  // Daily Dozen panels BEFORE the nutrition heading, navigation and chart.
  s=once(s,"return chrome((compass55Mode==='extended'&&insightTab==='nutrition'?dailyDozen5930View(dailyDozen5930(state,{day:today})):'' )+",'return chrome(', 'remove global Daily Dozen prepend');
  const start="insightTab==='nutrition'?`<nav class=\"ni712-tabs\"";
  const begin=s.indexOf(start),end=begin<0?-1:s.indexOf(":insightTab==='touch'?",begin);
  if(begin<0||end<0||s.indexOf(start,begin+1)>=0)throw Error('Compass .40.17 nutrition branch cannot be uniquely isolated');
  const replacement=`insightTab==='nutrition'?nutritionWorkspace4017(state,{
   day:today,view:nutritionView712,editingId:nutritionEditId,
   renderJournal:()=>nutritionInsightsView(state,{period:nutritionPeriod,editingId:nutritionEditId}),
   renderHistory:()=>nutritionHistoryView(state,{period:nutritionPeriod}),
   renderManualDozen:()=>dailyDozenView(state,{day:dailyDozenDay733,today:localDate()}),
   renderSync:()=>journalSyncPanel(),
   renderSection:kind=>kind==='daily-dozen'?dailyDozen5930View(dailyDozen5930(state,{day:today}))
    :kind==='nutrients'?nutritionIntelligenceView(state,{day:nutritionDay712,detail:nutritionProduct712})
    :kind==='timing'?nutritionTimingView(state,{mode:nutritionTimingMode725,anchor:nutritionTimingAnchor725,selectedId:nutritionTimingSelected725})
    :kind==='trends'?nutritionTrendsView(state,{mode:nutritionTrendsMode726,anchor:nutritionTrendsAnchor726,metric:nutritionTrendsMetric726})
    :kind==='connections'?nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays})
    :kind==='fats'?nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()})
    :kind==='anti-aging'?antiAgingEightView(state,{day:antiAgingDay734,today:localDate()})
    :kind==='phyto'?nutritionPhytoView(state,{period:phytoPeriod736,today:localDate()})
    :''
  })`;
  s=s.slice(0,begin)+replacement+s.slice(end);
  s=once(s,
   'class="insight-view-header ${insightTab===\'sources\'?\'insight-source-heading\':\'\'}"',
   'class="insight-view-header ${insightTab===\'sources\'?\'insight-source-heading\':\'\'} ${insightTab===\'nutrition\'?\'nf4017-hide-heading\':\'\'}"',
   'avoid duplicated nutrition heading');
  // Entering nutrition from outside should open the immediate daily overview.
  // Selecting a sub-tab never goes through these handlers.
  s=once(s,"if(action==='insights-tab'){", "if(action==='insights-tab'){if(id==='nutrition')nutritionView712='journal';",'reset through Insights navigation');
  s=once(s,"if(action==='calm-insight-view'){", "if(action==='calm-insight-view'){if(id==='nutrition')nutritionView712='journal';",'reset through side navigation');
  s=once(s,"if(action==='pj92-food-insights'){", "if(action==='pj92-food-insights'){nutritionView712='journal';",'reset through quick capture');
  s=once(s,"if(action==='pj92-food-edit'){nutritionEditId=id;render();return;}","if(action==='pj92-food-edit'){nutritionEditId=id;nutritionView712='journal';render();return;}",'food edit opens journal');
  return {code:s,map:null};
 }};
}
