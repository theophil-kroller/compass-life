/** Descriptive, conservatively inferred rowing/paddling anatomy — not EMG or strength sets. */
const validDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d||''));
const since=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
const SPORT={kayak:{name:'Kajak',primary:['latissimus','obliques','rectus_abdominis'],secondary:['deltoid_rear','deltoid_side','triceps','biceps','rhomboids','erector_spinae']},sup:{name:'SUP',primary:['obliques','rectus_abdominis','latissimus'],secondary:['deltoid_side','triceps','quadriceps','glute_med','calves_gastro','erector_spinae']}};
const kind=x=>{const t=`${x.activityType||''} ${x.title||''}`.toLowerCase();if(/\b(sup|stand.?up.?paddl(?:e(?:board(?:ing)?)?|ing)?|standup)\b/i.test(t))return 'sup';return /\b(kayak(?:ing)?|kajak|paddl(?:e|ing)|kanu|canoe(?:ing)?)\b/i.test(t)?'kayak':null;};
export function waterSportMuscleSummary(state,{range='28',today=new Date().toLocaleDateString('sv-SE')}={}){
 const from=range==='all'?'':since(today,1-(Number(range)||28));
 const sessions=(state?.healthImports?.garminSessions||[]).filter(s=>kind(s)&&validDay(s.day)&&s.day<=today&&(!from||s.day>=from)&&Number.isFinite(s.durationMinutes)&&s.durationMinutes>0).sort((a,b)=>String(a.start||'').localeCompare(String(b.start||'')));
 const dedup=[];
 for(const s of sessions){const t=Date.parse(s.start||'');const index=dedup.findIndex(x=>s.id===x.id||(s.day===x.day&&kind(s)===kind(x)&&Math.abs(Date.parse(x.start||'')-t)<=2*3600000&&Math.abs(x.durationMinutes-s.durationMinutes)<=3));if(index<0)dedup.push(s);}
 const kinds=[...new Set(dedup.map(kind))];return {sessions:dedup,rides:dedup.length,minutes:dedup.reduce((n,s)=>n+s.durationMinutes,0),days:new Set(dedup.map(s=>s.day)).size,
  kayaks:dedup.filter(s=>kind(s)==='kayak').length,sups:dedup.filter(s=>kind(s)==='sup').length,
  regions:{primary:[...new Set(kinds.flatMap(k=>SPORT[k].primary))],secondary:[...new Set(kinds.flatMap(k=>SPORT[k].secondary))]},mode:'qualitative-paddling',note:'Muskelbeteiligung aus typischer Paddelbewegung abgeleitet; individuelle Technik/Widerstand nicht gemessen.'};
}
export function waterSportSummaryView(water){
 if(!water?.rides)return '<div class="str741-water-sports"><strong>🛶 Kajak & SUP</strong><small>Keine importierten Kajak-/SUP-Aktivitäten im gewählten Zeitraum. Es wird keine Muskelaktivität angenommen.</small></div>';
 const txt=[water.kayaks?`${water.kayaks} Kajak`:'',water.sups?`${water.sups} SUP`:''].filter(Boolean).join(' · ');
 return `<div class="str741-water-sports"><strong>🛶 Kajak & SUP · ${txt}</strong><span>${Math.round(water.minutes)} dokumentierte Minuten</span><small>Primär: Latissimus, schräge/gerade Bauchmuskulatur; je nach Sport zusätzlich Schultern, Arme, Bein-/Rumpfstabilisation. Nur anatomische Zuordnung, keine zusätzlichen Kraftsätze.</small></div>`;
}
