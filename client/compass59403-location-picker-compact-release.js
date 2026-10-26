/** Compass 0.5.77.59.40.3: more compact icon-first location picker.
 * Builds on .40.2 and keeps all .39/.40 handlers unchanged.
 */
export function compass59403LocationPickerCompactRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.3 ${label}: expected one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-59403-location-picker-compact',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.40.2','Build 0.5.77.59.40.3','visible build badge');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.2';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.3';",'client version');
  s=once(s,"import {locationPicker42} from './location-picker-v57759402.js';\nimport './location-picker-v57759402.css';","import {locationPicker43} from './location-picker-v57759403.js';\nimport './location-picker-v57759403.css';",'compact picker imports');
  s=once(s,'locationPicker42(state)','locationPicker43(state)','compact picker call');
  return {code:s,map:null};
 }};
}
