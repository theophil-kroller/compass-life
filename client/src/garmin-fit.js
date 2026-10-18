// FIT binary reader. Only selected wellness records are retained; no GPS, raw samples or device identifiers.
// Messages: sleep_level(275), sleep_summary(521), hrv_status_summary(370), stress_level(227).
const FIT_EPOCH=Date.UTC(1989,11,31)/1000;
const time=v=>Number.isInteger(v)&&v>800000000&&v<3000000000?new Date((FIT_EPOCH+v)*1000).toISOString():null;
function fieldValue(bytes,base,little){
 const d=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),n=bytes.length;
 if(base===7)return new TextDecoder().decode(bytes).split('\0')[0];
 let v;
 if(n===1) v=base===1?d.getInt8(0):d.getUint8(0);
 else if(n===2) v=base===3?d.getInt16(0,little):d.getUint16(0,little);
 else if(n===4){if(base===8)v=d.getFloat32(0,little);else v=base===5?d.getInt32(0,little):d.getUint32(0,little);}
 else return null;
 if(!Number.isFinite(v))return null;
 if([0,2,10,13].includes(base)&&v===255||[4,11].includes(base)&&v===65535||[6,12].includes(base)&&v===4294967295)return null;
 return v;
}
export function decodeGarminFit(input){
 const b=input instanceof Uint8Array?input:new Uint8Array(input);
 if(b.length<16||b[0]<12||b[0]>32||String.fromCharCode(...b.subarray(8,12))!=='.FIT')throw Error('Keine gültige FIT-Datei');
 const dv=new DataView(b.buffer,b.byteOffset,b.byteLength),end=b[0]+dv.getUint32(4,true);
 if(end+2>b.length||end<b[0])throw Error('FIT-Datei unvollständig');
 const defs=new Map(),records=[];let offset=b[0],limit=0;
 while(offset<end){
  if(++limit>350000)throw Error('Zu viele FIT-Datensätze');
  const h=b[offset++],local=h&128?(h>>5)&3:h&15;
  if(!(h&128)&&(h&64)){
   if(offset+5>end)throw Error('FIT-Definition unvollständig');
   const little=b[offset+1]===0,global=dv.getUint16(offset+2,little),count=b[offset+4];offset+=5;
   const fields=[];for(let i=0;i<count;i++){if(offset+3>end)throw Error('FIT-Feld ungültig');fields.push({num:b[offset],size:b[offset+1],base:b[offset+2]&31});offset+=3;}
   let developer=[];
   if(h&32){if(offset>=end)throw Error('FIT-Entwicklerfelder ungültig');const n=b[offset++];for(let i=0;i<n;i++){if(offset+3>end)throw Error('FIT-Entwicklerfeld unvollständig');developer.push(b[offset+1]);offset+=3;}}
   defs.set(local,{global,little,fields,developer});continue;
  }
  const def=defs.get(local);if(!def)throw Error('FIT-Datensatz ohne Definition');
  const wanted=[275,521,370,227].includes(def.global),vals={};
  for(const f of def.fields){if(offset+f.size>end)throw Error('FIT-Nutzdaten unvollständig');if(wanted&&f.size<=128)vals[f.num]=fieldValue(b.subarray(offset,offset+f.size),f.base,def.little);offset+=f.size;}
  for(const size of def.developer){if(offset+size>end)throw Error('FIT-Entwicklerdaten unvollständig');offset+=size;}
  if(wanted)records.push({type:def.global,fields:vals});
 }
 return records;
}
const rounded=x=>Number.isFinite(x)?Math.round(x*10)/10:null;
export function garminWellnessFromRecords(records){
 const levels=records.filter(r=>r.type===275&&Number.isInteger(r.fields[0])&&r.fields[0]>=0&&r.fields[0]<=4&&time(r.fields[253])).map(r=>({at:time(r.fields[253]),stage:r.fields[0]})).sort((a,b)=>a.at.localeCompare(b.at));
 const sleep=records.find(r=>r.type===521),hrv=records.find(r=>r.type===370);
 let night=null;
 if(levels.length>=2){
  const statedStart=time(sleep?.fields?.[3]),statedEnd=time(sleep?.fields?.[5]);
  const start=statedStart&&statedStart<=levels[0].at?statedStart:levels[0].at;
  const end=statedEnd&&statedEnd>=levels.at(-1).at?statedEnd:levels.at(-1).at;
  const stages=[];
  // Native FIT sleep_level entries are change points; do not guess the first unknown interval.
  if(start<levels[0].at)stages.push({start,end:levels[0].at,stage:0});
  for(let i=0;i<levels.length;i++){
   const last=levels[i],next=levels[i+1]?.at||end;
   if(next>last.at)stages.push({start:last.at,end:next,stage:last.stage});
  }
  const totals={deep:0,light:0,rem:0,awake:0,unknown:0},names=['unknown','awake','light','deep','rem'];
  for(const s of stages)totals[names[s.stage]]+=(Date.parse(s.end)-Date.parse(s.start))/60000;
  for(const key of Object.keys(totals))totals[key]=Math.round(totals[key]);
  night={day:end.slice(0,10),start,end,stages,totals,source:'garmin-fit'};
 }
 const hrvDay=time(hrv?.fields?.[253]);
 const hrvValue=hrv?.fields?.[1];
 const hrvNight=Number.isInteger(hrvValue)&&hrvValue>0&&hrvValue<65000?rounded(hrvValue/128):null;
 const hrvWeekly=Number.isInteger(hrv?.fields?.[0])&&hrv.fields[0]>0?rounded(hrv.fields[0]/128):null;
 return {night,hrv:hrvNight!==null||hrvWeekly!==null?{day:night?.day||hrvDay?.slice(0,10),nightAverageMs:hrvNight,weeklyAverageMs:hrvWeekly,source:'garmin-fit'}:null};
}

