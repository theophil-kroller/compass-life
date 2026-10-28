/** Ars Vivendi · 0.5.77.59.40.25 Editorial Rebuild.
 * The annual is a private, browser-only editorial composition. Scientific articles
 * are curated once; observational panels read existing local Compass data.
 * Privacy gates for finance, feelings and relationships are inherited and tested.
 */
import {wealthSummary} from './finance-wealth-consolidation.js';
import {buildLifeBalanceRadar} from './life-balance-radar-v563.js';
import {flatexSnapshotStats,latestFlatexSnapshot} from './finance-flatex-positions-v37.js';
import {krakenWealthSummary} from './finance-kraken.js';
import {hierarchicalFlows} from './finance-exotic-hierarchy.js';
import {micronutrientAnnualPages} from './annual-micronutrient-v4025.js';
import {annualFinancePatternPages,ANNUAL_FINANCE_PATTERNS_CSS} from './annual-finance-patterns-v40252.js';

const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const de=(x,n=1)=>Number.isFinite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:n}):'—';
const day=x=>typeof x==='string'?x.slice(0,10):'';
const arr=x=>Array.isArray(x)?x:[];
const mean=v=>v.length?v.reduce((a,b)=>a+b,0)/v.length:null;
const src=(name,url)=>`<a href="${h(url)}" rel="noopener noreferrer" target="_blank">${h(name)}</a>`;
const page=(tag,title,subtitle,html,sources=[])=>`<section class="av19-page av25-editorial"><div class="av19-running">PRIVATE ARCHIVE <span>ARS VIVENDI · PERSONAL CHRONICLE</span></div><div class="av19-kicker">${h(tag)} / RESEARCH & PERSONAL INTELLIGENCE</div><header class="av19-heading"><h2>${h(title)}</h2><p>${h(subtitle)}</p></header>${html}${sources.length?`<footer class="av25-footnote">QUELLEN · ${sources.map(([name,url])=>src(name,url)).join(' · ')}</footer>`:''}</section>`;
const story=(heading,txt)=>`<article class="av25-story"><h3>${h(heading)}</h3><p>${h(txt)}</p></article>`;
const thoughts=(heading,txt)=>`<aside class="av25-thought"><span>DEINE PERSPEKTIVE</span><h3>${h(heading)}</h3><p>${h(txt)}</p></aside>`;
const stats=(...items)=>`<div class="av25-stats">${items.map(([name,value,small])=>`<div><small>${h(name)}</small><strong>${h(value)}</strong><span>${h(small)}</span></div>`).join('')}</div>`;
const chip=(name,body)=>`<article class="av25-chip"><strong>${h(name)}</strong><p>${h(body)}</p></article>`;
const grid=arr=>`<div class="av25-grid">${arr.join('')}</div>`;
const S={
 sleep:['American Academy of Sleep Medicine','https://aasm.org/resources/pdf/sleepdurationconsensus.pdf'],
 work:['WHO/ILO · Long Working Hours','https://www.who.int/news/item/17-05-2021-long-working-hours-increasing-deaths-from-heart-disease-and-stroke-who-ilo'],
 hrv:['Garmin · HRV Status','https://www.garmin.com/en-IE/garmin-technology/health-science/hrv-status/'],
 visceral:['NICE · Central Adiposity','https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity'],
 training:['ACSM · Resistance Training 2026','https://acsm.org/resistance-training-guidelines-update-2026/'],
 fasting:['NutritionFacts.org · Time-Restricted Eating','https://nutritionfacts.org/blog/what-the-science-says-about-time-restricted-eating/'],
 fastingReview:['BMJ · Timing of Eating','https://pubmed.ncbi.nlm.nih.gov/41586347/'],
 daily:['NutritionFacts.org · Daily Dozen','https://nutritionfacts.org/topics/daily-dozen/'],
 nutrients:['NutritionFacts.org · Optimum Nutrient Recommendations','https://nutritionfacts.org/optimum-nutrient-recommendations/'],
 fats:['NutritionFacts.org · Saturated Fat','https://nutritionfacts.org/topics/saturated-fat/'],
 emotions:['Karla McLaren · Gifts of Emotions','https://karlamclaren.com/the-gifts-in-your-emotions/'],
 emotionsGrid:['Karla McLaren · Emotional Gifts','https://karlamclaren.com/wp-content/uploads/2023/05/Daily-Emotions-Charts-for-Adults.pdf'],
 housing:['Statistik Austria · Wohnkosten 2025','https://www.statistik.at/statistiken/bevoelkerung-und-soziales/wohnen/wohnkosten'],
 assets:['Investor.gov · Asset Allocation','https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds'],
 budget:['CFPB · Budgeting','https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/analyzing-budgets/'],
};
const refs=(...keys)=>keys.map(k=>S[k]);

