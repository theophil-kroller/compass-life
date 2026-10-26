/** Compass .59.28 routine guard. Not a second clock or a replacement for Vault security.
 * Foreground playback prevents the 15-minute *application* inactivity lock.
 * After audio's true ended event, provide exactly five minutes of post-exercise grace.
 * If OS suspends audio or the page is killed, no completion is fabricated.
 */
const ROOT=()=>document.documentElement;
const CHECKPOINT='compass:wimhof:progress-v5928';
let lastPersistAt=0;
export function routineActive5928(){ROOT().dataset.compassRoutineActive='yes';delete ROOT().dataset.compassRoutineGraceUntil;}
export function routineEnded5928(){delete ROOT().dataset.compassRoutineActive;ROOT().dataset.compassRoutineGraceUntil=String(Date.now()+5*60*1000);}
export function routineStopped5928(){delete ROOT().dataset.compassRoutineActive;if(Number(ROOT().dataset.compassRoutineGraceUntil||0)>Date.now())return;delete ROOT().dataset.compassRoutineGraceUntil;}
export function saveWimCheckpoint5928(track,position,duration){
 if(!['morning','evening'].includes(track)||!Number.isFinite(position)||position<0)return;
 if(Date.now()-lastPersistAt<15000)return;
 lastPersistAt=Date.now();
 try{localStorage.setItem(CHECKPOINT,JSON.stringify({track,positionSeconds:Math.round(position),durationSeconds:Number.isFinite(duration)?Math.round(duration):null,recordedAt:new Date().toISOString(),completed:false}));}catch{}
}
export function clearWimCheckpoint5928(track){try{const row=JSON.parse(localStorage.getItem(CHECKPOINT)||'null');if(row?.track===track)localStorage.removeItem(CHECKPOINT);}catch{}}
export function pendingWimCheckpoint5928(){try{const row=JSON.parse(localStorage.getItem(CHECKPOINT)||'null');return row?.track==='morning'||row?.track==='evening'?row:null;}catch{return null;}}
