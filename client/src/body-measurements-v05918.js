/** Compass 0.5.91.18 · Fitdays+ Smart Tape live Health Import Hub integration.
 * Reuses nutritionJournal.bodyMeasures88, the same encrypted journal already
 * used by Coach waist/shoulder input. No second database, network or Bluetooth.
 * Only imported actual readings; no interpolated circumferences or forecasts.
 */
export const SMART_TAPE_FLAGS = Object.freeze({import:true,dashboard:true,adaptive:false,manualEntry:false});
export const BODY_MEASUREMENT_REGIONS = Object.freeze([
 ['shoulder','Schulterumfang',50,220],['chest','Brustumfang',45,220],
 ['waist','Taillenumfang',40,200],['hip','Hüftumfang',45,220],
 ['neck','Halsumfang',20,90],['leftUpperArm','Oberarm links',15,95],
 ['rightUpperArm','Oberarm rechts',15,95],['leftThigh','Oberschenkel links',25,115],
 ['rightThigh','Oberschenkel rechts',25,115],['leftCalf','Wade links',15,85],
 ['rightCalf','Wade rechts',15,85],['head','Kopfumfang',35,85]
 ].map(([id,label,minCm,maxCm])=>Object.freeze({id,label,minCm,maxCm})));
const regions=new Map(BODY_MEASUREMENT_REGIONS.map(x=>[x.id,x]));
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))?new Date(x).toISOString():null;
const dayValid=x=>{if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return false;const n=Date.parse(x+'T12:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===x;};
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const two=x=>Math.round(x*100)/100;
const isPlain=x=>x&&typeof x==='object'&&!Array.isArray(x);
const sourceValues=new Set(['fitdays-plus','manual','legacy-coach','other-verified']);
const qualityValues=new Set(['unreviewed','confirmed','questionable']);
const stamp=()=>new Date().toISOString();
const id=()=>globalThis.crypto?.randomUUID?.()||`measure-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function bodyTapeToCm(value,unit='cm'){
 if(!finite(value)||value<=0)throw Error('Körperumfang muss eine positive endliche Zahl sein.');
 if(unit!=='cm'&&unit!=='in')throw Error('Unbekannte Umfangseinheit. Nur cm oder in.');
 return two(unit==='in'?value*2.54:value);
}
export function normalizeBodyMeasurement(raw,{now=stamp(),newId=id()}={}){
 if(!isPlain(raw))throw Error('Messung muss ein Objekt sein.');
 const region=regions.get(raw.regionId);if(!region)throw Error('Unbekannte Körperregion.');
 const originalUnit=raw.originalUnit||'cm';
 const originalValue=raw.originalValue??raw.valueCm;
 const valueCm=bodyTapeToCm(originalValue,originalUnit);
 if(valueCm<region.minCm||valueCm>region.maxCm)throw Error(`Messwert ${region.label} außerhalb plausibler Grenzen.`);
 const sourceDay=String(raw.day||raw.at||'').slice(0,10);
 const at=iso(raw.at);if(!at||!dayValid(sourceDay))throw Error('Messzeitpunkt fehlt oder ist ungültig.');
 if(!sourceValues.has(raw.source))throw Error('Messquelle unbekannt.');
 const updatedAt=iso(raw.updatedAt||now),createdAt=iso(raw.createdAt||now);
 if(!updatedAt||!createdAt)throw Error('Erstellungs-/Änderungszeitpunkt ungültig.');
 if(raw.qualityStatus&&!qualityValues.has(raw.qualityStatus))throw Error('Qualitätsstatus ungültig.');
 const clean=s=>s==null?null:String(s).trim().slice(0,160);
 return {id:String(raw.id||newId).slice(0,120),day:sourceDay,at,regionId:region.id,
  valueCm,originalValue,originalUnit,source:raw.source,
  importBatchId:clean(raw.importBatchId),method:clean(raw.method),protocol:clean(raw.protocol),sourceLocalTime:clean(raw.sourceLocalTime),
  qualityStatus:raw.qualityStatus||'unreviewed',createdAt,updatedAt,deleted:raw.deleted===true};
}
/** Fingerprint deliberately includes precise timestamp: two same-day readings are separate.
 * importBatchId is EXCLUDED so reimporting the same export doesn't duplicate.
 */
export function measurementFingerprint(m){
 return [m.source,m.regionId,m.sourceLocalTime||m.at,Number(m.valueCm).toFixed(2),m.method||'',m.protocol||''].join('|');
}
export const existingBodyMeasurements=state=>Array.isArray(state?.nutritionJournal?.bodyMeasures88)?state.nutritionJournal.bodyMeasures88:[];
/** Creates/updates rows in the EXISTING encrypted journal. Never overwrites legacy Coach rows.
 * Intended for future opt-in import or manual action AFTER feature flag activation.
 */
export function putBodyMeasurement(state,raw,{now=stamp()}={}){
 if(!isPlain(state))throw Error('Fehlender Vault-Zustand.');
 const row=normalizeBodyMeasurement(raw,{now});
 state.nutritionJournal??={};state.nutritionJournal.bodyMeasures88??=[];
 const entries=state.nutritionJournal.bodyMeasures88;
 const index=entries.findIndex(x=>x?.id===row.id),fingerprint=measurementFingerprint(row);
 if(index>=0){entries[index]={...entries[index],...row};return {record:entries[index],status:'updated'};}
 const equivalent=entries.find(x=>x?.regionId&&x.deleted!==true&&measurementFingerprint(x)===fingerprint);
 if(equivalent)return {record:equivalent,status:'duplicate'};
 entries.push(row);return {record:row,status:'created'};
}
export function markBodyMeasurementDeleted(state,recordId,{now=stamp()}={}){
 const match=existingBodyMeasurements(state).find(x=>x?.id===recordId&&x?.regionId);
 if(!match)return false;match.deleted=true;match.updatedAt=now;return true;
}
/** Read legacy shoulder/waist entries and canonical rows together, without copying data.
 * Legacy records are observation rows, not guessed readings; if both fields are
 * present, they are measured together at the journal date.
 */
export function bodyMeasurementObservations(state,{today=null,regionId=null}={}){
 if(regionId&&!regions.has(regionId))throw Error('Unbekannte Körperregion.');
 const out=[];
 for(const row of existingBodyMeasurements(state)){
  if(!isPlain(row)||row.deleted===true)continue;
  if(row.regionId){
   if(regionId&&row.regionId!==regionId)continue;
   const def=regions.get(row.regionId),value=row.valueCm;
   const day=row.at?.slice(0,10)||row.day;
   if(!def||!dayValid(day)||(today&&day>today)||!finite(value)||value<def.minCm||value>def.maxCm)continue;
   out.push({id:row.id,at:row.at||day+'T12:00:00Z',day,regionId:row.regionId,valueCm:value,
    source:row.source,qualityStatus:row.qualityStatus||'unreviewed',protocol:row.protocol||null,method:row.method||null});
  }else{
   const day=row.day||row.at?.slice(0,10);if(!dayValid(day)||(today&&day>today))continue;
   for(const [key,field] of [['shoulder','shoulderCm'],['waist','waistCm']]){
    if(regionId&&regionId!==key)continue;
    const def=regions.get(key),value=row[field];if(!finite(value)||value<def.minCm||value>def.maxCm)continue;
    out.push({id:`${row.id||day}|${key}`,at:row.at||day+'T12:00:00Z',day,regionId:key,valueCm:value,
     source:'legacy-coach',qualityStatus:'confirmed',protocol:row.protocol||null,method:'coach-waist-shoulder'});
   }
  }
 }
 return out.sort((a,b)=>a.at.localeCompare(b.at)||a.id.localeCompare(b.id));
}
const time=x=>Date.parse(x+'T12:00:00Z');
export function bodyMeasurementTrend(observations=[]){
 const rows=observations.filter(x=>dayValid(x?.day)&&finite(x?.valueCm)).sort((a,b)=>a.day.localeCompare(b.day));
 const days=new Set(rows.map(x=>x.day));
 if(rows.length<5||days.size<4||(time(rows.at(-1).day)-time(rows[0].day))/86400000<14)return null;
 const t0=time(rows[0].day),pairs=rows.map(r=>[(time(r.day)-t0)/86400000,r.valueCm]);
 const n=pairs.length,avgX=pairs.reduce((s,[x])=>s+x,0)/n,avgY=pairs.reduce((s,[,y])=>s+y,0)/n;
 const den=pairs.reduce((s,[x])=>s+(x-avgX)**2,0);
 if(den<=0)return null;
 const slope=pairs.reduce((s,[x,y])=>s+(x-avgX)*(y-avgY),0)/den;
 return {n,uniqueDays:days.size,spanDays:Math.round((time(rows.at(-1).day)-time(rows[0].day))/86400000),slopeCmPer30Days:two(slope*30),kind:'observed-linear-trend-not-forecast'};
}
export function bodyMeasurementRatioSeries(state,{today=null}={}){
 const rows=bodyMeasurementObservations(state,{today}),byDay=new Map();
 for(const m of rows){if(m.regionId!=='shoulder'&&m.regionId!=='waist')continue;
  const bucket=byDay.get(m.day)||{day:m.day};bucket[m.regionId]=m;byDay.set(m.day,bucket);}
 return [...byDay.values()].filter(x=>x.shoulder&&x.waist&&(!x.shoulder.protocol||!x.waist.protocol||x.shoulder.protocol===x.waist.protocol))
  .map(x=>({day:x.day,shoulderCm:x.shoulder.valueCm,waistCm:x.waist.valueCm,ratio:two(x.shoulder.valueCm/x.waist.valueCm),
   sourceIds:[x.shoulder.id,x.waist.id],kind:'measured-proportion-not-ideal-target'})).sort((a,b)=>a.day.localeCompare(b.day));
}
export function bodyMeasurementDashboardModel(state,{today,range='90'}={}){
 const reference=dayValid(today)?today:new Date().toISOString().slice(0,10);
 const days=range==='all'?null:Number(range),start=days===null?null:dayValid(reference)&&[1,7,28,90,365].includes(days)?new Date(time(reference)-(days-1)*86400000).toISOString().slice(0,10):null;
 const rows=bodyMeasurementObservations(state,{today:reference}).filter(x=>!start||x.day>=start);
 const series=BODY_MEASUREMENT_REGIONS.map(r=>{const points=rows.filter(x=>x.regionId===r.id);
  return {...r,points,latest:points.at(-1)||null,changeCm:points.length>1?two(points.at(-1).valueCm-points[0].valueCm):null,
   changePct:points.length>1?two((points.at(-1).valueCm/points[0].valueCm-1)*100):null,
   lastDeltaCm:points.length>1?two(points.at(-1).valueCm-points.at(-2).valueCm):null,
   lastDeltaPct:points.length>1?two((points.at(-1).valueCm/points.at(-2).valueCm-1)*100):null,
   trend:bodyMeasurementTrend(points)};});
 const ratios=bodyMeasurementRatioSeries(state,{today:reference}).filter(x=>!start||x.day>=start);
 const paired=new Map();for(const m of rows){if(m.regionId!=='waist'&&m.regionId!=='hip')continue;const v=paired.get(m.at)||{};v[m.regionId]=m;paired.set(m.at,v);}
 // Match strictly the same timestamp and measurement method; never combine a
 // previous hip reading with a newer waist or with a device-estimated WHR.
 const waistHip=[...paired.values()].filter(x=>x.waist&&x.hip&&x.hip.valueCm>0
  &&x.waist.source===x.hip.source&&x.waist.method===x.hip.method
  &&x.waist.qualityStatus!=='questionable'&&x.hip.qualityStatus!=='questionable')
  .map(x=>({at:x.waist.at,day:x.waist.day,ratio:two(x.waist.valueCm/x.hip.valueCm),
   waistCm:x.waist.valueCm,hipCm:x.hip.valueCm,source:x.waist.source,
   qualityStatus:x.waist.qualityStatus==='confirmed'&&x.hip.qualityStatus==='confirmed'?'confirmed':'unreviewed',
   sourceIds:[x.waist.id,x.hip.id]})).sort((a,b)=>a.at.localeCompare(b.at));
 return {today:reference,range,start,series,ratios,ratioLatest:ratios.at(-1)||null,waistHip,waistHipLatest:waistHip.at(-1)||null,features:SMART_TAPE_FLAGS,
  enabled:true,hasData:rows.length>0,measurements:rows.length};
}
/** Production dashboard: rendered in Insights > Körper. */
/** Clickable schematic body map: coordinates are interface targets, never anatomical estimates. */
const BODY_MAP_POINTS=Object.freeze({
 head:[170,31],neck:[170,64],shoulder:[170,82],chest:[170,114],waist:[170,165],hip:[170,206],
 leftUpperArm:[236,126],rightUpperArm:[104,126],leftThigh:[199,269],rightThigh:[141,269],
 leftCalf:[196,364],rightCalf:[144,364]
});
const number=(x,digits=1)=>Number(x).toLocaleString('de-AT',{minimumFractionDigits:digits,maximumFractionDigits:digits});
const signed=x=>`${x>0?'+':''}${number(x)}`;
const shortDay=x=>{try{return new Date(x+'T12:00:00Z').toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'});}catch{return String(x||'');}};
const regionTitle=(x)=>x?.label||'Messstelle';
export function bodyTapeLinePlot(points=[],label='Umfang'){
 if(!points.length)return '<div class="bm918-empty">Noch keine Messung für diesen Bereich vorhanden.</div>';
 const sorted=[...points].sort((a,b)=>a.at.localeCompare(b.at)),w=660,H=248,L=56,R=28,T=30,B=44;
 const ts=sorted.map(x=>Date.parse(x.at)),tMin=Math.min(...ts),tMax=Math.max(...ts),timeSpan=Math.max(3600000,tMax-tMin);
 const vals=sorted.map(x=>x.valueCm),min=Math.min(...vals),max=Math.max(...vals),pad=Math.max(0.8,(max-min)*0.22),lo=Math.max(0,min-pad),hi=max+pad;
 const xx=(t)=>L+(tMax===tMin?.5:(t-tMin)/timeSpan)*(w-L-R),yy=v=>T+(hi-v)/(hi-lo)*(H-T-B);
 const pts=sorted.map((p,i)=>[xx(ts[i]),yy(p.valueCm)]);
 const path=pts.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
 const ticks=[0,.5,1].map(q=>{const v=lo+(hi-lo)*q,y=yy(v);return `<line x1="${L}" y1="${y}" x2="${w-R}" y2="${y}" stroke="#dfe8e7" stroke-dasharray="4 5"/><text x="${L-8}" y="${y+4}" text-anchor="end" font-size="11" fill="#637b79">${number(v)}</text>`;}).join('');
 return `<svg class="bm918-trend" viewBox="0 0 ${w} ${H}" role="img" aria-label="${esc(label)}: ${points.length} tatsächliche Messpunkte in cm" preserveAspectRatio="xMidYMid meet">${ticks}${sorted.length>1?`<path d="${path}" fill="none" stroke="#2c6f68" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`:''}${sorted.map((p,i)=>`<circle cx="${pts[i][0].toFixed(2)}" cy="${pts[i][1].toFixed(2)}" r="5.5" fill="#d8ad63" stroke="#1e5150" stroke-width="2"><title>${esc(shortDay(p.day))} · ${number(p.valueCm)} cm</title></circle>`).join('')}<text x="${L}" y="${H-12}" font-size="12" fill="#607571">${esc(shortDay(sorted[0].day))}</text><text x="${w-R}" y="${H-12}" text-anchor="end" font-size="12" fill="#607571">${esc(shortDay(sorted.at(-1).day))}</text><text x="${L}" y="16" font-size="12" fill="#607571">Umfang · cm</text></svg>`;
}
function bodyTapeSchematic(selected){
 return `<svg class="bm918-body-map" viewBox="0 0 340 440" role="img" aria-label="Körperübersicht: auf eine markierte Messstelle klicken">
 <defs><linearGradient id="bm918-body-gradient" x1="0" x2="1"><stop offset="0" stop-color="#c8d8d6"/><stop offset="1" stop-color="#edf3ef"/></linearGradient></defs>
 <g fill="url(#bm918-body-gradient)" stroke="#79938f" stroke-width="2"><ellipse cx="170" cy="40" rx="25" ry="33"/><path d="M158 70 L157 80 Q117 78 108 92 L88 191 Q82 215 96 222 Q108 227 114 205 L133 138 L131 193 Q132 215 136 234 L131 330 L134 407 Q137 422 151 419 L159 330 L169 248 L182 330 L191 419 Q206 422 208 407 L209 329 L204 233 Q209 209 208 194 L208 138 L226 205 Q232 227 244 222 Q257 216 250 192 L231 93 Q221 78 182 80 L182 70 Z"/></g>
 <path d="M134 143 Q170 151 206 143 M131 191 Q170 200 208 191 M134 228 Q170 237 205 228" fill="none" stroke="#9ab0ac" stroke-dasharray="3 4"/>
 ${BODY_MEASUREMENT_REGIONS.map(r=>{const [x,y]=BODY_MAP_POINTS[r.id],chosen=r.id===selected;return `<g tabindex="0" role="button" data-action="smart-tape-region" data-id="${r.id}" aria-label="${esc(r.label)} wählen" aria-pressed="${chosen}" class="bm918-map-target ${chosen?'chosen':''}"><circle cx="${x}" cy="${y}" r="${chosen?15:12}" fill="${chosen?'#a77732':'#245f61'}" stroke="#fff" stroke-width="3"/><circle cx="${x}" cy="${y}" r="4" fill="#fff"/><title>${esc(r.label)}</title></g>`;}).join('')}</svg>`;
}
export function bodyMeasurementDashboardHtml(model,{selectedRegionId='shoulder'}={}){
 const selected=model.series.find(x=>x.id===selectedRegionId)||model.series[0];
 const change=selected.lastDeltaCm===null?'<span class="bm918-unknown">Baseline – noch kein Vergleich möglich</span>':`<strong class="bm918-delta ${Math.abs(selected.lastDeltaCm)<.5?'near-zero':selected.lastDeltaCm>0?'increased':'decreased'}">${signed(selected.lastDeltaCm)} cm <small>(${signed(selected.lastDeltaPct)} %)</small></strong><span>gegenüber der vorherigen Messung</span>`;
 const latest=selected.latest;
 const cards=model.series.map(r=>`<button type="button" class="bm918-region ${r.id===selected.id?'selected':''}" data-action="smart-tape-region" data-id="${r.id}" aria-pressed="${r.id===selected.id}"><span>${esc(r.label)}</span><strong>${r.latest?number(r.latest.valueCm)+' cm':'–'}</strong><small>${r.lastDeltaCm!==null?`${signed(r.lastDeltaCm)} cm`:'Ausgangswert'}</small></button>`).join('');
 return `<section class="bm918-dashboard" aria-label="Smart Tape · Körperumfänge"><div class="bm918-heading"><div><small>FITDAYS+ · SMART TAPE</small><h2>Körpermaße &amp; Entwicklung</h2><p>Zwölf Messstellen · echte Umfangsmessungen · Verlauf nach Körperregion</p></div><button type="button" class="secondary-btn" data-action="smart-tape-import" aria-label="Smart Tape in Health Import Hub importieren">⇩ Messwerte importieren</button></div>
 <div class="bm918-totals"><span><strong>${model.series.filter(x=>x.points.length).length}/12</strong> Regionen mit Daten</span><span><strong>${new Set(model.series.flatMap(x=>x.points.map(p=>p.day))).size}</strong> Messtage</span><span><strong>${model.ratioLatest?number(model.ratioLatest.ratio,2):'–'}</strong> Schulter / Taille</span><span><strong>${model.waistHipLatest?number(model.waistHipLatest.ratio,2):'–'}</strong> Taille / Hüfte</span></div>
 <div class="bm918-workspace"><div class="bm918-map-panel"><h3>Körperübersicht</h3>${bodyTapeSchematic(selected.id)}<p class="bm918-help">Messpunkt oder Körperregion antippen. Links/rechts beziehen sich auf deine Körperseiten.</p><div class="bm918-regions">${cards}</div></div><div class="bm918-detail" id="bm918-detail"><small>MESSVERLAUF · ${esc(regionTitle(selected))}</small><h3>${esc(regionTitle(selected))}</h3><div class="bm918-metric"><strong>${latest?number(latest.valueCm)+' cm':'–'}</strong><span>${latest?`Letzte Messung am ${esc(shortDay(latest.day))}`:'Noch nicht erfasst'}</span></div><div class="bm918-change">${change}</div>${bodyTapeLinePlot(selected.points,selected.label)}<p class="bm918-insight">${selected.points.length<2?'Nach der nächsten Messung zeigt Compass hier die Veränderung in cm und Prozent.':`Veränderung seit dem ersten Messpunkt im gewählten Zeitraum: ${signed(selected.changeCm)} cm (${signed(selected.changePct)} %).`}${selected.trend?` Beobachteter Trend: ${signed(selected.trend.slopeCmPer30Days)} cm je 30 Tage (${selected.trend.n} Messungen über ${selected.trend.spanDays} Tage).`:''}</p><details><summary>Einzelmessungen (${selected.points.length})</summary>${selected.points.length?`<ol class="bm918-history">${[...selected.points].reverse().map(p=>`<li><span>${esc(shortDay(p.day))}</span><strong>${number(p.valueCm)} cm</strong><small>${esc(p.source==='fitdays-plus'?'Fitdays+':p.source==='legacy-coach'?'Coach':'Manuell')}</small></li>`).join('')}</ol>`:'<p>Noch keine Werte</p>'}</details></div></div>
 <p class="bm918-caveat">Umfangsänderungen sind kein direkter Nachweis für Muskelzuwachs oder Fettabbau. Gleiche Messposition, Tageszeit und Bandspannung verbessern die Vergleichbarkeit. Eine Messung ist lediglich die Baseline; es gibt keine künstlich ergänzten Kurvenpunkte und keine automatische Trainingsplanänderung.</p></section>`;
}
export function detectMeasurementFileContainer(bytes,filename=''){
 const b=bytes instanceof Uint8Array?bytes:null;if(!b||b.byteLength<2)return 'unknown';
 if(b[0]===0x50&&b[1]===0x4b)return 'zip-container'; // XLSX is zipped, but not every ZIP is XLSX
 if([0xd0,0xcf,0x11,0xe0].every((v,i)=>b[i]===v))return 'ole-container';
 const content=new TextDecoder().decode(b.slice(0,2000)).trimStart();
 if(content.startsWith('{')||content.startsWith('['))return 'json-candidate';
 if(/\.csv$/i.test(filename)&&!content.includes('\0'))return 'csv-candidate';
 return 'unknown';
}
export function mapVerifiedMeasurementFields(raw,mapping){
 if(!isPlain(raw)||!isPlain(mapping)||!isPlain(mapping.fields)||mapping.verified!==true)throw Error('Vor dem Import muss das Feldmapping anhand eines echten Fitdays+-Exports verifiziert werden.');
 const result={};
 for(const [canonical,sourceKey] of Object.entries(mapping.fields)){
  if(!['regionId','at','originalValue','originalUnit','source','importBatchId','method','protocol'].includes(canonical))throw Error('Unbekanntes Zielfeld.');
  if(typeof sourceKey!=='string'||!(sourceKey in raw))throw Error(`Quellspalte ${sourceKey} fehlt.`);
  result[canonical]=raw[sourceKey];
 }
 return result;
}
// Verified against original Fitdays+ device export on 2026-11-04. Despite a .csv
// extension, the sample is an OLE2 BIFF .xls workbook. Values include " cm".
export const FITDAYS_TAPE_HEADER_MAP=Object.freeze({
 'Head':'head','Neck':'neck','Shoulder':'shoulder','Chest':'chest','Waist':'waist',
 'Hip':'hip','L Arm':'leftUpperArm','R Arm':'rightUpperArm',
 'L Thigh':'leftThigh','R Thigh':'rightThigh','L Calf':'leftCalf','R Calf':'rightCalf'
});
const normalizedHeader=x=>String(x??'').replace(/\s+/g,' ').trim().toLowerCase();
const tapeNumeric=(v,unit='cm')=>{const str=String(v??'').trim();
 if(!str)return null;
 const match=str.match(/^([0-9]+(?:[.,][0-9]+)?)\s*(cm|in)?$/i);
 if(!match)throw Error(`Ungültiger Fitdays+-Umfang "${str.slice(0,32)}".`);
 if(typeof v==='string'&&!match[2])throw Error('Die Maßeinheit cm/in fehlt im Umfangsexport.');
 return {value:Number(match[1].replace(',','.')),unit:(match[2]||unit).toLowerCase()};
};
const tapeDate=x=>{const match=String(x??'').trim().match(/^(20\d\d-\d\d-\d\d)[ T](\d\d:\d\d)(?::(\d\d))?$/);
 if(!match||!dayValid(match[1]))throw Error('Ungültiges Fitdays+-Smart-Tape-Datum.');
 const stamp=`${match[1]}T${match[2]}:${match[3]||'00'}`;
 if(!Number.isFinite(Date.parse(stamp))||Number(match[2].slice(0,2))>23||Number(match[2].slice(3))>59)return null;
 return {localStamp:stamp,day:match[1]};
};
/** Returns null when the sheet is not a tape export; never mistake body-scale
 * data for tape measurements. Throws for a recognized but malformed tape sheet.
 */
export function parseFitdaysSmartTapeRows(rows){
 if(!Array.isArray(rows))return null;
 const headerIdx=rows.findIndex(row=>Array.isArray(row)&&row.some(x=>normalizedHeader(x)==='time')&&row.some(x=>normalizedHeader(x)==='shoulder')&&row.some(x=>normalizedHeader(x)==='l arm')&&row.some(x=>normalizedHeader(x)==='waist'));
 if(headerIdx<0)return null;
 const keys=rows[headerIdx].map(normalizedHeader);
 const indexes=Object.entries(FITDAYS_TAPE_HEADER_MAP).map(([key,regionId])=>{const idx=keys.indexOf(normalizedHeader(key));if(idx<0)throw Error(`Fitdays+ Tape: Spalte ${key} fehlt.`);return [idx,regionId];});
 const t=keys.indexOf('time'),out=[];
 for(const row of rows.slice(headerIdx+1)){
  if(!Array.isArray(row)||row.every(x=>String(x??'').trim()===''))continue;
  const date=tapeDate(row[t]);if(!date)throw Error('Ungültige Smart-Tape-Uhrzeit.');
  for(const [index,regionId] of indexes){const measure=tapeNumeric(row[index]);if(!measure)continue;
   out.push(normalizeBodyMeasurement({regionId,originalValue:measure.value,originalUnit:measure.unit,
    source:'fitdays-plus',at:date.localStamp,day:date.day,sourceLocalTime:date.localStamp,
    method:'smart-tape',protocol:'Fitdays+ Smart Tape'},{}));
  }
 }
 if(!out.length)throw Error('Fitdays+ Tape erkannt, aber keine Körperumfänge vorhanden.');
 return out;
}
export function importFitdaysSmartTape(rows){const results=parseFitdaysSmartTapeRows(rows);if(!results)throw Error('Kein verifiziertes Fitdays+-Smart-Tape-Schema gefunden.');return results;}

export function adaptiveBodyMeasurementRecommendation(){return {enabled:false,reason:'Messhistorie und Qualitätsprüfung stehen aus. Bestehende RIR-, Plateau- und Deload-Logik bleibt maßgeblich.',suggestion:null};}

/** Evidence adapter for a FUTURE opt-in Coach rule engine: read only.
 * It makes provenance, sufficiency and missing data explicit, and never
 * changes workout load, volume, RIR, fatigue or deload flags.
 */
export function bodyMeasurementCoachEvidence(state,{today=new Date().toISOString().slice(0,10),strengthModel=null}={}){
 const model=bodyMeasurementDashboardModel(state,{today,range:'90'});
 const measurements=model.series.filter(x=>x.points.length>=2);
 const fitdays=(state?.healthImports?.fitdays||[]).filter(r=>dayValid(r.day)&&r.day<=today).sort((a,b)=>a.day.localeCompare(b.day));
 const training=strengthModel&&typeof strengthModel==='object'?{sessions:strengthModel.sessions?.length||0,
  activeSets:Number.isInteger(strengthModel.activeSets)?strengthModel.activeSets:null,
  volumeKg:finite(strengthModel.volumeKg)?strengthModel.volumeKg:null}:null;
 return {enabled:false,source:'bodyMeasures88 (encrypted journal)',
  shoulder:model.series.find(x=>x.id==='shoulder')?.latest?.valueCm??null,
  waist:model.series.find(x=>x.id==='waist')?.latest?.valueCm??null,
  ratios:model.ratios,fitdaysLatest:fitdays.at(-1)||null,training,
  enoughForMeasurementReview:measurements.length>=2&&model.ratios.length>=4,
  readyForAutomaticAdjustment:false,reason:'Messprotokoll, Unsicherheit, Erholung, RIR und Progression vor jeder Änderung gemeinsam prüfen.'};
}
