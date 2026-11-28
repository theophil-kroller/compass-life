import {FOODS_169,PROFILES_169,FOOD_GRAMS_169,foodPortion169} from './food-package-collection-v059169.js';
import {PACKAGED_FOODS_168,PACKAGED_PROFILES_168,PACKAGED_GRAMS_168,packagedPortion168} from './food-desserts-cranberries-v059168.js';
import {TAKEAWAY_NOODLE_BOX_ID_167,TAKEAWAY_NOODLE_BOX_FOOD_167,TAKEAWAY_NOODLE_BOX_PROFILE_167,TAKEAWAY_NOODLE_BOX_RECIPE_167,noodleBoxPortion167} from './takeaway-noodlebox-v059167.js';
import {MILLET_BAKE_ID_166,MILLET_BAKE_PEAR_ID_166,MILLET_BAKE_FOODS_166,MILLET_BAKE_PROFILES_166,MILLET_BAKE_RECIPE_166,milletBakePortion166} from './millet-egg-bake-v059166.js';
import {ROESTI_TOAST_ID_165,RAW_CACAO_OAT_ID_165,ROESTI_COCOA_FOODS_165,ROESTI_COCOA_PROFILES_165,ROESTI_COCOA_RECIPE_165,roestiToastPortion165,rawCacaoOatPortion165} from './roesti-cocoa-v059165.js';
import {BEET_SALAD_164,BEET_SALAD_ID_164,BEET_SALAD_FOOD_164,BEET_SALAD_PROFILE_164,beetSaladPortion164} from './beet-potato-salad-v059164.js';
import {PLANT_FOODS_149,PLANT_PROFILES_149,plantPortion149} from './food-plants-v059149.js';
import {PROTEIN_CUP_FOODS_155,PROTEIN_CUP_PROFILES_155,PROTEIN_CUP_GRAMS_155} from './food-protein-cups-v059155.js';
/** 0.5.91.48 · Additive food presets. Existing IDs/categories and logged entries are never rewritten.
 * Source: user photographed Milsani label + structured user-supplied recipe handoff. */
