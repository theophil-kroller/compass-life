# Compass Life 0.5.77.58.2 – Einkauf & Projekt-Inspector

**Basis:** GitHub Actions #224 erfolgreich, Version 0.5.77.58 mit CI-Testkorrektur .58.1.

Ersetze in `theophil-kroller/compass-life` **nur diese drei Dateien** mit den Dateien aus dieser ZIP:

- `client/compass758-bridge.js`
- `tests/compass-057758-project-columns.test.mjs`
- `tests/compass-057757-full-transform-chain.test.mjs`

Andere Dateien (vor allem `client/vite.config.js`, `client/src/main.js`, CSS, Cloudflare Worker und verschlüsselte Daten) **nicht verändern**. Nach Upload GitHub Actions prüfen: `npm run check` sowie `npm run build` müssen erfolgreich sein. Das automatische Pages-Deployment darf erst danach als erfolgreich gelten.

## Inhalt

### Einkaufen
- **Einkaufsliste** ist der Standardtab und rendert ausschließlich die Liste mit den vorhandenen Checkboxes.
- Die aus Version .43 stammende Kassenbonanalyse, Monatsgrafik, GPT-Prompt, JSON-Eingabe, gespeicherten Bons und Importoptionen sind jetzt **ausschließlich** im Tab **Statistik & Rechnungsimport**.
- Die bisherigen Bon- und Finanzdaten werden nicht geändert; bestehende Aktionen funktionieren weiter.
- Beim Zurückwechseln zur Einkaufsliste wird der Bonbereich weder berechnet noch angezeigt.

### Projekte
- Ordner anklicken: Ordnernavigation bleibt links, Projekte erscheinen in der Mitte, Inspector geschlossen.
- Projekt anklicken: dessen Aufgaben nutzen die gesamte verfügbare mittlere Spalte; Inspector **standardmäßig geschlossen**.
- Der Inspector wird über das rechte Inspector-Symbol in der Projektüberschrift explizit geöffnet oder wieder geschlossen.
- Aufgabe auswählen öffnet weiterhin den Aufgaben-Inspector, weil dies eine ausdrücklich gewählte Bearbeitungsaktion ist.
- Beim Schließen des Inspectors bleibt die aktuelle Projekt- bzw. Aufgabenauswahl erhalten.
- Teure Projekteinstellungen werden nicht aufgebaut, solange der Projekt-Inspector geschlossen ist.

## Prüfungen
- **60 von 60** lokalen Tests der verfügbaren Bridge-/Navigationssuite bestanden; neu: Einkaufsliste ohne Kassenbon und Projekt-Inspector standardmäßig geschlossen.
- Die zwei Versionsprüfungen in den Testdateien erwarten korrekt `0.5.77.58.2`.
- Der echte vollständige Produktionsbuild mit allen Workspace-Dateien war in der lokalen Umgebung **nicht ausführbar**, weil die vollständige Repository-Arbeitskopie und npm-Abhängigkeiten nicht verfügbar sind. GitHub Actions #224 hat die vorherige .58-Codebasis erfolgreich gebaut; dieser Patch ersetzt nur die bestehende .58-Bridge und ihre zwei Tests.
