# Patch 0.5.91.9 installieren

**Voraussetzung:** GitHub-Repository `theophil-kroller/compass-life`, Branch `main`, Version `0.5.91.8`, zuletzt verifiziert gegen `1d372841c643be7cd88e9c7f5d2ac69f528537d5`.

1. Patch-ZIP entpacken und Dateien mit unveränderter Ordnerstruktur in das GitHub-Repository übernehmen; vorhandene Dateien überschreiben. Keine `node_modules` und keine Vault-Daten ersetzen.
2. GitHub Actions `Deploy Compass Web` auf Erfolg prüfen (erst dort ist der tatsächliche Vite-Produktionsbuild möglich).
3. Compass entsperren und Google Kalender aktualisieren. Unter `Heute` bzw. `Forecast` erscheinen bevorstehende Blöcke mit `(kro)` auch bei gemeinsamen Abkürzungen `(kro/abc)` sowie Business Model Workshop und Final Pitch.
4. Mit `Projekt anlegen` werden vier nächste Schritte als GTD-Projekt vorgeschlagen/übernommen; mit `Später` drei Tage aussetzen.

Das Radar liest nur den vorhandenen verschlüsselten Kalender. Es erzeugt weder neue Google-Termine noch Aufgaben ohne Klick. Sind keine passenden Kalenderdaten synchronisiert oder liegen relevante Termine noch außerhalb des Vorlaufzeitraums, bleibt das Radar ausgeblendet.
