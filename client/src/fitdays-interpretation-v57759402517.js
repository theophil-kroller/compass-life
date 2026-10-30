/** Compass .40.25.17 — supplemental Fitdays reading aid, NEVER a diagnosis.
 * Based exclusively on imported observations. The existing point plots and five
 * region figure stay the authoritative visualisations of the measured history.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(x,digits=1)=>Number(x).toLocaleString('de-AT',{maximumFractionDigits:digits});
const get=(x,k)=>Number.isFinite(x?.[k])?x[k]:null;
export function resolvedBodyMetrics(row,heightCm=null){
 const h=Number(heightCm),weight=get(row,'weightKg'),imported=get(row,'bmi');
 const calculated=imported===null&&Number.isFinite(h)&&h>=120&&h<=230&&weight!==null&&weight>20;
 const bmi=imported!==null?imported:calculated?Math.round(weight/(h/100)**2*100)/100:null;
 return {...row,bmi,bmiOrigin:imported!==null?'fitdays':calculated?'computed':'missing'};
}
const measures=Object.freeze([
 {key:'bodyFatPct',label:'Körperfett',unit:'%',min:0,max:55,about:'Bioimpedanz-Schätzung des Körperfettanteils. Referenzbereiche hängen unter anderem vom Alter und vom verwendeten Bewertungsmodell ab.'},
 {key:'visceralFat',label:'Viszeralfett',unit:'Index',min:0,max:30,about:'Von Fitdays berechneter Index für Fett im Bauchraum. Kein direkt gemessenes Volumen und nicht mit Prozent oder kg gleichzusetzen.'},
 {key:'subcutaneousFatPct',label:'Subkutanes Fett',unit:'%',min:0,max:60,about:'Geschätzter Anteil des Unterhautfetts. Die Bewertung hängt von der Messmethode und den jeweiligen Referenzen ab.'},
 {key:'bmi',label:'BMI',unit:'kg/m²',min:12,max:42,about:'Gewicht im Verhältnis zur Körpergröße. Bei viel Muskelmasse kann der BMI Körperfett und Körperbau nur eingeschränkt unterscheiden.'},
 {key:'whr',label:'WHR',unit:'',min:0.55,max:1.3,about:'Waist-to-Hip Ratio: Taillenumfang geteilt durch Hüftumfang. Bei Fitdays gegebenenfalls ein importierter Schätzwert; es werden keine Umfänge daraus rekonstruiert.'},
 {key:'bmrKcal',label:'Grundumsatz (BMR)',unit:'kcal/Tag',min:900,max:3000,about:'Geschätzter Energiebedarf in Ruhe. Nicht identisch mit der benötigten Tagesenergie einschließlich Bewegung.'},
 {key:'fatFreeKg',label:'Fettfreie Masse',unit:'kg',min:0,max:145,about:'Gewicht ohne Fettmasse; enthält unter anderem Muskelgewebe, Wasser und Knochen und darf nicht zusätzlich zur Muskelmasse addiert werden.'},
 {key:'asmi',label:'ASMI',unit:'kg/m²',min:3,max:13,about:'Appendikulärer Skelettmuskelindex. Nur anzeigen, wenn der Fitdays-Export ihn ausdrücklich enthält.'},
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
 const source=isBmi&&row.bmiOrigin==='computed'?'Aus Gewicht + Körpergröße berechnet':isBmi&&row.bmiOrigin==='fitdays'?'Aus Fitdays importiert':has?'Fitdays-Messwert':'Nicht im Export';
 const status=has&&isBmi?bmiZone(value):has?'Messwert (keine medizinische Einstufung)':'Noch kein Messwert';
 const position=has?percent(value,model.min,model.max):0;
 const band=isBmi?bmiBands():'<span class="fdi-neutral-band"></span>';
 const rangeText=isBmi?'BMI-Referenz für Erwachsene':'Messwertskala (ohne gesicherte Referenzbereiche)';
 return `<article class="fdi-gauge ${has?'':'fdi-gauge-empty'}" aria-label="${esc(model.label)}: ${has?esc(num(value)):'nicht erfasst'}">
  <div class="fdi-gauge-title"><strong>${esc(model.label)}</strong><span class="fdi-observed">${has?esc(num(value,model.key==='whr'?2:1))+' '+esc(model.unit):'–'}</span></div>
  <div class="fdi-origin">${esc(source)}</div>
  <div class="fdi-track-caption">${esc(rangeText)}</div>
  <div class="fdi-track" role="img" aria-label="${esc(model.label)}: ${has?esc(num(value)): 'nicht verfügbar'}${isBmi?', BMI-Kategorien für Erwachsene':' – geräteneutrale Messwertskala'}">${band}${has?`<span class="fdi-marker" style="left:${position.toFixed(2)}%" aria-hidden="true"><i></i></span>`:''}</div>
  ${isBmi?bmiLabels():`<div class="fdi-scale"><span>${model.min} ${esc(model.unit)}</span><span>${model.max} ${esc(model.unit)}</span></div>`}
  <div class="fdi-signal"><strong>${esc(status)}</strong><small>${has?esc(trend(rows,model.key)):'Für diesen Wert sind keine Daten importiert'}</small></div>
  <details><summary>Was bedeutet das?</summary><p>${esc(model.about)}</p>${isBmi?'<p>Allgemeine BMI-Kategorien für Erwachsene, keine Diagnose. Muskelmasse wird nicht berücksichtigt.</p>':'<p>Keine künstlichen Normal-/Risikobereiche: Fitdays-Indizes sind geräteabhängig, andere Körperwerte können methodenspezifisch sein.</p>'}</details>
 </article>`;
}

function bodyMatrix(row){
 const bmi=get(row,'bmi'),fat=get(row,'bodyFatPct');
 if(bmi===null||fat===null)return `<div class="fdi-matrix-missing">Die BMI-×-Körperfett-Grafik braucht Gewicht, Körperfett und eine dokumentierte Körpergröße bzw. einen importierten BMI. Ein fehlender BMI wird nicht aus einer angenommenen Körpergröße berechnet.</div>`;
 const x=percent(fat,0,50),y=100-percent(bmi,12,42);
 return `<div class="fdi-matrix" role="img" aria-label="Körperfett ${esc(num(fat))} Prozent, BMI ${esc(num(bmi))}, Positionspunkt in einer zweidimensionalen Grafik">
  <div class="fdi-matrix-ylabel">BMI</div><div class="fdi-matrix-grid">
   <div class="fdi-quadrants" aria-hidden="true"><span>höherer BMI · weniger Fett</span><span>höherer BMI · mehr Fett</span><span>niedriger BMI · weniger Fett</span><span>niedriger BMI · mehr Fett</span></div>
   <span class="fdi-crosshair-y" style="top:${y.toFixed(2)}%" aria-hidden="true"></span><span class="fdi-crosshair-x" style="left:${x.toFixed(2)}%" aria-hidden="true"></span>
   <span class="fdi-matrix-dot" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"><span class="fdi-sr">Deine Position</span></span>
  </div><div class="fdi-matrix-ticks"><span>0 %</span><span>25 %</span><span>50 %</span></div><div class="fdi-axis-bottom">Körperfettanteil</div>
 </div><p class="fdi-matrix-values"><strong>${esc(num(fat))} % Körperfett</strong> · <strong>BMI ${esc(num(bmi))}</strong></p><p class="fdi-subtle">Vier beschreibende Quadranten, inspiriert von Fitdays. Die Achsen sind BMI und Körperfett; keine medizinische Körpertyp-Diagnose.</p>`;
}

export function fitdaysInterpretationView(fitdays=[],{today='',range='28',heightCm=null}={}){
 const days=range==='all'?20000:Number(range)||28;
 const until=/^\d{4}-\d{2}-\d{2}$/.test(today)?today:'9999-12-31';
 const d=new Date(until+'T12:00:00Z');const from=Number.isFinite(d.getTime())&&days<10000?(d.setUTCDate(d.getUTCDate()-(days-1)),d.toISOString().slice(0,10)):'0000-01-01';
 const selected=(Array.isArray(fitdays)?fitdays:[]).filter(x=>x?.day>=from&&x?.day<=until&&typeof x.at==='string').sort((a,b)=>a.at.localeCompare(b.at)).map(x=>resolvedBodyMetrics(x,heightCm));
 const latest=selected.at(-1);
 if(!latest)return '<section class="fdi-root"><header><h3>Fitdays · Werte verstehen</h3></header><p class="fdi-subtle">Im gewählten Zeitraum sind keine Fitdays-Messungen vorhanden.</p></section>';
 const primary=['bmi','bodyFatPct','visceralFat','subcutaneousFatPct','whr'].map(k=>measures.find(m=>m.key===k));
 const secondary=measures.filter(m=>!primary.includes(m));
 const measured=measures.filter(m=>get(latest,m.key)!==null).length;
 const height=Number(heightCm);
 const heightNote=Number.isFinite(height)&&height>=120&&height<=230?`Körpergröße ${esc(num(height,0))} cm${latest.bmiOrigin==='computed'?' · BMI aus dem Gewicht berechnet':''}`:'Körpergröße nicht hinterlegt';
 return `<section class="fdi-root" id="fitdays-interpretation" aria-label="Fitdays Referenz- und Werteinterpretation">
  <header class="fdi-head"><div><span class="fdi-eyebrow">KÖRPERANALYSE · REFERENZEN</span><h3>Deine Körperwerte – auf einen Blick</h3><p>Fitdays-artige Statusbalken und Körpertyp-Positionsmatrix; bestehende Dot-Plots und Segmentanalysen folgen darunter.</p></div><small>${esc(latest.day)} · ${selected.length} Messungen</small></header>
  <div class="fdi-personal"><strong>${esc(heightNote)}</strong><span>${measured} von ${measures.length} Werten verfügbar · Fitdays-Werte sind BIA-Schätzungen</span></div>
  <div class="fdi-layout"><div class="fdi-gauges">${primary.map(m=>gauge(latest,selected,m)).join('')}</div><aside class="fdi-matrix-card"><h4>BMI × Körperfett</h4>${bodyMatrix(latest)}<details><summary>Zur Einordnung</summary><p>Beschriftete Quadranten dienen nur zur räumlichen Orientierung. Die Fitdays-Herstellerklassifikation und ihre Grenzwerte werden nicht ohne belegte Referenztabelle übernommen.</p></details></aside></div>
  <details class="fdi-more"><summary>Weitere Kennzahlen · ${secondary.filter(m=>get(latest,m.key)!==null).length} Werte verfügbar</summary><div class="fdi-gauges fdi-secondary">${secondary.map(m=>gauge(latest,selected,m)).join('')}</div></details>
  <p class="fdi-footnote">BMI: allgemeine Erwachsenenkategorien. Die übrigen Skalen zeigen die Position des tatsächlichen Messwerts, keine erfundenen Fitdays-Risikogrenzen. Fehlende Exportfelder bleiben fehlend. Keine automatische Gesundheitsdiagnose.</p>
 </section>`;
}
