// Durable event synchronization state. Each local change is retained until the server confirms it.
import {eventKey,validEvent} from './event-import.js';
const dayOffset=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
export function eventState(s){s.discoveredEvents??=[];s.eventPreferences??={};s.eventVersions??={};s.eventPending??={};s.eventDeleted??={};s.eventConflicts??={};return s;}
export function queueEvent(s,e){eventState(s);const k=eventKey(e);if(!validEvent(e))throw Error('Ungültige Veranstaltung');const i=s.discoveredEvents.findIndex(x=>eventKey(x)===k);if(i<0)s.discoveredEvents.push(e);else s.discoveredEvents[i]=e;delete s.eventDeleted[k];s.eventPending[k]=true;return k;}
export function queueEventPreference(s,k,status){eventState(s);if(!['open','saved','hidden'].includes(status))throw Error('Ungültiger Status');if(!s.discoveredEvents.some(e=>eventKey(e)===k))throw Error('Event nicht vorhanden');if(status==='open')delete s.eventPreferences[k];else s.eventPreferences[k]=status;s.eventPending[k]=true;}
export function removeEvents(s){eventState(s);for(const e of s.discoveredEvents){const k=eventKey(e);s.eventDeleted[k]=true;s.eventPending[k]=true;delete s.eventPreferences[k];}s.discoveredEvents=[];}
export function prunePastEvents(s,today,grace=14){eventState(s);const cutoff=dayOffset(today,-grace);let removed=0;for(const e of [...s.discoveredEvents]){const k=eventKey(e),end=e.endDate||e.date;if(end<cutoff&&s.eventPreferences[k]!=='saved'&&!s.eventConflicts[k]){s.eventDeleted[k]=true;s.eventPending[k]=true;s.discoveredEvents=s.discoveredEvents.filter(x=>eventKey(x)!==k);delete s.eventPreferences[k];removed++;}}return removed;}
export function pendingEventBatch(s,n=25){eventState(s);return Object.keys(s.eventPending).filter(k=>!s.eventConflicts[k]).slice(0,n).flatMap(k=>{const event=s.discoveredEvents.find(x=>eventKey(x)===k);if(!event&&!s.eventDeleted[k])return [];return [{key:k,event:event||null,removed:!!s.eventDeleted[k],status:s.eventPreferences[k]||'open',baseVersion:s.eventVersions[k]||0}];});}
export function acknowledgeEventBatch(s,batch,response){eventState(s);for(const x of response.results||[]){const sent=batch.find(y=>y.key===x.key);if(!sent)continue;if(x.status==='applied'||x.status==='unchanged'){
  s.eventVersions[x.key]=x.version;
  const cur=s.discoveredEvents.find(e=>eventKey(e)===x.key);if((cur?JSON.stringify(cur):null)===(sent.event?JSON.stringify(sent.event):null)&&(!!s.eventDeleted[x.key])===sent.removed&&(s.eventPreferences[x.key]||'open')===sent.status){delete s.eventPending[x.key];if(sent.removed)delete s.eventDeleted[x.key];}
 }else if(x.status==='conflict'){s.eventConflicts[x.key]={remote:x.remote};delete s.eventPending[x.key];}
 else throw Error('Event konnte nicht gespeichert werden: '+(x.error||x.status));}}
export function mergeEventSnapshot(s,remote){eventState(s);let added=0;for(const item of remote){const k=item.key;if(s.eventPending[k]||s.eventConflicts[k])continue;const local=s.discoveredEvents.find(e=>eventKey(e)===k);const known=s.eventVersions[k];if(known!==undefined&&known>item.version)continue;
 if(known===undefined&&local){
   const localStatus=s.eventPreferences[k]||'open';
   // A legacy 0.5.2 import with no explicit choice must not overwrite a cloud shortlist.
   if(localStatus==='open'||localStatus===item.status){
     s.eventVersions[k]=item.version;s.discoveredEvents=s.discoveredEvents.filter(e=>eventKey(e)!==k);
     if(!item.removed&&item.event&&validEvent(item.event))s.discoveredEvents.push(item.event);
     if(item.status==='open'||item.removed)delete s.eventPreferences[k];else s.eventPreferences[k]=item.status;
     continue;
   }
   // Preserve a meaningful local choice when the cloud has no preference yet.
   if(item.status==='open'&&!item.removed){s.eventVersions[k]=item.version;s.eventPending[k]=true;continue;}
   s.eventConflicts[k]={remote:item};continue;
 }
 s.eventVersions[k]=item.version;delete s.eventDeleted[k];s.discoveredEvents=s.discoveredEvents.filter(e=>eventKey(e)!==k);
 if(!item.removed&&item.event&&validEvent(item.event)){s.discoveredEvents.push(item.event);added++;if(item.status==='open')delete s.eventPreferences[k];else s.eventPreferences[k]=item.status;}else delete s.eventPreferences[k];
 }return added;}
export function resolveEventConflict(s,key,choice){eventState(s);const remote=s.eventConflicts[key]?.remote;if(!remote)return false;
 if(choice==='cloud'){s.discoveredEvents=s.discoveredEvents.filter(e=>eventKey(e)!==key);if(!remote.removed&&remote.event){s.discoveredEvents.push(remote.event);delete s.eventDeleted[key];}else delete s.eventDeleted[key];if(remote.status==='open'||remote.removed)delete s.eventPreferences[key];else s.eventPreferences[key]=remote.status;delete s.eventPending[key];}
 else if(choice==='local'){if(!s.discoveredEvents.some(e=>eventKey(e)===key)&&!s.eventDeleted[key])return false;s.eventPending[key]=true;}
 else return false;
 s.eventVersions[key]=remote.version;delete s.eventConflicts[key];return true;
}
