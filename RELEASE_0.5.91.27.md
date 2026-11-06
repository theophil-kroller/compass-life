# Compass Life 0.5.91.27 – Brustübungen mit realistischen Start-/Endbildern

## Release scope
- Seven new personally referenced, photorealistic 2-position composites in `client/public/strength-visuals-v059127/` (WebP, under a stable PWA BASE_URL-aware path).
- The guided Strength Coach shows them for the exact exercise IDs: `incline-bench`, `pushup`, `chest-press`, `chest-fly`, `close-grip-bench`, `decline-pushup`, `incline-pushup`.
- The previously approved Calf Raise image (`strength-visuals-v059126`) and all earlier images remain unchanged.
- Exercises without personalized pictures still display accessible START/ENDE text (no stickmen).
- Pure visual/UI change; no changes to exercise completion, weights, RIR, recovery or saved workouts.

## Visual accuracy note
AI-generated images are instructional approximations, not biomechanical reference photos. Do not infer exact grip, load or joint positioning from generated images without checking exercise instructions. The chest-fly and push-up pairs show opposite phases of a repetition; users can cycle between them either direction.

## Install
Apply `0.5.91.27` patch on precisely `0.5.91.26` while preserving source tree paths, or use Full Source. Do not upload the ZIP itself to Github; unpack first. GitHub Pages production deployment depends on the actions workflow.
