# Compass Insights · UI Build 0.5.77.59

## Upload in GitHub

Ersetze im Repository **nur** `client/src/project-workspace-v57758.css` durch die gleichnamige Datei aus diesem ZIP (mit dem Pfad `client/src/`).

- Kein Löschen oder Ändern anderer Dateien.
- Kein `vite.config.js`-Update.
- Kein JavaScript-Bridge-Update.
- Kein Datenbank- oder Tresor-Eingriff.

Die Anwendung zeigt in ihrem Footer vorerst weiter **0.5.77.58.2**. 0.5.77.59 bezeichnet den Styling-Build; die angezeigte Client-Version wird bewusst nicht nur für CSS angefasst, damit CI nicht erneut wegen fragiler Versionsanker scheitert.

## Enthalten

- Zusammenhängende, kompakte Haupt-/Untertab-Navigation innerhalb von Insights.
- Einheitliche Abstände, Schriftgrößen, Oberflächen, Radien und Kartenlogik für Kennzahlen, Diagramme, Ernährungs-/Gesundheitsberichte und Intelligence-Cockpit.
- Touch-freundliche mobile Tabs ohne ausgeblendete Hauptnavigation.
- Bestehende Charts, Datenhinweise und Interaktionen bleiben vollständig erhalten.

## Teststatus

Geprüft mit `tinycss2` auf Parsefehler und ungewollte Ausblendregeln. Die Datei ist eine reine Erweiterung der bestehenden `.58` CSS und wird durch dieselbe bereits erfolgreiche Import-Kette geladen. Vite-Produktionsbuild nicht lokal ausführbar; bitte den GitHub-Actions-Status nach dem Upload kontrollieren.
