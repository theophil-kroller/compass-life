# Compass 0.5.77.38 – GitHub-Upload

**Basis:** Repo `theophil-kroller/compass-life`, mindestens Version 0.5.77.37.1 vollständig im Repository (auch wenn die GitHub-Actions-Veröffentlichung zuletzt fehlgeschlagen ist).

1. Dieses ZIP entpacken.
2. Alle Pfade aus `client/` und `tests/` in **das Hauptverzeichnis des bestehenden GitHub-Repositorys** hochladen. Die Verzeichnisstruktur erhalten; gleichnamige Dateien **ersetzen**. Keine neuen Unterordner mit dem ZIP-Namen anlegen.
3. Unter GitHub → **Actions → Deploy Compass Web** kontrollieren: `npm run check` muss erfolgreich sein, anschließend `npm run build` und `deploy-pages`.
4. Sobald die Veröffentlichung erfolgreich ist: Compass mit Strg+Umschalt+R neu laden bzw. PWA schließen und erneut starten. Links muss `0.5.77.38` stehen. Bei unveränderter Versionsanzeige zuerst Actions prüfen, nicht den Tresor zurücksetzen.

## Was dieses Paket repariert

- Die sieben CI-Testfehler des vorherigen Uploads: `tests/compass-0577371.test.mjs` enthielt noch absolute Pfade des Entwicklungscontainers (`/mnt/data/...`). Diese sind durch relative Pfade zum Repository ersetzt. Die letzte Veröffentlichung war deshalb blockiert, obwohl die Quelldateien bereits hochgeladen waren.
- Ernährung: `client/src/nutrition-history-v577.js` ist **direkt** mit der schmalen Pille rechts unter den kcal versehen. Die bisherige 0.5.77.37.1-Vite-Transformation erkennt diese Änderung und verändert die Ansichtsdatei nicht doppelt.
- Trizeps Extension und andere Übungen: zuletzt eingetragene Gewichte/Wdh. werden auch sofort beim Öffnen eines schon ausgewählten Satzes vorgeschlagen, wenn dessen Felder noch leer sind.

## Muskelkarte

Neue dunkle Darstellung mit zwei größeren anatomischen SVGs vorne/hinten, 25 Regionen, Hover-/Tastaturbeschriftung, Wochenraster, kompakter KPIs-/Satz-Übersicht, Rangliste; Krafttraining und Radfahren werden getrennt erfasst. Der Satzeditor ist jetzt **unter** dem Dashboard, nicht darüber.

Die SVG-Grafik ist original für Compass auf Grundlage der bestehenden 25-Regionen-Datei gestaltet. Sie ist keine Kopie fremder App-Assets. Sätze bezeichnen dokumentierte Trainingseinheiten, keine gemessene Muskelaktivierung. Garmin-Radfahrten zeigen eine qualitative anatomische Beteiligung und werden nicht in Kraftsätze umgerechnet.

## Teststand

16 gezielte lokale Tests erfolgreich (die sieben bisher fehlschlagenden alten Tests eingeschlossen). Syntax-/Transformationsprüfung der bearbeiteten Strength-Datei bestanden. **Kein vollständiger lokaler Vite-Produktionsbuild**, da hier die komplette Repository-Installation nicht lokal verfügbar ist; dessen Ergebnis ist erst nach GitHub Actions verifiziert.
