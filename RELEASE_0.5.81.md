# Compass Life 0.5.81 — Nutrition + Today + mobile unlock

Base: github.com/theophil-kroller/compass-life @ 141d5e4d82e084650047690424b60a637f95718f (0.5.80). Four critical file Git blob hashes checked against GitHub.

- Restored HOFER Germknödel as a stable food entry (indicative 187 g; 480–530 kcal); third-party nutrition not verified against the actual packaging.
- Kitcheri as editable ingredient-level personal recipe: mung dal, basmati, carrots, zucchini, oil/ghee, ginger, turmeric, cumin. All values and quantities are estimates. Daily Dozen counts only logged recipe ingredients, with estimated dry-to-cooked conversion.
- Recommender: prior recorded meals are weighted by target day class (Austrian workday vs weekend or Austrian nationwide public holiday) and time. Mensa suggestions explicitly suppressed for days off, as is the Today Mensa reminder. No data changes, no auto-logging.
- Today auto-rolls to local calendar day when app resumes or stays open across midnight, except while a different day is explicitly selected; opening Today or unlocking resets to actual day.
- Mobile Ars Vivendi unlock panel is centered in visualViewport with keyboard-aware height and scrollable panel; enables password manager autocomplete. Does not change vault security or retry handling.

Archives: PATCH contains only added/changed files; FULL SOURCE is a copy of the checked 0.5.80 source plus these changes. Neither archive changes user vaults/IndexedDB. Vite build requires dependencies and was not run if node_modules unavailable.

## 0.5.81 Nutrition inspector (additional UX feedback)
- The old inline editor at the very bottom of the nutrition insights page is removed.
- Selecting a food from the dashboard's recent rows or journal history opens a persistent right-hand inspector with date/time at the top; on mobile it becomes a fixed full-height side drawer.
- The same existing `pj92-food-detail-form` is used for encrypted saving; no migration or duplicate stored entry.
- The inspector supports closing by button, tapping the backdrop, or Escape. Editing a custom recipe/smoothie still presents the existing per-ingredient editor.

## Verification and known limitations
- `npm run check:deploy`: 33/33 tests passing, import graph 255 modules.
- Additional 0.5.81 tests: 8/8 passing (calendar, recommendation, catalog, inspector rendering and safety).
- Full historical tests: 33 legacy failures from 1,789 tests after the first inspector suite; most reflect obsolete hardcoded version or transformation-chain expectations. The second suite adds four passing tests.
- The Vite production compilation remains unverified locally because dependencies are unavailable; GitHub Actions will run `npm install`, `npm run build` and deployment checks.
- Mobile authentication logic / incorrect-password handling is **not** changed; the fix addresses responsive positioning and autocomplete only. The precise reason for intermittent login failures has not been established.
