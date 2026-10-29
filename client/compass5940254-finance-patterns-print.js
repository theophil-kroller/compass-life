/** Release .40.25.4 — Finance atlas: mandatory print insertion, visible diagnostics. */
export function compass5940254FinancePatternsPrint(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.4 ${label}: expected 1 anchor, found ${n}`);return s.replace(a,b);};
 return {name:'compass-5940254-finance-patterns-print',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.3','Build 0.5.77.59.40.25.4','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.3';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.4';",'version');
  s=once(s,'Build 0.5.77.59.40.25.3','Build 0.5.77.59.40.25.4','footer');
  if(!s.includes('reportWindow.document.write(annualDocument(state,'))throw Error('Compass .40.25.4: Druck-Entrypoint nicht mit Annual-Renderer verbunden');
  return {code:s,map:null};
 }};
}
