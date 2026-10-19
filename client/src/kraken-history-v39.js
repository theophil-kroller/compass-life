/** Public Kraken/EUR spot history: no private account balances, IDs, or credentials in requests.
 * Volatile and incomplete candle series are labelled, not extrapolated. */
import {publicEurSymbols} from './kraken-public-market-v22.js';
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=x=>Number(x).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:4});
const options=[['1d','1 Tag'],['7d','7 Tage'],['1m','1 Monat'],['3m','3 Monate'],['1y','1 Jahr'],['2y','2 Jahre']];
export function krakenAssetSymbol(asset){
 const keys=publicEurSymbols([asset]);const pair=Object.keys(keys)[0];return pair?pair.replace('/EUR',''):String(asset||'');
}
export function krakenHistoryRequest(asset,period='1m'){
 if(!options.some(([id])=>id===period))throw Error('Ungültiger Kurszeitraum.');
 const symbol=krakenAssetSymbol(asset);
 if(!/^[A-Z0-9]{2,12}$/.test(symbol)||!Object.keys(publicEurSymbols([asset])).length)throw Error('Für diesen Coin ist kein unterstütztes Kraken-EUR-Paar bekannt.');
 const interval=period==='1d'?5:period==='7d'?60:['1y','2y'].includes(period)?1440:240;
 const days=({'1d':1,'7d':7,'1m':30,'3m':90,'1y':365,'2y':720})[period];
 return {symbol,interval,days,period};
}
export function krakenHistorySeries(payload,{days=30}={}){
 if(!payload||!Array.isArray(payload.candles))throw Error('Kraken hat keine gültigen historischen Kurse geliefert.');
 const now=Date.now();const min=now-days*86400_000;
 const points=payload.candles.map(c=>({time:Number(c.time)*1000,open:Number(c.open),high:Number(c.high),low:Number(c.low),close:Number(c.close),volume:Number(c.volume)}))
  .filter(c=>Number.isFinite(c.time)&&c.time<=now+86400_000&&c.time>=min&&[c.open,c.high,c.low,c.close].every(v=>Number.isFinite(v)&&v>0)&&c.low<=c.high&&c.close>=c.low*.9&&c.close<=c.high*1.1)
  .sort((a,b)=>a.time-b.time);
 const unique=[...new Map(points.map(c=>[c.time,c])).values()];
 if(unique.length<2)throw Error('Für diesen Zeitraum sind zu wenige Kraken-Kursdaten vorhanden.');
 return unique;
}
const cache=new Map();
export async function fetchKrakenHistory(apiUrl,asset,period='1m',{fetchFn=fetch,now=Date.now()}={}){
 const params=krakenHistoryRequest(asset,period),key=params.symbol+'|'+period;
 const stored=cache.get(key);if(stored&&now-stored.at<5*60_000)return stored.value;
 // Do not transmit assets held, balances, API credentials, or account IDs.
 const url=String(apiUrl).replace(/\/$/,'')+'/api/market/kraken/ohlc?symbol='+encodeURIComponent(params.symbol)+'&interval='+params.interval;
 const response=await fetchFn(url,{method:'GET',cache:'no-store'});
 if(!response.ok)throw Error(response.status===404?'Der Kursdienst unterstützt diesen Coin nicht.':`Kraken-Kursdienst nicht verfügbar (HTTP ${response.status}). Worker auf 0.5.39 aktualisieren.`);
 const json=await response.json();const rows=krakenHistorySeries(json,{days:params.days});
 const value={...params,candles:rows,asOf:json.asOf||null,source:'Kraken Spot / EUR',bounded:params.period==='2y'};
 cache.set(key,{at:now,value});return value;
}
export function krakenPriceChartHtml(asset,period='1m',data=null,busy=false,error='',positions=[]){
 if(!asset)return '<p class="fin-disclaimer fin39-coin-help">Coin anklicken, um seinen historischen EUR-Kurschart anzuzeigen (ohne Kraken-Login).</p>';
 const p=positions.find(x=>x.asset===asset),label=krakenAssetSymbol(asset),buttons=options.map(([id,title])=>`<button type="button" data-action="finance-kraken-chart-period" data-id="${id}" aria-pressed="${id===period}">${title}</button>`).join('');
 let content='';
 if(busy)content='<p class="fin-disclaimer" role="status">Lade historische Kraken-EUR-Kurse …</p>';
 else if(error)content=`<p class="fin-disclaimer" role="alert">${h(error)}</p>`;
 else if(data?.candles?.length>1){
  const cs=data.candles,vals=cs.map(x=>x.close),lo=Math.min(...vals),hi=Math.max(...vals),range=Math.max(hi-lo,0.00000001);const first=vals[0],last=vals.at(-1),delta=(last/first-1)*100,up=delta>=0;
  const x0=52,y0=26,W=870,H=265;
  const dates=cs.map(c=>c.time),start=dates[0],end=dates.at(-1),span=Math.max(1,end-start);
  const xy=cs.map(c=>[x0+(c.time-start)/span*W,y0+(hi-c.close)/range*(H-y0)]);
  const line=xy.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const fill=line+` L${(x0+W).toFixed(1)},${H+7} L${x0},${H+7} Z`;
  const color=up?'#188976':'#bd6161';const fd=t=>new Date(t).toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit',year:'numeric'});
  content=`<div class="fin39-price-stats"><span>Letzter Schlusskurs <strong>${h(eur(last))}</strong></span><span class="${up?'positive':'negative'}">${up?'+':''}${h(delta.toLocaleString('de-AT',{maximumFractionDigits:2}))} % im dargestellten Zeitraum</span><span>Hoch ${h(eur(hi))} · Tief ${h(eur(lo))}</span></div><svg class="fin39-price-svg" viewBox="0 0 970 340" role="img" aria-label="${h(label)} EUR-Kursentwicklung, ${cs.length} Kraken-Kerzen"><defs><linearGradient id="fin39-price-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".21"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><line x1="${x0}" y1="${H+7}" x2="${x0+W}" y2="${H+7}" stroke="#d5e0da"/><text x="${x0}" y="15" font-size="12" fill="currentColor">${h(eur(hi))}</text><text x="${x0}" y="${H+27}" font-size="12" fill="currentColor">${h(fd(start))}</text><text x="${x0+W}" y="${H+27}" font-size="12" text-anchor="end" fill="currentColor">${h(fd(end))}</text><path d="${fill}" fill="url(#fin39-price-fill)"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>${xy.filter((_,i)=>i%Math.max(1,Math.ceil(xy.length/15))===0).map(([x,y],i)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${color}"><title>${h(fd(cs[Math.min(cs.length-1,i*Math.max(1,Math.ceil(xy.length/15)))].time))}</title></circle>`).join('')}</svg><p class="fin-disclaimer">${cs.length} öffentlich verfügbare Kraken-Kerzen · ${h(fd(start))}–${h(fd(end))} · ${h(data.source)}. Letzte Kerze kann noch unvollständig sein. ${period==='2y'?'Kraken begrenzt die Historie auf 720 Kerzen; ein voller Zwei-Jahres-Zeitraum ist nicht garantiert.':''}</p>`;
 }else content='<p class="fin-disclaimer">Historische Kursdaten werden nach Auswahl eines Coins geladen.</p>';
 return `<article class="fin39-price-card" aria-label="Historischer ${h(label)}-Kurs"><div class="fin39-price-head"><div><small class="insight-kicker">KRAKEN / EUR-KURSHISTORIE</small><h4>${h(label)} · Kurschart</h4><small>${p?h(Number(p.amount).toLocaleString('de-AT',{maximumFractionDigits:12}))+' Einheiten im importierten Snapshot · ':''}Kursverlauf ≠ historische Entwicklung des persönlichen Bestandes</small></div><div class="fin39-periods">${buttons}</div></div>${content}</article>`;
}
