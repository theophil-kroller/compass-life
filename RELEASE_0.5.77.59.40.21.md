# Compass Web 0.5.77.59.40.21 — Ars Vivendi Annual Print & Chart Fix

Basis: .40.20, keine D1-Migration, keine Änderungen an Vault oder Daten.

- Arbeitszeitdiagramm per eindeutiger Chart-Kennung statt erstem SVG-Icon selektieren.
- Druckfähige statische Muskelansichten statt asynchronem Anatomie-Platzhalter; zugehörige Trainings-Tagespunkte und Muskelgruppen-Diagramm getrennt.
- Garmin-Stress für den Report zu tatsächlichen beobachteten Tagesmittelwerten aggregieren. Rohmessungsanzahl und Aggregationsmethode werden ausdrücklich angegeben; dies verhindert SVGs mit teils über 100.000 Einzelelementen und hängende PDF-Druckdialoge.
- Offline-HTML als alternative lokale Speicherung, falls der systemseitige PDF-Druckdialog blockiert.
- Neue Regressionstests für Druckgrafiken, fehlende Messdaten und Versionsintegration.

**Offen:** Der PDF-Druckdialog ist browser-/betriebssystemabhängig und kann nur auf dem Endgerät abschließend abgenommen werden. Ein synthetischer Chromium-PDF-Test ersetzt den Test auf dem echten Gerät nicht.
