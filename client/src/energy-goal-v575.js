/** Compass 0.5.75: descriptive personal energy budget from existing Fitdays/Garmin observations.
 * Nothing is a diagnosis, a direct calorimetry measurement or a verified complete food diary.
 * Pure functions; all profile and log data stay in the encrypted nutritionJournal mirror.
 */
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>Number.isFinite(x)?Math.round(x).toLocaleString('de-AT'):'–';
const palLevels={low:1.35,light:1.45,moderate:1.55,active:1.7,very:1.8};
const labelLevel={low:'Wenig Bewegung',light:'Leicht aktiv',moderate:'Mäßig aktiv',active:'Aktiv',very:'Sehr aktiv'};
const dayLocal=d=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;};
const validDate=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
export function energyGoalSettings(raw={}){
 const s=raw&&typeof raw==='object'?raw:{};
 const year=Number(s.birthYear),month=Number(s.birthMonth),height=Number(s.heightCm);
 return {
  enabled:s.enabled===true,
  birthYear:Number.isInteger(year)&&year>=1900&&year<=2100?year:null,
  birthMonth:Number.isInteger(month)&&month>=1&&month<=12?month:null,
  heightCm:finite(height)&&height>=120&&height<=230?height:null,
  formulaSex:['male','female'].includes(s.formulaSex)?s.formulaSex:'',
  method:['auto','mifflin','ffm'].includes(s.method)?s.method:'auto',
  activity:['auto',...Object.keys(palLevels)].includes(s.activity)?s.activity:'auto',
  deficit:[200,300,400,500].includes(Number(s.deficit))?Number(s.deficit):300,
  updatedAt:validDate(s.updatedAt)?s.updatedAt:''
 };
}
export function ageFromMonth(birthYear,birthMonth,now=new Date()){
 const y=Number(birthYear),m=Number(birthMonth);
 if(!Number.isInteger(y)||!Number.isInteger(m)||m<1||m>12||y>now.getFullYear()||y<1900)return null;
 const age=now.getFullYear()-y-(now.getMonth()+1<m?1:0);
 return age>=18&&age<=110?age:null;
}
export function latestBodyRecord(imported={},now=new Date()){
 const current=now.getTime(),rows=(Array.isArray(imported?.fitdays)?imported.fitdays:[])
  .filter(row=>finite(row?.weightKg)&&row.weightKg>=30&&row.weightKg<=350&&validDate(row.at)&&Date.parse(row.at)<=current)
  .sort((a,b)=>String(b.at).localeCompare(String(a.at)));
 if(!rows.length)return null;
 const row=rows[0];const ageDays=Math.round((current-Date.parse(row.at))/86400000);
 const fatMass=finite(row.fatMassKg)&&row.fatMassKg>=0&&row.fatMassKg<row.weightKg?row.fatMassKg:
  finite(row.bodyFatPct)&&row.bodyFatPct>=4&&row.bodyFatPct<=65?row.weightKg*row.bodyFatPct/100:null;
 return {weightKg:row.weightKg,fatMassKg:fatMass,bodyFatPct:finite(row.bodyFatPct)?row.bodyFatPct:null,day:dayLocal(row.at),ageDays,stale:ageDays>90,source:'Fitdays'};
}
function median(a){const s=a.slice().sort((a,b)=>a-b);if(!s.length)return null;const i=Math.floor(s.length/2);return s.length%2?s[i]:(s[i-1]+s[i])/2;}
/** Conservative classification. Steps take precedence over sessions to avoid double counting.
 * Activity labels are heuristics, NOT a direct measurement of daily total energy expenditure. */
