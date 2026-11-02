/** Compass 0.5.77.37 · Personal recipes, individually adjustable gram portions.
 * Nutrition data are generic food-composition references, never a claimed Hofer-label analysis.
 * An unrecorded optional ingredient is initialized at 0g for this SPECIFIC recipe only.
 * No missing micronutrient or fatty acid is implicitly zero.
 */
const ing=(id,label,grams,values,source='USDA FoodData Central · generisches Lebensmittel',optional=false,labelVerified=false,estimatedKeys=[])=>Object.freeze({id,label,grams,values,source,optional,labelVerified,estimatedKeys});
const RAW=Object.freeze({
 'salad-personal':{name:'Mein großer grüner Salat',icon:'🥗',ingredients:[
  ing('lettuce','Grüner Blattsalat',150,{kcal:15,protein:1.36,carbs:2.87,fiber:1.3,fat:.15,potassium:194,folate:38,vitaminC:9.2,vitaminK:126}),
  ing('pumpkin-oil','Steirisches Kürbiskernöl',10,{kcal:884,fat:100,saturated:18,mono:34,poly:48},'Generisches Kürbiskernöl · grobe Fettsäureprofil-Schätzung, Sorte variiert'),
  ing('balsamic','Balsamicoessig',15,{kcal:88,carbs:17,sugar:15,potassium:112},'USDA · Balsamico, generisch'),
  ing('soy','Sojasauce',10,{kcal:53,protein:8.1,carbs:4.9,salt:14},'USDA · generische Sojasauce; Salzgehalt stark markenabhängig'),
  ing('cumin','Kreuzkümmelsamen / Kumin',1,{kcal:375,protein:17.8,carbs:44.2,fiber:10.5,fat:22.3,iron:66.4},'USDA · Kreuzkümmel, ganze Samen'),
  ing('coriander','Koriandersamen',1,{kcal:298,protein:12.4,carbs:55,fiber:41.9,fat:17.8},'USDA · Koriandersamen'),
  ing('sesame','Schwarzer Sesam · 1 Schöpfer',15,{kcal:573,protein:17.73,carbs:23.45,fiber:11.8,fat:49.67,saturated:6.96,calcium:975,magnesium:351,iron:14.55},'USDA · Sesam, generisch; schwarzer Sesam kann abweichen'),
  ing('carrot','Karotten · bis zu 2 Stück',0,{kcal:41,protein:.93,carbs:9.58,fiber:2.8,fat:.24,vitaminA:835,potassium:320},'USDA · Karotte roh',true),
  ing('pepper','Roter Spitzpaprika',0,{kcal:31,protein:1,carbs:6,fiber:2.1,fat:.3,vitaminC:127.7},'USDA · rote Paprika roh (keine Spitzpaprika-Markendaten)',true),
  ing('peanuts','Gesalzene Erdnüsse · 1 Handvoll',20,{kcal:610,protein:25,carbs:10,fiber:8,fat:50,saturated:7,salt:1},'Compass · generisches Referenzprofil Hofer-Erdnüsse, Markenwert noch unbestätigt'),
  ing('avocado','Avocado',0,{kcal:160,protein:2,carbs:8.53,fiber:6.7,fat:14.66,saturated:2.13,potassium:485},'USDA · Avocado roh',true)
 ]},
 'bean-salad-personal':{name:'Mein Käferbohnensalat',icon:'🫘',ingredients:[
  ing('beans','Hofer Käferbohnen · 1 Dose, abgetropft',240,{kcal:95,protein:6.5,carbs:14,fiber:6.5,fat:.6},'Vorläufiges GENERISCHES gekochtes Bohnenprofil, nicht Hofer-Packung; Abtropfgewicht schätzen statt behaupten'),
  ing('garlic','Knoblauchpulver',1,{kcal:331,protein:16.6,carbs:72.7,fiber:9,fat:.73},'USDA · Knoblauchpulver'),
  ing('oregano','Oreganopulver',1,{kcal:265,protein:9,carbs:68.9,fiber:42.5,fat:4.3},'USDA · Oregano getrocknet'),
  ing('pumpkin-oil','Steirisches Kürbiskernöl',12,{kcal:884,fat:100,saturated:18,mono:34,poly:48},'Generisches Kürbiskernöl · Fettsäuren grob geschätzt'),
  ing('balsamic','Balsamicoessig',15,{kcal:88,carbs:17,sugar:15},'USDA · Balsamico, generisch'),
  ing('salt','Salz',.5,{salt:100},'Zugesetztes Speisesalz; Salz aus der Bohnenkonserve separat unbekannt')
 ]},
 'crackers-feta-evening-personal':{name:'Mein Abendsnack · Cracker, Schafkäse, Kürbiskernöl, Miso & Basilikumpesto',icon:'🧀',ingredients:[
  ing('crackers','Cracker · halbe 180-g-Packung',90,{kcal:445,protein:9,carbs:66,sugar:4,fat:15,saturated:4,fiber:3,salt:1.7},'Generische Cracker-Schätzung je 100 g; Sorte und Etikett unbekannt'),
  ing('sheep-cheese','Schafkäse · halbe geschätzte 180-g-Packung',90,{kcal:265,protein:15.5,carbs:1.5,sugar:1,fat:21.5,saturated:15.5,salt:2.5,calcium:450,vitaminB12:1.7},'Generischer Schafkäse/Feta-Richtwert je 100 g; tatsächliche HOFER-Packungsgröße noch zu prüfen'),
  ing('pumpkin-oil','Kürbiskernöl · 1 EL',14,{kcal:884,fat:100,saturated:18,mono:34,poly:48},'1 EL Öl ≈ 14 g; generisches Kürbiskernöl, keine Markenanalyse'),
  ing('miso','Miso-Paste · 1 EL',15,{kcal:195,protein:12,carbs:26,sugar:5,fat:6,saturated:1,fiber:5,salt:11.2},'1 EL Miso ≈ 15 g; Salzgehalt variiert stark mit Sorte/Marke'),
  ing('basil-pesto','Basilikumpesto · 1 EL',15,{kcal:475,protein:5,carbs:6,sugar:2,fat:47,saturated:8,salt:2.5},'1 EL Pesto ≈ 15 g; Öl-/Käseanteil und Salz variieren stark')
 ]},
 'kitcheri-personal':{name:'Kitcheri · Mung Dal, Reis & Gemüse',icon:'🍛',ingredients:[
  ing('mung-dal','Gelbes Mung Dal · trocken',50,{kcal:347,protein:24,carbs:62.6,fiber:16.3,fat:1.2},'Generische getrocknete Mungbohnen; Portionsmenge vorläufig'),
  ing('basmati-rice','Basmatireis · trocken',45,{kcal:365,protein:7.1,carbs:80,fiber:1.3,fat:.7},'Generischer weißer Basmatireis; kein Vollkorn'),
  ing('carrot','Karotten',70,{kcal:41,protein:.93,carbs:9.6,fiber:2.8,fat:.2},'Generische Karotten'),
  ing('zucchini','Zucchini',70,{kcal:17,protein:1.2,carbs:3.1,fiber:1,fat:.3},'Generische Zucchini'),
  ing('oil','Ghee oder Pflanzenöl · geschätzt',8,{kcal:884,fat:100,saturated:35},'Schätzung für ein typisches Rezept; Ghee/Pflanzenöl stark unterschiedlich'),
  ing('ginger','Ingwer, frisch',5,{kcal:80,protein:1.8,carbs:17.8,fiber:2,fat:.75},'Generischer Ingwer'),
  ing('turmeric','Kurkuma, gemahlen',1,{kcal:312,protein:9.68,carbs:67.1,fiber:22.7,fat:3.25},'Generische Kurkuma'),
  ing('cumin','Kreuzkümmel, gemahlen',1,{kcal:375,protein:17.8,carbs:44.2,fiber:10.5,fat:22.3},'Generischer Kreuzkümmel')
 ]},
 'oven-potatoes-sesame-personal':{name:'Meine Ofenkartoffeln mit Olivenöl, schwarzem Sesam & Chili',icon:'🥔',ingredients:[
  // Amounts describe one *wide soup bowl*, not a weighed serving. Potato weight is
  // raw/unpeeled, before oven moisture loss; oil covers BOTH drizzle steps together.
  ing('potato-skin','Bio-Kartoffeln mit Schale · roh gewogen',300,{kcal:77,protein:2.05,carbs:17.5,sugar:.82,fat:.09,fiber:2.2,potassium:425,magnesium:23,vitaminB6:.3},'USDA/generische rohe Kartoffel mit Schale · Backverlust und Sorte unbekannt'),
  ing('olive-oil','Olivenöl · beide Übergüsse zusammen',20,{kcal:884,fat:100,saturated:13.8,mono:73,poly:10.5,vitaminE:14.35},'USDA/generisches Olivenöl; 20 g insgesamt geschätzt, nicht zweimal 20 g'),
  ing('black-sesame','Schwarzer Sesam',10,{kcal:573,protein:17.73,carbs:23.45,sugar:.3,fiber:11.8,fat:49.67,saturated:6.96,calcium:975,magnesium:351,iron:14.55},'USDA/generischer Sesam; schwarzer Sesam kann abweichen'),
  ing('chili-flakes','Chiliflocken',.5,{kcal:282,protein:12,carbs:50,fiber:28,fat:14},'Generische getrocknete Chiliflocken · Menge geschätzt'),
  ing('salt','Zugesetztes Salz',1,{kcal:0,salt:100},'Zugesetztes Speisesalz, ca. 1 g geschätzt; natürlicher Natriumgehalt separat nicht vollständig bekannt')
 ]},
 'homemade-poppy-cake-chocolate-personal':{name:'Mein selbstgebackener Mohnkuchen mit Schokolade',icon:'🍰',ingredients:[
  // One 7 × 6 × 4 cm piece is roughly 168 cm³; 140 g is an UNWEIGHED starting assumption.
  // Cake composition is unknown: the two generic proxy profiles do not imply a known baking recipe.
  ing('poppy-cake-base','Mohnkuchen · Kuchenbasis, geschätzt',125,{kcal:395,protein:6.5,carbs:37,sugar:22,fat:25,saturated:6,fiber:3.5,calcium:120,magnesium:65,iron:1.5,phosphorus:130,potassium:155},'Generischer Mohnkuchen-Rezeptproxy · keine Analyse dieses selbstgebackenen Kuchens; Mikros besonders unsicher'),
  ing('chocolate-topping','Schokolade/Glasur auf dem Kuchen · geschätzt',15,{kcal:530,protein:4,carbs:60,sugar:55,fat:32,saturated:17,fiber:3,magnesium:55,iron:1.5},'Generische Schokoglasur-Schätzung, Sorte und Kakaoanteil unbekannt; nicht als dunkle Schokolade vorausgesetzt')
 ]},
 'basmati-lentil-dal-broccoli-personal':{name:'Basmatireis mit Linsendal, Curry & Brokkoli',icon:'🍛',ingredients:[
  // Cooked weights: ~440 g total fits a shallow soup plate. Do not conflate dry and cooked quantities.
  ing('basmati-cooked','Weißer Basmatireis · gekocht, ohne Salz',170,{kcal:130,protein:2.69,carbs:28.17,sugar:.05,fat:.28,saturated:.077,fiber:.4,calcium:10,iron:.2,magnesium:12,phosphorus:43,potassium:35,zinc:.49,manganese:.47,selenium:7.5,vitaminB1:.02,vitaminB6:.093,folate:3},'USDA FDC 20445 · weißer gekochter Reis, nicht angereichert; Basmati nur angenähert'),
  ing('lentils-cooked','Linsendal · Linsenanteil, gekocht',160,{kcal:116,protein:9.02,carbs:20.13,sugar:1.8,fat:.38,saturated:.053,fiber:7.9,calcium:19,iron:3.33,magnesium:36,phosphorus:180,potassium:369,zinc:1.27,copper:.25,manganese:.494,vitaminB1:.169,vitaminB2:.073,vitaminB6:.178,folate:181},'USDA FoodData Central 172421 · gekochte Linsen; tatsächliche Sorte und Dal-Wasseranteil unbekannt'),
  ing('broccoli-cooked','Brokkoli · gekocht',100,{kcal:35,protein:2.38,carbs:7.18,sugar:1.39,fat:.41,saturated:.08,fiber:3.3,calcium:40,iron:.67,magnesium:21,phosphorus:67,potassium:293,zinc:.45,vitaminA:77,vitaminC:64.9,vitaminB1:.06,vitaminB2:.12,vitaminB6:.2,folate:108},'USDA FDC 169967 · Brokkoli gekocht/abgetropft; Vitamin C je Garverfahren stark schwankend'),
  ing('oil','Öl im Daal · geschätzt',8,{kcal:884,fat:100,saturated:13.8,mono:73,poly:10.5,vitaminE:14.35},'Generisches Olivenöl als Rechenproxy; tatsächliche Ölart und -menge nicht bekannt'),
  ing('curry-powder','Currymischung · Kurkuma/Kumin/Koriander, geschätzt',2,{kcal:325,protein:14,carbs:55,fiber:33,fat:14,iron:7.5,magnesium:220},'Generisches Currypulver · Mischung und Wirkstoffgehalt variieren; keine Curcumin-Messung'),
  ing('salt','Zugesetztes Salz · geschätzt',1,{kcal:0,salt:100},'Zugesetztes Salz nur geschätzt; sonstige Natriumquellen unvollständig')
 ]},
 'ironmaxx-vegan-protein-shake-mixed-berries':{name:'IronMaxx 100% Vegan Protein Zero · Mixed Berries (Shake)',icon:'🥤',ingredients:[
  // Primary source: original label photos supplied 02.11.2026. The 30-g serving
  // is used for interpolation because rounding differs slightly vs per-100-g declaration.
  ing('protein-powder','IronMaxx Vegan Protein Zero · Mixed Berries Pulver',30,{kcal:119/0.3,protein:22/0.3,carbs:1.4/0.3,fat:2.4/0.3,saturated:0.4/0.3,salt:1.3/0.3,sodium:520/0.3},'IronMaxx Originaletikett · Nutzerfoto 02.11.2026 · 30-g-Portion; Natrium aus Salz berechnet',false,true),
  ing('water','Trinkwasser · 300 ml ≈ 300 g',300,{kcal:0,protein:0,carbs:0,fat:0,saturated:0,salt:0},'Trinkwasser · nur Energie/Makros bekannt; Mineralien je Wasserquelle unbekannt')
 ]},
 'spar-freefrom-bio-skyr-250g':{name:'SPAR free from · laktosefreier Bio-Skyr (250 g)',icon:'🥣',ingredients:[
  // Label photographed 02.11.2026. Only calcium/B12/phosphorus/potassium/magnesium are generic dairy estimates.
  // Fat '<0.5 g/100 g' and saturated '<0.1' are bounds: 0.3 and 0.05 are marked approximations, not label measurements.
  ing('skyr','SPAR free from · laktosefreier Bio-Skyr, natur',250,{kcal:62,protein:11,carbs:4,sugar:4,fat:.3,saturated:.05,salt:.10,sodium:40,calcium:120,potassium:150,phosphorus:195,magnesium:12,vitaminB12:.8},'Originaletikett 02.11.2026: kcal/Protein/KH/Zucker/Salz. Fett <0,5, gesättigt <0,1 g/100 g; die eingetragenen Fettwerte und nicht deklarierten Mikronährstoffe sind generische Milchprodukt-Schätzwerte.',false,true,['fat','saturated','calcium','potassium','phosphorus','magnesium','vitaminB12'])
 ]},
 'bio-magertopfen-250g':{name:'Bio-Magertopfen · mager, streichfähig (250 g)',icon:'🥣',ingredients:[
  ing('quark','Bio-Magertopfen, mager, streichfähig',250,{kcal:70,protein:12,carbs:4.1,sugar:4.1,fat:.2,saturated:.1,salt:.10,sodium:40,calcium:90,potassium:150,phosphorus:190,magnesium:11,vitaminB12:.7},'Originaletikett 02.11.2026: kcal/Protein/KH/Zucker/Fett/gesättigte Fette/Salz. Natrium aus Salz gerechnet; nicht deklarierte Mikronährstoffe sind generische Magerquark-Schätzwerte.',false,true,['calcium','potassium','phosphorus','magnesium','vitaminB12'])
 ]},
 'homemade-topfentorte-slice':{name:'Topfentorte · gebackenes Stück mit Boden',icon:'🍰',ingredients:[
  // The photographed cake has a pale baked cheese filling and a thin base. No recipe or measured weight.
  ing('cheese-filling','Gebackene Topfenfüllung · geschätzt',125,{kcal:178,protein:11,carbs:18,sugar:15,fat:7.2,saturated:3.2,fiber:.1,calcium:100,potassium:135,phosphorus:145,vitaminB12:.55},'Generischer Topfentorten-Füllungsproxy, NICHT Rezept oder Etikett dieses Stücks; Zucker/Fett/Eigelbanteil unbekannt'),
  ing('cake-base','Kuchen-/Mürbteigboden · geschätzt',35,{kcal:425,protein:6,carbs:51,sugar:17,fat:22,saturated:10,fiber:2.5,calcium:25,iron:1.1,magnesium:16},'Generischer gebackener Kuchenboden, der tatsächliche Boden kann anders zusammengesetzt sein')
 ]},
 'korean-spicy-tofu-vegetable-strudel':{name:'Scharfer Gemüse-Tofu-Strudel · koreanisch inspiriert',icon:'🥟',ingredients:[
  // Photo shows a browned layered pastry with vegetable filling. Ingredients and net weight not verified.
  ing('strudel-pastry','Strudelteig/Blätterteig · Rechenproxy',80,{kcal:365,protein:6,carbs:39,sugar:2,fat:22,saturated:9,fiber:2.5,salt:.8,iron:1.4},'Generisches blättriges Strudel-/Blätterteigprofil; Teigart nicht bestätigt'),
  ing('tofu','Tofu · in der Füllung, geschätzt',90,{kcal:123,protein:15,carbs:2.5,sugar:.4,fat:7,saturated:1.1,fiber:1.1,calcium:120,iron:2.5,magnesium:35,phosphorus:150,potassium:150},'Generisches Tofuprofil; Art, Gerinnungsmittel (Calcium), Menge und Marinade unbekannt'),
  ing('mixed-vegetables','Gemüsefüllung · Mix unbekannt',100,{kcal:42,protein:2.2,carbs:7.5,sugar:3.5,fat:.5,fiber:2.8,vitaminC:22,folate:40,potassium:220,vitaminA:90},'Generisches Gemüse-Mischprofil; Gemüsesorten unbekannt, Kreuzblütler NICHT automatisch zugeordnet'),
  ing('oil','Öl in Teig/Füllung zusätzlich · geschätzt',6,{kcal:884,fat:100,saturated:13.8,mono:73,poly:10.5},'Zusätzliches Öl geschätzt; Teigprofil enthält bereits Teigfett, NICHT doppelt addieren'),
  ing('spicy-seasoning','Scharfe koreanisch inspirierte Würzung/Sauce · geschätzt',12,{kcal:190,protein:4,carbs:40,sugar:22,fat:1,salt:4},'Generischer scharfer Saucenproxy; kein Nachweis für Gochujang, fermentierte Zutaten oder bestimmte Chilis')
 ]},
 'fried-egg-personal':{name:'Mein Spiegelei · Olivenöl, Kala Namak, Kurkuma, Chili',icon:'🍳',ingredients:[
  ing('egg','Hühnerei · 1 Stück ohne Schale',55,{kcal:143,protein:12.56,carbs:.72,fat:9.51,saturated:3.126,cholesterol:372,vitaminB12:.89,vitaminD:2,selenium:30.7},'USDA · ganzes rohes Ei; Fettaufnahme beim Braten hängt von Ölmenge ab'),
  ing('olive-oil','Natives Olivenöl extra · zum Braten',5,{kcal:884,fat:100,saturated:13.8,mono:73,poly:10.5,vitaminE:14.35},'USDA · Olivenöl; tatsächlich aufgenommenes Öl nicht gemessen'),
  ing('kala-namak','Kala Namak · 1 Prise',.3,{salt:100},'Speisesalz-Äquivalent als Schätzung; Kala Namak variabler Mineral-/Schwefelgehalt'),
  ing('turmeric','Kurkuma, gemahlen · 1 Prise',.3,{kcal:312,protein:9.68,carbs:67.14,fat:3.25,fiber:22.7},'USDA · gemahlene Kurkuma'),
  ing('chili','Chiliflocken · 1 Prise',.2,{kcal:282,protein:12,carbs:50,fat:14},'USDA · generische rote Chiliflocken')
 ]}
});
export const PERSONAL_RECIPE_IDS=Object.freeze(Object.keys(RAW));
export const PERSONAL_RECIPE_PRESETS=Object.freeze(PERSONAL_RECIPE_IDS.map(id=>Object.freeze({
 id,title:RAW[id].name,emoji:RAW[id].icon,
 group:id==='ironmaxx-vegan-protein-shake-mixed-berries'?'Getränke':['spar-freefrom-bio-skyr-250g','bio-magertopfen-250g'].includes(id)?'Frühstück':id==='fried-egg-personal'?'Frühstück':id==='crackers-feta-evening-personal'?'Abendsnack':['homemade-poppy-cake-chocolate-personal','homemade-topfentorte-slice'].includes(id)?'Snacks':'Mahlzeiten',
 defaultAmount:['spar-freefrom-bio-skyr-250g','bio-magertopfen-250g'].includes(id)?'1 Becher (250 g)':id==='homemade-topfentorte-slice'?'1 Stück (ca. 160 g)':id==='korean-spicy-tofu-vegetable-strudel'?'1 Portion (ca. 288 g)':id==='ironmaxx-vegan-protein-shake-mixed-berries'?'1 Glas (30 g Pulver + 300 ml Wasser)':id==='oven-potatoes-sesame-personal'?'1 Portion (breite Suppenschüssel)':id==='homemade-poppy-cake-chocolate-personal'?'1 Stück (7 × 6 × 4 cm)':id==='basmati-lentil-dal-broccoli-personal'?'1 Portion (flacher Suppenteller)':'1 Portion',
 kcalLow:null,kcalHigh:null,
 recipeNote:id==='spar-freefrom-bio-skyr-250g'
 ?'SPAR free from laktosefreier Bio-Skyr Natur · 250 g je Becher. Etikett 02.11.2026: pro 100 g 62 kcal, Protein 11 g, KH/Zucker 4 g, Salz 0,10 g; Fett <0,5 g und gesättigte Fettsäuren <0,1 g. Fett 0,3/0,05 g und Milchprodukt-Mikros (Calcium, Phosphor, Magnesium, Kalium, B12) nur generisch geschätzt. Daily Dozen: Milchprodukt, keine Pflanzenportion. Anti-Aging Eight: Protein als dokumentierte Aufnahme, KEIN Nachweis von Proteinrestriktion oder Anti-Aging-Wirkung. Morgen geplant: beim tatsächlichen Essen eintragen, nicht automatisch vorausbuchen.'
 :id==='bio-magertopfen-250g'
 ?'Bio-Magertopfen mager/streichfähig · 250 g Becher. Etikett 02.11.2026: pro 100 g 70 kcal, 12 g Protein, 4,1 g KH/Zucker, 0,2 g Fett, gesättigt 0,1 g, Salz 0,10 g. Calcium, B12, Phosphor, Kalium und Magnesium sind generische Milchprodukt-Schätzungen, keine Etikettwerte. Keine Daily-Dozen-Pflanzenportion; Anti-Aging Eight zeigt nur dokumentierte Proteinzufuhr.'
 :id==='homemade-topfentorte-slice'
 ?'Topfentorte nach Foto 02.11.2026, ein Stück ≈160 g (125 g Topfenfüllung + 35 g Boden), NICHT gewogen und ohne Rezept. Generische Schätzwerte einschließlich Calcium, Phosphor und Vitamin B12; bei Zucker/Fett/Teigart hohe Unsicherheit. Mengen sind im Inspektor editierbar. Daily Dozen: keine bestätigte pflanzliche Portion. Anti-Aging Eight: nur geschätztes Protein, keine Anti-Aging-Wirkung behaupten.'
 :id==='korean-spicy-tofu-vegetable-strudel'
 ?'Scharfer Gemüse-Tofu-Strudel (koreanisch inspiriert) nach Foto 02.11.2026. Geschätzte Portion 288 g: 80 g blättriger Teig, 90 g Tofu, 100 g gemischtes Gemüse, 6 g zusätzliches Öl, 12 g pikante Würzung. Teig, Saucenart, Gewicht und Gemüse nicht bestätigt. Daily Dozen: vorläufig anteilige Tofu-Hülsenfrucht- und Gemüseportion; keine automatische Kreuzblütler-, Vollkorn- oder Fermentationsgutschrift. Anti-Aging Eight: nur Ernährungsevidenz zu Pflanzenanteil, Ballaststoffen und Protein; keine gemessenen Postbiotika. Alle generischen Mikronährstoffe und Zutatenmengen sind Schätzungen.'
 :id==='ironmaxx-vegan-protein-shake-mixed-berries'
 ?'IronMaxx 100% Vegan Protein Zero Mixed Berries. 1 Glas: 30 g Pulver mit ca. 300 ml Wasser, beide Mengen einzeln im Rezept-Inspektor editierbar. Originaletikett 02.11.2026: je 30 g 119 kcal, 22 g Protein, 1,4 g Kohlenhydrate, davon Zucker <0,5 g (nicht exakt bekannt), 2,4 g Fett, 0,4 g gesättigte Fette, 1,3 g Salz. Natrium ~520 mg aus Salz rechnerisch abgeleitet, kein eigener Laborwert. Ballaststoffe und Vitamine/Mineralien sind NICHT deklariert: unbekannt, nicht null. Daily Dozen: nur belegte Wassermenge als Getränk; Proteinpulver und Beeren-Geschmack sind keine Beeren-/Hülsenfruchtportionen. Anti-Aging Eight: dokumentiertes Protein für die Proteinanalyse; kein Nachweis einer gesundheitlichen Anti-Aging-Wirkung. Mit Milch/Haferdrink neu als separate Zutat erfassen, Wasser nicht einfach weiterzählen.'
 :id==='oven-potatoes-sesame-personal'
 ?'Eine breite Suppenschüssel mit im Ofen gebackenen Bio-Kartoffelwürfeln samt Schale, zweimal mit Olivenöl übergossen, Salz, schwarzem Sesam und Chiliflocken. Anfangsannahmen: 300 g Kartoffeln roh, Olivenöl insgesamt 20 g (nicht zweimal 20 g), 10 g Sesam, 0,5 g Chili, 1 g Salz. Bei 5 g mehr Öl ca. 44 kcal zusätzlich. Alle Zutatenmengen im Inspektor änderbar; Nährstoffe nur generisch geschätzt, Vitamin C nach dem Backen nicht quantifiziert.'
 :id==='homemade-poppy-cake-chocolate-personal'
 ?'Selbstgebackener Mohnkuchen mit Schokolade obenauf; Stückgröße 7 × 6 × 4 cm. Geschätztes Gewicht 140 g (125 g Kuchenbasis plus 15 g Glasur), nicht abgewogen und keine bekannte Rezeptur. Makros und ausgewählte Mikros aus generischen Kuchen-/Schokoladen-Proxys, hohe Unsicherheit; Zutatenmengen editierbar. Daily Dozen: Mohn ist potentiell Samen, aber ohne tatsächliche Mohnmenge keine bestätigte Portion Nüsse/Samen; weder Vollkorn noch Obst automatisch zählen. Anti-Aging Eight: keine belegte Nussportion, kein Nachweis einer Anti-Aging-Wirkung; Eiweißmenge nur geschätzt. Kakao-Polyphenole nicht quantifiziert.'
 :id==='basmati-lentil-dal-broccoli-personal'
 ?'Ein flacher Suppenteller: geschätzt 170 g gekochter weißer Basmatireis, 160 g gekochte Linsen, 100 g gekochter Brokkoli, 8 g Öl, 2 g Currygewürze und 1 g Salz. Gekochte, nicht trockene Reis-/Linsengewichte; Zutaten einzeln editierbar. Daily Dozen: Hülsenfrüchte, Kreuzblütler (Brokkoli), Kräuter/Gewürze anteilig; weißer Reis ist KEIN Vollkorn. Anti-Aging Eight: Brokkoli (Kreuzblütler/grünes Gemüse) und Linsen (präbiotische Ballaststoffquelle) sind dokumentierte Ernährungsindikatoren, keine nachgewiesene Anti-Aging-Wirkung oder gemessene Mikrobiomänderung. Alle Nährwerte sind generische Schätzwerte, Vitamin C abhängig vom Garverfahren; Curcumin, Sulforaphan und Postbiotika nicht quantifiziert.'
 :'Persönliches Rezept, Grammangaben je Zutat editierbar'
})));
export const PERSONAL_RECIPE_CATALOG=RAW;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
export function recipeSnapshot(id,input){
 const def=RAW[id];if(!def)return [];
 const rows=new Map((Array.isArray(input)?input:[]).filter(x=>x?.id).map(x=>[x.id,x]));
 return def.ingredients.map(x=>{const edited=rows.get(x.id),n=Number(String(edited?.grams??'').replace(',','.'));
  return {id:x.id,grams:edited&&Number.isFinite(n)&&n>=0&&n<=2000?round(n):x.grams,assumed:edited?.assumed===false?false:true};});
}
export function personalRecipeParts(id,recipe,amount='1 Portion'){
 const def=RAW[id];if(!def)return [];
 // Existing recipes retain their prior per-entry logic. The oven-potato bowl
 // additionally supports an explicit count (e.g. '2 Portionen' or '2 Schüsseln').
 const count= ['oven-potatoes-sesame-personal','basmati-lentil-dal-broccoli-personal','homemade-poppy-cake-chocolate-personal','ironmaxx-vegan-protein-shake-mixed-berries','spar-freefrom-bio-skyr-250g','bio-magertopfen-250g','homemade-topfentorte-slice','korean-spicy-tofu-vegetable-strudel'].includes(id)
  ? String(amount||'').match(/^\s*(\d+(?:[.,]\d+)?)\s*(?:portion(?:en)?|becher|glas|gläser|glaeser|glaser|schüssel(?:n)?|schuessel(?:n)?|teller|stück(?:e)?|stueck(?:e)?)\b/i)
  : null;
 const factor=count?Number(count[1].replace(',','.')):1;
 if(!Number.isFinite(factor)||factor<=0||factor>20)return [];
 const saved=recipeSnapshot(id,recipe);
 return saved.map(row=>{
  const ingredient=def.ingredients.find(x=>x.id===row.id);
  // Omitted OPTIONAL item = explicitly not included in THIS recipe, NOT zero nutrients in that ingredient.
  if(row.grams===0)return null;
  const grams=round(row.grams*factor);
  const values=Object.fromEntries(Object.entries(ingredient.values).map(([key,n])=>[key,round(n*grams/100)]));
  return {name:ingredient.label,part:'Persönliches Rezept',amount:grams,unit:'g',source:ingredient.source,values,
   estimatedKeys:ingredient.labelVerified?[...new Set(['sodium',...(ingredient.estimatedKeys||[])])]:ingredient.id==='water'?[]:Object.keys(values),extra:[],note:ingredient.labelVerified?'Etikettwerte linear skaliert und gerundet; Natrium aus Salz abgeleitet. Nicht auf dem Etikett deklarierte Nährstoffe sind als generische Schätzung markiert oder bleiben unbekannt.':ingredient.id==='water'?'Reines Wasser ohne Energie; Mineralstoffe je Quelle unbekannt':row.assumed?'Menge vorläufig, bitte bei Bedarf abwiegen; generisches Nährstoffprofil':'Menge persönlich editiert; Nährstoffprofil weiterhin geschätzt'};
 }).filter(Boolean);
}
export function personalRecipeKcal(id,recipe,amount){
 const parts=personalRecipeParts(id,recipe,amount);if(!parts.length)return null;
 const k=parts.filter(x=>Number.isFinite(x.values.kcal));
 if(!k.length)return null;
 const subtotal=k.reduce((n,p)=>n+p.values.kcal,0);
 const incomplete=parts.some(x=>!Number.isFinite(x.values.kcal));
 return {low:Math.round(subtotal),high:Math.round(subtotal),kind:incomplete?'Rezept-Teilsumme (unvollständig)':['ironmaxx-vegan-protein-shake-mixed-berries','spar-freefrom-bio-skyr-250g','bio-magertopfen-250g'].includes(id)?'Etikettwert · rechnerisch skaliert':'Rezept-Schätzung',incomplete};
}
export function personalRecipeEditor(entry){
 if(!PERSONAL_RECIPE_IDS.includes(entry?.foodId))return '';
 const def=RAW[entry.foodId],rows=recipeSnapshot(entry.foodId,entry.recipe);
 return `<fieldset class="r737-edit"><legend>${esc(def.icon)} ${esc(def.name)} · Zutaten</legend><p>Alle Grammzahlen sind editierbar. Optionale Zutaten mit 0 g wurden für diesen Eintrag nicht verwendet. Etikettwerte werden als solche gekennzeichnet; nicht deklarierte Mikronährstoffe bleiben unbekannt. Sonstige Rezepte beruhen auf generischen Referenzen.</p><div class="r737-fields">${rows.map(row=>{const x=def.ingredients.find(i=>i.id===row.id);return `<label>${esc(x.label)}${x.optional?' <small>(optional)</small>':''}<span><input name="recipe737-${esc(row.id)}" type="number" min="0" max="2000" step="0.1" inputmode="decimal" value="${row.grams}" required> g</span></label>`;}).join('')}</div></fieldset>`;
}
export function readPersonalRecipe(id,fd){return recipeSnapshot(id,RAW[id]?.ingredients.map(x=>({id:x.id,grams:fd.get('recipe737-'+x.id),assumed:false}))||[]);}
