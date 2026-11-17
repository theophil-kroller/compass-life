# Compass Life 0.5.91.56 – Patch installieren

1. Nur auf das **vollständige Source-Release 0.5.91.55** anwenden. Bestehende Quelldateien sichern.
2. Das Patch-ZIP **im Root des GitHub-Repositories** entpacken und die Pfade beibehalten. Geänderte Dateien ersetzen; neue Test-/Release-Dateien hinzufügen. Sonstige Dateien nicht löschen.
3. In GitHub committen und den GitHub-Actions-Build abwarten.
4. In der App unter **Insights → Gesundheit & Körper → Krafttraining → V-Taper Entwicklung** kontrollieren: Smart-Tape-Ratio und identische Datengrundlage für kg/Woche und kg/30 Tage. Bei noch nicht 45 Tagen seit dem Trainingsbeginn wird die Vorausschau ausdrücklich zurückgehalten.

Der Patch ändert keine gespeicherten Tresor-, Fitdays-, Trainings- oder Ernährungsdaten. Das alternative Full-Source-ZIP enthält denselben Endstand, aber kein kompiliertes PWA-Paket.
