/** Read-only Kraken OHLC proxy for public market data only.
 * Never accepts API credentials, holdings, account addresses or arbitrary URLs. */
const ALLOWED=new Set(['BTC','ETH','ADA','DOT','SOL','USDC','USDT','DOGE','XLM','XRP','LTC','AVAX','LINK','ATOM','TRX','AAVE','UNI','ALGO','XTZ','BCH','ETC','SUI','SHIB','PEPE','NEAR','FIL']);
const INTERVALS=new Set(['5','15','60','240','1440','10080']);
export function krakenPublicParams(url){
 const u=new URL(url),symbol=(u.searchParams.get('symbol')||'').toUpperCase(),interval=u.searchParams.get('interval')||'240';
 if(!ALLOWED.has(symbol)||!INTERVALS.has(interval))throw Error('invalid-symbol-or-interval');
 return {symbol,interval,pair:(symbol==='BTC'?'XBT':symbol)+'EUR'};
}
export async function publicKrakenHistory(request,{fetchFn=fetch}={}){
 const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':status===200?'public, max-age=120':'no-store','x-content-type-options':'nosniff'}});
 let info;try{info=krakenPublicParams(request.url);}catch{return respond({error:'invalid-market'},400);}
 let remote;try{
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),7000);
  try{remote=await fetchFn('https://api.kraken.com/0/public/OHLC?pair='+encodeURIComponent(info.pair)+'&interval='+info.interval,{signal:controller.signal});}
  finally{clearTimeout(timeout);}
 }catch{return respond({error:'market-feed-unavailable'},503);}
 if(!remote.ok)return respond({error:'market-feed-unavailable'},502);
 let data;try{data=await remote.json();}catch{return respond({error:'invalid-market-response'},502);}
 if(!data||!Array.isArray(data.error)||data.error.length||!data.result||typeof data.result!=='object')return respond({error:'kraken-pair-not-supported'},404);
 const key=Object.keys(data.result).find(k=>k!=='last'&&Array.isArray(data.result[k]));
 if(!key)return respond({error:'kraken-pair-not-supported'},404);
 const candles=data.result[key].slice(-720).map(r=>({time:Number(r[0]),open:Number(r[1]),high:Number(r[2]),low:Number(r[3]),close:Number(r[4]),volume:Number(r[6])})).filter(r=>Number.isFinite(r.time)&&Number.isFinite(r.close)&&r.close>0);
 return respond({symbol:info.symbol,interval:Number(info.interval),asOf:new Date().toISOString(),candles});
}
