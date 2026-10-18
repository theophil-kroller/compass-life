**Neu: Compass 0.5.8 – Insights Schlaf/HRV + eine gemeinsame Gesundheitsnavigation; Finanzen vorerst als Export-Roadmap.** Anleitung: [`docs/COMPASS_0.5.8_RELEASE.md`](docs/COMPASS_0.5.8_RELEASE.md). Keine neue Migration, Worker-Änderung oder Android-APK nötig.

**Neu: Compass 0.5.7 – Personal Analytics (Insights).** GitHub-/PWA-Installationshinweise und Ausbauphasen: [`docs/COMPASS_0.5.7_RELEASE.md`](docs/COMPASS_0.5.7_RELEASE.md). Keine neue Cloudflare-Migration oder Android-APK nötig.

**Aktueller Stand: Compass 0.5.3 – Event-Sync / Wochenansicht.** Installationshinweise unter `docs/COMPASS_0.5.3_RELEASE.md`.

# Compass 0.4.6 (kombinierter Patch)

Aktueller Release-Hinweis und Upgrade inkl. der D1-Migration 0007: [`docs/COMPASS_0.4.6_RELEASE.md`](docs/COMPASS_0.4.6_RELEASE.md).

---

> **Neu 0.4.4 (GTD-Perspektiven-Bugfix):** Flagged/Next Actions/On Hold sowie Dreams und Forecast-Inspector repariert. **Keine neue Datenbankmigration.** Anleitung: [`docs/COMPASS_0.4.4_HANDOFF.md`](docs/COMPASS_0.4.4_HANDOFF.md).

> **Neu 0.4.3 (Prüfbuild auf Basis 0.4.2):** Defer Until, Kontexte, Aufwandsschätzungen, Projekt-Review-Zyklen und Inbox-Klärung im Weekly Review. **Migration 0006 vor Worker-/Web-Update anwenden!** Siehe [`docs/COMPASS_0.4.3_GITHUB_UPDATE.md`](docs/COMPASS_0.4.3_GITHUB_UPDATE.md).

> Neu 0.4.2: GTD Next Actions, Flagged, On Hold, Projekte und Agenda-Tags. Installationsreihenfolge siehe [`docs/COMPASS_0.4.2_GTD_PROJEKTE_AGENDAS.md`](docs/COMPASS_0.4.2_GTD_PROJEKTE_AGENDAS.md).

# Compass 0.4.0 — Heute, Forecast & Garmin Offline-First

Neue PWA-Aufgaben, echte Deadlines, versionierte D1-Synchronisierung, Watch-Planungsabruf, Timeout/Offline-Fallback.
Vor dem Deployment **Migration `worker/migrations/0004_planning_tasks.sql`** anwenden. Vollständige Installationsanleitung: [`docs/COMPASS_0.4.0_HEUTE_FORECAST_GARMIN.md`](docs/COMPASS_0.4.0_HEUTE_FORECAST_GARMIN.md).

---

# Compass 0.3.1 — Garmin Focus UI

**Garmin fēnix 7S (240×240):** Farben/Symbole nach Kategorie, rundes UI,
Pomodoro-Countdown, Uhrzeit/Datum, Pomodoros heute, HR/Body-Battery-Symbole,
Session-Aktionsmenü und Sammelkategorien Lehre/Prüfungen.

**Abnahme:** Der neue Garmin-Code muss lokal mit dem Connect IQ SDK gebaut
und im Simulator getestet werden; ein Garmin-Build wurde in dieser Umgebung
nicht durchgeführt. Die bestehenden Compass-Web-/Worker-Tests liefen durch.

**Unbedingt beachten:** Neue Uhr-Kategorien `Lehre`/`Pruefungen` werden erst
nach Update und erfolgreichem Deployment von `worker/src/watch.js` vom Backend
angenommen. Keine neue D1-Migration gegenüber 0.3.0.

Anleitung: [`docs/GARMIN_FOCUS_0.3.1.md`](docs/GARMIN_FOCUS_0.3.1.md).

---

