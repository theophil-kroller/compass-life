# Compass 0.5.77.57.1 Hotfix

Upload into `theophil-kroller/compass-life` (branch `main`) preserving paths:

Replace:
- `client/compass757-bridge.js`
- `client/src/mobile-workflow-v57757.css`
- `tests/compass-057757-mobile-workflow.test.mjs`

Add:
- `tests/compass-057757-full-transform-chain.test.mjs`

Optional docs:
- `CHANGELOG_0.5.77.57.1.md`

No replacement for `vite.config.js` or other modules is necessary (the failed .57 upload already contains those files).

Inspect GitHub Actions › Deploy Compass Web. `npm run check` now transforms the complete real main.js before `npm run build` and will fail early on missing anchors.
