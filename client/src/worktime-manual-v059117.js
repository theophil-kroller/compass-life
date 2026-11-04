/** Compass 0.5.91.17 · Validated retrospective punch-time entry.
 * Returns a mutation only, leaving persistence/encryption to the existing vault.
 * A start without an end resumes the live timer from the entered time.
 * A completed interval is stored in the existing timeJournal, with no duplicate
 * copy in quickWorktime and with all ordinary journal edit/delete affordances.
 */
import {timeEntries,putTimeEntry} from './personal-journal-v5692.js';
const timeOK=x=>/^([01]\d|2[0-3]):[0-5]\d$/.test(x||'');
const dayOK=x=>/^\d{4}-\d{2}-\d{2}$/.test(x||'');
const localDay=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function localPunch117(day,time){
 if(!dayOK(day)||!timeOK(time))throw Error('Datum und Uhrzeit im Format TT.MM.JJJJ / HH:MM eingeben.');
 const [y,m,d]=day.split('-').map(Number),[h,min]=time.split(':').map(Number);
 const value=new Date(y,m-1,d,h,min,0,0);
 if(!Number.isFinite(value.getTime())||localDay(value)!==day||value.getHours()!==h||value.getMinutes()!==min)throw Error('Diese lokale Uhrzeit ist am gewählten Datum nicht gültig.');
 return value.toISOString();
}
export function applyManualPunch117(state,{day,startTime,endTime='',category='work',now=new Date(),id=''}={}){
 if(!state||typeof state!=='object')throw Error('Tresor entsperren, um Zeiten rückwirkend zu erfassen.');
 if(!['work','research','teaching','meeting','admin','other'].includes(category)&&!['work'].includes(category)){
  // The user-facing quick-punch form is deliberately limited to professional work.
  throw Error('Bitte einen beruflichen Arbeitszeitbereich auswählen.');
 }
 const today=localDay(now);
 if(day>today)throw Error('Ein zukünftiger Tag kann nicht nachgetragen werden.');
 const start=localPunch117(day,startTime),from=Date.parse(start),present=now.getTime();
 if(from>present)throw Error('Die Startzeit darf nicht in der Zukunft liegen.');
 const end=endTime?localPunch117(day,endTime):null,to=end?Date.parse(end):present;
 if(end&&to>present)throw Error('Die Endzeit darf nicht in der Zukunft liegen.');
 if(end&&to<=from)throw Error('Ende muss nach dem Beginn liegen. Bei Arbeit über Mitternacht das vollständige Zeitjournal verwenden.');
 if(end&&to-from>16*3600000)throw Error('Bitte Zeitintervalle über 16 Stunden im Zeitjournal prüfen.');
 if(!state.quickWorktime||typeof state.quickWorktime!=='object')state.quickWorktime={sessions:[],activeStart:''};
 const active=state.quickWorktime;
 if(active.activeStart){
  // A single real active timer must not be silently overwritten.
  throw Error('Ein Timer läuft bereits. Bitte zuerst ausstempeln und anschließend den abgeschlossenen Block im Zeitjournal korrigieren.');
 }
 for(const row of timeEntries(state)){
  const existingFrom=Date.parse(row.start),existingTo=Date.parse(row.end);
  if(Number.isFinite(existingFrom)&&Number.isFinite(existingTo)&&from<existingTo&&to>existingFrom)throw Error('Dieser Zeitraum überschneidet sich mit einem vorhandenen Eintrag. Bitte den bestehenden Block bearbeiten.');
 }
 if(end){
  const saved=putTimeEntry(state,{id:id||globalThis.crypto?.randomUUID?.()||`manual-${Date.now()}`,start,end,category:'work',title:'Arbeitszeit · manuell nachgetragen',project:'',updatedAt:now.toISOString()});
  return {mode:'completed',entry:saved};
 }
 // Backdated start has no fabricated end; ordinary Stop later closes it.
 active.activeStart=start;active.activeCategory='work';active.updatedAt=now.toISOString();
 return {mode:'running',start};
}
