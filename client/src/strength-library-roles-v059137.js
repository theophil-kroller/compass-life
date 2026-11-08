/** Canonical read-only roles for the optional exercise library. */
import {exerciseMuscleRoles122,ANATOMY_REGIONS} from './strength-anatomy-v57737.js';
const ANATOMY_NAMES_137=new Map(ANATOMY_REGIONS.map(region=>[region.id,region.label]));
/** Single source of truth: the exact same roles drive the map and library. */
export function libraryMuscleRoles137(id){
 const roles=exerciseMuscleRoles122(id);if(!roles)return null;
 const names=items=>items.map(key=>ANATOMY_NAMES_137.get(key)||key);
 return {primary:names(roles.primary),secondary:names(roles.secondary),stabilizers:names(roles.stabilizers)};
}
