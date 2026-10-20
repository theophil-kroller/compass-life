/** Compass 0.5.64 – personal, local-first relationship radar.
 * Contact points reflect interaction channel, NEVER human worth or relationship quality.
 * All preferences and histories live in the encrypted local people vault.
 */
import {contactSummary} from './people-relationships-v24.js';
export const RELATION_KINDS=Object.freeze([['family','Familie'],['partner','Partner:in'],['friend','Freund:in'],['colleague','Arbeitskolleg:in'],['acquaintance','Bekanntschaft'],['other','Andere Beziehung']]);
export const GENDER_MARKERS=Object.freeze([['','Ohne Angabe'],['female','Weiblich'],['male','Männlich'],['diverse','Divers / selbstbezeichnet']]);
export const CADENCE_DAYS=Object.freeze([7,14,30,45,60,90,180,365,0]);
export const CONTACT_WEIGHTS=Object.freeze({meeting:5,video:4,call:3,message:2,email:1,other:1});
export function contactWeight(type){return CONTACT_WEIGHTS[type]||1;}
export function preference(person){
 const p=person||{};
 const closeness=Number.isFinite(Number(p.closeness))&&p.closeness!==''&&p.closeness!=null?Math.max(0,Math.min(100,Math.round(Number(p.closeness)))):50;
 const cadence=CADENCE_DAYS.includes(Number(p.contactCadenceDays))?Number(p.contactCadenceDays):Number(p.contactReviewDays||0);
 return {closeness,cadence:CADENCE_DAYS.includes(cadence)?cadence:0,paused:p.contactPaused===true,kind:RELATION_KINDS.some(([k])=>k===p.relationKind)?p.relationKind:'other',gender:GENDER_MARKERS.some(([k])=>k===p.genderMarker)?p.genderMarker:''};
}
const dateAt=day=>/^\d{4}-\d{2}-\d{2}$/.test(String(day||''))?Date.parse(`${day}T12:00:00Z`):NaN;
const dayDiff=(today,day)=>Math.max(0,Math.round((dateAt(today)-dateAt(day))/86400000));
export function contactImpulse(person,today=new Date().toISOString().slice(0,10)){
 const pref=preference(person),sum=contactSummary(person,today);
 if(pref.paused||pref.cadence<=0)return {...sum,score:0,due:false,paused:pref.paused,reason:pref.paused?'Kontaktimpulse pausiert':'Kein fester Rhythmus',weight:sum.last?contactWeight(sum.last.type):0};
 if(!sum.last)return {...sum,score:0,due:false,paused:false,reason:'Noch kein bestätigter Kontakt',weight:0};
 // Restart after a pause must not create retrospective pressure or pretend a meeting took place.
 const baseline=person?.contactResumedAt && dateAt(person.contactResumedAt)>dateAt(sum.last.day)?person.contactResumedAt:sum.last.day;
 const days=dayDiff(today,baseline),weight=contactWeight(sum.last.type);
 // A face-to-face meeting gives a modest grace period; an email gives less.
 const threshold=Math.max(1,Math.round(pref.cadence*(.78+weight*.055)));
 const ratio=days/threshold;
 const closenessFactor=.9+pref.closeness/500; // small modulation, cadence remains the governing preference
 const score=Math.max(0,Math.min(100,Math.round(Math.max(0,ratio-.45)*75*closenessFactor)));
 return {...sum,score,due:days>=threshold,paused:false,daysSinceBaseline:days,threshold,weight,reason:days>=threshold?'Kontaktimpuls möglich':'Im gewünschten Rhythmus'};
}
export function impulseQueue(people,today=new Date().toISOString().slice(0,10)){
 return Object.values(people||{}).map(person=>({person,...contactImpulse(person,today)})).filter(x=>x.due).sort((a,b)=>b.score-a.score||a.person.name.localeCompare(b.person.name,'de'));
}
export function pauseContact(person,paused,today=new Date().toISOString().slice(0,10)){
 return {...person,contactPaused:!!paused,...(!paused?{contactResumedAt:today}:{})};
}
export function mapAngle(person){
 if(Number.isFinite(Number(person?.mapAngleDeg))&&person?.mapAngleDeg!==null&&person?.mapAngleDeg!==undefined)return Number(person.mapAngleDeg)*Math.PI/180;
 let h=2166136261;for(const c of String(person?.id||person?.name||'')){h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;}
 return (h%360)*Math.PI/180;
}
export function mapPosition(person,center=235,maxRadius=185){
 const p=preference(person),r=23+(100-p.closeness)/100*(maxRadius-23),a=mapAngle(person);
 return {x:center+Math.sin(a)*r,y:center-Math.cos(a)*r,r,angle:a};
}
export function mapDrop(person,x,y,center=235,maxRadius=185){
 const dx=x-center,dy=y-center,r=Math.min(maxRadius,Math.hypot(dx,dy));
 const closeness=Math.max(0,Math.min(100,Math.round(100*(1-(Math.max(23,r)-23)/(maxRadius-23)))));
 const angle=((Math.atan2(dx,-dy)*180/Math.PI)%360+360)%360;
 return {...person,closeness,mapAngleDeg:Math.round(angle)};
}
export function safePersonDetails(form){
 const v=k=>String(form?.[k]??'').trim();
 const fields={partnerName:v('partnerName'),childrenInfo:v('childrenInfo'),sharedHobbies:v('sharedHobbies'),importantEvents:v('importantEvents'),catchUpNotes:v('catchUpNotes')};
 if(Object.entries(fields).some(([k,value])=>value.length>(k==='catchUpNotes'||k==='importantEvents'?1200:400)))throw Error('Kontaktangaben sind zu lang.');
 return fields;
}
export function relatedProjectIds(person,projects){return (Array.isArray(person?.relatedProjectIds)?person.relatedProjectIds:[]).filter(id=>!!projects?.[id]);}
