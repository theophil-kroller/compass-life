# Compass 0.5.77.59.40.25.16 – Bilingual Garmin/Coach catalog and historical edit pencils

Based on successful GitHub Actions #327 (commit `77cfb64c9ecdba285b96991dc9250725103404ba`).

## Changes
- A pencil (✎) in **each** historic and new Garmin FIT, Garmin CSV, and Coach workout journal row opens that exact session in the already-existing set editor. Includes rows marked "Übung offen". There is no need to re-import Garmin data.
- Stable exercise IDs, displayed with practical English terms first and German clarifications in parentheses in the Coach and in the edit dropdown.
- Grouped dropdown: last used, familiar favorites, V-Taper home and gym, StrongLifts 5×5 workouts A and B, and body regions.
- Restored all Coach/V-Taper-specific exercise IDs, including Decline / Incline / Pike Push-ups, Ab-Wheel, cable, and dumbbell variations to the editor; registered corresponding approximate muscle regions in the atlas.
- Editing existing workouts updates the manual `strengthJournal.annotations` overlay; original Garmin imports and existing journal/session IDs remain untouched. The existing optional encrypted journal synchronization remains unchanged.

## Scope / limitations
- English terms are recognizable exercise aliases, but exact Garmin exercise menu wording may differ by device or firmware. The ID mapping is the common Compass exercise ID.
- The UI still displays the historically frozen main-entry version text 0.5.77.59.40.25.10; use the GitHub commit/run and the presence of bilingual exercise entries to verify new deployment.
- No new workout prescribed; the planner's existing workout pools are unchanged.

## Validation
- `npm run check`: 1744 / 1744 passing (worker check plus Node tests).
- JavaScript syntax checks pass for edited modules.
- Local Vite production build cannot be verified in this runner because Vite node_modules are absent. GitHub Actions must complete its production build and deploy.

## Installation
For the #327 repository version, upload the patch ZIP contents to the repository root, retaining the folder paths. **Do not** upload both patch and full-source versions. The full-source ZIP is a separate alternative.
