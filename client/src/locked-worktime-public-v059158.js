/** Read-only lockscreen indicator + existing public Quick UI mirror.
 * NO private journal entries are persisted here. Actual punches MUST be
 * encrypted with appendSealedWorktime before invoking mirrorWorktime58.
 */
export const LOCKED_WORKTIME_PUBLIC_KEY58='compass.quick.public.v569';
export function readPublicWorktime58(){
 try{const x=JSON.parse(localStorage.getItem(LOCKED_WORKTIME_PUBLIC_KEY58)||'{}');return x&&typeof x==='object'?x:{};}
 catch{return {};}
}
export function mirrorPublicWorktime58(type,at){
 if(!['start','stop'].includes(type)||!Number.isFinite(Date.parse(at)))throw Error('Ungültiges Arbeitszeitereignis');
 const current=readPublicWorktime58(),work=current.worktime||{};
 if(type==='start'&&!work.activeStart){work.activeStart=at;work.activeCategory='work';}
 if(type==='stop'&&work.activeStart){work.sessions=[...(Array.isArray(work.sessions)?work.sessions:[]),{id:crypto.randomUUID(),start:work.activeStart,end:at,category:work.activeCategory||'work',updatedAt:at}].slice(-12);work.activeStart='';}
 work.updatedAt=at;current.worktime=work;localStorage.setItem(LOCKED_WORKTIME_PUBLIC_KEY58,JSON.stringify(current));
 return Boolean(work.activeStart);
}