/** Vector editorial diagram: illustrative anatomy, NOT a medical scan. */
export function adiposeLayersSvg(){
 return `<svg class="av25-anatomy" viewBox="0 0 980 370" role="img" aria-label="Querschnitt des Bauchraums: subkutanes Fett direkt unter der Haut und viszerales Fett um innere Organe">
 <defs><radialGradient id="av25skin"><stop stop-color="#f9f5e9"/><stop offset="1" stop-color="#e6c8ad"/></radialGradient></defs>
 <ellipse cx="388" cy="173" rx="184" ry="144" fill="url(#av25skin)" stroke="#b07e68" stroke-width="4"/>
 <ellipse cx="388" cy="173" rx="162" ry="122" fill="#e9b951" stroke="#f3dc8d" stroke-width="3"/>
 <ellipse cx="388" cy="173" rx="117" ry="92" fill="#eeeee7" stroke="#ad8875" stroke-width="11"/>
 <path d="M351 133c-44-12-59 19-47 51s51 17 56-7c13-32 53-33 60-8 8 34 53 31 60 4 6-25-13-50-39-43-25-21-58-25-90 3Z" fill="#d2e1d0" stroke="#658878" stroke-width="4"/>
 <path d="M356 142c-28 12-17 48 8 44m31-40c36-15 40 19 17 33m20-10c25-12 40 15 18 28" fill="none" stroke="#739c89" stroke-width="10" stroke-linecap="round"/>
 <g fill="#e8a54b" stroke="#c78336" stroke-width="2"><ellipse cx="314" cy="207" rx="22" ry="13"/><ellipse cx="457" cy="210" rx="22" ry="14"/><ellipse cx="448" cy="115" rx="15" ry="12"/><ellipse cx="343" cy="112" rx="18" ry="13"/><ellipse cx="392" cy="223" rx="26" ry="13"/></g>
 <path d="M492 62 L595 48 L635 48" stroke="#bd8b41" stroke-width="3" fill="none"/>
 <path d="M451 207 L596 235 L635 235" stroke="#bd8b41" stroke-width="3" fill="none"/>
 <text x="648" y="48" font-family="Georgia" font-size="26" fill="#275342">Subkutanes Fett</text>
 <text x="648" y="73" font-family="Arial" font-size="16" fill="#5f7468">Direkt unter der Haut</text>
 <text x="648" y="235" font-family="Georgia" font-size="26" fill="#275342">Viszerales Fett</text>
 <text x="648" y="260" font-family="Arial" font-size="16" fill="#5f7468">Im Bauchraum um Organe</text>
 <text x="25" y="336" font-family="Arial" font-size="15" fill="#697d70">Schematischer anatomischer Querschnitt · keine individuelle Bildgebung</text>
 </svg>`;
}
export function bodyCompositionSvg(weight,fatPct,muscleKg){
 const ok=Number.isFinite(weight)&&weight>0&&Number.isFinite(fatPct)&&fatPct>=1&&fatPct<80;
 const fatKg=ok?weight*fatPct/100:null,leanKg=ok?weight-fatKg:null;
 const x=78,y=70,W=810,H=62;
 return `<svg viewBox="0 0 980 255" role="img" aria-label="Körperzusammensetzung: Fettmasse und fettfreie Masse aus dokumentiertem BIA-Körperfettanteil">
 <text x="78" y="35" font-size="22" font-family="Georgia" fill="#274e41">${ok?'Geschätzte Körperzusammensetzung':'Körperzusammensetzung – Messwerte aus Fitdays'}</text>
 <rect x="${x}" y="${y}" width="${W}" height="${H}" rx="7" fill="#e9eeea"/>
 ${ok?`<rect x="${x}" y="${y}" width="${(W*fatPct/100).toFixed(1)}" height="${H}" rx="7" fill="#ca9864"/><rect x="${(x+W*fatPct/100).toFixed(1)}" y="${y}" width="${(W*(1-fatPct/100)).toFixed(1)}" height="${H}" fill="#478b79"/>`:''}
 <rect x="80" y="165" width="17" height="17" rx="3" fill="#ca9864"/><text x="107" y="181" font-family="Arial" font-size="18" fill="#345b4e">Fettmasse ${fatKg!==null?`${de(fatKg)} kg · ${de(fatPct)} %`:'nicht bestimmt'}</text>
 <rect x="490" y="165" width="17" height="17" rx="3" fill="#478b79"/><text x="517" y="181" font-family="Arial" font-size="18" fill="#345b4e">Fettfreie Masse ${leanKg!==null?`${de(leanKg)} kg`:'nicht bestimmt'}</text>
 <text x="80" y="224" font-family="Arial" font-size="15" fill="#728477">${Number.isFinite(muscleKg)?`Separat gemeldete BIA-Muskelmasse: ${de(muscleKg)} kg – kein additiver Anteil zur fettfreien Masse`:'Die Muskelmasse ist ein Teil der fettfreien Masse.'}</text>
 </svg>`;
}

