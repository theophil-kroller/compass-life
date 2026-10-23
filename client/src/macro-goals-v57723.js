/** Optional, explicitly selected macro orientation. No prescription, diagnosis or
 * inferred weight-loss target. Uses previously configured energy and body model. */
import {personalEnergyEstimate} from './energy-goal-v575.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function normalizedMacroPreferences(raw={}){
 const p=raw&&typeof raw==='object'?raw:{};
 return {mode:['standard','strength'].includes(p.mode)?p.mode:'standard',enabled:p.enabled===true,updatedAt:typeof p.updatedAt==='string'?p.updatedAt:''};
}
export function macroSuggestions(state,now=new Date()){
 const prefs=normalizedMacroPreferences(state?.nutritionJournal?.macroPrefs);
 const energy=personalEnergyEstimate(state,now),weight=energy.body?.weightKg;
 if(!Number.isFinite(weight)||weight<30)return {ready:false,prefs,reason:'Für die individuelle Proteinorientierung fehlt eine aktuelle Fitdays-Gewichtsmessung.'};
 const strength=prefs.mode==='strength';
 const proteinRange=[Math.round(weight*(strength?1.4:.8)),Math.round(weight*(strength?1.8:1.2))];
 if(!energy.ready)return {ready:false,prefs,proteinRange,weight,reason:'Für Fett und Kohlenhydrate bitte zuerst das persönliche Energieziel aktivieren und die Daten prüfen.'};
 const protein=Math.round(weight*(strength?1.6:1.0));
 const kcal=energy.target,fat=Math.round(kcal*.28/9),carbs=Math.round(Math.max(0,kcal-protein*4-fat*9)/4);
 return {ready:true,prefs,weight,energy:kcal,protein,proteinRange,fat,carbs,goalKind:'Vorschlag – keine medizinische Vorgabe'};
}
function meter(icon,label,current,goal,unit){
 if(!Number.isFinite(goal)||goal<=0)return '';
 const pct=Math.round(current/goal*100);
 return `<div class="meal723-target"><div>${icon} <span>${label}</span> <strong>${Math.round(current)} / ${goal} ${unit} · ${pct} %</strong></div><div class="ni722-track"><span style="width:${Math.min(100,Math.max(0,pct))}%"></span></div></div>`;
}
export function macroGoalView(state,dayTotals={},dayCoverage={}){
 const plan=macroSuggestions(state),prefs=plan.prefs;
 const rows=plan.ready&&prefs.enabled?[
  dayCoverage.protein?.known?meter('💪','Protein',dayTotals.protein||0,plan.protein,'g'):'<p class="muted-line">💪 Protein noch nicht erfasst – kein 0-g-Befund.</p>',
  dayCoverage.fat?.known?meter('🥑','Fett',dayTotals.fat||0,plan.fat,'g'):'<p class="muted-line">🥑 Fett noch nicht erfasst.</p>',
  dayCoverage.carbs?.known?meter('🌾','Kohlenhydrate',dayTotals.carbs||0,plan.carbs,'g'):'<p class="muted-line">🌾 Kohlenhydrate noch nicht erfasst.</p>'
 ].join(''):'';
 return `<section class="ni712-panel meal723-goals"><h3>🎯 Persönliche Makroorientierung</h3><p class="muted-line">${plan.ready?`Geschätzter Energierahmen ${plan.energy} kcal; Proteinbereich ${plan.proteinRange[0]}–${plan.proteinRange[1]} g je nach Trainingsziel. Fett grob 28 % der Energie, Kohlenhydrate als Rest.`:esc(plan.reason)} Keine automatische Zieländerung aus einzelnen Garmin-Tagen.</p>${rows}<details><summary>Makrovorschläge konfigurieren</summary><form id="meal723-macro-form"><label><input type="checkbox" name="enabled" ${prefs.enabled?'checked':''}> Tagesorientierung anzeigen</label><label>Aktivitätsziel<select name="mode"><option value="standard" ${prefs.mode==='standard'?'selected':''}>Alltag / Gewicht halten oder reduzieren</option><option value="strength" ${prefs.mode==='strength'?'selected':''}>Regelmäßiges Krafttraining · Muskelerhalt/-aufbau</option></select></label><button class="secondary-btn" type="submit">Vorschläge speichern</button></form><p class="muted-line">Proteinwerte sind Planungsrichtwerte. Der Körperbedarf hängt von Trainingsstand, Energiezufuhr und Gesundheit ab. Nicht als medizinische Empfehlung gedacht.</p></details></section>`;
}
