/** Compass 0.5.91.43 · Transparent, aligned before/after Smart-Tape comparison.
 * Circumferences do not determine a 3D shape or exact frontal breadth. Both
 * dated snapshots use identical elliptical-depth priors and one shared cm/px
 * scale. Amplified differences are EXPLICITLY illustrative, never raw change.
 * The SVG is pure, no dependencies and never writes training/measurement data.
 */
import {modelledFrontWidthCm} from './body-proportions-v059120.js';
const valid=x=>typeof x==='number'&&Number.isFinite(x)&&x>0;
const num=x=>Math.round(x*100)/100;
const signed=x=>`${x>0?'+':''}${x.toLocaleString('de-AT',{maximumFractionDigits:1,minimumFractionDigits:1})}`;
const tag=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const points=[[0,'Schulter','shoulder'],[1,'Brust','chest'],[2,'Taille','waist'],[3,'Hüfte','hip']];
const DEEP=Object.freeze({shoulder:.55,chest:.68,waist:.70,hip:.78,neck:.88,head:.97,leftUpperArm:.88,rightUpperArm:.88,leftThigh:.90,rightThigh:.90,leftCalf:.87,rightCalf:.87});
const CX=175,TOP=15,SCALE=2.22;
const ys={shoulder:112,chest:145,waist:210,hip:251,head:49,neck:85,elbow:191,wrist:257,thigh:292,knee:346,calf:391,ankle:445};
const fx=x=>Number(x).toFixed(2);
const relative=(previous,current,multiple)=>valid(previous)&&valid(current)?previous+(current-previous)*multiple:(valid(current)?current:previous);
/** Ellipse width in cm converted to the same display scale as anatomical heights.
 * Heights/landmarks are assumed fixed fractions of stature, NOT measured limb lengths. */
