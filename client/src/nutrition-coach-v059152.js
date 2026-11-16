/** Compass 0.5.91.54 — local, read-only Nutrition Intelligence overview.
 * The expensive personalised recommender is NEVER run on render: only by the
 * explicit `ni152-analyze` action. No network, vault writes, AI or cross-person
 * inference. Reuses documented nutrient and Daily Dozen evidence.
 */
import {nutritionFoods,nutritionEntries} from './personal-journal-v5692.js';
import {nutritionTrendsIndex,NUTRIENT_TREND_MICROS} from './nutrition-trends-v57726.js';
import {nutrientEntry,NUTRIENT_LABELS} from './nutrition-intelligence-v57712.js';
import {dailyDozen5930,DAILY_DOZEN_5930} from './daily-dozen-v5775930.js';
import {DAILY_NRV} from './nutrition-reference-v57722.js';
import {fatEntry} from './nutrition-fat-quality-v57731.js';
import {macroSuggestions} from './macro-goals-v57723.js';
import {foodCategory148} from './food-menu-v059148.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round=(n,p=1)=>Math.round(n*10**p)/10**p;
const fmt=(n,p=1)=>Number.isFinite(n)?n.toLocaleString('de-AT',{maximumFractionDigits:p}):'–';
const dateKey=stamp=>{const d=new Date(stamp);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const validDay=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T12:00:00'));
const shift=(d,n)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+n);return dateKey(x);};
export const NUTRITION_COACH_PERIODS_52=Object.freeze([7,14,42,90]);
export function nutritionCoachWindow52({days=14,anchor=dateKey(new Date()),today=dateKey(new Date())}={}){
 const duration=NUTRITION_COACH_PERIODS_52.includes(Number(days))?Number(days):14;
 const current=validDay(today)?today:dateKey(new Date());
 const end=validDay(anchor)&&anchor<=current?anchor:current;
 return {days:duration,end,start:shift(end,1-duration),today:current,label:`${new Date(shift(end,1-duration)+'T12:00:00').toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit'})} – ${new Date(end+'T12:00:00').toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit',year:'numeric'})}`,canNext:end<current};
}
export function shiftNutritionCoachWindow52(days,anchor,direction,today=dateKey(new Date())){
 const w=nutritionCoachWindow52({days,anchor,today});
 if(direction==='prev')return shift(w.end,-w.days);
 if(direction==='next')return shift(w.end,Math.min(w.days,Math.max(0,Math.round((new Date(w.today+'T12:00:00')-new Date(w.end+'T12:00:00'))/86400000))));
 return w.end;
}
const sumKnown=(entries,key)=>{
 const matched=entries.filter(e=>Number.isFinite(e.values[key]));
 return {sum:round(matched.reduce((a,e)=>a+e.values[key],0),3),known:matched.length,missing:entries.length-matched.length,estimated:matched.filter(e=>e.estimated.has(key)||e.partial.has(key)).length};
};
const portionAmount=text=>{
 const raw=String(text||'');
 // Prefer explicit physical quantities, then package counts, not invented grams.
 const weight=raw.match(/(\d+(?:[.,]\d+)?)\s*(g|ml)\b/i);
 const count=raw.match(/(\d+(?:[.,]\d+)?)\s*(portion(?:en)?|becher|stück(?:e)?|glas|gläser|riegel|tasse[n]?)\b/i);
 const m=weight||count;if(!m)return null;
 const alias={portionen:'Portionen',portion:'Portionen',becher:'Becher',stück:'Stück',stücke:'Stück',glas:'Glas',gläser:'Glas',riegel:'Riegel',tasse:'Tassen',tassen:'Tassen'};
 const rawUnit=m[2].toLowerCase();return {value:Number(m[1].replace(',','.')),unit:alias[rawUnit]||rawUnit};
};
const selectEntries=(state,w)=>nutritionEntries(state).filter(e=>{const day=dateKey(e.at);return day>=w.start&&day<=w.end;});
/** Fast persisted-index based aggregation. Food totals are per original entry,
 * never counted twice as if a lat or primary muscle. Blank days are not zeros.
 */
export function nutritionCoachOverview52(state,{days=14,anchor=dateKey(new Date()),today=dateKey(new Date())}={}){
 const window=nutritionCoachWindow52({days,anchor,today});
 const entries=selectEntries(state,window),foods=nutritionFoods(state),foodMap=new Map(foods.map(f=>[f.id,f]));
 const index=nutritionTrendsIndex(state),daysWithLogs=[...new Set(entries.map(e=>dateKey(e.at)))].sort();
 const daily=daysWithLogs.map(day=>index.days.get(day)?.summary).filter(Boolean);
 const keys=['kcal','protein','salt','saturated','fiber','fat',...NUTRIENT_TREND_MICROS];
 const metrics=Object.fromEntries(keys.map(key=>{
  const rows=daily.filter(row=>row.coverage[key]?.known>0);
  const total=rows.reduce((a,row)=>a+(row.totals[key]||0),0);
  const knownEntries=rows.reduce((count,row)=>count+(row.coverage[key]?.known||0),0);
  const totalEntries=rows.reduce((count,row)=>count+(row.coverage[key]?.known||0)+(row.coverage[key]?.unknown||0),0);
  return [key,{total:round(total,2),avg:rows.length?round(total/rows.length,2):null,days:rows.length,partial:rows.filter(row=>row.coverage[key].unknown||row.coverage[key].partial).length,estimated:rows.filter(row=>row.coverage[key].estimated).length,knownEntries,totalEntries}];
 }));
 const productMap=new Map();
 for(const e of entries){const cached=index.rows.get(String(e.id));
  const value=cached?.values||nutrientEntry(foodMap.get(e.foodId)||e.foodSnapshot,e).values;
  const key=String(e.foodId||'unknown'),food=foodMap.get(key)||e.foodSnapshot;
  let p=productMap.get(key);if(!p){p={id:key,title:food?.title||'Unbekanntes Lebensmittel',group:food?.group||'Unsortiert',count:0,days:new Set(),units:{},amountsKnown:0,entries:0,sums:{},known:{},last:''};productMap.set(key,p);}
  p.count++;p.entries++;p.days.add(dateKey(e.at));const a=portionAmount(e.amount||food?.defaultAmount);if(a){p.units[a.unit]=(p.units[a.unit]||0)+a.value;p.amountsKnown++;}
  if(e.at>p.last)p.last=e.at;
  for(const m of ['salt','protein','saturated','kcal','fat','fiber'])if(Number.isFinite(value[m])){p.sums[m]=(p.sums[m]||0)+value[m];p.known[m]=(p.known[m]||0)+1;}
 }
 const products=[...productMap.values()].sort((a,b)=>b.count-a.count||a.title.localeCompare(b.title));
 const dozenDays=daysWithLogs.map(day=>dailyDozen5930(state,{day}));
 const dozen=DAILY_DOZEN_5930.map(template=>{
  const rows=dozenDays.map(d=>d.rows.find(x=>x.id===template.id));
  return {...template,avg:rows.length?round(rows.reduce((s,r)=>s+(r?.observed||0),0)/rows.length,2):null,daysMet:rows.filter(r=>r?.observed>=template.goal).length,daysPresent:rows.filter(r=>r?.observed>0).length,recorded:rows.length};
 });
 const dozenByDay=dozenDays.map(d=>({day:d.day,score:d.observed,max:d.goal}));
 const mensaEntries=entries.filter(e=>String(e.foodId||'').startsWith('mensa-menu-')&&e.menuSnapshot);
 const mensaUnquantified=mensaEntries.filter(e=>!Object.keys(e.menuSnapshot?.ingredientWeightsGrams||{}).length&&!state?.mensaCatalog?.entries?.some(o=>o.id===e.catalogOfferId&&Object.keys(o.ingredientWeightsGrams||{}).length));
 const coveredEntries=entries.length;
 // Fingerprint is based on the actual selected journal values and catalog
 // profile versions: cached recommendation disappears when evidence changes.
 const fingerprint=JSON.stringify([window.start,window.end,entries.map(e=>[e.id,e.at,e.foodId,e.amount,e.recipe,e.updatedAt,e.foodSnapshot,e.menuSnapshot,e.catalogOfferId]),(state?.mensaCatalog?.entries||[]).map(o=>[o.id,o.catalogVersion,o.updatedAt,o.ingredientWeightsGrams,o.ingredientsNamedInMenu]),foods.map(f=>[f.id,f.updatedAt,f.nutrients,f.kcalLow,f.kcalHigh])]);
 return {window,entries:coveredEntries,loggedDays:daysWithLogs.length,daysWithLogs,metrics,dailyMetrics:daily.map(row=>({day:row.day,totals:row.totals,coverage:row.coverage})),products,dozen,dozenByDay,mensaCount:mensaEntries.length,mensaUnquantified:mensaUnquantified.length,foodMap,rawEntries:entries,fingerprint};
}
function recommendedMenuItem(foodMap,re){
 return [...foodMap.values()].filter(f=>re.test(f.title||'')).map(f=>f.title).slice(0,2).join(' oder ');
}
/** Known values are evidence about entered foods, not a diagnostic total.
 * Nutrient completeness is entry-level, not simply the number of logged days.
 */
