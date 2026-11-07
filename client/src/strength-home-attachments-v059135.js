/** 0.5.91.35 — Future home attachments. Possession != safe installation.
 * Existing dumbbell inventory is unchanged. Activation is an explicit local
 * user decision after inspecting the wall anchor, pulley and load path.
 */
export const HOME_ATTACHMENTS_KEY_135='compass:strength:home-attachments-v59135';
export const DEFAULT_HOME_ATTACHMENTS_135=Object.freeze({version:1,cableReady:false,pullupReady:false});
export const CABLE_HOME_EXERCISES_135=Object.freeze([
 'lat-pulldown','cable-straight-arm-pulldown','face-pull','cable-single-arm-row',
 'cable-lateral-raise','cable-rear-delt-fly','cable-crunch','cable-woodchop',
 'cable-row','triceps-pushdown','pallof-press'
]);
const CABLE_SET=new Set(CABLE_HOME_EXERCISES_135);
export function normalizeHomeAttachments135(raw){return {version:1,cableReady:raw?.cableReady===true,pullupReady:raw?.pullupReady===true};}
export function readHomeAttachments135(){try{return normalizeHomeAttachments135(JSON.parse(globalThis.localStorage?.getItem(HOME_ATTACHMENTS_KEY_135)||'null'));}catch{return normalizeHomeAttachments135(null);}}
export function saveHomeAttachments135(value){const next=normalizeHomeAttachments135(value);globalThis.localStorage?.setItem(HOME_ATTACHMENTS_KEY_135,JSON.stringify(next));return next;}
/** Safety gate used by both daily planning and voluntary exercise library. */
export function homeAttachmentAllows135(id,settings=readHomeAttachments135()){
 if(CABLE_SET.has(id))return settings.cableReady===true;
 if(id==='pullup'||id==='assisted-pullup')return settings.pullupReady===true;
 return false;
}
export const HOME_ATTACHMENT_NOTICE_135='Kabelzug, Ladepin und Wand-Klimmzugstange sind vorhanden, jedoch noch nicht als sicher montiert bestätigt. Erst nach Prüfung von Verankerung, maximaler Last, Umlenkrolle, Seil und Freiraum aktivieren. Keine automatische Freigabe.';
