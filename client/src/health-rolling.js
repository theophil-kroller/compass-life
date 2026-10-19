/** 0.4.17.5 – descriptive trailing-window statistics; no invented samples or clinical bands. */
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stamp=day=>Date.parse(`${day}T12:00:00Z`);
export function quantile(values,p){
 const s=values.filter(finite).sort((a,b)=>a-b);if(!s.length)return null;
 const pos=(s.length-1)*p,i=Math.floor(pos);return s[i]+(s[Math.min(i+1,s.length-1)]-s[i])*(pos-i);
}
export function rollingObservations(rows=[],key='nightAverageMs',windowDays=14,minPoints=5){
 const unique=new Map();
 for(const r of rows||[])if(/^\d{4}-\d{2}-\d{2}$/.test(r.day||'')&&finite(r[key])&&r[key]>=0)unique.set(r.day,{day:r.day,value:r[key]});
 const sorted=[...unique.values()].sort((a,b)=>a.day.localeCompare(b.day));
 return sorted.map((row,i)=>{
  const range=sorted.slice(0,i+1).filter(x=>stamp(row.day)-stamp(x.day)<windowDays*86400000);
  const values=range.map(x=>x.value);return {...row,count:values.length,
   low:values.length>=minPoints?quantile(values,.2):null,
   median:values.length>=minPoints?quantile(values,.5):null,
   high:values.length>=minPoints?quantile(values,.8):null};
 });
}
const formatDay=day=>new Date(`${day}T12:00:00Z`).toLocaleDateString('de-AT',{day:'2-digit',month:'short',year:'numeric'});
export function rollingEnvelopeChart(rows,key='nightAverageMs',{title='Verlauf',unit='',windowDays=14,color='#8065A9',minPoints=5,range=null}={}){
 const all=(rows||[]).filter(r=>finite(r[key])&&r[key]>=0&&/^\d{4}-\d{2}-\d{2}$/.test(r.day||'')).sort((a,b)=>a.day.localeCompare(b.day));
 if(!all.length)return `<p class="insight-no-data">Keine ${esc(title)}-Messwerte vorhanden.</p>`;
 // Historical observations before the selected interval are allowed ONLY as rolling reference.
 const relevant=all.filter(x=>(!range?.start||x.day>=range.start)&&(!range?.end||x.day<=range.end));
 if(!relevant.length)return `<p class="insight-no-data">Keine ${esc(title)}-Messwerte im ausgewählten Zeitraum.</p>`;
 const derived=rollingObservations(all,key,windowDays,minPoints).filter(x=>(!range?.start||x.day>=range.start)&&(!range?.end||x.day<=range.end));
 const band=derived.filter(x=>finite(x.low)&&finite(x.high));
 const values=derived.flatMap(x=>[x.value,x.low,x.high].filter(finite));const rawLo=Math.min(...values),rawHi=Math.max(...values),pad=Math.max(1,(rawHi-rawLo)*.15),lo=Math.max(0,rawLo-pad),hi=rawHi+pad;
 const W=820,H=269,L=54,R=18,T=20,B=43,w=W-L-R,h=H-T-B;
 const begin=range?.start||derived[0].day,end=range?.end||derived.at(-1).day;
 const t0=stamp(begin),t1=Math.max(stamp(end),t0+86400000);
 const X=d=>L+(stamp(d)-t0)/(t1-t0)*w,Y=v=>T+h-(v-lo)/(hi-lo||1)*h;
 // Band is a sequence of trapezoids; a missing interval is not connected to another.
 const shapes=[];for(let i=1;i<derived.length;i++){
  const a=derived[i-1],b=derived[i];if(!finite(a.low)||!finite(b.low)||stamp(b.day)-stamp(a.day)>7*86400000)continue;
  shapes.push(`<path d="M${X(a.day).toFixed(1)},${Y(a.high).toFixed(1)} L${X(b.day).toFixed(1)},${Y(b.high).toFixed(1)} L${X(b.day).toFixed(1)},${Y(b.low).toFixed(1)} L${X(a.day).toFixed(1)},${Y(a.low).toFixed(1)}Z" fill="${color}" opacity=".18"/>`);
 }
 const lines=[];for(let i=1;i<derived.length;i++){
  const a=derived[i-1],b=derived[i];if(!finite(a.median)||!finite(b.median)||stamp(b.day)-stamp(a.day)>7*86400000)continue;
  lines.push(`<line x1="${X(a.day)}" x2="${X(b.day)}" y1="${Y(a.median)}" y2="${Y(b.median)}" stroke="${color}" stroke-width="2.9" stroke-linecap="round"/>`);
 }
 const circles=derived.slice(-420).map(v=>`<circle cx="${X(v.day)}" cy="${Y(v.value)}" r="3" fill="${color}" opacity=".8"><title>${esc(v.day)}: ${v.value.toFixed(1)} ${esc(unit)} · ${v.count} Messungen im ${windowDays}-Tage-Fenster</title></circle>`).join('');
 const ticks=[0,.25,.5,.75,1].map(t=>{const v=lo+(hi-lo)*t;return `<line x1="${L}" y1="${Y(v)}" x2="${W-R}" y2="${Y(v)}" stroke="#E8EEE9"/><text x="${L-7}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="#75897C">${v.toFixed(1)}</text>`;}).join('');
 const dateLabels=[0,.25,.5,.75,1].map(t=>{const d=new Date(t0+(t1-t0)*t).toISOString().slice(0,10);return `<text x="${L+w*t}" y="${H-13}" text-anchor="middle" font-size="10" fill="#7D9386">${esc(formatDay(d))}</text>`;}).join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg health-rolling-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} mit rollendem beobachtetem Streubereich über ${windowDays} Tage">${ticks}${shapes.join('')}${lines.join('')}${circles}${dateLabels}</svg></div><div class="insight-legend"><span><i style="background:${color}"></i>Messpunkte & rollender Median</span><span><i style="background:${color};opacity:.3"></i>Rollendes 20.–80. Perzentil (${windowDays} Tage)</span></div><p class="insight-figure-note">${derived.length} gemessene Tage; Band an ${band.length} Tagen mit mindestens ${minPoints} Messwerten im zurückliegenden ${windowDays}-Tage-Fenster. Kein 95%-Konfidenzintervall und keine klinische Referenz; Lücken bleiben Lücken.</p>`;
}
/** Plot recorded components on ONE kg axis; fat, muscle and water are overlapping compartments, not additive. */
export function fitdaysCompositionChart(rows=[],selected='composition',windowDays=14){
 const all=[...new Map((rows||[]).filter(x=>finite(x.weightKg)&&x.weightKg>0).sort((a,b)=>String(a.at).localeCompare(String(b.at))).map(x=>[x.day,x])).values()].sort((a,b)=>a.day.localeCompare(b.day));
 if(!all.length)return '<p class="insight-no-data">Noch keine Gewichtsmessungen.</p>';
 if(selected==='stacked')return fatAndLeanStack(all);
 const WATER='water';const components=selected===WATER?[{key:'waterKg',label:'Körperwasser (aus % berechnet)',color:'#4B8EB5'}]:[
 {key:'fatMassKg',label:'Fettmasse',color:'#C38259'},{key:'muscleKg',label:'Muskelmasse',color:'#6D79B6'}];
 const converted=all.map(x=>({...x,fatMassKg:finite(x.fatMassKg)?x.fatMassKg:finite(x.bodyFatPct)?x.weightKg*x.bodyFatPct/100:null,
  waterKg:finite(x.waterPct)?x.weightKg*x.waterPct/100:null}));
 const vals=converted.flatMap(x=>[x.weightKg,...components.map(c=>x[c.key])].filter(finite));const lo=0,hi=Math.max(1,...vals)*1.08;
 const W=860,H=305,L=55,R=20,T=22,B=53,w=W-L-R,h=H-T-B;
 const d0=stamp(converted[0].day),d1=Math.max(d0+86400000,stamp(converted.at(-1).day));
 const X=v=>L+(stamp(v.day)-d0)/(d1-d0)*w,Y=v=>T+h-v/hi*h;
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" x2="${W-R}" y1="${Y(hi*t)}" y2="${Y(hi*t)}" stroke="#DFE9E2"/><text x="${L-8}" y="${Y(hi*t)+4}" font-size="11" text-anchor="end" fill="#86968B">${(hi*t).toFixed(0)}</text>`).join('');
 const width=Math.max(2,Math.min(9,w/converted.length*.30));const col=converted.map(x=>components.map((c,j)=>Number.isFinite(x[c.key])?`<rect x="${X(x)+(j-(components.length-1)/2)*(width+1)-width/2}" y="${Y(x[c.key])}" width="${width}" height="${T+h-Y(x[c.key])}" fill="${c.color}" fill-opacity=".44"><title>${esc(x.day)}: ${esc(c.label)} ${x[c.key].toFixed(1)} kg (separat, nicht gestapelt)</title></rect>`:'').join('')).join('');
 const segments=[];for(let i=1;i<converted.length;i++)if(stamp(converted[i].day)-stamp(converted[i-1].day)<=Math.max(windowDays,21)*86400000)segments.push(`<line x1="${X(converted[i-1])}" x2="${X(converted[i])}" y1="${Y(converted[i-1].weightKg)}" y2="${Y(converted[i].weightKg)}" stroke="#2D806D" stroke-width="2.7"/>`);
 const dots=converted.slice(-240).map(x=>`<circle cx="${X(x)}" cy="${Y(x.weightKg)}" r="3.7" fill="#2D806D"><title>${esc(x.day)}: Gesamtgewicht ${x.weightKg.toFixed(1)} kg</title></circle>`).join('');
 const dates=[0,.25,.5,.75,1].map(t=>{const d=new Date(d0+(d1-d0)*t).toISOString().slice(0,10);return `<text x="${L+w*t}" y="${H-18}" font-size="11" text-anchor="middle" fill="#778C81">${esc(formatDay(d))}</text>`;}).join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg health-composition-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Fitdays Gesamtgewicht mit ${esc(components.map(x=>x.label).join(' und '))} auf gemeinsamer Kilogrammskala">${grid}${col}${segments.join('')}${dots}${dates}<text x="${L}" y="${H-2}" fill="#708579" font-size="11">kg · Kalenderjahre in der Zeitachse</text></svg></div><div class="insight-legend"><span><i style="background:#2D806D"></i>Gesamtgewicht</span>${components.map(x=>`<span><i style="background:${x.color}"></i>${esc(x.label)}</span>`).join('')}</div><p class="insight-figure-note">Gemeinsame kg-Skala. Fett, Muskeln und Wasser sind physiologisch überlappende Größen und werden deshalb <strong>nicht addiert oder gestapelt</strong>. Wasser wird aus Gewicht × Wasseranteil geschätzt. Lücken sind nicht aufgefüllt.</p>`;
}

