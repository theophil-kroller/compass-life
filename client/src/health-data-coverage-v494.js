/** Compass 0.5.49.4 · Read-only health data/date coverage.
 * Never call a date 'complete': a measurement on that day does not establish
 * continuous Garmin recording. All checks are local and independent of import history.
 */
import {healthImportCoverage} from './health-import-diagnostics-v492.js';
const validDay=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shortDay=s=>s?new Date(s+'T12:00:00Z').toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}):'–';
const formatNumber=n=>Number(n||0).toLocaleString('de-AT');
function tzDay(iso,formatter){
 if(typeof iso!=='string'||!Number.isFinite(Date.parse(iso)))return '';
 try{const parts=Object.fromEntries(formatter.formatToParts(new Date(iso)).map(p=>[p.type,p.value]));return `${parts.year}-${parts.month}-${parts.day}`;}catch{return '';}
}
function summarize(set,count){const list=[...set].filter(validDay).sort();return {first:list[0]||'',last:list.at(-1)||'',days:list.length,count,dates:list};}
function getDaySpan(start,end,limit=3650){
 if(!validDay(start)||!validDay(end)||end<start)return [];
 const from=Date.parse(start+'T12:00:00Z'),to=Date.parse(end+'T12:00:00Z'),length=Math.floor((to-from)/86400000)+1;
 if(length>limit)return [];
 return Array.from({length},(_,i)=>new Date(from+i*86400000).toISOString().slice(0,10));
}
export function healthDataCoverage(data={},today=new Date().toISOString().slice(0,10),timezone='Europe/Vienna'){
 let formatter;try{formatter=new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'});}catch{formatter=new Intl.DateTimeFormat('en-CA',{timeZone:'UTC',year:'numeric',month:'2-digit',day:'2-digit'});}
 const fields=[['sleep','Schlaf',data.garminNights||[],r=>r.day],['hrv','HRV',data.garminHrv||[],r=>r.day],['stress','Stress',data.garminWellness||[],r=>Number.isFinite(r.stress)&&r.stress>=0&&r.stress<=100?tzDay(r.at,formatter):''],['battery','Body Battery',data.garminWellness||[],r=>Number.isFinite(r.bodyBattery)&&r.bodyBattery>=0&&r.bodyBattery<=100?tzDay(r.at,formatter):''],['activity','Aktivität',data.garminFitness||[],r=>r.day],['training','Trainings',data.garminSessions||[],r=>r.day||tzDay(r.start||r.at,formatter)],['fitdays','Fitdays',data.fitdays||[],r=>r.day||tzDay(r.at,formatter)]];
 const kinds={};const union=new Set();
 for(const [key,label,rows,pick] of fields){const dates=new Set();let count=0;for(const r of Array.isArray(rows)?rows:[]){const d=pick(r||{});if(validDay(d)){dates.add(d);union.add(d);count++;}}kinds[key]={label,...summarize(dates,count)};}
 const all=summarize(union,0),historicalEnd=all.last&&validDay(today)&&today<=all.last?new Date(Date.parse(today+'T12:00:00Z')-86400000).toISOString().slice(0,10):all.last;
 // Coverage means a day contains >=1 stored measurement, NOT full 24-hour recording.
 const months=[];
 if(all.first&&all.last){const begin=all.first.slice(0,7),end=all.last.slice(0,7);let y=Number(begin.slice(0,4)),m=Number(begin.slice(5,7));while(months.length<120){const month=`${y}-${String(m).padStart(2,'0')}`;if(month>end)break;const full=getDaySpan(`${month}-01`,`${month}-${String(new Date(Date.UTC(y,m,0)).getUTCDate()).padStart(2,'0')}`);const within=full.filter(d=>d>=all.first&&d<=all.last&&(!validDay(today)||d<=today));months.push({month,days:within.length,sleep:within.filter(d=>kinds.sleep.dates.includes(d)).length,stress:within.filter(d=>kinds.stress.dates.includes(d)).length,battery:within.filter(d=>kinds.battery.dates.includes(d)).length});if(++m===13){m=1;y++;}}
 }
 const gaps={};for(const [key] of fields){const k=kinds[key];gaps[key]=k.first&&k.last?getDaySpan(k.first,historicalEnd&&historicalEnd<k.last?historicalEnd:k.last).filter(d=>!k.dates.includes(d)):[];}
 return {all,kinds,months,gaps,today};
}
export function importFilePeriod(entries=[]){
 const days=new Set();let undated=0;
 for(const entry of entries){if(entry?.kind!=='health')continue;
  const name=String(entry.name||'');const match=name.match(/(?:^|[^\d])(20\d{2})[-_.](0[1-9]|1[0-2])[-_.](0[1-9]|[12]\d|3[01])(?=[^\d]|$)/);
  const day=match?`${match[1]}-${match[2]}-${match[3]}`:'';if(validDay(day))days.add(day);else undated++;
 }
 return {...summarize(days,days.size+undated),undated};
}
export function healthCoverageMarkup(coverage,{compact=false}={}){
 const c=coverage||healthDataCoverage(),k=c.kinds;
 if(!c.all.days)return '<p class="muted-line health494-empty">Noch keine lokal gespeicherten Messdaten.</p>';
 const keys=compact?['sleep','stress','battery']:['sleep','stress','battery','hrv','activity','training','fitdays'];
 return `<div class="health494-coverage" aria-label="Zeitraum gespeicherter Gesundheitsdaten">
 <div class="health494-overall"><span>Im Vault · gemessener Zeitraum</span><strong>${escape(shortDay(c.all.first))} – ${escape(shortDay(c.all.last))}</strong><small>${formatNumber(c.all.days)} Tage mit mindestens einer gespeicherten Messart</small></div>
 <div class="health494-metrics">${keys.map(key=>{const x=k[key];return `<div><span>${escape(x.label)}</span><strong>${x.days?`${escape(shortDay(x.first))} – ${escape(shortDay(x.last))}`:'Keine Werte'}</strong><small>${formatNumber(x.days)} erfasste Tage${x.count!==x.days?` · ${formatNumber(x.count)} Werte`:''}</small></div>`;}).join('')}</div>
 ${compact?'':`<details class="health494-details"><summary>Monatsabdeckung & Tage ohne Werte ansehen</summary><p>Ein markierter Tag enthält mindestens einen gespeicherten Wert; er ist dadurch nicht zwingend vollständig aufgezeichnet. Leere Tage sind Hinweise, keine bestätigten Aufzeichnungslücken. Der aktuelle Tag gilt nicht als Lücke.</p><div class="health494-months">${c.months.map(m=>`<div class="health494-month"><strong>${escape(m.month)}</strong><span>Schlaf ${m.sleep}/${m.days}</span><span>Stress ${m.stress}/${m.days}</span><span>Body Battery ${m.battery}/${m.days}</span></div>`).join('')}</div><div class="health494-gaplines">${['sleep','stress','battery'].map(key=>{const days=c.gaps[key];return `<p>${escape(k[key].label)}: ${days.length?`${days.length} Tag(e) ohne gespeicherte Werte zwischen erster und letzter Messung${days.length<=12?': '+escape(days.map(shortDay).join(', ')):''}`:'Keine Tage ohne Werte zwischen erster und letzter Messung'}</p>`;}).join('')}</div></details>`}
 </div>`;
}
export function filePeriodMarkup(period){if(!period?.days)return `<span>Aus Dateinamen kein verlässlicher Beginn ableitbar${period?.undated?` · ${formatNumber(period.undated)} ohne Datumskennung`:''}</span>`;return `<span>Dateinamen: <strong>${escape(shortDay(period.first))} – ${escape(shortDay(period.last))}</strong> · ${formatNumber(period.days)} datierte Archive${period.undated?` · ${formatNumber(period.undated)} ohne Datum`:''}</span>`;}