export function vtaperOverlayGeometry143(snapshot,{reference=null,exaggeration=1}={}){
 const curr=snapshot?.values||{},prev=reference?.values||{};
 const width=(key)=>{
  const raw=relative(prev[key],curr[key],exaggeration);
  if(!valid(raw))return null;
  const calculated=modelledFrontWidthCm(raw,DEEP[key]||.78);
  return valid(calculated)?num(calculated*SCALE):null;
 };
 const w=Object.fromEntries(Object.keys(DEEP).map(key=>[key,width(key)]));
 // Never invent segment measurements: an absent circumference uses a fixed
 // anatomical drawing placeholder only. It never yields a numeric delta label.
 const fallback={shoulder:95,chest:83,waist:74,hip:85,head:40,neck:25,leftUpperArm:24,rightUpperArm:24,leftThigh:39,rightThigh:39,leftCalf:25,rightCalf:25};
 for(const key of Object.keys(w))if(w[key]===null)w[key]=fallback[key];
 return {w,values:curr,day:snapshot?.day??null};
}
const torsoAnchors=g=>[['shoulder',g.w.shoulder/2],['chest',g.w.chest/2],['waist',g.w.waist/2],['hip',g.w.hip/2]];
const halfAt=(g,y)=>{
 const a=torsoAnchors(g);
 if(y<=ys.shoulder)return a[0][1];
 if(y>=ys.hip)return a.at(-1)[1];
 for(let i=0;i<a.length-1;i++){
  const y0=ys[a[i][0]],y1=ys[a[i+1][0]];
  if(y<=y1){const t=(y-y0)/(y1-y0),ease=(1-Math.cos(Math.PI*t))/2;return a[i][1]*(1-ease)+a[i+1][1]*ease;}
 }
 return a.at(-1)[1];
};
const pathThrough=p=>'M '+p.map(([x,y])=>`${fx(x)} ${fx(y)}`).join(' L ')+' Z';
const poly=(points)=>pathThrough(points);
function torsoPath(g){
 const left=[],right=[];
 for(let y=ys.shoulder;y<=ys.hip;y+=3){const h=halfAt(g,y);left.push([CX-h,y]);right.push([CX+h,y]);}
 const h=halfAt(g,ys.hip);left.push([CX-h,ys.hip]);right.push([CX+h,ys.hip]);
 return poly([...left,...right.reverse()]);
}
function upperArmPath(g,side){
 const width=side<0?g.w.rightUpperArm:g.w.leftUpperArm;
 const r=width/2;
 const shoulder=side*(g.w.shoulder/2+3),elbow=shoulder+side*17,wrist=shoulder+side*15;
 const p=[[CX+shoulder-side*r,ys.shoulder],[CX+shoulder+side*r,ys.shoulder],
  [CX+elbow+side*r*.86,ys.elbow],[CX+wrist+side*r*.60,ys.wrist],
  [CX+wrist-side*r*.60,ys.wrist],[CX+elbow-side*r*.86,ys.elbow]];
 return poly(p);
}
function legPath(g,side){
 const thighW=side<0?g.w.rightThigh:g.w.leftThigh;
 const calfW=side<0?g.w.rightCalf:g.w.leftCalf;
 const center=CX+side*(g.w.hip*.26),ankleCenter=center+side*5;
 const thigh=thighW/2,calf=calfW/2;
 return poly([[center-thigh,ys.hip],[center+thigh,ys.hip],[center+thigh*.80,ys.thigh],
  [center+thigh*.53,ys.knee],[center+calf,ys.calf],[ankleCenter+calf*.45,ys.ankle],
  [ankleCenter-calf*.45,ys.ankle],[center-calf,ys.calf],[center-thigh*.53,ys.knee],[center-thigh*.80,ys.thigh]]);
}
function shape(g,{stroke,fill,opacity=1,strokeWidth=1.8}={}){
 const p=[legPath(g,-1),legPath(g,1),upperArmPath(g,-1),upperArmPath(g,1),torsoPath(g)];
 return `<g fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round">${p.map(d=>`<path d="${d}"/>`).join('')}<rect x="${fx(CX-g.w.neck/2)}" y="${ys.neck}" width="${fx(g.w.neck)}" height="${ys.shoulder-ys.neck+1}" rx="6"/><ellipse cx="${CX}" cy="${ys.head}" rx="${fx(g.w.head/2)}" ry="29"/></g>`;
}
function torsoDifference(previous,current){
 const bands=[];
 for(let k=0;k<3;k++){
  const y0=ys[points[k][2]],y1=ys[points[k+1][2]];
  for(let y=y0;y<y1;y+=4){
   const end=Math.min(y1,y+4),p0=halfAt(previous,y),p1=halfAt(previous,end),n0=halfAt(current,y),n1=halfAt(current,end);
   if(Math.max(Math.abs(p0-n0),Math.abs(p1-n1))<.035)continue;
   const fill=(n0+n1>p0+p1)?'#45b7a7':'#6caad2';
   for(const s of [-1,1])bands.push(`<path d="${poly([[CX+s*p0,y],[CX+s*p1,end],[CX+s*n1,end],[CX+s*n0,y]])}" fill="${fill}" fill-opacity=".84"/>`);
  }
 }
 return bands.join('');
}
function regionalMarkers(previous,current,{exaggeration=1}={}){
 return points.map(([,label,key],i)=>{
  const old=previous.values[key],now=current.values[key];
  if(!valid(old)||!valid(now))return '';
  const delta=now-old,y=ys[key];
  const r=Math.max(halfAt(previous,y),halfAt(current,y));
  const position=285;
  return `<g><line x1="${fx(CX+r)}" y1="${y}" x2="${fx(position-4)}" y2="${y}" stroke="#d0e2ec" stroke-opacity=".65" stroke-width=".9"/><text x="${fx(position)}" y="${y-3}" fill="#e7edf1" font-size="10.5" font-weight="600">${label}</text><text x="${fx(position)}" y="${y+11}" fill="${delta>0?'#8ee4cb':delta<0?'#9bccf1':'#d1d9e3'}" font-size="11" font-weight="700">${tag(signed(delta))} cm</text></g>`;
 }).join('');
}
/** Full-body and torso use exactly the SAME underlying physical model.
 * Vary only the viewBox; 5× display is always labelled as exaggerated. */
