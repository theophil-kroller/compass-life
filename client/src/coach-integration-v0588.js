import {trendModel96,trendSvg96,trendExtent96} from './trend-statistics-v0591.js';
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
/** 0.5.91.25 · Three practical protein bands rather than a binary target.
 * The stage boundaries are guides for strength-focused adults, not a medical
 * minimum or a guaranteed hypertrophy threshold. Only measured Fitdays weight
 * from the selected day or earlier is used; missing weight is clearly flagged.
 * Earlier manually configured protein targets remain untouched. */
export function proteinScaleBands125(state,day){
 let latest=null;
 for(const row of state?.healthImports?.fitdays||[]){
  if(dOK(row?.day)&&row.day<=day&&Number.isFinite(row.weightKg)&&row.weightKg>=35&&row.weightKg<=250&&(!latest||row.day>latest.day))latest=row;
 }
 const weight=latest?.weightKg??null;
 const r5=x=>Math.round(x/5)*5;
 const basisFrom=weight===null?100:Math.round(weight*1.2/10)*10;
 const optimalFrom=weight===null?120:r5(weight*1.4);
 const optimalTo=weight===null?140:r5(weight*1.6);
 const optionalTo=weight===null?150:r5(weight*1.75);
 const bounds=[basisFrom,Math.max(basisFrom+5,optimalFrom),Math.max(optimalFrom+5,optimalTo),Math.max(optimalTo+5,optionalTo)];
 const [basis,optimumStart,optimumEnd,optionalEnd]=bounds;
 const max=Math.max(optionalEnd+15,weight===null?165:r5(weight*1.9));
 return {weight,weightDay:latest?.day||null,basis,optimumStart,optimumEnd,optionalEnd,max,weightKnown:weight!==null};
}
function proteinScaleMarkup125(p,state,day){
 const b=proteinScaleBands125(state,day),pct=n=>Math.max(0,Math.min(100,n/b.max*100)),
  widths=[b.basis,b.optimumStart-b.basis,b.optimumEnd-b.optimumStart,b.optionalEnd-b.optimumEnd,b.max-b.optionalEnd],
  classNames=['below','basis','optimal','optional','above'];
 const zones=widths.map((width,i)=>`<span class="ci125-protein-zone ci125-zone-${classNames[i]}" style="width:${pct(width).toFixed(3)}%" aria-hidden="true"></span>`).join('');
 const amount=p.grams===null?'Noch kein Proteinwert erfasst':`${fmt(p.grams)} g erfasst`;
 const description=`${amount}. Grundlage ${b.basis} bis ${b.optimumStart} g, optimaler Bereich ${b.optimumStart} bis ${b.optimumEnd} g, optional ${b.optimumEnd} bis ${b.optionalEnd} g. Diese Bereiche sind Orientierungen, keine harten Mindestwerte.`;
 const marker=p.grams===null?'':`<span class="ci125-protein-marker" style="left:${Math.max(1,Math.min(99,pct(p.grams))).toFixed(2)}%" aria-hidden="true"></span>`;
 return `<div class="ci125-protein-scale" data-protein-scale="1" data-protein-weight="${b.weightKnown?b.weight:''}" aria-label="Protein-Orientierungsbereiche">
  <div class="ci125-protein-meter" role="meter" aria-label="${esc(description)}" aria-valuemin="0" aria-valuemax="${b.max}"${p.grams===null?'':` aria-valuenow="${Math.min(p.grams,b.max)}"`}>
   ${zones}${marker}
  </div>
  <div class="ci125-protein-labels" aria-label="Proteinstufen in Gramm">
   <span><i class="ci125-key ci125-key-basis"></i>Grundlage ${b.basis}–${b.optimumStart} g</span>
   <span><i class="ci125-key ci125-key-optimal"></i>Optimal ${b.optimumStart}–${b.optimumEnd} g</span>
   <span><i class="ci125-key ci125-key-optional"></i>Optional ${b.optimumEnd}–${b.optionalEnd} g</span>
  </div>
  ${b.weightKnown?'':`<small class="ci125-protein-weight-note">Vorläufige Skala: noch kein Körpergewicht bis zu diesem Tag importiert.</small>`}
 </div>`;
}
export function proteinTodayMarkup88(state,today,{compact=false}={}){
 const p=proteinDay88(state,today),label=p.grams===null?'Noch keine Proteinwerte':`${fmt(p.grams)} g Protein erfasst`;
 const scale=proteinScaleMarkup125(p,state,today);
 const foot=`Erfasste Teilbilanz · ${p.unknown?'fehlende Nährwerte möglich':'weitere Mahlzeiten möglich'}${p.estimated?' · teils geschätzt':''}`;
 if(compact)return `<div class="ci90-protein-peek" aria-label="Protein Tagesorientierung – erfasste Teilbilanz"><div class="ci90-protein-head"><span>💪 ${esc(label)}</span><button type="button" data-action="ci88-food-open" aria-label="Ernährung erfassen">＋ Essen</button></div>${scale}<small>${foot}</small></div>`;
 return `<div class="ci88-protein-today" aria-label="Protein Tagesorientierung"><span>💪 ${esc(label)}</span>${scale}<small>${p.partial?'Teilbilanz · unbekannte Lebensmittel möglich':'Erfasste Werte · vollständige Tagesernährung nicht bestätigt'}</small><button type="button" data-action="ci88-food-open">＋ Essen</button></div>`;
}
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
 // Training start is the earliest *documented* session in this training period,
 // not a fabricated physiological intervention or an assertion of causality.
 const startDays=sessions.map(s=>s.day||String(s.start||'').slice(0,10)).filter(d=>dOK(d)&&d<=today).sort();
 const trainingStart=startDays[0]||null;
 const trainingObservations=trainingStart?rows.filter(r=>r.day>=trainingStart):[];
 const postTrainingTrend=trendModel96(trainingObservations.map(r=>({day:r.day,value:r.weightKg})));
 const preTraining=trainingStart?rows.filter(r=>r.day<trainingStart):[];
 const preTrainingTrend=trendModel96(preTraining.map(r=>({day:r.day,value:r.weightKg})),{minPoints:5,minSpanDays:30});
 const enough=lastMonths.length>=8&&new Set(lastMonths.map(x=>x.day)).size>=8&&lastMonths.at(-1).day>lastMonths[0].day&&((Date.parse(lastMonths.at(-1).day)-Date.parse(lastMonths[0].day))/86400000)>=45;
 const weightMedian=v=>{const xs=v.map(x=>x.weightKg).sort((a,b)=>a-b);return xs.length?xs[Math.floor(xs.length/2)]:null;};
 const first=lastMonths.slice(0,Math.max(3,Math.floor(lastMonths.length/4))),last=lastMonths.slice(-Math.max(3,Math.floor(lastMonths.length/4)));const firstKg=weightMedian(first),lastKg=weightMedian(last);const span=first.length&&last.length?(Date.parse(last.at(-1).day)-Date.parse(first[0].day))/86400000:0;
 const slope=enough&&span>20?Math.max(-.06,Math.min(.06,(lastKg-firstKg)/span)):null; // kg/day, bounded scenario input, not a prediction
 const forecast=enough&&slope!==null&&Math.abs(slope)>=.003?['konservativ','mittleres','ambitioniert'].map((kind,i)=>({kind,months:horizonMonths,weightRangeKg:[round(lastKg+slope*horizonMonths*30*[.2,.45,.65][i]-Math.max(1,horizonMonths*.3)),round(lastKg+slope*horizonMonths*30*[.2,.45,.65][i]+Math.max(1,horizonMonths*.3))]})):null;
 return {today,latest,bodyFat,ratio,circum,dayCounts,trainedDays,proteinDays,horizonMonths,forecast,trainingStart,trainingObservations:trainingObservations.length,postTrainingTrend,preTrainingTrend,preTrainingDays:preTraining.length,weightTrendKgPer30:slope===null?null:round(slope*30),sufficient:enough,method:'Fitdays-Punkte, geglättete Gewichtsfenster über mindestens 45 Tage; Szenarien mit abgebremstem Trend und bewusst breiten Intervallen. Kein kausales Körperrekompositionsmodell, keine verlässliche Körperfett- oder Muskelwachstumsprognose. BIA ist hydrationsabhängig.'};
}
/** Plot only the recent training-era window to prevent years-old Fitdays readings
 * from compressing the user's 2026 training points into the far right edge.
 * Long-term historic observations remain available in the separate Fitdays view.
 */
