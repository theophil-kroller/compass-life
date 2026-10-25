# Compass Life 0.5.77.58.2 – CI-Hotfix nach GitHub Actions #225

Der Upload von .58.2 hatte GitHub Actions #225 bereits erreicht, aber die Transformationskette brach mit »no receipt statistics in shopping checklist: expected 1 source anchor, found 0« ab.

Ersetze im bestehenden Repository auf `main` exakt diese beiden Dateien aus der ZIP:

- `client/compass758-bridge.js`
- `tests/compass-057758-project-columns.test.mjs`

Das ist ein **Ersatz** für die gleichnamigen Dateien des fehlgeschlagenen Builds #225. **Alle anderen Dateien unverändert lassen** (besonders `client/vite.config.js`, Vault, Finanzdaten und CSS). Anschließend Commit/Upload ausführen. GitHub Actions kontrollieren.

## Grund

Die bestehende `.45`-Integration ruft die Kassenbon-UI mit `month:receiptMonth745` auf. Der `.58.2`-Patch erwartete noch die ursprünglichen `.43`-Argumente. Die neue Transformation erkennt und verschiebt den Aufruf aus der Shopping-Ansicht in den Statistik-/Import-Tab, ohne eine bestimmte Argumentliste zu verlangen.

## Qualitätssicherung

Das neue Testcase enthält ausdrücklich die **tatsächlich eingesetzte `.45`-Parameterliste**. Der vollständige echte Bridge-Chain-Test `tests/compass-057757-full-transform-chain.test.mjs` läuft anschließend im GitHub Actions Check und prüft die echte `client/src/main.js`.

Lokale Tests können einen erfolgreichen Github-Produktionsbuild nicht ersetzen; den CI-Status nicht als erfolgreich betrachten, bis er grün ist.
