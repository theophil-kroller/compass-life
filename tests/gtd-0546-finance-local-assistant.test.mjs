import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeAssistantPatterns,financeAssistEligible,applyFinanceAssistantGroup,validateFinanceModelSuggestions,askLocalFinanceModel,financeAssistantView,cleanFinanceText} from '../client/src/finance-local-assistant-v46.js';

const row=(id,category='Prüfen / Noch ungeklärt',extras={})=>({id,merchant:'Apotheke Teststadt',description:'SEPA Apotheke Teststadt Rezept Medikamente Einkauf',day:'2026-10-18',amountCents:-3400,flow:'expense',category,needsReview:true,confidence:'low',source:'rule',...extras});
test('confirmed transactions are used as matching evidence, never edited again',()=>{
 const a=row('a','Gesundheit & Sport / Medizin & Apotheke',{source:'user',needsReview:false,confidence:'confirmed'});
 const b=row('b','Gesundheit & Sport / Medizin & Apotheke',{source:'user',needsReview:false,confidence:'confirmed'});
 const p=row('c');const suggestions=financeAssistantPatterns([a,b,p]);assert.equal(suggestions.length,1);assert.deepEqual(suggestions[0].ids,['c']);
 const res=applyFinanceAssistantGroup([a,b,p],suggestions[0]);assert.equal(res.count,1);assert.equal(res.rows[2].source,'user');assert.equal(res.rows[0],a);
});
test('similar merchant with different purpose and intermediary does not receive a forced category',()=>{
 const a=row('a','Gesundheit & Sport / Medizin & Apotheke',{source:'user',needsReview:false,confidence:'confirmed'});
 const b=row('b','Prüfen / Noch ungeklärt',{description:'SEPA Apotheke Teststadt Wellness Gutschein Sauna',needsReview:true});
 const c=row('c','Prüfen / Noch ungeklärt',{merchant:'Klarna',needsReview:true});
 assert.equal(financeAssistantPatterns([a,b,c]).length,0);
});
test('transfer remains separate from consumer classification and no automatic counterparty matching',()=>{
 const confirmed=row('one','Gesundheit & Sport / Medizin & Apotheke',{source:'user',confidence:'confirmed',needsReview:false});
 const transfer=row('transfer','Transfer / Eigene Konten',{flow:'transfer'});
 assert.equal(financeAssistEligible(transfer),false);
 assert.deepEqual(financeAssistantPatterns([confirmed,transfer]),[]);
 assert.throws(()=>applyFinanceAssistantGroup([confirmed],{ids:['one'],category:'Gesundheit & Sport / Medizin & Apotheke',flow:'expense'}),/geändert/);
});
test('model proposals require exact listed category and appropriate flow; malicious suggestions ignored',()=>{
 const pending=[row('a'),row('b','Prüfen / Noch ungeklärt',{amountCents:3500,flow:'income'})];
 const parsed=validateFinanceModelSuggestions({suggestions:[
  {id:'1',category:'Gesundheit & Sport / Medizin & Apotheke',reason:'Eine <script>Warnung</script>'},
  {id:'2',category:'Shopping / Online-Shopping',reason:'Incorrect direction'},
  {id:'3',category:'Transfer / Eigene Konten'},
  {id:'1',category:'Einnahmen / Gehalt'}
 ]},pending);
 assert.equal(parsed.length,1);assert.equal(parsed[0].id,'a');
 assert.doesNotMatch(financeAssistantView(pending,parsed).html,/<script>/);
});
test('local LM Studio used only when explicitly invoked; payload excludes original account numbers',async()=>{
 const requests=[];const http=async(url,options)=>{
  requests.push({url,options});
  if(url.endsWith('/models'))return {ok:true,json:async()=>({data:[{id:'qwen-loaded'}]})};
  return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({suggestions:[{id:'1',category:'Gesundheit & Sport / Medizin & Apotheke',reason:'Prescription'}]})}}]})};
 };
 const rows=[row('p','Prüfen / Noch ungeklärt',{description:'Rezept Medikamente IBAN: AT611904300234573201 123456789'})];
 const res=await askLocalFinanceModel(rows,http);assert.equal(res.length,1);assert.equal(requests.length,2);
 assert.equal(requests[1].url,'http://127.0.0.1:1234/v1/chat/completions');
 const body=JSON.parse(requests[1].options.body);assert.equal(body.model,'qwen-loaded');
 assert.doesNotMatch(JSON.stringify(body),/AT611904300234573201|123456789/);
 assert.match(cleanFinanceText('AT611904300234573201'),/IBAN/);
});
test('assistant is discoverable under Finance tools without new navigation tabs or auto-approval',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.68\.1\.1'/);
 assert.match(ui,/financeAssistantView\(transactions/);
 assert.match(main,/finance-ai-local/);assert.match(main,/finance-ai-apply/);
 assert.match(main,/if\(!confirm\(/);assert.match(ui,/title:'Werkzeuge'/);
});