export function vTaperChart88(state,model){
 const all=(state?.healthImports?.fitdays||[]).filter(r=>dOK(r?.day)&&r.day<=model.today&&Number.isFinite(r.weightKg)).sort((a,b)=>a.day.localeCompare(b.day));
 if(all.length<2)return '';
 const start=model.trainingStart||new Date(Date.parse(model.today+'T12:00:00Z')-90*86400000).toISOString().slice(0,10);
 const earliest=new Date(Date.parse(start+'T12:00:00Z')-21*86400000).toISOString().slice(0,10);
 let obs=all.filter(r=>r.day>=earliest).slice(-100);
 if(obs.length<2)obs=all.slice(-100);
 const training=obs.filter(r=>model.trainingStart&&r.day>=model.trainingStart);
 const trend=trendModel96(training.map(r=>({day:r.day,value:r.weightKg})));
 const values=trendExtent96(trend,obs.map(r=>r.weightKg)),bounds=model.forecast?.flatMap(f=>f.weightRangeKg)||[];
 const lo=Math.min(...values,...bounds)-.6,hi=Math.max(...values,...bounds)+.6,range=Math.max(.5,hi-lo);
 const W=720,H=202,L=48,R=32,T=24,B=35,plotBottom=H-B;
 const Y=n=>plotBottom-(n-lo)/range*(plotBottom-T);
 const first=Date.parse(obs[0].day+'T12:00:00Z'),last=Date.parse(obs.at(-1).day+'T12:00:00Z'),span=Math.max(86400000,last-first);
 const right=model.forecast?390:W-R;
 const X=d=>L+(Date.parse(d+'T12:00:00Z')-first)/span*(right-L);
 const ticks=[0,.5,1].map(f=>{const v=lo+(hi-lo)*f;return `<line x1="${L}" x2="${W-R}" y1="${Y(v).toFixed(2)}" y2="${Y(v).toFixed(2)}" stroke="#dbe8e2"/><text x="${L-6}" y="${(Y(v)+4).toFixed(2)}" text-anchor="end" fill="#647d74" font-size="11">${fmt(v)}</text>`;}).join('');
 const dots=obs.map(r=>`<circle cx="${X(r.day).toFixed(1)}" cy="${Y(r.weightKg).toFixed(1)}" r="3.6" fill="#417e8d"><title>${esc(r.day)} · ${fmt(r.weightKg)} kg · Fitdays</title></circle>`).join('');
 const marker=model.trainingStart&&model.trainingStart>=obs[0].day&&model.trainingStart<=obs.at(-1).day?`<path d="M${X(model.trainingStart)} ${T}V${plotBottom}" stroke="#b8996e" stroke-dasharray="3 5"/><text x="${X(model.trainingStart)+5}" y="${T-7}" font-size="10" fill="#95734c">Trainingsbeginn</text>`:'';
 const scenario=model.forecast?model.forecast.map((f,i)=>{const middle=(f.weightRangeKg[0]+f.weightRangeKg[1])/2,x=W-R-15;return `<path d="M${right+2} ${Y(obs.at(-1).weightKg)}L${x} ${Y(middle)}" fill="none" stroke="${['#987e97','#3e8571','#c3a27a'][i]}" stroke-width="1.8" stroke-dasharray="6 5"/><path d="M${x} ${Y(f.weightRangeKg[0])}V${Y(f.weightRangeKg[1])}" stroke="${['#987e97','#3e8571','#c3a27a'][i]}" stroke-width="5" opacity=".4"/>`;}).join(''):'';
 const periodLabel=model.trainingStart?'seit dokumentiertem Trainingsbeginn':'letzte verfügbare 90 Tage';
 return `<svg class="ci88-forecast-svg" viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Fitdays-Messpunkte ${esc(periodLabel)}; soweit statistisch möglich Trendlinie mit 96-Prozent-Konfidenzintervall">${ticks}${marker}${trendSvg96(trend,{X,Y,color:'#2b7f78'})}${dots}${scenario}<text x="${L}" y="${H-13}" font-size="11" fill="#657e76">${esc(obs[0].day)}</text><text x="${right}" y="${H-13}" text-anchor="end" font-size="11" fill="#657e76">${esc(obs.at(-1).day)}</text>${model.forecast?`<text x="${W-R}" y="${H-13}" text-anchor="end" font-size="10" fill="#657e76">+${model.horizonMonths} M.</text>`:''}<text x="${W-R}" y="${H-1}" text-anchor="end" font-size="10" fill="#647d74">kg · ${esc(periodLabel)}</text></svg>`;
}
export function vTaperView88(state,{today,horizonMonths=6}={}){
 const m=vTaperModel88(state,{today,horizonMonths});
 const trend=m.postTrainingTrend;
 const trendSummary=m.trainingStart?`<div class="ci91-training-trend"><strong>Seit Trainingsbeginn ${esc(m.trainingStart)}</strong> · ${m.trainingObservations} Fitdays-Messdaten · ${trend?`Beobachteter Trend ${trend.slopePerDay>0?'+':''}${fmt(trend.slopePerDay*7)} kg/Woche <small>(96-%-KI um den Mittelwert; nur im beobachteten Fenster, keine Hochrechnung)</small>`:'für einen Kurztrend mindestens 5 Messdaten über 7 Tage erforderlich'}${m.preTrainingTrend?`<p>Historischer Trend vor Trainingsbeginn: ${fmt(m.preTrainingTrend.slopePer30Days)} kg / 30 Tage, aus ${m.preTrainingTrend.n} Messdaten. Zwei getrennte Beobachtungszeiträume – keine nachgewiesene Trainingswirkung.</p>`:''}</div>`:'<p>Für die Trennung „vor / nach Trainingsbeginn“ wird mindestens eine dokumentierte Trainingseinheit benötigt.</p>';
 const forecastHelp=m.forecast?`<div class="ci88-scenarios">${m.forecast.map(r=>`<div><small>${r.kind} · Szenarioband</small><strong>${fmt(r.weightRangeKg[0])}–${fmt(r.weightRangeKg[1])} kg</strong></div>`).join('')}</div>`:'<p>Langfristige Prognose noch nicht belastbar: mindestens acht Fitdays-Messtage über 45 Tage erforderlich. Der Trend seit Trainingsbeginn wird oben bereits separat angezeigt, aber nicht auf Monate oder Jahre extrapoliert.</p>';
 return `<section class="work-card ci88-vtaper"><div class="work-heading"><span>◇ V-Taper Entwicklung · Fitdays + bestätigtes Training</span><span class="quiet-tag">Messung ≠ Prognose</span></div><div class="ci88-metrics"><div><small>Gewicht · Messung</small><strong>${m.latest?fmt(m.latest.weightKg)+' kg':'–'}</strong></div><div><small>Körperfett · BIA-Schätzung</small><strong>${m.bodyFat===null?'–':fmt(m.bodyFat)+' %'}</strong></div><div><small>Schulter / Taille</small><strong>${m.ratio===null?'–':fmt(m.ratio)}</strong></div><div><small>Trainingstage · 90 Tage</small><strong>${m.trainedDays||'–'}</strong></div></div>${vTaperChart88(state,m)}${trendSummary}<div class="ci88-forecast-header"><strong>Vorausschau · ${horizonMonths} Monate</strong><div>${[3,6,12,24].map(n=>`<button type="button" data-action="ci88-horizon" data-id="${n}" class="secondary-btn ${horizonMonths===n?'active':''}">${n} M.</button>`).join('')}</div></div>${forecastHelp}<small>${esc(m.method)} Ein 96-%-Konfidenzband ist statistisch bedingt und erfasst weder die Hydratationsunsicherheit der BIA noch zukünftige Verhaltensänderungen.</small></section>`;
}
