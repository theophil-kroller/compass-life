import {decodeGarminFit,garminWellnessFromRecords,garminSleepJson,garminStressEnergyFromRecords,garminMonitoringFromRecords,garminSessionsFromRecords} from './garmin-fit.js';

// File formats are detected from bytes; Fitdays .csv exports are often actually XLS (OLE/BIFF).
export const isXls=bytes=>bytes.length>=8&&[0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1].every((n,i)=>bytes[i]===n);
export const isZip=bytes=>bytes.length>4&&bytes[0]===80&&bytes[1]===75;
export const isFit=bytes=>bytes.length>=12&&new TextDecoder().decode(bytes.subarray(8,12))==='.FIT';
const LIMIT_FILE=120*1024*1024,MAX_ENTRIES=12000,MAX_UNPACK=210*1024*1024;
const isoFromFitdays=x=>{
 const s=String(x||'').trim();let m=s.match(/^(\d{1,2}):(\d\d)\s+([A-Za-z]+)\.?(\d{1,2}),\s*(\d{4})$/);
 if(m){const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],idx=months.indexOf(m[3].slice(0,3).toLowerCase());if(idx<0)return null;return `${m[5]}-${String(idx+1).padStart(2,'0')}-${m[4].padStart(2,'0')}T${m[1].padStart(2,'0')}:${m[2]}:00`;}
 m=s.match(/^(\d{4}-\d\d-\d\d)[ T](\d\d:\d\d)(?::\d\d)?/);if(m)return m[1]+'T'+m[2]+':00';
 if(x instanceof Date&&!isNaN(x))return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}T${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}:00`;
 return null;
};
const numeric=x=>{if(typeof x==='number')return Number.isFinite(x)?x:null;const match=String(x??'').trim().match(/^-?\d+(?:[.,]\d+)?/);return match?Number(match[0].replace(',','.')):null;};
const within=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max?Math.round(x*100)/100:null;
const headings=x=>String(x||'').toLowerCase().replace(/\s+/g,' ').trim();
export function parseFitdaysRows(rows){
 if(!Array.isArray(rows)||!rows.length)throw Error('Fitdays-Tabelle ist leer');
 const headIndex=rows.findIndex(r=>Array.isArray(r)&&r.some(c=>headings(c)==='date')&&r.some(c=>headings(c)==='weight'));
 if(headIndex<0)throw Error('Fitdays-Spalten „Date“ und „Weight“ nicht gefunden');
 const head=rows[headIndex].map(headings),column=(n)=>head.indexOf(n),value=(r,n)=>numeric(r[column(n)]);
 const output=[];for(const r of rows.slice(headIndex+1)){
  if(!Array.isArray(r))continue;
  const at=isoFromFitdays(r[column('date')]);if(!at)continue;
  const weight=within(value(r,'weight'),20,350);
  if(weight===null)continue;
  const bodyFat=within(value(r,'body fat'),1,75),muscleMass=within(value(r,'muscle mass'),2,200);
  const regions=[['rightArm','right arm'],['leftArm','left arm'],['trunk','trunk'],['rightLeg','right leg'],['leftLeg','left leg']];
  const segment=(field)=>{
   const raw=String(r[column(field)]??'').trim();
   const parts=raw.split('/');
   const mass=within(numeric(parts[0]),0,60),relative=within(numeric(parts[1]),0,350);
   if(mass===null)return null;
   return {kg:mass,relativePct:relative,label:parts[2]?.slice(0,32)||''};
  };
  const segmentFat={},segmentMuscle={};
  for(const [key,name] of regions){
   const fat=segment(name+'-segmental fat analysis'),muscle=segment(name+'-muscle balance');
   if(fat)segmentFat[key]=fat;
   if(muscle)segmentMuscle[key]=muscle;
  }
  const entry={at,day:at.slice(0,10),weightKg:weight,bodyFatPct:bodyFat,visceralFat:within(value(r,'visceral fat'),0,60),waterPct:within(value(r,'body water'),5,90),muscleKg:muscleMass,boneKg:within(value(r,'bone mass'),0,30),proteinPct:within(value(r,'protein'),0,60),fatMassKg:within(value(r,'fat mass'),0,200),segmentFat,segmentMuscle,source:'fitdays'};
  // Same timestamp with distinct measurements is deliberately retained.
  entry.id=`${at}|${[weight,bodyFat,muscleMass,entry.waterPct,entry.visceralFat,entry.fatMassKg].join('|')}|${JSON.stringify([segmentFat,segmentMuscle])}`;
  output.push(entry);
 }
 if(!output.length)throw Error('Keine verwertbaren Fitdays-Messungen gefunden');
 return output;
}
export async function parseFitdaysFile(bytes){
 const XLS=await import('xlsx');let rows;
 if(isXls(bytes)||bytes[0]===80&&bytes[1]===75){
  const book=XLS.read(bytes,{type:'array',cellDates:false,codepage:65001});
  rows=XLS.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,defval:'',raw:false});
 }else{
  const content=new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/,'');
  // Delimited text export fallback; use SheetJS to handle embedded delimiters and quotes.
  const book=XLS.read(content,{type:'string'});
  rows=XLS.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,defval:'',raw:false});
 }
 return parseFitdaysRows(rows);
}
function mergeGarmin(records){
 const nights=new Map(),hrvs=new Map(),wellness=new Map(),fitness=new Map(),sessions=new Map();
 for(const rows of records){const r=garminWellnessFromRecords(rows);
  if(r.night){const former=nights.get(r.night.day);if(!former||r.night.stages.length>former.stages.length)nights.set(r.night.day,r.night);}
  if(r.hrv?.day){const former=hrvs.get(r.hrv.day);if(!former||r.hrv.nightAverageMs!==null)hrvs.set(r.hrv.day,r.hrv);}
  for(const d of garminMonitoringFromRecords(rows)){const prev=fitness.get(d.day);fitness.set(d.day,prev?{...prev,steps:Math.max(prev.steps??0,d.steps??0),distanceKm:Math.max(prev.distanceKm??0,d.distanceKm??0),activeMinutes:Math.max(prev.activeMinutes??0,d.activeMinutes??0),samples:prev.samples+d.samples}:d);}
  for(const item of garminSessionsFromRecords(rows))sessions.set(item.id,item);
  for(const item of garminStressEnergyFromRecords(rows)){
   const prev=wellness.get(item.at);
   wellness.set(item.at,prev?{at:item.at,stress:item.stress??prev.stress,bodyBattery:item.bodyBattery??prev.bodyBattery}:item);
  }
 }
 return {nights:[...nights.values()],hrvs:[...hrvs.values()],wellness:[...wellness.values()].sort((a,b)=>a.at.localeCompare(b.at)),fitness:[...fitness.values()].sort((a,b)=>a.day.localeCompare(b.day)),sessions:[...sessions.values()].sort((a,b)=>a.start.localeCompare(b.start))};
}
export async function parseGarminFile(bytes,name=''){
 if(isFit(bytes))return mergeGarmin([decodeGarminFit(bytes)]);
 if(/\.json$/i.test(name)&&!isZip(bytes)){const nights=garminSleepJson(JSON.parse(new TextDecoder().decode(bytes)));if(!nights.length)throw Error('Keine auswertbaren Schlafdaten im Garmin-JSON');return {nights,hrvs:[],wellness:[],fitness:[],sessions:[],read:1,failed:[]};}
 if(!isZip(bytes))throw Error('Bitte ein Garmin-ZIP oder eine FIT-Datei wählen');
 const {unzip}=await import('fflate');
 const files=await new Promise((resolve,reject)=>unzip(bytes,{filter:file=>(/\.fit$/i.test(file.name)||/sleepData\.json$/i.test(file.name))&&!file.name.startsWith('__MACOSX/')},(error,result)=>error?reject(error):resolve(result)));
 const entries=Object.entries(files);if(entries.length>MAX_ENTRIES)throw Error('Zu viele FIT-Dateien – Archiv aufteilen');
 let total=0;const records=[],failed=[],historical=[];
 for(const [path,content] of entries){total+=content.byteLength;if(total>MAX_UNPACK)throw Error('Entpackte Daten zu groß – Garmin-Export bitte aufteilen');
  if(/sleepData\.json$/i.test(path)){try{historical.push(...garminSleepJson(JSON.parse(new TextDecoder().decode(content))));}catch{failed.push(path.split('/').at(-1));}continue;}
  if(!/\.fit$/i.test(path))continue;
  try{records.push(decodeGarminFit(content));}catch{failed.push(path.split('/').at(-1));}
 }
 const parsed=mergeGarmin(records);
 parsed.nights=[...new Map([...historical,...parsed.nights].map(n=>[n.day,n])).values()];
 if(!parsed.nights.length&&!parsed.hrvs.length&&!parsed.wellness.length&&!parsed.fitness.length&&!parsed.sessions.length)throw Error(`Garmin-Archiv enthält keine auswertbaren Schlaf-, HRV-, Stress-, Body-Battery- oder Aktivitätsdaten (${records.length} FIT-Dateien geprüft).`);
 return {...parsed,read:records.length+historical.length,failed};
}
export async function inspectHealthFiles(files){
 if(!files?.length)throw Error('Bitte Dateien auswählen');
 const result={fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[],errors:[],processed:0};
 if(files.length>75)throw Error('Bitte maximal 75 Dateien gleichzeitig wählen');
 for(const file of files){
  try{
   if(file.size>LIMIT_FILE)throw Error('Datei größer als 120 MB – Archiv bitte aufteilen');
   const bytes=new Uint8Array(await file.arrayBuffer());
   if(isXls(bytes)||/fitdays/i.test(file.name)||/\.(csv|xls|xlsx)$/i.test(file.name)&&!isZip(bytes)){
    result.fitdays.push(...await parseFitdaysFile(bytes));
   }else{
    const v=await parseGarminFile(bytes,file.name);result.garminNights.push(...v.nights);result.garminHrv.push(...v.hrvs);result.garminWellness.push(...(v.wellness||[]));result.garminFitness.push(...(v.fitness||[]));result.garminSessions.push(...(v.sessions||[]));
    if(v.failed?.length)result.errors.push(`${file.name}: ${v.failed.length} FIT-Datei(en) nicht lesbar`);
   }
   result.processed++;
  }catch(e){result.errors.push(`${file.name}: ${e.message}`);}
 }
 // Multiple overlapping archives and repeated exports are common.
 const unique=(rows,key,prefer=()=>true)=>{const map=new Map();for(const row of rows){const k=key(row),old=map.get(k);if(!old||prefer(old,row))map.set(k,row);}return [...map.values()];};
 result.fitdays=unique(result.fitdays,x=>x.id).sort((a,b)=>a.at.localeCompare(b.at));
 result.garminNights=unique(result.garminNights,x=>x.day,(old,n)=>n.stages.length>=(old.stages?.length||0)).sort((a,b)=>a.day.localeCompare(b.day));
 result.garminHrv=unique(result.garminHrv,x=>x.day).sort((a,b)=>a.day.localeCompare(b.day));
 result.garminWellness=unique(result.garminWellness,x=>x.at).sort((a,b)=>a.at.localeCompare(b.at));
 result.garminFitness=unique(result.garminFitness,x=>x.day,(old,n)=>(n.steps??0)>(old.steps??0)).sort((a,b)=>a.day.localeCompare(b.day));
 result.garminSessions=unique(result.garminSessions,x=>x.id).sort((a,b)=>a.start.localeCompare(b.start));
 return result;
}
export function commitHealthImport(s,preview){
 s.healthImports??={fitdays:[],garminNights:[],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[],lastImportAt:null};
 const target=s.healthImports;const merge=(a,b,key,quality=false)=>{const map=new Map();for(const x of [...a,...b]){const old=map.get(key(x));if(!old||!quality||(x.stages?.length||0)>=(old.stages?.length||0))map.set(key(x),x);}return [...map.values()].sort((x,y)=>(x.at||x.day).localeCompare(y.at||y.day));};
 const before=[target.fitdays.length,target.garminNights.length,target.garminHrv.length];
 target.fitdays=merge(target.fitdays,preview.fitdays,x=>x.id);
 target.garminNights=merge(target.garminNights,preview.garminNights,x=>x.day,true);
 target.garminHrv=merge(target.garminHrv,preview.garminHrv,x=>x.day);
 // Merge by 5-minute timestamp and preserve populated fields from previous imports.
 const points=new Map((target.garminWellness||[]).map(x=>[x.at,x]));
 for(const row of preview.garminWellness||[]){const prior=points.get(row.at);points.set(row.at,prior?{at:row.at,stress:row.stress??prior.stress,bodyBattery:row.bodyBattery??prior.bodyBattery}:row);}
 target.garminWellness=[...points.values()].sort((a,b)=>a.at.localeCompare(b.at));
 const dayMap=new Map((target.garminFitness||[]).map(x=>[x.day,x]));
 for(const row of preview.garminFitness||[]){const old=dayMap.get(row.day);dayMap.set(row.day,old?{...old,steps:Math.max(old.steps??0,row.steps??0),distanceKm:Math.max(old.distanceKm??0,row.distanceKm??0),activeMinutes:Math.max(old.activeMinutes??0,row.activeMinutes??0),samples:Math.max(old.samples||0,row.samples||0)}:row);}
 target.garminFitness=[...dayMap.values()].sort((a,b)=>a.day.localeCompare(b.day));
 const sessionMap=new Map((target.garminSessions||[]).map(x=>[x.id,x]));for(const row of preview.garminSessions||[])sessionMap.set(row.id,row);
 target.garminSessions=[...sessionMap.values()].sort((a,b)=>a.start.localeCompare(b.start));
 target.lastImportAt=new Date().toISOString();
 return [target.fitdays.length-before[0],target.garminNights.length-before[1],target.garminHrv.length-before[2]];
}
export function missingGarminDays(nights,today,cap=21){
 const have=new Set(nights.map(x=>x.day)),dates=[];
 if(!nights.length)return [];
 const first=nights.map(x=>x.day).sort().at(-1),start=new Date(first+'T12:00:00Z'),end=new Date(today+'T12:00:00Z');
 for(let d=new Date(start);d<=end&&dates.length<cap;d.setUTCDate(d.getUTCDate()+1))if(!have.has(d.toISOString().slice(0,10)))dates.push(d.toISOString().slice(0,10));
 return dates;
}
