import {fatMassVisualView} from './body-fat-visual-v57759402522.js';
import {fitdaysDynamicBodyView} from './body-comparison-v57759402524.js';
/** Compass .40.25.17 — supplemental Fitdays reading aid, NEVER a diagnosis.
 * Based exclusively on imported observations. The existing point plots and five
 * region figure stay the authoritative visualisations of the measured history.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(x,digits=1)=>Number(x).toLocaleString('de-AT',{maximumFractionDigits:digits});
const whrNum=(x,digits=3)=>Number(x).toLocaleString('de-AT',{minimumFractionDigits:digits,maximumFractionDigits:digits});
const get=(x,k)=>Number.isFinite(x?.[k])?x[k]:null;
const validWhr=x=>Number.isFinite(x)&&x>=.45&&x<=1.6;
/** WHO/NLM-style general reference, not a diagnosis or aesthetic V-taper scale.
 * Sex-specific interpretation is only applied if a parameter was configured.
 */
export function whrInterpretation(whr,sex=''){
 if(!validWhr(whr))return {available:false,label:'Nicht bestimmt',threshold:null,kind:'unknown'};
 const threshold=sex==='male'?.90:sex==='female'?.85:null;
 if(threshold!==null)return {available:true,threshold,kind:whr>=threshold?'above-reference':'below-reference',
  label:whr>=threshold?'Oberhalb des Orientierungswerts':'Unterhalb des Orientierungswerts'};
 return {available:true,threshold:null,kind:whr>=.90?'above-both':whr>=.85?'sex-dependent':'below-both',
  label:whr>=.90?'Über beiden geschlechtsspezifischen Orientierungswerten':whr>=.85?'Einordnung abhängig vom Referenzparameter':'Unter beiden Orientierungswerten'};
}
/** Read-only merge of genuinely recorded ratios. Smart Tape never mutates old
 * scale observations. The newest available dated ratio wins, with Tape winning
 * same-day ties because it is computed from directly measured circumferences.
 */
export function currentWhrEvidence(fitdays=[],smartTapeWhrSeries=[]){
 const scale=(Array.isArray(fitdays)?fitdays:[]).filter(x=>validWhr(get(x,'whr'))&&/^\d{4}-\d{2}-\d{2}$/.test(x?.day||''))
  .map(x=>({day:x.day,at:x.at||x.day+'T00:00:00',ratio:x.whr,origin:x.whrOrigin==='circumferences'?'circumferences':'fitdays',
   waistCm:get(x,'waistCm'),hipCm:get(x,'hipCm')})).sort((a,b)=>a.day.localeCompare(b.day)||a.at.localeCompare(b.at));
 const tape=(Array.isArray(smartTapeWhrSeries)?smartTapeWhrSeries:[])
  .filter(x=>validWhr(x?.ratio)&&Number.isFinite(x.waistCm)&&Number.isFinite(x.hipCm)&&x.hipCm>0&&x.qualityStatus!=='questionable'
   &&/^\d{4}-\d{2}-\d{2}$/.test(x?.day||''))
  .map(x=>({day:x.day,at:x.at||x.day+'T00:00:00',ratio:x.ratio,origin:'smart-tape',waistCm:x.waistCm,hipCm:x.hipCm,
   sourceIds:x.sourceIds||[]})).sort((a,b)=>a.day.localeCompare(b.day)||a.at.localeCompare(b.at));
 const newestScale=scale.at(-1)||null,newestTape=tape.at(-1)||null;
 const latest=newestTape&&(!newestScale||newestTape.day>=newestScale.day)?newestTape:newestScale;
 const history=latest?.origin==='smart-tape'?tape:scale;
 return {latest:latest||null,history};
}

/** Dynamic per-measurement calculations. Nothing is written to the vault.
 * Garmin activity calories are not daily resting calories and never become BMR.
 * WHR needs a per-record device estimate OR the two actual circumferences.
 */
