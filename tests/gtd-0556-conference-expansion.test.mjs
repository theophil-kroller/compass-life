import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RADAR_SEEDS,RADAR_TOPICS,RADAR_FOCI,conferenceEntries,conferenceRadarView,validConference,setConferenceStatus,conferenceProjectPlan} from '../client/src/conference-radar-v555.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const today='2026-10-20';
const mock={status:'stale'};
test('curated 2027 opportunities span research, language education, entrepreneurship, sustainability and HICSS',()=>{
 assert.ok(RADAR_SEEDS.length>=30);
 assert.equal(new Set(RADAR_SEEDS.map(x=>x.id)).size,RADAR_SEEDS.length);
 assert.ok(RADAR_SEEDS.every(validConference));
 assert.ok(RADAR_SEEDS.some(x=>x.id==='hicss-2027'));
 assert.ok(RADAR_SEEDS.some(x=>x.id==='nbm-2027'));
 assert.ok(RADAR_SEEDS.some(x=>x.id==='calico-2027'&&x.deadline==='2026-10-30'));
 assert.ok(RADAR_SEEDS.some(x=>x.id==='3e-2027'&&x.deadline==='2026-12-01'));
 assert.ok(RADAR_SEEDS.some(x=>x.id==='lip-2027'&&x.deadline==='2026-12-31'));
 for(const focus of ['Learnly','Dissertation','Entrepreneurship-Lehre'])assert.ok(RADAR_SEEDS.filter(x=>x.focus?.includes(focus)).length>=5);
 assert.ok(RADAR_TOPICS.includes('Sprachlernen & Migration'));
});
test('filters show exactly the user research focus without losing cross-topic entries',()=>{
 const rows=conferenceEntries({});
 const html=conferenceRadarView(rows,{topic:'all',region:'all',focus:'Learnly',today,forecast:mock,state:{}});
 assert.match(html,/CALICO 2027/);
 assert.match(html,/HICSS 2027/);
 assert.doesNotMatch(html,/New Business Models 2027/);
 assert.match(html,/id="radar555-focus"/);
 const h2=conferenceRadarView(rows,{topic:'Nachhaltigkeit',region:'Europa',focus:'Dissertation',today,forecast:mock,state:{}});
 assert.match(h2,/World Sustainable Energy Days 2027/);
 assert.doesNotMatch(h2,/CALICO 2027/);
 assert.match(main,/RADAR_FOCI/);
 assert.match(main,/radarFocus=control\.value/);
});
test('saved conference overlay survives upgrading the editorial seed list',()=>{
 const old=conferenceEntries({});const result=setConferenceStatus({},'ispim-2027','merken');
 const after=conferenceEntries({conferenceRadar:result});
 assert.equal(after.length,old.length);
 assert.equal(after.find(x=>x.id==='ispim-2027').status,'merken');
 assert.ok(after.find(x=>x.id==='calico-2027'));
 assert.ok(conferenceProjectPlan(after.find(x=>x.id==='lip-2027')).projects.length);
});
test('0.5.56 project-reference import and progress display safeguards remain',()=>{
 assert.match(main, /isTemplateTask,flaggedTasks/);
 assert.match(css,/\.task-row \.v42-progress-meter progress\{display:block!important/);
 assert.match(css,/\.progress-project \.progress-project-head\{display:grid/);
});
