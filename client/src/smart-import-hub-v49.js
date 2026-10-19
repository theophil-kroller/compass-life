/** Compass 0.5.49 · Read-only, local-first import intake.
 * Classification never commits content; existing importers are the sole writers.
 * No persistent directory handles, background reads, silent cloud uploads, or model calls.
 */
import {detectFinanceFormat} from './finance-account-import.js';

export const SMART_IMPORT_SOURCES=Object.freeze([
 {id:'health',label:'Health Daten',hint:'C:\\Users\\kroll\\Documents\\Health Daten'},
 {id:'finance',label:'Konto Daten',hint:'C:\\Users\\kroll\\Documents\\Konto Daten'}
]);
export const SMART_IMPORT_KINDS=Object.freeze({
 bank:'Bankbuchungen',health:'Garmin / Fitdays',places:'Google Timeline',project:'Compass-Projektplan',kraken:'Kraken-Export',flatex:'flatex-Depotstand',unknown:'Manuell zuordnen'
});
const MAX_FILE_BYTES=125*1024*1024;
const MAX_HASH_BYTES=12*1024*1024;
const MAX_FILES=120;
const MAX_TOTAL_BYTES=500*1024*1024;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s||'').toLowerCase();
function jsonMarkers(s){
 const x=s.slice(0,24000);
 if(/"format"\s*:\s*"compass-project-exchange"/i.test(x))return 'project';
 if(/"(?:semanticSegments|timelineObjects)"\s*:/i.test(x)||/"placeVisit"\s*:/.test(x))return 'places';
 if(/"format"\s*:\s*"compass-kraken-readonly-v1"/i.test(x))return 'kraken';
 if(/"(?:ledgers|trades)"\s*:/i.test(x)&&/"(?:balances|asset|currency|pair|trade)"\s*:/i.test(x))return 'kraken';
 if(/"(?:sleepLevels|dailySleepDTO|sleepTimeSeconds|hrvSummary)"\s*:/i.test(x))return 'health';
 return 'unknown';
}
export function detectSmartImport({name='',head='',bytes=null}={}){
 const filename=normalize(name),ext=(filename.match(/\.([a-z0-9]+)$/)||[])[1]||'';
 const data=bytes instanceof Uint8Array?bytes:null;
 const zip=Boolean(data?.length>=4&&data[0]===80&&data[1]===75);
 const ole=Boolean(data?.length>=8&&[0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1].every((v,i)=>data[i]===v));
 const fit=Boolean(data?.length>=12&&String.fromCharCode(...data.slice(8,12))==='.FIT');
 if(fit||ole)return {kind:'health',reason:fit?'Garmin-FIT-Kennung':'Fitdays-XLS-Dateikennung',confidence:'high'};
 if(ext==='csv'||ext==='txt'){
  const first=head.replace(/^\uFEFF/,'').trim();
  if(/^stichtag;isin;bezeichnung;art;stueck;kurs_eur;marktwert_eur;einstand_eur/i.test(first))return {kind:'flatex',reason:'Compass-flatex-Depotspalten',confidence:'high'};
  if(/(?:activity type|aktivitätstyp).{0,150}(?:date|datum)/i.test(first.slice(0,400)))return {kind:'health',reason:'Garmin-Aktivitäten-Spalten',confidence:'high'};
  if(/\bdate\b.{0,150}\bweight\b/i.test(first.slice(0,400)))return {kind:'health',reason:'Fitdays-Spalten',confidence:'high'};
  const format=detectFinanceFormat(first,name);
  if(format!=='unknown')return {kind:'bank',reason:`Bank-/Transaktionsformat: ${format}`,confidence:'high'};
  return {kind:'unknown',reason:'CSV-Spalten keinem unterstützten Importer zugeordnet',confidence:'low'};
 }
 if(ext==='json'){
  const kind=jsonMarkers(head);return {kind,reason:kind==='unknown'?'JSON-Schema nicht eindeutig':`Struktur: ${SMART_IMPORT_KINDS[kind]}`,confidence:kind==='unknown'?'low':'high'};
 }
 if(ext==='xlsx'||ext==='xls')return /fitdays/i.test(filename)?{kind:'health',reason:'Fitdays-Tabellenexport nach Dateiname – Inhalt im Zielimporter prüfen',confidence:'medium'}:{kind:'unknown',reason:'Tabellenformat ohne unterstütztes Schema',confidence:'low'};
 if(zip){
  if(/(?:timeline|zeitachse|semantic|location.?history|standort)/i.test(filename))return {kind:'places',reason:'Timeline-ZIP nach Dateiname – Inhalt im Zielimporter prüfen',confidence:'medium'};
  if(/(?:garmin|fitdays|health|wellness|fitness|activity)/i.test(filename))return {kind:'health',reason:'Gesundheits-ZIP nach Dateiname – Inhalt im Zielimporter prüfen',confidence:'medium'};
  return {kind:'unknown',reason:'ZIP-Inhalt nicht eindeutig; manuell zuordnen',confidence:'low'};
 }
 if(ext==='fit')return {kind:'unknown',reason:'FIT-Dateiendung, aber keine gültige FIT-Kennung',confidence:'low'};
 return {kind:'unknown',reason:'Dateityp nicht unterstützt oder nicht sicher erkannt',confidence:'low'};
}
export function normalizeImportHistory(value){return (Array.isArray(value)?value:[]).filter(x=>x&&/^[a-f0-9]{64}$/.test(x.digest)&&SMART_IMPORT_KINDS[x.kind]&&x.kind!=='unknown').slice(-1000);}
export function committedSmartImport(history=[],entries=[],kind){
 if(!SMART_IMPORT_KINDS[kind]||kind==='unknown')return normalizeImportHistory(history);
 const out=new Map(normalizeImportHistory(history).map(x=>[x.digest,x]));
 for(const x of entries){if(!/^[a-f0-9]{64}$/.test(x?.digest||''))continue;
  out.set(x.digest,{digest:x.digest,kind,name:String(x.name||'').slice(0,180),at:new Date().toISOString()});}
 return [...out.values()].slice(-1000);
}
export async function inspectSmartFiles(files,history=[]){
 if(!Array.isArray(files)||files.length>MAX_FILES)throw Error(`Maximal ${MAX_FILES} Dateien pro Durchgang.`);
 if(files.some(f=>!f||!Number.isSafeInteger(f.size)||f.size<0||f.size>MAX_FILE_BYTES))throw Error('Eine Datei überschreitet 125 MB oder hat keine gültige Größe.');
 if(files.reduce((s,f)=>s+f.size,0)>MAX_TOTAL_BYTES)throw Error('Bitte höchstens 500 MB pro Durchgang wählen.');
 const seen=new Set(),known=new Set(normalizeImportHistory(history).map(x=>x.digest));const results=[];
 for(const file of files){
  const name=String(file.name||'Datei').slice(0,200);
  const headBytes=new Uint8Array(await file.slice(0,28000).arrayBuffer());
  const text=new TextDecoder('utf-8',{fatal:false}).decode(headBytes);
  const guess=detectSmartImport({name,head:text,bytes:headBytes});
  // Exact SHA-256 for reasonably sized files; large files remain unmarked rather than claiming reliable deduplication.
  const digest=file.size<=MAX_HASH_BYTES?Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))).map(v=>v.toString(16).padStart(2,'0')).join(''):null;
  const duplicate=Boolean(digest&&(seen.has(digest)||known.has(digest)));
  if(digest)seen.add(digest);
  results.push({name,size:file.size,kind:guess.kind,confidence:guess.confidence,reason:guess.reason,digest,duplicate,file});
 }
 return results;
}
export async function collectFolderFiles(directory,{maxFiles=MAX_FILES,maxDepth=2}={}){
 if(!directory||typeof directory.values!=='function')throw Error('Kein lesbarer Ordner freigegeben.');
 const files=[],warnings=[];
 const walk=async(handle,depth)=>{
  for await(const entry of handle.values()){
   if(files.length>=maxFiles){if(!warnings.length)warnings.push(`Nur die ersten ${maxFiles} Dateien berücksichtigt; bitte weitere separat auswählen.`);return;}
   if(entry.kind==='directory'){
    if(depth<maxDepth&&entry.name&&!entry.name.startsWith('.'))await walk(entry,depth+1);
   }else if(entry.kind==='file'&&/\.(?:csv|json|zip|fit|xls|xlsx|txt|pdf|ics|gpx|ris|ofx)$/i.test(entry.name||'')){
    try{const file=await entry.getFile();if(file.size<=MAX_FILE_BYTES)files.push(file);else warnings.push(`${entry.name}: größer als 125 MB, übersprungen`);}catch{warnings.push(`${entry.name}: nicht lesbar`);}
   }
  }
 };
 await walk(directory,0);
 return {files,warnings};
}
export function smartImportHubView({entries=[],history=[],folderStatus={},notice='',busy=false}={}){
 const totals=Object.keys(SMART_IMPORT_KINDS).filter(k=>k!=='unknown').map(k=>[k,entries.filter(e=>e.kind===k&&!e.duplicate).length]).filter(x=>x[1]);
 const pending=entries.filter(e=>!e.duplicate).length;const duplicates=entries.filter(e=>e.duplicate).length;
 return `<section class="work-card smart49-hub" id="smart-import-hub" aria-label="Smart Import Hub">
 <div class="work-heading"><span>⇩ Smart Import Hub</span><span class="quiet-tag">Lokal · mit Vorschau</span></div>
 <p class="muted-line">Dateien zentral ablegen, automatisch erkennen und zum vorhandenen Importer weitergeben. Importiert wird erst nach deiner Bestätigung.</p>
 <div class="smart49-drop" id="smart49-drop" tabindex="0" role="group" aria-label="Dateien zum Smart Import ziehen">
 <label class="secondary-btn smart49-file-btn">Dateien auswählen<input id="smart49-files" type="file" multiple accept=".csv,.json,.zip,.fit,.xls,.xlsx,.txt,.pdf,.ics,.gpx,.ris,.ofx"></label><span>oder Dateien hierher ziehen</span>
 </div>
 <div class="smart49-sources">${SMART_IMPORT_SOURCES.map(x=>`<div class="smart49-source"><div><strong>${x.id==='health'?'⌚':'◈'} ${esc(x.label)}</strong><small>${esc(x.hint)}</small><small>${esc(folderStatus[x.id]||'Ordner nur nach Freigabe lesbar')}</small></div><button type="button" class="secondary-btn" data-action="smart49-pick-folder" data-id="${x.id}" ${busy?'disabled':''}>Ordner wählen</button><button type="button" class="secondary-btn" data-action="smart49-rescan-folder" data-id="${x.id}" ${!folderStatus[x.id]||busy?'disabled':''}>Prüfen</button></div>`).join('')}</div>
 ${notice?`<p class="muted-line" role="status">${esc(notice)}</p>`:''}
 ${entries.length?`<div class="smart49-results"><div class="smart49-overview"><strong>${entries.length} Dateien</strong><small>${pending} zu prüfen${duplicates?` · ${duplicates} identische Datei(en) bereits erkannt`:''}</small></div>
 ${totals.map(([kind,count])=>`<button type="button" class="secondary-btn" data-action="smart49-preview-kind" data-id="${kind}" ${busy?'disabled':''}>${esc(SMART_IMPORT_KINDS[kind])} · ${count} →</button>`).join('')}
 <div class="smart49-list">${entries.map((e,i)=>`<div class="smart49-row"><div><strong>${esc(e.name)}</strong><small>${esc(e.duplicate?'Identische Datei – bereits gesehen oder importiert':e.reason)} · ${(e.size/1024/1024).toLocaleString('de-AT',{maximumFractionDigits:1})} MB</small></div><div><select data-smart49-kind="${i}" aria-label="Importtyp für ${esc(e.name)}" ${e.duplicate?'disabled':''}>${Object.entries(SMART_IMPORT_KINDS).map(([key,label])=>`<option value="${key}" ${key===e.kind?'selected':''}>${esc(label)}</option>`).join('')}</select></div></div>`).join('')}</div>
 <p class="muted-line">Unsichere Dateien zuerst prüfen. Der Importtyp lässt sich korrigieren. Dateien über 12 MB erhalten keinen Datei-Hash; der Zielimporter prüft seine eigenen Dubletten.</p>
 <button type="button" class="secondary-btn" data-action="smart49-reset">Liste leeren</button></div>`:`<small class="muted-line">Auch gemischte Stapel sind möglich. Ordnerzugriff funktioniert in unterstützten Desktop-Browsern und nur mit deiner Erlaubnis.</small>`}
 <details class="smart49-help"><summary>Datenschutz & Hintergrundüberwachung</summary><p>Es werden weder Dateiinhalte noch Windows-Verzeichnisse an ChatGPT oder eine externe KI übertragen. Die Dateien verbleiben bis zur Vorschau im Arbeitsspeicher, bestätigte Daten im verschlüsselten Tresor. Nur gehashte, bestätigte Importdateien erscheinen im lokalen Importprotokoll. Windows-Ordner müssen nach einem Neustart erneut freigegeben werden. Eine dauerhafte Überwachung bei geschlossenem Browser benötigt einen separaten lokalen Begleitprozess.</p><small>${normalizeImportHistory(history).length} bestätigte Dateiimporte im lokalen Protokoll</small></details>
 </section>`;
}
