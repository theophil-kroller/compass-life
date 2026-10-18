/** Fitdays regional measurements with original reference percentages, viewed as a person.
 * The flat silhouette is an abstract illustration; not a scan or diagnosis.
 */
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>Number.isFinite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:1}):'–';
const regions=[
 {id:'rightArm',label:'Rechter Arm',x:152,y:120,tx:8,ty:96,anchor:'start'},
 {id:'leftArm',label:'Linker Arm',x:408,y:120,tx:548,ty:96,anchor:'end'},
 {id:'trunk',label:'Rumpf',x:280,y:176,tx:548,ty:215,anchor:'end'},
 {id:'rightLeg',label:'Rechtes Bein',x:236,y:308,tx:8,ty:328,anchor:'start'},
 {id:'leftLeg',label:'Linkes Bein',x:325,y:308,tx:548,ty:328,anchor:'end'}
];
function figure(data,kind){
 const isFat=kind==='fat',id=isFat?'fat':'muscle',tint=isFat?'#CC8B66':'#3E9682',light=isFat?'#F7E4D6':'#D5EDE4';
 const records=isFat?data?.segmentFat||{}:data?.segmentMuscle||{};
 const point=r=>records[r.id];
 const segmentLabels=regions.map(r=>{const v=point(r);return `<g class="fitdays-figure-label"><path d="M${r.x} ${r.y} L${r.tx+(r.anchor==='start'?68:-68)} ${r.ty-10} L${r.tx+(r.anchor==='start'?0:0)} ${r.ty-10}" fill="none" stroke="${tint}" stroke-opacity=".4" stroke-width="1"/><circle cx="${r.x}" cy="${r.y}" r="5" fill="${v?tint:'#BBCAC0'}" stroke="#FFF" stroke-width="2"/><text x="${r.tx}" y="${r.ty}" fill="#4C665C" font-size="12" font-weight="600" text-anchor="${r.anchor}">${safe(r.label)}</text><text x="${r.tx}" y="${r.ty+18}" fill="#304B40" font-size="13" font-weight="700" text-anchor="${r.anchor}">${v?fmt(v.kg)+' kg':'–'}</text><text x="${r.tx}" y="${r.ty+34}" fill="#798C80" font-size="11" text-anchor="${r.anchor}">${v&&Number.isFinite(v.relativePct)?fmt(v.relativePct)+' % Referenz':'Keine Messung'}</text></g>`;}).join('');
 return `<div class="fitdays-figure"><svg viewBox="0 0 560 405" role="img" aria-label="Fitdays ${isFat?'segmentale Fettmasse':'segmentale Muskelmasse'}: stilisierte menschliche Figur mit fünf Messregionen" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fd-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${tint}" stop-opacity=".8"/></linearGradient></defs>
 <path d="M205 85 C221 74 244 77 253 78 L306 78 C322 76 342 73 355 85 L403 126 Q415 138 409 155 L392 207 Q386 219 376 216 Q367 212 373 198 L386 145 L356 117 L346 185 L329 237 L327 363 Q327 382 317 384 L301 384 Q291 383 293 366 L290 254 L268 254 L266 366 Q267 384 257 384 L244 384 Q232 382 233 367 L230 237 L214 183 L205 117 L175 145 L188 198 Q194 214 184 216 Q174 219 168 207 L151 155 Q146 138 158 126 Z" fill="url(#fd-${id})" stroke="${tint}" stroke-opacity=".65" stroke-width="1.5"/>
 <circle cx="280" cy="46" r="30" fill="${light}" stroke="${tint}" stroke-opacity=".72" stroke-width="1.5"/><path d="M251 74 L252 93 M309 74 L308 93" stroke="${tint}" stroke-opacity=".65" stroke-width="3"/><path d="M279 113 L279 235" stroke="#FFF" stroke-opacity=".43" stroke-width="2"/><path d="M230 240 Q280 255 330 240" fill="none" stroke="#FFF" stroke-opacity=".45" stroke-width="2"/>
 ${segmentLabels}</svg></div>`;
}
export function fitdaysFigureReport(latest){
 if(!latest)return '<p class="insight-no-data">Noch keine Fitdays-Messung importiert.</p>';
 const total=(key)=>Object.values(latest[key]||{}).filter(x=>Number.isFinite(x.kg)).length;
 return `<section class="fitdays-figure-report" aria-label="Fitdays Körpersegmentreport">
 <div class="fitdays-report-heading"><div><span class="insight-kicker">FITDAYS / BODY COMPOSITION</span><h3>Mein Körper im Detail</h3><p>Segmentanalyse vom ${safe(new Date(latest.at).toLocaleDateString('de-AT'))} · gemessene Werte aus dem Fitdays-Export</p></div><span class="fitdays-report-date">${safe(latest.day)}</span></div>
 <div class="fitdays-figure-grid"><article class="fitdays-figure-panel"><h4>Fettmasse nach Körperregion</h4><p>Regionaler Messwert in kg und Fitdays-Referenzprozente</p>${figure(latest,'fat')}<div class="fitdays-figure-footnote">${total('segmentFat')} von 5 Regionen mit Fettmessung</div></article><article class="fitdays-figure-panel"><h4>Muskelbalance</h4><p>Segmentale Muskelmasse in kg und Fitdays-Referenzprozente</p>${figure(latest,'muscle')}<div class="fitdays-figure-footnote">${total('segmentMuscle')} von 5 Regionen mit Muskelmessung</div></article></div>
 <p class="insight-figure-note">Die Prozentangaben entsprechen der Fitdays-Bewertung relativ zu einer Referenz und <strong>nicht</strong> dem Körperfettanteil der Region. Die Figur stellt keine medizinische Körpermessung oder anatomisch genaue Verteilung dar. Fett- und Muskelwerte aus Bioimpedanzmessungen schwanken mit der Hydrierung.</p></section>`;
}
