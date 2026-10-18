/** Sports and leisure summaries from verified Garmin FIT sessions and explicit personal activities.
 * No distance is inferred from monitoring totals, calendar entries or Timeline paths.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=1)=>Number(n).toLocaleString('de-AT',{maximumFractionDigits:d});
const TYPES={running:['Laufen','footprints'],cycling:['Radfahren','bike'],walking:['Spazierengehen','footprints'],hiking:['Wandern / Hiking','mountain'],ski:['Skifahren','mountain-snow'],swimming:['Schwimmen','waves'],paddling:['Kayak / SUP','ship'],dancing:['Tanzen','music'],disc:['Disc Golf','target'],martial:['Kampfsport','shield'],sauna:['Sauna & Therme','flame'],other:['Sonstige Aktivitäten','activity']};
const sportMap={1:'running',2:'cycling',5:'swimming',11:'walking',12:'ski',13:'ski',14:'ski',16:'hiking',17:'hiking',19:'paddling',21:'cycling'};
// For ambiguous generic FIT sports, avoid claiming paddling / disc golf from an unsupported sport code.
function titleType(title){const x=String(title||'').toLocaleLowerCase('de-AT');
 if(/\b(zouk|bachata|salsa|tanz\w*|danc\w*|forró|kizomba)\b/u.test(x))return 'dancing';
 if(/disc\s*golf|discgolf|frisbee golf/u.test(x))return 'disc';
 if(/sauna|therme|wellness|dampfbad/u.test(x))return 'sauna';
 if(/kayak|kajak|kanu|canoe/u.test(x))return 'paddling';
 if(/stand.?up.?padd|\bsup\b/u.test(x))return 'paddling';
 if(/ski|snowboard|langlauf/u.test(x))return 'ski';
 if(/wander|hiking|trekking|bergwander/u.test(x))return 'hiking';
 if(/radfahr|cycling|fahrrad|\bbike\b/u.test(x))return 'cycling';
 if(/schwimm|swim/u.test(x))return 'swimming';
 if(/spazier|walking|walk\b/u.test(x))return 'walking';
 if(/laufen|joggen|running/u.test(x))return 'running';
 if(/kampfsport|karate|judo|kickbox|taekwondo|\bboxen\b/u.test(x))return 'martial';
 return 'other';
}
const inRange=(day,range)=>day&&(!range?.start||day>=range.start)&&(!range?.end||day<=range.end);
export function summarizeSports(sessions=[],activities=[],range={}){
 const rows=[];
 for(const s of sessions){if(!s||!inRange(s.day,range))continue;
  const type=sportMap[s.sport]||'other';const mins=Number(s.durationMinutes);const km=Number(s.distanceKm);
  if(!Number.isFinite(mins)||mins<=0||mins>24*60)continue;
  rows.push({id:String(s.id||s.start),at:s.start,day:s.day,type,mins,km:Number.isFinite(km)&&km>=0&&km<1000?km:null,source:'garmin'});
 }
 for(const a of activities){if(!a||a.deleted||!inRange(String(a.startedAt||'').slice(0,10),range))continue;
  const type=titleType(a.title),mins=Number(a.durationMinutes);if(!Number.isFinite(mins)||mins<=0||mins>1440||type==='other')continue;
  const km=a.distanceKm==null?null:Number(a.distanceKm);const at=a.startedAt;
  // Two devices can describe one workout; prefer FIT for the sport, time and distance.
  const d=Date.parse(at);const likelyDuplicate=rows.some(x=>x.source==='garmin'&&x.type===type&&x.day===at.slice(0,10)&&Number.isFinite(d)&&Number.isFinite(Date.parse(x.at))&&Math.abs(d-Date.parse(x.at))<=30*60000&&Math.abs(x.mins-mins)<=Math.max(15,mins*.25));
  if(likelyDuplicate)continue;
  rows.push({id:String(a.id),at,day:at.slice(0,10),type,mins,km:Number.isFinite(km)&&km>=0&&km<1000?km:null,source:'personal'});
 }
 const groups=new Map();for(const row of rows){let v=groups.get(row.type);if(!v){v={type:row.type,label:TYPES[row.type][0],icon:TYPES[row.type][1],count:0,minutes:0,distanceKm:0,measuredDistance:false,garmin:0,personal:0};groups.set(row.type,v);}
  v.count++;v.minutes+=row.mins;if(row.km!==null){v.distanceKm+=row.km;v.measuredDistance=true;}v[row.source]++;
 }
 return [...groups.values()].sort((a,b)=>b.minutes-a.minutes);
}
export function sportsInsightsView(sessions=[],activities=[],range={}){
 const groups=summarizeSports(sessions,activities,range),total=groups.reduce((s,g)=>s+g.minutes,0),distance=groups.filter(x=>x.measuredDistance).reduce((s,g)=>s+g.distanceKm,0);
 return `<article class="insight-chart-card sports-insights"><div class="insight-figure-title"><div><small>06 · SPORT & FREIZEIT</small><h3>Wofür verwende ich meine Zeit?</h3></div><span class="insight-figure-note">${esc(range.start||'Beginn')} – ${esc(range.end||'heute')}</span></div>
 <div class="sports-summary"><span><strong>${fmt(total/60)} h</strong> dokumentiert</span><span><strong>${fmt(distance,1)} km</strong> aus Sessions mit Distanz</span><span><strong>${groups.reduce((s,g)=>s+g.count,0)}</strong> Einheiten</span></div>
 ${groups.length?`<div class="sports-rows">${groups.map(g=>`<div class="sports-row"><span class="sports-name">${esc(g.label)}</span><span class="sports-track"><i style="width:${Math.max(1,Math.round(100*g.minutes/total))}%"></i></span><strong>${fmt(g.minutes/60)} h</strong><small>${g.count}×${g.measuredDistance?' · '+fmt(g.distanceKm,1)+' km':''}</small></div>`).join('')}</div>`:'<p class="insight-no-data">Noch keine zuordenbaren Sporteinheiten im Zeitraum. Garmin-Trainings-FITs importieren oder Aktivitäten mit Titeln wie „Tanzen“, „Wandern“ oder „Disc Golf“ erfassen.</p>'}
 <p class="insight-figure-note">Garmin: echte FIT-Sessionzeiten und -strecken. Eigene Aktivitäten werden anhand ihrer Titel zugeordnet; bitte im Aktivitäts-Inspector prüfen. Fehlende Kilometer werden nicht geschätzt. Tages-Schrittzähler sind keine unabhängigen Trainingseinheiten.</p></article>`;
}
