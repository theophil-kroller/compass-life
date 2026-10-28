# Compass Web 0.5.77.59.40.18 — Ars Vivendi Life Report

Basis: Compass Web 0.5.77.59.40.17 Nutrition UX. Watch Bridge and Garmin code unchanged.

## New functionality

- Insights → Übersicht & Intelligence → **Ars Vivendi / Life Report**.
- 30-, 90- and 365-day period controls; independent opt-in to sensitive financial/Sankey and location/worldmap chapters.
- Elegant print-ready A4 Report with cover, verified insights, original SVG charts (including existing Life Balance, sleep, nutrition and optional Finance Sankey and Worldmap), longitudinal observations, recommendations, and Data Integrity appendix.
- Browser-local generation: opening the preview and choosing 'Als PDF sichern / Drucken' uses the system print-to-PDF flow, without external report servers. This release is NOT a server-side LaTeX/Typst exporter.
- Data readiness check: number of imported records, most recent recorded date, stale-source flags, and an attempt to refresh supported existing Compass connections. **No claim of automatic or complete direct Garmin, Fitdays, bank or timeline synchronisation.** Manual imports may remain necessary.
- Evidence-first recommendations: logged Daily Dozen category frequency (minimum 14 logged days and >= 10 mapped entries; only observed log patterns), short recorded sleep (>= 14 nights), sleep split-period trend (>= 20 nights), high saturated fat energy share (>= 14 nutritionally complete logged days; orientational, not diagnosis), financial data-classification issues (only with finance opt-in). Missing entries are NEVER interpreted as missing consumption.
- Optional local LM Studio: aggregates already validated observations and suggested actions; the local model may only rank their IDs. It cannot create facts, numbers or independent recommendations. No secret or raw transactions/coordinates are sent to the model. Failures revert to local rules.
- Trend correlation displays Pearson r only when at least 20 matched varying night/HRV pairs; correlation is NOT causation.

## Protection and limits

- Reports require unlocked local data, but contain sensitive personal information if Finance or Places are enabled. Private print/PDF copies must be protected by the user.
- Do not construe numeric associations as causal, health advice as diagnosis, or finance observations as professional financial advice.
- Historical inputs only: freshness is evaluated against available imported dates and cannot prove data completeness.
- Empty or insufficient datasets display non-assertive descriptions; no synthesized missing records.
- The generated report is a *local print view*. Browser print settings and SVG font fallback can influence actual PDF layout.

## Installation

**PATCH:** Upload all files from `Compass_Web_0.5.77.59.40.18_ARS_VIVENDI_REPORT_PATCH_FROM_0.5.77.59.40.17.zip` into the ROOT of the deployed .40.17 GitHub repository, keeping relative paths and overwriting matching files.

**FULL SOURCE:** `Compass_Web_0.5.77.59.40.18_ARS_VIVENDI_REPORT_FULL_SOURCE.zip` is the entire project source; use it INSTEAD of a patch, not together with the patch. No Cloudflare D1 migration and no Worker deployment required.

## Verification

- 1,613 / 1,613 Node automated tests passed including report recommendation guards, privacy, chart wiring, and release regressions.
- 65 / 65 ordered source transforms applied to main.js in the local release gate; result shows version .40.18.
- Static synthetic-sample print-preview was successfully converted to 11-page PDF with vector world map; cover and map visually inspected. This is NOT a substitute for validating Chromium/PWA export with actual data.
- Full source / patch reconstruction and ZIP CRC tested before release.
- `npm run build` in the current isolated environment fails because Vite is not installed (`sh: vite: not found`). The GitHub Actions deployment MUST execute the actual `npm run check` + `npm run build`; do not consider a deploy successful until that workflow is green and the browser smoke test passes.

## Smoke test

1. Unlock Compass → Insights → Übersicht & Intelligence → Ars Vivendi / Life Report.
2. Choose period; verify each source count and last record date. Check 'Compass Daten neu abgleichen'.
3. Open report and browser print preview; check cover, legibility of charts and complete source audit.
4. Repeat with opt-in Finance (real Sankey), opt-in Places (Worldmap). Off means neither should appear.
5. With enough imported nights, food and transactions, verify the cautious recommendations cite measured periods and do not treat missing days as zero.
6. Optional LM Studio (running locally) may prioritize the statements. Without LM Studio the report remains complete.
7. Confirm existing Today, Nutrition, watch sync, and Focus Mode are unchanged.
