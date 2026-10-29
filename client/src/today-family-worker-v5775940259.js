/** Read-only Family Radar in a dedicated worker: never blocks GTD input. */
import {buildFamilyTodayHtml} from './today-core-deferred-v5775940259.js';
self.onmessage=({data})=>{
 const job=data?.job;
 try{self.postMessage({job,html:buildFamilyTodayHtml(data.input)});}
 catch(ex){self.postMessage({job,error:String(ex?.message||'Failed to build family panel')});}
};
