/** Optional task self-assessment. Backward-compatible storage in task note.
 * This content follows task notes to the existing task-sync backend; nothing is inferred.
 */
const MARK = /\n?\[Compass-TaskFriction:([^\]\r\n]+)\]/g;
export const OVERCOMING=[['','Nicht festgelegt'],['low','Gering'],['medium','Mittel'],['high','Hoch']];
export const EFFORT=[['','Nicht festgelegt'],['low','Gering'],['medium','Mittel'],['high','Hoch']];
export const BLOCKERS=[['','Kein Grund hinterlegt'],['unclear','Nächster Schritt unklar'],['unpleasant','Unangenehme Kontaktaufnahme'],['shame','Scham / lange nicht gemeldet'],['conflict','Mögliche Konflikte'],['other','Anderer Grund']];
export function taskFriction(note=''){
 const matches=[...String(note||'').matchAll(MARK)];if(!matches.length)return {overcoming:'',effort:'',blocker:''};
 try{const parsed=JSON.parse(decodeURIComponent(matches.at(-1)[1]));return {
  overcoming:OVERCOMING.some(x=>x[0]===parsed.o)?parsed.o:'',
  effort:EFFORT.some(x=>x[0]===parsed.e)?parsed.e:'',
  blocker:BLOCKERS.some(x=>x[0]===parsed.b)?parsed.b:''
 };}catch{return {overcoming:'',effort:'',blocker:''};}
}
export function stripTaskFriction(note=''){return String(note||'').replace(MARK,'').trimEnd();}
export function taskNoteWithFriction(visibleNote='',values={}){
 const clean=stripTaskFriction(visibleNote).slice(0,2550);
 const overcoming=OVERCOMING.some(x=>x[0]===values.overcoming)?values.overcoming:'';
 const effort=EFFORT.some(x=>x[0]===values.effort)?values.effort:'';
 const blocker=BLOCKERS.some(x=>x[0]===values.blocker)?values.blocker:'';
 if(!overcoming&&!effort&&!blocker)return clean;
 const marker='[Compass-TaskFriction:'+encodeURIComponent(JSON.stringify({o:overcoming,e:effort,b:blocker}))+']';
 return clean?(clean+'\n'+marker):marker;
}
export function frictionSummary(note){
 const x=taskFriction(note), out=[];
 const label=(set,value)=>set.find(row=>row[0]===value)?.[1]||'';
 if(x.overcoming)out.push('Überwindung: '+label(OVERCOMING,x.overcoming));
 if(x.effort)out.push('Energieaufwand: '+label(EFFORT,x.effort));
 if(x.blocker)out.push('Hinderungsgrund: '+label(BLOCKERS,x.blocker));
 return out.join(' · ');
}
