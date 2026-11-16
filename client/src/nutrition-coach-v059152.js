/** Compass 0.5.91.53 — local, read-only Nutrition Intelligence overview.
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
  return [key,{total:round(total,2),avg:rows.length?round(total/rows.length,2):null,days:rows.length,partial:rows.filter(row=>row.coverage[key].unknown||row.coverage[key].partial).length,estimated:rows.filter(row=>row.coverage[key].estimated).length}];
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
/** Only runs on explicit click. Each recommendation cites actual local product
 * sums and logged times; no inference of deficiency, causal effects or missed meals.
 */
export function nutritionCoachAnalyze52(state,{days=14,anchor=dateKey(new Date()),today=dateKey(new Date())}={}){
 const m=nutritionCoachOverview52(state,{days,anchor,today}),items=[];
 if(!m.entries)return {key:m.fingerprint,window:m.window,items:[],generatedAt:new Date().toISOString()};
 const add=(id,priority,title,observation,action,detail='')=>items.push({id,priority,title,observation,action,detail});
 const salt=m.metrics.salt;
 if(salt.days){
  const ranked=m.products.filter(p=>p.known.salt>0).sort((a,b)=>(b.sums.salt||0)-(a.sums.salt||0));
  const total=ranked.reduce((sum,p)=>sum+(p.sums.salt||0),0);
  const sourceText=ranked.slice(0,3).map(p=>`${p.title}: ${fmt(p.sums.salt,2)} g (${fmt(total?100*p.sums.salt/total:null,0)} % der quantifizierten Salzsumme)`).join(' · ');
  if(ranked.length)add('salt',salt.avg>5&&salt.days>=4&&salt.partial<=salt.days*.25?95:28,'🧂 Salz: konkrete Hauptquellen',`${fmt(salt.avg,2)} g/Tag mit dokumentiertem Salzgehalt. Größte Quellen: ${sourceText}.`,salt.avg>5&&salt.days>=4&&salt.partial<=salt.days*.25?'Beginne bei der größten regelmäßigen Quelle: kleinere Portion oder salzärmere Variante wählen. Vergleiche danach den 14-Tage-Trend.':'Die größten Quellen sind sichtbar; einzelne salzreichere Tage benötigen keine Gegenmaßnahme.',`${salt.days}/${m.loggedDays} erfasste Tage mit Salzangabe; ${salt.partial} davon mit fehlenden Einzelwerten. WHO-Orientierung: unter 5 g Salz/Tag. Anteile nur aus quantifizierten Beiträgen.`);
 }
 if(m.mensaCount)add('mensa',80,'🥗 Mensa-Gerichte in den Daily Dozen',`${m.mensaCount} Study-Teller im gewählten Zeitraum; bei ${m.mensaUnquantified} fehlen modellierte Zutatengewichte. Gemüse und Vollkorn werden nur bei erkennbarer Komponente angerechnet.`,`Die von dir gegessenen Mensa-Gerichte werden als Mahlzeiten einbezogen. Für unbekannte Beilagen nicht automatisch eine volle Daily-Dozen-Portion annehmen.`,`Basmatireis ist ohne Vollkornkennzeichnung kein Daily-Dozen-Vollkorn. Zutatenmengen stammen teilweise aus typischen Rezeptannahmen, nicht aus gewogenen Tellern.`);
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
 return {key:m.fingerprint,window:m.window,items:items.slice(0,7),generatedAt:new Date().toISOString()};
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
  const yy=y(r.totals[metric]);return `<rect x="${(x-barW/2).toFixed(1)}" y="${yy.toFixed(1)}" width="${barW.toFixed(1)}" height="${(bottom-yy).toFixed(1)}" rx="3" fill="${partial?'#9bcaba':'#288b76'}"><title>${esc(r.day)} · ${fmt(r.totals[metric])} ${unit}${partial?' (Teilbilanz)':''}</title></rect>`;}).join('');
 const labels=rows.map((r,i)=>({r,i})).filter(({i})=>i===0||i===rows.length-1||i%Math.max(1,Math.ceil(rows.length/6))===0).map(({r,i})=>`<text x="${px(i).toFixed(1)}" y="220" text-anchor="middle" font-size="12" fill="#597269">${esc(r.day.slice(5).replace('-', '.'))}</text>`).join('');
 const reference=target&&target<axisMax?`<line x1="${left}" y1="${y(target).toFixed(1)}" x2="${width-right}" y2="${y(target).toFixed(1)}" stroke="#cb9d50" stroke-width="2" stroke-dasharray="7 5"/><text x="${width-right-3}" y="${Math.max(12,y(target)-7).toFixed(1)}" font-size="12" text-anchor="end" fill="#936d33">${metric==='salt'?'WHO-Orientierung':'Orientierung'} ${fmt(target,0)} ${unit}</text>`:'';
 const referenceText=metric==='salt'?'WHO: unter 5 g Salz/Tag; quantifizierte Aufnahme ist bei fehlenden Einträgen eine Untergrenze':metric==='fiber'?'Orientierung: etwa 25 g Ballaststoffe/Tag':metric==='protein'&&target?`Training: ungefähr ${fmt(target,0)} g/Tag als individuell einstellbare Orientierung`:'Keine allgemeine Tagesgrenze; Entwicklung und Datenqualität beurteilen';
 return `<div class="ni153-chart"><div class="ni153-interpret"><strong>Ø ${fmt(avg,metric==='kcal'?0:1)} ${unit} je quantifiziertem Tag</strong><span>${known.length}/${m.loggedDays} protokollierte Tage mit Wert · ${m.metrics[metric].partial} Tage mit Teilangaben</span></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 235" role="img" aria-label="${esc(metric)} Tageswerte, numerische ${unit}-Achse und Datumsachse">${ticks}${reference}${bars}${labels}<text x="15" y="15" font-size="13" fill="#466c5e">${unit}</text></svg><small class="ni152-note">${esc(referenceText)}. Ein einzelner Tag löst keine Bewertung aus.</small></div>`;
}
function nutritionProductKind53(product){
 const group=String(product.group||'').toLocaleLowerCase('de'),id=String(product.id||'').toLowerCase(),name=String(product.title||'').toLocaleLowerCase('de');
 if(/supplement|nahrungsergänzung|vitamin|aminosäure|bcaa|kombinationspräparat/.test(group+' '+id+' '+name))return 'supplements';
 if(/getränke|shakes|pulver/.test(group)||/tee|kaffee|coffee|matcha|wasser|shake|protein drink|protein-drink/.test(id))return 'drinks';
 return 'foods';
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
 const graphMetric=['kcal','protein','salt','fiber','saturated'].includes(metric)?metric:'protein';
 const trendNames={kcal:'Kalorien',protein:'Protein',salt:'Salz',fiber:'Ballaststoffe',saturated:'Gesättigte Fette'};
 const goals=macroSuggestions(state);
 const target=graphMetric==='salt'?5:graphMetric==='fiber'?25:graphMetric==='protein'?(goals.prefs?.enabled&&goals.ready?goals.protein:Number.isFinite(goals.weight)?Math.round(goals.weight*1.6):null):null;
 const trend=`<section class="ni152-panel"><div class="ni152-trendhead"><h4>📈 Ernährungsverlauf · mit Achsen und Zielorientierung</h4><nav aria-label="Nährstoff-Zeitreihe">${Object.entries(trendNames).map(([k,v])=>`<button type="button" data-action="ni152-metric" data-id="${k}" class="${k===graphMetric?'selected':''}">${esc(v)}</button>`).join('')}</nav></div>${nutritionTrendChart53(m,graphMetric,target)}<small class="ni152-note">Werte je Tag aus dokumentierten Einträgen. Geschätzte Nährwerte sind enthalten, unbekannte Beiträge werden nicht künstlich als null gesetzt.</small></section>`;
 const plotted=m.dozenByDay.map(d=>`<span class="ni152-day" role="img" aria-label="${esc(d.day)}: ${fmt(d.score)}/${fmt(d.max)} dokumentierte Daily-Dozen-Portionen" style="background:${d.score/d.max>=.7?'#227b5f':d.score/d.max>=.4?'#74b89a':d.score?'#c3dccc':'#e9edeb'}" title="${esc(d.day)} · ${fmt(d.score)} / ${d.max}"></span>`).join('');
 const dailyDozen=`<section class="ni152-panel"><h4>🌱 Daily Dozen · Entwicklung</h4><p>Nur protokollierte Tage. Die Farben zeigen dokumentierte Portionen, keine Gesundheitsnote.</p><div class="ni152-days">${plotted}</div><div class="ni152-dozen">${m.dozen.filter(d=>!['exercise','beverages'].includes(d.id)).map(d=>`<div class="ni152-dozenrow"><span>${d.icon} ${esc(d.label)}</span>${chartBar(d.avg,d.goal,'#3b987a')}<strong>${fmt(d.avg)} / ${d.goal}</strong><small>${d.daysMet}/${d.recorded} Tage Ziel erreicht</small></div>`).join('')}</div><div class="ni152-aging">${m.dozen.filter(d=>['berries','nuts','greens'].includes(d.id)).map(d=>`<span>${d.icon} ${esc(d.label)}: ${d.daysPresent}/${d.recorded} Tage erfasst</span>`).join('')}</div>${m.mensaCount?`<p class="ni153-mensa-note">🥗 ${m.mensaCount} Mensa-Mahlzeit(en) dokumentiert. Gemüse/Hülsenfrüchte/Vollkorn werden aus benannten Zutaten und geschätzten Portionsmengen angerechnet; bei ${m.mensaUnquantified} Menüs fehlen Mengenangaben (nur vorsichtige Teilportionen). Weißer Reis zählt nicht automatisch als Vollkorn.</p>`:''}<p class="ni152-note">Anti-Aging Eight: Beeren, Nüsse und Blattgemüse sind aus dieser Dokumentation sichtbar. NAD⁺, microRNA und Postbiotika sind daraus nicht direkt messbar. Krafttraining wird nicht durch pauschale Proteinrestriktion ersetzt.</p></section>`;
 const foodProducts=m.products.filter(p=>nutritionProductKind53(p)==='foods');
 const drinks=m.products.filter(p=>nutritionProductKind53(p)==='drinks');
 const supplements=m.products.filter(p=>nutritionProductKind53(p)==='supplements');
 const products=`<section class="ni152-panel"><h4>🍽️ Was isst du regelmäßig?</h4><p>Lebensmittel und Mahlzeiten – ohne Getränke und Supplements. Häufigkeit je Tag, Menge und Nährstoffbeiträge.</p><div class="ni152-products">${foodProducts.slice(0,10).map(p=>nutritionFoodRow53(p,m.loggedDays)).join('')||'<p>Keine passenden Speisen in diesem Zeitraum erfasst.</p>'}</div><details class="ni153-extras"><summary>🥤 Getränke (${drinks.length}) und 💊 Supplemente (${supplements.length}) separat ansehen</summary><h5>Getränke</h5><div class="ni152-products">${drinks.slice(0,12).map(p=>nutritionFoodRow53(p,m.loggedDays)).join('')||'<small>Keine erfasst</small>'}</div><h5>Supplemente</h5><div class="ni152-products">${supplements.slice(0,12).map(p=>nutritionFoodRow53(p,m.loggedDays)).join('')||'<small>Keine erfasst</small>'}</div></details></section>`;
 const micros=NUTRIENT_TREND_MICROS.filter(k=>m.metrics[k]?.days>0).slice(0,10);
 const micronutrients=`<details class="ni152-panel ni152-details"><summary>🔬 Mikronährstoffe & Fettqualität · Zeitdurchschnitt</summary><div class="ni152-micros">${micros.map(k=>{const v=m.metrics[k],nrv=DAILY_NRV[k],pct=Number.isFinite(nrv)&&v.avg!==null?v.avg/nrv*100:null;return `<div><strong>${esc(NUTRIENT_LABELS[k]?.[0]||k)}</strong><span>Ø ${fmt(v.avg)} ${esc(NUTRIENT_LABELS[k]?.[1]||'')} · ${v.days}/${m.loggedDays} Tage</span>${Number.isFinite(pct)?chartBar(pct,100,'#4d8d95'):''}<small>${Number.isFinite(pct)?fmt(pct,0)+' % EU-NRV (Kennzeichnungswert; kein Mangeltest)':''}</small></div>`;}).join('')}</div><p class="ni152-note">Gesättigte Fette: Ø ${fmt(m.metrics.saturated.avg,2)} g an ${m.metrics.saturated.days} Tagen mit bekannten Werten. ALA/EPA/DHA sind im bestehenden Fettqualitäts-Tab differenziert verfügbar; fehlende Etikettwerte werden nicht als 0 gewertet.</p></details>`;
 const currentReport=report?.key===m.fingerprint?report:null;
 const recommendations=`<section class="ni152-recommend"><div class="ni152-recommend-head"><div><small>OPTIONAL · LOKALE ANALYSE</small><h4>✨ Dein persönlicher Nutrition Coach</h4><p>Konkrete Quellen, Daily-Dozen-Lücken und passende Lebensmittel aus deinem Menü – nur nach deinem Klick.</p></div><button type="button" data-action="ni152-analyze">${currentReport?'Erneut analysieren':'Meine Ernährung analysieren'}</button></div>${currentReport?`<div class="ni152-recommend-list">${currentReport.items.length?currentReport.items.slice(0,3).map(x=>`<article><h5>${esc(x.title)}</h5><p><strong>Beobachtung:</strong> ${esc(x.observation)}</p><p><strong>Dein nächster Schritt:</strong> ${esc(x.action)}</p>${x.detail?`<small>${esc(x.detail)}</small>`:''}</article>`).join('')+(currentReport.items.length>3?`<details class="ni153-more"><summary>Weitere ${currentReport.items.length-3} Befunde ansehen</summary>${currentReport.items.slice(3).map(x=>`<article><h5>${esc(x.title)}</h5><p><strong>Beobachtung:</strong> ${esc(x.observation)}</p><p><strong>Vorschlag:</strong> ${esc(x.action)}</p>${x.detail?`<small>${esc(x.detail)}</small>`:''}</article>`).join('')}</details>`:''):'<p>Keine ausreichenden Daten für belastbare Empfehlungen im Zeitraum. Weiter dokumentieren genügt.</p>'}</div>`:`<p class="ni152-note">${report?'Seit der Analyse wurden Daten oder der Zeitraum geändert. Bitte erneut analysieren.':'Keine automatische Analyse oder KI-Anfrage beim Öffnen dieser Seite.'}</p>`}<p class="ni152-note">Befunde beschreiben dokumentierte Ernährung; fehlende Tage oder Nährstoffangaben sind keine Nullwerte. Empfehlungen sind Optionen, keine Pflicht. Keine automatische Änderung an Mahlzeiten oder Habits.</p></section>`;
 return `<section class="ni152" aria-label="Nutrition Intelligence Überblick"><header><small>COMPASS · NUTRITION INTELLIGENCE</small><h3>Deine Ernährung im Überblick</h3><p>Dr. Gregers Daily Dozen · vollwertig pflanzenbetont · ausreichend Protein für deinen V-Taper</p></header>${periodNav}<p class="ni152-coverage">${esc(dateInfo)} · Durchschnitt nur über Tage mit quantifizierten Werten</p>${macros}${trend}<div class="ni152-columns">${dailyDozen}${products}</div>${micronutrients}${recommendations}</section>`;
}
