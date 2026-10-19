import {krakenPriceChartHtml,krakenAssetSymbol} from './kraken-history-v39.js';
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
 const rawQuotes=payload.quotesEur||{},quotesEur={};
 if(!rawQuotes||typeof rawQuotes!=='object'||Array.isArray(rawQuotes)||Object.keys(rawQuotes).length>500)throw Error('Kraken-Kurse mit ungültigem Format.');
 for(const [asset,price] of Object.entries(rawQuotes)){
  if(!ASSET.test(asset)||!decimal(price)||Number(price)<=0||Number(price)>1000000000)throw Error('Kraken-Kurs mit ungültigem Wert.');
  quotesEur[asset]=price;
 }
 const pricedAt=Object.keys(quotesEur).length?asTimestamp(payload.pricedAt||payload.generatedAt):null;
 if(Object.keys(quotesEur).length&&!pricedAt)throw Error('Kraken-Kurse ohne Zeitstempel.');
 const ledgers=readEntries(payload.ledgers||[],'ledger'),trades=readEntries(payload.trades||[],'trade');
 return {format:KRAKEN_FORMAT,generatedAt,balances,ledgers,trades,quotesEur,pricedAt,partial:payload.partial===true,source:'Kraken Spot API (lokaler Export)'};
}
/** EUR values are explicitly partial when any non-zero asset lacks a contemporaneous Kraken price. */
export function krakenWealthSummary(data){
 const assets=Object.entries(data?.balances||{}).filter(([,amount])=>Number(amount)>0);
 let covered=0,total=0;const positions=[];
 for(const [asset,raw] of assets){
  const amount=Number(raw),rate=Number(data?.quotesEur?.[asset]),price=Number.isFinite(rate)&&rate>0?rate:null;
  const value=price===null?null:amount*price;
  if(value!==null&&Number.isFinite(value)){covered++;total+=value;}
  positions.push({asset,amount,rate:price,value:Number.isFinite(value)?value:null});
 }
 positions.sort((a,b)=>(b.value??-1)-(a.value??-1));
 return {positions,totalEur:total,covered,total:assets.length,complete:covered===assets.length&&assets.length>0,pricedAt:data?.pricedAt||null};
}
export function mergeKrakenSnapshot(oldData,raw){
 const incoming=validateKrakenSnapshot(raw);
 const past=oldData?.format===KRAKEN_FORMAT?oldData:null;
 const merge=(older,newer)=>{const map=new Map((older||[]).map(r=>[r.id,r]));for(const r of newer)map.set(r.id,r);return [...map.values()].sort((a,b)=>b.time-a.time).slice(0,10000);};
 const current=krakenWealthSummary(incoming),historic=(Array.isArray(past?.valuationHistory)?past.valuationHistory:[]).filter(x=>x&&Number.isFinite(Date.parse(x.at))&&Number.isFinite(x.valueEur)&&x.valueEur>=0).slice(-365);
 // Only comparable fully-priced snapshots are used as historical points; dates replace same-day values.
 if(current.complete){
  const day=incoming.generatedAt.slice(0,10),row={at:incoming.generatedAt,day,valueEur:Math.round(current.totalEur*100)/100,assets:current.total};
  const idx=historic.findIndex(x=>x.day===day);
  if(idx>=0)historic[idx]=row;else historic.push(row);
 }
 return {...incoming,valuationHistory:historic.sort((a,b)=>a.at.localeCompare(b.at)).slice(-365),ledgers:merge(past?.ledgers,incoming.ledgers),trades:merge(past?.trades,incoming.trades)};
}
/** Update EUR quotes without refreshing balances, ledger or trades. Historic valuations
 * are recorded only when all positive assets are priced, at the quote timestamp.
 * The portfolio's original balance-snapshot time remains unchanged.
 */
