/** Non-destructive, opt-in people-directory merge for the encrypted journal.
 * No profile leaves the client unless the existing E2EE journal key and the
 * explicit local `peopleSyncEnabled` setting are both present.
 */
const validStamp=value=>typeof value==='string'&&Number.isFinite(Date.parse(value))?value:'';
const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
function safeDirectory(source){
 const out={};if(!source||typeof source!=='object'||Array.isArray(source))return out;
 for(const [id,item] of Object.entries(source)){
  if(!id||id==='__proto__'||id==='constructor'||!item||typeof item!=='object'||Array.isArray(item)||item.id!==id||typeof item.name!=='string')continue;
  out[id]=item;
 }
 return out;
}
export function mergePeopleDirectory(localPeople={},remotePeople={},localDeleted={},remoteDeleted={}){
 const local=safeDirectory(localPeople),remote=safeDirectory(remotePeople),people={},deleted={};
 for(const id of [...new Set([...Object.keys(localDeleted||{}),...Object.keys(remoteDeleted||{})])].sort()){
  if(id==='__proto__'||id==='constructor')continue;
  const a=validStamp(localDeleted?.[id]),b=validStamp(remoteDeleted?.[id]);
  if(a||b)deleted[id]=a>b?a:b;
 }
 for(const id of [...new Set([...Object.keys(local),...Object.keys(remote)])].sort()){
  const a=local[id],b=remote[id];let item;
  if(!a)item=b;
  else if(!b)item=a;
  else{
   const at=validStamp(a.updatedAt),bt=validStamp(b.updatedAt);
   if(at!==bt)item=at>bt?a:b;
   else{
    // A legacy record has no update time. Prefer the richer copy, then use
    // a deterministic tie breaker so repeated merges converge on both devices.
    const sa=JSON.stringify(a),sb=JSON.stringify(b);
    item=sa.length!==sb.length?(sa.length>sb.length?a:b):(sa>=sb?a:b);
   }
  }
  // Tombstones only apply if newer than the last known profile update.
  if(own(deleted,id)&&(!validStamp(item.updatedAt)||deleted[id]>=validStamp(item.updatedAt)))continue;
  people[id]=item;
  if(own(deleted,id))delete deleted[id];
 }
 return {people,peopleDeleted:deleted};
}
/** Called only after actual mutations in the People screen, never on typing. */
export function markChangedPeople(before={},after={},previousDeleted={},now=new Date().toISOString()){
 const people=after||{},peopleDeleted={...(previousDeleted||{})};
 for(const id of new Set([...Object.keys(before||{}),...Object.keys(people)])){
  const prior=before?.[id],current=people[id];
  if(prior&&!current){peopleDeleted[id]=now;continue;}
  if(current&&(!prior||JSON.stringify({...prior,updatedAt:null})!==JSON.stringify({...current,updatedAt:null}))){
   current.updatedAt=now;
   if(peopleDeleted[id])delete peopleDeleted[id];
  }
 }
 return peopleDeleted;
}
