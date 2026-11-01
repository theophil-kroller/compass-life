/** Compass 0.5.90: distinguish imported history from freshness of comparison windows. */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>Number.isFinite(x)?String(x).replace('.',','):'–';
export function coachHealthCoverage90(series,{kind='sleep'}={}){
 const s=series||{},recent=s.recentCount||0,ref=s.baselineCount||0,total=s.totalDays||0;
 const r=kind==='sleep'?s.recentMinutes:s.recentMs;
 const baseline=kind==='sleep'?s.baselineMinutes:s.baselineMs;
 const unit=kind==='sleep'?'min':'ms';
 const status=s.usable?'Vergleich möglich':recent<2?'Aktuelle Datenlücke':'Referenzfenster unvollständig';
 const main=s.usable?`${fmt(r)} / ${fmt(baseline)} ${unit}`:Number.isFinite(r)?`${fmt(r)} ${unit} · vorläufig`:total?`${total} historische Nächte`:'Keine Messungen';
 const comparison=s.usable?`${kind==='sleep'?'Δ '+fmt(s.deltaMinutes)+' min':'Δ '+fmt(s.deltaPct)+' %'} · ${recent} aktuelle Nächte`:
  `${recent}/2 Nächte in den letzten 3 Tagen · ${ref}/10 im Vergleichsfenster (Tag 3–45)`;
 const history=total?`${total} Tage im Garmin-Archiv · letzter Eintrag ${s.lastDay||'unbekannt'}`:'Keine auswertbaren Garmin-Nächte importiert';
 return {main,status,comparison,history,usable:Boolean(s.usable)};
}
export function coachHealthCoverageMarkup90(series,{kind='sleep'}={}){
 const v=coachHealthCoverage90(series,{kind});
 return `<strong style="display:block">${esc(v.main)}</strong><small>${esc(v.comparison)}</small>${!v.usable?`<small style="display:block;color:#6a7c75;margin-top:4px">${esc(v.status)} · ${esc(v.history)}</small>`:''}`;
}
