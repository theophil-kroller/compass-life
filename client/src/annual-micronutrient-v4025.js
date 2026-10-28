/** Full nutrient index for the Ars Vivendi Editorial Edition.
 * Catalog derives from the SAME named nutrients the nutrition entry engine uses.
 * Personal quantities are sums of known day contributions, not a claim about diet completeness.
 */
import {nutritionDay,NUTRIENT_LABELS,bioactiveFromEntries,PRODUCT_PROFILES} from './nutrition-intelligence-v57712.js';
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=x=>String(x||'').slice(0,10);
const de=(x,d=1)=>Number.isFinite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:d}):'—';
const FUNCTIONS={
 vitaminA:'Sehvorgänge, Schleimhäute und Zellwachstum.',vitaminC:'Kollagenbildung, Eisenaufnahme und antioxidative Schutzprozesse.',vitaminD:'Calciumaufnahme, Knochenstoffwechsel und Muskelfunktion.',vitaminE:'Schutz von Zellmembranen vor oxidativem Stress.',vitaminK:'Blutgerinnung und Knochenstoffwechsel.',
 vitaminB1:'Energiegewinnung aus Kohlenhydraten und Nervenfunktion.',vitaminB2:'Energiestoffwechsel sowie Erhalt von Haut und Schleimhäuten.',niacin:'NAD/NADP-abhängige Reaktionen des Zellstoffwechsels.',vitaminB6:'Aminosäurenstoffwechsel, Nervenfunktion und Hämoglobinbildung.',folate:'Zellteilung und DNA-Synthese.',vitaminB12:'Nervenfunktion, Blutbildung und DNA-Stoffwechsel.',biotin:'Stoffwechsel von Fetten, Kohlenhydraten und Aminosäuren.',pantothenicAcid:'Bestandteil von Coenzym A und zentral für die Energiegewinnung.',
 calcium:'Knochen, Zähne, Muskeln und Signalübertragung.',phosphorus:'Knochenmineralisierung, ATP und Zellmembranen.',iron:'Sauerstofftransport und Energiegewinnung.',iodine:'Bildung der Schilddrüsenhormone.',magnesium:'Enzymfunktionen sowie Muskel- und Nervenaktivität.',zinc:'Immunsystem, Enzyme, Wundheilung und Zellteilung.',selenium:'Selenoproteine, antioxidative Enzyme und Schilddrüse.',copper:'Eisenstoffwechsel, Enzyme und Bindegewebe.',manganese:'Enzymfunktionen und Bildung von Bindegewebskomponenten.',chromium:'Wird im Kontext des Glukosestoffwechsels untersucht; essenzieller Bedarf nicht eindeutig etabliert.',molybdenum:'Cofaktor verschiedener Enzyme.',potassium:'Flüssigkeitshaushalt, Nerven- und Muskelfunktion.',choline:'Acetylcholin, Zellmembranen und Leberstoffwechsel.',boron:'Wird im Zusammenhang mit Knochen- und Mineralstoffwechsel untersucht; keine gesicherte essenzielle Funktion beim Menschen.'
};
const PHYTO={EGCG:'Epigallocatechingallat – Catechin aus Grüntee, experimentell untersuchte Signalwege.',EGC:'Epigallocatechin – Catechin in grünem Tee.',EC:'Epicatechin – Flavanol, unter anderem in Tee und Kakao.',catechin:'Catechin – pflanzliches Flavanol.',caffeine:'Koffein – stimuliert das zentrale Nervensystem und kann Wachheit steigern.',lTheanine:'L-Theanin – Aminosäure aus Tee, untersucht für Aufmerksamkeit und Entspannung.',ALA:'Alpha-Linolensäure – essenzielle pflanzliche Omega-3-Fettsäure.',SDG:'SDG-Lignane aus Leinsamen – Darmstoffwechsel und hormonähnliche Pflanzenstoffe in der Forschung.',saponins:'Saponine – heterogene Pflanzenstoffe mit verschiedenen biologischen Eigenschaften.',curcumin:'Curcumin – Farbstoff der Kurkumawurzel, vielfach experimentell untersucht.',arginine:'Arginin – Aminosäure und Vorläufer von Stickstoffmonoxid.',pomegranate:'Granatapfel-Polyphenole – enthalten unterschiedliche antioxidativ aktive Moleküle.',ellagic:'Ellagsäure – Polyphenol in bestimmten Früchten und Nüssen.',maca:'Maca – Wurzelpflanze, deren Wirkungen untersucht werden.',eleuthero:'Eleutherococcus – Pflanzenextrakt; Wirkmechanismen und Evidenz je Präparat unterschiedlich.'};
const sections=[
 ['Vitaminatlas · A bis K',['vitaminA','vitaminC','vitaminD','vitaminE','vitaminK','vitaminB1','vitaminB2','niacin','vitaminB6','folate','vitaminB12']],
 ['Vitaminatlas · weitere Stoffe',['biotin','pantothenicAcid','choline','calcium','phosphorus','iron','iodine','magnesium','zinc','selenium']],
 ['Mineralstoffatlas · Spurenelemente',['copper','manganese','chromium','molybdenum','potassium','boron']]
];
function p(label,body){return `<p class="av25-micro-intro"><b>${h(label)}</b> ${h(body)}</p>`;}
function paper(heading,content,sourceNote){return `<section class="av19-page av25-editorial av25-nutrient-sheet"><div class="av19-running">PRIVATE ARCHIVE <span>ARS VIVENDI · NUTRIENT ENCYCLOPEDIA</span></div><div class="av19-kicker">V / NUTRITION & LONGEVITY</div><header class="av19-heading"><h2>${h(heading)}</h2><p>Was die Stoffe im Körper leisten – und welche Mengen in Compass tatsächlich dokumentiert sind.</p></header>${content}<footer class="av25-footnote">QUELLEN · <a href="https://nutritionfacts.org/optimum-nutrient-recommendations/">NutritionFacts.org · Optimum Nutrient Recommendations</a> · <a href="https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values">EFSA · Dietary Reference Values</a> · ${h(sourceNote)}</footer></section>`;}
export function micronutrientLedger(state,w){
 const entries=(Array.isArray(state?.nutritionJournal?.entries)?state.nutritionJournal.entries:[]).filter(e=>!e.deleted&&day(e.at)>=w.start&&day(e.at)<=w.end);
 const days=[...new Set(entries.map(e=>day(e.at)))].filter(Boolean).sort();
 const models=days.map(d=>nutritionDay(state,d));
 const nutrients=Object.fromEntries(Object.keys(FUNCTIONS).map(key=>[key,{key,value:0,days:0,estimated:0,withAmount:0}]));
 for(const m of models)for(const [key,row] of Object.entries(nutrients)){
  if(m.coverage?.[key]?.known>0&&Number.isFinite(m.totals?.[key])){row.value+=m.totals[key];row.days++;row.withAmount+=m.coverage[key].known;row.estimated+=m.coverage[key].estimated||0;}
 }
 const extra=bioactiveFromEntries(models.flatMap(m=>m.entries));
 const supplementNames=[...new Set(entries.filter(e=>/supplement/i.test(e.foodId||'')).map(e=>PRODUCT_PROFILES[e.foodId]?.name||e.foodId))];
 return {days:days.length,entries:entries.length,nutrients,extra,supplementNames};
}
export function micronutrientAnnualPages(state,w){const m=micronutrientLedger(state,w);if(!m.days)return [];
 const pages=sections.map(([title,keys])=>{
  const rows=keys.map(key=>{const data=m.nutrients[key],lab=NUTRIENT_LABELS[key]||[key,''];const amount=data.days?`${de(data.value,2)} ${lab[1]}`:'Nicht bestimmt';
   return `<tr><th><strong>${h(lab[0])}</strong><small>${h(FUNCTIONS[key])}</small></th><td>${amount}</td><td>${data.days}/${m.days} Tage${data.estimated?` · ${data.estimated} geschätzt`:''}</td></tr>`;}).join('');
  return paper(title,p('Physiologie','Jeder Stoff hat unterschiedliche biologische Aufgaben. Die Tabellen zeigen sämtliche von Compass unterstützten Vitamine und Mineralstoffe, einschließlich solcher aus erfassten Supplementen.')+
   `<table class="av25-micro-table"><thead><tr><th>Nährstoff und seine Funktion</th><th>Bekannte Teilmenge</th><th>Abdeckung</th></tr></thead><tbody>${rows}</tbody></table>`,`${m.days} dokumentierte Ernährungstage`);
 });
 if(m.extra.length){const compounds=m.extra.filter(x=>x.known>0||x.unknown>0);
  for(let i=0;i<compounds.length;i+=8){const batch=compounds.slice(i,i+8);
   pages.push(paper(i?'Botanical Compounds · Fortsetzung':'Botanical Compounds & Supplements',p('Bioaktive Stoffe','Nicht nur Vitamine und Mineralstoffe: Erfasste Nahrungsergänzungsmittel und Matcha können zusätzliche pflanzliche Inhaltsstoffe enthalten. Ihre Menge wird nur angezeigt, wenn die Produktquelle dafür eine Angabe bietet.')+
    `<table class="av25-micro-table"><thead><tr><th>Inhaltsstoff & Bedeutung</th><th>Dokumentierte Angaben</th><th>Quellen</th></tr></thead><tbody>${batch.map(x=>`<tr><th><strong>${h(x.label||x.key)}</strong><small>${h(PHYTO[x.key]||'Pflanzlicher oder supplementärer Inhaltsstoff; Wirkungen sind stoff- und dosisspezifisch.')}</small></th><td>${x.known?`${x.minimum?'≥ ':x.estimated?'≈ ':''}${de(x.value)} ${h(x.unit)}`:'Nicht quantifiziert'}</td><td>${x.known} Mengenwerte</td></tr>`).join('')}</tbody></table>`+
    (i===0&&m.supplementNames.length?`<div class="av25-supplements"><b>Erfasste Nahrungsergänzungsmittel:</b> ${h(m.supplementNames.join(' · '))}</div>`:''),`${m.days} dokumentierte Ernährungstage`));
  }
 }
 return pages;
}
export const MICRO_ATLAS_CSS=`.av25-micro-intro{font:11px/1.55 system-ui,sans-serif;color:#4c6858;margin:0 0 2mm}.av25-micro-table{border-collapse:collapse;width:100%;table-layout:fixed;font:11px/1.3 system-ui,sans-serif}.av25-micro-table th,.av25-micro-table td{padding:3mm 2mm;border-bottom:1px solid #e1e9e3;text-align:left;vertical-align:top}.av25-micro-table th:first-child{width:57%}.av25-micro-table td:nth-child(2){width:24%;font-weight:600;color:#345b4a}.av25-micro-table td:nth-child(3){font-size:9px;color:#7c9084}.av25-micro-table th strong{display:block;color:#2a513d;font-weight:600;font-size:12px}.av25-micro-table th small{display:block;color:#60796b;font-weight:400;font-size:10px;margin-top:1mm;line-height:1.4}.av25-supplements{background:#f1f5f1;padding:3mm;font:11px/1.5 system-ui,sans-serif;color:#476453;margin-top:3mm}.av25-nutrient-sheet{gap:3mm}.av25-nutrient-sheet .av19-heading h2{font-size:30px}`;
