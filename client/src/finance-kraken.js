/** Compass 0.5.17.4 — Kraken Spot read-only snapshots, imported locally.
 * No API credentials, addresses or bank account details are accepted or stored.
 * Raw trade/ledger amounts are kept in their ORIGINAL ASSET, never EUR cashflow.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtTime=s=>{const d=new Date(s);return Number.isFinite(+d)?d.toLocaleString('de-AT'):'–';};
const ASSET=/^[\p{L}0-9._-]{1,35}$/u;
const AMOUNT=/^[+-]?\d{1,20}(?:\.\d{1,18})?$/;
const cleanText=(x,n=70)=>typeof x==='string'?x.slice(0,n):'';
const decimal=(x)=>typeof x==='string'&&AMOUNT.test(x)?x:null;
const asTimestamp=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&Date.parse(x)>Date.UTC(2010,0,1)?x:null;
export const KRAKEN_FORMAT='compass-kraken-readonly-v1';
export function validateKrakenSnapshot(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload)||payload.format!==KRAKEN_FORMAT)throw Error('Keine Compass-Kraken-API-Datei. Bitte den lokalen Kraken-Exporthelfer verwenden.');
 if('key'in payload||'secret'in payload||'apiKey'in payload||'apiSecret'in payload||'credentials'in payload)throw Error('API-Zugangsdaten dürfen nicht importiert werden.');
 const generatedAt=asTimestamp(payload.generatedAt);if(!generatedAt)throw Error('Kraken-Datei ohne gültigen Exportzeitpunkt.');
 if(!payload.balances||typeof payload.balances!=='object'||Array.isArray(payload.balances)||Object.keys(payload.balances).length>500)throw Error('Ungültige Kraken-Bestandsdaten.');
 const balances=Object.fromEntries(Object.entries(payload.balances).map(([asset,amount])=>{
  if(!ASSET.test(asset)||!decimal(amount))throw Error('Kraken-Bestand mit ungültigem Währungscode oder Betrag.');return [asset,amount];
 }));
 const readEntries=(input,kind)=>{
  if(!Array.isArray(input)||input.length>10000)throw Error('Kraken-Datei enthält zu viele Buchungen.');
  const map=new Map();for(const raw of input){
   if(!raw||typeof raw!=='object'||typeof raw.id!=='string'||!/^[-\w]{1,90}$/.test(raw.id))throw Error(`Ungültige Kraken-${kind}-ID.`);
   if(!Number.isFinite(raw.time)||raw.time<1262304000||raw.time>4102444800)throw Error('Ungültiger Kraken-Zeitstempel.');
   if(kind==='ledger'){
    if(!ASSET.test(raw.asset)||!decimal(raw.amount)||!decimal(raw.fee)||!decimal(raw.balance))throw Error('Ungültiger Kraken-Ledger-Eintrag.');
    map.set(raw.id,{id:raw.id,time:raw.time,asset:raw.asset,amount:raw.amount,fee:raw.fee,balance:raw.balance,type:cleanText(raw.type,35),subtype:cleanText(raw.subtype,35),refid:cleanText(raw.refid,90)});
   }else{
    if(!ASSET.test(raw.pair)||!['buy','sell'].includes(raw.type)||!['price','volume'].every(k=>decimal(raw[k]))||!decimal(raw.fee)||!decimal(raw.cost))throw Error('Ungültiger Kraken-Trade.');
    map.set(raw.id,{id:raw.id,time:raw.time,pair:raw.pair,type:raw.type,price:raw.price,volume:raw.volume,cost:raw.cost,fee:raw.fee});
   }
  }
  return [...map.values()].sort((a,b)=>b.time-a.time);
 };
 const ledgers=readEntries(payload.ledgers||[],'ledger'),trades=readEntries(payload.trades||[],'trade');
 return {format:KRAKEN_FORMAT,generatedAt,balances,ledgers,trades,partial:payload.partial===true,source:'Kraken Spot API (lokaler Export)'};
}
export function mergeKrakenSnapshot(oldData,raw){
 const incoming=validateKrakenSnapshot(raw);
 const past=oldData?.format===KRAKEN_FORMAT?oldData:null;
 const merge=(older,newer)=>{const map=new Map((older||[]).map(r=>[r.id,r]));for(const r of newer)map.set(r.id,r);return [...map.values()].sort((a,b)=>b.time-a.time).slice(0,10000);};
 return {...incoming,ledgers:merge(past?.ledgers,incoming.ledgers),trades:merge(past?.trades,incoming.trades),generatedAt:incoming.generatedAt};
}
export function krakenPortfolioView(data=null,preview=null){
 const usable=data?.format===KRAKEN_FORMAT?data:null;
 const assets=Object.entries(usable?.balances||{}).filter(([,v])=>Number(v)!==0).sort(([a],[b])=>a.localeCompare(b));
 const deposits=(usable?.ledgers||[]).filter(r=>r.type==='deposit'),withdrawals=(usable?.ledgers||[]).filter(r=>r.type==='withdrawal');
 const sync=usable?fmtTime(usable.generatedAt):'noch nicht synchronisiert';
 return `<section class="fin-analysis-section fin-kraken" aria-label="Kraken Spot API Import">
 <div class="fin-analysis-head"><div><span class="insight-kicker">KRYPTO / LOCAL-FIRST</span><h3>Kraken · schreibgeschützter API-Import</h3></div><span class="quiet-tag">${esc(sync)}</span></div>
 <p>Compass verwendet einen <strong>lokalen Kraken-Exporthelfer</strong>. Dieser kontaktiert Kraken direkt von deinem Computer. Dein API-Schlüssel und API-Secret werden nur dort eingegeben, <strong>niemals in Compass, GitHub oder Cloudflare</strong>.</p>
 <div class="fin-kraken-steps"><div><strong>1 · API-Key anlegen</strong><small>Kraken Pro → Einstellungen → API. Nur „Query Funds“, „Query Ledger Entries“ und „Query Closed Orders & Trades“ einschalten; keine Trading-/Withdraw-Rechte.</small><a href="https://support.kraken.com/de/articles/how-to-create-an-api-key-on-kraken-pro" target="_blank" rel="noopener noreferrer">Kraken-Anleitung ↗</a></div><div><strong>2 · Lokal synchronisieren</strong><small>Im Projektordner <code>tools/kraken/START_WINDOWS.bat</code> beziehungsweise <code>START_MAC_LINUX.sh</code> ausführen. Schlüssel im Terminal eingeben; die Exportdatei entsteht im privaten Downloads-Ordner.</small></div><div><strong>3 · Hier übernehmen</strong><small>Die lokal erzeugte JSON auswählen, Vorschau prüfen, dann verschlüsselt im Compass-Vault speichern. Exportdatei danach sicher entfernen.</small></div></div>
 <label class="secondary-btn fin-kraken-upload">Kraken-API-Export auswählen<input type="file" id="finance-kraken-file" accept=".json,application/json" /></label>
 ${preview?`<div class="fin-preview-result"><strong>Importvorschau: ${Object.keys(preview.balances).length} Währungen · ${preview.ledgers.length} Ledger-Einträge · ${preview.trades.length} Trades</strong><p>Stand ${esc(fmtTime(preview.generatedAt))}${preview.partial?' · API-Historie unvollständig':''}. Vorhandene Einträge mit gleicher Kraken-ID werden nicht verdoppelt.</p><button type="button" class="primary-btn" data-action="finance-kraken-confirm">Kraken-Daten übernehmen</button> <button type="button" class="secondary-btn" data-action="finance-kraken-cancel">Abbrechen</button></div>`:''}
 ${usable?`<div class="fin-kpi-grid"><article class="fin-kpi"><small>Währungen mit Bestand</small><strong>${assets.length}</strong><span>Kraken Spot</span></article><article class="fin-kpi"><small>Ledger-Einträge</small><strong>${usable.ledgers.length}</strong><span>${deposits.length} Einzahlungen · ${withdrawals.length} Auszahlungen</span></article><article class="fin-kpi"><small>Trades</small><strong>${usable.trades.length}</strong><span>Abgeschlossene Trades</span></article><article class="fin-kpi"><small>Datenstand</small><strong>${esc(fmtTime(usable.generatedAt).slice(0,10))}</strong><span>${usable.partial?'Historie teilweise geladen':'Vom lokalen Exporthelfer'}</span></article></div>
 <div class="fin-kraken-balances"><h4>Bestände nach Währung</h4>${assets.length?`<div class="fin-category-list">${assets.map(([asset,amount])=>`<div><strong>${esc(asset)}</strong><span>${esc(amount)}</span></div>`).join('')}</div>`:'<p>Keine positiven Spot-Bestände im letzten Snapshot.</p>'}</div>
 <details class="fin-kraken-ledgers"><summary>Letzte Kraken-Ledger-Einträge ansehen</summary>${usable.ledgers.slice(0,18).map(r=>`<div class="fin-kraken-entry"><span>${esc(new Date(r.time*1000).toLocaleDateString('de-AT'))} · ${esc(r.type)} · ${esc(r.asset)}</span><strong>${esc(r.amount)}</strong></div>`).join('')||'<p>Keine Ledger-Einträge vorhanden.</p>'}</details><button type="button" class="secondary-btn" data-action="finance-kraken-delete">Importierte Kraken-Daten lokal entfernen</button>`:'<p class="fin-kraken-empty">Noch keine Kraken-API-Daten importiert.</p>'}
 <p class="fin-disclaimer"><strong>Wichtig:</strong> Bestände werden in Originalwährung gezeigt, ohne unbestätigte EUR-Bewertung. Einzahlungen sind keine Einnahmen; Trades sind keine Konsumausgaben. Bank-Überweisungen an Kraken bleiben getrennte Konto-/Anlagebewegungen, bis du sie ausdrücklich abstimmst. Kraken Spot ist nicht automatisch eine vollständige Abbildung von Earn, Staking, Futures oder externen Wallets.</p></section>`;
}
