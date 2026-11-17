/** Optional, read-only V-Taper calorie-deficit planning.
 * A deliberately conservative personal planning rule: none of these hypothetical
 * calorie targets is permitted below the estimated resting expenditure. This
 * is a UI guardrail, NOT a physiological or clinical minimum for everyone.
 * Nothing in this module writes to the encrypted journal or a calorie goal.
 */
import {personalEnergyEstimate} from './energy-goal-v575.js';
import {nutritionTrendsIndex} from './nutrition-trends-v57726.js';

const finite=n=>typeof n==='number'&&Number.isFinite(n);
const dayOK=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00Z'));
export const DEFICIT_TIERS57=Object.freeze([
 {kcal:0,label:'Erhaltung'},
 {kcal:200,label:'Sanft'},
 {kcal:300,label:'Moderat'},
 {kcal:400,label:'Deutlich'},
 {kcal:500,label:'Ambitioniert'},
 {kcal:600,label:'Aktueller Bereich'},
 {kcal:700,label:'Erhöht'},
 {kcal:800,label:'Hoch'},
 {kcal:900,label:'Sehr hoch'}
]);
const prevDay=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')-n*86400000).toISOString().slice(0,10);
export function deficitPlan57(state,{today,selected=null}={}){
 if(!dayOK(today))throw Error('Ein gültiges Datum ist erforderlich.');
 const energy=personalEnergyEstimate(state,new Date(today+'T12:00:00'));
 const resting=energy.ready&&finite(energy.resting?.kcal)?energy.resting.kcal:null;
 const tdee=energy.ready&&finite(energy.tdee)?energy.tdee:null;
 // Hypothetical comparison can include the observed ~600 kcal deficit and
 // progressively higher 700–900 kcal stages. Keep a conservative planning
 // floor at estimated resting expenditure; do not cap everyone at 20% TDEE.
 const allowedMax=tdee===null||resting===null?null:Math.max(0,Math.floor(Math.min(900,tdee-resting)/25)*25);
 const tiers=DEFICIT_TIERS57.map(t=>({...t,available:allowedMax!==null&&t.kcal<=allowedMax,
  targetKcal:tdee===null?null:Math.round(tdee-t.kcal)}));
 const selection=DEFICIT_TIERS57.find(x=>x.kcal===selected&&tiers.find(t=>t.kcal===selected)?.available)||null;
 let pastAvg=null,loggedDays=0,source='';
 if(tdee!==null){
  const dayMap=nutritionTrendsIndex(state).days;
  const rows=[];
  for(let n=27;n>=0;n--){const day=prevDay(today,n),s=dayMap.get(day)?.summary;
   if(s?.coverage?.kcal?.known>0&&finite(s?.totals?.kcal))rows.push({day,kcal:s.totals.kcal});}
  // The most recent 14 usable entries, not 14 all-calendar days, to avoid
  // presenting unrecorded days as actual 0 kcal intake.
  const observed=rows.slice(-14);
  if(observed.length>=7){
   pastAvg=observed.reduce((sum,r)=>sum+tdee-r.kcal,0)/observed.length;
   loggedDays=observed.length;source='protokollierte Tageswerte';
  } else if(finite(energy.settings?.deficit)){
   pastAvg=energy.settings.deficit;source='bisheriges eingestelltes Defizitziel';
  }
 }
 return {ready:tdee!==null&&resting!==null,tdee,resting,allowedMax,tiers,selected:selection?.kcal??null,
  targetKcal:selection?tdee-selection.kcal:null,pastAvgDeficitKcal:finite(pastAvg)?Math.round(pastAvg):null,
  loggedDays,source,eligible:Boolean(selection),reason:energy.reason||'Energiebedarf in den Ernährungs-Einstellungen ergänzen.'};
}
