# Compass 0.5.77.30 · GitHub-Upload (kumulativ ab 0.5.77.28)

## Installation

1. **Voraussetzung:** Nutrition 3 (0.5.77.27) und Muscle Map (0.5.77.28) sind bereits installiert.
2. ZIP entpacken, alle enthaltenen Dateien mit ihren originalen Pfaden ins Repository hochladen.
3. Ersetzen: `client/vite.config.js`, `client/src/strength-insights-v57728.js`, `client/src/strength-insights-v57728.css`.
4. Neu: `client/strength729-bridge.js`, `client/strength730-bridge.js`, Tests und Changelog. Dateien aus .29 sind **schon enthalten**: .29 nicht separat hochladen.
5. Nach erfolgreichem GitHub-Pages-Deploy die Seite neu laden und unten links auf **0.5.77.30** prüfen. Falls noch .28 angezeigt wird, GitHub Actions/Pages prüfen und PWA-Cache aktualisieren.
6. Insights → Aktivitäten → Kachel **💪 Krafttraining**. Mit Klick darauf wird diese Sportart allein in der Zeitreihe angezeigt.
7. Insights → Krafttraining: Damit bereits früher importierte CSV-Einheiten Satz- und Wiederholungszahlen bekommen, dieselbe `Activities(2).csv` einmal erneut importieren (wird dedupliziert).

## Datenverständnis

Die CSV hat nur die Gesamtzahl von Sätzen/Wiederholungen je Aktivität, nicht die Übungsnamen. FIT-Dateien des **konkreten Krafttrainings** (nicht Wellness-ZIP) sind für die Muskelzuordnung erforderlich.

**Tests:** `node --test tests/gtd-057730-strength-sport-category.test.mjs tests/gtd-057729-strength-csv.test.mjs`

**Bausteine in dieser Version:** Nutrition-Bridge .27 → Strength-Bridge .28 → CSV-Bridge .29 → Sports-Bridge .30 → PWA. Keine Änderung an `client/src/main.js`.