export function updateKrakenQuotes(current,reply){
 if(current?.format!==KRAKEN_FORMAT)throw Error('Vor Kursaktualisierung zuerst Kraken-Bestände importieren.');
 const candidate=validateKrakenSnapshot({...current,quotesEur:reply?.quotesEur,pricedAt:reply?.pricedAt});
 const updated={...current,quotesEur:candidate.quotesEur,pricedAt:candidate.pricedAt};
 const summary=krakenWealthSummary(updated);
 if(summary.complete&&updated.pricedAt&&updated.generatedAt.slice(0,10)===updated.pricedAt.slice(0,10)){
  const at=updated.pricedAt,day=at.slice(0,10),older=Array.isArray(current.valuationHistory)?current.valuationHistory:[];
  const rows=older.filter(x=>x.day!==day&&Number.isFinite(x.valueEur)).slice(-364);
  rows.push({at,day,valueEur:Math.round(summary.totalEur*100)/100,assets:summary.total});
  updated.valuationHistory=rows.sort((a,b)=>a.at.localeCompare(b.at)).slice(-365);
 }
 return updated;
}
const euro=x=>Number(x).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:2});
function allocationRing(positions){
 const priced=positions.filter(x=>x.value!==null&&x.value>0),total=priced.reduce((n,x)=>n+x.value,0);
 if(!total)return '<p class="fin-disclaimer">Für die Vermögensgrafik fehlen noch EUR-Marktkurse. Im lokalen Connector erneut synchronisieren.</p>';
 let progress=0;const R=79,C=2*Math.PI*R;
 const circles=priced.slice(0,14).map((p,i)=>{
  const fraction=p.value/total,start=progress;progress+=fraction;
  const colors=['#2C8F7A','#7D98D1','#DDA373','#AA89CA','#63B3C3','#D7B96E','#C98289','#85A879'];
  return `<circle cx="112" cy="112" r="${R}" fill="none" stroke="${colors[i%colors.length]}" stroke-width="25" stroke-dasharray="${(fraction*C).toFixed(3)} ${(C-fraction*C).toFixed(3)}" stroke-dashoffset="${(-start*C).toFixed(3)}" transform="rotate(-90 112 112)"><title>${esc(p.asset)} · ${esc(euro(p.value))}</title></circle>`;
 }).join('');
 return `<div class="fin-wealth-donut"><svg viewBox="0 0 224 224" role="img" aria-label="Kraken Asset Allocation nach EUR bewertet"><circle cx="112" cy="112" r="${R}" fill="none" stroke="#E9EFEC" stroke-width="25"/>${circles}<text x="112" y="108" text-anchor="middle" font-size="12" fill="#527969">Bepreist</text><text x="112" y="130" text-anchor="middle" font-size="18" font-weight="700" fill="#234C41">${esc(euro(total))}</text></svg></div>`;
}
function historySpark(points){
 if(points.length<2)return '<p class="fin-disclaimer">Ein Vermögensverlauf entsteht nach mindestens zwei vollständig bewerteten Synchronisationstagen. Frühere Kraken-Preise werden nicht rückwirkend erfunden.</p>';
 const vals=points.slice(-60),min=Math.min(...vals.map(x=>x.valueEur)),max=Math.max(...vals.map(x=>x.valueEur)),a=Date.parse(vals[0].at),b=Date.parse(vals.at(-1).at),range=Math.max(1,max-min);
 const poly=vals.map((v,i)=>`${(25+590*(b===a?i/(vals.length-1):(Date.parse(v.at)-a)/(b-a))).toFixed(1)},${(134-110*(v.valueEur-min)/range).toFixed(1)}`).join(' ');
 return `<svg class="fin-wealth-history" viewBox="0 0 660 163" role="img" aria-label="Historischer Kraken Vermögenswert aus vollständigen EUR Bewertungen"><line x1="25" x2="615" y1="134" y2="134" stroke="#D9E6DF"/><polyline fill="none" stroke="#2D987C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${poly}"/><text x="25" y="155" font-size="11" fill="#638075">${esc(vals[0].day)}</text><text x="615" y="155" font-size="11" fill="#638075" text-anchor="end">${esc(vals.at(-1).day)}</text></svg>`;
}
export function krakenWealthView(data,ui={}){
 if(data?.format!==KRAKEN_FORMAT)return `<div class="fin-wealth-welcome"><h3>Kraken · Vermögensübersicht</h3><p>Importiere oder synchronisiere deine Kraken-Daten. Sobald aktuelle EUR-Marktkurse vorliegen, werden Coin-Aufteilung und bewertbare Bestände visualisiert.</p><button type="button" class="secondary-btn" data-action="finance-portfolio-tab" data-id="settings">Kraken-Daten importieren →</button></div>`;
 const summary=krakenWealthSummary(data),rated=summary.positions.filter(p=>p.value!==null&&p.value>0),unrated=summary.positions.filter(p=>p.value===null);
 const max=Math.max(1,...rated.map(x=>x.value));
 if(ui.mode==='analysis')return `<section class="fin-wealth-section fin41-kraken-market"><div class="fin-wealth-head"><h3>Kraken · Coin-Kursanalyse</h3><span class="quiet-tag">${esc(summary.pricedAt?'Kursstand '+new Date(summary.pricedAt).toLocaleString('de-AT'):'Noch keine EUR-Kurse')}</span></div><div class="fin41-instruments" aria-label="Kryptowährung auswählen">${summary.positions.slice(0,24).map(p=>`<button type="button" class="fin41-position-button" data-action="finance-kraken-chart-select" data-id="${esc(p.asset)}" aria-pressed="${p.asset===ui.chartAsset}">${esc(krakenAssetSymbol(p.asset))}</button>`).join('')}</div>${krakenPriceChartHtml(ui.chartAsset,ui.chartPeriod,ui.chartData,ui.chartBusy,ui.chartError,summary.positions,ui.chartSettings||{})}</section>`;
 if(ui.mode==='development')return `<section class="fin-wealth-section fin41-kraken-history"><div class="fin-wealth-head"><h3>Kraken · dokumentierte Bewertungsverläufe</h3></div><div class="fin-wealth-history-card">${historySpark(data.valuationHistory||[])}</div><p class="fin-disclaimer">Nur belegte frühere Bewertungen, keine aus heutigen Coin-Mengen rückgerechnete historische Depotentwicklung.</p></section>`;
 return `<section class="fin-wealth-section" aria-label="Kraken Vermögensvisualisierung"><div class="fin-wealth-head"><div><span class="insight-kicker">KRAKEN / WEALTH</span><h3>Krypto-Vermögen & Asset Allocation</h3></div><span class="quiet-tag">${esc(summary.pricedAt?'Kursstand: '+new Date(summary.pricedAt).toLocaleString('de-AT'):'Noch keine EUR-Kurse')}</span></div>
 <div class="fin-kpi-grid"><article class="fin-kpi"><small>${summary.complete?'Gesamtwert · Spot':'Bewerteter Teil · Spot'}</small><strong>${summary.covered?esc(euro(summary.totalEur)):'–'}</strong><span>${summary.covered} von ${summary.total} Beständen in EUR bewertbar${summary.complete?'':' · unvollständig'}</span></article><article class="fin-kpi"><small>Coin-Positionen</small><strong>${summary.total}</strong><span>Positive Kraken Spot-Bestände</span></article><article class="fin-kpi"><small>Nicht bewertet</small><strong>${unrated.length}</strong><span>Ohne verlässlichen EUR-Kurs</span></article></div>
 <div class="fin-wealth-layout">${allocationRing(summary.positions)}<div class="fin-wealth-positions">${summary.positions.slice(0,ui.mode==='overview'?5:24).map((p,i)=>`<button type="button" class="fin-wealth-asset fin39-coin-row" data-action="finance-kraken-chart-select" data-id="${esc(p.asset)}" aria-label="${esc(p.asset)}: Kursentwicklung öffnen"><div><strong>${esc(krakenAssetSymbol(p.asset))}</strong><small>${esc(String(p.amount))} Einheiten${p.rate!==null?' · '+esc(euro(p.rate))+' / Einheit':''}</small></div><div class="fin-wealth-val"><strong>${p.value===null?'Nicht bewertet':esc(euro(p.value))}</strong>${p.value!==null?`<span style="width:${Math.max(2,100*p.value/max).toFixed(2)}%;background:${['#2C8F7A','#7D98D1','#DDA373','#AA89CA','#63B3C3'][i%5]}"></span>`:''}<small>Kurschart ↗</small></div></button>`).join('')||'<p>Keine positiven Spot-Bestände.</p>'}</div></div>

 ${ui.mode===undefined?krakenPriceChartHtml(ui.chartAsset,ui.chartPeriod,ui.chartData,ui.chartBusy,ui.chartError,summary.positions,ui.chartSettings||{})+'<div class="fin-wealth-history-card"><h4>Entwicklung des bewerteten Portfolios</h4>'+historySpark(data.valuationHistory||[])+'</div>':''}
 <p class="fin-disclaimer">Bewertung des Bestands vom ${esc(new Date(data.generatedAt).toLocaleDateString('de-AT'))} mit unverbindlichen Kraken-EUR-Marktkursen, <strong>keine</strong> Echtzeit-Handelsausführung und keine Steuer- oder Gewinnberechnung. Nur Kraken Spot; flatex, Earn, Staking und externe Wallets fehlen. Bei nicht bewerteten Positionen ist die angezeigte Summe ausdrücklich <strong>nicht dein Gesamtvermögen</strong>.</p></section>`;
}
export function krakenPortfolioView(data=null,preview=null,ui={}){
 const usable=data?.format===KRAKEN_FORMAT?data:null;
 const assets=Object.entries(usable?.balances||{}).filter(([,v])=>Number(v)!==0).sort(([a],[b])=>a.localeCompare(b));
 const deposits=(usable?.ledgers||[]).filter(r=>r.type==='deposit'),withdrawals=(usable?.ledgers||[]).filter(r=>r.type==='withdrawal');
 const sync=usable?fmtTime(usable.generatedAt):'noch nicht synchronisiert';
 return `${ui.mode==='settings'?'':krakenWealthView(usable,ui)}${ui.mode==='settings'||ui.mode===undefined?`<section class="fin-analysis-section fin-kraken" aria-label="Kraken Spot API Import">
 <div class="fin-analysis-head"><div><span class="insight-kicker">KRYPTO / LOCAL-FIRST</span><h3>Kraken · schreibgeschützter API-Import</h3></div><span class="quiet-tag">${esc(sync)}</span></div>
 <p>Compass verwendet einen <strong>lokalen Kraken-Exporthelfer</strong>. Dieser kontaktiert Kraken direkt von deinem Computer. Dein API-Schlüssel und API-Secret werden nur dort eingegeben, <strong>niemals in Compass, GitHub oder Cloudflare</strong>.</p>
 <div class="fin-kraken-steps"><div><strong>1 · API-Key anlegen</strong><small>Kraken Pro → Einstellungen → API. Nur „Query Funds“, „Query Ledger Entries“ und „Query Closed Orders & Trades“ einschalten; keine Trading-/Withdraw-Rechte.</small><a href="https://support.kraken.com/de/articles/how-to-create-an-api-key-on-kraken-pro" target="_blank" rel="noopener noreferrer">Kraken-Anleitung ↗</a></div><div><strong>2 · Lokal synchronisieren</strong><small>Im Projektordner <code>tools/kraken/START_WINDOWS.bat</code> beziehungsweise <code>START_MAC_LINUX.sh</code> ausführen. Schlüssel im Terminal eingeben; die Exportdatei entsteht im privaten Downloads-Ordner.</small></div><div><strong>3 · Hier übernehmen</strong><small>Die lokal erzeugte JSON auswählen, Vorschau prüfen, dann verschlüsselt im Compass-Vault speichern. Exportdatei danach sicher entfernen.</small></div></div>
 <div class="fin-kraken-bridge"><h4>Lokaler Kraken-Connector · direkt synchronisieren</h4>
 <p>Einmal <code>tools/kraken/START_LOCAL_CONNECTOR_WINDOWS.bat</code> (Mac/Linux: <code>START_LOCAL_CONNECTOR_MAC_LINUX.sh</code>) starten. API-Zugangsdaten bleiben im lokalen Terminal. Den angezeigten Kopplungscode hier eintragen; Compass fragt den Connector ausschließlich auf deinem eigenen Computer ab.</p>
 <div class="fin-bridge-controls"><label>Kopplungscode des lokalen Connectors<input type="password" id="finance-kraken-bridge-token" maxlength="128" autocomplete="off" placeholder="Im Terminal angezeigten Code eingeben"/></label><button type="button" class="primary-btn" data-action="finance-kraken-bridge-sync" ${ui.busy?'disabled':''}>${ui.busy?'Synchronisiere …':'Jetzt lokal synchronisieren'}</button></div>
 <label class="fin-bridge-auto"><input type="checkbox" id="finance-kraken-auto-sync" ${ui.auto?'checked':''}/> Beim offenen, entsperrten Portfolio automatisch aktualisieren (höchstens alle 12 Stunden, nur wenn der lokale Connector läuft)</label>
 <p class="fin-disclaimer">Keine Zugangsdaten im Browser oder Cloudflare. Der Kopplungscode bleibt nur bis zum Schließen dieser Compass-Sitzung im Arbeitsspeicher. Für automatische Aktualisierung muss der lokale Connector gestartet und gekoppelt sein. Die alternative JSON-Datei bleibt weiter nutzbar.</p></div>
 <div class="v22-public-prices"><div><strong>Aktuelle EUR-Marktpreise · direkt von Kraken</strong><small>Öffentlicher Ticker via Browser-WebSocket. Keine Zugangsdaten erforderlich. Nur verfügbare EUR-Paare werden bewertet; Kontobestände stammen aus dem letzten Import.</small></div><button type="button" class="secondary-btn" data-action="finance-kraken-public-quotes" ${ui.busy||!usable?'disabled':''}>EUR-Marktwert jetzt aktualisieren</button><label><input type="checkbox" id="finance-kraken-public-auto" data-action="finance-kraken-public-auto" ${ui.publicAuto?'checked':''} ${!usable?'disabled':''}/> Automatisch beim Öffnen und etwa alle 15 Minuten aktualisieren</label></div>
 <button type="button" class="secondary-btn" data-action="finance-kraken-refresh-quotes" ${ui.busy||!usable?'disabled':''}>EUR-Kurse der importierten Coins aktualisieren</button><p class="fin-disclaimer">Öffentliche Kraken-Marktkurse via lokalem Connector; keine erneute Trade-Abfrage. Bei alten Balance-Daten wird ausdrücklich nur der alte Bestand mit neuen Kursen bewertet.</p>
 <label class="secondary-btn fin-kraken-upload">Kraken-API-Export auswählen<input type="file" id="finance-kraken-file" accept=".json,application/json" /></label>
 ${preview?`<div class="fin-preview-result"><strong>Importvorschau: ${Object.keys(preview.balances).length} Währungen · ${preview.ledgers.length} Ledger-Einträge · ${preview.trades.length} Trades</strong><p>Stand ${esc(fmtTime(preview.generatedAt))}${preview.partial?' · API-Historie unvollständig':''}. Vorhandene Einträge mit gleicher Kraken-ID werden nicht verdoppelt.</p><button type="button" class="primary-btn" data-action="finance-kraken-confirm">Kraken-Daten übernehmen</button> <button type="button" class="secondary-btn" data-action="finance-kraken-cancel">Abbrechen</button></div>`:''}
 ${usable?`<div class="fin-kpi-grid"><article class="fin-kpi"><small>Währungen mit Bestand</small><strong>${assets.length}</strong><span>Kraken Spot</span></article><article class="fin-kpi"><small>Ledger-Einträge</small><strong>${usable.ledgers.length}</strong><span>${deposits.length} Einzahlungen · ${withdrawals.length} Auszahlungen</span></article><article class="fin-kpi"><small>Trades</small><strong>${usable.trades.length}</strong><span>Abgeschlossene Trades</span></article><article class="fin-kpi"><small>Datenstand</small><strong>${esc(fmtTime(usable.generatedAt).slice(0,10))}</strong><span>${usable.partial?'Historie teilweise geladen':'Vom lokalen Exporthelfer'}</span></article></div>
 <div class="fin-kraken-balances"><h4>Bestände nach Währung</h4>${assets.length?`<div class="fin-category-list">${assets.map(([asset,amount])=>`<div><strong>${esc(asset)}</strong><span>${esc(amount)}</span></div>`).join('')}</div>`:'<p>Keine positiven Spot-Bestände im letzten Snapshot.</p>'}</div>
 <details class="fin-kraken-ledgers"><summary>Letzte Kraken-Ledger-Einträge ansehen</summary>${usable.ledgers.slice(0,18).map(r=>`<div class="fin-kraken-entry"><span>${esc(new Date(r.time*1000).toLocaleDateString('de-AT'))} · ${esc(r.type)} · ${esc(r.asset)}</span><strong>${esc(r.amount)}</strong></div>`).join('')||'<p>Keine Ledger-Einträge vorhanden.</p>'}</details><button type="button" class="secondary-btn" data-action="finance-kraken-delete">Importierte Kraken-Daten lokal entfernen</button>`:'<p class="fin-kraken-empty">Noch keine Kraken-API-Daten importiert.</p>'}
 <p class="fin-disclaimer"><strong>Wichtig:</strong> Nicht bepreiste Bestände bleiben offen gekennzeichnet; automatische Marktkurse sind Momentaufnahmen. Einzahlungen sind keine Einnahmen; Trades sind keine Konsumausgaben. Bank-Überweisungen an Kraken bleiben getrennte Konto-/Anlagebewegungen, bis du sie ausdrücklich abstimmst. Kraken Spot ist nicht automatisch eine vollständige Abbildung von Earn, Staking, Futures oder externen Wallets.</p></section>`:''}`;
}
