/** Compass 0.5.83 · privacy-preserving, one-page, vector Life in Weeks PDF.
 * Pure in-browser generator: no CDN, external library, upload or backend needed.
 * Use local vault data ONLY after unlocking Compass. PDF export is unencrypted;
 * the download UI warns before saving a PDF outside the encrypted vault.
 */
import {LIFE_BIRTHDAY,LIFE_EVENT_CATEGORIES,lifeElapsedMetrics,lifeMonthMarkers,lifeWeekCells,lifeYearTier} from './life-weeks-v0582.js';

const PAGE_SIZES=Object.freeze({A4:[841.89,595.28],A3:[1190.55,841.89]});
const DAY=86400000;
function checkDay(day){if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;const t=Date.parse(day+'T00:00:00Z');return Number.isFinite(t)&&new Date(t).toISOString().slice(0,10)===day;}
function clip(n,low,high){return Math.max(low,Math.min(high,n));}
function n(v){return Number(v.toFixed(2)).toString();}
function rgb(hex){const h=hex.replace('#','');const m=h.length===6?h:'000000';return [0,2,4].map(i=>parseInt(m.slice(i,i+2),16)/255);}
function ink(hex){return rgb(hex).map(n).join(' ');}
const encoder=new TextEncoder();
// Standard WinAnsiEncoding handles German umlauts and a number of European punctuation marks.
const WIN1252={8364:128,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,381:142,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,382:158,376:159};
function pdfLiteral(value){let out='';for(const char of String(value??'')){
 const cp=char.codePointAt(0);const b=cp<128?cp:cp<=255?cp:WIN1252[cp];
 if(b===undefined){out+='?';continue;}
 if(b===40||b===41||b===92){out+='\\'+String.fromCharCode(b);continue;}
 if(b<32||b>=127){out+='\\'+b.toString(8).padStart(3,'0');continue;}
 out+=String.fromCharCode(b);
 }return '('+out+')';}
function isoLocal(today){return checkDay(today)?today:'2026-10-31';}
function fmtDate(s){return s.split('-').reverse().join('.');}
function dateName(ms){return new Intl.DateTimeFormat('de-AT',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(ms));}

