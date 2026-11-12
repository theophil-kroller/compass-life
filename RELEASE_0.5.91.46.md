# Compass Life 0.5.91.46 · Anatomical exercise-tonnage trends

**Baseline:** 0.5.91.45. This release is read-only and does not migrate, reset, or modify the encrypted vault.

## What changed
- Below the existing **Muskelbeteiligung** ranking, a new `Wie viel hast du bewegt?` section displays exercise tonnage (`weightKg × reps`) attributed to **primary** and separately **secondary** muscle roles.
- Select rolling periods: **7 days**, **30 days**, **6 weeks (42 days)**, **90 days**. The analysis uses the full already-deduplicated Garmin/FIT + confirmed Coach session history, independently of the muscle map's existing shorter filter.
- Each region shows covered/uncalculable sets, a bar relative to the most documented region in that time window, and a direct previous-window comparison when both sides have logged weight and reps.
- For bodyweight exercises, sets with missing weights/reps, duration-only exercise, unknown Garmin categories and missing historical data, the module never fabricates kilograms or apparent progress.
- The existing muscle map, its today/yesterday palette, coaching rules, exercise progressions and other sections remain unchanged.

## Metric / interpretation limits
This is **attributed exercise tonnage**, NOT an exact load borne by a muscle. A multi-joint exercise can assign the full exercise's kg × reps to more than one primary muscle, so *muscle row totals are not additive*. Secondary is reported separately and stabilizer-only roles are deliberately omitted. The result cannot be interpreted as a measured muscle force, muscle fatigue, quality of stimulus, or hypertrophy. Bodyweight work has no directly comparable external-kg tonnage. Unilateral or paired dumbbell loads use the recorded `weightKg` exactly (no guessed doubling). Increasing tonnage is not always a beneficial outcome; RIR, execution, exercise and recovery matter.

## Installation / deployment
Upload changed files from the patch at repository root on top of 0.5.91.45, keeping folder hierarchy. Or use the full source archive. GitHub Actions must verify the production build; local Vite dependencies are not installed here.

## Visual timeline
Each muscle row also shows four chronological rolling 7-day tonnage bars (oldest to newest). The newest week is gold, providing context for progression without pretending to measure actual force per muscle.

## Tests (2026-11-12)
- New focused checks: 5/5 passed (weight × reps, role attribution, missing loads, midnight, intervals, read-only UI).
- Production import graph: 295 modules, no missing relative imports.
- Release/deploy-oriented tests: 33/33 passed.
- Full suite: 2,251 passed / 66 known baseline failures, **0 new failures** against 0.5.91.45.
- Actual local Vite production compilation not performed because local Vite dependencies are missing. GitHub Actions must verify it.
