Compass Web · Watch Bridge 0.5.12 · CI Hotfix (2026-10-27)

Failure: GitHub Actions #291, npm run check, tests/session-worker.test.mjs.
Cause: the test imported worker/src/index.js as a data URL, without stubbing the
new static watch-dashboard-v512.js import. Relative imports from data URLs fail.

Change: ONLY tests/session-worker.test.mjs. Watch Bridge, data, cloud endpoints,
authentication, and the Garmin application are unchanged.

Patch installation: upload tests/session-worker.test.mjs to the corresponding
path in GitHub, replacing the existing file. Commit and await Deploy Compass Web.

Local verification: node --test tests/*.test.mjs => 1568 passed, 0 failed.
GitHub Actions deployment has NOT yet been rerun for this patch.
The Cloudflare Worker and migration 0019 must still be deployed separately if
not already deployed; this CI fix does not perform that deployment.