export function lifeWeeksPosterModel({events=[],today='2026-10-31',years=80,paper='A3'}={}){
 if(![80,100,110].includes(years))throw Error('Der Wochenposter-Export unterstützt 80, 100 oder 110 Lebensjahre.');
 if(!PAGE_SIZES[paper])throw Error('PDF-Papierformat muss A4 oder A3 sein.');
 if(!checkDay(today))throw Error('Ungültiger Stichtag für die Lebensmatrix.');
 const validEvents=Array.isArray(events)?events.filter(e=>e&&!e.deleted&&checkDay(e.start)&&checkDay(e.end)&&Date.parse(e.start)<=Date.parse(e.end)):[];
 const rows=Array.from({length:years},(_,age)=>({age,year:1983+age,yearEnd:1984+age,tier:lifeYearTier(age),cells:lifeWeekCells(age,{today,events:validEvents}),markers:lifeMonthMarkers(age)}));
 return {paper,years,rows,today,metrics:lifeElapsedMetrics(today),events:validEvents};
}
/** Returns a complete PDF 1.4 byte stream, exactly one vector page (A4/A3 landscape). */
export function buildLifeWeeksPdf(opts={}){
 const model=lifeWeeksPosterModel(opts),[W,H]=PAGE_SIZES[model.paper],cmd=[];
 const fill=(hex)=>cmd.push(ink(hex)+' rg');
 const stroke=(hex)=>cmd.push(ink(hex)+' RG');
 const rect=(x,y,w,h,hex)=>{fill(hex);cmd.push(`${n(x)} ${n(y)} ${n(w)} ${n(h)} re f`);};
 const line=(x,y,xx,yy,hex,lw=.35)=>{stroke(hex);cmd.push(`${n(lw)} w ${n(x)} ${n(y)} m ${n(xx)} ${n(yy)} l S`);};
 const text=(x,y,s,pt=8,color='#1E3D43',bold=false)=>{
  fill(color);cmd.push(`BT /${bold?'F2':'F1'} ${n(pt)} Tf ${n(x)} ${n(y)} Td ${pdfLiteral(s)} Tj ET`);
 };
 const margin=model.paper==='A3'?32:23,chartX=model.paper==='A3'?91:71;
 const chartW=W-margin-chartX,top=H-(model.paper==='A3'?122:107),bottom=model.paper==='A3'?89:75;
 const rowH=(top-bottom)/model.years,cellW=chartW/53;
 // Paper, header, and actual life-statistics (not estimates or forecasts).
 rect(0,0,W,H,'#FFFFFF');rect(0,H-18,W,18,'#173944');
 text(margin,H-43,'ARS VIVENDI  /  MY LIFE IN WEEKS',model.paper==='A3'?19:15,'#173944',true);
 text(margin,H-61,'Geboren: 28. Juni 1983  |  Stichtag: '+fmtDate(model.today)+'  |  '+model.years+' Lebensjahre',model.paper==='A3'?10:8,'#637B76');
 const m=model.metrics;
 if(m)text(margin,H-80,
  `Lebensjahr ${m.lifeYear}  |  Lebenstag ${m.lifeDay.toLocaleString('de-AT')}  |  Lebenswoche ${m.lifeWeek.toLocaleString('de-AT')}  |  Lebensmonat ${m.lifeMonth.toLocaleString('de-AT')}  |  7-Jahreszyklus ${m.sevenCycle} (Jahr ${m.sevenYear}/7)`,
  model.paper==='A3'?10:7.4,'#245D55',true);
 text(margin,H-94,'Eine Zeile = ein Lebensjahr ab dem 28. Juni. Jede Zelle = eine Lebenswoche. Ereignisse sind farbig.',model.paper==='A3'?8.2:6.6,'#667E76');
 // Months are shown once in the header, but all boundaries in each life-year are computed independently.
 const sample=model.rows[0],labelSize=model.paper==='A3'?8:6;
 text(margin,top+7,'JAHR',labelSize,'#56736F',true);
 text(chartX,top+7,'28. Jun',labelSize,'#56736F',true);
 for(const mm of sample.markers.filter(x=>!x.start)){
  if(mm.label==='Jul'){text(chartX+(model.paper==='A3'?38:25),top+7,'Jul',labelSize,'#568887',true);continue;} // Boundary line remains at exact day 3.
  const xx=chartX+chartW*mm.pct/100;
  const label=mm.newYear?'JAN':mm.label;
  text(xx+2,top+7,label,labelSize,mm.newYear?'#AD834A':'#688078',mm.newYear);
 }
 // Full 80/100/110 life-years, 53 week cells each; vector-precise for A4 and A3.
 model.rows.forEach((row,i)=>{
  const y=top-(i+1)*rowH;
  if(i%7===0&&i>0)line(margin,y+rowH,chartX+chartW,y+rowH,'#D8BC86',model.paper==='A3'?.7:.5);
  const tierColor=row.tier==='bronze'?'#B88757':row.tier==='silver'?'#A5B5C3':row.tier==='gold'?'#D8B75E':row.tier==='star'?'#E6B05E':'#D7DFDC';
  rect(margin,y+.1,model.paper==='A3'?3:2,Math.max(.6,rowH-.3),tierColor);
  const yearText=`${row.year}/${String(row.yearEnd).slice(-2)}`;
  text(margin+(model.paper==='A3'?8:5),y+rowH*.28,yearText,clip(rowH*.71,model.paper==='A3'?3.5:2.9,model.paper==='A3'?7:5.3),row.age%10===0?'#173944':'#536D66',row.age%10===0);
  const padX=clip(cellW*.09,.4,1.1),padY=clip(rowH*.08,.12,.7),rw=cellW-padX;
  row.cells.forEach((cell,j)=>{
   const xx=chartX+j*cellW,cy=y+padY,rh=Math.max(.55,rowH-2*padY);
   const categories=[...new Set(cell.events.map(e=>e.category))].slice(0,3);
   if(categories.length){categories.forEach((cat,k)=>{
    const match=LIFE_EVENT_CATEGORIES.find(e=>e[0]===cat),c=match?.[2]||'#879B8E';
    rect(xx+padX+(rw/categories.length)*k,cy,rw/categories.length,rh,c);
   });}
   else if(cell.status==='past'||cell.status==='current')rect(xx+padX,cy,rw,rh,'#AAB6B8');
   else rect(xx+padX,cy,rw,rh,'#F7FAF9');
   if(cell.status==='current'){
    stroke('#C59A46');cmd.push(`${n(model.paper==='A3'?1.15:.85)} w ${n(xx+padX)} ${n(cy)} ${n(rw)} ${n(rh)} re S`);
   }
  });
  row.markers.filter(x=>!x.start).forEach(mm=>{
   const xx=chartX+chartW*mm.pct/100;
   line(xx,y+.08,xx,y+rowH-.08,mm.newYear?'#A97A36':'#E6EDEF',mm.newYear?(model.paper==='A3'?.6:.4):.16);
  });
 });
 // Footer: a visible legend that does not become a second page.
 line(margin,bottom-8,W-margin,bottom-8,'#C6D9D4',.65);
 text(margin,bottom-22,'Grau: vergangen   Weiss: offen   Gold-Rahmen: aktuelle Woche   Linien: Monatsgrenzen   Goldene Linie: 1. Jaenner',model.paper==='A3'?8:6.2,'#4E6762');
 text(margin,bottom-33,'Lebensjahr startet am 28. Juni; der Juli beginnt im ersten Wochenfeld am 1. Juli.',model.paper==='A3'?7.2:5.6,'#647C75');
 const legendY=bottom-48,legends=[...LIFE_EVENT_CATEGORIES,['past','Ohne Ereignis','#AAB6B8']];
 const colCount=4,itemW=(W-2*margin)/colCount;
 legends.forEach((cat,i)=>{
  const [id,label,hex]=cat,xx=margin+(i%colCount)*itemW,yy=legendY-Math.floor(i/colCount)*(model.paper==='A3'?14:11);
  rect(xx,yy-2,8,8,hex);text(xx+12,yy,label,model.paper==='A3'?7.1:5.6,'#496963');
 });
 text(margin,20,'Persoenliche Lebenschronik  |  80 Jahre sind nur ein Orientierungswert; 100+ sind Bonusjahre, keine Prognose.',model.paper==='A3'?6.6:5.5,'#788B86');
 text(W-margin-112,20,'Compass Life  ·  1 / 1',model.paper==='A3'?7:5.7,'#788B86');
 // Tiny standards-compliant PDF writer: all geometry is vector, content is kept locally.
 const content=cmd.join('\n')+'\n',objects=[
 '<< /Type /Catalog /Pages 2 0 R >>',
 '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
 `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${n(W)} ${n(H)}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
 `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`,
 '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
 '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
 `<< /Title ${pdfLiteral('Compass Life - My Life in Weeks')} /Creator ${pdfLiteral('Compass Life 0.5.83')} /Subject ${pdfLiteral(`${model.years} Lebensjahre ab ${LIFE_BIRTHDAY}`)} >>`
 ];
 let pdf='%PDF-1.4\n%Compass Life vector poster\n';const offs=[0];
 objects.forEach((obj,i)=>{offs.push(encoder.encode(pdf).length);pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
 const xref=encoder.encode(pdf).length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
 for(const off of offs.slice(1))pdf+=`${String(off).padStart(10,'0')} 00000 n \n`;
 pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
 return encoder.encode(pdf);
}
