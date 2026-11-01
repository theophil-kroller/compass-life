/** Compass 0.5.91.8 · Fitdays+ Smart Tape preparation (NOT a production import).
 * Reuses nutritionJournal.bodyMeasures88, the same encrypted journal already
 * used by Coach waist/shoulder input. No second database, network or Bluetooth.
 * Only confirmed measured values; no interpolated circumferences or forecasts.
 */
export const SMART_TAPE_FLAGS = Object.freeze({import:false,dashboard:false,adaptive:false,manualEntry:false});
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
 const at=iso(raw.at);if(!at||!dayValid(String(raw.at).slice(0,10)))throw Error('Messzeitpunkt fehlt oder ist ungültig.');
 if(!sourceValues.has(raw.source))throw Error('Messquelle unbekannt.');
 const updatedAt=iso(raw.updatedAt||now),createdAt=iso(raw.createdAt||now);
 if(!updatedAt||!createdAt)throw Error('Erstellungs-/Änderungszeitpunkt ungültig.');
 if(raw.qualityStatus&&!qualityValues.has(raw.qualityStatus))throw Error('Qualitätsstatus ungültig.');
 const clean=s=>s==null?null:String(s).trim().slice(0,160);
 return {id:String(raw.id||newId).slice(0,120),day:at.slice(0,10),at,regionId:region.id,
  valueCm,originalValue,originalUnit,source:raw.source,
  importBatchId:clean(raw.importBatchId),method:clean(raw.method),protocol:clean(raw.protocol),
  qualityStatus:raw.qualityStatus||'unreviewed',createdAt,updatedAt,deleted:raw.deleted===true};
}
/** Fingerprint deliberately includes precise timestamp: two same-day readings are separate.
 * importBatchId is EXCLUDED so reimporting the same export doesn't duplicate.
 */
export function measurementFingerprint(m){
 return [m.source,m.regionId,m.at,Number(m.valueCm).toFixed(2),m.method||'',m.protocol||''].join('|');
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
   changePct:points.length>1?two((points.at(-1).valueCm/points[0].valueCm-1)*100):null,trend:bodyMeasurementTrend(points)};});
 const ratios=bodyMeasurementRatioSeries(state,{today:reference}).filter(x=>!start||x.day>=start);
 return {today:reference,range,start,series,ratios,ratioLatest:ratios.at(-1)||null,features:SMART_TAPE_FLAGS,
  enabled:false,hasData:rows.length>0,measurements:rows.length};
}
/** Renderable, opt-in-only future dashboard: NOT wired into production navigation. */
export function bodyMeasurementDashboardHtml(model){
 const cards=model.series.map(r=>`<article class="bm918-card"><h3>${esc(r.label)}</h3><strong>${r.latest?esc(r.latest.valueCm.toLocaleString('de-AT'))+' cm':'–'}</strong><small>${r.points.length} Messungen · ${r.changeCm===null?'kein Vergleich':`${r.changeCm>0?'+':''}${esc(r.changeCm)} cm / ${esc(r.changePct)} %`}</small>${r.trend?`<small>Beobachteter Trend: ${r.trend.slopeCmPer30Days>0?'+':''}${esc(r.trend.slopeCmPer30Days)} cm/30 Tage · nur im Messfenster</small>`:''}${measurementDots(r.points)}</article>`).join('');
 return `<section class="bm918-dashboard" aria-label="Body Measurements und V-Taper"><header><h2>Body Measurements &amp; V-Taper</h2><p>Messungen · Dot-Plots · keine Interpolation oder Prognose</p></header><div class="bm918-grid">${cards}</div><p>V-Taper Ratio (Schulterumfang / Taillenumfang): ${model.ratioLatest?esc(model.ratioLatest.ratio):'–'} · ${model.ratios.length} gemeinsame Messtage. Kein universeller Zielbereich.</p>${measurementDots(model.ratios.map(x=>({day:x.day,valueCm:x.ratio})), 'Ratio')}<p>Smart-Tape-Import und adaptive Trainingsänderungen bleiben bis zur Originaldatei und ausreichenden Messhistorie deaktiviert.</p></section>`;
}
function measurementDots(points,unit='cm'){
 if(!points.length)return '<p class="bm918-empty">Keine Messung</p>';
 const W=250,H=70,L=12,R=12,T=12,B=16;
 const left=time(points[0].day),right=time(points.at(-1).day),span=Math.max(86400000,right-left);
 const values=points.map(x=>x.valueCm),min=Math.min(...values),max=Math.max(...values),pad=Math.max(1,(max-min)*.15);
 return `<svg role="img" aria-label="${points.length} individuelle Messpunkte" viewBox="0 0 ${W} ${H}">${points.map(x=>{const cx=L+(time(x.day)-left)/span*(W-L-R),cy=T+(max+pad-x.valueCm)/Math.max(1,max-min+pad*2)*(H-T-B);return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.4" fill="#597d8c"><title>${esc(x.day)} · ${esc(x.valueCm)} ${esc(unit)}</title></circle>`;}).join('')}<text x="${L}" y="${H-2}" font-size="8" fill="#697d77">${esc(points[0].day)}</text><text x="${W-R}" y="${H-2}" text-anchor="end" font-size="8" fill="#697d77">${esc(points.at(-1).day)}</text></svg>`;
}
/** Framework for VERIFIED future exports. No assumed vendor columns or schema. */
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
export function importFitdaysSmartTape(){throw Error('Fitdays+-Smart-Tape-Import ist deaktiviert. Originalexport und validiertes Mapping erforderlich.');}
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
