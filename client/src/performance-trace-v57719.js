/** Opt-in, in-memory action instrumentation. Never stores item titles, notes, IDs or payloads. */
export function createPerformanceTrace({now=()=>performance.now(),max=240}={}){
 let enabled=false;const entries=[];
 return {
  get enabled(){return enabled;},setEnabled(v){enabled=!!v;},
  start(){return enabled?now():null;},
  end(kind,screen,start){if(!enabled||start==null)return;
   const ms=Math.max(0,now()-start);if(!Number.isFinite(ms))return;
   entries.push({type:String(kind).slice(0,50),view:String(screen).slice(0,30),ms:Math.round(ms*10)/10});
   if(entries.length>max)entries.splice(0,entries.length-max);
  },
  entries(){return [...entries];},clear(){entries.length=0;},
  summary(){const groups=new Map();for(const e of entries){const key=e.type+' · '+e.view;
    const r=groups.get(key)||{label:key,count:0,total:0,max:0};r.count++;r.total+=e.ms;r.max=Math.max(r.max,e.ms);groups.set(key,r);}
   return [...groups.values()].map(x=>({label:x.label,count:x.count,avg:Math.round(x.total/x.count),max:Math.round(x.max)})).sort((a,b)=>b.avg-a.avg);
  }
 };
}
