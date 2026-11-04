/** Compass 0.5.91.20 – measurement-derived proportions, NOT a 3D scan.
 * Circumference => front-view width is underdetermined. Widths below are
 * ellipse-model estimates with DOCUMENTED assumed depth/width ratios.
 * Only synchronized, actually measured circumferences may be combined.
 */
const finite = x => typeof x==='number' && Number.isFinite(x);
const fmt = (n,places=2)=>Number(n).toLocaleString('de-AT',{minimumFractionDigits:places,maximumFractionDigits:places});
const esc = v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const validHeight = x=>finite(x)&&x>=120&&x<=230;
const validWeight = x=>finite(x)&&x>=25&&x<=350;
const two=x=>Math.round(x*100)/100;
const three=x=>Math.round(x*1000)/1000;

export function latestTapeSession(model,{minRegions=4}={}){
 const buckets = new Map();
 for(const series of model?.series||[]){
  for(const p of series?.points||[]){
   if(!finite(p.valueCm)||p.valueCm<=0||p.qualityStatus==='questionable'||!/^20\d\d-\d\d-\d\dT/.test(p.at||''))continue;
   const key=[p.at,p.source||'',p.method||'',p.protocol||''].join('|');
   if(!buckets.has(key))buckets.set(key,{at:p.at,day:p.day,source:p.source,method:p.method,protocol:p.protocol,values:{}});
   buckets.get(key).values[series.id]=p.valueCm;
  }
 }
 // At least shoulder/chest/waist/hip are required to infer an entire torso.
 const qualified=[...buckets.values()].filter(x=>['shoulder','chest','waist','hip'].every(k=>finite(x.values[k]))&&Object.keys(x.values).length>=minRegions);
 qualified.sort((a,b)=>a.at.localeCompare(b.at));
 return qualified.at(-1)||null;
}

export function bodyProportionMetrics(snapshot,{heightCm=null,weightKg=null}={}){
 const v=snapshot?.values||{},shoulder=v.shoulder,chest=v.chest,waist=v.waist,hip=v.hip;
 const ratio=(a,b)=>finite(a)&&finite(b)&&a>0&&b>0?three(a/b):null;
 const pairs=(a,b)=>finite(a)&&finite(b)?two(a-b):null;
 return {
  day:snapshot?.day||null,
  whr:ratio(waist,hip),
  whtr:validHeight(heightCm)?ratio(waist,heightCm):null,
  shoulderWaist:ratio(shoulder,waist),
  chestWaist:ratio(chest,waist),
  shoulderHip:ratio(shoulder,hip),
  bmi:validHeight(heightCm)&&validWeight(weightKg)?two(weightKg/(heightCm/100)**2):null,
  armDeltaCm:pairs(v.leftUpperArm,v.rightUpperArm),
  thighDeltaCm:pairs(v.leftThigh,v.rightThigh),
  calfDeltaCm:pairs(v.leftCalf,v.rightCalf),
  // One measurement cannot substantiate direction or muscle gain.
  available:!!snapshot
 };
}

export function whtrReference(value){
 if(!finite(value)||value<=0)return {kind:'unknown',label:'Nicht berechenbar'};
 if(value<.4)return {kind:'below-range',label:'Unterhalb des NICE-Vergleichsbereichs'};
 if(value<.5)return {kind:'reference',label:'NICE: Bereich ohne zusätzliches zentrales Adipositas-Risikosignal'};
 if(value<.6)return {kind:'elevated',label:'NICE: erhöhte zentrale Adipositas'};
 return {kind:'high',label:'NICE: hohe zentrale Adipositas'};
}

/** A circumference does NOT equal visible width. Here a frontal ellipse is
 * assumed. depthToWidth is an illustrative modelling parameter, not measured.
 */
export function modelledFrontWidthCm(circumferenceCm,depthToWidth=.67){
 if(!finite(circumferenceCm)||circumferenceCm<=0||!finite(depthToWidth)||depthToWidth<.2||depthToWidth>1.5)return null;
 const r=depthToWidth;
 const perimeterPerWidth=Math.PI/2*(3*(1+r)-Math.sqrt((3+r)*(1+3*r)));
 return two(circumferenceCm/perimeterPerWidth);
}
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));

/** Height and all displayed widths share the same internal SVG ratio. At
 * different screen sizes its CSS rendering is NOT a physical 1:N scale.
 * Clicks use the SAME event delegation as the existing Smart-Tape body map.
 */
