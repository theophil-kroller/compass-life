/** E2EE mirror transport only: split base64 ciphertext, never plaintext. */
export const MIRROR_CHUNK_CHARS=160000;
export const MIRROR_SINGLE_LIMIT=700000;
export const MIRROR_MAX_CHUNKS=180;
export function privateMirrorNeedsChunks(ciphertext){return typeof ciphertext==='string'&&ciphertext.length>MIRROR_SINGLE_LIMIT;}
export function privateMirrorParts(ciphertext,partSize=MIRROR_CHUNK_CHARS){
 if(typeof ciphertext!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(ciphertext)||!Number.isInteger(partSize)||partSize<4||partSize>180000||partSize%4!==0)throw Error('Ungültige verschlüsselte Daten.');
 const count=Math.ceil(ciphertext.length/partSize);
 if(count<1||count>MIRROR_MAX_CHUNKS)throw Error('Verschlüsseltes Archiv zu groß für den Geräteabgleich; lokale Daten bleiben erhalten.');
 return Array.from({length:count},(_,i)=>ciphertext.slice(i*partSize,(i+1)*partSize));
}
export function joinMirrorParts(parts,expected){
 if(!Array.isArray(parts)||parts.length!==expected||!Number.isInteger(expected)||expected<2||expected>MIRROR_MAX_CHUNKS)throw Error('Unvollständiger verschlüsselter Geräteabgleich.');
 const s=parts.join('');if(!/^[A-Za-z0-9+/]*={0,2}$/.test(s)||s.length>180000*MIRROR_MAX_CHUNKS)throw Error('Beschädigtes Geräte-Abgleichpaket.');return s;
}
