/** Compass .40.25.11 · Restore the existing premium front/back muscle atlas
 * in the already compiled full-source entry without changing the legacy
 * strength-insights module (which the historical bridge/test chain consumes).
 * Read-only rendering. The same classified session model drives both views.
 */
import {strengthInsightsView as strengthLegacyView,strengthPeriod} from './strength-insights-v57728.js';
import {strengthPremiumMap} from './strength-premium-v57738.js';

export function strengthInsightsView(state,opts={}){
 const {range='28',today,side='front'}=opts;
 const html=strengthLegacyView(state,opts);
 const from=html.indexOf('<div class="str728-visual">');
 const to=html.indexOf('<p class="str728-note"><strong>Wichtig:',from);
 if(from<0||to<from||html.indexOf('<div class="str728-visual">',from+1)!==-1)
  throw Error('Premium-Muskelkarte: historische Silhouetten-Integrationsstelle hat sich geändert.');
 const period=strengthPeriod(state,{range,today});
 // Reuse the anatomical atlas already shipped for Compass; the atlas itself
 // renders both sides and offers individual muscle details on hover/focus.
 const atlas=strengthPremiumMap(period,null,'strength',side);
 const withoutSilhouette=html.slice(0,from)+atlas+'\n '+html.slice(to);
 // Two maps are visible together: the old one-side-only toggle is misleading.
 return withoutSilhouette.replace(/<div class="str728-ranges" role="group" aria-label="Körperansicht">[\s\S]*?<\/div>/,
  '<span class="c4011-both-sides">Vorder- und Rückseite gleichzeitig</span>');
}
