# Compass — Personal Life Manager

**Phase A / Foundation Alpha 0.1.0** · 16 October 2026

> Weniger im Kopf behalten. Besser entscheiden. Mehr Zeit für das, was wichtig ist.

This is a **working Phase A prototype**, not a full GTD product. It gives you a local AES-GCM-encrypted Inbox (add/edit/archive), a standalone Cloudflare Worker + D1 sync API, Google-account authentication, explicit edit-conflict handling, an installable PWA, migrations, tests, and a GitHub Pages deployment workflow. It can be used locally without connecting Cloudflare.

**Not built in Phase A:** Projects, GTD Next Actions, contexts, Weekly Review, Google Calendar integration, timers, AI, Android native widget, Garmin Connect IQ and Health Connect. These belong to the next phases.

## GitHub repository

https://github.com/theophil-kroller/compass-life

GitHub Pages after deployment: https://theophil-kroller.github.io/compass-life/

## Start here

Read **[`docs/EINRICHTUNG_DE.md`](docs/EINRICHTUNG_DE.md)**. It contains the step-by-step instructions for your new Cloudflare account, GitHub repository, Google OAuth client, D1 database and Worker.

### Local frontend, without cloud

```bash
npm install
npm run dev:web
```

Open `http://127.0.0.1:5173/`. Create a 12+ character local vault passphrase and capture a first item. You can work without an API configuration; sync remains disabled until connected.

### Local API (after configuring `worker/wrangler.jsonc`)

```bash
npm run db:local
npm run dev:api
```

Add a `worker/.dev.vars` with the development values shown in `.dev.vars.example` (do not commit it), and set `client/public/runtime-config.json` accordingly. Run web and API in separate terminals.

### Tests

```bash
npm run check
npm run build
```

### Deployment

- GitHub Pages publishes `client/dist` from the `main` branch via `.github/workflows/deploy-pages.yml`.
- Deploy the API separately through `npm run deploy:api` after applying D1 remote migrations.
- **Never** store Cloudflare API tokens, D1 backups, private tasks, Google ID tokens or local vault passphrases in GitHub.

## Architecture

```text
client/                           vite PWA, static GitHub Pages
  src/main.js                     UI, quick capture, vault + sync coordinator
  src/vault.js                    WebCrypto AES-256-GCM encrypted IndexedDB
  src/sync.js                     immutable mutation IDs, conflict-aware merge
  public/runtime-config.json      public API URL and Google OAuth client ID
worker/                           Cloudflare Worker; verifies Google JWT via JWKS
  src/index.js                    authenticated API /me /sync/push /sync/pull
  src/validation.js               strict input validation
  migrations/0001_core.sql        D1 schema, journal + idempotency receipts
.github/workflows/               GitHub Pages CI/CD
tests/                           model/validation protocol tests
docs/                            German setup, security and acceptance tests
```

## Sync guarantees and constraints

- Each item has UUID, logical version, mutation receipt (idempotency) and change-log sequence.
- Changes are queued offline and pushed sequentially per item. Other items can be batched.
- The backend uses conditional version updates; when a concurrent edit occurs, the app **does not silently overwrite it**, but shows a conflict choice.
- Encrypted local data is stored in IndexedDB; the encryption key is held only in memory and cleared when the vault is locked.
- Session Google ID tokens are also held **only in memory**. After token expiry, log in again to sync. The local vault remains usable offline.
- The server stores the item text unencrypted in private D1 (HTTPS/API guarded). **This is not end-to-end encryption.** A future E2EE design requires a new threat-model and key-management strategy.
- No push notification, background sync or multi-tab write coordination in this release. App must be opened to sync, with a valid Google session. Prototypes need end-to-end testing on both actual devices before production use.
- Google and Cloudflare configurations are not prefilled with live account information; user setup is required.

## License

Private prototype; no license for redistribution has been declared.
