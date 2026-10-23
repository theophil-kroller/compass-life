import {mergePeopleDirectory} from './people-sync-v57719.js';
import {mergeMorningData} from './miracle-morning-v570.js';
import {mergeHabitQuick} from './habit-device-sync-v5731.js';
import {mergeCalendarArchives} from './calendar-cache-v574.js';
import {energyGoalSettings,energyGoalView} from './energy-goal-v575.js';
/** Compass 0.5.69.2 – Personal Time Journal + nutrition; pure data transformations. */
export const TIME_AREAS=[
 ['work','💼','Berufliche Arbeit'],['project','🛠️','Privatprojekt'],['family','❤️','Familie & Beziehungen'],
 ['leisure','⚽','Sport & Freizeit'],['health','🌿','Gesundheit & Erholung'],['personal','🏡','Alltag'],['other','○','Unklassifiziert']
];
export const FOOD_PRESETS=[
 // Existing `matcha` ID deliberately retained: older nutrition entries remain compatible.
 // 500 ml describes the prepared drink (mostly water), not 500 ml of oat milk.
 ['matcha-oat-plain','🍵','MatchaTherapy mit Hafermilch (ohne Honig)','Frühstück','1 Becher (ca. 500 ml; 75 ml Hafermilch)',41,45],
 ['matcha','🍯','MatchaTherapy mit Hafermilch & Honig','Frühstück','1 Becher (ca. 500 ml; 75 ml Hafermilch)',62,67],
 ['oat-latte','☕','Hafermilch-Latte mit Monin Salted Caramel','Getränke','200 ml Hafermilch; 10 ml Sirup',125,140],
 ['milk-my-vay','🥛','My Vay Barista Haferdrink','Zutaten','100 ml',48,48],
 ['monin-caramel','🍮','Monin Salted Caramel Sirup','Zutaten','10 ml',32,33],
 ['matcha-powder','🍃','MatchaTherapy 30+ Matchapulver','Zutaten','1 TL (2 g)',5,9],
 ['bio-kornbrot','🍞','Zurück zum Ursprung Bio Nur-Kornbrot','Zutaten','1 Scheibe (50 g)',134,134],
 ['butter-hofer','🧈','Hofer Bio-Butter','Zutaten','10 g',72,76],
 ['smoothie','🥤','Smoothie','Getränke','1 Glas (300 ml)',120,280],['tea-unsweetened','🍵','Tee ungesüßt','Getränke','1 Tasse (250 ml)',0,5],['tea-honey','🫖','Tee mit Honig','Getränke','1 Tasse (250 ml)',20,75],
 ['turmeric','🟡','Kurkuma-Latte mit Honig','Getränke','1 Tasse (250 ml)',130,270],['coffee','☕','Kaffee','Getränke','1 Tasse (200 ml)',0,10],
 ['latella','🥛','Lattella','Getränke','500 ml',250,360],
 ['aperol-spritz','🍹','Aperol Spritz','Getränke','1 Glas (200 ml)',160,250],
 ['red-wine','🍷','Rotwein','Getränke','1 Glas (125 ml)',95,120],
 ['white-wine','🥂','Weißwein','Getränke','1 Glas (125 ml)',85,115],
 ['whiskey','🥃','Whiskey','Getränke','1 Glas (40 ml)',85,105],
 ['mensa','🍲','Mensaessen','Mahlzeiten','1 Teller',400,1000],
 ['wholegrain-toast-butter-jam','🍞','Vollkorn-Toast mit Butter & Marmelade','Frühstück','1 Stück',140,260],
 ['fried-egg','🍳','Spiegelei','Frühstück','1 Stück',95,160],
 ['dark-bread-butter','🍞','Bio Nur-Kornbrot mit Hofer Bio-Butter','Frühstück','1 Scheibe (50 g) + Butter (10 g; geschätzt)',202,214],
 ['mensa-study-veggie','🥗','Vegetarischer Study-Teller','Mahlzeiten','1 Teller',450,900],
['buffet','🍽️','Buffet / auswärts','Mahlzeiten','1 Portion',450,1100],
 ['bread-cheese','🥪','Bio Nur-Kornbrot mit Cheddar & Butter','Mahlzeiten','1 Stück',295,330],['cheddar','🧀','SPAR würziger Cheddar','Snacks','1 Scheibe (25 g; geschätzt)',102,106],
 ['cheddar-hofer','🧀','Hofer BBQ Cheddar','Snacks','1 Scheibe (33 g)',127,131],
 ['peanuts','🥜','Hofer gesalzene Erdnüsse','Snacks','1 Handvoll (30 g; geschätzt)',175,190],['mixed-nuts','🌰','MorgenLand Bio Kerniger Nuss Mix','Snacks','1 Handvoll (30 g)',193,197],
 ['dried-mango','🥭','SPAR Vital Bio-Mangohälften','Snacks','1 Packung (200 g)',590,600],['rice-pudding','🍚','S-BUDGET Milchreis Zimt · SPAR','Snacks','1 Becher (200 g)',225,230],
 ['apple','🍎','Apfel','Snacks','1 Stück',60,120],['chocolate','🍫','Schokoriegel','Snacks','1 Riegel (50 g)',220,300],
 ['snickers','🍫','Snickers','Snacks','1 Riegel (50 g)',225,275],
 ['pistachio-butter-cups','🍬','Better Pistachio Butter Cups','Snacks','3 Stück (39 g)',238,242],
 ['pringles','🥔','Pringles','Snacks','1 Dose (165 g)',830,920],
 ['chio-chips','🥔','Chio Chips','Snacks','1 Packung (150 g)',740,830],
 ['supplement-bluebonnet-one-men','💊','Bluebonnet ONE for Men · Multivitamin','Nahrungsergänzung','1 Kapsel',null,null],
 ['supplement-fuerstenmed','💊','FürstenMED Kombinationspräparat','Nahrungsergänzung','1 Kapsel',null,null],
 ['other-food','➕','Anderes','Sonstiges']
].map(([id,emoji,title,group,defaultAmount='',kcalLow=null,kcalHigh=null])=>({
 id,emoji,title,group,defaultAmount,kcalLow,kcalHigh,
 ...(id==='matcha'||id==='matcha-oat-plain'?{
  recipeNote:`1 TL Matcha (ca. 2 g), heißes Wasser, geschätzt 75 ml Hafermilch${id==='matcha'?', 1 TL Honig (ca. 7 g)':''}. Die gesamte Trinkmenge (ca. 500 ml) ist nicht die Hafermilchmenge.`
 }:{})
}));
const isoTime=x=>typeof x==='string'&&Number.isFinite(new Date(x).getTime());
export function timeLabel(k){return TIME_AREAS.find(c=>c[0]===k)?.[2]||'Unklassifiziert';}
export function timeCategoryOptions(selected='work'){
 return TIME_AREAS.map(([id,emoji,name])=>`<option value="${id}" ${selected===id?'selected':''}>${emoji} ${name}</option>`).join('');
}
export function ensureJournal(state){
 if(!state.timeJournal||typeof state.timeJournal!=='object')state.timeJournal={entries:[],overrides:{}};
 if(!Array.isArray(state.timeJournal.entries))state.timeJournal.entries=[];
 if(!state.timeJournal.overrides||typeof state.timeJournal.overrides!=='object')state.timeJournal.overrides={};
 if(!state.nutritionJournal||typeof state.nutritionJournal!=='object')state.nutritionJournal={entries:[],customFoods:[]};
 if(!Array.isArray(state.nutritionJournal.entries))state.nutritionJournal.entries=[];
 if(!Array.isArray(state.nutritionJournal.customFoods))state.nutritionJournal.customFoods=[];
 return state;
}
export function validTimeEntry(entry){
 if(!entry||!isoTime(entry.start)||!isoTime(entry.end))throw Error('Start- und Endzeit bitte vollständig eingeben.');
 const minutes=(Date.parse(entry.end)-Date.parse(entry.start))/60000;
 if(minutes<=0||minutes>2880)throw Error('Das Intervall muss zwischen 1 Minute und 48 Stunden liegen.');
 if(!TIME_AREAS.some(x=>x[0]===entry.category))throw Error('Ungültiger Lebensbereich.');
 return {...entry,id:String(entry.id||crypto.randomUUID()),category:entry.category,project:String(entry.project||'').trim().slice(0,120),title:String(entry.title||'').trim().slice(0,160),updatedAt:entry.updatedAt||new Date().toISOString(),deleted:entry.deleted===true};
}
export function timeEntries(state){
 const journal=ensureJournal(state).timeJournal;
 const manual=journal.entries.filter(e=>e&&e.id).map(e=>({...e,source:'manual'}));
 const quick=(state.quickWorktime?.sessions||[]).filter(e=>e&&e.id&&isoTime(e.start)&&isoTime(e.end))
  .map(e=>({id:e.id,start:e.start,end:e.end,category:e.category||'work',project:e.project||'',title:e.title||'',source:'quick',updatedAt:e.updatedAt||e.end}));
 const rows=[...quick,...manual].map(e=>({...e,...(journal.overrides[e.id]||{})})).filter(e=>!e.deleted&&isoTime(e.start)&&isoTime(e.end));
 return rows.sort((a,b)=>String(b.start).localeCompare(String(a.start)));
}
export function putTimeEntry(state,entry){
 ensureJournal(state);const saved=validTimeEntry(entry);const quick=(state.quickWorktime?.sessions||[]).some(e=>e.id===saved.id);
 if(quick){state.timeJournal.overrides[saved.id]={start:saved.start,end:saved.end,category:saved.category,project:saved.project,title:saved.title,updatedAt:saved.updatedAt,deleted:false};}
 else {const idx=state.timeJournal.entries.findIndex(x=>x.id===saved.id);if(idx===-1)state.timeJournal.entries.push(saved);else state.timeJournal.entries[idx]=saved;}
 return saved;
}
export function deleteTimeEntry(state,id){
 ensureJournal(state);const item=timeEntries(state).find(x=>x.id===id);if(!item)throw Error('Zeitintervall nicht gefunden.');
 const override={...(state.timeJournal.overrides[id]||{}),deleted:true,updatedAt:new Date().toISOString()};
 if(item.source==='quick')state.timeJournal.overrides[id]=override;
 else{const idx=state.timeJournal.entries.findIndex(e=>e.id===id);if(idx>=0)state.timeJournal.entries[idx]={...state.timeJournal.entries[idx],...override};}
}
export function durationMinutes(e){return Math.max(0,Math.round((Date.parse(e.end)-Date.parse(e.start))/60000)||0);}
export function timeBreakdown(state,days=7,now=new Date()){
 const cutoff=new Date(now.getTime()-(days-1)*86400000);cutoff.setHours(0,0,0,0);
 const end=now.getTime();const totals=Object.fromEntries(TIME_AREAS.map(([k])=>[k,0]));
 let sum=0;const items=[];
 for(const e of timeEntries(state)){
  const s=Math.max(cutoff.getTime(),Date.parse(e.start)),t=Math.min(end,Date.parse(e.end));
  if(t<=s)continue;const min=Math.round((t-s)/60000);
  totals[e.category]??=0;totals[e.category]+=min;sum+=min;items.push(e);
 }
 return {days,totalMinutes:sum,totals,items};
}
export function overlapWarnings(state){
 const rows=timeEntries(state).sort((a,b)=>a.start.localeCompare(b.start));
 return rows.flatMap((r,i)=>i&&Date.parse(r.start)<Date.parse(rows[i-1].end)?[[rows[i-1].id,r.id]]:[]);
}
export function addNutrition(state,{foodId,at,amount,note='',id,deleted=false}){
 ensureJournal(state);const foods=[...FOOD_PRESETS,...state.nutritionJournal.customFoods];
 const food=foods.find(f=>f.id===foodId);
 if(!food)throw Error('Lebensmittel nicht gefunden.');
 const chosenAmount=amount===undefined?(food.defaultAmount||''):amount;
 const item={id:String(id||crypto.randomUUID()),foodId:String(foodId),at:isoTime(at)?at:new Date().toISOString(),amount:String(chosenAmount).slice(0,60),note:String(note).slice(0,500),updatedAt:new Date().toISOString(),deleted};
 const idx=state.nutritionJournal.entries.findIndex(e=>e.id===item.id);
 if(idx<0)state.nutritionJournal.entries.push(item);else state.nutritionJournal.entries[idx]=item;
 return item;
}
export function addCustomFood(state,title,emoji='🍴',options={}){
 ensureJournal(state);const name=String(title||'').trim();if(!name||name.length>80)throw Error('Bitte eine kurze Bezeichnung eingeben.');
 if([...FOOD_PRESETS,...state.nutritionJournal.customFoods].some(f=>f.title.toLowerCase()===name.toLowerCase()))throw Error('Dieser Eintrag existiert bereits.');
 const low=Number(options.kcalLow),high=Number(options.kcalHigh),amount=String(options.defaultAmount||'1 Portion').trim().slice(0,60);
 const valid=options.kcalLow!==''&&options.kcalLow!=null&&options.kcalHigh!==''&&options.kcalHigh!=null&&Number.isFinite(low)&&Number.isFinite(high)&&low>=0&&high>=low&&high<=5000;
 const item={id:crypto.randomUUID(),title:name,emoji:String(emoji||'🍴').slice(0,6),group:'Eigene',defaultAmount:amount,kcalLow:valid?low:null,kcalHigh:valid?high:null};
 state.nutritionJournal.customFoods.push(item);return item;
}
export function nutritionFoods(state){return [...FOOD_PRESETS,...(state?.nutritionJournal?.customFoods||[])];}
export function nutritionEntries(state){return (state?.nutritionJournal?.entries||[]).filter(e=>!e.deleted&&isoTime(e.at)).slice().sort((a,b)=>b.at.localeCompare(a.at));}
/** An indicative range only, not a nutritional measurement. Explicitly edited quantities
 * override presets when a compatible count or g/ml amount can be parsed. */
