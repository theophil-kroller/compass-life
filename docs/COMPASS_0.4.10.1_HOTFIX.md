# Compass 0.4.10.1 – Synchronisation und Deployment: Hotfix

**Basis:** Bereits hochgeladener Compass-Quellcode 0.4.10 (Branch `main`). Dieses Paket ist **nur ein GitHub-Patch**, kein vollständiger Build und kein Worker-Ersatz. Es sind vier neue/geänderte Code- und Testdateien plus diese Anleitung enthalten: `client/src/main.js`, `client/src/health-check.js`, `tests/gtd-04101-worker-compat.test.mjs`, `tests/gtd-043.test.mjs`. Keine SQL-Migration notwendig.

## Fehlerursache

Die 0.4.10-GitHub-Dateien sind vorhanden; ein alter Browser/PWA-Cache oder noch nicht abgeschlossenes Pages-Deployment kann trotzdem die 0.4.6/0.4.8-Oberfläche anzeigen. Zusätzlich prüft 0.4.10 irrtümlich `health.apiVersion !== 5`, während der 0.4.10-Worker API-Version **6** liefert. Das verursacht einen Fehler unabhängig vom D1-Status. Der Hotfix erkennt jede ganzzahlige API-Version ab 6 als geeignet und zeigt spezifische Hinweise für alten Worker bzw. fehlendes D1-Schema.

## Vorgehen

1. **Zuerst lokales verschlüsseltes Tresor-Backup sichern** (System & Sync). Keine Browserdaten, Cookies oder IndexedDB löschen.
2. Im GitHub-Repository `theophil-kroller/compass-life` auf `main` die drei Dateien des Hotfix ZIP an ihren angegebenen Verzeichnispfaden hochladen/ersetzen (nicht das ZIP als einzelnes File). Die GitHub Action `Deploy Compass Web` abwarten. Der automatische Test `npm run check` umfasst den neuen Kompatibilitätstest.
3. **Cloudflare Worker gesondert deployen**, denn GitHub Pages deployed nur das Web-Frontend. Die SQL-Migration 0008 muss nicht nochmals manuell ausgeführt werden, wenn die Tabelle `watch_deleted_sessions` in **der gebundenen D1-Remote-DB** existiert. Aus einem lokalen Repo mit Wrangler-Authentifizierung im Projektverzeichnis:

   ```bash
   npm install
   npm run deploy:api
   ```

   Die SQL-Datei 0008 wurde laut Rückmeldung bereits im D1-Dashboard ausgeführt. Daher **`npm run db:remote` hier nicht ungeprüft erneut ausführen**. Wrangler kann die direkte SQL-Ausführung unter Umständen nicht als Migration verbucht haben und bereits angewendete Schritte erneut versuchen. Prüfe zunächst in D1, dass `watch_deleted_sessions` in der DB `compass-db` existiert, und deploye nur den Worker. Bei `schema.ready:false` nach dem Worker-Deploy die aufgeführten fehlenden Tabellen/Spalten prüfen.
4. Frontend neu laden: zuerst `Strg+Umschalt+R` und prüfen, ob in der Navigation unter Compass **0.4.10.1** steht. Wenn immer noch alte Inhalte erscheinen, in Chrome `F12 → Application → Service Workers → Update` und neu laden. Bei Bedarf Service Worker **Unregister** und neu laden; **nicht** „Clear storage / Clear site data“ auswählen.
5. Worker im Browser öffnen: `https://compass-api.theophil-tiger.workers.dev/api/health`. Erwartet `apiVersion:6`, `release:'0.4.10'`, `schema.ready:true`. Bei `apiVersion:5` oder niedriger fehlt das Worker-Deployment; bei `schema.ready:false` Details unter `requiredMigration` und `missing` prüfen. Wenn diese Daten stimmen, System & Sync → Jetzt synchronisieren.
6. In der 0.4.10-Oberfläche sind die Menüpunkte **Menschen, Fortschritt, Erholung, Aktivitäten** aktiv und die lange Weekly-Review-Einleitung entfernt.

## Warum nicht 0.4.11?

0.4.11 enthält laut ursprünglicher Roadmap Hierarchie-Tags, Kontext-Perspektiven und optionale Standorterkennung bei geöffneter PWA. Dieser Hotfix isoliert die Installations-/Kompatibilitätsstörung, bevor weitere Features aufgesetzt werden. Garmin-App, Widgets und Gesundheits-/Schlafdaten-Import sind eigene anschließende Schritte.
