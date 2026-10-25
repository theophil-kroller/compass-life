# Compass 0.5.77.59.13 — Makko-Ho Gong & freie Haltezeit

## GitHub-Upload

Bitte die Verzeichnisstruktur im ZIP beibehalten und **nur** folgende Dateien nach GitHub `theophil-kroller/compass-life` übertragen:

- **ERSETZEN** `client/src/makko-ho-guide-v5775910.js`
- **ERSETZEN** `client/src/makko-ho-guide-v5775910.css`
- **NEU** `tests/compass-05775913-gong-overtime.test.mjs`

Die frühere `client/vite.config.js`, Musikdatei, sechs WebP-Bilder, Vault und gespeicherte Daten bleiben unverändert.

## Verhalten

- Zeit startet wie bisher rückwärts ab 30/45/60/90 Sekunden.
- Bei Erreichen der Zielzeit wird **genau einmal** ein sanft ausklingender, lokal synthetisierter Gong angestoßen (nur bei aktiviertem Signalton).
- Der Zähler zeigt danach `+00:00`, `+00:01`, ... und läuft weiter, ohne automatisch anzuhalten oder zu wechseln.
- Pause friert die Überzeit ein, `▶ Weiterlaufen` setzt sie fort; `↺ Zurücksetzen` beginnt neu; `Weiter →` startet den nächsten Stretch mit unveränderter Zielzeit.
- `Sakura Sakura` läuft dabei weiter; die Lautstärke wird für den Gong kurz abgesenkt.
- Die Musikdatei sowie die Illustration werden weiterhin erst beim Öffnen des Players nachgeladen.

## Illustrationen

Die vorhandenen sechs personalisierten Illustrationen bleiben bewusst unverändert, weil die zuletzt neu generierten Entwürfe noch zu viele Beschriftungen und grafische Artefakte enthielten. Die sechs neuen Referenzfotos der Nutzerperson bleiben lokal im Chat und werden **nicht** in das öffentliche GitHub-Repository hochgeladen. Sie dienen als Vorlage für eine spätere, eigenständige Bildverfeinerung.

## Tests

- `node --check client/src/makko-ho-guide-v5775910.js` OK
- 12 von 12 Node-Regressionstests (4 neue + 8 bestehende) OK in lokal rekonstruierter Fixture.
- Chromium: Desktop 1260px, Smartphone 390px; Gong-Schwelle mit verkürzter Testdauer, Overtime, Pause, Resume, `Weiter`, Lazy Loading, kein horizontaler Überlauf.
- **Wichtig:** Noch kein vollständiger GitHub-Actions-Produktionslauf für diesen Patch. Nach Upload prüfen.
