# Compass Life 0.5.77.50 – Upload

Ausgangsbasis ist das erfolgreich deployte **0.5.77.49.1** (GitHub Actions **#211**). Dies ist ein ZIP mit **fertigen Dateien**, kein auszuführendes Skript.

## Ersetzen
- `client/vite.config.js`

## Neu hinzufügen
- `client/compass750-bridge.js`
- `client/src/insights-navigation-v57750.js`
- `client/src/insights-navigation-v57750.css`
- `tests/compass-057750-insights-nav.test.mjs`

## Optional
- `CHANGELOG_0.5.77.50.md`
- `UPLOAD_ANLEITUNG.md`

Die Ordnerstruktur im ZIP unverändert ins **Repository-Hauptverzeichnis** übertragen. Bestehende Dateien nicht löschen. Keine D1-Migration notwendig.

## Funktionstest nach GitHub Actions / Deploy
1. Actions: `npm run check` und `npm run build` müssen beide grün sein.
2. In der Insights-Seitenleiste gibt es genau fünf Kategorien statt der vielen einzelnen Einträge.
3. `Übersicht & Intelligence` öffnet das Cockpit; Untertabs `Wochenkompass` und `Fristen & Kapazität` öffnen die bisherigen Auswertungen.
4. `Gesundheit & Körper`: Körperanalyse, Krafttraining, Ernährung und Aktivitäten erreichbar; bisherige Daten sichtbar.
5. `Zeit & Produktivität`: Arbeitszeit **und** Zeitjournal separat unter derselben Themenkategorie erreichbar.
6. `Leben & Orte`: Karte und Traumwelt/Erholung erreichbar.
7. Handy: fünf erste Kategorien, eine waagerecht scrollbarere Zeile für Untertabs; keine überstehenden Felder.

**Hinweis:** Aktivitäten, Erholung und Fortschritt öffnen weiterhin ihre bisherigen eigenständigen Screens. Beim Zurückwechseln zu Insights lässt sich der passende Unterbereich wieder öffnen.
