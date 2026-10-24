/** Compass 0.5.77.51 — Premium UI foundation.
 * Strict, presentational transforms applied AFTER .50. Today stays an execution
 * surface: the task list, calendar, capture, context panel and Inspector remain.
 * No persistence, data model, routing or API changes.
 */
export function compass751Bridge(){
 const once=(src,from,to,label)=>{
  const count=src.split(from).length-1;
  if(count!==1)throw Error(`Compass .51: ${label}: expected one source anchor, found ${count}`);
  return src.replace(from,to);
 };
 return {name:'compass-751-premium-ui',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let code=source;
  const change=(from,to,label)=>{code=once(code,from,to,label);};
  change("const COMPASS_CLIENT_VERSION='0.5.77.50';",
         "const COMPASS_CLIENT_VERSION='0.5.77.51';",'version');
  change("import './insights-navigation-v57750.css';",
         "import './insights-navigation-v57750.css';\nimport './premium-ui-v57751.css';",'premium stylesheet');
  // Scope the design system to the normal unlocked application shell, leaving
  // vault setup / fatal / offline capture overlays' state machines unaffected.
  change('<div class="shell"><aside class="sidebar"',
         '<div class="shell premium751"><aside class="sidebar"','app shell');
  // Use one consistent branded icon in the macOS sidebar and the PWA manifest.
  // BASE_URL works at both / and GitHub Pages /compass-life/.
  change('<div class="brand"><span class="brand-icon">${ico(\'compass\',24)}</span>',
         '<div class="brand"><span class="brand-icon premium751-brandmark"><img src="${import.meta.env.BASE_URL}icon-192.png" width="38" height="38" alt="" decoding="async"/></span>',
         'sidebar brand icon');
  // Today is NOT replaced with an analytics dashboard; the existing UI and
  // inspector/capture/action bindings are deliberately left untouched.
  change('<div class="today-layout">${calendarRail()}',
         '<div class="today-layout premium751-today">${calendarRail()}',
         'today workspace design scope');
  return {code,map:null};
 }};
}
