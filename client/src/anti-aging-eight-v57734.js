/** Compass .34: Dr. Greger's eight topics from How Not to Age, Part IV.
 * These are topics/strategies, NOT 8 medical biomarkers or a validated score.
 * Missing meals != fasting; grams protein != diagnosis of harmful intake;
 * plant-food logs cannot measure postbiotics, microRNA or NAD+.
 */
import {nutritionEntries,nutritionFoods} from './personal-journal-v5692.js';
import {nutrientEntry} from './nutrition-intelligence-v57712.js';
import {dailyDozenSummary,dailyDozenEvidence} from './daily-dozen-v57733.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateKey=s=>{const d=new Date(s);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
export const ANTI_AGING_EIGHT=Object.freeze([
 {id:'nuts',emoji:'🥜',title:'Nüsse',detail:'Täglich Nüsse, idealerweise regelmäßig Walnüsse',kind:'food'},
 {id:'greens',emoji:'🥬',title:'Grünes Blattgemüse',detail:'Grünes Gemüse und Kreuzblütler',kind:'food'},
 {id:'berries',emoji:'🫐',title:'Beeren',detail:'Beeren regelmäßig essen',kind:'food'},
 {id:'xeno',emoji:'🌱',title:'Xenohormesis & microRNA',detail:'Pflanzliche Stress- und Signalstoffe – nicht direkt messbar',kind:'concept'},
 {id:'microbiome',emoji:'🫘',title:'Präbiotika & Postbiotika',detail:'Ballaststoff- und hülsenfruchtreiche Ernährung; tatsächliche Postbiotika nicht messbar',kind:'concept'},
 {id:'caloric',emoji:'🕒',title:'Kalorienrestriktion',detail:'Essenszeitfenster und Energiebilanz getrennt betrachten',kind:'estimate'},
 {id:'protein',emoji:'🌾',title:'Proteinrestriktion',detail:'Protokollierte Proteinmenge – kein pauschales Ziel bei Krafttraining',kind:'estimate'},
 {id:'nad',emoji:'⚛️',title:'NAD⁺',detail:'NAD⁺-Status ist nicht aus Ernährungs-, Garmin- oder Gewichtslogs ablesbar',kind:'concept'}
]);
export function antiAgingEightModel(state,day){
 const summary=dailyDozenSummary(state,day),by=Object.fromEntries(summary.rows.map(r=>[r.id,r]));
 const evidence=dailyDozenEvidence(state,day),foods=new Map(nutritionFoods(state).map(x=>[x.id,x]));
 const logs=nutritionEntries(state).filter(x=>dateKey(x.at)===day),measurements=logs.map(entry=>nutrientEntry(foods.get(entry.foodId),entry));
 const protein=measurements.reduce((s,x)=>s+(x.knownKeys.has('protein')?x.values.protein:0),0);
 const proteinKnown=measurements.filter(x=>x.knownKeys.has('protein')).length;
 const all=nutritionEntries(state).filter(x=>dateKey(x.at)<=day).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 const earlier=all.filter(x=>dateKey(x.at)<day).at(-1),first=logs.length?logs.reduce((a,b)=>Date.parse(a.at)<Date.parse(b.at)?a:b):null;
 const gap=earlier&&first?(Date.parse(first.at)-Date.parse(earlier.at))/3600000:null;
 const fasting=gap!==null&&Number.isFinite(gap)&&gap>0&&gap<48?Math.round(gap*10)/10:null;
 const nutTotal=evidence.nutGrams;
 const rows=ANTI_AGING_EIGHT.map(x=>{
  if(x.id==='nuts')return {...x,status:nutTotal>=20||by.nuts?.count>0?'observed':'unknown',value:nutTotal>0?`${nutTotal} g Nüsse protokolliert`:'Keine eindeutig quantifizierte Nussportion',reason:nutTotal>=20?'Gregers Anti-Aging-Nussorientierung von ca. 20 g erfasst': 'Fehlende Angaben bedeuten nicht, dass du keine Nüsse gegessen hast'};
  if(x.id==='greens')return {...x,status:(by.greens?.count||0)+(by.cruciferous?.count||0)>0?'observed':'unknown',value:`${(by.greens?.count||0)+(by.cruciferous?.count||0)} dokumentierte Portionen grünes Gemüse / Kreuzblütler`,reason:'Aus bestätigten Daily-Dozen-Häkchen und eindeutig identifizierbaren Einträgen'};
  if(x.id==='berries')return {...x,status:by.berries?.count>0?'observed':'unknown',value:`${by.berries?.count||0} dokumentierte Beerenportionen`,reason:'Daily Dozen; nicht protokollierte Lebensmittel bleiben unbekannt'};
  if(x.id==='microbiome'){const flax=logs.filter(e=>e.foodId==='spar-bio-flaxseed').length,fruit=logs.filter(e=>e.foodId==='banana'||e.foodId==='apple').length;return {...x,status:by.beans?.count>0||flax>0||fruit>0?'partial':'unknown',value:by.beans?.count?`${by.beans.count} Portion(en) Hülsenfrüchte dokumentiert`:flax>0?`${flax} Leinsamen-Eintrag/Einträge · Ballaststoffquelle (keine Mikrobiom-Messung)`:fruit>0?`${fruit} Banane/Apfel-Eintrag/Einträge · Ballaststoffquelle (keine Mikrobiom-Messung)`:'Darmmikrobiom und Postbiotika nicht gemessen',reason:'Nur Ballaststoff-Ernährungsindikatoren; weder Mikrobiom, Postbiotika noch deren Wirkung wurde gemessen.'};}
  if(x.id==='caloric')return {...x,status:fasting!==null?'partial':'unknown',value:fasting!==null?`${fasting.toLocaleString('de-AT')} h zwischen letztem und erstem protokollierten Essen`:'Kein zusammenhängendes Essensfenster belegbar',reason:'Eine Dokumentationslücke beweist kein Fasten. Kalorienrestriktion ist damit nicht nachgewiesen.'};
  if(x.id==='protein')return {...x,status:proteinKnown?'partial':'unknown',value:proteinKnown?`${Math.round(protein*10)/10} g Protein aus ${proteinKnown}/${logs.length} Einträgen`:'Proteinaufnahme nicht bestimmbar',reason:'Nicht gleichzusetzen mit Proteinrestriktion; bei Krafttraining ausreichende Versorgung beachten.'};
  if(x.id==='xeno')return {...x,status:'unmeasurable',value:'Keine direkte Messung verfügbar',reason:'Phytochemische Aufnahme erlaubt keine Aussage über tatsächliche microRNA-Regulation.'};
  return {...x,status:'unmeasurable',value:'Kein NAD⁺-Messwert',reason:'Weder FIT noch Ernährungstagebuch liefern einen NAD⁺-Biomarker.'};
 });
 return {day,rows,observed:rows.filter(x=>x.status==='observed').length,partial:rows.filter(x=>x.status==='partial').length,unmeasurable:rows.filter(x=>x.status==='unmeasurable').length,logged:logs.length};
}
export function antiAgingEightView(state,{day=dateKey(new Date()),today=dateKey(new Date())}={}){
 const m=antiAgingEightModel(state,day);
 const cards=m.rows.map(x=>`<article class="aa734-item is-${x.status}"><div class="aa734-item-title"><span aria-hidden="true">${x.emoji}</span><div><strong>${esc(x.title)}</strong><small>${esc(x.detail)}</small></div></div><div class="aa734-observation"><span class="aa734-status" aria-label="Datenstatus">${x.status==='observed'?'✓ Dokumentiert':x.status==='partial'?'≈ Teilinformation':x.status==='unmeasurable'?'◌ Nicht messbar':'? Noch nicht belegt'}</span><strong>${esc(x.value)}</strong></div><p>${esc(x.reason)}</p></article>`).join('');
 return `<section class="aa734-root" aria-label="Dr. Greger Anti-Aging Eight"><header class="aa734-header"><div><h2>🌱 Dr. Greger’s Anti-Aging Eight</h2><p>Acht Themen aus <em>How Not to Age</em> · Beobachtungen statt scheinbarer Anti-Aging-Scores</p></div><a href="https://nutritionfacts.org/book/how-not-to-age/" rel="noopener noreferrer" target="_blank">Originalquelle ↗</a></header>
 <nav class="aa734-day" aria-label="Anti-Aging Eight Datum"><button type="button" data-action="aa734-day" data-id="prev" aria-label="Vortag">‹</button><strong>${esc(day)}${day===today?' · Heute':''}</strong><button type="button" data-action="aa734-day" data-id="next" ${day>=today?'disabled':''} aria-label="Nächster Tag">›</button><button type="button" data-action="aa734-day" data-id="today">Heute</button></nav>
 <div class="aa734-metrics"><span><strong>${m.observed}</strong> direkt dokumentiert</span><span><strong>${m.partial}</strong> indirekte Hinweise</span><span><strong>${m.unmeasurable}</strong> nicht direkt messbar</span></div>
 <div class="aa734-grid">${cards}</div><p class="aa734-disclaimer">Gregers Anti-Aging Eight sind keine acht messbaren Gesundheitsindikatoren. Das Protokoll ist unvollständig, solange du nicht alle Lebensmittel erfasst. Fasten, Kalorien- oder Proteinrestriktion werden hier weder automatisch bestätigt noch als Therapie empfohlen. Besondere Vorsicht gilt bei gleichzeitiger Krafttraining- und Muskelaufbauplanung.</p></section>`;
}
