// Date-only arithmetic for the shared Inspector 2.0 shortcuts.
// UTC noon keeps DST boundaries from changing the selected calendar day.
const ISO_DAY=/^\d{4}-\d{2}-\d{2}$/;
export function inspectorDateShift(value,offset,today){
 const base=value||today;
 if(typeof base!=='string'||!ISO_DAY.test(base))return null;
 const d=new Date(base+'T12:00:00Z');
 if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==base)return null;
 if(offset==='day')d.setUTCDate(d.getUTCDate()+1);
 else if(offset==='week')d.setUTCDate(d.getUTCDate()+7);
 else if(offset==='month'){
  const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+1);
  const max=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
  d.setUTCDate(Math.min(day,max));
 }else return null;
 return d.toISOString().slice(0,10);
}
export function inspectorTitle(input){
 const value=typeof input==='string'?input.trim():'';
 return value.length&&value.length<=180?value:null;
}
