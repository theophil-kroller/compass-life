# Compass Life — vollständiges Quellenpaket 0.5.77.59.40.25.10

**Inhalt:** Web-PWA, Cloudflare Worker, D1-Migrationen, alle historischen Client-Ressourcen, angepasster GitHub-Pages-Workflow und Garmin Chrono 0.5.12.7. Dieses ZIP muss **vollständig am Root des Repositories** entpackt werden, nicht in einem Unterordner. Anders als der vorherige 14-Dateien-Patch ist dies ein Full-Source-Archiv.

## Warum eine alternative Vite-Konfiguration?

Die letzte vorhandene vollständige Web-Quelle war 0.5.77.59.40.18. Für spätere Builds liegen mehrere inkrementelle Patches, aber nicht sämtliche historischen Bridge-Quelldateien vor. Die **vollständig transformierte** JavaScript-Anwendung von 0.5.77.59.40.25.9 liegt jedoch als `transformed-main-preview.js` im letzten Patch vor. Sie wurde für 0.5.77.59.40.25.10 um die bereits getestete Unified-Time-Erweiterung ergänzt und als `client/src/main-full-v57759402510.js` eingefroren. Die zugehörige Sperrbildschirmquelle ist `client/src/ars-vivendi-lock-full-v5775922.js`.

`client/vite.fullsource.config.js` ersetzt während des Builds in `index.html` nur die zwei JavaScript-Einstiegspunkte durch diese vollständigen Snapshot-Quellen. Die restliche PWA-Konfiguration einschließlich Workbox-Cache-Limit bleibt erhalten. Die bisherige `client/vite.config.js` sowie rohe Legacy-Quellen bleiben für die historische Nachvollziehbarkeit im Archiv; **sie werden für diesen Snapshot-Build nicht erneut angewendet**. Kein Dummy für fehlende historische Bridges wird ausgeführt.

## GitHub-Deploy

1. Bestand sichern; alle Dateien dieses Archivs ins bestehende Repository-Root übernehmen (alte Pfade überschreiben). Insbesondere `.github/workflows/deploy-pages.yml`, `client/package.json`, `package.json`, `client/vite.fullsource.config.js`, `client/src/main-full-v57759402510.js`, `client/src/ars-vivendi-lock-full-v5775922.js` und `worker/...` übernehmen.
2. GitHub Actions `Deploy Compass Web` führt `npm install --no-audit --no-fund`, `npm run check:deploy` und `npm run build` mit `VITE_BASE_PATH=/compass-life/` aus. **Bei fehlgeschlagenem Build wird keine Pages-Auslieferung gestartet.**
3. Die neue Worker-Version braucht **vor dem Worker-Deploy** die Cloudflare-D1-Migration `worker/migrations/0020_watch_session_revision.sql`. Prüfen, welche Datenbank der produktive Worker verwendet; `npm run db:remote` ausführen und danach `npm run deploy:api`. GitHub Pages deployt Worker und D1 nicht automatisch.
4. Uhrprojekt: `garmin/CompassWatch/` enthält vollständige Garmin-Chrono-Quellen 0.5.12.7. Garmin separat mit Connect IQ SDK kompilieren und auf die fēnix 7S laden. Eine bereits bereitgestellte getrennte Garmin-Full-Source-ZIP ist gleichwertig.
5. Nach Upload und Migration: Forschung-Pomodoro durchführen; Zwischenstand prüfen; Session beenden; Projekt zuordnen; keine Doppelerfassung in Zeitjournal/Produktivität.

## Prüfbericht (29.10.2026)

- `npm run check:deploy`: **24/24 gezielte Tests bestanden**, Worker-`node --check` bestanden.
- `node --check` der eingefrorenen vollständigen Web-Anwendung, der Lock-Quelle und der Fullsource-Vite-Konfiguration bestanden.
- Main-Entry: alle **229** direkten lokalen Importpfade auf Dateien geprüft, kein fehlender Import.
- D1-SQL-, idempotente Checkpoint- und Paginations-Tests bestanden.
- Vollständiger Legacy-Testlauf `npm test`: **1652/1671 bestanden; 19 fehlgeschlagen**. Diese Tests erwarten überwiegend die ursprüngliche, hier nicht vollständig verfügbare Build-Bridge-Kette. Der Release-CI-Prozess verwendet deshalb `check:deploy` statt dieser historischen Bridge-Integrationsprüfungen. Die Legacy-Tests wurden nicht gelöscht oder umgeschrieben.
- **Nicht durchgeführt:** vollständiger `npm run build` in dieser Ausführungsumgebung (Vite-Abhängigkeit fehlt; `npm install` wegen gesperrter DNS-/Registry-Verbindung nicht möglich), GitHub-Actions-Deploy, Cloudflare-Worker-Deploy, Garmin-SDK-Kompilierung und Hardwaretest. Dies sind noch ausstehende reale Integrationsprüfungen; der ZIP-Inhalt wird nicht als produktiv erfolgreich deployt ausgegeben.

Dieses Quellenpaket ist für einen wiederholbaren Build unter einer regulären, netzwerkfähigen Node-22-CI-Umgebung eingerichtet. Ein grüner GitHub-Actions-Build ist die notwendige letzte Bestätigung vor Einsatz.
