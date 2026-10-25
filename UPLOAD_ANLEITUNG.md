# Compass 0.5.77.59.17 – Makko-Ho Focus, Display & Insights

**Basis:** der erfolgreich deployte Build 0.5.77.59.16.1.

## Installation in GitHub

Lade die Dateien aus dem ZIP mit ihrer **gleichen Ordnerstruktur** in das Repository `theophil-kroller/compass-life` hoch. Keine alten Dateien löschen; nur die aufgeführten Dateien ersetzen/hinzufügen.

### Ersetzen (3 Dateien)

- `client/src/makko-ho-guide-v5775910.js` – ▶/⏸, Bildschirm wach halten, bilaterale Abschlussübung, aktive Sekunden, entfernte Hinweiszeile
- `client/src/makko-ho-guide-v5775910.css` – kompakte Symbole und Richtungskennzeichnung
- `client/compass5910-strength-habits-bridge.js` – Sessions im **verschlüsselten Vault** speichern und in Insights → Habits anzeigen

### Neu hinzufügen (6 Bilder)

Alle Dateien unter `client/public/makko-ho-cards-v5775917/`:

- `metal.webp`
- `earth.webp`
- `fire.webp`
- `water.webp`
- `innerfire.webp`
- `wood.webp`

Die Illustrationen sind neu zugeschnitten und enthalten keine abgeschnittenen Fragmente der alten Gesamtansicht. Der neue Versionsordner verhindert veraltete Bildcaches.

### Tests (7 Dateien ersetzen/hinzufügen)

- `tests/compass-05775911-makko-premium.test.mjs` (ersetzen)
- `tests/compass-05775912-sakura-mobile.test.mjs` (ersetzen)
- `tests/compass-05775913-gong-overtime.test.mjs` (ersetzen)
- `tests/compass-05775914-makko-deploy.test.mjs` (ersetzen)
- `tests/compass-05775917-makko-wakelock.test.mjs` (neu)
- `tests/compass-05775917-makko-stats.test.mjs` (neu)
- `tests/compass-05775917-bridge-integration.test.mjs` (neu)

## Verhalten

- **▶ / ⏸:** nur Symbole, zugängliche Beschriftung für Screenreader.
- **Screen Wake Lock:** nur während aktiver Timerphase, Freigabe bei Pause/Schließen/Weiter und bei nicht sichtbarer App. Einige Browser und Akkusparmodi verweigern den Wake Lock; die App reagiert ohne Absturz. Manuelles Sperren des Geräts kann eine Webseite nicht verhindern.
- **SOKUHO:** zuerst links, dann rechts. Pro Seite eigener Timer; Abschluss erst nach rechts.
- **Zeitmessung:** gezählt werden nur gestartete, aktive Halte-Sekunden, einschließlich Verlängerungen nach dem Gong; Pausen zählen nicht. Auch vorzeitig beendete Sessions mit aktiver Zeit werden protokolliert.
- **Insights → Habits:** 14-Tage-Verlauf, Zeit der letzten Session, letzte 7 Tage / davor, Haltungsdetails inklusive links/rechts.
- **Privatsphäre:** `makkoHoSessions` werden im lokalen verschlüsselten Vault gespeichert, nicht im unverschlüsselten Quick-Store. Ein automatischer Sync dieser neuen Detailstatistik zwischen Geräten ist noch nicht eingerichtet.
- **Audio:** echter Gong/Koto unverändert, Ladeverhalten weiterhin bedarfsorientiert.

## Qualitätssicherung

- Node-Syntaxprüfung erfolgreich.
- 26/26 gezielte Regressionstests bestanden (inklusive der zuvor problematischen 59.11–59.14 Verträge).
- Lokaler Chromium-Funktionstest bei 360×740, 390×844 und 1440×900 bestanden: kein Dialog-Scroll, Bilder sichtbar, ▶/⏸, Wake Lock, rechts/links, Abschluss.
- **GitHub Actions mit der vollständigen Repository-Testsuite muss nach dem Upload noch erfolgreich laufen.**

**Wichtig:** Die Vite-Konfiguration bleibt unverändert. Wenn der Build scheitert, zuerst den **ersten fehlgeschlagenen Test** der Actions-Logs prüfen und nicht blind erneut hochladen.
