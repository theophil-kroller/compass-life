/** Compass 0.5.77.24 — local-only classic Outlook flagged mail handoff.
 * Pure import/validation/dedupe. Network and vault writes are owned by main.js.
 * Never include sender/body/attachments/EntryID in Compass imports.
 */
export const OUTLOOK_SCHEMA='compass-outlook-flags-v1';
const HEX=/^[0-9a-f]{64}$/;
const clean=s=>String(s??'').trim().replace(/[\x00-\x1f\x7f]/g,' ').replace(/\s+/g,' ');
export function parseOutlookFlags(input){
 const pack=typeof input==='string'?JSON.parse(input):input;
 if(!pack||pack.schema!==OUTLOOK_SCHEMA||!Array.isArray(pack.items)||pack.items.length>500)throw Error('Ungültiger Outlook-Export. Bitte die lokale Compass Outlook Bridge verwenden.');
 const ids=new Set();const items=[];
 for(const row of pack.items){
  if(!row||typeof row!=='object')throw Error('Ungültige Outlook-Zeile.');
  const id=String(row.id||'').toLowerCase(),title=clean(row.subject);
  if(!HEX.test(id)||!title||title.length>180)throw Error('Outlook-ID oder Betreff ungültig.');
  if(ids.has(id))continue;ids.add(id);
  const due=typeof row.flagDueDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(row.flagDueDate)?row.flagDueDate:null;
  items.push({id,title,flagDueDate:due,selected:true,kind:'next'});
 }
 return items;
}
export function outlookCandidates(input,imported={}){
 return parseOutlookFlags(input).map(x=>({...x,alreadyImported:!!imported[x.id],selected:!imported[x.id]}));
}
export function outlookTask(item,id,at=new Date().toISOString(),kind='next',title=item?.title??item?.subject){
 const cleanTitle=clean(title);
 if(!HEX.test(String(item?.id||''))||!id||cleanTitle.length>180||!cleanTitle||!['next','waiting'].includes(kind))throw Error('Outlook-Aufgabe ist ungültig.');
 return {id,title:cleanTitle,note:'Aus einer markierten Outlook-E-Mail übernommen. Originalnachricht bleibt in Outlook.',
  category:'Allgemein',workflow:kind,completed:false,archived:false,flagged:true,
  plannedDate:null,dueDate:null,deferUntil:null,estimateMinutes:null,projectId:null,parentTaskId:null,
  sortOrder:0,tags:['outlook'],contextTags:[],updatedAt:at};
}
export function outlookInboxRecord(item,id,at=new Date().toISOString(),title=item?.title??item?.subject){
 const cleanTitle=clean(title);
 if(!HEX.test(String(item?.id||''))||!id||cleanTitle.length>180||!cleanTitle)throw Error('Outlook-Inbox-Eintrag ist ungültig.');
 return {id,title:cleanTitle,note:'Aus einer markierten Outlook-E-Mail übernommen. Originalnachricht bleibt in Outlook.',tags:['outlook'],deleted:false,updatedAt:at};
}
export function chooseOutlookItems(items,formValues,imported={}){
 const selections=new Set(formValues.getAll('selected'));
 return items.filter(x=>selections.has(x.id)&&!imported[x.id]).map(x=>{
  const kind=clean(formValues.get('kind-'+x.id));
  if(!['inbox','next','waiting'].includes(kind))throw Error('Ungültiger GTD-Typ.');
  const title=clean(formValues.get('title-'+x.id));
  if(!title||title.length>180)throw Error('Outlook-Betreff ist leer oder zu lang.');
  return {...x,kind,title};
 });
}
export function outlookBridgeUrl(port=8765){
 const n=Number(port);if(!Number.isSafeInteger(n)||n<1024||n>65535)throw Error('Ungültiger Port.');
 return `http://127.0.0.1:${n}/v1/flags`;
}
