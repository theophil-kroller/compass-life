/** Compass .40.25.17 — supplemental Fitdays reading aid, NEVER a diagnosis.
 * Based exclusively on imported observations. The existing point plots and five
 * region figure stay the authoritative visualisations of the measured history.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(x,digits=1)=>Number(x).toLocaleString('de-AT',{maximumFractionDigits:digits});
const get=(x,k)=>Number.isFinite(x?.[k])?x[k]:null;
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
function trend(rows,key){const values=rows.filter(x=>get(x,key)!==null);if(values.length<2)return 'Noch kein Vergleichswert';const a=get(values[0],key),b=get(values.at(-1),key),d=b-a;const digits=key==='whr'?2:1;return `${d>0?'+':''}${num(d,digits)} ${d===0?'unverändert':d>0?'seit erster Messung gestiegen':'seit erster Messung gesunken'}`;}
function gauge(row,rows,model){const value=get(row,model.key);const has=value!==null;const status=has&&model.key==='bmi'?bmiZone(value):has?'Fitdays-Messwert':'Nicht im Export';
 const width=has?percent(value,model.min,model.max):0;
 const bar=model.key==='bmi'?'<span class="fdi-bmi-band" style="left:0;width:21.67%"></span><span class="fdi-bmi-band norm" style="left:21.67%;width:21.66%"></span><span class="fdi-bmi-band" style="left:43.33%;width:16.67%"></span><span class="fdi-bmi-band" style="left:60%;width:40%"></span>':'<span class="fdi-neutral-band"></span>';
 return `<article class="fdi-gauge" aria-label="${esc(model.label)}, ${has?num(value):'fehlend'}"><div class="fdi-gauge-title"><strong>${esc(model.label)}</strong><span class="fdi-observed">${has?`${esc(num(value,model.key==='whr'?2:1))} ${esc(model.unit)}`:'–'}</span></div>
 <div class="fdi-track" role="img" aria-label="${esc(model.label)}: ${has?esc(num(value)): 'kein importierter Wert'}; angezeigte Skala keine individuelle medizinische Einstufung">${bar}${has?`<span class="fdi-marker" style="left:${width.toFixed(2)}%" aria-hidden="true"></span>`:''}</div>
 <div class="fdi-scale"><span>${model.min}</span><span>${model.max}</span></div><div class="fdi-signal"><strong>${esc(status)}</strong><small>${has?esc(trend(rows,model.key)):'Kein Wert wird aus anderen Angaben geschätzt'}</small></div>
 <details><summary>Was bedeutet das?</summary><p>${esc(model.about)}</p>${model.key==='bmi'?'<p>Die WHO-Kategorien für Erwachsene dienen hier nur als allgemeine Orientierung, nicht als Diagnose.</p>':'<p>Die Skala zeigt lediglich die Position des Messwerts; ohne gerätespezifische Referenzen wird keine Normal-/Risiko-Zone behauptet.</p>'}</details></article>`;
}
function bodyMatrix(row){const bmi=get(row,'bmi'),fat=get(row,'bodyFatPct');if(bmi===null||fat===null)return `<div class="fdi-matrix-missing">Die Matrix wird angezeigt, sobald der Export sowohl BMI als auch Körperfett enthält. Ein fehlender BMI wird nicht aus einer angenommenen Körpergröße berechnet.</div>`;
 const x=percent(fat,0,50),y=100-percent(bmi,12,42);
 return `<div class="fdi-matrix" role="img" aria-label="Körperfett ${esc(num(fat))} Prozent, BMI ${esc(num(bmi))}. Kein medizinischer Körpertyp"><div class="fdi-matrix-grid"><span class="fdi-matrix-dot" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"><span class="fdi-sr">Aktueller Messwert</span></span></div><div class="fdi-axis-bottom">Körperfett → ${esc(num(fat))} %</div><div class="fdi-axis-side">BMI ${esc(num(bmi))}</div></div><p class="fdi-subtle">Zwei importierte Schätzwerte an einer Zeitachse; keine Einstufung als „muskulös“, „fit“ oder „übergewichtig“ anhand der Matrix allein.</p>`;
}
export function fitdaysInterpretationView(fitdays=[],{today='',range='28'}={}){
 const days=range==='all'?20000:Number(range)||28;
 const until=/^\d{4}-\d{2}-\d{2}$/.test(today)?today:'9999-12-31';
 const d=new Date(until+'T12:00:00Z');const from=Number.isFinite(d.getTime())&&days<10000?(d.setUTCDate(d.getUTCDate()-(days-1)),d.toISOString().slice(0,10)):'0000-01-01';
 const selected=(Array.isArray(fitdays)?fitdays:[]).filter(x=>x?.day>=from&&x?.day<=until&&typeof x.at==='string').sort((a,b)=>a.at.localeCompare(b.at));
 const latest=selected.at(-1);
 if(!latest)return '<section class="fdi-root"><header><h3>Fitdays · Werte verstehen</h3></header><p class="fdi-subtle">Im gewählten Zeitraum sind keine Fitdays-Messungen vorhanden.</p></section>';
 const present=measures.filter(m=>get(latest,m.key)!==null),missing=measures.filter(m=>get(latest,m.key)===null);
 return `<section class="fdi-root" aria-label="Fitdays Referenz- und Werteinterpretation"><header class="fdi-head"><div><span class="fdi-eyebrow">KÖRPERANALYSE · EINORDNUNG</span><h3>Deine Werte auf einen Blick</h3><p>Ergänzung zu den bestehenden Messpunkt-Diagrammen und der segmentalen Körperanalyse.</p></div><small>${esc(latest.day)} · ${selected.length} Messungen</small></header><div class="fdi-layout"><div class="fdi-gauges">${present.map(m=>gauge(latest,selected,m)).join('')}${!present.length?'<p>Keine zusätzlichen Fitdays-Messwerte im Export.</p>':''}</div><aside class="fdi-matrix-card"><h4>BMI × Körperfett</h4>${bodyMatrix(latest)}<details><summary>Zur Einordnung</summary><p>Fitdays nutzt BIA und geräteabhängige Schätzalgorithmen. Hydration, Messzeit und Ernährung können Ergebnisse verändern. Für die Bewertung sind Trends über mehrere Messungen aussagekräftiger als ein einzelner Tag.</p></details></aside></div>${missing.length?`<details class="fdi-missing"><summary>Weitere ${missing.length} Kennzahlen · Nicht im Export</summary><p>${missing.map(m=>esc(m.label)).join(' · ')}. Diese Angaben werden nicht aus den vorhandenen Werten erfunden. Falls Fitdays sie exportiert, werden sie beim nächsten Import ergänzt.</p></details>`:''}<p class="fdi-footnote">Nur importierte Fitdays-Daten. Keine automatische Gesundheitsbewertung, kein Zielgewicht, keine Schätzwerte aus einem Screenshot und keine Änderungen an bisherigen Messungen. BMI: allgemeine WHO-Kategorien für Erwachsene.</p></section>`;
}