export function resolvedBodyMetrics(row,heightCm=null){
 const h=Number(heightCm),weight=get(row,'weightKg'),fat=get(row,'bodyFatPct'),fatMass=get(row,'fatMassKg');
 const validHeight=Number.isFinite(h)&&h>=120&&h<=230;
 const importedBmi=get(row,'bmi');
 const bmiComputed=importedBmi===null&&validHeight&&weight!==null&&weight>20;
 const bmi=importedBmi??(bmiComputed?Math.round(weight/(h/100)**2*100)/100:null);
 const importedFatFree=get(row,'fatFreeKg');
 const fromFat=weight!==null&&fat!==null&&fat>=1&&fat<=75?weight*(1-fat/100):null;
 const fromFatKg=weight!==null&&fatMass!==null&&fatMass>=0&&fatMass<weight?weight-fatMass:null;
 const fatFreeKg=importedFatFree??(fromFat!==null?Math.round(fromFat*100)/100:fromFatKg!==null?Math.round(fromFatKg*100)/100:null);
 const importedBmr=get(row,'bmrKcal');
 const computedBmr=importedBmr===null&&fatFreeKg!==null&&fatFreeKg>=15&&fatFreeKg<=200;
 const bmrKcal=importedBmr??(computedBmr?Math.round(370+21.6*fatFreeKg):null);
 const importedWhr=get(row,'whr'),waist=get(row,'waistCm'),hip=get(row,'hipCm');
 const computedWhr=importedWhr===null&&waist!==null&&hip!==null&&waist>=40&&hip>=50&&waist/hip>=.45&&waist/hip<=1.6;
 const whr=importedWhr??(computedWhr?Math.round(waist/hip*1000)/1000:null);
 const importedAsmi=get(row,'asmi'),parts=['leftArm','rightArm','leftLeg','rightLeg'].map(k=>get(row?.segmentMuscle?.[k],'kg'));
 const segmentMass=parts.every(n=>n!==null&&n>0)?parts.reduce((a,b)=>a+b,0):null;
 // This is a BIA appendicular-muscle-mass *proxy*, not clinically validated ASMM.
 const derivedAsmi=importedAsmi===null&&validHeight&&segmentMass!==null&&segmentMass<weight*.6;
 const asmi=importedAsmi??(derivedAsmi?Math.round(segmentMass/(h/100)**2*100)/100:null);
 return {...row,bmi,fatFreeKg,bmrKcal,whr,asmi,
  bmiOrigin:importedBmi!==null?'fitdays':bmiComputed?'computed':'missing',
  fatFreeOrigin:importedFatFree!==null?'fitdays':fatFreeKg!==null?'calculated':'missing',
  bmrOrigin:importedBmr!==null?'fitdays':computedBmr?'katch-mcardle':'missing',
  whrOrigin:importedWhr!==null?'fitdays':computedWhr?'circumferences':'missing',
  asmiOrigin:importedAsmi!==null?'fitdays':derivedAsmi?'segment-proxy':'missing'};
}

const measures=Object.freeze([
 {key:'bodyFatPct',label:'Körperfett',unit:'%',min:0,max:55,about:'Bioimpedanz-Schätzung des Körperfettanteils. Referenzbereiche hängen unter anderem vom Alter und vom verwendeten Bewertungsmodell ab.'},
 {key:'visceralFat',label:'Viszeralfett',unit:'Index',min:0,max:30,about:'Von Fitdays berechneter Index für Fett im Bauchraum. Kein direkt gemessenes Volumen und nicht mit Prozent oder kg gleichzusetzen.'},
 {key:'subcutaneousFatPct',label:'Subkutanes Fett',unit:'%',min:0,max:60,about:'Geschätzter Anteil des Unterhautfetts. Die Bewertung hängt von der Messmethode und den jeweiligen Referenzen ab.'},
 {key:'bmi',label:'BMI',unit:'kg/m²',min:12,max:42,about:'Gewicht im Verhältnis zur Körpergröße. Bei viel Muskelmasse kann der BMI Körperfett und Körperbau nur eingeschränkt unterscheiden.'},
 {key:'whr',label:'WHR',unit:'',min:0.55,max:1.3,about:'Taille / Hüfte, wenn beide Umfänge vorliegen; sonst geräteabhängige Fitdays-Schätzung. Aus BMI, Körperfett oder Garmin-Aktivitätskalorien allein nicht seriös ableitbar.'},
 {key:'bmrKcal',label:'Grundumsatz (BMR)',unit:'kcal/Tag',min:900,max:3000,about:'Geschätzter Energiebedarf in Ruhe. Nicht identisch mit der benötigten Tagesenergie einschließlich Bewegung.'},
 {key:'fatFreeKg',label:'Fettfreie Masse',unit:'kg',min:0,max:145,about:'Gewicht ohne Fettmasse; enthält unter anderem Muskelgewebe, Wasser und Knochen und darf nicht zusätzlich zur Muskelmasse addiert werden.'},
 {key:'asmi',label:'Muskelindex Arme/Beine',unit:'kg/m²',min:3,max:13,about:'Bei vorhandenen vier Segment-Muskelmassen näherungsweise als Summe der Arm- und Beinwerte geteilt durch Körpergröße² berechnet. Nicht gleichbedeutend mit klinisch gemessenem ASMI.'},
 {key:'bodyAge',label:'Fitdays-Körperalter',unit:'Jahre',min:10,max:100,about:'Herstellerabhängiger Modellwert. Keine medizinische oder biologische Altersbestimmung.'}
]);
function bmiZone(v){if(v<18.5)return 'Untergewicht';if(v<25)return 'Normalbereich';if(v<30)return 'Übergewicht';return 'Adipositasbereich';}
const percent=(v,lo,hi)=>Math.min(100,Math.max(0,(v-lo)/(hi-lo)*100));
const bmiRegions=[
 {label:'Untergewicht',from:12,to:18.5,cls:'low'},
 {label:'Normalbereich',from:18.5,to:25,cls:'normal'},
 {label:'Übergewicht',from:25,to:30,cls:'higher'},
 {label:'Adipositas',from:30,to:42,cls:'highest'}
];
function bmiBands(){return bmiRegions.map(r=>`<span class="fdi-zone ${r.cls}" style="left:${percent(r.from,12,42).toFixed(3)}%;width:${(percent(r.to,12,42)-percent(r.from,12,42)).toFixed(3)}%"></span>`).join('');}
function bmiLabels(){return `<div class="fdi-zone-legend">${bmiRegions.map(r=>`<span class="${r.cls}">${r.label}</span>`).join('')}</div>`;}

