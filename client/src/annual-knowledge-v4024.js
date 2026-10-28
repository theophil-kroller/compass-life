/** Ars Vivendi 0.5.77.59.40.24 · Research & Personal Intelligence.
 * Editorial knowledge is original, curated prose, with exact public sources.
 * Personal observations are always generated from local documented data.
 * No online PDF queries, no AI-invented facts, no fabricated missing nutrients.
 */
import {fatQualityModel} from './nutrition-fat-quality-v57731.js';
import {nutritionDay,bioactiveFromEntries} from './nutrition-intelligence-v57712.js';
import {hierarchicalFlows} from './finance-exotic-hierarchy.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(v,k=1)=>typeof v==='number'&&Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:k}):'nicht bestimmt';
const day=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d/.test(s)?s.slice(0,10):'';
const record=(values,w,field='at')=>(Array.isArray(values)?values:[]).filter(r=>r&&!r.deleted&&day(r[field])>=w.start&&day(r[field])<=w.end);
const source=(name,url)=>`<a class="av24-source" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a>`;
const reportPage=(section,title,deck,main,footer='')=>`<section class="av19-page av24-page"><div class="av19-running">COMPASS LIFE <span>ARS VIVENDI · RESEARCH EDITION</span></div><div class="av19-kicker">${esc(section)} / THE KNOWLEDGE EDITION</div><header class="av19-heading"><h2>${esc(title)}</h2><p>${esc(deck)}</p></header>${main}${footer?`<footer class="av24-footer">${footer}</footer>`:''}</section>`;
const paragraph=(tag,title,body)=>`<article class="av24-brief"><small>${esc(tag)}</small><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`;
const callout=(title,body,foot='')=>`<aside class="av24-advice"><strong>${esc(title)}</strong><p>${esc(body)}</p>${foot?`<small>${esc(foot)}</small>`:''}</aside>`;
const stat=(label,value,meta)=>`<div class="av24-stat"><small>${esc(label)}</small><b>${esc(value)}</b><span>${esc(meta)}</span></div>`;
const statrow=(...items)=>`<div class="av24-stats">${items.join('')}</div>`;
const compareSvg=(items,max)=>{
 const W=870,L=220,B=175,barW=W-L-B,step=63,H=items.length*step+28;
 const maxValue=max||Math.max(1,...items.map(x=>x.value||0));
 return `<svg class="av24-evidence-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dokumentierte Teilmengen; fehlende Werte nicht zu Null ergänzt">${items.map((r,i)=>{const y=i*step+8,draw=typeof r.value==='number'&&Number.isFinite(r.value);return `<text x="${L-13}" y="${y+19}" text-anchor="end" font-size="18" fill="#274438">${esc(r.label)}</text><rect x="${L}" y="${y}" width="${barW}" height="27" rx="6" fill="#edf1ed"/>${draw?`<rect x="${L}" y="${y}" width="${Math.max(2,barW*Math.max(0,r.value)/maxValue)}" height="27" rx="6" fill="${r.color||'#5a9182'}"/>`:''}<text x="${W-B+11}" y="${y+20}" font-size="18" fill="#365b4b">${draw?fmt(r.value,2)+' '+(r.unit||'g'):'keine Angabe'}</text><text x="${L}" y="${y+44}" font-size="12" fill="#7a8c83">${esc(r.coverage||'')}</text>`}).join('')}</svg>`;
};
export const ANNUAL_KNOWLEDGE_SOURCES=Object.freeze({
 saturated:'https://nutritionfacts.org/topics/saturated-fat/',
 omega:'https://nutritionfacts.org/topics/omega-3-fatty-acids/',
 omegaGuide:'https://nutritionfacts.org/optimum-nutrient-recommendations/',
 trans:'https://nutritionfacts.org/topics/trans-fats/',
 antioxidant:'https://nutritionfacts.org/topics/antioxidants/',
 matcha:'https://nutritionfacts.org/topics/matcha/',
 daily:'https://nutritionfacts.org/topics/daily-dozen/',
 hydration:'https://nutritionfacts.org/video/how-many-glasses-of-water-should-we-drink-a-day/',
 efsaWater:'https://www.efsa.europa.eu/de/press/news/nda100326',
 efsaFats:'https://www.efsa.europa.eu/de/safe2eat/your-nutrition-needs',
 efsaNutrients:'https://www.efsa.europa.eu/de/topics/topic/dietary-reference-values',
 bia:'https://ajcn.nutrition.org/article/S0002-9165(26)00092-4/fulltext',
 housing:'https://ec.europa.eu/eurostat/databrowser/view/tespm140/default/table?lang=en',
 savings:'https://www.consumerfinance.gov/consumer-tools/educator-tool/youth-financial-education/teach/activities/analyzing-budgets/'
});
/** Fat sums only describe the recorded entries within the chosen period. Never annualise sparse food logs. */
export function annualFatEvidence(state,w){
 const model=fatQualityModel(state,{days:Math.min(w.days,3650),today:w.end});
 const entries=model.entries.filter(e=>day(e.entry?.at)>=w.start&&day(e.entry?.at)<=w.end);
 const days=[...new Set(entries.map(e=>day(e.entry.at)))].filter(Boolean);
 const totals={},coverage={};
 for(const k of ['fat','saturated','mono','poly','ala','omega6','epa','dha','trans']){
  let sum=0,known=0,estimated=0;
  for(const e of entries){if(typeof e.values[k]==='number'&&Number.isFinite(e.values[k])){sum+=e.values[k];known++;if(e.coverage[k]?.estimate)estimated++;}}
  // Zero observations from no-fat foods do not prove zero intake if other food profiles are missing.
  totals[k]=known&&(sum>0||known===entries.length||k==='fat'||k==='saturated')?sum:null;
  coverage[k]={known,missing:entries.length-known,estimated};
 }
 return {days:days.length,entries:entries.length,totals,coverage};
}
export function annualFatKnowledge(state,w){
 const m=annualFatEvidence(state,w);if(!m.entries)return [];
 const rows=[{label:'Fett gesamt',key:'fat',color:'#5b9381'},{label:'Gesättigte Fette',key:'saturated',color:'#b97d65'},{label:'Einfach ungesättigt',key:'mono',color:'#608eaf'},{label:'Mehrfach ungesättigt',key:'poly',color:'#8d80b2'}];
 const visual=compareSvg(rows.map(x=>({...x,value:m.totals[x.key],coverage:`${m.coverage[x.key].known}/${m.entries} Einträge mit Wert · ${m.coverage[x.key].estimated} geschätzt`})));
 const detail=statrow(stat('Beobachtungstage',`${m.days}`,'Keine Hochrechnung auf 365 Tage'),stat('Fetteinträge',`${m.entries}`,'Teilweise ohne Fettsäureprofil'),stat('Gesättigt dokumentiert',m.totals.saturated!==null?`${fmt(m.totals.saturated)} g`:'—','Teilsumme, nicht Tagesdurchschnitt'));
 const page1=reportPage('V / THE SCIENCE OF FATS','Fett ist nicht gleich Fett','Welche Fettarten in Lebensmitteln vorkommen – und was deine Compass-Einträge tatsächlich zeigen.',
 `${paragraph('01 · KONTEXT','Gesättigte Fettsäuren','Sie kommen unter anderem in Butter, Käse, Kokosfett und manchen verarbeiteten Produkten vor. Eine hohe Zufuhr kann den LDL-Cholesterinspiegel erhöhen. Statt pauschal fettarm zu essen, ist die Qualität des Ersatzes entscheidend.')}${paragraph('02 · KONTEXT','Einfach ungesättigte Fettsäuren','Beispiele sind Oliven, Avocados und zahlreiche Nüsse. Werden Lebensmittel mit viel gesättigtem Fett durch Quellen ungesättigter Fette ersetzt, kann das für die Herz-Kreislauf-Gesundheit vorteilhaft sein.')}${paragraph('03 · KONTEXT','Mehrfach ungesättigte Fettsäuren','Dazu gehören die essenziellen Omega-3- und Omega-6-Fettsäuren. Omega-6 ist nicht grundsätzlich schädlich. Das reine Omega-6:3-Verhältnis ist kein ausreichendes Gesundheitsurteil.')}${paragraph('04 · KONTEXT','Transfette','Industriell erzeugte Transfette sollten möglichst vermieden werden. Nicht deklarierte Transfettmengen sind in Compass unbekannt, nicht automatisch null.')}${detail}<div class="av24-chart-label">DEINE ERFASSTEN FETTMENGEN · VOLLSTÄNDIGKEIT SICHTBAR</div>${visual}${callout('Deine persönliche Einordnung',`In ${m.days} protokollierten Tagen liegen ${m.entries} Einträge vor. Das Diagramm zeigt summierte bekannte Teilmengen, keine vollständige oder auf das Jahr hochgerechnete Nährstoffaufnahme. Prüfe besonders die Datenabdeckung vor einer Aussage zu deinem Fettkonsum.`)}`,
 `${source('NutritionFacts.org · Saturated Fat',ANNUAL_KNOWLEDGE_SOURCES.saturated)} · ${source('NutritionFacts.org · Trans Fats',ANNUAL_KNOWLEDGE_SOURCES.trans)} · ${source('EFSA · Fettqualität',ANNUAL_KNOWLEDGE_SOURCES.efsaFats)}`);
 const a=m.coverage.ala,e=m.coverage.epa,d=m.coverage.dha;
 const page2=reportPage('V / THE ESSENTIAL FATS','Omega-3, Omega-6 und die richtigen Quellen','ALA, EPA und DHA werden getrennt ausgewiesen. Ein niedriger dokumentierter Wert ist kein nachgewiesener Nährstoffmangel.',
 `${paragraph('01 · THE SCIENCE','ALA · Pflanzliches Omega-3','Alpha-Linolensäure (ALA) findet sich beispielsweise in geschrotetem Leinsamen, Chia und Walnüssen. Dr. Greger empfiehlt im Daily Dozen täglich einen Esslöffel geschroteten Leinsamen als pflanzliche Quelle.')}${paragraph('02 · THE SCIENCE','EPA und DHA · Langkettiges Omega-3','Die Umwandlung von ALA zu EPA und DHA ist begrenzt und individuell unterschiedlich. NutritionFacts.org empfiehlt, eine Zufuhr von etwa 250 mg EPA/DHA pro Tag aus Algen- oder Hefequellen zu erwägen. Das ist eine Ernährungsempfehlung des Autors, keine Diagnose.')}${paragraph('03 · THE SCIENCE','Omega-6 · Essenziell statt „schlecht“','Linolsäure gehört zu den essenziellen Fettsäuren. Statt Omega-6 grundsätzlich zu vermeiden, ist es sinnvoll, hochwertige Lebensmittelquellen und die gesamte Ernährungsweise zu betrachten.')}${statrow(stat('ALA · dokumentiert',m.totals.ala===null?'unbekannt':`${fmt(m.totals.ala,2)} g`,`${a.known}/${m.entries} mit Wert`),stat('EPA · dokumentiert',m.totals.epa===null?'unbekannt':`${fmt(m.totals.epa,0)} mg`,`${e.known}/${m.entries} mit Wert`),stat('DHA · dokumentiert',m.totals.dha===null?'unbekannt':`${fmt(m.totals.dha,0)} mg`,`${d.known}/${m.entries} mit Wert`))}${callout('Ein sinnvoller nächster Versuch','Wenn du die Omega-3-Zufuhr bewusster gestalten willst, könntest du verlässlich dokumentierte Portionen geeigneter Samen und Nüsse einplanen. Bei EPA/DHA lässt sich die Eignung eines Algenprodukts gesondert prüfen. Aus Lücken in den Einträgen wird kein Mangel abgeleitet.')}`,
 `${source('NutritionFacts.org · Omega-3',ANNUAL_KNOWLEDGE_SOURCES.omega)} · ${source('Dr. Greger · Optimum Nutrients',ANNUAL_KNOWLEDGE_SOURCES.omegaGuide)} · ${source('Daily Dozen',ANNUAL_KNOWLEDGE_SOURCES.daily)}`);
 return [page1,page2];
}
export function annualNutritionKnowledge(state,w){
 const entries=record(state.nutritionJournal?.entries,w);
 if(!entries.length)return [];
 const dates=[...new Set(entries.map(x=>day(x.at)))].sort();
 let drinkKnown=0,drinkMl=0;let caffeine=null,egcg=null;
 for(const d of dates){let model;try{model=nutritionDay(state,d)}catch{continue};
  for(const x of model.entries){if(x.entry?.foodId==='water-glass'){const m=/([\d.,]+)\s*ml/i.exec(String(x.entry.amount||''));if(m){drinkMl+=Number(m[1].replace(',','.'));drinkKnown++;}}}
  const bio=bioactiveFromEntries(model.entries);
  for(const t of bio){if(t.known>0&&['caffeine','EGCG'].includes(t.key)){if(t.key==='caffeine')caffeine=(caffeine||0)+t.value;else egcg=(egcg||0)+t.value;}}
 }
 const water=reportPage('V / HYDRATION','Wasser, Flüssigkeit und Alltag','Eine Orientierung im Kontext von Ernährung, Bewegung und Klima – kein starres Universalziel.',
 `${paragraph('01 · WISSENSKONTEXT','Wasser kommt auch aus Lebensmitteln','Die EFSA nennt für Erwachsene unter moderaten Bedingungen angemessene Gesamtwassermengen von etwa 2,0 l für Frauen und 2,5 l für Männer pro Tag. Diese umfassen Getränke UND Wasser aus Lebensmitteln; sie sind nicht mit einer Pflicht-Trinkmenge gleichzusetzen.')}${paragraph('02 · NUTRITIONFACTS.ORG','Daily Dozen · Getränke','Dr. Gregers Daily Dozen sieht fünf Getränkeservings als Orientierung vor. Seine Definition eines Glases liegt bei etwa 355 ml. Die fünf Portionen sind eine Checklisten-Empfehlung, nicht dasselbe wie der EFSA-Gesamtwasserwert. Bei Hitze und Sport kann der Bedarf steigen.')}${statrow(stat('Tage mit Essen/Trinken',dates.length,'Von 365 bzw. gewähltem Zeitraum'),stat('Wassergläser mit ml-Angabe',drinkKnown,'Explizit erfasste Gläser'),stat('Wasser aus diesen Gläsern',drinkKnown?`${fmt(drinkMl/1000,2)} l`:'nicht bestimmt','Keine Gesamttrinkmenge'))}${callout('Dein nächster Schritt',drinkKnown?'Wasser ist teilweise dokumentiert. Wenn du Trends untersuchen möchtest, erfasse zusätzlich Tee, Kaffee und andere Getränke in ml. Wasser in Lebensmitteln bleibt aus den Tagebucheinträgen nur teilweise bestimmbar.':'Für eine belastbare Hydrationsanalyse fehlen eindeutige Volumenangaben in den Getränkeeingaben. Ein leerer Tag wird nicht als 0 ml bewertet.')}`,
 `${source('NutritionFacts.org · Wasser',ANNUAL_KNOWLEDGE_SOURCES.hydration)} · ${source('EFSA · Wassermengen',ANNUAL_KNOWLEDGE_SOURCES.efsaWater)} · ${source('Daily Dozen',ANNUAL_KNOWLEDGE_SOURCES.daily)}`);
 const tracked=['vitaminB12','vitaminD','calcium','iron','iodine','vitaminC','fiber'];
 const known=new Map(tracked.map(k=>[k,{total:0,count:0,estimated:0,unit:['calcium','iron','vitaminC'].includes(k)?'mg':['fiber'].includes(k)?'g':'µg'}]));
 for(const d of dates){const m=nutritionDay(state,d);for(const k of tracked){const o=known.get(k);if(m.coverage[k]?.known){o.total+=m.totals[k]||0;o.count++;o.estimated+=m.coverage[k].estimated||0;}}}
 const nutrientNames={vitaminB12:'Vitamin B12',vitaminD:'Vitamin D',calcium:'Calcium',iron:'Eisen',iodine:'Jod',vitaminC:'Vitamin C',fiber:'Ballaststoffe'};
 const nutrientTable=`<table class="av19-table av24-nutrient-table"><thead><tr><th>Stoff</th><th>Erfasste Teilmenge</th><th>Tage mit Nährwert</th></tr></thead><tbody>${tracked.map(k=>{const t=known.get(k);return `<tr><td>${esc(nutrientNames[k])}</td><td>${t.count?esc(fmt(t.total,2))+' '+t.unit:'unbekannt'}</td><td>${t.count}/${dates.length} · ${t.estimated} geschätzte Werte</td></tr>`}).join('')}</tbody></table>`;
 const vitamins=reportPage('V / ESSENTIAL NUTRIENTS','Vitamine, Mineralstoffe & pflanzliche Ernährung','Biologische Aufgaben, Quellen, dokumentierte Werte und Grenzen unvollständiger Ernährungstagebücher.',
 `${paragraph('01 · ORIENTIERUNG','Vitamine und Mineralstoffe sind keine Punktesammlung','Vitamin B12 ist für Nerven und Blutbildung wichtig, Vitamin D für den Knochenstoffwechsel, Calcium für Knochen, Eisen unter anderem für Sauerstofftransport und Jod für die Schilddrüse. Die benötigten Mengen variieren nach Lebensphase und weiteren Faktoren.')}${paragraph('02 · NUTRITIONFACTS.ORG','Wichtige Nährstoffe in pflanzenbetonter Ernährung','NutritionFacts.org hebt für pflanzenbetonte Kost besonders B12, gegebenenfalls Vitamin D, Calcium, Jod, Eisen und langkettiges Omega-3 hervor. Nahrungsergänzung ist nicht mit einer gemessenen Versorgung gleichzusetzen. Die Auswahl muss zur tatsächlichen Ernährung passen.')}${paragraph('03 · EVIDENCE QUALITY','Nahrungszufuhr ist nicht Blutstatus','Nährwertdatenbanken, Etiketten und geschätzte Portionsgrößen liefern bestenfalls Zufuhrschätzungen. Eine niedrige Tages-Teilsumme ist weder ein diagnostizierter Mangel noch ein verlässlicher Jahresdurchschnitt.')}<div class="av24-chart-label">DEINE NÄHRSTOFFDATEN · NUR ERFASSTE TAGE</div>${nutrientTable}${callout('Persönliche Empfehlung','Führe zunächst fehlende Etikettwerte und Portionsgrößen für häufige Lebensmittel nach. Bei B12 und anderen potenziell kritischen Nährstoffen empfiehlt sich eine an deinen Lebensumständen orientierte Prüfung; Compass ersetzt keine fachliche Diagnostik.')}`,
 `${source('NutritionFacts.org · Optimum Nutrients',ANNUAL_KNOWLEDGE_SOURCES.omegaGuide)} · ${source('EFSA · Referenzwerte',ANNUAL_KNOWLEDGE_SOURCES.efsaNutrients)}`);
 const matcha=reportPage('V / PHYTONUTRIENT SCIENCE','Antioxidantien, Matcha & Catechine','Was die Inhaltsstoffe bedeuten und welche Aussagen über deinen tatsächlichen Konsum möglich sind.',
 `${paragraph('01 · WISSENSKONTEXT','Antioxidantien sind keine Lebensjahre-Punkte','Pflanzliche Lebensmittel liefern zahlreiche Polyphenole und andere bioaktive Stoffe. Ein hoher antioxidativer Laborwert beweist aber nicht, dass eine bestimmte Portion Krankheiten verhindert oder die Lebensdauer verlängert. Ernährungsmuster sind aussagekräftiger als eine erfundene „Antioxidantien-Summe“.')}${paragraph('02 · GREEN TEA SCIENCE','EGCG, EGC und weitere Catechine','Matcha ist pulverisierter grüner Tee. Wichtige Catechine sind EGCG, EGC und ECG; ihre Konzentrationen variieren je nach Produkt und Zubereitung. Hersteller-Mindestwerte in Compass sind keine Laboranalyse des konkreten Pulvers.')}${statrow(stat('EGCG · belegte Teilmenge',egcg===null?'nicht bestimmt':`≥ / ≈ ${fmt(egcg,0)} mg`,'Mindestwerte und Schätzwerte gemischt; kein exakter Jahreswert'),stat('Koffein · dokumentiert',caffeine===null?'nicht bestimmt':`≈ ${fmt(caffeine,0)} mg`,'Teilmenge; kein vollständiges Koffeinprotokoll'),stat('Ernährungstage',dates.length,'Datenbasis für diesen Abschnitt'))}${callout('Was bei dir sinnvoll zu beobachten wäre','Matcha, Beeren, Nüsse und Kräuter können als Lebensmittelgruppen sinnvoll über die Zeit dokumentiert werden. Ohne vollständige Verzehrsprotokolle und verlässliche Inhaltsstoffangaben lässt sich keine individuelle antioxidative Wirkung oder EGCG-Gesamtaufnahme bestimmen.')}`,
 `${source('NutritionFacts.org · Antioxidants',ANNUAL_KNOWLEDGE_SOURCES.antioxidant)} · ${source('NutritionFacts.org · Matcha',ANNUAL_KNOWLEDGE_SOURCES.matcha)} · ${source('EFSA · Nährstoffreferenzen',ANNUAL_KNOWLEDGE_SOURCES.efsaNutrients)}`);
 return [water,vitamins,matcha];
}
export function annualBodyKnowledge(model){
 if(!model?.fitdays?.length)return [];
 const f=model.fat?.last,first=model.fat?.first,weight=model.weight?.last;
 const diff=f&&first&&f.day!==first.day?f.value-first.value:null;
 return [reportPage('IV / BODY COMPOSITION','Körperfett verstehen','Ein persönlicher Trend im Kontext von Alter, Körperzusammensetzung und Messunsicherheit.',
 `${paragraph('01 · DIE WISSENSCHAFT','Warum es keine einzige optimale Prozentzahl gibt','Gesundheitsbezogene Körperfettbereiche hängen unter anderem von Alter, Geschlecht, Körperfettverteilung und Messmethode ab. Eine starre Ampel ohne diese Angaben wäre irreführend. Besonders Bauchfett und weitere Risikofaktoren gehören zur Beurteilung; Gewicht allein reicht nicht.')}${paragraph('02 · MESSQUALITÄT','BIA schätzt, statt Körperfett direkt zu messen','Fitdays verwendet bioelektrische Impedanzmessung. Flüssigkeitsstatus, Tageszeit, Training und das Gerätemodell können die Schätzung verändern. Vergleiche sind am sinnvollsten bei möglichst gleichen Messbedingungen.')}${statrow(stat('Letzter BIA-Körperfettwert',f?`${fmt(f.value)} %`:'nicht bestimmt','Geräteschätzung'),stat('Veränderung der Messpunkte',diff!==null?`${diff>=0?'+':''}${fmt(diff)} %-Punkte`:'nicht bestimmbar',`${model.fitdays.length} vorhandene Messpunkte`),stat('Letztes Körpergewicht',weight?`${fmt(weight.value)} kg`:'nicht bestimmt','Nur dokumentiert'))}${callout('Persönliche Einordnung','Verfolge den längerfristigen Verlauf bei standardisierter Messung und betrachte Körperfett, Muskelmasse und Trainingsfortschritte zusammen. Aus einer BIA-Prozentzahl allein wird keine Diagnose und kein pauschales „Idealgewicht“ abgeleitet.')}`,
 `${source('Methodological standards for body composition · AJCN 2026',ANNUAL_KNOWLEDGE_SOURCES.bia)}`)];
}
export function annualFinanceKnowledge(transactions=[],w){
 if(!transactions.length)return [];
 // Income must be documented, positive, correctly classified, and non-pending.
 const income=transactions.filter(t=>!t.needsReview&&t.flow==='income'&&t.amountCents>0).reduce((s,t)=>s+t.amountCents,0);
 const groups=hierarchicalFlows(transactions).filter(x=>!x.special&&x.cents>0);
 const housing=groups.filter(x=>/wohn|miete|betriebskosten/i.test(x.name)).reduce((s,x)=>s+x.cents,0);
 const total=groups.reduce((s,x)=>s+x.cents,0),ratio=income>0?housing/income*100:null;
 const chart=compareSvg([{label:'Wohnen',value:housing/100,color:'#bd9768',unit:'€',coverage:`${fmt(total/100,0)} € bestätigte Konsumausgaben gesamt`},{label:'Sonstiger Konsum',value:Math.max(0,total-housing)/100,color:'#508b78',unit:'€',coverage:'Ohne interne Transfers und ungeklärte Abgänge'}],total/100);
 return [reportPage('VI / FINANCIAL LITERACY','Wohnen, Lebenshaltung & finanzielle Freiheit','Orientierungsregeln sind Werkzeuge – kein Ersatz für Einkommens-, Familien- und Lebensplanung.',
 `${paragraph('01 · EINORDNUNG','Wie viel Wohnen ist angemessen?','Eurostat bezeichnet Haushalte mit Wohnkosten über 40 % des verfügbaren Haushaltseinkommens als durch Wohnkosten überbelastet. Das ist eine statistische Definition, keine Empfehlung, möglichst 40 % auszugeben. Zur Wohnausgabe gehören mehr als nur Miete: auch Energie und Betriebskosten.')}${paragraph('02 · EINORDNUNG','Was bedeutet die 50/30/20-Regel?','Die US-Verbraucherschutzbehörde CFPB nutzt 50 % notwendige Ausgaben, 30 % Wünsche und 20 % Sparziele als leicht verständliches Budgetbeispiel. Die Regel ist weder in Österreich verpflichtend noch auf jeden Haushalt passend – vor allem nicht bei schwankendem Einkommen oder besonderen Verpflichtungen.')}${paragraph('03 · VERMÖGEN','Sparen ist nicht dasselbe wie Investieren','Die 20-%-Faustregel bezieht sich auf Sparziele und Schuldenabbau, nicht automatisch auf eine feste Aktienquote. Wie viel investiert werden kann, hängt von Notfallreserve, Ausgaben, Zeithorizont und Risiko ab. Interne Depotüberträge sind keine Konsumausgaben.')}${statrow(stat('Wohnen · bestätigt',`${fmt(housing/100,0)} €`,'Klassifizierte Teilmenge'),stat('Einnahmen · dokumentiert',income?`${fmt(income/100,0)} €`:'unvollständig','Kein verifiziertes Haushaltsnetto'),stat('Wohnen / erfasste Einnahmen',ratio!==null?`${fmt(ratio)} %`:'nicht berechenbar','Kein Haushaltsquotient ohne Einkommensvollständigkeit'))}<div class="av24-chart-label">BESTÄTIGTE AUSGABEN · VERTEILUNG</div>${chart}${callout('Deine persönliche Empfehlung',ratio!==null?'Vergleiche diese Quote erst nach Abgleich aller regelmäßigen Haushaltsnettoeinnahmen, Wohnnebenkosten und des Berichtszeitraums. Prüfe dazu größere Ausgabenkategorien, wiederkehrende Zahlungen und frei verfügbare Mittel.':'Zuerst die Einkommens- und Wohnkostenabdeckung klären. Erst dann kann Compass einen seriösen Wohnkostenanteil oder eine mögliche Spar-/Investitionsquote berechnen. Aus Ausgaben allein folgt keine Empfehlung für eine konkrete Investitionssumme.')}`,
 `${source('Eurostat · Wohnkostenbelastung',ANNUAL_KNOWLEDGE_SOURCES.housing)} · ${source('CFPB · 50/30/20',ANNUAL_KNOWLEDGE_SOURCES.savings)}`)];
}
export const ANNUAL_KNOWLEDGE_CSS=`
.av24-page{gap:3.2mm}.av24-page .av19-heading h2{font-size:29px;margin:4mm 0 2mm}.av24-page .av19-heading p{font-size:11px}
.av24-brief{border-top:1px solid #d6e2db;padding:2.4mm 0 2.1mm}.av24-brief small,.av24-chart-label{font:9px/1.4 system-ui,sans-serif;letter-spacing:.12em;color:#a58b5e}.av24-brief h3{font:18px Georgia,serif;color:#254a3e;margin:1.4mm 0}.av24-brief p{font:11px/1.56 system-ui,sans-serif;color:#40574d;margin:1mm 0 0}
.av24-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4mm;margin:2mm 0}.av24-stat{border-top:1px solid #c5d6c9;padding:2mm 0}.av24-stat small{display:block;font:9px system-ui,sans-serif;color:#72867a}.av24-stat b{display:block;font:19px/1.4 Georgia,serif;color:#214e3e}.av24-stat span{display:block;font:9px/1.3 system-ui,sans-serif;color:#7d8d84}
.av24-evidence-svg{width:100%;max-height:62mm;height:auto;display:block}.av24-advice{background:#f0f5f1;border-left:2px solid #b7a072;padding:4mm;margin:2mm 0}.av24-advice strong{font:17px Georgia,serif;color:#244b3d}.av24-advice p{font:11px/1.55 system-ui,sans-serif;color:#40584d;margin:2mm 0}.av24-advice small{font:9px/1.5 system-ui,sans-serif;color:#73867b}.av24-footer{margin-top:auto;border-top:1px solid #dfebe4;padding-top:2mm;font:9px/1.55 system-ui,sans-serif;overflow-wrap:anywhere}.av24-nutrient-table{font-size:11px}.av24-nutrient-table th,.av24-nutrient-table td{padding:6px 4px}
.av24-source{color:#4d7566;text-decoration:underline}
`;