/** Historical Garmin account export may provide *_sleepData.json instead of daily FIT.
 *  Never infer a phase timeline from aggregate values alone. */
export function garminSleepJson(input){
 const parseAt=x=>{
  if(typeof x==='number'&&Number.isFinite(x))return new Date(x).toISOString();
  if(typeof x!=='string'||!x)return null;
  const n=Date.parse(x);return Number.isFinite(n)?new Date(n).toISOString():null;
 };
 const rows=Array.isArray(input)?input:Array.isArray(input?.data)?input.data:Array.isArray(input?.sleepData)?input.sleepData:[input];
 const nights=[];
 for(const source of rows){
  const dto=source?.dailySleepDTO||source?.sleepSummary||source;
  if(!dto||typeof dto!=='object')continue;
  const start=parseAt(dto.sleepStartTimestampGMT||dto.sleepStartTimestampLocal||dto.sleepStartTimestamp);
  const end=parseAt(dto.sleepEndTimestampGMT||dto.sleepEndTimestampLocal||dto.sleepEndTimestamp);
  const day=String(dto.calendarDate||source.calendarDate||end?.slice(0,10)||'');
  if(!/^\d{4}-\d\d-\d\d$/.test(day))continue;
  const validSeconds=v=>Number.isFinite(v)&&v>=0&&v<=90000?Math.round(v/60):null;
  const reported={deep:validSeconds(dto.deepSleepSeconds),light:validSeconds(dto.lightSleepSeconds),rem:validSeconds(dto.remSleepSeconds),awake:validSeconds(dto.awakeSleepSeconds)};
  const rawLevels=Array.isArray(source.sleepLevels)?source.sleepLevels:[];
  const levelMap={0:3,1:2,2:4,3:1};
  const stages=rawLevels.map(x=>{
    const a=parseAt(x.startGMT||x.startTimeGMT||x.startTimestampGMT),b=parseAt(x.endGMT||x.endTimeGMT||x.endTimestampGMT);
    const code=levelMap[x.activityLevel];
    return a&&b&&b>a&&code!==undefined?{start:a,end:b,stage:code}:null;
  }).filter(Boolean).sort((a,b)=>a.start.localeCompare(b.start));
  if(!stages.length&&!Object.values(reported).some(x=>x!==null))continue;
  const totals={deep:reported.deep??0,light:reported.light??0,rem:reported.rem??0,awake:reported.awake??0,unknown:0};
  if(stages.length&&!Object.values(reported).some(x=>x!==null)){
   for(const s of stages){const k=['unknown','awake','light','deep','rem'][s.stage];totals[k]+=(Date.parse(s.end)-Date.parse(s.start))/60000;}
   for(const k of Object.keys(totals))totals[k]=Math.round(totals[k]);
  }
  nights.push({day,start:start||stages[0]?.start||null,end:end||stages.at(-1)?.end||null,stages,totals,source:'garmin-account-export'});
 }
 return nights;
}

/** Garmin stress_level FIT global 227: field 0 stress (negative = invalid / activity),
 * field 1 Garmin timestamp, field 3 body_energy (Garmin Body Battery, 0–100).
 * Samples are condensed into 5-minute UTC buckets; never interpolate gaps.
 * Stress: median of valid samples per bucket. Battery: last valid sample.
 */
export function garminStressEnergyFromRecords(records){
 const buckets=new Map();
 for(const record of records){
  if(record.type!==227)continue;
  const timestamp=time(record.fields?.[1]);if(!timestamp)continue;
  const stress=record.fields[0],energy=record.fields[3];
  const validStress=Number.isInteger(stress)&&stress>=0&&stress<=100?stress:null;
  const validBattery=Number.isInteger(energy)&&energy>=0&&energy<=100?energy:null;
  if(validStress===null&&validBattery===null)continue;
  const ms=Date.parse(timestamp),bucket=Math.floor(ms/300000)*300000;
  let value=buckets.get(bucket);
  if(!value){value={at:new Date(bucket).toISOString(),stress:[],battery:null,batteryTime:0};buckets.set(bucket,value);}
  if(validStress!==null)value.stress.push(validStress);
  if(validBattery!==null&&ms>=value.batteryTime){value.battery=validBattery;value.batteryTime=ms;}
 }
 return [...buckets.values()].sort((a,b)=>a.at.localeCompare(b.at)).map(x=>{
  const values=x.stress.sort((a,b)=>a-b),n=values.length;
  const stress=n?(n%2?values[(n-1)/2]:(values[n/2-1]+values[n/2])/2):null;
  return {at:x.at,stress,bodyBattery:x.battery};
 });
}
