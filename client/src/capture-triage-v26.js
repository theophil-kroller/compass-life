/** Compass 0.5.26 · local-first, review-before-save capture proposals.
 * Meeting transcripts and Notion content are never fetched. No automatic due dates.
 */
const TYPES = new Map([['aufgabe','Aktion'],['aktion','Aktion'],['todo','Aktion'],['to-do','Aktion'],['task','Aktion'],['action','Aktion'],['waiting','Waiting For'],['warten','Waiting For'],['warte','Waiting For'],['agenda','Gesprächspunkt'],['gespräch','Gesprächspunkt'],['beschluss','Beschluss'],['decision','Beschluss'],['idee','Idee'],['idea','Idee']]);
export const CAPTURE_KINDS=['Aktion','Waiting For','Gesprächspunkt','Beschluss','Idee','Ungeklärt'];
export const normalizeCaptureTitle=s=>String(s||'').trim().toLocaleLowerCase('de').normalize('NFKC').replace(/\s+/g,' ');
const withoutBullet=s=>s.replace(/^\s*(?:[-*•]|\d{1,2}[.)]|\[\s*[xX ]?\s*\])\s*/, '').trim();
function splitKind(line){const m=line.match(/^(?:\[([^\]]+)\]|([^:]{2,22}):)\s*(.+)$/);if(!m)return {kind:'Ungeklärt',text:line};const kind=TYPES.get(String(m[1]||m[2]).trim().toLocaleLowerCase('de'));return kind?{kind,text:m[3]}:{kind:'Ungeklärt',text:line};}
function checkLimits(text){if(typeof text!=='string'||text.length>40000)throw new Error('Bitte höchstens 40.000 Zeichen für die Vorschau verwenden.');}
const validTag=tag=>/^[\p{L}\p{N}][\p{L}\p{N} _-]{0,31}$/u.test(tag);
const cleanTags=tags=>Array.isArray(tags)?[...new Set(tags.filter(x=>typeof x==='string').map(x=>x.trim().replace(/^#/,'').toLocaleLowerCase('de')).filter(validTag))].slice(0,8):[];
const normalizedList=rows=>rows.map((row,i)=>({id:`capture-${i}`,title:String(row.title||'').trim(),kind:CAPTURE_KINDS.includes(row.kind)?row.kind:'Ungeklärt',note:String(row.note||'').trim().slice(0,2000),tags:cleanTags(row.tags)}));
export function parseCaptureLines(raw,{limit=40}={}){
 checkLimits(raw);const rows=[];
 for(const line of raw.split(/\r?\n/)){
  const trimmed=withoutBullet(line);
  if(!trimmed||trimmed.startsWith('#')||/^[-_=]{3,}$/.test(trimmed))continue;
  const {kind,text}=splitKind(trimmed);
  // Keep just explicit follow-ups; headings and prose without a label must be bullet items.
  if(kind==='Ungeklärt'&&line===trimmed&&!(line.match(/^\s*[-*•\d[]/)))continue;
  const title=text.replace(/\s+/g,' ').trim();
  if(title.length<3||title.length>180)continue;
  rows.push({title,kind,note:'',tags:[]});
  if(rows.length>=limit)break;
 }
 return normalizedList(rows);
}
export function parseAiCaptureJson(raw,{limit=40}={}){
 checkLimits(raw);let value;
 try{value=JSON.parse(raw);}catch{throw new Error('Kein gültiges JSON. Bitte den lokalen KI-Entwurf als JSON einfügen.');}
 if(!value||typeof value!=='object'||!Array.isArray(value.items))throw new Error('JSON benötigt das Feld "items" als Liste.');
 if(value.items.length>limit)throw new Error(`Maximal ${limit} Vorschläge auf einmal.`);
 const items=value.items.map(item=>{
  if(!item||typeof item!=='object')throw new Error('Ungültiger Vorschlag.');
  const title=String(item.title||'').trim(),note=String(item.note||'').trim();
  if(title.length<3||title.length>180||note.length>2000)throw new Error('Titel oder Notiz eines Vorschlags ist zu lang beziehungsweise leer.');
  return {title,note,kind:CAPTURE_KINDS.includes(item.kind)?item.kind:'Ungeklärt',tags:Array.isArray(item.tags)?item.tags.slice(0,8):[]};
 });
 return normalizedList(items);
}
export function capturePreview(rows,existing=[]){
 const known=new Set(existing.filter(x=>!x.deleted).map(x=>normalizeCaptureTitle(x.title)));
 const seen=new Set();
 return rows.map(x=>{
  const key=normalizeCaptureTitle(x.title);const duplicate=known.has(key)||seen.has(key);
  seen.add(key);
  return {...x,duplicate};
 });
}
export function captureInboxRecord(item,{id,updatedAt}={}){
 if(!item||!id||!updatedAt||String(item.title||'').length<3)throw new Error('Vorschlag unvollständig.');
 const intro=item.kind&&item.kind!=='Ungeklärt'?`Klärungsvorschlag: ${item.kind}. Bitte im Review bestätigen.`:'';
 const text=[intro,String(item.note||'')].filter(Boolean).join('\n');
 return {id,title:item.title.slice(0,180),note:text.slice(0,3000),tags:cleanTags(item.tags),deleted:false,updatedAt};
}
