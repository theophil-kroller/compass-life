/** Compass 0.5.91.47 · Two real photographed cups, each full package is ONE serving.
 * Reject unknown measures. Exact ingredient label values are per 100 g.
 */
export const PROTEIN_CUPS_147=Object.freeze({
 'ehrmann-high-protein-vegan-chocolate-200g':Object.freeze({grams:200,kcal100:75,protein100:10}),
 'spar-naturpur-bio-skyr-mango-maracuja-400g':Object.freeze({grams:400,kcal100:72,protein100:9})
});
const num=s=>Number(String(s).replace(',','.'));
export function parseProteinCup147(id,input='',defaultAmount=''){
 const pack=PROTEIN_CUPS_147[id];if(!pack)return null;
 const text=String(input??'').trim()||String(defaultAmount??'').trim();
 if(!text||/^[−–-]/.test(text))return null;
 const amount=text.match(/^(\d+(?:[.,]\d+)?)\s*(becher|packung(?:en)?|portion(?:en)?|cups?)\b/i);
 const grams=text.match(/^(\d+(?:[.,]\d+)?)\s*(?:g|gramm)\b/i);
 const value=amount?num(amount[1])*pack.grams:grams?num(grams[1]):null;
 if(!Number.isFinite(value)||value<=0||value>5000)return null;
 return {grams:value,packages:value/pack.grams};
}
export function proteinCupKcal147(id,portion){
 const p=PROTEIN_CUPS_147[id];return p&&portion&&Number.isFinite(portion.grams)?Math.round(p.kcal100*portion.grams/100):null;
}
