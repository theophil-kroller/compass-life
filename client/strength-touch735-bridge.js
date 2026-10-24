/** Compass 0.5.77.35 additive guarded Vite bridge, applied after .34.
 * GUI: biceps icon, Garmin-inspired dual anatomy; voluntary touch journal insights.
 * Abort the build if upstream anchors changed rather than silently ignoring changes.
 */
export function strengthTouch735Bridge(){
 const replace=(input,from,to,label)=>{
  if(input.split(from).length!==2)throw Error(`Compass .35: eindeutiger Integrationsanker fehlt (${label}); bitte v0.5.77.34 als Basis prüfen.`);
  return input.replace(from,to);
 };
 return {name:'compass-strength-touch-735',enforce:'pre',transform(input,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let s=input;const change=(a,b,label)=>{s=replace(s,a,b,label);};
   change("const COMPASS_CLIENT_VERSION='0.5.77.34';","const COMPASS_CLIENT_VERSION='0.5.77.35';",'Version');
   change("import './anti-aging-eight-v57734.css';","import './anti-aging-eight-v57734.css';\nimport './strength-visual-v57735.css';\nimport './touch-insights-v57735.css';",'styles');
   // Both full-size sidebar and compact mobile insights tabs show a recognizable flexed-muscle icon.
   change("${ico('activity',19)}<span>Krafttraining</span>","<span class=\"str735-menu-icon\" aria-hidden=\"true\">💪</span><span>Krafttraining</span>",'sidebar muscle');
   change('${ico(icon,16)}<span>${label}</span>',"${id==='strength'?'<span class=\"str735-menu-icon\" aria-hidden=\"true\">💪</span>':ico(icon,16)}<span>${label}</span>",'compact muscle');
   // Touch perception is OPTIONAL, never inferred from a category or person.
   change("person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||'')}));touchEditingId='';", "person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||''),experience:String(fd.get('experience')||'')}));touchEditingId='';", 'touch edit perception');
   change("person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||'')}));\n  touchQuickOpen=false;", "person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||''),experience:String(fd.get('experience')||'')}));\n  touchQuickOpen=false;", 'touch save perception');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/touch-journal-v577.js')){
   let s=input;const change=(a,b,label)=>{s=replace(s,a,b,label);};
   change('export const TOUCH_KINDS=Object.freeze([',"import {touchExperienceOptions,touchAnalyticsView} from './touch-insights-v57735.js';\nexport const TOUCH_KINDS=Object.freeze([",'touch presentation imports');
   change("{id:'cuddle',icon:'🤗',name:'Kuscheln'}, {id:'kiss',icon:'💋',name:'Küssen'},", "{id:'cuddle',icon:'🤗',name:'Kuscheln'}, {id:'stroke',icon:'🖐️',name:'Streicheln'}, {id:'kiss',icon:'💋',name:'Küssen'}, {id:'massage',icon:'💆',name:'Massage'},",'new touch kinds');
   // Existing 'dance' is NOT duplicated.
   change("note='',deleted=false}={})", "note='',experience='',deleted=false}={})",'touch perception argument');
   change("note:String(note||'').trim().slice(0,500),deleted:!!deleted,updatedAt:new Date().toISOString()", "note:String(note||'').trim().slice(0,500),experience:['pleasant','neutral','unpleasant','unsure'].includes(experience)?experience:'',deleted:!!deleted,updatedAt:new Date().toISOString()",'touch perception persistence');
   change('<label>Notiz<input name="note" maxlength="500" placeholder="Optional"></label>', '<label>Wie hast du es erlebt? (optional)<select name="experience">${touchExperienceOptions()}</select></label><label>Notiz<input name="note" maxlength="500" placeholder="Optional"></label>','capture subjective experience');
   change('<label>Notiz<textarea name="note" maxlength="500" rows="2">${esc(edit.note)}</textarea></label>', '<label>Wie hast du es erlebt? (optional)<select name="experience">${touchExperienceOptions(edit.experience)}</select></label><label>Notiz<textarea name="note" maxlength="500" rows="2">${esc(edit.note)}</textarea></label>','edit subjective experience');
   change('<section class="work-card"><h3>Chronik</h3>', '${touchAnalyticsView(state,{period})}<section class="work-card"><h3>Chronik</h3>', 'descriptive touch timeline');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-insights-v57728.js')){
   let s=input;const change=(a,b,label)=>{s=replace(s,a,b,label);};
   change("const tone=x=>x===0?'#DBE5E1':x<2?'#B3D6CC':x<4?'#75B2A2':x<8?'#387C76':'#285F76';",
    "const tone=x=>x===0?'#DEE3E4':x<2?'#F6D86A':x<4?'#FAB342':x<8?'#F38331':'#D94839';\nconst roleTone=g=>!g||!(g.primary||g.secondary)?'#DEE3E4':g.primary>0?'#EA493B':'#F2C94C';", 'heat palette');
   change('function bodySvg(model,side){','function bodySvg(model,side,mode=\'roles\'){','anatomy colors mode');
   change('const group=byId[id],score=group?.index||0,color=tone(score),title=', "const group=byId[id],score=group?.index||0,color=mode==='roles'?roleTone(group):tone(score),title=",'anatomy SVG');
   change("aria-label=\"Muskelkarte ${side==='front'?'Vorderseite':'Rückseite'} · dunkler entspricht mehr dokumentierten Übungssätzen\"", "aria-label=\"Muskelkarte ${side==='front'?'Vorderseite':'Rückseite'} · ${mode==='roles'?'Rot für Haupt-, Gelb für unterstützende Muskelbeteiligung':'Gelb bis Rot für steigende dokumentierte Satzbeteiligung'}\"", 'accurate legend');
   change("[['front','Vorne'],['back','Hinten']]", "[['front','Haupt / Neben'],['back','Satzbelastung']]",'toggle mode labels');
   change('<div class="str728-visual"><div class="str728-body-panel">${bodySvg(m,side)}<p class="str728-caption">${side===\'front\'?\'Vorderseite\':\'Rückseite\'} · klassifizierte Übungssätze; Farbintensität nach dokumentierten Haupt- und Nebenbeteiligungen</p></div><div class="str728-distribution">',
    `<div class="str728-visual"><div class="str728-body-panel"><div class="str735-two-maps"><figure class="str735-map">\${bodySvg(m,'front',side==='back'?'load':'roles')}<figcaption>Vorne</figcaption></figure><figure class="str735-map">\${bodySvg(m,'back',side==='back'?'load':'roles')}<figcaption>Hinten</figcaption></figure></div><div class="str735-body-legend">\${side==='back'?'<span><i style="background:#F6D86A"></i> Wenige Sätze</span><span><i style="background:#F38331"></i> Mehr</span><span><i style="background:#D94839"></i> Viele</span>':'<span><i style="background:#EA493B"></i> Hauptmuskel</span><span><i style="background:#F2C94C"></i> Unterstützend</span>'}<span><i style="background:#DEE3E4"></i> Nicht zugeordnet</span></div><p class="str735-title">\${side==='back'?'Intensität der dokumentierten Satzbeteiligung; keine gemessene Muskelaktivierung.':'Zuordnung aus Übungsdatenbank; Kombinationen können mehrere Muskeln betreffen.'}</p></div><div class="str728-distribution">`, 'dual anatomy views');
   change('Keine klassifizierten Sätze <i style="background:#285F76"></i> mehr erfasste Satzbeteiligungen', 'Ohne zugeordnete Sätze <i style="background:#D94839"></i> viele Satzbeteiligungen', 'new legend');
   change('background:#DBE5E1', 'background:#DEE3E4', 'neutral color in legend');
   change('Die Muskelzuordnung ist eine nachvollziehbare <em>Heuristik aus FIT-Übungskategorien</em>', 'Die Muskelzuordnung ist eine nachvollziehbare <em>Annäherung aus importierten und manuell zugeordneten Übungen</em>', 'explain mapping source');
   change('Erfasst werden können Übungen, deren Garmin-Kategorie im exportierten FIT enthalten ist.', 'Du kannst offene Übungen direkt im Kraftsatz-Editor zuordnen.', 'no FIT obligation');
   change('Ohne Aktivitäts-FIT bleiben Übungsnamen und Muskelgruppen offen.', 'Fehlende Übungsnamen und Gewichte lassen sich im Compass-Editor ergänzen.', 'CSV guidance');
   return {code:s,map:null};
  }
  return null;
 }};
}
