import {renderTechnicalChart} from './kraken-technical-v40.js';
/** Public Kraken/EUR spot history: no private account balances, IDs, or credentials in requests.
 * Volatile and incomplete candle series are labelled, not extrapolated. */
import {publicEurSymbols} from './kraken-public-market-v22.js';
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=x=>Number(x).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:4});
const options=[['1d','1 Tag'],['7d','7 Tage'],['1m','1 Monat'],['3m','3 Monate'],['1y','1 Jahr'],['2y','2 Jahre']];
const extendedOptions=[['3y','3 Jahre'],['5y','5 Jahre'],['10y','10 Jahre'],['max','MAX']];
export function krakenAssetSymbol(asset){
 const keys=publicEurSymbols([asset]);const pair=Object.keys(keys)[0];return pair?pair.replace('/EUR',''):String(asset||'');
}
export function krakenHistoryRequest(asset,period='1m'){
 if(![...options,...extendedOptions].some(([id])=>id===period))throw Error('Ungültiger Kurszeitraum.');
 const symbol=krakenAssetSymbol(asset);
 if(!/^[A-Z0-9]{2,12}$/.test(symbol)||!Object.keys(publicEurSymbols([asset])).length)throw Error('Für diesen Coin ist kein unterstütztes Kraken-EUR-Paar bekannt.');
 if(extendedOptions.some(([id])=>id===period)){
  if(symbol!=='BTC')throw Error('Langfristige Historie derzeit nur für BTC/EUR verfügbar.');
  return {symbol,interval:period==='3y'?1440:10080,days:period==='max'?365*20:parseInt(period,10)*365,period,provider:'coinbase'};
 }
 const interval=period==='1d'?5:period==='7d'?60:['1y','2y'].includes(period)?1440:240;
 const days=({'1d':1,'7d':7,'1m':30,'3m':90,'1y':365,'2y':720})[period];
 return {symbol,interval,days,period};
}
export function krakenHistorySeries(payload,{days=30}={}){
 if(!payload||!Array.isArray(payload.candles))throw Error('Der Marktdatenanbieter hat keine gültigen historischen Kurse geliefert.');
 const now=Date.now();const min=now-days*86400_000;
 const points=payload.candles.map(c=>({time:Number(c.time)*1000,open:Number(c.open),high:Number(c.high),low:Number(c.low),close:Number(c.close),volume:Number(c.volume)}))
  .filter(c=>Number.isFinite(c.time)&&c.time<=now+86400_000&&c.time>=min&&[c.open,c.high,c.low,c.close].every(v=>Number.isFinite(v)&&v>0)&&c.low<=c.high&&c.close>=c.low*.9&&c.close<=c.high*1.1)
  .sort((a,b)=>a.time-b.time);
 const unique=[...new Map(points.map(c=>[c.time,c])).values()];
 if(unique.length<2)throw Error('Für diesen Zeitraum sind zu wenige Kursdaten vorhanden.');
 return unique;
}
const cache=new Map();
export async function fetchKrakenHistory(apiUrl,asset,period='1m',{fetchFn=fetch,now=Date.now()}={}){
 const params=krakenHistoryRequest(asset,period),key=params.symbol+'|'+period;
 const stored=cache.get(key);if(stored&&now-stored.at<(params.provider==='coinbase'?60*60_000:5*60_000))return stored.value;
 // Do not transmit assets held, balances, API credentials, or account IDs.
 const url=params.provider==='coinbase'
 ? String(apiUrl).replace(/\/$/,'')+'/api/market/bitcoin/history?symbol=BTC&period='+encodeURIComponent(period)
 : String(apiUrl).replace(/\/$/,'')+'/api/market/kraken/ohlc?symbol='+encodeURIComponent(params.symbol)+'&interval='+params.interval;
 const response=await fetchFn(url,{method:'GET',cache:params.provider==='coinbase'?'default':'no-store'});
 if(!response.ok)throw Error(response.status===404?'Für diesen Zeitraum sind bei der gewählten Börse keine Kursdaten verfügbar.':`Historischer Kursdienst nicht verfügbar (HTTP ${response.status}). Bitte Worker auf 0.5.40 aktualisieren.`);
 const json=await response.json();const rows=krakenHistorySeries(json,{days:params.days});
 const value={...params,candles:rows,asOf:json.asOf||null,source:json.source||(params.provider==='coinbase'?'Coinbase Exchange BTC/EUR':'Kraken Spot / EUR'),timeframe:json.timeframe||(params.provider==='coinbase'&&params.interval===10080?'week':'day'),bounded:params.period==='2y'};
 cache.set(key,{at:now,value});return value;
}
export function krakenPriceChartHtml(asset,period='1m',data=null,busy=false,error='',positions=[],settings={}){
 if(!asset)return '<p class="fin-disclaimer fin39-coin-help">Coin anklicken, um seinen historischen EUR-Kurschart anzuzeigen (ohne Kraken-Login).</p>';
 const p=positions.find(x=>x.asset===asset),label=krakenAssetSymbol(asset),available=label==='BTC'?[...options,...extendedOptions]:options,buttons=available.map(([id,title])=>`<button type="button" data-action="finance-kraken-chart-period" data-id="${id}" aria-pressed="${id===period}">${title}</button>`).join('');
 let content='';
 if(busy)content='<p class="fin-disclaimer" role="status">Lade historische BTC-/Krypto-EUR-Kurse …</p>';
 else if(error)content=`<p class="fin-disclaimer" role="alert">${h(error)}</p>`;
 else if(data?.candles?.length>1){
  const cs=data.candles,vals=cs.map(x=>x.close),lo=Math.min(...cs.map(c=>c.low)),hi=Math.max(...cs.map(c=>c.high)),first=vals[0],last=vals.at(-1),delta=(last/first-1)*100,up=delta>=0;
  const fd=t=>new Date(t).toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit',year:'numeric'});
  content=`<div class="fin39-price-stats"><span>Letzter Schlusskurs <strong>${h(eur(last))}</strong></span><span class="${up?'positive':'negative'}">${up?'+':''}${h(delta.toLocaleString('de-AT',{maximumFractionDigits:2}))} % im abgerufenen Zeitraum</span><span>Hoch ${h(eur(hi))} · Tief ${h(eur(lo))}</span></div>${renderTechnicalChart(cs,{...settings,timeframe:data.timeframe})}<p class="fin-disclaimer">${cs.length} öffentlich verfügbare Marktdatenkerzen · ${h(fd(cs[0].time))}–${h(fd(cs.at(-1).time))} · ${h(data.source)} · ${data.timeframe==='week'?'Wochenkerzen':'Tages-/Intraday-Kerzen'}. Der tatsächlich abgedeckte Zeitraum beginnt mit der ersten verfügbaren Kerze; es werden keine fehlenden Kurse ergänzt. ${period==='2y'?'Kraken begrenzt die Historie auf 720 Kerzen; ein voller Zwei-Jahres-Zeitraum ist nicht garantiert.':''}</p>`;
 }else content='<p class="fin-disclaimer">Historische Kursdaten werden nach Auswahl eines Coins geladen.</p>';
 return `<article class="fin39-price-card" aria-label="Historischer ${h(label)}-Kurs"><div class="fin39-price-head"><div><small class="insight-kicker">MARKTDATEN / EUR-KURSHISTORIE</small><h4>${h(label)} · Kurschart</h4><small>${p?h(Number(p.amount).toLocaleString('de-AT',{maximumFractionDigits:12}))+' Einheiten im importierten Snapshot · ':''}Kursverlauf ≠ historische Entwicklung des persönlichen Bestandes</small></div><div class="fin39-periods">${buttons}</div></div>${content}</article>`;
}
