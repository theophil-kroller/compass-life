# Compass 0.5.91.4 – Patch installieren

1. Grundlage ist `0.5.91.3` mit GitHub `main` Commit `b5347d1ab2a6611401f8cb44c9a88700a0df55be`.
2. **Patch-ZIP** entpacken und alle Pfade in das Repository-Stammverzeichnis kopieren, vorhandene Dateien ersetzen. Neue Dateien werden zusätzlich angelegt.
3. Bei GitHub über **Add file → Upload files** dieselben relativen Pfade beibehalten. Alternativ lokales Git nutzen.
4. CI-Deploy erst nach erfolgreichem GitHub-Actions-Web-Build übernehmen.
5. Für vollständig neuen Repo-Stand statt Patch das **FULL_SOURCE**-ZIP verwenden.

Keine Datenmigration. Der aktuelle Stand der verschlüsselten persönlichen Finanzdaten wird nicht im Paket enthalten sein.
