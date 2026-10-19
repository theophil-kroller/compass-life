/** Public, read-only multi-year BTC/EUR candles from Coinbase Exchange.
 * Kraken's OHLC endpoint is capped at 720 candles; Coinbase candles are requested
 * in explicitly bounded 299-day windows and never include private holdings.
 * Quote-source changes are always disclosed by the frontend.
 */
const DAY=86400_000;
const WINDOWS=Object.freeze({'3y':365*3,'5y':365*5,'10y':365*10,'max':null});
const MAX_START=Date.UTC(2015,0,1); // Before Coinbase BTC-EUR began; actual first trade decides MAX.
const WEEK=7*DAY;
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json; charset=utf-8','x-content-type-options':'nosniff','cache-control':status===200?'public, max-age=3600':'no-store'}});
export function bitcoinLongParams(url,now=Date.now()){
 const u=new URL(url),symbol=u.searchParams.get('symbol'),period=u.searchParams.get('period');
 if(symbol!=='BTC'||!Object.hasOwn(WINDOWS,period))throw Error('invalid-market');
 const end=Math.floor(now/DAY)*DAY+DAY;const start=WINDOWS[period]===null?MAX_START:end-WINDOWS[period]*DAY;
 return {symbol:'BTC',period,start,end,weekly:period==='5y'||period==='10y'||period==='max'};
}
/** Coinbase rows: [time, low, high, open, close, volume], newest first. */
export function parseCoinbaseBars(rows){
 if(!Array.isArray(rows))throw Error('invalid-upstream-bars');
 return rows.map(row=>({time:Number(row?.[0]),low:Number(row?.[1]),high:Number(row?.[2]),open:Number(row?.[3]),close:Number(row?.[4]),volume:Number(row?.[5])})).filter(c=>Number.isSafeInteger(c.time)&&c.time>0&&c.low>0&&c.high>=c.low&&c.open>=c.low&&c.open<=c.high&&c.close>=c.low&&c.close<=c.high&&Number.isFinite(c.volume)&&c.volume>=0);
}
/** Preserve actual weekly open/high/low/close and additive traded BTC volumes. */
export function aggregateWeekly(bars){
 const out=[];let key=null,prev;
 for(const b of bars){
  // ISO-style UTC Monday to Sunday. Calendar weeks, NOT arbitrary 7-day bins.
  const d=new Date(b.time*1000),daysFromMonday=(d.getUTCDay()+6)%7;
  const monday=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-daysFromMonday)/1000;
  if(monday!==key){key=monday;prev={...b,time:monday};out.push(prev);}
  else{prev.high=Math.max(prev.high,b.high);prev.low=Math.min(prev.low,b.low);prev.close=b.close;prev.volume+=b.volume;}
 }
 return out;
}
export async function publicBitcoinLongHistory(request,{fetchFn=fetch,now=Date.now()}={}){
 let p;try{p=bitcoinLongParams(request.url,now);}catch{return json({error:'invalid-market'},400);}
 // Each endpoint request spans at most 299 daily candles; provider limit is 300.
 const windows=[];for(let st=p.start;st<p.end;st+=299*DAY)windows.push([st,Math.min(p.end,st+299*DAY)]);
 if(windows.length>18)return json({error:'range-too-large'},400);
 const combined=[];
 try{
  for(let i=0;i<windows.length;i+=3){
   const part=await Promise.all(windows.slice(i,i+3).map(async ([start,end])=>{
    const u=new URL('https://api.exchange.coinbase.com/products/BTC-EUR/candles');
    u.searchParams.set('granularity','86400');u.searchParams.set('start',new Date(start).toISOString());u.searchParams.set('end',new Date(end).toISOString());
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),9500);
    try{
     const r=await fetchFn(u.toString(),{headers:{Accept:'application/json'},signal:controller.signal});
     if(!r.ok)throw Error('upstream:'+r.status);
     return parseCoinbaseBars(await r.json());
    }finally{clearTimeout(timer);}
   }));
   for(const batch of part)combined.push(...batch);
  }
 }catch{return json({error:'history-source-unavailable'},503);}
 const bars=[...new Map(combined.filter(b=>b.time*1000>=p.start&&b.time*1000<p.end).map(c=>[c.time,c])).values()].sort((a,b)=>a.time-b.time);
 if(bars.length<2)return json({error:'history-not-available'},404);
 const output=p.weekly?aggregateWeekly(bars):bars;
 return json({symbol:'BTC',period:p.period,interval:p.weekly?10080:1440,timeframe:p.weekly?'week':'day',source:'Coinbase Exchange BTC/EUR',asOf:new Date(now).toISOString(),candles:output});
}
