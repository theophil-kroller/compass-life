/** Kraken public ticker via browser WebSocket v2. No key, balance, or personal data sent.
 * Only symbols explicitly requested by user; unsupported assets remain unpriced.
 */
const ASSET_MAP={XXBT:'BTC',XBT:'BTC',BTC:'BTC',XETH:'ETH',ETH:'ETH',XXDG:'DOGE',XDG:'DOGE',DOGE:'DOGE',XXRP:'XRP',XRP:'XRP',XXLM:'XLM',XLM:'XLM',ZEUR:'EUR',EUR:'EUR'};
const KNOWN=new Set(['BTC','ETH','ADA','DOT','SOL','USDC','USDT','DOGE','XLM','XRP','LTC','AVAX','LINK','ATOM','TRX','AAVE','UNI','ALGO','XTZ','BCH','ETC','SUI','SHIB','PEPE','NEAR','FIL']);
export function publicEurSymbols(assets){
 const map={};for(const asset of assets){
  if(typeof asset!=='string'||!/^[A-Za-z0-9.]{1,35}$/.test(asset))continue;
  const bare=asset.toUpperCase().split('.')[0],name=ASSET_MAP[bare]||bare;
  if(KNOWN.has(name)){const pair=name+'/EUR';(map[pair]??=[]).push(asset);}
 }
 return map;
}
export function parsePublicTicker(obj,symbols){
 const result={};if(obj?.channel!=='ticker'||!Array.isArray(obj?.data))return result;
 for(const row of obj.data){
  const originals=symbols[row?.symbol];const price=Number(row?.last);
  if(!originals||!Number.isFinite(price)||price<=0||price>1e9)continue;
  for(const asset of originals)result[asset]=String(price);
 }
 return result;
}
export function fetchPublicEurQuotes(assets,{WebSocketClass=globalThis.WebSocket,timeoutMs=12000}={}){
 const pairs=publicEurSymbols(assets),symbols=Object.keys(pairs);
 if(!symbols.length)return Promise.resolve({quotesEur:{},pricedAt:null,requested:0});
 if(!WebSocketClass)return Promise.reject(Error('Browser unterstützt keine Live-Kursverbindung.'));
 return new Promise((resolve,reject)=>{
  const ws=new WebSocketClass('wss://ws.kraken.com/v2');let done=false;
  const quotes={};let received=false;
  const finish=(err)=>{if(done)return;done=true;clearTimeout(timer);try{ws.close();}catch{};
   if(err&&!received)reject(err);else resolve({quotesEur:quotes,pricedAt:received?new Date().toISOString():null,requested:symbols.length});};
  const timer=setTimeout(()=>finish(Error('Öffentliche Kraken-Kurse derzeit nicht erreichbar.')),Math.max(1500,Math.min(20000,timeoutMs)));
  ws.onopen=()=>{ws.send(JSON.stringify({method:'subscribe',params:{channel:'ticker',symbol:symbols,snapshot:true}}));};
  ws.onmessage=event=>{try{
   const obj=JSON.parse(event.data);
   if(obj?.success===false&&obj?.method==='subscribe'){/* partial subscription failures allowed */return;}
   if(obj?.channel!=='ticker')return;
   received=true;Object.assign(quotes,parsePublicTicker(obj,pairs));
   if(symbols.every(k=>(pairs[k]||[]).every(asset=>Object.hasOwn(quotes,asset))))finish();
  }catch{/* Ignore unrelated malformed status records, retaining valid prices. */}};
  ws.onerror=()=>finish(Error('Kraken-WebSocket nicht erreichbar.'));
  ws.onclose=()=>{if(!done)finish(Error('Kraken-WebSocket wurde geschlossen.'));};
 });
}
