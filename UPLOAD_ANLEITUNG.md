# Compass · Nutrition Timing 2 – Cup & Plate Energy Timeline

**Basis:** aktueller GitHub-Stand `theophil-kroller/compass-life`, abgerufen am 25.10.2026 (main, Commit `7d058f9c0d1c759e64f61d15c1d83c267a669e7a`).

## Upload in GitHub

Die ZIP-Datei enthält genau drei Repository-Dateien mit korrekten Pfaden:

1. **Ersetzen**: `client/src/nutrition-timing-v57725.js`
2. **Neu hinzufügen**: `client/src/nutrition-cup-plate-v577593.css`
3. **Neu hinzufügen (Regressionstests)**: `tests/compass-nutrition-cup-plate.test.mjs`

**Nicht ändern:** `client/vite.config.js`, `client/src/main.js`, Vault, Worker, D1, Import-Dateien oder Datenbank.

## Änderung

- Inline-SVG-Tasse bei Getränken, Inline-SVG-Teller bei Nahrung.
- Klassifikation: bevorzugt vorhandene Lebensmittel-Gruppe `Getränke`, ergänzt um Getränke-Piktogramme und eng gefasste Namensmuster für eigene Lebensmittel.
- Vier kcal-Größenstufen je Eintrag: ≤120, 121–350, 351–700, >700 kcal.
- Unbekannte Kalorien: kleine, **gestrichelte** Symbolkontur statt fälschlichem Niedrigkalorien-Symbol.
- Zeitachse wird **nicht** verändert; bei eng benachbarten Ereignissen leicht vertikal versetzte Symbole auf derselben Tageszeile.
- Tageszeitfarben, Tooltip mit Originalinformationen, Klick-/Keyboard-Auswahl und Bearbeitungsschaltfläche bleiben erhalten.
- Neue kleine Legende zeigt Form, Kaloriengrößen und unbekannte Werte.
- Berechnungen für Fastenpausen, Kalorienwerte und Trendgrafiken unverändert; keine Änderung am Datenschema oder der Speicherung.

**Abgrenzung:** Die bestehende Nutrition-Timing-Grafik zeigt *Kalorienereignisse*, keine vollständige Getränkeliste. Bei 0 kcal klassifizierte Getränke bleiben daher wie zuvor außerhalb dieses Plots; sie dürfen die Fastenfenster nicht unterbrechen.

## Qualität

`node --test tests/compass-nutrition-cup-plate.test.mjs`: 8/8 bestanden.
`node --check client/src/nutrition-timing-v57725.js`: bestanden.
CSS mit tinycss2 geparst, keine Syntaxfehler.
Visueller SVG-Test in Chromium, Symbol anklickbar und per Tastatur fokussierbar.

**Wichtig:** Dieser Nutrition-Build ist bewusst unabhängig vom vorherigen UX-Build `.59.3`. Er behebt **nicht** dessen gemeldetes Deploymentproblem. Nach dem Upload bitte den GitHub-Actions-Produktionsbuild prüfen; lokaler vollständiger Vite-Build mit dem kompletten Repository war in dieser Umgebung nicht möglich.