function trend(rows,key){const values=rows.filter(x=>get(x,key)!==null);if(values.length<2)return 'Noch kein Vergleichswert';const a=get(values[0],key),b=get(values.at(-1),key),d=b-a;const digits=key==='whr'?2:1;return `${d>0?'+':''}${num(d,digits)} ${d===0?'unverändert':d>0?'seit erster Messung gestiegen':'seit erster Messung gesunken'}`;}
function gauge(row,rows,model){
 const value=get(row,model.key),has=value!==null,isBmi=model.key==='bmi';
 const sources={bmi:{computed:'Gewicht / Größe² · berechnet',fitdays:'Fitdays · importiert'},
  fatFreeKg:{calculated:'Gewicht × (1 − Körperfettanteil) · berechnet',fitdays:'Fitdays · importiert'},
  bmrKcal:{'katch-mcardle':'Katch–McArdle · geschätzt',fitdays:'Fitdays · Schätzung'},
  whr:{circumferences:'Taille / Hüfte · berechnet',fitdays:'Fitdays · Schätzung','smart-tape':'Fitdays+ Smart Tape · Taille / Hüfte gemessen'},
  asmi:{'segment-proxy':'4 Segment-Muskelmassen / Größe² · Näherung',fitdays:'Fitdays · importiert'}};
 const originKey={bmi:'bmiOrigin',fatFreeKg:'fatFreeOrigin',bmrKcal:'bmrOrigin',whr:'whrOrigin',asmi:'asmiOrigin'}[model.key];
 const source=has?(sources[model.key]?.[row[originKey]]||'Fitdays · importiert'):'Nicht im Export / nicht berechenbar';
 const status=has&&isBmi?bmiZone(value):has?'Messwert (keine medizinische Einstufung)':'Noch kein Messwert';
 const position=has?percent(value,model.min,model.max):0;
 const band=isBmi?bmiBands():'<span class="fdi-neutral-band"></span>';
 const rangeText=isBmi?'BMI-Referenz für Erwachsene':'Messwertskala (ohne gesicherte Referenzbereiche)';
 return `<article class="fdi-gauge ${has?'':'fdi-gauge-empty'}" aria-label="${esc(model.label)}: ${has?esc(num(value)):'nicht erfasst'}">
  <div class="fdi-gauge-title"><strong>${esc(model.label)}</strong><span class="fdi-observed">${has?esc((model.key==='whr'?whrNum(value):num(value,1)))+' '+esc(model.unit):'–'}</span></div>
  <div class="fdi-origin">${esc(source)}</div>
  <div class="fdi-track-caption">${esc(rangeText)}</div>
  <div class="fdi-track" role="img" aria-label="${esc(model.label)}: ${has?esc(num(value)): 'nicht verfügbar'}${isBmi?', BMI-Kategorien für Erwachsene':' – geräteneutrale Messwertskala'}">${band}${has?`<span class="fdi-marker" style="left:${position.toFixed(2)}%" aria-hidden="true"><i></i></span>`:''}</div>
  ${isBmi?bmiLabels():`<div class="fdi-scale"><span>${model.min} ${esc(model.unit)}</span><span>${model.max} ${esc(model.unit)}</span></div>`}
  <div class="fdi-signal"><strong>${esc(status)}</strong><small>${has?esc(trend(rows,model.key)):'Für diesen Wert sind keine Daten importiert'}</small></div>
  <details><summary>Was bedeutet das?</summary><p>${esc(model.about)}</p>${isBmi?'<p>Allgemeine BMI-Kategorien für Erwachsene, keine Diagnose. Muskelmasse wird nicht berücksichtigt.</p>':'<p>Keine künstlichen Normal-/Risikobereiche: Fitdays-Indizes sind geräteabhängig, andere Körperwerte können methodenspezifisch sein.</p>'}</details>
 </article>`;
}

