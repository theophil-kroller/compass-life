/** User-defined Inbox order (device-local encrypted Vault preference). Keeps item content untouched. */
export function inboxOrdered(records=[],savedOrder=[]){
 const ids=new Map((Array.isArray(savedOrder)?savedOrder:[]).filter(x=>typeof x==='string').slice(0,15000).map((id,i)=>[id,i]));
 return [...records].sort((a,b)=>{
  const ai=ids.get(a.id),bi=ids.get(b.id);
  return ai!==undefined&&bi!==undefined?ai-bi:ai!==undefined?1:bi!==undefined?-1:0;
 });
}
/** Insert a visible item before/after another; preserve all hidden/filter-excluded items. */
export function inboxMove(savedOrder=[],allRecords=[],movingId='',targetId='',after=false){
 const all=[...allRecords],ids=new Set(all.map(x=>x.id));
 if(!ids.has(movingId)||!ids.has(targetId)||movingId===targetId)return null;
 const full=inboxOrdered(all,savedOrder).map(x=>x.id).filter(x=>x!==movingId);
 const target=full.indexOf(targetId);if(target<0)return null;
 full.splice(target+(after?1:0),0,movingId);
 return full.slice(0,15000);
}
export function inboxNudge(savedOrder=[],allRecords=[],movingId='',direction=0){
 const sorted=inboxOrdered(allRecords,savedOrder).map(x=>x.id);
 const pos=sorted.indexOf(movingId),next=pos+direction;
 if(![-1,1].includes(direction)||pos<0||next<0||next>=sorted.length)return null;
 return inboxMove(savedOrder,allRecords,movingId,sorted[next],direction>0);
}
