/** .40.20: annual report time-journal work/rest crash fix; release chain follows .40.19. */
export function compass594020AnnualWorkmapRelease(){
 const once=(s,oldValue,newValue,label)=>{const count=s.split(oldValue).length-1;if(count!==1)throw Error('Compass .40.20 '+label+' expected one anchor, got '+count);return s.replace(oldValue,newValue);};
 return {name:'compass-594020-annual-workmap-hotfix',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.19','Build 0.5.77.59.40.20','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.19';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.20';",'version');
  s=once(s,'Build 0.5.77.59.40.19','Build 0.5.77.59.40.20','footer');
  if(!s.includes('reportWindow.document.write(annualDocument(state,'))throw Error('Compass .40.20 Annual report renderer not wired');
  return {code:s,map:null};
 }};
}
