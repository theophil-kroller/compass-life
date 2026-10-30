/** Compass .40.25.22 · dynamically scaled, illustrative body-fat mass comparison.
 * All numerical values are derived from the user's selected Fitdays observations;
 * the tissue motif is a stylized illustration, not a volumetric/anatomical scan.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const val=(row,k)=>Number.isFinite(row?.[k])?row[k]:null;
const fmt=(n,d=1)=>Number(n).toLocaleString('de-AT',{minimumFractionDigits:d,maximumFractionDigits:d});
const motif=(typeof import.meta.env?.BASE_URL==='string'?import.meta.env.BASE_URL:'/')+'compass-fat-tissue-v57759402522.webp';
export function fatMassPoints(rows=[]){
 return (Array.isArray(rows)?rows:[]).filter(row=>{
  const weight=val(row,'weightKg'),fat=val(row,'bodyFatPct');
  return weight!==null&&weight>25&&weight<=350&&fat!==null&&fat>0&&fat<75&&/^\d{4}-\d{2}-\d{2}/.test(String(row.at||''));
 }).map(row=>({day:row.day||String(row.at).slice(0,10),at:row.at,weightKg:row.weightKg,bodyFatPct:row.bodyFatPct,
  fatKg:Math.round(row.weightKg*row.bodyFatPct/100*100)/100,
  fatFreeKg:Math.round(row.weightKg*(1-row.bodyFatPct/100)*100)/100}))
 .sort((a,b)=>a.at.localeCompare(b.at));
}
function makeTrend(points){
 if(points.length<2)return '<p class="cfat-trend-empty">Für einen Verlauf sind mindestens zwei echte Fitdays-Messungen nötig.</p>';
 const series=points.slice(-80); const all=series.map(p=>p.fatKg);
 const lo=Math.max(0,Math.min(...all)-.7),hi=Math.max(lo+1,Math.max(...all)+.7);
 const times=series.map(p=>Date.parse(p.at));const min=Math.min(...times),max=Math.max(...times);const W=770,H=104,L=18,R=20,T=15,B=24;
 const X=(t,i)=>max===min?L+(W-L-R)*i/Math.max(1,series.length-1):L+(W-L-R)*(t-min)/(max-min);
 const Y=n=>T+(H-T-B)*(hi-n)/(hi-lo);
 const xs=series.map((p,i)=>X(times[i],i)),ys=series.map(p=>Y(p.fatKg));
 const dots=series.map((p,i)=>`<circle cx="${xs[i].toFixed(1)}" cy="${ys[i].toFixed(1)}" r="3.8" fill="#247d78"><title>${esc(p.day)}: ${fmt(p.fatKg)} kg</title></circle>`).join('');
 const path=series.length>=2?`<path d="M ${series.map((_,i)=>`${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`).join(' L ')}" stroke="#32887e" stroke-width="2" fill="none"/>`:'';
 const first=series[0],last=series.at(-1),diff=Math.round((last.fatKg-first.fatKg)*10)/10;
 return `<div class="cfat-history"><div class="cfat-history-head"><strong>Fettmasse · einzelne Messpunkte</strong><span>${diff>0?'+':''}${fmt(diff)} kg seit ${esc(first.day)}</span></div><svg class="cfat-history-plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="Verlauf der berechneten Fettmasse von ${fmt(first.fatKg)} bis ${fmt(last.fatKg)} Kilogramm"><line x1="${L}" x2="${W-R}" y1="${Y(lo).toFixed(1)}" y2="${Y(lo).toFixed(1)}" stroke="#e0eae4"/>${path}${dots}<text x="${L}" y="${H-5}" fill="#657b74" font-size="11">${esc(first.day)}</text><text x="${W-R}" y="${H-5}" text-anchor="end" fill="#657b74" font-size="11">${esc(last.day)}</text></svg></div>`;
}
export function fatMassVisualView(rows=[]){
 const points=fatMassPoints(rows),latest=points.at(-1);
 if(!latest)return '';
 const {weightKg:weight,fatKg,fatFreeKg,bodyFatPct:fat}=latest;
 const fixed=[2.5,5,10,15,25,30];
 const items=[...fixed.map(kg=>({kg,current:false})),{kg:fatKg,current:true}].sort((a,b)=>a.kg-b.kg||Number(a.current)-Number(b.current));
 const scale=kg=>Math.max(.34,Math.min(1.3,Math.cbrt(kg/30)));
 return `<section class="cfat-root" aria-label="Körperfettmenge anschaulich vergleichen" id="body-fat-illustration">
  <div class="cfat-top"><div><span class="cfat-kicker">FITDAYS · FETTMASSE</span><h3>Wie viel Körperfett ist das?</h3><p>Vergleich mit gleichartig dargestellten Mengen. Die Zahlen passen sich deinen Fitdays-Messungen automatisch an.</p></div><div class="cfat-hero"><span>Aktuelle Fettmasse</span><strong>${fmt(fatKg)} kg</strong><small>${fmt(fat)} % von ${fmt(weight)} kg · ${esc(latest.day)}</small></div></div>
  <div class="cfat-lineup" role="list" aria-label="Fettmassen im Vergleich">${items.map(item=>{
   const s=scale(item.kg),pct=item.kg/weight*100;
   return `<div role="listitem" class="cfat-item ${item.current?'cfat-current':''}" ${item.current?'aria-current="true"':''}>
    <div class="cfat-item-caption">${item.current?'● Dein Messwert':'&nbsp;'}</div>
    <div class="cfat-blob-stage"><img src="${motif}" alt="" loading="lazy" style="transform:scale(${s.toFixed(3)})"/></div>
    <strong>${fmt(item.kg)} kg</strong><small>≈ ${fmt(pct)} %</small></div>`;
  }).join('')}</div>
  <div class="cfat-metrics"><div class="cfat-ring" role="img" aria-label="${fmt(fat)} Prozent Fettmasse, ${fmt(100-fat)} Prozent fettfreie Masse" style="--fat:${Math.min(100,Math.max(0,fat)).toFixed(2)}%"><div><strong>${fmt(weight)} kg</strong><span>Gesamt</span></div></div><div class="cfat-data"><div><i class="cfat-dot-fat"></i><span>Fettmasse</span><strong>${fmt(fatKg)} kg · ${fmt(fat)} %</strong></div><div><i class="cfat-dot-free"></i><span>Fettfreie Masse</span><strong>${fmt(fatFreeKg)} kg · ${fmt(100-fat)} %</strong></div><p>Fettfreie Masse enthält auch Wasser, Organe und Knochen – nicht nur Muskeln.</p></div></div>
  ${makeTrend(points)}
  <p class="cfat-note">Illustration zur Größenordnung, <strong>nicht maßstabsgetreu</strong>: Form, Dichte und Verteilung von Körperfett variieren. Fettmasse aus Gewicht × BIA-Körperfettanteil berechnet. Alle Vergleichsprozente beziehen sich auf dein aktuelles Gewicht; keine medizinische Risikoeinstufung.</p>
 </section>`;
}