const nutritionCoverage54=(m,key)=>{
 const x=m.metrics[key]||{};
 return x.totalEntries?x.knownEntries/x.totalEntries:0;
};
const isPlant54=f=>/tofu|tempeh|bohne|linsen|kichererbse|erbsen|spinat|grünkohl|mangold|kürbiskern|sesam|tahin|hafer|vollkorn|quinoa|nuss|mandel/i.test(f.title||'');
export function nutritionMenuSources54(m,key,{limit=3,plantOnly=true}={}){
 const entries=[...m.foodMap.values()].filter(f=>!plantOnly||isPlant54(f)).filter(f=>!/^mensa-menu-/.test(f.id||''));
 return entries.map(f=>{
  // Existing parser knows per-100g, package and recipe defaults; no new profile or fictional grams.
  const values=nutrientEntry(f,{foodId:f.id,amount:f.defaultAmount||'1 Portion'}).values;
  return {id:f.id,title:f.title,amount:f.defaultAmount||'1 Portion',value:values[key],kcal:values.kcal,protein:values.protein};
 }).filter(x=>Number.isFinite(x.value)&&x.value>0).sort((a,b)=>b.value-a.value).slice(0,limit);
}
const sourceExamples54=(arr,key='iron')=>arr.map(x=>`${x.title} (${x.amount}: ≈ ${fmt(x.value,1)} ${key==='iron'||key==='magnesium'?'mg':'g'})`).join(' · ');
/** SFA should be expressed relative to energy on the SAME logged days.
 * A low numerator with unlabelled entries is only a partial balance.
 */
export function nutritionFatSignal54(m){
 const matched=m.dailyMetrics.filter(x=>x.coverage.saturated?.known>0&&x.coverage.kcal?.known>0&&x.totals.kcal>0);
 const sat=matched.reduce((a,x)=>a+x.totals.saturated,0),kcal=matched.reduce((a,x)=>a+x.totals.kcal,0);
 const pct=kcal>0?round(100*sat*9/kcal,1):null;
 const satCoverage=nutritionCoverage54(m,'saturated'),calCoverage=nutritionCoverage54(m,'kcal');
 return {pct,matchedDays:matched.length,coverage:Math.min(satCoverage,calCoverage),avgSat:m.metrics.saturated.avg,interpretable:matched.length>=4&&satCoverage>=.70&&calCoverage>=.70};
}
const contextStatus54=(tone,title,value,detail)=>({tone,title,value,detail});
/** Cheap read-only first-glance assessment; the full food rankings are click-only. */
export function nutritionSignals54(state,m){
 const goals=macroSuggestions(state),energyGoal=goals.prefs?.enabled&&goals.ready?goals.energy:null;
 const kcal=m.metrics.kcal,iron=m.metrics.iron,protein=m.metrics.protein;
 const result=[];
 if(Number.isFinite(energyGoal)&&kcal.avg!==null){
  const change=kcal.avg/energyGoal-1;
  result.push(contextStatus54(nutritionCoverage54(m,'kcal')<.70?'neutral':change>.10?'caution':change<-.15?'caution':'good','Kalorien · Zeitraummittel',`${fmt(kcal.avg,0)} / ${fmt(energyGoal,0)} kcal`,Math.abs(change)<.10?'Im ungefähren Zielkorridor. Einzelne Tage müssen nicht exakt passen.':change>.10?'Über dem eingestellten Ziel im Zeitmittel; Gewichtstrend mitbetrachten.':'Unter dem eingestellten Ziel im Zeitmittel; Erholung und Kraftleistung mitbetrachten.'));
 }else result.push(contextStatus54('neutral','Kalorien · Zeitraum',`${fmt(kcal.avg,0)} kcal / Tag`,'Noch kein aktiviertes Energieziel für eine farbliche Soll-Ist-Bewertung.'));
 const pc=nutritionCoverage54(m,'protein');
 result.push(contextStatus54(pc<.7?'neutral':goals.ready&&protein.avg<goals.protein*.85?'caution':'good','Protein · V-Taper',`${fmt(protein.avg)} g / Tag`,pc<.7?'Nicht alle Mahlzeiten haben Proteinwerte; keine sichere Zielbewertung.':goals.ready?`Trainingsorientierung ca. ${fmt(goals.protein,0)} g/Tag · ${protein.avg>=goals.protein*.85?'im Bereich der Orientierung':'regelmäßige Ergänzung prüfen'}`:'Zur persönlichen Einordnung wird eine Gewichtsmessung benötigt.'));
 const ironPct=iron.avg!==null&&Number.isFinite(DAILY_NRV.iron)?100*iron.avg/DAILY_NRV.iron:null;
 const ic=nutritionCoverage54(m,'iron');
 result.push(contextStatus54(ic<.7?'neutral':ironPct<60?'caution':'good','Eisen · dokumentierte Menge',`${fmt(iron.avg)} mg / Tag`,ic<.7?`Nur ${fmt(ic*100,0)} % der Einträge mit Eisenwerten: keine tatsächliche Unterversorgung ableitbar.`:`${fmt(ironPct,0)} % des EU-Kennzeichnungswerts; kein Blutwert oder Mangeltest.`));
 const fat=nutritionFatSignal54(m);
 result.push(contextStatus54(!fat.interpretable?'neutral':fat.pct>12?'caution':fat.pct>=10?'watch':'good','Gesättigte Fette · Energieanteil',fat.pct===null?'Nicht berechenbar':`${fmt(fat.pct,1)} % der kcal`,fat.pct===null?'Keine Tage mit beiden Werten.':`${fmt(fat.avgSat)} g/Tag dokumentiert · WHO-Orientierung unter 10 % der Energie. ${fat.interpretable?'Ausreichend quantifizierte Einträge für eine vorläufige Bewertung.':'Teilbilanz: unvollständig erfasste Fettwerte können den Anteil verändern.'}`));
 return result;
}
/** Only runs on explicit click. Each recommendation cites actual local product
 * sums and logged times; no inference of deficiency, causal effects or missed meals.
 */
