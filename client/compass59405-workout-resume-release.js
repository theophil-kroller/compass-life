/** Compass .59.40.5 – banner + client version only. Guided recovery is a normal lazy module. */
export function compass59405WorkoutResumeRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.5 ${label}: ${n} anchors`);return s.replace(a,b);};
 return {name:'compass59405-workout-resume',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/strength-guided-v5775920.js')){
   // After the .5928 transform has introduced the active-routine gate, restored
   // workouts also keep auto-lock suspended while actually running.
   if(!source.includes('routineActive5928()'))return null;
   return {code:once(source,'if(resumeSession){const until=','if(resumeSession){routineActive5928();const until=','resume lock protection'),map:null};
  }
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  if(!source.includes('Build 0.5.77.59.40.4'))return null;
  let s=once(source,'Build 0.5.77.59.40.4','Build 0.5.77.59.40.5','badge');
  if(path.endsWith('/client/src/main.js'))s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.4';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.5';",'client version');
  return {code:s,map:null};
 }};
}
