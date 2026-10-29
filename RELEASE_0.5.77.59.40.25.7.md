# Compass Web 0.5.77.59.40.25.7 — Core First / Local-First GTD

## Core change

- Frequent GTD mutations (progress, toggle, reorder, create, rename, flag, archive) use a *small AES-GCM-encrypted IndexedDB delta journal* instead of synchronously copying/re-encrypting the entire health/finance/GTD vault.
- Changes are rendered optimistically, with the encrypted journal written immediately. The mutation is considered durably saved only after the IndexedDB transaction commits.
- Lock/unlock replays the encrypted GTD journal over the last snapshot. Snapshot + journal compaction use one IndexedDB transaction. Encrypted backups contain both the snapshot and journal.
- Background full-vault compaction starts after at least 10 seconds of inactivity, on a scheduled timer; background cloud and personal-journal synchronization favor idle periods. Manual sync remains available.
- Cache policy: 10 seconds quiet time, 120 seconds maximum automatic-sync deferral (unless editing, offline or hidden). The 15-minute automatic vault lock remains in effect.

## Limits

- This release does **not** yet split all Insights/Finance/Coach JavaScript into lazily-loaded modules; that remains a separate bundle-size performance task.
- The generic saving path of non-GTD data still uses full encrypted snapshots. Some Today calculations and cloud synchronization can remain slow in practice.
- The existing on-device performance export should be used for comparisons on large real-world data. No production device speed-up is guaranteed by synthetic tests.
- Running cloud sync or compaction is subject to browser throttling, page life-cycle, and network availability. Local GTD journal durability is not deferred to idle time.

## Verification

- Node.js suite: 1,690/1,690 tests passed, including encrypted IndexedDB journal replay, lock/unlock, snapshot compaction and source transforms.
- `node .verify-transform.mjs`: 79 transforms applied successfully to main.js; client version 0.5.77.59.40.25.7.
- GitHub Actions Vite production build / deployed PWA: **not yet verified**. Please upload patch and check CI before relying on the deployed release.

## Install

- Apply the patch paths relative to the repository root on top of 0.5.77.59.40.25.6, or use the Full Source archive.
- Do not upload user data with code. Keep a current encrypted vault backup when upgrading storage architecture.