export function proportionalBodySvg(snapshot,{heightCm=null,selectedRegionId='shoulder'}={}){
 if(!snapshot)return '<p class="bp120-wait">Für eine gemeinsame Körperdarstellung braucht Compass mindestens Schulter, Brust, Taille und Hüfte aus derselben Smart-Tape-Messung.</p>';
 const v=snapshot.values;
 const hasHeight=validHeight(heightCm);
 // When height is unknown, heights are schematic. Never falsely display cm or "scale".
 const H=hasHeight?heightCm:180;
 const pxPerCm=450/H,center=244,top=35,bottom=485;
 const cx=(val)=>Number(val).toFixed(2);
 const cmWidth=(key,depth,fallback)=>clamp(modelledFrontWidthCm(v[key],depth)??fallback,8,100)*pxPerCm;
 const halfShoulder=cmWidth('shoulder',.55,46)/2;
 const halfChest=cmWidth('chest',.68,40)/2;
 const halfWaist=cmWidth('waist',.70,36)/2;
 const halfHip=cmWidth('hip',.78,39)/2;
 const halfHead=cmWidth('head',.97,18)/2;
 const halfNeck=cmWidth('neck',.88,13)/2;
 const leftUpper=cmWidth('leftUpperArm',.88,11)/2;
 const rightUpper=cmWidth('rightUpperArm',.88,11)/2;
 const leftThigh=cmWidth('leftThigh',.9,18)/2;
 const rightThigh=cmWidth('rightThigh',.9,18)/2;
 const leftCalf=cmWidth('leftCalf',.87,13)/2;
 const rightCalf=cmWidth('rightCalf',.87,13)/2;
 const headY=top+H*.065*pxPerCm, shoulderY=top+H*.18*pxPerCm, chestY=top+H*.25*pxPerCm;
 const waistY=top+H*.43*pxPerCm,hipY=top+H*.54*pxPerCm, kneeY=top+H*.75*pxPerCm,calfY=top+H*.88*pxPerCm;
 const xSide=(sign,n)=>cx(center+sign*n),label=(key,text,x,y)=>{
  if(!finite(v[key]))return '';
  const selected=selectedRegionId===key;
  return `<g class="bp120-node bm918-map-target ${selected?'chosen':''}" data-action="smart-tape-region" data-id="${key}" role="button" tabindex="0" aria-label="${esc(text)} ${fmt(v[key],1)} Zentimeter auswählen" aria-pressed="${selected}"><circle cx="${cx(x)}" cy="${cx(y)}" r="${selected?8:6}" fill="${selected?'#bb9150':'#2e776a'}" stroke="white" stroke-width="2"/><title>${esc(text)} ${fmt(v[key],1)} cm</title></g>`;
 };
 const torso=`M ${xSide(-1,halfShoulder)} ${cx(shoulderY)} Q ${xSide(-1,halfChest)} ${cx(chestY-10)} ${xSide(-1,halfChest)} ${cx(chestY)} Q ${xSide(-1,halfWaist)} ${cx(waistY-8)} ${xSide(-1,halfWaist)} ${cx(waistY)} Q ${xSide(-1,halfHip)} ${cx(hipY-10)} ${xSide(-1,halfHip)} ${cx(hipY)} Q ${center} ${cx(hipY+12)} ${xSide(1,halfHip)} ${cx(hipY)} Q ${xSide(1,halfHip)} ${cx(hipY-10)} ${xSide(1,halfWaist)} ${cx(waistY)} Q ${xSide(1,halfWaist)} ${cx(waistY-8)} ${xSide(1,halfChest)} ${cx(chestY)} Q ${xSide(1,halfChest)} ${cx(chestY-10)} ${xSide(1,halfShoulder)} ${cx(shoulderY)} Z`;
 const limb=(sign)=>{
  // Frontal perspective: anatomical LEFT is on the viewer's RIGHT.
  const thigh=sign<0?rightThigh:leftThigh,calf=sign<0?rightCalf:leftCalf;
  const centerX=center+sign*halfHip*.52;
  const lateralAt=(y,width)=>cx(centerX+sign*width);
  const medialAt=(y,width)=>cx(centerX-sign*width);
  return `<path d="M ${lateralAt(hipY,thigh)} ${cx(hipY)} Q ${lateralAt(kneeY-24,thigh)} ${cx(kneeY-25)} ${lateralAt(kneeY,thigh*.61)} ${cx(kneeY)} Q ${lateralAt(calfY,calf)} ${cx(calfY)} ${lateralAt(bottom-13,calf*.53)} ${cx(bottom-13)} L ${medialAt(bottom-13,calf*.53)} ${cx(bottom-13)} Q ${medialAt(calfY,calf)} ${cx(calfY)} ${medialAt(kneeY,thigh*.59)} ${cx(kneeY)} Q ${medialAt(hipY+28,thigh*.9)} ${cx(hipY+28)} ${medialAt(hipY,thigh)} ${cx(hipY)} Z"/>`;
 };
 const arm=(sign)=>{
  const armHalf=sign<0?rightUpper:leftUpper;
  const outer=halfShoulder+armHalf*.7,inner=halfShoulder-armHalf*.85;
  return `<path d="M ${xSide(sign,inner)} ${cx(shoulderY+4)} Q ${xSide(sign,outer)} ${cx(shoulderY+12)} ${xSide(sign,outer+armHalf*.48)} ${cx(waistY+26)} L ${xSide(sign,outer-7)} ${cx(hipY+16)} Q ${xSide(sign,inner)} ${cx(hipY+18)} ${xSide(sign,inner-3)} ${cx(hipY-11)} L ${xSide(sign,inner-1)} ${cx(shoulderY+28)} Z"/>`;
 };
 const ruler=hasHeight?`<g class="bp120-ruler"><line x1="92" y1="${top}" x2="92" y2="${bottom}" stroke="#86a69d" stroke-width="1.4"/>${[0,50,100,150,H].filter((x,i,a)=>a.indexOf(x)===i&&x<=H).map(cm=>{const y=bottom-cm*pxPerCm;return `<line x1="86" y1="${cx(y)}" x2="97" y2="${cx(y)}"/><text x="81" y="${cx(y+4)}" text-anchor="end">${cm} cm</text>`;}).join('')}</g>`:'';
 const ribbons=[['shoulder',shoulderY,halfShoulder,'Schulter'],['chest',chestY,halfChest,'Brust'],['waist',waistY,halfWaist,'Taille'],['hip',hipY,halfHip,'Hüfte']]
  .map(([key,y,half,text])=>`<line x1="${xSide(-1,half)}" x2="${xSide(1,half)}" y1="${cx(y)}" y2="${cx(y)}" stroke="${selectedRegionId===key?'#ad7a2f':'#6b948d'}" stroke-width="2" stroke-dasharray="4 3"/>${label(key,text,center+half+12,y)}` ).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" class="bp120-svg bm918-body-map" viewBox="0 0 480 515" role="img" aria-label="${esc(hasHeight?`Schematische Körperschau mit relativen Breiten aus Umfangsmessungen und ${heightCm} Zentimeter Körpergröße`:'Schematische relative Körperproportionen, Körpergröße nicht dokumentiert')}">
 <defs><linearGradient id="bp120-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c8d9d4"/><stop offset=".55" stop-color="#f2f6f2"/><stop offset="1" stop-color="#b8d0c8"/></linearGradient></defs>
 ${ruler}<g fill="url(#bp120-skin)" stroke="#658f85" stroke-width="1.8" stroke-linejoin="round">${limb(-1)}${limb(1)}${arm(-1)}${arm(1)}<path d="${torso}"/><rect x="${cx(center-halfNeck)}" y="${cx(top+H*.123*pxPerCm)}" width="${cx(halfNeck*2)}" height="${cx(H*.055*pxPerCm)}" rx="6"/><ellipse cx="${center}" cy="${cx(headY)}" rx="${cx(halfHead)}" ry="${cx(H*.063*pxPerCm)}"/></g>
 ${ribbons}${label('head','Kopf',center+halfHead+12,headY)}${label('neck','Hals',center+halfNeck+11,top+H*.145*pxPerCm)}
 ${label('leftUpperArm','Oberarm links',center+(halfShoulder+leftUpper*.35),shoulderY+45)}${label('rightUpperArm','Oberarm rechts',center-(halfShoulder+rightUpper*.35),shoulderY+45)}
 ${label('leftThigh','Oberschenkel links',center+halfHip*.52,hipY+40)}${label('rightThigh','Oberschenkel rechts',center-halfHip*.52,hipY+40)}
 ${label('leftCalf','Wade links',center+halfHip*.52,calfY)}${label('rightCalf','Wade rechts',center-halfHip*.52,calfY)}
 <text x="470" y="501" text-anchor="end" font-size="10" fill="#718981">modellierte Tiefenannahmen</text></svg>`;
}

export function bodyProportionsPanel(model,{heightCm=null,weightKg=null,selectedRegionId='shoulder'}={}){
 const current=latestTapeSession(model),metric=bodyProportionMetrics(current,{heightCm,weightKg});
 if(!current)return '<div class="bp120-empty"><h3>Individuelle Körperproportionen</h3><p>Bitte zuerst eine vollständige Smart-Tape-Messung importieren. Keine Silhouette aus fehlenden Umfängen erfinden.</p></div>';
 const chips=[
  ['Schulter / Taille',metric.shoulderWaist,'Individuelles V-Taper-Verhältnis; kein medizinisches Ideal'],
  ['Brust / Taille',metric.chestWaist,'Trainingsorientierte Proportion'],
  ['Schulter / Hüfte',metric.shoulderHip,'Trainingsorientierte Proportion'],
  ['Taille / Körpergröße',metric.whtr,'Gesundheitsbezogener Orientierungswert (NICE)'],
  ['Taille / Hüfte',metric.whr,'WHR nach tatsächlich gepaarten Umfängen']
 ];
 const whisk=metric.whtr!==null?`<p class="bp120-whtr ${whtrReference(metric.whtr).kind}"><strong>WHtR ${fmt(metric.whtr,3)}</strong> · ${esc(whtrReference(metric.whtr).label)}. Referenzziel unter 0,50 (NICE, Erwachsene; kein individuelles Diagnostikergebnis).</p>`:'<p class="bp120-whtr">Für die WHtR und die gemeinsame Größenskalierung bitte deine Körpergröße unter Ernährung → Energieziel hinterlegen.</p>';
 const asym=[['Oberarme',metric.armDeltaCm],['Oberschenkel',metric.thighDeltaCm],['Waden',metric.calfDeltaCm]].filter(x=>x[1]!==null)
   .map(([name,d])=>`<span><strong>${esc(name)}</strong> ${fmt(Math.abs(d),1)} cm ${Math.abs(d)<.05?'gleich':d>0?'links größer':'rechts größer'}</span>`).join('');
 return `<section class="bp120-panel" aria-label="Proportionen aus Smart-Tape-Messungen"><div class="bp120-head"><div><small>SMART TAPE · ANTHROPOMETRIE</small><h3>Deine Körperproportionen</h3><p>${esc(current.day)} · ${Object.keys(current.values).length} tatsächlich gemessene Umfänge · ${validHeight(heightCm)?`Körperhöhe ${fmt(heightCm,0)} cm`:'Größe unbekannt'}</p></div></div>
 <div class="bp120-cols"><div><h4>Messbasierte Silhouette</h4>${proportionalBodySvg(current,{heightCm,selectedRegionId})}<p class="bp120-explain">Dynamische 2D-Näherung: Körperhöhe ist innerhalb der Zeichnung einheitlich skaliert; sichtbare Breiten sind aus Umfängen und <strong>angenommenen</strong> Tiefen berechnet. Die Darstellung ist <strong>kein maßstabsgetreuer 3D-Scan</strong>, keine exakte anatomische Rekonstruktion und unabhängig von der Bildschirmgröße.</p></div>
 <div><h4>Berechnete Kennzahlen</h4><div class="bp120-ratios">${chips.map(([name,value,note])=>`<div class="bp120-ratio"><span>${esc(name)}<small>${esc(note)}</small></span><strong>${value===null?'–':fmt(value,3)}</strong></div>`).join('')}</div>${whisk}${metric.bmi!==null?`<p class="bp120-bmi">BMI ${fmt(metric.bmi,1)} kg/m² aus dokumentiertem Gewicht und Größe; bei Krafttraining eingeschränkt interpretierbar.</p>`:''}${asym?`<div class="bp120-asym"><h5>Seitenunterschiede · nur Beobachtung</h5>${asym}</div>`:''}<p class="bp120-explain">Kleine Seitenunterschiede können durch Messposition und Bandspannung entstehen. Umfangsänderung ist weder ein Muskelwachstumsbeweis noch Grundlage für automatische Gewichtserhöhungen im Coach.</p></div></div></section>`;
}
