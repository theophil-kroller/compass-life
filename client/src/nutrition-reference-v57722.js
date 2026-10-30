/** EU 1169/2011 Annex XIII nutrient reference values (NRV) for generic adults.
 * Not personalized recommendations or maximum safe intakes. Folate (DFE) is omitted:
 * food-folate equivalents and supplemental folic acid cannot simply be compared.
 * Sources: https://www.legislation.gov.uk/eur/2011/1169/annex/XIII/part/A/adopted/data.xht
 * Caffeine is instead an EFSA safety orientation, NEVER an intake goal:
 * https://www.efsa.europa.eu/de/topics/topic/caffeine
 */
export const DAILY_NRV=Object.freeze({vitaminA:800,vitaminC:80,vitaminD:5,vitaminE:12,vitaminK:75,vitaminB1:1.1,vitaminB2:1.4,niacin:16,vitaminB6:1.4,vitaminB12:2.5,biotin:50,pantothenicAcid:6,calcium:800,phosphorus:700,iron:14,iodine:150,magnesium:375,zinc:10,selenium:55,copper:1,manganese:2,chromium:40,molybdenum:50,potassium:2000});
export const CAFFEINE_EFSA_ADULT_ORIENTATION_MG=400;
/** Generic food database values for the named product, never presented as its label.
 * Composites keep the maker's macro label and approximate only additional micros.
 * Apple: USDA FoodData Central 171688; cheddar: USDA 173414.
 * Nuts: MorgenLand 30% cashew, ca 30% hazelnut, 15% walnut, 15% almond,
 * 10% brazil nuts. Remaining proportions are NOT verified and may vary.
 * Selenium is intentionally omitted for the Brazil-nut mixture because actual
 * selenium varies enormously between individual nuts, soils and lots.
 * https://2022.morgenland.bio/kerniger-nuss-mix-35kg/
 * https://www.aphis.usda.gov/sites/default/files/10_16101p.pdf
 * https://nutri-db.com/en/foods/173414
 * https://pmc.ncbi.nlm.nih.gov/articles/PMC8468443/
 */
const nutComposition={
 cashew:{calcium:37,magnesium:292,phosphorus:593,potassium:660,zinc:5.78,copper:2.195,manganese:1.655,vitaminE:.9,vitaminB1:.423,vitaminB2:.058,vitaminB6:.417,folate:25,iron:6.68},
 hazelnut:{calcium:114,magnesium:163,phosphorus:290,potassium:680,zinc:2.45,copper:1.725,manganese:6.175,vitaminE:15.03,vitaminB1:.643,vitaminB2:.113,vitaminB6:.563,folate:113,iron:4.7},
 walnut:{calcium:98,magnesium:158,phosphorus:346,potassium:441,zinc:3.09,copper:1.586,manganese:3.414,vitaminE:.7,vitaminB1:.341,vitaminB2:.15,vitaminB6:.537,folate:98,iron:2.91},
 almond:{calcium:269,magnesium:270,phosphorus:481,potassium:733,zinc:3.12,copper:1.031,manganese:2.179,vitaminE:25.63,vitaminB1:.205,vitaminB2:1.138,vitaminB6:.137,folate:44,iron:3.71},
 brazil:{calcium:160,magnesium:376,phosphorus:725,potassium:659,zinc:4.06,copper:1.743,manganese:1.223,vitaminE:5.65,vitaminB1:.617,vitaminB2:.035,vitaminB6:.101,folate:22,iron:2.43}
};
export const NUT_MIX_ASSUMED_FRACTIONS=Object.freeze({cashew:.30,hazelnut:.30,walnut:.15,almond:.15,brazil:.10});
const nutKeys=Object.keys(nutComposition.cashew);
const nutMicros=Object.fromEntries(nutKeys.map(k=>[k,Math.round(Object.entries(NUT_MIX_ASSUMED_FRACTIONS).reduce((v,[nut,fraction])=>v+fraction*nutComposition[nut][k],0)*1000)/1000]));
export const GENERIC_MICRONUTRIENTS=Object.freeze({
 'spar-bio-flaxseed':Object.freeze({calcium:255,magnesium:392,phosphorus:642,potassium:813,iron:5.73,zinc:4.34,copper:1.22,manganese:2.48,selenium:25.4,vitaminB1:1.644,vitaminB2:.161,niacin:3.08,vitaminB6:.473,folate:87,pantothenicAcid:.985,choline:78.7,vitaminE:.31,vitaminK:4.3}),
 // Different product (unsweetened 1% quark): only indicative dairy micros; product itself not analysed.
 'sbudget-topfencreme-vanilla':Object.freeze({calcium:125,phosphorus:145,potassium:150,magnesium:13,zinc:.6,vitaminB2:.18,vitaminB12:.8}),
 'mixed-nuts':Object.freeze(nutMicros),
 'cheddar':Object.freeze({calcium:710,phosphorus:455,potassium:76,magnesium:27,zinc:3.64,selenium:28.5,vitaminA:337,vitaminD:.6,vitaminE:.71,vitaminK:2.4,vitaminB2:.43,vitaminB12:1.1,vitaminB1:.029,vitaminB6:.066,folate:27,iron:.14}),
 'cheddar-hofer':Object.freeze({calcium:710,phosphorus:455,potassium:76,magnesium:27,zinc:3.64,selenium:28.5,vitaminA:337,vitaminD:.6,vitaminE:.71,vitaminK:2.4,vitaminB2:.43,vitaminB12:1.1,vitaminB1:.029,vitaminB6:.066,folate:27,iron:.14}),
 'peanuts':Object.freeze({calcium:92,magnesium:168,potassium:705,folate:240}),
});
// USDA FoodData Central 173944 (raw bananas), generic per 100 g; not brand-specific.
export const BANANA_GENERIC_100G=Object.freeze({kcal:89,protein:1.09,carbs:22.84,sugar:12.23,fat:.33,saturated:.112,fiber:2.6,salt:.0025,
 vitaminC:8.7,vitaminB6:.367,folate:20,vitaminB1:.031,vitaminB2:.073,niacin:.665,pantothenicAcid:.334,vitaminA:3,vitaminE:.1,vitaminK:.5,
 calcium:5,magnesium:27,potassium:358,phosphorus:22,iron:.26,zinc:.15,copper:.078,manganese:.27,choline:9.8});
export const APPLE_GENERIC_100G=Object.freeze({kcal:52,protein:.26,carbs:13.81,sugar:10.39,fat:.17,saturated:.028,fiber:2.4,salt:.0025,
 vitaminA:3,vitaminC:4.6,vitaminE:.18,vitaminK:2.2,vitaminB1:.017,vitaminB2:.026,niacin:.091,vitaminB6:.041,folate:3,pantothenicAcid:.061,
 calcium:6,magnesium:5,potassium:107,phosphorus:11,iron:.12,zinc:.04,copper:.027,manganese:.035,choline:3.4});
