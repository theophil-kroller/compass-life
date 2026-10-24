/** Compass 0.5.77.29 · guarded additions on top of Nutrition 3 + Strength .28.
 * Reads Garmin Activities CSV Total Sets/Total Reps instead of discarding them.
 * Existing CSV sessions in the local vault must be re-imported once to enrich them.
 */
export function strength729Bridge(){
 const unique=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw Error(`Strength .29: Integrationsanker nicht eindeutig (${label}). Bitte Basis 0.5.77.28 prüfen.`);
  return source.replace(from,to);
 };
 return {name:'compass-strength-729',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   return {code:unique(source,"const COMPASS_CLIENT_VERSION='0.5.77.28';","const COMPASS_CLIENT_VERSION='0.5.77.29';",'Versionskennung'),map:null};
  }
  if(path.endsWith('/client/src/garmin-activities-csv.js')){
   let out=unique(source,
    "const sport=SPORT[activityType.toLowerCase()]??0,day=at.slice(0,10);",
    "const sport=SPORT[activityType.toLowerCase()]??0,day=at.slice(0,10);\n  // Activity table has aggregate counts, not individual exercises. Unknown remains null.\n  const totalSets=validNumber(field(row,'total sets'),0,3000),totalReps=validNumber(field(row,'total reps'),0,50000);",
    'Satzsummen lesen');
   out=unique(out,
    "distanceUnitAssumed:swim&&rawDistance!==null&&rawDistance>30?'m-converted':'km'});",
    "distanceUnitAssumed:swim&&rawDistance!==null&&rawDistance>30?'m-converted':'km',totalSets,totalReps});",
    'Satzsummen speichern');
   return {code:out,map:null};
  }
  return null;
 }};
}
