# Compass 0.5.77.31 · GitHub-Upload

**Voraussetzung:** Version 0.5.77.30 mit funktionierenden Nutrition-3- und Strength-Bridges. Diese Version ist ein schlankes Folge-Build, kein Vollquellcode.

1. ZIP entpacken und Dateien in die **gleichen Repository-Unterordner** hochladen. `client/vite.config.js` ersetzen; neue `.js`- und `.css`-Dateien ergänzen.
2. Dateien aus vorigen Builds **nicht löschen** (`nutrition3-bridge.js`, `strength728-bridge.js`, `strength729-bridge.js`, `strength730-bridge.js` bleiben bestehen).
3. Nach dem GitHub-Pages-Deployment Compass/PWA neu laden. Links unten soll **0.5.77.31** stehen.
4. **Insights → Ernährung → 🥑 Fettqualität** wählen. Ab jetzt erscheinen auch lokale, früher protokollierte Ernährungseinträge, sofern die Fettwerte ableitbar sind.
5. Eintrag „Hofer gesalzene Erdnüsse“ verwendet für **neue** Portionen standardmäßig **20 g/Handvoll**. Bei alten ausdrücklich erfassten 30 g bleibt 30 g; ggf. manuell editieren.
6. Referenzen sind für Markenprodukte **Schätzungen anhand generischer Lebensmitteltabellen**, keine verifizierten Laborwerte. Produktdatenlücken sind explizit ausgewiesen.

## Tests

`node --test tests/gtd-057731-fat-quality.test.mjs`

Es wurde kein vollständiger Vite-Produktionsbuild ausgeführt: das ganze GitHub-Repository und sämtliche npm-Pakete waren in der lokalen Umgebung nicht verfügbar. Die neuen Dateien sind syntaktisch geprüft und Modul-/Bridge-Tests bestanden.
