# Installation · Compass 0.5.77.37

1. Voraussetzung: Dein Repository `theophil-kroller/compass-life` enthält die **0.5.77.36**-Dateien (insbesondere `client/nutrition736-bridge.js` und dessen Eintrag in `client/vite.config.js`).
2. ZIP entpacken; **alle** enthaltenen Dateien unter den angegebenen Pfaden auf GitHub hochladen. `client/vite.config.js` wird **ersetzt**; `client/anatomy-recipes737-bridge.js`, die vier neuen Dateien unter `client/src/` und die zusätzlichen Dokumentationen/Tests werden hinzugefügt.
3. Die älteren `.27`–`.36` Dateien nicht erneut hochladen und niemals deinen privaten Vault in das GitHub-Repository legen.
4. Commit auf `main`, GitHub-Actions-Deployment prüfen. Compass per Hard Reload aktualisieren. Erwartete Versionsnummer links unten: **0.5.77.37**.
5. Insights → Krafttraining: Den Zeitraum auswählen, über **Gemeinsam / Krafttraining / Radfahren** die sichtbaren anatomischen Beteiligungen vergleichen. Zum Bearbeiten weiterhin den bisherigen Kraftsatz-Editor nutzen.
6. Ernährungsschnellerfassung: „Mein großer grüner Salat“ bzw. „Mein Käferbohnensalat“ unter Mahlzeiten, „Mein Spiegelei“ unter Frühstück antippen. Im Ernährungstagebuch Eintrag öffnen, Zutaten-Grammzahlen anpassen und speichern. Bitte Öl und Käferbohnen-Abtropfgewicht bei Gelegenheit wiegen/Etikett prüfen.
7. Bei importierten Radtouren erfolgt keine Messung des Motorzustands. Die App nimmt lediglich deine Aussage „ohne Motorunterstützung“ als Kontext auf. Andere Fahrten/Unterstützung können später separat dokumentiert werden.

**Tests:** `node --test tests/compass-057737.test.mjs` (Node 22), dazu ggf. eure vorhandenen Tests und `npm run build`/GitHub Actions im vollständigen Repository.
