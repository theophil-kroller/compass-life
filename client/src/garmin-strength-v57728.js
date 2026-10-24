/** Compass 0.5.77.28 · Strength FIT support. Local/private, no routes/PII.
 * FIT profile: set=225 (0 duration /1000, 3 reps, 4 weight /16, 5 type,
 * 6 start, 7 categories[], 8 subtypes[], 254 timestamp); exercise_title=264;
 * workout_step=27, session=18. Absent values stay null, never zero.
 */
const FIT_EPOCH=Date.UTC(1989,11,31);
export const fitTime=v=>Number.isInteger(v)&&v>=800000000&&v<3000000000?new Date(FIT_EPOCH+v*1000).toISOString():null;
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max?v:null;
const first=x=>Array.isArray(x)?x[0]:x;
const validStr=x=>typeof x==='string'?x.trim().slice(0,100):'';
/** Decode only the necessary FIT field types; supports variable-length category arrays. */
export function strengthFitField(bytes,base,little){
 if(base===7)return new TextDecoder('utf-8',{fatal:false}).decode(bytes).split('\0')[0].slice(0,180);
 const sizes={0:1,1:1,2:1,3:2,4:2,5:4,6:4,8:4,10:1,11:2,12:4,13:1,14:8,15:8,16:8};
 const size=sizes[base];if(!size||bytes.length%size||bytes.length>256)return null;
 const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),out=[];
 for(let i=0;i<bytes.length;i+=size){let value;
  switch(base){
   case 0:case 2:case 10:case 13:value=dv.getUint8(i);break;
   case 1:value=dv.getInt8(i);break;
   case 3:value=dv.getInt16(i,little);break;
   case 4:case 11:value=dv.getUint16(i,little);break;
   case 5:value=dv.getInt32(i,little);break;
   case 6:case 12:value=dv.getUint32(i,little);break;
   case 8:value=dv.getFloat32(i,little);break;
   case 14:value=Number(dv.getIntBigInt64(i,little));break;
   case 15:case 16:value=Number(dv.getBigUint64(i,little));break;
   default:value=null;
  }
  const invalid=(base===0||base===2||base===10||base===13)&&value===255||(base===3&&value===32767)||(base===4||base===11)&&value===65535||(base===5&&value===2147483647)||(base===6||base===12)&&value===4294967295||base===1&&value===127||base===8&&!Number.isFinite(value);
  out.push(invalid?null:value);
 }
 return out.length===1?out[0]:out;
}
/** Numeric FIT exercise categories, intentionally broad when subtype is not decoded.
 * The maps are *coaching heuristics*, not Garmin's proprietary muscle map. */
