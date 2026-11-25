import {BILLA_SAHNE_PUDDING_ID_168,NOEM_PRO20_VANILLA_ID_168,RAPUNZEL_CRANBERRY_ID_168,packagedPortion168} from './food-desserts-cranberries-v059168.js';
import {TAKEAWAY_NOODLE_BOX_ID_167,TAKEAWAY_NOODLE_BOX_ASSUMPTIONS_167,noodleBoxPortion167} from './takeaway-noodlebox-v059167.js';
import {MILLET_BAKE_ID_166,MILLET_BAKE_PEAR_ID_166,MILLET_BAKE_ASSUMPTIONS_166,milletBakePortion166} from './millet-egg-bake-v059166.js';
import {ROESTI_TOAST_ID_165,RAW_CACAO_OAT_ID_165} from './roesti-cocoa-v059165.js';
import {BEET_SALAD_ID_164,BEET_SALAD_164,beetSaladPortion164} from './beet-potato-salad-v059164.js';
import {wholegrainBreadEvidence} from './wholegrain-serving-v059138.js';
import {PLANT_DD_149,plantPortion149} from './food-plants-v059149.js';
/** Compass .59.40.4: One read-only, ingredient-level evidence ledger for both
 * Daily Dozen presentations and Anti-Aging Eight. No inferred meals, GPS,
 * nutrition edits, network calls, or persistent duplicate counters.
 * Small portion estimates are explicitly approximate, not clinical targets.
 */
