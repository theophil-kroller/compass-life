/** Compass 0.5.77.59.30 — evidence-first Daily Dozen (NutritionFacts.org).
 * Read-only derivation from locally decrypted nutrition journal; never infers
 * unrecorded meals or makes medical, longevity or anti-aging predictions.
 */
export const DAILY_DOZEN_5930=Object.freeze([
  {id:'legumes',label:'Hülsenfrüchte',icon:'🫘',goal:3,example:'½ Tasse gekochte Bohnen, Linsen oder Tofu'},
  {id:'berries',label:'Beeren',icon:'🫐',goal:1,example:'½ Tasse frisch oder tiefgekühlt'},
  {id:'fruits',label:'Übriges Obst',icon:'🍎',goal:3,example:'1 mittelgroßes Stück Obst'},
  {id:'cruciferous',label:'Kreuzblütler',icon:'🥦',goal:1,example:'½ Tasse z. B. Brokkoli'},
  {id:'greens',label:'Blattgemüse',icon:'🥬',goal:2,example:'1 Tasse roh oder ½ Tasse gegart'},
  {id:'vegetables',label:'Sonstiges Gemüse',icon:'🥕',goal:2,example:'½ Tasse Gemüse'},
  {id:'flax',label:'Geschroteter Leinsamen',icon:'🌾',goal:1,example:'1 EL geschrotet'},
  {id:'nuts',label:'Nüsse & Samen',icon:'🥜',goal:1,example:'¼ Tasse Nüsse oder 2 EL Nussmus'},
  {id:'spices',label:'Kräuter & Gewürze',icon:'🌿',goal:1,example:'¼ TL Kurkuma und andere Kräuter'},
  {id:'wholegrains',label:'Vollkorn',icon:'🍞',goal:3,example:'1 Scheibe Vollkornbrot oder ½ Tasse gegarte Vollkorngetreide'},
  {id:'beverages',label:'Getränke',icon:'💧',goal:5,example:'5 × ca. 350 ml Wasser oder ungesüßter Tee'},
  {id:'exercise',label:'Bewegung',icon:'🚶',goal:1,example:'90 Minuten moderat oder 40 Minuten intensiv'}
]);
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const nonnegative=x=>finite(x)&&x>=0;
const safeDay=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x);
const num=x=>Number(String(x).replace(',','.'));
const gramAmount=(str,defaultG)=>{const m=String(str||'').match(/(\d+(?:[.,]\d+)?)\s*g\b/i);return m?num(m[1]):defaultG;};
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function quantities(food,amount){
 const id=String(food?.id||'');
 const original=String(amount||food?.defaultAmount||'');
 const fromNames=(word,fallback)=>{const m=original.match(new RegExp('(\\d+(?:[.,]\\d+)?)\\s*g\\s*'+word+'\\b','i'));return m?num(m[1]):fallback;};
 const units={};
 const add=(key,amount)=>{if(nonnegative(amount)&&amount>0)units[key]=(units[key]||0)+amount;};
 if(id==='apple'){const m=original.match(/(\d+(?:[.,]\d+)?)\s*(?:stück|äpfel|apfel)/i);add('fruits',m?num(m[1]):1);}
 if(id==='dried-mango')add('fruits',gramAmount(original,200)/40);
 if(id==='peanuts'||id==='mixed-nuts')add('nuts',gramAmount(original,30)/30);
 if(id==='koro-pistachio-puree'||id==='koro-black-tahini')add('nuts',gramAmount(original,15)/30);
 if(id==='lyttos-pistachio-breakfast'||id==='lyttos-tahini-breakfast')add('nuts',fromNames(id==='lyttos-pistachio-breakfast'?'pistazienmus':'tahini',15)/30);
 if(id==='bio-kornbrot'||id==='dark-bread-butter'||id==='bread-cheese'){
  const piece=original.match(/(\d+(?:[.,]\d+)?)\s*(?:scheibe|stück)/i);
  add('wholegrains',piece?num(piece[1]):1);
 }
 if(id==='matcha'||id==='matcha-oat-plain')add('beverages',500/350);
 if(id==='tea-unsweetened')add('beverages',(String(original).match(/(\d+)\s*ml/)?.[1]?num(RegExp.$1):250)/350);
 if(id==='coffee')add('beverages',gramAmount(original,200)/350); // only if logged as measured ml below
 if(id==='coffee'){delete units.beverages;const m=original.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);add('beverages',(m?num(m[1]):200)/350);}
 if(id==='matcha-powder'){} // Powder alone does not prove a beverage was drunk.
 // No inference from generic mensa, unquantified smoothies, supplements, or recipes.
 return units;
}
export function dailyDozen5930(state,{day=new Date().toLocaleDateString('sv-SE')}={}){
 if(!safeDay(day))throw Error('Invalid Daily Dozen date');
 const records=(state?.nutritionJournal?.entries||[]).filter(e=>e&&!e.deleted&&typeof e.at==='string'&&Number.isFinite(Date.parse(e.at))&&localDay(e.at)===day);
 const lookup=new Map([...(state?.nutritionJournal?.customFoods||[])].map(x=>[x.id,x]));
 const totals=Object.fromEntries(DAILY_DOZEN_5930.map(x=>[x.id,0]));
 const evidence=[];
 for(const record of records){
  const food=lookup.get(record.foodId)||{id:record.foodId,defaultAmount:record.amount};
  const part=quantities(food,record.amount);
  if(Object.keys(part).length)evidence.push({id:record.id,foodId:record.foodId,part});
  for(const [key,value] of Object.entries(part))totals[key]+=value;
 }
 const rows=DAILY_DOZEN_5930.map(x=>({...x,observed:Math.min(x.goal,Math.round((totals[x.id]||0)*10)/10),raw:Math.round((totals[x.id]||0)*10)/10,covered:totals[x.id]>0}));
 const observed=rows.reduce((n,x)=>n+x.observed,0),goal=rows.reduce((n,x)=>n+x.goal,0);
 return {day,rows,entries:records.length,mapped:evidence.length,unmapped:records.length-evidence.length,observed:Math.round(observed*10)/10,goal,notObserved:rows.filter(x=>!x.covered).length,evidence,uncertainty:'Nur eindeutig erkannte und protokollierte Mengen; nicht erfasst bedeutet nicht nicht gegessen. Aktivität und Nahrungsergänzung werden nicht aus anderen Datensätzen vorgetäuscht.'};
}
function localDay(timestamp){const d=new Date(timestamp);if(!Number.isFinite(d.getTime()))return '';return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function dailyDozen5930View(model){
 const {rows,day,observed,goal,mapped,unmapped,entries}=model;
 return `<section class="dd930" aria-label="Dr. Greger Daily Dozen · dokumentierte Anteile"><header class="dd930-header"><div><small>ERNÄHRUNG · NUTRITIONFACTS.ORG</small><h3>Daily Dozen</h3><p>Dr. Gregers zwölf tägliche Orientierungskategorien · ${esc(day)}</p></div><div class="dd930-total"><strong>${observed.toLocaleString('de-AT')} / ${goal}</strong><small>dokumentierte Portionen</small></div></header><div class="dd930-grid">${rows.map(x=>`<div class="dd930-row"><div class="dd930-name"><span aria-hidden="true">${x.icon}</span><strong>${esc(x.label)}</strong><small>${x.observed.toLocaleString('de-AT')} / ${x.goal}</small></div><div class="dd930-progress" role="meter" aria-label="${esc(x.label)} protokollierte Portionen" aria-valuemin="0" aria-valuemax="${x.goal}" aria-valuenow="${x.observed}"><i style="width:${Math.round(x.observed/x.goal*100)}%"></i></div><small>${esc(x.example)}</small></div>`).join('')}</div><footer class="dd930-note"><strong>Keine Anti-Aging-Prognose.</strong> ${mapped} von ${entries} Ernährungseinträgen konnten diesen Kategorien konservativ zugeordnet werden${unmapped?`; ${unmapped} Einträge blieben bewusst unklassifiziert`:''}. Nicht erfasste Lebensmittel erscheinen nicht als gegessen. Das ist ein dokumentierter Ausschnitt, kein Urteil über Ernährung oder Gesundheit. Bewegung bitte separat beurteilen. <a href="https://nutritionfacts.org/daily-dozen/" target="_blank" rel="noopener noreferrer">Original-Checkliste</a>.</footer></section>`;
}