export function nutritionCoachAnalyze52(state,{days=14,anchor=dateKey(new Date()),today=dateKey(new Date())}={}){
 const m=nutritionCoachOverview52(state,{days,anchor,today}),items=[];
 if(!m.entries)return {key:m.fingerprint,window:m.window,items:[],generatedAt:new Date().toISOString()};
 const add=(id,priority,title,observation,action,detail='')=>items.push({id,priority,title,observation,action,detail});
 const iron=m.metrics.iron,ironC=nutritionCoverage54(m,'iron'),ironPct=iron.avg!==null?iron.avg/DAILY_NRV.iron:1;
 if(iron.days>=4&&ironPct<.75){
  const candidates=nutritionMenuSources54(m,'iron',{limit:3}),known=sourceExamples54(candidates);
  add('iron',ironC>=.7?97:92,'🩸 Eisen: pflanzliche Quellen gezielt ergänzen',`Ø ${fmt(iron.avg)} mg/Tag quantifiziert · ${fmt(ironPct*100,0)} % des EU-NRV für Kennzeichnungen. ${fmt(ironC*100,0)} % deiner Lebensmittel-Einträge haben einen Eisenwert.`,`Mögliche Lebensmittel aus deinem Menü: ${known||'Hülsenfrüchte, Tofu oder Kürbiskerne (produktspezifische Werte fehlen)'}. Mit Vitamin-C-reichem Gemüse oder Obst kombinieren.`,ironC<.7?'Die dokumentierte Summe ist eine Teilbilanz, kein festgestellter Eisenmangel. Fehlende Mensa-Rezeptwerte zuerst ergänzen.':'Referenzwert dient der Nährwertkennzeichnung, nicht der individuellen Diagnostik. Eisenstatus wird nicht aus einer App berechnet.');
 }
 const fatSignal=nutritionFatSignal54(m);
 if(fatSignal.pct!==null){
  const src=m.products.filter(p=>p.known.saturated>0).sort((a,b)=>(b.sums.saturated||0)-(a.sums.saturated||0)).slice(0,3);
  const text=src.map(p=>`${p.title}: ${fmt(p.sums.saturated,1)} g`).join(' · ');
  if(fatSignal.pct>=10||!fatSignal.interpretable)add('fat-quality',fatSignal.interpretable&&fatSignal.pct>=10?89:39,'🥑 Fettqualität statt nur Fettmenge',`Ø ${fmt(fatSignal.avgSat)} g gesättigte Fette; etwa ${fmt(fatSignal.pct,1)} % der gleichzeitig dokumentierten Energie. WHO-Orientierung: weniger als 10 %.`,fatSignal.interpretable&&fatSignal.pct>=10?'Prüfe bei den größten Quellen, ob sich Butter, Käse oder Kokosfett gelegentlich durch ungesättigte pflanzliche Fette ersetzen lassen.':'Vorläufige Teilbilanz: zunächst weitere Fettwerte quantifizieren, bevor eine starke Empfehlung sinnvoll ist.',`Größte quantifizierte Quellen: ${text||'nicht eindeutig zuordenbar'}. ${fmt(fatSignal.coverage*100,0)} % der Einträge mit ausreichenden Angaben für beide Kennzahlen.`);
 }
 const magnesium=m.metrics.magnesium,mgC=nutritionCoverage54(m,'magnesium');
 if(magnesium.days>=4&&magnesium.avg!==null&&magnesium.avg/DAILY_NRV.magnesium<.6){
  const examples=sourceExamples54(nutritionMenuSources54(m,'magnesium',{limit:2}),'magnesium');
  add('magnesium',mgC>=.7?86:54,'🌿 Magnesium: Lebensmittelpotenzial',`Ø ${fmt(magnesium.avg)} mg/Tag dokumentiert · ${fmt(100*magnesium.avg/DAILY_NRV.magnesium,0)} % EU-NRV; ${fmt(mgC*100,0)} % der Lebensmittel mit einem Wert.`,`Passende pflanzliche Quellen im Menü: ${examples||'Hülsenfrüchte, Vollkornprodukte und Nüsse (Mengen im Menü nicht belegt)'}.`,`Keine Mangeldiagnose: nur quantifizierte Beiträge; besonders Mensa-Gerichte können weitere Mengen enthalten.`);
 }
 const salt=m.metrics.salt;
 if(salt.days){
  const ranked=m.products.filter(p=>p.known.salt>0).sort((a,b)=>(b.sums.salt||0)-(a.sums.salt||0));
  const total=ranked.reduce((sum,p)=>sum+(p.sums.salt||0),0);
  const sourceText=ranked.slice(0,3).map(p=>`${p.title}: ${fmt(p.sums.salt,2)} g (${fmt(total?100*p.sums.salt/total:null,0)} % der quantifizierten Salzsumme)`).join(' · ');
  if(ranked.length)add('salt',salt.avg>5&&salt.days>=4&&salt.partial<=salt.days*.25?95:28,'🧂 Salz: konkrete Hauptquellen',`${fmt(salt.avg,2)} g/Tag mit dokumentiertem Salzgehalt. Größte Quellen: ${sourceText}.`,salt.avg>5&&salt.days>=4&&salt.partial<=salt.days*.25?'Beginne bei der größten regelmäßigen Quelle: kleinere Portion oder salzärmere Variante wählen. Vergleiche danach den 14-Tage-Trend.':'Die größten Quellen sind sichtbar; einzelne salzreichere Tage benötigen keine Gegenmaßnahme.',`${salt.days}/${m.loggedDays} erfasste Tage mit Salzangabe; ${salt.partial} davon mit fehlenden Einzelwerten. WHO-Orientierung: unter 5 g Salz/Tag. Anteile nur aus quantifizierten Beiträgen.`);
 }
 // Data coverage belongs to supporting evidence, never a headline recommendation.
 if(m.mensaCount)add('mensa',0,'🥗 Mensa-Zutaten · Datenabdeckung',`${m.mensaCount} dokumentierte Mensa-Mahlzeit(en); bei ${m.mensaUnquantified} fehlen Portionsgewichte.`,`Gemüse und Vollkorn werden ausschließlich aus belegten Zutaten angerechnet; die Anzahl der Mensa-Besuche allein ist keine Ernährungsempfehlung.`);

 const gaps=m.dozen.filter(d=>!['exercise','beverages'].includes(d.id)&&d.recorded>=4).map(d=>({d,missing:d.goal-(d.avg??0)})).sort((a,b)=>(b.missing/b.d.goal)-(a.missing/a.d.goal));
 const focusOrder=['berries','legumes','flax','greens','nuts','cruciferous','wholegrains','vegetables','fruits','spices'];
 const suggestions={
  berries:['Beeren',/blaubeer|heidelbeer|beeren/i,'Eine zusätzliche Beerenportion (z. B. TK-Blaubeeren) in eine bereits erfasste Frühstücks- oder Joghurtmahlzeit einplanen.'],
  legumes:['Hülsenfrüchte',/tofu|tempeh|käferbohn|linse|kichererbse|bohnen/i,'Eine Hülsenfruchtportion als Beilage oder proteinreiche Hauptmahlzeit ergänzen.'],
  flax:['Leinsamen',/leinsamen/i,'Eine passende Portion geschroteter Leinsamen in eine Mahlzeit integrieren und die Zubereitungshinweise des Produkts beachten.'],
  greens:['Blattgemüse',/spinat|mangold|grünkohl|blattgemüse/i,'Eine Portion Blattgemüse mit dem Mittagessen kombinieren.'],
  nuts:['Nüsse und Samen',/walnuss|erdnuss|nussmischung|pistazien/i,'Eine Nuss-/Samenportion passend zu deinem Energiebedarf einplanen, ohne bereits vorhandene Portionen doppelt zu zählen.'],
  cruciferous:['Kreuzblütler',/brokkoli|rotkraut|blumenkohl/i,'Eine Portion Brokkoli oder Rotkraut als Gemüsebeilage ergänzen.'],
  wholegrains:['Vollkorn',/vollkorn|kornbrot|haferflocken/i,'Ein belegtes Vollkornprodukt statt einer raffinierten Getreidebeilage wählen.'],
  vegetables:['Gemüse',/karotte|süßkartoffel|gemüse/i,'Eine zusätzliche Gemüseportion zu einer bestehenden Mahlzeit ergänzen.'],
  fruits:['Obst',/kiwi|mandarine|mango|granatapfel|banane/i,'Eine Obstportion als unkomplizierten Snack einplanen.'],
  spices:['Kräuter und Gewürze',/kurkuma|ingwer|zimt/i,'Kräuter und Gewürze passend zum Gericht verwenden.']};
 let shownGaps=0;
 for(const id of focusOrder){if(shownGaps>=2)break;const match=gaps.find(x=>x.d.id===id);if(!match||match.d.avg>=match.d.goal*.75)continue;
  shownGaps++;
  const [name,re,tip]=suggestions[id],menu=recommendedMenuItem(m.foodMap,re);
  add('dd-'+id,65+10*Math.min(1,match.missing/match.d.goal),`🌱 Daily Dozen: ${name}`,`Ø ${fmt(match.d.avg)} / ${match.d.goal} dokumentierte Portionen; an ${match.d.daysMet} von ${match.d.recorded} protokollierten Tagen erreicht.`,`${tip}${menu?' In deinem Compass-Menü vorhanden: '+menu+'.':''}`,'Nicht dokumentiert ≠ nicht gegessen. Ernährungstagebuch und Zuordnung können unvollständig sein.');
 }
 const energy=macroSuggestions(state),kcal=m.metrics.kcal;
 if(energy.ready&&energy.prefs?.enabled&&kcal.days>=4&&nutritionCoverage54(m,'kcal')>=.7&&kcal.avg>energy.energy*1.1){
  add('energy-trend',62,'⚡ Kalorien: Wochenmuster statt einzelner Ausreißer',`Ø ${fmt(kcal.avg,0)} kcal/Tag gegenüber eingestelltem Ziel ${fmt(energy.energy,0)} kcal; Differenz ≈ ${fmt(kcal.avg-energy.energy,0)} kcal/Tag.`,`Erst den 14-Tage-Gewichtstrend prüfen; kein Ausgleichsfasten und keine Änderung wegen eines einzelnen Tages.`,`Ein Soll-Ist-Vergleich mit einem geschätzten Energieziel beweist noch keinen tatsächlichen Kalorienüberschuss.`);
 }
 const p=m.metrics.protein,goals=macroSuggestions(state),target=goals.prefs?.enabled&&goals.ready?goals.protein:Number.isFinite(goals.weight)?Math.round(goals.weight*1.6):null;
 if(p.days>=4&&p.partial<=p.days*.35&&target&&p.avg<target*.85){const menu=recommendedMenuItem(m.foodMap,/tofu|tempeh|lupine|high protein|protein shake|skyr|magertopfen/i);
  add('protein',85,'💪 Protein und V-Taper',`Ø ${fmt(p.avg)} g Protein pro dokumentiertem Tag; persönliche Trainingsorientierung ca. ${target} g.`,`Prüfe eine proteinreiche Ergänzung innerhalb des Kalorienbudgets.${menu?' Im Menü: '+menu+'.':''}`,'Die Orientierung ist kein medizinischer Grenzwert. Unvollständig quantifizierte Mahlzeiten können den berechneten Durchschnitt senken.');
 }
 // Fatty acid profile: coverage separate from low estimates. No inference from
 // missing ALA label data and no blanket condemnation of omega-6.
 const fats=m.rawEntries.map(e=>fatEntry(m.foodMap.get(e.foodId)||e.foodSnapshot,e));
 const knownAla=fats.filter(f=>Number.isFinite(f.values.ala));
 if(knownAla.length){
  const alaSum=knownAla.reduce((s,f)=>s+f.values.ala,0),sources=knownAla.filter(f=>f.values.ala>0).sort((a,b)=>b.values.ala-a.values.ala).slice(0,2);
  if(knownAla.length/m.entries>.7&&alaSum/Math.max(1,m.loggedDays)<1.6)add('ala',64,'🌰 Pflanzliches Omega-3 (ALA)',`Aus ${knownAla.length}/${m.entries} Einträgen quantifiziert: Ø ${fmt(alaSum/m.loggedDays,2)} g ALA je protokolliertem Tag.`,"Leinsamen oder Walnüsse sind mögliche ALA-Quellen. Supplemente nicht aufgrund dieser Schätzung automatisch verändern.",`Quellen: ${sources.map(f=>(m.foodMap.get(f.entry.foodId)?.title||f.entry.foodId)+': '+fmt(f.values.ala,2)+' g').join(' · ')||'Keine quantifizierten Quellen'}. Einzelwerte können generische Referenzschätzungen sein.`);
 }else add('ala-coverage',24,'🌰 Omega-3: Datenabdeckung',`ALA ist nur für ${knownAla.length}/${m.entries} Einträge quantifiziert.`,`Keine Unterversorgung ableitbar. ALA-haltige Lebensmittel können über den Daily-Dozen-Leinsamen- und Nuss-Verlauf beurteilt werden.`);
 // Micronutrients: only flag data gaps, never diagnose deficiencies.
 const thin=NUTRIENT_TREND_MICROS.filter(k=>m.metrics[k]?.days>0&&m.metrics[k].days<m.loggedDays*.5).slice(0,4);
 if(thin.length)add('micro-coverage',20,'🔬 Mikronährstoffe: Datenlücken',`Für ${thin.map(k=>NUTRIENT_LABELS[k]?.[0]||k).join(', ')} liegen nur an einem Teil der protokollierten Tage quantitative Werte vor.`,`Keine Mangelbehauptung aus fehlenden Etikettangaben. Bei Bedarf konkrete Lebensmittelprofile nachpflegen.`);
 items.sort((a,b)=>b.priority-a.priority);
 // Three initial recommendations and optional additional evidence, plus
 // informational source/coverage cards requested by the user.
 return {key:m.fingerprint,window:m.window,items:items.slice(0,9),generatedAt:new Date().toISOString()};
}
const smallCard=(label,value,subtitle)=>`<div class="ni152-stat"><small>${esc(label)}</small><strong>${esc(value)}</strong><span>${esc(subtitle)}</span></div>`;
// Transparent, numeric trend chart with calendar labels, comparable axis and
// one optional guideline. No client library or extra request at page render.
function nutritionTrendChart53(m,metric,target=null){
 const unit=metric==='kcal'?'kcal':'g';
 const rows=m.dailyMetrics;
 const known=rows.filter(r=>r.coverage[metric]?.known>0);
 if(!known.length)return '<p class="ni152-note">Für diesen Nährstoff fehlen im gewählten Zeitraum quantifizierte Tage.</p>';
 const avg=m.metrics[metric]?.avg;
 const values=known.map(r=>r.totals[metric]);
 const peak=Math.max(1,...values,target||0);
 const scaleOrder=10**Math.floor(Math.log10(peak/4));
 const possible=[1,2,2.5,5,10].map(x=>x*scaleOrder);
 const tickStep=possible.find(x=>x*4>=peak*1.08)||10*scaleOrder;
 const axisMax=tickStep*4;
 const left=74,right=14,top=15,bottom=196,width=1000;
 const height=bottom-top,usable=width-left-right;
 const px=index=>left+(index+0.5)*usable/rows.length;
 const y=value=>bottom-(Math.max(0,Math.min(axisMax,value))/axisMax)*height;
 const ticks=Array.from({length:5},(_,i)=>{const val=i*tickStep,cy=y(val);return `<line x1="${left}" x2="${width-right}" y1="${cy}" y2="${cy}" stroke="#e2eae6" stroke-width="1"/><text x="${left-12}" y="${cy+4}" text-anchor="end" font-size="13" fill="#4b685e">${esc(fmt(val,val<10?1:0))}</text>`;}).join('');
 const barW=Math.min(32,usable/rows.length*.68);
 const bars=rows.map((r,i)=>{const defined=r.coverage[metric]?.known>0,partial=Boolean(r.coverage[metric]?.unknown||r.coverage[metric]?.partial),x=px(i);if(!defined)return `<rect x="${(x-barW/2).toFixed(1)}" y="${bottom-4}" width="${barW.toFixed(1)}" height="4" fill="none" stroke="#91a69c" stroke-dasharray="2 2"><title>${esc(r.day)} · nicht quantifiziert</title></rect>`;
  const value=r.totals[metric], yy=y(value);
  // Coloured values are descriptive, never daily 'good/bad' judgements.
  const band=target&&metric==='kcal'?(value>target*1.15?'high':value>target*1.05||value<target*.85?'watch':'within'):target&&metric==='salt'?(value>target?'watch':'within'):'unrated';
  const fill=partial?'#a8bcb5':band==='high'?'#d68d83':band==='watch'?'#dbb563':band==='within'?'#399577':'#418b90';
  return `<rect x="${(x-barW/2).toFixed(1)}" y="${yy.toFixed(1)}" width="${barW.toFixed(1)}" height="${(bottom-yy).toFixed(1)}" rx="3" fill="${fill}"><title>${esc(r.day)} · ${fmt(value)} ${unit}${partial?' (Teilbilanz)':''}${target?' · Orientierung '+fmt(target,0)+' '+unit:''}</title></rect>`;}).join('');
 const labels=rows.map((r,i)=>({r,i})).filter(({i})=>i===0||i===rows.length-1||i%Math.max(1,Math.ceil(rows.length/6))===0).map(({r,i})=>`<text x="${px(i).toFixed(1)}" y="220" text-anchor="middle" font-size="12" fill="#597269">${esc(r.day.slice(5).replace('-', '.'))}</text>`).join('');
 const reference=target&&target<axisMax?`<line x1="${left}" y1="${y(target).toFixed(1)}" x2="${width-right}" y2="${y(target).toFixed(1)}" stroke="#cb9d50" stroke-width="2" stroke-dasharray="7 5"/><text x="${width-right-3}" y="${Math.max(12,y(target)-7).toFixed(1)}" font-size="12" text-anchor="end" fill="#936d33">${metric==='salt'?'WHO-Orientierung':'Orientierung'} ${fmt(target,0)} ${unit}</text>`:'';
 const referenceText=metric==='salt'?'WHO: unter 5 g Salz/Tag; quantifizierte Aufnahme ist bei fehlenden Einträgen eine Untergrenze':metric==='fiber'?'Orientierung: etwa 25 g Ballaststoffe/Tag':metric==='protein'&&target?`Training: ungefähr ${fmt(target,0)} g/Tag als individuell einstellbare Orientierung`:'Keine allgemeine Tagesgrenze; Entwicklung und Datenqualität beurteilen';
 return `<div class="ni153-chart"><div class="ni153-interpret"><strong>Ø ${fmt(avg,metric==='kcal'?0:1)} ${unit} je quantifiziertem Tag</strong><span>${known.length}/${m.loggedDays} protokollierte Tage mit Wert · ${m.metrics[metric].partial} Tage mit Teilangaben</span></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 235" role="img" aria-label="${esc(metric)} Tageswerte, numerische ${unit}-Achse und Datumsachse">${ticks}${reference}${bars}${labels}<text x="15" y="15" font-size="13" fill="#466c5e">${unit}</text></svg><small class="ni152-note">${esc(referenceText)}. Ein einzelner Tag löst keine Bewertung aus.</small>${target&&['kcal','salt'].includes(metric)?'<div class="ni154-chartlegend"><span>● Grün: im Orientierungsbereich</span><span>● Gelb: außerhalb</span><span>● Rot: deutlich über Ziel</span><span>● Grau: unvollständige Werte</span></div>':''}</div>`;
}
function nutritionProductKind53(product){
 const group=String(product.group||'').toLocaleLowerCase('de'),id=String(product.id||'').toLowerCase(),name=String(product.title||'').toLocaleLowerCase('de');
 if(/supplement|nahrungsergänzung|vitamin|aminosäure|bcaa|kombinationspräparat/.test(group+' '+id+' '+name))return 'supplements';
 if(/getränke|shakes|pulver/.test(group)||/tee|kaffee|coffee|matcha|wasser|shake|protein drink|protein-drink/.test(id))return 'drinks';
 return 'foods';
}
/** High-level diet groups, distinct from the selection-menu search filters.
 * Every journal item belongs to ONE group; mixed dishes are not split into
 * fictitious vegetable/wholegrain weights. Those use Daily Dozen evidence.
 */
