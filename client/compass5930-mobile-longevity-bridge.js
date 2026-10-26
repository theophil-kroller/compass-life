/** Compass 0.5.77.59.30: Extended-only mobile navigation + source-grounded Daily Dozen.
 * No changes to the Focus layout, no vault schema or sync migration.
 * Registered after .29, keeping the historic Vite chain and original .29 tests intact.
 */
export const RELEASE_5930='0.5.77.59.30';
export function compass5930MobileLongevityBridge(){
 const replaceOnce=(source,before,after,name)=>{
  const count=source.split(before).length-1;
  if(count!==1)throw Error(`Compass .59.30: ${name} integration anchor count ${count}, expected 1`);
  return source.replace(before,after);
 };
 return {name:'compass-mobile-longevity-5930',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  let s=source;
  const patch=(a,b,label)=>{s=replaceOnce(s,a,b,label);};
  if(path.endsWith('/client/src/life-balance-radar-v563.js')){
   patch("import {sleepMinutes} from './insights.js';",`import {dailyDozen5930} from './daily-dozen-v5775930.js';
import {sleepMinutes} from './insights.js';`,'daily dozen imported only into local radar');
   patch("historicalOnly=false}={}){", "historicalOnly=false,includeNutrition930=false}={}){", 'optional ninth radar axis');
   patch(" const axes=[sleep,activity,gtd,finance,people,body,recovery,work];",` const nutritionRows=includeNutrition930?Array.from({length:n},(_,i)=>{
  const d=shift(today,-i);return dailyDozen5930(state,{day:d});
 }).filter(r=>r.entries>0):[];
 // Explicit lower bound of documented Daily Dozen portions; not a health grade.
 const enoughNutrition=n===7?3:8;
 const measured=nutritionRows.length?nutritionRows.reduce((v,r)=>v+r.observed-(r.rows.find(x=>x.id==='exercise')?.observed||0),0)/nutritionRows.length:null;
 const nutrition=axis('nutrition930','Ernährung · dokumentiert',
  nutritionRows.length>=enoughNutrition?measured/23*100:null,
  nutritionRows.length?\`Ø \${Math.round(measured*10)/10} von 23 dokumentierten Ernährungsportionen · \${nutritionRows.length} Tage mit Einträgen\`:'Noch keine auswertbaren Ernährungseinträge',
  'Nur beobachtete Daily-Dozen-Mindestportionen. Ein fehlender Eintrag bedeutet nicht, dass etwas nicht gegessen wurde. Kein Anti-Aging- oder Ernährungsqualitäts-Rating.',
  'insights','nutrition',nutritionRows.length,nutritionRows.length?nutritionRows[0].day:null);
 const axes=[sleep,activity,gtd,finance,people,body,recovery,work,...(includeNutrition930?[nutrition]:[])];`,'optional ninth nutrition axis with minimum evidence gate');
   patch("period=7,healthDays=[],count=2}={}){", "period=7,healthDays=[],count=2,includeNutrition930=false}={}){",'optional historical radar dimension');
   patch("historicalOnly:true});", "historicalOnly:true,includeNutrition930});", 'historical nutrition trends use historical logs');
   patch(" const {axes,period,coverage,total}=model,selected=axes.filter(x=>x.score!=null);",` const {axes,period,coverage,total}=model,selected=axes.filter(x=>x.score!=null);
 const geom=(index,radius)=>{const a=(index/axes.length)*Math.PI*2-Math.PI/2;return [195+Math.cos(a)*radius,195+Math.sin(a)*radius];};`,'dynamic radar geometry');
   const start=s.indexOf('export function lifeBalanceRadarView(');
   if(start<0)throw Error('Compass .30: radar view missing');
   let head=s.slice(0,start),view=s.slice(start);
   view=view.replaceAll('%8','%axes.length').replace('selected.length===8','selected.length===axes.length')
    .replace(' · ${entry.coverage}/8',' · ${entry.coverage}/${model.total}')
    .replace('Radar mit acht Achsen; ${coverage}', 'Radar mit ${total} Achsen; ${coverage}');
   s=head+view;
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/main.js')){
   patch("const COMPASS_CLIENT_VERSION='0.5.77.59.29';","const COMPASS_CLIENT_VERSION='0.5.77.59.30';",'mobile release version');
   patch('Build 0.5.77.59.29','Build 0.5.77.59.30','visible app build indicator');
   patch("import {buildLifeBalanceRadar",`import {dailyDozen5930,dailyDozen5930View} from './daily-dozen-v5775930.js';
import './daily-dozen-v5775930.css';
import './mobile-direct-v5775930.css';
import {buildLifeBalanceRadar`,'Daily Dozen and mobile styles');
   patch('function chrome(content){',`let cm930MobileMenuOpen=false;
function chrome(content){`,'persistent mobile menu state');
   patch('<aside class="sidebar" aria-label="Navigation">',`<aside class="sidebar" data-cm930-mode="\${compass55Mode}" data-cm930-menu-open="\${cm930MobileMenuOpen?'true':'false'}" aria-label="Navigation">`,'mobile navigation state');
   patch('<nav class="side-nav calm-side-nav" aria-label="Hauptnavigation">',`\${compass55Mode==='extended'?\`<nav class="cm930-direct" aria-label="Schnellnavigation">
  <button type="button" data-tab="today" aria-label="Heute" class="\${tab==='today'?'active':''}">\${ico('sun',18)}<span>Heute</span></button>
  <button type="button" data-tab="inbox" aria-label="Inbox" class="\${tab==='inbox'?'active':''}">\${ico('inbox',18)}<span>Inbox</span></button>
  <button type="button" data-tab="people" aria-label="Menschen" class="\${tab==='people'?'active':''}">\${ico('people',18)}<span>Menschen</span></button>
  <button type="button" data-tab="finance" aria-label="Finanzen" class="\${tab==='finance'?'active':''}">\${ico('folder',18)}<span>Finanzen</span></button>
  <button type="button" data-tab="insights" aria-label="Insights" class="\${tab==='insights'?'active':''}">\${ico('layers',18)}<span>Insights</span></button>
  <button type="button" data-action="cm930-menu-toggle" aria-expanded="\${cm930MobileMenuOpen}" aria-label="Weiteres Menü">\${ico('menu',18)}<span>Mehr</span></button>
 </nav>\`:''}<nav class="side-nav calm-side-nav" aria-label="Hauptnavigation">`,'five direct mobile destinations + more');
   patch("const target=el.dataset.tab;if(!target)return;if(target==='today')", "const target=el.dataset.tab;if(!target)return;cm930MobileMenuOpen=false;if(target==='today')", 'drawer closes on route selection');
   patch('async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='cm930-menu-toggle'){cm930MobileMenuOpen=!cm930MobileMenuOpen;render();return;}`,'explicit navigation drawer handler');
   patch("if(action==='calm-nav-group'){calmNavGroup=calmNavGroup===id?'':id;render();return;}",`if(action==='calm-nav-group'){calmNavGroup=calmNavGroup===id?'':id;if(compass55Mode==='extended')cm930MobileMenuOpen=true;render();return;}`,'back from nested menu preserves root navigation');
   patch("if(action==='balance-select'){if(id===''||['sleep','activity','gtd','finance','people','body','recovery','work'].includes(id))", "if(action==='balance-select'){if(id===''||['sleep','activity','gtd','finance','people','body','recovery','work','nutrition930'].includes(id))", 'nutrition radar inspector enabled');
   patch("lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount}),activeAxis:balanceSelectedAxis})",`lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays,includeNutrition930:compass55Mode==='extended'}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount,includeNutrition930:compass55Mode==='extended'}),activeAxis:balanceSelectedAxis})+(compass55Mode==='extended'?dailyDozen5930View(dailyDozen5930(state,{day:today})): '')`,'ninth documented nutrition axis and linked evidence');
   patch('return chrome(\`<div class="insight-workspace" aria-label="Compass Insights · Personal Analytics">',`return chrome(\`<div class="insight-workspace" aria-label="Compass Insights · Personal Analytics">\${compass55Mode==='extended'&&insightTab==='nutrition'?dailyDozen5930View(dailyDozen5930(state,{day:today})):''}`,'Daily Dozen visible in nutrition insights');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   patch('Build 0.5.77.59.29','Build 0.5.77.59.30','locked screen current release number');
   return {code:s,map:null};
  }
  return null;
 }};
}
