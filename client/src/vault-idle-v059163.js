/** Compass 0.5.91.63 – per-device local idle lock preference.
 * Stores only a non-sensitive number in this browser; vault secrets and data
 * remain in the existing encrypted vault. When unavailable, prefer 60 minutes.
 */
export const VAULT_IDLE_MINUTES_163=Object.freeze([15,30,60,120,240]);
export const VAULT_IDLE_DEFAULT_163=60;
export const VAULT_IDLE_KEY_163='compass.vaultIdleMinutes.device.v1';
export function validVaultIdleMinutes163(value){
 const n=Number(value);return VAULT_IDLE_MINUTES_163.includes(n)&&String(value??'').trim()!==''?n:null;
}
export function readVaultIdleMinutes163(storage){
 try{
  const store=storage===undefined?globalThis.localStorage:storage;
  const value=store?.getItem?.(VAULT_IDLE_KEY_163);
  return validVaultIdleMinutes163(value)??VAULT_IDLE_DEFAULT_163;
 }catch{return VAULT_IDLE_DEFAULT_163;}
}
export function writeVaultIdleMinutes163(minutes,storage){
 const value=validVaultIdleMinutes163(minutes);
 if(value===null)throw Error('Ungültige Entsperrzeit');
 try{
  const store=storage===undefined?globalThis.localStorage:storage;
  store?.setItem?.(VAULT_IDLE_KEY_163,String(value));
  return Boolean(store);
 }catch{return false;}
}
export function vaultIdleElapsed163({now,lastActivity,minutes,activeRoutine=false,graceUntil=0}={}){
 return Number.isFinite(now)&&Number.isFinite(lastActivity)&&!activeRoutine&&now>Number(graceUntil||0)&&now-lastActivity>(validVaultIdleMinutes163(minutes)??VAULT_IDLE_DEFAULT_163)*60000;
}
