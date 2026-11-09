/** Compass 0.5.91.38: single evidence policy for both Daily Dozen screens.
 * The named wholegrain bread presets are verified by ingredient sources; a generic
 * dark/unknown bread is not. A serving is one slice or approximately 50 g.
 */
const VERIFIED_BREAD=new Set(['wholegrain-bread-slice','wholegrain-toast-butter-jam',
 'bio-kornbrot','dark-bread-butter','bread-cheese']);
const parse=x=>Number(String(x).replace(',','.'));
export function wholegrainBreadEvidence(foodId,amount='',customFood=null){
 const id=String(foodId||'');
 const explicit=VERIFIED_BREAD.has(id)||customFood?.wholegrain===true||/^\s*(?:100\s*%\s*)?vollkornbrot\b/i.test(String(customFood?.title||''));
 if(!explicit)return null;
 const a=String(amount||'').trim();
 const pieces=a.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*(?:scheiben?|st[üu]ck(?:e)?|stueck(?:e)?)\b/i);
 const grams=a.match(/^\s*(\d+(?:[.,]\d+)?)\s*g\b/i);
 let portion=pieces?parse(pieces[1]):grams?parse(grams[1])/50:1;
 if(!Number.isFinite(portion)||portion<=0||portion>20)return null;
 return {servings:Math.round(portion*100)/100,source:VERIFIED_BREAD.has(id)?'Vollkornbrot · Produkt/Rezept nach Zutaten zugeordnet':'Vollkornbrot · explizit erfasst'};
}
