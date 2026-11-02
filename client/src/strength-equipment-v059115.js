/** Compass 0.5.91.15 · Real, symmetric equipment-aware home dumbbell loading.
 * kg in legacy home guided records are PLATE mass, not necessarily total dumbbell mass.
 * Unknown handle mass stays unknown; no synthetic zero-kg handle is silently assumed.
 * No mutation of confirmed workouts or StrongLifts prescriptions.
 */
export const EQUIPMENT_STORAGE_115='compass:strength:equipment-v59115';
export const DEFAULT_EQUIPMENT_115=Object.freeze({version:1,activeSetId:'home-original',sets:[{id:'home-original',type:'adjustable-dumbbells',label:'Meine ersten Kurzhanteln',handles:2,symmetric:true,handleWeightKg:null,maxPlatesPerSide:null,maxKgPerHandle:null,plates:[{kg:1,count:4},{kg:1.5,count:4},{kg:2,count:4},{kg:2.5,count:4}]}],additionalSets:[]});
const round=n=>Math.round(n*100)/100;
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const cleanPlate=p=>({kg:Number(p?.kg),count:Number(p?.count)});
export function normalizeEquipment115(raw){
 const base=structuredClone(DEFAULT_EQUIPMENT_115);
 const supplied=raw?.sets?.find(s=>s?.id==='home-original')||raw?.sets?.[0];
 if(!supplied)return base;
 const set=base.sets[0];
 set.plates=set.plates.map(defaultPlate=>{
  const incoming=(Array.isArray(supplied.plates)?supplied.plates:[]).map(cleanPlate).find(x=>x.kg===defaultPlate.kg);
  return {kg:defaultPlate.kg,count:Number.isInteger(incoming?.count)&&incoming.count>=0&&incoming.count<=60?incoming.count:defaultPlate.count};
 });
 set.handleWeightKg=supplied.handleWeightKg===null||supplied.handleWeightKg===''||supplied.handleWeightKg===undefined?null:(finite(Number(supplied.handleWeightKg))&&Number(supplied.handleWeightKg)>=0&&Number(supplied.handleWeightKg)<=15?Number(supplied.handleWeightKg):null);
 set.maxPlatesPerSide=Number.isInteger(Number(supplied.maxPlatesPerSide))&&Number(supplied.maxPlatesPerSide)>=1&&Number(supplied.maxPlatesPerSide)<=12?Number(supplied.maxPlatesPerSide):null;
 set.maxKgPerHandle=finite(Number(supplied.maxKgPerHandle))&&Number(supplied.maxKgPerHandle)>0?Number(supplied.maxKgPerHandle):null;
 // Preserve future sets as INACTIVE metadata; never silently pool inventories.
 base.additionalSets=Array.isArray(raw?.additionalSets)?raw.additionalSets.slice(0,4).filter(x=>x&&typeof x.id==='string').map(x=>({id:x.id.slice(0,64),label:String(x.label||'Zusatzset').slice(0,80),type:String(x.type||'adjustable-dumbbells').slice(0,60),status:'not-available',plates:Array.isArray(x.plates)?x.plates.slice(0,12).filter(p=>Number(p?.kg)>0&&Number.isInteger(Number(p?.count))&&Number(p.count)>=0).map(p=>({kg:Number(p.kg),count:Number(p.count)})):[]})):[];
 return base;
}
export function readEquipment115(){try{return normalizeEquipment115(JSON.parse(globalThis.localStorage?.getItem(EQUIPMENT_STORAGE_115)||'null'));}catch{return normalizeEquipment115(null);}}
export function saveEquipment115(value){const clean=normalizeEquipment115(value);globalThis.localStorage?.setItem(EQUIPMENT_STORAGE_115,JSON.stringify(clean));return clean;}
const SINGLE=new Set(['dumbbell-row','goblet-squat','dumbbell-pullover','one-arm-dumbbell-snatch']);
const DOUBLE=new Set(['dumbbell-lateral-raise','dumbbell-floor-press','dumbbell-shoulder-press','dumbbell-romanian-deadlift','dumbbell-walking-lunge','dumbbell-front-squat','dumbbell-bench-press','farmers-walk']);
export function dumbbellCount115(id){return SINGLE.has(id)?1:DOUBLE.has(id)?2:null;}
function set115(profile){return normalizeEquipment115(profile).sets[0];}
/** Available layouts for ONE or TWO IDENTICALLY LOADED dumbbells, each symmetric.
 * Availability = count of a plate size / (2 sides × dumbbell count). No virtual plates.
 */
