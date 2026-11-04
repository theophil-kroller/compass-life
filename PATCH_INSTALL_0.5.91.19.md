# Compass Life 0.5.91.19 – Patchinstallation

1. Ausgangsbasis: Repository `theophil-kroller/compass-life`, `main`, 0.5.91.18, Commit `c3bdb69695c1a82d52539390a59d542d75908e44`.
2. Patch-ZIP entpacken und die enthaltenen Dateipfade relativ zur Repository-Wurzel hochladen; gleichnamige Dateien ersetzen. Keine echten persönlichen Fitdays+-Daten sind im Archiv.
3. GitHub Actions: tatsächlichen Build/Deploy prüfen. Lokaler Vite-Build wegen fehlender Abhängigkeiten nicht möglich.
4. Anschließend Fitdays+ Smart Tape bei Bedarf über den Health Import Hub in Compass **bestätigt importieren**. Bereits vorhandene Messungen bleiben im Tresor. Der Chat-Upload allein bewirkt keinen Import in Compass.
5. Insights → Körper → „Weitere Kennzahlen“ → „Waist-to-hip ratio · WHR“ kontrollieren. Die Quelle, das Messdatum und die Referenzeinordnung werden nun angezeigt. Im Smart-Tape-Überblick bleibt die dynamische Anzeige erhalten.

Es gibt keine Datenmigration, keinen neuen Speicher und keine automatischen Änderungen an deinem Trainingsplan. Alternative: vollständiges Full-Source-ZIP.
