/** Compass 0.5.53 – Personal worktime, independently computed from daily Excel cells.
 * The workbook uses cached formula values; do not use its graphical monthly formulas.
 * Hours and overtime balance are hours (not Excel day fractions); start/end are fractions of a day.
 */
const ESC=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MONTHS={jan:1,jaen:1,jänner:1,feb:2,mar:3,maer:3,mär:3,mrz:3,apr:4,mai:5,may:5,jun:6,juni:6,jul:7,juli:7,aug:8,sep:9,sept:9,okt:10,oct:10,nov:11,dez:12,dec:12};
const isoDay=(y,m,d)=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const num=v=>typeof v==='number'&&Number.isFinite(v)?v:null;
const fromCell=(row,col)=>num(row?.[col]);
const shiftDay=(date,offset)=>new Date(Date.parse(date+'T12:00:00Z')+offset*86400000).toISOString().slice(0,10);
export const workHM=hours=>Number.isFinite(hours)?`${Math.floor(Math.abs(Math.round(hours*60))/60)} h ${String(Math.abs(Math.round(hours*60))%60).padStart(2,'0')} min${hours<0?' (Minus)':''}`:'–';
export function parseWorktimeWorkbook(book,{today=new Date().toLocaleDateString('sv-SE'),nowMinutes=new Date().getHours()*60+new Date().getMinutes()}={}){
 const days=[],issues=[],sheets=[];
 for(const [name,grid] of Object.entries(book||{})){
  const match=/^(20\d{2})_([\p{L}]+)$/u.exec(name);if(!match)continue;
  const year=Number(match[1]),month=MONTHS[match[2].toLocaleLowerCase('de-AT')];
  if(!month){issues.push(`${name}: Monat nicht erkannt`);continue;}
  const lastDay=new Date(Date.UTC(year,month,0)).getUTCDate();let n=0;
  // B=day 1; spreadsheet row 27=actual hours; row 30=official running overtime balance;
  // row 24=ZA, row 25=vacation. Row 8 in the template has stale cached 2017 values,
  // so date is derived from the sheet title and the column position, NOT row 8.
  for(let d=1;d<=lastDay;d++){
   const date=isoDay(year,month,d);if(date>today)continue;
   const col=d;
   const start=fromCell(grid[9],col),end=fromCell(grid[12],col);
   const actual=fromCell(grid[26],col),balance=fromCell(grid[29],col);
   const za=fromCell(grid[23],col)||0,vacation=fromCell(grid[24],col)||0;
   if(date===today && (end===null||Math.round(end*1440)>nowMinutes))continue;
   if(actual===null&&start===null&&end===null&&!za&&!vacation)continue;
   // Ignore formula-only blank future-style days; no work or leave was recorded.
   if(actual===0&&start===null&&end===null&&!za&&!vacation)continue;
   const hours=actual!==null&&actual>=0&&actual<24?actual:(start!==null&&end!==null&&end>=start?(end-start)*24:0);
   days.push({day:date,hours:+hours.toFixed(5),overtimeBalance:balance,zaHours:za>0?za:0,vacationDays:vacation>0?vacation:0,
    start:start!==null?Math.round(start*1440):null,end:end!==null?Math.round(end*1440):null});n++;
  }
  sheets.push({name,days:n});
 }
 days.sort((a,b)=>a.day.localeCompare(b.day));
 const latestBalance=[...days].reverse().find(d=>Number.isFinite(d.overtimeBalance));
 return {days,sheets,issues,lastRecorded:days.at(-1)?.day||null,lastBalance:latestBalance?{day:latestBalance.day,hours:latestBalance.overtimeBalance}:null};
}
export async function inspectWorktimeFile(file,options={}){
 if(!/\.xlsx$/i.test(file?.name||''))throw Error('Bitte eine Excel-Datei (.xlsx) auswählen.');
 if(file.size>15_000_000)throw Error('Excel-Datei über 15 MB – bitte kleinere Datei verwenden.');
 const XLSX=await import('xlsx');const bytes=await file.arrayBuffer();
 const book=XLSX.read(bytes,{type:'array',cellDates:false});
 const sheets={};for(const name of book.SheetNames){if(!/^20\d{2}_/u.test(name))continue;sheets[name]=XLSX.utils.sheet_to_json(book.Sheets[name],{header:1,raw:true,defval:null,blankrows:true,range:0});}
 const result=parseWorktimeWorkbook(sheets,options);
 if(!result.sheets.length)throw Error('Keine Monatsblätter (z. B. 2026_Okt) gefunden.');
 return result;
}
export function mergeWorktime(previous={},parsed={}){
 const map=new Map((previous.days||[]).map(x=>[x.day,x]));
 for(const x of parsed.days||[])map.set(x.day,x);
 const days=[...map.values()].sort((a,b)=>a.day.localeCompare(b.day));
 // Never overwrite a newer verified balance with a historical imported book.
 const lastBalance=[...days].reverse().find(x=>Number.isFinite(x.overtimeBalance));
 return {...previous,days,lastBalance:lastBalance?{day:lastBalance.day,hours:lastBalance.overtimeBalance}:null,
  lastImportedAt:new Date().toISOString(),sheets:parsed.sheets||[]};
}
export function remainingVacation(work={},today=new Date().toLocaleDateString('sv-SE')){
 const v=work.vacation||{};if(!Number.isFinite(v.balanceHours)||!v.asOf)return null;
 const h=v.hoursPerDay||8;
 const used=(work.days||[]).filter(d=>d.day>v.asOf&&d.day<=today).reduce((s,d)=>s+(d.vacationDays||0)*h,0);
 return {hours:v.balanceHours-used,days:(v.balanceHours-used)/h,used,asOf:v.asOf};
}
const weekStart=d=>shiftDay(d,-((new Date(`${d}T12:00:00Z`).getUTCDay()+6)%7));
export function worktimeWeeks(days=[],year=new Date().getFullYear()){
 const groups=new Map();for(const r of days){if(!r?.day||r.day.slice(0,4)!==String(year)||!Number.isFinite(r.hours))continue;
  const start=weekStart(r.day);if(!groups.has(start))groups.set(start,[]);groups.get(start).push(r);}
 return [...groups].sort((a,b)=>a[0].localeCompare(b[0])).map(([start,entries])=>({start,end:shiftDay(start,6),hours:entries.reduce((s,d)=>s+d.hours,0),days:entries.length}));
}
export function worktimeMonths(days=[],year=new Date().getFullYear()){
 return Array.from({length:12},(_,i)=>{const key=`${year}-${String(i+1).padStart(2,'0')}`;const rows=days.filter(d=>d.day?.startsWith(key));return {key,hours:rows.reduce((s,d)=>s+(d.hours||0),0),days:rows.length};});
}
const summary=(rows,threshold)=>{
 const overload=rows.filter(x=>x.hours>threshold);
 return `${overload.length} von ${rows.length} erfassten Kalenderwochen liegen über ${threshold} h; das ist eine Beschreibung der Einträge, kein medizinischer Belastungstest.`;
};
export function worktimeView(work={},year=new Date().getFullYear(),threshold=45,preview=null,today=new Date().toLocaleDateString('sv-SE')){
 const days=work.days||[],weeks=worktimeWeeks(days,year),months=worktimeMonths(days,year),vac=remainingVacation(work,today),last=work.lastBalance;
 const hours=weeks.reduce((s,d)=>s+d.hours,0),max=Math.max(65,...weeks.map(w=>w.hours));
 const W=920,H=184,L=28,R=12,T=12,B=25;const ww=W-L-R,hh=H-T-B;
 const x=i=>L+(i+.5)/Math.max(1,weeks.length)*ww,y=v=>T+hh-v/max*hh;
 const bars=weeks.map((w,i)=>`<rect x="${x(i)-Math.max(3,ww/weeks.length*.34)}" y="${y(w.hours)}" width="${Math.max(5,ww/weeks.length*.68)}" height="${T+hh-y(w.hours)}" rx="2" fill="${w.hours>threshold?'#BB6F5C':'#73A996'}"><title>${ESC(w.start)} · ${workHM(w.hours)}</title></rect>`).join('');
 const trends=weeks.map((w,i)=>{const prior=weeks.slice(Math.max(0,i-3),i+1);if(prior.length<3)return null;return [x(i),y(prior.reduce((s,z)=>s+z.hours,0)/prior.length)];}).filter(Boolean);
 const trend=trends.length>1?`<polyline fill="none" stroke="#365F8B" stroke-width="2.5" stroke-linejoin="round" points="${trends.map(q=>q.join(',')).join(' ')}"/>`:'';
 const grid=[0,20,40,60].map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#E4EDE9"/><text x="${L-6}" y="${y(v)+3}" font-size="10" fill="#819B8C" text-anchor="end">${v}</text>`).join('');
 return `<section class="work553" aria-label="Arbeitszeit-Analyse"><div class="work553-top"><div><small>ARBEITSZEIT</small><h3>Arbeitszeit & Guthaben</h3></div><div class="work553-year"><button data-action="worktime-year" data-id="${year-1}" aria-label="Vorjahr">←</button><strong>${year}</strong><button data-action="worktime-year" data-id="${year+1}" aria-label="Folgejahr">→</button></div></div>
 <div class="work553-kpis"><div><span>Überzeitguthaben</span><strong>${workHM(last?.hours)}</strong><small>${last?.day?'Stand '+ESC(last.day):'Excel noch nicht importiert'}</small></div><div><span>Resturlaub</span><strong>${vac?`${Number(vac.days.toFixed(2)).toLocaleString('de-AT')} Tage`:'–'}</strong><small>${vac?workHM(vac.hours)+' · Basis '+ESC(vac.asOf):'Bitte Ausgangsguthaben eintragen'}</small></div><div><span>Arbeitsstunden ${year}</span><strong>${workHM(hours)}</strong><small>${weeks.length} Wochen mit Einträgen</small></div></div>
 <div class="work553-panel"><div class="work553-head"><h3>Wochenbelastung</h3><label>Markierung ab <select id="work553-threshold">${[35,40,45,50,55].map(v=>`<option value="${v}" ${threshold===v?'selected':''}>${v} h</option>`).join('')}</select></label></div>${weeks.length?`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Wochenstunden ${year}; orange über dem gewählten Schwellenwert; blaue Linie ist der gleitende Vier-Wochen-Durchschnitt">${grid}<line x1="${L}" x2="${W-R}" y1="${y(threshold)}" y2="${y(threshold)}" stroke="#BB6F5C" stroke-dasharray="5 4" opacity=".7"/>${bars}${trend}<text x="${L}" y="${H-5}" fill="#819B8C" font-size="10">Jänner</text><text x="${W-R}" y="${H-5}" fill="#819B8C" text-anchor="end" font-size="10">Dezember</text></svg><p class="work553-summary">${ESC(summary(weeks,threshold))}</p>`:'<p class="muted-line">Keine abgeschlossenen Arbeitszeiteinträge für dieses Jahr.</p>'}<div class="work553-legend"><span><i class="work553-regular"></i> Wochenstunden</span><span><i class="work553-high"></i> Über Grenzwert</span><span><i class="work553-trend"></i> 4-Wochen-Trend</span></div></div>
 <details class="work553-panel"><summary>Monatsvergleich & Arbeitszeitkonten</summary><div class="work553-months">${months.map((m,i)=>`<div><span>${['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][i]}</span><strong>${m.days?workHM(m.hours):'–'}</strong></div>`).join('')}</div><p class="muted-line">Zeitkonto und Wochenbelastung werden getrennt ausgewertet: Der bestätigte Excel-Saldo wird nicht aus den Diagrammbalken neu berechnet.</p></details>
 <details class="work553-panel" ${!days.length?'open':''}><summary>Excel-Zeiterfassung importieren & Urlaubsguthaben einstellen</summary><p class="muted-line">Monatsblätter wie 2026_Okt. Nur Tage bis heute, heute nur abgeschlossene Zeiten. Vorbereitete Zukunftsmonate, Diagramm-Formeln und leere Tage werden ausgeschlossen. Beim erneuten Import werden Tage aktualisiert, nicht dupliziert.</p><input id="work553-file" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
 ${preview?`<div class="work553-preview"><strong>${preview.days.length} Tagesbuchungen aus ${preview.sheets.length} Monatsblättern</strong><p>${preview.days[0]?.day||'–'} bis ${preview.lastRecorded||'–'} · Überzeit laut Excel: ${workHM(preview.lastBalance?.hours)} (${preview.lastBalance?.day||'–'})</p>${preview.issues.length?`<small>${ESC(preview.issues.slice(0,4).join('; '))}</small>`:''}<button class="primary-btn" data-action="worktime-confirm">Geprüfte Daten übernehmen</button></div>`:''}
 <form id="work553-vacation-form"><label>Urlaubsguthaben (Stunden) zum Stichtag <input name="balanceHours" type="number" min="0" max="10000" step="0.5" value="${Number.isFinite(work.vacation?.balanceHours)?work.vacation.balanceHours:192}" required></label><label>Stichtag <input name="asOf" type="date" value="${ESC(work.vacation?.asOf||'2026-10-20')}" required></label><button class="secondary-btn" type="submit">Guthaben speichern</button></form></details><p class="muted-line">Die Stunden stammen aus deiner Excel-Zeiterfassung. Sie ersetzen keine tatsächliche Belastungsmessung; Zusammenhänge mit Schlaf und Erholung benötigen getrennte, zeitlich passende Daten.</p></section>`;
}
