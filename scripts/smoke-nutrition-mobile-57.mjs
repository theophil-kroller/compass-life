import {writeFileSync} from 'node:fs';
import {nutritionCoachDashboard52} from '../client/src/nutrition-coach-v059152.js';
const names=['Hausgemachter Muffin','Brokkoli gedämpft','Apfel frisch','Erdnüsse geschält','High Protein Skyr','Mensa Wokgemüse mit Basmatireis','Grüntee'];
const nutrientValues=[{kcal:220,protein:4,salt:.2},{kcal:90,protein:8,fiber:7},{kcal:70,protein:.5,fiber:3},{kcal:175,protein:8,fiber:3},{kcal:140,protein:25},{kcal:600,protein:20,salt:2.5},{kcal:0}];
const foods=names.map((title,i)=>({id:'food'+i,title,group:'Eigene',defaultAmount:'1 Portion',nutrientBasis:'perPortion',nutrients:nutrientValues[i]}));
const st={nutritionJournal:{entries:foods.map((f,i)=>({id:'x'+i,foodId:f.id,amount:'1 Portion',at:'2026-11-'+String(10+i%5).padStart(2,'0')+'T12:30:00+01:00'})),customFoods:foods}};
const body=nutritionCoachDashboard52(st,{days:14,anchor:'2026-11-16',today:'2026-11-16',metric:'protein'});
const url='file:///mnt/data/compass_work_57/client/src/';
const html=`<!doctype html><html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${url}style.css"><link rel="stylesheet" href="${url}nutrition-focus-v577594017.css"><link rel="stylesheet" href="${url}nutrition-coach-v059152.css"><style>body{margin:0} .workspace{min-width:0}.content{min-width:0}</style></head><body><div class="shell"><main class="workspace"><div class="content"><div class="insight-workspace"><section class="nf4017-workspace"><nav class="nf4017-nav"><button>Überblick</button><button>Heute</button><button>Daily Dozen</button><button>Nährstoffe</button><button>Trends</button><button>Mensa</button></nav><div class="nf4017-body">${body}</div></section></div></div></main></div><output id="mobile-result"></output><script>
 const wide=[...document.querySelectorAll('body *')].filter(n=>{let r=n.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1&&!n.closest('.nf4017-nav,.ni152-periods')}).slice(0,12).map(n=>({cls:n.className?.baseVal||n.className||n.tagName,x:Math.round(n.getBoundingClientRect().right),w:Math.round(n.getBoundingClientRect().width)}));
 document.getElementById('mobile-result').textContent=JSON.stringify({vw:innerWidth,body:document.body.scrollWidth,doc:document.documentElement.scrollWidth,navScroll:document.querySelector('.nf4017-nav').scrollWidth,navClient:document.querySelector('.nf4017-nav').clientWidth,wide});
 </script></body></html>`;
writeFileSync('/mnt/data/mobile-test-57.html',html);
console.log('Created sample HTML',html.length);
