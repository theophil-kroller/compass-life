/** Minimal, no-network local mensa journal & Today helpers. Heavy seed/GPT UI loads only in Insights. */
import {addNutrition,ensureJournal} from './personal-journal-v5692.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateOK=d=>/^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(d)&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const stableId=date=>`mensa-stremayrgasse-study-${date}`;
export function mensaOffer(state,date){return state?.mensaCatalog?.entries?.find(x=>x?.menuDate===date&&x?.id===stableId(date)&&!x.deleted)||null;}
export function mergeMensaCatalog(a={},b={}){
 const m=new Map();for(const j of [a,b])for(const e of (Array.isArray(j?.entries)?j.entries:[])){
   if(!e?.id||!dateOK(e.menuDate)||e.id!==stableId(e.menuDate))continue;
   const prev=m.get(e.id);
   if(!prev||String(e.updatedAt||'')>String(prev.updatedAt||'')||(e.updatedAt===prev.updatedAt&&Number(e.catalogVersion||0)>Number(prev.catalogVersion||0)))m.set(e.id,e);
 }
 return {schemaVersion:1,seedImported:Boolean(a?.seedImported||b?.seedImported),entries:[...m.values()].sort((x,y)=>x.menuDate.localeCompare(y.menuDate))};
}

export function mensaConsumed(state,date){
 const day=date;
 return (state?.nutritionJournal?.entries||[]).some(e=>!e.deleted&&typeof e.at==='string'&&new Date(e.at).toLocaleDateString('sv-SE',{timeZone:'Europe/Vienna'})===day&&
  (e.catalogOfferId===stableId(day)||e.foodId==='mensa-study-veggie'));
}
export function logMensaMeal(state,date,at=new Date().toISOString()){
 const offer=mensaOffer(state,date);if(!offer)throw Error('Für diesen Tag ist kein Study-Teller im Katalog.');
 if(mensaConsumed(state,date))return {added:false,reason:'already'};
 ensureJournal(state);
 const kcal=offer.nutrientEstimates?.energyKcal;
 const foodId=`mensa-menu-${date}-v${offer.catalogVersion}`;
 if(!state.nutritionJournal.customFoods.some(f=>f.id===foodId)){
   state.nutritionJournal.customFoods.push({id:foodId,title:offer.title,emoji:'🥗',group:'Mahlzeiten',defaultAmount:'1 Study-Teller',
    kcalLow:kcal?.min??null,kcalHigh:kcal?.max??null,source:'mensa-catalog-snapshot',catalogOfferId:offer.id,catalogVersion:offer.catalogVersion});
 }
 const logged=addNutrition(state,{foodId,at,amount:'1 Study-Teller',note:'Mensa Rooftop · grobe Nährwertschätzung'});
 logged.catalogOfferId=offer.id;logged.catalogVersion=offer.catalogVersion;logged.consumedAt=at;
 logged.menuSnapshot=structuredClone({title:offer.title,menuDate:offer.menuDate,venueId:offer.venueId,nutrientEstimates:offer.nutrientEstimates,
    dailyDozenCandidateCategories:offer.dailyDozenCandidateCategories,antiAgingEightCandidateTopics:offer.antiAgingEightCandidateTopics,
    evidence:offer.evidence});
 return {added:true,entry:logged};
}

const viennaDay=(date=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Vienna',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const daysAhead=(day,count=5)=>Array.from({length:count},(_,i)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);});
export function mensaResearchReminder(state,today=viennaDay()){
 const weekdays=daysAhead(today,10).filter(d=>{const w=new Date(d+'T12:00:00Z').getUTCDay();return w!==0&&w!==6;}).slice(0,3);
 const missing=weekdays.filter(d=>!mensaOffer(state,d));return {missing,needsResearch:missing.length>0};
}
export function mensaTodayButton(state,now=new Date()){
 const day=viennaDay(now),hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Vienna',hour:'2-digit',hourCycle:'h23'}).format(now)),offer=mensaOffer(state,day);
 const eaten=mensaConsumed(state,day);if(eaten)return '';const reminder=mensaResearchReminder(state,day);
 // Compact GTD-safe markup. No imports, no network requests, no automatic journal entries.
 if(hour>=11&&hour<14&&offer)return `<div class="mensa-today-chip" aria-label="Mensa Rooftop Mittagessen"><span>🥗 <b>Mensa heute</b> · ${esc(offer.title)}</span><button type="button" data-action="mensa-eat-today">Study-Teller gegessen ✓</button></div>`;
 if(reminder.needsResearch)return `<div class="mensa-today-chip mensa-today-reminder"><span>🍽️ Mensa Rooftop · Speisepläne ${reminder.missing.length} Werktag(e) offen</span><button type="button" data-action="mensa-open-insights">Menü-Recherche →</button></div>`;
 return '';
}
