/** Voluntary historical instrument lookup via Twelve Data Basic.
 * ISIN identifies the local holding; user verifies actual exchange ticker.
 * API key is used only for the direct browser request and never persisted or logged.
 */
import {validateQuoteSymbol} from './finance-market-v36.js';
import {renderTechnicalChart} from './kraken-technical-v40.js';
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const FLATEX_PERIODS=Object.freeze([['1m','1 Monat'],['3m','3 Monate'],['1y','1 Jahr'],['2y','2 Jahre'],['3y','3 Jahre'],['5y','5 Jahre'],['10y','10 Jahre'],['max','MAX']]);
export function validateFlatexSeriesResponse(raw,ticker){
 if(!raw||typeof raw!=='object'||raw.status==='error'||raw.code&&Number(raw.code)>=400)throw Error('Twelve Data: '+String(raw?.message||'Kurse für diesen Ticker/Tarif nicht verfügbar.').slice(0,180));
 const meta=raw.meta||{},symbol=String(meta.symbol||'').toUpperCase();
 if(!symbol||symbol!==ticker.toUpperCase().split(':')[0]&&symbol!==ticker.toUpperCase())throw Error('Der Kursdienst meldet einen abweichenden Börsenticker. Bitte Wertpapier und Handelsplatz prüfen.');
 const currency=String(meta.currency||'').toUpperCase();
 if(!/^[A-Z]{3}$/.test(currency))throw Error('Twelve Data hat keine verlässliche Kurswährung geliefert.');
 const values=raw.values;
 if(!Array.isArray(values))throw Error('Keine historischen OHLC-Kurse verfügbar – möglicherweise unterstützt dein Basic-Tarif diese Börse nicht.');
 const bars=values.map(row=>{
   const stamp=String(row?.datetime||''),t=Date.parse(stamp.length===10?stamp+'T00:00:00Z':stamp+'Z');
   return {time:t,open:Number(row?.open),high:Number(row?.high),low:Number(row?.low),close:Number(row?.close),volume:row?.volume==null?0:Number(row.volume)};
 }).filter(b=>Number.isFinite(b.time)&&b.time>0&&b.low>0&&b.high>=b.low&&b.open>=b.low&&b.open<=b.high&&b.close>=b.low&&b.close<=b.high&&Number.isFinite(b.volume)&&b.volume>=0);
 const unique=[...new Map(bars.map(b=>[b.time,b])).values()].sort((a,b)=>a.time-b.time);
 if(unique.length<2)throw Error('Für diesen Ticker liegen weniger als zwei gültige Kerzen vor.');
 return {candles:unique,currency,source:'Twelve Data · '+String(meta.exchange||meta.mic_code||'Börse unbekannt').slice(0,50),ticker:symbol,exchange:String(meta.exchange||''),asOf:unique.at(-1).time,timeframe:'day'};
}
export async function fetchFlatexMarketHistory(ticker,key,period='1y',{fetchFn=fetch}={}){
 const symbol=validateQuoteSymbol(ticker),apiKey=String(key||'').trim();
 if(!/^[\w-]{10,160}$/.test(apiKey))throw Error('Bitte einen gültigen Twelve-Data-API-Key eingeben.');
 if(!FLATEX_PERIODS.some(([id])=>id===period))throw Error('Ungültiger Chart-Zeitraum.');
 // outputsize max 5000. Request same daily candles for technical indicators, even in short windows.
 const now=new Date(),end=now.toISOString().slice(0,10),days=period==='max'?null:({'1m':31,'3m':92,'1y':366,'2y':731,'3y':1096,'5y':1827,'10y':3654})[period];
 const params=new URLSearchParams({symbol,interval:'1day',outputsize:'5000',format:'JSON'});
 if(days){const d=new Date(now.getTime()-days*86400_000);params.set('start_date',d.toISOString().slice(0,10));params.set('end_date',end);params.delete('outputsize');}
 const url='https://api.twelvedata.com/time_series?'+params;
 let response;
 try{response=await fetchFn(url,{method:'GET',headers:{Accept:'application/json',Authorization:'apikey '+apiKey},credentials:'omit',cache:'no-store'});}catch{throw Error('Twelve Data ist aus diesem Browser nicht erreichbar (Netzwerk/CORS).');}
 if(!response.ok)throw Error('Twelve Data HTTP '+response.status+' – Börse, Basic-Tarif oder API-Limit prüfen.');
 return validateFlatexSeriesResponse(await response.json(),symbol);
}
export function flatexMarketChartHtml(positions=[],opts={}){
 const isin=String(opts.isin||''),p=positions.find(x=>x.isin===isin),active=Boolean(p);
 const choices=positions.filter(x=>x.kind!=='CASH');
 const header=`<div class="fin41-market-heading"><div><span class="insight-kicker">FLATEX / HISTORISCHE MARKTKURSE</span><h3>Wertpapier-Kursanalyse</h3><p>Wie bei Bitcoin: OHLC, Volumen, gleitende Durchschnitte und technische Indikatoren. Kursentwicklung ≠ persönliche Depotperformance.</p></div></div>`;
 const buttons=choices.map(x=>`<button type="button" class="fin41-position-button" data-action="finance-flatex-chart-select" data-id="${h(x.isin)}" aria-pressed="${x.isin===isin}">${h(x.name)}</button>`).join('');
 let content='<p class="fin-disclaimer">Wertpapier auswählen, um die historische Kursanalyse zu öffnen.</p>';
 if(active){
 const periods=FLATEX_PERIODS.map(([id,title])=>`<button type="button" data-action="finance-flatex-chart-period" data-id="${id}" aria-pressed="${id===(opts.period||'1y')}">${title}</button>`).join('');
 const form=`<form id="finance-flatex-chart-form" class="fin41-market-form"><label>Verifizierter Börsenticker (statt ISIN)<input name="symbol" value="${h(opts.ticker||'')}" autocomplete="off" maxlength="40" required placeholder="Ticker beim Kursanbieter suchen"/></label><label>Twelve-Data-API-Key (nur für diese Abfrage)<input type="password" name="key" autocomplete="off" required placeholder="Wird nicht gespeichert"/></label><button type="submit" class="primary-btn">Historische Kurse laden</button></form>`;
 let chart='<p class="fin-disclaimer">Gib einmal den tatsächlichen Börsenticker dieser Position und deinen Twelve-Data-Key ein. Nicht alle europäischen ETFs sind im Basic-Tarif enthalten. Der Schlüssel wird nicht gespeichert.</p>';
 if(opts.busy)chart='<p class="fin-disclaimer" role="status">Historische Börsenkurse werden geladen …</p>';
 else if(opts.error)chart=`<p class="fin-disclaimer" role="alert">${h(opts.error)}</p>`;
 else if(opts.data?.candles?.length>1){
  const d=opts.data,fmt=v=>Number(v).toLocaleString('de-AT',{style:'currency',currency:d.currency});
  chart=`<div class="fin41-quote-info"><strong>${h(d.ticker)} · ${h(d.exchange||'Handelsplatz prüfen')}</strong><span>Letzter verfügbarer Schlusskurs: ${h(fmt(d.candles.at(-1).close))}</span></div>${renderTechnicalChart(d.candles,{...opts.settings,currency:d.currency}).replaceAll('finance-kraken-chart-', 'finance-flatex-chart-')}<small class="fin-disclaimer">Quelle: ${h(d.source)} · Kurswährung ${h(d.currency)} · ${d.candles.length} historische Tageskerzen · letzter Handelstag ${h(new Date(d.candles.at(-1).time).toLocaleDateString('de-AT'))}. Kein Live-Depotwert, kein IRR und keine Renditeberechnung deiner Trades. Basisdaten können unbereinigt sein (Splits/Ausschüttungen).</small>`;
 }
 content=`<div class="fin41-active-title"><strong>${h(p.name)}</strong><small>ISIN: ${h(p.isin)} · ${h(p.quantity.toLocaleString('de-AT',{maximumFractionDigits:8}))} Stück im letzten importierten Snapshot (${h(p.day)})</small></div><div class="fin41-periods">${periods}</div>${form}${chart}`;
 }
 return `<section class="fin41-market-card" id="fin41-flatex-market">${header}${choices.length?`<div class="fin41-instruments">${buttons}</div>`:'<p class="fin-disclaimer">Bitte zunächst einen Flatex-Depotbestand importieren.</p>'}${content}</section>`;
}
