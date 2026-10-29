# Compass .40.25.10 — GitHub Actions #321 / Journal-Merge Compatibility Fix

Base: successful GitHub Actions #320 source (commit 1d80776c), plus security patch uploaded as commit e848a33 (#321).

## Verified cause
Run #321 passed 1,712 of 1,713 tests. The single failure was the historical Vite transformation test
`compass-0577594015-smoothie-integration.test.mjs`:
`Compass .43: expected exactly one journal merge imports integration anchor, found 2`.
The security patch had already added dream/receipt merge imports and fields directly to
`client/src/personal-journal-v5692.js`, so the older `client/compass743-bridge.js` transform attempted to add them a second time.

## Fix
`client/compass743-bridge.js` now recognizes an already COMPLETE integration and leaves it alone.
Unintegrated historical source still gets the original transformation. Partially integrated or
repeated markers still cause an error (fail closed).
`tests/compass-40-25-10-receipts-bridge-idempotency.test.mjs` verifies all three cases.
The prior data-protection patch remains in effect and is NOT reverted.

## Installation
Only upload `client/compass743-bridge.js` and
`tests/compass-40-25-10-receipts-bridge-idempotency.test.mjs`
from the PATCH ZIP, preserving their repository paths. This assumes the #321 security patch is already present.
No Garmin changes or database migrations.

## Test results
Locally performed against the complete, verified source ZIP published by the last successful GitHub run #320,
with the exact #321 security-patch files layered on top:
`node --test tests/*.test.mjs` => 1,716 passed, 0 failed.
`node --check` for changed .js and the journal module: passed.
The full `npm run build` could not be run in the isolated local environment because NPM dependencies were unavailable.
The repository's GitHub Actions workflow should perform its required npm checks and Vite build after upload.
Do not represent the patch as deployed until GitHub Actions succeeds.

## Data safety
The patch avoids future journal loss but cannot by itself restore already discarded receipt entries.
Before syncing across devices, preserve current local encrypted vault backups and keep any device with
older entries offline for recovery. Do not clear site storage, reset the vault, or overwrite old backups.