const NUTRITION_GROUPS_54=Object.freeze([
 ['vegetables','🥦','Gemüse'],['fruit','🍎','Obst & Beeren'],['legumes','🫘','Hülsenfrüchte & Tofu'],
 ['wholegrain','🌾','Getreide & Vollkorn'],['nuts','🥜','Nüsse & Samen'],['dairy','🥣','Milch- & Proteinprodukte'],
 ['meals','🍽️','Mensa & Mischgerichte'],['bakery','🥨','Brot & Gebäck'],['sweets','🍰','Süßes & Desserts'],
 ['fats','🫒','Öle & Aufstriche'],['drinks','🥤','Getränke'],['supplements','💊','Supplemente'],['other','◌','Sonstiges']
]);
export function nutritionFoodGroup54(food){
 const id=String(food?.id||'').toLowerCase(),name=String(food?.title||'').toLocaleLowerCase('de'),group=String(food?.group||'').toLocaleLowerCase('de');
 const joined=id+' '+name;
 const menu=foodCategory148(food);
 if(menu==='sport'||/supplement|multivitamin|alphaminos|bcaa|kapsel|vitamin.*daily/.test(joined))return 'supplements';
 if(menu==='drinks'||/grüntee|tee ungesüßt|wasser|calpis|shake|smoothie|matcha.*hafermilch/.test(joined))return 'drinks';
 if(/mensa|study.teller|frühlingsrolle|hauptgericht|menü|curry|risotto|salat mit|suppe|dal|kimchi|omelette|frühstücksschüssel|meal/i.test(joined)&&!/(mango|apfel).*dessert/.test(joined))return 'meals';
 if(/honig|sirup|muffin|kuchen|schoko|schokolade|keks|cookies?|pistachio butter cup|torte|süß|dessert|riegel|brownie|germknödel|pudding/.test(joined)&&!/protein.*(pulver|shake)/.test(joined))return 'sweets';
 if(/skyr|topfen|quark|joghurt|yogurt|yoghurt|protein pudding|milsani|ehrmann|alpro plant protein/.test(joined)||menu==='dairy')return 'dairy';
 if(/mct|öl|oil|butter|aufstrich|pesto/.test(joined)&&!/(butter.*brot|brot.*butter)/.test(joined))return 'fats';
 if(/tofu|tempeh|käferbohn|linse|kichererbse|stangenbohn|hülsenfrücht|kidneybohn|edamame/.test(joined))return 'legumes';
 if(/leinsamen|sesam|erdnuss|erdnüss|peanut|walnuss|mandel|pistazien?\b|kürbiskern|tahini|nussmischung|nuts/.test(joined))return 'nuts';
 if(/brokkoli|broccoli|karotte|möhre|süßkartoffel|rotkraut|blumenkohl|gemüse|spinat|blattkohl|avocado/.test(joined)&&menu!=='bakery')return 'vegetables';
 if(/banane|banana|\bapfel\b|mango|maracuja|mandarine|drachenfrucht|pomelo|granatapfel|\bkiwi\b|beeren|blaubeer|heidelbeer|\bobst\b|\bfrucht\b/.test(joined))return 'fruit';
 if(menu==='bakery'||/brot|toast|breze|brezel|brötchen|semmel|kornspitz/.test(joined))return 'bakery';
 if(/getreide|vollkorn|spaghetti|nudeln|haferflocken|quinoa|reis|buchweizen|hirse|dinkel|cornflakes/.test(joined))return 'wholegrain';
 if(menu==='sweets'||/snack/.test(group))return 'sweets';
 if(menu==='meals'||/frühstück|mahlzeit|gerichte/.test(group))return 'meals';
 return 'other';
}
/** Stable colours are shared by the SVG wedges, category labels and percentages.
 * One category => one colour, regardless of rank or currently selected period.
 */
