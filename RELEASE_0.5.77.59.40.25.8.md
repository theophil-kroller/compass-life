# Compass 0.5.77.59.40.25.8 — Core Performance II

## Target: the measured bottlenecks after .40.25.7

- **Weekly Review:** Review navigation, marking stages complete, resetting the workflow and marking a project reviewed use the existing AES-GCM encrypted IndexedDB GTD journal instead of waiting for whole-vault encryption. Review status and `reviewPending` replay correctly after unlock; accepting a reviewed project also preserves its `reviewedAt` and `projectPending` fields.
- **Task Inspector:** Editing a task, including title, status, dates, notes, tags and project association, now records a narrow task delta while retaining draft protection and validation; it does not copy the entire health/finance vault. An optimistic render comes before the local journal commit. Failed local persistence rolls back and reports an error.
- **Today checkboxes:** Immediate completion painting updates only the affected task row and the numeric `done/total` count; no expensive full-day task scan inside that paint routine. The next full render recomputes its authoritative count.
- **Today family/birthdays:** Already-generated birthday and family radar markup is reused for unrelated GTD changes, but is invalidated when the calendar reference, calendar update timestamp, people/family data references, journal revision, day, hidden-calendar setting or general non-GTD state mutation changes. Contact view continues calculating its own current family panel.
- **Performance export:** Separately measures `Heute: Aufgaben und Kalender`, `Heute: Familien- und Geburtstagsradar`, and `Heute: Shell und Hinweise` so future optimizations are driven by actual device timings.
- **Crash recovery:** Small review changes are part of the same AES-GCM IndexedDB journal as tasks. Snapshot plus journal compaction still uses an atomic transaction and cloud sync remains idle-aware.

## Important limits

- The full Today calculation and heavy add-on bundle loading are not yet completely eliminated. Performance on the user's device needs to be confirmed with the next export; no speed-up is guaranteed for all Today paths.
- Freezing/batching of remote sync conflicts still follows the previous core-first model. Verify simultaneous edits from two devices, especially a Weekly Review on both.
- Web-only change: Garmin firmware is untouched. This does not yet implement the separate Unified Time Tracking project.
- A local encrypted Compass backup is recommended before installing storage-related updates.

## Verification

- 1,694 of 1,694 Node.js tests passed, including an actual AES-GCM/IndexedDB lock-unlock replay of review state, unchanged finance/health, Today memoization and 80 registered Vite source transforms.
- `node --check transformed-main-preview.js` passed.
- GitHub Actions/Vite production deployment has **not** been run or verified here. Inspect Actions after upload.

## Installation

1. Apply the patch ZIP to the repository root over Compass .40.25.7, preserving paths, **or** upload the full source archive.
2. Run `npm test` and `npm run build` in CI.
3. In Compass, test `+1`, checkbox, task inspector, Weekly Review and the next unlock; then export the performance measurements.
