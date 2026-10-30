import {dailyDozenIngredientEvidence404} from './daily-dozen-evidence-v57759404.js';
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
 // Conservative portions for explicitly logged sides; dressing is never treated as vegetables.
 if(id==='krautsalat')add('cruciferous',gramAmount(original,150)/150);
 if(id==='stangenbohnensalat')add('vegetables',gramAmount(original,150)/150);
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
/** Only observed, dated activities. Duration expressed in seconds, milliseconds,
 * or minutes as indicated by its actual field. Avoid treating arbitrary numbers as minutes. */
export function dailyDozenExerciseMinutes(state,day){
 const candidates=[...(state?.healthImports?.garminSessions||[]),...(state?.healthImports?.garminActivities||[]),...(state?.activities?.entries||[])];
 const seen=new Set();let moderate=0,vigorous=0;
 for(const r of candidates){if(!r||r.deleted)continue;
  const at=String(r.start||r.startedAt||r.at||r.day||'');if(!at)continue;
  if((at.length===10?at:localDay(at))!==day)continue;
  const id=String(r.id||r.activityId||r.start||JSON.stringify([at,r.durationMinutes,r.type]));if(seen.has(id))continue;seen.add(id);
  const m=Number.isFinite(r.durationMinutes)?r.durationMinutes:Number.isFinite(r.elapsedMinutes)?r.elapsedMinutes:Number.isFinite(r.durationSeconds)?r.durationSeconds/60:Number.isFinite(r.durationMs)?r.durationMs/60000:null;
  if(m===null||m<=0||m>720)continue;
  const text=String(r.type||r.sport||r.activityType||r.name||'').toLowerCase();
  if(/strength|weight|running|laufen|interval|hiit|sport|swim|schwimm/.test(text))vigorous+=m;
  else moderate+=m; // Unknown intensity is displayed only as a conservative duration fraction.
 }
 return {moderate:Math.round(moderate*10)/10,vigorous:Math.round(vigorous*10)/10};
}
export function dailyDozen5930(state,{day=new Date().toLocaleDateString('sv-SE')}={}){
 if(!safeDay(day))throw Error('Invalid Daily Dozen date');
 const records=(state?.nutritionJournal?.entries||[]).filter(e=>e&&!e.deleted&&typeof e.at==='string'&&Number.isFinite(Date.parse(e.at))&&localDay(e.at)===day);
 // The same evidence ledger feeds the historic 12-category tracker and Anti-Aging Eight.
 const ledger=dailyDozenIngredientEvidence404(state,day);
 const aliases={legumes:'beans',fruits:'fruit'};
 const totals=Object.fromEntries(DAILY_DOZEN_5930.map(x=>[x.id,ledger.totals[aliases[x.id]||x.id]||0]));
 const exercise=dailyDozenExerciseMinutes(state,day);totals.exercise=Math.min(1,exercise.moderate/90+exercise.vigorous/40);
 const evidence=ledger.sources.map(x=>({id:x.id,category:x.category,source:x.source,portion:x.portion,grams:x.grams}));
 const mappedIds=new Set(ledger.sources.map(x=>x.id));
 const rows=DAILY_DOZEN_5930.map(x=>({...x,observed:Math.min(x.goal,Math.round((totals[x.id]||0)*10)/10),raw:Math.round((totals[x.id]||0)*10)/10,covered:totals[x.id]>0}));
 const observed=rows.reduce((n,x)=>n+x.observed,0),goal=rows.reduce((n,x)=>n+x.goal,0);
 return {day,rows,entries:records.length,mapped:mappedIds.size,unmapped:Math.max(0,records.length-mappedIds.size),observed:Math.round(observed*10)/10,goal,notObserved:rows.filter(x=>!x.covered).length,evidence,exercise,uncertainty:'Nur eindeutig protokollierte Mengen und datierte Aktivitäten. Fehlende Intensität wird konservativ als moderat gewertet; nicht erfasst bedeutet nicht nicht durchgeführt.'};
}
function localDay(timestamp){const d=new Date(timestamp);if(!Number.isFinite(d.getTime()))return '';return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function dailyDozen5930View(model){
 const {rows,day,observed,goal,mapped,unmapped,entries}=model;
 return `<section class="dd930" aria-label="Dr. Greger Daily Dozen · dokumentierte Anteile"><header class="dd930-header"><div><small>ERNÄHRUNG · NUTRITIONFACTS.ORG</small><h3>Daily Dozen</h3><p>Dr. Gregers zwölf tägliche Orientierungskategorien · ${esc(day)}</p></div><div class="dd930-total"><strong>${observed.toLocaleString('de-AT')} / ${goal}</strong><small>dokumentierte Portionen</small></div></header><div class="dd930-grid">${rows.map(x=>`<div class="dd930-row"><div class="dd930-name"><span aria-hidden="true">${x.icon}</span><strong>${esc(x.label)}</strong><small>${x.observed.toLocaleString('de-AT')} / ${x.goal}</small></div><div class="dd930-progress" role="meter" aria-label="${esc(x.label)} protokollierte Portionen" aria-valuemin="0" aria-valuemax="${x.goal}" aria-valuenow="${x.observed}"><i style="width:${Math.round(x.observed/x.goal*100)}%"></i></div><small>${esc(x.example)}${x.id==='exercise'&&model.exercise?` · ${model.exercise.moderate} min moderat / ${model.exercise.vigorous} min intensiv dokumentiert`:''}</small></div>`).join('')}</div><footer class="dd930-note"><strong>Keine Anti-Aging-Prognose.</strong> ${mapped} von ${entries} Ernährungseinträgen konnten diesen Kategorien konservativ zugeordnet werden${unmapped?`; ${unmapped} Einträge blieben bewusst unklassifiziert`:''}. Nicht erfasste Lebensmittel erscheinen nicht als gegessen. Das ist ein dokumentierter Ausschnitt, kein Urteil über Ernährung oder Gesundheit. Bewegung basiert auf dokumentierten Tagesaktivitäten; fehlende Bewegungsdaten werden nicht zu Null geschätzt. <a href="https://nutritionfacts.org/daily-dozen/" target="_blank" rel="noopener noreferrer">Original-Checkliste</a>.</footer></section>`;
}
