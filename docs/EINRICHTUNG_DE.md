# Compass Phase A – Einrichtung (GitHub, Cloudflare, Google)

**Was du bekommst:** Einen installierbaren, offline-fähigen Foundation-Build. Für die Cloud-Synchronisation brauchst du erst nach der lokalen Ersteinrichtung eigene Konten bzw. Freigaben. Die Einrichtung ist **nicht automatisch erledigt**.

## A. GitHub-Repository anlegen

1. Entpacke die ZIP-Datei auf deinem Rechner. Der Ordnerinhalt ist die Repository-Wurzel.
2. Lege in deinem vorhandenen GitHub-Account ein neues, Repository an, z. B. `compass-life`. **GitHub Free** unterstützt Pages nur aus einem **öffentlichen** Repository; mit GitHub Pro oder höheren Plänen kann auch ein privates Repository die Pages-Seite veröffentlichen. Die statische Website selbst ist normalerweise öffentlich erreichbar, aber die persönlichen Daten bleiben im verschlüsselten lokalen Tresor und in der authentifizierten API.
3. Übernimm alle Dateien, einschließlich `.github/workflows/deploy-pages.yml`, in das neue Repository. Verwende den Branch `main`.
4. Gehe in **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. Die Webadresse wird später `https://theophil-kroller.github.io/compass-life/` sein. Ein Domainkauf ist nicht erforderlich.

> Änderungen am Repository-Namen beeinflussen die `base`-URL. Der Workflow setzt diese bei jedem Build anhand des Repo-Namens automatisch.

## B. Cloudflare-Account, D1 und Worker

1. Melde dich mit deinem neuen Cloudflare-Konto an. CLI-Anmeldung mit `npx wrangler login` – achte darauf, dass die richtige Identität ausgewählt ist. Gegebenenfalls vorher `npx wrangler logout`.
2. Installiere lokal Node.js 22 oder neuer und führe im entpackten Projektordner `npm install` aus. Das erzeugte `package-lock.json` anschließend ebenfalls ins Repository committen, damit die Abhängigkeiten bei weiteren Builds reproduzierbar bleiben.
3. Erstelle die eigenständige Datenbank (empfohlen: EU-Jurisdiktion für D1):

   ```bash
   cd worker
   npx wrangler d1 create compass-db --jurisdiction eu
   ```

4. Kopiere die dabei ausgegebene **database_id** in `worker/wrangler.jsonc`, Feld `d1_databases[0].database_id` (statt `00000000-0000-0000-0000-000000000000`). Die UUID ist kein Passwort.
5. Trage in derselben Konfiguration `ALLOWED_ORIGIN` mit deiner exakten **GitHub-Pages-Origin** ein, z. B. `https://theophil-kroller.github.io` – **ohne** `/compass-life/` am Ende. Ein Port oder abschließender Slash darf nicht abweichen.
6. Erzeuge die Google-OAuth-Client-ID wie in Abschnitt C und trage sie in `GOOGLE_CLIENT_ID` ein. Die eigene Google-Adresse wird aus Datenschutzgründen nicht ins Repository geschrieben, sondern als Worker-Secret gesetzt (siehe Schritt 9).
7. Migration ausführen:

   ```bash
   npx wrangler d1 migrations apply compass-db --remote
   ```

8. API deployen:

   ```bash
   npx wrangler deploy
   ```

9. Hinterlege die eigene Google-Adresse als Secret (wird interaktiv abgefragt und nicht in Git gespeichert):

   ```bash
   npx wrangler secret put OWNER_EMAIL
   ```

10. Notiere die ausgegebene Worker-URL, z. B. `https://compass-api.<deine-subdomain>.workers.dev`. Öffne `<worker-url>/api/health` für einen minimalen Healthcheck. Ein erfolgreicher Healthcheck allein beweist noch keine funktionierende Anmeldung/D1-Verbindung.

**Hinweis zur Datenregion:** EU-Jurisdiktion beschränkt den Standort der D1-Datenbank gemäß Cloudflare-Produktverhalten; sie ist nicht mit einer umfassenden Zusicherung gleichzusetzen, dass jedes verarbeitete Metadatum oder jeder Dienst ausschließlich in der EU liegt.

## C. Google Sign-In für das eigene Konto einrichten

