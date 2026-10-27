/** Compass .59.40.4 – runtime Daily Dozen & Anti-Aging food evidence unify.
 * Inserted late after .36's legacy transform. No changes to vault/sync schemas.
 */
export function compass59404NutritionBridge(){
 const replace=(s,a,b,why)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.4 ${why}: ${n} anchors, expected one`);return s.replace(a,b);};
 return {name:'compass59404-nutrition-evidence',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/daily-dozen-auto-v57734.js')){
   let s=replace(source,'const localDay=at=>',"import {dailyDozenIngredientEvidence404} from './daily-dozen-evidence-v57759404.js';\nconst localDay=at=>",'shared ingredient ledger import');
   // The prior .36 food mapping is retained as a historical fallback for old
   // source trees, but execution delegates to the same validated ledger as .30.
   s=replace(s,'export function dailyDozenEvidence(state,day){','export function dailyDozenEvidence(state,day){\n return dailyDozenIngredientEvidence404(state,day);','same read-only ledger for Daily Dozen and Anti-Aging Eight');
   return {code:s,map:null};
  }
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  // Historic tests intentionally run only the older '-bridge.js' subset.
  // When .40.3 was not applied, do not force a partial source chain.
  if(!source.includes('Build 0.5.77.59.40.3'))return null;
  let s=replace(source,'Build 0.5.77.59.40.3','Build 0.5.77.59.40.4','release badge');
  if(path.endsWith('/client/src/main.js'))s=replace(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.3';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.4';",'app version');
  return {code:s,map:null};
 }};
}
