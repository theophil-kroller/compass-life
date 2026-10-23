/** UI-only contact scope; never mutates vault, never infers work from tasks. */
import {preference} from './relationship-radar-v564.js';
export const PEOPLE_SCOPES=Object.freeze([['all','Alle'],['work','Arbeitskollegen'],['private','Privat']]);
export function peopleInScope(people=[],scope='all'){
 if(!['all','work','private'].includes(scope))scope='all';
 return (people||[]).filter(person=>{
  if(!person)return false;
  if(scope==='all')return true;
  const colleague=preference(person).kind==='colleague';
  return scope==='work'?colleague:!colleague;
 });
}
export function peopleScopeCounts(people=[]){
 const work=peopleInScope(people,'work').length;
 return {all:(people||[]).length,work,private:(people||[]).length-work};
}
