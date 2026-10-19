/** An Inbox flag is stored as a reserved, valid record tag so existing record
 * sync APIs carry it across devices without a second schema migration.
 * Keep it out of person/tag pickers and task tag lists.
 */
import {parseTags} from './tasks.js';
export const INBOX_FLAG_TAG='compass-system-flag';
export const inboxFlagged=record=>Boolean(record?.tags?.includes(INBOX_FLAG_TAG));
export const visibleInboxTags=recordOrTags=>(Array.isArray(recordOrTags)?recordOrTags:recordOrTags?.tags||[]).filter(tag=>tag!==INBOX_FLAG_TAG);
export function setInboxFlag(tags,flagged){
 const publicTags=parseTags(visibleInboxTags(tags));
 if(!flagged)return publicTags;
 if(publicTags.length>=12)throw new Error('Maximal 11 normale Tags mit gesetzter Flagge möglich. Bitte zuerst einen Tag entfernen.');
 return [INBOX_FLAG_TAG,...publicTags];
}
