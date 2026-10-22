/** Compass 0.5.70.5: original, locally searchable emotion vocabulary.
 * Inspired by emotional literacy and differentiated emotion families, NOT a
 * transcription/redistribution of any DEI or other copyrighted word list.
 * Core feelings, body states and needs are different kinds of observations.
 */
import {FEELING_DEPTH} from './feeling-depth-v5681.js';
const base=[
 ['Überfordert','zustand','', '', 'überlastet,alles zu viel,zu viel,stress,gestresst'],
 ['Angespannt','körper','', '', 'angespannt,unter spannung,stress,gestresst,angestrengt'],
 ['Getrieben','zustand','', '', 'gehetzt,druck,zeitdruck,stress,gestresst'],
 ['Erschöpft','körper','', '', 'ausgelaugt,kaputt,müde,keine energie,gestresst'],
 ['Rastlos','körper','', '', 'ruhelos,unruhig,stress,gestresst'],
 ['Unter Druck','zustand','', '', 'stress,gestresst,termin,deadline,gehetzt'],
 ['Genervt','gefühl','anger','Reizung','genervt,stress,gestresst,angepisst'],
 ['Gereizt','gefühl','anger','Reizung','gereizt,genervt,gestresst'],
 ['Frustriert','gefühl','anger','Frustration','frust,frustriert,nervt,genervt'],
 ['Besorgt','gefühl','fear','Unsicherheit','stress,gestresst,ängstlich,angst,sorgen'],
 ['Unsicher','gefühl','fear','Unsicherheit','verunsichert,unsicher,ängstlich'],
 ['Nervös','gefühl','fear','Unsicherheit','aufgeregt,nervoes,nervosität'],
 ['Neugierig','gefühl','joy','Interesse','interessiert,neugierig,aufgeregt'],
 ['Begeistert','gefühl','joy','Lebensfreude','euphorisch,aufgeregt,freude,begeistert'],
 ['Hoffnungsvoll','gefühl','joy','Optimismus','optimistisch,zuversichtlich,hoffnung'],
 ['Vorfreudig','gefühl','joy','Optimismus','aufgeregt,freu mich,freude,vorfreude'],
 ['Verletzt','gefühl','anger','Grenzen','zurückgewiesen,zurueckgewiesen,gekränkt,abgelehnt'],
 ['Enttäuscht','gefühl','sadness','Enttäuschung','enttaeuscht,verletzt,gekränkt,frustriert'],
 ['Traurig','gefühl','sadness','Abschied','traurig,bedrückt,leer,verloren'],
 ['Niedergeschlagen','gefühl','sadness','Enttäuschung','leer,entmutigt,traurig'],
 ['Abgestumpft','zustand','', '', 'leer,taub,gefühllos,nichts fühlen,abgeschaltet'],
 ['Abwesend','zustand','', '', 'leer,neben mir,abgekoppelt,unverbunden'],
 ['Verwirrt','zustand','', '', 'verwirrt,ratlos,orientierungslos,verwirrung'],
 ['Zerrissen','zustand','', '', 'hin und her,unentschlossen,ambivalent'],
 ['Beschämt','gefühl','', '', 'scham,peinlich,blamiert,beschämt'],
 ['Schuldig','gefühl','', '', 'schuld,schlechtes gewissen,bereue,schuldig'],
 ['Reumütig','gefühl','', '', 'schuld,bereuen,reue,gewissen'],
 ['Eifersüchtig','gefühl','', '', 'eifersucht,eifersüchtig,unsicher,verlustangst'],
 ['Neidisch','gefühl','', '', 'neid,neidisch,vergleichen,vergleich'],
 ['Angewidert','gefühl','', '', 'ekel,angewidert,abgestoßen'],
 ['Erschrocken','gefühl','fear','Bedrohung','schreck,erschrocken,panik,aufgeregt'],
 ['Überrascht','gefühl','', '', 'überrascht,erstaunt,unerwartet'],
 ['Einsam','zustand','', '', 'allein,einsam,isoliert,unverbunden'],
 ['Sehnsüchtig','gefühl','sadness','Abschied','sehnsucht,vermissen,vermisse'],
 ['Dankbar','gefühl','joy','Erfüllung','dankbarkeit,dankbar,berührt'],
 ['Erleichtert','gefühl','joy','Lebensfreude','leichter,erleichtert,aufatmen'],
 ['Geborgen','gefühl','calm','Sicherheit','geborgen,sicher,verbunden'],
 ['Gelassen','gefühl','calm','Gelassenheit','ruhig,entspannt,gelassen,ausgeglichen'],
 ['Verbunden','gefühl','affection','Verbundenheit','nahe,verbunden,zugehörig'],
 ['Zärtlich','gefühl','affection','Zärtlichkeit','zuneigung,zärtlich,liebevoll'],
 ['Erotisches Verlangen','impuls','','','lust,sexuelle lust,begehren,sexuelles verlangen,erotik'],
 ['Sexuell erregt','körper','','','sexuelle erregung,körperlich erregt,lust,erotisch'],
 ['Sexuelle Lust','impuls','', '', 'lust,sexuelle lust,begehren,sex'],
 ['Rückzug','bedürfnis','', '', 'meine ruhe,rückzug,abstand,allein sein'],
 ['Ruhe','bedürfnis','', '', 'pause,ruhe,stille,auftanken'],
 ['Nähe','bedürfnis','', '', 'nähe,kuscheln,verbunden sein'],
 ['Anerkennung','bedürfnis','', '', 'wertschätzung,anerkennung,gehört werden'],
 ['Orientierung','bedürfnis','', '', 'orientierung,klarheit,überblick,verwirrt'],
 ['Freiraum','bedürfnis','', '', 'freiraum,autonomie,unabhängigkeit,raum'],
 ['Süßes essen','impuls','', '', 'schokolade,snacken,süßes,naschlust,stress'],
 ['Bewegen','impuls','', '', 'laufen,spazieren,bewegung,rausgehen'],
 ];
