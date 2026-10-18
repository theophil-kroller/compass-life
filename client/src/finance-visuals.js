import {hierarchicalSankey} from './finance-exotic-hierarchy.js';
/** Compass 0.5.17 — Monarch-inspired, original SVG visualizations with local-only data.
 * Color conveys amount relative to user's own history, not a moral judgement.
 */
import {financeCategorySeries,financialSnapshot,financeCategory} from './finance-visual-model.js';
import {financeMonthlySeries,monthDistance} from './finance-analytics.js';
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const amt=(c)=>Number(c/100).toLocaleString('de-AT',{maximumFractionDigits:0});
const pct=n=>`${(n*100).toLocaleString('de-AT',{maximumFractionDigits:1})} %`;
const palette=['#367D73','#F1B34B','#7E9CC5','#D47A6F','#806BAA','#60A899','#D79E62','#6595B7','#B9859A','#B2AF83','#8798A2','#C2A88E'];
const icons={'Lebensmittel':'🛒','Wohnen':'⌂','Shopping':'◈','Familie':'♡','Gesundheit & Sport':'✦','Essen & Ausgehen':'☕','Freizeit & Reisen':'✈','Mobilität':'↗','Bildung & Beruf':'▤','Verträge & Abos':'⌁','Finanzen':'€','Sonstiges':'◇','Einnahmen':'↓','Transfer':'⇄'};
const categoryIcon=x=>icons[x]||'◉';
const definedMoney=(n)=>Number.isFinite(n)?euro(n):'–';
const zero=(n)=>Number.isFinite(n)?n:0;
const groupExpense=(rows=[])=>{const map=new Map();for(const t of rows){if(t?.needsReview||t?.flow!=='expense'||!(t.amountCents<0))continue;const k=financeCategory(t);map.set(k,(map.get(k)||0)-t.amountCents);}return [...map].map(([name,cents])=>({name,cents})).sort((a,b)=>b.cents-a.cents).map((c,i)=>({...c,color:palette[i%palette.length]}));};
const safeId=(s)=>String(s).normalize('NFKD').replace(/[^A-Za-z0-9]+/g,'-').slice(0,25);
const numberOrDash=v=>Number.isFinite(v)?euro(v):'–';
const select=(name)=>`data-action="finance-category-select" data-id="${h(name)}" tabindex="0" role="button"`;
const empty=(label)=>`<div class="fin-art-empty">${h(label)}</div>`;
const round=x=>Math.round(x*100)/100;
export function categoryInsightCards(all=[],today=new Date().toLocaleDateString('sv-SE'),selected=''){
 const aggregate=groupExpense(all),preferred=['Lebensmittel','Wohnen','Gesundheit & Sport','Shopping','Freizeit & Reisen','Familie','Essen & Ausgehen'];
 const keys=[...new Set([...preferred.filter(c=>aggregate.some(x=>x.name===c)),...aggregate.map(x=>x.name)])].slice(0,9);
 if(!keys.length)return empty('Noch keine kategorisierten Ausgaben für persönliche Vergleiche vorhanden.');
 const cards=keys.map((key,i)=>{
  const o=financeCategorySeries(all,key,today),max=Math.max(o.p80||0,(o.mean||0)*1.8,(o.forecast||o.spent)*1.12,10000),X=n=>Math.max(0,Math.min(100,100*n/max));
  const id=`grad-category-${i}`,p=o.forecast??o.spent,center=o.mean===null?null:X(o.mean),marker=X(p),q0=o.p20===null?null:X(o.p20),q1=o.p80===null?null:X(o.p80);
  const tier=!o.n||o.n<6?'neutral':o.forecast==null?'neutral':o.forecast>o.p80?'high':o.forecast<o.p20?'low':'typical';
  const icon=categoryIcon(key),trend=o.status==='Steigend'?'↗':o.status==='Sinkend'?'↘':o.status==='Stabil'?'→':'·';
  return `<article class="fin-pattern-card ${selected===key?'is-selected':''}" ${select(key)} aria-label="${h(key)}: Durchschnitt ${h(numberOrDash(o.mean))}, ${h(o.position)}">
   <div class="fin-pattern-heading"><span class="fin-pattern-icon" style="--pattern-accent:${palette[i%palette.length]}">${h(icon)}</span><span><strong>${h(key)}</strong><small>${o.n} von 12 Referenzmonaten erfasst</small></span><span class="fin-pattern-trend">${trend} ${h(o.status)}</span></div>
   <div class="fin-pattern-metrics"><div><small>Ø / Monat</small><strong>${h(numberOrDash(o.mean))}</strong></div><div><small>${o.forecast!==null?'Prognose aktuell':'Bisher im Monat'}</small><strong>${h(euro(p))}</strong></div></div>
   <svg class="fin-pattern-svg" viewBox="0 0 420 83" role="img" aria-label="Ausgabenskala dunkelgrün bis rot. ${h(o.position)}.">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#155B48"/><stop offset=".29" stop-color="#26876E"/><stop offset=".51" stop-color="#79B98F"/><stop offset=".7" stop-color="#E7B15E"/><stop offset=".86" stop-color="#E67D4C"/><stop offset="1" stop-color="#B93D52"/></linearGradient></defs>
    <rect x="8" y="21" width="404" height="19" rx="9" fill="url(#${id})"/>
    ${q0!==null?`<rect x="${8+404*q0/100}" y="18" width="${Math.max(2,404*(q1-q0)/100)}" height="25" rx="5" fill="none" stroke="#23493E" stroke-width="1.7" stroke-dasharray="4 3"/>`:''}
    ${center!==null?`<line x1="${8+404*center/100}" y1="12" x2="${8+404*center/100}" y2="49" stroke="#193C34" stroke-width="2.5"/>`:''}
    <path d="M${8+404*marker/100-7} 7 L${8+404*marker/100+7} 7 L${8+404*marker/100} 18 Z" fill="#203A34"/>
    <circle cx="${8+404*marker/100}" cy="30.5" r="8" fill="#FFF" stroke="#2F3432" stroke-width="2.5"/>
    <text x="8" y="67" font-size="11" fill="currentColor">0 €</text><text x="412" y="67" text-anchor="end" font-size="11" fill="currentColor">${h(euro(max))}</text>
   </svg><div class="fin-pattern-footer"><span class="fin-pattern-indicator ${tier}">${h(o.position)}</span><span>${o.p20!==null?`Üblich: ${h(euro(o.p20))}–${h(euro(o.p80))}`:'Für Vergleich mindestens 6 Referenzmonate'}</span></div>
  </article>`;
 });
 const extra='Die Skala verläuft von dunkelgrün (weit unter dem eigenen Mittel) über Grün und Orange bis Rot (deutlich darüber). Der gestrichelte Rahmen zeigt das 20.–80. Perzentil. Farben bewerten keine Ausgaben moralisch. Nur vorhandene Monatsbuchungen werden verwendet; fehlende Monate sind keine Nullwerte.';
 return `<section class="fin-visual-section"><div class="fin-art-heading"><div><small>PERSONAL PATTERNS / 12 MONATE</small><h3>Was ist bei mir üblich?</h3></div><span class="fin-art-tag">Vergleich ohne starres Budget</span></div><div class="fin-pattern-grid">${cards.join('')}</div><p class="fin-art-note">${extra} Die Prognose aus dem bisherigen Monat erscheint nur bei ausreichender Datenlage und regelmäßigen Monatsausgaben; sie bleibt vorläufig.</p></section>`;
}
function categoryLabel(name,cents,color){return `<button type="button" class="fin-viz-category" ${select(name)}><span class="fin-viz-dot" style="background:${color}"></span><span>${h(categoryIcon(name))} ${h(name)}</span><strong>${h(euro(cents))}</strong></button>`;}
export function financeDonut(rows=[],selected=''){
 const categories=groupExpense(rows),total=categories.reduce((a,b)=>a+b.cents,0);if(!total)return empty('Noch keine kategorisierten Konsumausgaben.');
 const sorted=categories.slice(0,8),rest=categories.slice(8).reduce((a,x)=>a+x.cents,0);if(rest)sorted.push({name:'Weitere',cents:rest,color:'#AAB5AE'});
 let off=0;const r=83,C=2*Math.PI*r;
 const rings=sorted.map(c=>{const len=c.cents/total*C,offset=off;off+=len;return `<circle cx="132" cy="130" r="83" fill="none" stroke="${c.color}" stroke-width="33" stroke-dasharray="${round(Math.max(0,len-1.3))} ${round(C)}" stroke-dashoffset="${round(-offset)}" transform="rotate(-90 132 130)" ${select(c.name)}><title>${h(c.name)}: ${h(euro(c.cents))}, ${h(pct(c.cents/total))}</title></circle>`;}).join('');
 const focused=categories.find(x=>x.name===selected);
 return `<div class="fin-donut-layout"><svg viewBox="0 0 265 260" class="fin-donut" role="img" aria-label="Ausgabenring nach Kategorien"><circle cx="132" cy="130" r="83" fill="none" stroke="#EEF2EE" stroke-width="33"/>${rings}<text x="132" y="125" text-anchor="middle" class="fin-svg-big">${h(euro(focused?.cents||total))}</text><text x="132" y="146" text-anchor="middle" class="fin-svg-small">${h(focused?.name||'Konsumausgaben')}</text></svg><div class="fin-viz-category-list">${categories.map((c,i)=>categoryLabel(c.name,c.cents,palette[categories.findIndex(x=>x.name===c.name)%palette.length])).join('')}</div></div>`;
}
// Balanced recursive tile layout: area is proportional to actual spend, no library or network calls.
function treemapLayout(items,x,y,w,h){if(!items.length)return [];if(items.length===1)return [{...items[0],x,y,w,h}];
 const total=items.reduce((s,c)=>s+c.cents,0);let index=1,s=items[0].cents;while(index<items.length-1&&s<total*.48){s+=items[index].cents;index++;}const ratio=s/total;
 return w>=h?[...treemapLayout(items.slice(0,index),x,y,w*ratio,h),...treemapLayout(items.slice(index),x+w*ratio,y,w*(1-ratio),h)]:[...treemapLayout(items.slice(0,index),x,y,w,h*ratio),...treemapLayout(items.slice(index),x,y+h*ratio,w,h*(1-ratio))];
}
export function financeTreemap(rows=[],selected=''){
 const categories=groupExpense(rows),total=categories.reduce((s,x)=>s+x.cents,0);if(!total)return empty('Noch keine kategorisierten Ausgaben für eine Treemap.');
 const shown=categories.slice(0,13).map((x,i)=>({...x,color:palette[i%palette.length]})),other=categories.slice(13).reduce((a,x)=>a+x.cents,0);if(other)shown.push({name:'Weitere',cents:other,color:'#A3B4AC'});
 const tiles=treemapLayout(shown,0,0,920,380);
 return `<div class="fin-treemap-shell"><svg viewBox="0 0 920 380" class="fin-treemap" role="img" aria-label="Treemap der Ausgaben, Rechteckfläche entspricht Ausgabebetrag">${tiles.map(t=>`<g ${select(t.name)} class="fin-treemap-tile ${t.name===selected?'active':''}"><rect x="${round(t.x+2)}" y="${round(t.y+2)}" width="${round(Math.max(0,t.w-4))}" height="${round(Math.max(0,t.h-4))}" rx="8" fill="${t.color}"/><title>${h(t.name)} · ${h(euro(t.cents))} · ${h(pct(t.cents/total))}</title>${t.w>98&&t.h>51?`<text x="${round(t.x+14)}" y="${round(t.y+23)}" font-size="14" font-weight="700" fill="#fff">${h(t.name.length>Math.floor(t.w/11)?t.name.slice(0,Math.floor(t.w/11)-1)+'…':t.name)}</text><text x="${round(t.x+14)}" y="${round(t.y+44)}" font-size="12" fill="#fff">${h(euro(t.cents))}</text>`:''}</g>`).join('')}</svg></div><p class="fin-art-note">Je größer die Fläche, desto höher die Ausgaben. Klicke auf eine Kategorie für Details.</p>`;
}
/** Three-stage Sankey: actual top categories and their classified subcategories. */
export function financeOutflowSankey(rows=[]){return hierarchicalSankey(rows);}
export function financeStackedArea(rows=[]){
 const months=financeMonthlySeries(rows),period=months.slice(-15);if(period.length<2)return empty('Für einen Ausgabenverlauf werden mindestens zwei Monate benötigt.');
 const ranked=new Map();period.forEach(m=>Object.entries(m.categories).forEach(([k,v])=>ranked.set(k,(ranked.get(k)||0)+v)));
 const top=[...ranked].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>k);const cats=[...top,'Weitere Kategorien'];
 const W=920,H=315,L=60,R=25,T=24,B=42,plotW=W-L-R,plotH=H-T-B,max=Math.max(...period.map(m=>m.expenseCents),10000);
 const X=i=>L+plotW*(i/Math.max(1,period.length-1)),Y=v=>T+plotH*(1-v/max);
 const segments=[];let segment=[];period.forEach((m,i)=>{if(i&&monthDistance(period[i-1].month,m.month)>1){segments.push(segment);segment=[];}segment.push({m,i});});if(segment.length)segments.push(segment);
 const layers=cats.map((cat,j)=>{const shape=segments.map(seg=>{
  const pts=seg.map(({m,i})=>{const lower=top.slice(0,j).reduce((s,k)=>s+(m.categories[k]||0),0),val=cat==='Weitere Kategorien'?Math.max(0,m.expenseCents-top.reduce((s,k)=>s+(m.categories[k]||0),0)):m.categories[cat]||0;return {x:X(i),lo:Y(lower),hi:Y(lower+val)};});
  const first=pts[0];return `M${round(first.x)} ${round(first.lo)} ${pts.map(x=>`L${round(x.x)} ${round(x.lo)}`).join(' ')} ${pts.slice().reverse().map(x=>`L${round(x.x)} ${round(x.hi)}`).join(' ')} Z`;
 }).join(' ');return `<path d="${shape}" fill="${palette[j%palette.length]}" opacity=".8"><title>${h(cat)}</title></path>`;}).join('');
 return `<div class="fin-viz-scroll"><svg viewBox="0 0 ${W} ${H}" class="fin-area-svg" role="img" aria-label="Gestapelte Ausgabenkategorien pro beobachtetem Monat">${[0,.25,.5,.75,1].map(t=>`<line x1="${L}" y1="${round(Y(t*max))}" x2="${W-R}" y2="${round(Y(t*max))}" stroke="#DEE8E1"/><text x="${L-9}" y="${round(Y(t*max)+3)}" text-anchor="end" font-size="11" fill="#7A8F81">${h(amt(t*max))}</text>`).join('')}${layers}${period.filter((m,i)=>i%Math.ceil(period.length/6)===0||i===period.length-1).map(m=>`<text x="${round(X(period.indexOf(m)))}" y="${H-13}" text-anchor="middle" fill="#657D6D" font-size="11">${h(m.month.slice(2))}</text>`).join('')}</svg></div><div class="fin-mini-legend">${cats.map((cat,i)=>`<span><i style="background:${palette[i%palette.length]}"></i>${h(cat)}</span>`).join('')}</div><p class="fin-art-note">Nur Monate mit vorhandenen Buchungen. Fehlende Monate werden nicht als Nullwerte interpoliert; Monatsgrenzen können unvollständig sein.</p>`;
}
export function financeWaterfall(rows=[]){
 if(!rows.length)return empty('Keine Buchungen für eine Monatsbrücke.');
 const sum=(fn)=>rows.filter(fn).reduce((s,x)=>s+x.amountCents,0),pending=t=>Boolean(t.needsReview),pos=t=>t.amountCents>0,neg=t=>t.amountCents<0;
 const groups=[['Einnahmen',sum(t=>!pending(t)&&t.flow==='income'&&pos(t)),'#38987B'],['Erstattungen',sum(t=>!pending(t)&&t.flow==='refund'&&pos(t)),'#7EAB99'],['Transfers ein',sum(t=>!pending(t)&&t.flow==='transfer'&&pos(t)),'#7794C6'],['Konsum',sum(t=>!pending(t)&&t.flow==='expense'&&neg(t)),'#D47A6F'],['Transfers aus',sum(t=>!pending(t)&&t.flow==='transfer'&&neg(t)),'#8877B3'],['Bargeld',sum(t=>!pending(t)&&t.flow==='cash'&&neg(t)),'#C9A66D'],['Ungeklärt',sum(t=>pending(t)),'#DCA46C']];
 const entries=groups.filter(x=>x[1]!==0);if(!entries.length)return empty('Keine auswertbaren Buchungen.');
 let running=0;const steps=entries.map(([name,amount,color])=>{const from=running;running+=amount;return {name,amount,color,from,to:running};});
 const vals=[0,running,...steps.flatMap(s=>[s.from,s.to])],min=Math.min(...vals),max=Math.max(...vals),scale=(max-min)||1,W=950,H=285,L=35,R=35,T=22,B=66,barW=Math.min(78,(W-L-R)/(steps.length+2)-20),x=i=>L+((W-L-R)/(steps.length+1))*(i+.55),y=v=>T+(H-T-B)*(max-v)/scale;
 const bars=steps.map((v,i)=>{const top=Math.min(y(v.from),y(v.to)),bottom=Math.max(y(v.from),y(v.to)),xx=x(i);return `<g><rect x="${round(xx)}" y="${round(top)}" width="${barW}" height="${Math.max(2,round(bottom-top))}" rx="4" fill="${v.color}"/><text x="${round(xx+barW/2)}" y="${round(Math.max(12,top-6))}" text-anchor="middle" font-size="11" fill="currentColor">${h(euro(v.amount))}</text><text x="${round(xx+barW/2)}" y="${H-27}" text-anchor="middle" font-size="11" fill="currentColor">${h(v.name)}</text></g>`;}).join('');
 const endX=x(steps.length);
 return `<div class="fin-viz-scroll"><svg viewBox="0 0 ${W} ${H}" class="fin-waterfall-svg" role="img" aria-label="Wasserfall der importierten Geldflüsse; kein Kontostand"><line x1="${L}" y1="${round(y(0))}" x2="${W-R}" y2="${round(y(0))}" stroke="#9FB0A8" stroke-dasharray="4 4"/>${bars}<rect x="${round(endX)}" y="${round(Math.min(y(0),y(running)))}" width="${barW}" height="${Math.max(2,round(Math.abs(y(running)-y(0))))}" rx="4" fill="#315B53"/><text x="${round(endX+barW/2)}" y="${round(Math.max(12,Math.min(y(0),y(running))-6))}" text-anchor="middle" font-size="11" fill="currentColor">${h(euro(running))}</text><text x="${round(endX+barW/2)}" y="${H-27}" text-anchor="middle" font-size="11" fill="currentColor">Netto</text></svg></div><p class="fin-art-note">Netto = Summe der importierten Buchungen in diesem Zeitraum (inklusive Transfers). Das ist weder Kontostand noch Gewinn oder verfügbare Ersparnis.</p>`;
}
export function financeForecastView(all=[],today=new Date().toLocaleDateString('sv-SE')){
 const m=financialSnapshot(all,today);if(!m.consecutive||m.averageExpense===null)return empty(`Für einen vorsichtigen Ausgaben-Forecast fehlen zusammenhängende Monatsdaten: ${m.observedMonths} Referenzmonate vorhanden, mindestens 6 zusammenhängende erforderlich.`);
 const mean=m.averageExpense,std=m.spread,history=m.months,lo=Math.max(0,mean-1.28*std),hi=mean+1.28*std;
 const W=920,H=305,L=65,R=25,T=25,B=45,allMonths=history.length+3,top=Math.max(hi*1.2,...history.map(x=>x.expenseCents),10000),X=i=>L+(W-L-R)*i/(allMonths-1),Y=v=>T+(H-T-B)*(1-v/top);
 const points=history.map((x,i)=>`${round(X(i))},${round(Y(x.expenseCents))}`).join(' ');
 const f0=history.length-1,poly=`${round(X(f0))},${round(Y(mean))} ${[1,2,3].map(j=>`${round(X(f0+j))},${round(Y(hi))}`).join(' ')} ${[3,2,1].map(j=>`${round(X(f0+j))},${round(Y(lo))}`).join(' ')}`;
 return `<div class="fin-forecast-head"><span class="fin-forecast-kpi">${h(euro(mean))}<small>Ø pro erfasstem Monat</small></span><span>Indikativer nächster Monat: <strong>${h(euro(lo))} – ${h(euro(hi))}</strong></span></div><div class="fin-viz-scroll"><svg viewBox="0 0 ${W} ${H}" class="fin-forecast-svg" role="img" aria-label="Historische Ausgaben mit vorläufigem Szenarioband für die nächsten drei Monate">${[0,.25,.5,.75,1].map(v=>`<line x1="${L}" x2="${W-R}" y1="${round(Y(top*v))}" y2="${round(Y(top*v))}" stroke="#E1EAE5"/><text x="${L-9}" y="${round(Y(top*v)+3)}" text-anchor="end" font-size="11" fill="#7A8F81">${h(amt(top*v))}</text>`).join('')}<polygon points="${poly}" fill="#7EA7B0" opacity=".25"/><polyline points="${points}" fill="none" stroke="#278C82" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${history.map((v,i)=>`<circle cx="${round(X(i))}" cy="${round(Y(v.expenseCents))}" r="3" fill="#278C82"><title>${h(v.month)} ${h(euro(v.expenseCents))}</title></circle>`).join('')}<line x1="${round(X(f0))}" y1="${round(Y(mean))}" x2="${round(X(f0+3))}" y2="${round(Y(mean))}" stroke="#A77355" stroke-width="3" stroke-dasharray="8 6"/><line x1="${round(X(f0)+10)}" x2="${round(X(f0)+10)}" y1="${T}" y2="${H-B}" stroke="#BDC9C1" stroke-dasharray="4 4"/>${history.filter((x,i)=>i%3===0).map(x=>`<text x="${round(X(history.indexOf(x)))}" y="${H-12}" font-size="11" text-anchor="middle" fill="#6A8072">${h(x.month.slice(2))}</text>`).join('')}<text x="${round(X(f0+2))}" y="${H-12}" text-anchor="middle" font-size="11" fill="#6A8072">Szenario →</text></svg></div><p class="fin-art-note">Das Band ist <strong>kein statistisch kalibriertes Konfidenzintervall</strong>. Es zeigt eine illustrative Spanne (Mittelwert ± 1,28 × Monatsstreuung), ohne Fixkosten, geplante Reisen oder saisonale Effekte zuverlässig vorherzusagen. Eine überprüfte Prognosemethodik folgt in 0.5.18.</p>`;
}
export function financeIncomeView(rows=[]){
 const m=new Map();for(const t of rows){if(t.needsReview||t.flow!=='income'||t.amountCents<=0)continue;const k=String(t.category||'Einnahmen / Sonstiges').split(' / ').slice(1).join(' / ')||'Sonstiges';m.set(k,(m.get(k)||0)+t.amountCents);}
 const data=[...m].sort((a,b)=>b[1]-a[1]),max=Math.max(1,...data.map(x=>x[1]));
 return `<section class="fin-visual-section"><div class="fin-art-heading"><div><small>INCOME SOURCES</small><h3>Woher kommt das Geld?</h3></div></div>${data.map(([name,cents],i)=>`<div class="fin-income-row"><span>${h(name)}</span><div class="fin-income-track"><i style="width:${Math.max(1,cents/max*100)}%;background:${palette[i%palette.length]}"></i></div><strong>${h(euro(cents))}</strong></div>`).join('')||empty('Noch keine kategorisierten Einnahmen.')}</section>`;
}

