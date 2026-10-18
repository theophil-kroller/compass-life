// Personal birthdays are stored in the encrypted local Compass vault.
// Only explicitly selected preparatory tasks are sent through normal task sync.
import {upcomingOccasions,shiftDay} from './occasion-planning.js';
import {localDate} from './tasks.js';

const monthDayValid=(month,day)=>{
 if(!Number.isInteger(month)||!Number.isInteger(day)||month<1||month>12||day<1||day>31)return false;
 // Leap year 2000 permits Feb 29 without demanding knowledge of the birth year.
 const d=new Date(Date.UTC(2000,month-1,day));
 return d.getUTCMonth()===month-1&&d.getUTCDate()===day;
};
export function validPersonBirthday(monthDay='',birthYear=null){
 if(monthDay===''&&(birthYear==null||birthYear===''))return true;
 if(typeof monthDay!=='string'||!/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(monthDay))return false;
 const [month,day]=monthDay.split('-').map(Number);
 if(!monthDayValid(month,day))return false;
 if(birthYear==null||birthYear==='')return true;
 if(!Number.isInteger(birthYear)||birthYear<1850||birthYear>new Date().getFullYear())return false;
 const d=new Date(Date.UTC(birthYear,month-1,day));
 return d.getUTCMonth()===month-1&&d.getUTCDate()===day;
}
const normalizedName=name=>String(name||'').normalize('NFKC').toLocaleLowerCase('de').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function personalBirthdays(people={},today=localDate(),leadDays=70){
 const startYear=Number(today.slice(0,4)),end=shiftDay(today,leadDays),result=[];
 for(const person of Object.values(people||{})){
  const md=person?.birthdayMonthDay||'';
  if(!person?.id||typeof person.name!=='string'||!person.name.trim()||!validPersonBirthday(md,person.birthdayYear??null)||!md)continue;
  for(let year=startYear;year<=Number(end.slice(0,4));year++){
   // Explicit convention: Feb 29 is observed Feb 28 in non-leap years.
   const leap=new Date(Date.UTC(year,1,29)).getUTCMonth()===1;
   const observed=(md==='02-29'&&!leap)?'02-28':md;
   const day=`${year}-${observed}`;
   if(day<today||day>end)continue;
   result.push({kind:'birthday',id:`birthday:person:${person.id}:${year}`,date:day,title:person.name.trim(),emoji:'🎂',source:'people',personId:person.id});
  }
 }
 return result.sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'de'));
}
export function occasionsWithPeople(events=[],appearance=()=>({}),people={},today=localDate(),leadDays=70){
 const fromCalendar=upcomingOccasions(events,appearance,today,leadDays);
 const fromPeople=personalBirthdays(people,today,leadDays);
 const counts=new Map();for(const p of Object.values(people||{})){
  const first=normalizedName(p.name).split(' ')[0];if(first)counts.set(first,(counts.get(first)||0)+1);
 }
 // Prefer personal contact as canonical source. A calendar first-name-only match
 // is accepted only when that first name is unambiguous in the contact book.
 const result=fromCalendar.filter(c=>{
  if(c.kind!=='birthday')return true;
  const target=normalizedName(c.title);
  return !fromPeople.some(p=>{
   if(p.date!==c.date)return false;
   const contact=normalizedName(p.title);
   if(!contact||!target)return false;
   if(contact===target)return true;
   const first=contact.split(' ')[0];
   return counts.get(first)===1&&(target===first||target.startsWith(contact+' ')||contact.startsWith(target+' '));
  });
 });
 return [...result,...fromPeople].sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'de'));
}