/** Fitdays-style layout based on the user-supplied report: axes and named cells.
 * The named regions mirror the screenshot as a VISUAL MODEL, not a validated
 * clinical or manufacturer's risk classification. This must not be treated as a diagnosis.
 */
const bodyTypeRegions=Object.freeze([
 {id:'athletes',label:'Athletes',fat:[0,14],bmi:[25,30]},
 {id:'muscular-fat',label:'Muscular fat',fat:[14,20],bmi:[25,30]},
 {id:'overweight',label:'Overweight',fat:[20,30],bmi:[25,30]},
 {id:'muscle',label:'Muscle',fat:[0,14],bmi:[20.5,25]},
 {id:'fit',label:'Fit',fat:[14,20],bmi:[18.5,25]},
 {id:'slightly-fat',label:'Slightly fat',fat:[20,30],bmi:[20.5,25]},
 {id:'muscular-slim',label:'Muscular slim',fat:[0,7],bmi:[18.5,20.5]},
 {id:'slim',label:'Slim',fat:[7,14],bmi:[18.5,20.5]},
 {id:'invisible-fat',label:'Invisible fat',fat:[20,30],bmi:[15,20.5]},
 {id:'too-thin',label:'Too thin',fat:[0,9],bmi:[15,18.5]},
 {id:'thin',label:'Thin',fat:[9,20],bmi:[15,18.5]}
]);
export function fitdaysBodyTypeZone(bmi,fat){
 if(!Number.isFinite(bmi)||!Number.isFinite(fat))return null;
 return bodyTypeRegions.find(r=>fat>=r.fat[0]&&fat<r.fat[1]&&bmi>=r.bmi[0]&&bmi<r.bmi[1])?.label||null;
}
function bodyMatrix(row){
 const bmi=get(row,'bmi'),fat=get(row,'bodyFatPct');
 if(bmi===null||fat===null)return `<div class="fdi-matrix-missing">Die BMI-×-Körperfett-Grafik braucht Gewicht, Körperfett und eine dokumentierte Körpergröße bzw. einen importierten BMI. Ein fehlender BMI wird nicht aus einer angenommenen Körpergröße berechnet.</div>`;
 const P={x:77,y:28,w:514,h:492};
 const X=f=>P.x+P.w*percent(f,0,30)/100;
 const Y=b=>P.y+P.h*(100-percent(b,15,30))/100;
 const active=fitdaysBodyTypeZone(bmi,fat);
 const cells=bodyTypeRegions.map(r=>{
  const x=X(r.fat[0]),y=Y(r.bmi[1]),w=X(r.fat[1])-x,h=Y(r.bmi[0])-y;
  const isActive=active===r.label;
  const font=r.label==='Muscular slim'||r.label==='Invisible fat'?12.5:15;
  return `<g class="fdi-type-region ${isActive?'fdi-type-selected':''}" data-type="${r.id}"><rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}"/><text x="${(x+w/2).toFixed(2)}" y="${(y+h/2).toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-size="${font}">${esc(r.label)}</text></g>`;
 }).join('');
 const xp=X(fat),yp=Y(bmi),valid=fat>=0&&fat<=30&&bmi>=15&&bmi<=30;
 const visibleX=Math.max(P.x,Math.min(P.x+P.w,xp)),visibleY=Math.max(P.y,Math.min(P.y+P.h,yp));
 return `<div class="fdi-matrix fdi-report-matrix">
  <svg class="fdi-matrix-svg" viewBox="0 0 630 593" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BMI × Körperfett: ${esc(num(bmi))} kg pro Quadratmeter, ${esc(num(fat))} Prozent Körperfett. ${esc(active||'außerhalb der dargestellten Felder')}. Fitdays-inspirierte schematische Felder, keine medizinische Diagnose. höherer BMI · mehr Fett">
   <text x="12" y="18" class="fdi-axis-name">BMI</text><text x="12" y="36" class="fdi-axis-unit">(kg/m²)</text>
   ${cells}
   <line class="fdi-reference-line" x1="${P.x}" y1="${Y(25)}" x2="${P.x+P.w}" y2="${Y(25)}"/>
   <line class="fdi-reference-line" x1="${P.x}" y1="${Y(18.5)}" x2="${P.x+P.w}" y2="${Y(18.5)}"/>
   <text class="fdi-tick" text-anchor="end" x="${P.x-10}" y="${Y(25)+5}">25,0</text>
   <text class="fdi-tick" text-anchor="end" x="${P.x-10}" y="${Y(18.5)+5}">18,5</text>
   <text class="fdi-tick" text-anchor="middle" x="${X(10)}" y="548">10,0</text>
   <text class="fdi-tick" text-anchor="middle" x="${X(20)}" y="548">20,0</text>
   <text class="fdi-axis-name" text-anchor="end" x="${P.x+P.w}" y="578">Body fat rate (%) · Körperfett</text>
   <line class="fdi-axis-rule" x1="${P.x}" x2="${P.x+P.w}" y1="${P.y+P.h}" y2="${P.y+P.h}"/>
   <line class="fdi-axis-rule" x1="${P.x}" x2="${P.x}" y1="${P.y}" y2="${P.y+P.h}"/>
   ${valid?`<line class="fdi-crosshair-y" x1="${P.x}" x2="${P.x+P.w}" y1="${visibleY.toFixed(2)}" y2="${visibleY.toFixed(2)}"/><line class="fdi-crosshair-x" x1="${visibleX.toFixed(2)}" x2="${visibleX.toFixed(2)}" y1="${P.y}" y2="${P.y+P.h}"/><circle class="fdi-type-point-halo" cx="${visibleX.toFixed(2)}" cy="${visibleY.toFixed(2)}" r="12"/><circle class="fdi-type-point" cx="${visibleX.toFixed(2)}" cy="${visibleY.toFixed(2)}" r="6"/>`:''}
  </svg></div><p class="fdi-matrix-scroll-hint">↔ Matrix seitlich verschieben, um alle Bezeichnungen gut zu lesen.</p>
 <p class="fdi-matrix-values"><strong>${esc(num(fat))} % Körperfett</strong> · <strong>BMI ${esc(num(bmi))}</strong>${active?` · <strong>${esc(active)}</strong>`:''}</p>
 <p class="fdi-subtle">Die elf Felder und ihre Grenzen sind eine grafische Annäherung an deinen Fitdays-Bericht, <strong>keine validierte Körpertypdiagnose</strong>. Werte außerhalb der Skala werden nicht künstlich in ein Feld eingeordnet.</p>`;
}

