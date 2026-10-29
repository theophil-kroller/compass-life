# Compass 0.5.77.59.40.25.9 · Instant Today & Deferred Family Radar

## Changes

- **Birthday ribbon stays immediate:** Filter the calendar to the next seven days *before* running the existing birthday classifier; birthdays from encrypted People records remain included. Existing deduplication and all-day recurring birthdays remain intact.
- **Family radar outside the critical path:** The initially rendered Today view does not calculate family proposals or school notices. A dedicated module Worker computes these using only the 30-day relevant calendar events, minimal people identity/rules, and task/project Family Radar keys. The completed markup is attached without rerendering Today.
- **Concurrency and privacy:** In-flight worker results from older state/date revisions are discarded. Locking clears in-memory results and terminates the Worker; no personal data is stored unencrypted, transmitted to remote services or persisted in a worker cache.
- **Fallback:** If module workers cannot run, family hints are computed on the main thread *after* first paint; core GTD is still rendered first. In that environment, a later pause may remain perceptible.
- **Other panels:** The People/Family view still computes synchronously when explicitly opened. This change does not remove or auto-create deadlines.
- **Performance:** Measures `Heute: Geburtstage sofort` and `Heute: Familienradar Worker fertig` separately.

## Verification

Node.js regression suite, guarded transform, worker logic, date-scoped birthdays, cache invalidation and crash recovery reviewed. Live production deploy and performance on user's browser require confirmation.

## Installation

Apply PATCH_FROM_40.25.8 to the repository root, or upload the full source. Keep paths; ensure GitHub Actions `npm test` and `npm run build` succeed. Before storage upgrades, keep a recent encrypted backup.