import {smoothieRecipe} from './nutrition-smart-smoothie-v57736.js';
import {PERSONAL_RECIPE_IDS,recipeSnapshot,pumpkinSoupBatchFraction} from './personal-recipes-v57737.js';
const dayOf=at=>{const d=new Date(at);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const NAMES={beans:'Hülsenfrüchte',berries:'Beeren',fruit:'Obst',cruciferous:'Kreuzblütler',greens:'Blattgemüse',vegetables:'Gemüse',flax:'Leinsamen',nuts:'Nüsse & Samen',spices:'Kräuter & Gewürze',wholegrains:'Vollkorn',beverages:'Getränke'};
const grams=s=>{const m=String(s||'').match(/(?:^|[^\d])(\d+(?:[.,]\d+)?)\s*g\b/i);return m?Number(m[1].replace(',','.')):null;};
const ml=s=>{const m=String(s||'').match(/(?:^|[^\d])(\d+(?:[.,]\d+)?)\s*ml\b/i);return m?Number(m[1].replace(',','.')):null;};
const round=n=>Math.round(n*100)/100;
function scale(entry){const x=String(entry.amount||'').match(/^\s*(\d+(?:[.,]\d+)?)\s*(?:portion|portionen|glas|gläser|glaser|teller|schüssel|schüsseln|schuessel|schuesseln|stück|stücke|stueck|stuecke|krautroulade|krautrouladen|riegel)\b/i);return x?Math.max(0,Math.min(4,Number(x[1].replace(',','.')))):1;}
function validAmount(n){return typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=2000;}
/** Returns portions with source hints. One logged recipe is counted once,
 * based on its saved ingredient snapshot; no extra food credit for being a drink.
 * Contains fractional evidence for the read-only progress chart.
 */
export function dailyDozenIngredientEvidence404(state,day){
 const entries=(state?.nutritionJournal?.entries||[]).filter(e=>e&&!e.deleted&&dayOf(e.at)===day);
 const custom=new Map((state?.nutritionJournal?.customFoods||[]).map(f=>[f.id,f]));
 const totals=Object.fromEntries(Object.keys(NAMES).map(k=>[k,0]));
 const notes=Object.fromEntries(Object.keys(NAMES).map(k=>[k,[]]));
 const sources=[];let nutGrams=0,spiceGrams=0;
 const add=(id,n,source,entryId)=>{if(!NAMES[id]||!Number.isFinite(n)||n<=0)return;
  totals[id]+=n;notes[id].push(`${source}: ~${round(n)} Portion(en)`);
  if(entryId) sources.push({id:entryId,category:id,portion:round(n),source});
 };
 for(const e of entries){
  const id=String(e.foodId||''),a=String(e.amount||''),g=grams(a),factor=scale(e),sourceId=String(e.id||id);
  if(id.startsWith('mensa-menu-')&&e.menuSnapshot){
   // Mensa dishes only count when actually eaten. Prefer per-day saved snapshots,
   // but recover ingredient assumptions from the catalog for older journal entries.
   const snap=e.menuSnapshot;
   const offer=(state?.mensaCatalog?.entries||[]).find(o=>o?.id===e.catalogOfferId||o?.menuDate===snap.menuDate);
   const weights=Object.keys(snap.ingredientWeightsGrams||{}).length?snap.ingredientWeightsGrams:offer?.ingredientWeightsGrams;
   const named=[...(snap.ingredientsNamedInMenu||offer?.ingredientsNamedInMenu||[])];
   const observedCategories=new Set();
   const classify=name=>{
    const t=String(name).toLocaleLowerCase('de');
    // Names must describe the ingredient itself: a rice wrapper or a
    // breaded vegetable is not a confirmed whole-grain serving.
    if(/(?:brokkoli|broccoli|blumenkohl|rotkraut|weißkraut|weisskraut|kohlrabi|kohlsprossen|rosenkohl)/.test(t))return 'cruciferous';
    if(/(?:spinat|mangold|grünkohl|rucola|blattsalat)/.test(t))return 'greens';
    if(/(?:linsen|kichererbsen|kidneybohnen|käferbohnen|bohnen|tofu|tempeh)/.test(t))return 'beans';
    if(/(?:vollkorn|naturreis|brauner reis|schwarzer reis|buchweizen|quinoa|bulgur)/.test(t))return 'wholegrains';
    if(/(?:wokgemüse|gemüse|gemuese|paprika|karotte|möhre|zucchini|aubergine|kürbis|tomat|rote rübe|rote beete)/.test(t))return 'vegetables';
    // Plain basmati rice, pasta, wheat, potatoes and generic grain names
    // must NOT be promoted to Greger's whole-grain category.
    return null;
   };
   const denom={beans:90,cruciferous:80,greens:85,vegetables:80,wholegrains:100};
   if(weights&&typeof weights==='object'&&!Array.isArray(weights)){
    for(const [name,raw] of Object.entries(weights)){
     const category=classify(name),mass=Number(raw);
     if(!category||!Number.isFinite(mass)||mass<=0||mass>1500)continue;
     observedCategories.add(category);
     // Source weights are typical-recipe estimates, never measured portions.
     const amount=Math.min(3,mass/denom[category]);
     add(category,amount,`Mensa · ${name}: ca. ${round(mass)} g laut Rezeptschätzung (nicht gewogen)`,sourceId);
    }
   }
   // Older meals can have a clear named side but no weights. Show at most a
   // provisional half serving, never a fictitious full Daily-Dozen checkmark.
   if(!observedCategories.size){
    for(const label of named){
     const category=classify(label);
     if(!category||observedCategories.has(category))continue;
     observedCategories.add(category);
     add(category,0.5,`Mensa · ${label}: ungewogene Beilage, vorsichtig geschätzte Teilportion`,sourceId);
    }
   }
   const candidates=snap.dailyDozenCandidateCategories||offer?.dailyDozenCandidateCategories||[];
   // Legacy saved ratatouille entries carried only a dish title and category;
   // keep their older conservative half-serving behaviour intact.
   if(!observedCategories.size&&candidates.includes('vegetables')&&/ratatouille|gemüse|gemuese|vegetable/i.test(String(snap.title||''))){
    observedCategories.add('vegetables');
    add('vegetables',0.5,'Mensa · Gemüse ausdrücklich im Gericht genannt, Portionsgewicht unbekannt (vorläufig)',sourceId);
   }
   for(const candidate of candidates){
    const category=candidate==='legumes'?'beans':candidate;
    if(NAMES[category]&&!observedCategories.has(category))notes[category].push('Mensa · mögliche Zutat laut Speiseplan, aber kein hinreichender Mengenbeleg für eine Portion.');
   }
   continue;
  }
  if(Object.hasOwn(PLANT_DD_149,id)){
   const spec=PLANT_DD_149[id];const parsed=plantPortion149(id,a);
   if(parsed){
    if(spec.group==='cruciferous')add('cruciferous',parsed.grams/80,'Gedämpfter Brokkoli · verzehrte Menge, Gemüsegewicht nach Garen',sourceId);
    else if(spec.group==='vegetables')add('vegetables',parsed.grams/80,'Karotte / Süßkartoffel · essbare Portion',sourceId);
    else if(spec.group==='fruit')add('fruit',parsed.grams/120,'Frisches Obst · essbares Gewicht / 120 g mittlere Portion',sourceId);
    else if(id==='spelt-spaghetti-dry-20261115')notes.wholegrains.push('Dinkel-Spaghetti ohne Vollkornangabe: keine automatische Vollkorn-Gutschrift.');
    else if(id==='calpis-kyohou-grape-diluted-20261115')notes.beverages.push('Calpis als gezuckertes Mischgetränk: erfasst, aber nicht als Wasser-/ungesüßte Getränkemenge gutgeschrieben.');
   }
   continue;
  }
  if(id===RAPUNZEL_CRANBERRY_ID_168){
   const parsed=packagedPortion168(id,a);if(!parsed)continue;
   // Ingredients: 60% dried cranberries, 39% concentrated apple syrup,
   // 1% sunflower oil. Dried-berry reference ~40g per serving (1/4 cup).
   const actualBerryGrams=parsed.grams*0.60;
   add('berries',actualBerryGrams/40,`Rapunzel Cranberries · ~${round(actualBerryGrams)} g tatsächliche getrocknete Cranberries aus ${round(parsed.grams)} g gesüßtem Produkt (60 % Fruchtanteil; Rechenannahme)`,sourceId);
   notes.berries.push('Enthält zusätzlich 39 % Apfeldicksaft; eine gesüßte Trockenbeere ist ernährungsphysiologisch nicht mit ungesüßten Beeren gleichzusetzen. Nur 60 % Cranberry-Anteil gezählt.');
   notes.fruit.push('Apfeldicksaft (39 %) wird NICHT als eigenständige Obstportion gutgeschrieben.');
   continue;
  }
  if(id===BILLA_SAHNE_PUDDING_ID_168||id===NOEM_PRO20_VANILLA_ID_168){
   notes.spices.push('Vanille in Sahnepudding / Topfencreme nicht mengenmäßig belegbar: keine Gewürzportion.');
   notes.beans.push('Milchprodukt: Milchprotein ist keine Daily-Dozen-Hülsenfruchtportion.');
   continue;
  }
  if(id===TAKEAWAY_NOODLE_BOX_ID_167){
   const parsed=noodleBoxPortion167(a);if(!parsed)continue;
   const vegetableGrams=TAKEAWAY_NOODLE_BOX_ASSUMPTIONS_167.vegetablesGrams*parsed.portions;
   add('vegetables',vegetableGrams/80,`Nudelbox mit Gemüse · ca. ${round(vegetableGrams)} g gemischtes Gemüse, ungewogene Imbiss-Schätzung`,sourceId);
   notes.wholegrains.push('Nudelbox: Nudelsorte unbekannt; keine belegte Vollkorn-Gutschrift.');
   notes.cruciferous.push('Nudelbox: Gemüsemix nicht genau bekannt; keine separate Kreuzblütler-Gutschrift.');
   notes.spices.push('Thai-Curry-Soße nur vermutet und Gewürzmengen nicht beziffert; keine automatische Gewürzportion.');
   notes.beans.push('Keine Bohnen, kein Tofu und kein Tempeh in dieser Nudelbox bestätigt.');
   continue;
  }
  if(id===MILLET_BAKE_ID_166||id===MILLET_BAKE_PEAR_ID_166){
   const parsed=milletBakePortion166(id,a);if(!parsed)continue;
   const proportion=parsed.portions;
   // One assumed base portion uses 125 g cooked whole millet, regardless of pear topping.
   // 1/2 cup cooked whole grain ~100 g as an explicit approximation.
   const milletGrams=125*proportion;
   add('wholegrains',milletGrams/100,`Hirse-Ei-Auflauf · ~${round(milletGrams)} g gekochte Hirse (ganzes Korn, Rezeptmengen geschätzt)`,sourceId);
   notes.wholegrains.push('Hirse als ganze Hirsekörner angenommen. Falls raffinierte Hirseprodukte verwendet wurden, muss die Vollkorn-Gutschrift korrigiert werden.');
   if(id===MILLET_BAKE_PEAR_ID_166){
    const pear=100*proportion;
    add('fruit',pear/120,`Hirse-Ei-Auflauf mit Birne · ~${round(pear)} g Birne (optionale Frühstücksvariante)`,sourceId);
    notes.fruit.push('Birne nur für die ausdrücklich gewählte Frühstücksvariante angenommen; nicht im ursprünglichen Auflauf bestätigt.');
   }else{
    notes.fruit.push('Original-Hirse-Ei-Auflauf: Obst nicht bestätigt. Falls Birne oder andere Früchte dazukommen, die Variante mit Birne wählen oder separat Obst erfassen.');
   }
   notes.beans.push('Eier und Dattelsirup sind keine Daily-Dozen-Hülsenfruchtportionen.');
   continue;
  }
  if(id===ROESTI_TOAST_ID_165){
   notes.berries.push('Rösti-Toast: Preiselbeeren 6,5 % (= ca. 13 g pro 200-g-Stück) in einer gezuckerten Füllung; keine volle Beerenportion und mangels verlässlicher Portionierung keine automatische Gutschrift.');
   notes.wholegrains.push('Rösti-Toast aus Kartoffeln (64 %) ist kein Vollkorn; Kartoffeln/Käse ergeben keine Daily-Dozen-Kategorie.');
   continue;
  }
  if(id===RAW_CACAO_OAT_ID_165){
   notes.beverages.push('Rohkakao mit Hafermilch ist kein Wasser oder ungesüßter Tee; daher keine automatische Daily-Dozen-Getränkeportion.');
   notes.spices.push('Feste Kakaomasse (ca. 8 g) wird nicht automatisch als tägliche Kräuter-/Gewürzportion gutgeschrieben.');
   notes.wholegrains.push('Haferdrink enthält Haferanteile, ist aber kein belegter Vollkorngetreide-Verzehr.');
   notes.nuts.push('Kakaomasse ist keine Nuss-/Samenportion im Daily Dozen.');
   continue;
  }
  if(id==='realmix-ube-latte-stick-16g'){
   notes.vegetables.push('REALMIX Ube Latte: nur 7 % violette Süßkartoffel im Pulver (1,12 g pro Stick); keine Daily-Dozen-Gemüseportion.');
   notes.beverages.push('REALMIX Ube Latte: gezuckertes Instantgetränk; nicht als Wasser oder ungesüßter Tee gutgeschrieben.');
   continue;
  }
  if(id===BEET_SALAD_ID_164){
   const p=beetSaladPortion164(a);if(!p)continue;
   const proportion=p.grams/BEET_SALAD_164.batchGrams;
   // Actual raw beets and carrots count as other vegetables. Potatoes do not count as wholegrains.
   const beet=300*proportion,carrot=50*proportion;
   add('vegetables',(beet+carrot)/80,`Hausgemachter Rote-Rüben-Kartoffelsalat · Rüben ca. ${round(beet)} g, Karotte ca. ${round(carrot)} g (Rezeptschätzung)`,sourceId);
   const sesame=40*proportion,pumpkinSeeds=20*proportion,nuts=sesame+pumpkinSeeds;
   nutGrams+=nuts;notes.nuts.push(`Rote-Rüben-Kartoffelsalat · schwarzer Sesam ca. ${round(sesame)} g + Kürbiskerne ca. ${round(pumpkinSeeds)} g (geschätzt)`);
   sources.push({id:sourceId,category:'nuts',grams:round(nuts),source:'Salat · Sesam & Kürbiskerne (geschätzt)'});
   // Treat fresh rosemary as one tenth dry-equivalent. Coriander seeds as dry spice.
   const herbEquivalent=(3+2/10)*proportion;
   spiceGrams+=herbEquivalent;
   notes.spices.push(`Salat · Koriandersamen + frischer Rosmarin: ~${round(herbEquivalent)} g Trockenäquivalent (geschätzt)`);
   sources.push({id:sourceId,category:'spices',grams:round(herbEquivalent),source:'Salat · Koriander & Rosmarin (geschätzt)'});
   notes.wholegrains.push('Gedämpfte Kartoffeln sind kein Vollkorn; Schafkäse, Öl, Sirup, Sojasauce und Salz ergeben keine zusätzlichen Daily-Dozen-Portionen.');
   notes.vegetables.push('Rote-Rüben/Karottenmengen sind aus einer nicht abgewogenen, halben Rezeptportion abgeleitet; bitte bei anderer tatsächlicher Menge korrigieren.');
   continue;
  }
  if(id==='homemade_indian_lemon_red_cabbage_20261114'){
   // Confirmed 1,387 g raw cabbage; assumed cooked yield 1,600 g.
   // Credit is a provisional ingredient-based estimate, not a lab measurement.
   const serving=g!==null?g:100*factor;
   if(serving>0&&serving<=2000){
    const cabbage=serving*1387/1600;
    add('cruciferous',cabbage/80,'Indisches Rotkraut · geschätzter Rotkrautanteil (Endgewicht nicht gemessen)',sourceId);
    notes.cruciferous.push('Vorläufig: 1.387 g Rotkraut im Rezept bestätigt; gegartes Endgewicht ~1.600 g nur angenommen.');
   }
   continue;
  }
  if(id==='homemade_red_cabbage_beet_kimchi_20261114'){
   // The recipe's red-cabbage mass was not confirmed, and brine/solids ratios
   // are unknown. Do not award a made-up full crucifer serving or probiotics.
   notes.cruciferous.push('Kimchi enthält Rotkraut, aber dessen tatsächlich gegessener Anteil samt Lake ist unbestätigt: keine automatische Kreuzblütler-Gutschrift.');
   notes.vegetables.push('150 g Rote Rübe im Ansatz bestätigt; Portionsgewicht mit Lake nicht ermittelt. Erst nach geklärtem Abtropfgewicht verrechnen.');
   continue;
  }
  if(id==='hofer-laugenbreze-butter'){
   notes.wholegrains.push('HOFER Laugenbreze: raffiniertes Laugengebäck, kein belegtes Vollkorn; Butter zählt nicht als Daily-Dozen-Portion.');
   continue;
  }
  if(id==='alpro-plant-protein-vanilla-pudding-200g'||id==='alpro-plant-protein-chocolate-pudding-200g'){
   notes.beans.push('Alpro Plant Protein Pudding: Sojabohnen und Sojaprotein, aber keine nachgewiesene volle Hülsenfruchtportion.');
   continue;
  }
  if(id==='dr-goerg-organic-coconut-milk-200ml'){
   notes.nuts.push('Dr. Goerg Kokosmilch: keine belegte vollwertige Nuss-/Samenportion; 100 ml Getränk/Zutat werden nicht automatisch als Wasser oder Daily-Dozen-Getränk gezählt.');
   continue;
  }
  if(id==='copaya-organic-raw-cocoa-powder'){
   notes.spices.push('Copaya Rohkakaopulver: keine bestätigte Daily-Dozen-Gewürzportion; Flavanolgehalt nicht quantifiziert.');
   continue;
  }
  if(id==='organic-hemp-fruit-protein-bar-35g'){
   const barMass=/^\s*\d+(?:[.,]\d+)?\s*riegel\b/i.test(a)?35*factor:g!==null?g:35*factor;
   // 53% total dried fruit is confirmed; proportions of dates/raisins/figs unknown.
   add('fruit',barMass*.53/40,'Hanf-Fruchtriegel · 53 % Trockenfrüchte (≈, 40 g Referenzportion Trockenobst)',sourceId);
   notes.nuts.push('Hanfprotein ist keine bestätigte ganze Nuss-/Samenportion.');
   notes.spices.push('Maca und Zimt vorhanden, Menge unbekannt: keine Gewürzportion.');
   continue;
  }
  if(id==='zotter-labooko-himbeer-kokos'){
   notes.berries.push('Zotter Himbeer-Kokos: 8 % gefriergetrocknete Himbeeren, keine belegte volle Beerenportion; keine automatische Gutschrift.');
   notes.nuts.push('Kokos/Kakaobutter: keine automatisch bestätigte Nussportion.');
   continue;
  }
  if(id==='spar-bio-flaxseed'){
   // Do not silently credit whole seeds. Label prohibits raw consumption.
   const note=String(e.note||'');
   const ground=/(?:geschrotet|gemahlen|vermahlen)/i.test(note);
   const heated=/(?:gekocht|gebacken|erhitzt|gegart|geröstet|geroestet)/i.test(note);
   const chewed=/(?:zerkaut|gekaut)/i.test(note);
   if(g!==null&&g>0&&ground&&heated)add('flax',g/7,'Leinsamen · geschrotet & erhitzt (1 EL ca. 7 g)',sourceId);
   else if(g!==null&&g>0&&chewed)add('flax',g/7,'Leinsamen · vor dem Schlucken gekaut (Teilportion, Zerkleinerung ungewiss; Packung verlangt Erhitzen)',sourceId);
   else if(g!==null&&g>0)notes.flax.push(`Leinsamen: ${round(g)} g erfasst; ganze nicht zerkleinerte Samen werden nicht als Greger-Portion gewertet`);
   continue;
  }
  if(id==='smoothie-personal'){
   const rows=smoothieRecipe(e.recipe),by=Object.fromEntries(rows.map(x=>[x.id,validAmount(x.grams)?x.grams*factor:0]));
   add('fruit',(by.banana||0)/120,'Smoothie · Banane',sourceId);
   add('berries',(by.blueberries||0)/75,'Smoothie · Blaubeeren',sourceId);
   const nut=(by.nuts||0)+(by.sesame||0);
   if(nut>0){nutGrams+=nut;notes.nuts.push(`Smoothie · Nussmix & Sesam: ~${round(nut)} g`);sources.push({id:sourceId,category:'nuts',grams:round(nut),source:'Smoothie · Nussmix & Sesam'});}
   const dry=(by.cinnamon||0)+(by.ginger||0)+(by.turmeric||0);
   // Fresh mint is not dry spice; 10 g fresh herb ~ 1 g dried equivalent (rough).
   const herbs=dry+(by.mint||0)/10;
   if(herbs>0){spiceGrams+=herbs;notes.spices.push(`Smoothie · Gewürze/Kräuter: ~${round(herbs)} g Trockenäquivalent (Schätzung)`);sources.push({id:sourceId,category:'spices',grams:round(herbs),source:'Smoothie · Gewürze/Kräuter'});}
   continue;
  }
  if(PERSONAL_RECIPE_IDS.includes(id)){
   const recipeFactor=id==='muscat-pumpkin-soup-personal'?pumpkinSoupBatchFraction(e.amount):factor;
   if(!Number.isFinite(recipeFactor))continue;
   const by=Object.fromEntries(recipeSnapshot(id,e.recipe).map(x=>[x.id,validAmount(x.grams)?x.grams*recipeFactor:0]));
   if(id==='muscat-pumpkin-soup-personal'){
    add('vegetables',((by.pumpkin||0)+(by.carrots||0)+(by.celery||0))/80,'Muskatkürbissuppe · Kürbis/Karotten/Sellerie (Gramm geschätzt)',sourceId);
    const spice=(by.garlic||0)/10+(by.ginger||0)/10+(by.nutmeg||0)+(by['chili-flakes']||0);
    if(spice>0){spiceGrams+=spice;notes.spices.push(`Muskatkürbissuppe · Gewürze: ~${round(spice)} g Trockenäquivalent (grob)`);sources.push({id:sourceId,category:'spices',grams:round(spice),source:'Muskatkürbissuppe · Ingwer, Knoblauch, Muskat, Chili'});}
    notes.wholegrains.push('Kartoffeln mit Schale sind kein Vollkorn. Butter und Brühe zählen nicht als pflanzliche Daily-Dozen-Portion.');
   } else if(id==='salad-personal'){
    add('greens',(by.lettuce||0)/85,'Grüner Salat · Blattsalat',sourceId);
    add('vegetables',((by.carrot||0)+(by.pepper||0))/80,'Grüner Salat · Gemüse',sourceId);
    const nut=(by.sesame||0)+(by.peanuts||0);if(nut>0){nutGrams+=nut;notes.nuts.push(`Salat · Sesam/Erdnüsse: ~${round(nut)} g`);sources.push({id:sourceId,category:'nuts',grams:round(nut),source:'Salat · Sesam/Erdnüsse'});}
    const spice=(by.cumin||0)+(by.coriander||0);if(spice>0){spiceGrams+=spice;notes.spices.push(`Salat · Kumin/Koriander: ~${round(spice)} g`);sources.push({id:sourceId,category:'spices',grams:round(spice),source:'Salat · Kumin/Koriander'});}
   } else if(id==='bean-salad-personal'){
    add('beans',(by.beans||0)/90,'Käferbohnensalat · Bohnen',sourceId);
    const spice=(by.garlic||0)+(by.oregano||0);if(spice>0){spiceGrams+=spice;notes.spices.push(`Käferbohnensalat · Kräuter: ~${round(spice)} g`);sources.push({id:sourceId,category:'spices',grams:round(spice),source:'Käferbohnensalat · Kräuter'});}
   } else if(id==='kitcheri-personal'){
    // Dry mung dal is NOT the same weight as cooked legumes; conservative ~2.3x hydration.
    add('beans',Math.min(2,(by['mung-dal']||0)*2.3/90),'Kitcheri · Mung Dal (gekochte Menge geschätzt)',sourceId);
    add('vegetables',((by.carrot||0)+(by.zucchini||0))/80,'Kitcheri · Karotte & Zucchini',sourceId);
    const spice=(by.ginger||0)/10+(by.turmeric||0)+(by.cumin||0);if(spice>0){spiceGrams+=spice;notes.spices.push(`Kitcheri · Gewürze (Trockenäquivalent geschätzt): ~${round(spice)} g`);sources.push({id:sourceId,category:'spices',grams:round(spice),source:'Kitcheri · Gewürze'});}
   } else if(id==='fried-egg-personal'){
    const spice=(by.turmeric||0)+(by.chili||0);if(spice>0){spiceGrams+=spice;notes.spices.push(`Spiegelei · Kurkuma/Chili: ~${round(spice)} g`);sources.push({id:sourceId,category:'spices',grams:round(spice),source:'Spiegelei · Kurkuma/Chili'});}
   } else if(id==='basmati-lentil-dal-broccoli-personal'){
    // Both quantities are COOKED weights. Rice is WHITE and never earns wholegrain credit.
    add('beans',(by['lentils-cooked']||0)/90,'Linsendal · gekochte Linsen (Portion geschätzt)',sourceId);
    add('cruciferous',(by['broccoli-cooked']||0)/80,'Linsendal · Brokkoli (gekocht, geschätzt)',sourceId);
    const curry=by['curry-powder']||0;
    if(curry>0){spiceGrams+=curry;notes.spices.push(`Linsendal · Currygewürze: ~${round(curry)} g (geschätzt)`);sources.push({id:sourceId,category:'spices',grams:round(curry),source:'Linsendal · Currygewürze'});}
   } else if(id==='steamed-potatoes-sichuan-veg-personal'){
    // Small carrots and celery count as other vegetables; not potatoes. No oil
    // or animal foods were named, and potatoes are not grain servings.
    add('vegetables',((by.carrots||0)+(by.celery||0))/80,'Gedämpftes Kartoffel-Gemüse · Karotten & Stangensellerie (Mengen geschätzt)',sourceId);
    const herbs=(by.ginger||0)/10+(by.garlic||0)/10+(by['fresh-chili']||0)/10+(by['chili-flakes']||0)+(by['sichuan-pepper']||0);
    if(herbs>0){spiceGrams+=herbs;notes.spices.push(`Kartoffel-Gemüse · Ingwer/Knoblauch/Chili/Sichuanpfeffer: ~${round(herbs)} g Trockenäquivalent (grob)`);sources.push({id:sourceId,category:'spices',grams:round(herbs),source:'Kartoffel-Gemüse · Gewürze'});}
    notes.wholegrains.push('Gedämpfte Kartoffeln sind kein Vollkorn; Ahornsirup und Sojasauce keine Daily-Dozen-Pflanzenportionen.');
   } else if(id==='black-rice-cooked-personal'){
    // Separate foodId explicitly means cooked NATURALLY BLACK wholegrain rice.
    // Not ordinary polished/white basmati. Actual grain/packaging can be edited.
    add('wholegrains',(by['black-rice-cooked']||0)/100,'Schwarzer Vollkornreis · gekocht (Produktart noch zu bestätigen)',sourceId);
   } else if(id==='ironmaxx-vegan-protein-shake-mixed-berries'){
    // Protein powder is NOT a berry portion; flavour alone gives no berries.
    // Only the recorded WATER amount is credited as a drink, not the powder.
    add('beverages',(by.water||0)/350,'IronMaxx Proteinshake · Wasseranteil (ml ≈ g)',sourceId);
   } else if(id==='korean-spicy-tofu-vegetable-strudel'){
    // 02.11.2026 user correction: CABBAGE ROULADE with SMOKED TOFU, no pastry.
    // Cabbage is a cruciferous vegetable; never double-count the same cabbage
    // as generic vegetables. Tofu belongs to soy/beans regardless of smoking.
    add('beans',(by.tofu||0)/125,'Krautroulade · Räuchertofu (Soja, Menge geschätzt)',sourceId);
    add('cruciferous',(by.cabbage||0)/80,'Krautroulade · gegartes Kraut (Menge geschätzt)',sourceId);
    add('vegetables',(by['mixed-vegetables']||0)/80,'Krautroulade · zusätzliches Gemüse (nur wenn tatsächlich eingetragen)',sourceId);
   } else if(['spar-freefrom-bio-skyr-250g','bio-magertopfen-250g','homemade-topfentorte-slice'].includes(id)){
    // Dairy/cheesecake protein and calcium do not fulfill plant-specific Daily Dozen categories.
    notes.beans.push('Milchprodukt/Topfentorte: Eiweiß ist keine Hülsenfruchtportion');
   } else if(id==='homemade-poppy-cake-chocolate-personal'){
    // Cake has NO known recipe or measured poppy-seed mass. Do not award nuts,
    // wholegrain or cocoa/berry portions from an unverified generic cake proxy.
    notes.nuts.push('Mohnkuchen: Mohn vorhanden, aber Samenmenge im selbstgebackenen Rezept unbekannt; keine belegte Daily-Dozen-Samenportion');
   } else if(id==='oven-potatoes-sesame-personal'){
    // Only explicitly logged seed/spice weights: starchy potatoes are NOT
    // auto-awarded a Daily Dozen vegetable serving on an unweighed bowl.
    const sesame=by['black-sesame']||0,chili=by['chili-flakes']||0;
    if(sesame>0){nutGrams+=sesame;notes.nuts.push(`Ofenkartoffeln · schwarzer Sesam: ~${round(sesame)} g`);sources.push({id:sourceId,category:'nuts',grams:round(sesame),source:'Ofenkartoffeln · Sesam'});}
    if(chili>0){spiceGrams+=chili;notes.spices.push(`Ofenkartoffeln · Chiliflocken: ~${round(chili)} g`);sources.push({id:sourceId,category:'spices',grams:round(chili),source:'Ofenkartoffeln · Chili'});}
   }
   continue;
  }
  if(id==='apple'){const m=a.match(/(\d+(?:[.,]\d+)?)\s*(?:stück|äpfel|apfel)/i);add('fruit',m?Number(m[1].replace(',','.')):g!==null?g/182:1,'Apfel',sourceId);}
  else if(id==='banana'){const m=a.match(/(\d+(?:[.,]\d+)?)\s*(?:stück|bananen?)/i);add('fruit',m?Number(m[1].replace(',','.')):g!==null?g/120:1,'Banane',sourceId);}
  else if(id==='dried-mango')add('fruit',(g??40)/40,'Getrocknete Mango',sourceId);
  else if(id==='krautsalat')add('cruciferous',(g??150)/150,'Krautsalat',sourceId);
  else if(id==='stangenbohnensalat')add('vegetables',(g??150)/150,'Stangenbohnensalat · grüne Bohnen',sourceId);
  else if(['peanuts','mixed-nuts','koro-pistachio-puree','koro-black-tahini','lyttos-pistachio-breakfast','lyttos-tahini-breakfast'].includes(id)){
    const specific=id.includes('lyttos')?Number(a.match(/(\d+(?:[.,]\d+)?)\s*g\s*(?:pistazienmus|tahini)/i)?.[1]?.replace(',','.')||15):null;
    const nut=specific??g??(id==='peanuts'?20:id==='mixed-nuts'?30:15);
    if(nut>0&&nut<=300){nutGrams+=nut;notes.nuts.push(`${custom.get(id)?.title||id}: ~${round(nut)} g`);sources.push({id:sourceId,category:'nuts',grams:round(nut),source:id});}
  } else if(wholegrainBreadEvidence(id,a,custom.get(id))){
    const serving=wholegrainBreadEvidence(id,a,custom.get(id));
    add('wholegrains',serving.servings,serving.source,sourceId);
  } else if(['water-glass','green-tea-chinese','tea-unsweetened','coffee','matcha','matcha-oat-plain','oat-latte'].includes(id)){
    // Matches the old 0.5.77.59.30 volume-based progression, but no implicit smoothies.
    add('beverages',(ml(a)??(id.startsWith('matcha')?500:id==='coffee'?200:250))/350,'Dokumentiertes Getränk',sourceId);
  } else {
   // Only explicitly named custom ingredient can be inferred; generic "Smoothie"
   // and arbitrary notes never award an undocumented portion.
   const f=custom.get(id),title=String(f?.title||'').toLocaleLowerCase('de');
   if(g!==null&&g>0){
    if(/^(?:blaubeer|heidelbeer)/.test(title))add('berries',g/75,'Eigene Blaubeeren',sourceId);
    else if(/^banane/.test(title))add('fruit',g/120,'Eigene Banane',sourceId);
    else if(/^(?:sesam|nussmisch|nussmix)/.test(title)){nutGrams+=g;notes.nuts.push(`${f.title}: ~${round(g)} g`);sources.push({id:sourceId,category:'nuts',grams:round(g),source:f.title});}
    else if(/^(?:kurkuma|zimt|ingwer)/.test(title)){spiceGrams+=g;notes.spices.push(`${f.title}: ~${round(g)} g`);sources.push({id:sourceId,category:'spices',grams:round(g),source:f.title});}
   }
  }
 }
 totals.nuts=nutGrams/30;totals.spices=Math.min(1,spiceGrams/1);
 // annotate grams separately: nut portions and anti-aging threshold intentionally differ
 return {totals,notes,nutGrams:round(nutGrams),spiceGrams:round(spiceGrams),sources,
  entries:entries.length,coverage:'Aus vorhandenen Tagebucheinträgen/Zutatenmengen; Rezept-Standardgewichte ggf. geschätzt; keine erfundenen Mahlzeiten.'};
}
