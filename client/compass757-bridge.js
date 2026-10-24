/** Compass 0.5.77.57 – compact chrome, mobile touch capture, shopping-list first.
 * Applied after .56; guarded around the post-.56 markup.
 * Vault, transaction data, calendar and task handlers remain unchanged.
 */
export function compass757Bridge(){
 const replaceOne=(source,a,b,label)=>{
  const n=source.split(a).length-1;
  if(n!==1)throw new Error(`Compass .57 ${label}: expected 1 anchor, found ${n}`);
  return source.replace(a,b);
 };
 return {name:'compass-757-mobile-workflow',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;
  const change=(a,b,label)=>{s=replaceOne(s,a,b,label);};
  change("const COMPASS_CLIENT_VERSION='0.5.77.56';","const COMPASS_CLIENT_VERSION='0.5.77.57';",'version');
  change("import './gtd-workspace-v57756.css';", "import './gtd-workspace-v57756.css';\nimport './mobile-workflow-v57757.css';",'styles');

  // Move the existing .56 control, with all handlers and state intact. Desktop renders
  // in toolbar; mobile renders in brand row. CSS displays only the relevant instance.
  const modeStart='<div class="compass55-mode-switch compass56-mode-switch"';
  const modeA=s.indexOf(modeStart), modeEnd=modeA<0?-1:s.indexOf('</div>',modeA);
  if(modeA<0||modeEnd<0||s.indexOf(modeStart,modeA+modeStart.length)>=0)throw Error('Compass .57: Focus control not unique');
  const mode=s.slice(modeA,modeEnd+6);
  s=s.slice(0,modeA)+s.slice(modeEnd+6);
  const desktop='<div class="compass57-desktop-mode">'+mode+'</div>';
  const mobile='<div class="compass57-mobile-mode">'+mode+'</div>';
  change('<div class="utility-right">','<div class="utility-right">'+desktop,'toolbar mode');
  change('<nav class="side-nav calm-side-nav" aria-label="Hauptnavigation">',mobile+'\n <nav class="side-nav calm-side-nav" aria-label="Hauptnavigation">','mobile mode');

  // Keep the touch quick action in Focus; keep the user's old capture handler.
  // Only a CSS override is necessary: .55 hid the capture button unintentionally.

  // Create a genuinely separate optional statistics tab on Shopping. The list remains
  // default and the finance transaction array is only scanned after selecting tab 2.
  change('function shoppingScreen(){',
    'function shoppingScreen(){\n if(compass57ShoppingTab===\'stats\')return chrome(compass57ShopTabs()+compass57ShopStatistics());',
    'shopping view dispatch');
  change('return chrome(`<div class="shopping713-shell"><section class="work-card shopping713-overview">',
    'return chrome(`${compass57ShopTabs()}<div class="shopping713-shell"><section class="work-card shopping713-overview">',
    'shopping list top tabs');
  change('<h2>🛒 Meine Einkaufslisten</h2><p class="muted-line">Aus deiner bearbeitbaren Vorlage entsteht bei jedem Einkauf eine neue, unabhängige Checkliste.</p>',
    '<h2>🛒 Einkaufsliste</h2>', 'remove unnecessary list introduction');
  change('<span class="muted-line">Die Vorlage wird beim Abhaken nicht verändert.</span>',
    '', 'remove persistent explanatory copy');

  const helpers=String.raw`
let compass57ShoppingTab='list';
function compass57ShopTabs(){
 return '<div class="compass57-shopping-tabs" role="tablist" aria-label="Einkaufen"><button type="button" role="tab" aria-selected="'+(compass57ShoppingTab==='list')+'" class="'+(compass57ShoppingTab==='list'?'selected':'')+'" data-action="compass57-shop-tab" data-id="list">Einkaufsliste</button><button type="button" role="tab" aria-selected="'+(compass57ShoppingTab==='stats')+'" class="'+(compass57ShoppingTab==='stats'?'selected':'')+'" data-action="compass57-shop-tab" data-id="stats">Statistik & Rechnungsimport</button></div>';
}
function compass57ShopStatistics(){
 // A deliberately narrow statistic: only already classified grocery expenses.
 // Transfers, refunds, pending classifications and unrelated shopping categories
 // must never be attributed to a grocery trip. The list path never calls this.
 const month=localDate().slice(0,7),entries=[];
 for(const t of Array.isArray(state?.financeTransactions)?state.financeTransactions:[]){
  if(!t||t.needsReview||t.flow!=='expense'||!Number.isSafeInteger(t.amountCents)||t.amountCents>=0||!String(t.day||'').startsWith(month))continue;
  if(!/^(lebensmittel|supermarkt|eink[aä]ufe?)(?:\s|\/|$)/i.test(String(t.category||'')))continue;
  entries.push(t);
 }
 const cents=entries.reduce((sum,t)=>sum-t.amountCents,0);
 const euro=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
 const label=new Intl.DateTimeFormat('de-AT',{month:'long',year:'numeric'}).format(new Date(month+'-15T12:00:00'));
 return '<section class="work-card compass57-shopping-stats"><div class="work-heading"><span>Lebensmittel · '+h(label)+'</span></div><div class="compass57-stats-head"><strong>'+h(euro(cents))+'</strong><span>'+entries.length+' zugeordnete Buchungen</span></div>'+
  '<div class="compass57-stats-actions"><button type="button" class="primary-btn" data-action="smart49-open">'+ico('upload',16)+' Rechnung importieren</button><button type="button" class="secondary-btn" data-action="compass57-finance-details">Finanzen öffnen</button></div>'+
  '<small class="compass57-stats-note">Nur klassifizierte Lebensmittelausgaben. Fehlende, noch ungeklärte oder bar bezahlte Einkäufe können fehlen.</small></section>';
}
`;
  change('function render(){', "function render(){\n if(tab!=='shopping')compass57ShoppingTab='list';", 'reset shopping stats after leaving shopping');
  // Shopping handler declarations must be top-level. Define helpers adjacent to the
  // existing shopping route, where all referenced state and icon functions exist.
  change('function shoppingScreen(){',helpers+'\nfunction shoppingScreen(){','shopping model');
  change("if(action==='shopping713-select'){",
    "if(action==='compass57-shop-tab'){if(id==='list'||id==='stats'){compass57ShoppingTab=id;render();}return;}\n"+
    "    if(action==='compass57-finance-details'){compass55Mode='extended';try{localStorage.setItem(COMPASS55_MODE_KEY,'extended');}catch{}tab='finance';financePane='Überblick';calmNavGroup='finance';render();return;}\n"+
    "    if(action==='shopping713-select'){", 'shopping tab actions');
  return {code:s,map:null};
 }};
}
