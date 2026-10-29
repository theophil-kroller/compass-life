# Compass 0.5.77.59.40.25.5 · Birthdays & GTD Diagnostics

Based on .40.25.4; no migration and no backend changes.

- Compact amber birthday ribbon above Family Radar on Today (all relationships, contact birthdays + Google Calendar birthdays, source deduplication, upcoming seven days, without increasing default Today card stack).
- Today birthdays are immediately visible; upcoming birthdays use a compact disclosure. No surprise GTD task writes or background fetching.
- Contacts open People; calendar birthdays open Agenda.
- Family Radar pre-indexes already accepted work instead of scanning tasks/projects for every proposal.
- Existing performance tracing now separately times view computation and DOM binding. In **Einstellungen → Laufzeitmessung**, start measurement, navigate Heute/Inbox/Planen/Menschen, export content-free measurements for diagnosis.
- Visible only when calendar events are present or birthdays have been saved on this unlocked device; missing or unsynced birthdates cannot be inferred.

Release-specific tests: `tests/compass-05775940255-birthday-perf.test.mjs`. Run `node .verify-transform.mjs`, `npm test` and GitHub Actions production build.