// Curated additions from Compass's own pre-existing three-level taxonomy.
const rows=[...base];
for(const [root,families] of Object.entries(FEELING_DEPTH)){
 for(const [family,words] of families)for(const word of words){
  if(!rows.some(r=>r[0].toLocaleLowerCase('de')===word.toLocaleLowerCase('de')))rows.push([word,'gefühl',root,family,`${word},${family}`]);
 }
}
function fold(input){return String(input??'').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();}
const terms=rows.map(([word,kind,root,family,alias])=>Object.freeze({id:`${kind}:${root||'allgemein'}:${fold(word).replaceAll(' ','-')}`,word,kind,root,family,aliases:alias.split(',').map(fold)}));
export const EMOTION_NETWORK_TERMS=Object.freeze(terms);
const lookup=new Map(terms.map(t=>[t.id,t]));
export function networkTermById(id){return lookup.get(String(id))||null;}
const seeds=[
 {aliases:['gestresst','stress','ueberlastet','uberlastet','unter druck','gehetzt','alles zu viel'],words:['Überfordert','Angespannt','Getrieben','Erschöpft','Gereizt','Besorgt','Rastlos','Ruhe','Rückzug','Unter Druck']},
 {aliases:['genervt','gereizt','frust','frustriert'],words:['Genervt','Gereizt','Frustriert','Verletzt','Enttäuscht','Rückzug','Ruhe']},
 {aliases:['aufgeregt','aufregung','aufgeregt sein'],words:['Nervös','Vorfreudig','Begeistert','Besorgt','Neugierig','Erschrocken']},
 {aliases:['leer','ausgebrannt','gefuhllos','gefühllos','nichts fühlen','nebendran'],words:['Abgestumpft','Abwesend','Erschöpft','Traurig','Niedergeschlagen','Rückzug']},
 {aliases:['eifersucht','eifersuchtig','eifersüchtig'],words:['Eifersüchtig','Unsicher','Verletzt','Besorgt','Nähe','Anerkennung']},
 {aliases:['schlechtes gewissen','schuldig','schuldgefuhl'],words:['Schuldig','Reumütig','Beschämt','Verletzt']},
 {aliases:['traurig','traurigkeit','niedergeschlagen'],words:['Traurig','Niedergeschlagen','Sehnsüchtig','Einsam','Enttäuscht']},
 {aliases:['froh','freude','glucklich','glücklich','gut drauf'],words:['Begeistert','Dankbar','Erleichtert','Neugierig','Geborgen','Vorfreudig']},
 {aliases:['verwirrt','verwirrung','ratlos'],words:['Verwirrt','Zerrissen','Unsicher','Orientierung']},
 {aliases:['mude','müde','erschopft','erschöpft'],words:['Erschöpft','Angespannt','Ruhe','Rückzug','Gelassen']},
 {aliases:['lust','erotisch','erotik','begehren','sexuelle anziehung','sinnlichkeit','sexuelle lust','sexuell erregt'],words:['Lustvoll','Sinnlich','Erotisch angezogen','Begehrend','Verlangend','Sexuelle Lust','Sexuell erregt','Nähe','Zärtlich']},
 {aliases:['zuneigung','liebe','verbundenheit','zaertlichkeit','zärtlichkeit','intimität'],words:['Zärtlich','Liebevoll','Verbunden','Sinnlich','Begehrend','Lustvoll','Erotisch angezogen']}

 ];
