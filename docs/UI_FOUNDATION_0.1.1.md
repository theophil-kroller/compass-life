# Compass UI Foundation 0.1.1

The Home dashboard is the living product shell; not a standalone illustration.

- Active: local vault create/unlock/lock, quick capture, inbox view/edit/archive, local encryption and backup, System & Sync (once Google OAuth is configured).
- Visible but disabled: Next Actions, Weekly Review, Projects, Calendar & Focus, Progress, People and Recovery.
- Empty states do not fabricate task, project, sleep, or progress data.
- Same UX during locked state: show the final dashboard behind an integrated vault unlock/setup panel.
- No Worker or D1 migration required for this UI-only release.

## GitHub deployment

1. Back up your current repository if desired.
2. Upload only the content of the PATCH ZIP to the same repository paths, replacing the existing files (do not create an extra enclosing folder).
3. GitHub Actions → Deploy Compass Web should run on the commit; wait for success.
4. Open https://theophil-kroller.github.io/compass-life/ and reload, if needed with Ctrl+Shift+R to bypass stale service-worker cache.
5. Do not overwrite worker/wrangler.jsonc: the PATCH leaves your production Worker and D1 configuration untouched.

## Test scope

JavaScript syntax, existing six protocol tests and browser-based UI interaction smoke tests passed with an in-memory mock vault. The complete Vite/npm install was unavailable in the build environment; verify production GitHub Actions passes before considering the deployment complete.
