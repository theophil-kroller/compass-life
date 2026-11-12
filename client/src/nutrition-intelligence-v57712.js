import {ALPRO_PUDDING_PACKAGES,parseAlproPuddingPortion} from './alpro-pudding-serving-v059138.js';
import {HOFER_PRETZEL_BUTTER_ID,parseHoferPretzelButterPortion} from './hofer-pretzel-butter-serving-v059139.js';
/** Compass 0.5.77.12 — source-aware nutrition estimates. All sources are either
 * explicitly photographed product labels or marked estimates. No missing nutrient
 * value is interpreted as zero and no compound content is fabricated.
 * User food log remains within the encrypted nutritionJournal vault. */
import {nutritionEntries,nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';
import {MCT_C8_FOOD_ID,parseMctC8Serving} from './mct-c8-serving-v059123.js';
import {SKYR_PACKAGES,parseSkyrPortion} from './skyr-serving-v059133.js';
import {DR_GOERG_COCONUT_MILK_ID,COPAYA_RAW_COCOA_ID,parseCoconutMilkPortion,parseRawCocoaPortion} from './coconut-cocoa-serving-v059134.js';
import {DAILY_NRV,CAFFEINE_EFSA_ADULT_ORIENTATION_MG,GENERIC_MICRONUTRIENTS,APPLE_GENERIC_100G,BANANA_GENERIC_100G} from './nutrition-reference-v57722.js';
import {macroGoalView} from './macro-goals-v57723.js';
import {smoothieParts} from './nutrition-smart-smoothie-v57736.js';
import {PERSONAL_RECIPE_IDS,personalRecipeParts} from './personal-recipes-v57737.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const N={
 kcal:['Energie','kcal'],protein:['Eiweiß','g'],carbs:['Kohlenhydrate','g'],sugar:['davon Zucker','g'],fat:['Fett','g'],saturated:['gesättigte Fettsäuren','g'],fiber:['Ballaststoffe','g'],salt:['Salz','g'],sodium:['Natrium (aus Salz abgeleitet)','mg'],
 vitaminA:['Vitamin A','µg RAE'],vitaminC:['Vitamin C','mg'],vitaminD:['Vitamin D','µg'],vitaminE:['Vitamin E','mg'],vitaminK:['Vitamin K (K1/K2)','µg'],
 vitaminB1:['Vitamin B1','mg'],vitaminB2:['Vitamin B2','mg'],niacin:['Vitamin B3 / Niacin','mg'],vitaminB6:['Vitamin B6','mg'],folate:['Folat','µg DFE'],vitaminB12:['Vitamin B12','µg'],biotin:['Biotin / B7','µg'],pantothenicAcid:['Pantothensäure / B5','mg'],
 calcium:['Calcium','mg'],phosphorus:['Phosphor','mg'],iron:['Eisen','mg'],iodine:['Jod','µg'],magnesium:['Magnesium','mg'],zinc:['Zink','mg'],selenium:['Selen','µg'],copper:['Kupfer','mg'],manganese:['Mangan','mg'],chromium:['Chrom','µg'],molybdenum:['Molybdän','µg'],potassium:['Kalium','mg'],choline:['Cholin','mg'],boron:['Bor','mg']
};
const MACRO_ICONS=Object.freeze({kcal:'⚡',protein:'🥚',carbs:'🌾',sugar:'🍬',fat:'🥑',saturated:'🧈',fiber:'🌿',salt:'🧂',sodium:'🧂'});
const MICRO_ICONS=Object.freeze({vitaminA:'👁️',vitaminC:'🍊',vitaminD:'☀️',vitaminE:'🌻',vitaminK:'🥬',vitaminB1:'🌾',vitaminB2:'🥛',niacin:'✨',vitaminB6:'🌰',folate:'🥦',vitaminB12:'🧬',biotin:'🌱',pantothenicAcid:'⚙️',calcium:'🦴',phosphorus:'🧬',iron:'🩸',iodine:'🌊',magnesium:'💪',zinc:'🛡️',selenium:'🔬',copper:'🪙',manganese:'🪨',chromium:'⚖️',molybdenum:'🔹',potassium:'🍌',choline:'🥚',boron:'🌿'});
const BIOACTIVE_ICONS=Object.freeze({EGC:'🍵',EGCG:'🍃',caffeine:'☕',lTheanine:'🌿',tribulus:'🌱',saponins:'🍃',arginineHcl:'🧪',arginine:'🧬',maca:'🌱',pomegranate:'🍎',ellagic:'🫐',eleuthero:'🌿',eleutherosides:'🍃',maleBlend:'🌱',organicBlend:'🥬',enzymeBlend:'⚗️'});

