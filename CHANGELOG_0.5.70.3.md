# Compass 0.5.70.3 – Journal-Integrität, Feeling Sync & Homebase

## Korrigiert

- **Gefühls-Check-ins werden jetzt in die bestehende Ende-zu-Ende-verschlüsselte Journal-Synchronisierung einbezogen.** Bisher fehlte `feelingCheckins` im Journal-Snapshot und in der Mutations-Erkennung. Das erklärt, warum Gefühlseinträge auf dem Mobiltelefon trotz grüner Journal-Meldung nicht auf dem Desktop erscheinen konnten.
- Gefühls-Check-ins werden beim Geräteabgleich **anhand unveränderlicher IDs zusammengeführt**; ältere Einträge bleiben erhalten. Nachträgliche Bearbeitungen werden anhand `editedAt` berücksichtigt. Keine rückwirkende Datenmigration oder Änderung bereits erfasster Check-ins.
- **Nach einem Journal-Upload liest Compass die verschlüsselte Cloud-Kopie erneut** und prüft, ob die zuletzt zusammengeführten Daten dort vorliegen. Ein erfolgreiches HTTP-POST allein löst keine grüne Erfolgsmeldung mehr aus.
- Im Arbeitszeit-Diagnosefeld wird **das angemeldete Compass-Konto** angezeigt, damit unterschiedliche Konten auf Handy und Desktop erkannt werden können. Das Feld bleibt in der lokalen, entsperrten Anwendung.

## Neu

- **Homebase (Ort + Land)** in `Menschen → Beziehungslandkarte → Persönliches & Gemeinsamkeiten`. Beide Angaben sind freiwillig und werden in den vorhandenen, lokal verschlüsselten Personendaten gespeichert. Die Homebase wird nicht mit Nähe oder Kontaktqualität gleichgesetzt.

## Hinweise und Grenzen

- **Beide Geräte müssen auf 0.5.70.3 aktualisiert sein**. Ältere Clients verschicken keine Gefühle im Journal-Snapshot und können bei eigenem Upload sonst erneut eine ältere Teilmenge der Daten publizieren.
- Dieser Patch verbessert die Journal-Übertragung und die Fehlererkennung. Die konkrete Live-Ursache der unterschiedlichen Cloud-Versionen 16/17 lässt sich erst mit zwei aktualisierten Geräten und identischem Compass-Konto prüfen.
- Ein Check-in bei gesperrtem Tresor wird weiterhin zunächst **nur lokal verschlüsselt vorgemerkt**. Die Übertragung beginnt erst, wenn der Tresor entsperrt und der private Geräteabgleich aktiv ist.
- Keine neue D1-Migration und kein Worker-Update erforderlich, sofern der Journal-fähige Worker von 0.5.69.2 bereits aktiv ist.
- Die Homebase nutzt die bestehende Speicherung für Personen; eine gesonderte automatische Synchronisierung aller Personenprofile ist **nicht Bestandteil dieses Patches**.
- Tests: 728/728 (inklusive 6 neuer Tests); Worker-Syntaxprüfung bestanden. Vite-Produktionsbuild und Live-Übertragung zwischen Geräten wurden nicht ausgeführt.