/** Clear report-style categorical strips. BMI uses conventional adult cutoffs;
 * the body-fat strip mimics the report's appearance, but the categories depend
 * on device, age and sex. Without validated Fitdays rules do not suggest a diagnosis.
 */
function reportStrip({label,value,unit='',bands,source='',estimated=false,neutral=false}){
 const has=Number.isFinite(value),rangeMin=bands[0].from,rangeMax=bands.at(-1).to;
 const active=has?bands.findIndex((b,i)=>value>=b.from&&(value<b.to||i===bands.length-1)): -1;
 const pos=has?percent(value,rangeMin,rangeMax):0;
 const formatted=has?`${num(value,unit==='%'?1:1)}${unit==='%'?' %':unit?' '+unit:''}`:'–';
 return `<div class="fdi-report-strip" aria-label="${esc(label)}: ${esc(formatted)}">
  <div class="fdi-report-label"><strong>${esc(label)}</strong><span>${esc(formatted)}</span></div>
  <div class="fdi-report-stripes" role="img" aria-label="${esc(label)}: ${esc(formatted)}; ${neutral?'nur grafische Bereiche ohne validierte gerätespezifische Einstufung':'BMI-Kategorien für Erwachsene'}">
   ${bands.map((b,i)=>`<span class="fdi-report-segment ${has&&i===active?'selected':''}" style="flex:${b.to-b.from}" title="${esc(b.label)}"></span>`).join('')}
   ${has?`<i class="fdi-report-position" style="left:${pos.toFixed(2)}%"></i>`:''}
  </div>
  <div class="fdi-report-labels">${bands.map((b,i)=>`<span style="flex:${b.to-b.from}">${esc(b.label)}</span>`).join('')}</div>
  ${source?`<p class="fdi-strip-source">${esc(source)}${estimated?' · berechnet':''}</p>`:''}
 </div>`;
}
/** Always-visible WHR category graphic. Health orientation, not an aesthetic score.
 * Without a configured reference parameter, the intermediate zone .85–.90 is
 * explicitly ambiguous rather than guessed from the user's name or profile.
 */
