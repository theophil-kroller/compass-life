import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
import {portfolioProfessionalView} from '../client/src/finance-portfolio-pro-v37.js';
import {parseFlatexPositionsCsv} from '../client/src/finance-flatex-positions-v37.js';

const csv=['stichtag;isin;bezeichnung;art;stueck;kurs_eur;marktwert_eur;einstand_eur','2026-10-19;IE00TEST1234;Test Global Fund;ETF;2;50;100;80','2026-10-19;CASH;Cash;CASH;0;0;25;25'].join('\n');
const state={financeTransactions:[],financeFlatexSnapshots:[parseFlatexPositionsCsv(csv)]};
const view=portfolioTab=>financeDashboardView(state,'Portfolio','all',null,0,{portfolioTab,flatexSort:{key:'market',descending:true}});

test('0.5.41 portfolio tabs render one deliberate workspace at a time',()=>{
 const tabs=['overview','positions','analysis','development','settings'];
 for(const tab of tabs){
  const html=view(tab);
  assert.equal((html.match(/class="fin41-portfolio-tabs"/g)||[]).length,1);
  assert.equal((html.match(/class="fin41-portfolio-tab is-active"/g)||[]).length,1);
  for(const option of tabs)assert.match(html,new RegExp(`data-action="finance-portfolio-tab" data-id="${option}"`));
  assert.match(html,/fin41-portfolio-panel/);
 }
 assert.match(view('overview'),/Erfasster Vermögenssaldo/);
 assert.doesNotMatch(view('overview'),/finance-flatex-positions-file|finance-quote-form|fin41-flatex-market/);
 assert.match(view('positions'),/Flatex Depotpositionen/);
 assert.match(view('positions'),/data-action="finance-flatex-chart-select"/);
 assert.doesNotMatch(view('positions'),/finance-flatex-positions-file/);
 assert.match(view('analysis'),/Performance-Treemap|Performance-Treemap/);
 assert.match(view('analysis'),/fin41-flatex-market/);
 assert.match(view('analysis'),/finance-portfolio-market/);
 assert.doesNotMatch(view('analysis'),/finance-kraken-file|finance-flatex-positions-file/);
 assert.match(view('development'),/belegten Stichtagen/);
 assert.doesNotMatch(view('development'),/finance-flatex-positions-file|fin41-flatex-market/);
 assert.match(view('settings'),/finance-flatex-positions-file/);
 assert.match(view('settings'),/finance-quote-form/);
 assert.match(view('settings'),/finance-kraken-file/);
 assert.match(view('settings'),/finance-import-manager/);
});

test('0.5.41 portfolio tab input safely defaults and never injects markup',()=>{
 assert.match(view('<script>alert(1)</script>'),/aria-label="Übersicht"/);
 assert.doesNotMatch(view('<script>alert(1)</script>'),/<script>alert/);
 assert.match(portfolioProfessionalView(state),/finance-flatex-positions-file/); // backwards-compatible older integrations
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/financePortfolioTab='overview'/);
 assert.match(main,/action==='finance-portfolio-tab'/);
 assert.match(main,/financePortfolioTab='analysis';financePortfolioMarket='flatex';flatexChartIsin/);
 assert.match(main,/financePortfolioTab='analysis';financePortfolioMarket='kraken';\s*const period/);
});

test('0.5.41 technical-chart subtab hides the unused market, while preserving coin selection',()=>{
 const html=financeDashboardView(state,'Portfolio','all',null,0,{portfolioTab:'analysis',portfolioMarket:'kraken'});
 assert.match(html,/Krypto · Kraken/);
 assert.doesNotMatch(html,/fin41-flatex-market/);
 assert.doesNotMatch(html,/finance-flatex-positions-file/);
 assert.match(html,/finance-portfolio-market/);
});
