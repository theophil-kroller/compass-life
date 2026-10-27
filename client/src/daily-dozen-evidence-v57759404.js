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
function scale(entry){const x=String(entry.amount||'').match(/^\s*(\d+(?:[.,]\d+)?)\s*(?:portion|portionen|glas|gläser|glaser)\b/i);return x?Math.max(0,Math.min(4,Number(x[1].replace(',','.')))):1;}
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
   } else if(id==='fried-egg-personal'){
    const spice=(by.turmeric||0)+(by.chili||0);if(spice>0){spiceGrams+=spice;notes.spices.push(`Spiegelei · Kurkuma/Chili: ~${round(spice)} g`);sources.push({id:sourceId,category:'spices',grams:round(spice),source:'Spiegelei · Kurkuma/Chili'});}
   }
   continue;
  }
  if(id==='apple'){const m=a.match(/(\d+(?:[.,]\d+)?)\s*(?:stück|äpfel|apfel)/i);add('fruit',m?Number(m[1].replace(',','.')):1,'Apfel',sourceId);}
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
  } else if(['green-tea-chinese','tea-unsweetened','coffee','matcha','matcha-oat-plain','oat-latte'].includes(id)){
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