export function whrReferenceGraphic(whr,{sex=''}={}){
 if(!validWhr(whr))return '<p class="fdi-whr-no-plot">Ohne tatsächlich gemessene oder dokumentiert geschätzte Taille-Hüfte-Relation keine Positionsmarkierung.</p>';
 const lo=.70,hi=1.10,position=percent(whr,lo,hi),male=sex==='male',female=sex==='female';
 const femalePos=percent(.85,lo,hi),malePos=percent(.90,lo,hi);
 const leftBoundary=female?femalePos:male?malePos:femalePos;
 const segments=male?[[lo,.90,'reference'],[.90,hi,'higher']]:female?[[lo,.85,'reference'],[.85,hi,'higher']]:[[lo,.85,'reference'],[.85,.90,'uncertain'],[.90,hi,'higher']];
 const band=segments.map(([from,to,type])=>`<span class="fdi-whr-band ${type}" style="left:${percent(from,lo,hi).toFixed(3)}%;width:${(percent(to,lo,hi)-percent(from,lo,hi)).toFixed(3)}%"></span>`).join('');
 const boundaryLabel=male?'0,90 · Männer':female?'0,85 · Frauen':'Frauen 0,85 · Männer 0,90';
 return `<div class="fdi-whr-graphic" role="img" aria-label="WHR-Referenzgrafik, aktueller Wert ${whrNum(whr)}, Referenzgrenze ${esc(boundaryLabel)}; kein individueller Risikonachweis">
  <div class="fdi-whr-graphic-header"><strong>WHR-Referenzskala</strong><span>Dein Wert: ${whrNum(whr)}</span></div>
  <div class="fdi-whr-ruler">${band}${!male?`<i class="fdi-whr-threshold female" style="left:${femalePos.toFixed(3)}%" title="Orientierungswert Frauen: 0,85"></i>`:''}${!female?`<i class="fdi-whr-threshold male" style="left:${malePos.toFixed(3)}%" title="Orientierungswert Männer: 0,90"></i>`:''}<i class="fdi-whr-pointer" style="left:${position.toFixed(3)}%"><b></b></i></div>
  <div class="fdi-whr-ticks"><span>0,70</span><span>0,85</span><span>0,90</span><span>1,10</span></div>
  <p class="fdi-whr-graphic-caption">${male?'Orientierungsgrenze für Männer: 0,90.':female?'Orientierungsgrenze für Frauen: 0,85.':'Ohne persönlichen Referenzparameter zeigen wir beide Grenzen; zwischen 0,85 und 0,90 ist die Einordnung abhängig vom verwendeten Referenzparameter.'} Jenseits der jeweiligen Grenze: statistischer Marker für erhöhtes Gesundheitsrisiko, keine Diagnose.</p>
 </div>`;
}
function whrReferenceMarkup(row,{whrReferenceSex='',whrHistory=[]}={}){
 const value=get(row,'whr');if(value===null)return '';
 const interpretation=whrInterpretation(value,whrReferenceSex);
 const boundary=interpretation.threshold!==null?`Referenz ${whrReferenceSex==='male'?'Männer':'Frauen'}: ${whrNum(interpretation.threshold,2)}`:'Orientierung: Männer 0,90 · Frauen 0,85';
 const baseDate=row.whrDay||row.day||'';
 const tape=row.whrOrigin==='smart-tape';
 const knownWaist=get(row,'whrWaistCm'),knownHip=get(row,'whrHipCm');
 const values=tape&&knownWaist!==null&&knownHip!==null?`Taille ${num(knownWaist,1)} cm ÷ Hüfte ${num(knownHip,1)} cm`:'Verhältnis aus verfügbaren Daten';
 const observations=Array.isArray(whrHistory)?whrHistory:[];
 const delta=observations.length>=2?observations.at(-1).ratio-observations.at(-2).ratio:null;
 const trendNote=delta===null?'Erste WHR-Messung dieser Quelle · noch kein Trend':`Veränderung zur vorherigen Messung derselben Quelle: ${delta>0?'+':''}${whrNum(delta,3)}`;
 return `<div class="fdi-whr-explain" aria-label="Waist-to-hip ratio Referenzeinordnung"><strong>WHR ${whrNum(value)} · ${esc(interpretation.label)}</strong>${whrReferenceGraphic(value,{sex:whrReferenceSex})}<small>${esc(boundary)} · Messung ${esc(baseDate)} · ${esc(values)}</small><small>${esc(trendNote)}. Populationsbezogene Risikomarkierung, keine Diagnose und kein direktes Maß für den V-Taper.</small></div>`;
}
function reportSummary(row,{targetWeightKg=null,whrReferenceSex='',whrHistory=[]}={}){
 const bmi=get(row,'bmi'),fat=get(row,'bodyFatPct'),weight=get(row,'weightKg');
 const target=Number(targetWeightKg),validTarget=Number.isFinite(target)&&target>=35&&target<=300;
 const ratio=validTarget&&weight!==null?Math.round(weight/target*1000)/10:null;
 const bmiBands=[{label:'Thin',from:10,to:18.5},{label:'Standard',from:18.5,to:25},{label:'High',from:25,to:30},{label:'Too High',from:30,to:40}];
 // 0-10-20-30-40 ranges below are only a graphical reproduction of the screenshot.
 const fatBands=[{label:'Thin',from:0,to:10},{label:'Standard',from:10,to:20},{label:'High',from:20,to:30},{label:'Too High',from:30,to:40}];
 const targetBands=[{label:'Low',from:0,to:90},{label:'Normal',from:90,to:110},{label:'High',from:110,to:160}];
 const fatFreeImported=get(row,'fatFreeKg');
 const fatFreeDerived=fatFreeImported===null&&weight!==null&&fat!==null?weight*(1-fat/100):null;
 const fatFree=fatFreeImported??fatFreeDerived;
 const indicators=[
  ['Visceral fat grade · Viszeralfett',get(row,'visceralFat'),'Index'],
  ['Basal metabolic rate · Grundumsatz',get(row,'bmrKcal'),'kcal',row.bmrOrigin==='katch-mcardle'?'Katch–McArdle · berechnet':'Fitdays · Schätzung'],
  ['Fat-free body weight · Fettfreie Masse',fatFree,'kg',row.fatFreeOrigin==='calculated'?'Aus Körperfett berechnet':'Fitdays · importiert'],
  ['Waist-to-hip ratio · WHR',get(row,'whr'),' ',row.whrOrigin==='smart-tape'?'Fitdays+ Smart Tape · direkt aus Umfangsmessungen':row.whrOrigin==='circumferences'?'Taille / Hüfte · berechnet':row.whrOrigin==='fitdays'?'Fitdays · Schätzung':''],
  ['Muskelindex Arme/Beine',get(row,'asmi'),'kg/m²',row.asmiOrigin==='segment-proxy'?'4 Segmente / Größe² · Näherung':row.asmiOrigin==='fitdays'?'Fitdays · importiert':'']
 ];
 return `<section class="fdi-report-summary" aria-label="Fitdays Bericht: Körperstatus und Kennzahlen">
  <h4>Obesity assessment <small>· Fitdays-Stil</small></h4>
  ${reportStrip({label:'BMI',value:bmi,unit:'',bands:bmiBands,source:row.bmiOrigin==='computed'?'Aus Gewicht und Größe': 'Fitdays-Messwert'})}
  ${reportStrip({label:'Body fat rate · Körperfett',value:fat,unit:'%',bands:fatBands,source:'Kategorien nur optisch nachgebildet – keine validierten Fitdays-Grenzen',neutral:true})}
  ${validTarget?reportStrip({label:'Gewicht / freiwilliges Zielgewicht',value:ratio,unit:'%',bands:targetBands,source:`Zielgewicht ${num(target)} kg`,neutral:true}):'<p class="fdi-strip-source">Kein Zielgewicht hinterlegt – der leere Zielgewichts-Balken entfällt. Für V-Taper sind Körperfetttrend und Taille aussagekräftiger.</p>'}
  <h4 class="fdi-other-title">Other indicators <small>· Weitere Kennzahlen</small></h4>
  <div class="fdi-report-indicators">${indicators.map(([label,value,unit,source],idx)=>`<div><span>${esc(label)}${source?` <small>· ${esc(source)}</small>`:''}</span><strong>${value===null?'–':esc(idx===3?whrNum(value):num(value,idx===0?0:1))+' '+esc(unit)}</strong></div>`).join('')}</div>
  ${whrReferenceMarkup(row,{whrReferenceSex,whrHistory})}
  ${fatFreeDerived!==null?'<p class="fdi-strip-source">Fettfreie Masse aus Gewicht und Körperfett berechnet; kein eigener Fitdays-Exportwert.</p>':''}
 </section>`;
}

