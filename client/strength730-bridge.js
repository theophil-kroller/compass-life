/** Compass 0.5.77.30: sport-card fix following Nutrition 3, Strength .28 and CSV .29.
 * The Garmin Activities CSV has summaries, no individual exercises.
 * The original activities page grouped Strength Training under 'Sonstige'.
 * FIT sport code 19 is paddling, whereas the CSV parser historically labels
 * Strength Training as sport 19; distinguish by SOURCE to prevent regression.
 * No vault schema change and no reimport required for activity category.
 */
export function strength730Bridge(){
 const change=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw Error(`Strength .30: Integrationsanker fehlt oder nicht eindeutig (${label}). Basis 0.5.77.29 prüfen.`);
  return source.replace(from,to);
 };
 return {name:'compass-strength-730',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   return {code:change(source,"const COMPASS_CLIENT_VERSION='0.5.77.29';","const COMPASS_CLIENT_VERSION='0.5.77.30';",'Version'),map:null};
  }
  if(path.endsWith('/client/src/sports-insights.js')){
   let out=change(source,
    "martial:['Kampfsport','🥋','#B77A73'],sauna:",
    "martial:['Kampfsport','🥋','#B77A73'],strength:['Krafttraining','💪','#7B94A9'],sauna:",
    'Krafttraining Sportkategorie');
   out=change(out,
    "const x=String(title||'').toLocaleLowerCase('de-AT');",
    "const x=String(title||'').toLocaleLowerCase('de-AT');\n if(/strength[\\s-]*training|weight[\\s-]*training|krafttraining|kraftsport|muskeltraining|hanteltraining|gewichtheben|gewichtetraining|bodybuilding|free[\\s-]*weights/i.test(x))return 'strength';",
    'Strength Aktivitätsnamen');
   out=change(out,
    "const type=titleCategory!=='other'?titleCategory:activityCategory!=='other'?activityCategory:(sportMap[s.sport]||'other');",
    "const type=titleCategory!=='other'?titleCategory:activityCategory!=='other'?activityCategory:(s.source==='garmin-activities-csv'&&s.sport===19?'strength':(sportMap[s.sport]||'other'));",
    'CSV-19 und FIT-19 Quellunterscheidung');
   return {code:out,map:null};
  }
  return null;
 }};
}
