/** Compass 0.5.17.1 · aligned, explicitly dated, local period comparisons.
 * The chord connects the same spending category between periods, NOT real cash
 * transferred between categories. No inference of balance or full account coverage.
 */
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const q=x=>Math.round(x*100)/100;
const validDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d||''));
const toDate=d=>new Date(d+'T12:00:00Z');
const stamp=d=>d.toISOString().slice(0,10);
const diff=(a,b)=>Math.round((toDate(b)-toDate(a))/86400000);
const addDays=(d,n)=>stamp(new Date(toDate(d).getTime()+n*864e5));
const addMonths=(d,n)=>{const x=toDate(d),day=x.getUTCDate();x.setUTCDate(1);x.setUTCMonth(x.getUTCMonth()+n);const max=new Date(Date.UTC(x.getUTCFullYear(),x.getUTCMonth()+1,0)).getUTCDate();x.setUTCDate(Math.min(day,max));return stamp(x);};
const firstMonth=d=>d.slice(0,7)+'-01';
const seasonStart=d=>{const x=toDate(d),m=x.getUTCMonth();const first=m<2?11:m<5?2:m<8?5:m<11?8:11;return stamp(new Date(Date.UTC(x.getUTCFullYear()+(m<2?-1:0),first,1)));};
const quarterStart=d=>{const x=toDate(d);return stamp(new Date(Date.UTC(x.getUTCFullYear(),Math.floor(x.getUTCMonth()/3)*3,1)));};
const scope=(rows,start,end)=>rows.filter(t=>validDay(t.day)&&t.day>=start&&t.day<=end);
export const COMPARISONS=[
 {id:'month_year',label:'Dieser Monat ↔ gleicher Monat Vorjahr'},
 {id:'month_prev',label:'Dieser Monat ↔ Vormonat'},
 {id:'month_annual',label:'Dieser Monat ↔ Ø letzte 12 Monate'},
 {id:'quarter_prev',label:'Quartal ↔ Vorquartal'},
 {id:'quarter_year',label:'Quartal ↔ Vorjahresquartal'},
 {id:'season_year',label:'Jahreszeit ↔ Vorjahr'},
 {id:'year_year',label:'Jahr ↔ Vorjahr'}
];
export function comparisonPeriods(rows=[],mode='month_year',now=new Date().toLocaleDateString('sv-SE')){
 const today=validDay(now)?now:new Date().toISOString().slice(0,10);
 let start=firstMonth(today),end=today,baseline=addMonths(start,-12),title='Monat zum gleichen Zeitraum im Vorjahr',scale=1,referencePeriod='';
 if(mode==='month_prev'){baseline=addMonths(start,-1);title='Monat zum Vormonat (gleiche Anzahl Kalendertage)';}
 if(mode==='quarter_prev'||mode==='quarter_year'){start=quarterStart(today);baseline=addMonths(start,mode==='quarter_prev'?-3:-12);title=mode==='quarter_prev'?'Laufendes Quartal gegenüber Vorquartal':'Laufendes Quartal gegenüber dem Vorjahresquartal';}
 if(mode==='season_year'){start=seasonStart(today);baseline=addMonths(start,-12);title='Meteorologische Jahreszeit zum Vorjahr (gleiche Tageszahl)';}
 if(mode==='year_year'){start=today.slice(0,4)+'-01-01';baseline=(Number(today.slice(0,4))-1)+'-01-01';title='Laufendes Jahr zum Vorjahr (gleiche Tageszahl)';}
 const span=diff(start,end),referenceEnd=addDays(baseline,span);
 if(mode==='month_annual'){
  const selected=[];const observed=[];for(let i=1;i<=12;i++){const m=addMonths(start,-i),endOfMonth=stamp(new Date(Date.UTC(Number(m.slice(0,4)),Number(m.slice(5)),0))),last=addDays(m,span)>endOfMonth?endOfMonth:addDays(m,span),subset=scope(rows,m,last);if(subset.length){observed.push([m,last]);selected.push(...subset.map(x=>({...x,amountCents:x.amountCents/12})));}}
  // Use mean over observed comparable months, rather than assuming missing months are zero.
  const n=observed.length,adjusted=selected.map(t=>({...t,amountCents:t.amountCents*(12/Math.max(n,1))}));
  return {label:title,a:scope(rows,start,end),b:adjusted,aStart:start,aEnd:end,bStart:observed.at(-1)?.[0]||null,bEnd:observed[0]?.[1]||null,bLabel:`Ø ${n} beobachtete Vorperioden (identische Tage im Monat)`,aLabel:`${start} – ${end}`,bCount:n,comparable:n>=6,mode,coverage:'Vergleich mit den gleichen Kalendertagen in bis zu zwölf zurückliegenden Monaten; Monate ohne Buchungen werden nicht als Null gerechnet.'};
 }
 const a=scope(rows,start,end),b=scope(rows,baseline,referenceEnd);
 return {label:title,a,b,aStart:start,aEnd:end,bStart:baseline,bEnd:referenceEnd,aLabel:`${start} – ${end}`,bLabel:`${baseline} – ${referenceEnd}`,bCount:b.length,comparable:b.length>0&&a.length>0,mode,coverage:'Zeitfenster enthalten dieselbe Anzahl Kalendertage (bei Vorjahresvergleichen mit möglicher Schaltjahrverschiebung). Bankimporte können unvollständig sein.'};
}
const isExpense=t=>t&&!t.needsReview&&t.flow==='expense'&&Number.isFinite(t.amountCents)&&t.amountCents<0;
export function categoryTotals(rows=[]){const sums=new Map();for(const t of rows){if(!isExpense(t))continue;const k=String(t.category||'Sonstiges').split(' / ')[0];sums.set(k,(sums.get(k)||0)-t.amountCents);}return sums;}
const pal=['#408D81','#D5A058','#708FB8','#C07D77','#896CAE','#69A69E','#B984A2','#91A86A','#D1A978','#648A8C'];
function indexed(pair){const A=categoryTotals(pair.a),B=categoryTotals(pair.b);const keys=[...new Set([...A.keys(),...B.keys()])].sort((a,b)=>(A.get(b)||0)+(B.get(b)||0)-(A.get(a)||0)-(B.get(a)||0));return keys.slice(0,10).map((name,i)=>({name,a:A.get(name)||0,b:B.get(name)||0,color:pal[i%pal.length]}));}
const polar=(cx,cy,r,a)=>[cx+r*Math.sin(a),cy-r*Math.cos(a)];
const sector=(cx,cy,inside,outside,a,b)=>{if(b-a<1e-7)return '';const wide=b-a>Math.PI?1:0,points=[polar(cx,cy,outside,a),polar(cx,cy,outside,b),polar(cx,cy,inside,b),polar(cx,cy,inside,a)];return `M${q(points[0][0])},${q(points[0][1])} A${outside},${outside} 0 ${wide} 1 ${q(points[1][0])},${q(points[1][1])} L${q(points[2][0])},${q(points[2][1])} A${inside},${inside} 0 ${wide} 0 ${q(points[3][0])},${q(points[3][1])} Z`;};
export function comparisonChord(pair){if(!pair.comparable)return '<p class="insight-no-data">Für den Vergleich fehlen Buchungen in einem der Zeiträume. Es werden keine fehlenden Werte ergänzt.</p>';
 const data=indexed(pair);if(!data.length)return '<p class="insight-no-data">Keine vergleichbaren kategorisierten Konsumausgaben.</p>';
 const sa=data.reduce((s,r)=>s+r.a,0)||1,sb=data.reduce((s,r)=>s+r.b,0)||1,cx=415,cy=260;
 let a=Math.PI+.025,b=.025;const ribbons=[],arcs=[];
 for(const c of data){const na=a+(Math.PI-.05)*c.a/sa,nb=b+(Math.PI-.05)*c.b/sb,la=polar(cx,cy,178,a),lb=polar(cx,cy,178,na),ra=polar(cx,cy,178,b),rb=polar(cx,cy,178,nb);arcs.push(`<path d="${sector(cx,cy,182,207,a,na)}" fill="${c.color}"/><path d="${sector(cx,cy,182,207,b,nb)}" fill="${c.color}" opacity=".7"/>`);
  if(c.a>0&&c.b>0)ribbons.push(`<path d="M${q(la[0])} ${q(la[1])} Q${cx},${cy} ${q(ra[0])},${q(ra[1])} L${q(rb[0])},${q(rb[1])} Q${cx},${cy} ${q(lb[0])},${q(lb[1])} Z" fill="${c.color}" opacity=".36"><title>${h(c.name)}: ${h(pair.bLabel)} ${h(eur(c.b))} → ${h(pair.aLabel)} ${h(eur(c.a))}</title></path>`);
  a=na;b=nb;
 }
 return `<div class="fin-radial-figure"><svg viewBox="0 0 850 540" role="img" aria-label="Chord-Vergleich der gleichen Ausgabenkategorien in zwei Zeiträumen"><text x="128" y="25" fill="#637E70" font-size="13">A · ${h(pair.aLabel)}</text><text x="520" y="25" fill="#637E70" font-size="13">B · ${h(pair.bLabel)}</text>${ribbons.join('')}${arcs.join('')}<circle cx="${cx}" cy="${cy}" r="49" fill="#F7FAF8"/><text x="${cx}" y="${cy}" text-anchor="middle" fill="#345F50" font-size="13">Perioden</text></svg></div><div class="fin-comparison-legend">${data.map(r=>`<div><i style="background:${r.color}"></i><span>${h(r.name)}</span><span>${h(eur(r.a))}</span><span>${h(eur(r.b))}</span></div>`).join('')}</div><p class="fin-art-note">Chord-Diagramm = dieselbe Kategorie in Periode A und B. Die Bänder sind <strong>keine</strong> Geldflüsse zwischen Kategorien, sondern visuelle Verbindungen für den Vergleich. Links (A) und rechts (B) haben jeweils ihre eigene Betragsbasis.</p>`;
}
export function comparisonRadar(pair){if(!pair.comparable)return '<p class="insight-no-data">Nicht genug Daten zum Vergleich.</p>';
 const data=indexed(pair).filter(r=>r.b>0).slice(0,8);if(data.length<3)return '<p class="insight-no-data">Radar benötigt mindestens drei Kategorien mit Buchungen in der Vergleichsperiode.</p>';
 const cx=345,cy=260,R=166,axes=data.length,maxRatio=2.5,pt=(i,ratio)=>{const a=-Math.PI/2+2*Math.PI*i/axes,r=R*Math.min(maxRatio,ratio)/maxRatio;return [q(cx+r*Math.cos(a)),q(cy+r*Math.sin(a))];};
 const rings=[.5,1,1.5,2,2.5].map((t,k)=>`<polygon points="${data.map((_,i)=>pt(i,t).join(',')).join(' ')}" stroke="${t===1?'#368E82':'#E3EDE5'}" stroke-width="${t===1?2:1}" fill="none"/><text x="670" y="${120+k*21}" font-size="12" fill="#779082">${Math.round(t*100)} %</text>`).join('');
 const ratios=data.map(c=>c.a/c.b),coords=ratios.map((t,i)=>pt(i,t).join(','));
 return `<div class="fin-radial-figure"><svg viewBox="0 0 840 535" role="img" aria-label="Radar-Vergleich: je Kategorie 100 Prozent entspricht der Vorperiode">${rings}${data.map((v,i)=>{const p=pt(i,2.65),end=pt(i,2.5);return `<line x1="${cx}" y1="${cy}" x2="${end[0]}" y2="${end[1]}" stroke="#E6EEE8"/><text x="${p[0]}" y="${p[1]}" text-anchor="middle" font-size="11" fill="currentColor">${h(v.name.length>18?v.name.slice(0,17)+'…':v.name)}</text>`;}).join('')}<polygon points="${coords.join(' ')}" fill="#D58E7C" fill-opacity=".30" stroke="#C36B58" stroke-width="3"/>${ratios.map((ratio,i)=>`<circle cx="${pt(i,ratio)[0]}" cy="${pt(i,ratio)[1]}" r="4" fill="#C36B58"><title>${h(data[i].name)}: ${h(eur(data[i].a))} gegenüber ${h(eur(data[i].b))} · ${Math.round(ratio*100)} %</title></circle>`).join('')}</svg></div><p class="fin-art-note">Radar: 100 % ist für jede Kategorie der Wert der Vergleichsperiode. Die orange Fläche zeigt die aktuelle Periode relativ dazu. Die Achsen sind bei 250 % gekappt, echte Werte stehen im Tooltip. Kategorien ohne Referenzwert werden ausgeschlossen; Vergleiche sind keine Ausgabenempfehlung.</p>`;
}
export function comparisonSummary(pair){
 const sum=r=>r.filter(isExpense).reduce((a,t)=>a-t.amountCents,0),a=sum(pair.a),b=sum(pair.b),change=b?100*(a-b)/b:null;
 return `<div class="fin-period-summary"><div><small>Periode A</small><strong>${h(pair.aLabel)}</strong><b>${h(eur(a))}</b></div><div><small>Periode B</small><strong>${h(pair.bLabel)}</strong><b>${h(eur(b))}</b></div><div><small>Veränderung</small><strong>${change===null?'Nicht berechenbar':(change>=0?'+':'')+change.toLocaleString('de-AT',{maximumFractionDigits:1})+' %'}</strong><span>${pair.comparable?'Kategorisierter Konsum':'Unzureichende Abdeckung'}</span></div></div><p class="fin-art-note">${h(pair.label)}. ${h(pair.coverage)} Die Vergleichssummen enthalten keine Bargeldverwendung, Transfers oder ungeklärten Buchungen.</p>`;
}