1. Öffne die [Google Cloud Console](https://console.cloud.google.com/apis/credentials) und wähle oder erstelle ein Projekt.
2. Konfiguriere die Google Auth Platform / OAuth Consent Screen. Bei Testmodus: dich selbst als Testnutzer hinzufügen, soweit erforderlich.
3. Lege einen OAuth Client vom Typ **Web application** an.
4. Trage bei **Authorized JavaScript origins** deine echte GitHub-Pages-Origin ein: `https://theophil-kroller.github.io` (und für lokale Tests ggf. `http://127.0.0.1:5173`). Der GIS-Popup-Flow benötigt keine Redirect-URI.
5. Kopiere die **Client ID** (endet mit `.apps.googleusercontent.com`) sowohl in `worker/wrangler.jsonc` als auch in `client/public/runtime-config.json`.
6. Stelle sicher, dass das Worker-Secret `OWNER_EMAIL` exakt zu diesem Google-Konto passt. Nur dieses Konto darf auf die API zugreifen. Für erhöhte Kontobindung kann später zusätzlich `OWNER_GOOGLE_SUB` verwendet werden.

**Diese Authentifizierung ist nur für Compass gedacht.** Google Calendar benötigt später einen separaten OAuth-Flow mit eigenen, engeren Berechtigungen. Google Sign-In allein gibt keinen Kalenderzugriff.

## D. Frontend mit Worker verbinden

Trage in `client/public/runtime-config.json` ein:

```json
{
  "apiUrl": "https://compass-api.DEINE_SUBDOMAIN.workers.dev",
  "googleClientId": "DEINE_CLIENT_ID.apps.googleusercontent.com"
}
```

Diese beiden Werte sind **öffentliche Konfigurationsdaten**, keine Passwörter. Sie können im Repository stehen. Sende den Commit zu GitHub; danach sollte der Workflow die GitHub-Pages-Seite erstellen.

Beim ersten Öffnen:

1. Lokale Passphrase (mindestens 12 Zeichen) erstellen und sicher verwahren.
2. Eine Testidee in der Inbox erfassen.
3. Unter **System & Sync** Google-Anmeldung durchführen und auf **Jetzt synchronisieren** klicken.
4. Das gleiche auf einem zweiten Gerät mit **eigener** lokaler Passphrase und demselben Google-Konto wiederholen. Der Inbox-Eintrag sollte dort erscheinen.

Beim ersten Start auf dem zweiten Gerät keinesfalls ein Backup aus dem ersten Gerät importieren, wenn du den regulären Cross-Device-Sync testen möchtest. Erstelle dort einen leeren Tresor.

## E. Lokaler Entwicklungsstart

**Frontend:**

```bash
npm run dev:web
```

**Worker:** Erstelle `worker/.dev.vars` auf Basis von `worker/.dev.vars.example`; setze `ALLOWED_ORIGIN=http://127.0.0.1:5173` und echte Google-Werte. Lokale Datenbank anlegen, Worker starten:

```bash
npm run db:local
npm run dev:api
```

Für lokalen Worker-Test `client/public/runtime-config.json` vorübergehend mit `http://127.0.0.1:8787` konfigurieren (lokales HTTP wird nur für 127.0.0.1 akzeptiert). Nach dem Test die öffentlichen Werte wiederherstellen und keine lokalen Secrets committen.

## F. Häufige Fehler

| Meldung | Bedeutung / Behebung |
|---|---|
| `server-not-configured` | Worker-Variablen und D1-Bindung prüfen. |
| `origin-not-allowed` | `ALLOWED_ORIGIN` exakt auf das Origin von GitHub Pages setzen, ohne Repo-Pfad. |
| `unauthorized` | Falsches Google-Konto, abgelaufenes ID-Token oder falsche Client-ID/Owner-E-Mail. |
| Google-Button nicht sichtbar | `runtime-config.json` und OAuth *Authorized JavaScript origins* prüfen. |
| Cloud-Sync funktioniert, aber nicht offline | PWA einmal online vollständig laden; Browser-/Service-Worker-Einstellungen prüfen. |
| Änderungen bleiben ausstehend | Internet/Google-Anmeldung/Worker-Logs prüfen. Nichts löschen; zuerst Backup erstellen. |
| Bearbeitungskonflikt | Versionen ansehen, bewusst „Cloud übernehmen“ oder „Meine Version behalten“ wählen. |

## G. Test-/Freigabecheck

**Gate A, Voraussetzungen**: API und PWA auf echten Geräten online erreichbar, Google OAuth korrekt, lokale Datenbank migriert.

- [ ] Einträge lassen sich offline lokal erfassen.
- [ ] Nach Wiederverbindung erscheint der Eintrag genau einmal auf dem zweiten Gerät.
- [ ] Editieren auf Gerät A wird nach Sync auf B sichtbar.
- [ ] Konkurrenz-Edit auf A und B erzeugt einen sichtbaren Konflikt, kein stilles Überschreiben.
- [ ] Archivieren synchronisiert den Löschmarker auf B.
- [ ] Falsches Google-Konto erhält keinen Datenzugriff (HTTP 401).
- [ ] Nach Sperren des lokalen Tresors sind Daten bis zur Passphrase-Eingabe verborgen.
- [ ] Verschlüsselter Export lässt sich in einem frischen Browser mit Originalpassphrase öffnen.
- [ ] GitHub-Repository enthält keine privaten Datensätze, API-Tokens oder Passphrasen.
- [ ] D1-Backup und Wiederherstellung separat geprobt (noch offen vor produktivem Einsatz).

**Gate-A-Abnahme ist erst nach diesen echten End-to-End-Tests bestätigt.** Der beigefügte Unit-Test ist ein wichtiger Vorabcheck, ersetzt aber diese Abnahme nicht.
