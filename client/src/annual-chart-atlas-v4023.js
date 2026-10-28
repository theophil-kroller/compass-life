/** Ars Vivendi Chart Atlas 0.5.77.59.40.23
 * Every chart is generated from documented source records. Missing values are never zero.
 * Vectors are static, print-safe, no remote dependencies or async placeholders.
 */
import {sportsRows,summarizeSports,sportsTrendSeries} from './sports-insights.js';
import {nutritionDay,bioactiveFromEntries} from './nutrition-intelligence-v57712.js';
import {nutritionTimingIndex,nutritionTimingSeries} from './nutrition-timing-v57725.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rows=x=>Array.isArray(x)?x:[];
const d=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d/.test(s)?s.slice(0,10):'';
const valid=x=>typeof x==='number'&&Number.isFinite(x);
const fmt=(x,digits=1)=>valid(x)?x.toLocaleString('de-AT',{maximumFractionDigits:digits}):'—';
const within=(x,w)=>d(x)>=w.start&&d(x)<=w.end;
const chart=(inner,desc,W=980,H=340)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(desc)}" width="${W}" height="${H}" style="max-width:100%;height:auto"><rect width="${W}" height="${H}" fill="#fff"/>${inner}</svg>`;
const txt=(x,y,s,size=13,color='#426356',anchor='start')=>`<text x="${x}" y="${y}" font-size="${Math.max(size,15)}" fill="${color}" text-anchor="${anchor}" font-family="Arial,sans-serif">${esc(s)}</text>`;
const line=(x,y,xx,yy,color='#d8e4de',sw=1)=>`<line x1="${x}" y1="${y}" x2="${xx}" y2="${yy}" stroke="${color}" stroke-width="${sw}"/>`;
const paint=(x,y,width,height,color,rx=2)=>`<rect x="${x}" y="${y}" width="${Math.max(0,width)}" height="${Math.max(0,height)}" rx="${rx}" fill="${color}"/>`;
const out=(topic,heading,deck,plots,insight)=>({topic,heading,deck,plots,insight});

