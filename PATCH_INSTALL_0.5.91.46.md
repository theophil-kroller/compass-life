# Patch 0.5.91.46 — Muscle exercise tonnage by week/month

Base version: **0.5.91.45**. Extract/upload at the GitHub repository root, keeping `client/src/` and `tests/` directories.

The patch changes no personal data and no vault schema. It adds `strength-muscle-volume-v059146.js` and uses the existing confirmed, deduplicated strength sessions for read-only aggregate metrics.

After uploading, verify `npm run check:deploy` and GitHub Actions Vite deployment. If currently deployed version is older than 0.5.91.45, install the full source archive instead.
