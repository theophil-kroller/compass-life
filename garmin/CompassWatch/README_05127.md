# Compass Chrono 0.5.12.7 · Pomodoro Checkpoint Sync

Based on exactly the `0.5.12.6 PEOPLE_TODO_BACK` full source.

- Each new session receives a stable 33-character `w...` session ID at start.
- Completed 25-minute Pomodoros save a revisioned, non-final snapshot locally and attempt a quiet authenticated POST.
- The final session revision is durably queued before clearing the resumable draft and is uploaded automatically where network permits.
- Unacknowledged partial/final uploads remain locally retriable, with monotonically increasing revisions and no extra Pomodoro counting.
- Discarding a recorded draft queues a cancellation tombstone (for even already uploaded partial snapshots).
- On app exit a recoverable draft is persisted. Network transfer is best-effort, not guaranteed by Garmin Connect IQ during OS termination.
- `Korrektur` now transmits `Pruefungskorrektur`, distinct from `Pruefungen` exam supervision.
- Preserves all People, Shopping, Family, Today, Deadline and premium Chrono UI behavior from 0.5.12.6.

**Dependency:** Web/Worker patch 0.5.77.59.40.25.10 including D1 migration 0020 must be deployed first. Old Worker can accept the new correction category but not revision updates.

## Installation

Patch ZIP: Extract at Garmin project root and replace `CompassWatch/source/CompassApp.mc`, retaining every resource from 0.5.12.6.

Full ZIP: Contains the entire `CompassWatch` project with this changed source.

Build with the Garmin Connect IQ SDK for the fēnix 7S, install on device, verify a completed Pomodoro, offline retry, final upload and correct classification. SDK compilation and device testing were **not available** in the build environment.
