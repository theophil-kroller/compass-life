# Compass · 0.5.77.59.40.25.22

**Base:** successful GitHub Actions run #333, SHA 3297de98e254dd5c422c2cfd5623ed503ba7a361 (Compass .40.25.21).

## Scope

- Insights → Gesundheit & Körper → Körperanalyse: new live-rendered fat-mass visualization directly below Fitdays classification and before historical graphs. It recomputes from the selected Fitdays time window, from real weight and body-fat readings; no default 21.3 kg. Displays seven illustrated masses (2.5, 5, 10, 15, current, 25, 30 kg), current share in percent of latest weight, fat-free proportion in a ring, individual dated history points. If values are missing, the illustration does not pretend they exist. Illustrations are stylized and not medically accurate volume reconstructions. A locally supplied fat tissue illustration from this conversation has been cropped into a tiny reusable WEBP in client/public; visual source is not a 3rd-party stock item.
- Nutrition quick capture: historical `green-tea-chinese` restored with 250 ml cup; 0–3 kcal energy estimate and 38 mg caffeine estimate, with existing phyto catechins and Daily Dozen beverage classification. Existing encrypted entries with this ID remain readable.
- Nutrition quick capture: time-aware `Recommended` section at the top, scored from entries in the last 90 days, with recency weighting and proximity to current local clock time. It neither sends data to a server nor makes automatic entries. Every previous group remains below.
- Guarded historical Vite nutrition bridges now recognize already materialized green-tea source definitions, preventing duplicated options or crash during transformation. Tests check both synthetic historical inputs and current working sources.
- Unified visible release string .22; original historical snapshot version constants preserved. No schema migration, no changes to encrypted sync.

## Installation

Upload the contents of the PATCH ZIP preserving relative paths to the repository's **main** branch on top of build #333. GitHub Actions production build must then succeed. Full source zip is an alternative, not something to upload on top of the patch.

## Validation

- `npm test`: 1774/1774 passed (2026-10-30)
- `npm run check -w worker`: passed
- JS syntax checks passed
- Production Vite build not executable locally: vite dependency not present; rely on GitHub Actions after upload.
