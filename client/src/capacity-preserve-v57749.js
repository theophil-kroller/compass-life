/** Compass 0.5.77.49: preserve 0.5.77.48 packet preferences when
 * the earlier 0.5.77.47 form replaces capacityGuardian as a whole.
 * Keeps validation and estimate semantics unchanged.
 */
import {saveCapacitySettings} from './capacity-guardian-v57747.js';
export function saveCapacitySettings749(state,options){
 const packets=state?.uiPreferences?.capacityGuardian?.packets;
 const result=saveCapacitySettings(state,options);
 if(packets!==undefined){
  state.uiPreferences.capacityGuardian.packets=packets;
  return state.uiPreferences.capacityGuardian;
 }
 return result;
}
