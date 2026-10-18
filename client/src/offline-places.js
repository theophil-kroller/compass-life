/** Approximate offline context for Timeline visits. Never infer an exact address. */
import {countries} from './offline-country-data.js';
const de={Austria:'Österreich',Germany:'Deutschland',China:'China',Australia:'Australien','United Kingdom':'Vereinigtes Königreich','United States of America':'USA',Switzerland:'Schweiz',Italy:'Italien',France:'Frankreich',Czechia:'Tschechien',Slovakia:'Slowakei',Slovenia:'Slowenien',Croatia:'Kroatien',Hungary:'Ungarn',Poland:'Polen',Spain:'Spanien',Greece:'Griechenland',Turkey:'Türkei','New Zealand':'Neuseeland',Japan:'Japan',Indonesia:'Indonesien',India:'Indien',Denmark:'Dänemark',Netherlands:'Niederlande',Belgium:'Belgien',Norway:'Norwegen',Sweden:'Schweden',Finland:'Finnland',Portugal:'Portugal'};
const cities=[
 ['Graz',47.071,15.439,25],['Wien',48.208,16.374,30],['Salzburg',47.80,13.04,25],['Linz',48.31,14.29,25],['Innsbruck',47.269,11.40,25],
 ['Hamburg',53.55,9.994,35],['Berlin',52.52,13.40,35],['München',48.137,11.575,30],['Frankfurt',50.11,8.68,30],['Prag',50.075,14.44,30],['Ljubljana',46.05,14.50,25],['Zagreb',45.81,15.98,28],
 ['Sydney',-33.869,151.209,55],['Melbourne',-37.815,144.963,45],['Cairns',-16.92,145.77,38],['Uluru',-25.345,131.035,55],['Brisbane',-27.47,153.03,40],['Perth',-31.953,115.857,40],
 ['Shanghai',31.23,121.47,45],['Hangzhou',30.27,120.16,40],['Ürümqi',43.826,87.61,48],['Peking',39.90,116.41,40],['Shenzhen',22.54,114.06,40],['Hongkong',22.32,114.17,35],
 ['London',51.507,-0.127,40],['Paris',48.856,2.35,35],['Zürich',47.37,8.54,27],['Dubai',25.204,55.27,45],['Tokio',35.68,139.76,45]
];
function inside(lon,lat,poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
 const a=poly[i],b=poly[j];if((a[1]>lat)!==(b[1]>lat)&&lon<(b[0]-a[0])*(lat-a[1])/(b[1]-a[1])+a[0])hit=!hit;
}return hit;}
export function countryAt(lat,lon){if(!Number.isFinite(lat)||!Number.isFinite(lon))return null;
 for(const [name,iso,polys] of countries){if(polys.some(p=>inside(lon,lat,p)))return {name:de[name]||name,iso};}
 return null;
}
export function approximatePlace(lat,lon){
 if(!Number.isFinite(lat)||!Number.isFinite(lon))return {name:'Unbekannter Ort',approximate:true};
 const country=countryAt(lat,lon),cname=country?.name||'';
 // 1° latitude approx. 111 km. Conservative spherical approximation for nearest metropolitan area.
 const km=(a,b)=>{const rad=Math.PI/180,dlat=(lat-a)*rad,dlon=(lon-b)*rad,q=Math.sin(dlat/2)**2+Math.cos(a*rad)*Math.cos(lat*rad)*Math.sin(dlon/2)**2;return 12742*Math.asin(Math.min(1,Math.sqrt(q)));};
 const match=cities.map(([name,a,b,r])=>({name,d:km(a,b),r})).filter(x=>x.d<=x.r).sort((x,y)=>x.d-y.d)[0];
 if(match)return {name:`Raum ${match.name}${cname?', '+cname:''}`,approximate:true,country:cname};
 if(country)return {name:`${cname} (Region unbekannt)`,approximate:true,country:cname};
 return {name:`${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,approximate:true,country:''};
}
