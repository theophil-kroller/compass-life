// Presentation-only view model: missing measurements stay missing, no medical judgements.
const isNum=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export const healthDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'');
export function healthViewModel(days=[],today=new Date().toISOString().slice(0,10),span=7){
 const dates=Array.from({length:span},(_,i)=>{const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(span-1-i));return d.toISOString().slice(0,10);});
 const index=new Map(days.filter(x=>x&&healthDate(x.day)).map(x=>[x.day,x]));
 const points=dates.map(day=>({day,steps:isNum(index.get(day)?.steps)?index.get(day).steps:null,sleepMinutes:isNum(index.get(day)?.sleepMinutes)?index.get(day).sleepMinutes:null,exerciseMinutes:isNum(index.get(day)?.exerciseMinutes)?index.get(day).exerciseMinutes:null}));
 const stats={};for(const key of ['steps','sleepMinutes','exerciseMinutes']){const xs=points.map(x=>x[key]).filter(isNum);stats[key]={average:xs.length?Math.round(xs.reduce((s,v)=>s+v,0)/xs.length):null,total:xs.length?xs.reduce((s,v)=>s+v,0):null,count:xs.length};}
 return {points,stats,daysWithData:points.filter(x=>['steps','sleepMinutes','exerciseMinutes'].some(k=>isNum(x[k]))).length};
}
export const healthTime=n=>n==null?'–':`${Math.floor(n/60)} h ${Math.round(n%60).toString().padStart(2,'0')} m`;
export function healthBars(points,key){const max=Math.max(...points.map(x=>x[key]??0),1);return points.map(x=>({day:x.day,value:x[key],height:x[key]===null?0:Math.max(4,Math.round(x[key]/max*100)),label:x[key]===null?'Keine Messung':key==='steps'?`${x[key].toLocaleString('de-AT')} Schritte`:key==='sleepMinutes'?`${healthTime(x[key])} Schlaf`:`${x[key]} min Training`}));}
export function healthObservation(vm){
 const sl=vm.stats.sleepMinutes;
 if(!sl.count)return 'Für diesen Zeitraum sind keine Schlafmessungen vorhanden. Das bedeutet nicht, dass du nicht geschlafen hast.';
 if(sl.count<3)return `Schlaf ist an ${sl.count} von ${vm.points.length} Tagen erfasst. Für eine Entwicklung sind mehr Messungen hilfreich.`;
 return `An ${sl.count} Tagen liegen Schlafdaten vor (Ø ${healthTime(sl.average)} pro erfasstem Tag). Schlafdauer allein sagt wenig über die Schlafqualität aus.`;
}
