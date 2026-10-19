/** User-initiated, one-symbol Twelve Data market quote.
 * Credentials stay in form memory, never in URL, Compass Vault, logs, or Cloudflare Worker.
 * NEVER silently revalue an ISIN holding with a similarly named ticker.
 */
const VALID_SYMBOL=/^[A-Z0-9.^_\-/]+(?::[A-Z0-9._-]+)?$/;
export function validateQuoteSymbol(raw){
 const symbol=String(raw??'').trim().toUpperCase();
 if(symbol.length<1||symbol.length>40||!VALID_SYMBOL.test(symbol))throw Error('Bitte einen gültigen Börsenticker eingeben, z. B. VWRL:XETR oder AAPL. ISIN ist nicht automatisch ein Ticker.');
 return symbol;
}
export function parseMarketQuote(data,expected){
 if(!data||typeof data!=='object')throw Error('Kursdienst: ungültige Antwort.');
 if(data.status==='error'||data.code&&data.code>=400)throw Error(`Kursdienst: ${String(data.message||'Anfrage nicht möglich.').slice(0,150)}`);
 const price=Number(data.close??data.price),currency=String(data.currency||'').toUpperCase();
 if(!Number.isFinite(price)||price<=0||price>1e9||!/^[A-Z]{3}$/.test(currency))throw Error('Kein gültiger Kurs mit Währung zurückgeliefert. Für dieses Börsensymbol/den Tarif nicht verfügbar.');
 const sym=String(data.symbol||expected).toUpperCase();
 if(sym!==expected.toUpperCase()&&sym!==expected.toUpperCase().split(':')[0])throw Error('Der Kursanbieter hat ein anderes Wertpapier geliefert. Bitte Ticker prüfen.');
 return {symbol:expected,price,currency,asOf:String(data.datetime||'').slice(0,25)||'Zeitpunkt nicht mitgeliefert',name:String(data.name||expected).slice(0,90),source:'Twelve Data',retrievedAt:new Date().toISOString()};
}
export async function fetchTwelveDataQuote(symbol,key,{fetchFn=fetch}={}){
 const ticker=validateQuoteSymbol(symbol),apiKey=String(key||'').trim();
 if(apiKey.length<10||apiKey.length>160||!/^[\w-]+$/.test(apiKey))throw Error('Bitte einen gültigen Twelve-Data-API-Key eintragen.');
 const url=`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(ticker)}`;
 const response=await fetchFn(url,{method:'GET',headers:{Authorization:`apikey ${apiKey}`,Accept:'application/json'},credentials:'omit',cache:'no-store'});
 if(!response.ok)throw Error(`Kursdienst HTTP ${response.status}. Börse/Tarif, Kontingent oder Browser-CORS prüfen.`);
 return parseMarketQuote(await response.json(),ticker);
}
export function flatexPortfolioCashSummary(transactions=[]){
 const rows=transactions.filter(x=>x.accountId==='flatex:cash:EUR');
 const types={};for(const t of rows){const k=String(t.flatexKind||'unknown');types[k]=(types[k]||0)+1;}
 return {rows:rows.length,types,taxCents:rows.filter(t=>t.flatexKind==='fund-tax'||t.flatexKind==='tax').reduce((sum,t)=>sum+Math.abs(t.amountCents),0),from:rows.reduce((x,t)=>!x||t.day<x?t.day:x,''),to:rows.reduce((x,t)=>t.day>x?t.day:x,'')};
}
export function flatexPortfolioSection(transactions=[],quote=null){
 const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const s=flatexPortfolioCashSummary(transactions),money=x=>Number(x).toLocaleString('de-AT',{maximumFractionDigits:6});
 return `<section class="fin36-flatex-panel" aria-label="flatex Buchungen und Kurse"><div class="fin36-panel-head"><div><span class="insight-kicker">FLATEX / VERRECHNUNGSKONTO</span><h3>Depotbewegungen &amp; Marktkurse</h3><p>${s.rows} importierte Flatex-Buchungen · ${s.from?h(s.from+' – '+s.to):'noch kein CSV-Import'}</p></div><button type="button" class="secondary-btn" data-action="finance-open-import">flatex-CSV importieren</button></div>
 <div class="fin36-flatex-stats"><div><b>${s.types['trade-buy']||0}</b><small>Kauf-Ausführungen</small></div><div><b>${s.types['trade-settlement']||0}</b><small>Abrechnungsbuchungen</small></div><div><b>${s.types.distribution||0}</b><small>Ausschüttungen</small></div><div><b>${s.types['fund-tax']||0}</b><small>Fonds-Steuerbuchungen</small></div></div>
 <p class="fin-disclaimer">Die Flatex-Kontoumsätze zeigen Bewegungen, aber <strong>keine verlässlichen aktuellen Stückzahlen und keinen Depotbestand</strong>. Dafür bitte zusätzlich den Depotbestand exportieren oder unten eine datierte Position erfassen. Handelsabwicklung ist kein Konsum und kein Verkaufsertrag.</p>
 <details class="fin36-market-query"><summary>Marktkurs für ein Wertpapier abrufen · freiwillig</summary><p>Für aktuelle oder letzte verfügbare Kurse: <a href="https://twelvedata.com/pricing" target="_blank" rel="noopener noreferrer">Twelve Data</a>. Eigener API-Key erforderlich, nur während dieser einen Anfrage im Browser; keine Flatex-Zugangsdaten. Börsenticker statt ISIN verwenden. Nicht alle europäischen ETFs/Börsen sind im kostenlosen Tarif enthalten.</p>
 <form id="finance-quote-form" class="fin36-quote-form"><label>Börsenticker (ggf. Börse)<input type="text" name="symbol" required maxlength="40" placeholder="z. B. VWRL:XETR" autocomplete="off"/></label><label>Twelve-Data-API-Key<input type="password" name="key" required autocomplete="off" placeholder="Wird nicht gespeichert"/></label><button type="submit" class="primary-btn">Kurs abfragen</button></form>
 ${quote?`<div class="fin36-quote-result"><strong>${h(quote.name)} · ${h(quote.symbol)}</strong><span>${h(money(quote.price))} ${h(quote.currency)} je Einheit</span><small>Marktdaten: ${h(quote.source)} · Anbieter-Zeit: ${h(quote.asOf)} · abgefragt ${h(quote.retrievedAt.slice(0,16).replace('T',' '))} UTC. Keine automatische Portfolio-Bewertung oder Wechselkursumrechnung.</small></div>`:''}</details></section>`;
}