export function inferActivity(imported={},now=new Date()){
 const limit=now.getTime()-28*86400000,until=now.getTime(),stepsByDay=new Map();
 for(const row of imported?.garminFitness||[]){const day=row?.day;if(typeof day!=='string'||!/^\d{4}-\d\d-\d\d$/.test(day))continue;
  const t=Date.parse(day+'T12:00:00Z');if(t<limit||t>until||!finite(row.steps)||row.steps<=0)continue;
  stepsByDay.set(day,Math.max(stepsByDay.get(day)||0,row.steps));
 }
 const stepValues=[...stepsByDay.values()],mid=median(stepValues);
 if(stepValues.length>=10){
  const category=mid<5000?'low':mid<7500?'light':mid<10000?'moderate':mid<12500?'active':'very';
  return {category,pal:palLevels[category],basis:'Schritte (Garmin)',days:stepValues.length,medianSteps:Math.round(mid),confidence:'grob'};
 }
 // Only use exercise sessions if daily step coverage is insufficient.
 const counted=new Set();let minutes=0;
 for(const s of imported?.garminSessions||[]){const t=Date.parse(s?.start||''),duration=Number(s?.durationMinutes);
  if(!Number.isFinite(t)||t<limit||t>until||!finite(duration)||duration<=0||duration>600||counted.has(s.id))continue;
  if(s.id)counted.add(s.id);minutes+=duration;
 }
 const weekly=minutes/4;
 if(weekly>=75){const category=weekly<150?'light':weekly<300?'moderate':'active';
  return {category,pal:palLevels[category],basis:'Garmin-Trainingszeiten (ohne vollständige Schrittserie)',weeklyMinutes:Math.round(weekly),days:stepValues.length,confidence:'sehr grob'};
 }
 return null;
}
export function restingEnergy({weightKg,heightCm,age,formulaSex,fatMassKg,method='auto'}={}){
 if(!finite(weightKg)||weightKg<30||weightKg>350)return null;
 const canMifflin=finite(heightCm)&&heightCm>=120&&heightCm<=230&&finite(age)&&age>=18&&age<=110&&['male','female'].includes(formulaSex);
 const canFfm=finite(fatMassKg)&&fatMassKg>=0&&fatMassKg<weightKg;
 let choice=method;
 if(choice==='auto')choice=canMifflin?'mifflin':canFfm?'ffm':'';
 if(choice==='mifflin'&&canMifflin)return {kcal:10*weightKg+6.25*heightCm-5*age+(formulaSex==='male'?5:-161),method:'Mifflin–St. Jeor'};
 if(choice==='ffm'&&canFfm)return {kcal:413+19.7*(weightKg-fatMassKg),method:'Fettfreie Masse · Mifflin et al.'};
 return null;
}
export function personalEnergyEstimate(state,now=new Date()){
 const settings=energyGoalSettings(state?.nutritionJournal?.energyGoal),body=latestBodyRecord(state?.healthImports,now);
 if(!body)return {settings,ready:false,reason:'Noch kein verwertbares Fitdays-Gewicht importiert.',body:null};
 if(body.stale)return {settings,ready:false,reason:'Die letzte Fitdays-Messung ist älter als 90 Tage.',body};
 const age=ageFromMonth(settings.birthYear,settings.birthMonth,now);
 const resting=restingEnergy({weightKg:body.weightKg,fatMassKg:body.fatMassKg,heightCm:settings.heightCm,age,formulaSex:settings.formulaSex,method:settings.method});
 if(!resting)return {settings,ready:false,reason:'Für Mifflin–St. Jeor bitte Geburtsjahr, Monat, Körpergröße und Formelparameter angeben; alternativ fettfreie Masse aus Fitdays verwenden.',body};
 const observed=inferActivity(state?.healthImports,now);
 const category=settings.activity==='auto'?observed?.category:settings.activity;
 if(!category)return {settings,ready:false,reason:'Für die automatische Aktivität fehlen ausreichend Garmin-Daten (mindestens 10 Tage mit Schritten oder dokumentierte Trainingszeit). Alternativ Aktivitätsstufe auswählen.',body,resting,activity:observed};
 const pal=palLevels[category],tdee=Math.round(resting.kcal*pal/25)*25;
 const target=Math.round((tdee-settings.deficit)/25)*25;
 if(target<1200)return {settings,ready:false,reason:'Die gewählten Eingaben ergeben ein ungewöhnlich niedriges Ziel. Bitte Angaben prüfen und fachlich besprechen.',body,resting,activity:observed};
 return {settings,ready:true,body,age,resting,activity:observed,activityCategory:category,activityLabel:labelLevel[category],pal,tdee,target,deficit:settings.deficit,estimateOnly:true};
}
export function dayEnergyStatus(state,{now=new Date(),foods=[],estimate}={}){
 const model=personalEnergyEstimate(state,now),day=dayLocal(now),index=new Map(foods.map(f=>[f.id,f]));
 const entries=(state?.nutritionJournal?.entries||[]).filter(e=>e&&!e.deleted&&validDate(e.at)&&dayLocal(e.at)===day);
 let low=0,high=0,known=0;
 for(const e of entries){const k=typeof estimate==='function'?estimate(index.get(e.foodId),e.amount,e.recipe):null;
  if(!k||!finite(k.low)||!finite(k.high))continue;
  low+=k.low;high+=k.high;known++;
 }
 let status='off',message='';
 if(model.settings.enabled&&model.ready){
  status=known===0?'no-data':low>model.target?'over':high>model.target?'possible':'within-recorded';
  if(status==='over')message='Erfasste kcal-Schätzung überschreitet dein Tagesziel.';
  if(status==='possible')message='Deine erfasste kcal-Schätzung könnte das Tagesziel überschreiten.';
 }
 return {...model,day,low,high,known,unknown:entries.length-known,logged:entries.length,status,message};
}
export function energyGoalView(state,{now=new Date(),foods=[],estimate}={}){
 const g=dayEnergyStatus(state,{now,foods,estimate}),s=g.settings,b=g.body;
 const status=g.status==='over'?'pj575-over':g.status==='possible'?'pj575-possible':'';
 const available=g.ready?`<div class="pj575-totals"><span>Ruheenergiebedarf <strong>${num(g.resting.kcal)} kcal</strong></span><span>Gesamtbedarf · Schätzung <strong>≈ ${num(g.tdee)} kcal</strong></span><span>Tagesziel mit Defizit <strong>≈ ${num(g.target)} kcal</strong></span></div><p class="muted-line">Berechnung: ${esc(g.resting.method)} × Aktivitätsfaktor ${g.pal.toFixed(2)} (${esc(g.activityLabel)}). ${s.activity==='auto'?esc('Automatische Einstufung: '+(g.activity?.basis||'keine')):'Manuell gewählte Aktivitätsstufe'}. Tageswerte sind Näherungen.</p>`:`<p class="muted-line">${esc(g.reason||'Bitte Profil und Messdaten prüfen.')}</p>`;
 const current=g.known?`${num(g.low)}–${num(g.high)} kcal`:'Keine abschätzbaren Einträge';
 return `<section class="work-card pj575-energy" aria-label="Persönliches Kalorienziel"><div class="work-heading"><span>⚖️ Persönliches Energieziel</span><span class="quiet-tag">Optional · nur Schätzwerte</span></div>
 <p class="muted-line">Körpermesswerte aus Fitdays, Aktivitäten aus Garmin. Keine vollständig erfasste Kalorienbilanz und keine automatische Diätvorgabe.</p>
 <div class="pj575-headline ${status}"><div><small>Heute erfasst (nur Lebensmittel mit Schätzung)</small><strong>${current}</strong><small>${g.known} geschätzt · ${g.unknown} ohne kcal-Wert${g.logged===0?' · Noch keine Einträge':''}</small></div>${g.ready&&s.enabled?`<div><small>Individuelles Tagesziel</small><strong>≈ ${num(g.target)} kcal</strong><small>Orientierung, kein starres Limit</small></div>`:''}</div>
 ${g.ready&&s.enabled&&g.known?`<div class="pj575-meter" role="img" aria-label="Erfasste kcal-Schätzspanne in Bezug auf das Tagesziel"><span style="width:${Math.min(100,g.high/g.target*100).toFixed(1)}%"></span></div>`:''}
 ${g.status==='over'||g.status==='possible'?`<p class="pj575-warning ${status}" role="status">${g.status==='over'?'⚠️':'ℹ️'} ${esc(g.message)} ${g.unknown?'Zusätzlich fehlen Schätzungen für '+g.unknown+' Einträge.':''}</p>`:''}
 ${s.enabled?available:'<p class="muted-line">Warnungen sind ausgeschaltet. Aktiviere sie erst nach dem Prüfen deiner persönlichen Angaben.</p>'}
 ${b?`<p class="pj575-source">Letzte Fitdays-Messung: ${esc(b.day)} · ${b.weightKg.toFixed(1)} kg · ${finite(b.bodyFatPct)?`${b.bodyFatPct.toFixed(1)} % Körperfett`:'Körperfett nicht vorhanden'}${b.stale?' · veraltet':''}</p>`:'<p class="pj575-source">Noch keine Fitdays-Messung vorhanden.</p>'}
 <details class="pj575-settings"><summary>Kalorienziel einrichten oder anpassen</summary><form id="pj575-energy-form" class="pj575-form"><label class="pj575-opt"><input type="checkbox" name="enabled" ${s.enabled?'checked':''}> Tagesziel und dezente Warnungen aktivieren</label><div class="pj575-fields">
 <label>Geburtsjahr<input type="number" name="birthYear" min="1900" max="2100" step="1" placeholder="z. B. 1983" value="${s.birthYear??''}"></label>
 <label>Geburtsmonat<select name="birthMonth"><option value="">Bitte auswählen</option>${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${s.birthMonth===i+1?'selected':''}>${i+1}</option>`).join('')}</select></label>
 <label>Größe in cm<input type="number" name="heightCm" min="120" max="230" step="0.5" placeholder="Körpergröße" value="${s.heightCm??''}"></label>
 <label>Physiologischer Formelparameter<select name="formulaSex"><option value="">Nicht hinterlegt</option><option value="male" ${s.formulaSex==='male'?'selected':''}>Männliche Formel</option><option value="female" ${s.formulaSex==='female'?'selected':''}>Weibliche Formel</option></select></label>
 <label>Berechnung<select name="method"><option value="auto" ${s.method==='auto'?'selected':''}>Automatisch: Mifflin, sonst fettfreie Masse</option><option value="mifflin" ${s.method==='mifflin'?'selected':''}>Mifflin–St. Jeor</option><option value="ffm" ${s.method==='ffm'?'selected':''}>Fettfreie Masse aus Fitdays</option></select></label>
 <label>Aktivitätsniveau<select name="activity"><option value="auto" ${s.activity==='auto'?'selected':''}>Automatisch aus Garmin (vorläufig)</option>${Object.keys(palLevels).map(level=>`<option value="${level}" ${s.activity===level?'selected':''}>${esc(labelLevel[level])} · ${palLevels[level].toFixed(2)}</option>`).join('')}</select></label>
 <label>Geplantes Tagesdefizit<select name="deficit">${[200,300,400,500].map(d=>`<option value="${d}" ${s.deficit===d?'selected':''}>${d} kcal / Tag</option>`).join('')}</select></label></div>
 <p class="muted-line">Automatische Aktivität aus bis zu 28 Tagen. Schritte und Sportminuten werden nicht addiert. Waagen-Körperfett und Energiebedarf sind ungenau; das Ziel nicht als medizinische Vorgabe verwenden.</p><button type="submit" class="primary-btn">Einstellungen verschlüsselt speichern</button></form></details>
 <p class="pj92-footnote">Eine Unterschreitung ist nicht bestätigt: Es fehlen nicht erfasste Mahlzeiten, nicht schätzbare Lebensmittel und Portionsunsicherheiten. Keine Warnung bei gesperrtem Tresor; Auswertung nach dem Entsperren.</p></section>`;
}
