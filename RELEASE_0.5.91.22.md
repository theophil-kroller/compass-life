# Compass Life 0.5.91.22 — Muscle Stabilizers & Actual Load Corrections

**Base:** deployed source at commit `e55d8a837ee1d932e6c2a21a887c50c5dba35124` (Compass 0.5.91.21). Patches preserve the GitHub Pages hotfix installed in `.github/workflows/deploy-pages.yml`.

## Changes

- Muscle Map: reviewed all **66** known exercises; shows a third **teal** category `Stabilisierend · kein Wachstumssatz`. Example: Goblet Squat → calves and tibialis; quads and glutes remain primaries. Qualitative models only, not EMG readings or direct hypertrophy evidence. Stabilizing involvement adds **zero** primary/secondary training volume.
- V-Taper home: optional/accessory calf raise, normally 2 sets of 10–15 with 60 seconds rest. Coach retains emphasis on shoulders, lats, and core; no fictitious required calf-recovery from stabilization.
- During the guided workout: Open `Bestätigte Sätze: Gewicht / RIR korrigieren` to edit the actual kg of any confirmed set even after confirmation. Input updates that set, preserves day/time and RIR, persists to encrypted canonical session.
- After workout: Under Insights → Krafttraining, open `Tatsächliche Satzgewichte korrigieren`, choose saved Compass workout and edit any confirmed set's actual weight. No Garmin source file or recommended load is overwritten.
- Real 11 kg overrides an earlier 9 kg proposal once the relevant set records 11 kg. The coach picks the most recent same-day *performed* session rather than the session containing the most sets. Only observed, confirmed weights are used for progression.

## Installation

1. `PATCH_FROM_0.5.91.21.zip`: extract all contents at the repository root, preserving folders. Upload changed files to `main`.
2. Or use `FULL_SOURCE.zip` if the repository source differs from 0.5.91.21. Do not combine these ZIPs.
3. GitHub Actions must show a successful production compilation and Pages publication. Packaging a source ZIP is **not** proof of Pages deployment.

## Privacy and safety

No personal fitness records are in these source artifacts. No automatic historical rewriting of workouts. Each confirmed set's `completedAt` and `completedDay` are preserved. Stabilizers are interpretive (not physiologic measurements), and do not increase tracked hypertrophy load.

## Checks

New focused regression tests and existing deployment tests: see build log or run `node --test tests/compass-059122-muscle-stabilizers-actual-set-weights.test.mjs && npm run check:deploy`.
