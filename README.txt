COMPASS 0.5.77.59.29 – HOTFIX GitHub Actions #261

Nur 1 Datei, bereits fertig, kein Skript erforderlich:
  tests/compass-057757-full-transform-chain.test.mjs

Installation: ZIP entpacken, die Datei in GitHub unter tests/ hochladen und die bestehende Version ersetzen.
Ausgangslage: Commit 1ce9cc24889572b330b765128b1ab55a1f4e9a0d (Workflow #261).
In #261 bestanden 1396/1397 Tests; Test #197 scheiterte allein an seiner alten textuellen Invariante.
Jetzt prueft der Test die historische .58-Kette weiterhin (inkl. exakt vorausgesetzter Assertion),
anschliessend beide .59-Erweiterungen in korrekter Reihenfolge und deren reale Transformationen.
Keine Applikationsdateien, keine Vault-Daten und keine Integrationsmodule werden geaendert.

Lokal geprueft:
- node --check: bestanden
- Legacy-Regressionstest-Ausdruck: bestanden
- Vite-Plugin-Import-Reihenfolge mit gesichertem #260-Konfigurationsstand: bestanden
- Erweiterungsinvarianten: bestanden

Ein vollstaendiger CI-Durchlauf oder produktiver Vite-Build ist in dieser Laufzeit
nicht moeglich (der private GitHub-Code kann nicht vollstaendig in den Container
geklont werden). Der neue GitHub-Workflow muss dies bestaetigen.
