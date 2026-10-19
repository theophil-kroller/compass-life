/** Compass 0.5.17.6 — Local merchant drill-down. Merchant is NOT an itemized receipt. */
import {escapeFinance} from './finance-core.js';
const h=escapeFinance;
const eur=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const clean=s=>String(s||'').normalize('NFKC').replace(/\s+/g,' ').trim();
export function normalizedMerchant(value=''){
 const s=clean(value),u=s.toLocaleUpperCase('de-AT');
 if(/\b(?:HOFER|ALDI)\b/.test(u))return 'Hofer';
 if(/\b(?:INTERSPAR|EUROSPAR|SPAR)\b/.test(u))return /\bINTERSPAR\b/.test(u)?'Interspar':/\bEUROSPAR\b/.test(u)?'Eurospar':'Spar';
 if(/\b(?:BILLA\s*PLUS|MERKUR\s*MARKT)\b/.test(u))return 'Billa Plus';
 if(/\bBILLA\b/.test(u))return 'Billa';
 if(/\bLIDL\b/.test(u))return 'Lidl';
 if(/\bPENNY\b/.test(u))return 'Penny';
 if(/\bDENN.S\b/.test(u))return "denn's Biomarkt";
 if(/\bBIOGAST\b/.test(u))return 'Biogast';
 if(/\b(?:DM\s+DROGERIE|DM\s+MARKT)\b/.test(u))return 'dm';
 if(/\bMÜLLER\b/.test(u))return 'Müller';
 // No unjustified mapping of payments via PayPal, payment processors, or generic transfers.
 return s.slice(0,90)||'Händler nicht eindeutig';
}
const eligible=t=>t&&!t.needsReview&&t.flow==='expense'&&Number.isSafeInteger(t.amountCents)&&t.amountCents<0&&typeof t.category==='string';
export function merchantExpenseGroups(rows=[],category='Lebensmittel'){
 const byCategory=new Map();
 for(const t of rows){if(!eligible(t))continue;
  const [parent,sub='Ohne Unterkategorie']=t.category.split(' / ');
  if(category&&parent!==category)continue;
  const name=normalizedMerchant(t.merchantDisplayName||t.merchant||t.description||''),id=`${parent} / ${sub}`,existing=byCategory.get(id)||{name:id,parent,sub,cents:0,count:0,merchants:new Map()};
  const key=name.toLocaleLowerCase('de-AT');let r=existing.merchants.get(key)||{name,cents:0,count:0,lastDay:'',months:{},rawExamples:new Set()};
  const c=-t.amountCents;r.cents+=c;r.count++;if(t.day>r.lastDay)r.lastDay=t.day;
  if(/^\d{4}-\d{2}-\d{2}$/.test(t.day||'')){const m=t.day.slice(0,7);r.months[m]=(r.months[m]||0)+c;}
  if(r.rawExamples.size<4)r.rawExamples.add(clean(t.merchant||'').slice(0,75));
  existing.cents+=c;existing.count++;existing.merchants.set(key,r);byCategory.set(id,existing);
 }
 return [...byCategory.values()].map(g=>({...g,merchants:[...g.merchants.values()].map(x=>({...x,rawExamples:[...x.rawExamples]})).sort((a,b)=>b.cents-a.cents)})).sort((a,b)=>b.cents-a.cents);
}
/** A compact fourth level after Hauptkategorie → Unterkategorie, with monthly spark charts. */
export function merchantInsightsView(rows=[],category='Lebensmittel'){
 const groups=merchantExpenseGroups(rows,category),total=groups.reduce((a,g)=>a+g.cents,0);
 const title=category||'Alle Ausgaben';
 if(!groups.length)return `<section class="fin-analysis-section fin-merchant-insights"><span class="insight-kicker">HÄNDLER / VIERTE EBENE</span><h3>${h(title)} nach Zahlungspartnern</h3><p class="fin-disclaimer">Noch keine klassifizierten Ausgaben für die ausgewählte Kategorie.</p></section>`;
 const top=groups.slice(0,8);
 return `<section class="fin-analysis-section fin-merchant-insights"><div class="fin-merchant-head"><div><span class="insight-kicker">DEEP SPENDING · VIERTE EBENE</span><h3>${h(title)} → Unterkategorie → Händler</h3><p>Was ging an Hofer, Spar, Billa und andere tatsächliche Zahlungspartner?</p></div><strong>${h(eur(total))}<small>${groups.reduce((a,x)=>a+x.count,0)} Buchungen</small></strong></div>
 <label class="fin-merchant-select">Ausgabenbereich <select id="finance-merchant-category">${[...new Set(rows.filter(eligible).map(x=>x.category.split(' / ')[0]))].sort((a,b)=>a.localeCompare(b,'de')).map(name=>`<option value="${h(name)}" ${name===category?'selected':''}>${h(name)}</option>`).join('')}</select></label>
 <div class="fin-merchant-groups">${top.map(g=>`<details class="fin-merchant-group" ${g.sub==='Supermarkt'?'open':''}><summary><span><strong>${h(g.sub)}</strong><small>${g.merchants.length} Zahlungspartner · ${g.count} Buchungen</small></span><b>${h(eur(g.cents))}</b></summary><div class="fin-merchant-list">${g.merchants.slice(0,35).map((m,i)=>{const max=Math.max(1,...Object.values(m.months));const last=Object.entries(m.months).sort(([a],[b])=>a.localeCompare(b)).slice(-12);return `<div class="fin-merchant-item"><div class="fin-merchant-info"><strong>${h(m.name)}</strong><small>${m.count} Zahlung(en) · zuletzt ${h(m.lastDay||'unbekannt')} · ${h((100*m.cents/g.cents).toLocaleString('de-AT',{maximumFractionDigits:1}))} %</small></div><div class="fin-merchant-months" role="img" aria-label="Monatliche Zahlungen an ${h(m.name)}">${last.map(([month,amount])=>`<span title="${h(month)}: ${h(eur(amount))}" style="height:${Math.max(5,Math.round(100*amount/max))}%"></span>`).join('')}</div><strong>${h(eur(m.cents))}</strong></div>`;}).join('')}${g.merchants.length>35?`<p class="fin-disclaimer">Weitere ${g.merchants.length-35} Händler in den Buchungen sichtbar.</p>`:''}</div></details>`).join('')}</div>
 <p class="fin-disclaimer">Quelle: importierte Bankbuchungen im gewählten Zeitraum. Händler können anhand unterschiedlicher Buchungstexte zusammengefasst sein; einzelne Produkte (Brot, Milch usw.) sind aus Bankumsätzen nicht erkennbar. Zahlungsdienste werden nicht auf einen Einkauf zurückgeführt.</p></section>`;
}