export function annualSleepStageAtlas(state,w){
 const nights=rows(state.healthImports?.garminNights).filter(x=>within(x?.day,w)&&valid(x?.sleepMinutes)&&x.sleepMinutes>0);
 const stageNights=nights.filter(x=>['deep','rem','light'].every(k=>valid(x.totals?.[k])&&x.totals[k]>=0)).slice(-7);
 if(!stageNights.length)return [];
 const colors={deep:'#496ba4',rem:'#aa86bb',light:'#a1b5dc'};
 const max=Math.max(480,...stageNights.map(x=>x.sleepMinutes));
 const g=stageNights.map((r,i)=>{const y=49+i*43,scale=760/max;let x=130;
   const pieces=['deep','rem','light'].map(k=>{const v=r.totals[k];const el=paint(x,y,scale*v,24,colors[k]);x+=scale*v;return el;}).join('');
   return `${txt(16,y+17,r.day.slice(5),15)}${paint(130,y,760,24,'#eef2f1')}${pieces}${txt(909,y+17,`${Math.floor(r.sleepMinutes/60)}:${String(Math.round(r.sleepMinutes%60)).padStart(2,'0')}`,14)}`;
 }).join('');
 const legend=Object.entries(colors).map(([name,color],i)=>`${paint(130+i*190,9,11,11,color)}${txt(147+i*190,19,{deep:'Tief',rem:'REM',light:'Leicht'}[name],12)}`).join('');
 return [out('III / SLEEP STAGES','Die Architektur deiner Nächte','Schlafphasen der letzten sieben Nächte mit vollständiger Phasenmessung.',[{label:'Schlafphasen · gemessene Nächte',svg:chart(legend+g,'Schlafphasen, gemessene Nächte',980,380),caption:`${stageNights.length} Nächte mit Phase- und Gesamtwerten. Nicht ausgewiesene Wachphasen werden nicht rekonstruiert.`}],`Phasenwerte werden als Garmin-Schätzungen dargestellt. Aus einer einzelnen Phase lässt sich keine Diagnose ableiten.`)];
}
export function annualWellnessAtlas(state,w){
 const points=rows(state.healthImports?.garminWellness).filter(x=>within(x?.at,w)&&x&&!x.deleted);
 const groups=new Map(),zones=[0,0,0,0];
 for(const p of points){const key=d(p.at);let z=groups.get(key);if(!z){z={day:key,count:0,hi:null,lo:null,stress:0,sN:0};groups.set(key,z);}
  if(valid(p.bodyBattery)&&p.bodyBattery>=0&&p.bodyBattery<=100){z.count++;z.hi=z.hi===null?p.bodyBattery:Math.max(z.hi,p.bodyBattery);z.lo=z.lo===null?p.bodyBattery:Math.min(z.lo,p.bodyBattery);}
  if(valid(p.stress)&&p.stress>=0&&p.stress<=100){z.stress+=p.stress;z.sN++;zones[p.stress<25?0:p.stress<50?1:p.stress<75?2:3]++;}
 }
 const days=[...groups.values()].sort((a,b)=>a.day.localeCompare(b.day)),battery=days.filter(x=>x.hi!==null),outputs=[];
 if(battery.length>=3){const left=60,right=970,top=30,bottom=270,barW=Math.max(1,(right-left)/battery.length);
  let body='';battery.forEach((x,i)=>{const xx=left+i*barW+barW*.15,ww=Math.max(.7,barW*.68),yy=bottom-x.hi*(bottom-top)/100;
   body+=paint(xx,yy,ww,bottom-yy,'#8dc7b2',0);body+=`<circle cx="${xx+ww/2}" cy="${yy}" r="${Math.min(3,barW/2)}" fill="#2d826e"/>`;body+=`<circle cx="${xx+ww/2}" cy="${bottom-x.lo*(bottom-top)/100}" r="${Math.min(3,barW/2)}" fill="#b87c5b"/>`;});
  body+=line(left,bottom,right,bottom)+txt(left,290,battery[0].day,12)+txt(right,290,battery.at(-1).day,12,'#426356','end');
  [0,25,50,75,100].forEach(v=>body+=txt(12,bottom-v*(bottom-top)/100+4,String(v),12)+line(left,bottom-v*(bottom-top)/100,right,bottom-v*(bottom-top)/100,'#e8efeb'));
  // Grid belongs behind marks visually; draw the baseline again.
  outputs.push({label:'Body Battery · Tageshöchst- und Tiefstwerte',svg:chart(body,`Body Battery für ${battery.length} dokumentierte Tage`,980,320),caption:`${battery.length} Tage mit Garmin-Body-Battery-Werten. Hellgrün: Tageshoch, Rost: Tagestief; keine Interpolation.`});}
 const total=zones.reduce((a,b)=>a+b,0);
 if(total>=10){const zNames=['Ruhe','Niedrig','Mittel','Hoch'],zColor=['#438d80','#a6c9a5','#dcb36a','#c8766b'];
  let left=65;const bars=zones.map((n,i)=>{const width=n/total*845,x=left;left+=width;return paint(x,80,width,58,zColor[i],0)}).join('');
  const labs=zones.map((n,i)=>`${paint(55+i*230,172,13,13,zColor[i])}${txt(76+i*230,184,zNames[i],15)}${txt(76+i*230,215,`${fmt(100*n/total)} % · ${n} Punkte`,15)}`).join('');
  outputs.push({label:'Stressverteilung · gültige Messpunkte',svg:chart(bars+labs,`Verteilung von ${total} gültigen Garmin-Stressmessungen`,980,260),caption:`Anteile unter allen ${total} gültigen Messpunkten, nicht Anteile der gesamten Tageszeit.`});}
 return outputs.length?[out('III / BODY BATTERY & STRESS','Energie und Belastung','Gemessene Body Battery und Stress im Zeitverlauf – getrennte Kennzahlen.',outputs,'Beobachtete Werte sind keine klinische Bewertung. Bei nicht kontinuierlicher Messung sind die Zeitanteile unbekannt.')]:[];
}
export function annualSportsAtlas(state,w){
 const sessions=rows(state.healthImports?.garminSessions),manual=rows(state.activities?.entries||state.activities||state.activityJournal?.entries);
 const sr=sportsRows(sessions,manual,w),groups=summarizeSports(sessions,manual,w);
 if(!sr.length)return [];
 const max=Math.max(1,...groups.map(x=>x.minutes)),bar=groups.slice(0,10).map((x,i)=>{
  const y=30+i*31;return txt(10,y+15,x.label,13)+paint(205,y,680*x.minutes/max,18,x.color)+txt(908,y+15,`${fmt(x.minutes/60)} h`,13);}).join('');
 const outPlots=[{label:'Wofür du deine aktive Zeit verwendet hast',svg:chart(bar,`Aktivitätsdauer nach Sportkategorie, ${sr.length} Einheiten`,980,370),caption:`${sr.length} dokumentierte Aktivitäten; ${fmt(sr.reduce((a,b)=>a+b.mins,0)/60)} Stunden. Garmin- und manuelle Doppelungen werden nur nach erkennbaren Übereinstimmungen entfernt.`}];
 const trend=sportsTrendSeries(sr,'year','time');if(trend.length){const keys=groups.slice(0,7).map(x=>x.type),color=Object.fromEntries(groups.map(x=>[x.type,x.color]));const maxV=Math.max(1,...trend.map(x=>keys.reduce((s,k)=>s+(x.parts[k]||0),0)));
  const colW=850/trend.length;let shapes='';trend.forEach((point,i)=>{const x=68+i*colW,ww=Math.max(2,colW*.7),scale=205/maxV;let y=260;for(const k of keys){const h=(point.parts[k]||0)*scale;if(h){y-=h;shapes+=paint(x,y,ww,h,color[k]||'#759d90',0);}}if(i%Math.max(1,Math.round(trend.length/7))===0)shapes+=txt(x,280,point.period.slice(2),11);});
  outPlots.push({label:'Aktivitäten im Jahresverlauf · Stunden nach Disziplin',svg:chart(shapes+line(68,260,950,260),`Aktivitätstrend nach Monat, ${trend.length} Monate`,980,325),caption:'Gestapelte dokumentierte Stunden je Monat. Nicht erfasste Zeiträume bleiben unbekannt.'});}
 return [out('II / ACTIVE LIFE','Ein Jahr in Bewegung','Sport, Freizeitaktivität und Erlebnisse als tatsächliche Zeitinvestition.',outPlots,`Die Verteilung beschreibt nur erfasste Aktivitäten. Sie sollte nicht mit sämtlicher Freizeit oder passiver Erholung gleichgesetzt werden.`)];
}
export function annualNutritionAtlas(state,w){
 const journal=rows(state.nutritionJournal?.entries).filter(x=>within(x?.at,w)&&!x.deleted);
 const dates=[...new Set(journal.map(x=>d(x.at)).filter(Boolean))].sort();
 if(!dates.length)return [];
 // Use exactly the nutrition engine that powers the dashboard.
 const models=dates.map(day=>nutritionDay(state,day)),nutrients=[
  ['vitaminC','Vitamin C','mg'],['vitaminD','Vitamin D','µg'],['vitaminB12','Vitamin B12','µg'],['calcium','Kalzium','mg'],
  ['iron','Eisen','mg'],['magnesium','Magnesium','mg'],['zinc','Zink','mg'],['fiber','Ballaststoffe','g']
 ];
 // Additional naming variations are extracted directly from documented keys.
 const available=new Set(models.flatMap(m=>Object.keys(m.totals||{})));
 const chosen=nutrients.filter(x=>available.has(x[0])).concat([...available].filter(x=>/vitamin|iron|calcium|zinc|magnesium|fiber|b12/i.test(x)&&!nutrients.some(t=>t[0]===x)).slice(0,8).map(k=>[k,k,'']));
 const descriptors=chosen.map(([key,label,unit])=>{const withValue=models.filter(m=>valid(m.totals[key])).length;const value=models.reduce((sum,m)=>sum+(valid(m.totals[key])?m.totals[key]:0),0);return {key,label,unit,coverage:withValue,total:value};}).filter(x=>x.coverage>0).slice(0,10);
 const result=[];
 if(descriptors.length){const bars=descriptors.map((x,i)=>{const y=14+i*35;return txt(10,y+17,x.label,13)+paint(225,y,540,20,'#eef3f0')+paint(225,y,540*x.coverage/models.length,20,'#66a394')+txt(785,y+17,`${fmt(x.total)} ${x.unit}`,12)+txt(975,y+17,`${x.coverage}/${models.length} Tage`,11,'#70857b','end')}).join('');
  result.push({label:'Mikronährstoffe · Werte & Datenabdeckung',svg:chart(bars,`Dokumentierte Nährstoffwerte und Messtagabdeckung`,980,Math.max(175,descriptors.length*35+35)),caption:`Grüne Balken zeigen ausschließlich den Anteil dokumentierter Tage mit einem bekannten Wert. Zahlen rechts sind Teilsummen der jeweiligen Nährstoffe; unterschiedliche Einheiten werden nicht verglichen.`});}
 const extras=bioactiveFromEntries(models.flatMap(m=>m.entries)).filter(x=>x.known>0);
 const tea=extras.filter(x=>['caffeine','EGCG','EGC','EC','catechin','lTheanine'].includes(x.key)).slice(0,8);
 if(tea.length){const max=Math.max(1,...tea.map(x=>x.value));const bars=tea.map((x,i)=>{const y=20+i*38;return txt(8,y+15,x.label,14)+paint(270,y,580*x.value/max,19,'#4a9780')+txt(864,y+15,`${x.minimum?'≥ ':x.estimated?'≈ ':''}${fmt(x.value)} ${x.unit}`,13)+txt(973,y+15,`${x.known} Werte`,11,'#70857b','end')}).join('');
  result.push({label:'Matcha & bioaktive Inhaltsstoffe · dokumentierte Angaben',svg:chart(bars,`Dokumentierte Tee-Inhaltsstoffe und Schätzwerte`,980,Math.max(170,tea.length*38+35)),caption:'Hersteller-Mindestwerte und Schätzungen sind keine Laboranalyse. EGCG ist keine empfohlene Zielmenge; keine gesundheitliche Wirkung aus Mengen ableiten.'});}
 return result.length?[out('V / NUTRIENTS & BIOACTIVES','Nährstoffatlas & botanische Wirkstoffe','Vitamine, Mineralstoffe und Catechine im erfassten Ernährungstagebuch.',result,'Die tägliche Gesamtzufuhr kann bei fehlenden Lebensmitteln oder Nährwertangaben nicht zuverlässig bewertet werden. Keine Defizitdiagnose aus Teilbilanzen.')]:[];
}

