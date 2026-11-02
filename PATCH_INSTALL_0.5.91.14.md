# Patchinstallation Compass 0.5.91.14

**Erforderliche Basis:** Compass 0.5.91.13, GitHub `main` @ `c12af22adadd6657d7994c4111052fb282c35302`.

1. Vorhandene Repo-Dateien unverändert lassen, Patch-ZIP im Root entpacken und Überschreiben der aufgeführten Dateien erlauben; **keine** GitHub- oder Vault-Daten löschen.
2. Alternativ Full-Source-ZIP als vollständigen Quellstand übernehmen. Nicht beide Pakete nacheinander anwenden.
3. GitHub Actions abwarten und den Build-Status prüfen. Vor Ort waren Worker- und Quellcode-Tests möglich, Vite mangels npm-Netzwerkzugang jedoch **nicht**.
4. Nach dem Deploy im Coach prüfen: bereits bestätigte Einheiten → automatisch `Trainingsblock 1`, korrekte Tage/Sätze. Ohne bestätigte Einheiten erscheint kein Block. Datum/Pause/Entlastung sind in den Details editierbar.

Das alte localStorage-Datum wird nur als Migrationshinweis gelesen, nicht mehr als maßgeblicher Speicher verwendet. Die Bestätigungen und Gewichte bleiben im Originaljournal.