export function availableLoads115(profile,{dumbbells=2}={}){
 const set=set115(profile);if(!Number.isInteger(dumbbells)||dumbbells<1||dumbbells>set.handles)return [];
 const types=set.plates.map(p=>({kg:p.kg,max:Math.min(12,Math.floor(p.count/(2*dumbbells)))})).filter(p=>p.max>=0);
 const candidates=[];
 function walk(i,perSide){
  if(i===types.length){
   const plateCount=perSide.reduce((s,p)=>s+p.count,0);
   if(set.maxPlatesPerSide!==null&&plateCount>set.maxPlatesPerSide)return;
   const plateKg=round(perSide.reduce((s,p)=>s+p.kg*p.count,0)*2);
   const totalKg=set.handleWeightKg===null?null:round(plateKg+set.handleWeightKg);
   if(set.maxKgPerHandle!==null&&(totalKg===null?plateKg:totalKg)>set.maxKgPerHandle)return;
   candidates.push({plateKg,totalKg,dumbbells,perSide:perSide.filter(x=>x.count>0).sort((a,b)=>b.kg-a.kg),plateCount,handleKg:set.handleWeightKg,inventorySetId:set.id});return;
  }
  for(let count=0;count<=types[i].max;count++)walk(i+1,[...perSide,{kg:types[i].kg,count}]);
 }
 walk(0,[]);
 const unique=new Map();
 for(const choice of candidates){
  const existing=unique.get(choice.plateKg);
  if(!existing||choice.plateCount<existing.plateCount||choice.plateCount===existing.plateCount&&(choice.perSide[0]?.kg||0)>(existing.perSide[0]?.kg||0))unique.set(choice.plateKg,choice);
 }
 return [...unique.values()].sort((a,b)=>a.plateKg-b.plateKg);
}
export function exactLoad115(profile,plateKg,dumbbells=2){return availableLoads115(profile,{dumbbells}).find(x=>Math.abs(x.plateKg-Number(plateKg))<.001)||null;}
export function nextLoad115(profile,plateKg,dumbbells=2){return availableLoads115(profile,{dumbbells}).find(x=>x.plateKg>Number(plateKg)+.001)||null;}
const fmt=n=>Number(n).toLocaleString('de-AT',{maximumFractionDigits:2});
export function plateText115(load){if(!load)return 'Keine baubare Scheibenkombination';return `Je Seite: ${load.perSide.map(p=>`${p.count>1?p.count+' × ':''}${fmt(p.kg)} kg`).join(' + ')||'keine Scheibe'} · ${fmt(load.plateKg)} kg Scheiben pro Hantel${load.totalKg===null?' · Griffgewicht offen':' · '+fmt(load.totalKg)+' kg inkl. Griff'}`;}
export function plateSvg115(load){
 if(!load)return '';
 const colors={1:'#719bb0',1.5:'#7c9b86',2:'#b49a72',2.5:'#536d8c'};
 const expanded=load.perSide.flatMap(p=>Array.from({length:p.count},()=>p.kg));
 // Outside to inside on the left = reverse of inside to outside on the right.
 const height=expanded.length?100:78;const widths=16;const leftX=158-expanded.length*widths;const rightX=244;
 const plate=(kg,x,i)=>`<rect x="${x}" y="${(height-(34+kg*10))/2}" width="${widths-2}" height="${34+kg*10}" rx="3" fill="${colors[kg]||'#6d8792'}" stroke="#263f4c" stroke-width="1"/><text x="${x+7}" y="53" font-size="8.3" font-weight="700" text-anchor="middle" fill="white" transform="rotate(-90 ${x+7} 53)">${fmt(kg)}</text>`;
 return `<svg class="str115-plates-svg" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${plateText115(load).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><rect x="146" y="44" width="108" height="12" rx="6" fill="#78898c"/><rect x="163" y="38" width="74" height="24" rx="7" fill="#c8d1cb" stroke="#637f79" stroke-width="2"/>${[...expanded].reverse().map((kg,i)=>plate(kg,leftX+i*widths,i)).join('')}${expanded.map((kg,i)=>plate(kg,rightX+i*widths,i)).join('')}<path d="M${Math.max(4,leftX-6)} 38v24 M${Math.min(396,rightX+expanded.length*widths+4)} 38v24" stroke="#7c8d89" stroke-width="5"/><text x="200" y="16" fill="#335c50" font-size="11" font-weight="700" text-anchor="middle">${fmt(load.plateKg)} kg Scheiben / Hantel</text></svg>`;
}
const SMALL=new Set(['dumbbell-lateral-raise']);
const MID=new Set(['dumbbell-shoulder-press','dumbbell-floor-press','dumbbell-bench-press','dumbbell-walking-lunge','dumbbell-front-squat']);
/** Gate a *candidate* against real jumps and already-established RIR/recovery decisions.
 * The 12/18% jump limits are coaching heuristics, not physiological constants.
 */
