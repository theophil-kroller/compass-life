# Compass 0.5.45.1 – Verfügbarkeitsblöcke in Google Calendar

Bugfix auf Basis von 0.5.45: Ein Kalendereintrag, dessen Titel exakt `Work` lautet (Groß-/Kleinschreibung ignoriert), zählt als potenziell nutzbares Arbeitsfenster und **nicht** als blockierender Termin. Meetings und sonstige tatsächliche Termine innerhalb dieses Zeitraums bleiben blockiert, inklusive des eingestellten Puffers.

Der Name ist unter **Planen → Kalender & Forecast → Arbeitsfenster anpassen → Verfügbarkeitsblöcke (exakte Titel)** anpassbar, z. B. `Work, Deep Work, Bürozeit`. Ein leerer Eintrag deaktiviert diese Sonderbehandlung. `Workshop`, `Work – Meeting` und andere nur teilweise passende Titel bleiben normale, belegte Termine. Andere ausgeblendete oder ganztägige belegte Termine blockieren weiterhin; abgesagte oder transparente Kalendertermine blockieren nicht.

Die Tagesverfügbarkeit bleibt auf die vom Nutzer eingestellten Arbeitszeiten (standardmäßig 09–17 Uhr) beschränkt. `Work` ist *kein* zusätzlicher Kalendertermin, keine automatische Buchung und überschreibt keine anderen belegten Zeiten. Compass verwendet weiterhin nur den primären verbundenen Google-Kalender.

**Einspielen:** Für eine bestehende Version 0.5.45 das PATCH-ZIP mit Verzeichnisstruktur über den Repo-Stamm entpacken (geänderte Dateien ersetzen). Anschließend normale GitHub-Pages-Buildpipeline ausführen. Keine D1-Migration, keine Worker-Änderung notwendig.

**Prüfung:** 459/459 automatisierte Tests, Worker- und Client-JavaScript-Syntax erfolgreich. Produktionsbuild konnte in dieser Umgebung nicht ausgeführt werden (`vite: not found`); Live-Browserabnahme nach Deployment erforderlich.