export const NUTRIENT_LABELS=N;
const profile=(name,amount,unit,values,source='Etikett',extra={},note='')=>({name,reference:{amount,unit},nutrients:values,source,extra,note,estimatedNutrients:[]});
const LABELLED={
 'hofer-backbox-laugenbreze-estimate':profile('HOFER BACKBOX Laugenbreze (unbestätigte Referenz)',100,'g',{kcal:314,protein:8.5,carbs:56.7,fat:5.2,salt:1.75},'FDDB-Community-Datenbank · unbestätigter HOFER-Richtwert, nicht Herstelleretikett',{},'95 g pro Stück ist eine Annahme; unbekannt: Zucker, Ballaststoffe, gesättigte Fettsäuren, Vitamine und Mineralstoffe. Kein belegtes Vollkorngebäck.'),
 // Original macro declarations per stated reference unit; any other metrics are explicit generic estimates.
 'dr-goerg-organic-coconut-milk-200ml':profile('Dr. Goerg Bio-Kokosmilch · 100 % Kokos',100,'ml',{kcal:186,protein:2.1,carbs:5.8,sugar:3,fat:17,saturated:14,salt:.05,calcium:16,magnesium:30,phosphorus:90,potassium:220,iron:1.3,zinc:.6,copper:.2,manganese:.6},'Originaletikett · Nutzerfotos 07.11.2026; Mineralstoffwerte generisches Kokosmilchprofil',{},'Originalpackung 200 ml; 100 ml = 186 kcal, 17 g Fett und 14 g gesättigte Fettsäuren. Kokosmilch (100 %), kein Wasserzusatz. 100 ml = eine Portion; 1 Packung = 200 ml. Calcium/Magnesium/Phosphor/Kalium/Eisen/Zink/Kupfer/Mangan nur grobe Referenzschätzungen; alle Vitamine, Ballaststoffe und Fettsäure-Unterklassen mangels Markeanalytik unbekannt. Keine belegte Daily-Dozen-Nuss-/Samenportion. Anti-Aging Eight: kein automatisch belegtes Ziel. Hoher gesättigter Fettanteil für Fettqualitätsanalyse relevant.'),
 'copaya-organic-raw-cocoa-powder':profile('Copaya Bio-Rohkakao · Criollo, ungesüßt',100,'g',{kcal:330,protein:28.1,carbs:14,sugar:.3,fat:11,saturated:6.9,salt:.1,fiber:30,calcium:125,magnesium:500,phosphorus:730,potassium:1500,iron:14,zinc:6.8,copper:3.8,manganese:3.8},'Originaletikett · Nutzerfoto 07.11.2026; Ballaststoffe und Mineralstoffe generisches ungesüßtes Kakaopulver', {cocoaFlavanols:{label:'Kakao-Flavanole (Catechin, Epicatechin)',value:null,unit:'mg'},theobromine:{label:'Theobromin',value:null,unit:'mg'},caffeine:{label:'Koffein',value:null,unit:'mg'}},'Originaletikett: 330 kcal, 28,1 g Protein, 11 g Fett (6,9 g gesättigt), 14 g KH (0,3 g Zucker), 0,1 g Salz je 100 g. 1 gestrichener EL ≈ 6 g (geschätztes Pulvergewicht; individuelle Abweichungen). 1 EL ≈ 20 kcal. Ballaststoffe/Mineralstoffe sind generische Kakaopulver-Schätzungen, nicht markenspezifisch deklariert. Kakao-Flavanole, Koffein, Theobromin ohne belegte Mengen: unbekannt. Keine automatische Dr.-Greger-Gewürz-/Nuss-/Bohnenportion, keine Anti-Aging-Eight-Gutschrift. Auf fotografierter Packung ist ein MHD 01.04.2025 erkennbar.'),
 'alpro-plant-protein-vanilla-pudding-200g':profile('Alpro Plant Protein Pudding · Vanille',100,'g',{kcal:92,protein:10,carbs:7,sugar:4.9,fat:2.4,saturated:.5,fiber:1,salt:.34,vitaminD:.75,vitaminB2:.21,vitaminB12:.38,calcium:120},'Originaletikett · Nutzerfotos 09.11.2026',{},'Ein Becher 200 g = 184 kcal und 20 g Protein. Vitamin D als zugesetztes D2 deklariert, B2 und B12 sowie Calcium auf Etikett. Andere Mikronährstoffe (z. B. Eisen, Magnesium, Jod) und Bioaktivstoffe nicht quantifiziert, bleiben unbekannt. Sojabohnen (10 %) plus Sojaprotein ergeben keine bestätigte vollständige Greger-Hülsenfruchtportion. Anti-Aging Eight: Proteinprotokoll ohne Longevity-Gutschrift.'),
 'alpro-plant-protein-chocolate-pudding-200g':profile('Alpro Plant Protein Pudding · Schokolade',100,'g',{kcal:95,protein:10.2,carbs:6.7,sugar:4.9,fat:2.8,saturated:.8,fiber:1.7,salt:.34,vitaminD:.75,vitaminB2:.21,calcium:120},'Originaletikett · Nutzerfotos 09.11.2026',{},'Ein Becher 200 g = 190 kcal und 20,4 g Protein. Vitamin D als D2, Vitamin B2 und Calcium deklariert; Vitamin B12 ist auf dem fotografierten Schokoladenetikett nicht deklariert und bleibt unbekannt. Kakaomassemenge/Polyphenolgehalt unbekannt. Keine vollständige belegte Greger-Hülsenfrucht- oder Gewürzportion.'),
 // Skyr: label data stay distinct from estimated generic dairy micronutrients.
 'milsani-skyr-maracuja-150g':profile('Milsani Skyr Maracuja · 150 g',100,'g',{kcal:47,protein:8,carbs:5.5,sugar:3,fat:0.2,saturated:0.1,salt:0.10,sodium:40,calcium:120,phosphorus:195,potassium:150,magnesium:12,vitaminB2:0.24,vitaminB12:0.8},'Originaletikett · Nutzerfotos 07.11.2026; Mikronährstoffe aus generischem Skyr/Magerjoghurt-Profil',{},'1 Becher = 150 g ≈ 71 kcal und 12 g Protein. Das Etikett gibt Fett als <0,5 g/100 g an; 0,2 g/100 g ist lediglich ein vorsichtiger Rechenwert, KEIN deklariertes exaktes Gewicht. Natrium aus Salz rechnerisch abgeleitet. Calcium, Phosphor, Kalium, Magnesium, Vitamin B2 und B12 sind grobe, nicht produktspezifische Schätzungen. Ballaststoffe, Jod, Vitamin D und Pflanzenstoffe: nicht bestimmt. Milchprodukt; Maracuja-Zubereitung keine belegte Obstportion. Daily Dozen: 0. Anti-Aging Eight: Proteinaufnahme dokumentieren, keine kausale Langlebigkeitswirkung.'),
 'ehrmann-high-protein-skyr-natural-450g':profile('Ehrmann High Protein Skyr Natural · 450 g',100,'g',{kcal:51,protein:9,carbs:3.6,sugar:3.6,fat:0.1,saturated:0.07,salt:0.10,sodium:40,calcium:120,phosphorus:195,potassium:150,magnesium:12,vitaminB2:0.24,vitaminB12:0.8},'Originaletikett · Nutzerfotos 07.11.2026; Hersteller https://www.ehrmann.de/produkte/high-protein/sorten/natural-skyr-high-protein-450-g/; ergänzte generische Mikronährstoffe',{},'1 Becher = 450 g ≈ 230 kcal, 40,5 g Protein (Vorderseite auf 40 g gerundet). Natrium nur aus Salz rechnerisch abgeleitet. Calcium, Phosphor, Kalium, Magnesium, B2 und B12 sind grobe, nicht etikettierte Milchprodukt-Schätzungen. Ballaststoffe, Jod, Vitamin D: nicht bestimmt. Milchprodukt, keine Daily-Dozen-Pflanzenportion. Anti-Aging Eight dokumentiert Proteinaufnahme ohne Proteinrestriktions- oder Langlebigkeitsbehauptung.'),
 'braineffect-mct-c8-oil':profile('BRAINEFFECT MCT Oil C8 · >97 % C8 (Kokos)',100,'g',{kcal:900,protein:0,carbs:0,sugar:0,fat:100,saturated:100,fiber:0,salt:0},'BRAINEFFECT Herstellerdeklaration je 100 g · https://brain-effect.com/de-eu/products/rocket-c8-mct-oel',{},'Inhaltsstoff: MCT-Öl aus 100 % Kokosnüssen, >97 % Caprylsäure (C8) im MCT-Fettsäurespektrum. 1 EL = 15 ml ≈ 14 g Öl (Masseschätzung, kein Herstellergewicht). 1 EL ≈ 126 kcal und 14 g gesättigte Fettsäuren. Keine quantifizierten Vitamine/Mineralstoffe; fehlende Werte bleiben unbekannt. Keine Daily-Dozen- oder Anti-Aging-Eight-Portion. Kalorienfreies Fasten wird durch das Öl beendet. Hersteller empfiehlt bei Neueinstieg zunächst ½ EL zur Verträglichkeit.'),
 'zotter-labooko-himbeer-kokos':profile('Zotter Labooko · Himbeer-Kokos, vegan',100,'g',{kcal:586,protein:1.8,carbs:51,sugar:48,fat:41,saturated:26,salt:.09,sodium:36,potassium:130,magnesium:20,manganese:.25,fiber:2},'Zotter Originaletikett · Nutzerfoto 03.11.2026; Mikronährstoffe aus unsicheren Kokos-/Beeren-Proxys',{},'Originalpackung 2 × 35 g = 70 g. 1 Stück = 10 g nur als editierbare Portionsannahme. 35 % Kakaobutter, 15 % Kokospulver, 8 % gefriergetrocknete Himbeeren. Rohrohrzucker, Reisdrinkpulver, Kokosraspeln und Zitronenpulver. Kalium, Magnesium, Mangan und Ballaststoffe nur grob aus Kokos-/Himbeer-Zutatenprofilen geschätzt und NICHT Etikettwerte; Kakaobutter liefert kaum Kakao-Flavanole. Wegen der geringen Menge keine Daily-Dozen-Beerenportion.'),
 'organic-hemp-fruit-protein-bar-35g':profile('Schalk Mühle · Bio Hanfprotein-Fruchtriegel mit Dattel, Rosine, Feige, Maca & Zimt',100,'g',{kcal:410,protein:19,carbs:42,sugar:38,fat:18,saturated:9.9,salt:.02,sodium:8,magnesium:95,iron:2.1,zinc:1.5,potassium:470,calcium:65,fiber:7},'Originaletikett · Nutzerfoto 03.11.2026; Mineralstoffe/Ballaststoffe aus Zutatenprofilen geschätzt',{},'35 g je Riegel: 53 % Trockenfrüchte (Datteln, Rosinen, Feigen), 25 % Hanfproteinpulver, außerdem Kakaobutter, Kakaomasse, Maca und Zimt. Schätzwerte für Magnesium, Eisen, Zink, Kalium, Calcium und Ballaststoffe aus allgemeinen Zutatenprofilen; kein Laborwert und keine gesicherte exakte Rezeptur. Die 53 % Trockenfrüchte sind als anteilige, keine volle Daily-Dozen-Obstportion dokumentierbar; Maca/Zimt-Mengen und Polyphenole nicht beziffert.'),
 'apple-shortcrust-cake':profile('Apfelkuchen gedeckt (Mürbeteig), BLS-Richtwert',100,'g',{kcal:219,protein:3.7,carbs:27.4,sugar:13.2,fat:9.9,fiber:2.7},'Bundeslebensmittelschlüssel BLS 4.0 · D181300',{},'Referenz: gedeckter Apfelkuchen; Rezept und Stueckgewicht individuell. 125 g je Stueck vorläufig angenommen. https://blsdb.prod.se.ble.de/food?foodId=39276&token=F390-4MAJ-U01A-X731-F9F4-GPDE-810B-O4RY'),
 'water-glass':profile('Trinkwasser ungesüßt',100,'ml',{kcal:0,protein:0,carbs:0,sugar:0,fat:0,saturated:0,fiber:0,salt:0},'Trinkwasser ohne Zusätze',{},'Leitungswasser, stilles oder ungesüßtes Sprudelwasser. Mineralstoffgehalte abhängig von Quelle; nicht als Null interpretiert.'),
 'hofer-germknoedel':profile('HOFER Germknödel, Drittanbieter-Richtwert',187,'g',{kcal:496,protein:11.4,carbs:94.2,fat:7.3},'Drittanbieter-Ernährungsdatenbank · kein bestätigtes Herstelleretikett',{},'Portionsgröße ca. 187 g, grober Drittanbieterwert, ohne sicher zuordenbare Toppings/Sauce. Marke/Packung bitte gegen Etikett prüfen.'),
 'pizza-margherita':profile('Pizza Margherita (generischer Richtwert)',100,'g',{kcal:250,protein:11,carbs:31,sugar:3,fat:10,saturated:4,fiber:2,salt:1.2},'Grobe Rezeptschätzung',{},'Teig, Käse, Öl und Gewicht stark unterschiedlich; 300 g nur vorläufig.'),
 'krautsalat':profile('Krautsalat mit Dressing (generisch)',100,'g',{kcal:85,protein:1,carbs:9,sugar:6,fat:5,fiber:2,salt:.7},'Grobe Rezeptschätzung',{},'Öl, Zucker und Dressing unbekannt; ohne Dressing ggf. deutlich weniger.'),
 'stangenbohnensalat':profile('Stangenbohnensalat (generisch)',100,'g',{kcal:80,protein:2,carbs:7,sugar:2.5,fat:5,fiber:3,salt:.6},'Grobe Rezeptschätzung',{},'Öl und Dressing unbekannt.'),
 'champagne':profile('Champagner (generisch)',100,'ml',{kcal:75,carbs:2,sugar:1.5},'Grobe Schätzung',{},'Alkoholenergie in kcal enthalten; Restzucker und Alkoholgehalt je Cuvée unterschiedlich.'),
 'chocolate-cookie':profile('Chocolate Cookie (generisch)',100,'g',{kcal:490,protein:5,carbs:61,sugar:37,fat:25,saturated:13,fiber:3,salt:.5},'Grobe Rezeptschätzung',{},'Backrezept, Schokolade und Größe variieren.'),
 'whipped-cream':profile('Schlagsahne / Schlagobers',100,'g',{kcal:320,protein:2,carbs:3,sugar:3,fat:33,saturated:21},'Grobe Schätzung',{},'Ohne zugesetzten Zucker angenommen; Schlagsahne kann süßer sein.'),
 'milk-my-vay':profile('My Vay Barista Haferdrink · Hofer',100,'ml',{kcal:48,fat:2.3,saturated:.2,carbs:6.1,sugar:2.5,fiber:.2,protein:.6,salt:.11,calcium:120,vitaminB2:.21,vitaminD:1.1,vitaminB12:.38},'Etikett',{},'Angereichert mit Calcium, B2, B12 und D; Zucker aus Haferfermentation.'),
 'monin-caramel':profile('Monin Salted Caramel Sirup',100,'ml',{kcal:326,fat:0,saturated:0,carbs:80.3,sugar:80.3,protein:0,salt:1.01},'Etikett',{},'Kleiner Schuss: 10 ml geschätzt, nicht abgemessen.'),
 'mixed-nuts':profile('MorgenLand Bio Kerniger Nuss Mix',100,'g',{kcal:649,fat:58,saturated:7.1,carbs:12,sugar:4.2,fiber:6.9,protein:17,salt:.02},'Etikett',{},'1 Handvoll = 30 g (vom Nutzer gewogen). Paranüsse: Selen enthalten, Menge unbekannt.'),
 'dried-mango':profile('SPAR Vital Bio-Mangohälften',100,'g',{kcal:298,fat:2.2,saturated:.5,carbs:62,sugar:60,fiber:8.2,protein:2.9},'Produktangabe',{},'Eine persönliche Portion = ganze Packung (200 g). Ohne Zuckerzusatz.'),
 'rice-pudding':profile('S-BUDGET Milchreis Zimt · SPAR',100,'g',{kcal:113,carbs:20,sugar:12,protein:2.8,fat:2.4,salt:.27},'Produktangabe',{},'1 Becher = 200 g; Ballaststoffwert <0,5 g/100 g wird nicht als exakter Messwert geführt.'),
 'spar-bio-flaxseed':profile('SPAR Natur*pur Bio-Leinsamen (ganz)',100,'g',{kcal:533,protein:20,carbs:3.3,sugar:1.1,fat:43,saturated:4.8,fiber:27,salt:.15},'Verpackungsfoto 2026-10-27',{ALA:{label:'Alpha-Linolensäure (pflanzliches Omega-3)',value:19970,unit:'mg',mode:'estimate'},SDG:{label:'Lignane (SDG/SECO)',value:null,unit:'mg',note:'Enthalten, stark sortenabhängig; keine produktspezifische Analyse'}},'1 TL = ca. 3 g (Schätzung). Auf der Packung: NUR KOCHEN UND BACKEN, nicht roh essen. Whole seeds are not equivalent to ground flaxseed for Dr. Greger. ALA from BfR generic table.'),
 'sbudget-topfencreme-vanilla':profile('S-BUDGET Topfencreme Vanille',100,'g',{kcal:99,protein:5.8,carbs:15,sugar:14,fat:2,saturated:1.3,fiber:0,salt:.09},'Verpackungsfoto / SPAR-Produktdaten',{vanillaPhenolics:{label:'Vanille-Phenole',value:null,unit:'mg',note:'Nicht analysiert; aus Vanillearoma kein Antioxidantienwert ableitbar'}},'Becher 180 g. 42 % Magertopfen, 30 % Magerjoghurt, 11 % Rahm, Zucker, Vanille. Milchprodukt, kein Daily-Dozen-Pflanzenpunkt.'),
 'happy-harvest-steinofen-kornspitz':profile('Happy Harvest Steinofen-Kornspitz · HOFER',100,'g',{kcal:290,fat:3.7,saturated:0.5,carbs:49,sugar:2,protein:11,salt:1.2},'Eigenes Verpackungsfoto 2026-11-01 · Werte je 100 g',{allergens:{label:'Allergene',value:null,unit:'',note:'Enthält Weizen, Roggen, Gerste (Gluten), Soja und Sesam. Kann Spuren von Lupinen, Milch und Schalenfrüchten enthalten.'}},'Zutaten laut Etikett: Weizenmehl, Wasser, Leinsamen, Weizenschrot, Roggenschrot, Weizenkleie, Hefe, Sesam, Sojaschrot, Weizenmalzschrot, Roggensauerteig getrocknet, Sojamehl, getoastetes Mehl (Roggen, Weizen), Speisesalz, Weizeneiweiß, Weizenmalzmehl, Gerstenmalzmehl, Zucker, Dextrose, Gewürze, Weizengrieß. Ballaststoffe nicht ausgewiesen. 1 Stück = 75 g aus HOFER-Packung mit 300 g und vier Stück; durchschnittliches Rohgewicht, nach dem Fertigbacken mögliches Feuchtigkeitsgewicht abweichend. Kein automatischer Daily-Dozen-Vollkornnachweis.'),
 'kitkat-chunky-peanut-butter':profile('KitKat Chunky Peanut Butter · 42 g',42,'g',{kcal:222,fat:12.7,saturated:6.4,carbs:21.9,sugar:18.1,fiber:1.2,protein:4.5,salt:.26},'KitKat (Nestlé), offizielle Produktseite',{allergens:{label:'Allergene',value:null,unit:'',note:'Erdnüsse, Milch und Weizen; kann andere Nüsse enthalten'}},'Herstellerangabe pro 42-g-Riegel: https://www.kitkat.de/produkt/kitkat-chunky-peanut-butter . Nationale Rezepturen und Packungsgrößen können abweichen; Etikett prüfen.'),
 'pistachio-butter-cups':profile('Better Pistachio Butter Cups',13,'g',{kcal:80,fat:6.1,saturated:2.2,carbs:4.8,sugar:3.9,fiber:.5,protein:1.2,salt:.05},'Etikett',{},'3 Stück à 13 g, insgesamt 39 g. Etikettwerte pro Cup gerundet.'),
 'cheddar':profile('SPAR Würziger Cheddar, in Scheiben',100,'g',{kcal:415,fat:35,saturated:22,protein:25,salt:1.7},'Etikett',{},'Kohlenhydrate und Zucker jeweils <0,5 g/100 g; nicht exakt null. Scheibengewicht vorläufig 25 g.'),
 'cheddar-hofer':profile('Hofer BBQ Burgerscheiben Cheddar',100,'g',{kcal:390,fat:32,saturated:21,protein:25,salt:1.9},'Etikett',{},'Extra dicke Scheibe = 33 g laut Verpackung. Kohlenhydrate <0,5 g/100 g.'),
 'bio-kornbrot':profile('Zurück zum Ursprung Bio Nur-Kornbrot',100,'g',{kcal:268,fat:12.2,saturated:1.6,carbs:26.2,sugar:2.5,fiber:8.1,protein:9.3,salt:1},'Etikett',{},'Eine Brotscheibe mit 50 g nur als vorläufige Menge; individuell abwiegbar.'),
 'butter-hofer':profile('Hofer Bio-Butter',100,'g',{kcal:740,fat:82,saturated:52,carbs:.6,sugar:.6,protein:.7,salt:.02},'Schätzung',{},'Marke bekannt, genaue Etikettwerte nicht vorliegend; 10 g pro bestrichener Scheibe geschätzt.'),
 'peanuts':profile('Hofer gesalzene Erdnüsse',100,'g',{kcal:610,protein:25,fat:50,saturated:7,carbs:10,sugar:5,fiber:8,salt:1},'Schätzung',{},'30 g pro Handvoll vorläufig; konkrete Packung und Portionsgewicht noch nicht bestätigt.'),
 'matcha-powder':profile('MatchaTherapy 30+ BIO Matchapulver',1,'g',{kcal:3.5},'MatchaTherapy Hersteller (Mindestgehalte)',{
   EGC:{label:'Epigallocatechin (EGC)',value:15,unit:'mg',mode:'minimum'},
   EGCG:{label:'Epigallocatechingallat (EGCG)',value:30,unit:'mg',mode:'minimum'},
   EC:{label:'Epicatechin (EC)',value:6,unit:'mg',mode:'minimum'},
   catechin:{label:'Catechin',value:2,unit:'mg',mode:'minimum'},
   caffeine:{label:'Koffein',value:28,unit:'mg',mode:'minimum'},
   lTheanine:{label:'L-Theanin',value:null,unit:'mg',note:'Keine quantifizierte Herstellerangabe'}
 },'Bestätigte Sorte 30+. 1 TL ≈ 2 g Pulver geschätzt; Gehalte sind Mindestwerte (mg/g), keine exakten Analysedurchschnitte. Quelle: https://matchatherapy.com/de-at'),
 'lyttos-greek-natur':profile('Lyttos Greek Style Natur · Hofer',100,'g',{kcal:115,protein:3.33,fat:9.4,saturated:6.33,carbs:3.53,sugar:3.53},'Vorläufiges generisches Drittanbieterprofil; Etikett prüfen',{},'150 g ca. 173 kcal.'),
 'koro-pistachio-puree':profile('KoRo Bio Pistazienmus pur',100,'g',{kcal:658,fat:56,saturated:6,carbs:12,sugar:5,fiber:6,protein:22,salt:0},'KoRo Hersteller, MUS_060',{},'Esslöffel mit 15 g angenommen.'),
 'koro-black-tahini':profile('KoRo Schwarzes Bio Tahin',100,'g',{kcal:616,fat:52,saturated:7.4,carbs:12,sugar:0,fiber:12,protein:19,salt:0.03},'KoRo Hersteller, MUS_037',{},'Esslöffel mit 15 g angenommen.'),
 'honey':profile('Honig, 1 TL',7,'g',{kcal:21,carbs:5.7,sugar:5.7},'Schätzung',{},'Teelöffel ≈ 7 g; kein Markenetikett.'),
 'espresso':profile('Espresso · Richtwert 60 ml',1,'Portion',{kcal:2},'Schätzung / EFSA',{caffeine:{label:'Koffein',value:80,unit:'mg',mode:'estimate'}},'EFSA-Richtwert 80 mg je 60 ml Espresso; tatsächliche Shotgröße, Bohne und Zubereitung schwanken.'),
 'green-tea-chinese':profile('Chinesischer Grüntee · aufgebrüht, ohne Zucker',250,'ml',{kcal:2,fat:0,saturated:0,carbs:0,sugar:0,potassium:20,magnesium:2.5,manganese:.46,vitaminB2:.15},'Generischer Grüntee; USDA FDC 171917, NCBI Bookshelf',{caffeine:{label:'Koffein (Teein)',value:38,unit:'mg',mode:'estimate'},catechins:{label:'Catechine gesamt (50–100 mg/250 ml)',value:75,unit:'mg',mode:'estimate'}},'Generischer Grüntee, 250 ml Tasse; Mineralien und Koffein geschätzt, abhängig von Sorte und Ziehzeit.'),
 'coffee':profile('Filterkaffee · Richtwert 200 ml',200,'ml',{kcal:2},'Schätzung / EFSA',{caffeine:{label:'Koffein',value:90,unit:'mg',mode:'estimate'}},'EFSA-Richtwert 90 mg je 200 ml Filterkaffee; tatsächlicher Kaffee variiert.'),
 // The source is the non-40+ ONE for Men formula (NIH DSLD 332616, UPC 743715001398).
 // 40+ is a different supplement with different strengths: do not silently mix formulations.
 'profuel-alphaminos-bcaa':profile('PROFUEL Alphaminos BCAA · 13 g',13,'g',{kcal:35},'Historische Nutzerangabe zum Produkt, 26.10.2026',{
   bcaa:{label:'BCAA gesamt (isolierte Aminosäuren)',value:10000,unit:'mg'},
   leucine:{label:'L-Leucin',value:5000,unit:'mg',partOf:'bcaa'},
   isoleucine:{label:'L-Isoleucin',value:2500,unit:'mg',partOf:'bcaa'},
   valine:{label:'L-Valin',value:2500,unit:'mg',partOf:'bcaa'}
 },'35 kcal und 10 g BCAA je 13 g Portion laut früherer Erfassung. Die frei vorliegenden Aminosäuren werden NICHT als 10 g vollständiges Nahrungseiweiß verbucht. Andere Makro- und Mikronährstoffe sind unbekannt, nicht null. Kein Obst, keine Pflanzennahrungsmittel-Portion.'),
 'supplement-bluebonnet-one-men':profile('Bluebonnet ONE for Men · Whole Food-Based Multiple',1,'Kapseln',{
   vitaminA:1050,vitaminC:90,vitaminD:20,vitaminE:15,vitaminK:20,
   vitaminB1:1.2,vitaminB2:1.3,niacin:16,vitaminB6:1.7,folate:667,
   vitaminB12:2.4,biotin:30,pantothenicAcid:5,
   choline:5,calcium:50,iodine:150,magnesium:25,zinc:22,selenium:55,
   copper:0.9,manganese:2.3,chromium:35,molybdenum:45,potassium:5,boron:1
 },'NIH-Produktetikett (DSLD 332616)',{
   paba:{label:'PABA (Para-Aminobenzoesäure)',value:5,unit:'mg'},
   maleBlend:{label:'Advanced Male Health Blend – gesamt',value:100,unit:'mg'},
   nettle:{label:'Brennnesselwurzel-Extrakt',value:null,unit:'mg',partOf:'maleBlend'},
   pomegranate:{label:'Granatapfel-Fruchtextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   ginseng:{label:'Amerikanischer/Panax-Ginsengwurzel-Extrakt',value:null,unit:'mg',partOf:'maleBlend'},
   broccoliExtract:{label:'Brokkoli-Pflanzenextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   ashwagandha:{label:'Ashwagandha-Wurzelextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   pumpkin:{label:'Kürbiskernpulver',value:null,unit:'mg',partOf:'maleBlend'},
   rhodiola:{label:'Rosenwurz-Extrakt (Rhodiola)',value:null,unit:'mg',partOf:'maleBlend'},
   sawPalmetto:{label:'Sägepalmenbeeren-Extrakt',value:null,unit:'mg',partOf:'maleBlend'},
   turmeric:{label:'Kurkuma-Wurzelextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   organicBlend:{label:'Organic Whole Food Vegetable Blend – gesamt',value:5,unit:'mg'},
   barleyGrass:{label:'Bio-Gerstengras',value:null,unit:'mg',partOf:'organicBlend'},
   cabbage:{label:'Bio-Kohl',value:null,unit:'mg',partOf:'organicBlend'},
   parsley:{label:'Bio-Petersilie',value:null,unit:'mg',partOf:'organicBlend'},
   chlorella:{label:'Bio-Chlorella',value:null,unit:'mg',partOf:'organicBlend'},
   spirulina:{label:'Bio-Spirulina',value:null,unit:'mg',partOf:'organicBlend'},
   seaKelp:{label:'Bio-Meeresalgen (Kelp)',value:null,unit:'mg',partOf:'organicBlend'},
   kale:{label:'Bio-Grünkohl',value:null,unit:'mg',partOf:'organicBlend'},
   broccoli:{label:'Bio-Brokkoli',value:null,unit:'mg',partOf:'organicBlend'},
   dandelion:{label:'Bio-Löwenzahnblatt',value:null,unit:'mg',partOf:'organicBlend'},
   broccoliSprout:{label:'Bio-Brokkolisprossen',value:null,unit:'mg',partOf:'organicBlend'},
   dulse:{label:'Bio-Dulse-Algen',value:null,unit:'mg',partOf:'organicBlend'},
   enzymeBlend:{label:'Plant Source Digestive Enzyme Blend – gesamt',value:5,unit:'mg'},
   bromelain:{label:'Bromelain (Ananas)',value:null,unit:'mg',partOf:'enzymeBlend'},
   papain:{label:'Papain (Papaya)',value:null,unit:'mg',partOf:'enzymeBlend'},
   amylase:{label:'Amylase',value:null,unit:'mg',partOf:'enzymeBlend'},
   cellulase:{label:'Cellulase',value:null,unit:'mg',partOf:'enzymeBlend'},
   glucoamylase:{label:'Glucoamylase',value:null,unit:'mg',partOf:'enzymeBlend'},
   lipase:{label:'Lipase',value:null,unit:'mg',partOf:'enzymeBlend'},
   protease:{label:'Protease',value:null,unit:'mg',partOf:'enzymeBlend'}
 },'Offizielles Etikett: https://dsld.od.nih.gov/label/332616 · Formel ONE for Men OHNE 40+. 1 Kapsel pro Portion. Hersteller nennt das Präparat eisenfrei. Einzelmengen innerhalb der Pflanzen-/Enzymmischungen sind nicht ausgewiesen. Keine automatische tägliche Einnahme.'),
 'supplement-fuerstenmed':profile('FürstenMED Kombinationspräparat',4,'Kapseln',{vitaminC:130,zinc:10,selenium:50,vitaminE:22.5},'Etikett',{
   tribulus:{label:'Tribulus-terrestris-Extrakt',value:840,unit:'mg'},
   saponins:{label:'davon Saponine',value:798,unit:'mg',partOf:'tribulus'},
   arginineHcl:{label:'L-Argininhydrochlorid',value:760,unit:'mg'},
   arginine:{label:'davon L-Arginin',value:630,unit:'mg',partOf:'arginineHcl'},
   maca:{label:'Macapulver',value:400,unit:'mg'},
   pomegranate:{label:'Granatapfelextrakt',value:200,unit:'mg'},
   ellagic:{label:'davon Ellagsäure',value:80,unit:'mg',partOf:'pomegranate'},
   eleuthero:{label:'Sibirischer Ginseng-Extrakt',value:300,unit:'mg'},
   eleutherosides:{label:'davon Eleutheroside',value:12,unit:'mg',partOf:'eleuthero'},
   lecithin:{label:'Lecithin',value:76,unit:'mg'}
 },'Alle Mengen gelten für 4 Kapseln. Niacin und Vitamin D3 auf Foto nicht sicher lesbar und deshalb NICHT quantifiziert. Supplement-Einnahme wird nur beim ausdrücklich erfassten Eintrag gezählt.')
};
// Append generic food-composition estimates WITHOUT overwriting user-photographed labels.
for(const [id,micros] of Object.entries(GENERIC_MICRONUTRIENTS)){
 const original=LABELLED[id];if(!original)continue;
 const keys=Object.keys(micros).filter(k=>!Object.hasOwn(original.nutrients,k));
 original.nutrients={...original.nutrients,...Object.fromEntries(keys.map(k=>[k,micros[k]]))};
 original.estimatedNutrients=keys;
 original.note+=' Ergänzende Mikronährstoffe: Referenzdaten ähnlicher Lebensmittel, nicht Herstelleretikett.'+(id==='mixed-nuts'?' Die Anteile außerhalb der 30 % Cashews und 10 % Paranüsse sind geschätzt; Selen wird wegen extremer Schwankungen von Paranüssen nicht beziffert.':'');
}
LABELLED.banana=profile('Banane, roh ohne Schale',100,'g',BANANA_GENERIC_100G,'USDA FoodData Central 173944 (Durchschnitt)',{},'Eine mittelgroße Banane ≈ 120 g essbarer Anteil. Sorten, Reife und Größe variieren.');
LABELLED.banana.estimatedNutrients=Object.keys(BANANA_GENERIC_100G);
LABELLED.apple=profile('Apfel mit Schale · Referenzportion 100 g',100,'g',APPLE_GENERIC_100G,'USDA FDC 171688 (Durchschnitt)',{},'1 mittelgroßer Apfel ≈ 182 g essbarer Anteil; Vitamin C ≈ 8,4 mg. Sorten, Lagerung und Größe variieren.');
LABELLED.apple.estimatedNutrients=Object.keys(APPLE_GENERIC_100G);
LABELLED['apple-shortcrust-cake'].estimatedNutrients=['kcal','protein','carbs','sugar','fat','fiber'];
LABELLED['matcha-powder'].estimatedNutrients=['kcal'];
LABELLED.espresso.estimatedNutrients=['kcal'];
LABELLED.coffee.estimatedNutrients=['kcal'];
LABELLED['green-tea-chinese'].estimatedNutrients=['kcal','potassium','magnesium','manganese','vitaminB2'];
LABELLED['organic-hemp-fruit-protein-bar-35g'].estimatedNutrients=['magnesium','iron','zinc','potassium','calcium','fiber','sodium'];
LABELLED['zotter-labooko-himbeer-kokos'].estimatedNutrients=['potassium','magnesium','manganese','fiber','sodium'];
const SKYR_ESTIMATES=['sodium','calcium','phosphorus','potassium','magnesium','vitaminB2','vitaminB12'];
LABELLED['milsani-skyr-maracuja-150g'].estimatedNutrients=[...SKYR_ESTIMATES,'fat'];
LABELLED['ehrmann-high-protein-skyr-natural-450g'].estimatedNutrients=[...SKYR_ESTIMATES];
LABELLED[DR_GOERG_COCONUT_MILK_ID].estimatedNutrients=['calcium','magnesium','phosphorus','potassium','iron','zinc','copper','manganese'];
LABELLED[COPAYA_RAW_COCOA_ID].estimatedNutrients=['fiber','calcium','magnesium','phosphorus','potassium','iron','zinc','copper','manganese'];
export const PRODUCT_PROFILES=Object.freeze(LABELLED);
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const amountNumber=x=>Number(String(x).replace(',','.'));
function quantityFor(entry,food){
 const a=String(entry?.amount||food?.defaultAmount||'').toLowerCase();
 if(entry?.foodId===DR_GOERG_COCONUT_MILK_ID){const portion=parseCoconutMilkPortion(entry.amount,food?.defaultAmount);return portion?{value:portion.value,unit:'ml'}:null;}
 if(entry?.foodId===COPAYA_RAW_COCOA_ID){const portion=parseRawCocoaPortion(entry.amount,food?.defaultAmount);return portion?{value:portion.value,unit:'g'}:null;}
 if(ALPRO_PUDDING_PACKAGES[entry?.foodId]){const portion=parseAlproPuddingPortion(entry.foodId,entry.amount,food?.defaultAmount);return portion?{value:portion.grams,unit:'g'}:null;}
 if(SKYR_PACKAGES[entry?.foodId]){const portion=parseSkyrPortion(entry.foodId,entry.amount,food?.defaultAmount);return portion?{value:portion.grams,unit:'g'}:null;} 
 if(entry.foodId==='happy-harvest-steinofen-kornspitz'){
  const grams=a.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gramm)\b/i);
  const pieces=a.match(/(\d+(?:[.,]\d+)?)\s*(?:stück(?:e)?|stueck(?:e)?)\b/i);
  return {value:grams?amountNumber(grams[1]):pieces?amountNumber(pieces[1])*75:75,unit:'g'};
 }
 if(entry.foodId==='zotter-labooko-himbeer-kokos'||entry.foodId==='organic-hemp-fruit-protein-bar-35g'){
  const match=a.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
  const count=a.match(/(\d+(?:[.,]\d+)?)\s*(?:st[üu]ck(?:e)?|riegel|tafeln?)\b/i);
  const grams=count?amountNumber(count[1])*(entry.foodId==='zotter-labooko-himbeer-kokos'&&/tafel/i.test(count[0])?35:entry.foodId==='zotter-labooko-himbeer-kokos'?10:35):match?amountNumber(match[1]):entry.foodId==='zotter-labooko-himbeer-kokos'?10:35;
  return {value:grams,unit:'g'};
 }
 if(entry.foodId===MCT_C8_FOOD_ID){
  const dose=parseMctC8Serving(entry?.amount,food?.defaultAmount);
  return dose?{value:dose.grams,unit:'g'}:null;
 }
 if(entry.foodId==='banana'){const pcs=a.match(/(\d+(?:[.,]\d+)?)\s*(?:stück(?:e)?|bananen?)\b/i);const grams=a.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);return {value:pcs?amountNumber(pcs[1])*120:grams?amountNumber(grams[1]):120,unit:'g'};}
 if(entry.foodId==='apple'&&!/(?:\d+(?:[.,]\d+)?\s*(?:g|gramm)\b)/i.test(a)){const m=a.match(/(\d+(?:[.,]\d+)?)\s*(?:stücke?|äpfel)/i);return {value:(m?amountNumber(m[1]):1)*182,unit:'g'};}
 if(entry.foodId==='coffee'&&!/\d+(?:[.,]\d+)?\s*ml/i.test(a))return {value:200,unit:'ml'};
 if(entry.foodId==='apple-shortcrust-cake'){
  const grams=a.match(/(\d+(?:[.,]\d+)?)\s*g\b/);if(grams)return {value:amountNumber(grams[1]),unit:'g'};
  const pieces=a.match(/(\d+(?:[.,]\d+)?)\s*(?:stück(?:e)?|stueck(?:e)?)\b/);
  if(pieces)return {value:amountNumber(pieces[1])*125,unit:'g'};
 }
 if(entry.foodId==='water-glass'){
  const milliliters=a.match(/(\d+(?:[.,]\d+)?)\s*ml\b/);if(milliliters)return {value:amountNumber(milliliters[1]),unit:'ml'};
  const liters=a.match(/(\d+(?:[.,]\d+)?)\s*l(?:iter)?\b/);if(liters)return {value:amountNumber(liters[1])*1000,unit:'ml'};
  const glasses=a.match(/(\d+(?:[.,]\d+)?)\s*(?:glas|gläser|glaeser)\b/);if(glasses)return {value:amountNumber(glasses[1])*250,unit:'ml'};
 }
 if(entry.foodId==='spar-bio-flaxseed'&&!/\d+(?:[.,]\d+)?\s*g\b/i.test(a)){const x=a.match(/(\d+(?:[.,]\d+)?)\s*(?:tl|teelöffel)\b/);if(x)return {value:amountNumber(x[1])*3,unit:'g'};}
 if(entry.foodId==='sbudget-topfencreme-vanilla'&&!/\d+(?:[.,]\d+)?\s*g\b/i.test(a)){const x=a.match(/(\d+(?:[.,]\d+)?)\s*becher\b/);if(x)return {value:amountNumber(x[1])*180,unit:'g'};}
 if(entry.foodId==='matcha-powder'&&!/\d+(?:[.,]\d+)?\s*(?:g|gramm)\b/i.test(a)){const m=a.match(/(\d+(?:[.,]\d+)?)\s*(?:tl|teelöffel)\b/i);if(m)return {value:amountNumber(m[1])*2,unit:'g'};}
 const match=a.match(/(\d+(?:[.,]\d+)?)\s*(g|gramm|ml|kapseln?|scheiben?|stücke?|cups?)(?!\w)/i);
 if(match){const val=amountNumber(match[1]),unit=match[2];if(unit.startsWith('kapsel'))return {value:val,unit:'Kapseln'};
 if(unit.startsWith('scheib'))return {value:val*(entry.foodId==='cheddar-hofer'?33:entry.foodId==='cheddar'?25:50),unit:'g'};
 if(unit.startsWith('stück')||unit.startsWith('cup'))return {value:val*13,unit:'g'};
 return {value:val,unit:unit==='gramm'?'g':unit};}
 if(/handvoll/.test(a)){const m=a.match(/(\d+(?:[.,]\d+)?)\s*handvoll/);return {value:(m?amountNumber(m[1]):1)*30,unit:'g'};}
 if(/packung|becher/.test(a)&&['dried-mango','rice-pudding'].includes(entry.foodId))return {value:200,unit:'g'};
 if(entry.foodId==='cheddar')return {value:25,unit:'g'};
 if(entry.foodId==='cheddar-hofer')return {value:33,unit:'g'};
 if(entry.foodId==='supplement-fuerstenmed'||entry.foodId==='supplement-bluebonnet-one-men')return {value:1,unit:'Kapseln'};
 return null;
}
function rescale(profile,amount,unit,part='product'){
 if(!profile||!Number.isFinite(amount)||amount<0||profile.reference.unit!==unit)return null;
 const factor=amount/profile.reference.amount;
 const values=Object.fromEntries(Object.entries(profile.nutrients).map(([k,v])=>[k,round(v*factor)]));
 return {values,amount,unit,source:profile.source,name:profile.name,part,estimatedKeys:profile.estimatedNutrients||[],extra:Object.entries(profile.extra).map(([key,v])=>({key,...v,value:v.value===null?null:round(v.value*factor)})),note:profile.note};
}
export function nutritionParts(foodId,amount='',food=null,recipe=null){
 if(foodId==='smoothie-personal')return smoothieParts(recipe);
 if(PERSONAL_RECIPE_IDS.includes(foodId))return personalRecipeParts(foodId,recipe,amount);
 // v0.5.77.23: locally persisted composite recipe per whole portion. Independent of
 // the built-in label catalog; all included values are explicitly marked estimated.
 if(food?.nutrients&&food?.nutrientBasis==='perPortion'){
  const match=String(amount||'').match(/^(\d+(?:[.,]\d+)?)\s*Portion/i);
  const portions=match?amountNumber(match[1]):1;
  if(!Number.isFinite(portions)||portions<=0||portions>20)return [];
  return [{name:food.title,part:'Mahlzeit-Rezept',source:food.source||'Generische Schätzung',amount:portions,unit:'Portion',values:Object.fromEntries(Object.entries(food.nutrients).filter(([,v])=>Number.isFinite(v)&&v>=0).map(([k,v])=>[k,round(v*portions)])),estimatedKeys:Object.keys(food.nutrients),extra:[],note:food.description||''}];
 }
 const source=food||{id:foodId,defaultAmount:''};
 if(foodId===HOFER_PRETZEL_BUTTER_ID){
  const portion=parseHoferPretzelButterPortion(amount,source.defaultAmount);
  if(!portion)return [];
  const piece=(id,qty,part)=>rescale(LABELLED[id],qty,'g',part);
  return [piece('hofer-backbox-laugenbreze-estimate',portion.pretzelGrams,'Laugenbreze'),...(portion.butterGrams>0?[piece('butter-hofer',portion.butterGrams,'Butter')]:[])].filter(Boolean);
 }
 const fake={foodId,amount};
 const value=quantityFor(fake,source);
 const piece=(id,qty,unit,part)=>rescale(LABELLED[id],qty,unit,part);
 if(foodId==='lyttos-pistachio-breakfast'||foodId==='lyttos-tahini-breakfast'){
  const a=String(amount||source.defaultAmount||'');
  const mass=(name,fallback)=>{const m=a.match(new RegExp('([0-9]+(?:[.,][0-9]+)?)\\s*g\\s*'+name+'\\b','i'));return m?amountNumber(m[1]):fallback;};
  const yogurt=mass('joghurt',150),honey=mass('honig',15),spread=mass(foodId==='lyttos-pistachio-breakfast'?'pistazienmus':'tahini',15);
  if(![yogurt,honey,spread].every(Number.isFinite)||[yogurt,honey,spread].some(x=>x<0)||yogurt>1000||honey>150||spread>150)return [];
  return [piece('lyttos-greek-natur',yogurt,'g','Joghurt'),piece('honey',honey,'g','Honig'),piece(foodId==='lyttos-pistachio-breakfast'?'koro-pistachio-puree':'koro-black-tahini',spread,'g','Nuss-/Sesammus')].filter(Boolean);
 }
 if(foodId==='chocolate-cookie-cream'){
  const entry=String(amount||source.defaultAmount||'');
  const grams=key=>{const match=entry.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*g\\s*'+key,'i'));return match?amountNumber(match[1]):null;};
  const cookie=grams('(?:cookie|keks)'),cream=grams('(?:schlagobers|sahne|schlagsahne)');
  if(!Number.isFinite(cookie)||!Number.isFinite(cream)||cookie<=0||cream<0||cookie>600||cream>300)return [];
  return [piece('chocolate-cookie',cookie,'g','Cookie'),...(cream>0?[piece('whipped-cream',cream,'g','Schlagsahne')]:[])].filter(Boolean);
 }
 if(foodId==='matcha'||foodId==='matcha-oat-plain'){
   const milk=String(amount||'').match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:hafermilch|haferdrink)/i);
   const ml=milk?amountNumber(milk[1]):75;
   const gMatch=String(amount||'').match(/(?:matcha(?:pulver)?|pulver)\s*[:=]?\s*(\d+(?:[.,]\d+)?)\s*g\b|(?:\d+(?:[.,]\d+)?)\s*g\s*(?:matcha|pulver)/i);
   const powdered=String(amount||'').match(/(\d+(?:[.,]\d+)?)\s*g\s*(?:matcha|pulver)/i);
   const matchaG=gMatch?(gMatch[1]?amountNumber(gMatch[1]):powdered?amountNumber(powdered[1]):2):2;
   return [piece('milk-my-vay',ml,'ml','Haferdrink'),piece('matcha-powder',matchaG,'g','Matchapulver'),...(foodId==='matcha'?[piece('honey',7,'g','Honig')]:[])].filter(Boolean);
 }
 if(foodId==='oat-latte'){
  const a=String(amount||''),milk=a.match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:hafermilch|haferdrink)/i),syrup=a.match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:sirup|monin)/i);
  return [piece('milk-my-vay',milk?amountNumber(milk[1]):200,'ml','Haferdrink'),piece('monin-caramel',syrup?amountNumber(syrup[1]):10,'ml','Karamellsirup'),piece('espresso',1,'Portion','Espresso')].filter(Boolean);
 }
 if(foodId==='dark-bread-butter'||foodId==='bread-cheese'){
  const a=String(amount||source.defaultAmount||'');
  const countMatch=a.match(/(\d+(?:[.,]\d+)?)\s*(?:scheiben?|stücke?)/i);
  const slices=countMatch?amountNumber(countMatch[1]):1;
  const breadMatch=a.match(/(\d+(?:[.,]\d+)?)\s*g(?=[^\d]*?(?:\+|$))/i);
  const butterMatch=a.match(/butter[^\d]*(\d+(?:[.,]\d+)?)\s*g/i);
  const breadG=breadMatch?amountNumber(breadMatch[1]):50*slices;
  const butterG=butterMatch?amountNumber(butterMatch[1]):10*slices;
  return [piece('bio-kornbrot',breadG,'g','Brot'),piece('butter-hofer',butterG,'g','Butter'),...(foodId==='bread-cheese'?[piece('cheddar',25*slices,'g','Cheddar')]:[])].filter(Boolean);
 }
 if(foodId==='espresso')return [piece('espresso',1,'Portion','Espresso')];
 if(foodId==='coffee')return [piece('coffee',value?.unit==='ml'?value.value:200,'ml','Filterkaffee')];
 if(foodId==='milk-my-vay'||foodId==='monin-caramel')return value?[piece(foodId,value.value,value.unit,'Produkt')].filter(Boolean):[];
 return value?[piece(foodId,value.value,value.unit,'Produkt')].filter(Boolean):[];
}
export function nutrientEntry(food,entry){
 const parts=nutritionParts(entry.foodId,entry.amount,food,entry.recipe),totals={},knownKeys=new Set();
 const sources=new Set(),partialKeys=new Set(),estimatedKeys=new Set();
 for(const p of parts){sources.add(p.source);for(const [k,v] of Object.entries(p.values)){totals[k]=round((totals[k]||0)+v);knownKeys.add(k);if(p.estimatedKeys?.includes(k))estimatedKeys.add(k);}}
 if(parts.length>1)for(const key of knownKeys)if(parts.some(p=>!Object.hasOwn(p.values,key)))partialKeys.add(key);
 if(!parts.length){const k=nutritionKcalEstimate(food,entry.amount,entry.recipe);if(k){totals.kcal=round((k.low+k.high)/2);knownKeys.add('kcal');sources.add('Grobe Schätzung');}}
 return {entry,food,parts,values:totals,knownKeys,partialKeys,estimatedKeys,sources:[...sources]};
}
const dateLocal=at=>{const d=new Date(at);return Number.isFinite(d.getTime())?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
export function nutritionDay(state,day){
 const foods=new Map(nutritionFoods(state).map(f=>[f.id,f]));
 const rows=nutritionEntries(state).filter(e=>dateLocal(e.at)===day).map(e=>nutrientEntry(foods.get(e.foodId)||e.foodSnapshot,e));
 const totals={},coverage={};for(const key of Object.keys(N))coverage[key]={known:0,unknown:0,partial:0,estimated:0};
 for(const r of rows)for(const key of Object.keys(N)){
   if(r.knownKeys.has(key)){coverage[key].known++;if(r.partialKeys.has(key))coverage[key].partial++;if(r.estimatedKeys.has(key))coverage[key].estimated++;totals[key]=round((totals[key]||0)+(r.values[key]||0));}
   else coverage[key].unknown++;
 }
 return {day,entries:rows,totals,coverage,complete:rows.length>0&&Object.values(coverage).every(x=>x.unknown===0)};
}
/** Compound quantities remain distinct from vitamins/minerals. Unknown is never zero. */
export function bioactiveFromEntries(entries=[]){
 const groups=new Map();
 for(const entry of entries)for(const part of entry.parts||[])for(const extra of part.extra||[]){
  const key=String(extra.key||'');if(!key)continue;
  const current=groups.get(key)||{key,label:extra.label||key,unit:extra.unit||'mg',known:0,unknown:0,value:0,partOf:extra.partOf||null,minimum:0,estimated:0,sources:new Set()};
  if(typeof extra.value==='number'&&Number.isFinite(extra.value)){current.value+=extra.value;current.known++;if(extra.mode==='minimum')current.minimum++;if(extra.mode==='estimate')current.estimated++;}
  else current.unknown++;
  current.sources.add(part.name);
  groups.set(key,current);
 }
 return [...groups.values()].map(item=>({...item,value:round(item.value),sources:[...item.sources]}));
}
export function bioactiveDay(state,day){return bioactiveFromEntries(nutritionDay(state,day).entries);}
function bioactiveSection(entries){
 const all=bioactiveFromEntries(entries);
 const teaKeys=['EGC','EGCG','EC','catechin','caffeine','lTheanine'];
 const tea=all.filter(x=>teaKeys.includes(x.key));
 const others=all.filter(x=>!teaKeys.includes(x.key));
 const line=x=>`<div class="ni712-row ni721-bioactive-row"><span class="ni712-nutrient-label"><span class="ni712-nutrient-icon" aria-hidden="true">${BIOACTIVE_ICONS[x.key]||'🧪'}</span>${esc(x.label)}</span><strong>${x.known?esc(`${x.estimated?'≈ ':x.minimum&&x.minimum===x.known?'≥ ':''}${pretty(x.value,x.unit)}`):'Nicht bestimmt'}</strong><small>${x.known?`${x.known} Mengenangabe(n)${x.minimum?' · Hersteller-Mindestwert':''}${x.estimated?' · Schätzung':''}${x.unknown?' · weitere Mengen unbekannt':''}`:'Im Produkt enthalten; keine verifizierte Mengenangabe'}${x.partOf?' · Bestandteil einer Mischung':''}</small></div>`;
 const available=all.length>0;
 return `<section class="ni712-panel ni721-bioactive"><h3>🍵 Bioaktive Stoffe & Supplement-Inhaltsstoffe</h3><p class="ni721-bioactive-intro">Koffein wird separat an einer EFSA-Sicherheitsorientierung gemessen (kein Ziel). Für Catechine gibt es keine offizielle empfohlene Tageszufuhr. Catechine wie <strong>EGC</strong> und <strong>EGCG</strong> sind keine Vitamine oder Mineralstoffe. Sie werden separat erfasst. Eine unbekannte Menge wird nie als 0 mg dargestellt.</p>${tea.length?`<div class="ni712-rows">${tea.map(line).join('')}</div>`:''}${(()=>{const caf=all.find(x=>x.key==='caffeine'&&x.known);if(!caf)return '';const pct=Math.round(caf.value/CAFFEINE_EFSA_ADULT_ORIENTATION_MG*100);return `<div class="ni722-caffeine"><strong>☕ Koffein: ${caf.estimated?'geschätzt / ':''}${caf.minimum?'mindestens ':''}${pretty(caf.value,'mg')}</strong><div class="ni722-track"><span style="width:${Math.min(100,pct)}%"></span></div><small>${pct} % von 400 mg · EFSA-Sicherheitsorientierung für gesunde Erwachsene, kein Tagesziel. Tatsächliche Menge kann abweichen.</small></div>`;})()}${others.length?`<details class="ni712-details"><summary>Weitere deklarierte Stoffe (${others.length})</summary><div class="ni712-rows">${others.map(line).join('')}</div></details>`:''}${!available?'<p class="muted-line">Heute keine Produkte mit hinterlegten bioaktiven Zusatzstoffen erfasst.</p>':''}</section>`;
}
const pretty=(n,unit)=>Number.isFinite(n)?`${n.toLocaleString('de-AT',{maximumFractionDigits:2})} ${unit}`:'–';
export function nutrientReferenceProgress(key,value){
 const n=DAILY_NRV[key];if(!Number.isFinite(n)||n<=0||!Number.isFinite(value))return null;
 const pct=Math.round(value/n*100);return {key,value,reference:n,pct};
}
function nutrientGauge(key,value,known){
 const p=known?nutrientReferenceProgress(key,value):null;if(!p)return '';
 const width=Math.max(0,Math.min(100,p.pct));
 return `<div class="ni722-reference" title="EU-Nährstoffreferenzwert für Erwachsene; kein individueller Tagesbedarf"><div class="ni722-track"><span style="width:${width}%"></span></div><span>${p.pct} % EU-NRV${p.pct>100?' · über Referenzwert':''}</span></div>`;
}

function section(title,keys,m,{icons=false}={}){return `<section class="ni712-panel"><h3>${esc(title)}</h3><div class="ni712-rows">${keys.map(key=>{
 const [label,unit]=N[key],cov=m.coverage[key],known=cov.known;
 const value=known?`${cov.estimated?'≈ ':''}${pretty(m.totals[key],unit)}`:'–';
 return `<div class="ni712-row"><span class="ni712-nutrient-label">${icons?`<span class="ni712-nutrient-icon" aria-hidden="true">${MACRO_ICONS[key]||MICRO_ICONS[key]||'◦'}</span>`:''}${esc(label)}</span><strong>${esc(value)}</strong><small>${known?`${known}/${m.entries.length} Einträge mit Wert${cov.unknown||cov.partial?' · teilweise unbekannt':''}${cov.estimated?' · teilweise geschätzt':''}`:'Nicht bestimmt'}</small>${nutrientGauge(key,m.totals[key],known)}</div>`;
 }).join('')}</div></section>`;}
export function nutritionIntelligenceView(state,{day=dateLocal(new Date()),detail=''}={}){
 const m=nutritionDay(state,day),entries=m.entries,labels=N,detailProfile=LABELLED[detail];
 const productList=['alpro-plant-protein-vanilla-pudding-200g','alpro-plant-protein-chocolate-pudding-200g','braineffect-mct-c8-oil','dr-goerg-organic-coconut-milk-200ml','copaya-organic-raw-cocoa-powder','milsani-skyr-maracuja-150g','ehrmann-high-protein-skyr-natural-450g','zotter-labooko-himbeer-kokos','organic-hemp-fruit-protein-bar-35g','banana','apple','profuel-alphaminos-bcaa','coffee','espresso','matcha-powder','milk-my-vay','monin-caramel','mixed-nuts','peanuts','dried-mango','rice-pudding','pistachio-butter-cups','kitkat-chunky-peanut-butter','cheddar','cheddar-hofer','bio-kornbrot','butter-hofer','supplement-bluebonnet-one-men','supplement-fuerstenmed'];
 const head=`<section class="work-card ni712-root"><div class="ni712-header"><div><small>COMPASS · NUTRITION INTELLIGENCE</small><h2>Makro & Mikro · Tagesanalyse</h2><p>Nur tatsächlich protokollierte Produkte und Rezepte. Fehlende Werte sind unbekannt, nicht null.</p></div><div class="ni712-day"><button type="button" data-action="ni712-day" data-id="prev" aria-label="Vortag">←</button><strong>${esc(new Date(day+'T12:00:00').toLocaleDateString('de-AT',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))}</strong><button type="button" data-action="ni712-day" data-id="next" aria-label="Folgetag">→</button><button type="button" data-action="ni712-day" data-id="today">Heute</button></div></div>
 <div class="ni712-kpis"><div><strong>${entries.length}</strong><small>Ernährungseinträge</small></div><div><strong>${m.coverage.kcal.known?pretty(m.totals.kcal,'kcal'):'–'}</strong><small>Erfasste Energie · Teilbilanz</small></div><div><strong>${m.coverage.protein.known?pretty(m.totals.protein,'g'):'–'}</strong><small>Bekanntes Eiweiß</small></div><div><strong>${m.coverage.fiber.known?pretty(m.totals.fiber,'g'):'–'}</strong><small>Bekannte Ballaststoffe</small></div></div>
 <p class="ni712-caveat">${entries.length?`${entries.length} Einträge · ${m.coverage.kcal.known} mit Energiewert · ${m.coverage.protein.unknown} ohne Proteindaten. Ein niedriger Wert zeigt keine Unterversorgung an.`:'Für diesen Tag sind noch keine Lebensmittel oder Nahrungsergänzungen protokolliert.'} Die Prozentbalken nutzen EU-NRV für allgemeine Erwachsene: weder persönlicher Bedarf noch sichere Obergrenze. Fehlende Lebensmittel und unvollständige Nährwerte können die Bilanz unterschätzen. Kein Nachweis eines Nährstoffmangels.</p>${macroGoalView(state,m.totals,m.coverage)}${m.coverage.salt.known?`<section class="ni712-panel meal723-salt"><h3>🧂 Salz · WHO-Orientierung</h3><strong>≈ ${pretty(m.totals.salt,'g')} (${Math.round(m.totals.salt/5*100)} % der Grenze von 5 g/Tag)</strong><div class="ni722-track"><span style="width:${Math.min(100,m.totals.salt/5*100)}%"></span></div><small>Keine Sollmenge, sondern eine Obergrenze für Erwachsene. Zugesetztes Salz in Mensagerichten bleibt unbekannt. ${m.coverage.salt.unknown} Einträge ohne Salzangabe.</small></section>`:''}
 <div class="ni712-grid">${section('Makronährstoffe',['kcal','protein','carbs','sugar','fat','saturated','fiber','salt'],m,{icons:true})}${section('Vitamine & Mineralstoffe',['sodium','vitaminA','vitaminC','vitaminD','vitaminE','vitaminK','vitaminB1','vitaminB2','niacin','vitaminB6','folate','vitaminB12','biotin','pantothenicAcid','calcium','phosphorus','iron','iodine','magnesium','zinc','selenium','copper','manganese','chromium','molybdenum','potassium','choline','boron'],m,{icons:true})}</div>${bioactiveSection(entries)}
 <details class="ni712-details"><summary>Welche Lebensmittel fließen ein? (${entries.length})</summary>${entries.length?`<div class="ni712-entry-list">${entries.map(x=>`<div><span><strong>${esc(x.food?.title||'Eigenes Lebensmittel')}</strong><small>${esc(x.entry.amount||'Menge unbekannt')}</small></span><span>${x.knownKeys.has('kcal')?esc(pretty(x.values.kcal,'kcal')):'kcal unbekannt'}<small>${esc(x.sources.join(' / ')||'Ohne Nährstoffprofil')}</small></span></div>`).join('')}</div>`:'<p>Keine Einträge vorhanden.</p>'}</details></section>`;
 const profiles=`<section class="work-card ni712-root"><h2>Produktwissen & Inhaltsstoffe</h2><p class="muted-line">Herstelleretiketten, Hersteller-Produktangaben und Schätzungen bleiben nachvollziehbar. Pflanzenstoffe und „davon“-Untergruppen werden nicht zu Vitamin- oder Makro-Summen addiert.</p><div class="ni712-product-list">${productList.map(id=>`<button type="button" data-action="ni712-profile" data-id="${esc(id)}" class="${id===detail?'active':''}">${esc(LABELLED[id].name)}</button>`).join('')}</div>${detailProfile?`<div class="ni712-profile"><h3>${esc(detailProfile.name)}</h3><p><strong>Daten:</strong> ${esc(detailProfile.source)} · je ${detailProfile.reference.amount} ${esc(detailProfile.reference.unit)}. ${esc(detailProfile.note)}</p><div class="ni712-profile-values">${Object.entries(detailProfile.nutrients).map(([k,v])=>`<div><span>${esc(labels[k]?.[0]||k)}${detailProfile.estimatedNutrients.includes(k)?' ≈':''}</span><strong>${esc(pretty(v,labels[k]?.[1]||''))}</strong></div>`).join('')}</div>${Object.keys(detailProfile.extra).length?`<h4>Zusätzliche Inhaltsstoffe (nicht zu summieren)</h4><div class="ni712-profile-values">${Object.values(detailProfile.extra).map(x=>`<div><span>${esc(x.label)}</span><strong>${x.value===null?'Menge unbekannt':esc(`${x.mode==='minimum'?'≥ ':x.mode==='estimate'?'≈ ':''}${pretty(x.value,x.unit)}`)}</strong></div>`).join('')}</div>`:''}</div>`:'<p class="muted-line">Produkt antippen, um Nährwerte und zusätzliche Inhaltsstoffe zu sehen.</p>'}</section>`;
 return head+profiles;
}
