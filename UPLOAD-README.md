# Compass Life · Coach 0.5.77.59.27 · Direct Upload Patch

**Base:** GitHub main at `051163d483e0a3a885b14552762a6626e988a0be` (Workflow #257 failed).

This is an unpack-and-upload patch. NO scripts, builds or command-line work are required on your computer.

## Upload

1. Unzip this archive.
2. In the GitHub repository `theophil-kroller/compass-life` on branch `main`, upload the contained `client/` and `tests/` files **to their exact relative paths**, replacing existing files if prompted. Dragging folder contents into GitHub root should retain the directory structure. If the browser strips directories, use the relevant GitHub folder instead.
3. Commit. GitHub Actions will start by itself. Inspect the new run result.

## What changes

- `client/src/strength-coach-v5775910.js`: Guard when legacy test VM removes imports, preserve health baseline logic in the actual application.
- `client/src/strength-guided-v5775920.js`: Fix second `import.meta` reference; select 17 new WebP start/end photo-style cards for matching exercise IDs. Preserve seven preexisting premium WebPs in `strength-visuals-v5775920/`, and retain SVG fallback for `cable-row` and other unsupported IDs.
- `client/src/strength-insights-v57728.js`: Make Coach/Garmin read overlay independent of unavailable legacy test module fixtures; preserve editor and visual plugin hooks.
- `client/strength-nutrition732-bridge.js`: Make old `.32` Vite source migration compatible with current `.59.26` source, avoiding duplicate imports and annotations.
- `client/public/strength-visuals-v5775927/*.webp`: 17 additional optimized studio/start-end instructional images; source images in other directories unchanged.
- `tests/compass-05775927-deploy-premium.test.mjs`: Regression gates for photo IDs and integration of legacy transforms.

## Notes

The images are AI-generated illustrations, not validated physical therapy/exercise instructions. Appearance was guided by provided reference photographs; only one of the older image renders used those references individually, while the new montage series uses an approximated long-hair/bun model. `cable-row` deliberately retains its existing schematic rather than incorrectly depicting a one-arm variant.

There is NO DB migration and NO change to Vault data or existing workout records.

## Verification

- 17 focused local tests passed (13 existing .26, 4 new .27) with test doubles for unrelated modules.
- Historic .32 transform tested against .59.26 source; all required .35 plugin anchors verified once.
- Full repository `npm run check` and Vite production build NOT runnable in the partial repository workspace. Only the next GitHub Actions run can verify the entire deployment.
