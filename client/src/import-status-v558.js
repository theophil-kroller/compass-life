/** Compass 0.5.58 · Last successful imports, separately from data coverage. No guessed dates. */
const iso=x=>{if(!x||!Number.isFinite(Date.parse(x)))return null;return new Date(x).toISOString();};
const latest=(arr,fields)=>Array.isArray(arr)?arr.reduce((best,x)=>{for(const f of fields){const v=typeof x?.[f]==='string'?x[f]:null;if(v&&/^\d{4}-\d{2}-\d{2}/.test(v)&&(!best||v>best))best=v;}return best;},null):null;
const dateOnly=x=>x&&/^\d{4}-\d{2}-\d{2}/.test(x)?x.slice(0,10):null;
const lastHistory=(entries,kind)=>{const rows=(Array.isArray(entries)?entries:[]).filter(x=>x?.kind===kind&&iso(x.at));return rows.reduce((v,x)=>!v||x.at>v?x.at:v,null);};
export function markSuccessfulImport(state,kind,at=new Date().toISOString()){
 if(!['bank','health','places','worktime','kraken','flatex','project'].includes(kind)||!iso(at))return;
 state.importAudit??={};state.importAudit[kind]=iso(at);
}
export function importStatuses(state={},today=new Date().toLocaleDateString('sv-SE')){
 const hist=state.smartImportHistory||[],a=state.importAudit||{},h=state.healthImports||{},w=state.workTime||{};
 const sources=[
  {id:'worktime',label:'Arbeitszeit-Excel',maxDays:14,at:iso(w.lastImportedAt)||iso(a.worktime)||lastHistory(hist,'worktime'),content:latest(w.days,['day']),count:(w.days||[]).length},
  {id:'health',label:'Garmin & Fitdays',maxDays:7,at:iso(h.lastImportAt)||iso(a.health)||lastHistory(hist,'health'),content:latest([...(h.garminNights||[]),...(h.fitdays||[]),...(h.garminSessions||[]),...(h.garminHrv||[])],['day','date','start','startTime','timestamp']),count:(h.garminNights||[]).length+(h.fitdays||[]).length+(h.garminSessions||[]).length},
  {id:'bank',label:'Bankbuchungen',maxDays:30,at:iso(a.bank)||lastHistory(hist,'bank'),content:latest(state.financeTransactions,['day','date','bookingDate']),count:(state.financeTransactions||[]).length},
  {id:'places',label:'Google Timeline',maxDays:90,at:iso(a.places)||lastHistory(hist,'places'),content:latest(state.placesVisits,['end','start','day']),count:(state.placesVisits||[]).length},
  {id:'flatex',label:'flatex-Depot',maxDays:60,at:iso(a.flatex)||lastHistory(hist,'flatex'),content:latest(state.financeFlatexSnapshots,['day','date','asOf']),count:(state.financeFlatexSnapshots||[]).length},
  {id:'kraken',label:'Kraken-Export',maxDays:60,at:iso(a.kraken)||lastHistory(hist,'kraken'),content:null,count:state.krakenPortfolio?1:0},
  {id:'project',label:'Projektpläne',maxDays:null,at:iso(a.project)||lastHistory(hist,'project'),content:null,count:(hist||[]).filter(x=>x?.kind==='project').length}
 ];
 return sources.map(x=>{
  const lastDate=dateOnly(x.content);const atDay=dateOnly(x.at);const ref=lastDate||atDay;
  const days=ref&&/^\d{4}-\d{2}-\d{2}$/.test(today)?Math.floor((Date.parse(today+'T12:00:00Z')-Date.parse(ref+'T12:00:00Z'))/86400000):null;
  const status=!x.at?(x.count?'undocumented':'never'):x.maxDays!=null&&days!=null&&days>x.maxDays?'check':'current';
  return {...x,content:lastDate,ageDays:days,status};
 });
}
export const importDateLabel=x=>{if(!x)return 'nicht protokolliert';const d=new Date(x);return Number.isFinite(+d)?d.toLocaleString('de-AT',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'nicht protokolliert';};
export const importStatusLabel=x=>({current:'Aktuell',check:'Aktualisierung prüfen',never:'Noch kein Import',undocumented:'Datum bisher nicht erfasst'})[x]||'–';
export function importStatusMarkup(state={},today){const rows=importStatuses(state,today),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<div class="import558-status" role="table" aria-label="Stand der Datenimporte"><div class="import558-head" role="row"><span>Datenquelle</span><span>Letzter Import</span><span>Daten bis</span><span>Status</span></div>${rows.map(x=>`<div class="import558-row" role="row"><strong>${esc(x.label)}</strong><span>${esc(x.at?importDateLabel(x.at):x.count?'Bisher nicht erfasst':'Noch keiner')}</span><span>${esc(x.content||'–')}</span><small class="import558-${esc(x.status)}">${esc(importStatusLabel(x.status))}</small></div>`).join('')}</div>`;
}
