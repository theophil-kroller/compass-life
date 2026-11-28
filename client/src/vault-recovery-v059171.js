/** Password-only recovery of an already-uploaded encrypted Compass vault.
 * A lookup capability is deterministically derived on-device from the vault passphrase.
 * No passphrase, cleartext, or vault decryption key is sent to the server.
 * Treat locator as a bearer secret. An attacker who guesses the passphrase can fetch
 * a ciphertext backup; use a genuinely strong, unique vault passphrase.
 */
const te=new TextEncoder();
export const RECOVERY_PART_CHARS=160000;
const SALT=te.encode('compass-life/vault-recovery/password-only/locator/v1');
const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
export function isLocator(value){return typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);}
export async function recoveryLocator(passphrase){
 if(typeof passphrase!=='string'||passphrase.length<12||passphrase.length>1024)throw Error('Passphrase erforderlich (mindestens 12 Zeichen).');
 const material=await crypto.subtle.importKey('raw',te.encode(passphrase),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:SALT,iterations:750000,hash:'SHA-256'},material,256);
 return hex(new Uint8Array(bits));
}
export function backupParts(bundle){
 if(bundle?.application!=='Compass'||bundle?.vaultVersion!==1||!bundle?.meta?.salt||!bundle?.payload?.data)throw Error('Kein gültiger verschlüsselter Compass-Tresor.');
 const raw=JSON.stringify(bundle);
 if(raw.length>18000000)throw Error('Der Tresor überschreitet das derzeitige Cloud-Backup-Limit (18 MB). Bitte manuell exportieren.');
 const parts=[];for(let i=0;i<raw.length;i+=RECOVERY_PART_CHARS)parts.push(raw.slice(i,i+RECOVERY_PART_CHARS));
 return {raw,parts};
}
async function hash(raw){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',te.encode(raw))));}
async function call(apiUrl,path,options={}){
 if(!/^https:\/\//.test(apiUrl))throw Error('Sichere Cloud-Verbindung ist nicht konfiguriert.');
 const response=await fetch(apiUrl.replace(/\/$/,'')+path,{cache:'no-store',...options});
 let data={};try{data=await response.json();}catch{}
 if(!response.ok){const error=new Error(response.status===404?'Noch keine verschlüsselte Cloud-Tresorsicherung gefunden.':response.status===401?'Cloud-Anmeldung für die Sicherung abgelaufen.':`Cloud-Tresor: ${data.error||'Verbindungsfehler'} (${response.status})`);error.status=response.status;throw error;}
 return data;
}
export async function cloudBackupVault(apiUrl,sessionToken,locator,bundle){
 if(!/^cs1_[0-9a-f]{64}$/.test(sessionToken||'')||!isLocator(locator))throw Error('Cloud-Sicherung: Sitzung oder Wiederherstellungsschlüssel fehlt.');
 const {raw,parts}=backupParts(bundle);
 const id=hex(crypto.getRandomValues(new Uint8Array(16)));
 const common={method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+sessionToken}};
 await call(apiUrl,'/api/vault-recovery/begin',{...common,body:JSON.stringify({locator,id,parts:parts.length,length:te.encode(raw).length,hash:await hash(raw)})});
 for(let index=0;index<parts.length;index++){
   await call(apiUrl,'/api/vault-recovery/part',{...common,body:JSON.stringify({locator,id,index,part:parts[index]})});
 }
 const result=await call(apiUrl,'/api/vault-recovery/commit',{...common,body:JSON.stringify({locator,id})});
 return {at:result.at,partCount:parts.length};
}
export async function cloudRecoverVault(apiUrl,locator){
 if(!isLocator(locator))throw Error('Wiederherstellungsschlüssel ungültig.');
 const listing=await call(apiUrl,`/api/vault-recovery/${locator}`);
 for(const snapshot of listing.versions||[]){
   if(!/^[a-f0-9]{32}$/.test(snapshot.id)||!Number.isInteger(snapshot.parts)||snapshot.parts<1||snapshot.parts>120)continue;
   try{
     const pieces=[];
     for(let i=0;i<snapshot.parts;i++){
       const result=await call(apiUrl,`/api/vault-recovery/${locator}/${snapshot.id}/${i}`);
       if(typeof result.part!=='string'||result.part.length>RECOVERY_PART_CHARS)throw Error('Beschädigter Tresor-Teil.');
       pieces.push(result.part);
     }
     const raw=pieces.join('');
     if(raw.length>18000000||await hash(raw)!==snapshot.hash)throw Error('Prüfsumme des Cloud-Tresors stimmt nicht.');
     const backup=JSON.parse(raw);
     backupParts(backup);return backup;
   }catch(ex){if(snapshot===listing.versions.at(-1))throw ex;}
 }
 return null;
}
