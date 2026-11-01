# Compass 0.5.91.2 · Four-card workout + Garmin muscle identity

Based on 0.5.91.1 commit 7d13f355867fc2184164bd0f58931f07d428c229.

- The guided workout first shows three prescribed exercises and a fourth optional suggestion.
- The user can choose **Machen** or **Überspringen**. Only an accepted bonus creates a fourth exercise record; skipping does not log any sets.
- Optional exercise can extend a 25-minute session only after explicit consent. Existing 3-workout plan and StrongLifts remain unchanged. Safety exclusions remain enforced.
- New exercise anatomical mapping includes primary and secondary muscle groups.
- Clearly identified Garmin FIT exercise names now map to canonical Compass IDs, unless a saved manual annotation overrides them. Generic summaries and broad FIT categories are never guessed as exact exercises.
- Unrecognized Garmin activity sets still count as activity but are not assigned to an invented precise muscle group.
- Unit / regression tests and deployment tests documented in final response. Vite build requires installed dependencies.
