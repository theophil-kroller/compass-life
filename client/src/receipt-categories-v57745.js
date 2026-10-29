/** Compass 0.5.77.45 — explainable product taxonomy for receipt purchases.
 * Original line descriptions, quantities, prices and GPT broad categories never change.
 * Corrections are stored as timestamped per-merchant/product rules in the E2EE journal.
 */
export const RECEIPT_CATEGORY_GROUPS = Object.freeze([
 ['staples','Brot & Grundnahrungsmittel','🌾'],
 ['fruit','Obst & Beeren','🍎'],
 ['vegetables','Gemüse & Salat','🥬'],
 ['legumes','Hülsenfrüchte','🫘'],
 ['dairy','Milchprodukte','🥛'],
 ['eggs','Eier','🥚'],
 ['plant-based','Pflanzliche Alternativen','🌱'],
 ['nuts','Nüsse & Samen','🥜'],
 ['oils','Öle & Würzmittel','🫒'],
 ['prepared','Fertiggerichte','🍕'],
 ['sweets','Süßes & Desserts','🍰'],
 ['snacks','Snacks & Knabbereien','🥨'],
 ['drinks','Getränke','☕'],
 ['drugstore','Drogerie & Hygiene','🧻'],
 ['household','Haushalt','🧹'],
 ['books','Bücher','📚'],
 ['unknown','Noch zu prüfen','❔']
]);
export const RECEIPT_CATEGORY_IDS=Object.freeze(RECEIPT_CATEGORY_GROUPS.map(x=>x[0]));
const LABELS=Object.freeze(Object.fromEntries(RECEIPT_CATEGORY_GROUPS.map(([id,label,icon])=>[id,{id,label,icon}])));
export const categoryInfo=id=>LABELS[id]||LABELS.unknown;
const normal=x=>String(x||'').normalize('NFKC').toLocaleLowerCase('de-AT').replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
export function receiptRuleKey(merchant,description){return `${normal(merchant).slice(0,80)}|${normal(description).slice(0,150)}`;}
const TESTS=[
 ['drugstore', /taschent|toilettenp|toilett|klopapier|kuechenroll|küchenroll|zahnpast|shampoo|seife|duschgel|hygiene|windel|kosmet/],
 ['books', /\bbücher?\b|\bbuecher?\b|\bbuch\b|\bbuech\b|\btaschenbuch\b|\bhardcover\b|\bpaperback\b|\bfachbuch\b|\blehrbuch\b|\bsachbuch\b|\bkinderbuch\b|\bhörbuch\b|\bhoerbuch\b|\bbuchhandlung\b|\bbuchladen\b|\broman\b|\bisbn\b/],
 ['household', /spülmittel|spuelmittel|waschmittel|weichspül|reinigung|müllsack|muellsack|alu\s?folie|geschirrspül|geschirrspuel/],
 ['plant-based', /haferdrink|sojadrink|mandeldrink|reisdrink|erbsendrink|pflanzendrink|vegane milch|pflanzenmilch/],
 ['legumes', /käferbohn|kaeferbohn|kichererbs|kidneybohn|linsen\b|bohnen\b|weisse bohnen|weiße bohnen/],
 ['fruit', /banan|heidelbeer|blaubeer|erdbeer|himbeer|apfel|äpfel|aepfel|orangen|birnen|trauben|kiwi|mango|mandarin|obst/],
 ['vegetables', /karotten|möhren|moehren|salatherz|salat\b|paprika|gemüse|gemuese|brokkoli|spinat|gurke|tomat|zucchini|sellerie|kohlgem|zwiebel|avocado/],
 ['eggs', /\beier\b|\bei\s?fl\b|huehnerei|hühnerei/],
 ['nuts', /erdnussmus|nussmisch|nusspack|mandeln|walnüss|walnuess|cashew|haselnuss|sesam|kürbiskern(?!öl)|kuerbiskern(?!oel)|leinsamen|pistaz/],
 ['oils', /kürbiskern\s?öl|kürbisk\.?\s?öl|kuerbiskernoel|olivenöl|olivenoel|balsam|aceto|essig|sojasauce|soja\s?sauce|gewürz|gewuerz|oregano|kurkuma|kumin|zuckerfrei.*sirup|zimt|bratöl|rapsöl/],
 ['snacks', /pringles|chips\b|knabber|salzstangen|popcorn|nachos|cracke[rn]|flips/],
 ['prepared', /stuff\.?\s?crust|pizza|lasagne|fertiggericht|fettuccine|tiefkühl\s?menü|tk\s?menü|tk\s?menu|tiefkühlpizza/],
 ['sweets', /germknödel|germknoedel|ahornsirup|schokolad|schoko\s?riegel|gummibär|gummibaer|bonbon|pralin|keks|waffel|pudding|dessert|süß|suess|eiscreme/],
 ['dairy', /jogh|jogurt|joghurt|vollmilch|esl\s?milch|bio\s?butter|butter\s?250|topfen|quark|käse|kaese|mozzarella|sauerrahm|sahne|obers\b|skyr/],
 ['staples', /brot|brezel|semmel|brötchen|broetchen|reis\b|nudeln|pasta|dinkel|vollkorn|haferflock|mehl|couscous|bulgur|kartoffel/],
 ['drinks', /mineralwasser|wasserflasche|cola\b|kaffee|espresso|tee\b|limonade|saft\b|orangensaft|fruchtsaft|energy\s?drink|sirup\s?drink/]
];
/** Return category and evidence. Ambiguous merchant abbreviations stay unresolved. */
export function suggestReceiptCategory(item){
 const source=normal(item?.description);
 if(!source)return {category:'unknown',confidence:'low',reason:'Produktname fehlt'};
 for(const [id,re] of TESTS)if(re.test(source))return {category:id,confidence:'high',reason:'Produktname erkannt'};
 const broad=normal(item?.category);
 if(broad==='drogerie')return {category:'drugstore',confidence:'medium',reason:'GPT-Oberkategorie'};
 if(broad==='bücher'||broad==='buecher'||broad==='buch')return {category:'books',confidence:'medium',reason:'GPT-Oberkategorie'};
 if(broad==='haushalt')return {category:'household',confidence:'medium',reason:'GPT-Oberkategorie'};
 if(broad==='getränke'||broad==='getraenke')return {category:'drinks',confidence:'medium',reason:'GPT-Oberkategorie'};
 return {category:'unknown',confidence:'low',reason:'Keine eindeutige Produktregel'};
}
export function receiptCategoryForItem(state,receipt,item){
 const key=receiptRuleKey(receipt?.merchant,item?.description);
 const rule=state?.receiptJournal?.categoryRules?.[key];
 if(rule&&RECEIPT_CATEGORY_IDS.includes(rule.category)&&rule.category!=='auto')return {category:rule.category,confidence:'manual',reason:'Manuell gespeichert',key};
 return {...suggestReceiptCategory(item),key};
}
/** One corrected product designation is reused on later receipts from this merchant. */
export function setReceiptCategory(state,{receiptId,index,category}){
 if(!state||!RECEIPT_CATEGORY_IDS.includes(category)&&category!=='auto')throw Error('Ungültige Kategorie');
 const r=state.receiptJournal?.entries?.find(x=>x.id===receiptId&&!x.deleted);
 if(!r)throw Error('Bon existiert nicht mehr.');
 const i=Number(index);if(!Number.isInteger(i)||i<0||i>=r.items.length)throw Error('Bonposition nicht vorhanden.');
 const key=receiptRuleKey(r.merchant,r.items[i].description);
 state.receiptJournal.categoryRules??={};
 state.receiptJournal.categoryRules[key]={category,updatedAt:new Date().toISOString()};
 return {key,category,affected:state.receiptJournal.entries.reduce((n,rr)=>n+(!rr.deleted&&normal(rr.merchant)===normal(r.merchant)?rr.items.filter(x=>receiptRuleKey(rr.merchant,x.description)===key).length:0),0)};
}
export function mergeReceiptCategoryRules(a={},b={}){
 const out={};for(const [key,value] of Object.entries(a||{})){if(RECEIPT_CATEGORY_IDS.includes(value?.category)||value?.category==='auto')out[key]=value;}
 for(const [key,value] of Object.entries(b||{})){
  if(!RECEIPT_CATEGORY_IDS.includes(value?.category)&&value?.category!=='auto')continue;
  const prev=out[key];if(!prev||String(value.updatedAt||'')>String(prev.updatedAt||'')||(String(value.updatedAt||'')===String(prev.updatedAt||'')&&String(value.category)>String(prev.category)))out[key]=value;
 }
 return out;
}
