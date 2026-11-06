# Compass 0.5.91.26 – Calf Raise photo & removal of stick figures

## Improvements
- Uses the owner-approved photorealistic Calf Raise START / END visual (two loaded adjustable dumbbells, raised weight plate, athlete with visible V-taper).
- Adds one small WebP under client/public/strength-visuals-v059126/ and metadata manifest; preserves existing approved image libraries.
- No remaining live stickman fallback in the guided workout: exercises without real matched images display named START / ENDE guidance with a candid no-photo note instead. Historical schematic SVG assets remain on disk for backward compatibility, but are not rendered by the guided workout.
- Source of truth for recorded weight / reps / RIR untouched. No new exercise, set or coach progression side effects.
- Keeps BASE_URL-aware PWA image paths and existing premium photo / V-Taper plugin hooks.

## Installation
Patch applies to the 0.5.91.25 repository state. Upload relative files to GitHub main preserving directory structure; the push triggers GitHub Actions deployment.
