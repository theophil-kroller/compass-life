/** Compass 0.5.77.59.32: release label only. Menu and wallpaper are native source changes. */
export function compass5932FoodDesktopBridge(){
 return {name:'compass-5932-food-desktop',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  const old='Build 0.5.77.59.31';
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   if(source.split(old).length!==2)throw Error('Compass .59.32 lock version anchor changed');
   return {code:source.replace(old,'Build 0.5.77.59.32'),map:null};
  }
  if(path.endsWith('/client/src/main.js')){
   const prior="const COMPASS_CLIENT_VERSION='0.5.77.59.31';";
   if(source.split(prior).length!==2||source.split(old).length!==2)throw Error('Compass .59.32 main version anchors changed');
   return {code:source.replace(prior,"const COMPASS_CLIENT_VERSION='0.5.77.59.32';").replace(old,'Build 0.5.77.59.32'),map:null};
  }
  return null;
 }};
}
