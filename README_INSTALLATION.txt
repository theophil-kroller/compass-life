Compass Life 0.5.76.1 – GitHub Actions CI Hotfix

Fix: GitHub Workflow Deploy Compass Web #150, commit bab85d9.
Die 3 Tests waren auf alte Versionsnummern und ein starres Textmuster fixiert.

ZIP entpacken und ausschließlich die 3 Dateien aus tests/ mit den vorhandenen GitHub-Dateien überschreiben.
Nicht das komplette Repository ersetzen. Keine Appdaten, Worker oder Migrationen ändern.

Anschließend einen neuen Commit erstellen. Der Deploy-Workflow startet automatisch.
Die eigentlichen Funktionen des Builds 0.5.76.1 bleiben unverändert.