export function nutritionKcalEstimate(food,amount){
 if(!food||!Number.isFinite(food.kcalLow)||!Number.isFinite(food.kcalHigh))return null;
 const original=String(food.defaultAmount||'').toLowerCase(),given=String(amount||food.defaultAmount||'').toLowerCase().trim();
 if(!given)return null;
 // Matcha is a recipe, not a uniform-calorie beverage: don't multiply oat milk
 // calories by total drink volume. The old 250-ml matcha logs had no breakdown,
 // so we use the same explicitly documented 75-ml estimate for those as well.
 if(food.id==='matcha'||food.id==='matcha-oat-plain'){
  const milkMatch=given.match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:hafermilch|haferdrink)\b/i);
  const milkMl=milkMatch?Number(milkMatch[1].replace(',','.')):75;
  if(!Number.isFinite(milkMl)||milkMl<0||milkMl>1000)return null;
  const honey=food.id==='matcha';
  // ~40–70 kcal/100 ml oat drink, ~5–9 kcal matcha (2 g), ~20–25 kcal honey (7 g).
  // Round to 5-kcal bands to avoid false precision in a brand-dependent estimate.
  const round=value=>Math.round(value);
  return {low:round(5+milkMl*.48+(honey?21:0)),high:round(9+milkMl*.48+(honey?22:0)),kind:'Etikett + Schätzung'};
 }
 if(food.id==='oat-latte'){
  const milk=given.match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:hafermilch|haferdrink)/i),sirup=given.match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:sirup|monin)/i);
  const m=milk?Number(milk[1].replace(',','.')):200,sy=sirup?Number(sirup[1].replace(',','.')):10;
  if(!Number.isFinite(m)||!Number.isFinite(sy)||m<0||m>1000||sy<0||sy>100)return null;
  const kcal=Math.round(m*.48+sy*3.26+2);
  return {low:Math.max(0,kcal-2),high:kcal+2,kind:'Etikett + Schätzung'};
 }
 const parseNumber=v=>Number(String(v).replace(',','.'));
 const quantity=v=>{const m=v.match(/(\d+(?:[.,]\d+)?)\s*(stücke|stück|scheiben|scheibe|g|gramm|ml|liter|l\b|packung|dose|teller)/i);return m?{value:parseNumber(m[1]),unit:m[2].toLowerCase()}:null;};
 const parsePortion=(str)=>{
  const q=quantity(str);if(q)return q;
  const hand=str.match(/(\d+(?:[.,]\d+)?)?\s*handvoll/i);
  if(hand)return {value:(hand[1]?parseNumber(hand[1]):1)*30,unit:'g'};
  if(/becher/i.test(str)&&food.id==='rice-pudding')return {value:200,unit:'g'};
  if(/packung/i.test(str)&&food.id==='dried-mango')return {value:200,unit:'g'};
  return null;
 };
 const a=parsePortion(original),b=parsePortion(given);
 if(!a||!b)return given===original?{low:food.kcalLow,high:food.kcalHigh,kind:'Schätzung'}:null;
 const unit=u=>u==='gramm'?'g':u==='scheiben'?'scheibe':u==='stücke'?'stück':u==='liter'||u==='l'?'ml':u;
 let ratio;
 if(unit(a.unit)===unit(b.unit))ratio=b.value/a.value;
 else if(b.unit==='l'&&a.unit==='ml')ratio=b.value*1000/a.value;
 else return null;
 if(!Number.isFinite(ratio)||ratio<=0||ratio>20)return null;
 return {low:Math.round(food.kcalLow*ratio),high:Math.round(food.kcalHigh*ratio),kind:'Schätzung'};
}
export function nutritionKcalSummary(state,days=30,now=new Date()){
 const foods=nutritionFoods(state),since=now.getTime()-days*86400000;
 const entries=nutritionEntries(state).filter(e=>Date.parse(e.at)>=since&&Date.parse(e.at)<=now.getTime());
 let low=0,high=0,known=0;
 for(const entry of entries){const food=foods.find(f=>f.id===entry.foodId);const estimate=nutritionKcalEstimate(food,entry.amount);if(!estimate)continue;known++;low+=estimate.low;high+=estimate.high;}
 return {low,high,known,unknown:entries.length-known,total:entries.length,complete:known===entries.length&&entries.length>0};
}
export function nutritionStats(state,days=30,now=new Date()){
 const since=now.getTime()-days*86400000,entries=nutritionEntries(state).filter(e=>Date.parse(e.at)>=since&&Date.parse(e.at)<=now.getTime());
 const counts=new Map();for(const e of entries)counts.set(e.foodId,(counts.get(e.foodId)||0)+1);
 return {entries,counts,ranked:[...counts].sort((a,b)=>b[1]-a[1])};
}
function dayFormat(value){return new Date(value).toLocaleDateString('de-AT',{day:'2-digit',month:'short'});}
function hourFormat(value){return new Date(value).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'});}
function toInputDate(value){const d=new Date(value);if(!Number.isFinite(d.getTime()))return '';const z=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function timeJournalView(state,{period=7,editingId='',showForm=false}={}){
 const summary=timeBreakdown(state,period),rows=timeEntries(state).slice(0,200),overlap=overlapWarnings(state),editing=rows.find(e=>e.id===editingId)||null;
 const inputStart=editing?toInputDate(editing.start):toInputDate(new Date(Date.now()-3600000)),inputEnd=editing?toInputDate(editing.end):toInputDate(new Date());
 return `<div class="pj92-shell"><section class="work-card pj92-summary"><div class="work-heading"><span>⏱️ Zeitjournal · Wohin fließt meine Zeit?</span><button class="secondary-btn" data-action="pj92-time-add" type="button">+ Zeit nachtragen</button></div><p class="muted-line">Beruf, Privatprojekte, Familie, Bewegung und Erholung. Unbekannte Stunden bleiben unbekannt.</p><div class="pj92-period">${[7,30,90].map(n=>`<button class="${period===n?'active':''}" type="button" data-action="pj92-period" data-id="${n}">${n} Tage</button>`).join('')}</div><div class="pj92-metric"><strong>${Math.round(summary.totalMinutes/60*10)/10} h</strong><small>erfasste Zeit in ${period} Tagen</small></div><div class="pj92-category-bars">${TIME_AREAS.filter(([id])=>summary.totals[id]).map(([id,icon,title])=>`<div class="pj92-bar-row"><span>${icon} ${title}</span><div><i style="width:${Math.round(summary.totals[id]/(summary.totalMinutes||1)*100)}%"></i></div><strong>${(summary.totals[id]/60).toFixed(1)} h</strong></div>`).join('')||'<p class="muted-line">Noch keine Zeitintervalle erfasst.</p>'}</div>${overlap.length?`<p class="pj92-alert">⚠ ${overlap.length} überlappende Zeitintervalle – bitte prüfen; Werte können doppelt gezählt sein.</p>`:''}</section><section class="work-card"><div class="work-heading"><span>Chronologie · ${rows.length} Intervalle</span></div><div class="pj92-entry-list">${rows.map(e=>`<button type="button" data-action="pj92-time-edit" data-id="${esc(e.id)}" class="pj92-time-row"><span><strong>${TIME_AREAS.find(x=>x[0]===e.category)?.[1]||'○'} ${esc(e.title||timeLabel(e.category))}</strong><small>${esc(e.project||timeLabel(e.category))}</small></span><span><strong>${dayFormat(e.start)}</strong><small>${hourFormat(e.start)}–${hourFormat(e.end)} · ${durationMinutes(e)} min</small></span></button>`).join('')||'<p class="muted-line">Mit Play/Stopp erfassen oder rückwirkend eine Aktivität hinzufügen.</p>'}</div></section>${showForm||editing?`<section class="work-card pj92-editor"><div class="work-heading"><span>${editing?'Intervall bearbeiten':'Aktivität nachtragen'}</span><button type="button" data-action="pj92-time-cancel">Schließen</button></div><form id="pj92-time-form"><input type="hidden" name="id" value="${esc(editing?.id||'')}"><label>Von<input type="datetime-local" name="start" required value="${esc(inputStart)}"></label><label>Bis<input type="datetime-local" name="end" required value="${esc(inputEnd)}"></label><label>Bereich<select name="category">${timeCategoryOptions(editing?.category||'project')}</select></label><label>Aktivität<input name="title" maxlength="160" placeholder="z. B. Fußball mit meinem Sohn" value="${esc(editing?.title||'')}"></label><label>Projekt / Kontext<input name="project" maxlength="120" placeholder="z. B. Compass oder Beziehungsdynamiken" value="${esc(editing?.project||'')}"></label><div class="pj92-form-actions"><button class="primary-btn" type="submit">Speichern</button>${editing?`<button type="button" class="secondary-btn" data-action="pj92-time-delete" data-id="${esc(editing.id)}">Löschen</button>`:''}</div></form></section>`:''}</div>`;
}
export function nutritionQuickView(state,{selectedFoodId='',dateToday}={}){
 const foods=nutritionFoods(state),groups=[...new Set(foods.map(f=>f.group))];
 return `<div class="pj92-nutrition-pop"><div class="pj92-food-grid">${groups.map(group=>`<div class="pj92-food-group"><h3>${esc(group)}</h3>${group==='Frühstück'?'<p class="pj92-matcha-note">Matcha: 1 TL Pulver, heißes Wasser, ca. 75 ml Hafermilch; optional 1 TL Honig. Die ca. 500 ml sind die gesamte Trinkmenge. Hafermilch-Menge im Tagebuch bearbeitbar.</p>':''}<div>${foods.filter(f=>f.group===group).map(f=>`<button type="button" data-action="pj92-food-tap" data-id="${esc(f.id)}" title="${esc(f.recipeNote||f.title)}" class="pj92-food-tile ${selectedFoodId===f.id?'active':''}"><span>${f.emoji}</span><small>${esc(f.title)}${f.defaultAmount?` · ${esc(f.defaultAmount)}`:''}</small></button>`).join('')}</div></div>`).join('')}</div><p class="pj92-footnote">Ein Tippen speichert das Lebensmittel mit Uhrzeit. kcal-Schätzungen und ein freiwilliges persönliches Ziel findest du im Ernährungstagebuch. Details können später ergänzt werden. ${state?'Verschlüsselt im Tresor.':'Bei gesperrtem Tresor verschlüsselt vorgemerkt.'}</p></div>`;
}
export function nutritionInsightsView(state,{period=30,editingId=''}={}){
 const stats=nutritionStats(state,period),foods=nutritionFoods(state),editing=nutritionEntries(state).find(e=>e.id===editingId);
 return `<div class="pj92-shell"><section class="work-card"><div class="work-heading"><span>🥗 Ernährungstagebuch</span><span class="quiet-tag">${period} Tage</span></div><p class="muted-line">Was esse und trinke ich – und wann? Ohne Bewertung oder automatische Ernährungsnoten.</p><div class="pj92-period">${[7,30,90].map(n=>`<button type="button" class="${n===period?'active':''}" data-action="pj92-nutrition-period" data-id="${n}">${n} Tage</button>`).join('')}</div><div class="pj92-metric"><strong>${stats.entries.length}</strong><small>erfasste Lebensmittel und Getränke</small></div><details class="pj92-kcal-details"><summary>Geschätzte Energie (optional, unvollständig)</summary>${(()=>{const k=nutritionKcalSummary(state,period);return `<p class="muted-line">${k.known?`Erfasste Einträge mit Referenzwert: ca. ${k.low}–${k.high} kcal für ${period} Tage.`:'Noch keine abschätzbaren Einträge.'} ${k.unknown} Einträge ohne Schätzung. <strong>Keine vollständige Kalorienbilanz.</strong> Werte variieren nach Marke, Sorte und Portionsgröße.</p>`;})()}</details><div class="pj92-category-bars">${stats.ranked.slice(0,12).map(([id,count])=>{const food=foods.find(f=>f.id===id);return `<div class="pj92-bar-row"><span>${food?.emoji||'🍴'} ${esc(food?.title||'Eigenes Lebensmittel')}</span><div><i style="width:${Math.round(count/(stats.ranked[0]?.[1]||1)*100)}%"></i></div><strong>${count}×</strong></div>`;}).join('')||'<p class="muted-line">Noch keine Einträge in diesem Zeitraum.</p>'}</div></section>${energyGoalView(state,{foods,estimate:nutritionKcalEstimate})}<section class="work-card"><div class="work-heading"><span>Letzte Einträge</span><button type="button" class="secondary-btn" data-action="pj92-nutrition-add">Neues Lebensmittel erfassen</button></div><div class="pj92-entry-list">${stats.entries.slice(0,60).map(e=>{const food=foods.find(f=>f.id===e.foodId);return `<button class="pj92-time-row" type="button" data-action="pj92-food-edit" data-id="${esc(e.id)}"><span><strong>${food?.emoji||'🍴'} ${esc(food?.title||'Eintrag')}</strong><small>${esc([e.amount,e.note].filter(Boolean).join(' · ')||'Zum Bearbeiten öffnen')}</small></span><span><strong>${dayFormat(e.at)}</strong><small>${hourFormat(e.at)}</small></span></button>`;}).join('')||'<p class="muted-line">Einfach über das Ernährungssymbol in der Titelzeile beginnen.</p>'}</div></section>${editing?`<section class="work-card pj92-editor"><div class="work-heading"><span>Ernährungseintrag</span><button type="button" data-action="pj92-food-edit-cancel">Schließen</button></div><form id="pj92-food-detail-form"><input type="hidden" name="id" value="${esc(editing.id)}"><label>Zeitpunkt<input type="datetime-local" name="at" value="${esc(toInputDate(editing.at))}" required></label><label>Menge (optional)<input name="amount" maxlength="60" value="${esc(editing.amount||'')}" placeholder="z. B. eine Handvoll"></label><label>Notiz (optional)<textarea name="note" rows="2" maxlength="500">${esc(editing.note||'')}</textarea></label><div class="pj92-form-actions"><button type="submit" class="primary-btn">Speichern</button><button type="button" class="secondary-btn" data-action="pj92-food-delete" data-id="${esc(editing.id)}">Löschen</button></div></form></section>`:''}<section class="work-card"><h3>Eigene Lebensmittel hinzufügen</h3><form id="pj92-add-food-form" class="pj92-inline-form"><label>Bezeichnung<input name="title" maxlength="80" placeholder="z. B. Haferbrei" required></label><button type="submit" class="secondary-btn">Hinzufügen</button></form></section></div>`;
}
// Merge encrypted emotion check-ins by immutable ID. Preserve all historical entries
// from both devices; an explicit later edit wins, with deterministic ties.
export function mergeFeelingCheckins(local=[],remote=[]){
 const byId=new Map();
 for(const row of [...(Array.isArray(local)?local:[]),...(Array.isArray(remote)?remote:[])]){
  if(!row||typeof row.id!=='string'||!Array.isArray(row.items))continue;
  const previous=byId.get(row.id);
  if(!previous){byId.set(row.id,row);continue;}
  const revision=x=>String(x.editedAt||x.updatedAt||x.at||'');
  const a=revision(previous),b=revision(row);
  if(b>a||(b===a&&JSON.stringify(row)>JSON.stringify(previous)))byId.set(row.id,row);
 }
 return [...byId.values()].sort((a,b)=>String(a.at||'').localeCompare(String(b.at||''))||a.id.localeCompare(b.id));
}
function mergeTouchRecords(a={},b={}){const map=new Map();for(const e of [...(a?.entries||[]),...(b?.entries||[])]){if(!e?.id)continue;const x=map.get(e.id);if(!x||String(e.updatedAt||'')>String(x.updatedAt||'')||(String(e.updatedAt||'')===String(x.updatedAt||'')&&e.deleted===true))map.set(e.id,e);}return {entries:[...map.values()].sort((x,y)=>String(x.id).localeCompare(String(y.id)))};}
export function mergeJournalData(local,remote){
 // Versioned per-ID merge; a remote device must never erase a newer local entry.
 const lc=local&&typeof local==='object'?local:{},rc=remote&&typeof remote==='object'?remote:{};
 const byId=(a,b)=>{
  const m=new Map();for(const v of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){if(!v?.id)continue;const prev=m.get(v.id);if(!prev||String(prev.updatedAt||prev.end||prev.at||'')<=String(v.updatedAt||v.end||v.at||''))m.set(v.id,v);}return [...m.values()];
 };
 const unionObject=(a,b)=>{const out={...(a||{})};for(const [key,val] of Object.entries(b||{}))if(!out[key]||String(out[key].updatedAt||'')<String(val?.updatedAt||''))out[key]=val;return out;};
 const localWork=lc.quickWorktime||{},remoteWork=rc.quickWorktime||{};
 return {
  timeJournal:{entries:byId(lc.timeJournal?.entries,rc.timeJournal?.entries),overrides:unionObject(lc.timeJournal?.overrides,rc.timeJournal?.overrides)},
  nutritionJournal:{entries:byId(lc.nutritionJournal?.entries,rc.nutritionJournal?.entries),customFoods:byId(lc.nutritionJournal?.customFoods,rc.nutritionJournal?.customFoods),...(lc.nutritionJournal?.energyGoal||rc.nutritionJournal?.energyGoal?{energyGoal:(()=>{const left=lc.nutritionJournal?.energyGoal,right=rc.nutritionJournal?.energyGoal;if(!left)return energyGoalSettings(right);if(!right)return energyGoalSettings(left);return energyGoalSettings(String(left.updatedAt||'')>=String(right.updatedAt||'')?left:right);})()}:{} )},
  touchJournal:mergeTouchRecords(lc.touchJournal,rc.touchJournal),
  quickWorktime:mergeQuickWorktime(localWork,remoteWork),
  feelingCheckins:mergeFeelingCheckins(lc.feelingCheckins,rc.feelingCheckins),
  ...(lc.habitsQuick||rc.habitsQuick?{habitsQuick:mergeHabitQuick(lc.habitsQuick,rc.habitsQuick)}:{}),
  ...(lc.calendarArchive||rc.calendarArchive?{calendarArchive:mergeCalendarArchives(lc.calendarArchive,rc.calendarArchive)}:{}),
  ...(lc.miracleMorning||rc.miracleMorning?{miracleMorning:mergeMorningData(lc.miracleMorning,rc.miracleMorning)}:{}),
  ...((lc.people||rc.people||lc.peopleDeleted||rc.peopleDeleted)?mergePeopleDirectory(lc.people,rc.people,lc.peopleDeleted,rc.peopleDeleted):{})
 };
}








/**
 * 0.5.70.4: merge punch-clock state by evidence of an actual start/stop.
 * The previous last-updated-wins merge discarded a phone's active clock whenever
 * an idle desktop copy happened to have a later updatedAt. An empty status is NOT
 * evidence of a stop. A completed interval with the same start time is.
 *
 * This also works when merging historical 0.5.69.x / 0.5.70.x snapshots, which
 * have no clock event ledger. It does not reconstruct starts missing everywhere.
 */
export function mergeQuickWorktime(local,remote){
 const left=local&&typeof local==='object'?local:{};
 const right=remote&&typeof remote==='object'?remote:{};
 const byId=new Map();
 for(const row of [...(Array.isArray(left.sessions)?left.sessions:[]),...(Array.isArray(right.sessions)?right.sessions:[])]){
  if(!row?.id||!Number.isFinite(Date.parse(row.start||''))||!Number.isFinite(Date.parse(row.end||'')))continue;
  const previous=byId.get(row.id);
  if(!previous||String(row.updatedAt||row.end)>String(previous.updatedAt||previous.end))byId.set(row.id,row);
 }
 const sessions=[...byId.values()].sort((a,b)=>String(a.start).localeCompare(String(b.start))||String(a.id).localeCompare(String(b.id)));
 const completedStarts=new Set(sessions.map(s=>Date.parse(s.start)));
 const candidates=[left,right].filter(s=>Number.isFinite(Date.parse(s.activeStart||''))&&!completedStarts.has(Date.parse(s.activeStart)));
 // A genuine open start survives a stale or newer empty status from another device.
 // When two devices independently start, use the newer start; both are retained in
 // their original vaults until the next reconciliation.
 candidates.sort((a,b)=>Date.parse(b.activeStart)-Date.parse(a.activeStart)||String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')));
 const active=candidates[0];
 const updatedAt=[left.updatedAt,right.updatedAt,...sessions.map(s=>s.updatedAt||s.end),active?.activeStart]
  .filter(value=>typeof value==='string'&&Number.isFinite(Date.parse(value)))
  .sort((a,b)=>Date.parse(b)-Date.parse(a))[0]||'';
 return {sessions,activeStart:active?.activeStart||'',activeCategory:active?.activeCategory||'work',updatedAt};
}