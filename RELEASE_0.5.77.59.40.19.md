# Compass Web 0.5.77.59.40.19 — Ars Vivendi Annual · Private Chronicle

Based on **0.5.77.59.40.18**. No changes to Garmin app, D1 schema, Worker auth, or private Vault storage.

## The first full annual edition

This release replaces the 11-page pilot report with an evidence-led, structured annual book. **It is a significant first annual edition, not a claim that every one of the existing Compass analytics or a full 80–120-page, editorially commissioned volume is already reproduced.** The number of pages depends on actual imported data and opt-ins.

- 10 thematic parts: Life Balance, Time/Work, Sleep & HRV, Fitdays/Body & Strength, Nutrition including Daily Dozen, Fat Quality & Phyto, Money, Relationships, Feelings, Geography, Cross-Domain Discoveries, Recommendations, and Source Audit.
- Original SVGs reused from the current Compass insight modules wherever possible: Life Balance Radar, Excel Worktime, sleep year, Body Transformation, nutrition timing + macro trend + fat quality + plant compounds, Strength, finance hierarchical Sankey/Spending Calendar/Streamgraph/Sunburst, relationship map and world map.
- Genuine calendar-axis vector plots supplement short-range dashboard charts; absent days stay empty. The report never invents unrecorded values or claims that a lack of nutrition check-ins is a nutrient deficiency.
- Independent opt-in switches for **finances**, **travel/location**, **people**, and **feelings** (all default OFF, session-only UI settings).
- Data inventory, stale-source notices, evidence-led and cautious recommendations, checked sleep/HRV and work/sleep correlations when enough matched observations exist.
- A4 print design with ample 21 mm horizontal margins for archival binding. Local print-to-PDF (browser header/footer should be disabled). No remote PDF rendering and no third-party uploads.
- Local LM Studio reorders prevalidated evidence only, just as in the previous version. Freeform generative narrative, review of the complete history, and true PDF/A/Typst or LaTeX production remain future quality gates; report claims are never machine-invented.

## Deployment

**Patch:** Copy the contents of `Compass_Web_0.5.77.59.40.19_ARS_VIVENDI_ANNUAL_PATCH_FROM_0.5.77.59.40.18.zip` to the repository root on top of the functioning .40.18 files, preserving directory structure. Do **not** upload the ZIP file itself as a replacement for the repo.

**Full source:** `Compass_Web_0.5.77.59.40.19_ARS_VIVENDI_ANNUAL_FULL_SOURCE.zip` provides a complete snapshot as an alternative to applying the patch. Do not apply both.

The GitHub Actions web deployment must pass `npm run check` and `npm run build` and be smoke-tested after publish. The local constrained environment does not have Vite installed; successful source transforms and Node tests are NOT proof of a production Vite build.

## Local verification

- 66/66 Vite-style source transforms, with version .40.19 after .40.18 and all previous patches.
- Automated Node regression suite, including new opt-in, chart, and missing-data tests.
- Synthetic full report rendered by Chromium/Playwright to PDF. Page-overflow diagnostics run for all 34 test pages, with **no overflow** after margin corrections. Synthetic data only; user records are not bundled.
- Checked PNG previews of cover, Daily Dozen, Body Composition, Sankey and Worldmap. Real vault data requires a manual browser smoke test.

## Known limitations

- Dynamic yearly chapter inventory is broader than .40.18, but not every exotic financial chart or every quantified-self visualization has been individually incorporated; data sparsity deliberately suppresses unsupported charts.
- Print-to-PDF requires turning off the browser's auto header/footer and turning on background graphics. A true pre-press PDF/A/CMYK/bleed/pagination QA workflow is not part of this release.
- Large hierarchic Sankey data may still need separate detailed landscape export from the existing interactive Finance dashboard for comfortable merchant-label reading. A4 archival version keeps the complete SVG within the page.
- Date labels and some original module SVGs have smaller font sizes at A4; verify actual output before professional printing.
- Garmin Connect Personal API direct sync, Fitdays automatic sync and bank account coverage checks are not implemented here; data readiness cannot guarantee newest external data without such connections.
