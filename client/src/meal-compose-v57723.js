/** Compass 0.5.77.23 — local-first meal composer. Pure, bounded computations.
 * Approximate cooked-food composition from generic USDA/SR references; not a label.
 * No network or LLM in the fast input path; unknown ingredients stay unknown.
 * Never invent oil, dressing or salt for unspecified preparation.
 * Values per 100 g edible food, sodium converted to salt equivalents only when known.
 */
import {ensureJournal,addNutrition} from './personal-journal-v5692.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ingredient=(id,emoji,title,aliases,defaultGrams,values,source)=>({id,emoji,title,aliases,defaultGrams,values,source});
export const MEAL_INGREDIENTS=Object.freeze([
 ingredient('napa','🥬','Chinakohl / Napa-Kohl',['chinakohlsalat','china-kohl-salat','chinakohl-salat','chinakohl','china-kohl','napa','chinesischer kohl'],100,{kcal:16,protein:1.2,carbs:3.2,sugar:1.4,fat:.2,fiber:1.2,salt:.02,vitaminC:27,calcium:29,iron:.31,magnesium:11,potassium:238,folate:79},'Generisch · USDA Chinese cabbage (Napa), roh'),
 ingredient('tempeh','🫘','Tempeh',['tempeh'],120,{kcal:192,protein:20.3,carbs:7.64,fat:10.8,saturated:2.54,salt:.023,calcium:111,iron:2.7,magnesium:81,phosphorus:266,potassium:412,zinc:1.14,manganese:1.3,vitaminB2:.36},'Generisch · USDA FDC 174272; kein Marinaden- oder Bratöl'),
 ingredient('buckwheat','🌾','Buchweizen, gekocht',['buchweizen','buckwheat','grechka'],150,{kcal:92,protein:3.38,carbs:17.24,fat:.62,saturated:.134,fiber:2.7,salt:.01,calcium:7,iron:.8,magnesium:51,phosphorus:70,potassium:88,zinc:.61,manganese:.403,folate:14},'Generisch · USDA SR 20010; gekocht, ohne Butter/Öl'),
 ingredient('vegetables','🥕','Gemüse-Mix (ohne Bratfett)',['gebratenes gemüse','gemüsepfanne','gemüsemix','gemüse-mix','gemüse'],150,{kcal:35,protein:1.7,carbs:6.3,sugar:3.1,fat:.3,fiber:2.5,salt:.055,vitaminC:30,vitaminA:150,calcium:33,magnesium:16,potassium:240,folate:40},'Grober Gemüse-Mix-Richtwert; konkrete Mischung unbekannt'),
 ingredient('tofu','🧈','Tofu, natur',['tofu'],120,{kcal:83,protein:10,carbs:1.2,fat:5.3,saturated:.8,calcium:150,iron:2.7,magnesium:30,potassium:120,salt:.025},'Generischer Tofu-Richtwert; Gerinnungsmittel beeinflusst Calcium'),
 ingredient('rice','🍚','Reis, gekocht',['reis','basmati','jasminreis'],150,{kcal:130,protein:2.7,carbs:28.2,fat:.28,fiber:.4,salt:.003,magnesium:12,potassium:35},'Generisch · USDA gekochter weißer Reis'),
 ingredient('broccoli','🥦','Brokkoli',['brokkoli','broccoli'],120,{kcal:35,protein:2.38,carbs:7.18,fat:.41,fiber:3.3,salt:.08,vitaminC:64,vitaminK:141,calcium:40,potassium:293,folate:108},'Generisch · gegarter Brokkoli ohne Würze'),
 ingredient('oil','🫒','Bratöl / Pflanzenöl',['bratöl','olivenöl','rapsöl','pflanzenöl','öl'],10,{kcal:884,fat:100,saturated:14},'Generisches Pflanzenöl; Menge muss bestätigt werden'),
 ingredient('dressing','🥗','Dressing / Vinaigrette',['dressing','vinaigrette','salatdressing'],20,{kcal:400,carbs:8,sugar:5,fat:41,saturated:5,salt:1},'Sehr grober Vinaigrette-Richtwert; Menge/Zutaten prüfen'),
 ingredient('tomato','🍅','Tomaten',['tomaten','tomate','cherrytomaten','tomatensalat'],120,{kcal:18,protein:.9,carbs:3.9,sugar:2.6,fat:.2,fiber:1.2,salt:.013,vitaminC:13.7,potassium:237,vitaminA:42,folate:15},'Generisch · Tomaten roh, ohne Dressing'),
 ingredient('carrots','🥕','Karotten',['karotten','karotte','möhren','möhre'],80,{kcal:41,protein:.93,carbs:9.6,sugar:4.8,fat:.24,fiber:2.8,salt:.17,vitaminA:835,vitaminC:5.9,potassium:320},'Generisch · USDA Karotte roh'),
 ingredient('cucumber','🥒','Gurke',['salatgurke','gurken','gurke'],120,{kcal:15,protein:.65,carbs:3.63,sugar:1.67,fat:.11,fiber:.5,salt:.005,vitaminC:2.8,potassium:147},'Generisch · Salatgurke roh'),
 ingredient('chickpeas','🫘','Kichererbsen, gekocht',['kichererbsen','kichererbse','chickpeas'],120,{kcal:164,protein:8.86,carbs:27.42,fat:2.59,saturated:.27,fiber:7.6,salt:.018,magnesium:48,iron:2.89,zinc:1.53,potassium:291,folate:172},'Generisch · USDA Kichererbse gekocht, ungesalzen'),
 ingredient('lentils','🫘','Linsen, gekocht',['linsen','linseneintopf','lentils'],150,{kcal:116,protein:9.02,carbs:20.13,fat:.38,fiber:7.9,salt:.005,iron:3.33,magnesium:36,potassium:369,folate:181},'Generisch · USDA Linsen gekocht, ohne Würze'),
 ingredient('quinoa','🌾','Quinoa, gekocht',['quinoa','kinwa'],150,{kcal:120,protein:4.4,carbs:21.3,fat:1.92,fiber:2.8,salt:.018,magnesium:64,iron:1.49,potassium:172,folate:42},'Generisch · USDA Quinoa gekocht'),
 ingredient('potato','🥔','Kartoffeln, gekocht',['kartoffeln','kartoffel','erdäpfel','erdapfel'],150,{kcal:87,protein:1.9,carbs:20.1,fat:.1,fiber:1.8,salt:.01,potassium:379,vitaminC:9},'Generisch · gekochte Kartoffeln ohne Zusätze'),
 ingredient('spinach','🥬','Spinat, gegart',['spinat','blattspinat','babyspinat'],100,{kcal:23,protein:2.97,carbs:3.75,fat:.26,fiber:2.4,salt:.175,vitaminC:9.8,iron:3.57,magnesium:87,potassium:466,folate:146},'Generisch · gegarter Spinat ohne Zusätze'),
 ingredient('pasta','🍝','Nudeln, gekocht',['nudeln','pasta','spaghetti','penne'],150,{kcal:158,protein:5.8,carbs:30.9,fat:.93,fiber:1.8,salt:.002,iron:1.28,magnesium:18},'Generisch · Pasta gekocht, ungesalzen'),
 ingredient('egg','🥚','Ei, gekocht',['eier','hühnerei','gekochtes ei','ei'],60,{kcal:155,protein:12.6,carbs:1.1,fat:10.6,saturated:3.27,salt:.31,vitaminB12:.89,vitaminD:2,selenium:30.7,calcium:50},'Generisch · Hühnerei gekocht; nicht mit Bratfett'),
 ingredient('apple','🍎','Apfel mit Schale',['apfel','apple'],180,{kcal:52,protein:.26,carbs:13.81,sugar:10.39,fat:.17,fiber:2.4,salt:.003,vitaminC:4.6,potassium:107,calcium:6},'Generisch · USDA Apfel roh mit Schale'),
]);
const DB=new Map(MEAL_INGREDIENTS.map(x=>[x.id,x]));
const toNumber=x=>Number(String(x).replace(',','.'));
const clean=s=>String(s||'').trim().slice(0,1200);
const safeGrams=g=>Number.isFinite(g)&&g>0&&g<=2000?Math.round(g*10)/10:null;
function foundAliases(text){
 const lower=text.toLocaleLowerCase('de-AT'),matched=[];
 // Longer aliases first. Word-like boundary to prevent e.g. "Öl" matching an arbitrary suffix.
 for(const f of MEAL_INGREDIENTS){
  const alias=f.aliases.slice().sort((a,b)=>b.length-a.length).find(a=>new RegExp(`(^|[^\\p{L}])${a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?=$|[^\\p{L}])`,'iu').test(lower));
  if(!alias)continue;
  const rx=new RegExp(`(^|[^\\p{L}])(${alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})(?=$|[^\\p{L}])`,'iu');const m=rx.exec(lower);const i=m?.index||0;
  const nearBefore=lower.slice(Math.max(0,i-16),i).match(/(\d+(?:[.,]\d+)?)\s*(g|gramm|kg)\s*$/i);
  const nearAfter=lower.slice(i+String(m?.[0]||'').length,i+String(m?.[0]||'').length+18).match(/^\s*(?:\(|:)?\s*(\d+(?:[.,]\d+)?)\s*(g|gramm|kg)\b/i);
  const q=nearBefore||nearAfter;const weight=q?safeGrams(toNumber(q[1])*(q[2]==='kg'?1000:1)):f.defaultGrams;
  matched.push({id:f.id,grams:weight||f.defaultGrams,assumed:!q});
 }
 return matched;
}
export function recognizeMeal(text){
 const description=clean(text);const ingredients=foundAliases(description);
 const terms=description.split(/\s*(?:,|\+|\bund\b|\bmit\b|;|\/|\bdazu\b)\s*/i).map(s=>s.trim()).filter(Boolean);
 const unknown=terms.filter(term=>!foundAliases(term).length&&/[a-zäöü]{3}/i.test(term));
 const low=description.toLowerCase();const warnings=[];
 if(/salat|dressing/i.test(low)&&!ingredients.some(x=>x.id==='dressing'))warnings.push('Dressing nicht angegeben – Fett und Salz können fehlen.');
 if(/gebraten|pfanne|angeröstet/i.test(low)&&!ingredients.some(x=>x.id==='oil'))warnings.push('Bratöl nicht angegeben – Fett und kcal können fehlen.');
 if(!ingredients.length)warnings.push('Keine bekannten Zutaten erkannt. Bitte Menge/Zutaten prüfen oder GPT-Vorschlag einfügen.');
 if(unknown.length)warnings.push(`Nicht zugeordnet: ${unknown.join(' · ').slice(0,150)}. Diese Bestandteile gehen nicht in die Bilanz ein.`);
 warnings.push('Zugesetztes Salz, Sauce und Gewürze sind ohne Angabe unbekannt.');
 return {description,ingredients,unknown,warnings};
}
export function validateMealIngredients(rows){
 if(!Array.isArray(rows)||rows.length===0||rows.length>20)throw Error('Bitte 1–20 erkennbare Zutaten verwenden.');
 const unique=new Set();return rows.map(item=>{
  const id=String(item?.id||'');if(!DB.has(id)||unique.has(id))throw Error('Unbekannte oder doppelte Zutat: '+id);unique.add(id);
  const grams=safeGrams(toNumber(item.grams));if(grams===null)throw Error('Menge bei '+DB.get(id).title+' muss zwischen 0 und 2.000 g liegen.');
  return {id,grams,assumed:item.assumed===true};
 });
}
export function mealNutrients(rows){
 const valid=validateMealIngredients(rows),totals={},detail=[];let assumptions=0;
 for(const r of valid){const i=DB.get(r.id),factor=r.grams/100;assumptions+=Number(r.assumed);
  for(const [k,n] of Object.entries(i.values)){totals[k]=(totals[k]||0)+n*factor;}
  detail.push({id:i.id,title:i.title,emoji:i.emoji,grams:r.grams,assumed:r.assumed,source:i.source});
 }
 return {nutrients:Object.fromEntries(Object.entries(totals).map(([k,v])=>[k,Math.round(v*100)/100])),detail,assumptions};
}
/** Full portion recipe is saved as user-owned custom food; log refers to this stable ID.
 * Indexed small data: no fetching, no mutation of previous recipes; synced via existing journal.
 */
export function saveMeal(state,{title,description,ingredients,unknown=[],at=new Date().toISOString()}={}){
 ensureJournal(state);const name=String(title||description||'Mahlzeit').trim().slice(0,80)||'Mahlzeit';
 const {nutrients,detail,assumptions}=mealNutrients(ingredients);
 const atISO=Number.isFinite(Date.parse(at))?new Date(at).toISOString():new Date().toISOString();
 const id=crypto.randomUUID(),now=new Date().toISOString();
 const item={id,title:name,emoji:'🍽️',group:'Eigene',defaultAmount:'1 Portion',kcalLow:Math.max(0,Math.round((nutrients.kcal||0)*.8)),kcalHigh:Math.round((nutrients.kcal||0)*1.2),nutrients,nutrientBasis:'perPortion',ingredients:detail,description:clean(description),unmatchedIngredients:Array.isArray(unknown)?unknown.slice(0,10).map(x=>String(x).slice(0,80)):[],source:'Generische Lebensmitteldaten / Portionsschätzung',estimatedNutrients:Object.keys(nutrients),uncertain:true,updatedAt:now};
 state.nutritionJournal.customFoods.push(item);
 const entry=addNutrition(state,{foodId:id,at:atISO,amount:'1 Portion',note:`${assumptions} Portionsannahmen · Schätzung${item.unmatchedIngredients.length?' · Nicht berücksichtigt: '+item.unmatchedIngredients.join(', '):''}`.slice(0,500)});
 return {food:item,entry};
}
export function gptMealPrompt(description){return `Du analysierst eine Mensa-Mahlzeit für Compass. Beschreibung: ${JSON.stringify(clean(description))}. Antworte AUSSCHLIESSLICH als JSON-Objekt mit der Form {"ingredients":[{"id":"tempeh","grams":120},{"id":"buckwheat","grams":150}],"unknown":["z.B. Sauce"],"notes":"Öl/Dressing unklar"}. Erlaubte ingredient IDs: ${MEAL_INGREDIENTS.map(i=>`${i.id} (${i.title})`).join(', ')}. Nutze nur wirklich erkennbare Zutaten, nie neue IDs. Grammmengen sind grobe Portionsannahmen, keine gemessenen Mengen. Fehlt Öl/Dressing/Salz, nicht erfinden; in notes erwähnen. Antworte ohne Markdown.`;}
export function importMealJSON(text){
 if(String(text||'').length>10000)throw Error('Der JSON-Vorschlag ist zu groß.');
 let obj;try{obj=JSON.parse(String(text).trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{throw Error('Bitte ein gültiges JSON-Objekt einfügen.');}
 const list=Array.isArray(obj)?obj:obj?.ingredients;
 return {ingredients:validateMealIngredients(list).map(x=>({...x,assumed:true})),unknown:Array.isArray(obj?.unknown)?obj.unknown.slice(0,10).map(x=>String(x).slice(0,80)):[],notes:String(obj?.notes||'').slice(0,300)};
}
export function mealMacroMarkup(rows){
 if(!rows?.length)return '';
 const n=mealNutrients(rows).nutrients;
 return `<span>⚡ ≈ ${Math.round(n.kcal||0)} kcal</span><span>💪 ${Math.round(n.protein||0)} g Protein</span><span>🌾 ${Math.round(n.carbs||0)} g KH</span><span>🥑 ${Math.round(n.fat||0)} g Fett</span><span>🧂 ${Math.round((n.salt||0)*100)/100} g Salz*</span>`;
}
export function mealPreviewMarkup(model){
 if(!model)return '';
 const hasRows=model.ingredients.length>0;
 return `<div class="meal723-preview" aria-live="polite"><p class="meal723-muted">🍽️ Erkannt · Mengen vor dem Speichern anpassen</p>${model.ingredients.length?model.ingredients.map(row=>{const i=DB.get(row.id);return `<label class="meal723-ingredient"><span>${i.emoji} ${esc(i.title)}</span><span><input name="meal723-grams-${i.id}" aria-label="${esc(i.title)} Gramm" type="number" inputmode="decimal" min="1" max="2000" step="1" required value="${row.grams}"> g</span></label>`;}).join(''):'<p>Keine passende Zutat erkannt. Bitte Gericht genauer beschreiben oder GPT-Vorschlag importieren.</p>'}
 ${hasRows?`<div class="meal723-macros">${mealMacroMarkup(model.ingredients)}</div>`:''}
 ${model.warnings?.map(x=>`<p class="meal723-warning">ℹ️ ${esc(x)}</p>`).join('')||''}
 ${model.unknown?.length?`<p class="meal723-warning">⚠️ Nicht berechnet: ${esc(model.unknown.join(', '))}</p>`:''}
 ${model.warnings?.some(x=>/Bratöl/.test(x))&&!model.ingredients.some(x=>x.id==='oil')?'<button type="button" class="secondary-btn" data-action="meal723-add-ingredient" data-id="oil">+ 🫒 10 g Bratöl ergänzen</button>':''}
 ${model.warnings?.some(x=>/Dressing/.test(x))&&!model.ingredients.some(x=>x.id==='dressing')?'<button type="button" class="secondary-btn" data-action="meal723-add-ingredient" data-id="dressing">+ 🥗 20 g Dressing ergänzen</button>':''}

 ${model.ingredients.length?'<button type="submit" class="primary-btn" data-meal-save="1">🍽️ Mahlzeit übernehmen und als Vorlage merken</button>':''}
 <small>* Salz nur aus bekannten Grundzutaten; Würzung nicht enthalten. Alle Werte Schätzungen, bei unsicherer Zubereitung zu niedrig.</small></div>`;
}
export function mealComposerMarkup(description='',model=null){
 return `<section class="meal723-shell"><div class="meal723-head"><span>✨ Gericht beschreiben</span><small>Offline · 1 Satz genügt</small></div><form id="meal723-compose-form"><textarea name="description" rows="2" maxlength="1200" placeholder="z. B. Chinakohlsalat, Tempeh, gebratenes Gemüse und Buchweizen">${esc(description)}</textarea><div class="meal723-actions"><button class="secondary-btn" type="submit" data-meal-action="analyze">Zutaten erkennen</button><button class="secondary-btn" type="button" data-action="meal723-gpt-prompt">GPT-Auftrag kopieren</button></div><div id="meal723-preview">${model?mealPreviewMarkup(model):''}</div></form><details class="meal723-gpt"><summary>🧠 GPT-Ergebnis einfügen (optional)</summary><p>GPT ist nicht automatisch verbunden. Ein strukturierter Vorschlag kann geprüft und übernommen werden.</p><form id="meal723-json-form"><textarea name="json" rows="3" maxlength="10000" placeholder='{"ingredients":[{"id":"tempeh","grams":120}],"unknown":[]}'></textarea><button class="secondary-btn" type="submit">Vorschlag prüfen</button></form></details><small class="meal723-footnote">Deine bisherigen Lebensmittel-Symbole und Favoriten bleiben darunter erhalten. Keine automatische Cloud- oder GPT-Übertragung.</small></section>`;
}