# Compass 0.2.1 — Reliable Sync & Login

**Release-Hinweis:** Bei einem bestehenden Compass-Repository ausschließlich den **PATCH** verwenden. **Vor Upload zuerst** die D1-Migration `worker/migrations/0002_auth_sessions.sql` auf `compass-db` anwenden. Anleitung: [`docs/RELIABLE_SYNC_LOGIN_0.2.1.md`](docs/RELIABLE_SYNC_LOGIN_0.2.1.md).

Dieser Build enthält verschlüsselt gespeicherte 30-Tage-Gerätesitzungen, sparsamen Auto-Sync und korrigierte Konfliktauflösung. Google-Client-ID und OWNER_EMAIL werden **nicht** neu eingerichtet. Für die Produktivabnahme ist ein tatsächlicher Sync-Test auf Laptop und Samsung erforderlich.

---

# Compass — Personal Life Manager

**Phase A / Today-first UI Alpha 0.1.3** · 16 October 2026

> Weniger im Kopf behalten. Besser entscheiden. Mehr Zeit für das, was wichtig ist.

This is a **Phase A prototype with a future-state UI foundation**, not a full GTD product. It gives you a local AES-GCM-encrypted Inbox (add/edit/archive), a standalone Cloudflare Worker + D1 sync API, Google-account authentication, explicit edit-conflict handling, an installable PWA, migrations, tests, and a GitHub Pages deployment workflow. It can be used locally without connecting Cloudflare.

**UI preview in 0.1.3:** Today, Forecast, Dreams, a guided Weekly Review and Inbox classification fields are visible but mostly inactive; capturing with optional note works. See `docs/PHASE_A_3_INBOX_REVIEW_DREAMS.md`.

**Not built in Phase A:** Projects, GTD Next Actions, contexts, Weekly Review, Google Calendar integration, timers, AI, Android native widget, Garmin Connect IQ and Health Connect. These belong to the next phases.

## GitHub repository

https://github.com/theophil-kroller/compass-life

GitHub Pages after deployment: https://theophil-kroller.github.io/compass-life/

## Start here

Read **[`docs/CAPTURE_MVP_0.2.0.md`](docs/CAPTURE_MVP_0.2.0.md)** and **[`docs/EINRICHTUNG_DE.md`](docs/EINRICHTUNG_DE.md)**. It contains the step-by-step instructions for your new Cloudflare account, GitHub repository, Google OAuth client, D1 database and Worker.

### Capture Everywhere – 0.2.0

The main entry remains Today. Use the top-bar quick capture, `Ctrl/⌘+K`, or the mobile capture button to add a thought instantly. The Inbox is searchable and allows editing the title and optional note, plus archiving. Android PWA shortcuts are advertised through the manifest. Google login and end-to-end sync remain **unconfigured** until your OAuth client and Worker `OWNER_EMAIL` secret are set and tested. Calendar integration is **not active**; the provided calendar was verified through a separate ChatGPT connector only. See `docs/CAPTURE_MVP_0.2.0.md`.

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

## UI Foundation 0.1.1

Dashboard, left navigation, preview cards, empty states and disabled future features are now visible from first launch. The local vault, real Inbox and System & Sync are functional; all other modules are inert visual placeholders, not demo datasets. The existing D1 database and Worker schema remain unchanged. See `docs/UI_FOUNDATION_0.1.1.md`.

## UI Foundation 0.1.2 — Today-first

„Heute“ ist jetzt die Startansicht mit Kalender-Seitenleiste, leeren Tagesaufgaben, rechts dem Aufgaben-/Personenkontext und einer funktionierenden Quick-Capture-Eingabe in die verschlüsselte Inbox. Forecast und die bisherige Modul-Übersicht sind eigene Ansichten. Eine optionale Wetteranzeige wird nur auf Klick von Open-Meteo geladen. Wunschdatum, harte Deadline und frühester Start sind in dieser UI-Version nur Datenmodell-Vorschau; Speichern/Planen folgen in Phase B. Details: `docs/PHASE_A_2_TODAY_WORKSPACE.md`.
