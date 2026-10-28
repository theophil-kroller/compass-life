# Compass Web 0.5.77.59.40.25.1 — Deploy Gate Repair & Solar Cover

## Actual GitHub Actions failure
- Run `40781386634`, job `123143652542`: 1 failed of 1658 tests in `npm run check` (build not run).
- `tests/compass-0577594017-nutrition-ux.test.mjs` asserted version 0.5.77.59.40.25 in the checked-in `transformed-main-preview.js`, which was still generated at an older version.
- The test now generates the transformed source IN MEMORY from the actual Vite release plugin registration on every test run. It never relies on an unupdated committed preview artifact.
- Does not relax or skip assertions. Any guarded transform failure still breaks CI.

## Solar cover
- Replaces the previous nearly-black forest green with a warm printable yellow–sunshine–amber gradient (#FFEAB1 → #F9C65F → #F6AA41 → #E78335).
- Uses dark warm-brown type for excellent contrast and exact print colors.
- Retains the minimal PRIVATE ARCHIVE / PERSONAL CHRONICLE / Ars Vivendi cover layout.
- Interior chart/data palette remains unchanged.

## Installation
Apply the patch onto a repository with .40.25 already uploaded (the failed #307 deploy). For a fresh repository, use the full source archive. Upload all ZIP paths preserving directory structure, commit and watch GitHub Actions.
