import test from 'node:test';
import assert from 'node:assert/strict';
import {parseReceiptJSONList,parseReceiptJSON,normalizeReceiptJSONText,receiptWarnings,putReceipts} from '../client/src/receipt-gpt-v57743.js';
const entry=(description,quantity,unit,unit_price,total,category='Lebensmittel')=>({description,quantity,unit,unit_price,total,category,confidence:'high'});
const receipts=[
 {schema:'compass_receipt_v1',merchant:'SPAR',date:'2026-10-29',currency:'EUR',total:8.46,items:[entry('SBUDGET TOPFENCREME',1,'Stück',.69,.69),entry('SBUDGETMILCHREIS200G',2,'Stück',.49,.98),entry('VITAL BIO MANGOH.',1,'Stück',6.79,6.79)],notes:['Summe der Positionen stimmt.']},
 {schema:'compass_receipt_v1',merchant:'SPAR',date:'2026-10-31',currency:'EUR',total:11.76,items:[entry('CHIO TORTILLAS MEXIC',1,'Stück',1.24,1.24),entry('CHIO DIP',1,'Stück',2.49,2.49),entry('CHIO TORTILLA CHEESE',1,'Stück',1.24,1.24),entry('VITAL BIO MANGOH.',1,'Stück',6.79,6.79)],notes:['Rabatt in den tatsächlichen Preisen berücksichtigt.']},
 {schema:'compass_receipt_v1',merchant:'Hofer',date:'2026-10-16',currency:'EUR',total:17.77,items:[entry('BIO-Bananen FT',.812,'kg',2.29,1.86),entry('ZZU Süßkartoffeln',.468,'kg',4.49,2.10),entry('BBQ Burgersch.200g',1,'Stück',2.49,2.49),entry('BIO-ESL Vollmilch',1,'Stück',1.70,1.70,'Getränke'),entry('Knoppers 5x40g',1,'Stück',2.78,2.78),entry('Bio Feta 200g',1,'Stück',2.79,2.79),entry('"ISS REIF!" MANGO',1,'Stück',1.79,1.79),entry('Laugenbrezel',3,'Stück',.29,.87),entry('Kl. Sandwicht.Saat',1,'Stück',1.39,1.39)],notes:['Bruttogewicht von Banane und Süßkartoffel unterscheidet sich vom Nettogewicht.']},
 {schema:'compass_receipt_v1',merchant:'SPAR',date:'2026-10-27',currency:'EUR',total:12.36,items:[entry('SBUDGET TOPFENCREME',1,'Stück',.69,.69),entry('VITAL BIO MANGOH.',1,'Stück',6.79,6.79),entry('CINI-MINI',1,'Stück',3.69,3.69),entry('SPAR BIO-LEINSAMEN',1,'Stück',1.19,1.19)],notes:['Keine Rabatte ausgewiesen.']}
];
function asRichClipboard(){
 // User's paste includes a backslash at the end of each line, an HTML-space
 // entity in front of each line, plus one double-escaped quoted product name.
 let raw=JSON.stringify(receipts,null,2).split('\n').map(line=>`&#x20; ${line}\\`).join('\n');
 raw=raw.replaceAll('\\"ISS REIF!\\" MANGO','\\\\"ISS REIF!\\\\" MANGO');
 return raw.slice(0,-1);
}
test('accepts user multi-receipt clipboard: literal &#x20; and backslash/newline, still four correct receipts',()=>{
 const raw=asRichClipboard();
 assert.match(raw,/&#x20;/);assert.match(raw,/\\\n/);
 const rows=parseReceiptJSONList(raw);
 assert.equal(rows.length,4);assert.deepEqual(rows.map(x=>x.merchant),['SPAR','SPAR','Hofer','SPAR']);
 assert.equal(rows.reduce((n,x)=>n+x.items.length,0),20);
 assert.equal(Math.round(rows.reduce((n,x)=>n+x.total,0)*100),5035);
 assert.deepEqual(rows.map(x=>x.date),['2026-10-29','2026-10-31','2026-10-16','2026-10-27']);
 assert.equal(rows[2].items[6].description,'"ISS REIF!" MANGO');
 assert.equal(rows[2].items[0].quantity,.812);assert.equal(rows[2].items[0].unit,'kg');
 for(const row of rows)assert.equal(receiptWarnings(row).length,row.notes.length);
});
test('plain valid JSON is not altered, including standard escaped product quotations and numbers',()=>{
 const plain=JSON.stringify(receipts);
 const rows=parseReceiptJSONList(plain);
 assert.equal(rows[2].items[6].description,'"ISS REIF!" MANGO');
 assert.equal(rows[0].items[1].total,.98);
 assert.equal(rows[3].total,12.36);
});
test('accepts markdown fenced JSON with ChatGPT introduction and HTML non-breaking spaces',()=>{
 const json=JSON.stringify(receipts[0],null,2).replace(/  /g,'&nbsp;&nbsp;');
 const rows=parseReceiptJSONList(`Hier sind die Daten:\n\n\`\`\`json\n${json}\n\`\`\`\nBitte prüfen.`);
 assert.equal(rows.length,1);assert.equal(rows[0].total,8.46);
});
test('accepts double JSON-encoded receipt object but not JavaScript expressions',()=>{
 assert.equal(parseReceiptJSON(JSON.stringify(JSON.stringify(receipts[0]))).total,8.46);
 assert.throws(()=>parseReceiptJSONList('[{schema:"compass_receipt_v1"}]'),/Kein gültiges JSON/);
 assert.throws(()=>parseReceiptJSONList('alert(1)'),/Kein gültiges JSON/);
});
test('invalid schema, dates, missing items and bad values still fail validation',()=>{
 assert.throws(()=>parseReceiptJSONList(JSON.stringify([{...receipts[0],schema:'other'}])),/Schema/);
 assert.throws(()=>parseReceiptJSONList(JSON.stringify([{...receipts[0],date:'2026-02-30'}])),/Datum/);
 assert.throws(()=>parseReceiptJSONList(JSON.stringify([{...receipts[0],total:-3}])),/Gesamtsumme/);
 assert.throws(()=>parseReceiptJSONList(JSON.stringify([{...receipts[0],items:[]}])),/Positionen/);
 assert.throws(()=>parseReceiptJSONList('x'.repeat(160001)),/zu groß/);
});
test('previews do not mutate state and duplicates still skipped on explicit save',()=>{
 const rows=parseReceiptJSONList(asRichClipboard()),state={financeTransactions:[{id:'bank-1'}]};
 assert.equal(state.receiptJournal,undefined);
 assert.deepEqual(putReceipts(state,rows),{added:4,skipped:0});
 assert.deepEqual(putReceipts(state,rows),{added:0,skipped:4});
 assert.deepEqual(state.financeTransactions,[{id:'bank-1'}]);
});
test('Books category is retained instead of silently reassigned to Sonstiges',()=>{
 const row=JSON.parse(JSON.stringify(receipts[0]));row.items[0].category='Bücher';
 assert.equal(parseReceiptJSON(JSON.stringify(row)).items[0].category,'Bücher');
});
test('clipboard normalizer strips formatting only and respects plain JSON slash escapes',()=>{
 const s=JSON.stringify(receipts[0]);assert.equal(normalizeReceiptJSONText(s),s);
 assert.equal(normalizeReceiptJSONText('&#32;\n '+s+'\n&nbsp;').trim(),s);
});