export function vtaperOverlaySvg143(first,last,{heightCm=null,exaggeration=1,view='torso'}={}){
 if(!first||!last)return '<p class="vt143-empty">Für die Überlagerung sind zwei vollständige Smart-Tape-Messtage nötig.</p>';
 const original=vtaperOverlayGeometry143(first),latest=vtaperOverlayGeometry143(last,{reference:first,exaggeration});
 // Frontal dimensions are modelled from actual cm; limb segment lengths and
 // height landmarks remain anatomical assumptions, not direct measurements.
 const box=view==='full'?'0 0 425 462':'0 14 425 265';
 const title=`Modellierte Überlagerung: erste Messung ${first.day}, letzte Messung ${last.day}. Umfänge bei identischen angenommenen Querschnittstiefen. ${exaggeration!==1?'Veränderungen optisch um Faktor '+exaggeration+' verstärkt, keine realmaßstäbliche Kontur.':'Unterschiede innerhalb des gemeinsamen Modellmaßstabs.'}`;
 const rings=[['Schulter','shoulder'],['Brust','chest'],['Taille','waist'],['Hüfte','hip']].map(([label,key])=>{
  const y=ys[key],old=halfAt(original,y),cur=halfAt(latest,y);
  return `<g><line x1="${fx(CX-old)}" y1="${y}" x2="${fx(CX+old)}" y2="${y}" stroke="#aec0d2" stroke-dasharray="4 4" stroke-width="1.1"/><line x1="${fx(CX-cur)}" y1="${y+1.6}" x2="${fx(CX+cur)}" y2="${y+1.6}" stroke="#eccb85" stroke-dasharray="3 2" stroke-width="1.1"><title>${label}: Vorher ${original.values[key]??'unbekannt'} cm, aktuell ${latest.values[key]??'unbekannt'} cm</title></line></g>`;
 }).join('');
 const segments=[['Oberarm links','leftUpperArm'],['Oberarm rechts','rightUpperArm'],['Oberschenkel links','leftThigh'],['Oberschenkel rechts','rightThigh'],['Wade links','leftCalf'],['Wade rechts','rightCalf']].filter(([,k])=>valid(first.values[k])&&valid(last.values[k]));
 const regionNotes=segments.map(([label,key])=>`${label}: ${signed(last.values[key]-first.values[key])} cm`).join(' · ');
 return `<svg class="vt143-svg" viewBox="${box}" role="img" preserveAspectRatio="xMidYMid meet" aria-label="${tag(title)}"><title>${tag(title)}</title>
 <g opacity=".10">${[ys.shoulder,ys.chest,ys.waist,ys.hip].map(y=>`<line x1="13" x2="405" y1="${y}" y2="${y}" stroke="#bbcfe3" stroke-width=".7"/>`).join('')}</g>
 ${shape(original,{stroke:'#afc5d7',fill:'#8094a7',opacity:.10,strokeWidth:2.0})}
 <g aria-label="Geschätzte Änderung der Frontbreite, grün größer, blau kleiner">${torsoDifference(original,latest)}</g>
 ${shape(latest,{stroke:'#eec985',fill:'#eccb85',opacity:.11,strokeWidth:2.1})}
 ${rings}<line x1="${CX}" x2="${CX}" y1="${ys.head-30}" y2="${ys.ankle}" stroke="#e0edf5" stroke-opacity=".22" stroke-dasharray="3 6"/>
 ${regionalMarkers(original,latest,{exaggeration})}
 <desc>Beide Körperkonturen benutzen identische anatomische Annahmen, gleiche Körperhöhe und denselben Modellmaßstab. ${tag(regionNotes)}. Ein Umfang allein erlaubt keine exakte Rückrechnung der tatsächlichen Körperbreite oder Tiefe.</desc></svg>`;
}
/** Toggle state stays local to this dashboard and survives no vault writes. */
export function vtaperOverlayPanel143(first,last,{heightCm=null,pump=false}={}){
 if(!first||!last)return '<div class="vt143-empty">Nach dem zweiten vollständig erfassten Smart-Tape-Termin erscheint hier die überlagerte Kontur.</div>';
 return `<div class="vt143-widget" aria-label="Überlagerter Körpervergleich"><div class="vt143-switch" role="group" aria-label="Darstellung der Silhouetten">
 <label><input type="radio" name="vt143-mode" value="real" checked/> Originalmaßstab</label>
 <label><input type="radio" name="vt143-mode" value="focus"/> Differenzen ×5</label>
 <label><input type="radio" name="vt143-mode" value="full"/> Ganzer Körper</label></div>
 <div class="vt143-panel vt143-real">${vtaperOverlaySvg143(first,last,{heightCm,view:'torso'})}</div>
 <div class="vt143-panel vt143-focus">${vtaperOverlaySvg143(first,last,{heightCm,view:'torso',exaggeration:5})}<p class="vt143-amplification">Nur zur besseren Sichtbarkeit: Unterschiede fünffach vergrößert. Zahlen und tatsächlich gemessene Umfänge bleiben unverändert.</p></div>
 <div class="vt143-panel vt143-full">${vtaperOverlaySvg143(first,last,{heightCm,view:'full'})}</div>
 <div class="vt143-key"><span><i style="background:#afc5d7"></i> Vorher (${tag(first.day)})</span><span><i style="background:#eec985"></i> Aktuell (${tag(last.day)})</span><span><i style="background:#45b7a7"></i> Größer</span><span><i style="background:#6caad2"></i> Kleiner</span></div>
 <p class="vt143-note">Gemeinsamer Modellmaßstab aus originalen Umfängen und identischen Ellipsenannahmen. Das ist <strong>kein Körperscan</strong> und keine anatomisch exakte 3D-Rekonstruktion. Kleine Unterschiede können trotz maßgleicher Darstellung kaum sichtbar sein.${pump?' Mindestens eine Messung erfolgte nach einem Workout: Pump bei oberen Muskelgruppen möglich.':''}</p></div>`;
}
