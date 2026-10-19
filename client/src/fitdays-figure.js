/** Fitdays regional measurements with original reference percentages, viewed as a person.
 * The flat silhouette is an abstract illustration; not a scan or diagnosis.
 */
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>Number.isFinite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:1}):'–';
/** Colours mean relative deviation from the device's reference, not a clinical judgment. */
export function fitdaysSegmentTone(kind, relativePct){
 if(!Number.isFinite(relativePct))return {label:'Keine Referenz',color:'#A5B6AE',code:'missing'};
 if(kind==='fat'){
  if(relativePct>145)return {label:'Deutlich über Fitdays-Referenz',color:'#C35D54',code:'high'};
  if(relativePct>115)return {label:'Über Fitdays-Referenz',color:'#DAA061',code:'elevated'};
  if(relativePct<80)return {label:'Unter Fitdays-Referenz',color:'#729AB9',code:'low'};
  return {label:'Nahe Fitdays-Referenz',color:'#52A18B',code:'reference'};
 }
 if(relativePct<75)return {label:'Deutlich unter Fitdays-Referenz',color:'#C35D54',code:'low'};
 if(relativePct<90)return {label:'Unter Fitdays-Referenz',color:'#DAA061',code:'below'};
 if(relativePct>130)return {label:'Über Fitdays-Referenz',color:'#719FBE',code:'above'};
 return {label:'Nahe Fitdays-Referenz',color:'#52A18B',code:'reference'};
}
const regions=[
 {id:'rightArm',label:'Rechter Arm',x:152,y:120,tx:8,ty:96,anchor:'start'},
 {id:'leftArm',label:'Linker Arm',x:408,y:120,tx:548,ty:96,anchor:'end'},
 {id:'trunk',label:'Rumpf',x:280,y:176,tx:548,ty:215,anchor:'end'},
 {id:'rightLeg',label:'Rechtes Bein',x:236,y:308,tx:8,ty:328,anchor:'start'},
 {id:'leftLeg',label:'Linkes Bein',x:325,y:308,tx:548,ty:328,anchor:'end'}
];
function figure(data,kind){
 const isFat=kind==='fat',id=isFat?'fat':'muscle';
 const records=isFat?data?.segmentFat||{}:data?.segmentMuscle||{};
 const mainShape='M205 85 C221 74 244 77 253 78 L306 78 C322 76 342 73 355 85 L403 126 Q415 138 409 155 L392 207 Q386 219 376 216 Q367 212 373 198 L386 145 L356 117 L346 185 L329 237 L327 363 Q327 382 317 384 L301 384 Q291 383 293 366 L290 254 L268 254 L266 366 Q267 384 257 384 L244 384 Q232 382 233 367 L230 237 L214 183 L205 117 L175 145 L188 198 Q194 214 184 216 Q174 219 168 207 L151 155 Q146 138 158 126 Z';
 const zones={
  rightArm:'M110 95 H205 L219 225 H110 Z',
  leftArm:'M351 95 H460 V225 H338 Z',
  trunk:'M203 78 H356 L352 244 H210 Z',
  rightLeg:'M207 236 H279 V399 H206 Z',
  leftLeg:'M281 236 H353 V399 H281 Z'
 };
 const overlays=Object.entries(zones).map(([key,path])=>{
  const tone=fitdaysSegmentTone(id,records[key]?.relativePct);
  return `<path d="${path}" fill="${tone.color}" opacity=".87"><title>${safe(key)}: ${safe(tone.label)}</title></path>`;
 }).join('');
 const segmentLabels=regions.map(r=>{
  const v=records[r.id],tone=fitdaysSegmentTone(id,v?.relativePct);
  return `<g class="fitdays-figure-label"><path d="M${r.x} ${r.y} L${r.tx+(r.anchor==='start'?68:-68)} ${r.ty-10} L${r.tx} ${r.ty-10}" fill="none" stroke="${tone.color}" stroke-opacity=".6" stroke-width="1.4"/>
  <circle cx="${r.x}" cy="${r.y}" r="5.5" fill="${tone.color}" stroke="#FFF" stroke-width="2"/>
  <text x="${r.tx}" y="${r.ty}" fill="#4C665C" font-size="12" font-weight="600" text-anchor="${r.anchor}">${safe(r.label)}</text>
  <text x="${r.tx}" y="${r.ty+18}" fill="#304B40" font-size="13" font-weight="700" text-anchor="${r.anchor}">${v?fmt(v.kg)+' kg':'–'}</text>
  <text x="${r.tx}" y="${r.ty+34}" fill="${tone.color}" font-size="11" text-anchor="${r.anchor}">${v&&Number.isFinite(v.relativePct)?fmt(v.relativePct)+' % Referenz':'Keine Messung'}</text>
  <title>${safe(r.label)} · ${safe(tone.label)}</title></g>`;
 }).join('');
 return `<div class="fitdays-figure"><svg viewBox="0 0 560 405" role="img" aria-label="Fitdays ${isFat?'Fettmasse':'Muskelmasse'}: fünf farbig nach Geräte-Referenz gekennzeichnete Körperregionen" xmlns="http://www.w3.org/2000/svg">
 <defs><clipPath id="fd-body-${id}"><path d="${mainShape}"/></clipPath></defs>
 <path d="${mainShape}" fill="#DDE9E2" stroke="#6C9889" stroke-width="1.4"/>
 <g clip-path="url(#fd-body-${id})">${overlays}</g><path d="${mainShape}" fill="none" stroke="#718D83" stroke-opacity=".7" stroke-width="1.3"/>
 <circle cx="280" cy="46" r="30" fill="#E5EDE8" stroke="#A5BAAE" stroke-width="1.5"/>
 <path d="M230 240 Q280 255 330 240" fill="none" stroke="#FFF" stroke-opacity=".45" stroke-width="2"/>
 ${segmentLabels}</svg></div>`;
}

