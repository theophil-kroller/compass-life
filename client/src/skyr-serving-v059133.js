/** Compass 0.5.91.33 · Product-specific gram and beaker portions.
 * The numeric grams on the pack are authoritative; never silently treat a
 * smaller 150-g skyr cup as equivalent to a 450-g skyr cup.
 * Missing or unparseable quantity stays unknown, not one default cup.
 */
export const SKYR_PACKAGES=Object.freeze({
 'milsani-skyr-maracuja-150g':Object.freeze({grams:150,kcal100:47}),
 'ehrmann-high-protein-skyr-natural-450g':Object.freeze({grams:450,kcal100:51})
});
const amountNumber=text=>Number(String(text).replace(',','.'));
export function parseSkyrPortion(foodId,input,defaultAmount=''){
 const data=SKYR_PACKAGES[foodId];if(!data)return null;
 const text=String(input==null||String(input).trim()===''?defaultAmount:input).trim();
 if(!text||/(?:^|\s)[−–-]\s*\d/.test(text))return null;
 // A descriptive default like '1 Becher (150 g)' contains both measures:
 // the count is decisive. Explicit single weight still works independently.
 const becher=text.match(/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:becher(?:n)?|packung(?:en)?|cup(?:s)?)(?=$|[^\p{L}])/iu);
 const gramm=text.match(/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:g|gramm)(?=$|[^\p{L}])/iu);
 const grams=becher?amountNumber(becher[1])*data.grams:gramm?amountNumber(gramm[1]):null;
 return typeof grams==='number'&&Number.isFinite(grams)&&grams>0&&grams<=5000?{grams,unit:'g',packages:grams/data.grams}:null;
}
export function skyrKcal(foodId,serving){
 const data=SKYR_PACKAGES[foodId];return data&&serving?Math.round(serving.grams*data.kcal100/100):null;
}
