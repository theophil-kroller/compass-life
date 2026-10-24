# Compass 0.5.77.47 · GitHub-Upload

Voraussetzung: Vollständige Dateien und Pluginfolge aus **Compass 0.5.77.46** sind vorhanden.

Das ZIP ist **kein Skript**, das du selbst starten musst. Entpacke es und lade die unten genannten Dateien mit unveränderter Ordnerstruktur in dein GitHub-Repository hoch (gleiche Pfade ersetzen, neue Dateien anlegen):

## Code
- `client/vite.config.js` (ersetzen)
- `client/compass747-bridge.js` (neu)
- `client/src/capacity-guardian-v57747.js` (neu)
- `client/src/capacity-guardian-v57747.css` (neu)

## Tests
- `tests/compass-057743-dream-receipts.test.mjs` (ersetzen; dauerhafte Reihenfolgeprüfung)
- `tests/compass-057744-fixes.test.mjs` (ersetzen; dauerhafte Reihenfolgeprüfung)
- `tests/compass-057745-receipt-categories.test.mjs` (ersetzen; dauerhafte Reihenfolgeprüfung)
- `tests/compass-057746-weekly.test.mjs` (ersetzen; dauerhafte Reihenfolgeprüfung)
- `tests/compass-057747-capacity.test.mjs` (neu)

## Prüfung nach dem Upload

1. Auf GitHub unter **Actions → Deploy Compass Web** warten, bis der Testschritt **und der eigentliche Vite-Build und Deploy** grün sind.
2. Compass neu laden und in der linken Navigation **Insights → Fristen & Kapazität** öffnen.
3. Das wöchentliche Fokusbudget und erste Aufgabe-Schätzzeiten eingeben und speichern.
4. Die Wochenkompass-Ansicht öffnen: Der Verweis zur Kapazitätsplanung muss vorhanden sein.
5. Überprüfen, dass offene Aufgaben wirklich in der 14-Tage-Liste stehen. Bei fehlenden Schätzungen darf Compass keine definitive Machbarkeitsaussage treffen.

**Kein Kalenderabgleich:** Gezeigte Fokuszeitfenster sind Szenarien, keine gebuchten oder nachweislich freien Termine.
**Kein Geräteabgleich versprochen:** Fokusbudget und Schätzungen bleiben zunächst im lokalen Vault, bis die E2EE-Einstellungen explizit in einer Folgeversion integriert werden.
**Keine aktuellen Gesundheitsschlüsse:** Importdaten haben ihren dokumentierten Datenstand.
