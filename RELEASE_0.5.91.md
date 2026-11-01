# Compass Life 0.5.91 — Training-era V-Taper Trends & 96% Confidence Bands

**Base:** 0.5.90, GitHub commit `ad910ffd6674b13bfb012593d4ca574288aad2ee` (2026-11-01). Source-only additive update; no vault migration and no modifications to imported measurements.

## Changed

1. **Trend since documented training start:** `vTaperModel88` derives the earliest confirmed/recorded gym or Coach training session from the existing 90-day `strengthPeriod` data. Fitdays readings on or after that date are modeled separately, with a visible dashed training-start marker. The detailed chart now prioritizes recent training-era data; early 2024 points no longer squeeze all late-2026 points together. A historical pre-training trend, when statistically estimable, is displayed separately and never interpreted as a causal effect.
2. **Observed short-term trend versus future forecast:** a nominal two-sided **96% Student-t OLS confidence interval of the fitted conditional mean** is available from five unique measurement dates spanning at least seven days. The short-term observation is displayed immediately when supported; the existing >=8 points / >=45 days gate for future multi-month scenarios remains unchanged. There are no fabricated body-fat or muscle growth forecasts. No guarantee of independent, identically distributed Fitdays errors is made; BIA measurement uncertainty and temporal autocorrelation are not captured by the statistical CI.
3. **Dotplots:** weight, body-fat BIA and muscle-mass BIA, logged protein and known strength sets within Body Transformation use their actual dated points, visible y-axis numeric ticks, and (only if there are enough data) a trend line with 96% mean CI. Missing days are not filled as zero; estimated/incomplete protein days remain hollow and described as logged partial intake. The fat-mass derived Fitdays plot also now has a proper numeric y-axis and trend/CI, while keeping observed points.
4. **Missing Garmin set data:** summary-only Garmin workouts with unknown set totals no longer appear as if zero working sets were completed. Sessions remain visible with a message that detailed set counts are unknown.
5. **Empty goal-weight strip removed:** without a user-supplied target, the old `Obesity · Gewicht / Zielgewicht` chart is omitted and replaced by a concise explanatory note. An explicitly supplied target still displays the existing opt-in relative weight strip. No unrequested target weight or precise future body-fat percentage is invented. Existing V-Taper circumference tracking remains available.

## QA

- New: `tests/compass-0591-trend-and-vtaper.test.mjs` — **10/10** tests, including actual 96% t quantiles, duplication, sparse data, training start, and no invented long-term forecast.
- Overall: **1,875/1,910** pass, 35 same pre-existing failures as the unmodified 0.5.90 baseline (1,865/1,900).
- Deployment tests: **33/33** pass. Import graph: **263 modules**, no missing relative imports.
- Syntax checks: modified JS files pass `node --check`.
- **Vite build not confirmed**. `npm run build` reports `vite: not found` because local dependencies are not installed. Build output **is not** included. CI/GitHub Actions must verify production bundling after upload.

## Interpretation

The 96% CI quantifies uncertainty around a simple linear conditional mean **under model assumptions**. It is not a 96% probability of personal future weight, not a BIA instrument-error interval, and not evidence that the exercise program caused the trend. Observations over ten days may reflect water, glycogen, time-of-day and other conditions. Reassess after a longer standardized series of measurements and include waist and strength changes for the actual V-Taper objective.
