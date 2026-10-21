/** Compass 0.5.65 – private, non-evaluative feeling check-ins.
 * Independent of cloud records, task completion, relationship scores, and the Life Balance Radar.
 */
import {validFeelingDetail,normalizeFeelingObservation,setFeelingDetail,toggleFeelingObservation,feelingFamilies,feelingMeaning,intensityPresence} from './feeling-depth-v5681.js';
import {renderFeelingOverlay,renderFeelingDashboard} from './feeling-interface-v5681.js';
import {validatedNetworkTerms} from './feeling-network-v5705.js';
export {setFeelingDetail,toggleFeelingObservation,feelingFamilies,feelingMeaning,intensityPresence};
export const FEELINGS=Object.freeze([
 {id:'joy',emoji:'☀️',label:'Freude',color:'#f3bc67',description:'Angenehme Lebendigkeit, Genuss oder Zufriedenheit mit etwas.',words:['Erfreut','Fröhlich','Glücklich','Begeistert','Euphorisch']},
 {id:'calm',emoji:'🌿',label:'Ruhe',color:'#79b6a6',description:'Innere Gelassenheit, weniger Anspannung oder ein Gefühl von Frieden.',words:['Etwas entspannt','Ruhig','Gelassen','Tiefenentspannt','Friedlich']},
 {id:'sadness',emoji:'🌧️',label:'Trauer',color:'#7ea9d5',description:'Ein Empfinden von Verlust, Abschied, Schwere oder Sehnsucht.',words:['Wehmütig','Bedrückt','Traurig','Tieftraurig','Überwältigt von Trauer']},
 {id:'fear',emoji:'🌫️',label:'Angst',color:'#a899d3',description:'Unsicherheit, Besorgnis oder die Wahrnehmung einer möglichen Bedrohung.',words:['Unruhig','Besorgt','Ängstlich','Verängstigt','Panisch']},
 {id:'anger',emoji:'🔥',label:'Wut',color:'#d77e73',description:'Ein Hinweis auf verletzte Grenzen, Frustration oder erlebte Ungerechtigkeit.',words:['Gereizt','Verärgert','Wütend','Zornig','Rasend']},
 {id:'affection',emoji:'❤️',label:'Zuneigung',color:'#d99bae',description:'Wärme, Zugewandtheit oder Verbundenheit mit jemandem.',words:['Sympathie','Zugewandt','Verbunden','Liebevoll','Innig']}
]);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=id=>FEELINGS.find(e=>e.id===id);
export function feelingWord(id,intensity){const emotion=byId(id);if(!emotion)return null;const n=Number(intensity);if(!Number.isInteger(n)||n<1||n>10)return null;return emotion.words[Math.min(4,Math.floor((n-1)/2))];}
export function newFeelingDraft(){return {selected:{},details:{},observations:{},note:'',hypothesis:'',ownWords:'',networkTerms:[],autoRoots:[]};}
export function chooseFeeling(draft,id){if(!byId(id))throw Error('Unbekanntes Gefühl.');const selected={...(draft?.selected||{})};const details={...(draft?.details||{})};if(Object.hasOwn(selected,id)){delete selected[id];delete details[id];}else selected[id]=5;return {...draft,selected,details,autoRoots:(draft?.autoRoots||[]).filter(root=>root!==id)};}
export function intensityFor(draft,id,value){if(!byId(id)||!Object.hasOwn(draft?.selected||{},id))throw Error('Gefühl zuerst wählen.');const n=Number(value);if(!Number.isInteger(n)||n<1||n>10)throw Error('Intensität von 1 bis 10 wählen.');return {...draft,selected:{...draft.selected,[id]:n}};}
export function validatedCheckin(draft,{id,at,day=at?.slice(0,10)}={}){
 const picked=Object.entries(draft?.selected||{});
 const ownWords=String(draft?.ownWords||'').trim();if(ownWords.length>500)throw Error('Eigene Worte dürfen maximal 500 Zeichen enthalten.');
 const networkTerms=validatedNetworkTerms(draft?.networkTerms||[]);
 if((picked.length===0&&!ownWords&&!networkTerms.length)||picked.length>FEELINGS.length)throw Error('Bitte mindestens ein Gefühl auswählen oder eigene Worte eingeben.');
 const items=picked.map(([key,value])=>{if(!byId(key)||!Number.isInteger(value)||value<1||value>10)throw Error('Gefühlsauswahl prüfen.');return {id:key,intensity:value,...validFeelingDetail(key,draft?.details?.[key])};});
 const note=String(draft?.note||'').trim();if(note.length>1000)throw Error('Notiz darf maximal 1.000 Zeichen enthalten.');
 const hypothesis=String(draft?.hypothesis||'').trim();if(hypothesis.length>2000)throw Error('Vermutung darf maximal 2.000 Zeichen enthalten.');
 const observations=normalizeFeelingObservation(draft?.observations||{});
 if(!id||!/^[0-9a-f-]{36}$/i.test(id)||!at||!Number.isFinite(Date.parse(at)))throw Error('Ungültiger Zeitpunkt.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||Number.isNaN(Date.parse(day+'T12:00:00Z')))throw Error('Ungültiger Kalendertag.');
 return {id,at,day,items,note,...(ownWords?{ownWords}:{}),...(networkTerms.length?{networkTerms}:{}),...(hypothesis?{hypothesis}:{}),...(Object.keys(observations).length?{observations}:{})};
}
export function appendCheckin(state,entry){if(!entry?.id||!Array.isArray(entry.items))throw Error('Ungültiger Eintrag.');state.feelingCheckins??=[];if(!Array.isArray(state.feelingCheckins))throw Error('Gefühlshistorie ist nicht lesbar.');if(state.feelingCheckins.some(x=>x.id===entry.id))throw Error('Check-in bereits erfasst.');if(state.feelingCheckins.length>=5000)throw Error('Maximale Anzahl Check-ins erreicht. Bitte zunächst verschlüsselte Sicherung erstellen.');state.feelingCheckins.push(entry);}
export function feelingRange(entries=[],today=new Date().toISOString().slice(0,10),days=7){const start=new Date(`${today}T12:00:00Z`);start.setUTCDate(start.getUTCDate()-Math.max(1,days)+1);const first=start.toISOString().slice(0,10);return (Array.isArray(entries)?entries:[]).filter(e=>e&&typeof e.at==='string'&&(e.day||e.at.slice(0,10))>=first&&(e.day||e.at.slice(0,10))<=today&&Array.isArray(e.items)).sort((a,b)=>b.at.localeCompare(a.at));}
export function feelingStats(entries=[],today=new Date().toISOString().slice(0,10),days=7){const rows=feelingRange(entries,today,days),counts=new Map();for(const e of rows)for(const item of e.items)if(byId(item.id)){const x=counts.get(item.id)||{count:0,total:0};x.count++;x.total+=Number(item.intensity)||0;counts.set(item.id,x);}return {entries:rows.length,activeDays:new Set(rows.map(e=>e.day||e.at.slice(0,10))).size,rows,groups:[...counts.entries()].map(([id,v])=>({...byId(id),count:v.count,mean:Math.round(v.total/v.count*10)/10})).sort((a,b)=>b.count-a.count)};}
const detailTime=at=>new Date(at).toLocaleString('de-AT',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
export function draftFromCheckin(entry){
 const details={};const selected={};for(const i of entry?.items||[]){if(!byId(i.id))continue;selected[i.id]=i.intensity;details[i.id]=validFeelingDetail(i.id,i);}
 return {selected,details,note:entry?.note||'',hypothesis:entry?.hypothesis||'',ownWords:entry?.ownWords||'',networkTerms:validatedNetworkTerms(entry?.networkTerms||[]),autoRoots:[],observations:structuredClone(entry?.observations||{})};
}
export function replaceCheckin(state,entry){
 const index=(state?.feelingCheckins||[]).findIndex(e=>e.id===entry.id);
 if(index<0)throw Error('Eintrag wurde nicht gefunden.');
 const old=state.feelingCheckins[index];if(entry.at!==old.at||entry.day!==old.day)throw Error('Zeitpunkt eines Check-ins bleibt erhalten.');
 state.feelingCheckins[index]={...entry,editedAt:new Date().toISOString()};
}
export function feelingOverlay(draft,entries=[],options={}){return renderFeelingOverlay(draft,entries,{FEELINGS,feelingWord,escape,detailTime,...options});}
export function feelingInsights(entries=[],today=new Date().toISOString().slice(0,10),days=30,options={}){
 return renderFeelingDashboard(entries,today,days,options,{FEELINGS,feelingWord,feelingRange,feelingStats,escape,detailTime});
}
export function feelingReview(entries=[],today=new Date().toISOString().slice(0,10)){const s=feelingStats(entries,today,7);return `<section class="fw65-review"><div><strong>🌈 Emotionaler Wochenrückblick</strong><button type="button" class="secondary-btn" data-action="feeling-open">Gefühl erfassen</button></div>${s.entries?`<p>${s.entries} freiwillige Check-ins an ${s.activeDays} Tagen in den letzten 7 Tagen.</p><div class="fw65-review-pills">${s.groups.map(e=>`<span title="${escape(e.description)}">${e.emoji} ${escape(e.label)} · ${e.count}×</span>`).join('')}</div>`:'<p>In dieser Woche noch keine Einträge. Du kannst diesen Schritt selbstverständlich ohne Check-in abschließen.</p>'}<button type="button" class="text-link" data-action="feeling-open-history">Verlauf ansehen →</button></section>`;}
