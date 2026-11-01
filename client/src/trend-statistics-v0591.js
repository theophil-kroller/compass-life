/** Compass 0.5.91 · day-level ordinary-least-squares TREND (not a forecast).
 * A two-sided 96% Student-t confidence interval estimates uncertainty in the
 * conditional regression MEAN, not individual observations or BIA instrument error.
 * Missing days are never filled with zero; duplicate days collapse to last observation.
 */
const dayMS=86400000;
const dayNumber=d=>Date.parse(String(d)+'T12:00:00Z')/dayMS;
const valid=(p)=>/^\d{4}-\d{2}-\d{2}$/.test(p?.day||'')&&Number.isFinite(dayNumber(p.day))&&Number.isFinite(p.value);
const logGamma=z=>{
 const c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
 if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);
 z-=1;let x=c[0];for(let i=1;i<c.length;i++)x+=c[i]/(z+i);
 let t=z+7.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);
};
function betaContinuedFraction(a,b,x){
 const max=200,eps=3e-14,tiny=1e-30;
 let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<tiny)d=tiny;d=1/d;let h=d;
 for(let m=1;m<=max;m++){
  const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;h*=d*c;
  aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;const delta=d*c;h*=delta;if(Math.abs(delta-1)<eps)break;
 }return h;
}
function regularizedBeta(x,a,b){
 if(x<=0)return 0;if(x>=1)return 1;
 const front=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log(1-x));
 return x<(a+1)/(a+b+2)?front*betaContinuedFraction(a,b,x)/a:1-front*betaContinuedFraction(b,a,1-x)/b;
}
export function tCritical96(df){
 if(!Number.isInteger(df)||df<1)return null;
 const f=t=>1-.5*regularizedBeta(df/(df+t*t),df/2,.5);
 let l=0,h=1;while(f(h)<.98&&h<1e6)h*=2;
 for(let i=0;i<52;i++){const m=(l+h)/2;if(f(m)<.98)l=m;else h=m;}
 return (l+h)/2;
}
export function trendModel96(input,{minPoints=5,minSpanDays=7}={}){
 const map=new Map();for(const p of Array.isArray(input)?input:[])if(valid(p))map.set(p.day,{day:p.day,value:p.value});
 const points=[...map.values()].sort((a,b)=>a.day.localeCompare(b.day));
 if(points.length<Math.max(3,minPoints))return null;
 const start=dayNumber(points[0].day),xs=points.map(p=>dayNumber(p.day)-start),ys=points.map(p=>p.value);
 const n=xs.length,span=xs.at(-1)-xs[0];if(span<minSpanDays)return null;
 const mx=xs.reduce((a,b)=>a+b,0)/n,my=ys.reduce((a,b)=>a+b,0)/n;
 const sxx=xs.reduce((s,x)=>s+(x-mx)**2,0);if(sxx<1e-9)return null;
 const slope=xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/sxx,intercept=my-slope*mx;
 const rss=xs.reduce((s,x,i)=>s+(ys[i]-intercept-slope*x)**2,0),sigma=Math.sqrt(Math.max(0,rss)/(n-2)),t=tCritical96(n-2);
 const predictDay=day=>{const x=dayNumber(day)-start;if(!Number.isFinite(x))return null;
  const mean=intercept+slope*x,se=t*sigma*Math.sqrt(1/n+(x-mx)**2/sxx);
  return {day,mean,lower:mean-se,upper:mean+se};};
 const fitted=points.map(p=>predictDay(p.day));
 return {n,spanDays:span,slopePerDay:slope,slopePer30Days:slope*30,confidence:0.96,method:'OLS Student-t mean CI',fitted,first:fitted[0],last:fitted.at(-1),predictDay};
}
export function trendSvg96(model,{X,Y,color='#397D74'}={}){
 if(!model||typeof X!=='function'||typeof Y!=='function')return '';
 const coords=model.fitted.filter(q=>[q.lower,q.mean,q.upper].every(Number.isFinite));
 if(coords.length<2)return '';
 const p=(key,arr)=>arr.map((q,i)=>`${i?'L':'M'}${X(q.day).toFixed(2)} ${Y(q[key]).toFixed(2)}`).join(' ');
 const area=p('upper',coords)+' '+coords.toReversed().map(q=>`L${X(q.day).toFixed(2)} ${Y(q.lower).toFixed(2)}`).join(' ')+' Z';
 const path=p('mean',coords);
 return `<path class="ci91-confidence" d="${area}" fill="${color}" opacity=".12" stroke="none"><title>96-%-Konfidenzband für den mittleren Trend; keine Messgeräte- oder Prognoseunsicherheit</title></path><path class="ci91-trend" d="${path}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round"><title>Beobachteter Trend über ${model.n} Messdaten, ${model.spanDays} Tage</title></path>`;
}
export function trendExtent96(model,vals=[]){const all=[...vals];if(model)for(const p of model.fitted)all.push(p.lower,p.upper);return all.filter(Number.isFinite);}
