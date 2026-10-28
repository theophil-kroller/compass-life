/** Compass .34 · Conservative auto-confirmation from explicitly logged foods.
 * Only clear unit-to-serving mappings earn auto ticks. Unclear mixed meals do not.
 * Manual explicit counts (including 0) always override inferred values.
 */
const localDay=at=>{const d=new Date(at);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const amountOf=(x)=>{
 const s=String(x||'').toLowerCase();
 const grams=s.match(/(\d+(?:[.,]\d+)?)\s*g\b/);
 return grams?Number(grams[1].replace(',','.')):null;
};
const amountPieces=x=>{
 const s=String(x||'').toLowerCase();const m=s.match(/(\d+(?:[.,]\d+)?)\s*(?:stücke?|äpfel|tassen?|becher)\b/);
 return m?Math.max(0,Math.min(8,Math.floor(Number(m[1].replace(',','.'))))):1;
};
export const VERIFIED_DAILY_FOODS=Object.freeze({
 apple:'fruit', 'dried-mango':'fruit',
 peanuts:'nuts','mixed-nuts':'nuts',
 'water-glass':'beverages','green-tea-chinese':'beverages','tea-unsweetened':'beverages',coffee:'beverages','matcha':'beverages','matcha-oat-plain':'beverages','oat-latte':'beverages',
 'bio-kornbrot':null // Grain content cannot be inferred from its name alone.
});
/** Returns documented portions, explanatory provenance and partial nut grams.
 * `available` means documented intake, NOT a complete daily diet.
 */
export function dailyDozenEvidence(state,day){
 const records=state?.nutritionJournal?.entries||[], totals={fruit:0,nuts:0,beverages:0};
 const sources={fruit:[],nuts:[],beverages:[]};let nutGrams=0;
 for(const entry of records){
  if(!entry||entry.deleted||localDay(entry.at)!==day)continue;
  const foodId=String(entry.foodId||''),type=VERIFIED_DAILY_FOODS[foodId];if(!type)continue;
  const amount=String(entry.amount||'');
  if(type==='nuts'){
   const grams=amountOf(amount)??(foodId==='peanuts'?20:30);
   if(Number.isFinite(grams)&&grams>0&&grams<=300){nutGrams+=grams;sources.nuts.push(`${foodId==='peanuts'?'Erdnüsse':'Nussmix'}: ${grams} g`);}
  }else if(type==='fruit'){
   // For dried fruit, count conservatively at most 1 documented serving per entry.
   const amountGrams=amountOf(amount);
   const count=foodId==='dried-mango'?(amountGrams===null||amountGrams>=35?1:0):Math.min(3,amountPieces(amount));
   totals.fruit+=count;sources.fruit.push(foodId==='apple'?`Apfel: ${count} Stück`:'Getrocknete Mango (Portionsmenge grob)');
  }else{
   // One entered tea/coffee is ONE drink, irrespective of ml or caffeine content.
   totals.beverages++;sources.beverages.push(foodId==='green-tea-chinese'?'Chinesischer Grüntee':'Erfasstes Getränk');
  }
 }
 // Greger Daily Dozen's nut serving is roughly a quarter cup, not just a 20g Anti-Aging-Eight palmful.
 totals.nuts=Math.floor(nutGrams/30);
 return {totals,notes:sources,nutGrams,coverage:'Nur eindeutig erkannte Tagebucheinträge; gemischte Gerichte unbekannt'};
}