export function financeCategoryFocusedView(all=[],category='',today=new Date().toLocaleDateString('sv-SE')){
 if(!category)return '';
 const data=financeCategorySeries(all,category,today),last=data.history.slice(-12);
 const max=Math.max(1,...last.map(x=>x.cents));
 return `<section class="fin-visual-section fin-category-focused"><div class="fin-art-heading"><div><small>CATEGORY DETAIL / ROLLING YEAR</small><h3>${h(categoryIcon(category))} ${h(category)}</h3></div><button type="button" class="secondary-btn" data-action="finance-category-clear">Alle Kategorien</button></div><div class="fin-pattern-summary"><span>Ø / Monat <strong>${h(numberOrDash(data.mean))}</strong></span><span>Bisher diesen Monat <strong>${h(euro(data.spent))}</strong></span><span>Trend <strong>${h(data.status)}</strong></span></div><div class="fin-focused-months">${last.map(x=>`<div title="${h(x.month)} · ${x.observed?h(euro(x.cents)):'Keine Buchungen'}" class="${x.observed?'':'missing'}"><div class="fin-focused-rail"><i style="height:${x.observed?Math.max(2,100*x.cents/max):0}%"></i></div><small>${h(x.month.slice(2))}</small></div>`).join('')}</div><p class="fin-art-note">Die Balken zeigen nur importierte Monatsausgaben dieser Kategorie; schraffierte Monate haben keine bestätigte Datenabdeckung. Kategorien können unter „Buchungen“ korrigiert werden.</p><button type="button" class="secondary-btn" data-action="finance-go-ledger">Buchungen ansehen →</button></section>`;
}