function workKnowledge(state,w){const r=arr(state.workTime?.days).filter(x=>day(x.day)>=w.start&&day(x.day)<=w.end),weeks=new Map();
 for(const x of r){const v=Number(x.hours);if(!Number.isFinite(v))continue;const key=day(x.day).slice(0,7);weeks.set(key,(weeks.get(key)||0)+v);}
 return page('II · WORK & RECOVERY','Leistung braucht Regeneration','Warum die Verteilung von Arbeitszeit und Erholungsmöglichkeiten für ein tragfähiges Berufsleben zählt.',
 story('Arbeit als Ressource und Belastung','Arbeit kann Sinn, Selbstwirksamkeit und soziale Verbindung schaffen. Hohe Anforderungen werden vor allem dann belastend, wenn Erholung, Planbarkeit oder Handlungsspielräume dauerhaft zu kurz kommen. Die WHO beschreibt Arbeitsintensität, Arbeitszeit und soziale Arbeitsbedingungen deshalb als zentrale Aspekte psychischer Gesundheit am Arbeitsplatz.')+
 story('Die Bedeutung langer Arbeitswochen','In einer WHO/ILO-Auswertung war eine Arbeitszeit von mindestens 55 Stunden pro Woche gegenüber 35–40 Stunden mit 35 % höherem relativem Schlaganfallrisiko und 17 % höherem Risiko verbunden, an ischämischer Herzkrankheit zu sterben. Diese Werte beschreiben Bevölkerungsgruppen über lange Zeiträume – keine persönliche Prognose.')+
 thoughts('Welche Wochen haben dich besonders beansprucht?','Vergleiche im folgenden Jahresverlauf Belastungsspitzen mit Schlafdauer, HRV, Bewegung und bewusst eingeplanten Erholungsphasen.'),refs('work'));
}
function sleepKnowledge(state,w){const nights=arr(state.healthImports?.garminNights).filter(x=>x.day>=w.start&&x.day<=w.end);const vals=nights.map(x=>Number(x.sleepMinutes)).filter(x=>x>0&&x<1440);const m=mean(vals),sd=m!==null?Math.sqrt(mean(vals.map(x=>(x-m)**2))):null;
 return page('III · SLEEP','Die Architektur erholsamer Nächte','Schlafdauer, Regelmäßigkeit und die Bedingungen für regenerative Nächte.',
 story('Warum wir schlafen','Schlaf unterstützt Gedächtnisverarbeitung, emotionale Regulation und zahlreiche Regenerationsprozesse. Die häufig genannte Orientierung für Erwachsene liegt bei sieben bis neun Stunden; innerhalb dieser Spanne unterscheiden sich die individuellen Bedürfnisse. Auch Regelmäßigkeit und Schlafqualität sind wichtig.')+
 story('Was den Schlaf unterstützt','Eine ruhige, dunkle und eher kühle Schlafumgebung erleichtert den Übergang in die Nacht. Gleichmäßige Schlafenszeiten, Tageslicht am Morgen, körperliche Aktivität und ein beruhigendes Abendritual können die innere Uhr stabilisieren. Auch der zeitliche Abstand zu Koffein und späten schweren Mahlzeiten kann relevant sein.')+
 stats(['Dokumentierte Nächte',String(vals.length),'Im gewählten Zeitraum'],['Mittelwert',m===null?'—':`${de(m/60,2)} h`,'Tatsächlich erfasste Schlafdauer'],['Streuung',sd===null?'—':`± ${de(sd/60,2)} h`,'Standardabweichung der Nächte'])+
 thoughts('Der persönliche Rhythmus','Die nächste Grafik zeigt jede dokumentierte Nacht in Stunden und mit Null als festem Achsenursprung. Achte besonders auf Phasen mit anhaltend kurzen Nächten und Unterschiede zwischen Arbeits- und freien Tagen.'),refs('sleep'));
}
function hrvKnowledge(){return page('III · AUTONOMIC RECOVERY','Die Sprache des Nervensystems','Wie HRV, Stress und Body Battery ein gemeinsames Bild von Belastung und Erholung ergeben.',
 story('HRV: Unterschiede zwischen Herzschlägen','Herzfrequenzvariabilität (HRV) beschreibt die zeitlichen Abstände aufeinanderfolgender Herzschläge und deren Schwankungen. Sie reagiert auf die Regulation des autonomen Nervensystems sowie auf Schlaf, körperliche Belastung, Krankheit und andere Einflüsse. Interessant ist vor allem der Verlauf relativ zum eigenen üblichen Bereich.')+
 story('Warum Garmins Basislinie wichtig ist','Garmin stellt den gleitenden Sieben-Tage-Mittelwert der nächtlichen HRV einer persönlichen Basislinie gegenüber. Ein einzelner höherer Wert ist deshalb nicht automatisch besser. Über mehrere Wochen erkennbare Veränderungen können ein Anlass sein, die parallelen Schlaf- und Belastungsdaten zu betrachten.')+
 story('Body Battery als Tagesverlauf','Die Body Battery ist ein modellierter Garmin-Index von 0 bis 100. Besonders aussagekräftig ist die Veränderung im Tagesverlauf: Wie hoch liegt der Wert morgens, wie stark sinkt er bis zum Abend, und wie viel Erholung zeigt die folgende Nacht?')+
 thoughts('Von drei Kurven zu einer Geschichte','Im Report sollten Schlafdauer, HRV und Arbeitswochen mit gleicher Zeitachse gegenübergestellt werden. Die folgenden Grafiken bieten die einzelnen Bausteine dafür.'),refs('hrv'));
}
function bodyKnowledge(state,w){const fits=arr(state.healthImports?.fitdays).filter(x=>day(x.day||x.at)>=w.start&&day(x.day||x.at)<=w.end).sort((a,b)=>day(a.day||a.at).localeCompare(day(b.day||b.at))),last=fits.at(-1),b=last||{};
 return [page('IV · BODY COMPOSITION','Fettgewebe verstehen','Warum Menge und Verteilung des Körperfetts unterschiedliche Informationen über den Stoffwechsel liefern.',
 story('Zwei verschiedene Fettdepots','Subkutanes Fett liegt direkt unter der Haut und erfüllt unter anderem Speicher- und Schutzfunktionen. Viszerales Fett befindet sich im Bauchraum und umgibt innere Organe. Eine stärkere zentrale Fettansammlung ist in Bevölkerungsstudien mit Stoffwechsel- und Herz-Kreislauf-Risiken verbunden.')+
 `<div class="av25-illustration">${adiposeLayersSvg()}</div>`+
 story('Bauchumfang und Körpergröße','Für Erwachsene nennt NICE das Taille-zu-Körpergröße-Verhältnis als ergänzende Orientierung: Unter 0,5 ist grundsätzlich günstiger; Werte von 0,5 bis 0,59 weisen auf erhöhte zentrale Fettverteilung hin, Werte ab 0,6 auf deutlich erhöhte. Ein Fitdays-Viszeralfettindex ist nicht mit einer medizinischen Bildmessung gleichzusetzen.')+
 thoughts('Welche Veränderung interessiert?','Das Ziel ist nicht nur ein bestimmtes Gewicht, sondern eine nachvollziehbare Entwicklung von Fettanteil, zentraler Fettverteilung, Muskelmasse und körperlicher Leistungsfähigkeit.'),refs('visceral')),
 page('IV · BODY COMPOSITION','Aus welchen Anteilen besteht mein Körper?','Der Fitdays-Verlauf verbindet Gewicht, BIA-Körperfettanteil und geschätzte Muskelmasse.',
 story('Die Zusammensetzung des Körpers','Körpergewicht umfasst Fettmasse und fettfreie Masse. Zur fettfreien Masse gehören Muskeln, Wasser, Knochen und Organe. Die BIA-Methode schätzt Körperkomponenten über bioelektrische Eigenschaften; standardisierte Messbedingungen erhöhen die Vergleichbarkeit über die Zeit.')+
 `<div class="av25-illustration">${bodyCompositionSvg(Number(b.weightKg),Number(b.bodyFatPct),Number(b.muscleMassKg??b.muscleKg))}</div>`+
 stats(['Fitdays-Messungen',String(fits.length),'Im gewählten Zeitraum'],['Körperfett',Number.isFinite(b.bodyFatPct)?`${de(b.bodyFatPct)} %`:'—','Letzter dokumentierter BIA-Wert'],['Gewicht',Number.isFinite(b.weightKg)?`${de(b.weightKg)} kg`:'—','Letzter Messzeitpunkt'])+
 thoughts('Welche Richtung zeigen die Trends?','Aussagekräftiger als einzelne Schwankungen ist, ob über mehrere Wochen eine konsistente Entwicklung sichtbar wird. Die nachfolgenden Original-Dot-Plots zeigen diese Veränderung im Zeitverlauf.'),refs('visceral'))];
}
function trainingKnowledge(){return page('IV · STRENGTH SCIENCE','Wie Muskelwachstum entsteht','Die Trainingswissenschaft unterscheidet Kraft, Muskelaufbau, Leistungsfähigkeit und Regeneration.',
 story('Progressive Belastung','Muskuläre Anpassungen entstehen, wenn Training wiederholt einen ausreichenden Reiz setzt und der Körper anschließend Gelegenheit zur Anpassung erhält. Fortschritt kann sich durch höhere Gewichte, mehr technisch saubere Wiederholungen, mehr wirksame Sätze oder bessere Bewegungskontrolle zeigen.')+
 story('Was die ACSM-Leitlinie 2026 zeigt','Die aktuelle Auswertung des American College of Sports Medicine betont regelmäßiges, zielgerichtetes Krafttraining. Höhere Lasten ab etwa 80 % des 1RM fördern maximale Kraft; für Muskelwachstum ist ein größeres wöchentliches Volumen wichtig, mit etwa zehn Sätzen je Muskelgruppe als nützlicher Forschungsorientierung – nicht als starre Pflichtzahl.')+
 story('Die Muskelkarte als Trainingskompass','Die anatomische Compass-Muskelkarte markiert deine tatsächlich zugeordneten Haupt- und Nebenbeteiligungen. Daraus lassen sich beanspruchte und weniger trainierte Muskelgruppen sowie Pausen zwischen Trainingstagen erkennen. Der nächste Trainingsimpuls sollte zusätzlich die zuletzt verwendeten Gewichte und Wiederholungen berücksichtigen.')+
 thoughts('Training mit System','Für einen V-Taper-Aufbau sind beispielsweise Rücken und seitliche Schultern besonders interessant. Entscheidend sind jedoch Fortschritte über mehrere Trainingseinheiten, nicht die Farbe eines einzelnen Tages.'),refs('training'));
}
function fastingKnowledge(){return page('V · NUTRITION','Der Rhythmus deiner Ernährung','Was Chrononutrition und Intervallfasten über Essensfenster, Nachtpausen und innere Uhr erzählen.',
 story('Die biologische Uhr isst mit','Der Stoffwechsel folgt einem zirkadianen Rhythmus. Insulinempfindlichkeit und die Verarbeitung von Nährstoffen können je nach Tageszeit unterschiedlich ausfallen. Deshalb untersuchen Forschende neben der Kalorienmenge auch die zeitliche Verteilung der Mahlzeiten.')+
 story('Früher essen statt bloß länger fasten','NutritionFacts.org stellt Studien zu zeitlich begrenzter Nahrungsaufnahme vor. Eine Meta-Analyse von 41 randomisierten Studien fand beim frühen gegenüber dem späten Essensfenster günstigere Ergebnisse für einige Stoffwechselparameter. Die optimale Dauer eines Essensfensters ist weniger eindeutig als dessen zeitliche Lage.')+
 grid([chip('Essensfenster','Zeit zwischen erster und letzter dokumentierter Kalorienaufnahme.'),chip('Nachtpause','Zeit zwischen der letzten kalorienhaltigen Aufnahme am Vortag und der ersten am nächsten Tag.'),chip('Morgen und Abend','Die Verteilung der Mahlzeiten ist mindestens ebenso interessant wie die reine Fastendauer.'),chip('Regelmäßigkeit','Die Frage lautet auch: Wie stark schwanken deine Essenszeiten zwischen den Wochentagen?')])+
 thoughts('Dein Essensrhythmus','Die folgenden Grafiken zeigen die protokollierten Essenszeiten, Tagesenergie und Nachtpausen – sowie die Mahlzeiten, die du bevorzugt morgens, mittags und abends erfasst hast.'),refs('fasting','fastingReview'));
}
function dailyKnowledge(){return page('V · NUTRITION','The Daily Dozen','Zwölf pflanzenbetonte Lebensmittel- und Lebensstilgruppen als tägliche Orientierung.',
 story('Warum Vielfalt so wichtig ist','Dr. Michael Greger hat seine Daily Dozen aus der Beobachtung entwickelt, dass pflanzliche Lebensmittel nicht beliebig austauschbar sind: Beeren liefern andere Pflanzenstoffe als Hülsenfrüchte, Kreuzblütler oder Vollkorn. Der tägliche Überblick fördert Lebensmittelvielfalt statt der Fixierung auf einzelne Nährstoffzahlen.')+
 grid([chip('Beeren','Anthocyane und weitere Polyphenole.'),chip('Blattgemüse','Folat, Carotinoide und Vitamin K.'),chip('Kreuzblütler','Glucosinolate, aus denen Isothiocyanate entstehen können.'),chip('Hülsenfrüchte','Eiweiß, Ballaststoffe und Substrate für Darmmikroorganismen.'),chip('Leinsamen, Nüsse und Samen','ALA-Omega-3, Lignane und überwiegend ungesättigte Fette.'),chip('Vollkorn, Obst und Gemüse','Ballaststoffvielfalt, Mineralstoffe und pflanzliche Mikronährstoffe.')])+
 thoughts('Deine Lebensmittelvielfalt','In der nächsten Grafik werden alle zwölf Daily-Dozen-Kategorien gegen die dokumentierten Portionen gestellt. Interessant ist, welche Gruppen besonders regelmäßig vorkommen und welche du stärker berücksichtigen möchtest.'),refs('daily'));
}
function macroKnowledge(){return page('V · NUTRITION','Makronährstoffe richtig verstehen','Eiweiß, Fett und Kohlenhydrate liefern mehr als nur Energie; Ballaststoffe wirken besonders über den Darm.',
 grid([chip('Eiweiß','Baustoff für Muskelgewebe, Enzyme und zahlreiche körpereigene Proteine. Die EFSA nennt für Erwachsene 0,83 g/kg Körpergewicht als Referenz; Trainingsziele können andere Mengen nahelegen.'),chip('Kohlenhydrate','Energiequelle, deren ernährungsphysiologischer Wert stark von der Lebensmittelmatrix abhängt: Vollkorn und Hülsenfrüchte unterscheiden sich von zuckerreichen Getränken.'),chip('Ballaststoffe','Unterstützen Verdauung und Darmmikrobiom. Die EFSA nennt 25 g pro Tag für Erwachsene als angemessene Orientierung.'),chip('Fett','Liefert Energie und trägt fettlösliche Vitamine. Art der Fettsäuren und Lebensmittelquellen sind aussagekräftiger als die Summe allein.')])+
 story('Warum wir Lebensmittel nicht auf Kalorien reduzieren','Ein Teller Hülsenfrüchte kann zugleich pflanzliches Eiweiß, resistente Stärke, Mineralstoffe und Ballaststoffe liefern. Die Qualität des Gesamtmusters ist deshalb aussagekräftiger als eine einzelne Grammzahl. Die nachfolgenden vier Zeitreihen verdeutlichen, wie sich deine dokumentierten Makronährstoffe im Alltag verteilen.')+
 thoughts('Dein persönliches Muster','Vergleiche zunächst die tatsächlich erfassten Tage. Besonders spannend sind Protein- und Ballaststoffquellen sowie der Zusammenhang zwischen Fettmenge und Fettqualität.'),refs('nutrients'));
}
function antiKnowledge(){return page('V · LONGEVITY','Healthy Aging – eine biologische Perspektive','Warum Ernährung, Bewegung und Alltagsgewohnheiten für gesunde Lebensjahre relevant sein können.',
 story('Nicht nur länger, sondern länger gesund leben','In How Not to Age verbindet Michael Greger Erkenntnisse über altersbezogene biologische Mechanismen mit beobachteten Ernährungs- und Lebensstilmustern. Ein Schwerpunkt liegt auf pflanzenbetonten, ballaststoffreichen Lebensmitteln und regelmäßiger Bewegung. Nicht jeder molekulare Mechanismus ist bereits als konkrete, klinisch geprüfte Ernährungsstrategie etabliert.')+
 story('Die Anti-Aging Eight','Das Modell ergänzt die Daily Dozen um Themen wie Nüsse, Blattgemüse, Beeren, mikrobielles Stoffwechselgeschehen, Energie- und Proteinzufuhr sowie weitere molekularbiologische Forschungsfelder. Im Report werden diese acht Bereiche als Wissens- und Beobachtungsperspektiven erläutert – nicht als acht miteinander vergleichbare Gesundheitspunkte.')+
 thoughts('Deine Langzeitperspektive','Die folgenden acht Themen fassen die erfassten Signale zusammen. Besonders wertvoll wird der Vergleich, wenn über mehrere Jahre ausreichend konsistente Ernährungseinträge vorliegen.'),refs('daily','nutrients'));
}
function emotionalKnowledge(){return page('VIII · INNER LANDSCAPE','Die Sprache der Gefühle','Emotionen können Hinweise auf Werte, Beziehungen, Grenzen und Bedürfnisse geben.',
 story('Jedes Gefühl trägt eine mögliche Information','Karla McLaren betrachtet Emotionen als Ressourcen für Wahrnehmung und Handeln. Wut kann auf Grenzen und Werte hinweisen, Angst auf Veränderungen, Traurigkeit auf das Bedürfnis loszulassen und Freude auf Verbundenheit und Lebendigkeit. Diese Perspektive lädt dazu ein, die jeweilige Situation zu erkunden, statt Gefühle in gut und schlecht aufzuteilen.')+
 grid([chip('Wut','Welche Grenze ist wichtig? Was möchte geschützt werden?'),chip('Angst','Welche Veränderung braucht Aufmerksamkeit und Vorbereitung?'),chip('Traurigkeit','Was darf ich loslassen, damit Raum entsteht?'),chip('Trauer','Welchen Verlust möchte ich würdigen?'),chip('Freude','Was gibt Energie, Inspiration und Verbundenheit?'),chip('Zufriedenheit','Was ist gelungen und verdient Anerkennung?')])+
 thoughts('Was deine Einträge erzählen könnten','Der Gefühlsatlas zeigt die dokumentierten Emotionen und Intensitäten. Besonders interessant wären wiederkehrende Kontexte: nach welchen Begegnungen, Tätigkeiten oder Belastungsphasen tauchen bestimmte Wörter auf?'),refs('emotions','emotionsGrid'));
}
function moneyKnowledge(){return page('VI · FINANCIAL LIFE','Vom Einkommen zum Vermögensaufbau','Die finanzielle Perspektive von Robert Kiyosaki trifft auf messbaren Cashflow, Risikostreuung und persönliche Prioritäten.',
 story('Die Idee hinter Rich Dad Poor Dad','Robert Kiyosaki unterscheidet zwischen Geld, das durch eigene Arbeit verdient wird, und Vermögenswerten, die Erträge oder Wertzuwachs ermöglichen. Seine zentrale Frage ist, welcher Anteil des Einkommens langfristig Vermögen aufbaut. Als Denkmodell ist das anregend; für eine Bewertung braucht es zusätzlich Liquidität, Schulden, Kosten und das jeweilige Anlage- und Verlustrisiko.')+
 story('Was ein Budget sichtbar macht','Eine gebräuchliche Orientierung ist die 50/30/20-Faustregel für notwendige Kosten, Wünsche und finanzielle Ziele. In Österreich lag der durchschnittliche Wohnkostenanteil am Haushaltseinkommen 2025 laut Statistik Austria bei etwa 20 %. Das sind Vergleichsgrößen, keine individuell optimale Vorgabe.')+
 story('Konsum und Investition trennen','Ein Wertpapierkauf oder eine Überweisung zur Kryptobörse ist zunächst eine Vermögensumschichtung und keine Lebenshaltungsausgabe. Eine verlässliche Jahresbilanz zeigt deshalb Einnahmen, Konsumausgaben, Investitionszuflüsse, Portfolioentwicklung und verbleibende Liquidität getrennt.')+
 thoughts('Dein Finanzjahr im Überblick','Die folgenden Grafiken zeigen zunächst Ein- und Ausgaben nebeneinander, danach die hierarchische Ausgabenstruktur. Portfolio und Kryptowährungen bekommen eigene Seiten mit ausgewiesenen Bewertungsstichtagen.'),refs('housing','budget','assets'));
}
function monthlyFlow(state,w){const map=new Map();for(const t of arr(state.financeTransactions)){
 if(t?.deleted||t?.needsReview||day(t.day)<w.start||day(t.day)>w.end||!Number.isFinite(t.amountCents))continue;
 if(!['expense','income'].includes(t.flow))continue;const key=t.day.slice(0,7),r=map.get(key)||{month:key,income:0,expense:0};r[t.flow]+=Math.abs(t.amountCents)/100;map.set(key,r);
 }return [...map.values()].sort((a,b)=>a.month.localeCompare(b.month));}
