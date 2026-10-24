/** Compass 0.5.77.37.1 · guarded, additive Vite transform after all .37 bridges.
 * Keeps nutritional calculations untouched. Changes ONLY the missing-kcal row UI.
 */
export function nutritionPill577371Bridge(){
 const change=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw Error(`Compass .37.1: eindeutiger Integrationsanker fehlt (${label}); Basis .37 prüfen.`);
  return source.replace(from,to);
 };
 return {name:'compass-nutrition-pill-577371',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let out=change(source,"const COMPASS_CLIENT_VERSION='0.5.77.37';","const COMPASS_CLIENT_VERSION='0.5.77.37.1';",'Versionsanzeige');
   out=change(out,"import './strength-recipes-v57737.css';","import './strength-recipes-v57737.css';\nimport './nutrition-missing-pill-v577371.css';\nimport {wireStrengthRecentDefaults} from './strength-recent-defaults-v577371.js';\nimport './strength-recent-defaults-v577371.css';",'Pill-Styles und Trainingsdefaults');
   out=change(out,"const strengthForm=app.querySelector('#str732-form');\n if(strengthForm)strengthForm.onsubmit=",
    "const strengthForm=app.querySelector('#str732-form');\n if(strengthForm)wireStrengthRecentDefaults(strengthForm,state);\n if(strengthForm)strengthForm.onsubmit=",'Satzeditor: Gewichte/Wdh. vorschlagen');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/nutrition-history-v577.js')){
   let out=change(source,"import {personalEnergyEstimate} from './energy-goal-v575.js';","import {personalEnergyEstimate} from './energy-goal-v575.js';\nimport {nutritionMissingEnergyPill} from './nutrition-missing-pill-v577371.js';",'Helper-Import');
   const startMarker='<span class="n577-amount">';
   const endMarker="</details>`:''}";
   const start=out.indexOf(startMarker),end=out.indexOf(endMarker,start+startMarker.length);
   if(start<0||end<0||out.indexOf(startMarker,start+1)!==-1||out.indexOf(endMarker,end+endMarker.length)!==-1)throw Error('Compass .37.1: kcal-Tageszeile unerwartet. Keine stille Transformation.');
   const pill='<div class="n577-amount"><span class="n577-kcal-value">${r.known?`${fmt(r.low)}–${fmt(r.high)}`:\'–\'}</span>${nutritionMissingEnergyPill(r)}</div>';
   out=out.slice(0,start)+pill+out.slice(end+endMarker.length);
   return {code:out,map:null};
  }
  return null;
 }};
}
