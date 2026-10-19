# Compass 0.5.22 – Life Goals & Smart Daily Compass (+ Kraken Public EUR Ticker)

**Basis:** 0.5.21.1 FULL SOURCE. Patch files overwrite the matching repository paths; previous user data remains in the local encrypted Vault. No new D1/Worker migration.

## Features

### Life Goals (local-first)
- Under **Planen → Projekte** a collapsible `Lebensziele & Projekte` panel supports creating goals, optional outcome and target date, and linking up to 30 existing projects per goal.
- Goals, statuses and links remain in the AES-GCM encrypted browser Vault. Existing synchronized project/task records are untouched. They are **not** cross-device synchronized. Export/restore of the encrypted Vault carries them with it.
- Progress states explicitly state the observed completed/total tasks in linked projects (not an invented overall life-progress percentage).
- The panel is collapsed by default to preserve Calm Workspace design.

### Smart Daily Compass
- In **Heute**, the right-hand panel `Was passt jetzt?` presents up to three *available* Next Actions with readable reasons.
- Rule-based priorities consider actual due dates, user flags, planned date, linked life goals, manually estimated task duration, explicitly chosen context and *subjectively reported* energy.
- User selects 15/30/60/120-minute **task budget**. This is not automatically computed available time from the calendar. Calendar status is reported; no write operations are performed on calendar.
- Defer, On Hold, Waiting For, completed and project-blocked actions are excluded by the existing `nextActions` model. No synthetic deadlines, autonomous task scheduling or remote AI.

### Public EUR market prices for Kraken
- In **Finanzen → Portfolio**, `EUR-Marktwert jetzt aktualisieren` subscribes to Kraken's **public unauthenticated Spot WebSocket v2 ticker** (`wss://ws.kraken.com/v2`, BTC/EUR etc.). This is separate from the private read-only local Kraken connector used to import balances, trades and ledger.
- Optional opt-in refresh approximately every 15 minutes **while unlocked Portfolio is open and visible**; no background service when Compass is closed.
- The public request contains market symbol names only, not private balances, API credentials or account identifiers. Supported aliases include `XXBT`, `XETH`, `XXDG`, and others.
- The value shown is **the last imported holding amount x recently fetched EUR market price**. Import/sync timestamp of holdings remains separate from ticker-retrieval timestamp. Unsupported/unpriced symbols remain explicitly unvalued; no full-wealth total is claimed for partial data.
- Market prices depend on available quote pairs and actual network access. Ticker `last` is not guaranteed if a market has not traded for 24 hours. Nothing is fabricated. Auto refresh is opt-in. Manual local connector and JSON import remain supported.
- Valuation history is not backfilled for old holdings. Existing `updateKrakenQuotes` only creates a current-day history record when the holdings' snapshot and the price snapshot are from the same date and all assets are priced.

## Checks / important limitations
- `npm run check`: **280/280 tests** pass, including six new 0.5.22 tests and Worker checks. Tests include mocked public WebSocket, balance age, goal linking and deferral.
- `node --check`: passed for modified JavaScript modules.
- Full Vite build could **not** be executed locally (`vite: not found`): verify the GitHub Actions `Deploy Compass Web` run after applying patch.
- Real browser Kraken live connection, mobile UI and device-sync smoke tests must be performed after deployment.
- Life Goals are intentionally local-only in 0.5.22; cross-device linking requires a versioned synchronization design in a future release.

## Installation
1. Export encrypted Vault backup; **never clear PWA/IndexedDB storage**.
2. Upload the `Compass_0.5.22_GITHUB_PATCH.zip` contents to the existing `compass-life/main` repository, preserving relative paths and hidden `.github` folders.
3. Verify the GitHub Pages build and reload the PWA.
4. Test **Heute → Was passt jetzt?**, **Planen → Projekte → Lebensziele & Projekte** and **Finanzen → Portfolio → EUR-Marktwert jetzt aktualisieren**.
5. No Cloudflare database migration or Worker redeploy for this release.