export function findEmotionNetwork(raw,{limit=10}={}){
 const q=fold(raw);const max=Math.max(2,Math.min(12,Number(limit)||10));
 const seed=seeds.find(s=>s.aliases.some(alias=>q.includes(fold(alias))));
 const favorites=seed?.words||[];
 const matches=terms.map(term=>{
  const name=fold(term.word),family=fold(term.family),aliases=term.aliases;
  const direct=q&&(name===q||aliases.some(v=>v===q));
  const contains=q&&(q.includes(name)&&name.length>2||aliases.some(v=>v.length>2&&q.includes(v)));
  const wordMatch=q&&q.split(' ').filter(w=>w.length>=3).some(w=>name.includes(w)||aliases.some(v=>v.includes(w)));
  const rank=favorites.indexOf(term.word);
  const score=rank>=0?300-rank*4:direct?190:contains?130:wordMatch?70:0;
  return {...term,score};
 }).filter(t=>t.score>0).sort((a,b)=>b.score-a.score||a.word.localeCompare(b.word,'de'));
 const fallback=terms.filter(t=>['Angespannt','Freudig','Unsicher','Gereizt','Erleichtert','Überfordert','Ruhig','Neugierig','Verwirrt','Geborgen'].includes(t.word));
 const selected=(q?matches:fallback).slice(0,max);
 return {query:raw||'',recognized:!!seed,words:selected};
}
export function toggleNetworkTerm(draft,id){
 const term=networkTermById(id);if(!term)throw Error('Begriff ist nicht bekannt.');
 const current=Array.isArray(draft?.networkTerms)?draft.networkTerms:[];
 const already=current.includes(term.id);
 const next=already?current.filter(t=>t!==term.id):[...current,term.id];
 const selected={...(draft?.selected||{})};
 const details={...(draft?.details||{})};
 const autoRoots=new Set(draft?.autoRoots||[]);
 if(!already&&term.root){
  if(!Object.hasOwn(selected,term.root)){selected[term.root]=5;autoRoots.add(term.root);}
  if(term.family){const possible=(FEELING_DEPTH[term.root]||[]).find(g=>g[0]===term.family);
   if(possible)details[term.root]={family:term.family,...(possible[1].includes(term.word)?{nuance:term.word}:{})};}
 }
 // If a suggested emotion was the *only* reason for auto-selecting the root,
 // deselecting the last matching suggestion must remove that root too.
 if(already&&term.root&&autoRoots.has(term.root)&&!next.some(t=>networkTermById(t)?.root===term.root)){
  delete selected[term.root];delete details[term.root];autoRoots.delete(term.root);
 }
 return {...draft,networkTerms:next,selected,details,autoRoots:[...autoRoots]};
}
export function validatedNetworkTerms(ids=[]){if(!Array.isArray(ids)||ids.length>20)throw Error('Zu viele Gefühlsbegriffe.');if(ids.some(id=>!networkTermById(id)))throw Error('Gefühlsbegriff ist unbekannt.');return [...new Set(ids.map(String))];}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hue={gefühl:'#f2b8a4',zustand:'#b6ccde',körper:'#9bcbb6',bedürfnis:'#e5d4a9',impuls:'#dbc3d5'};
export function renderFeelingNetwork(draft){
 const result=findEmotionNetwork(draft?.ownWords||'');const picked=new Set(draft?.networkTerms||[]);
 const words=result.words;const count=words.length;
 const coordinates=[[50,9],[78,17],[88,38],[81,65],[66,85],[34,85],[19,65],[12,38],[22,17],[50,91]];
 const lines=words.map((w,i)=>{const [x,y]=coordinates[i]||[50,50];return `<line x1="50" y1="49" x2="${x}" y2="${y}" stroke="${hue[w.kind]||'#b6ccde'}" stroke-width=".45" opacity=".6" stroke-dasharray="1.4 1.6"/>`;}).join('');
 return `<div class="fw705-network-wrap" aria-label="Anklickbare Gefühlswolke"><div class="fw705-network-graph"><svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg><span class="fw705-network-center">${esc((draft?.ownWords||'').trim().slice(0,50)||'Wie fühle ich mich?')}</span><div class="fw705-nodes">${words.map((w,i)=>{const [x,y]=coordinates[i]||[50,50];return `<button type="button" class="fw705-node ${picked.has(w.id)?'active':''} fw705-kind-${w.kind}" style="--x:${x}%;--y:${y}%;--node-color:${hue[w.kind]||'#c8d7e2'}" data-action="feeling-network-term" data-id="${esc(w.id)}" aria-pressed="${picked.has(w.id)}" title="${esc(w.kind==='gefühl'?'Gefühl':w.kind==='körper'?'Körperzustand':w.kind==='bedürfnis'?'Bedürfnis':w.kind==='impuls'?'Impuls':'Zustand')}"><span>${esc(w.word)}</span>${picked.has(w.id)?'<b aria-hidden="true">✓</b>':''}</button>`;}).join('')}</div></div>
 ${!count?'<p class="fw705-network-empty">Noch keine passende Verbindung. Du kannst deine eigenen Worte trotzdem speichern.</p>':''}<div class="fw705-legend">${[['gefühl','Gefühl'],['zustand','Zustand'],['körper','Körper'],['bedürfnis','Bedürfnis'],['impuls','Impuls']].map(([id,label])=>`<span><i style="background:${hue[id]}"></i>${label}</span>`).join('')}</div>
 <p class="fw705-hint">Tippe einen Begriff an. Mehrere können gleichzeitig passen; die Vorschläge sind keine Diagnose.</p></div>`;
}