/** Mutually exclusive total: fat mass + derived fat-free mass = body weight.
 * Muscle/water/protein overlap fat-free mass and MUST NOT be added as separate layers. */
export function fatAndLeanStack(rows=[]){
 const all=[...new Map((rows||[]).filter(r=>finite(r.weightKg)&&r.weightKg>0&&finite(r.fatMassKg??r.bodyFatPct)).sort((a,b)=>String(a.at).localeCompare(String(b.at))).map(r=>[r.day,r])).values()].sort((a,b)=>a.day.localeCompare(b.day));
 if(!all.length)return '<p class="insight-no-data">Für eine gestapelte Körperzusammensetzung fehlen Körperfettmessungen.</p>';
 const values=all.map(r=>{const fat=finite(r.fatMassKg)?r.fatMassKg:r.weightKg*r.bodyFatPct/100;return {...r,fat,lean:r.weightKg-fat};}).filter(r=>r.fat>=0&&r.lean>=0&&r.fat<=r.weightKg);
 if(!values.length)return '<p class="insight-no-data">Keine gültige Fett-/Fettfrei-Aufteilung.</p>';
 const W=850,H=302,L=57,R=24,T=22,B=50,w=W-L-R,h=H-T-B,max=Math.max(1,...values.map(v=>v.weightKg))*1.08;
 const dateA=stamp(values[0].day),dateB=Math.max(dateA+86400000,stamp(values.at(-1).day));
 const X=v=>L+(stamp(v.day)-dateA)/(dateB-dateA)*w,Y=v=>T+h-v/max*h;
 const width=Math.max(2,Math.min(15,w/values.length*.55));
 const bars=values.map(r=>`<g><rect x="${(X(r)-width/2).toFixed(2)}" y="${Y(r.lean).toFixed(2)}" width="${width}" height="${(Y(0)-Y(r.lean)).toFixed(2)}" fill="#5EA98E" opacity=".78"/><rect x="${(X(r)-width/2).toFixed(2)}" y="${Y(r.weightKg).toFixed(2)}" width="${width}" height="${(Y(r.lean)-Y(r.weightKg)).toFixed(2)}" fill="#D8A17C" opacity=".88"/><circle cx="${X(r)}" cy="${Y(r.weightKg)}" r="3.1" fill="#2B786A"><title>${esc(r.day)} · Gewicht: ${r.weightKg.toFixed(1)} kg · Fettfrei: ${r.lean.toFixed(1)} kg · Fett: ${r.fat.toFixed(1)} kg</title></circle></g>`).join('');
 const lines=[];for(let i=1;i<values.length;i++)if(stamp(values[i].day)-stamp(values[i-1].day)<=21*86400000)lines.push(`<line x1="${X(values[i-1])}" y1="${Y(values[i-1].weightKg)}" x2="${X(values[i])}" y2="${Y(values[i].weightKg)}" stroke="#2B786A" stroke-width="2.3"/>`);
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" x2="${W-R}" y1="${Y(max*t)}" y2="${Y(max*t)}" stroke="#DFE9E3"/><text x="${L-7}" y="${Y(max*t)+4}" text-anchor="end" font-size="11" fill="#789186">${(max*t).toFixed(0)}</text>`).join('');
 const dates=[0,.25,.5,.75,1].map(t=>{const day=new Date(dateA+(dateB-dateA)*t).toISOString().slice(0,10);return `<text x="${L+w*t}" y="${H-15}" fill="#768D81" font-size="11" text-anchor="middle">${esc(formatDay(day))}</text>`;}).join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Fettmasse und fettfreie Masse als echte gestapelte Komponenten des Körpergewichts">${grid}${bars}${lines.join('')}${dates}</svg></div><div class="insight-legend"><span><i style="background:#5EA98E"></i>Fettfreie Masse (berechnet)</span><span><i style="background:#D8A17C"></i>Fettmasse</span><span><i style="background:#2B786A"></i>Gesamtgewicht</span></div><p class="insight-figure-note">Die einzige zulässige Addition hier ist <strong>Fettmasse + fettfreie Masse = Gesamtgewicht</strong>. Fettfreie Masse ist ein berechneter Restwert und enthält unter anderem Muskeln, Wasser, Knochen und Protein; diese Größen dürfen nicht zusätzlich aufgestapelt werden. BIA-Werte sind geräteabhängige Schätzungen.</p>`;
}
