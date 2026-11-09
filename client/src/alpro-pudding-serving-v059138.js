/** Compass 0.5.91.38: label-based 200 g Alpro Plant Protein puddings. */
export const ALPRO_PUDDING_PACKAGES=Object.freeze({
 'alpro-plant-protein-vanilla-pudding-200g':Object.freeze({grams:200,kcal100:92,protein100:10}),
 'alpro-plant-protein-chocolate-pudding-200g':Object.freeze({grams:200,kcal100:95,protein100:10.2})
});
const number=s=>Number(String(s).replace(',','.'));
export function parseAlproPuddingPortion(id,amount='',defaultAmount='1 Becher (200 g)'){
 const pack=ALPRO_PUDDING_PACKAGES[id];if(!pack)return null;
 const text=String(amount??'').trim()||String(defaultAmount||'').trim();
 if(!text||text.startsWith('-'))return null;
 let m=text.match(/^(\d+(?:[.,]\d+)?)\s*g(?:ramm)?\b/i);
 let grams=m?number(m[1]):null;
 if(grams===null){m=text.match(/^(\d+(?:[.,]\d+)?)\s*(?:becher|packung|portion(?:en)?)\b/i);if(m)grams=number(m[1])*pack.grams;}
 if(!Number.isFinite(grams)||grams<=0||grams>2000)return null;
 return {grams};
}
export function alproPuddingKcal(id,portion){const p=ALPRO_PUDDING_PACKAGES[id];if(!p||!portion||!Number.isFinite(portion.grams))return null;return Math.round(p.kcal100*portion.grams/100);}