export const NUTRITION_GROUP_COLORS_54=Object.freeze({
 vegetables:'#2D8964',fruit:'#C6842A',legumes:'#8D6BB4',wholegrain:'#87713F',
 nuts:'#B0793A',dairy:'#397FB6',meals:'#6679B4',bakery:'#B96D4B',
 sweets:'#C25A83',fats:'#72904B',drinks:'#278C99',supplements:'#8A7399',other:'#71828B'
});
/** Entries are ranked by the food profile they were actually logged as.
 * Only quantified energy can be apportioned; unknown entries do not imply 0.
 */
export function nutritionFoodGroups54(m){
 const groups=new Map(NUTRITION_GROUPS_54.map(([id,icon,label])=>[id,{id,icon,label,color:NUTRITION_GROUP_COLORS_54[id],count:0,days:new Set(),knownKcal:0,knownKcalEntries:0,protein:0,fiber:0,salt:0,knownGrams:0,gramsEntries:0,proteinKnown:0,fiberKnown:0,saltKnown:0,products:[]}]));
 for(const p of m.products){
  const id=nutritionFoodGroup54(p),g=groups.get(id)||groups.get('other');
  g.count+=p.count;for(const day of p.days)g.days.add(day);
  for(const k of ['protein','fiber','salt']){g[k]+=p.sums[k]||0;g[k+'Known']+=p.known[k]||0;}
  g.knownKcal+=p.sums.kcal||0;g.knownKcalEntries+=p.known.kcal||0;
  g.knownGrams+=p.units.g||0;if(p.units.g>0)g.gramsEntries++;
  g.products.push(p);
 }
 const counted=[...groups.values()].filter(g=>g.count>0),quantifiedEnergy=counted.reduce((s,g)=>s+g.knownKcal,0);
 return counted.map(g=>({...g,days:g.days.size,share:quantifiedEnergy>0&&g.knownKcalEntries?100*g.knownKcal/quantifiedEnergy:null,products:g.products.sort((a,b)=>(b.sums.kcal||0)-(a.sums.kcal||0)||b.count-a.count),quantifiedEnergy}));
}
/** Static SVG: no chart library, data request, automatic analysis or write.
 * Wedges only represent documented calories. Product groups with missing
 * kcal remain in the legend but do not acquire a fictional zero-percentage.
 */