export function incomeExpenseSvg(months){if(!months.length)return '';
 const W=1000,H=350,L=75,R=25,B=66,T=36,M=months.length,max=Math.max(1,...months.flatMap(x=>[x.income,x.expense])),step=(W-L-R)/M,bar=Math.max(3,Math.min(18,step*.3));
 const bars=months.map((v,i)=>{const x=L+i*step+step/2,h1=v.income/max*(H-T-B),h2=v.expense/max*(H-T-B);return `<rect x="${(x-bar-2).toFixed(2)}" y="${(H-B-h1).toFixed(2)}" width="${bar}" height="${h1.toFixed(2)}" fill="#468a79"/><rect x="${(x+2).toFixed(2)}" y="${(H-B-h2).toFixed(2)}" width="${bar}" height="${h2.toFixed(2)}" fill="#c99570"/><text x="${x.toFixed(2)}" y="${H-23}" text-anchor="middle" font-size="15" fill="#466558">${h(v.month.slice(2))}</text>`;}).join('');
 return `<svg viewBox="0 0 ${W} ${H}" aria-label="Monatliche dokumentierte Einnahmen und Konsumausgaben in Euro" role="img"><line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="#9bad9f"/>${[0,.25,.5,.75,1].map(p=>`<g><line x1="${L}" x2="${W-R}" y1="${H-B-p*(H-T-B)}" y2="${H-B-p*(H-T-B)}" stroke="#e9efea"/><text x="${L-9}" y="${H-B-p*(H-T-B)+4}" text-anchor="end" font-size="15" fill="#627d70">${h(de(max*p,0))}</text></g>`).join('')}${bars}<rect x="530" y="12" width="14" height="14" fill="#468a79"/><text x="552" y="25" font-size="17" fill="#48675b">Einnahmen</text><rect x="715" y="12" width="14" height="14" fill="#c99570"/><text x="737" y="25" font-size="17" fill="#48675b">Konsum</text></svg>`;
}
function moneyYear(state,w){const months=monthlyFlow(state,w);if(!months.length)return [];
 const income=months.reduce((a,r)=>a+r.income,0),expense=months.reduce((a,r)=>a+r.expense,0);
 return [page('VI · FINANCIAL LIFE','Einnahmen und Ausgaben im Vergleich','Monatliche Kontobewegungen nach bestätigter Klassifikation.',
 stats(['Dokumentierte Einnahmen',`${de(income,0)} €`,'Bestätigte Eingänge'],['Konsumausgaben',`${de(expense,0)} €`,'Ohne Umbuchungen'],['Differenz',`${de(income-expense,0)} €`,'Keine Vermögensrendite'])+`<div class="av25-flow">${incomeExpenseSvg(months)}</div>`+
 thoughts('Was bleibt nach dem Konsum?','Der monatliche Abstand zwischen Einnahmen und Ausgaben zeigt den dokumentierten laufenden Spielraum. Wertpapierkäufe, Transfers und Kursgewinne müssen getrennt betrachtet werden.'),refs('budget'))];
}
/** Readable SVG treemap; only actual priced portfolio positions occupy area. */
export function portfolioTreemapSvg(raw,title='Positionen'){
 const vals=arr(raw).map(p=>({label:String(p.label??''),value:Number(p.value)})).filter(p=>p.value>0&&Number.isFinite(p.value)).sort((a,b)=>b.value-a.value);
 if(!vals.length)return '';
 const top=vals.slice(0,8),rest=vals.slice(8).reduce((s,p)=>s+p.value,0);
 if(rest>0)top.push({label:'Weitere Positionen',value:rest});
 const total=top.reduce((s,p)=>s+p.value,0),tiles=[];
 const split=(items,x,y,w,h)=>{
  if(items.length===1){tiles.push({...items[0],x,y,w,h});return;}
  const sum=items.reduce((s,p)=>s+p.value,0);let best=1,diff=Infinity,left=0;
  for(let i=1;i<items.length;i++){left+=items[i-1].value;const d=Math.abs(left/sum-.5);if(d<diff){diff=d;best=i;}}
  const a=items.slice(0,best),b=items.slice(best),v=a.reduce((s,p)=>s+p.value,0)/sum;
  if(w>=h){split(a,x,y,w*v,h);split(b,x+w*v,y,w*(1-v),h);}
  else{split(a,x,y,w,h*v);split(b,x,y+h*v,w,h*(1-v));}
 };
 split(top,0,0,980,282);
 const colors=['#246b5c','#3b8d7b','#678eae','#bd9970','#739b84','#8b81ad','#c18780','#669a9f','#9c9e91'];
 const blocks=tiles.map((p,i)=>{const x=p.x+2,y=p.y+2,w=Math.max(0,p.w-4),ht=Math.max(0,p.h-4),canLabel=w>145&&ht>54,canValue=w>110&&ht>80;
  return `<g><rect x="${de(x,3).replace(',','.')}" y="${de(y,3).replace(',','.')}" width="${de(w,3).replace(',','.')}" height="${de(ht,3).replace(',','.')}" fill="${colors[i%colors.length]}" rx="5"/><title>${h(p.label)} · ${de(p.value,0)} €</title>${canLabel?`<text x="${(x+12).toFixed(2)}" y="${(y+26).toFixed(2)}" fill="#fff" font-family="Arial" font-size="${w<240?16:19}" font-weight="600">${h(p.label.length>26?p.label.slice(0,24)+'…':p.label)}</text>`:''}${canValue?`<text x="${(x+12).toFixed(2)}" y="${(y+49).toFixed(2)}" fill="#fff" font-family="Arial" font-size="16">${de(p.value,0)} € · ${de(100*p.value/total)} %</text>`:''}</g>`;}).join('');
 return `<div class="av25-portfolio-figure"><h3>${h(title)}</h3><svg viewBox="0 0 980 282" role="img" aria-label="Gewichtete Portfolio-Treemap: Fläche je Position entspricht ihrem EUR-Marktwert">${blocks}</svg><div class="av25-portfolio-key">${top.map((p,i)=>`<span><i style="background:${colors[i%colors.length]}"></i>${h(p.label)} · ${de(100*p.value/total)} %</span>`).join('')}</div></div>`;
}
const wealthBar=parts=>{const total=parts.reduce((s,p)=>s+p.value,0);return total>0?`<div class="av25-allocation" role="img" aria-label="Gewichtungen der tatsächlich bewerteten Vermögensteile">${parts.map((p,i)=>`<span style="width:${(100*p.value/total).toFixed(3)}%;background:${['#428d7b','#c3a26f','#708da6','#af80a0'][i%4]}"></span>`).join('')}</div><div class="av25-allocation-key">${parts.map((p,i)=>`<span><i style="background:${['#428d7b','#c3a26f','#708da6','#af80a0'][i%4]}"></i>${h(p.label)} · ${de(p.value/100,0)} €</span>`).join('')}</div>`:''};
export function wealthEditorial(state,w,settings){if(!settings.finance)return [];
 const snapshots=arr(state.financeFlatexSnapshots).filter(s=>s.day<=w.end),filtered={...state,financeWealthSnapshots:arr(state.financeWealthSnapshots).filter(s=>s.day<=w.end),financeFlatexSnapshots:snapshots};
 const crypto=state.krakenPortfolio?.generatedAt?.slice(0,10)<=w.end?state.krakenPortfolio:null;
 filtered.krakenPortfolio=crypto;
 const wealth=wealthSummary(filtered),snap=latestFlatexSnapshot(snapshots),flatex=snap?flatexSnapshotStats(snap):null;
 const parts=[];for(const x of wealth.observed.filter(x=>x.type==='bank'))parts.push({label:x.label,value:x.cents});
 const flatexAggregate=wealth.observed.filter(x=>x.type==='flatex').reduce((n,x)=>n+x.cents,0);const flatexCents=flatexAggregate||wealth.flatexHoldingsIncludedCents;
 if(flatexCents)parts.push({label:'Flatex',value:flatexCents});
 if(wealth.krakenPricedCents)parts.push({label:'Kraken · bewertet',value:wealth.krakenPricedCents});
 if(!parts.length&&!flatex&&!crypto)return [];
 const pages=[page('VI · WEALTH ATLAS','Mein Vermögen im Überblick','Bankguthaben, Wertpapierdepot und digitale Vermögenswerte als getrennte Bestandskategorien.',
 story('Von der Geldbewegung zum Bestand','Vermögensaufbau lässt sich erst verstehen, wenn regelmäßige Einzahlungen von Kursentwicklung unterschieden werden. Ein Depot kann im Wert wachsen, obwohl die Rendite negativ ist, wenn neue Einzahlungen die Verluste übersteigen. Der Bestandsvergleich ist daher nur der erste Schritt.')+
 stats(['Bewertete Bestände',`${de((wealth.positiveCents+wealth.krakenPricedCents)/100,0)} €`,'Erfasste positive Werte'],['Dokumentierte Schulden',`${de(wealth.liabilitiesCents/100,0)} €`,'Erfasste Verbindlichkeiten'],['Vermögenssaldo',`${de(wealth.totalObservedCents/100,0)} €`,'Aus verfügbaren Quellen'])+wealthBar(parts)+
 thoughts('Wie ist dein Kapital verteilt?','Die Gewichtungen zeigen, wie viel des bewerteten Vermögens in Liquidität, Wertpapieren und Kryptowährungen liegt. Ein hoher Anteil einer Anlageklasse beeinflusst die Schwankung des Gesamtvermögens.'),refs('assets'))];
 if(flatex)pages.push(page('VI · PORTFOLIO','Mein Flatex-Depot','Wertpapiere, ETFs und Fonds – Positionen, Marktwerte und Einstandswerte am dokumentierten Stichtag.',
 stats(['Depotwert inkl. Cash',`${de(flatex.overallCents/100,0)} €`,`${flatex.day}`],['Positionen',String(flatex.positions.length),'Ohne Cash'],['Differenz zum Einstand',`${de(flatex.gainCents/100,0)} €`,'Marktwert minus Einstand'])+
 portfolioTreemapSvg(flatex.positions.map(p=>({label:p.name,value:p.marketCents/100})),'Positionen nach Marktwert')+
 `<table class="av19-table av25-portfolio"><thead><tr><th>Wertpapier</th><th>Art</th><th>Marktwert</th><th>Anteil</th></tr></thead><tbody>${flatex.positions.slice().sort((a,b)=>b.marketCents-a.marketCents).slice(0,11).map(p=>`<tr><td>${h(p.name)}</td><td>${h(p.kind)}</td><td>${de(p.marketCents/100,0)} €</td><td>${de(100*p.marketCents/Math.max(1,flatex.sharesCents))} %</td></tr>`).join('')}</tbody></table>`+
 thoughts('Was prägt die Depotentwicklung?','Die größte Position kann den Gesamtverlauf besonders stark beeinflussen. Der Vergleich mit Einstandswerten zeigt bisherige Bewertungsgewinne und -verluste, aber noch keine zeitgewichtete Rendite.'),refs('assets')));
 if(crypto){const v=krakenWealthSummary(crypto),priced=v.positions.filter(p=>p.value!==null);
 pages.push(page('VI · DIGITAL WEALTH','Mein Kryptoportfolio','Die aktuelle Kraken-Spot-Verteilung und die dokumentierten EUR-Preise, getrennt vom Konsum.',
 stats(['Bewertete Coins',`${priced.length}/${v.total}`,'EUR-Kurs verfügbar'],['Wert dieser Positionen',`${de(v.totalEur,0)} €`,'Mit vorhandenen Preisen'],['Stand',v.pricedAt?new Date(v.pricedAt).toLocaleDateString('de-AT'):'—','Letzter dokumentierter Kursstand'])+
 portfolioTreemapSvg(priced.map(p=>({label:p.asset,value:p.value})),'Krypto-Allokation nach EUR-Wert')+
 `<table class="av19-table av25-portfolio"><thead><tr><th>Asset</th><th>Bestand</th><th>EUR-Wert</th><th>Gewicht</th></tr></thead><tbody>${v.positions.slice(0,12).map(p=>`<tr><td>${h(p.asset)}</td><td>${de(p.amount,6)}</td><td>${p.value===null?'Ohne Kurs':`${de(p.value,2)} €`}</td><td>${p.value===null?'—':`${de(100*p.value/Math.max(0.0001,v.totalEur))} %`}</td></tr>`).join('')}</tbody></table>`+
 thoughts('Digitale Vermögenswerte im Gesamtbild','Für die Anlagestruktur interessiert, wie sich die Gewichte über mehrere Bewertungsstichtage verändern. Einzelne Coin-Kurse sind keine stabile Jahresrendite; Einzahlungen und Trades müssen separat verrechnet werden.'),refs('assets')));
 }
 return pages;
}

