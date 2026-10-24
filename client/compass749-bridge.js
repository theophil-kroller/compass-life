/** Compass 0.5.77.49: body transformation dashboard over the proven .48 source. */
export function compass749Bridge(){
 const once=(source,from,to,label)=>{const n=source.split(from).length-1;if(n!==1)throw Error(`Compass .49: ${label}: expected one integration anchor; found ${n}`);return source.replace(from,to);};
 return {name:'compass-749-body-transformation',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let code=source;
  const change=(from,to,label)=>{code=once(code,from,to,label);};
  change("const COMPASS_CLIENT_VERSION='0.5.77.48';","const COMPASS_CLIENT_VERSION='0.5.77.49';",'version');
  change("import './capacity-calendar-v57748.css';","import './capacity-calendar-v57748.css';\nimport {bodyTransformationView} from './body-transformation-v57749.js';\nimport {saveCapacitySettings749} from './capacity-preserve-v57749.js';\nimport {nutritionTrendsIndex} from './nutrition-trends-v57726.js';\nimport {strengthSummariesWithFit} from './strength-insights-v57728.js';\nimport './body-transformation-v57749.css';",'body imports');
  change("insightTab==='body'?healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition):insightTab==='activity'?",
    "insightTab==='body'?bodyTransformationView(state,{today:localDate(),range:insightPeriod,nutritionIndex:nutritionTrendsIndex(state),strengthSessions:strengthSummariesWithFit(state)})+healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition):insightTab==='activity'?",'body insights screen');
  change("await mutate(st=>saveCapacitySettings(st,{focusHours,reservePct,estimates}),null,true);",
    "await mutate(st=>saveCapacitySettings749(st,{focusHours,reservePct,estimates}),null,true);",'preserve work packets after budget edit');
  return {code,map:null};
 }};
}
