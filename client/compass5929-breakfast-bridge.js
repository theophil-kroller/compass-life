/** Compass .59.29: additive Greek-yogurt breakfast recipes and version. No Vault or migration changes.
 * Install AFTER .59.28 (and after all historical transforms) so old CI anchors stay intact.
 */
export const RELEASE_5929='0.5.77.59.29';
export function compass5929BreakfastBridge(){
 const replaceOnce=(source,before,after,name)=>{
  const count=source.split(before).length-1;
  if(count!==1)throw Error(`Compass .59.29: ${name} integration anchor count ${count}, expected 1`);
  return source.replace(before,after);
 };
 return {name:'compass-breakfast-5929',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  let s=source;
  const patch=(a,b,label)=>{s=replaceOnce(s,a,b,label);};
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   patch(" ['supplement-bcaa-alphaminos'",` ['lyttos-greek-natur','🥣','Lyttos Greek Style Natur · Hofer','Zutaten','150 g',173,173],
 ['honey','🍯','Honig','Zutaten','15 g (1 EL; angenommen)',45,47],
 ['koro-pistachio-puree','🥜','KoRo Bio Pistazienmus pur','Zutaten','15 g (1 EL; angenommen)',98,99],
 ['koro-black-tahini','⚫','KoRo Bio Tahini schwarz','Zutaten','15 g (1 EL; angenommen)',92,93],
 ['lyttos-pistachio-breakfast','🥣','Lyttos Joghurt + Honig + Pistazienmus','Frühstück','150 g Joghurt + 15 g Honig + 15 g Pistazienmus',316,319],
 ['lyttos-tahini-breakfast','🥣','Lyttos Joghurt + Honig + schwarzes Tahini','Frühstück','150 g Joghurt + 15 g Honig + 15 g Tahini',310,313],
 ['supplement-bcaa-alphaminos'`,'breakfast preset catalog');
   patch(" ...(id==='supplement-bcaa-alphaminos'?{",` ...(id==='lyttos-greek-natur'?{recipeNote:'Lyttos Greek Style Natur 150 g. Vorläufiger Drittanbieter-Wert: ca. 173 kcal; Packungsetikett noch nicht abgeglichen.'}:{}),
 ...(id==='honey'?{recipeNote:'1 EL Honig vorläufig als 15 g angenommen; keine Marke angegeben.'}:{}),
 ...(id==='koro-pistachio-puree'?{recipeNote:'Bio Pistazienmus 100 % Pistazien, KoRo, Produkt MUS_060; 658 kcal/100 g laut Hersteller. Löffelgröße vorläufig 15 g.'}:{}),
 ...(id==='koro-black-tahini'?{recipeNote:'Schwarzes Bio Tahin, KoRo, Produkt MUS_037; 616 kcal/100 g laut Hersteller. Löffelgröße vorläufig 15 g.'}:{}),
 ...(id==='lyttos-pistachio-breakfast'||id==='lyttos-tahini-breakfast'?{recipeNote:'Portion: 150 g Lyttos + 1 EL Honig (15 g angenommen) + 1 EL Mus (15 g angenommen). Im Eintrag die Grammzahlen im Feld Menge editieren; Lyttos-Nährwerte vorläufig.'}:{}),
 ...(id==='supplement-bcaa-alphaminos'?{`,'transparent breakfast ingredient source notes');
   patch(" const parseNumber=v=>Number(String(v).replace(',','.'));",` // Recipe grams have separate calorie densities. Generic single-unit scaling would be wrong.
 if(food.id==='lyttos-pistachio-breakfast'||food.id==='lyttos-tahini-breakfast'){
  const parsePart=(pattern,fallback)=>{
   const found=given.match(pattern);
   return found?Number(found[1].replace(',','.')):fallback;
  };
  const gram=(kind)=>parsePart(new RegExp('(\\\\d+(?:[.,]\\\\d+)?)\\\\s*g\\\\s*'+kind+'\\\\b','i'),kind==='joghurt'?150:15);
  const yogurt=gram('joghurt'),honey=gram('honig');
  const spread=gram(food.id==='lyttos-pistachio-breakfast'?'pistazienmus':'tahini');
  if(![yogurt,honey,spread].every(Number.isFinite)||yogurt<0||honey<0||spread<0||yogurt>1000||honey>150||spread>150)return null;
  const kcal=yogurt*1.15+honey*3.04+spread*(food.id==='lyttos-pistachio-breakfast'?6.58:6.16);
  return {low:Math.max(0,Math.round(kcal)-2),high:Math.round(kcal)+2,kind:'KoRo Etikett + Honig- und Lyttos-Schätzung'};
 }
 const parseNumber=v=>Number(String(v).replace(',','.'));`,'ingredient-wise recipe calorie estimator');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/nutrition-intelligence-v57712.js')){
   patch(" 'supplement-bcaa-alphaminos':profile(",` 'lyttos-greek-natur':profile('Lyttos Greek Style Natur · Hofer',100,'g',
  {kcal:115,protein:3.33,fat:9.4,saturated:6.33,carbs:3.53,sugar:3.53},
  'Vorläufiger Drittanbieter-Datenbankwert (Fitatu); Etikett nachreichen',{},'150 g = ca. 173 kcal, tatsächliche Verpackung prüfen.'),
 'koro-pistachio-puree':profile('KoRo Bio Pistazienmus 100 %',100,'g',
  {kcal:658,fat:56,saturated:6,carbs:12,sugar:5,fiber:6,protein:22,salt:0},
  'KoRo Hersteller, Produkt MUS_060',{},'Ein Esslöffel vorläufig 15 g; andere KoRo-Packungsgrößen können abweichen.'),
 'koro-black-tahini':profile('KoRo Schwarzes Bio Tahin',100,'g',
  {kcal:616,fat:52,saturated:7.4,carbs:12,sugar:0,fiber:12,protein:19,salt:.03},
  'KoRo Hersteller, Produkt MUS_037',{},'Ein Esslöffel vorläufig 15 g.'),
 'supplement-bcaa-alphaminos':profile(`,'breakfast nutrition source labels');
   patch(" if(foodId==='matcha'||foodId==='matcha-oat-plain'){",` if(foodId==='lyttos-pistachio-breakfast'||foodId==='lyttos-tahini-breakfast'){
  const a=String(amount||source.defaultAmount||'').toLowerCase();
  const mass=(name,defaultG)=>{
   const match=a.match(new RegExp('(\\\\d+(?:[.,]\\\\d+)?)\\\\s*g\\\\s*'+name+'\\\\b','i'));
   return match?amountNumber(match[1]):defaultG;
  };
  const yogurt=mass('joghurt',150),honey=mass('honig',15),paste=mass(foodId==='lyttos-pistachio-breakfast'?'pistazienmus':'tahini',15);
  if(![yogurt,honey,paste].every(Number.isFinite)||yogurt<0||honey<0||paste<0||yogurt>1000||honey>150||paste>150)return [];
  return [piece('lyttos-greek-natur',yogurt,'g','Joghurt (vorläufig)'),piece('honey',honey,'g','Honig (Schätzung)'),piece(foodId==='lyttos-pistachio-breakfast'?'koro-pistachio-puree':'koro-black-tahini',paste,'g','Mus (KoRo Etikett)')].filter(Boolean);
 }
 if(foodId==='matcha'||foodId==='matcha-oat-plain'){`,'recipe macro breakdown editable per ingredient');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/main.js')){
   patch("const COMPASS_CLIENT_VERSION='0.5.77.59.28';","const COMPASS_CLIENT_VERSION='0.5.77.59.29';",'full release version');
   patch('Build 0.5.77.59.28','Build 0.5.77.59.29','visible footer version');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   patch('Build 0.5.77.59.28','Build 0.5.77.59.29','locked screen release number');
   return {code:s,map:null};
  }
  return null;
 }};
}
