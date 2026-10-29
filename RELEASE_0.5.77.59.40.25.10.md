# Compass Life 0.5.77.59.40.25.10 · Unified Worktime & Productivity I

**Patch base:** Compass Web 0.5.77.59.40.25.9 (Instant Today / Deferred Family Radar)
**Watch companion:** Compass Chrono 0.5.12.7 (separate ZIP)

## What changed

- Watch sessions upload as **versioned checkpoints**; cloud records are updated only by newer revisions, and final versions are immutable. Already stored legacy sessions keep revision 0 and finalized=1.
- Existing Garmin category **Korrektur** now sends `Pruefungskorrektur`, distinct from `Pruefungen` for exam supervision. Old generic `Pruefungen` records remain recognizable and flag for manual review; no guessed historical reclassification.
- Full authenticated watch-session history via keyset-paginated `/api/watch/sessions?limit=200&cursor=...`, with lazy history loading on Insights/Activities/Progress rather than slowing Today.
- Existing Activity Inspector: optional **Tätigkeitsart** separate from broad area (`Arbeit`, `Soziales`, etc.), editable without changing original Garmin measurements. Existing project linkage remains intact.
- Productivity: category-colored stacked timeline and exact focus time, session duration, Pomodoro count per recorded activity type; `Forschung`, `Lehre`, `Pruefungskorrektur` stay separate.
- Time Journal: includes Garmin sessions as displayed source records; interval union prevents duplicate counting when Garmin and Compass Quick Time overlap. Click a watch row to open Activity Inspector.
- Progress: category-by-category time allocation for the last 7 days and recorded/focus hours for linked projects.
- Pending checkpoints from discarded sessions are tombstoned so late mobile uploads cannot recreate them.
- No new central project database or additional timer; encryption overlays and existing GTD structure stay in place.

## Deploy order (important)

1. Confirm the currently checked-out repository is Web 0.5.77.59.40.25.9, **not older main**.
2. Make an encrypted backup. Apply the contents of this ZIP at repository root (preserve paths).
3. Run the **Cloudflare D1 migration `0020_watch_session_revision.sql` BEFORE deploying the changed Worker**. Existing `npm run db:remote` from repo root applies pending migrations when configured and authenticated; review migration status first.
4. Deploy Worker (`npm run deploy:api`) and verify authenticated `/api/watch/sessions` pagination. The GitHub Pages workflow deploys the web frontend but does **not** automatically deploy the Worker or run D1 migrations.
5. Deploy Web app via normal GitHub Pages workflow. After Worker deployed, update Garmin from separate Watch ZIP.
6. Check session transfer, partial and final revisions, and historical activity classification; inspect no doubling in Time Journal.

## Verification

- Strict transform on retained `.40.25.9` preview: successful.
- `npm test` against retained `.40.18` full-source baseline with the changed source modules/Worker and updated fixture: **1619/1619 passing**.
- SQLite schema/upsert/tombstone tests: passing.
- `node --check` of changed JS modules: passing.
- **Not** verified here: production Cloudflare deployment, `npm run build` against actual installed `.40.25.9` source snapshot, Connect-IQ SDK compilation and hardware/watch behavior. These remain mandatory before treating the build as production-tested.

## Known boundaries

- On device termination, Garmin Connect IQ cannot guarantee that a new HTTP request finishes. Locally persisted checkpoint and final queue survive and retry in the foreground.
- Intermediate snapshots in Compass are provisional; a discarded active session is removed once its cancellation tombstone reaches the Worker.
- A watch only knows its category. Project/task linking remains a Web app operation.
- Unmeasured time is unknown, not zero productivity. Pomodoro count is not a measure of research output quality.
