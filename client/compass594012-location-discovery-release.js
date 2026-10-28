/** Compass 0.5.77.59.40.12 — GPS header alignment and current discoveries. */
export function compass594012LocationDiscoveryRelease(){
 const once=(text,oldText,newText,where)=>{
  const count=text.split(oldText).length-1;
  if(count!==1)throw Error(`Compass .40.12 ${where}: expected 1 anchor, got ${count}`);
  return text.replace(oldText,newText);
 };
 return {name:'compass-594012-location-discovery',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.11','Build 0.5.77.59.40.12','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.11';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.12';",'client version');
  s=once(s,'Build 0.5.77.59.40.11','Build 0.5.77.59.40.12','footer');
  // Shorten the already-existing 14/7 day grace for expired unsaved imports.
  // Use tombstones so other devices also receive the removals.
  const pruneCall='prunePastEvents(state,localDate())';
  const count=s.split(pruneCall).length-1;
  if(count!==3)throw Error(`Compass .40.12 pruning: expected 3 calls, got ${count}`);
  s=s.split(pruneCall).join('prunePastEvents(state,localDate(),0,0)');
  return {code:s,map:null};
 }};
}