export function editorialAnnualPages(pages,state,w,settings={}){
 const output=[...pages];
 // No more blank interludes. Headings of content pages retain the chapter number.
 for(let i=output.length-1;i>=0;i--)if(output[i].includes('av19-page av19-chapter')){
   const chapter=output[i];const heading=/<h1>([\s\S]*?)<\/h1>/.exec(chapter)?.[1]||'';
   const next=output[i+1];if(next&&heading){output[i+1]=next.replace('<div class="av19-kicker">',`<div class="av25-section-marker">${heading}</div><div class="av19-kicker">`);}
   output.splice(i,1);
  }
 output[0]=output[0].replace('COMPASS LIFE / PRIVATE ARCHIVE','PRIVATE ARCHIVE').replace('THE PERSONAL CHRONICLE','PERSONAL CHRONICLE').replace('<p>A Life Examined. A Life Beautifully Lived.</p>','');
 for(let i=0;i<output.length;i++){
  output[i]=output[i]
  .replace(/<aside class="av19-comment"><strong>Redaktioneller Grundsatz<\/strong>[\s\S]*?<\/aside>/g,'')
  .replace(/<aside class="av19-comment"><strong>Was die Grafik aussagt<\/strong>[\s\S]*?<\/aside>/g,'')
  .replace(/<aside class="av19-comment"><strong>Die Grenze jeder Erkenntnis<\/strong>[\s\S]*?<\/aside>/g,'')
  .replace('Die dokumentierten Nächte','Dein Schlaf im Jahresverlauf')
  .replace('Vor klinischer Interpretation Import prüfen','Mittel aus erfassten Nächten');
 }
 // Print the 30-day axis explanation that is interactive-only in Compass.
 const radarIndex=output.findIndex(x=>x.includes('Die großen Lebensbereiche'));
 if(radarIndex>=0){
  const radarState={...state,financeTransactions:settings.finance?state.financeTransactions:[],people:settings.people?state.people:{}};
  const model=buildLifeBalanceRadar(radarState,{today:w.end,period:30});
  const axes=arr(model.axes).filter(a=>a.key!=='finance'||settings.finance).filter(a=>a.key!=='people'||settings.people);
  const expl=`<div class="av25-axis-explainer"><h3>Die acht Lebensbereiche verstehen</h3><div class="av25-axis-grid">${axes.map(a=>`<article><strong>${h(a.label)} · ${a.score===null?'Ohne Wert':a.score+'/100'}</strong><p>${h(a.detail)}</p></article>`).join('')}</div><p class="av25-axis-note">Der Radar verwendet die letzten 30 Tage des Berichtszeitraums. Der Wert beschreibt den jeweils verwendeten Compass-Indikator, nicht eine allgemeine Lebensqualitätsnote.</p></div>`;
  output[radarIndex]=output[radarIndex].replace('</section>',expl+'</section>');
 }
 const at=needle=>output.findIndex(x=>x.includes(needle));
 const before=(needle,items)=>{const ix=at(needle);if(ix>=0)output.splice(ix,0,...(Array.isArray(items)?items:[items]));};
 const move=(needle,dest)=>{const ix=at(needle);if(ix<0)return;const p=output.splice(ix,1)[0];before(dest,p);};
 if(at('Arbeitsbelastung')>=0)before('Arbeitsbelastung',workKnowledge(state,w));
 if(at('Dein Schlaf im Jahresverlauf')>=0)before('Dein Schlaf im Jahresverlauf',sleepKnowledge(state,w));
 if(at('HRV &amp; Belastung')>=0||at('HRV & Belastung')>=0)before(at('HRV &amp; Belastung')>=0?'HRV &amp; Belastung':'HRV & Belastung',hrvKnowledge());
 if(at('Körperzusammensetzung')>=0)before('Körperzusammensetzung',bodyKnowledge(state,w));
 if(at('Training &amp; Muskelbalance')>=0||at('Training & Muskelbalance')>=0)before(at('Training &amp; Muskelbalance')>=0?'Training &amp; Muskelbalance':'Training & Muskelbalance',trainingKnowledge());
 if(at('Energie und Essensrhythmus')>=0)before('Energie und Essensrhythmus',fastingKnowledge());
 if(at('Daily Dozen über die Zeit')>=0)before('Daily Dozen über die Zeit',dailyKnowledge());
 if(at('Makronährstoffe')>=0)before('Makronährstoffe',macroKnowledge());
 // Replace the seven-item teaser with the full catalog of 27 vitamin/mineral entries and supplement compounds.
 const nutrientSheets=micronutrientAnnualPages(state,w);
 if(nutrientSheets.length){const duplicate=at('Vitamine, Mineralstoffe &amp; pflanzliche Ernährung');if(duplicate>=0)output.splice(duplicate,1);before('Nährstoffatlas &amp; botanische Wirkstoffe',nutrientSheets);}
 // Move pre-existing .40.24 nutritional knowledge adjacent to its actual charts.
 move('Fett ist nicht gleich Fett','Fettqualität &amp; Fettsäuren');
 move('<h2>Omega-3, Omega-6 und die richtigen Quellen</h2>','Fettqualität &amp; Fettsäuren');
 move('Vitamine &amp; Mineralstoffe','Nährstoffatlas');
 move('Antioxidantien, Matcha','Pflanzenstoffe &amp; Antioxidantien');
 if(at('Anti-Aging Eight')>=0)before('Anti-Aging Eight',antiKnowledge());
 const f=at('Ausgaben im Jahresverlauf');
 if(f>=0){output.splice(f,0,moneyKnowledge(),...moneyYear(state,w),...annualFinancePatternPages(state,w,settings));}
 // Wealth is a private domain even if holding files are present.
 before('Wohnen, Lebenshaltung',wealthEditorial(state,w,settings));
 if(at('Gefühle im Rückblick')>=0)before('Gefühle im Rückblick',emotionalKnowledge());
 // The Anti-Aging synthesis concludes Nutrition, after both nutrient and botanical atlases.
 const antiPages=[];for(let i=output.length-1;i>=0;i--){if(/<h2>(Healthy Aging – eine biologische Perspektive|Anti-Aging Eight[^<]*)<\/h2>/.test(output[i]))antiPages.unshift(output.splice(i,1)[0]);}
 if(antiPages.length){const ix=output.findIndex(p=>p.includes('VI / THE FINANCIAL YEAR')||p.includes('VI · FINANCIAL LIFE'));if(ix>=0)output.splice(ix,0,...antiPages);}
 // Put the missing category legend on charts that were previously unreadable in print.
 if(settings.finance){
  const categories=hierarchicalFlows(arr(state.financeTransactions).filter(t=>day(t.day)>=w.start&&day(t.day)<=w.end)).filter(g=>!g.special&&g.cents>0).slice(0,8);
  const legend=`<div class="av25-category-legend">${categories.map(g=>`<span><i style="background:${h(g.color||'#629382')}"></i>${h(g.name)} · ${de(g.cents/100,0)} €</span>`).join('')}</div>`;
  for(let i=0;i<output.length;i++){if(output[i].includes('Der Konsum im Radialdiagramm')||output[i].includes('Streamgraph · Ausgabenkategorien')){output[i]=output[i].replace('</section>',`${legend}</section>`).replace('class="av19-page', 'class="av19-page av25-has-legend');}}
 }
 // Data caveats are collected in the appendix; editorial pages privilege interpretation.
 return output;
}
export const EDITORIAL_CSS=ANNUAL_FINANCE_PATTERNS_CSS+`
.av25-editorial{gap:4mm}.av25-editorial .av19-heading h2{font-size:34px}.av25-story{padding:3mm 0 2mm;border-top:1px solid #d5e2d9}.av25-story h3{font:400 20px/1.22 Georgia,serif;margin:0 0 2mm;color:#264b3d}.av25-story p{font:12px/1.7 system-ui,sans-serif;color:#435d51;margin:0}.av25-grid{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}.av25-chip{padding:3mm;background:#f4f6f2;border-top:2px solid #b8cbbd}.av25-chip strong{font:15px/1.2 Georgia,serif;color:#295441}.av25-chip p{font:10.5px/1.55 system-ui,sans-serif;color:#4b675a;margin:2mm 0 0}.av25-thought{margin-top:auto;padding:5mm 6mm;border-left:3px solid #bb9b63;background:#f1f5ef}.av25-thought span{font:9px system-ui,sans-serif;letter-spacing:.12em;color:#977b51}.av25-thought h3{font:20px Georgia,serif;color:#2b5443;margin:2mm 0}.av25-thought p{font:11px/1.65 system-ui,sans-serif;color:#496458;margin:0}.av25-footnote{margin-top:auto;font:8.5px/1.6 system-ui,sans-serif;color:#73877c;border-top:1px solid #d8e2d7;padding-top:2mm;overflow-wrap:anywhere}.av25-footnote a{color:#477668}.av25-footnote+.av25-thought{margin-top:0}.av25-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}.av25-stats>div{border-top:1px solid #ceddd2;padding-top:3mm}.av25-stats small{font:10px system-ui,sans-serif;color:#738a7e;display:block}.av25-stats strong{font:24px Georgia,serif;color:#285944;display:block;padding:2mm 0}.av25-stats span{font:9px system-ui,sans-serif;color:#748579;display:block}.av25-illustration{display:flex;align-items:center;justify-content:center;margin:2mm 0}.av25-anatomy{width:100%;max-height:100mm}.av25-flow svg{width:100%;max-height:115mm}.av25-allocation{display:flex;width:100%;height:32mm;overflow:hidden;border-radius:4mm;margin-top:5mm}.av25-allocation-key{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:4mm 0}.av25-allocation-key span{font:11px system-ui,sans-serif;color:#31594a}.av25-allocation-key i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px}.av25-portfolio{font-size:10px}.av25-portfolio-figure{margin:3mm 0 1mm}.av25-portfolio-figure h3{font:18px Georgia,serif;color:#285442;margin:0 0 2mm}.av25-portfolio-figure svg{width:100%;height:auto;max-height:65mm}.av25-portfolio-key{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.4mm 4mm;margin:1mm 0 3mm}.av25-portfolio-key span{font:9px system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#517064}.av25-portfolio-key i{display:inline-block;width:8px;height:8px;margin-right:4px;border-radius:2px}.av25-portfolio td:nth-child(n+3),.av25-portfolio th:nth-child(n+3){text-align:right}.av25-portfolio td:first-child{max-width:75mm}.av25-editorial .av19-running{margin-bottom:1mm}.av25-section-marker{font:19px Georgia,serif;color:#a78b60;border-left:2px solid #bda173;padding:1mm 4mm;margin-bottom:2mm}.av25-category-legend{display:grid;grid-template-columns:1fr 1fr;gap:2mm 6mm;margin-top:3mm}.av25-category-legend span{font:9px system-ui,sans-serif;color:#426354;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.av25-category-legend i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px}.av25-has-legend .av19-figure svg{max-height:115mm!important}.av25-axis-explainer{margin-top:4mm;border-top:1px solid #d4e2d8;padding-top:4mm}.av25-axis-explainer h3{font:21px Georgia,serif;color:#2c5343;margin:0 0 3mm}.av25-axis-grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm 5mm}.av25-axis-grid article{padding:2mm 0;border-top:1px solid #e2eae4}.av25-axis-grid strong{font:12px Georgia,serif;color:#2d5e4a}.av25-axis-grid p{font:10px/1.35 system-ui,sans-serif;color:#5b7567;margin:1mm 0 0}.av25-axis-note{font:9px/1.5 system-ui,sans-serif;color:#6a7e71;margin:3mm 0 0}
`;
