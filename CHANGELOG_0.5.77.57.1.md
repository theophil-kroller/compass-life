# Compass 0.5.77.57.1 — Deployment hotfix

## Root cause
GitHub Actions #221: `npm run check` succeeded; `npm run build` failed with `Compass .57 shopping list top tabs: expected 1 anchor, found 0`.
The .57 bridge depended on exact generated shopping HTML. It now injects the tabs via `chrome(content)` only when `tab === 'shopping'`, avoiding fragile shopping HTML matching.

## Changes
- The shopping list tab remains default; click on statistics invokes the optional calculation.
- Existing checklist actions, imports and financial data remain unchanged.
- Redundant shopping explanatory copy is hidden via CSS, without modifying the underlying template string.
- New **full plugin-chain regression test** reads real `client/src/main.js`, applies every bridge in configured order, and verifies transformed JS syntax. It runs as part of `npm run check`.
- Version visible to the user: 0.5.77.57.1.

## Limitations
The full Vite build could not run inside this session because the GitHub connector has read-only permissions and container networking cannot download the repository/dependencies. The Actions workflow must verify the production build after upload. Do not claim it already passed.