export function fitdaysFigureReport(latest){
 if(!latest)return '<p class="insight-no-data">Noch keine Fitdays-Messung importiert.</p>';
 const total=(key)=>Object.values(latest[key]||{}).filter(x=>Number.isFinite(x.kg)).length;
 return `<section class="fitdays-figure-report" aria-label="Fitdays Körpersegmentreport">
 <div class="fitdays-report-heading"><div><span class="insight-kicker">FITDAYS / BODY COMPOSITION</span><h3>Mein Körper im Detail</h3><p>Segmentanalyse vom ${safe(new Date(latest.at).toLocaleDateString('de-AT'))} · gemessene Werte aus dem Fitdays-Export</p></div><span class="fitdays-report-date">${safe(latest.day)}</span></div>
 <div class="fitdays-figure-grid"><article class="fitdays-figure-panel"><h4>Fettmasse nach Körperregion</h4><p>Referenzabweichung farbig · Messwert in kg</p>${figure(latest,'fat')}<div class="fitdays-figure-footnote">${total('segmentFat')} von 5 Regionen mit Fettmessung</div></article><article class="fitdays-figure-panel"><h4>Muskelbalance</h4><p>Referenzabweichung farbig · Muskelmasse in kg</p>${figure(latest,'muscle')}<div class="fitdays-figure-footnote">${total('segmentMuscle')} von 5 Regionen mit Muskelmessung</div></article></div>
 <div class="fitdays-color-legend"><span><i style="background:#52A18B"></i>Nahe Referenz</span><span><i style="background:#DAA061"></i>Abweichung</span><span><i style="background:#C35D54"></i>Deutliche Abweichung</span><span><i style="background:#729AB9"></i>Unter / über Referenz (je nach Messgröße)</span></div>
 <p class="insight-figure-note">Grün, Orange und Rot kennzeichnen <strong>relative Abweichungen von Fitdays-Gerätereferenzen</strong>, keine medizinische Aussage über „gesund“ oder „ungesund“. Bei Muskelmasse wird ein erhöhter Referenzwert nicht automatisch als schlecht gewertet. Die Farbschwellen sind eine Transparenzhilfe von Compass, keine validierten klinischen Grenzwerte. Die Prozentangaben entsprechen der Fitdays-Bewertung relativ zu einer Referenz und <strong>nicht</strong> dem Körperfettanteil der Region. Die Figur stellt keine medizinische Körpermessung oder anatomisch genaue Verteilung dar. Fett- und Muskelwerte aus Bioimpedanzmessungen schwanken mit der Hydrierung.</p></section>`;
}