export const FOODS_148=Object.freeze([
  ...PLANT_FOODS_149,
  ...PROTEIN_CUP_FOODS_155,
  ...PACKAGED_FOODS_168,
  ...FOODS_169,
  BEET_SALAD_FOOD_164,
  ...ROESTI_COCOA_FOODS_165,
  ...MILLET_BAKE_FOODS_166,
  TAKEAWAY_NOODLE_BOX_FOOD_167,
  {
    id: 'realmix-ube-latte-stick-16g',
    emoji: '🍠',
    title: 'REALMIX Ube Latte · vegan',
    group: 'Getränke',
    defaultAmount: '1 Stick (16 g Pulver)',
    kcalLow: 80, kcalHigh: 80,
    recipeNote: 'Originaletikett · Nutzerfotos 19.11.2026. 1 Stick = 16 g Pulver, mit Wasser: 80,48 kcal (Anzeige 80), 0,48 g Eiweiß, 10,56 g Kohlenhydrate (8,00 g Zucker), 4,32 g Fett (4,16 g gesättigt), 0,09 g Ballaststoffe, 0,013 g Salz. Zutaten: Zucker, Kokosmilchpulver, violette Süßkartoffel (7 % = 1,12 g/Stick), Maltodextrin, E551, E1450. Vegan laut Packung; mögliche Spuren von Gluten, Soja, Milch. Zusätzliche Milch oder Süßungsmittel separat erfassen. Mikronährstoffe und Anthocyane sind nicht deklariert: unbekannt, nicht Null. Daily Dozen: keine Gutschrift als Gemüse oder ungesüßtes Getränk. Anti-Aging Eight: keine belegbare Gutschrift oder Wirkungsbehauptung.',
    aliases: ['Real Mix Ube', 'RealMix Ube Latte Style', 'Ube Latte Stick', 'Purple Sweet Potato Latte', 'Violette Süßkartoffel Latte']
  },
  {"id": "homemade-muffin-low-sugar-20261114", "emoji": "🧁", "title": "Muffin hausgemacht (wenig Zucker)", "group": "Snacks", "defaultAmount": "1 Stück (ca. 80 g)", "kcalLow": 225, "kcalHigh": 225, "recipeNote": "GROBE PORTIONSSCHÄTZUNG · Ohne Rezept und Wägung: grobe Portionsschätzung für einen Muffin von ca. 80 g. Weniger Zucker als üblich angenommen; Mehl und Fett können weiterhin viele Kalorien liefern. Keine automatisch gutgeschriebenen Daily-Dozen-Portionen.", "aliases": ["Hausgemachter Muffin", "Muffin von Mama", "Muffins wenig Zucker"]},
  {"id": "homemade-cake-slice-low-sugar-20261114", "emoji": "🍰", "title": "Kuchenstück hausgemacht (wenig Zucker)", "group": "Snacks", "defaultAmount": "1 Stück (ca. 100 g)", "kcalLow": 270, "kcalHigh": 270, "recipeNote": "GROBE PORTIONSSCHÄTZUNG · Ohne Rezept und Wägung: grobe Portionsschätzung für ein Kuchenstück von ca. 100 g, Rezept und Belag unbekannt. Weniger Zucker als üblich angenommen; keine automatisch gutgeschriebenen Obst- oder Daily-Dozen-Portionen.", "aliases": ["Hausgemachter Kuchen", "Kuchen von Mama", "Kuchenstück wenig Zucker"]},
  {"id": "all-stars-whey-iced-matcha-latte-30g", "emoji": "🥤", "title": "All Stars Whey Protein Shake · Iced Matcha Latte", "group": "Getränke", "defaultAmount": "1 Portion (30 g Pulver)", "kcalLow": 117, "kcalHigh": 117, "recipeNote": "Originaletikett vom Nutzerfoto 14.11.2026 · 30 g Pulver mit Wasser: 117 kcal, 20 g Eiweiß, 3,3 g Kohlenhydrate, 2,1 g Zucker, 2,2 g Fett, 1,5 g gesättigte Fettsäuren, 2,2 g Ballaststoffe, 0,06 g Salz, 90 mg Koffein. Milch separat buchen; diese Portion rechnet nur das Pulver.", "aliases": ["AS Whey Matcha", "Allstars Matcha Latte", "Proteinshake Matcha"]},
  {"id": "nutrinorm-whey-deluxe-cookies-cream-30g", "emoji": "🥤", "title": "NutriNorm Whey Deluxe · Cookies & Cream", "group": "Getränke", "defaultAmount": "1 Portion (30 g Pulver)", "kcalLow": 112, "kcalHigh": 112, "recipeNote": "Originaletikett vom Nutzerfoto 14.11.2026 · 30 g Pulver mit Wasser: 112 kcal, 22,3 g Eiweiß, 2,7 g Kohlenhydrate, 1 g Zucker, 1,3 g Fett, 0,5 g gesättigte Fettsäuren, 0,4 g Ballaststoffe, 0,16 g Salz. Milch separat buchen; diese Portion rechnet nur das Pulver.", "aliases": ["Hofer Nutrinorm Whey Cookies Cream", "Whey Deluxe Drink", "Proteinshake Cookies Cream"]},
  {"id": "golden-turtle-peanuts-raw-with-skin-500g", "emoji": "🥜", "title": "Golden Turtle Erdnüsse · naturbelassen, mit Haut", "group": "Snacks", "defaultAmount": "30 g", "kcalLow": 170, "kcalHigh": 170, "recipeNote": "Golden Turtle Erdnüsse mit Haut; Originaletikett vom Nutzerfoto 14.11.2026. Nährwerte je 100 g: 567 kcal, 26 g Eiweiß, 49 g Fett, 7 g gesättigte Fettsäuren, 16 g Kohlenhydrate, 0 g Zucker, 0 g Salz. 1 Portion = 30 g; ganze Packung 500 g. Nicht deklarierte Ballaststoff- und Mikronährstoffwerte bleiben unbekannt.", "aliases": ["Golden Turtle Peanuts", "Rohe Erdnüsse", "Erdnüsse mit Haut"]},

  {
    "id": "milsani-high-protein-pfirsich-maracuja-200g",
    "emoji": "🥣",
    "title": "Milsani High Protein Pfirsich-Maracuja · 25 g Protein",
    "group": "Snacks",
    "defaultAmount": "1 Becher (200 g)",
    "kcalLow": 136,
    "kcalHigh": 136,
    "recipeNote": "Hofer · Originaletikett vom Nutzerfoto 14.11.2026. 1 Becher = 200 g: 136 kcal, 24,8 g Eiweiß (Vorderseite gerundet 25 g), 7 g Kohlenhydrate davon 6 g Zucker, 0,8 g Fett davon 0,6 g gesättigt, 0,26 g Salz. Milchprodukt mit Pfirsich- und Maracuja-Zubereitung. Andere Mikros und Ballaststoffe auf dem Etikett nicht angegeben, daher unbekannt. Keine automatische Daily-Dozen-Obstportion.",
    "aliases": [
      "Hofer Milsani 25 Gramm Protein Pfirsich Maracuja"
    ]
  },
  {
    "id": "homemade_indian_lemon_red_cabbage_20261114",
    "emoji": "🥬",
    "title": "Indisches Zitronen-Rotkraut (hausgemacht)",
    "group": "Mahlzeiten",
    "defaultAmount": "100 g",
    "kcalLow": 58,
    "kcalHigh": 58,
    "recipeNote": "Hausgemachtes Rezept vom 14.11.2026, GROBE REZEPTSCHÄTZUNG pro 100 g verzehrfertigem Gericht. Zutaten/Endgewicht teils unbestätigt; tatsächliche Makros, Mikronährstoffe und Salz können abweichen. Keine Senfsamen und kein Knoblauch. Mengen der nicht ausdrücklich bestätigten Zutaten sind die zuletzt besprochene Rezeptplanung und können vom tatsächlichen Gericht abweichen.",
    "aliases": [
      "Indisches Rotkraut",
      "Rotkraut mit Kreuzkümmel, Ingwer & Zitrone"
    ]
  },
  {
    "id": "homemade_red_cabbage_beet_kimchi_20261114",
    "emoji": "🫙",
    "title": "Rotkraut-Rote-Rübe-Kimchi (hausgemacht)",
    "group": "Mahlzeiten",
    "defaultAmount": "100 g",
    "kcalLow": 34,
    "kcalHigh": 34,
    "recipeNote": "Hausgemachtes Rezept vom 14.11.2026, GROBE REZEPTSCHÄTZUNG pro 100 g verzehrfertigem Gericht. Zutaten/Endgewicht teils unbestätigt; tatsächliche Makros, Mikronährstoffe und Salz können abweichen. Selbst gemischtes Rotkraut-Rote-Rübe-Kimchi mit 3 EL Gochugaru, Maisstärke-Paste und zwei flachen Glasdosen. Ohne Apfel. Mikros und Makros wegen Lake und Fermentation nur Näherungen.; FERMENTATION noch nicht als sicher abgeschlossen bestätigt. Vor Verzehr Ansäuerung prüfen (Ziel-pH ≤4,6), kein gemessener pH vorhanden.",
    "aliases": [
      "Rotkraut-Kimchi",
      "Purple Cabbage Beet Kimchi"
    ]
  }
]);
export const PROFILES_148=Object.freeze({
  ...PLANT_PROFILES_149,
  ...PROTEIN_CUP_PROFILES_155,
  ...PACKAGED_PROFILES_168,
  ...PROFILES_169,
  [BEET_SALAD_ID_164]:BEET_SALAD_PROFILE_164,
  ...ROESTI_COCOA_PROFILES_165,
  ...MILLET_BAKE_PROFILES_166,
  [TAKEAWAY_NOODLE_BOX_ID_167]:TAKEAWAY_NOODLE_BOX_PROFILE_167,
  'realmix-ube-latte-stick-16g': {
    name: 'REALMIX Ube Latte · vegan',
    reference: {amount: 16, unit: 'g'},
    nutrients: {kcal: 80.48, protein: 0.48, carbs: 10.56, sugar: 8, fat: 4.32, saturated: 4.16, fiber: 0.0896, salt: 0.0128},
    source: 'Originaletikett · Nutzerfotos 19.11.2026 · Nährwerte je 100 g rechnerisch auf 16 g umgerechnet',
    extra: {},
    note: '1 Stick = 16 g Pulver mit Wasser. Zutaten: Zucker, Kokosmilchpulver, violette Süßkartoffel (7 %; 1,12 g/Stick), Maltodextrin, E551, E1450. Vegan laut Verpackung; kann Spuren von Gluten, Soja und Milch enthalten. Weitere Mikronährstoffe und Anthocyangehalte wurden nicht gemessen/deklariert und bleiben unbekannt (nicht 0). Kein Daily-Dozen-Gemüse- oder ungesüßtes-Getränk-Credit; keine belegte Anti-Aging-Eight-Wirkung. Milch/Extras separat erfassen.',
    estimatedNutrients: []
  },
  "homemade-muffin-low-sugar-20261114": {"name": "Muffin hausgemacht (wenig Zucker)", "reference": {"amount": 80, "unit": "g"}, "nutrients": {"kcal": 225, "protein": 4, "carbs": 27, "sugar": 8, "fat": 11.5, "saturated": 4.5, "fiber": 1.3}, "source": "Grobe Portionsschätzung · Hausgebacken · Nutzerangabe 14.11.2026", "extra": {}, "note": "Ohne Rezept und Wägung: grobe Portionsschätzung für einen Muffin von ca. 80 g. Weniger Zucker als üblich angenommen; Mehl und Fett können weiterhin viele Kalorien liefern. Keine automatisch gutgeschriebenen Daily-Dozen-Portionen.", "estimatedNutrients": ["kcal", "protein", "carbs", "sugar", "fat", "saturated", "fiber"]},
  "homemade-cake-slice-low-sugar-20261114": {"name": "Kuchenstück hausgemacht (wenig Zucker)", "reference": {"amount": 100, "unit": "g"}, "nutrients": {"kcal": 270, "protein": 4, "carbs": 34, "sugar": 11, "fat": 13, "saturated": 5, "fiber": 1.1}, "source": "Grobe Portionsschätzung · Hausgebacken · Nutzerangabe 14.11.2026", "extra": {}, "note": "Ohne Rezept und Wägung: grobe Portionsschätzung für ein Kuchenstück von ca. 100 g, Rezept und Belag unbekannt. Weniger Zucker als üblich angenommen; keine automatisch gutgeschriebenen Obst- oder Daily-Dozen-Portionen.", "estimatedNutrients": ["kcal", "protein", "carbs", "sugar", "fat", "saturated", "fiber"]},
  "all-stars-whey-iced-matcha-latte-30g": {"name": "All Stars Whey Protein Shake · Iced Matcha Latte", "reference": {"amount": 30, "unit": "g"}, "nutrients": {"kcal": 117, "protein": 20, "carbs": 3.3, "sugar": 2.1, "fat": 2.2, "saturated": 1.5, "fiber": 2.2, "salt": 0.06, "caffeine": 90}, "source": "Originaletikett · Nutzerfoto 14.11.2026", "extra": {}, "note": "Originaletikett vom Nutzerfoto 14.11.2026 · 30 g Pulver mit Wasser: 117 kcal, 20 g Eiweiß, 3,3 g Kohlenhydrate, 2,1 g Zucker, 2,2 g Fett, 1,5 g gesättigte Fettsäuren, 2,2 g Ballaststoffe, 0,06 g Salz, 90 mg Koffein. Milch separat buchen; diese Portion rechnet nur das Pulver.", "estimatedNutrients": []},
  "nutrinorm-whey-deluxe-cookies-cream-30g": {"name": "NutriNorm Whey Deluxe · Cookies & Cream", "reference": {"amount": 30, "unit": "g"}, "nutrients": {"kcal": 112, "protein": 22.3, "carbs": 2.7, "sugar": 1.0, "fat": 1.3, "saturated": 0.5, "fiber": 0.4, "salt": 0.16}, "source": "Originaletikett · Nutzerfoto 14.11.2026", "extra": {}, "note": "Originaletikett vom Nutzerfoto 14.11.2026 · 30 g Pulver mit Wasser: 112 kcal, 22,3 g Eiweiß, 2,7 g Kohlenhydrate, 1 g Zucker, 1,3 g Fett, 0,5 g gesättigte Fettsäuren, 0,4 g Ballaststoffe, 0,16 g Salz. Milch separat buchen; diese Portion rechnet nur das Pulver.", "estimatedNutrients": []},
  "golden-turtle-peanuts-raw-with-skin-500g": {"name": "Golden Turtle Erdnüsse · naturbelassen, mit Haut", "reference": {"amount": 100, "unit": "g"}, "nutrients": {"kcal": 567, "protein": 26, "carbs": 16, "sugar": 0, "fat": 49, "saturated": 7, "salt": 0}, "source": "Originaletikett · Nutzerfoto 14.11.2026", "extra": {}, "note": "Golden Turtle Erdnüsse mit Haut; Originaletikett vom Nutzerfoto 14.11.2026. Nährwerte je 100 g: 567 kcal, 26 g Eiweiß, 49 g Fett, 7 g gesättigte Fettsäuren, 16 g Kohlenhydrate, 0 g Zucker, 0 g Salz. 1 Portion = 30 g; ganze Packung 500 g. Nicht deklarierte Ballaststoff- und Mikronährstoffwerte bleiben unbekannt.", "estimatedNutrients": []},

  "homemade_indian_lemon_red_cabbage_20261114": {
    "name": "Indisches Zitronen-Rotkraut (hausgemacht)",
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "nutrients": {
      "kcal": 58,
      "protein": 1.5,
      "carbs": 8.3,
      "sugar": 4.2,
      "fat": 2.7,
      "saturated": 0.4,
      "fiber": 2.2,
      "salt": 0.6,
      "sodium": 240,
      "vitaminC": 20,
      "vitaminK": 33,
      "folate": 24,
      "potassium": 240,
      "calcium": 43,
      "magnesium": 18,
      "iron": 0.9
    },
    "source": "Grobe Rezeptschätzung · Nutzerübergabe 14.11.2026",
    "extra": {},
    "note": "Hausgemachtes Rezept vom 14.11.2026, GROBE REZEPTSCHÄTZUNG pro 100 g verzehrfertigem Gericht. Zutaten/Endgewicht teils unbestätigt; tatsächliche Makros, Mikronährstoffe und Salz können abweichen. Keine Senfsamen und kein Knoblauch. Mengen der nicht ausdrücklich bestätigten Zutaten sind die zuletzt besprochene Rezeptplanung und können vom tatsächlichen Gericht abweichen.",
    "estimatedNutrients": [
      "kcal",
      "protein",
      "carbs",
      "sugar",
      "fat",
      "saturated",
      "fiber",
      "salt",
      "sodium",
      "vitaminC",
      "vitaminK",
      "folate",
      "potassium",
      "calcium",
      "magnesium",
      "iron"
    ]
  },
  "homemade_red_cabbage_beet_kimchi_20261114": {
    "name": "Rotkraut-Rote-Rübe-Kimchi (hausgemacht)",
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "nutrients": {
      "kcal": 34,
      "protein": 1.3,
      "carbs": 6.3,
      "sugar": 3.0,
      "fat": 0.4,
      "saturated": 0.1,
      "fiber": 2.3,
      "salt": 2.3,
      "sodium": 920,
      "vitaminC": 25,
      "vitaminK": 28,
      "folate": 30,
      "potassium": 220,
      "calcium": 40,
      "magnesium": 17,
      "iron": 0.7
    },
    "source": "Grobe Rezeptschätzung · Nutzerübergabe 14.11.2026",
    "extra": {},
    "note": "Hausgemachtes Rezept vom 14.11.2026, GROBE REZEPTSCHÄTZUNG pro 100 g verzehrfertigem Gericht. Zutaten/Endgewicht teils unbestätigt; tatsächliche Makros, Mikronährstoffe und Salz können abweichen. Selbst gemischtes Rotkraut-Rote-Rübe-Kimchi mit 3 EL Gochugaru, Maisstärke-Paste und zwei flachen Glasdosen. Ohne Apfel. Mikros und Makros wegen Lake und Fermentation nur Näherungen.; FERMENTATION noch nicht als sicher abgeschlossen bestätigt. Vor Verzehr Ansäuerung prüfen (Ziel-pH ≤4,6), kein gemessener pH vorhanden.",
    "estimatedNutrients": [
      "kcal",
      "protein",
      "carbs",
      "sugar",
      "fat",
      "saturated",
      "fiber",
      "salt",
      "sodium",
      "vitaminC",
      "vitaminK",
      "folate",
      "potassium",
      "calcium",
      "magnesium",
      "iron"
    ]
  },
  "milsani-high-protein-pfirsich-maracuja-200g": {
    "name": "Milsani High Protein Pfirsich-Maracuja · 25 g Protein",
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "nutrients": {
      "kcal": 68,
      "protein": 12.4,
      "carbs": 3.5,
      "sugar": 3,
      "fat": 0.4,
      "saturated": 0.3,
      "salt": 0.13
    },
    "source": "Originaletikett · Nutzerfoto 14.11.2026",
    "extra": {},
    "note": "Hofer · Originaletikett vom Nutzerfoto 14.11.2026. 1 Becher = 200 g: 136 kcal, 24,8 g Eiweiß (Vorderseite gerundet 25 g), 7 g Kohlenhydrate davon 6 g Zucker, 0,8 g Fett davon 0,6 g gesättigt, 0,26 g Salz. Milchprodukt mit Pfirsich- und Maracuja-Zubereitung. Andere Mikros und Ballaststoffe auf dem Etikett nicht angegeben, daher unbekannt. Keine automatische Daily-Dozen-Obstportion.",
    "estimatedNutrients": []
  }
});
export const RECIPE_EVIDENCE_148=Object.freeze({
  [BEET_SALAD_ID_164]:BEET_SALAD_164,
  ...ROESTI_COCOA_RECIPE_165,
  ...MILLET_BAKE_RECIPE_166,
  [TAKEAWAY_NOODLE_BOX_ID_167]:TAKEAWAY_NOODLE_BOX_RECIPE_167,
  "homemade_indian_lemon_red_cabbage_20261114": {
    "recipeIngredients": [
      {
        "ingredient": "Rotkraut, roh",
        "quantity": 1387,
        "unit": "g",
        "confirmed": true
      },
      {
        "ingredient": "Rote Zwiebel",
        "quantity": 120,
        "unit": "g",
        "confirmed": true,
        "quantityEstimated": true
      },
      {
        "ingredient": "Jungzwiebeln",
        "quantity": 2,
        "unit": "Stück",
        "confirmed": false
      },
      {
        "ingredient": "Ingwer, frisch",
        "quantity": 35,
        "unit": "g",
        "confirmed": true,
        "quantityEstimated": true
      },
      {
        "ingredient": "Olivenöl",
        "quantity": 3,
        "unit": "EL",
        "confirmed": false
      },
      {
        "ingredient": "Kreuzkümmelsamen",
        "quantity": 3,
        "unit": "TL",
        "confirmed": true,
        "quantityEstimated": true
      },
      {
        "ingredient": "Kurkuma",
        "quantity": 0.75,
        "unit": "TL",
        "confirmed": true,
        "quantityEstimated": true
      },
      {
        "ingredient": "Gochugaru",
        "quantity": 1.25,
        "unit": "TL",
        "confirmed": true,
        "quantityEstimated": true
      },
      {
        "ingredient": "Garam Masala",
        "quantity": 1.5,
        "unit": "TL",
        "confirmed": false
      },
      {
        "ingredient": "Salz",
        "quantity": 1.5,
        "unit": "TL",
        "confirmed": false
      },
      {
        "ingredient": "Zitronensaft, frisch",
        "quantity": 40,
        "unit": "ml",
        "confirmed": false
      },
      {
        "ingredient": "Wasser",
        "quantity": 100,
        "unit": "ml",
        "confirmed": false
      }
    ],
    "plantCompounds": [
      {
        "name": "Anthocyane",
        "source": "Rotkraut",
        "presence": "expected",
        "amount": null
      },
      {
        "name": "Glucosinolate / mögliche Isothiocyanate",
        "source": "Rotkraut",
        "presence": "variable_after_cooking",
        "amount": null
      },
      {
        "name": "Curcuminoide",
        "source": "Kurkuma",
        "presence": "expected",
        "amount": null
      },
      {
        "name": "Gewürz-Polyphenole",
        "source": "Kreuzkümmel, Ingwer, Chili",
        "presence": "expected",
        "amount": null
      }
    ],
    "dailyDozen": {
      "eligibleCategories": [
        {
          "key": "cruciferous_vegetables",
          "name": "Kreuzblütler",
          "source": "Rotkraut",
          "creditedServings": null
        },
        {
          "key": "other_vegetables",
          "name": "Sonstiges Gemüse",
          "source": "Zwiebeln und Jungzwiebeln",
          "creditedServings": null
        },
        {
          "key": "herbs_and_spices",
          "name": "Kräuter und Gewürze",
          "source": "Kurkuma, Kreuzkümmel, Ingwer, Chili, Garam Masala",
          "creditedServings": null
        }
      ],
      "mappingRule": "Zutatenanteile je gewogener Portion skalieren und bestehende Compass-/Daily-Dozen-Portionsregeln anwenden. Nicht pauschal mehrere Portionen gutschreiben."
    },
    "antiAgingEight": {
      "prebioticsPostbiotics": {
        "relation": "possible_dietary_fiber",
        "provenHealthEffect": false
      },
      "xenohormesisMicroRNA": {
        "relation": "spices_and_phytochemicals_present",
        "quantifiable": false
      },
      "nuts": {
        "credited": false
      },
      "leafyGreens": {
        "credited": false
      },
      "berries": {
        "credited": false
      },
      "calorieRestriction": {
        "credited": false,
        "note": "Aus einem einzelnen Lebensmittel nicht ableitbar."
      },
      "proteinRestriction": {
        "credited": false,
        "note": "Aus einem einzelnen Lebensmittel nicht ableitbar."
      },
      "nadPlus": {
        "credited": false,
        "note": "Keine direkte NAD+-Wirkung ableitbar."
      }
    },
    "metadata": {
      "nutritionStatus": "estimated",
      "nutritionConfidence": "low-to-moderate",
      "quantityBasis": "100 g zubereitet",
      "fermentation": null
    }
  },
  "homemade_red_cabbage_beet_kimchi_20261114": {
    "recipeIngredients": [
      {
        "ingredient": "Rotkraut",
        "quantity": 700,
        "unit": "g",
        "confirmed": false,
        "source": "besprochene Rezeptmenge"
      },
      {
        "ingredient": "Rote Rübe, roh",
        "quantity": 150,
        "unit": "g",
        "confirmed": true,
        "source": "besprochene Rezeptmenge"
      },
      {
        "ingredient": "Karotte",
        "quantity": 100,
        "unit": "g",
        "confirmed": false
      },
      {
        "ingredient": "Frühlingszwiebeln",
        "quantity": 50,
        "unit": "g",
        "confirmed": false
      },
      {
        "ingredient": "Salz direkt zum Gemüse",
        "quantity": 25,
        "unit": "g",
        "confirmed": true
      },
      {
        "ingredient": "Salzlake, Wasser insgesamt",
        "quantity": 800,
        "unit": "ml",
        "confirmed": true
      },
      {
        "ingredient": "Salz für 800 ml Salzlake",
        "quantity": 20,
        "unit": "g",
        "confirmed": true
      },
      {
        "ingredient": "Maisstärke",
        "quantity": 7,
        "unit": "g",
        "confirmed": true,
        "quantityEstimated": true
      },
      {
        "ingredient": "Wasser für gekochte Würzpaste",
        "quantity": 100,
        "unit": "ml",
        "confirmed": false
      },
      {
        "ingredient": "Gochugaru",
        "quantity": 3,
        "unit": "EL",
        "confirmed": true
      },
      {
        "ingredient": "Knoblauch",
        "quantity": 2,
        "unit": "Zehen",
        "confirmed": true,
        "source": "spätere Angabe: zwei Zehen verfügbar"
      },
      {
        "ingredient": "Ingwer, frisch",
        "quantity": 20,
        "unit": "g",
        "confirmed": false
      },
      {
        "ingredient": "Helle Misopaste",
        "quantity": 1,
        "unit": "TL",
        "confirmed": false,
        "optional": true
      },
      {
        "ingredient": "Apfel",
        "quantity": 0,
        "unit": "g",
        "confirmed": true
      }
    ],
    "plantCompounds": [
      {
        "name": "Anthocyane",
        "source": "Rotkraut",
        "presence": "expected",
        "amount": null
      },
      {
        "name": "Betalaine",
        "source": "Rote Rübe",
        "presence": "expected",
        "amount": null
      },
      {
        "name": "Glucosinolate / mögliche Isothiocyanate",
        "source": "Rotkraut",
        "presence": "variable_during_fermentation",
        "amount": null
      },
      {
        "name": "Lebende Milchsäurebakterien",
        "source": "Fermentation",
        "presence": "possible_if_successfully_fermented_and_unheated",
        "amount": null
      }
    ],
    "dailyDozen": {
      "eligibleCategories": [
        {
          "key": "cruciferous_vegetables",
          "name": "Kreuzblütler",
          "source": "Rotkraut",
          "creditedServings": null
        },
        {
          "key": "other_vegetables",
          "name": "Sonstiges Gemüse",
          "source": "Rote Rübe, Karotte und Frühlingszwiebel",
          "creditedServings": null
        },
        {
          "key": "herbs_and_spices",
          "name": "Kräuter und Gewürze",
          "source": "Chili, Ingwer, Knoblauch",
          "creditedServings": null
        }
      ],
      "mappingRule": "Gemüseanteil der tatsächlich gegessenen 100-g-Portion berücksichtigen. Lake zählt nicht als Gemüseportion; keine automatische volle Daily-Dozen-Portion ohne Mengenumrechnung."
    },
    "antiAgingEight": {
      "prebioticsPostbiotics": {
        "relation": "fermented_food_and_fiber",
        "provenHealthEffect": false,
        "note": "Keine garantierte spezifische probiotische Wirkung."
      },
      "xenohormesisMicroRNA": {
        "relation": "phytochemicals_present",
        "quantifiable": false
      },
      "nuts": {
        "credited": false
      },
      "leafyGreens": {
        "credited": false
      },
      "berries": {
        "credited": false
      },
      "calorieRestriction": {
        "credited": false,
        "note": "Aus einem einzelnen Lebensmittel nicht ableitbar."
      },
      "proteinRestriction": {
        "credited": false,
        "note": "Aus einem einzelnen Lebensmittel nicht ableitbar."
      },
      "nadPlus": {
        "credited": false,
        "note": "Keine direkte NAD+-Wirkung ableitbar."
      }
    },
    "metadata": {
      "nutritionStatus": "estimated",
      "nutritionConfidence": "low",
      "quantityBasis": "100 g zubereitet",
      "fermentation": {
        "status": "in_progress_at_last_report",
        "safetyNote": "Vor Verzehr ausreichende Ansäuerung bestätigen; visuelles Erscheinungsbild allein genügt nicht. Keine validierte Fermentationsrezeptur.",
        "targetPhMax": 4.6,
        "phMeasured": null,
        "saltNote": "Insgesamt ca. 45 g zugesetztes Salz (25 g direkt, 20 g in 800 ml Lake), die tatsächlich gegessene Salzmenge hängt vom Lakeanteil ab."
      }
    }
  }
});
export const HOMEMADE_148=new Set([BEET_SALAD_ID_164,RAW_CACAO_OAT_ID_165,MILLET_BAKE_ID_166,MILLET_BAKE_PEAR_ID_166,TAKEAWAY_NOODLE_BOX_ID_167,'homemade_indian_lemon_red_cabbage_20261114','homemade_red_cabbage_beet_kimchi_20261114']);
export const HOMEMADE_BAKING_148=new Set(['homemade-muffin-low-sugar-20261114','homemade-cake-slice-low-sugar-20261114']);
export function foodPortion148(id,amount='',defaultAmount=''){
 if(Object.hasOwn(FOOD_GRAMS_169,id))return foodPortion169(id,amount,defaultAmount);
 if(Object.hasOwn(PACKAGED_GRAMS_168,id))return packagedPortion168(id,amount,defaultAmount);
 if(id===TAKEAWAY_NOODLE_BOX_ID_167)return noodleBoxPortion167(amount,defaultAmount);
 if(id===BEET_SALAD_ID_164)return beetSaladPortion164(amount,defaultAmount);
 if(id===ROESTI_TOAST_ID_165)return roestiToastPortion165(amount,defaultAmount);
 if(id===RAW_CACAO_OAT_ID_165)return rawCacaoOatPortion165(amount,defaultAmount);
 if(id===MILLET_BAKE_ID_166||id===MILLET_BAKE_PEAR_ID_166)return milletBakePortion166(id,amount,defaultAmount);
 if(Object.hasOwn(PLANT_PROFILES_149,id))return plantPortion149(id,amount,defaultAmount);
 const text=String(amount||defaultAmount||'').trim().toLowerCase();
 if(id==='realmix-ube-latte-stick-16g'){
  const a=text.replace(',', '.');
  const mass=a.match(/^(\d+(?:\.\d+)?)\s*(?:g|gramm)\b/);
  const sticks=a.match(/^(\d+(?:\.\d+)?)\s*(?:sticks?|beutel|tütchen|tuetchen|portion(?:en)?)\b/);
  const half=/^(?:halber|halbe|halb|½)\s*(?:stick|beutel|tütchen|tuetchen)\b/.test(a);
  const value=mass?Number(mass[1]):sticks?Number(sticks[1])*16:half?8:null;
  return Number.isFinite(value)&&value>0&&value<=5000?{grams:value,portions:value/16}:null;
 }
 if(!text||text.startsWith('-'))return null;
 const num=m=>Number(m[1].replace(',','.'));
 const grams=text.match(/^(\d+(?:[.,]\d+)?)\s*(?:g|gramm)\b/);
 const packs=text.match(/^(\d+(?:[.,]\d+)?)\s*(?:becher|bechern|packung|portion(?:en)?|beilage(?:n)?|st[üu]ck(?:e)?|muffins?|kuchenst[üu]cke?)\b/);
 const unit=PROTEIN_CUP_GRAMS_155[id] || (HOMEMADE_BAKING_148.has(id)?(id==='homemade-muffin-low-sugar-20261114'?80:100):HOMEMADE_148.has(id)?100:id==='milsani-high-protein-pfirsich-maracuja-200g'?200:id==='golden-turtle-peanuts-raw-with-skin-500g'||id==='all-stars-whey-iced-matcha-latte-30g'||id==='nutrinorm-whey-deluxe-cookies-cream-30g'?30:null);
 if(!unit)return null;
 const scoops=text.match(/^(\d+(?:[.,]\d+)?)\s*(?:scoops?|messlöffel|messloeffel|handvoll)\b/);
 const g=grams?num(grams):packs?num(packs)*unit:scoops?num(scoops)*unit:null;
 return Number.isFinite(g)&&g>0&&g<=5000?{grams:g,portions:g/unit}:null;
}
