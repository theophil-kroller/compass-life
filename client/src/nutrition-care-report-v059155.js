/** Compass 0.5.91.55 · Nutrition Care Process inspired assessment.
 * Read-only decision support, generated ONLY by explicit Nutrition Coach action.
 * One structured report: assessment, priority interventions, six-week monitoring.
 * No diagnosis, new network fetch, storage write, or automatic habit creation.
 */
import {macroSuggestions} from './macro-goals-v57723.js';
import {nutrientEntry} from './nutrition-intelligence-v57712.js';
import {DAILY_NRV} from './nutrition-reference-v57722.js';
const r=(n,d=1)=>Number.isFinite(n)?Math.round(n*10**d)/10**d:null;
const friendly=n=>Number.isFinite(n)?n.toLocaleString('de-AT',{maximumFractionDigits:1}):'–';
const filterFood=(f)=>!/(?:supplement|kapsel|aminosäure|bcaa|vitamin.daily)/i.test([f?.id,f?.title,f?.group].join(' '));
const dateShift=(day,n)=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function nutrientMenuExamples55(foodMap,key,{limit=3,plantOnly=true}={}){
 const relevant=/tofu|tempeh|bohn|linse|kichererbse|erbsen|spinat|kürbiskern|leinsamen|sesam|hafer|vollkorn|kornbrot|tahin|nuss|erdnuss|brokkoli|rotkraut/i;
 return [...foodMap.values()].filter(filterFood).filter(f=>!plantOnly||relevant.test([f.id,f.title].join(' '))).map(f=>{
  const values=nutrientEntry(f,{foodId:f.id,amount:f.defaultAmount||'1 Portion'}).values;
  return {id:f.id,title:f.title,amount:f.defaultAmount||'1 Portion',value:values[key],kcal:values.kcal};
 }).filter(x=>Number.isFinite(x.value)&&x.value>0).sort((a,b)=>b.value-a.value).slice(0,limit);
}
const findings=(groups,metric,limit=3)=>groups.filter(g=>g.id!=='supplements').sort((a,b)=>(b[metric]||0)-(a[metric]||0)).slice(0,limit);
const recommendation=(id,priority,title,observation,action,kpi,target,products=[])=>({id,priority,title,observation,action,kpi,target,products});
export function nutritionCareReport55(state,m,{groups=[],fat=null}={}){
 if(!m||!m.entries)return null;
 const prefs=macroSuggestions(state),proteinTarget=prefs.ready?(prefs.prefs?.enabled?prefs.protein:r(prefs.weight*1.6,0)):null;
 const energyTarget=prefs.ready&&prefs.prefs?.enabled?prefs.energy:null;
 const kcal=m.metrics.kcal?.avg,protein=m.metrics.protein?.avg,iron=m.metrics.iron?.avg,fiber=m.metrics.fiber?.avg;
 const sfaPct=fat?.pct, sat=m.metrics.saturated?.avg;
 const d=m.dozen.filter(x=>!['beverages','exercise'].includes(x.id));
 const buckets=groups.filter(x=>Number.isFinite(x.share)&&x.share>0).sort((a,b)=>b.share-a.share);
 const top=buckets.slice(0,3).map(x=>({name:x.label,share:r(x.share),calories:r(x.knownKcal,0)}));
 const breakdown=[
  {id:'energy',label:'Energieaufnahme',value:Number.isFinite(kcal)?`Ø ${friendly(kcal)} kcal/Tag`:'–',status:!Number.isFinite(kcal)||!energyTarget?'neutral':kcal>energyTarget*1.1?'watch':kcal<energyTarget*.8?'watch':'good',detail:energyTarget?`Dein Ziel: ${friendly(energyTarget)} kcal/Tag`:'Verlauf mit Körpergewicht abgleichen'},
  {id:'protein',label:'Protein · V-Taper',value:`Ø ${friendly(protein)} g/Tag`,status:!Number.isFinite(protein)||!proteinTarget?'neutral':protein>=proteinTarget*.85?'good':'watch',detail:proteinTarget?`Trainingsorientierung: ${friendly(proteinTarget)} g/Tag`:'Muskelerhalt und Kraftprogression im Blick'},
  {id:'fats',label:'Gesättigte Fette',value:Number.isFinite(sfaPct)?`${friendly(sfaPct)} % der Energie`:'–',status:!Number.isFinite(sfaPct)?'neutral':sfaPct>10?'watch':'good',detail:'Orientierung: unter 10 Energie-%'},
  {id:'fiber',label:'Ballaststoffe',value:`Ø ${friendly(fiber)} g/Tag`,status:!Number.isFinite(fiber)?'neutral':fiber>=25?'good':'watch',detail:'Orientierung: mindestens 25 g/Tag'},
 ];
 const priorities=[];
 if(Number.isFinite(iron)&&iron<DAILY_NRV.iron*.80){
  const picks=nutrientMenuExamples55(m.foodMap,'iron',{limit:3});
  const formatted=picks.map(x=>`${x.title} (${x.amount}: ${friendly(x.value)} mg Eisen)`);
  priorities.push(recommendation('iron',96,'Eisenquellen gezielt stärken',`Ø ${friendly(iron)} mg/Tag erfasst`,
   `Ergänze regelmäßig Hülsenfrüchte, Tofu oder Kürbiskerne und kombiniere sie mit Vitamin-C-reichem Gemüse. ${formatted.length?'Aus deinem Menü: '+formatted.join(' · ')+'.':''}`,
   'Eisenzufuhr und Hülsenfrucht-Tage',`Im nächsten 6-Wochen-Block: 3 zusätzliche hülsenfruchtbasierte Mahlzeiten pro Woche`,picks));
 }
 if(Number.isFinite(sfaPct)&&sfaPct>=10){
  const saturatedSources=m.products.filter(p=>(p.sums.saturated||0)>0).sort((a,b)=>(b.sums.saturated||0)-(a.sums.saturated||0)).slice(0,3);
  const labels=saturatedSources.map(p=>`${p.title} (${friendly(p.sums.saturated)} g im Zeitraum)`);
  priorities.push(recommendation('sfa',90,'Fettqualität verbessern',`${friendly(sfaPct)} Energie-% aus gesättigten Fetten`,
   `Größte Quellen: ${labels.join(' · ')||'keine quantifizierten Quellen'}. Ersetze bei passenden Mahlzeiten einen Teil von Butter oder fettreichen Milchprodukten durch Olivenöl, Nüsse oder andere überwiegend ungesättigte Fette.`,
   'Energieanteil gesättigter Fette','Orientierung: unter 10 Energie-%; Vergleich nach 6 Wochen',[]));
 }
 if(Number.isFinite(protein)&&Number.isFinite(proteinTarget)&&protein<proteinTarget*.85){
  const proteinOptions=nutrientMenuExamples55(m.foodMap,'protein',{limit:2,plantOnly:false});
  priorities.push(recommendation('protein',84,'Proteinversorgung für den V-Taper',`Ø ${friendly(protein)} g/Tag bei einer Orientierung von ${friendly(proteinTarget)} g`,
   `Eine zusätzliche proteinreiche Mahlzeit einplanen, ohne das Kalorienziel aus den Augen zu verlieren. Aus deinem Menü: ${proteinOptions.map(x=>`${x.title} (${x.amount}: ${friendly(x.value)} g Protein)`).join(' · ')||'Tofu, Tempeh oder Skyr'}.`,
   'Protein und Kraftprogression',`Wochendurchschnitt in Richtung ${friendly(proteinTarget)} g/Tag bewegen`,proteinOptions));
 }
 const ddAction={
  berries:{re:/blaubeer|heidelbeer|beeren/i,action:'Eine Portion (z. B. TK-Blaubeeren) zu einer bestehenden Frühstücksmahlzeit ergänzen.',goal:'Beeren an mindestens 4 von 7 Tagen'},
  legumes:{re:/tofu|tempeh|bohn|linse|kichererbse/i,action:'Käferbohnensalat, Linsen oder Tofu regelmäßig als Bestandteil einer Hauptmahlzeit einsetzen.',goal:'Hülsenfrüchte an mindestens 4 von 7 Tagen'},
  greens:{re:/spinat|blattgemüse|grünkohl/i,action:'Blattgemüse an geeigneten Tagen als Gemüsebeilage einplanen.',goal:'Blattgemüse an mindestens 4 von 7 Tagen'},
  wholegrains:{re:/vollkorn|kornbrot|haferflocken/i,action:'Eine raffinierte Getreidebeilage durch echte Vollkornprodukte ersetzen.',goal:'Vollkorn an mindestens 4 von 7 Tagen'},
  flax:{re:/leinsamen/i,action:'Geschrotete Leinsamen in eine bestehende Mahlzeit integrieren.',goal:'Leinsamen an mindestens 4 von 7 Tagen'}
 };
 for(const id of ['berries','legumes','greens','wholegrains','flax']){
  const dd=d.find(x=>x.id===id),config=ddAction[id];if(!dd||!Number.isFinite(dd.avg)||dd.avg>=dd.goal*.7)continue;
  const product=[...m.foodMap.values()].filter(f=>config.re.test(f.title||'')).slice(0,2).map(f=>f.title);
  priorities.push(recommendation('daily-'+id,72+Math.round((1-dd.avg/dd.goal)*10),`${dd.label} regelmäßiger einplanen`,
   `Ø ${friendly(dd.avg)} von ${dd.goal} Daily-Dozen-Portionen`,
   `${config.action}${product.length?' Im Menü: '+product.join(' oder ')+'.':''}`,
   `Tage mit ${dd.label}`,config.goal));
 }
 if(Number.isFinite(fiber)&&fiber<25){
  priorities.push(recommendation('fiber',57,'Mehr ballaststoffreiche Lebensmittel',`Ø ${friendly(fiber)} g/Tag`,
   'Hülsenfrüchte, echtes Vollkorn und Gemüse in Hauptmahlzeiten kombinieren.',
   'Ballaststoff-Wochendurchschnitt','Orientierung: mindestens 25 g/Tag'));
 }
 priorities.sort((a,b)=>b.priority-a.priority);
 // Priorities are actionable nutrition issues, not generic mensa counting or missing label lists.
 const selected=priorities.slice(0,3);
 const positives=[
  ...(proteinTarget&&protein>=proteinTarget*.85?['Deine Proteinaufnahme bewegt sich im Trainingskorridor.']:[]),
  ...(sfaPct!==null&&sfaPct<=10?['Deine gesättigten Fette liegen in der Orientierung.']:[]),
  ...d.filter(x=>x.recorded>=4&&x.avg>=x.goal*.75).slice(0,2).map(x=>`${x.label} ist regelmäßig vertreten.`)
 ];
 const avgDozen=d.length?r(d.reduce((a,x)=>a+(x.avg||0),0)/d.reduce((a,x)=>a+x.goal,0)*100,0):null;
 return {
  period:m.window.label,days:m.window.days,recordedDays:m.loggedDays,entries:m.entries,
  title:'Dein persönlicher Ernährungsreport',
  headline:`${m.loggedDays} Ernährungstage · ${m.entries} protokollierte Einträge · ${Number.isFinite(avgDozen)?avgDozen+' %':'–'} dokumentierte Daily-Dozen-Portionen im Mittel`,
  summary: selected.length?`Dein nächster Schritt: ${selected[0].title}. ${selected[0].action}`:'Deine dokumentierten Mahlzeiten geben derzeit keine priorisierten Anpassungen vor. Fortsetzung deiner bewährten Routinen und Beobachtung über den nächsten Trainingsblock.',
  assessment:breakdown,positive:positives,topGroups:top,priorities:selected,additional:priorities.slice(3,6),
  reviewDate:dateShift(m.window.end,42),
  monitoring:selected.map(x=>({label:x.kpi,target:x.target})),
  references:['Daily Dozen · NutritionFacts.org','Nutrition Care Process · Academy of Nutrition and Dietetics']
 };
}
