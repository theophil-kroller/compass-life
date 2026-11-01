# Compass Life 0.5.90 — Coach Data Coverage, Compact Protein, Optional Exercise, Yogurt Recovery

Base: Compass 0.5.89, GitHub commit `dfd4fab5db7c0b6686383eee460498290e5bad07` (2026-11-01). Source-compatible additive release; no migration or deletion of vault data.

## Included

1. **Garmin sleep and HRV coverage**: Coach now evaluates `sleepMinutes` **or** the saved Garmin `totals.deep + totals.light + totals.rem` stage fields. Nightly samples are still deduplicated by date. The Coach separately displays number of recorded historical nights, most recent date, recent 3-day coverage and 3–45-day baseline. Missing recent values do not imply missing history or a negative training readiness score. HRV still requires 2 recent and 10 baseline observations.
2. **Protein compact in Today**: the full-width protein bar no longer displaces the three-pane workspace. A compact protein tracker appears in the right-hand recommendations/inspector peek and is hidden when recommendations or a selected task inspector are shown. The +Essen control navigates to nutrition quick entry, not an inert action. Incomplete nutrition stays marked as a partial recording.
3. **One contextually selected optional movement**: the existing V-Taper Coach suggests at most one movement based on goal, equipment, fatigue/recent documented muscle work and time budget, with explicit Accept or Skip. Short workouts use a swap; for longer workouts, append is possible only where estimated budget permits. No auto-activation, no Snatch before separate technique approval, no sled at home, no StrongLifts A/B override. Skipped idea is scoped to selected date/training configuration on this device. Existing six exercises, IDs, visual assets and training data are preserved.
4. **Yogurt breakfast restoration**: six legacy IDs (base yogurt, honey, two KoRo nut/sesame spreads, two personal yogurts) are now native food presets with same IDs. Prior log entries remain resolvable. Nutrition ingredient breakdown and editable quantity estimates preserved. Historic Vite breakfast bridge recognizes that the source presets already exist, avoiding duplication or brittle re-insertion. No new separate food database or data migration.

## Verification

- New tests: `tests/compass-0590-*.test.mjs`.
- Relevant targeted suite incl. historical breakfast bridge tests: **34/34 passed**.
- Deployment tests: **33/33 passed**.
- Full suite: **1,865/1,900 passed**. The same **35 failures** occur in the previous run before restoring native yogurt catalog; no new failures.
- `node --check` syntax checks passed for modified JavaScript.
- Full dependency-based `npm run build` **not verified** because Vite is not installed locally and the npm registry is unavailable in this environment. GitHub Actions should build the source on upload. Do not describe these archives as compiled production artifacts.

## Deployment

Apply PATCH to the exact 0.5.89 GitHub base above, or use FULL SOURCE. Neither archive includes private journal information. Preserve the real encrypted vault/remote secrets and personal backups.
