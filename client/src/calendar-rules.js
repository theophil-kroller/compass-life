// Compass 0.4.8: local-first, editable title classification. No calendar title goes to Compass API.
// Rules are copied into the encrypted vault only once the user edits them.
const entry=(id,label,emoji,category,terms,exclude='')=>({id,label,emoji,category,terms,exclude,enabled:true});
export const DEFAULT_CALENDAR_RULES=Object.freeze([
 entry('birthday','Geburtstag','🎂','Soziales','geburtstag,birthday,bday'),
 entry('sauna','Sauna','🧖','Erholung','sauna,saunieren'),
 entry('thermal','Therme & Wellness','♨️','Erholung','therme,thermalbad,spa,wellness'),
 entry('scuba','Tauchen','🤿','Erholung','scuba,scuba diving,diving,tauchen,tauchgang,schnorcheln,snorkeling','no flying,high altitude,flugverbot,nach dem tauchen,after diving'),
 entry('biking','Radfahren','🚴','Erholung','bike,biking,cycling,radfahren,radtour,fahrrad,mountainbike,mtb,bike ride'),
 entry('dance','Tanzen & Zouk','💃','Erholung','zouk,dance,dancing,tanz,tanzen,salsa,bachata,kizomba'),
 entry('hiking','Wandern','🥾','Erholung','wandern,wanderung,hiking,hike,trekking'),
 entry('skiing','Ski & Schnee','🎿','Erholung','skifahren,skiing,skiurlaub,snowboard,langlauf'),
 entry('vacation','Urlaub & Auszeit','🌴','Erholung','urlaub,vacation,holiday,ferien,zeitausgleich,auszeit,retreat'),
 entry('gym','Training & Gym','🏋️','Erholung','gym,training,fitness,stronglifts,workout,krafttraining'),
 entry('swim','Schwimmen','🏊','Erholung','schwimmen,swimming,pool,freibad'),
 entry('yoga','Yoga & Meditation','🧘','Erholung','yoga,meditation,pilates,breathwork'),
 entry('massage','Massage','💆','Erholung','massage,massagetermin'),
 entry('surf','Surfen','🏄','Erholung','surfen,surfing,surf session'),
 entry('nature','Natur & Spaziergang','🌿','Erholung','spaziergang,spazieren,nature walk'),
 entry('culture','Kultur & Konzert','🎭','Freizeit','theater,kino,konzert,concert,musical,museum,opera'),
 entry('friends','Freunde treffen','☕','Soziales','brunch,frühstück mit,kaffee mit,coffee with')
]);
export const CALENDAR_CATEGORIES=['Erholung','Freizeit','Soziales','Arbeit','Neutral'];
export const DEFAULT_EVENT_ICON='📅';
const split=value=>String(value||'').split(/[,;\n]/).map(x=>x.trim()).filter(Boolean);
const escapeRegExp=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const normalize=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de');
// Match entire words or phrases, never arbitrary substrings (rad must not match Beratung).
export function containsTerm(text,term){
 const normalized=normalize(text),needle=normalize(term).trim();
 if(!needle)return false;
 return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(needle)}(?=$|[^\\p{L}\\p{N}])`,'u').test(normalized);
}
export function classifyCalendarEvent(event,rules=DEFAULT_CALENDAR_RULES,overrides={}){
 const id=String(event?.id||'');
 const title=String(event?.summary||'');
 const override=overrides?.[id]||{};
 const matched=(Array.isArray(rules)?rules:DEFAULT_CALENDAR_RULES).find(rule=>rule?.enabled!==false && split(rule.terms).some(term=>containsTerm(title,term)) && !split(rule.exclude).some(term=>containsTerm(title,term)));
 return {category:override.category||matched?.category||'Neutral',emoji:override.emoji||matched?.emoji||DEFAULT_EVENT_ICON,ruleId:matched?.id||null,hidden:override.hidden===true,displayTitle:override.title?.trim()||title};
}
export function effectiveCalendarRules(state){return Array.isArray(state?.calendarRules)?state.calendarRules:DEFAULT_CALENDAR_RULES.map(r=>({...r}));}
export function validCalendarRule(rule){return Boolean(rule&&typeof rule.id==='string'&&/^[\w-]{1,80}$/.test(rule.id)&&typeof rule.label==='string'&&rule.label.trim().length>0&&rule.label.length<=70&&typeof rule.emoji==='string'&&rule.emoji.length>0&&[...rule.emoji].length<=8&&CALENDAR_CATEGORIES.includes(rule.category)&&typeof rule.terms==='string'&&rule.terms.length<=500&&split(rule.terms).length>0&&typeof (rule.exclude||'')==='string'&&String(rule.exclude||'').length<=300&&typeof rule.enabled==='boolean');}
export function validCalendarOverride(entry){return Boolean(entry&&(!entry.category||CALENDAR_CATEGORIES.includes(entry.category))&&(!entry.emoji||(typeof entry.emoji==='string'&&[...entry.emoji].length<=8))&&(!entry.title||(typeof entry.title==='string'&&entry.title.length<=180))&&typeof entry.hidden==='boolean');}
export function visibleCalendarEventsForDay(events,day,rules,overrides={},showHidden=false,showBlocks=false){
 return events.filter(e=>calendarEventDay(e)===day&&e.status!=='cancelled'&&(showBlocks||!isRoutineCalendarBlock(e))&&(showHidden||!classifyCalendarEvent(e,rules,overrides).hidden))
 .sort((a,b)=>(a.start?.dateTime||a.start?.date||'').localeCompare(b.start?.dateTime||b.start?.date||''));
}
export function calendarEventDay(e){const value=e?.start?.dateTime;if(value){const d=new Date(value);if(!Number.isNaN(+d))return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}return (e?.start?.date||'').slice(0,10);}
export function isRoutineCalendarBlock(e){return /^(work|research blocker)$/i.test(String(e?.summary||'').trim());}
