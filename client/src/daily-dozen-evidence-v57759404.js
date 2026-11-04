/** Compass .59.40.4: One read-only, ingredient-level evidence ledger for both
 * Daily Dozen presentations and Anti-Aging Eight. No inferred meals, GPS,
 * nutrition edits, network calls, or persistent duplicate counters.
 * Small portion estimates are explicitly approximate, not clinical targets.
 */
import {smoothieRecipe} from './nutrition-smart-smoothie-v57736.js';
import {PERSONAL_RECIPE_IDS,recipeSnapshot} from './personal-recipes-v57737.js';
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
   const title=String(e.menuSnapshot.title||custom.get(id)?.title||'').toLowerCase();
   const candidates=e.menuSnapshot.dailyDozenCandidateCategories||[];
   // Provisional partial serving from a *consumed* dish with clearly named vegetables.
   // No weight supplied => DO NOT assert a full serving.
   if(candidates.includes('vegetables')&&/ratatouille|gemüse|gemuese|vegetable/.test(title)){add('vegetables',0.5,'Mensa · Gemüseanteil im Gericht (vorläufig, Menge unbekannt)',sourceId);notes.vegetables.push('Mensa-Portion unbekannt: 0,5 vorläufiger Vergleichswert, bitte Gemüsemenge bestätigen.');}
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
   const by=Object.fromEntries(recipeSnapshot(id,e.recipe).map(x=>[x.id,validAmount(x.grams)?x.grams*factor:0]));
   if(id==='salad-personal'){
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
  } else if(['bio-kornbrot','dark-bread-butter','bread-cheese'].includes(id)){
    const pieces=Number(a.match(/(\d+(?:[.,]\d+)?)\s*(?:scheiben?|stück)/i)?.[1]?.replace(',','.')||1);
    // Only explicit verified wholegrain products; bread-cheese/dark-bread cannot prove wholegrain.
    if(id==='bio-kornbrot'&&custom.get(id)?.wholegrain===true)add('wholegrains',pieces,'Vollkornbrot (bestätigt)',sourceId);
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