export const EXERCISE_CATEGORY=Object.freeze({
 0:['Bankdrücken','chest',['triceps','shoulders']],1:['Wadenheben','calves',[]],
 2:['Cardio',null,[]],3:['Tragen','core',['forearms']],4:['Rotations-/Chop-Übung','core',['shoulders']],
 5:['Core-Training','core',[]],6:['Crunch','core',[]],7:['Curl','biceps',['forearms']],
 8:['Kreuzheben','posterior',['back','glutes']],9:['Fly','chest',['shoulders']],
 10:['Hüftheben','glutes',['posterior']],11:['Hüftstabilität','glutes',['core']],
 12:['Hüftschwung','glutes',['posterior']],13:['Rückenstrecken','back',['glutes']],
 14:['Seitheben','shoulders',[]],15:['Beinbeuger','posterior',[]],16:['Beinheben','core',[]],
 17:['Ausfallschritt','quads',['glutes','posterior']],18:['Olympisches Heben',null,[]],
 19:['Plank','core',['shoulders']],20:['Plyometrie',null,[]],21:['Klimmzug','back',['biceps']],
 22:['Liegestütz','chest',['triceps','shoulders']],23:['Rudern','back',['biceps']],
 24:['Schulterdrücken','shoulders',['triceps']],25:['Schulterstabilität','shoulders',[]],
 26:['Schulterheben','shoulders',['back']],27:['Sit-up','core',[]],
 28:['Kniebeuge','quads',['glutes','posterior']],29:['Ganzkörpertraining',null,[]],
 30:['Trizepsstrecken','triceps',[]],31:['Aufwärmen',null,[]]
});
export const MUSCLE_GROUPS=Object.freeze([
 {id:'chest',label:'Brust',view:'front'}, {id:'shoulders',label:'Schultern',view:'both'},
 {id:'biceps',label:'Bizeps',view:'front'}, {id:'triceps',label:'Trizeps',view:'back'},
 {id:'forearms',label:'Unterarme',view:'both'}, {id:'core',label:'Rumpf',view:'front'},
 {id:'back',label:'Rücken',view:'back'}, {id:'glutes',label:'Gesäß',view:'back'},
 {id:'quads',label:'Oberschenkel vorn',view:'front'}, {id:'posterior',label:'Oberschenkel hinten',view:'back'},
 {id:'calves',label:'Waden',view:'both'}
]);
const normalizedCategory=c=>int(first(c),0,65534);
/** Primary = category heuristic, secondary = assisting muscles; exact muscle activation cannot be determined. */
export function strengthMuscles(category){const entry=EXERCISE_CATEGORY[category];return entry?{name:entry[0],primary:entry[1],secondary:[...entry[2]],known:!!entry[1]}:{name:category===null?'Übung nicht benannt':`Übungskategorie ${category}`,primary:null,secondary:[],known:false};}
/** Validate and retain only bounded quantities; unknown or unnamed strength is still a real set. */
export function strengthSetsFromRecords(records=[]){
 const names=new Map(),workout=new Map();
 for(const record of records){const v=record.fields||{};
  if(record.type===264){const cat=normalizedCategory(v[0]),name=int(first(v[1]),0,65534),title=validStr(first(v[2]));if(cat!==null&&name!==null&&title)names.set(`${cat}|${name}`,title);}
  if(record.type===27){const cat=normalizedCategory(v[10]),name=int(first(v[11]),0,65534),title=validStr(v[0]);if(cat!==null&&name!==null&&title)workout.set(`${cat}|${name}`,title);}
 }
 const items=[];let n=0;
 for(const record of records){if(record.type!==225)continue;const v=record.fields||{},type=int(first(v[5]),0,1);
  // Only active sets, never count Garmin rest messages as exercise sets.
  if(type!==1)continue;
  const start=fitTime(first(v[6])),end=fitTime(first(v[254]));
  if(!start&&!end)continue;
  const category=normalizedCategory(v[7]),subtype=int(first(v[8]),0,65534),desc=strengthMuscles(category);
  const key=`${category}|${subtype}`,title=names.get(key)||workout.get(key)||desc.name;
  const reps=int(first(v[3]),0,500),rawWeight=first(v[4]),weightKg=finite(rawWeight)&&rawWeight>=0&&rawWeight<=32000?Math.round(rawWeight/16*100)/100:null;
  const rawDuration=first(v[0]),durationSeconds=finite(rawDuration)&&rawDuration>=0&&rawDuration<=14400000?Math.round(rawDuration/1000*10)/10:null;
  // When two sets genuinely share a timestamp, keep both with a stable index.
  items.push({index:n++,start:start||end,end:end||start,category,subtype,exercise: title,identified:!!names.get(key)||!!workout.get(key),
   reps,weightKg,durationSeconds,primary:desc.primary,secondary:desc.secondary,knownMuscles:desc.known,source:'garmin-fit-set'});
 }
 return items;
}
/** File-local strength sessions. Keep identity tied to the workout's start, not its current end. */
export function garminStrengthSessionsFromRecords(records=[]){
 const sets=strengthSetsFromRecords(records);if(!sets.length)return [];
 const sessions=records.filter(r=>r.type===18).map(r=>{
  const v=r.fields||{},start=fitTime(v[2]),end=fitTime(v[253]);return {start,end,sport:v[5],subSport:v[6]};
 }).filter(s=>s.start);
 const inferredStart=sets.map(s=>s.start).sort()[0],inferredEnd=sets.map(s=>s.end).sort().at(-1);
 const s=sessions.find(s=>s.start<=inferredStart&&(!s.end||s.end>=inferredStart))||sessions[0];
 const start=s?.start||inferredStart,end=s?.end&&s.end>=inferredEnd?s.end:inferredEnd;
 const byTime=sets.filter(x=>x.start>=start&&(!end||x.start<=end));
 if(!byTime.length)return [];
 const finish=byTime.map(x=>x.end).sort().at(-1)||end;
 return [{id:`strength|${start}`,day:start.slice(0,10),start,end:end||finish,sport:s?.sport??null,subSport:s?.subSport??null,
  sets:byTime,activeSets:byTime.length,identifiedSets:byTime.filter(x=>x.knownMuscles).length,
  lastSetAt:finish,source:'garmin-fit-strength',complete:false}];
}
/** A later same-session import may grow and/or correct data; it must not be duplicated. */
export function chooseBetterStrengthSession(oldSession,newSession){
 if(!oldSession)return newSession;if(!newSession)return oldSession;
 const a=oldSession.sets||[],b=newSession.sets||[];
 if(b.length<a.length)return oldSession;if(b.length>a.length)return newSession;
 const completeness=s=>(s.sets||[]).reduce((v,x)=>v+(x.reps!==null?1:0)+(x.weightKg!==null?1:0)+(x.knownMuscles?1:0)+(x.identified?1:0),0);
 const qA=completeness(oldSession),qB=completeness(newSession);
 if(qB<qA)return oldSession;
 // Equal count/quality: latest import wins so corrected repetitions/weights overwrite stale snapshots.
 return newSession;
}
export function mergeStrengthImports(existing=[],incoming=[]){
 const all=new Map();for(const row of existing)if(row?.id)all.set(row.id,row);
 for(const row of incoming)if(row?.id)all.set(row.id,chooseBetterStrengthSession(all.get(row.id),row));
 return [...all.values()].sort((a,b)=>a.start.localeCompare(b.start));
}
