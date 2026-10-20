/** Compass 0.5.67 — full-size, accessible relationship map.
 * The single closeness number controls radius; angle affects layout only.
 * Node positions/labels are deterministic and never written during a render.
 */
import {preference, mapAngle, contactImpulse, relatedProjectIds, RELATION_KINDS} from './relationship-radar-v564.js';
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const MAP567=Object.freeze({cx:490,cy:377,min:56,max:326,width:1000,height:760});
export const ZONES567=Object.freeze([
 {label:'Sehr nah',min:90,color:'#f59a9b',r:83},
 {label:'Nah',min:75,color:'#efbc9f',r:124},
 {label:'Vertraut',min:60,color:'#e6c78d',r:164},
 {label:'Locker',min:40,color:'#9fd0dd',r:218},
 {label:'Peripher',min:0,color:'#a8c9ec',r:326}
]);
export function closenessZone(score){const s=Math.max(0,Math.min(100,Number(score)||0));return ZONES567.find(z=>s>=z.min)||ZONES567.at(-1);}
export function closenessRadius(score){const s=Math.max(0,Math.min(100,Number(score)||0));return MAP567.min+(100-s)/100*(MAP567.max-MAP567.min);}
export function closenessAt(x,y){const r=Math.hypot(x-MAP567.cx,y-MAP567.cy);return Math.max(0,Math.min(100,Math.round(100*(1-(Math.max(MAP567.min,Math.min(MAP567.max,r))-MAP567.min)/(MAP567.max-MAP567.min)))));}
export function mapPlacement(people){
 const entries=(Array.isArray(people)?people:[]).filter(p=>p&&p.id).map(person=>{const p=preference(person);return {person,p,r:closenessRadius(p.closeness),a:mapAngle(person)};}).sort((a,b)=>String(a.person.id).localeCompare(String(b.person.id)));
 // Repel colliding markers tangentially (radius is never changed: the displayed closeness remains exact).
 for(let k=0;k<85;k++){
  const next=entries.map(()=>0);
  for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
   const a=entries[i],b=entries[j];const ax=MAP567.cx+Math.sin(a.a)*a.r,ay=MAP567.cy-Math.cos(a.a)*a.r,bx=MAP567.cx+Math.sin(b.a)*b.r,by=MAP567.cy-Math.cos(b.a)*b.r;
   const d=Math.hypot(ax-bx,ay-by),target=42;
   if(d<target){let sign=Math.sign(Math.sin(a.a-b.a));if(!sign)sign=i%2?1:-1;const delta=(target-d)/Math.max(90,a.r+b.r)*.20;next[i]+=sign*delta;next[j]-=sign*delta;}
  }
  entries.forEach((e,i)=>{e.a+=Math.max(-.12,Math.min(.12,next[i]));});
 }
 const pts=entries.map(e=>({...e,x:MAP567.cx+Math.sin(e.a)*e.r,y:MAP567.cy-Math.cos(e.a)*e.r}));
 // Edge-anchored callouts; collision-avoidance never changes closeness/radius.
 for(const side of ['left','right']){
  const group=pts.filter(e=>(e.x<MAP567.cx?'left':'right')===side).sort((a,b)=>a.y-b.y||String(a.person.id).localeCompare(String(b.person.id)));
  const pad=52,step=Math.min(47,(MAP567.height-pad*2)/Math.max(1,group.length-1));
  group.forEach((e,i)=>{e.labelX=side==='left'?18:805;e.labelY=Math.min(MAP567.height-pad,Math.max(pad,e.y));e.labelSide=side;});
  for(let i=1;i<group.length;i++)group[i].labelY=Math.max(group[i].labelY,group[i-1].labelY+step);
  if(group.length&&group.at(-1).labelY>MAP567.height-pad){const d=group.at(-1).labelY-(MAP567.height-pad);group.forEach(e=>e.labelY-=d);}
  if(group.length&&group[0].labelY<pad){const d=pad-group[0].labelY;group.forEach(e=>e.labelY+=d);}
 }
 return pts;
}
const genderSymbol=g=>g==='female'?'♀':g==='male'?'♂':g==='diverse'?'◇':'•';
const kindLabel=kind=>RELATION_KINDS.find(([id])=>id===kind)?.[1]||'Kontakt';
const personCard=(e,selected,today,projects)=>{
 const person=e.person,closeness=e.p.closeness,zone=closenessZone(closeness),active=person.id===selected?.id;
 const ci=contactImpulse(person,today),linked=relatedProjectIds(person,projects);
 // A deliberately generic portrait. Variant follows the *optional user-entered* marker,
 // never an inferred gender or invented real photograph.
 const avatar=e.p.gender==='female'?'<path d="M-12 9Q-18-18 0-17Q18-18 12 9Z" fill="#956a65"/><circle cy="-3" r="7" fill="#e9c3b0"/><path d="M-12 13Q-10 3 0 3Q10 3 12 13" fill="#bc8c99"/>':e.p.gender==='male'?'<circle cy="-4" r="7" fill="#e8c4ac"/><path d="M-8-6Q-8-16 0-13Q12-14 8-6L5-10Q-2-7-8-6" fill="#526c78"/><path d="M-12 13Q-11 4 0 4Q11 4 12 13" fill="#8aabb2"/>':'<circle cy="-4" r="7" fill="#d9c8ba"/><path d="M-12 13Q-11 4 0 4Q11 4 12 13" fill="#79939d"/>';

 const tooltip=`${person.name} · ${kindLabel(e.p.kind)} · Nähe ${closeness}/100 (${zone.label}) · ${ci.daysSince==null?'Kontakt nicht dokumentiert':`letzter Kontakt vor ${ci.daysSince} Tagen`} · ${linked.length} Projekte`;
 const anchors=e.labelSide==='left'?{end:e.labelX+185,start:e.x-19}: {end:e.labelX-9,start:e.x+19};
 const connector=`M${anchors.start.toFixed(1)},${e.y.toFixed(1)} Q${((anchors.start+anchors.end)/2).toFixed(1)},${e.labelY.toFixed(1)} ${anchors.end.toFixed(1)},${e.labelY.toFixed(1)}`;
 return `<g class="rel567-person ${active?'is-selected':''}" tabindex="0" role="button" aria-label="${h(tooltip)}. Mit Pfeiltasten um einen Nähepunkt bewegen" data-person-node="${h(person.id)}" transform="translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})">
 <title>${h(tooltip)}</title><circle class="rel567-halo" r="${active?26:23}" stroke="${zone.color}"/><circle r="18" fill="#fff" stroke="${zone.color}" stroke-width="3"/>${avatar}<text x="16" y="-16" class="rel567-gender ${e.p.gender||'unknown'}">${genderSymbol(e.p.gender)}</text>
 <g transform="translate(14,15)"><circle r="12" fill="#ffffff" stroke="${zone.color}" stroke-width="2"/><text y="4" text-anchor="middle" class="rel567-number">${closeness}</text></g></g><path class="rel567-leader ${active?'is-active':''}" d="${connector}"/><g data-action="person-select" data-id="${h(person.id)}" class="rel567-label ${active?'is-selected':''}" tabindex="0" role="button" aria-label="${h(tooltip)} auswählen"><text x="${e.labelX}" y="${e.labelY-4}" font-weight="700" font-size="13">${h(person.name)}</text><text x="${e.labelX}" y="${e.labelY+12}" font-size="11">${h(zone.label)} · ${closeness}/100 ${linked.length?`· ${linked.length} Projekt${linked.length===1?'':'e'}`:''}</text></g>`;
};
export function relationshipMapView(people,selected,{focus=false,filter='all',today='2026-10-20',projects={},inspector=''}={}){
 const filtered=(Array.isArray(people)?people:[]).filter(person=>{const p=preference(person);if(filter==='all')return true;if(filter==='impulse')return contactImpulse(person,today).due;if(filter==='project')return relatedProjectIds(person,projects).length>0;return p.kind===filter;});
 const pts=mapPlacement(filtered),m=MAP567;
 const unique='rel567-background';
 const filters=[['all','Alle'],['family','Familie'],['friend','Freunde'],['colleague','Arbeit'],['partner','Partner'],['impulse','Kontaktimpuls'],['project','Mit Projekt']];
 const controls=`<div class="rel567-toolbar"><div class="rel567-heading"><small>COMPASS · RELATIONSHIP INTELLIGENCE</small><h2>Beziehungslandkarte</h2><p>${filtered.length} von ${people.length} Menschen · Nähe auf einer Skala von 0 bis 100</p></div><div class="rel567-tools"><div class="rel567-filters" aria-label="Kontakte filtern">${filters.map(([id,label])=>`<button type="button" data-action="rel567-filter" data-id="${id}" class="${filter===id?'is-current':''}" aria-pressed="${filter===id}">${label}</button>`).join('')}</div><button type="button" class="rel567-focus-button" data-action="rel567-focus" aria-label="${focus?'Fokusansicht schließen':'Beziehungslandkarte im Vollbild öffnen'}">${focus?'↙ Schließen':'⛶ Fokusansicht'}</button></div></div>`;
 const svg=`<svg id="relationship-map" class="relationship-map rel567-svg" viewBox="0 0 ${m.width} ${m.height}" role="group" aria-label="Beziehungslandkarte; Nähe der Personen als Entfernung von Ich" preserveAspectRatio="xMidYMid meet">
 <defs><radialGradient id="${unique}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f7b7ad" stop-opacity=".80"/><stop offset="26%" stop-color="#f7d6c6" stop-opacity=".70"/><stop offset="55%" stop-color="#faf2e8" stop-opacity=".77"/><stop offset="78%" stop-color="#e8f3f7" stop-opacity=".87"/><stop offset="100%" stop-color="#d8ebf8" stop-opacity=".95"/></radialGradient></defs>
 <circle cx="${m.cx}" cy="${m.cy}" r="334" fill="url(#${unique})" stroke="#bed5e0" stroke-width="1.4"/>
 ${[83,124,164,218,326].map((r,i)=>`<circle cx="${m.cx}" cy="${m.cy}" r="${r}" fill="none" stroke="${ZONES567[i].color}" stroke-width="${i===4?1.6:1.3}" stroke-dasharray="${i===4?'none':'5 6'}" opacity=".92"/>`).join('')}
 ${ZONES567.map((z,i)=>`<text x="${m.cx}" y="${m.cy-(i===0?58:[0,105,146,200,305][i])}" text-anchor="middle" class="rel567-zone-name">${z.label}</text>`).join('')}
 ${pts.map(e=>personCard(e,selected,today,projects)).join('')}
 <circle cx="${m.cx}" cy="${m.cy}" r="28" fill="#225766" stroke="#ecfcf8" stroke-width="4"/><text x="${m.cx}" y="${m.cy+6}" fill="white" text-anchor="middle" font-size="20" font-weight="750">Ich</text></svg>`;
 const legend=`<div class="rel567-legend"><span>❤️ 90–100 · Sehr nah</span><span>75–89 · Nah</span><span>60–74 · Vertraut</span><span>40–59 · Locker</span><span>❄️ 0–39 · Peripher</span><span>♀ ♂ ◇ · freiwillige Geschlechtsangabe</span></div>`;
 const body=`${controls}<div class="rel567-workspace"><div class="rel567-canvas"><div class="rel567-map-scroll">${svg}</div>${legend}<p class="rel567-help">Ziehen verändert Nähe und Position. Pfeiltasten: Nähe ±1 · Umschalt + Pfeiltaste: ±5 · Enter: Person auswählen. Alle Angaben bleiben lokal verschlüsselt.</p></div>${focus?`<aside class="rel567-sidebar"><div class="rel567-sidebar-head"><strong>${selected?h(selected.name):'Person auswählen'}</strong><button type="button" data-action="rel567-focus" title="Schließen">×</button></div>${inspector||'<p>Wähle einen Kontakt auf der Karte.</p>'}</aside>`:''}</div>`;
 return focus?`<div class="rel567-overlay" role="dialog" aria-modal="true" aria-label="Beziehungslandkarte Vollbild" tabindex="-1">${body}</div>`:`<section class="work-card relationship-map-card rel567-card">${body}</section>`;
}