export function annualFoodRhythmAtlas(state,w){
 const index=nutritionTimingIndex(state),logged=[...index.days.entries()].filter(([key])=>within(key,w)).sort(([a],[b])=>a.localeCompare(b));
 if(!logged.length)return [];
 const displayed=logged.slice(-14),W=980,H=Math.max(260,displayed.length*32+82);
 let b='',first=null,last=null;
 displayed.forEach(([key,entry],i)=>{
   const y=44+i*31,ev=entry.summary?.events||[...entry.events.values()];
   b+=txt(0,y+5,key,12)+line(110,y,950,y,'#e8eeeb');
   for(const item of ev){
     const at=new Date(item.ms),hour=at.getHours()+at.getMinutes()/60;if(!Number.isFinite(hour))continue;
     const x=110+840*hour/24,r=2+Math.min(8,Math.sqrt(Math.max(0,item.kcal??0))/4);
     const color=item.caloric?'#b87769':'#5b9fc2';
     b+=`<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="${color}" opacity=".75"><title>${esc(item.title||'Eintrag')} · ${esc(item.kcal===null?'kcal unbekannt':`${fmt(item.kcal)} kcal`)}</title></circle>`;
   }
 });
 for(const hour of [0,6,12,18,24]){const x=110+840*hour/24;b+=txt(x,22,`${String(hour).padStart(2,'0')}h`,12,'#617c6f','middle');}
 const plots=[{label:'Essenszeiten · dokumentierte Kalorienereignisse',svg:chart(b,`Zeitpunkte dokumentierter Aufnahmen auf ${displayed.length} protokollierten Tagen`,W,H),caption:`Die letzten ${displayed.length} protokollierten Tage im Reportfenster; Zeitachsen 00–24 Uhr. Blau: nichtkalorische oder unbekannte Aufnahme, Rost: berechnete Kalorienaufnahme. Keine nicht protokollierten Mahlzeiten ergänzt.`}];
 const timing=nutritionTimingSeries(state,{mode:'all',anchor:w.end,now:new Date(`${w.end}T12:00:00`)});
 const ov=timing.rows.filter(x=>within(x.day,w)&&x.overnightValid&&valid(x.overnightMinutes)).slice(-14);
 if(ov.length){
  let bars='';const max=Math.max(14*60,...ov.map(x=>x.overnightMinutes));
  ov.forEach((x,i)=>{const y=16+i*29;bars+=txt(0,y+14,x.day,13)+paint(130,y,700*x.overnightMinutes/max,19,'#6d8faf')+txt(858,y+14,`${fmt(x.overnightMinutes/60)} h`,13);});
  plots.push({label:'Protokollierte Nachtpausen zwischen Mahlzeiten',svg:chart(bars,`Dokumentierte Pausen aus angrenzenden protokollierten Tagen`,980,Math.max(210,ov.length*29+44)),caption:`${ov.length} auswertbare Pausen auf direkt aufeinanderfolgenden Kalendertagen. Nicht identisch mit einer nachgewiesenen Fastenzeit.`});
 }
 return [out('V / EATING RHYTHM','Wann du gegessen hast','Zeitpunkt, geschätzte Kalorienmenge und dokumentierte Pausen.',plots,'Der Zeitstrahl zeigt dokumentierte Ereignisse, keine vollständige Essenshistorie. Lücken im Tagebuch verlängern scheinbar die Nachtpause.')];
}
export function annualChartAtlas(state,w){
 return {
  health:[...annualSleepStageAtlas(state,w),...annualWellnessAtlas(state,w)],
  sports:annualSportsAtlas(state,w),
  nutrition:[...annualFoodRhythmAtlas(state,w),...annualNutritionAtlas(state,w)],
 };
}