export function fitdaysInterpretationView(fitdays=[],{today='',range='28',bodyTapeDashboard='',heightCm=null,targetWeightKg=null,smartTapeWhrSeries=[],whrReferenceSex=''}={}){
 const days=range==='all'?20000:Number(range)||28;
 const until=/^\d{4}-\d{2}-\d{2}$/.test(today)?today:'9999-12-31';
 const d=new Date(until+'T12:00:00Z');const from=Number.isFinite(d.getTime())&&days<10000?(d.setUTCDate(d.getUTCDate()-(days-1)),d.toISOString().slice(0,10)):'0000-01-01';
 const selected=(Array.isArray(fitdays)?fitdays:[]).filter(x=>x?.day>=from&&x?.day<=until&&typeof x.at==='string').sort((a,b)=>a.at.localeCompare(b.at)).map(x=>resolvedBodyMetrics(x,heightCm));
 const tapeInRange=(Array.isArray(smartTapeWhrSeries)?smartTapeWhrSeries:[]).filter(x=>x?.day>=from&&x?.day<=until);
 const whrEvidence=currentWhrEvidence(selected,tapeInRange);
 const latestScale=selected.at(-1)||null;
 const latest=latestScale?{...latestScale}:null;
 if(whrEvidence.latest&&latest){latest.whr=whrEvidence.latest.ratio;latest.whrOrigin=whrEvidence.latest.origin;latest.whrDay=whrEvidence.latest.day;
  latest.whrWaistCm=whrEvidence.latest.waistCm;latest.whrHipCm=whrEvidence.latest.hipCm;}
 if(!latest){const tape=whrEvidence.latest;
  return bodyTapeDashboard+'<section class="fdi-root"><header><h3>Fitdays · Werte verstehen</h3></header>'
  +(tape?`<div class="fdi-report-summary"><h4>Weitere Kennzahlen · Smart Tape</h4><div class="fdi-report-indicators"><div><span>Waist-to-hip ratio · WHR · Fitdays+ Smart Tape</span><strong>${whrNum(tape.ratio)}</strong></div></div>${whrReferenceMarkup({whr:tape.ratio,whrOrigin:'smart-tape',whrDay:tape.day,whrWaistCm:tape.waistCm,whrHipCm:tape.hipCm},{whrReferenceSex,whrHistory:whrEvidence.history})}</div>`:'')
  +'<p class="fdi-subtle">Im gewählten Zeitraum sind keine Fitdays-Waagenmessungen vorhanden.</p></section>';}

 const primary=['bmi','bodyFatPct','visceralFat','subcutaneousFatPct','whr'].map(k=>measures.find(m=>m.key===k));
 const secondary=measures.filter(m=>!primary.includes(m));
 const measured=measures.filter(m=>get(latest,m.key)!==null).length;
 const height=Number(heightCm);
 const heightNote=Number.isFinite(height)&&height>=120&&height<=230?`Körpergröße ${esc(num(height,0))} cm${latest.bmiOrigin==='computed'?' · BMI aus dem Gewicht berechnet':''}`:'Körpergröße nicht hinterlegt';
 return bodyTapeDashboard+`<section class="fdi-root" id="fitdays-interpretation" aria-label="Fitdays Referenz- und Werteinterpretation">
  <header class="fdi-head"><div><span class="fdi-eyebrow">KÖRPERANALYSE · REFERENZEN</span><h3>Deine Körperwerte – auf einen Blick</h3><p>Fitdays-artige Statusbalken und die elf beschrifteten Körperregionen; bestehende Dot-Plots und Segmentanalysen folgen darunter.</p></div><small>${esc(latest.day)} · ${selected.length} Messungen</small></header>
  <div class="fdi-personal"><strong>${esc(heightNote)}</strong><span>${measured} von ${measures.length} Werten verfügbar · Fitdays-Werte sind BIA-Schätzungen</span></div>
  <div class="fdi-layout fdi-report-layout">${reportSummary(latest,{targetWeightKg,whrReferenceSex,whrHistory:whrEvidence.history})}<aside class="fdi-matrix-card"><h4>Body type assessment <small>· Körpertyp</small></h4>${bodyMatrix(latest)}<details><summary>Zur Einordnung</summary><p>Die elf bezeichneten Bereiche orientieren sich an der Fitdays-Vorlage. Die genaue Hersteller-Referenztabelle ist nicht verfügbar. Farben und Felder sind eine Annäherung zur Visualisierung, keine medizinische Einstufung.</p></details></aside></div>
  ${fatMassVisualView(selected)}
  ${fitdaysDynamicBodyView(selected,{heightCm})}
  <details class="fdi-more"><summary>Detailansichten der Messwerte · ${measured} von ${measures.length} verfügbar</summary><div class="fdi-gauges fdi-secondary">${measures.map(m=>gauge(latest,m.key==='whr'?whrEvidence.history.map(x=>({day:x.day,at:x.at,whr:x.ratio})):selected,m)).join('')}</div></details>
  <p class="fdi-footnote">BMI: allgemeine Erwachsenenkategorien. Die übrigen Skalen zeigen die Position des tatsächlichen Messwerts, keine erfundenen Fitdays-Risikogrenzen. Fehlende Exportfelder bleiben fehlend. Keine automatische Gesundheitsdiagnose.</p>
 </section>`;
}
