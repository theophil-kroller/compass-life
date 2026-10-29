COMPASS 0.5.77.59.40.25.10 – URGENT RECEIPT JOURNAL PRESERVATION FIX
Stand: 2026-10-29

BASIS: currently deployed 0.5.77.59.40.25.10; GitHub current file sha 1ea587e6b07234f0562c1277f550aea447d404e8.

Patch changes only client/src/personal-journal-v5692.js and adds a regression test. The old full-snapshot Vite build had dropped the transform that originally injected 3 merge functions. Without this, any encrypted journal sync could erase receiptJournal/dreamJournal/strengthJournal from local state and cloud mirror.

BEFORE UPLOAD: Preserve previous encrypted Compass backup files and any other device that might still hold the data. DO NOT initiate personal journal sync until the fix is deployed. Updating JavaScript does not restore already deleted local IndexedDB records.

APPLY: unzip, upload the client/ and tests/ paths to repo root, replacing same path. Do not upload ZIP itself to repo root. No migration and no Garmin change.

VERIFIED: node native tests of all 5 new cases plus existing journal/receipt tests; syntax checked. Full production Vite build NOT performed in this sandbox. The GitHub Actions npm run check and npm run build are mandatory and must both pass.

RECOVERY: Try an older encrypted Vault backup from before the data loss, or another device kept offline (without sync). Historical GPT JSON responses/receipt images can be re-imported only after safely preserving data. Cloudflare D1 Time Travel might be able to retrieve older encrypted mirror snapshots, if they existed, but needs separate careful recovery and the correct sync key; not a standard in-app restore.
