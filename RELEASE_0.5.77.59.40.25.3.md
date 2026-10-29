# Compass 0.5.77.59.40.25.3 – PWA Precache Deploy Fix

## Observed production failure
GitHub Actions #309 (`40790665031`), deploy job `123174790735` passed checks but failed at `npm run build`. Vite transformed 323 modules and rendered a 2,098.39 kB JavaScript main chunk. The `vite-plugin-pwa` Workbox precache stage then rejected `assets/index-CWd70uYU.js` because it exceeded the default 2 MiB limit.

## Fix
`client/vite.config.js` sets `workbox.maximumFileSizeToCacheInBytes` to **4 * 1024 * 1024**. This retains offline caching of the main bundle, instead of disabling it or removing the report. All other PWA behavior (glob patterns, on-demand caching, cleanup, scope) remains intact.

The release plugin increments the visible client/build version from `.40.25.2` to `.40.25.3`, with a guarded transform and an updated release-gate expectation.

New tests assert the Workbox configuration and release registration. No user data, finance records, or annual report contents are changed.

## Installation
Apply patch to `.40.25.2` (the failed #309 state); use the full source ZIP for clean installs. Commit the patch and let GitHub Actions execute `npm run check` and `npm run build`. This workspace can run the Node tests, but does not have the Vite dependencies for a fully local production build.
