/** Compass 0.5.77.53 — guarded finance fast route + true chart-first sleep.
 * UI-only. Runs after .52 transform, does not affect Today or persistence.
 */
export function compass753Bridge(){
 const once=(source,a,b,name)=>{const n=source.split(a).length-1;if(n!==1)throw Error(`Compass .53: ${name}: expected one anchor; found ${n}`);return source.replace(a,b);};
 return {name:'compass-753-premium-finance',enforce:'pre',transform(source,id){
  const file=id.replace(/\\/g,'/').split('?')[0];
  if(file.endsWith('/client/src/main.js')){
   let out=source;
   out=once(out,"const COMPASS_CLIENT_VERSION='0.5.77.52';","const COMPASS_CLIENT_VERSION='0.5.77.53';",'version');
   out=once(out,"import './chart-first-v57752.css';","import './chart-first-v57752.css';\nimport {financePremiumOverviewView} from './finance-premium-v57753.js';\nimport './finance-premium-v57753.css';",'premium finance imports');
   out=once(out,'function financeScreen(){return chrome(financeDashboardView(',"function financeScreen(){if(financePane==='Überblick')return chrome(financePremiumOverviewView(state,{period:financePeriod,account:financeAccount,today:localDate()}));return chrome(financeDashboardView(",'only the overview is fast-path');
   return {code:out,map:null};
  }
  if(file.endsWith('/client/src/sleep-intelligence-v550.js')){
   let out=source;
   // Move the entire verified stats/narrative block intact, after the primary week
   // visualization and trend chart, without changing formulas or click handlers.
   const begin='  <div class="sleep550-summary">';
   const main='  <div class="sleep550-primary">';
   const trend='  <article class="insight-chart-card sleep550-trend">';
   const year='  ${showYear?sleepAnnualView(';
   const a=out.indexOf(begin),b=out.indexOf(main,a+begin.length),c=out.indexOf(trend,b),d=out.indexOf(year,c);
   if(a<0||b<0||c<0||d<0||!(a<b&&b<c&&c<d)||out.indexOf(begin,a+1)!==-1)throw Error('Compass .53: sleep priority: exact renderer anchors missing or repeated');
   const text=out.slice(a,b);
   out=out.slice(0,a)+out.slice(b,d)+text+out.slice(d);
   out=once(out,'<details class="sleep550-extra sleep550-statistics">','<details class="sleep550-extra sleep550-statistics" open>','visible phase distribution');
   return {code:out,map:null};
  }
  return null;
 }};
}
