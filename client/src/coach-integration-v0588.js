/** Compass 0.5.88 – existing encrypted nutritionJournal and Fitdays observations.
 * One-off foods are ENTRY snapshots, not another master food catalogue.
 * Unlogged or unknown food is never assumed to contain zero protein.
 */
import {nutritionFoods,ensureJournal} from './personal-journal-v5692.js';
import {nutrientEntry} from './nutrition-intelligence-v57712.js';
import {nutritionTrendsIndex} from './nutrition-trends-v57726.js';
import {strengthPeriod} from './strength-insights-v57728.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dOK=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'));
const round=n=>Math.round(n*10)/10;
const fmt=n=>Number.isFinite(n)?n.toLocaleString('de-AT',{maximumFractionDigits:1}):'–';
const localDay=at=>{const d=new Date(at);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
export const PROTEIN_TARGET_DEFAULT=150;
export function proteinTarget88(state){
 const n=Number(state?.nutritionJournal?.proteinCoach88?.targetG);
 if(Number.isFinite(n)&&n>=60&&n<=250)return Math.round(n);
 // Practical 1.7 g/kg starting guidance for strength-focused adults; only if a
 // measured Fitdays bodyweight exists. Never replace a manually chosen target.
 let latest=null;
 for(const r of state?.healthImports?.fitdays||[]){if(dOK(r?.day)&&Number.isFinite(r.weightKg)&&r.weightKg>=35&&r.weightKg<=250&&(!latest||r.day>latest.day))latest=r;}
 return latest?Math.max(60,Math.min(250,Math.round(latest.weightKg*1.7/5)*5)):PROTEIN_TARGET_DEFAULT;
}
export function saveProteinSettings88(state,{targetG,fasting='flex',waistCm=null,shoulderCm=null}={}){
 ensureJournal(state);const target=Number(targetG);if(!Number.isFinite(target)||target<60||target>250)throw Error('Proteinziel bitte zwischen 60 und 250 g setzen.');
 if(!['flex','20:4','18:6','16:8'].includes(fasting))throw Error('Fastenfenster unbekannt.');
 const prev=state.nutritionJournal.proteinCoach88||{},circ=(v)=>v===''||v===null?null:Number(v);
 const waist=circ(waistCm),shoulder=circ(shoulderCm);
 if((waist!==null&&(!Number.isFinite(waist)||waist<40||waist>200))||(shoulder!==null&&(!Number.isFinite(shoulder)||shoulder<50||shoulder>220)))throw Error('Umfang außerhalb des plausiblen Messbereichs.');
 const next={...prev,targetG:Math.round(target),fasting,updatedAt:new Date().toISOString()};state.nutritionJournal.proteinCoach88=next;
 if(waist!==null||shoulder!==null){state.nutritionJournal.bodyMeasures88??=[];state.nutritionJournal.bodyMeasures88.push({id:crypto.randomUUID(),day:localDay(new Date()),waistCm:waist,shoulderCm:shoulder,updatedAt:new Date().toISOString()});}
 return next;
}
/** Direct daily path avoids computing multi-year nutrition/health trends on Today. */
export function proteinDay88(state,day){
 const foods=new Map(nutritionFoods(state).map(f=>[f.id,f]));const entries=(state?.nutritionJournal?.entries||[]).filter(e=>!e.deleted&&localDay(e.at)===day);
 let grams=0,known=0,estimated=0,unknown=0;
 for(const e of entries){const f=foods.get(e.foodId)||e.foodSnapshot;const result=nutrientEntry(f,e);if(Number.isFinite(result.values?.protein)){grams+=result.values.protein;known++;if(result.estimatedKeys.has('protein')||result.partialKeys.has('protein'))estimated++;}else unknown++;}
 return {day,grams:known?round(grams):null,target:proteinTarget88(state),known,estimated,unknown,entries:entries.length,partial:unknown>0||estimated>0||entries.length===0,coverage:entries.length?known/entries.length:null};
}
export function proteinHistory88(state,{today,days=30}={}){
 if(!dOK(today))throw Error('Datum fehlt.');const index=nutritionTrendsIndex(state),list=[];
 for(let n=days-1;n>=0;n--){const at=new Date(today+'T12:00:00Z');at.setUTCDate(at.getUTCDate()-n);const day=at.toISOString().slice(0,10),bucket=index.days.get(day)?.summary;const cov=bucket?.coverage?.protein;
  list.push({day,grams:cov?.known?bucket.totals.protein:null,known:cov?.known||0,unknown:cov?.unknown||0,estimated:cov?.estimated||0,logged:bucket?.entries||0});}
 return list;
}
const macros=['kcal','protein','carbs','fat','fiber','sugar','salt'];
export function parseOpenFoodEstimate88(text){
 const raw=String(text||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');let v;
 try{v=JSON.parse(raw);}catch{throw Error('Bitte einen vollständigen JSON-Block mit Klammern einfügen.');}
 if(v?.schema!=='compass_open_food_v1'||typeof v.title!=='string'||!v.title.trim())throw Error('Erwartet: schema compass_open_food_v1 und title.');
 const nutrients={};for(const k of macros){const n=v.nutrients?.[k];if(n===null||n===undefined||n==='')continue;if(typeof n!=='number'||!Number.isFinite(n)||n<0||n>10000)throw Error(`Ungültiger Nährwert: ${k}`);nutrients[k]=n;}
 return {title:v.title.trim().slice(0,90),amount:String(v.amount||'1 Portion').slice(0,60),source:String(v.source||'Schätzung ohne verifizierte Quelle').slice(0,200),assumptions:String(v.assumptions||'').slice(0,500),nutrients,estimated:v.estimated!==false,at:v.at||null};
}
export function addOpenFood88(state,{title,amount='1 Portion',at=null,nutrients={},source='Unbekannt',assumptions='',estimated=true,saveAsFood=false}={}){
 ensureJournal(state);const clean=parseOpenFoodEstimate88(JSON.stringify({schema:'compass_open_food_v1',title,amount,nutrients,source,assumptions,estimated,at}));
 const stamp=at?new Date(at):new Date();if(!Number.isFinite(+stamp))throw Error('Datum/Uhrzeit ungültig.');
 let snapshot={id:'oneoff:'+crypto.randomUUID(),title:clean.title,emoji:'🍽️',group:'Eigene',defaultAmount:clean.amount,nutrientBasis:'perPortion',nutrients:clean.nutrients,source:clean.source,description:clean.assumptions,estimate:clean.estimated};
 if(saveAsFood){const match=nutritionFoods(state).find(x=>x.title.toLowerCase()===clean.title.toLowerCase()&&x.group==='Eigene');if(match)snapshot=match;else{snapshot={...snapshot,id:'custom:'+crypto.randomUUID(),updatedAt:new Date().toISOString()};state.nutritionJournal.customFoods.push(snapshot);}}
 const now=new Date().toISOString();const item={id:crypto.randomUUID(),foodId:snapshot.id,at:stamp.toISOString(),amount:clean.amount,note:clean.assumptions,updatedAt:now,deleted:false,...(!saveAsFood?{foodSnapshot:snapshot}:{})};
 state.nutritionJournal.entries.push(item);return item;
}
export const OPEN_FOOD_PROMPT88=`Antworte AUSSCHLIESSLICH als valides JSON. Schema compass_open_food_v1. Ich beschreibe eine vegetarische Mahlzeit. Schätze die Nährstoffe der tatsächlich beschriebenen Portion (nicht pro 100 g). Gib title, amount, nutrients:{kcal,protein,carbs,fat,fiber,sugar,salt}, source, assumptions, estimated:true zurück. Nicht bestimmbares als null, keine erfundenen Präzisionswerte. Bitte Anzahl und Zutaten sowie Unsicherheit begründen. Meine Mahlzeit: `;
export function openFoodView88(){return `<details class="ci88-open-food"><summary>＋ Spontane Mahlzeit erfassen · kein neuer Produktdatensatz nötig</summary><form id="ci88-open-food-form"><label>Was hast du gegessen?<input name="title" maxlength="90" placeholder="z. B. 2 Stück vegetarische Lasagne" required></label><label>Portion<input name="amount" maxlength="60" value="1 Portion"></label><label>Zeitpunkt<input name="at" type="datetime-local"></label><div class="ci88-open-nutrients"><label>Protein (g)<input name="protein" inputmode="decimal" type="number" min="0" step="0.1" placeholder="Unbekannt"></label><label>kcal<input name="kcal" inputmode="decimal" type="number" min="0" step="1" placeholder="Unbekannt"></label><label>Kohlenhydrate (g)<input name="carbs" type="number" min="0" step="0.1" placeholder="Unbekannt"></label><label>Fett (g)<input name="fat" type="number" min="0" step="0.1" placeholder="Unbekannt"></label></div><label>Quelle / Annahmen<textarea name="assumptions" rows="2" placeholder="Etikett, Zutaten, Portionsgröße – oder noch unbekannt"></textarea></label><label><input type="checkbox" name="saveAsFood"> Für künftige Eingaben als eigenes Lebensmittel speichern</label><button type="submit" class="primary-btn">Zum Tagebuch hinzufügen</button></form><details><summary>GPT-Vorschlag als JSON übernehmen</summary><button type="button" data-action="ci88-copy-food-prompt" class="secondary-btn">GPT-Schätzprompt kopieren</button><form id="ci88-food-json-form"><textarea name="json" rows="5" placeholder='{"schema":"compass_open_food_v1","title":"Vegetarische Lasagne","amount":"2 Stück","nutrients":{"protein":null},"estimated":true}'></textarea><label><input type="checkbox" name="saveAsFood"> Als wiederverwendbares Lebensmittel speichern</label><button type="submit" class="secondary-btn">Schätzung prüfen und übernehmen</button></form><small>Schätzung wird erst nach deiner Bestätigung übernommen. Du kannst alle Werte später korrigieren.</small></details></details>`;}
export function proteinTodayMarkup88(state,today){const p=proteinDay88(state,today),pct=p.grams===null?0:Math.min(100,p.grams/p.target*100),label=p.grams===null?'Noch keine Proteinwerte':`${fmt(p.grams)} / ${p.target} g Protein`;
 return `<div class="ci88-protein-today" aria-label="Protein Tagesorientierung"><span>💪 ${esc(label)}</span><span class="ci88-protein-progress"><i style="width:${pct}%"></i></span><small>${p.partial?'Teilbilanz · unbekannte Lebensmittel möglich':'Erfasste Werte · vollständige Tagesernährung nicht bestätigt'}</small><button type="button" data-action="ci88-food-open">＋ Essen</button></div>`;}
export function proteinInsightsMarkup88(state,today){const p=proteinDay88(state,today),history=proteinHistory88(state,{today,days:30}),target=p.target;const valid=history.filter(x=>x.grams!==null),avg=n=>{const r=valid.slice(-n);return r.length?round(r.reduce((s,x)=>s+x.grams,0)/r.length):null;};
 const bars=history.slice(-14).map(x=>`<span title="${esc(x.day)} · ${x.grams===null?'unbekannt':fmt(x.grams)+' g'}${x.unknown?' · '+x.unknown+' unbekannt':''}" style="height:${x.grams===null?'3px':Math.max(4,Math.min(90,x.grams/target*90))+'px'};opacity:${x.unknown||x.estimated?'.5':'1'}"></span>`).join('');
 return `<section class="work-card ci88-protein-insights"><div class="work-heading"><span>💪 Protein Intelligence</span><span class="quiet-tag">Ziel ${target} g/Tag · anpassbar</span></div><div class="ci88-protein-main"><strong>${p.grams===null?'–':fmt(p.grams)} / ${target} g</strong><small>Heute · ${p.unknown} Eintrag/Einträge ohne Proteinwert${p.estimated?' · '+p.estimated+' geschätzt':''}</small></div><div class="ci88-trend" aria-label="Letzte 14 Tage mit erfassten Proteinmengen">${bars}</div><p>Beobachteter Mittelwert der <b>${valid.length}</b> Tage mit bekannten Proteinmengen: letzte 7 Datenpunkte <b>${fmt(avg(7))} g</b> · bis zu 30 Datenpunkte <b>${fmt(avg(30))} g</b>. Keine Aussage über nicht erfasste Mahlzeiten.</p><form id="ci88-protein-settings"><label>Protein-Ziel (g)<input name="targetG" type="number" min="60" max="250" step="5" value="${target}"></label><label>Fastenfenster<select name="fasting">${['flex','16:8','18:6','20:4'].map(x=>`<option value="${x}" ${state?.nutritionJournal?.proteinCoach88?.fasting===x?'selected':''}>${x==='flex'?'Flexibel':x}</option>`).join('')}</select></label><label>Taille (cm, optional)<input name="waistCm" type="number" min="40" max="200" step=".1" placeholder="Nur Messwerte"></label><label>Schulterumfang (cm, optional)<input name="shoulderCm" type="number" min="50" max="220" step=".1" placeholder="Nur Messwerte"></label><button type="submit" class="secondary-btn">Ziel / Maße speichern</button></form><details><summary>Vegetarische Proteinoptionen ohne feste Essenszeiten</summary><p>Skyr oder Magerquark/Topfen, Hüttenkäse, Seitan, Edamame, Tofu oder ein Proteinshake liefern viel Protein je Kalorie. Orientierung: ca. 250 g Skyr (~25 g Protein), 200 g Magerquark (~24 g), 150 g Seitan (~30 g); je nach Produktetikett. Fehlende Tageslogs bedeuten keinen nachgewiesenen Bedarf. Fastenfenster ist eine Planungshilfe, kein Anlass, einzelne Mahlzeiten zu erzwingen.</p></details>${openFoodView88()}</section>`;}
export function vTaperModel88(state,{today,horizonMonths=6}={}){
 const rows=(state?.healthImports?.fitdays||[]).filter(x=>dOK(x?.day)&&x.day<=today&&Number.isFinite(x.weightKg)&&x.weightKg>=30&&x.weightKg<=250).sort((a,b)=>a.day.localeCompare(b.day));
 const latest=rows.at(-1)||null,dayCounts=new Set(rows.map(x=>x.day)).size;
 const lastMonths=rows.filter(x=>latest&&(Date.parse(latest.day)-Date.parse(x.day))<=90*86400000);
 const bodyFat=latest&&Number.isFinite(latest.bodyFatPct)?latest.bodyFatPct:null;
 const measurements=[...(state?.nutritionJournal?.bodyMeasures88||[])].filter(x=>dOK(x.day)&&x.day<=today).sort((a,b)=>a.day.localeCompare(b.day));const circum=measurements.at(-1)||{};
 const ratio=Number.isFinite(circum.shoulderCm)&&Number.isFinite(circum.waistCm)&&circum.waistCm>0?round(circum.shoulderCm/circum.waistCm):null;
 const period=strengthPeriod(state,{today,range:'90'}),sessions=period?.sessions||[],trainedDays=new Set(sessions.filter(s=>s.sets?.some(t=>t?.exerciseId)).map(s=>s.day)).size;
 const protein=proteinHistory88(state,{today,days:30});const proteinDays=protein.filter(x=>x.grams!==null).length;
 const enough=lastMonths.length>=8&&new Set(lastMonths.map(x=>x.day)).size>=8&&lastMonths.at(-1).day>lastMonths[0].day&&((Date.parse(lastMonths.at(-1).day)-Date.parse(lastMonths[0].day))/86400000)>=45;
 const weightMedian=v=>{const xs=v.map(x=>x.weightKg).sort((a,b)=>a-b);return xs.length?xs[Math.floor(xs.length/2)]:null;};
 const first=lastMonths.slice(0,Math.max(3,Math.floor(lastMonths.length/4))),last=lastMonths.slice(-Math.max(3,Math.floor(lastMonths.length/4)));const firstKg=weightMedian(first),lastKg=weightMedian(last);const span=first.length&&last.length?(Date.parse(last.at(-1).day)-Date.parse(first[0].day))/86400000:0;
 const slope=enough&&span>20?Math.max(-.06,Math.min(.06,(lastKg-firstKg)/span)):null; // kg/day, bounded scenario input, not a prediction
 const forecast=enough&&slope!==null&&Math.abs(slope)>=.003?['konservativ','mittleres','ambitioniert'].map((kind,i)=>({kind,months:horizonMonths,weightRangeKg:[round(lastKg+slope*horizonMonths*30*[.2,.45,.65][i]-Math.max(1,horizonMonths*.3)),round(lastKg+slope*horizonMonths*30*[.2,.45,.65][i]+Math.max(1,horizonMonths*.3))]})):null;
 return {today,latest,bodyFat,ratio,circum,dayCounts,trainedDays,proteinDays,horizonMonths,forecast,weightTrendKgPer30:slope===null?null:round(slope*30),sufficient:enough,method:'Fitdays-Punkte, geglättete Gewichtsfenster über mindestens 45 Tage; Szenarien mit abgebremstem Trend und bewusst breiten Intervallen. Kein kausales Körperrekompositionsmodell, keine verlässliche Körperfett- oder Muskelwachstumsprognose. BIA ist hydrationsabhängig.'};
}
/** Separate observed dots from conditional, deliberately wide future scenario bands. */
export function vTaperChart88(state,model){
 const obs=(state?.healthImports?.fitdays||[]).filter(r=>dOK(r?.day)&&r.day<=model.today&&Number.isFinite(r.weightKg)).sort((a,b)=>a.day.localeCompare(b.day)).slice(-100);
 if(obs.length<2)return '';
 const weights=obs.map(x=>x.weightKg),bands=model.forecast?.flatMap(x=>x.weightRangeKg)||[];
 const minimum=Math.min(...weights,...bands)-1,maximum=Math.max(...weights,...bands)+1,range=Math.max(1,maximum-minimum);
 const y=n=>Math.round(152-(n-minimum)/range*120),first=Date.parse(obs[0].day),last=Date.parse(obs.at(-1).day),duration=Math.max(1,last-first),x=d=>40+(Date.parse(d)-first)/duration*295;
 const dots=obs.map(r=>`<circle cx="${x(r.day).toFixed(1)}" cy="${y(r.weightKg)}" r="2.4" fill="#417e8d" opacity=".72"><title>${esc(r.day)} · ${fmt(r.weightKg)} kg · Fitdays</title></circle>`).join('');
 const sorted=obs.filter((r,i)=>i===0||i===obs.length-1||i%2===0);
 const line=sorted.map((r,i)=>`${i?'L':'M'}${x(r.day).toFixed(1)} ${y(r.weightKg)}`).join(' ');
 const scenarios=model.forecast?model.forecast.map((f,i)=>{const mid=(f.weightRangeKg[0]+f.weightRangeKg[1])/2,cy=y(mid),xx=650;return `<path d="M 336 ${y(obs.at(-1).weightKg)} L ${xx} ${cy}" fill="none" stroke="${['#9a879a','#3e8571','#c3a27a'][i]}" stroke-width="2" stroke-dasharray="6 5"/><path d="M ${xx} ${y(f.weightRangeKg[0])} V ${y(f.weightRangeKg[1])}" stroke="${['#9a879a','#3e8571','#c3a27a'][i]}" stroke-width="5" opacity=".4"><title>${esc(f.kind)} · Szenariointervall</title></path>`;}).join(''):'';
 return `<svg class="ci88-forecast-svg" viewBox="0 0 720 192" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Historische Fitdays-Gewichte als Punkte und eventuell Szenarien als gestrichelte Linien"><path d="M40 20V152H690" fill="none" stroke="#bfd4ce"/><path d="M336 20 V152" stroke="#bd9874" stroke-dasharray="2 4"/><text x="340" y="16" font-size="11" fill="#7b766d">Heute · Grenze Prognose</text><text x="40" y="178" font-size="11" fill="#68827a">${esc(obs[0].day)}</text><text x="610" y="178" font-size="11" fill="#68827a">+ ${model.horizonMonths} Monate</text><text x="3" y="31" font-size="10" fill="#68827a">${fmt(maximum)}</text><text x="3" y="151" font-size="10" fill="#68827a">${fmt(minimum)}</text><path d="${line}" fill="none" stroke="#417e8d" stroke-width="1.3" opacity=".45"/>${dots}${scenarios}</svg>`;
}
export function vTaperView88(state,{today,horizonMonths=6}={}){const m=vTaperModel88(state,{today,horizonMonths});return `<section class="work-card ci88-vtaper"><div class="work-heading"><span>◇ V-Taper Entwicklung · Fitdays + bestätigtes Training</span><span class="quiet-tag">Messung ≠ Prognose</span></div><div class="ci88-metrics"><div><small>Gewicht · Messung</small><strong>${m.latest?fmt(m.latest.weightKg)+' kg':'–'}</strong></div><div><small>Körperfett · BIA-Schätzung</small><strong>${m.bodyFat===null?'–':fmt(m.bodyFat)+' %'}</strong></div><div><small>Schulter / Taille</small><strong>${m.ratio===null?'–':fmt(m.ratio)}</strong></div><div><small>Trainingstage · 90 Tage</small><strong>${m.trainedDays||'–'}</strong></div></div>${vTaperChart88(state,m)}<div class="ci88-forecast-header"><strong>Vorausschau · ${horizonMonths} Monate</strong><div>${[3,6,12,24].map(n=>`<button type="button" data-action="ci88-horizon" data-id="${n}" class="secondary-btn ${horizonMonths===n?'active':''}">${n} M.</button>`).join('')}</div></div>${m.forecast?`<div class="ci88-scenarios">${m.forecast.map(r=>`<div><small>${r.kind} · Szenarioband</small><strong>${fmt(r.weightRangeKg[0])}–${fmt(r.weightRangeKg[1])} kg</strong></div>`).join('')}</div>`:'<p>Keine belastbare persönliche Zukunftsprognose: benötigt mindestens acht Fitdays-Messpunkte über 45 Tage und einen beobachtbaren längerfristigen Gewichtstrend. Bis dahin bleiben Zielwerte reine Planungsannahmen.</p>'}<small>${esc(m.method)} Muskelaufbau, Taillenentwicklung und Körperfett werden nicht einfach linear extrapoliert. Eine fehlende Umfangsmessung ist kein Nullfortschritt.</small></section>`;}
