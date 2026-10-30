// The six photographic reference stages are intentionally illustrative, not medical predictions.

/** Compass 0.5.77.59.40.25.24 — dynamic Fitdays body-composition comparison.
 * Values originate ONLY from real, dated Fitdays observations; comparison artwork
 * is fixed reference art with nearest/interpolated visual stage, NEVER a scan.
 * Muscle mass is reported only if Fitdays supplied it (muscleKg).
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=1)=>Number(n).toLocaleString('de-AT',{minimumFractionDigits:d,maximumFractionDigits:d});
const valid=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
export const BODY_FAT_REFERENCE_STAGES=Object.freeze([
 {pct:10,id:'10',label:'Sehr definiert'},
 {pct:15,id:'15',label:'Deutlich definiert'},
 {pct:20,id:'20',label:'Moderat definiert'},
 {pct:23.5,id:'23_5',label:'Weichere Konturen'},
 {pct:28,id:'28',label:'Weniger Definition'},
 {pct:32,id:'32',label:'Deutlich weichere Konturen'}
]);
export const BODY_FAT_RANGES=Object.freeze([
 {from:0,to:6,label:'Sehr niedrig',class:'very-low'},
 {from:6,to:14,label:'Athletischer Referenzbereich',class:'athletic'},
 {from:14,to:18,label:'Definiert',class:'fit'},
 {from:18,to:25,label:'Mittlerer Vergleichsbereich',class:'average'},
 {from:25,to:32,label:'Höherer Vergleichsbereich',class:'elevated'},
 {from:32,to:75,label:'Sehr hoher Vergleichsbereich',class:'high'}
]);
const assetBase=(typeof import.meta.env?.BASE_URL==='string'?import.meta.env.BASE_URL:'/').replace(/\/?$/,'/')+'fitdays-body-compare-v57759402524/';
const stageImage=stage=>assetBase+'stage-'+stage.id+'.webp';
export function fitdaysDynamicBodyModel(rows=[],{heightCm=null}={}){
 const validRows=(Array.isArray(rows)?rows:[]).filter(r=>r&&/^\d{4}-\d\d-\d\d/.test(String(r.at||''))&&valid(r.weightKg,25,350)&&valid(r.bodyFatPct,1,75)).sort((a,b)=>String(a.at).localeCompare(String(b.at)));
 const row=validRows.at(-1);if(!row)return null;
 const weightKg=row.weightKg,bodyFatPct=row.bodyFatPct;
 const fatKg=weightKg*bodyFatPct/100,fatFreeKg=weightKg-fatKg;
 // Imported device muscle mass and/or segmented measurements are independent of fat-free mass.
 const muscleKg=valid(row.muscleKg,2,200)?row.muscleKg:null;
 const parts=Object.values(row.segmentMuscle||{}).filter(s=>valid(s?.kg,0,100));
 const bmi=valid(heightCm,120,230)?weightKg/Math.pow(heightCm/100,2):valid(row.bmi,10,70)?row.bmi:null;
 const bmiClass=bmi===null?null:bmi<18.5?'Untergewicht (BMI)':bmi<25?'Normalgewicht (BMI)':bmi<30?'Übergewicht (BMI)':'Adipositasbereich (BMI)';
 const stageRange=BODY_FAT_RANGES.find((b,i)=>bodyFatPct>=b.from&&(bodyFatPct<b.to||i===BODY_FAT_RANGES.length-1))||BODY_FAT_RANGES.at(-1);
 const nextIdx=BODY_FAT_REFERENCE_STAGES.findIndex(s=>s.pct>=bodyFatPct);
 const hi=nextIdx<0?BODY_FAT_REFERENCE_STAGES.length-1:nextIdx;
 const a=BODY_FAT_REFERENCE_STAGES[Math.max(0,hi-1)]||BODY_FAT_REFERENCE_STAGES[0];
 const b=BODY_FAT_REFERENCE_STAGES[hi]||BODY_FAT_REFERENCE_STAGES.at(-1);
 const frac=a===b?0:Math.max(0,Math.min(1,(bodyFatPct-a.pct)/(b.pct-a.pct)));
 return {at:row.at,day:row.day||String(row.at).slice(0,10),weightKg,bodyFatPct,fatKg,fatFreeKg,muscleKg,
   segmentCount:parts.length,bmi,bmiClass,stageRange,visualStages:[a,b],blend:frac,rangeWarning:bodyFatPct<10||bodyFatPct>32,
   // Strictly illustrative: holding lean mass fixed is a scenario, not a medical target.
   weightAt20Pct:fatFreeKg/0.8};
}
const PHOTO_BASE=(typeof import.meta.env?.BASE_URL==='string'?import.meta.env.BASE_URL:'/').replace(/\/?$/,'/')+'fitdays-physique-personal-v0578/';
const photo=stage=>PHOTO_BASE+'stage-'+stage.id+'.webp';
function preview(model){
 const [a,b]=model.visualStages;
 // Actual Fitdays percentage determines both image stages and blending ratio;
 // fixed artwork never includes text with a hardcoded measurement; nearest-stage preserves crispness.
 const nearest=model.blend>=.5?b:a;
 return `<div class="cbody78-person" role="img" aria-label="Illustrative Referenzstufe ${fmt(nearest.pct)} Prozent bei Fitdays-Messung ${fmt(model.bodyFatPct)} Prozent"><img src="${photo(nearest)}" decoding="async" alt="" /></div>`;
}
function referenceStage(s,model){
 const current=model.visualStages.some(x=>x.id===s.id);
 return `<article class="cbody-reference-card ${current?'cbody78-near':''}" aria-label="Illustratives Beispiel ${fmt(s.pct)} Prozent Körperfett"><strong>${fmt(s.pct,s.pct%1?1:0)} %</strong><img src="${photo(s)}" loading="lazy" decoding="async" alt="Fotorealistische hypothetische Körperfettstufe ${fmt(s.pct)} Prozent" /><span>${esc(s.label)}</span></article>`;
}
export function fitdaysDynamicBodyView(rows=[],opts={}){
 const model=fitdaysDynamicBodyModel(rows,opts);if(!model)return '<section class="cbody-root"><h3>Fitdays · Körperzusammensetzung</h3><p>Für diese Visualisierung benötigen wir einen datierten Fitdays-Messpunkt mit Gewicht und Körperfettanteil.</p></section>';
 const {bodyFatPct:pct,weightKg:w,fatKg:fat,fatFreeKg:lean,muscleKg:muscle,bmi,bmiClass}=model;
 // BMI is the recognized screening system for adult weight categories. Body-fat reference
 // bands are not labelled "adipös" or "gesund": no validated cutoff supplied.
 const marker=Math.max(0,Math.min(100,(pct/45)*100));
 return `<section class="cbody-root" id="fitdays-dynamischer-koerpervergleich" aria-label="Dynamischer Körperfett- und Muskelvergleich">
 <header class="cbody-top"><div><span class="cbody-kicker">FITDAYS · DYNAMISCHER KÖRPERVERGLEICH</span><h3>Wie verändert sich meine Körperform?</h3><p>Dein jüngster gemessener Körperfettanteil wird automatisch mit typischen Referenzstufen verglichen.</p></div><span class="cbody-timestamp">${esc(model.day)}</span></header>
 <div class="cbody-stats"><div class="cbody-stat"><small>Körperfett</small><strong>${fmt(pct)} %</strong><span>${fmt(fat)} kg von ${fmt(w)} kg</span></div><div class="cbody-stat"><small>Fettfreie Masse</small><strong>${fmt(lean)} kg</strong><span>Enthält auch Wasser, Knochen, Organe</span></div><div class="cbody-stat ${muscle!==null?'':'cbody-unavailable'}"><small>Fitdays-Muskelmasse</small><strong>${muscle===null?'Keine Messung':fmt(muscle)+' kg'}</strong><span>${muscle===null?'Nicht aus fettfreier Masse geschätzt':'BIA-Schätzung des Geräts'}</span></div><div class="cbody-stat"><small>BMI ${bmi===null?'· kein Wert':'· '+fmt(bmi)}</small><strong>${esc(bmiClass||'Nicht verfügbar')}</strong><span>BMI-Kategorien, keine Diagnose</span></div></div>
 <div class="cbody-main"><div class="cbody-scale-col"><h4>Einordnung deines Werts</h4><p class="cbody-muted">Der Körperfettanteil ist eine BIA-Schätzung; die Farbbereiche sind grobe visuelle Orientierung für erwachsene Männer und keine klinische Adipositas-Klassifikation.</p><div class="cbody-range"><div class="cbody-range-bar"><span style="width:13.33%;background:#b7dbe7"></span><span style="width:17.78%;background:#afddd5"></span><span style="width:8.89%;background:#c8e9c2"></span><span style="width:15.56%;background:#f2dfa2"></span><span style="width:15.56%;background:#f3ba8b"></span><span style="flex:1;background:#f1b0b0"></span></div><div class="cbody-range-marker" style="left:${marker.toFixed(2)}%"><b>${fmt(pct)} %</b></div></div><div class="cbody-range-ends"><span>0 %</span><span>10 %</span><span>20 %</span><span>30 %</span><span>45 %</span></div><div class="cbody-classification"><b>${esc(model.stageRange.label)}</b><p>Dieser Bereich beschreibt nur die bildliche Vergleichsstufe. Für die medizinische Einordnung zählen weitere Messgrößen, insbesondere BMI, Taillenumfang und Risikofaktoren.</p></div><p class="cbody-bmi">${bmi===null?'BMI derzeit nicht verfügbar.':`BMI ${fmt(bmi)} · ${esc(bmiClass)}. Bei höherer Muskelmasse kann der BMI überschätzen, wie viel Körperfett vorhanden ist.`}</p></div>
 <div class="cbody-current-col"><div class="cbody-current-label"><h4>Dein aktueller Messwert</h4><strong>${fmt(pct)} %</strong></div>${preview(model)}<p class="cbody-visual-note">Fotorealistisches Vergleichsbild auf Basis deines Referenzfotos, dessen nächste Referenzstufe anhand des Körperfettwerts ausgewählt wird. Keine tatsächliche Fotoprognose: Fettverteilung und Muskulatur sind aus BIA-Zahlen nicht exakt rekonstruierbar.${model.rangeWarning?' Dein Messwert liegt außerhalb des dargestellten Bildspektrums.':''}</p></div></div>
 <div class="cbody-reference"><h4>Vergleich verschiedener Körperfettwerte</h4><p>Fotorealistische Vergleichsstufen mit derselben Person und Haltung; der aktuelle Fitdays-Wert steuert die Auswahl der nächstliegenden Referenzstufe. Individuelle Körperformen können deutlich abweichen.</p><div class="cbody-comparison-list">${BODY_FAT_REFERENCE_STAGES.map(s=>referenceStage(s,model)).join('')}</div><div class="cbody-current-readout"><span>● Deine Messung: <strong>${fmt(pct)} %</strong></span><span>Fettmasse <strong>${fmt(fat)} kg</strong></span>${muscle!==null?`<span>Muskelmasse <strong>${fmt(muscle)} kg</strong></span>`:''}<span>${esc(model.day)}</span></div></div>
 <p class="cbody-footnote">Keine medizinische Diagnose. Die Referenzbilder zeigen hypothetische Variationen deines Erscheinungsbilds, keine Messung, Diagnose oder verlässliche Vorhersage. Die Muskelmasse ist nur bei vorhandenem Fitdays-Import ausgewiesen; BIA-Werte schwanken unter anderem mit Hydrierung und Messbedingungen.</p></section>`;
}
