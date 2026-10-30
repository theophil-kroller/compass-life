# Compass Life 0.5.77.59.40.25.25 · Habit Time Intelligence & Quality Fixes

**PATCH BASE:** exactly Compass 0.5.77.59.40.25.24. Do not apply to .25.23 or an older main branch.

## Changes

1. **Wim-Hof Sessions**: separate session records per audio completion. `onComplete` is awaited before displaying a saved status. New "Einheit abschließen & speichern" lets a user finalize a partly heard practice; playback duration is counted from active audio time, not falsely assumed from media length. Minimum 30 s, no duplicate save while a write is running. Stop is intentionally discard. The two previously lost sessions cannot be recovered automatically but can be manually added with time/date/mode.
2. **Habit Time Intelligence**: new, E2EE-journalled `habitTimeSessions` records with unique stable IDs, per-ID multi-device merge, date, duration, manual/automatic provenance, Wim-Hof and Vocal Image forms, duration prompt on Vocal Image quick completion. Makko-Ho, Miracle Morning SAVERS, and completed guided Coach timings are included when the relevant records supply actual durations. Conservative same-day overlap suppression between Coach and Miracle Morning is explicitly documented. No retroactive fabricated duration. One habit check and any number of time sessions per date.
3. **Life Balance Radar**: every current node is colored using its actual 0–100 score band. 75–89 is clearly green, 90–100 distinctly cyan. Two historical traces remain intact and use separate colors.
4. **Fitdays body composition**: replace tiny bitmap crops that contained cut-off printed percentages with infinitely scalable original schematic SVG illustrations. Values and current silhouette are dynamically computed from the latest actual Fitdays measurement. Sixpack only in very low body-fat reference stages; >=20 % no drawn abs. Illustrations are not photorealistic or a prediction of individual fat distribution; imported device muscle mass remains an independent numeric metric.
5. **Strength muscle map**: today's documented primary muscles are red, recent 1–7 days orange, today's assisting muscles yellow, only from mapped exercise sets. Distinct from clinical fatigue assessment.
6. **Ars Vivendi**: the report setup selector now offers 1, 3, 6, 9, 12 rolling months (30, 90, 180, 270, 365 days). Original PDF/report sections and design unchanged.
7. **Daily Dozen**: logged Ratatouille-study-dish whose menu snapshot explicitly names vegetables gets an *estimated half serving*, not a verified full serving, with a visible caveat. It is not inferred merely from the menu database. Exercise can use actual Garmin/imported activity durations, including fractional day progress; unknown intensity is treated conservatively as moderate. Absence of activity records is not proof of inactivity.

## Safety & data

Existing local encrypted vault, existing user logs and cloud records are preserved. New habit-time records are merged by immutable entry ID and timestamp, and included in the optional encrypted device journal sync. No new D1 schema and no Android OS lockscreen access. No Google Drive integration in this build. Already recorded Wim-Hof failures cannot be restored from nonexistent event data; use backfill.

## Test evidence

- Focused new tests: 8/8, combined body + new tests: 13/13.
- Existing .25.23 targeted regressions: 6/6.
- Deployment-targeted Node tests: 24/24.
- Entire historical Node suite: 1733/1744 passing; 11 legacy failures involving missing historical transform scripts/version assertions and old import paths. This is NOT a green full regression suite.
- Import graph: 251 JS modules, no missing relative imports. Syntax checks: pass for modified modules.
- **Vite production build NOT completed in this isolated environment.** `npm install` fails with EAI_AGAIN resolving registry.npmjs.org/body-muscles, so the complete production bundle and actual GitHub Pages deployment cannot be certified here. The GitHub Actions workflow is the authoritative deploy/build check. Do not delete local vault data in any recovery attempt.