export function equipmentDecision115({profile,exerciseId,lastKg,rirModel,previous,healthAttention=false,deload=false,plateWeightKnown=true}={}){
 const n=dumbbellCount115(exerciseId);if(!n)return null;
 const previousLoad=finite(lastKg)&&lastKg>=0?exactLoad115(profile,lastKg,n):null;
 const basis=previousLoad||null;
 const next=basis?nextLoad115(profile,basis.plateKg,n):null;
 const alternatives=basis?availableLoads115(profile,{dumbbells:n}).filter(x=>x.plateKg>basis.plateKg).slice(0,3):[];
 if(!plateWeightKnown)return {action:'verify-weight',suggestedKg:null,load:null,next:null,alternatives:availableLoads115(profile,{dumbbells:n}).filter(x=>x.plateKg>0).slice(0,4),message:'Das zuletzt importierte Gewicht ist nicht sicher als Scheibengewicht interpretierbar. Bitte Griffgewicht/Gewichtsdefinition prüfen; keine automatische Laststeigerung.'};
 if(!basis)return {action:'choose-load',suggestedKg:null,load:null,next:null,alternatives:availableLoads115(profile,{dumbbells:n}).filter(x=>x.plateKg>0).slice(0,4),message:'Keine bestätigte, mit dem aktuellen Scheibenbestand baubare Vorlast. Gewicht manuell wählen; nichts wird automatisch überschrieben.'};
 if(!next)return {action:'at-equipment-limit',suggestedKg:null,load:basis,next:null,alternatives:[],message:'Mit dem aktuellen Bestand ist keine höhere symmetrische Beladung für diese Übung verfügbar. Wiederholungen, Technik oder späteres Zusatzset prüfen.'};
 const jumpPct=round((next.plateKg-basis.plateKg)/Math.max(.001,basis.plateKg)*100);
 const limit=SMALL.has(exerciseId)?12:MID.has(exerciseId)?15:18;
 const prior=rirModel?.action||previous?.action||'unknown';
 const ready=rirModel?.action==='increase-load'&&!healthAttention&&!deload;
 const jumpOK=jumpPct<=limit;
 const reason=`Nächster realer Scheibenschritt: ${fmt(basis.plateKg)} → ${fmt(next.plateKg)} kg (${fmt(jumpPct)} %, ${n===2?'zwei Hanteln':'eine Hantel'}).`;
 if(!ready)return {action:healthAttention||deload?'hold-recovery':'hold-reps',suggestedKg:null,load:basis,next,alternatives,jumpPct,message:`${reason} ${healthAttention||deload?'Regeneration/Entlastung: keine Steigerung.':rirModel?.message||'Zuerst Zielwiederholungen und ausreichend bestätigte RIR-Daten sammeln; keine automatische Steigerung.'}`};
 if(!jumpOK)return {action:'hold-jump',suggestedKg:null,load:basis,next,alternatives,jumpPct,message:`${reason} Für diese Übung vorerst ein großer Sprung (Orientierungsgrenze ${limit} %). Bei gleicher Last kontrolliert mehr Wiederholungen erreichen oder kleinere Scheiben ergänzen.`};
 return {action:'increase-load',suggestedKg:next.plateKg,load:next,next,alternatives,jumpPct,message:`${reason} Bestätigte Sätze am oberen Wiederholungsziel und ausreichende RIR/Erholung sprechen für einen optionalen Versuch. ${plateText115(next)}. Kein automatischer Eintrag.`};
}
export function equipmentMarkup115(decision,{compact=false}={}){
 if(!decision)return '';
 const load=decision.load;const text=plateText115(load);
 const alternatives=decision.alternatives||[];
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<div class="str115-load" aria-label="Machbare Kurzhantelbeladung"><div class="str115-load-top"><strong>${decision.action==='increase-load'?'Gewichtsvorschlag':decision.action==='hold-jump'?'Gewicht halten':'Scheibenbeladung'}</strong>${load?`<span>${escape(fmt(load.plateKg))} kg Scheiben/Hantel</span>`:''}</div>${load?plateSvg115(load):''}<small>${escape(text)}</small>${compact?`<details><summary>Beladung & Begründung</summary><p>${escape(decision.message)}</p>${alternatives.map(x=>`<p>${escape(plateText115(x))}</p>`).join('')}</details>`:`<p>${escape(decision.message)}</p><details><summary>Nächste mögliche Stufen</summary>${alternatives.map(x=>`<p>${escape(plateText115(x))}</p>`).join('')||'<p>Keine weitere Stufe verfügbar.</p>'}</details>`}</div>`;
}
