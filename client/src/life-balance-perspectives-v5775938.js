/** Compass .59.38 — radar perspectives; no cross-source summing or invented activity. */
import {buildLifeBalanceRadar,buildLifeBalanceHistory,lifeBalanceRadarView} from './life-balance-radar-v563.js';
import {joinedFitnessDays} from './insights-fitness.js';
import {dailyDozen5930} from './daily-dozen-v5775930.js';
const shift=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const axis=(key,label,score,detail,hint,tab='insights',insight='activity',observed=0,latest=null)=>({key,label,score:score==null?null:clamp(score),detail,hint,tab,insight,observed,latest});
const strengthSport=s=>Number(s?.sport)===19||/strength|krafttraining|weight\s*training|stronglifts/i.test(`${s?.title||''} ${s?.activityType||''}`);
/** Health Connect exercise minutes take priority over Garmin session durations;
 * Garmin sessions are ONLY fallback, never added to Health Connect minutes. */
export function radarMovement38(state={},healthDays=[],today='2026-10-26',period=7){
 const data=state.healthImports||{},start=shift(today,1-period);
 const rows=joinedFitnessDays(data,healthDays,today,{start,end:today}).filter(r=>Number.isFinite(r.exerciseMinutes)&&r.exerciseMinutes>=0);
 const sessions=(Array.isArray(data.garminSessions)?data.garminSessions:[]).filter(s=>s.day>=start&&s.day<=today&&Number.isFinite(s.durationMinutes)&&s.durationMinutes>0&&s.durationMinutes<1440);
 const withHealth=rows.length>=(period===7?3:8);
 const totals=withHealth?rows.reduce((n,r)=>n+r.exerciseMinutes,0):sessions.reduce((n,r)=>n+r.durationMinutes,0);
 const source=withHealth?'Health Connect':sessions.length?'Garmin-Sessions':rows.length?'Health Connect (unvollständig)':'Keine nachgewiesenen Bewegungsminuten';
 const enough=withHealth||sessions.length>0;
 const movement=axis('movement38','Bewegungszeit',enough?totals/(period*150/7)*100:null,
  enough?`${Math.round(totals)} dokumentierte Minuten in ${period} Tagen · ${source}`:'Keine ausreichenden Trainings-/Aktivitätsdaten',
  'Persönlicher Orientierungswert: 150 Minuten je 7 Tage. Health Connect und Garmin werden NICHT addiert; Garmin kann unvollständig sein. Auch Radfahren zählt. Keine medizinische Bewertung.','insights','activity',withHealth?rows.length:sessions.length,
  withHealth?rows.at(-1)?.day:sessions.at(-1)?.day||null);
 const strengthDays=new Set();
 for(const s of sessions)if(strengthSport(s))strengthDays.add(s.day);
 for(const s of Array.isArray(state.strengthGuidedSessions)?state.strengthGuidedSessions:[]){
  if(!s||!s.startedAt)continue;const d=s.startedAt.slice(0,10);
  if(d<start||d>today||s.completed!==true)continue;
  if(Array.isArray(s.exercises)&&s.exercises.some(e=>(e.confirmedSets||[]).some(set=>set.confirmed===true)))strengthDays.add(d);
 }
 const count=strengthDays.size;
 const strength=axis('strength38','Krafttraining',count?count/(period*2/7)*100:null,
   count?`${count} dokumentierte Trainingstage · Garmin / Coach`:'Noch keine bestätigten Krafttrainingstage im gewählten Zeitraum',
   'Nur protokollierte Tage (gleicher Tag wird nicht doppelt gezählt). 2 Einheiten/Woche sind ein persönlicher Planungsrichtwert, kein Mindestmaß und keine Muskelaufbaugarantie. Fehlende Imports bedeuten nicht fehlendes Training.',
   'activity',null,count,[...strengthDays].sort().at(-1)||null);
 return {movement,strength,source,healthCoverage:rows.length,sessions:sessions.length};
}
export function radarNutrition38(state={},today='2026-10-26',period=7){
 const readings=[];
 for(let i=0;i<period;i++){const r=dailyDozen5930(state,{day:shift(today,-i)});if(r.entries)readings.push(r);}
 const documented=readings.reduce((a,r)=>a+r.observed-(r.rows.find(x=>x.id==='exercise')?.observed||0),0);
 const totalPossible=readings.length*23;
 return axis('nutrition38','Daily Dozen',readings.length>=(period===7?3:8)?documented/totalPossible*100:null,
 readings.length?`${Math.round(documented*10)/10} von ${totalPossible} dokumentierbaren Ernährungsportionen · ${readings.length} erfasste Tage`:'Keine Ernährungseinträge erfasst',
 'Nur explizit protokollierte Greger-Portionen, ohne Bewegungs-Kategorie. Kein Urteil über Ernährung, wenn Einträge fehlen; kein Anti-Aging-Score.',
 'insights','nutrition',readings.length,readings[0]?.day||null);
}
export function balanceModel38(state={},opts={}){
 const {today='2026-10-26',period=7,healthDays=[],choice='all'}=opts;
 const base=buildLifeBalanceRadar(state,{today,period,healthDays});
 const map=new Map(base.axes.map(a=>[a.key,a]));
 const {movement,strength}=radarMovement38(state,healthDays,today,Number(period));
 const nutrition=radarNutrition38(state,today,Number(period));
 let axes;
 if(choice==='health')axes=[map.get('sleep'),movement,strength,map.get('recovery'),map.get('body'),nutrition,map.get('activity'),axis('selfcare38','Selbstfürsorge',null,'Keine standardisierte Erfassung selbst gewählter Erholungspraktiken','Habits und bewusste Erholung sind nicht gleichbedeutend mit Gesundheit.','insights','habits')];
 else if(choice==='life')axes=[map.get('people'),map.get('gtd'),map.get('work'),map.get('finance'),map.get('recovery'),map.get('sleep'),axis('leisure38','Freizeit',null,'Noch kein persönlicher Freizeit-Richtwert','Freizeitqualität kann nicht aus bloßem Kalenderumfang geschätzt werden.'),axis('feelings38','Gefühlswelt',null,'Emotionen werden nicht nach positiv/negativ bewertet','Unangenehme Gefühle sind keine Defizite.','insights','feelings')];
 else {
  axes=[...base.axes];
  // Movement minutes are preferred where enough evidence exists; the old step
  // measurement remains visible as a secondary source in the Health view.
  if(movement.score!==null){const index=axes.findIndex(x=>x.key==='activity');axes[index]=movement;}
 }
 return {...base,axes,coverage:axes.filter(x=>x?.score!=null).length,total:axes.length,
  mean:axes.some(a=>a?.score!=null)?Math.round(axes.filter(a=>a?.score!=null).reduce((s,a)=>s+a.score,0)/axes.filter(a=>a?.score!=null).length):null,
  perspective:choice};
}
export function balancePerspective38(state,opts={}){
 const choice=['all','health','life'].includes(opts.choice)?opts.choice:'all';
 const model=balanceModel38(state,{...opts,choice});
 const old=choice==='all'&&model.axes.every((a,i)=>a.key===['sleep','activity','gtd','finance','people','body','recovery','work'][i]);
 const history=old?buildLifeBalanceHistory(state,{today:opts.today,period:opts.period,healthDays:opts.healthDays,count:opts.history||0}):[];
 const labels=[['all','Gesamtbalance'],['health','Gesundheit'],['life','Lebensqualität']];
 const tabs=`<nav class="balance38-tabs" aria-label="Life Balance Perspektive">${labels.map(([id,title])=>`<button type="button" data-action="balance-view38" data-id="${id}" aria-pressed="${choice===id}">${title}</button>`).join('')}</nav>`;
 const hint=choice==='health'?'Bewegungsminuten einschließlich dokumentierter Radfahrten und getrenntes Krafttraining; keine Doppelzählung von Garmin und Health Connect.':choice==='life'?'Nur verfügbare Indikatoren; emotionale Qualität und Freizeit werden nicht aus Kalenderzahlen erfunden.':'Gesamtüberblick. Bei ausreichend dokumentierten Bewegungsminuten ersetzt Bewegungszeit die reine Schrittbewertung.';
 // Reuse the proven 8-axis radar. For nonlegacy perspectives the direct-selection
 // action accepts new axis IDs; no change to historical radar internals.
 let html=lifeBalanceRadarView(model,{history,activeAxis:opts.activeAxis||null});
 if(choice!=='all'||!old)html=html.replaceAll('data-action="balance-select"','data-action="balance38-select"');
 return tabs+`<p class="balance38-hint">${hint}</p>`+html;
}