export function nutritionCategoryDonut54(groups){
 const valid=groups.filter(g=>g.share!==null&&g.share>0&&g.knownKcal>0);
 const radius=87,circumference=2*Math.PI*radius;
 let cursor=0;
 const slices=valid.map(g=>{
  const fraction=g.share/100;
  const length=circumference*fraction;
  const gap=Math.min(2.5,length*.14);
  const dash=Math.max(.1,length-gap);
  const offset=-(cursor+gap/2);
  cursor+=length;
  const label=`${g.label}: ${fmt(g.share,1)} Prozent; ${fmt(g.knownKcal,0)} quantifizierte Kilokalorien`;
  return `<a href="#ni154-category-${esc(g.id)}" data-action="ni154-select-category" data-id="${esc(g.id)}" aria-label="${esc(label)}" class="ni154-donut-wedge"><circle cx="140" cy="140" r="${radius}" fill="none" stroke="${g.color}" stroke-width="35" stroke-dasharray="${dash.toFixed(4)} ${(circumference-dash).toFixed(4)}" stroke-dashoffset="${offset.toFixed(4)}" transform="rotate(-90 140 140)"><title>${esc(label)}</title></circle></a>`;
 }).join('');
 const total=groups.reduce((sum,g)=>sum+g.knownKcal,0);
 return `<div class="ni154-donut-visual"><svg viewBox="0 0 280 280" role="group" aria-label="Kalorienanteile nach Lebensmittelgruppen; Farben, Namen und Prozentwerte stehen auch in der Liste rechts" xmlns="http://www.w3.org/2000/svg"><circle cx="140" cy="140" r="87" fill="none" stroke="#e6eee9" stroke-width="35"/>${slices}<text x="140" y="129" text-anchor="middle" class="ni154-donut-caption">QUANTIFIZIERT</text><text x="140" y="152" text-anchor="middle" class="ni154-donut-total">${total>0?esc(fmt(total,0)):'–'}</text><text x="140" y="172" text-anchor="middle" class="ni154-donut-unit">kcal im Zeitraum</text></svg><small>Segment oder Kategorie antippen, um Lebensmittel und Nährstoffbeiträge zu sehen.</small></div>`;
}
function nutritionCategory54(m){
 const rows=nutritionFoodGroups54(m);
 const totalKcal=rows.reduce((s,x)=>s+x.knownKcal,0);
 const top=rows.filter(x=>x.id!=='drinks'&&x.id!=='supplements'&&x.knownKcal>0).sort((a,b)=>b.knownKcal-a.knownKcal);
 const summary=top.slice(0,3).map(g=>`${g.label}: ${fmt(g.knownKcal,0)} kcal`).join(' · ');
 // Largest contributions at the top; keep all quantified and unquantified
 // groups visible so missing food-label values cannot silently disappear.
 const ordered=[...rows].sort((a,b)=>b.knownKcal-a.knownKcal||b.count-a.count);
 const items=ordered.map(g=>{
  const pct=g.share===null?'–':`${fmt(g.share,1)} %`;
  const countMissing=g.count-g.knownKcalEntries;
  return `<details class="ni154-category" id="ni154-category-${esc(g.id)}" style="--ni154-color:${g.color}"><summary><span class="ni154-category-label"><span class="ni154-category-swatch" aria-hidden="true"></span><span class="ni154-category-icon" aria-hidden="true">${g.icon}</span><span class="ni154-category-name">${esc(g.label)}<small>${g.days}/${m.loggedDays} Tage · ${g.count} ${g.count===1?'Eintrag':'Einträge'}</small></span></span><span class="ni154-category-value"><strong>${pct}</strong><small>${g.knownKcalEntries?fmt(g.knownKcal,0)+' kcal':'kcal unbekannt'}${countMissing>0?' · '+countMissing+' Einträge ohne kcal':''}</small></span><span class="ni154-category-chevron" aria-hidden="true">▾</span></summary><div class="ni154-category-detail"><p>Dokumentierte Beiträge: ${g.proteinKnown?fmt(g.protein,1)+' g':'nicht quantifiziert'} Protein · ${g.fiberKnown?fmt(g.fiber,1)+' g':'nicht quantifiziert'} Ballaststoffe · ${g.saltKnown?fmt(g.salt,1)+' g':'nicht quantifiziert'} Salz${g.gramsEntries?` · ${fmt(g.knownGrams,0)} g explizit erfasste Gewichte`:''}.</p>${g.products.slice(0,10).map(x=>`<div><span>${esc(x.title)}</span><b>${x.known.kcal?fmt(x.sums.kcal,0)+' kcal':'kcal offen'} · ${x.count}×</b></div>`).join('')}</div></details>`;
 }).join('');
 const missing=rows.reduce((sum,g)=>sum+g.count-g.knownKcalEntries,0);
 return `<section class="ni152-panel ni154-categories"><header><div><h4>🥗 So setzt sich deine Ernährung zusammen</h4><p>Kalorien nach Lebensmittelgruppen · gleiche Farbe im Donut und bei den Prozenten</p></div><strong>${fmt(totalKcal,0)} kcal <small>quantifiziert im Zeitraum</small></strong></header><div class="ni154-donut-layout">${nutritionCategoryDonut54(rows)}<div class="ni154-category-list" aria-label="Kategorien mit Symbolen, Prozenten und Detailansichten">${items||'<p>Keine Lebensmittelgruppen erfasst.</p>'}</div></div><p class="ni154-category-lead">Größte dokumentierte Energiebeiträge: ${esc(summary||'keine quantifizierten Gruppen')}. Das ist noch keine Qualitätsbewertung.</p><p class="ni152-note">Die Prozentwerte beziehen sich auf <b>quantifizierte Kalorien</b> aller Lebensmittel einschließlich Getränken und Supplements.${missing?' Bei '+missing+' Einträgen fehlen quantifizierbare Kalorien – ihr Anteil ist unbekannt.':''} Mischgerichte bleiben bei den Gruppenkalorien ein Gericht; bekannte Mensa-Zutaten werden nur in der Daily Dozen separat ausgewertet. Fehlende Einträge sind keine Nullwerte.</p></section>`;
}
/** Actual logged nutrient sources have more explanatory value than a bare frequency list. */
export function nutritionTopSources54(m,key,{limit=3,foodsOnly=true}={}){
 return m.products.filter(p=>!foodsOnly||nutritionProductKind53(p)==='foods')
  .filter(p=>p.known[key]>0&&p.sums[key]>0)
  .sort((a,b)=>(b.sums[key]||0)-(a.sums[key]||0))
  .slice(0,limit).map(p=>({title:p.title,value:round(p.sums[key],2),count:p.count}));
}
function nutritionSourceBlock54(m,key,label,unit){
 const ranked=nutritionTopSources54(m,key);
 return `<div class="ni154-source"><strong>${esc(label)}</strong>${ranked.length?ranked.map(p=>`<div><span>${esc(p.title)}</span><b>${fmt(p.value,1)} ${unit}</b></div>`).join(''):'<small>Für diesen Nährstoff keine quantifizierten Produktbeiträge.</small>'}</div>`;
}
function nutritionFoodRow53(p,days){
 const units=p.amountsKnown===p.entries?Object.entries(p.units).map(([unit,value])=>` · ${fmt(value,1)} ${esc(unit)}`).join(''):' · Menge teilweise unbekannt';
 const detail=[p.known.protein?`${fmt(p.sums.protein)} g Protein`:null,p.known.salt?`${fmt(p.sums.salt,2)} g Salz`:null,p.known.fiber?`${fmt(p.sums.fiber)} g Ballaststoffe`:null].filter(Boolean).join(' · ');
 return `<div class="ni152-product"><strong>${esc(p.title)}</strong><span>${p.count}× · an ${p.days.size}/${days} Tagen${units}</span><small>${esc(detail||'Nährwertbeitrag nicht vollständig quantifiziert')}</small></div>`;
}
const chartBar=(actual,max,color)=>`<span class="ni152-meter"><i style="width:${Math.max(0,Math.min(100,100*(actual||0)/(max||1))).toFixed(1)}%;background:${color}"></i></span>`;
export function nutritionCoachDashboard52(state,{days=14,anchor=dateKey(new Date()),today=dateKey(new Date()),metric='protein',report=null}={}){
 const m=nutritionCoachOverview52(state,{days,anchor,today}),w=m.window;
 const dateInfo=`${m.loggedDays} protokollierte Tage · ${m.entries} Einträge im Zeitraum`;
 const periodNav=`<div class="ni152-controls"><div class="ni152-periods">${NUTRITION_COACH_PERIODS_52.map(x=>`<button type="button" data-action="ni152-period" data-id="${x}" class="${w.days===x?'selected':''}" aria-pressed="${w.days===x}">${x===42?'6 Wochen':x+' Tage'}</button>`).join('')}</div><div class="ni152-pager"><button type="button" data-action="ni152-shift" data-id="prev" aria-label="Vorheriger Zeitraum">‹</button><strong>${esc(w.label)}</strong><button type="button" data-action="ni152-shift" data-id="next" ${w.canNext?'':'disabled'} aria-label="Nächster Zeitraum">›</button></div></div>`;
 if(!m.loggedDays)return `<section class="ni152" aria-label="Ernährungsübersicht"><header><small>COMPASS · NUTRITION INTELLIGENCE</small><h3>Ernährung im Zeitverlauf</h3><p>Aus deinen lokal vorhandenen Protokollen – ohne zusätzliche Erfassung.</p></header>${periodNav}<div class="ni152-empty">Im gewählten Zeitraum sind noch keine Ernährungseinträge vorhanden. Mit ‹ kannst du frühere Zeiträume ansehen. Fehlende Einträge sind keine Nullwerte.</div></section>`;
 const macros=`<div class="ni152-stats">${smallCard('Ø Kalorien',m.metrics.kcal.avg===null?'–':fmt(m.metrics.kcal.avg,0)+' kcal',`${m.metrics.kcal.days}/${m.loggedDays} Tage mit kcal-Werten`)}${smallCard('Ø Protein',m.metrics.protein.avg===null?'–':fmt(m.metrics.protein.avg)+' g',`${m.metrics.protein.days}/${m.loggedDays} Tage mit Proteinwerten`)}${smallCard('Ø Salz',m.metrics.salt.avg===null?'–':fmt(m.metrics.salt.avg,2)+' g',`${m.metrics.salt.days}/${m.loggedDays} Tage mit Salzangaben`)}${smallCard('Ø Ballaststoffe',m.metrics.fiber.avg===null?'–':fmt(m.metrics.fiber.avg)+' g',`${m.metrics.fiber.days}/${m.loggedDays} Tage mit bekannten Werten`)}</div>`;
 const signals=nutritionSignals54(state,m);
 const quickInsight=`<section class="ni154-glance" aria-label="Ernährung auf einen Blick"><div class="ni154-intro"><h4>🎯 Was sagen dir deine Daten?</h4><p>Einordnung des gewählten Zeitraums. Nur dokumentierte Werte; detaillierte Lebensmittelvorschläge erst nach Klick unten.</p></div><div class="ni154-glance-grid">${signals.map(x=>`<div class="ni154-insight ni154-${x.tone}"><strong>${esc(x.title)}</strong><b>${esc(x.value)}</b><span>${esc(x.detail)}</span></div>`).join('')}</div></section>`;
 const graphMetric=['kcal','protein','salt','fiber','saturated'].includes(metric)?metric:'protein';
 const trendNames={kcal:'Kalorien',protein:'Protein',salt:'Salz',fiber:'Ballaststoffe',saturated:'Gesättigte Fette'};
 const goals=macroSuggestions(state);
 const target=graphMetric==='salt'?5:graphMetric==='fiber'?25:graphMetric==='kcal'?(goals.prefs?.enabled&&goals.ready?goals.energy:null):graphMetric==='protein'?(goals.prefs?.enabled&&goals.ready?goals.protein:Number.isFinite(goals.weight)?Math.round(goals.weight*1.6):null):null;
 const trend=`<section class="ni152-panel"><div class="ni152-trendhead"><h4>📈 Ernährungsverlauf · mit Achsen und Zielorientierung</h4><nav aria-label="Nährstoff-Zeitreihe">${Object.entries(trendNames).map(([k,v])=>`<button type="button" data-action="ni152-metric" data-id="${k}" class="${k===graphMetric?'selected':''}">${esc(v)}</button>`).join('')}</nav></div>${nutritionTrendChart53(m,graphMetric,target)}<small class="ni152-note">Werte je Tag aus dokumentierten Einträgen. Geschätzte Nährwerte sind enthalten, unbekannte Beiträge werden nicht künstlich als null gesetzt.</small></section>`;
 const plotted=m.dozenByDay.map(d=>`<span class="ni152-day" role="img" aria-label="${esc(d.day)}: ${fmt(d.score)}/${fmt(d.max)} dokumentierte Daily-Dozen-Portionen" style="background:${d.score/d.max>=.7?'#227b5f':d.score/d.max>=.4?'#74b89a':d.score?'#c3dccc':'#e9edeb'}" title="${esc(d.day)} · ${fmt(d.score)} / ${d.max}"></span>`).join('');
 const dailyDozen=`<section class="ni152-panel"><h4>🌱 Daily Dozen · Entwicklung</h4><p>Nur protokollierte Tage. Die Farben zeigen dokumentierte Portionen, keine Gesundheitsnote.</p><div class="ni152-days">${plotted}</div><div class="ni152-dozen">${m.dozen.filter(d=>!['exercise','beverages'].includes(d.id)).map(d=>`<div class="ni152-dozenrow"><span>${d.icon} ${esc(d.label)}</span>${chartBar(d.avg,d.goal,'#3b987a')}<strong>${fmt(d.avg)} / ${d.goal}</strong><small>${d.daysMet}/${d.recorded} Tage Ziel erreicht</small></div>`).join('')}</div><div class="ni152-aging">${m.dozen.filter(d=>['berries','nuts','greens'].includes(d.id)).map(d=>`<span>${d.icon} ${esc(d.label)}: ${d.daysPresent}/${d.recorded} Tage erfasst</span>`).join('')}</div>${m.mensaCount?`<p class="ni153-mensa-note">🥗 ${m.mensaCount} Mensa-Mahlzeit(en) dokumentiert. Gemüse/Hülsenfrüchte/Vollkorn werden aus benannten Zutaten und geschätzten Portionsmengen angerechnet; bei ${m.mensaUnquantified} Menüs fehlen Mengenangaben (nur vorsichtige Teilportionen). Weißer Reis zählt nicht automatisch als Vollkorn.</p>`:''}<p class="ni152-note">Anti-Aging Eight: Beeren, Nüsse und Blattgemüse sind aus dieser Dokumentation sichtbar. NAD⁺, microRNA und Postbiotika sind daraus nicht direkt messbar. Krafttraining wird nicht durch pauschale Proteinrestriktion ersetzt.</p></section>`;
 const foodProducts=m.products.filter(p=>nutritionProductKind53(p)==='foods');
 const drinks=m.products.filter(p=>nutritionProductKind53(p)==='drinks');
 const supplements=m.products.filter(p=>nutritionProductKind53(p)==='supplements');
 const productSources=`<section class="ni152-panel ni154-sources"><h4>🍽️ Welche Lebensmittel prägen deine Ernährung?</h4><p>Die wichtigsten quantifizierten Beiträge im gewählten Zeitraum; kein bloßes Ranking nach Klickhäufigkeit. Mengen sind Produkt- und Rezeptschätzungen.</p><div class="ni154-sources-grid">${nutritionSourceBlock54(m,'protein','Proteinquellen','g')}${nutritionSourceBlock54(m,'fiber','Ballaststoffquellen','g')}${nutritionSourceBlock54(m,'saturated','Gesättigte-Fett-Quellen','g')}${nutritionSourceBlock54(m,'salt','Salzquellen','g')}</div></section>`;
 const products=`<details class="ni152-panel ni152-details ni154-foodfrequency"><summary>🍽️ Was isst du regelmäßig? · Häufigkeiten und Mengen</summary><p>Lebensmittel und Mahlzeiten – ohne Getränke und Supplements. Häufigkeit je Tag, Menge und Nährstoffbeiträge.</p><div class="ni152-products">${foodProducts.slice(0,10).map(p=>nutritionFoodRow53(p,m.loggedDays)).join('')||'<p>Keine passenden Speisen in diesem Zeitraum erfasst.</p>'}</div><details class="ni153-extras"><summary>🥤 Getränke (${drinks.length}) und 💊 Supplemente (${supplements.length}) separat ansehen</summary><h5>Getränke</h5><div class="ni152-products">${drinks.slice(0,12).map(p=>nutritionFoodRow53(p,m.loggedDays)).join('')||'<small>Keine erfasst</small>'}</div><h5>Supplemente</h5><div class="ni152-products">${supplements.slice(0,12).map(p=>nutritionFoodRow53(p,m.loggedDays)).join('')||'<small>Keine erfasst</small>'}</div></details></details>`;
 const micros=NUTRIENT_TREND_MICROS.filter(k=>m.metrics[k]?.days>0).slice(0,10);
 const micronutrients=`<details class="ni152-panel ni152-details" open><summary>🔬 Mikronährstoffe & Fettqualität · Zeitdurchschnitt</summary><div class="ni152-micros">${micros.map(k=>{const v=m.metrics[k],nrv=DAILY_NRV[k],pct=Number.isFinite(nrv)&&v.avg!==null?v.avg/nrv*100:null;return `<div><strong>${esc(NUTRIENT_LABELS[k]?.[0]||k)}</strong><span>Ø ${fmt(v.avg)} ${esc(NUTRIENT_LABELS[k]?.[1]||'')} · ${v.days}/${m.loggedDays} Tage</span>${Number.isFinite(pct)?chartBar(pct,100,'#4d8d95'):''}<small>${Number.isFinite(pct)?fmt(pct,0)+' % EU-NRV · '+fmt(nutritionCoverage54(m,k)*100,0)+' % der Einträge quantifiziert (kein Mangeltest)':''}</small></div>`;}).join('')}</div><p class="ni152-note">Gesättigte Fette: Ø ${fmt(m.metrics.saturated.avg,2)} g an ${m.metrics.saturated.days} Tagen mit bekannten Werten; ${fmt(nutritionFatSignal54(m).pct,1)} % der zeitgleich dokumentierten Energie (WHO-Orientierung unter 10 %; ${nutritionFatSignal54(m).interpretable?'ausreichende':'eingeschränkte'} Datenabdeckung). ALA/EPA/DHA sind im bestehenden Fettqualitäts-Tab differenziert verfügbar; fehlende Etikettwerte werden nicht als 0 gewertet.</p></details>`;
 const currentReport=report?.key===m.fingerprint?report:null;
 const recommendations=`<section class="ni152-recommend"><div class="ni152-recommend-head"><div><small>OPTIONAL · LOKALE ANALYSE</small><h4>✨ Dein persönlicher Nutrition Coach</h4><p>Konkrete Quellen, Daily-Dozen-Lücken und passende Lebensmittel aus deinem Menü – nur nach deinem Klick.</p></div><button type="button" data-action="ni152-analyze">${currentReport?'Erneut analysieren':'Meine Ernährung analysieren'}</button></div>${currentReport?`<div class="ni152-recommend-list">${currentReport.items.length?currentReport.items.slice(0,3).map(x=>`<article><h5>${esc(x.title)}</h5><p><strong>Beobachtung:</strong> ${esc(x.observation)}</p><p><strong>Dein nächster Schritt:</strong> ${esc(x.action)}</p>${x.detail?`<small>${esc(x.detail)}</small>`:''}</article>`).join('')+(currentReport.items.length>3?`<details class="ni153-more"><summary>Weitere ${currentReport.items.length-3} Befunde ansehen</summary>${currentReport.items.slice(3).map(x=>`<article><h5>${esc(x.title)}</h5><p><strong>Beobachtung:</strong> ${esc(x.observation)}</p><p><strong>Vorschlag:</strong> ${esc(x.action)}</p>${x.detail?`<small>${esc(x.detail)}</small>`:''}</article>`).join('')}</details>`:''):'<p>Keine ausreichenden Daten für belastbare Empfehlungen im Zeitraum. Weiter dokumentieren genügt.</p>'}</div>`:`<p class="ni152-note">${report?'Seit der Analyse wurden Daten oder der Zeitraum geändert. Bitte erneut analysieren.':'Keine automatische Analyse oder KI-Anfrage beim Öffnen dieser Seite.'}</p>`}<p class="ni152-note">Befunde beschreiben dokumentierte Ernährung; fehlende Tage oder Nährstoffangaben sind keine Nullwerte. Empfehlungen sind Optionen, keine Pflicht. Keine automatische Änderung an Mahlzeiten oder Habits.</p></section>`;
 return `<section class="ni152" aria-label="Nutrition Intelligence Überblick"><header><small>COMPASS · NUTRITION INTELLIGENCE</small><h3>Deine Ernährung im Überblick</h3><p>Dr. Gregers Daily Dozen · vollwertig pflanzenbetont · ausreichend Protein für deinen V-Taper</p></header>${periodNav}<p class="ni152-coverage">${esc(dateInfo)} · Durchschnitt nur über Tage mit quantifizierten Werten</p>${quickInsight}${macros}${nutritionCategory54(m)}${trend}${productSources}<div class="ni152-columns">${dailyDozen}${micronutrients}</div>${products}${recommendations}</section>`;
}
