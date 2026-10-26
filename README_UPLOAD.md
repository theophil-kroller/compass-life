# Compass Life 0.5.77.59.31 – Family Radar + Repair #264

Repository: theophil-kroller/compass-life
Base: commit 5911ab6f9bb7665f56f69acf8d26ef85f42a2cf3 (failed Actions #264)

## INSTALLATION
1. Unzip. Upload the `client/` and `tests/` subdirectories into the ROOT of the repository on branch `main`, keeping exact relative paths.
2. Replace only files with matching names: `client/vite.config.js` and `client/compass5930-mobile-longevity-bridge.js`. All remaining files in the patch are new.
3. Do NOT upload README to client/; it is documentation only.
4. GitHub Actions must run `npm run check` and production build successfully before treating this as deployed.

## Delivered
- .30 hotfix: Daily Dozen integration no longer depends on volatile Insights HTML markup altered by historical bridges.
- .31 Family Radar: parses Google Calendar titles prefixed `Nathanael:` or matching an existing contact's name/alias. Calendar events remain read-only and are grouped with reminder entries.
- People: 30-day Family Radar for selected contact with compact rules (math-support default: 14 days; paperwork lead: 21 days; other tests informational by default).
- Today: max 3 actionable family prompts, not a second large dashboard; rejects and snoozes are recorded.
- GTD: explicit opt-in to create two math learning tasks, one paperwork task or a Familie project with 4 steps. Idempotency uses stable original calendar event IDs + decisions.
- Preserves legacy Focus navigation and .30 Extended-only direct navigation.
- No migrations, no Google Calendar writes, no new API calls.
- Version: .31 in app & lockscreen source transform.
- Adds a GitHub Actions `compass-full-source` artifact AFTER successful `npm run check` and `npm run build`. No extra user-side scripting or additional build workflow.

## Scope and limitations
- The patch does not create Google Calendar study appointments, only private GTD tasks with suggested planned dates.
- No automatic creation of tasks or projects.
- Person profiles must already be present locally; current encrypted contact synchronization stays opt-in. The Family Radar decision record is stored in local Vault state and is not separately synchronized by this patch.
- If Google Calendar cache is offline, the existing cached data is used; no fabricated event or availability is implied.
- No dedicated Forecast badges are added; original calendar event listings remain available.
- The longer-term schedule-aware learning suggestion engine remains a future step.

## Verification
- 24 targeted Node tests passed (including the previous v.30 tests, calendar matching, deduplication, deadlines, persistence decisions, and historical modified markup).
- Node syntax checks passed for the new bridge and modules and the Vite configuration.
- Full repository `npm run check` and Vite production build have NOT been executed locally. GitHub Actions remains the acceptance gate.
- This is a PATCH, not a genuine full source build; complete source clone is not available in the current read-only runtime. The new CI source artifact will supply a real full source snapshot after the next successful deployment. Do not call the current ZIP a full build.
