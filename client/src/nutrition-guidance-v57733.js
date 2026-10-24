/** 0.5.77.33: Dr. Greger-oriented, evidence-labeled fat dashboard.
 * Numbers are based strictly on logged entries. Absence of an entry is NOT absence of food.
 * Dietary omega-6 is essential; no unsubstantiated ideal omega-6:3 quotient is imposed.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,p=2)=>typeof n==='number'&&Number.isFinite(n)?n.toLocaleString('de-AT',{maximumFractionDigits:p}):'–';
const present=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const titleStatus=(c,total)=>c&&c.missing===0&&c.estimated===0&&c.partial===0&&total>0?'vollständig für protokollierte Speisen':c?.known>0?'teilweise / geschätzt':'ohne ausreichende Angaben';
const meter=(n,goal,tone='green',unit='')=>{
 const value=present(n)?n:null,percent=value===null?0:Math.max(0,Math.min(100,100*value/goal));
 return `<div class="ni733-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${goal}" ${value===null?'':`aria-valuenow="${esc(value)}"`} aria-label="${esc(unit)}"><span class="ni733-progress-fill tone-${tone}" style="width:${percent.toFixed(1)}%"></span></div>`;
};
function indicator(label,tone,value,explain,progress=''){
 return `<article class="ni733-indicator tone-${tone}"><header><span class="ni733-light" aria-hidden="true"></span><strong>${esc(label)}</strong></header><b>${esc(value)}</b>${progress}<small>${esc(explain)}</small></article>`;
}
export function fatTrafficDashboard(model,{today=model.today}={}){
 const day=model.rows.find(x=>x.day===today),counts=day?.coverage||{},v=day?.values||{};
 const formatDay=(k,unit)=>present(v[k])?`${fmt(v[k],k==='cholesterol'||k==='epa'||k==='dha'?0:2)} ${unit}`:'Nicht bestimmbar';
 const totalEntries=day?.entries||0;
 const isPartial=k=>!totalEntries||!counts[k]?.known||!!counts[k]?.missing||!!counts[k]?.partial;
 const omega6=v.omega6,ala=v.ala;
 const ratio=present(omega6)&&present(ala)&&ala>0?omega6/ala:null;
 const ratioStr=ratio===null?'Nicht bestimmbar':`${fmt(ratio,1)} : 1`;
 const longOmega=present(v.epa)&&present(v.dha)?v.epa+v.dha:null;
 const gregerTarget=250;
 const good=indicator('Omega-3 · EPA + DHA',longOmega===null?'amber':longOmega>=gregerTarget&&!isPartial('epa')&&!isPartial('dha')?'green':'amber',longOmega===null?'Nicht bestimmbar':`${fmt(longOmega,0)} / ${gregerTarget} mg`,longOmega===null?`Greger: ${gregerTarget} mg/Tag aus Algen oder Hefe erwägen. Aus deinen Einträgen nicht vollständig ableitbar`:`Greger: ${gregerTarget} mg/Tag aus Algen oder Hefe erwägen · ${isPartial('epa')||isPartial('dha')?'Datenbasis lückenhaft':''}`,meter(longOmega,gregerTarget,'green','EPA + DHA'));
 const alaCard=indicator('Pflanzliches Omega-3 · ALA',present(v.ala)?'green':'amber',formatDay('ala','g'),present(v.ala)?'Gehalt aus den erfassten Portionen; Greger empfiehlt täglich 1 EL gemahlene Leinsamen':'Greger: täglich 1 EL gemahlene Leinsamen; ALA ist nicht EPA/DHA');
 const saturated=indicator('Gesättigte Fettsäuren',present(v.saturated)&&v.saturated>0?'red':'amber',formatDay('saturated','g'),'Greger empfiehlt, konzentrierte Quellen zu reduzieren. Rot kennzeichnet die Reduktionsrichtung, keine Diagnose anhand eines unvollständigen Tages.');
 const trans=indicator('Transfettsäuren',present(v.trans)&&v.trans>0?'red':'amber',formatDay('trans','g'),'So gering wie möglich. Nicht deklarierte Transfette werden nicht als 0 g angenommen.');
 const cholesterol=indicator('Nahrungscholesterin',present(v.cholesterol)&&v.cholesterol>0?'red':'amber',formatDay('cholesterol','mg'),'Greger: konzentrierte tierische Quellen reduzieren. Kein erfundenes Tageslimit. Nicht mit Blut-LDL gleichsetzen.');
 const omega=indicator('Omega-6 · Linolsäure', 'amber', formatDay('omega6','g'),'Essenzielle Fettsäure; nicht pauschal schlecht. Greger bevorzugt Omega-3-reiche Vollwertkost gegenüber omega-6-reichen raffinierten Ölen.');
 const unsaturated=indicator('Einfach + mehrfach ungesättigt','green',present(v.mono)&&present(v.poly)?`${fmt(v.mono+v.poly,2)} g`:'Nicht vollständig bekannt','Grün: in Greger-orientierter Vollwert-Ernährung bevorzugte pflanzliche Fettquellen; bloße Grammzahl ist noch keine Ernährungsnote.');
 const ratioCard=indicator('Omega-6 : Omega-3 (ALA)','amber',ratioStr,ratio===null?'Nur bei bekannten Werten berechenbar.':'Deskriptiver Quotient; keine fest vorgegebene Greger-Zielzahl. '+(isPartial('omega6')||isPartial('ala')?'Teilweise fehlende Lebensmittelwerte.':''));
 return `<section class="ni733-dashboard" aria-label="Fettqualität-Ampel und Empfehlungen"><div class="ni733-head"><h3>🚦 Fettqualität · Einordnung nach Dr. Greger</h3><span>${esc(today)} · ${totalEntries} protokollierte Einträge</span></div>
 <div class="ni733-legend"><span><i class="tone-green"></i> Bevorzugte Qualität / positive Orientierung</span><span><i class="tone-red"></i> Eher reduzieren</span><span><i class="tone-amber"></i> Neutral, noch offen oder unvollständig</span></div>
 <div class="ni733-indicators">${alaCard}${good}${unsaturated}${omega}${ratioCard}${saturated}${trans}${cholesterol}</div>
 <p class="ni733-disclaimer">${totalEntries?`Werte beziehen sich nur auf die ${totalEntries} heute erfassten Einträge.`:'Für heute noch keine protokollierte Mahlzeit.'} Mehrfach ungesättigt / Omega-6 sind nicht grundsätzlich „schlechte“ Fette. Eine rote Markierung bei gesättigtem Fett oder Nahrungscholesterin zeigt die gewünschte Reduktionsrichtung, nicht die Überschreitung einer unbelegten Grenze. Kein Tagesziel aus unbekannten Nährwerten ableiten. </p>
 <p class="ni733-provenance">Abdeckung heute: gesättigt ${esc(titleStatus(counts.saturated,totalEntries))}; Omega-3 ALA ${esc(titleStatus(counts.ala,totalEntries))}. <a target="_blank" rel="noopener noreferrer" href="https://nutritionfacts.org/optimum-nutrient-recommendations/">Greger · Optimum Nutrient Recommendations ↗</a> · <a target="_blank" rel="noopener noreferrer" href="https://nutritionfacts.org/questions/what-would-you-suggest-as-an-ideal-omega-369/">Omega-3/6 Einordnung ↗</a></p></section>`;
}
