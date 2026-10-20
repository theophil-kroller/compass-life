/** 0.5.49.2: conservative local diagnostics and deterministic, recent-first batches. */
const dayOfName=(entry)=>{
 const name=String(entry?.name||'');
 const found=name.match(/(?:^|[^0-9])(20\d{2})[-_.](0[1-9]|1[0-2])[-_.](0[1-9]|[12]\d|3[01])(?=[^0-9]|$)/);
 if(found){const day=`${found[1]}-${found[2]}-${found[3]}`;if(!Number.isNaN(Date.parse(day+'T12:00:00Z')))return day;}
 return '';
};
/** An undated archive never outranks a clearly dated recent archive. Stable across scans. */
export function newestHealthFirst(entries=[]){
 return [...entries].sort((a,b)=>dayOfName(b).localeCompare(dayOfName(a))||
  (Number(b?.file?.lastModified||0)-Number(a?.file?.lastModified||0))||String(a?.name||'').localeCompare(String(b?.name||'')));
}
function localDay(iso,timezone){
 if(typeof iso!=='string'||!Number.isFinite(Date.parse(iso)))return '';
 try{
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(iso));
  const map=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return `${map.year}-${map.month}-${map.day}`;
 }catch{return ''}
}
const ranged=(dates)=>{const list=dates.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).sort();return {count:list.length,first:list[0]||'',last:list.at(-1)||''};};
/** Keep sleep and stress distinct: a successful sleep archive does not imply any stress points. */
export function healthImportCoverage(data={},timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Vienna'){
 const points=Array.isArray(data.garminWellness)?data.garminWellness:[];
 const stress=ranged(points.filter(x=>Number.isFinite(x.stress)&&x.stress>=0&&x.stress<=100).map(x=>localDay(x.at,timezone)));
 const battery=ranged(points.filter(x=>Number.isFinite(x.bodyBattery)&&x.bodyBattery>=0&&x.bodyBattery<=100).map(x=>localDay(x.at,timezone)));
 const nights=ranged((data.garminNights||[]).map(x=>x.day));
 return {stress,battery,nights};
}
