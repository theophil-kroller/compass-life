/** Compass .40.25.12 · On-demand Rooftop menu catalog. No external requests from quick tap or Today. */
import {MENSA_SEED} from './mensa-seed-v57759402511.js';
import {mensaOffer,mergeMensaCatalog,mensaConsumed,logMensaMeal,mensaResearchReminder,mensaTodayButton} from './mensa-journal-v57759402512.js';
export {mensaOffer,mergeMensaCatalog,mensaConsumed,logMensaMeal,mensaResearchReminder,mensaTodayButton};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateOK=d=>/^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(d)&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const maxlen=(s,n=500)=>String(s??'').trim().slice(0,n);
const ranges=['energyKcal','protein','carbohydrates','fat','fiber','saturatedFat','sugar','salt'];
const isObj=x=>x&&typeof x==='object'&&!Array.isArray(x);
const textArray=(xs,n=50)=>Array.isArray(xs)?xs.filter(x=>typeof x==='string').slice(0,n).map(x=>maxlen(x,200)):[];
const stableId=(date,venue='mensa-tu-graz-stremayrgasse')=>`mensa-stremayrgasse-study-${date}`;
const clamp=(n,limit=2500)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=limit?n:null;
function normalizeRange(v,key){
 if(v==null)return null;
 if(!isObj(v))throw Error(`Nährwert ${key}: min und max benötigt.`);
 const min=clamp(v.min,key==='energyKcal'?6000:1000),max=clamp(v.max,key==='energyKcal'?6000:1000);
 if(min===null||max===null||min>max)throw Error(`Nährwert ${key}: ungültige Bandbreite.`);
 return {min,max,unit:key==='energyKcal'?'kcal':'g',confidence:['high','medium','low'].includes(v.confidence)?v.confidence:'low',not_measured:true};
}
export function normalizeMensaOffer(x){
 if(!isObj(x))throw Error('Menü muss ein JSON-Objekt sein.');
 const date=maxlen(x.menuDate||x.date,10),title=maxlen(x.title,180);
 if(!dateOK(date)||!title)throw Error('Menü braucht ein gültiges lokales Datum und einen Gerichttitel.');
 if(x.timezone&&x.timezone!=='Europe/Vienna')throw Error('Menü-Datum muss Europe/Vienna verwenden.');
 if(x.venueId&&x.venueId!=='mensa-tu-graz-stremayrgasse')throw Error('Falscher Mensa-Standort. Nur Rooftop Stremayrgasse.');
 const estimates=x.nutrientEstimates||x.estimates||{};
 if(!isObj(estimates))throw Error('nutrientEstimates muss ein Objekt sein.');
 const nutrients={};for(const key of ranges)nutrients[key]=normalizeRange(estimates[key]??null,key);
 const src=isObj(x.evidence)?x.evidence:{};
 const url=maxlen(src.sourceUrl||x.sourceUrl,1000);
 if(url&&!/^https:\/\/[^\s<>"']+$/i.test(url))throw Error('Quelllink muss eine HTTPS-Adresse sein.');
 if(x.menuStatus==='confirmed_from_published_menu'&&!url)throw Error('Bestätigtes Menü braucht einen prüfbaren HTTPS-Quellenlink.');
 const candidateEvidence=textArray(x.dailyDozenCandidateCategories||x.candidateDailyDozen);
 const antiAging=textArray(x.antiAgingEightCandidateTopics||x.candidateAntiAgingEight);
 const portion=clamp(x.portionGrams,3000),price=clamp(x.priceActualStudyEuro,50),standard=clamp(x.priceStandardEuro,50);
 return {id:stableId(date),venueId:'mensa-tu-graz-stremayrgasse',menuDate:date,timezone:'Europe/Vienna',offerId:'veggie-study',
   offerLabel:maxlen(x.offerLabel||'VEGGIE / VEGAN · STUDY TELLER',100),title,description:maxlen(x.description,1000),
   ingredientsNamedInMenu:textArray(x.ingredientsNamedInMenu||x.ingredients,50),portionGrams:portion,
   ingredientWeightsGrams:isObj(x.ingredientWeightsGrams)?Object.fromEntries(Object.entries(x.ingredientWeightsGrams).slice(0,40).filter(([_,v])=>clamp(v,2500)!==null)):null,
   priceStandardEuro:standard,priceActualStudyEuro:price,
   allergens:textArray(x.allergens,30),
   nutrientEstimates:{...nutrients,status:'estimated_not_measured',method:maxlen(estimates.method||'modelled_recipe_estimate',120),
    missing:textArray(estimates.missing,30),displayWarning:maxlen(estimates.displayWarning||'Nährwerte sind Schätzungen, keine bestätigten Mensa-Werte.',300),
    micronutrients:isObj(estimates.micronutrients)?estimates.micronutrients:{}},
   dailyDozenCandidateCategories:candidateEvidence,dailyDozenConfirmedServings:{},
   antiAgingEightCandidateTopics:antiAging,antiAgingEightConfirmedEvidence:{},
   evidence:{sourceType:maxlen(src.sourceType||'web_research',80),sourceUrl:url,retrievedOn:maxlen(src.retrievedOn||x.retrievedOn,30),sourceClaimsOnly:maxlen(src.sourceClaimsOnly,300)},
   menuStatus:['confirmed_from_published_menu','estimated_from_source','unverified'].includes(x.menuStatus)?x.menuStatus:'unverified',
   confidence:isObj(x.confidence)?x.confidence:{menu:url?'medium':'low',nutrientEstimate:'low'},
   updatedAt:maxlen(x.updatedAt||'',40),catalogVersion:1};
}
export function parseMensaJSON(raw){
 if(typeof raw!=='string'||raw.length>500000)throw Error('JSON zu groß.');
 let json;try{json=JSON.parse(raw.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,''));}catch{throw Error('Ungültiges JSON. Bitte GPT um reines JSON bitten.');}
 const rows=Array.isArray(json)?json:Array.isArray(json?.entries)?json.entries:Array.isArray(json?.menus)?json.menus:[json];
 if(!rows.length||rows.length>35)throw Error('Bitte 1 bis 35 Menüs auf einmal importieren.');
 const menus=rows.map(normalizeMensaOffer);if(new Set(menus.map(x=>x.id)).size!==menus.length)throw Error('Mehrere unterschiedliche Angebote für denselben Tag. Bitte Duplikate klären.');
 return menus;
}
export function installMensaSeed(state){
 if(state.mensaCatalog?.seedImported)return false;
 const initial=MENSA_SEED.entries.map(x=>({...normalizeMensaOffer(x),updatedAt:'2026-10-29T00:00:00.000Z'}));
 state.mensaCatalog=mergeMensaCatalog(state.mensaCatalog,{schemaVersion:1,seedImported:true,entries:initial});return true;
}
export function importMensaOffers(state,rows,at=new Date().toISOString()){
 if(!Array.isArray(rows)||!rows.length||rows.length>35)throw Error('Keine gültige Importvorschau.');
 const current=state.mensaCatalog||{schemaVersion:1,entries:[]};let added=0,updated=0,unchanged=0;
 const byId=new Map((current.entries||[]).map(x=>[x.id,x]));
 for(const raw of rows){const r=normalizeMensaOffer(raw),prev=byId.get(r.id);
   if(prev){const {updatedAt:ignoredStamp,catalogVersion:ignoredVersion,...previousData}=prev;
    const {updatedAt:ignoredNext,catalogVersion:ignoredNextVersion,...nextData}=r;
    if(JSON.stringify(previousData)===JSON.stringify(nextData)){unchanged++;continue;}updated++;
   }else{added++;}
   byId.set(r.id,{...r,updatedAt:at,catalogVersion:(prev?.catalogVersion||0)+1});
 }
 state.mensaCatalog={schemaVersion:1,seedImported:Boolean(current.seedImported),entries:[...byId.values()].sort((a,b)=>a.menuDate.localeCompare(b.menuDate))};
 return {added,updated,unchanged};
}
const viennaDay=(date=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Vienna',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const daysAhead=(day,count=5)=>Array.from({length:count},(_,i)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);});
const showKcal=o=>{const k=o?.nutrientEstimates?.energyKcal;return k?`${k.min}–${k.max} kcal (geschätzt)`:'kcal noch unbekannt';};
export const MENSA_GPT_PROMPT=`Du recherchierst als präziser Menü- und Ernährungsdaten-Assistent. Suche AKTUELL im Internet das Wochenmenü des Standorts \"Mensa Rooftop\" / \"Mensa TU Graz Stremayrgasse\" in Graz (NICHT Inffeldgasse). Ermittle den veganen/vegetarischen \"Study-Teller\" für jeden veröffentlichten Werktag der aktuellen und kommenden Kalenderwoche (Europe/Vienna). Verwende zuerst offizielle Mensa-/TU-Graz-Seiten, ersatzweise klar dokumentierte Speiseplan-Aggregatoren. Schreibe die bestätigten Original-Gerichtnamen, Angaben zu Zutaten, Allergenen und Preisen mit exakter HTTPS-Quellenadresse und Abrufdatum. Preise für Standard und Study getrennt. Erfinde keine Speisen oder Preise; fehlende Tage NICHT erfinden. Schätze für eine typische Portion Zutaten und Gramm-Mengen transparent und konservativ; Nährstoffe als Bandbreiten mit min/max für energyKcal, protein, carbohydrates, fat, fiber, saturatedFat, sugar, salt. Einheit energyKcal=kcal, übrige=g. Wenn unbekannt: null, niemals 0. Mikronährstoffe nur bei belastbarer Zutatenbasis, sonst {}. Daily Dozen und Anti-Aging Eight sind nur KANDIDATEN, keine bestätigten Tagesportionen. Nutzer hat durch einen Speiseplan nichts gegessen. Gib ausschließlich gültiges JSON zurück, kein Markdown. Schema: {"format":"compass-mensa-catalog-v1","venueId":"mensa-tu-graz-stremayrgasse","timezone":"Europe/Vienna","entries":[{"menuDate":"YYYY-MM-DD","venueId":"mensa-tu-graz-stremayrgasse","timezone":"Europe/Vienna","offerId":"veggie-study","title":"Originalmenütitel","description":"originale Beschreibung","offerLabel":"VEGGIE / VEGAN · STUDY TELLER","ingredientsNamedInMenu":[],"ingredientWeightsGrams":null,"portionGrams":null,"priceStandardEuro":null,"priceActualStudyEuro":null,"allergens":[],"menuStatus":"confirmed_from_published_menu","evidence":{"sourceType":"official_menu","sourceUrl":"https://...","retrievedOn":"YYYY-MM-DD","sourceClaimsOnly":"Originaltitel, Allergene, Preis etc."},"nutrientEstimates":{"method":"typical_recipe_estimate","energyKcal":{"min":480,"max":770,"confidence":"low"},"protein":{"min":12,"max":30,"confidence":"low"},"carbohydrates":null,"fat":null,"fiber":null,"saturatedFat":null,"sugar":null,"salt":null,"micronutrients":{},"missing":["Portionsgröße","Rezeptur"]},"dailyDozenCandidateCategories":[],"antiAgingEightCandidateTopics":[]}]} . Verwende die Zahlen im Beispielschema NICHT als Standardwerte: Schätze jedes Gericht individuell aus Zutaten und Portion. Schätze nur für Gerichte, die tatsächlich mit Quelle auffindbar sind. Prüfe, dass die Werte physikalisch plausibel sind. Ergänze jede Woche neu, keine externen Schreibzugriffe.`;
export function mensaCatalogPanel(state,{draft=null,day=viennaDay(),status=''}={}){
 const rows=Array.isArray(state?.mensaCatalog?.entries)?state.mensaCatalog.entries:[];
 const selected=daysAhead(day,7).map(d=>mensaOffer(state,d)).filter(Boolean);
 const reminder=mensaResearchReminder(state,day);
 return `<section class="mensa-panel" aria-label="Mensa Rooftop Menü-Datenbank"><header><div><small>MENSA ROOFTOP · STREMAYRGASSE · LOKAL VERSCHLÜSSELT</small><h3>Study-Teller · Menü-Datenbank</h3><p>Nur hier: Menübestand prüfen und GPT-Recherche importieren. Der Study-Teller-Button liest bereits gespeicherte Daten, ohne Suche oder Cloud-Abfrage.</p></div><span class="mensa-count">${rows.length} Tage gespeichert</span></header>
 ${status?`<p class="mensa-status">${esc(status)}</p>`:''}
 ${reminder.needsResearch?`<p class="mensa-reminder">Für ${reminder.missing.length} der nächsten drei Werktage fehlen Menüdaten. Neue Woche mit GPT recherchieren und importieren.</p>`:''}
 <div class="mensa-menu-list">${selected.map(o=>`<article><time>${esc(o.menuDate)}</time><strong>${esc(o.title)}</strong><small>${showKcal(o)} · ${o.menuStatus==='confirmed_from_published_menu'?'Menüquelle geprüft':'Menüquelle prüfen'}</small>${o.evidence?.sourceUrl?`<a href="${esc(o.evidence.sourceUrl)}" rel="noopener noreferrer" target="_blank">Quelle</a>`:''}</article>`).join('')||'<p>Für die nächsten Tage liegen noch keine recherchierten Gerichte vor.</p>'}</div>
 <details class="mensa-archive"><summary>Gespeicherte Menüs (${rows.length}) ansehen</summary><div class="mensa-archive-list">${rows.map(o=>`<div><time>${esc(o.menuDate)}</time><span>${esc(o.title)} · ${showKcal(o)}</span></div>`).join('')}</div></details>
 <div class="mensa-research"><h4>1 · GPT recherchiert Menüs und schätzt Nährwerte</h4><p>Rechercheprompt kopieren, in ChatGPT einfügen und für die gewünschte Woche ausführen.</p><textarea id="mensa-gpt-prompt" readonly rows="5">${esc(MENSA_GPT_PROMPT)}</textarea><button type="button" data-action="mensa-copy-prompt">GPT-Rechercheprompt kopieren</button></div>
 <div class="mensa-import"><h4>2 · JSON prüfen und importieren</h4><form id="mensa-import-form"><label for="mensa-json-input">Antwort-JSON von GPT</label><textarea name="json" id="mensa-json-input" rows="6" placeholder='{"format":"compass-mensa-catalog-v1","entries":[...]}' required></textarea><button type="submit">JSON prüfen · noch nicht speichern</button></form></div>
 ${draft?.length?`<div class="mensa-preview"><h4>Importvorschau · ${draft.length} Menüs</h4>${draft.map(o=>`<div><b>${esc(o.menuDate)}</b> · ${esc(o.title)}<small>${showKcal(o)} · ${o.evidence?.sourceUrl?`Quelle: ${esc(o.evidence.sourceUrl)}`:'⚠ Quellenlink fehlt'}</small></div>`).join('')}<button type="button" data-action="mensa-confirm-import">${draft.length} geprüfte Menüs importieren</button> <button type="button" data-action="mensa-cancel-import">Verwerfen</button></div>`:''}
 <p class="mensa-disclaimer">Nährwertspannen sind modellbasierte Schätzungen, keine Messwerte. Menüimport erzeugt keine konsumierten Mahlzeiten, keine Daily-Dozen-Häkchen und keine rückwirkenden Änderungen an bereits erfassten Gerichten.</p></section>`;
}
